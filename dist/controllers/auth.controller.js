"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.otp = exports.login = void 0;
const otp_service_1 = require("../services/otp.service");
const unifi_service_1 = require("../services/unifi.service");
const post_model_1 = __importDefault(require("../models/post.model"));
const login = async (req, res) => {
    try {
        const { phoneNum, macAddress, ap, ssid } = req.body;
        const clientIp = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
        await (0, otp_service_1.sendOTP)(phoneNum, clientIp, macAddress, ap, ssid);
        res.status(200).json({ message: 'OTP sent successfully!' });
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ message: 'Error sending OTP' });
    }
};
exports.login = login;
const otp = async (req, res) => {
    try {
        const { phoneNum, otp } = req.body;
        const { unifi } = req;
        const posts = await post_model_1.default.find({ phoneNum: phoneNum }, 'macAddress ap ssid');
        const timeofuse = process.env.TIME_OF_USE || null;
        const up = process.env.UP_SPEED || null;
        const down = process.env.DOWN_SPEED || null;
        for (const post of posts) {
            await (0, unifi_service_1.authorize_guest)(unifi, post.macAddress, timeofuse, up, down, null, post.ap);
        }
        const isValid = await (0, otp_service_1.verifyOTP)(phoneNum, otp);
        if (isValid) {
            res.status(200).json({ message: 'OTP verified successfully!' });
        }
        else {
            res.status(400).json({ message: 'Invalid OTP' });
        }
    }
    catch (err) {
        console.error('Error verifying OTP:', err.message);
        res.status(500).json({ message: 'Failed to verify OTP' });
    }
};
exports.otp = otp;

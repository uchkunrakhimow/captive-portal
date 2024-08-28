"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.otp = exports.login = exports.getExample = void 0;
const otpService_1 = require("../services/otpService");
const client_1 = require("@prisma/client");
const unifi_1 = require("../utils/unifi");
const prisma = new client_1.PrismaClient();
const getExample = (req, res) => {
    res.status(200).json({ message: 'Hello world!' });
};
exports.getExample = getExample;
const login = async (req, res) => {
    try {
        const { phoneNum, macAddress, ap, ssid } = req.body;
        const clientIp = req.headers['x-forwarded-for'] || req.ip;
        await (0, otpService_1.sendOTP)(phoneNum, clientIp, macAddress, ap, ssid);
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
        //@ts-ignore
        const { unifi } = req;
        const posts = await prisma.post.findMany({
            where: { phoneNum: phoneNum },
            select: {
                macAddress: true,
                ap: true,
                ssid: true,
            },
        });
        const timeofuse = process.env.TIME_OF_USE || null;
        const up = process.env.UP_SPEED || null;
        const down = process.env.DOWN_SPEED || null;
        for (const post of posts) {
            await (0, unifi_1.authorize_guest)(unifi, post.macAddress, timeofuse, up, down, null, post.ap);
        }
        const isValid = await (0, otpService_1.verifyOTP)(phoneNum, otp);
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

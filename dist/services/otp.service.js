"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyOTP = exports.sendOTP = void 0;
const axios_1 = __importDefault(require("axios"));
const uuid_1 = require("uuid");
const config_1 = require("../config");
const numGenerator_1 = require("../helpers/numGenerator");
const post_model_1 = __importDefault(require("../models/post.model"));
const sendOTP = async (phoneNumber, clientIp, macAddress, ap, ssid) => {
    const otp = (0, numGenerator_1.generateNum)(config_1.config.otp.length);
    try {
        const now = new Date();
        const gtmPlusFive = new Date(now.getTime() + 5 * 60 * 60 * 1000); // GTM +5:00
        await post_model_1.default.create({
            id: (0, uuid_1.v4)(),
            createdAt: gtmPlusFive,
            updatedAt: gtmPlusFive,
            phoneNum: phoneNumber,
            clientIp,
            otp,
            macAddress,
            ap,
            ssid,
        });
    }
    catch (dbError) {
        console.error('Database error:', dbError);
        throw new Error('Failed to save OTP to the database');
    }
    const smsPayload = {
        header: {
            login: config_1.config.sms.credentials.login,
            pwd: config_1.config.sms.credentials.passwd,
            CgPN: config_1.config.sms.cgpn,
        },
        body: {
            message_id_in: (0, uuid_1.v4)(),
            CdPN: phoneNumber,
            text: otp + config_1.config.messages.uz + otp,
        },
    };
    try {
        await axios_1.default
            .post(config_1.config.sms.uri, smsPayload, {
            headers: {
                'Content-Type': 'application/json',
            },
        })
            .then((res) => {
            console.log('SMS sent successfully:', res.data);
        })
            .catch(err => {
            console.log(err);
        });
    }
    catch (smsError) {
        throw new Error(smsError);
    }
};
exports.sendOTP = sendOTP;
const verifyOTP = async (phoneNumber, otp) => {
    try {
        const record = await post_model_1.default.findOne({
            phoneNum: phoneNumber,
            otp: otp,
        });
        return !!record;
    }
    catch (dbError) {
        console.error('Database error:', dbError.message);
        throw new Error('Failed to verify OTP');
    }
};
exports.verifyOTP = verifyOTP;

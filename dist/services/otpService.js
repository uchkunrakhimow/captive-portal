"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyOTP = exports.sendOTP = void 0;
const client_1 = require("@prisma/client");
const node_path_1 = __importDefault(require("node:path"));
const node_fs_1 = require("node:fs");
const uuid_1 = require("uuid");
const config_1 = require("../config");
const numGenerator_1 = require("../utils/numGenerator");
const prisma = new client_1.PrismaClient();
const sendOTP = async (phoneNumber, clientIp, macAddress, ap, ssid) => {
    const otp = (0, numGenerator_1.generateNum)(config_1.config.otp.length);
    try {
        await prisma.post.create({
            data: {
                phoneNum: phoneNumber,
                clientIp,
                otp,
                macAddress,
                ap,
                ssid,
            },
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
        // await axios
        //   .post(config.sms.uri, smsPayload, {
        //     headers: {
        //       'Content-Type': 'application/json',
        //     },
        //   })
        //   .then((res: any) => {
        //     console.log('SMS sent successfully:', res.data);
        //   })
        //   .catch(err => {
        //     console.log(err);
        //   });
        saveOTPLocally(phoneNumber, clientIp, otp);
    }
    catch (smsError) {
        throw new Error(smsError);
    }
};
exports.sendOTP = sendOTP;
const saveOTPLocally = (phoneNumber, clientIp, otp) => {
    const timeStamp = new Date().toISOString();
    const csvLine = `${phoneNumber},${clientIp},${otp},${timeStamp}\n`;
    const storagePath = node_path_1.default.resolve(__dirname, '../storage');
    try {
        if (!(0, node_fs_1.existsSync)(storagePath)) {
            (0, node_fs_1.mkdirSync)(storagePath, { recursive: true }); // Create the directory if it doesn't exist
        }
        const filePath = node_path_1.default.join(storagePath, `${clientIp.replace(/:/g, '-')}.csv`); // Replace ':' with '-' in clientIp for valid file name
        (0, node_fs_1.appendFileSync)(filePath, csvLine);
    }
    catch (fileError) {
        console.error('Error appending to file:', fileError);
    }
};
const verifyOTP = async (phoneNumber, otp) => {
    try {
        const record = await prisma.post.findFirst({
            where: {
                phoneNum: phoneNumber,
                otp,
            },
        });
        return record !== null;
    }
    catch (dbError) {
        console.error('Database error:', dbError);
        throw new Error('Failed to verify OTP');
    }
};
exports.verifyOTP = verifyOTP;

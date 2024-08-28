import axios from 'axios';
import { PrismaClient } from '@prisma/client';
import path from 'node:path';
import { appendFileSync, existsSync, mkdirSync } from 'node:fs';
import { v4 } from 'uuid';

import { config } from '../config';
import { generateNum } from '../utils/numGenerator';

const prisma = new PrismaClient();

export const sendOTP = async (
  phoneNumber: string,
  clientIp: string,
  macAddress: string,
  ap: string,
  ssid: string,
): Promise<void> => {
  const otp = generateNum(config.otp.length);

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
  } catch (dbError) {
    console.error('Database error:', dbError);
    throw new Error('Failed to save OTP to the database');
  }

  const smsPayload = {
    header: {
      login: config.sms.credentials.login,
      pwd: config.sms.credentials.passwd,
      CgPN: config.sms.cgpn,
    },
    body: {
      message_id_in: v4(),
      CdPN: phoneNumber,
      text: otp + config.messages.uz + otp,
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
  } catch (smsError: any) {
    throw new Error(smsError);
  }
};

const saveOTPLocally = (
  phoneNumber: string,
  clientIp: string,
  otp: string,
): void => {
  const timeStamp = new Date().toISOString();
  const csvLine = `${phoneNumber},${clientIp},${otp},${timeStamp}\n`;
  const storagePath = path.resolve(__dirname, '../storage');

  try {
    if (!existsSync(storagePath)) {
      mkdirSync(storagePath, { recursive: true }); // Create the directory if it doesn't exist
    }

    const filePath = path.join(
      storagePath,
      `${clientIp.replace(/:/g, '-')}.csv`,
    ); // Replace ':' with '-' in clientIp for valid file name
    appendFileSync(filePath, csvLine);
  } catch (fileError) {
    console.error('Error appending to file:', fileError);
  }
};

export const verifyOTP = async (
  phoneNumber: string,
  otp: string,
): Promise<boolean> => {
  try {
    const record = await prisma.post.findFirst({
      where: {
        phoneNum: phoneNumber,
        otp,
      },
    });

    return record !== null;
  } catch (dbError) {
    console.error('Database error:', dbError);
    throw new Error('Failed to verify OTP');
  }
};

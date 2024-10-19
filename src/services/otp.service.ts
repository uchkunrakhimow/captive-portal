import axios from 'axios';
import { v4 } from 'uuid';
import { config } from '../config';
import { generateNum } from '../helpers/numGenerator';
import PostModel from '../models/post.model';

export const sendOTP = async (
  phoneNumber: string,
  clientIp: string,
  macAddress: string,
  ap: string,
  ssid: string,
): Promise<void> => {
  const otp = generateNum(config.otp.length);

  try {
    await PostModel.create({
      phoneNum: phoneNumber,
      clientIp,
      otp,
      macAddress,
      ap,
      ssid,
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
    await axios
      .post(config.sms.uri, smsPayload, {
        headers: {
          'Content-Type': 'application/json',
        },
      })
      .then((res: any) => {
        console.log('SMS sent successfully:', res.data);
      })
      .catch(err => {
        console.log(err);
      });
  } catch (smsError: any) {
    throw new Error(smsError);
  }
};

export const verifyOTP = async (
  phoneNumber: string,
  otp: string,
): Promise<boolean> => {
  try {
    const record = await PostModel.findOne({
      phoneNum: phoneNumber,
      otp: otp,
    });

    return !!record;
  } catch (dbError: any) {
    console.error('Database error:', dbError.message);
    throw new Error('Failed to verify OTP');
  }
};

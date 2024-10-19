import { Request, Response } from 'express';
import { sendOTP, verifyOTP } from '../services/otp.service';
import { authorize_guest } from '../services/unifi.service';
import PostModel from '../models/post.model';

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { phoneNum, macAddress, ap, ssid } = req.body;
    const clientIp: any =
      req.headers['x-forwarded-for'] || req.socket.remoteAddress;

    await sendOTP(phoneNum, clientIp, macAddress, ap, ssid);

    res.status(200).json({ message: 'OTP sent successfully!' });
  } catch (err: any) {
    console.log(err);
    res.status(500).json({ message: 'Error sending OTP' });
  }
};

export const otp = async (req: any, res: Response): Promise<void> => {
  try {
    const { phoneNum, otp } = req.body;
    const { unifi } = req;

    const posts = await PostModel.find(
      { phoneNum: phoneNum },
      'macAddress ap ssid',
    );

    const timeofuse: any = process.env.TIME_OF_USE! || null;
    const up: any = process.env.UP_SPEED! || null;
    const down: any = process.env.DOWN_SPEED! || null;

    for (const post of posts) {
      await authorize_guest(
        unifi,
        post.macAddress,
        timeofuse,
        up,
        down,
        null,
        post.ap,
      );
    }

    const isValid = await verifyOTP(phoneNum, otp);

    console.log(isValid);

    if (isValid) {
      res.status(200).json({ message: 'OTP verified successfully!' });
    } else {
      res.status(400).json({ message: 'Invalid OTP' });
    }
  } catch (err: any) {
    console.error('Error verifying OTP:', err.message);
    res.status(500).json({ message: 'Failed to verify OTP' });
  }
};

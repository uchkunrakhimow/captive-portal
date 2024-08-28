import { Request, Response } from 'express';
import { sendOTP, verifyOTP } from '../services/otpService';
import { PrismaClient } from '@prisma/client';
import { authorize_guest } from '../utils/unifi';

const prisma = new PrismaClient();

export const getExample = (req: Request, res: Response): void => {
  res.status(200).json({ message: 'Hello world!' });
};

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { phoneNum, macAddress, ap, ssid } = req.body;
    const clientIp: any = req.headers['x-forwarded-for'] || req.ip;

    await sendOTP(phoneNum, clientIp, macAddress, ap, ssid);

    res.status(200).json({ message: 'OTP sent successfully!' });
  } catch (err: any) {
    console.log(err);
    res.status(500).json({ message: 'Error sending OTP' });
  }
};

export const otp = async (req: Request, res: Response): Promise<void> => {
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

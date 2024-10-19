import { Request, Response } from 'express';
import { sendOTP } from '../services/otp.service';
import { authorize_guest } from '../services/unifi.service';
import PostModel from '../models/post.model';

const EXPIRATION_TIME_MS = 5 * 60 * 1000;
const timeofuse: any = process.env.TIME_OF_USE! || null;
const up: any = process.env.UP_SPEED! || null;
const down: any = process.env.DOWN_SPEED! || null;

const hasOtpExpired = (createdAt: Date): boolean => {
  const now = new Date().getTime();
  const otpCreationTime = new Date(createdAt).getTime();
  return now - otpCreationTime > EXPIRATION_TIME_MS;
};

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

// Main OTP handler function
export const otp = async (req: any, res: Response): Promise<void> => {
  try {
    const { phoneNum, otp } = req.body;
    const { unifi } = req;

    if (!phoneNum || !otp) {
      res.status(400).json({ message: 'Phone number and OTP are required.' });
    }

    // Fetch posts by phone number
    const posts = await PostModel.find({ phoneNum }, 'macAddress ap ssid');
    if (!posts.length) {
      res
        .status(404)
        .json({ message: 'No posts found for the given phone number.' });
    }

    // Fetch environment variables with fallbacks

    // Authorize all guests
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

    // Verify the OTP
    const record: any = await PostModel.findOne({
      phoneNum,
      otp,
      isUsed: false,
    });

    if (record) {
      // Mark OTP as used
      record.isUsed = true;
      await record.save();

      // OTP verification successful
      res.status(200).json({ message: 'OTP verified successfully!' });
    } else {
      res.status(400).json({ message: 'OTP has expired.' });
    }
  } catch (err: any) {
    console.error('Error verifying OTP:', err.message);
    res
      .status(500)
      .json({ message: 'Failed to verify OTP due to server error.' });
  }
};

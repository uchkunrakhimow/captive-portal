import { Document } from 'mongoose';

export interface Post extends Document {
  id: number;
  phoneNum: string;
  clientIp?: string;
  otp?: string;
  macAddress?: string;
  ap?: string;
  ssid?: string;
  createdAt?: Date;
  isUsed?: Boolean;
}

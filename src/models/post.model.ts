import mongoose, { Schema, Model } from 'mongoose';
import { Post } from '../types/post';

const PostSchema: Schema<Post> = new Schema<Post>(
  {
    phoneNum: { type: String, required: true },
    clientIp: { type: String },
    otp: { type: String },
    macAddress: { type: String },
    ap: { type: String },
    ssid: { type: String },
  },
  { timestamps: true, versionKey: false, collection: 'post' },
);

const PostModel: Model<Post> = mongoose.model<Post>('post', PostSchema);

export default PostModel;

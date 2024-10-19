import dotenv from 'dotenv';
dotenv.config();

export const config = {
  otp: {
    length: 6,
  },
  messageUniqueId: {
    length: 10,
  },
  sms: {
    uri: process.env.SMS_API_URI || 'http://sms.etc.uz:8084/single-sms',
    credentials: {
      login: process.env.SMS_API_LOGIN || '',
      passwd: process.env.SMS_API_PASSWD || '',
    },
    cgpn: Number(process.env.SMS_API_CGPN) || 0,
  },
  messages: {
    uz: " YAPONA MAMA brendi restoranlarining wi-fi tarmog'iga avtorizatsiya uchun tasdiqlash kodi: ",
    ru: 'Код подтверждения для авторизации Wi-Fi сети ресторанного бренда YAPONA MAMA: ',
  },
};

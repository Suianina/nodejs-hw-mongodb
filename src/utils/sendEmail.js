import nodemailer from 'nodemailer';
import { SMTP } from '../constants/index.js';

const transporter = nodemailer.createTransport({
  host: SMTP.HOST,
  port: Number(SMTP.PORT),
  secure: Number(SMTP.PORT) === 465,
  auth: {
    user: SMTP.USER,
    pass: SMTP.PASSWORD,
  },
});

export const sendEmail = async (options) => {
  return await transporter.sendMail(options);
};

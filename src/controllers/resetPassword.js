import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import createHttpError from 'http-errors';
import nodemailer from 'nodemailer';
import { env } from '../utils/env.js';
import { User } from '../db/models/user.js';
import { Session } from '../db/models/session.js';

const JWT_SECRET = env('JWT_SECRET');
const APP_DOMAIN = env('APP_DOMAIN');

const transporter = nodemailer.createTransport({
  host: env('SMTP_HOST'),
  port: env('SMTP_PORT'),
  auth: {
    user: env('SMTP_USER'),
    pass: env('SMTP_PASSWORD'),
  },
});

export const sendResetEmail = async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });

  if (!user) {
    throw createHttpError(404, 'User not found!');
  }

  const token = jwt.sign({ email }, JWT_SECRET, { expiresIn: '5m' });
  const resetLink = `${APP_DOMAIN}/reset-password?token=${token}`;

  try {
    await transporter.sendMail({
      from: env('SMTP_FROM'),
      to: email,
      subject: 'Reset your password',
      html: `<p>Click <a href="${resetLink}">here</a> to reset your password. This link will expire in 5 minutes.</p>`,
    });

    res.status(200).json({
      status: 200,
      message: 'Reset password email has been successfully sent.',
      data: {},
    });
  } catch (error) {
    throw createHttpError(
      500,
      'Failed to send the email, please try again later.',
    );
  }
};

export const resetPassword = async (req, res) => {
  const { token, password } = req.body;

  let payload;
  try {
    payload = jwt.verify(token, JWT_SECRET);
  } catch {
    throw createHttpError(401, 'Token is expired or invalid.');
  }

  const user = await User.findOne({ email: payload.email });
  if (!user) throw createHttpError(404, 'User not found!');

  const hashedPassword = await bcrypt.hash(password, 12);
  user.password = hashedPassword;
  await user.save();

  await Session.deleteMany({ userId: user._id });

  res.status(200).json({
    status: 200,
    message: 'Password has been successfully reset.',
    data: {},
  });
};

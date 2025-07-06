import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import createHttpError from 'http-errors';
import nodemailer from 'nodemailer';
import { env } from '../utils/env.js';
import { User } from '../db/models/user.js';
import { Session } from '../db/models/session.js';
import fs from 'fs/promises';
import path from 'path';
import handlebars from 'handlebars';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const JWT_SECRET = env('JWT_SECRET');
const APP_DOMAIN = env('APP_DOMAIN');
const TEMPLATE_PATH = path.join(
  __dirname,
  '..',
  'templates',
  'reset-password-email.html',
);

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: env('SMTP_USER'),
    pass: env('SMTP_PASSWORD'),
  },
});

export const sendResetEmail = async (req, res, next) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) throw createHttpError(404, 'User not found!');

    const token = jwt.sign({ email }, JWT_SECRET, { expiresIn: '5m' });
    const resetLink = `${APP_DOMAIN}/reset-password?token=${token}`;

    const html = await fs.readFile(TEMPLATE_PATH, 'utf-8');
    const template = handlebars.compile(html);

    await transporter.sendMail({
      from: env('SMTP_FROM'),
      to: email,
      subject: 'Password Reset Request',
      html: template({ name: user.name || 'User', resetLink }),
      text: `Reset link: ${resetLink}`,
    });

    res.status(200).json({
      status: 200,
      message: 'Reset email sent successfully',
      data: {},
    });
  } catch (error) {
    next(
      createHttpError(500, 'Failed to send the email, please try again later.'),
    );
  }
};

export const resetPassword = async (req, res, next) => {
  const { token, password } = req.body;
  try {
    const { email } = jwt.verify(token, JWT_SECRET);
    const user = await User.findOne({ email });
    if (!user) throw createHttpError(404, 'User not found!');

    user.password = await bcrypt.hash(password, 12);
    await user.save();
    await Session.deleteMany({ userId: user._id });

    res.status(200).json({
      status: 200,
      message: 'Password reset successfully',
      data: {},
    });
  } catch (error) {
    if (
      error.name === 'TokenExpiredError' ||
      error.name === 'JsonWebTokenError'
    ) {
      return next(createHttpError(401, 'Token is expired or invalid.'));
    }
    next(error);
  }
};

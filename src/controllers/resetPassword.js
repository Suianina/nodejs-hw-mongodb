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

// Константи
const JWT_SECRET = env('JWT_SECRET');
const APP_DOMAIN = env('APP_DOMAIN');

const TEMPLATE_PATH = path.join(
  __dirname,
  '..',
  'templates',
  'reset-password-email.html',
);

const transporter = nodemailer.createTransport({
  host: env('SMTP_HOST'),
  port: Number(env('SMTP_PORT')),
  secure: Number(env('SMTP_PORT')) === 465,
  auth: {
    user: env('SMTP_USER'),
    pass: env('SMTP_PASSWORD'),
  },
  tls: {
    rejectUnauthorized: false,
  },
});

transporter.verify((error) => {
  if (error) {
    console.error('SMTP Connection Error:', error);
  } else {
    console.log('✅ SMTP Connection Verified');
  }
});

export const sendResetEmail = async (req, res) => {
  const { email } = req.body;

  try {
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      throw createHttpError(400, 'Invalid email format');
    }

    const user = await User.findOne({ email });
    if (!user) {
      throw createHttpError(404, 'User not found!');
    }

    const token = jwt.sign({ email }, JWT_SECRET, { expiresIn: '5m' });
    const resetLink = `${APP_DOMAIN}/reset-password?token=${token}`;

    console.log('🔗 Password reset link:', resetLink);

    const htmlSrc = await fs.readFile(TEMPLATE_PATH);
    const template = handlebars.compile(htmlSrc.toString());
    const html = template({
      name: user.name || 'User',
      resetLink,
    });

    await transporter.sendMail({
      from: env('SMTP_FROM'),
      to: email,
      subject: 'Password Reset Request',
      html,
      text: `To reset your password, please click the following link: ${resetLink}`,
    });

    res.status(200).json({
      status: 200,
      message: 'Reset password email has been successfully sent.',
      data: {},
    });
  } catch (error) {
    console.error('❌ Error in sendResetEmail:', error);

    if (error.status === 404) throw error;

    throw createHttpError(
      500,
      'Failed to send the email, please try again later.',
    );
  }
};

export const resetPassword = async (req, res) => {
  const { token, password } = req.body;

  try {
    if (!password || password.length < 8) {
      throw createHttpError(400, 'Password must be at least 8 characters');
    }

    const payload = jwt.verify(token, JWT_SECRET);
    const user = await User.findOne({ email: payload.email });

    if (!user) {
      throw createHttpError(404, 'User not found!');
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    user.password = hashedPassword;
    await user.save();

    await Session.deleteMany({ userId: user._id });

    res.status(200).json({
      status: 200,
      message: 'Password has been successfully reset.',
      data: {},
    });
  } catch (error) {
    console.error('❌ Error in resetPassword:', error);

    if (
      error instanceof jwt.TokenExpiredError ||
      error instanceof jwt.JsonWebTokenError
    ) {
      return res.status(401).json({
        status: 401,
        message: 'Token is expired or invalid.',
        data: null,
      });
    }

    throw createHttpError(
      500,
      'Failed to reset password, please try again later.',
    );
  }
};

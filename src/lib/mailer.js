/**
 * mailer.js
 *
 * Configures and exports a function to send emails using nodemailer.
 * It creates an SMTP transporter using configuration from environment variables
 * and provides a sendMail function to dispatch emails with a specified sender, recipient,
 * subject, and HTML content.
 *
 * Dependencies: nodemailer.
 */

import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export async function sendMail({ to, subject, html }) {
  return transporter.sendMail({
    from: process.env.SMTP_FROM,
    to,
    subject,
    html,
  });
}

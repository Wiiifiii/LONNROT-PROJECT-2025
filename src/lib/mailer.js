// This file configures and exports a function to send emails using nodemailer.
import nodemailer from 'nodemailer'; // Import the nodemailer module

// Create a transporter object using SMTP transport with configuration from environment variables
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST, // SMTP server host from environment variables
  port: Number(process.env.SMTP_PORT), // SMTP server port (converted to Number)
  secure: process.env.SMTP_SECURE === 'true', // true for port 465, false for STARTTLS (from environment variables)
  auth: {
    user: process.env.SMTP_USER, // SMTP username from environment variables
    pass: process.env.SMTP_PASS, // SMTP password from environment variables
  },
});

// Export an asynchronous function to send an email using the configured transporter
export async function sendMail({ to, subject, html }) {
  return transporter.sendMail({
    from: process.env.SMTP_FROM, // Sender address from environment variables
    to,                                // Recipient address
    subject,                           // Email subject line
    html,                              // Email body in HTML format
  });
}

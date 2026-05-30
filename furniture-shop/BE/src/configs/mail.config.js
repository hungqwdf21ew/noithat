const dotenv = require('dotenv');

dotenv.config();

const {
  SMTP_HOST,
  SMTP_PORT,
  SMTP_USER,
  SMTP_PASS,
  SMTP_FROM,
} = process.env;

let transporter = null;
let isMailConfigured = false;

if (SMTP_HOST && SMTP_PORT && SMTP_USER && SMTP_PASS) {
  try {
    const nodemailer = require('nodemailer');
    transporter = nodemailer.createTransport({
      host: SMTP_HOST,
      port: Number(SMTP_PORT),
      secure: Number(SMTP_PORT) === 465,
      auth: {
        user: SMTP_USER,
        pass: SMTP_PASS,
      },
    });
    isMailConfigured = true;
  } catch (err) {
    console.warn('[mail.config] nodemailer không được cài đặt. Email sẽ không được gửi.', err.message || err);
  }
} else {
  console.warn('[mail.config] SMTP chưa được cấu hình đầy đủ. Email sẽ không được gửi.');
}

module.exports = {
  transporter,
  isMailConfigured,
  defaultFrom: SMTP_FROM || 'no-reply@example.com',
};

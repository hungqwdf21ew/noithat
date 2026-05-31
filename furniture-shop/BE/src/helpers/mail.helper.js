const { transporter, isMailConfigured, defaultFrom } = require('../configs/mail.config');

exports.sendOrderConfirmationEmail = async ({ to, subject, html, text }) => {
  if (!isMailConfigured) {
    console.warn('[mail.helper] SMTP chưa cấu hình. Bỏ qua gửi email cho', to);
    return null;
  }

  const message = {
    from: defaultFrom,
    to,
    subject,
    html,
    text: text || html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim(),
  };

  return transporter.sendMail(message);
};

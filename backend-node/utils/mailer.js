const nodemailer = require('nodemailer');

const sendEmail = async ({ to, subject, html }) => {
  // Create transporter fresh each time to pick up env vars correctly
  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASS
    },
    tls: {
      rejectUnauthorized: false
    }
  });

  console.log(`Sending email to ${to} from ${process.env.MAIL_USER}`);

  await transporter.sendMail({
    from: `"Sarah Jewellers" <${process.env.MAIL_USER}>`,
    to,
    subject,
    html
  });

  console.log(`Email successfully sent to ${to}`);
};

module.exports = { sendEmail };

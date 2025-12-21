const nodemailer = require("nodemailer");

const crypto = require("crypto");
const bcrypt = require("bcrypt");

let transporter = nodemailer.createTransport({
  host: "smtp-relay.brevo.com",
  port: 465,
  secure: true, // true for 465, false for other ports
  auth: {
    user: process.env.BREVO_SMTP_USER,
    pass: process.env.BREVO_SMTP_PASS,
  },
  connectionTimeout: 5000,
  greetingTimeout: 5000,
  socketTimeout: 5000,
});

const sendOTPEmail = async (user) => {
  const plainOTP = crypto.randomInt(100000, 1000000).toString();
  const hashOTP = await bcrypt.hash(plainOTP, 10);

  user.hashOTP = hashOTP;
  user.expireOTP = Date.now() + 10 * 60 * 1000;
  await user.save();

  const html = `
  <div style="
    background-color:#0f172a;
    padding:40px 20px;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  ">
    <div style="
      max-width:420px;
      margin:0 auto;
      background:#18181b;
      border-radius:16px;
      padding:32px;
      color:#ffffff;
    ">
      
      <h1 style="
        margin:0 0 12px;
        font-size:22px;
        text-align:center;
        font-weight:600;
      ">
        Verify your email
      </h1>

      <p style="
        margin:0 0 24px;
        font-size:14px;
        color:#d4d4d8;
        text-align:center;
        line-height:1.5;
      ">
        Use the 6-digit code below to confirm your email address.
        This code expires in <strong>10 minutes</strong>.
      </p>

      <div style="
        background:#020617;
        border:1px solid #27272a;
        border-radius:12px;
        padding:18px;
        text-align:center;
        font-size:28px;
        letter-spacing:6px;
        font-weight:700;
        margin-bottom:24px;
      ">
        ${plainOTP}
      </div>

      <p style="
        font-size:12px;
        color:#a1a1aa;
        text-align:center;
        margin:0;
      ">
        If you didn’t request this, you can safely ignore this email.
      </p>
    </div>

    <p style="
      text-align:center;
      margin-top:16px;
      font-size:11px;
      color:#71717a;
    ">
      © ${new Date().getFullYear()} Relm · This helps keep your account secure
    </p>
  </div>
  `;

  try {
    const info = await transporter.sendMail({
      from: '"Relm" <iemvedant@gmail.com>',
      to: user.email,
      subject: "Verify your email • Relm",
      html,
    });

    console.log("Email sent:", info.messageId);
  } catch (err) {
    console.error("Email failed:", err);
  }
};

module.exports = sendOTPEmail;

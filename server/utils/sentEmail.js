const nodemailer = require("nodemailer");

const sentEmail = async (options) => {
  let transporter = nodemailer.createTransport({
    service: process.env.SMPT_SERVICE,
    // host: "smtp.ethereal.email",

    // port: 587,
    // secure: false,
    auth: {
      user: process.env.EMAIL,
      pass: process.env.EMAIL_PASSWORD,
      // user: testAccount.user,
      // pass: testAccount.pass,
    },
  });

  let mailOptions = {
    from: process.env.EMAIL,
    to: options.email,
    subject: options.subject,
    text: options.message,
  };

  await transporter.sendMail(mailOptions);
};

module.exports = sentEmail;

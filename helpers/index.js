require("dotenv").config();

const { EMAIL_USER, EMAIL_PASSWORD } = process.env;

const nodemailer = require("nodemailer");

function tryCatchWrapper(endpointFn) {
  return async (req, res, next) => {
    try {
      await endpointFn(req, res, next);
    } catch (error) {
      return next(error);
    }
  };
}

function httpError(status, message) {
  const err = new Error(message);
  err.status = status;
  return err;
}

async function sendVerificationEmail({ to, subject, html }) {
  const email = {
    from: "sinati0508@gmail.com",
    to,
    subject,
    html,
  };

  const transport = nodemailer.createTransport({
    host: "sandbox.smtp.mailtrap.io",
    port: 2525,
    auth: {
      user: EMAIL_USER,
      pass: EMAIL_PASSWORD,
    },
  });

  await transport.sendMail(email);
}

module.exports = {
  tryCatchWrapper,
  httpError,
  sendVerificationEmail,
};

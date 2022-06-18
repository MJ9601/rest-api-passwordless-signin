import nodemailer, { SendMailOptions } from "nodemailer";
import logger from "./loggor";
import config from "config";

// const createTestCreds = async () => {
//   const creds = await nodemailer.createTestAccount();

//   logger.info({ creds });
// };

// createTestCreds();

type Smtp = {
  user: string;
  host: string;
  pass: string;
  port: number;
  secure: boolean;
};

const smtp = config.get<Smtp>("smtp");

const transporter = nodemailer.createTransport({
  ...smtp,
  auth: { user: smtp.user, pass: smtp.pass },
});

const sendEmail = async (payload: SendMailOptions) => {
  transporter.sendMail(payload, (err, info) => {
    if (err) {
      logger.error(err, "Error in sending Email");
      return;
    }

    logger.info(`Preview URL: ${nodemailer.getTestMessageUrl(info)}`);
  });
};

export default sendEmail;

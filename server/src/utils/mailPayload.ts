import config from "config";

type MailPayload = {
  from: string;
  to: string;
  subject: string;
  text: string;
  html: string;
};

type Inputmail = {
  from: string;
  to: string;
  subject: string;
  userId: string;
  verifyCode: string;
  link: string;
};

const mailPayload = ({
  from,
  to,
  subject,
  userId,
  verifyCode,
  link,
}: Inputmail): MailPayload => {
  return {
    from,
    to,
    subject,
    text: `verification code: ${verifyCode}, id: ${userId}`,
    html: `
      <div style="display:flex; flex-direction:column; align-items: center; justify-content:center; gap:5px"> 
        <h3 style="font-size: 16px; font-weight: 700; text-align:center;">
          ${subject}
        </h3>
        <p style="font-size: 12px; text-align:center;">
         Please verify your account using verication code and id or click the link below
        </p>
        <a href="${link}" style="font-size: 13px; background-color: blue; color: white; border:none; text-decoration: none; border-radius: 4px; padding: 8px 14px; margin: 10px 0">
          ${subject}
        </a>
      <div style="">
        <p style="font-size: 12px; margin: 5px">verification code: 
          <span style="cursor:pointer; color: blue;">
            ${verifyCode}
          </span>
        </p>
        <p style="font-size: 12px; margin: 5px"> 
          userId:
          <span style="cursor:pointer; color: blue;">
            ${userId}
          </span>
      </div>
      </div>
      `,
  };
};

export default mailPayload;

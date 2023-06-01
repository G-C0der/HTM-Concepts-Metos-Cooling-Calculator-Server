import nodemailer from 'nodemailer';
import { smtpExchangeHost, smtpExchangePort, smtpExchangeEmail, smtpExchangePassword } from '../config';

type Attachments = {
  filename: string;
  path: string;
}[];

class Mailer {
  transport = nodemailer.createTransport({
    // @ts-ignore
    host: smtpExchangeHost,
    port: smtpExchangePort,
    auth: {
      user: smtpExchangeEmail,
      pass: smtpExchangePassword
    }
  });

  private sendEmail = async (recipientEmail: string, subject: string, html: string, attachments?: Attachments) => {
    const mail = {
      sender: smtpExchangeEmail,
      from: smtpExchangeEmail,
      to: recipientEmail,
      subject,
      html,
      ...(attachments && { attachments })
    };

    const { accepted, messageId } = await this.transport.sendMail(mail);
    return { accepted, messageId };
  };

  sendVerificationEmail = async (recipientEmail: string) => {
    return await this.sendEmail(
      recipientEmail,
      'Cooling Calculator - Verification of your email',
      `Your Cooling Calculator user account has been successfully registered!<br/><br/>
        Click on the following link to validate your account: <br/><br/><br/>
        If you have any question feel free to contact us!`
    );
  };
}

export default new Mailer();
import nodemailer from 'nodemailer';
import { smtpExchangeHost, smtpExchangePort, smtpExchangeEmail, smtpExchangePassword } from '../config';
import ejs from 'ejs';
import path from 'path';

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

  private renderEmail = async (templatePath: string, data: any): Promise<string> => {
    try {
      const email: string = await ejs.renderFile(templatePath, data);
      return email;
    } catch (err) {
      console.error(`Error rendering email template. Error: ${err}`);
      throw err;
    }
  };

  private sendEmail = async (
    recipientEmail: string,
    subject: string,
    emailTemplatePath: string,
    emailData: object,
    attachments?: Attachments
  ) => {
    try {
      const emailContent = await this.renderEmail(emailTemplatePath, emailData);
      const email = {
        sender: smtpExchangeEmail,
        from: smtpExchangeEmail,
        to: recipientEmail,
        subject,
        html: emailContent,
        ...(attachments && { attachments })
      };

      const { accepted, messageId } = await this.transport.sendMail(email);
      return { accepted, messageId };
    } catch (err) {
      console.error(`Error sending email. Error: ${err}`);
      return {};
    }
  };

  sendVerificationEmail = async (recipientEmail: string) => {
    const templatePath = path.join(__dirname, '../templates/verificationEmail.ejs');
    return await this.sendEmail(
      recipientEmail,
      'Verify Your Cooling Calculator User Account',
      templatePath,
      { verificationLink: 'www.google.com' }
    );
  };
}

export default new Mailer();
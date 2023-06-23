import nodemailer from 'nodemailer';
import { smtpExchangeHost, smtpExchangePort, smtpExchangeEmail, smtpExchangePassword } from '../config';
import ejs from 'ejs';
import path from 'path';
import { escape } from 'lodash';

type Attachments = {
  filename: string;
  path: string;
}[];

class Mailer {
  private transport = nodemailer.createTransport({
    // @ts-ignore
    host: smtpExchangeHost,
    port: smtpExchangePort,
    auth: {
      user: smtpExchangeEmail,
      pass: smtpExchangePassword
    }
  });

  private renderEmail = async (templatePath: string, data: object = {}): Promise<string> => {
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
    emailData?: object,
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

  sendVerificationPendingEmail = async (userEmail: string, verificationUrl: string) => {
    const templatePath = path.join(__dirname, '../templates/verificationPendingEmail.ejs');
    return await this.sendEmail(
      userEmail,
      'Cooling Calculator - Verify Your User Account',
      templatePath,
      { verificationUrl }
    );
  };

  sendVerificationDoneEmail = async (htmConceptsEmail: string, userEmail: string) => {
    const templatePath = path.join(__dirname, '../templates/verificationDoneEmail.ejs');
    return await this.sendEmail(
      htmConceptsEmail,
      'Cooling Calculator - A User Account Is Ready for Activation',
      templatePath,
      { userEmail: escape(userEmail) }
    );
  };
  
  sendActivationPendingEmail =  async (userEmail: string) => {
    const templatePath = path.join(__dirname, '../templates/activationPendingEmail.ejs');
    return await this.sendEmail(
      userEmail,
      'Cooling Calculator - Your User Account Is Awaiting Activation',
      templatePath
    );
  };

  sendPasswordResetPendingEmail = async (userEmail: string, passwordResetUrl: string) => {
    const templatePath = path.join(__dirname, '../templates/passwordResetPendingEmail.ejs');
    return await this.sendEmail(
      userEmail,
      'Cooling Calculator - Reset Your User Account Password',
      templatePath,
      { passwordResetUrl }
    );
  };

  sendActivationDoneEmail = async (userEmail: string) => {
    const templatePath = path.join(__dirname, '../templates/activationDoneEmail.ejs');
    return await this.sendEmail(
      userEmail,
      'Cooling Calculator - Your User Account is Now Active',
      templatePath
    );
  };
}

export default new Mailer();
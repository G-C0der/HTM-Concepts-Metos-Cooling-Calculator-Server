import nodemailer from 'nodemailer';
import { smtpExchangeHost, smtpExchangePort, smtpExchangeEmail, smtpExchangePassword } from '../config';

const mailer = nodemailer.createTransport({
  // @ts-ignore
  host: smtpExchangeHost,
  port: smtpExchangePort,
  auth: {
    user: smtpExchangeEmail,
    pass: smtpExchangePassword
  }
});

export {
  mailer
};
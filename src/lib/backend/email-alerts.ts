import nodemailer from 'nodemailer';
import type { StoredAlert, StoredEmailAlert } from './state';

const DEFAULT_ALERT_RECIPIENT = 'ezraambaw@gmail.com';
const EMAIL_ADDRESS_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export interface EmailTransportConfig {
  host: string;
  port: number;
  secure: boolean;
  user: string;
  password: string;
  from: string;
}

export function getAlertEmailRecipient(): string {
  const recipient = process.env.ALERT_EMAIL_RECIPIENT?.trim() || DEFAULT_ALERT_RECIPIENT;
  if (!EMAIL_ADDRESS_PATTERN.test(recipient) || /[\r\n]/.test(recipient)) {
    throw new Error('Invalid ALERT_EMAIL_RECIPIENT configuration.');
  }
  return recipient;
}

export function createSampleEmailAlert(alert: StoredAlert): Pick<StoredEmailAlert, 'recipient' | 'subject' | 'text'> {
  const region = alert.regionId === 'borena' ? 'Borena Zone, Oromia' : alert.regionId;
  return {
    recipient: getAlertEmailRecipient(),
    subject: `[AETHER SAMPLE] Workflow notification for ${region}`,
    text: [
      'AETHER SAMPLE EMAIL ALERT',
      `Reference: ${alert.reference}`,
      `Region: ${region}`,
      `Observation period: ${alert.observationPeriod}`,
      'This is a workflow simulation. No environmental measurements were analyzed.',
      'Data quality is insufficient for environmental interpretation.',
      'This message is not an official drought declaration or an operational warning.',
      `Report reference: ${alert.reportReference}.`,
    ].join('\n'),
  };
}

export function getEmailTransportConfig(): EmailTransportConfig {
  if (process.env.EMAIL_MODE !== 'smtp') {
    throw new Error('Email delivery is disabled; set EMAIL_MODE=smtp to enable SMTP delivery.');
  }

  const recipient = getAlertEmailRecipient();
  const host = process.env.EMAIL_SMTP_HOST?.trim() || 'smtp.gmail.com';
  const port = Number(process.env.EMAIL_SMTP_PORT || 465);
  const user = process.env.EMAIL_SMTP_USER?.trim() || recipient;
  const password = process.env.EMAIL_SMTP_PASS;
  const from = process.env.EMAIL_FROM_ADDRESS?.trim() || user;
  const secureSetting = process.env.EMAIL_SMTP_SECURE;

  if (!host || /[\r\n]/.test(host) || !Number.isInteger(port) || port < 1 || port > 65535 ||
      !user || !password || !from || !EMAIL_ADDRESS_PATTERN.test(from) || /[\r\n]/.test(from)) {
    throw new Error('SMTP configuration is incomplete or invalid.');
  }
  if (secureSetting !== undefined && secureSetting !== 'true' && secureSetting !== 'false') {
    throw new Error('EMAIL_SMTP_SECURE must be true or false.');
  }

  return {
    host,
    port,
    secure: secureSetting === undefined ? port === 465 : secureSetting === 'true',
    user,
    password,
    from,
  };
}

export async function sendEmailAlert(
  email: Pick<StoredEmailAlert, 'recipient' | 'subject' | 'text'>,
  config: EmailTransportConfig = getEmailTransportConfig(),
): Promise<{ messageId: string }> {
  const transporter = nodemailer.createTransport({
    host: config.host,
    port: config.port,
    secure: config.secure,
    auth: { user: config.user, pass: config.password },
  });
  const result = await transporter.sendMail({
    from: config.from,
    to: email.recipient,
    subject: email.subject,
    text: email.text,
  });
  const accepted = result.accepted.some((address) => address.toLowerCase() === email.recipient.toLowerCase());
  if (!accepted) throw new Error('SMTP server did not accept the configured alert recipient.');
  return { messageId: result.messageId };
}

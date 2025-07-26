import { CONFIG } from '@/core/config';
import { LOGGER } from '@/core/logger';
import { Attachment, Resend } from 'resend';

interface SendEmailParams {
  to: string | string[];
  subject: string;
  htmlBody: string;
  attachments?: Attachment[];
}

export const createMailClient = () => {
  const resend = new Resend(CONFIG.mail.resend.key);

  const sendEmail = async ({
    to,
    subject,
    htmlBody,
    attachments,
  }: SendEmailParams) => {
    await resend.emails.send({
      from: 'onboarding@resend.dev',
      to,
      subject,
      html: htmlBody,
      attachments,
    });

    LOGGER.info('📨 Email enviado com sucesso!');
  };

  return {
    sendEmail,
  };
};

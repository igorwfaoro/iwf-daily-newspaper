import { Attachment } from 'resend';
interface SendEmailParams {
    to: string | string[];
    subject: string;
    htmlBody: string;
    attachments?: Attachment[];
}
export declare const createMailClient: () => {
    sendEmail: ({ to, subject, htmlBody, attachments, }: SendEmailParams) => Promise<void>;
};
export {};

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createMailClient = void 0;
const config_1 = require("../../core/config");
const logger_1 = require("../../core/logger");
const resend_1 = require("resend");
const createMailClient = () => {
    const resend = new resend_1.Resend(config_1.CONFIG.mail.resend.key);
    const sendEmail = async ({ to, subject, htmlBody, attachments, }) => {
        await resend.emails.send({
            from: 'onboarding@resend.dev',
            to,
            subject,
            html: htmlBody,
            attachments,
        });
        logger_1.LOGGER.info('📨 Email enviado com sucesso!');
    };
    return {
        sendEmail,
    };
};
exports.createMailClient = createMailClient;
//# sourceMappingURL=mail.client.js.map
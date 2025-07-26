"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createNewspaperService = void 0;
const pioneiro_client_1 = require("../infra/clients/pioneiro.client");
const ai_chat_client_1 = require("../infra/clients/ai-chat.client");
const mail_client_1 = require("../infra/clients/mail.client");
const logger_1 = require("../core/logger");
const pdf_helper_1 = require("../util/helpers/pdf.helper");
const config_1 = require("../core/config");
const createNewspaperService = () => {
    const pioneiro = (0, pioneiro_client_1.createPioneiroClient)();
    const ai = (0, ai_chat_client_1.createAiChatClient)();
    const mail = (0, mail_client_1.createMailClient)();
    const run = async () => {
        const edition = await pioneiro.getTodayEdition();
        logger_1.LOGGER.info(`Edition: ${edition.titulo}`);
        const pages = await pioneiro.getPagesData(edition.ed);
        const pdfBuffers = [];
        const summaries = [];
        for (let i = 0; i < pages.length; i++) {
            const page = pages[i];
            const pageNum = i + 1;
            logger_1.LOGGER.info(`Processing page ${pageNum}...`);
            const buffer = await (0, pdf_helper_1.downloadPDFBuffer)(page.pdfUrl);
            pdfBuffers.push(buffer);
            const text = await pioneiro.fetchPageText(page.textUrl);
            if (text.length < 50) {
                logger_1.LOGGER.warn(`Page ${pageNum} skipped (too short)`);
                continue;
            }
            const summary = await ai.chat(`You will receive the text of page ${pageNum} from a printed newspaper.
        Summarize the main topics, headlines, columns, or highlights as clearly as possible for email.
        Use simple readable HTML (<ul>, <li>, <b>, etc). Output only the HTML.
        Use teh same language of the text (Portuguese-BR).

        ${text}`);
            summaries.push(`<h2>Page ${pageNum}</h2>\n${summary}`);
        }
        const merged = await (0, pdf_helper_1.mergePDFs)(pdfBuffers);
        const compressed = await (0, pdf_helper_1.compressPDF)(merged);
        logger_1.LOGGER.info(`PDF merged and compressed.`);
        const htmlBody = `<h1>Summary of Jornal Pioneiro - ${edition.data}</h1>\n${summaries.join('<hr/>\n')}`;
        await mail.sendEmail({
            to: config_1.CONFIG.mail.to,
            subject: `Resumo Jornal Pioneiro – ${edition.data}`,
            htmlBody,
            attachments: [
                {
                    filename: `Pioneiro_${edition.numero}.pdf`,
                    content: compressed,
                },
            ],
        });
    };
    return {
        run,
    };
};
exports.createNewspaperService = createNewspaperService;
//# sourceMappingURL=newspaper.service.js.map
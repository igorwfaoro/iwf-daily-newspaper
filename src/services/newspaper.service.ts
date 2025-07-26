import { createPioneiroClient } from '@/infra/clients/pioneiro.client';
import { createAiChatClient } from '@/infra/clients/ai-chat.client';
import { createMailClient } from '@/infra/clients/mail.client';
import { LOGGER } from '@/core/logger';
import {
  compressPDF,
  downloadPDFBuffer,
  mergePDFs,
} from '@/util/helpers/pdf.helper';
import { CONFIG } from '@/core/config';

export const createNewspaperService = () => {
  const pioneiro = createPioneiroClient();
  const ai = createAiChatClient();
  const mail = createMailClient();

  const run = async () => {
    const edition = await pioneiro.getTodayEdition();
    LOGGER.info(`Edition: ${edition.titulo}`);

    const pages = await pioneiro.getPagesData(edition.ed);
    const pdfBuffers: Buffer[] = [];
    const summaries: string[] = [];

    for (let i = 0; i < pages.length; i++) {
      const page = pages[i];
      const pageNum = i + 1;

      LOGGER.info(`Processing page ${pageNum}...`);

      const buffer = await downloadPDFBuffer(page.pdfUrl);
      pdfBuffers.push(buffer);

      const text = await pioneiro.fetchPageText(page.textUrl);
      if (text.length < 50) {
        LOGGER.warn(`Page ${pageNum} skipped (too short)`);
        continue;
      }

      const summary = await ai.chat(
        `You will receive the text of page ${pageNum} from a printed newspaper.
        Summarize the main topics, headlines, columns, or highlights as clearly as possible for email.
        Use simple readable HTML (<ul>, <li>, <b>, etc). Output only the HTML.
        Use teh same language of the text (Portuguese-BR).

        ${text}`
      );

      summaries.push(`<h2>Page ${pageNum}</h2>\n${summary}`);
    }

    const merged = await mergePDFs(pdfBuffers);
    const compressed = await compressPDF(merged);
    LOGGER.info(`PDF merged and compressed.`);

    const htmlBody = `<h1>Summary of Jornal Pioneiro - ${edition.data}</h1>\n${summaries.join(
      '<hr/>\n'
    )}`;

    await mail.sendEmail({
      to: CONFIG.mail.to,
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

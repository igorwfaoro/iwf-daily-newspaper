import { PDFDocument } from 'pdf-lib';
import { LOGGER } from '@/core/logger';
import axios from 'axios';

/**
 * Merges multiple PDF buffers into a single PDF buffer
 */
export const mergePDFs = async (buffers: Buffer[]): Promise<Buffer> => {
  const mergedPdf = await PDFDocument.create();

  for (const buf of buffers) {
    const pdf = await PDFDocument.load(buf);
    const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
    copiedPages.forEach((page) => mergedPdf.addPage(page));
  }

  const result = await mergedPdf.save({
    useObjectStreams: true,
    addDefaultPage: false,
    updateFieldAppearances: false,
  });

  return Buffer.from(result);
};

/**
 * Tries to optimize/compress a PDF by re-saving with object streams
 */
export const compressPDF = async (buffer: Buffer): Promise<Buffer> => {
  try {
    const pdfDoc = await PDFDocument.load(buffer);

    // Remove metadata and embedded JavaScript (optional)
    pdfDoc.setTitle('');
    pdfDoc.setAuthor('');
    pdfDoc.setSubject('');
    pdfDoc.setKeywords([]);
    pdfDoc.setProducer('');
    pdfDoc.setCreator('');

    // Save with object streams to reduce size
    const optimized = await pdfDoc.save({
      useObjectStreams: true,
      addDefaultPage: false,
      updateFieldAppearances: false,
    });

    return Buffer.from(optimized);
  } catch (err) {
    LOGGER.error('PDF optimization failed. Returning original buffer.');
    return buffer;
  }
};

/**
 * Downloads a PDF from a given URL and returns its buffer
 */
export const downloadPDFBuffer = async (url: string): Promise<Buffer> => {
  const response = await axios.get(url, { responseType: 'arraybuffer' });
  return Buffer.from(response.data);
};

"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.downloadPDFBuffer = exports.compressPDF = exports.mergePDFs = void 0;
const pdf_lib_1 = require("pdf-lib");
const logger_1 = require("../../core/logger");
const axios_1 = __importDefault(require("axios"));
const mergePDFs = async (buffers) => {
    const mergedPdf = await pdf_lib_1.PDFDocument.create();
    for (const buf of buffers) {
        const pdf = await pdf_lib_1.PDFDocument.load(buf);
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
exports.mergePDFs = mergePDFs;
const compressPDF = async (buffer) => {
    try {
        const pdfDoc = await pdf_lib_1.PDFDocument.load(buffer);
        pdfDoc.setTitle('');
        pdfDoc.setAuthor('');
        pdfDoc.setSubject('');
        pdfDoc.setKeywords([]);
        pdfDoc.setProducer('');
        pdfDoc.setCreator('');
        const optimized = await pdfDoc.save({
            useObjectStreams: true,
            addDefaultPage: false,
            updateFieldAppearances: false,
        });
        return Buffer.from(optimized);
    }
    catch (err) {
        logger_1.LOGGER.error('PDF optimization failed. Returning original buffer.');
        return buffer;
    }
};
exports.compressPDF = compressPDF;
const downloadPDFBuffer = async (url) => {
    const response = await axios_1.default.get(url, { responseType: 'arraybuffer' });
    return Buffer.from(response.data);
};
exports.downloadPDFBuffer = downloadPDFBuffer;
//# sourceMappingURL=pdf.helper.js.map
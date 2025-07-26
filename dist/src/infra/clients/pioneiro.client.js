"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createPioneiroClient = void 0;
const config_1 = require("../../core/config");
const axios_1 = __importDefault(require("axios"));
const xml2js_1 = require("xml2js");
const createPioneiroClient = () => {
    const getTodayEdition = async () => {
        const res = await axios_1.default.get(config_1.CONFIG.pioneiro.baseUrl, {
            params: { cd: config_1.CONFIG.pioneiro.cd },
        });
        const parsed = await (0, xml2js_1.parseStringPromise)(res.data);
        const editions = parsed.app.Cliente[0].Revista[0].Edicao;
        return editions[0].$;
    };
    const getPagesData = async (edition) => {
        const res = await axios_1.default.get(config_1.CONFIG.pioneiro.baseUrl, {
            params: { cd: config_1.CONFIG.pioneiro.cd, ed: edition },
        });
        const parsed = await (0, xml2js_1.parseStringPromise)(res.data);
        const pages = parsed.app.Cliente[0].Revista[0].Edicao[0].Paginas[0].Pagina;
        return pages.map((p) => ({
            pdfUrl: p.$.pdf,
            textUrl: p.$.texto,
            id: p.$.id,
        }));
    };
    const fetchPageText = async (url) => {
        try {
            const res = await axios_1.default.get(url);
            return res.data
                .replace(/<[^>]+>/g, '')
                .replace(/\s+/g, ' ')
                .trim();
        }
        catch (err) {
            console.error(`Failed to fetch page text: ${url}`);
            return '';
        }
    };
    return {
        getTodayEdition,
        getPagesData,
        fetchPageText,
    };
};
exports.createPioneiroClient = createPioneiroClient;
//# sourceMappingURL=pioneiro.client.js.map
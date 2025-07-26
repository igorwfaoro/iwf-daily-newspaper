import { CONFIG } from '@/core/config';
import axios from 'axios';
import { parseStringPromise } from 'xml2js';

export const createPioneiroClient = () => {
  const getTodayEdition = async () => {
    const res = await axios.get(CONFIG.pioneiro.baseUrl, {
      params: { cd: CONFIG.pioneiro.cd },
    });

    const parsed = await parseStringPromise(res.data);
    const editions = parsed.app.Cliente[0].Revista[0].Edicao;
    return editions[0].$;
  };

  const getPagesData = async (edition: string): Promise<any[]> => {
    const res = await axios.get(CONFIG.pioneiro.baseUrl, {
      params: { cd: CONFIG.pioneiro.cd, ed: edition },
    });
    const parsed = await parseStringPromise(res.data);
    const pages: any[] =
      parsed.app.Cliente[0].Revista[0].Edicao[0].Paginas[0].Pagina;

    return pages.map((p: any) => ({
      pdfUrl: p.$.pdf,
      textUrl: p.$.texto,
      id: p.$.id,
    }));
  };

  const fetchPageText = async (url: string): Promise<string> => {
    try {
      const res = await axios.get(url);
      return res.data
        .replace(/<[^>]+>/g, '')
        .replace(/\s+/g, ' ')
        .trim();
    } catch (err) {
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

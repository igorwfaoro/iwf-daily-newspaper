"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CONFIG = void 0;
require("dotenv/config");
const { env } = process;
exports.CONFIG = {
    port: env.PORT || 3000,
    pioneiro: {
        cd: env.PIONEIRO_CD,
        baseUrl: 'https://flipzh.clicrbs.com.br/jornal-digital/ws/MavenFlipWs',
    },
    groq: {
        apiKey: env.GROQ_API_KEY,
        chatUrl: 'https://api.groq.com/openai/v1/chat/completions',
    },
    openrouter: {
        apiKey: env.OPENROUTER_API_KEY,
        chatUrl: 'https://openrouter.ai/api/v1/chat/completions',
    },
    mail: {
        resend: {
            key: env.RESEND_KEY,
        },
        to: (env.MAIL_TO || '').split(','),
    },
};
//# sourceMappingURL=config.js.map
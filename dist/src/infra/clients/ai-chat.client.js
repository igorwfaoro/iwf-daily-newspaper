"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.createAiChatClient = void 0;
const axios_1 = __importStar(require("axios"));
const config_1 = require("../../core/config");
const sleep_1 = require("../../util/sleep");
const logger_1 = require("../../core/logger");
const createAiChatClient = () => {
    const callGroq = async (prompt) => {
        const headers = {
            Authorization: `Bearer ${config_1.CONFIG.groq.apiKey}`,
            'Content-Type': 'application/json',
        };
        const payload = {
            model: 'llama-3.3-70b-versatile',
            messages: [{ role: 'user', content: prompt }],
            temperature: 0.2,
        };
        for (let attempt = 1; attempt <= 3; attempt++) {
            try {
                const response = await axios_1.default.post(config_1.CONFIG.groq.chatUrl, payload, {
                    headers,
                });
                return response.data.choices[0].message?.content?.trim();
            }
            catch (error) {
                const message = error instanceof axios_1.AxiosError
                    ? error.response?.data?.error?.message || error.message
                    : error.message;
                if (message.includes('TPM')) {
                    const wait = parseFloat(message.match(/try again in (\d+(\.\d+)?)s/)?.[1] || '10');
                    logger_1.LOGGER.warn(`TPM limit reached. Waiting ${wait}s...`);
                    await (0, sleep_1.sleep)(wait * 1000);
                    continue;
                }
                if (message.includes('TPD') || message.includes('daily limit')) {
                    throw new Error('GROQ daily limit reached');
                }
                logger_1.LOGGER.error(`Groq error: ${message}`);
                throw new Error(`Groq error: ${message}`);
            }
        }
        throw new Error('Failed to get Groq response after multiple attempts.');
    };
    const callOpenRouter = async (prompt) => {
        const headers = {
            Authorization: `Bearer ${config_1.CONFIG.openrouter.apiKey}`,
            'Content-Type': 'application/json',
        };
        const payload = {
            model: 'meta-llama/llama-3-70b-instruct',
            messages: [{ role: 'user', content: prompt }],
            temperature: 0.2,
        };
        const response = await axios_1.default.post(config_1.CONFIG.openrouter.chatUrl, payload, {
            headers,
        });
        return response.data.choices[0].message?.content?.trim();
    };
    const chat = async (prompt) => {
        try {
            return await callGroq(prompt);
        }
        catch (err) {
            if (err.message.includes('daily limit')) {
                logger_1.LOGGER.warn('Switching to OpenRouter...');
                return await callOpenRouter(prompt);
            }
            throw err;
        }
    };
    return {
        chat,
    };
};
exports.createAiChatClient = createAiChatClient;
//# sourceMappingURL=ai-chat.client.js.map
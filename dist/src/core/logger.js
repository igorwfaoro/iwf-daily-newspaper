"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LOGGER = void 0;
const dayjs_1 = __importDefault(require("dayjs"));
const formatMessage = (level, message) => {
    const timestamp = (0, dayjs_1.default)().format('YYYY-MM-DD HH:mm:ss');
    return `[${timestamp}] [${level.toUpperCase()}] ${message}`;
};
exports.LOGGER = {
    info: (msg) => console.log(formatMessage('info', msg)),
    warn: (msg) => console.warn(formatMessage('warn', msg)),
    error: (msg) => console.error(formatMessage('error', msg)),
    debug: (msg) => {
        if (process.env.DEBUG === 'true') {
            console.debug(formatMessage('debug', msg));
        }
    },
};
//# sourceMappingURL=logger.js.map
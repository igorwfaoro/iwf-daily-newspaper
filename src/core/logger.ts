import dayjs from 'dayjs';

type LogLevel = 'info' | 'warn' | 'error' | 'debug';

const formatMessage = (level: LogLevel, message: string) => {
  const timestamp = dayjs().format('YYYY-MM-DD HH:mm:ss');
  return `[${timestamp}] [${level.toUpperCase()}] ${message}`;
};

export const LOGGER = {
  info: (msg: string) => console.log(formatMessage('info', msg)),
  warn: (msg: string) => console.warn(formatMessage('warn', msg)),
  error: (msg: string) => console.error(formatMessage('error', msg)),
  debug: (msg: string) => {
    if (process.env.DEBUG === 'true') {
      console.debug(formatMessage('debug', msg));
    }
  },
};

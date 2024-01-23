import { format, createLogger, transports } from "winston";
const { combine, timestamp, json } = format;
import "winston-daily-rotate-file";

const errorFilter = format((logLevel, opts) => {
    const { level } = logLevel
    return level === 'error' ? logLevel : false;
});

const infoFilter = format((logLevel, opts) => {
    const { level } = logLevel
    return level === 'info' ? logLevel : false;
});

const conbinedFilter = format((logLevel, opts) => {
    const { level } = logLevel
    return level === 'info' || level === 'error' ? false : logLevel;
});

const logger = createLogger({
    level: process.env.LOG_LEVEL || 'info',
    format: combine(timestamp(), json()),
    transports: [
        new transports.DailyRotateFile({
            filename: 'logs/combined-%DATE%.log',
            datePattern: 'YYYY-MM-DD',
            format: combine(conbinedFilter(), timestamp(), json()),
            maxFiles: '14d',
        }),
        new transports.DailyRotateFile({
            filename: 'logs/error-%DATE%.log',
            datePattern: 'YYYY-MM-DD',
            level: 'error',
            format: combine(errorFilter(), timestamp(), json()),
            maxFiles: '14d',
        }),
        new transports.DailyRotateFile({
            filename: 'logs/info-%DATE%.log',
            datePattern: 'YYYY-MM-DD',
            level: 'info',
            format: combine(infoFilter(), timestamp(), json()),
            maxFiles: '14d',
        }),
    ],
});

export default logger;
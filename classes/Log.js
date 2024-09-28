const Formatter = require('./Formatter');
const winston = require('winston');
require('winston-daily-rotate-file');

module.exports = class Log {
    static fileLogger;

    static async init() {
        Log.fileLogger = winston.createLogger({
            format: winston.format.combine(
                winston.format.timestamp({
                    format: Formatter.formatTimestamp,
                }),
                winston.format.printf(({ timestamp, level, message }) => {
                    return `${timestamp} [${level.toUpperCase()}]: ${message}`;
                }),
            ),
            transports: [
                new winston.transports.DailyRotateFile({
                    filename: 'logs/%DATE%.log',
                    datePattern: 'YYYY-MM-DD',
                }),
            ],
        });
    }

    /**
     * Log a text to a log file.
     *
     * @param level {string}
     * @param text {string}
     * @return {void}
     */
    static file(level, text) {
        Log.fileLogger.log({
            level: level,
            message: text,
        });
    }

    /**
     * Log an error.
     *
     * @param err {Error}
     * @return {void}
     */
    static error(err) {
        let timestamp = Formatter.formatTimestamp(new Date());
        let errorMessage = err.stack || err.message || err;

        console.error(`[${timestamp}] ${errorMessage}`);
        Log.file('error', errorMessage);
    }

    /**
     * Log a text to the console.
     *
     * @param text {string}
     * @return {void}
     */
    static console(text) {
        let timestamp = Formatter.formatTimestamp(new Date());

        console.log(`[${timestamp}] ${text}`);
    }
};
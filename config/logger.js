const { createLogger, format, transports } = require('winston');

const isDev = process.env.NODE_ENV === 'development';

const logger = createLogger({
  level: isDev ? 'debug' : 'info',
  format: isDev
    ? format.combine(
        format.timestamp(),
        format.printf(
          ({ level, timestamp, message }) =>
            `[${timestamp}] (${level}): ${message}`
        )
      )
    : format.combine(format.timestamp(), format.json()),
  transports: [new transports.Console()],
});

module.exports = logger;

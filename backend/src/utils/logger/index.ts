import pino from "pino";

// configuration for development and production environments
const pinoConfig =
  process.env.NODE_ENV !== "production"
    ? {
        // in development, use pretty printing
        transport: {
          target: "pino-pretty",
          options: {
            colorize: true,
            levelFirst: true,
            // format the timestamp for readability
            translateTime: "SYS:yyyy-mm-dd HH:MM:ss",
          },
        },
        // set default log level (info, debug, warn, error)
        level: process.env.LOG_LEVEL || "info",
      }
    : {
        // in production, omit 'transport' to output raw JSON logs
        level: process.env.LOG_LEVEL || "info",
      };

// initialize and export the primary logger instance
const logger = pino(pinoConfig);

export default logger;

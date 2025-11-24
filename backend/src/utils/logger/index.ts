import bunyan from "bunyan";
import bunyanFormat from "bunyan-format";

// configuration for development and production environments
const logLevel = (process.env.LOG_LEVEL || "info") as bunyan.LogLevel;

const streams: bunyan.Stream[] =
  process.env.NODE_ENV !== "production"
    ? [
        {
          // in development, use pretty printing to stdout
          level: logLevel,
          stream: bunyanFormat({ outputMode: "short", color: true }),
        },
      ]
    : [
        {
          // in production, output raw JSON logs to stdout
          level: logLevel,
          stream: process.stdout,
        },
      ];

// initialize and export the primary logger instance
const logger = bunyan.createLogger({
  name: "aws-node-react",
  streams,
  serializers: bunyan.stdSerializers,
});

export default logger;

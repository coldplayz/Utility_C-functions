import "dotenv/config";
import { createLogger, transports, format } from "winston";

// Custom format function to add severity field
const loggerFormat = format.printf(({ level, message, error }) => {
  return JSON.stringify({ message, level, severity: level, error })
});

// logs each stage passed
export const logger = createLogger({
  transports: [new transports.Console()],
  format: format.combine(loggerFormat)
});
import "dotenv/config";
import "express-async-errors"; // catch unhandled errors and send it to the error handler
import express, { Express, Request } from "express";
import morgan from "morgan";
import helmet from "helmet";
import { rateLimit } from 'express-rate-limit'
import routes from "./routes/routes";
import errorHandler from "./errors/errorHandler";
import { logger } from "./helpers/@logger";
// import initFirebase from './models/firebase';

// initFirebase();

const app: Express = express();
const port = process.env.PORT || 8000;

app.set('trust proxy', Number(process.env.TRUST_PROXY_COUNT) | 1 /* number of proxies between user and server */)

// List of addresses to ignore rate limiting
const allowedUrls: string[] = (process.env.NOTE_RATE_LIMIT_URL || "").split(",");

const limiter = rateLimit({
  windowMs: (Number(process.env.REQUEST_DELAY_MIN) || 5) * 60 * 1000, // 10 minutes
  max: Number(process.env.REQUEST_LIMIT) || 50, // Limit each IP to 100 requests per `window` (here, per 10 minutes)
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  skip: (req: Request) => {

    const origin = req.get('origin');

    // If client url is in the ignore list, skip rate limiting
    return allowedUrls.includes(origin as string);
  }
});

app.use(morgan('dev'));
app.use(helmet()) // to set security headers
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(limiter);

app.use("/v2", routes());

app.use(errorHandler);

let server;
if (process.env.NODE_ENV !== "test")
  server = app.listen(port, () => {
    logger.info(`Server is running at http://localhost:${port}`);
  });

export default server;

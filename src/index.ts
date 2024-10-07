import express, {
  Application,
  json,
  NextFunction,
  Response,
  urlencoded,
  static as static_,
} from 'express';
import { logger } from 'express-winston';
import winston from 'winston';
//@ts-ignore
import Unifi from 'node-unifi';
import { join } from 'node:path';
import cors from 'cors';
import { connect } from 'mongoose';

import auth from './routes/auth.route';

const app: Application = express();

const PORT = process.env.PORT || 3001;
const MONGO_URL = process.env.MONGO_URL!;
const clientDistDir = join(__dirname, '..', 'client', 'dist');

const controller: any = new Unifi.Controller({
  host: process.env.UNIFI_HOST,
  port: process.env.UNIFI_PORT,
  username: process.env.UNIFI_USERNAME,
  password: process.env.UNIFI_PASSWD,
  sslverify: false,
});

// Connect to the UniFi controller
controller
  .login()
  .then(() => {
    console.log('Unifi connected successfully!');
  })
  .catch((error: any) => {
    console.error('Error:', error);
  });

app.set('trust proxy', true);
app.use(cors());
app.use(json());
app.use(urlencoded({ extended: true }));
app.use(
  logger({
    transports: [new winston.transports.File({ filename: './logs/logs.log' })],
    format: winston.format.combine(
      winston.format.colorize(),
      winston.format.json(),
      winston.format.prettyPrint(),
    ),
    meta: true,
    msg: 'HTTP {{req.method}} {{req.url}}',
    expressFormat: true,
    colorize: false,
  }),
);
app.use(static_(clientDistDir));

app.use(
  '/auth',
  (req: any, res: Response, next: NextFunction) => {
    req.unifi = controller;
    next();
  },
  auth,
);

app.use('/', (req, res) => {
  res.sendFile(join(__dirname, '..', 'client', 'dist', 'index.html'));
});

// Start server
const startServer = async () => {
  try {
    await connect(MONGO_URL as string);
    console.log('Connected to MongoDB');
    app.listen(PORT, () =>
      console.log(`Server started on http://localhost:${PORT}`),
    );
  } catch (error) {
    console.error(
      'Failed to start server:',
      error instanceof Error ? error.message : error,
    );
    process.exit(1);
  }
};

startServer();

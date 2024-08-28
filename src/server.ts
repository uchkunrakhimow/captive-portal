import express, {
  Application,
  json,
  NextFunction,
  Request,
  Response,
} from 'express';
import expressWinston from 'express-winston';
import winston from 'winston';
//@ts-ignore
import Unifi from 'node-unifi';

import { join } from 'node:path';

import cors from 'cors';

import api from './routes/api';
import auth from './routes/auth';
import admin from './routes/admin';

const app: Application = express();
const PORT = process.env.PORT || 3001;

const storageDir = join(__dirname, 'storage');
const distDir = join(__dirname, '..', 'client', 'dist');
const uploadsDir = join(__dirname, 'storage', 'upload');

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json(),
  ),
  transports: [new winston.transports.Console()],
});

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

app.use(cors());
app.use(json());
app.use(
  expressWinston.logger({
    transports: [new winston.transports.Console()],
    format: winston.format.combine(
      winston.format.colorize(),
      winston.format.json(),
      winston.format.prettyPrint(),
    ),
    meta: true,
    msg: 'HTTP {{req.method}} {{req.url}}',
    expressFormat: true,
    colorize: false,
    ignoreRoute: function (req, res) {
      return false;
    },
  }),
);

app.use('/storage', express.static(storageDir));
app.use('/uploads', express.static(uploadsDir));
app.use(express.static(distDir));

app.use('/api', api);
app.use(
  '/auth',
  (req: Request, res: Response, next: NextFunction) => {
    //@ts-ignore
    req.unifi = controller;
    next();
  },
  auth,
);
app.use('/admin', admin);

app.use('/', (req, res) => {
  res.sendFile(join(__dirname, '..', 'client', 'dist', 'index.html'));
});

app.use(expressWinston.errorLogger({ winstonInstance: logger }));

app.listen(PORT, () => {
  console.clear();
  console.log(`Server is running on http://127.0.0.1:${PORT}`);
});

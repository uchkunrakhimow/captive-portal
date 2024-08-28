import { Controller } from 'node-unifi';

declare global {
  namespace Express {
    interface Request {
      unifi?: Controller;
    }
  }
}

import { PayloadToken } from '../services/auth';
import { Request } from 'express';

export interface PlusRequest extends Request {
  info?: PayloadToken;
}

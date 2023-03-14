import { Response, Request, NextFunction } from 'express';

import { UserRepo } from '../repository/repo.interface.js';
import { User } from '../entities/user.js';
import createDebug from 'debug';
import { HTTPError } from '../errors/errors.js';
import { Auth, PayloadToken } from '../services/auth.js';
const debug = createDebug('FINPR:controller:users');

export class UsersController {
  constructor(public repoUsers: UserRepo<User>) {
    debug('Instantiate');
  }

  async getAll(_req: Request, resp: Response, next: NextFunction) {
    try {
      debug('getAll');
      const data = await this.repoUsers.query();
      resp.json({
        results: data,
      });
    } catch (error) {
      next(error);
    }
  }

  async register(req: Request, resp: Response, next: NextFunction) {
    try {
      debug('register:post');
      if (!req.body.email || !req.body.password)
        throw new HTTPError(401, 'Unauthorized', 'Invalid Email or password');
      req.body.password = await Auth.hash(req.body.password);
      req.body.favoriteFestival = [];
      const data = await this.repoUsers.create(req.body);
      resp.status(201);
      resp.json({
        results: [data],
      });
    } catch (error) {
      next(error);
    }
  }

  async login(req: Request, resp: Response, next: NextFunction) {
    try {
      debug('login:post', req.body.email);
      if (!req.body.email || !req.body.password)
        throw new HTTPError(401, 'Unauthorized', 'Invalid Email or password');
      const data = await this.repoUsers.search({
        key: 'email',
        value: req.body.email,
      });
      if (!data.length)
        throw new HTTPError(401, 'Unauthorized', 'Email not found');
      if (!(await Auth.compare(req.body.password, data[0].password)))
        throw new HTTPError(401, 'Unauthorized', 'Password not match');
      const payload: PayloadToken = {
        id: data[0].id,
        email: data[0].email,
        role: 'user',
      };
      const token = Auth.createJWT(payload);
      resp.status(202);
      resp.json({
        token,
        results: data[0],
      });
    } catch (error) {
      next(error);
    }
  }
}

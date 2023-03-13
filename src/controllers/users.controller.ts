import { Response, Request, NextFunction } from 'express';

import { FestivalRepo, UserRepo } from '../repository/repo.interface.js';
import { User } from '../entities/user.js';
import createDebug from 'debug';
import { HTTPError } from '../errors/errors.js';
import { Auth, PayloadToken } from '../services/auth.js';
import { PlusRequest } from '../interceptors/logged.js';
import { Festival } from '../entities/festival.js';
const debug = createDebug('FINPR:controller:users');

export class UsersController {
  constructor(
    public repoUsers: UserRepo<User>,
    public repoFestivals: FestivalRepo<Festival>
  ) {
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

  async addFavorite(req: PlusRequest, resp: Response, next: NextFunction) {
    try {
      debug('patch - add Favorite');
      if (!req.info) {
        throw new HTTPError(401, 'Unauthorized', 'Invalid information');
      }

      const user = await this.repoUsers.queryId(req.info.id);
      const fav = await this.repoFestivals.queryId(req.params.id);
      if (user.favoriteFestival.toString().includes(fav.id)) {
        throw new HTTPError(400, 'Bad request', 'This festival already exists');
      }

      user.favoriteFestival.push(fav);
      await this.repoUsers.update(user);
      resp.json({
        results: [user],
      });
    } catch (error) {
      next(error);
    }
  }

  async deleteFavorite(req: PlusRequest, resp: Response, next: NextFunction) {
    try {
      debug('patch - delete Favorite');
      if (!req.info) {
        throw new HTTPError(401, 'Unauthorized', 'Invalid information');
      }

      const user = await this.repoUsers.queryId(req.info.id);
      const fav = await this.repoFestivals.queryId(req.params.id);
      user.favoriteFestival = user.favoriteFestival.filter(
        (item) => item.id.toString() !== fav.id
      );
      await this.repoUsers.update(user);
      resp.json({
        results: [user],
      });
    } catch (error) {
      next(error);
    }
  }
}

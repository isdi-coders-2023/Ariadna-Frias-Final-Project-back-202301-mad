/* eslint-disable no-debugger */
import { Response, Request, NextFunction } from 'express';

import { FestivalRepo, UserRepo } from '../repository/repo.interface.js';
import { User } from '../entities/user.js';
import createDebug from 'debug';
import { HTTPError } from '../errors/errors.js';
import { Festival } from '../entities/festival.js';
import { PlusRequest } from '../interfaces/plusrequest.js';
const debug = createDebug('FINPR:controller:festivals');

export class FestivalsController {
  constructor(
    public repoUsers: UserRepo<User>,
    public repoFestivals: FestivalRepo<Festival>
  ) {
    debug('Instantiate');
  }

  async getAll(req: Request, resp: Response, next: NextFunction) {
    try {
      debug('getAll');
      const data = await this.repoFestivals.query();
      resp.json({
        results: data,
      });
    } catch (error) {
      next(error);
    }
  }

  async get(req: Request, resp: Response, next: NextFunction) {
    try {
      debug('get');
      const data = await this.repoFestivals.queryId(req.params.id);
      resp.json({
        results: [data],
      });
    } catch (error) {
      next(error);
    }
  }

  async post(req: PlusRequest, resp: Response, next: NextFunction) {
    try {
      debug('post');
      const userId = req.info?.id;
      debug('req:', req);
      debug('user Id:', req.info?.id);
      if (!userId) throw new HTTPError(404, 'Not found', 'Not found user id');
      await this.repoUsers.queryId(userId);
      req.body.owner = userId;
      const newFestival = await this.repoFestivals.create(req.body);
      resp.json({
        results: [newFestival],
      });
    } catch (error) {
      next(error);
    }
  }

  async patch(req: Request, resp: Response, next: NextFunction) {
    try {
      debug('patch');
      req.body.id = req.params.id ? req.params.id : req.body.id;
      const data = await this.repoFestivals.update(req.body);
      resp.json({
        results: [data],
      });
    } catch (error) {
      next(error);
    }
  }

  async delete(req: Request, resp: Response, next: NextFunction) {
    try {
      debug('delete');
      await this.repoFestivals.delete(req.params.id);
      resp.json({
        results: [],
      });
    } catch (error) {
      next(error);
    }
  }

  async filterMusic(req: Request, resp: Response, next: NextFunction) {
    try {
      debug('filter');
      if (!req.params.musicTypeFilter)
        throw new HTTPError(
          404,
          'Not found',
          `Filter ${req.params.musicTypeFilter} not found`
        );

      const musicFiltered = await this.repoFestivals.filter(
        req.params.musicTypeFilter
      );

      resp.status(201);
      resp.json({
        results: musicFiltered,
      });
    } catch (error) {
      next(error);
    }
  }
}

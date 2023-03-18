import { Response, NextFunction } from 'express';
import { PlusRequest } from './logged.js';
import createDebug from 'debug';
import { HTTPError } from '../errors/errors.js';
import { FestivalsMongoRepo } from '../repository/festivals.mongo.repo.js';

const debug = createDebug('FINPR:interceptor-authorized');

export async function authorized(
  req: PlusRequest,
  resp: Response,
  next: NextFunction,
  repoFestivals: FestivalsMongoRepo
) {
  debug('Authorization...');
  try {
    if (!req.info)
      throw new HTTPError(
        498,
        'Token not found',
        'Token not found in Authorized interceptor'
      );

    const userId = req.info.id;
    const festivalId = req.params.id;
    const festival = await repoFestivals.queryId(festivalId);
    debug('Festival', festival.owner);
    debug('User', userId);
    if (festival.owner.id !== userId)
      throw new HTTPError(401, 'Not authorized', 'Not authorized');
    next();
  } catch (error) {
    next(error);
  }
}

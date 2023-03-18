import { Router } from 'express';
import { FestivalsController } from '../controllers/festivals.controller.js';
import { logged } from '../interceptors/logged.js';

import { FestivalsMongoRepo } from '../repository/festivals.mongo.repo.js';
import { UsersMongoRepo } from '../repository/users.mongo.repo.js';

// eslint-disable-next-line new-cap
export const festivalsRouter = Router();

const repoUsers = new UsersMongoRepo();
const repoFestivals = new FestivalsMongoRepo();
const festivalController = new FestivalsController(repoUsers, repoFestivals);

festivalsRouter.get('/', festivalController.getAll.bind(festivalController));
festivalsRouter.get(
  '/:id',
  logged,
  festivalController.get.bind(festivalController)
);
festivalsRouter.post(
  '/',
  logged,
  festivalController.post.bind(festivalController)
);
festivalsRouter.patch(
  '/:id',
  logged,
  // Authorized,
  festivalController.patch.bind(festivalController)
);
festivalsRouter.delete(
  '/:id',
  logged,
  // Authorized,
  festivalController.delete.bind(festivalController)
);
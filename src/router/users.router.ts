import { Router } from 'express';
import { UsersController } from '../controllers/users.controller.js';
import { logged } from '../interceptors/logged.js';
import { UsersMongoRepo } from '../repository/users.mongo.repo.js';

// eslint-disable-next-line new-cap
export const usersRouter = Router();

const repoUsers = new UsersMongoRepo();

const userController = new UsersController(repoUsers);

usersRouter.get('/', logged, userController.getAll.bind(userController));
usersRouter.post('/register', userController.register.bind(userController));
usersRouter.post('/login', userController.login.bind(userController));

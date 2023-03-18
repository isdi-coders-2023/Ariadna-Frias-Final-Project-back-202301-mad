import morgan from 'morgan';
import cors from 'cors';
import createDebug from 'debug';
import express from 'express';

import { errorsMiddleware } from './middlewares/errors.middleware.js';
import { usersRouter } from './router/users.router.js';
import { festivalsRouter } from './router/festivals.router.js';

const debug = createDebug('FINPR:app');
export const app = express();
app.disable('x-powered-by');

const corsOptions = {
  origin: '*',
};
app.use(morgan('dev'));
app.use(express.json());
app.use(cors(corsOptions));

app.use('/users', usersRouter);
app.use('/festivals', festivalsRouter);

app.get('/', (_req, resp) => {
  resp.json({
    info: 'Final project - FestivApp',
    endpoints: {
      users: '/users',
      festivals: '/festivals',
    },
  });
});

app.use(errorsMiddleware);

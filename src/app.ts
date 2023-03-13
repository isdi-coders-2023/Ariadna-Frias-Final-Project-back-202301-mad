import morgan from 'morgan';
import cors from 'cors';
import createDebug from 'debug';
import express from 'express';

import { errorsMiddleware } from './middlewares/errors.middleware.js';

const debug = createDebug('FINPR:app');
export const app = express();
app.disable('x-powered-by');

const corsOptions = {
  origin: '*',
};
app.use(morgan('dev'));
app.use(express.json());
app.use(cors(corsOptions));

// App.use('/users', usersRouter);

app.get('/', (_req, resp) => {
  resp.json({
    info: 'Final project - FestivApp',
    endpoints: {
      users: '/users',
    },
  });
});

app.use(errorsMiddleware);

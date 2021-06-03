import createError from 'http-errors';
import express from 'express';
import session from 'express-session';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import { GameRouter } from './routes';
import cors from 'cors';
import { v4 } from 'uuid';

const env = process.env.NODE_ENV;
const app = express();

app.use(
  cors({
    origin: env === 'production' ? 'https://ttt-client.herokuapp.com' : '',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    preflightContinue: false,
    optionsSuccessStatus: 204
  })
);
app.set('trust proxy', 1)
app.use(
  session({
    secret: v4(),
    resave: false,
    saveUninitialized: true,
    cookie: { secure:true, maxAge: 3600000 }
  })
);
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use('/api/v1/games', (req, _res, next) => {
  req.session.games = req.session.games || [];
  next();
});
app.use('/api/v1/games', GameRouter);
app.use(function (_req, _res, next) {
  // catch 404 and forward to error handler
  next(createError(404));
});
app.use((err, req, res, _next) => {
  // error handler
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  res.status(err.status || 500);
  res.json(err);
});

export default app;

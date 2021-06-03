import createError from 'http-errors';
import express from 'express';
import session from 'express-session';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import { v4 as uuidv4 } from 'uuid';
import { router } from './routes/games';

const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(
  session({
    genid: (req) => uuidv4(),
    secret: 'yes',
    resave: false,
    saveUninitialized: false
  })
);
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use('/api/v1/games', router);
app.use(function (req, res, next) {
  // catch 404 and forward to error handler
  next(createError(404));
});
app.use(function (err, req, res, next) {
  // error handler
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  res.status(err.status || 500);
  res.json(err);
});

export default app;

import dotenv from 'dotenv';
import express, { Request, Response } from 'express';
import cors from 'cors';
import ApiRouter from '@api/router';
import Middleware from '@utils/middleware';
import path from 'path';

//consts for express
dotenv.config();
const app = express();

//middleware
app.use(cors({ origin: '*' }));

//app.use(Helmet({}));
app.use(express.static(path.join(__dirname, '/../public')));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//routes
app.get('/', (_req: Request, res: Response) => {
  res.send('@LudGeo API');
});
app.use('/api/v1', ApiRouter);

//error handling
app.use(Middleware.NotFound);
app.use(Middleware.ErrorHandler);

export default app;

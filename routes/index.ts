import express from 'express';
import viewRouter from './view';
import openaiRouter from './openai';
import apiRouter from './api';

const setupRoutes = (app: express.Application) => {
  app.use('/', viewRouter);
  app.use('/openai', openaiRouter);
  app.use('/api', apiRouter);
};

export default setupRoutes;
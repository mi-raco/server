import express from 'express';
import viewsRouter from './views';
import openaiRouter from './openai';
import llmRouter from './llm';
import dataRouter from './data'

const setupRoutes = (app: express.Application) => {
  app.use('/views', viewsRouter);
  app.use('/openai', openaiRouter);
  app.use('/llm', llmRouter);
  app.use('/dataAPI', dataRouter);
};

export default setupRoutes;
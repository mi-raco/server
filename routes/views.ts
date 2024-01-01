import express, { Request, Response } from 'express';

export default express.Router().use(express.json())
.get('/', (req: Request, res: Response) => {
  res.render('index', { title: 'Express' });
});
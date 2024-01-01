import express, { Request, Response } from 'express';
import { RequestData, dataMap } from '../services/integrations/mongoDataAPI';

export default express.Router().use(express.json())
.post('/', async (req: Request, res: Response) => {
  const action: string = req.body.action;
  const data: RequestData = req.body.data;
  const response = await dataMap[action](data)
  return res.status(200).json(response);
});
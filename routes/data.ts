import express, { Request, Response } from 'express';
import { RequestData, dataMap } from '../services/integrations/mongoDataAPI';

export default express.Router().use(express.json())
.post('/', async (req: Request, res: Response) => {
  const dataAction: string = req.body.dataAction;
  const data: RequestData = req.body.data;
  const response = await dataMap[dataAction](data)
  return res.status(200).json(response);
});
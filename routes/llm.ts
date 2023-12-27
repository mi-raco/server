import chatBot from '../services/threads';
import dataAPI from '../services/integrations/mongoDataAPI';
import express, { Request, Response } from 'express';

export default express.Router().use(express.json())
.post('/action', async (req: Request, res: Response) => {
  const { endUserId, actionId, parameters} = req.body;


  
  


});
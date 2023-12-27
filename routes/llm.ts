import express, { Request, Response } from 'express';
import promptVersions from '../services/promptVersions';


export default express.Router().use(express.json())
.post('/action', async (req: Request, res: Response) => {
  const { endUserId, actionId, parameters} = req.body;
  const promptVersion = await promptVersions.getLivePromptVersion(actionId);
  

});
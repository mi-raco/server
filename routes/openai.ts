import express, { Request, Response } from 'express';
import openaiAPI from '../integrations/openaiAPI';

export default express.Router().use(express.json())
.post('/askAssistant', async (req: Request, res: Response) => {
  const { content, assistant_id, thread_id = null } = req.body;
  const [text, t_id] = await openaiAPI.askAssistant(content, assistant_id, thread_id);
  res.send({ text, t_id });
})
.post('/anotherEndpoint', async (req: Request, res: Response) => {
  // Handle the request for the second endpoint here
});
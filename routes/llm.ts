import express, { Request, Response } from 'express';
import promptVersions from '../services/promptVersions';
import completions from '../services/completions';


export default express.Router().use(express.json())
.post('/action', async (req: Request, res: Response) => {
  const { actionId, parameters } = req.body;
  const promptVersion = await promptVersions.getLivePromptVersion(actionId);
  const user_input = promptVersions.populateUserInputTemplate(promptVersion, parameters);
  const response = await completions.createCompletionFromUserInput(
    user_input, 
    promptVersion.template[0].content,
    parameters.thread_id ?? undefined
  );
  if (response) {
    response.completion = JSON.parse(response.completion);
  }
  res.send(response);    
});
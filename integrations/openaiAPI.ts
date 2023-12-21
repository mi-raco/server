import { OpenAI } from "openai";
import dotenv from 'dotenv';
dotenv.config();

const getClient = (
  apiKey = process.env.OPENAI_API_KEY,
  organization = process.env.ORGANIZATION_ID
) => { 
  return new OpenAI({apiKey: apiKey, organization: organization});
};

export default {
  systemClient: getClient(),

  async listModels(
    client=getClient()
  ){
    const list = await client.models.list();
    return list;
  },

  async newThreadBeta(
    client=getClient()
  ){
    const emptyThread = await client.beta.threads.create();
    return emptyThread;
  },

  async getThreadBeta(
    thread_id: string, 
    client=getClient()
  ){
    const thread = await client.beta.threads.retrieve(thread_id);
    return thread;
  },

  async listMessagesBeta(
    thread_id: string, 
    client=getClient()
  ){
    const response = await client.beta.threads.messages.list(
      thread_id
    );
    return response;
  },

  async getMessageBeta(
    message_id: string, 
    thread_id: string, 
    client=getClient()
  ){
    const message = await client.beta.threads.messages.retrieve(
      thread_id, 
      message_id
    );
    return message;
  },

  async addMessageBeta(
    content: string, 
    thread_id: string, 
    client=getClient()
  ){
    const response = await client.beta.threads.messages.create(
      thread_id,
      { role: "user", content: content }
    );
    return response;
  },

  async newRunBeta(
    thread_id: string, 
    assistant_id: string, 
    client=getClient()
  ){
    assistant_id = assistant_id ?? process.env.ASSISTANT_ID;
    const run = await client.beta.threads.runs.create(
      thread_id,
      { assistant_id: assistant_id }
    );
    return run;
  },

  async listRunsBeta(
    thread_id: string, 
    client=getClient()
  ){
    const runs = await client.beta.threads.runs.list(
      thread_id
    );
    return runs;
  },

  async getRunBeta(
    run_id: string,
    thread_id: string,
    client=getClient()
  ){
    const run = await client.beta.threads.runs.retrieve(
      thread_id, 
      run_id
    );
    return run;
  },

  async listRunStepsBeta(
    run_id: string, 
    thread_id: string, 
    client=getClient()
  ){
    const runSteps = await client.beta.threads.runs.steps.list(
      thread_id,
      run_id
    );
    return runSteps;
  },

  async getRunStepBeta(
    run_id: string, 
    step_id: string, 
    thread_id: string, 
    client=getClient()
  ){
    const runStep = await client.beta.threads.runs.steps.retrieve(
      thread_id,
      run_id,
      step_id
    );
    return runStep;
  },

  async completionSystemLast(
    system_instructions: string,
    messages=[],
    model="gpt-4-1106-preview",
    max_tokens=4096,
    n=1,
    temperature=0.8,
    client=getClient()
  ){
    const response = await client.chat.completions.create({
      messages: [...messages,
                {role: "system", content: system_instructions}],
      model: model,
      max_tokens: max_tokens,
      n: n,
      temperature: temperature
    })
    const result = response.choices[0].message.content;
    return result;
  },

  async completionSystemFirst(
    system_instructions: string,
    messages=[],
    model="gpt-4-1106-preview",
    max_tokens=4096,
    n=1,
    temperature=0.8,
    client=getClient()
  ){
    const response = await client.chat.completions.create({
      messages: [{role: "system", content: system_instructions},
                ...messages],
      model: model,
      max_tokens: max_tokens,
      n: n,
      temperature: temperature
    })
    const result = response.choices[0].message.content;
    return result;
  },

  async completionSystemInUserLast(
    system_instructions: string,
    messages=[],
    model="gpt-4-1106-preview",
    max_tokens=4096,
    n=1,
    temperature=0.8,
    client=getClient()
  ){
    const response = await client.chat.completions.create({
      messages: [...messages,
                {role: "user", content: `<system_instructions>${system_instructions}</system_instructions>`}],
      model: model,
      max_tokens: max_tokens,
      n: n,
      temperature: temperature
    })
    const result = response.choices[0].message.content;
    return result;
  },

  async completionSystemInUserFirst(
    system_instructions: string,
    messages=[],
    model="gpt-4-1106-preview",
    max_tokens=4096,
    n=1,
    temperature=0.8,
    client=getClient()
  ){
    const response = await client.chat.completions.create({
      messages: [{role: "user", content: `<system_instructions>${system_instructions}</system_instructions>`},
                ...messages],
      model: model,
      max_tokens: max_tokens,
      n: n,
      temperature: temperature
    })
    const result = response.choices[0].message.content;
    return result;
  },

  async askAssistant(
    content: string,
    assistant_id: string,
    thread_id?: string
  ){
    const thread = !thread_id ? await this.newThreadBeta() : await this.getThreadBeta(thread_id);
    await this.addMessageBeta(content, thread.id);
    const run_id = await this.newRunBeta(thread.id, assistant_id).then((run: { id: any; }) => run.id);
    const response = await this.checkThread(thread.id, run_id);
    return [response, thread.id];
  },

  async checkThread(
    thread_id: string, 
    run_id: string, 
    attempts = 90
  ): Promise<string> {
    while (attempts > 0) {
      console.log("Checking thread - attempts left: " + attempts);
      const steps = await this.listRunStepsBeta(run_id, thread_id);
      // const last_step_id = steps.body.first_id;
      // if (last_step_id != null) {
      //   const step = await this.getRunStepBeta(run_id, last_step_id, thread_id);
      //   const message_id = step.step_details?.message_creation.message_id;
      //   if (step.status === "completed") {
      //     const message = await this.getMessageBeta(message_id, thread_id);
      //     return message.content[0].text.value;
      //   }
      // }
      attempts--;
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
    return "No response";
  },
}
import { OpenAI } from "openai";
require('dotenv').config();

function getClient(
  apiKey=process.env.OPENAI_API_KEY,
  organization=process.env.ORGANIZATION_ID
) { 
  return new OpenAI({apiKey: apiKey, organization: organization});
};

const systemClient = getClient();

export default {
  async listModels(
    client=systemClient
  ){
    const list = await client.models.list();
    return list;
  },

  async newThreadBeta(
    client=systemClient
  ){
    const emptyThread = await client.beta.threads.create();
    return emptyThread;
  },

  async getThreadBeta(
    thread_id: string, 
    client=systemClient
  ){
    const thread = await client.beta.threads.retrieve(thread_id);
    return thread;
  },

  async listMessagesBeta(
    thread_id: string, 
    client=systemClient
  ){
    const response = await client.beta.threads.messages.list(
      thread_id
    );
    return response;
  },

  async getMessageBeta(
    message_id: string, 
    thread_id: string, 
    client=systemClient
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
    client=systemClient
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
    client=systemClient
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
    client=systemClient
  ){
    const runs = await client.beta.threads.runs.list(
      thread_id
    );
    return runs;
  },

  async getRunBeta(
    run_id: string,
    thread_id: string,
    client=systemClient
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
    client=systemClient
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
    client=systemClient
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
    client=systemClient
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
    client=systemClient
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
    client=systemClient
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
    client=systemClient
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
    const thread = thread_id ? await module.exports.newThread() : await module.exports.getThread(thread_id);
    await module.exports.addMessage(content, thread.id);
    const run_id = await module.exports.newRun(thread.id, assistant_id).then((run: { id: any; }) => run.id);
    const response = await module.exports.checkThread(thread.id, run_id);
    return [response, thread.id];
  },

  async checkThread(
    thread_id: string, 
    run_id: string, 
    attempts=90
  ){
    while (attempts > 0) {
      console.log("Checking thread - attempts left: " + attempts);
      const steps = await module.exports.listRunSteps(run_id, thread_id);
      const last_step_id = steps.body.first_id;
      if (!(last_step_id == null)) {
        const step = await module.exports.getRunStep(run_id, last_step_id, thread_id);
        const message_id = step.step_details.message_creation.message_id;
        if (step.status === "completed") {
          const message = await module.exports.getMessage(message_id, thread_id);
          return message.content[0].text.value
        }
      }
      attempts--;
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
    return "No response";
  },
}
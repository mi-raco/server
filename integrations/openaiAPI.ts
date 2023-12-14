const { OpenAI } = require("openai");
require('dotenv').config();

module.exports = {
  getClient(
    apiKey=process.env.OPENAI_API_KEY,
    organisation=process.env.ORGANIZATION_ID) { 
      return new OpenAI({apiKey:apiKey, organisation:organisation});
  },

  async listModels(client=systemClient){
    const list = await client.models.list();
    return list;
  },

  async newThread(client=systemClient){
    const emptyThread = await client.beta.threads.create();
    return emptyThread;
  },

  async getThread(thread_id, client=systemClient){
    const thread = await client.beta.threads.retrieve(thread_id);
    return thread;
  },

  async listMessages(thread_id, client=systemClient){
    const response = await client.beta.threads.messages.list(
      thread_id
    );
    return response;
  },

  async getMessage(message_id, thread_id, client=systemClient){
    const message = await client.beta.threads.messages.retrieve(
      thread_id, 
      message_id
    );
    return message;
  },

  async addMessage(content, thread_id, client=systemClient){
    const response = await client.beta.threads.messages.create(
      thread_id,
      { role: "user", content: content }
    );
    return response;
  },

  async newRun(thread_id, assistant_id=process.env.ASSISTANT_ID, client=systemClient){
    const run = await client.beta.threads.runs.create(
      thread_id,
      { assistant_id: assistant_id }
    );
    return run;
  },

  async listRuns(thread_id, client=systemClient){
    const runs = await client.beta.threads.runs.list(
      thread_id
    );
    return runs;
  },

  async getRun(run_id, thread_id, client=systemClient){
    const run = await client.beta.threads.runs.retrieve(
      thread_id, 
      run_id
    );
    return run;
  },

  async listRunSteps(run_id, thread_id, client=systemClient){
    const runSteps = await client.beta.threads.runs.steps.list(
      thread_id,
      run_id
    );
    return runSteps;
  },

  async getRunStep(run_id, step_id, thread_id, client=systemClient){
    const runStep = await client.beta.threads.runs.steps.retrieve(
      thread_id,
      run_id,
      step_id
    );
    return runStep;
  },

  completionSystemLast: async (
    system_instructions,
    messages=[],
    model="gpt-4-1106-preview",
    max_tokens=4096,
    n=1,
    temperature=0.8,
    client=systemClient
    ) =>
    {
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
    system_instructions,
    messages=[],
    model="gpt-4-1106-preview",
    max_tokens=4096,
    n=1,
    temperature=0.8,
    client=systemClient)
    {
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
    system_instructions,
    messages=[],
    model="gpt-4-1106-preview",
    max_tokens=4096,
    n=1,
    temperature=0.8,
    client=systemClient)
    {
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
    system_instructions,
    messages=[],
    model="gpt-4-1106-preview",
    max_tokens=4096,
    n=1,
    temperature=0.8,
    client=systemClient)
    {
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

  async askAssistant(content, assistant_id, thread_id=null){
    const thread = thread_id == null ? await this.newThread() : await this.getThread(thread_id);
    await this.addMessage(content, thread.id);
    const run_id = await this.newRun(thread.id, assistant_id).then((run) => run.id);
    const response = await this.checkThread(thread.id, run_id);
    return [response, thread.id];
  },

  async checkThread(thread_id, run_id, attempts=90){
    while (attempts > 0) {
      console.log("Checking thread - attempts left: " + attempts);
      const steps = await this.listRunSteps(run_id, thread_id);
      const last_step_id = steps.body.first_id;
      if (!(last_step_id == null)) {
        const step = await this.getRunStep(run_id, last_step_id, thread_id);
        const message_id = step.step_details.message_creation.message_id;
        if (step.status === "completed") {
          const message = await this.getMessage(message_id, thread_id);
          return message.content[0].text.value
        }
      }
      attempts--;
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
    return "No response";
  },
}

const systemClient = module.exports.getClient();
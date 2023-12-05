const { OpenAI } = require("openai");
require('dotenv').config();

module.exports = {
  getClient(
    apiKey=process.env.OPENAI_API_KEY,
    organisation=process.env.ORGANIZATION_ID) { 
      return new OpenAI({
        apiKey: apiKey,
        organization: organisation
      })
  },

  async listModels(client=this.getClient()){
    const list = await client.models.list();
    return list;
  },

  async newThread(client=this.getClient()){
    const emptyThread = await client.beta.threads.create();
    return emptyThread;
  },

  async getThread(thread_id, client=this.getClient()){
    const thread = await client.beta.threads.retrieve(thread_id);
    return thread;
  },

  async listMessages(thread_id, client=this.getClient()){
    const response = await client.beta.threads.messages.list(
      thread_id
    );
    return response;
  },

  async getMessage(message_id, thread_id, client=this.getClient()){
    const message = await client.beta.threads.messages.retrieve(
      thread_id, 
      message_id
    );
    return message;
  },

  async addMessage(content, thread_id, client=this.getClient()){
    const response = await client.beta.threads.messages.create(
      thread_id,
      { role: "user", content: content }
    );
    return response;
  },

  async newRun(thread_id, assistant_id=process.env.ASSISTANT_ID, client=this.getClient()){
    const run = await client.beta.threads.runs.create(
      thread_id,
      { assistant_id: assistant_id }
    );
    return run;
  },

  async listRuns(thread_id, client=this.getClient()){
    const runs = await client.beta.threads.runs.list(
      thread_id
    );
    return runs;
  },

  async getRun(run_id, thread_id, client=this.getClient()){
    const run = await client.beta.threads.runs.retrieve(
      thread_id, 
      run_id
    );
    return run;
  },

  async listRunSteps(run_id, thread_id, client=this.getClient()){
    const runSteps = await client.beta.threads.runs.steps.list(
      thread_id,
      run_id
    );
    return runSteps;
  },

  async getRunStep(run_id, step_id, thread_id, client=this.getClient()){
    const runStep = await client.beta.threads.runs.steps.retrieve(
      thread_id,
      run_id,
      step_id
    );
    return runStep;
  },

  async completionSystemLast(
    user_input,
    system_instructions,
    messages=[],
    model="gpt-4-1106-preview",
    max_tokens=4096,
    n=1,
    temperature=0.8,
    client=this.getClient())
    {
      const response = await client.chat.completions.create({
        messages: [...messages,
                  {role: "user", content: user_input},
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
    user_input,
    system_instructions,
    messages=[],
    model="gpt-4-1106-preview",
    max_tokens=4096,
    n=1,
    temperature=0.8,
    client=this.getClient())
    {
      const response = await client.chat.completions.create({
        messages: [{role: "system", content: system_instructions},
                  ...messages,
                  {role: "user", content: user_input}],
        model: model,
        max_tokens: max_tokens,
        n: n,
        temperature: temperature
      })
      const result = response.choices[0].message.content;
      return result;
  },

  async completionSystemInUserLast(
    user_input,
    system_instructions,
    messages=[],
    model="gpt-4-1106-preview",
    max_tokens=4096,
    n=1,
    temperature=0.8,
    client=this.getClient())
    {
      const response = await client.chat.completions.create({
        messages: [...messages,
                  {role: "user", content: `<user_input>${user_input}</user_input>,<system_instructions>${system_instructions}</system_instructions>`}],
        model: model,
        max_tokens: max_tokens,
        n: n,
        temperature: temperature
      })
      const result = response.choices[0].message.content;
      return result;
  },

  async completionSystemInUserFirst(
    user_input,
    system_instructions,
    messages=[],
    model="gpt-4-1106-preview",
    max_tokens=4096,
    n=1,
    temperature=0.8,
    client=this.getClient())
    {
      const response = await client.chat.completions.create({
        messages: [{role: "user", content: `<system_instructions>${system_instructions}</system_instructions>`},
                  ...messages,
                  {role: "user", content: `<user_input>${user_input}</user_input>`}],
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
    await addMessage(content, thread.id);
    const run_id = await startRun(thread.id, assistant_id).then((run) => run.id);
    const response = await checkThread(thread.id, run_id);
    return [response, thread.id];
  },

  async checkThread(thread_id, run_id, attempts=60){
    while (attempts > 0) {
      console.log("Checking thread - attempts left: " + attempts + "");
      const last_step_id = await this.listRunSteps(run_id, thread_id).then((steps) => steps.body.first_id);
      if (!(last_step_id == null)) {
        const step = await this.getRunStep(run_id, last_step_id, thread_id);
        if (step.status === "completed") {
          const message = await this.getMessage(step.step_details.message_creation.message_id, thread_id);
          return message.content[0].text.value
        }
      }
      attempts--;
      await new Promise(resolvesetTimeout(resolve, 1000));
    }
    return "No response";
  },
}
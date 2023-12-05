const openaiAPI = require('../integrations/openaiAPI');
const dataAPI = require('../integrations/mongoDataAPI');

module.exports = {
  async addMessage(content, role, thread_id, data=dataAPI) {
    const filter={"_id": {"$oid": thread_id }}
    const thread = await data.findOne(collection="threads", filter);
    thread.document.messages.push({content,role});
    const update = {"$set": {"messages": thread.document.messages}};
    const response = await data.updateOne('threads', filter, update);
    return response;
  },

  async newThread(data=dataAPI) {
    const response = await data.insertOne('threads', {
      messages: []
    });
    return response;
  },

  async createCompletion(
            system_instructions,
            thread_id,
            openAICompletion,
            data=dataAPI) {
    const filter={"_id": {"$oid": thread_id }}
    const thread = await data.findOne(collection="threads", filter).then((response) => response.document);
    const completion = await openAICompletion(
      system_instructions,
      thread.messages
    )
    await this.addMessage(
      message=completion,
      role="assistant",
      thread_id=thread_id
    )
    return completion;
  },

  async addChatResponse(content, system_instructions, thread_id) {
    await this.addMessage(content, "user", thread_id);
    const completion = await this.createCompletion(
      system_instructions,
      thread_id,
      openaiAPI.completionSystemLast
    );
    return completion;
  }
};

async function main() {
  const thread = await module.exports.newThread();
  const system_instructions = "You are a grumpy old sailor. We are both in a restaurant and I just spilled your coffee." +
                              "Don't break character, read the entire conversation history and respond succintly, be in the moment.";
  const content = "Hey there, sorry I didn't see you there. I'll get you a new coffee.";
  const response = await module.exports.addChatResponse(content, system_instructions, thread.insertedId);
  console.log(response);
}

if (require.main === module) {
  main();
}
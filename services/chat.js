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
  openai=openaiAPI,
  data=dataAPI) {
    const filter={"_id": {"$oid": thread_id }}
    const thread = await data.findOne(collection="threads", filter).then((response) => response.document);
    const completion = await openai.completionSystemLast(
      system_instructions,
      messages=thread.messages
    )
    await this.addMessage(
      message=completion,
      role="assistant",
      thread_id=thread_id
    )
    return completion;
  }
};
import dataAPI from './integrations/mongoDataAPI';

export default {
  async addMessageToThread(
    content: string, 
    role: string, 
    thread_id: string, 
    data=dataAPI
    ){
    const filter={"_id": {"$oid": thread_id }}
    const thread = await data.findOne("threads", filter);
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
};
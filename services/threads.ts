import dataAPI from './integrations/mongoDataAPI';

export default {
  async addMessageToThread(
    content: string, 
    role: string, 
    thread_id: string, 
    data=dataAPI
    ){
    const filter={"_id": {"$oid": thread_id }}
    const thread = await data.findOne({
      collection: "threads", 
      filter: filter
    }).then((response) => response.document);
    thread.messages.push({content,role});
    const update = {"messages": thread.messages};
    const response = await data.updateOne({collection:'threads', filter, update});
    return response;
  },

  async newThread(data=dataAPI) {
    const response = await data.insertOne({
      collection: 'threads', 
      document: {
        messages: []
      }
    });
    return response;
  },
};
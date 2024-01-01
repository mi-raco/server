import openaiAPI from './integrations/openaiAPI';
import dataAPI from './integrations/mongoDataAPI';
import threads from './threads';
import { Collection } from 'mongodb';

export default {
  async requestCompletion(
    system_instructions: string,
    thread_id: string,
    openAICompletionStrategy: Function
    ){
    const filter={"_id": {"$oid": thread_id }}
    const thread = await dataAPI.findOne({
      collection: "threads", 
      filter: filter
    }).then((response) => response.document);
    const completion = await openAICompletionStrategy(system_instructions, thread.messages)
    await threads.addMessageToThread(completion, "assistant", thread_id)
    return completion;
  },

  async createCompletionFromUserInput(
    content: string, 
    system_instructions: string, 
    thread_id?: string, 
    openAICompletionStrategy?: Function
    ){
    thread_id = thread_id ?? (await threads.newThread()).insertedId;
    openAICompletionStrategy = openAICompletionStrategy ?? openaiAPI.completionSystemFirst;
    if (thread_id) {
      await threads.addMessageToThread(content, "user", thread_id);
      const completion = await this.requestCompletion(
        system_instructions,
        thread_id,
        openAICompletionStrategy
      );
      return {completion, thread_id};
    }
  }
};
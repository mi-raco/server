import openaiAPI from './integrations/openaiAPI';
import dataAPI from './integrations/mongoDataAPI';
import threadsAPI from './threads';

export default {
  async requestCompletion(
    system_instructions: string,
    thread_id: string,
    openAICompletionStrategy: Function
    ){
    const filter={"_id": {"$oid": thread_id }}
    const thread = await dataAPI.findOne("threads", filter).then((response) => response.document);
    const completion = await openAICompletionStrategy(system_instructions, thread.messages)
    await threadsAPI.addMessageToThread(completion, "assistant", thread_id)
    return completion;
  },

  async createCompletionFromUserInput(
    content: string, 
    system_instructions: string, 
    thread_id?: string, 
    openAICompletionStrategy?: Function
    ){
    thread_id = thread_id ?? (await threadsAPI.newThread()).insertedId;
    openAICompletionStrategy = openAICompletionStrategy ?? openaiAPI.completionSystemFirst;
    if (thread_id) {
      await threadsAPI.addMessageToThread(content, "user", thread_id);
      const completion = await this.requestCompletion(
        system_instructions,
        thread_id,
        openAICompletionStrategy
      );
      return {completion, thread_id};
    }
  }
};
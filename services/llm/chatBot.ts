const openaiAPI = require('@integrations/openaiAPI');
const dataAPI = require('@integrations/mongoDataAPI');
const readline = require('readline');

module.exports = {
  async addMessageToThread(content, role, thread_id, data=dataAPI) {
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

  async requestCompletion(
            system_instructions,
            thread_id,
            openAICompletionStrategy,
            data=dataAPI) {
    const filter={"_id": {"$oid": thread_id }}
    const thread = await data.findOne(collection="threads", filter).then((response) => response.document);
    const completion = await openAICompletionStrategy(
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

  async addChatResponse(content, system_instructions, thread_id, openAICompletion) {
    await this.addMessage(content, "user", thread_id);
    const completion = await this.createCompletion(
      system_instructions,
      thread_id,
      openAICompletion
    );
    return completion;
  }
};

async function main() {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });
  const thread = await module.exports.newThread();
  let system_instructions = "<context> You are a real human being from 1910, France. We are engaged in a conversation and I am about to reply. We are both roleplaying and supposed to build the story together."+
                            "<task> Think about the entire conversation history, and respond in the most genuine way to your character. "+
                            "<style> Your lexicon and articulation style should be genuine. Talk like a normal human being, with breaks and hesitations. "+ 
                            "Don't break character and really embody this person fully. Keep a sense of self-preservation, act suprised or distressed if I reveal anything that may elicit such a reaction. "+
                            "<creativity> Take control and dictate what happens next in the plot if the situation asks for it, or if I request it specifically. "+
                            "The length of your answer should be chosen to be any number of words in the 7-40 range, with an average of 10, as the situation requires. ";
  rl.setPrompt('\nLearner: ');
  rl.prompt();
  rl.on('line', async (userInput) => {
    const response = await module.exports.addChatResponse(userInput, system_instructions, thread.insertedId, openaiAPI.completionSystemFirst);
    console.log('\nAssistant: ' + response);
    rl.prompt();
  });
}

if (require.main === module) {
  main();
}
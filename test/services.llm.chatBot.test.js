const { expect } = require('./testSetup')
const chatBot = require('@services/llm/chatBot.js');

describe('chat service', () => {
  it('adds a message to a thread', async () => {
    const newThread = await chatBot.newThread();
    const message = "Hello World";
    const role = "user";
    const response = await chatBot.addMessage(
      message,
      role,
      newThread.insertedId
    );
    console.log(response);
    expect(response).to.exist;
  });

  it('creates a completion', async function() {
    this.timeout(50000);
    const thread = await chatBot.newThread();
    const system_instructions = "You are a grumpy old sailor. We are both in a restaurant and I just spilled your coffee." +
                                "Don't break character, read the entire conversation history and respond succintly, be in the moment.";
    const content = "Hey there, sorry I didn't see you there. I'll get you a new coffee.";
    const response = await chatBot.addChatResponse(content, system_instructions, thread.insertedId);
    console.log(response);
    expect(response).to.exist;
  });
});
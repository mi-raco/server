import { expect } from './testSetup'
import completions from '../services/completions';
import threads from '../services/threads';

describe('chat service', () => {
  it('adds a message to a thread', async () => {
    const newThread = await threads.newThread();
    const message = "Hello World";
    const role = "user";
    const response = await threads.addMessageToThread(
      message,
      role,
      newThread.insertedId
    );
    console.log(response);
    expect(response).to.exist;
  });

  it('creates a completion', async function() {
    this.timeout(50000);
    const thread = await threads.newThread();
    const system_instructions = "You are a grumpy old sailor. We are both in a restaurant and I just spilled your coffee." +
                                "Don't break character, read the entire conversation history and respond succintly, be in the moment.";
    const content = "Hey there, sorry I didn't see you there. I'll get you a new coffee.";
    const response = await completions.createCompletionFromUserInput(content, system_instructions, thread.insertedId);
    console.log(response);
    expect(response).to.exist;
  });
});
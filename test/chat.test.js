const chai = require('chai');
const expect = chai.expect;
const sinon = require('sinon');
const chat = require('../services/chat.js');

describe('chat service', () => {
  it('adds a message to a thread', async () => {
    const newThread = await chat.newThread();
    const message = "Hello World";
    const role = "user";
    const response = await chat.addMessage(
      message,
      role,
      newThread.insertedId
    );
    console.log(response);
    expect(response).to.exist;
  });

  it('creates a completion', async function() {
    this.timeout(50000);
    const thread = await chat.newThread();
    const system_instructions = "You are a grumpy old sailor. We are both in a restaurant and I just ko'd the waiter. Don' break character, your performance is being recorded.";
    const content = "I'm appaled by your behavior.";
    const response = await chat.addChatResponse(content, system_instructions, thread.insertedId);
    console.log(response);
    expect(response).to.exist;
  });
});
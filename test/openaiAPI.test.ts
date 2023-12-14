const chai = require('chai');
const expect = chai.expect;
const sinon = require('sinon');
const { OpenAI } = require('openai');
const { getClient, listModels } = require('@integrations/openaiAPI');

describe('OpenAI API functions', () => {
  let mockClient;
  let realClient;

  beforeEach(() => {
    realClient = getClient();
    mockClient = new OpenAI({
      apiKey: 'fake-api-key',
      organization: 'fake-organization-id',
    });
  });

  it('lists mocked models', async () => {
    const modelsStub = sinon.stub(mockClient.models, 'list').returns(Promise.resolve({ models: ['model1', 'model2'] }));
    const result = await listModels(mockClient);
    expect(modelsStub.calledOnce).to.be.true;
    expect(result).to.deep.equal({ models: ['model1', 'model2'] });
  });

  it('lists real models', async () => {
    const modelsSpy = sinon.spy(realClient.models, 'list');
    const result = await listModels(realClient);
    expect(modelsSpy.calledOnce).to.be.true;
    expect(result.data.map(item => item.id)).includes('gpt-4');
  });
});
import { expect, sinon } from './testSetup'
import { OpenAI } from 'openai';
import openaiAPI from '../integrations/openaiAPI';

describe('OpenAI API functions', () => {
  let mockClient: OpenAI;

  beforeEach(() => {
    mockClient = new OpenAI({
      apiKey: 'fake-api-key',
      organization: 'fake-organization-id',
    });
  });

  it('lists mocked models', async () => {
    const modelsStub = sinon.stub(mockClient.models, 'list').returns(
      Promise.resolve({ models: ['model1', 'model2'] })
    );
    const result = await openaiAPI.listModels(mockClient);
    expect(modelsStub.calledOnce).to.be.true;
    expect(result).to.deep.equal({ models: ['model1', 'model2'] });
  });

  it('lists real models', async () => {
    const result = await openaiAPI.listModels();
    expect(result.data.map((item: { id: any; }) => item.id)).includes('gpt-4');
  });
});
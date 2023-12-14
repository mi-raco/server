import { expect } from './testSetup'
import dataAPI from '../integrations/mongoDataAPI';

describe('MongoDB Data API functions', () => {
  it('findOne returns something', async () => {
    const response = await dataAPI.findOne("threads");
    console.log(response);
    expect(response).to.exist;
  });

  it('insertOne inserts a new document', async () => {
    const response = await dataAPI.insertOne(
      "threads",
      {"title": "Test Title", "author": "Test Author"}
    );
    console.log(response);
    expect(response).to.exist;
  });

  it('deleteOne deletes a document', async () => {
    const response = await dataAPI.deleteOne(
      "threads",
    );
    console.log(response);
    expect(response).to.exist;
  });
});
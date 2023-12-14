import { expect, sinon } from './testSetup';
import mongoDB from '@integrations/mongoDataAPI';

describe('MongoDB Data API functions', () => {
  it('findOne returns something', async () => {
    const response = await mongoDB.findOne("threads");
    console.log(response);
    expect(response).to.exist;
  });

  it('insertOne inserts a new document', async () => {
    const response = await mongoDB.insertOne(
      "threads",
      {"title": "Test Title", "author": "Test Author"}
    );
    console.log(response);
    expect(response).to.exist;
  });

  it('deleteOne deletes a document', async () => {
    const response = await mongoDB.deleteOne(
      collection="threads",
      filter={}
    );
    console.log(response);
    expect(response).to.exist;
  });
});
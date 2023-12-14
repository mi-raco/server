const chai = require('chai');
const expect = chai.expect;
const sinon = require('sinon');
const mongoDB = require('@integrations/mongoDataAPI');
require('dotenv').config();

describe('MongoDB Data API functions', () => {
  it('findOne returns something', async () => {
    const response = await mongoDB.findOne(
      collection="threads"
    );
    console.log(response);
    expect(response).to.exist;
  });

  it('insertOne inserts a new document', async () => {
    const response = await mongoDB.insertOne(
      collection="threads",
      document={"title": "Test Title", "author": "Test Author"}
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
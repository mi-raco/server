// mongoDataAPI.js
const axios = require('axios');
require('dotenv').config();

const BASE_URL = process.env.MONGO_DATA_API_BASE_URL;
const API_KEY = process.env.MONGO_DATA_API_KEY;

// Helper function to make an API request
async function makeRequest(path, data) {
  const url = `${BASE_URL}${path}`;
  const headers = {
    'Content-Type': 'application/json',
    'Access-Control-Request-Headers': '*',
    'api-key': API_KEY
  };
  data.dataSource = process.env.MONGO_DATASOURCE;
  data.database = process.env.MONGO_DATABASE;
  const options = {
    method:"POST",
    url,
    headers,
    data
  };
  try {
    const response = await axios(options);
    return response.data;
  } catch (error) {
    throw new Error(`API request failed with status ${error.response.status}: ${error.message}`);
  }
}

// Define functions for each endpoint
module.exports = {
  async findOne(collection, filter, projection) {
    const path = '/action/findOne';
    const body = {
      collection,
      filter,
      projection
    };
    return makeRequest(path, body);
  },

  async find(collection, filter, projection, sort, limit, skip) {
    const path = '/action/find';
    const body = {
      collection,
      filter,
      projection,
      sort,
      limit,
      skip
    };
    return makeRequest(path, body);
  },

  async insertOne(collection, document) {
    const path = '/action/insertOne';
    document = document || {};
    document.created_at=new Date().toISOString();
    const body = {
      collection,
      document
    };
    return makeRequest(path, body);
  },

  async insertMany(collection, documents) {
    const path = '/action/insertMany';
    documents.forEach((document) => {
      document.created_at=new Date().toISOString();
    });
    const body = {
      collection,
      documents
    };
    return makeRequest(path, body);
  },

  async updateOne(collection, filter, update, upsert) {
    const path = '/action/updateOne';
    const body = {
      collection,
      filter,
      update,
      upsert
    };
    return makeRequest(path, body);
  },

  async updateMany(collection, filter, update) {
    const path = '/action/updateMany';
    const body = {
      collection,
      filter,
      update
    };
    return makeRequest(path, body);
  },

  async deleteOne(collection, filter) {
    const path = '/action/deleteOne';
    const body = {
      collection,
      filter
    };
    return makeRequest(path, body);
  },

  async deleteMany(collection, filter) {
    const path = '/action/deleteMany';
    const body = {
      collection,
      filter
    };
    return makeRequest(path, body);
  },

  async aggregate(collection, pipeline) {
    const path = '/action/aggregate';
    const body = {
      collection,
      pipeline
    };
    return makeRequest(path, body);
  }
};

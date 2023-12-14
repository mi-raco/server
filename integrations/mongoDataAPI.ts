import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();
import { RequestData, Document } from './models';

const BASE_URL: string = process.env.MONGO_DATA_API_BASE_URL || '';
const API_KEY: string = process.env.MONGO_DATA_API_KEY || '';

async function makeRequest(path: string, data: RequestData) {
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
  } catch (error: any) {
    throw new Error(`API request failed with status ${error.response.status}: ${error.message}`);
  }
}

export default {
  async findOne(
    collection: string, 
    filter?: object, 
    projection?: object
    ) {
      const path = '/action/findOne';
      const body: RequestData = {
        collection,
        filter,
        projection
      };
      return makeRequest(path, body);
    },

  async find(
    collection: string, 
    filter: object, 
    projection: object, 
    sort: object, 
    limit: number, 
    skip: number
    ) {
      const path = '/action/find';
      const body: RequestData = {
        collection,
        filter,
        projection,
        sort,
        limit,
        skip
      };
      return makeRequest(path, body);
    },

  async insertOne<Doc extends Document>(
    collection: string, 
    document: Doc
    ) {
      const path = '/action/insertOne';
      document = document || {};
      document.created_at = new Date().toISOString();
      const body: RequestData = {
        collection,
        document
      };
      return makeRequest(path, body);
    },

  async insertMany<Doc extends Document>(
    collection: string, 
    documents: Doc[]
    ) {
      const path = '/action/insertMany';
      documents.forEach((document) => {
        document.created_at = new Date().toISOString();
      });
      const body: RequestData = {
        collection,
        documents
      };
      return makeRequest(path, body);
  },

  async updateOne(
    collection: string,
    filter: object,
    update: object,
    upsert: boolean
    ) {
      const path = '/action/updateOne';
      const body: RequestData = {
        collection,
        filter,
        update,
        upsert
      };
      return makeRequest(path, body);
    },

  async updateMany(
    collection: string, 
    filter: object, 
    update: object
    ) {
      const path = '/action/updateMany';
      const body: RequestData = {
        collection,
        filter,
        update
      };
      return makeRequest(path, body);
    },

  async deleteOne(
    collection: string, 
    filter: object
    ) {
      const path = '/action/deleteOne';
      const body: RequestData = {
        collection,
        filter
      };
      return makeRequest(path, body);
    },

  async deleteMany(
    collection: string, 
    filter: object
    ) {
      const path = '/action/deleteMany';
      const body: RequestData = {
        collection,
        filter
      };
      return makeRequest(path, body);
    },

  async aggregate(
    collection: string, 
    pipeline: object[]
    ) {
      const path = '/action/aggregate';
      const body: RequestData = {
        collection,
        pipeline
      };
      return makeRequest(path, body);
    }
};
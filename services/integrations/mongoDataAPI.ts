import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();

const BASE_URL: string = process.env.MONGO_DATA_API_BASE_URL || '';
const API_KEY: string = process.env.MONGO_DATA_API_KEY || '';

export interface RequestData {
  dataSource?: string;
  database?: string;
  collection: string;
  filter?: Record<string, unknown>;
  projection?: Record<string, unknown>;
  sort?: Record<string, unknown>;
  limit?: number;
  skip?: number;
  document?: Record<string, unknown>;
  documents?: Record<string, unknown>[];
  update?: Record<string, unknown>;
  upsert?: boolean;
  pipeline?: Record<string, unknown>[];
}

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

async function findOne(body: RequestData){
  const path = '/action/findOne';
  return makeRequest(path, body);
}

async function find(body: RequestData){
  const path = '/action/find';
  return makeRequest(path, body);
}

async function insertOne(body: RequestData){
  const path = '/action/insertOne';
  if (body.document) {
    body.document.created_at = new Date().toISOString();
  }
  return makeRequest(path, body);
}

async function insertMany(body: RequestData){
  const path = '/action/insertMany';
  if (body.documents) {
    body.documents.forEach((document) => {
      document.created_at = new Date().toISOString();
    });
    return makeRequest(path, body);
  }
}

async function updateOne(body: RequestData) {
    const path = '/action/updateOne';
    return makeRequest(path, body);
  }

async function updateMany(body: RequestData) {
    const path = '/action/updateMany';
    return makeRequest(path, body);
  }

async function deleteOne(body: RequestData) {
    const path = '/action/deleteOne';
    return makeRequest(path, body);
  }

async function deleteMany(body: RequestData) {
    const path = '/action/deleteMany';
    return makeRequest(path, body);
  }

async function aggregate(body: RequestData) {
    const path = '/action/aggregate';
    return makeRequest(path, body);
  }

export const dataMap: Record<string, Function> = {
  "findOne": findOne,
  "find": find,
  "insertOne": insertOne,
  "insertMany": insertMany,
  "updateOne": updateOne,
  "updateMany": updateMany,
  "deleteOne": deleteOne,
  "deleteMany": deleteMany,
  "aggregate": aggregate
}

export default {
  findOne,
  find,
  insertOne,
  insertMany,
  updateOne,
  updateMany,
  deleteOne,
  deleteMany,
  aggregate
};
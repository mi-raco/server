export interface RequestData {
  dataSource?: string;
  database?: string;
  collection: string;
  filter?: object;
  projection?: object;
  sort?: object;
  limit?: number;
  skip?: number;
  document?: object;
  documents?: object[];
  update?: object;
  upsert?: boolean;
  pipeline?: object[];
}

export interface Document {
  created_at: string;
}


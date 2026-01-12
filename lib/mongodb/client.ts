// 🗄️ DO MongoDB 客戶端配置

import { MongoClient, Db } from 'mongodb';

// DO MongoDB 連接字符串
// 格式: mongodb+srv://doadmin:<password>@db-mongodb-sgp1-38299-9d250527.mongo.ondigitalocean.com/admin?tls=true
const MONGODB_URI = process.env.MONGODB_URI || '';
const MONGODB_DB = process.env.MONGODB_DB || 'oece';

let cachedClient: MongoClient | null = null;
let cachedDb: Db | null = null;

export async function connectToDatabase(): Promise<{ client: MongoClient; db: Db }> {
  if (cachedClient && cachedDb) {
    return { client: cachedClient, db: cachedDb };
  }

  if (!MONGODB_URI) {
    throw new Error('MONGODB_URI not configured');
  }

  const client = new MongoClient(MONGODB_URI, {
    maxPoolSize: 10,
    minPoolSize: 1,
    maxIdleTimeMS: 30000,
  });

  await client.connect();
  const db = client.db(MONGODB_DB);

  cachedClient = client;
  cachedDb = db;

  return { client, db };
}

export async function getDb(): Promise<Db> {
  const { db } = await connectToDatabase();
  return db;
}

// 集合名稱
export const COLLECTIONS = {
  FORUM_POSTS: 'forum_posts',
  FORUM_REPLIES: 'forum_replies',
  FORUM_LIKES: 'forum_likes',
  USERS: 'users',
  CONVERSATIONS: 'conversations',
  DIVINATION_HISTORY: 'divination_history'
} as const;

// 檢查 MongoDB 是否可用
export function isMongoDBConfigured(): boolean {
  return !!MONGODB_URI;
}

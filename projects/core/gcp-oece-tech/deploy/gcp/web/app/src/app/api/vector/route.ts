/**
 * 🎯 向量搜索 API (MongoDB Atlas)
 * POST /api/vector - 搜索
 * PUT /api/vector - 插入
 */

import { NextRequest, NextResponse } from 'next/server';
import { MongoClient, Db } from 'mongodb';

let client: MongoClient | null = null;
let db: Db | null = null;

async function getDb(): Promise<Db> {
  if (!db) {
    const uri = process.env.MONGODB_URI || '';
    client = new MongoClient(uri);
    await client.connect();
    db = client.db('sms-vectors');
  }
  return db;
}

const GEMINI_KEY = process.env.GEMINI_FREE_KEY || process.env.GEMINI_API_KEY_1;

// 生成嵌入向量
async function generateEmbedding(text: string): Promise<number[]> {
  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/text-embedding-004:embedContent?key=${GEMINI_KEY}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'models/text-embedding-004',
        content: { parts: [{ text }] },
      }),
    }
  );

  const data = await response.json();
  return data.embedding?.values || [];
}

// 搜索向量
export async function POST(request: NextRequest) {
  try {
    const { query, limit = 5 } = await request.json();
    
    if (!query) {
      return NextResponse.json({ error: 'Query required' }, { status: 400 });
    }

    // 生成查詢向量
    const embedding = await generateEmbedding(query);
    
    if (embedding.length === 0) {
      return NextResponse.json({ error: 'Failed to generate embedding' }, { status: 500 });
    }

    const database = await getDb();
    const collection = database.collection('documents');

    // 嘗試向量搜索，失敗則降級為文本搜索
    let results;
    try {
      results = await collection.aggregate([
        {
          $vectorSearch: {
            index: 'vector_index',
            path: 'embedding',
            queryVector: embedding,
            numCandidates: limit * 10,
            limit: limit,
          }
        },
        {
          $project: {
            _id: 1,
            content: 1,
            metadata: 1,
            score: { $meta: 'vectorSearchScore' }
          }
        }
      ]).toArray();
    } catch {
      // 向量索引不存在，降級為普通查詢
      results = await collection.find({})
        .sort({ createdAt: -1 })
        .limit(limit)
        .toArray();
    }

    return NextResponse.json({
      ok: true,
      results,
      query,
      count: results.length,
    });
  } catch (error: any) {
    return NextResponse.json({ 
      ok: false, 
      error: error.message 
    }, { status: 500 });
  }
}

// 插入向量
export async function PUT(request: NextRequest) {
  try {
    const { content, metadata = {} } = await request.json();
    
    if (!content) {
      return NextResponse.json({ error: 'Content required' }, { status: 400 });
    }

    // 生成嵌入向量
    const embedding = await generateEmbedding(content);
    
    if (embedding.length === 0) {
      return NextResponse.json({ error: 'Failed to generate embedding' }, { status: 500 });
    }

    const database = await getDb();
    const collection = database.collection('documents');

    // 插入到 MongoDB
    const result = await collection.insertOne({
      content,
      embedding,
      metadata,
      createdAt: new Date(),
    });

    return NextResponse.json({
      ok: true,
      id: result.insertedId.toString(),
      message: '向量已插入 MongoDB',
    });
  } catch (error: any) {
    return NextResponse.json({ 
      ok: false, 
      error: error.message 
    }, { status: 500 });
  }
}

export async function GET() {
  try {
    const database = await getDb();
    const count = await database.collection('documents').countDocuments();
    
    return NextResponse.json({
      name: '向量搜索 API (MongoDB Atlas)',
      storage: 'mongodb',
      documents: count,
      endpoints: {
        'GET /api/vector': '狀態',
        'POST /api/vector': '搜索 { query: "..." }',
        'PUT /api/vector': '插入 { content: "...", metadata: {} }',
      },
    });
  } catch (error: any) {
    return NextResponse.json({
      name: '向量搜索 API',
      storage: 'error',
      error: error.message,
    });
  }
}

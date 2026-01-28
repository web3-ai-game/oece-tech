// 🔍 知识库搜索 API（Algolia）

import { NextRequest, NextResponse } from 'next/server';

// 注意：需要在前端使用 Algolia 客户端库
// 这里提供后端 API 支持（如果需要隐藏 API Key）

/**
 * POST - 搜索知识库
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { query: searchQuery, category, limit = 20 } = body;

    if (!searchQuery) {
      return NextResponse.json(
        { error: 'Search query required' },
        { status: 400 }
      );
    }

    // Algolia 配置
    const appId = process.env.ALGOLIA_APP_ID;
    const apiKey = process.env.ALGOLIA_SEARCH_API_KEY;
    const indexName = 'oece_knowledge';

    if (!appId || !apiKey) {
      throw new Error('Algolia credentials not configured');
    }

    // 调用 Algolia Search API
    const response = await fetch(
      `https://${appId}-dsn.algolia.net/1/indexes/${indexName}/query`,
      {
        method: 'POST',
        headers: {
          'X-Algolia-API-Key': apiKey,
          'X-Algolia-Application-Id': appId,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          query: searchQuery,
          hitsPerPage: limit,
          filters: category ? `category:${category}` : undefined
        })
      }
    );

    if (!response.ok) {
      throw new Error('Algolia search failed');
    }

    const data = await response.json();

    return NextResponse.json({
      results: data.hits,
      total: data.nbHits,
      query: searchQuery
    });
  } catch (error: any) {
    console.error('Knowledge search error:', error);

    return NextResponse.json(
      { error: error.message || 'Search failed' },
      { status: 500 }
    );
  }
}

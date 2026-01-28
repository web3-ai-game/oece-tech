import { NextRequest, NextResponse } from 'next/server'
import { getDB } from '@/lib/db-optimized'
import { getCurrentUser } from '@/lib/auth'
import { getAnonymousName, hashIP } from '@/lib/anonymous'
import { checkRateLimit } from '@/lib/rate-limit'
import { filterContent } from '@/lib/content-filter'

// GET - 获取帖子列表
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const sort = searchParams.get('sort') || 'hot'
    const category = searchParams.get('category')
    
    const db = await getDB()
    const offset = (page - 1) * limit
    
    // 构建SQL
    const sortSQL = sort === 'hot' 
      ? 'reply_count DESC, view_count DESC, created_at DESC'
      : 'created_at DESC'
    
    let where = 'WHERE 1=1'
    const params: unknown[] = []
    
    if (category) {
      where += ' AND category = ?'
      params.push(category)
    }
    
    // 查询帖子
    const posts = await db.all(`
      SELECT 
        id, title, category, anonymous_name,
        view_count, reply_count, points_reward,
        created_at
      FROM posts
      ${where}
      ORDER BY ${sortSQL}
      LIMIT ? OFFSET ?
    `, [...params, limit, offset])
    
    // 获取总数
    const countResult = await db.get(
      `SELECT COUNT(*) as total FROM posts ${where}`,
      params
    )
    
    return NextResponse.json({
      posts,
      total: countResult.total,
      page,
      pages: Math.ceil(countResult.total / limit)
    })
  } catch (error: unknown) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    )
  }
}

// POST - 创建帖子
export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser(request)
    if (!user) {
      return NextResponse.json({ error: '请先登录' }, { status: 401 })
    }
    
    // 获取客户端IP
    const ip = request.headers.get('x-forwarded-for') || 
                request.headers.get('x-real-ip') || 
                '127.0.0.1'
    const ipHash = hashIP(ip)
    
    // 限流检查
    if (!checkRateLimit(`user:${user.id}`, 10, 3600)) {
      return NextResponse.json({ error: '每小時最多發10個帖' }, { status: 429 })
    }
    
    if (!checkRateLimit(`ip:${ipHash}`, 20, 3600)) {
      return NextResponse.json({ error: 'IP限制，請稍後再試' }, { status: 429 })
    }
    
    const body = await request.json()
    const { title, content, category, isAnonymous, pointsReward } = body
    
    // 验证输入
    if (!title || !content || !category) {
      return NextResponse.json({ error: '標題和內容不能為空' }, { status: 400 })
    }
    
    if (title.length > 100) {
      return NextResponse.json({ error: '標題不能超過100字' }, { status: 400 })
    }
    
    if (content.length > 10000) {
      return NextResponse.json({ error: '內容不能超過10000字' }, { status: 400 })
    }
    
    // 内容过滤
    const titleFiltered = filterContent(title)
    const contentFiltered = filterContent(content)
    
    if (!titleFiltered.clean || !contentFiltered.clean) {
      return NextResponse.json({ error: '內容包含敏感詞' }, { status: 400 })
    }
    
    // 检查积分是否足够（悬赏）
    if (pointsReward > 0) {
      if (user.points < pointsReward) {
        return NextResponse.json({ error: '積分不足' }, { status: 400 })
      }
    }
    
    const db = await getDB()
    
    // 创建帖子
    const result = await db.run(`
      INSERT INTO posts (
        author_id, title, content, category,
        anonymous_name, is_anonymous, points_reward, ip_hash
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      user.id,
      titleFiltered.filtered,
      contentFiltered.filtered,
      category,
      '', // 稍后生成
      isAnonymous ? 1 : 0,
      pointsReward || 0,
      ipHash
    ])
    
    const postId = result.lastID
    
    // 生成匿名名称
    const anonymousName = await getAnonymousName(user.id, postId)
    await db.run(
      'UPDATE posts SET anonymous_name = ? WHERE id = ?',
      [anonymousName, postId]
    )
    
    // 扣除悬赏积分
    if (pointsReward > 0) {
      await db.run(
        'UPDATE users SET points = points - ? WHERE id = ?',
        [pointsReward, user.id]
      )
      
      // 记录积分交易
      await db.run(`
        INSERT INTO point_transactions (
          from_user_id, to_user_id, amount, type, reference_type, reference_id
        ) VALUES (?, ?, ?, ?, ?, ?)
      `, [user.id, user.id, -pointsReward, 'reward', 'post', postId])
    }
    
    // 发帖奖励积分
    await db.run(
      'UPDATE users SET points = points + 20 WHERE id = ?',
      [user.id]
    )
    
    await db.run(`
      INSERT INTO point_transactions (
        to_user_id, amount, type, reference_type, reference_id
        ) VALUES (?, ?, ?, ?, ?)
    `, [user.id, 20, 'post_reward', 'post', postId])
    
    // 获取创建的帖子
    const post = await db.get(
      'SELECT * FROM posts WHERE id = ?',
      [postId]
    )
    
    return NextResponse.json(post, { status: 201 })
  } catch (error: unknown) {
    console.error('Create post error:', error)
    return NextResponse.json(
      { error: '發帖失敗' },
      { status: 500 }
    )
  }
}

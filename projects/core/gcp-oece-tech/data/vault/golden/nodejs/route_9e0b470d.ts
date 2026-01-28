import { NextRequest, NextResponse } from 'next/server'
import { tutorialQueries } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    const difficulty = searchParams.get('difficulty')
    const published = searchParams.get('published')

    const filters: unknown = {}
    
    if (category) filters.category = category
    if (difficulty) filters.difficulty = difficulty
    if (published !== null) filters.published = published === 'true'

    const tutorials = tutorialQueries.findAll(filters)

    return NextResponse.json(
      {
        success: true,
        data: tutorials,
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('獲取教程列表錯誤:', error)
    return NextResponse.json(
      { success: false, message: '伺服器錯誤' },
      { status: 500 }
    )
  }
}

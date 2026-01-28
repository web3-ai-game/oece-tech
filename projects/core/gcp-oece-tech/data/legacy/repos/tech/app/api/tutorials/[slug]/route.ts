import { NextRequest, NextResponse } from 'next/server'
import { tutorialQueries } from '@/lib/db'

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const tutorial = tutorialQueries.findBySlug(params.slug)

    if (!tutorial) {
      return NextResponse.json(
        { success: false, message: '教程不存在' },
        { status: 404 }
      )
    }

    // 增加觀看次數
    tutorialQueries.incrementViewCount(tutorial.id)

    // 獲取教程標籤
    const tags = tutorialQueries.getTags(tutorial.id)

    return NextResponse.json(
      {
        success: true,
        data: {
          ...tutorial,
          tags,
        },
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('獲取教程詳情錯誤:', error)
    return NextResponse.json(
      { success: false, message: '伺服器錯誤' },
      { status: 500 }
    )
  }
}

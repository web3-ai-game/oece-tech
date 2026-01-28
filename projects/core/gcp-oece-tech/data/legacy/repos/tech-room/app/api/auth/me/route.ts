import { NextRequest, NextResponse } from 'next/server'
import { getUserFromRequest } from '@/lib/auth'

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('Authorization')
    const user = getUserFromRequest(authHeader)

    if (!user) {
      return NextResponse.json(
        { success: false, message: '未授權' },
        { status: 401 }
      )
    }

    return NextResponse.json(
      {
        success: true,
        user,
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('獲取用戶信息錯誤:', error)
    return NextResponse.json(
      { success: false, message: '伺服器錯誤' },
      { status: 500 }
    )
  }
}

import { NextRequest, NextResponse } from 'next/server'
import { loginUser } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { emailOrUsername, password } = body

    // 驗證必填字段
    if (!emailOrUsername || !password) {
      return NextResponse.json(
        { success: false, message: '請輸入郵箱/用戶名和密碼' },
        { status: 400 }
      )
    }

    // 登錄用戶
    const result = await loginUser(emailOrUsername, password)

    if (!result.success) {
      return NextResponse.json(
        { success: false, message: result.message },
        { status: 401 }
      )
    }

    // 返回成功結果
    return NextResponse.json(
      {
        success: true,
        message: result.message,
        user: result.user,
        token: result.token,
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('登錄 API 錯誤:', error)
    return NextResponse.json(
      { success: false, message: '伺服器錯誤，請稍後再試' },
      { status: 500 }
    )
  }
}

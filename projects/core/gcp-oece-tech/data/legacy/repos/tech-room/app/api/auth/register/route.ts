import { NextRequest, NextResponse } from 'next/server'
import { registerUser, validateEmail, validatePassword, validateUsername } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { username, email, password } = body

    // 驗證必填字段
    if (!username || !email || !password) {
      return NextResponse.json(
        { success: false, message: '請填寫所有必填字段' },
        { status: 400 }
      )
    }

    // 驗證用戶名
    const usernameValidation = validateUsername(username)
    if (!usernameValidation.isValid) {
      return NextResponse.json(
        { success: false, message: usernameValidation.error },
        { status: 400 }
      )
    }

    // 驗證郵箱
    if (!validateEmail(email)) {
      return NextResponse.json(
        { success: false, message: '請輸入有效的郵箱地址' },
        { status: 400 }
      )
    }

    // 驗證密碼
    const passwordValidation = validatePassword(password)
    if (!passwordValidation.isValid) {
      return NextResponse.json(
        { success: false, message: passwordValidation.errors.join(', ') },
        { status: 400 }
      )
    }

    // 註冊用戶
    const result = await registerUser(username, email, password)

    if (!result.success) {
      return NextResponse.json(
        { success: false, message: result.message },
        { status: 400 }
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
      { status: 201 }
    )
  } catch (error) {
    console.error('註冊 API 錯誤:', error)
    return NextResponse.json(
      { success: false, message: '伺服器錯誤，請稍後再試' },
      { status: 500 }
    )
  }
}

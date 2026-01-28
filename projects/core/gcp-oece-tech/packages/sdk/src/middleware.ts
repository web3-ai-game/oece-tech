import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // 這裡我們暫時不做嚴格的 Token 驗證，因為 Firebase Client SDK 的 Token 在 Edge Runtime 很難解碼
  // 嚴格驗證交給頁面內的 useEffect + onAuthStateChanged
  // 這裡只做簡單的路徑重寫或日誌

  // 如果你需要更嚴格的保護，可以配合 firebase-admin 在這裡驗證 cookie
  
  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*'],
};

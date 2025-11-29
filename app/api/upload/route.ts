// 📤 文件上传 API

import { NextRequest, NextResponse } from 'next/server';
import { uploadFile, isValidFileType, isValidFileSize, ALLOWED_FILE_TYPES } from '@/lib/storage/firebase-storage';

export async function POST(request: NextRequest) {
  try {
    // 获取 FormData
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const userId = formData.get('userId') as string;
    const folder = formData.get('folder') as string || 'uploads';

    // 验证参数
    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID required' },
        { status: 401 }
      );
    }

    // 验证文件类型
    if (!isValidFileType(file, ALLOWED_FILE_TYPES.all)) {
      return NextResponse.json(
        { error: 'Invalid file type' },
        { status: 400 }
      );
    }

    // 验证文件大小（最大 10MB）
    if (!isValidFileSize(file, 10)) {
      return NextResponse.json(
        { error: 'File too large (max 10MB)' },
        { status: 400 }
      );
    }

    // 上传文件
    const downloadURL = await uploadFile(file, userId, folder);

    // 返回响应
    return NextResponse.json({
      success: true,
      url: downloadURL,
      fileName: file.name,
      fileSize: file.size,
      fileType: file.type
    });
  } catch (error: any) {
    console.error('Upload API error:', error);

    return NextResponse.json(
      { error: error.message || 'Failed to upload file' },
      { status: 500 }
    );
  }
}

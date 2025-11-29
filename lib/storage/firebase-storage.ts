// 📁 Firebase Storage 工具函数

import { getStorage, ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { app } from '@/lib/firebase';

// 初始化 Storage
const storage = app ? getStorage(app) : null;

/**
 * 上传文件到 Firebase Storage
 * @param file - 文件对象
 * @param userId - 用户ID
 * @param folder - 文件夹名称（默认: uploads）
 * @returns 下载 URL
 */
export async function uploadFile(
  file: File,
  userId: string,
  folder: string = 'uploads'
): Promise<string> {
  if (!storage) {
    throw new Error('Firebase Storage not initialized');
  }

  // 生成唯一文件名
  const timestamp = Date.now();
  const fileName = `${folder}/${userId}/${timestamp}-${file.name}`;

  // 创建引用
  const storageRef = ref(storage, fileName);

  // 上传文件
  const snapshot = await uploadBytes(storageRef, file, {
    contentType: file.type
  });

  // 获取下载 URL
  const downloadURL = await getDownloadURL(snapshot.ref);

  return downloadURL;
}

/**
 * 上传 Base64 图片到 Firebase Storage
 */
export async function uploadBase64Image(
  base64Data: string,
  userId: string,
  folder: string = 'images'
): Promise<string> {
  if (!storage) {
    throw new Error('Firebase Storage not initialized');
  }

  // 将 Base64 转换为 Blob
  const byteString = atob(base64Data);
  const ab = new ArrayBuffer(byteString.length);
  const ia = new Uint8Array(ab);

  for (let i = 0; i < byteString.length; i++) {
    ia[i] = byteString.charCodeAt(i);
  }

  const blob = new Blob([ab], { type: 'image/jpeg' });

  // 生成文件名
  const timestamp = Date.now();
  const fileName = `${folder}/${userId}/${timestamp}.jpg`;

  // 创建引用并上传
  const storageRef = ref(storage, fileName);
  const snapshot = await uploadBytes(storageRef, blob);

  // 获取下载 URL
  const downloadURL = await getDownloadURL(snapshot.ref);

  return downloadURL;
}

/**
 * 删除文件
 */
export async function deleteFile(filePath: string): Promise<void> {
  if (!storage) {
    throw new Error('Firebase Storage not initialized');
  }

  const storageRef = ref(storage, filePath);
  await deleteObject(storageRef);
}

/**
 * 验证文件类型
 */
export function isValidFileType(file: File, allowedTypes: string[]): boolean {
  return allowedTypes.includes(file.type);
}

/**
 * 验证文件大小
 */
export function isValidFileSize(file: File, maxSizeMB: number): boolean {
  const maxSizeBytes = maxSizeMB * 1024 * 1024;
  return file.size <= maxSizeBytes;
}

/**
 * 获取文件扩展名
 */
export function getFileExtension(fileName: string): string {
  return fileName.split('.').pop() || '';
}

/**
 * 允许的文件类型
 */
export const ALLOWED_FILE_TYPES = {
  images: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'],
  documents: [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'text/plain'
  ],
  all: [
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/webp',
    'image/gif',
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'text/plain'
  ]
};

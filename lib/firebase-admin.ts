// 🔥 Firebase Admin SDK - 服务端配置（生产级）
// 用于后端API，具有完整权限

import { cert, getApps, initializeApp as initializeAdminApp, App as AdminApp } from 'firebase-admin/app';
import { getAuth as getAdminAuth, Auth as AdminAuth } from 'firebase-admin/auth';
import { getFirestore as getAdminFirestore, Firestore as AdminFirestore } from 'firebase-admin/firestore';
import { getStorage as getAdminStorage, Storage as AdminStorage } from 'firebase-admin/storage';

let adminApp: AdminApp | null = null;
let adminAuth: AdminAuth | null = null;
let adminDb: AdminFirestore | null = null;
let adminStorage: AdminStorage | null = null;

/**
 * 初始化 Firebase Admin SDK
 * 用于服务端操作，具有完整权限
 */
function initializeFirebaseAdmin(): AdminApp | null {
  // 避免重复初始化
  if (getApps().length > 0) {
    return getApps()[0] as AdminApp;
  }

  try {
    // 方法1: 使用服务账号密钥（生产环境）
    const serviceAccount = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;

    if (serviceAccount) {
      return initializeAdminApp({
        credential: cert(JSON.parse(serviceAccount)),
        storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
        databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL
      });
    }

    // 方法2: 使用 GCP 默认凭据（在 Cloud Run / App Engine 上运行时）
    if (process.env.GOOGLE_APPLICATION_CREDENTIALS || process.env.GCP_PROJECT) {
      return initializeAdminApp({
        projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
        storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
      });
    }

    console.warn('⚠️ Firebase Admin SDK not initialized - missing credentials');
    return null;
  } catch (error) {
    console.error('❌ Failed to initialize Firebase Admin SDK:', error);
    return null;
  }
}

// 初始化（仅服务端）
if (typeof window === 'undefined') {
  adminApp = initializeFirebaseAdmin();

  if (adminApp) {
    adminAuth = getAdminAuth(adminApp);
    adminDb = getAdminFirestore(adminApp);
    adminStorage = getAdminStorage(adminApp);

    console.log('✅ Firebase Admin SDK initialized');
  }
}

export { adminApp, adminAuth, adminDb, adminStorage };

/**
 * 辅助函数：验证用户身份
 */
export async function verifyUser(idToken: string) {
  if (!adminAuth) throw new Error('Firebase Admin not initialized');

  try {
    const decodedToken = await adminAuth.verifyIdToken(idToken);
    return decodedToken;
  } catch (error: any) {
    throw new Error(`Token verification failed: ${error.message}`);
  }
}

/**
 * 辅助函数：获取用户数据
 */
export async function getUserData(uid: string) {
  if (!adminDb) throw new Error('Firestore not initialized');

  try {
    const userDoc = await adminDb.collection('users').doc(uid).get();

    if (!userDoc.exists) {
      throw new Error('User not found');
    }

    return userDoc.data();
  } catch (error: any) {
    throw new Error(`Failed to get user data: ${error.message}`);
  }
}

/**
 * 辅助函数：创建自定义 Token（用于特殊登录场景）
 */
export async function createCustomToken(uid: string, claims?: object) {
  if (!adminAuth) throw new Error('Firebase Admin not initialized');

  try {
    return await adminAuth.createCustomToken(uid, claims);
  } catch (error: any) {
    throw new Error(`Failed to create custom token: ${error.message}`);
  }
}

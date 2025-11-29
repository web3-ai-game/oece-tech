// 🔥 Firebase 客户端配置（升级版）
// 用于前端，带完整错误处理和类型定义

import { initializeApp, getApps, FirebaseApp, FirebaseError } from "firebase/app";
import { getAuth, Auth, connectAuthEmulator } from "firebase/auth";
import { getFirestore, Firestore, connectFirestoreEmulator } from "firebase/firestore";
import { getStorage, FirebaseStorage, connectStorageEmulator } from "firebase/storage";
import { getAnalytics, Analytics, isSupported } from "firebase/analytics";

// Firebase 配置
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || '',
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || '',
  databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL || '',
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || '',
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || '',
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || '',
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || '',
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID || ''
};

// 验证配置完整性
const hasValidConfig = firebaseConfig.apiKey && firebaseConfig.projectId;

// Firebase 实例
let app: FirebaseApp | null = null;
let auth: Auth | null = null;
let db: Firestore | null = null;
let storage: FirebaseStorage | null = null;
let analytics: Analytics | null = null;

/**
 * 初始化 Firebase（客户端）
 */
if (hasValidConfig) {
  try {
    // 避免重复初始化
    app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

    // 初始化服务
    auth = getAuth(app);
    db = getFirestore(app);
    storage = getStorage(app);

    // 设置中文错误消息
    if (auth) {
      auth.languageCode = 'zh-CN';
    }

    // Analytics（仅浏览器环境）
    if (typeof window !== 'undefined') {
      isSupported().then(yes => {
        if (yes && app) {
          analytics = getAnalytics(app);
        }
      });
    }

    // 开发环境：连接到模拟器
    if (process.env.NODE_ENV === 'development' && process.env.NEXT_PUBLIC_USE_FIREBASE_EMULATOR === 'true') {
      if (auth) connectAuthEmulator(auth, 'http://localhost:9099');
      if (db) connectFirestoreEmulator(db, 'localhost', 8080);
      if (storage) connectStorageEmulator(storage, 'localhost', 9199);

      console.log('🔧 Using Firebase Emulators');
    }

    console.log('✅ Firebase initialized successfully');
  } catch (error) {
    console.error('❌ Firebase initialization failed:', error);
  }
} else {
  console.warn('⚠️ Firebase config incomplete - some features will be disabled');
}

export { app, auth, db, storage, analytics };

/**
 * Firebase 错误处理工具
 */
export function handleFirebaseError(error: unknown): string {
  if (error instanceof FirebaseError) {
    switch (error.code) {
      // Auth 错误
      case 'auth/invalid-email':
        return '邮箱格式不正确';
      case 'auth/user-disabled':
        return '该账号已被禁用';
      case 'auth/user-not-found':
        return '用户不存在';
      case 'auth/wrong-password':
        return '密码错误';
      case 'auth/email-already-in-use':
        return '该邮箱已被注册';
      case 'auth/weak-password':
        return '密码强度不够（至少6位）';
      case 'auth/operation-not-allowed':
        return '此登录方式未启用';
      case 'auth/invalid-credential':
        return '凭证无效';
      case 'auth/account-exists-with-different-credential':
        return '该邮箱已使用其他方式注册';
      case 'auth/popup-closed-by-user':
        return '登录窗口已关闭';
      case 'auth/network-request-failed':
        return '网络连接失败，请重试';
      case 'auth/too-many-requests':
        return '请求过于频繁，请稍后再试';

      // Firestore 错误
      case 'permission-denied':
        return '权限不足';
      case 'not-found':
        return '数据不存在';
      case 'already-exists':
        return '数据已存在';
      case 'resource-exhausted':
        return '配额已用尽';
      case 'unauthenticated':
        return '请先登录';

      default:
        return error.message || '操作失败，请重试';
    }
  }

  if (error instanceof Error) {
    return error.message;
  }

  return '未知错误';
}

/**
 * 检查 Firebase 是否已初始化
 */
export function isFirebaseInitialized(): boolean {
  return app !== null && auth !== null && db !== null;
}

/**
 * 获取 Firebase 实例（带错误检查）
 */
export function getFirebaseApp(): FirebaseApp {
  if (!app) throw new Error('Firebase not initialized');
  return app;
}

export function getFirebaseAuth(): Auth {
  if (!auth) throw new Error('Firebase Auth not initialized');
  return auth;
}

export function getFirebaseDb(): Firestore {
  if (!db) throw new Error('Firestore not initialized');
  return db;
}

export function getFirebaseStorage(): FirebaseStorage {
  if (!storage) throw new Error('Firebase Storage not initialized');
  return storage;
}

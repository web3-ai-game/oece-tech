"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { 
  User,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  GithubAuthProvider,
  signOut as firebaseSignOut
} from "firebase/auth";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { auth, db } from "./firebase";

interface UserData {
  uid: string;
  email: string;
  displayName: string;
  tokens: number;
  tier: string;
  role: string;
  createdAt: string;
}

interface AuthContextType {
  user: User | null;
  userData: UserData | null;
  loading: boolean;
  signInWithEmail: (email: string, password: string) => Promise<void>;
  signUpWithEmail: (email: string, password: string, inviteCode: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signInWithGithub: () => Promise<void>;
  signOut: () => Promise<void>;
  updateTokens: (amount: number) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const VALID_INVITE_CODES = [
  'BETA-2025-DEEPWEAY',
  'OECE-TECH-VIP',
  'GEMINI-PRO-TEST'
];

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);

  // 監聽認證狀態
  useEffect(() => {
    // 防禦性檢查：如果 Firebase 未初始化（Build Time），直接返回
    if (!auth || !db) {
      setLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user);
      
      if (user && db) {
        // 獲取用戶數據
        try {
          const userDoc = await getDoc(doc(db, "users", user.uid));
          if (userDoc.exists()) {
            setUserData(userDoc.data() as UserData);
          }
        } catch (error) {
          console.warn('Failed to fetch user data:', error);
        }
      } else {
        setUserData(null);
      }
      
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Email 登錄
  const signInWithEmail = async (email: string, password: string) => {
    if (!auth) throw new Error('Firebase not initialized');
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error: any) {
      throw new Error(error.message);
    }
  };

  // Email 註冊
  const signUpWithEmail = async (email: string, password: string, inviteCode: string) => {
    if (!auth || !db) throw new Error('Firebase not initialized');
    
    // 驗證邀請碼
    if (!VALID_INVITE_CODES.includes(inviteCode)) {
      throw new Error('Invalid invite code');
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // 在 Firestore 創建用戶文檔
      const userData: UserData = {
        uid: user.uid,
        email: user.email || '',
        displayName: user.displayName || email.split('@')[0],
        tokens: 9999, // 初始贈金
        tier: 'beta',
        role: 'user',
        createdAt: new Date().toISOString()
      };

      await setDoc(doc(db, "users", user.uid), userData);
      setUserData(userData);
    } catch (error: any) {
      throw new Error(error.message);
    }
  };

  // Google 登錄
  const signInWithGoogle = async () => {
    if (!auth || !db) throw new Error('Firebase not initialized');
    try {
      const provider = new GoogleAuthProvider();
      const userCredential = await signInWithPopup(auth, provider);
      const user = userCredential.user;

      // 檢查是否是新用戶
      const userDoc = await getDoc(doc(db, "users", user.uid));
      if (!userDoc.exists()) {
        // 新用戶，創建文檔
        const userData: UserData = {
          uid: user.uid,
          email: user.email || '',
          displayName: user.displayName || 'User',
          tokens: 9999,
          tier: 'beta',
          role: 'user',
          createdAt: new Date().toISOString()
        };
        await setDoc(doc(db, "users", user.uid), userData);
        setUserData(userData);
      }
    } catch (error: any) {
      throw new Error(error.message);
    }
  };

  // GitHub 登錄
  const signInWithGithub = async () => {
    if (!auth || !db) throw new Error('Firebase not initialized');
    try {
      const provider = new GithubAuthProvider();
      const userCredential = await signInWithPopup(auth, provider);
      const user = userCredential.user;

      // 檢查是否是新用戶
      const userDoc = await getDoc(doc(db, "users", user.uid));
      if (!userDoc.exists()) {
        const userData: UserData = {
          uid: user.uid,
          email: user.email || '',
          displayName: user.displayName || 'User',
          tokens: 9999,
          tier: 'beta',
          role: 'user',
          createdAt: new Date().toISOString()
        };
        await setDoc(doc(db, "users", user.uid), userData);
        setUserData(userData);
      }
    } catch (error: any) {
      throw new Error(error.message);
    }
  };

  // 登出
  const signOut = async () => {
    if (!auth) throw new Error('Firebase not initialized');
    try {
      await firebaseSignOut(auth);
      setUserData(null);
    } catch (error: any) {
      throw new Error(error.message);
    }
  };

  // 更新 Tokens
  const updateTokens = async (amount: number) => {
    if (!user || !userData || !db) return;

    try {
      const newTokens = userData.tokens + amount;
      await updateDoc(doc(db, "users", user.uid), { tokens: newTokens });
      setUserData({ ...userData, tokens: newTokens });
    } catch (error: any) {
      throw new Error(error.message);
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      userData,
      loading,
      signInWithEmail,
      signUpWithEmail,
      signInWithGoogle,
      signInWithGithub,
      signOut,
      updateTokens
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}

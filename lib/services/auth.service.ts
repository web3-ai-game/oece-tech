// 🔐 认证服务（生产级）
// 处理所有认证相关逻辑

import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  GithubAuthProvider,
  OAuthProvider,
  sendEmailVerification,
  sendPasswordResetEmail,
  updateProfile,
  updateEmail,
  updatePassword,
  deleteUser,
  User
} from 'firebase/auth';
import { doc, getDoc, setDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db, handleFirebaseError } from '@/lib/firebase';
import { UserData, UserTier, UserRole, UserStatus, AuthProvider, DEFAULT_USER_DATA } from '@/lib/types/user';
import { generateInviteCode } from '@/lib/utils/invite-code';
import { logActivity } from '@/lib/services/activity.service';

/**
 * 邮箱 + 密码登录
 */
export async function signInWithEmail(email: string, password: string): Promise<User> {
  if (!auth) throw new Error('Firebase not initialized');

  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);

    // 记录登录活动
    await logActivity(userCredential.user.uid, 'auth', 'email_login');

    return userCredential.user;
  } catch (error) {
    throw new Error(handleFirebaseError(error));
  }
}

/**
 * 邮箱 + 密码注册
 */
export async function signUpWithEmail(
  email: string,
  password: string,
  inviteCode: string,
  displayName?: string
): Promise<User> {
  if (!auth || !db) throw new Error('Firebase not initialized');

  try {
    // 1. 验证邀请码
    const isValidCode = await validateInviteCode(inviteCode);
    if (!isValidCode) {
      throw new Error('邀请码无效或已使用');
    }

    // 2. 创建账号
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // 3. 更新显示名称
    if (displayName) {
      await updateProfile(user, { displayName });
    }

    // 4. 发送验证邮件
    await sendEmailVerification(user);

    // 5. 创建用户数据
    const userData: UserData = {
      ...DEFAULT_USER_DATA,
      uid: user.uid,
      email: user.email || '',
      displayName: displayName || email.split('@')[0],
      authProviders: [AuthProvider.EMAIL],
      inviteCode: await generateInviteCode(),
      invitedBy: await getInviteCodeOwner(inviteCode),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      lastLoginAt: new Date().toISOString()
    } as UserData;

    await setDoc(doc(db, 'users', user.uid), userData);

    // 6. 标记邀请码为已使用
    await markInviteCodeAsUsed(inviteCode, user.uid);

    // 7. 记录注册活动
    await logActivity(user.uid, 'auth', 'email_signup', { inviteCode });

    return user;
  } catch (error) {
    throw new Error(handleFirebaseError(error));
  }
}

/**
 * Google 登录
 */
export async function signInWithGoogle(): Promise<User> {
  if (!auth || !db) throw new Error('Firebase not initialized');

  try {
    const provider = new GoogleAuthProvider();
    provider.addScope('profile');
    provider.addScope('email');

    const userCredential = await signInWithPopup(auth, provider);
    const user = userCredential.user;

    // 检查是否为新用户
    const userDoc = await getDoc(doc(db, 'users', user.uid));

    if (!userDoc.exists()) {
      // 新用户，创建数据
      const userData: UserData = {
        ...DEFAULT_USER_DATA,
        uid: user.uid,
        email: user.email || '',
        displayName: user.displayName || 'User',
        photoURL: user.photoURL,
        authProviders: [AuthProvider.GOOGLE],
        emailVerified: user.emailVerified,
        inviteCode: await generateInviteCode(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        lastLoginAt: new Date().toISOString()
      } as UserData;

      await setDoc(doc(db, 'users', user.uid), userData);
      await logActivity(user.uid, 'auth', 'google_signup');
    } else {
      // 老用户，更新最后登录时间
      await updateDoc(doc(db, 'users', user.uid), {
        lastLoginAt: new Date().toISOString(),
        updatedAt: serverTimestamp()
      });
      await logActivity(user.uid, 'auth', 'google_login');
    }

    return user;
  } catch (error) {
    throw new Error(handleFirebaseError(error));
  }
}

/**
 * GitHub 登录
 */
export async function signInWithGithub(): Promise<User> {
  if (!auth || !db) throw new Error('Firebase not initialized');

  try {
    const provider = new GithubAuthProvider();
    provider.addScope('user:email');

    const userCredential = await signInWithPopup(auth, provider);
    const user = userCredential.user;

    const userDoc = await getDoc(doc(db, 'users', user.uid));

    if (!userDoc.exists()) {
      const userData: UserData = {
        ...DEFAULT_USER_DATA,
        uid: user.uid,
        email: user.email || '',
        displayName: user.displayName || 'User',
        photoURL: user.photoURL,
        authProviders: [AuthProvider.GITHUB],
        emailVerified: user.emailVerified,
        inviteCode: await generateInviteCode(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        lastLoginAt: new Date().toISOString()
      } as UserData;

      await setDoc(doc(db, 'users', user.uid), userData);
      await logActivity(user.uid, 'auth', 'github_signup');
    } else {
      await updateDoc(doc(db, 'users', user.uid), {
        lastLoginAt: new Date().toISOString(),
        updatedAt: serverTimestamp()
      });
      await logActivity(user.uid, 'auth', 'github_login');
    }

    return user;
  } catch (error) {
    throw new Error(handleFirebaseError(error));
  }
}

/**
 * Apple 登录
 */
export async function signInWithApple(): Promise<User> {
  if (!auth || !db) throw new Error('Firebase not initialized');

  try {
    const provider = new OAuthProvider('apple.com');
    provider.addScope('email');
    provider.addScope('name');

    const userCredential = await signInWithPopup(auth, provider);
    const user = userCredential.user;

    const userDoc = await getDoc(doc(db, 'users', user.uid));

    if (!userDoc.exists()) {
      const userData: UserData = {
        ...DEFAULT_USER_DATA,
        uid: user.uid,
        email: user.email || '',
        displayName: user.displayName || 'User',
        photoURL: user.photoURL,
        authProviders: [AuthProvider.APPLE],
        emailVerified: user.emailVerified,
        inviteCode: await generateInviteCode(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        lastLoginAt: new Date().toISOString()
      } as UserData;

      await setDoc(doc(db, 'users', user.uid), userData);
      await logActivity(user.uid, 'auth', 'apple_signup');
    } else {
      await updateDoc(doc(db, 'users', user.uid), {
        lastLoginAt: new Date().toISOString(),
        updatedAt: serverTimestamp()
      });
      await logActivity(user.uid, 'auth', 'apple_login');
    }

    return user;
  } catch (error) {
    throw new Error(handleFirebaseError(error));
  }
}

/**
 * 发送密码重置邮件
 */
export async function resetPassword(email: string): Promise<void> {
  if (!auth) throw new Error('Firebase not initialized');

  try {
    await sendPasswordResetEmail(auth, email);
  } catch (error) {
    throw new Error(handleFirebaseError(error));
  }
}

/**
 * 发送验证邮件
 */
export async function sendVerificationEmail(user: User): Promise<void> {
  try {
    await sendEmailVerification(user);
  } catch (error) {
    throw new Error(handleFirebaseError(error));
  }
}

/**
 * 更新用户资料
 */
export async function updateUserProfile(
  user: User,
  data: { displayName?: string; photoURL?: string }
): Promise<void> {
  if (!db) throw new Error('Firestore not initialized');

  try {
    await updateProfile(user, data);

    // 同步到 Firestore
    await updateDoc(doc(db, 'users', user.uid), {
      ...data,
      updatedAt: serverTimestamp()
    });

    await logActivity(user.uid, 'profile_update', 'update_profile', data);
  } catch (error) {
    throw new Error(handleFirebaseError(error));
  }
}

/**
 * 更新邮箱
 */
export async function changeEmail(user: User, newEmail: string): Promise<void> {
  if (!db) throw new Error('Firestore not initialized');

  try {
    await updateEmail(user, newEmail);

    // 同步到 Firestore
    await updateDoc(doc(db, 'users', user.uid), {
      email: newEmail,
      emailVerified: false,
      updatedAt: serverTimestamp()
    });

    // 发送验证邮件
    await sendEmailVerification(user);

    await logActivity(user.uid, 'security', 'email_changed', { newEmail });
  } catch (error) {
    throw new Error(handleFirebaseError(error));
  }
}

/**
 * 更新密码
 */
export async function changePassword(user: User, newPassword: string): Promise<void> {
  try {
    await updatePassword(user, newPassword);
    await logActivity(user.uid, 'security', 'password_changed');
  } catch (error) {
    throw new Error(handleFirebaseError(error));
  }
}

/**
 * 删除账号
 */
export async function deleteAccount(user: User): Promise<void> {
  if (!db) throw new Error('Firestore not initialized');

  try {
    // 先删除 Firestore 数据
    await updateDoc(doc(db, 'users', user.uid), {
      status: UserStatus.BANNED,
      updatedAt: serverTimestamp()
    });

    await logActivity(user.uid, 'security', 'account_deleted');

    // 删除认证账号
    await deleteUser(user);
  } catch (error) {
    throw new Error(handleFirebaseError(error));
  }
}

/**
 * 验证邀请码
 */
async function validateInviteCode(code: string): Promise<boolean> {
  if (!db) return false;

  // 硬编码的 Beta 邀请码
  const BETA_CODES = [
    'BETA-2025-DEEPWEAY',
    'OECE-TECH-VIP',
    'GEMINI-PRO-TEST'
  ];

  if (BETA_CODES.includes(code)) {
    return true;
  }

  // 检查数据库中的邀请码
  try {
    const inviteDoc = await getDoc(doc(db, 'invites', code));
    return inviteDoc.exists() && !inviteDoc.data()?.used;
  } catch {
    return false;
  }
}

/**
 * 标记邀请码为已使用
 */
async function markInviteCodeAsUsed(code: string, userId: string): Promise<void> {
  if (!db) return;

  try {
    await updateDoc(doc(db, 'invites', code), {
      used: true,
      usedBy: userId,
      usedAt: serverTimestamp()
    });
  } catch {
    // 如果是硬编码的邀请码，忽略错误
  }
}

/**
 * 获取邀请码所有者
 */
async function getInviteCodeOwner(code: string): Promise<string | undefined> {
  if (!db) return undefined;

  try {
    const inviteDoc = await getDoc(doc(db, 'invites', code));
    return inviteDoc.data()?.ownerId;
  } catch {
    return undefined;
  }
}

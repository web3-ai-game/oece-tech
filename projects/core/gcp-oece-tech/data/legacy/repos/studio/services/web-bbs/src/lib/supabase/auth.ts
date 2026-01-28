import { supabase } from './client';

/**
 * 注册新用户（需要邀请码）
 */
export async function signUpWithInvite(
  email: string,
  password: string,
  inviteCode: string,
  username: string
) {
  // 1. 验证邀请码
  const { data: invite, error: inviteError } = await supabase
    .from('invites')
    .select('*')
    .eq('code', inviteCode.toUpperCase())
    .eq('is_used', false)
    .single();

  if (inviteError || !invite) {
    throw new Error('邀请码无效或已被使用');
  }

  // 2. 创建用户（带用户名元数据）
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        display_name: username,
      },
    },
  });

  if (authError) throw authError;
  if (!authData.user) throw new Error('注册失败');

  // 3. 标记邀请码为已使用
  const { error: updateError } = await supabase
    .from('invites')
    .update({
      is_used: true,
      used_by: authData.user.id,
      used_at: new Date().toISOString(),
    })
    .eq('code', inviteCode.toUpperCase());

  if (updateError) {
    console.error('更新邀请码失败:', updateError);
  }

  return authData;
}

/**
 * 邮箱密码登录
 */
export async function signInWithPassword(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) throw error;
  return data;
}

/**
 * Google登录
 */
export async function signInWithGoogle() {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${window.location.origin}/dashboard`,
    },
  });

  if (error) throw error;
  return data;
}

/**
 * 登出
 */
export async function signOut() {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}

/**
 * 获取当前用户
 */
export async function getCurrentUser() {
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error) throw error;
  return user;
}

/**
 * 获取用户资料
 */
export async function getUserProfile(userId: string) {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', userId)
    .single();

  if (error) throw error;
  return data;
}

/**
 * 生成邀请码
 */
export async function generateInviteCode(userId: string) {
  // 检查用户剩余邀请数
  const { data: user, error: userError } = await supabase
    .from('users')
    .select('invites_remaining')
    .eq('id', userId)
    .single();

  if (userError) throw userError;
  if (!user || user.invites_remaining <= 0) {
    throw new Error('没有剩余邀请码');
  }

  // 生成邀请码
  const code = Math.random().toString(36).substring(2, 10).toUpperCase();

  // 插入邀请码
  const { error: insertError } = await supabase
    .from('invites')
    .insert({
      code,
      created_by: userId,
    });

  if (insertError) throw insertError;

  // 减少用户剩余邀请数
  const { error: updateError } = await supabase
    .from('users')
    .update({
      invites_remaining: user.invites_remaining - 1,
    })
    .eq('id', userId);

  if (updateError) throw updateError;

  return code;
}

/**
 * 获取用户的邀请码列表
 */
export async function getUserInvites(userId: string) {
  const { data, error } = await supabase
    .from('invites')
    .select('*')
    .eq('created_by', userId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
}

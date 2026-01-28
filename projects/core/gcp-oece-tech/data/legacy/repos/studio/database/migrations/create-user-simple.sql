-- ============================================
-- 简化版：只需要在 Supabase Dashboard 执行
-- ============================================

-- 如果 TablePlus 没有权限，在 Supabase Dashboard → SQL Editor 执行此脚本

BEGIN;

-- 1. 创建 auth 用户 (使用 Supabase 内部函数)
-- 注意：这需要在 Supabase SQL Editor 执行，不是 TablePlus

INSERT INTO auth.users (
  instance_id,
  id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  raw_app_meta_data,
  raw_user_meta_data,
  created_at,
  updated_at,
  confirmation_token,
  email_change,
  email_change_token_new,
  recovery_token
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  gen_random_uuid(),
  'authenticated',
  'authenticated',
  '123@123.com',
  crypt('123123', gen_salt('bf')),
  NOW(),
  '{"provider":"email","providers":["email"]}'::jsonb,
  '{"display_name":"测试账号"}'::jsonb,
  NOW(),
  NOW(),
  '',
  '',
  '',
  ''
)
RETURNING id;

-- 2. 获取刚创建的用户ID并创建 identity
WITH new_user AS (
  SELECT id FROM auth.users WHERE email = '123@123.com'
)
INSERT INTO auth.identities (
  id,
  user_id,
  identity_data,
  provider,
  last_sign_in_at,
  created_at,
  updated_at
)
SELECT 
  gen_random_uuid(),
  nu.id,
  format('{"sub":"%s","email":"123@123.com"}', nu.id)::jsonb,
  'email',
  NOW(),
  NOW(),
  NOW()
FROM new_user nu;

COMMIT;

-- 3. 验证 (触发器会自动创建 public.users 记录)
SELECT 
  au.id,
  au.email,
  au.email_confirmed_at,
  pu.display_name,
  pu.role,
  pu.invites_remaining
FROM auth.users au
LEFT JOIN public.users pu ON au.id = pu.id
WHERE au.email = '123@123.com';

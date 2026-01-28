-- ============================================
-- 在 TablePlus 中执行此SQL创建测试账号
-- ============================================

-- 方法1: 使用Supabase Admin API创建用户 (推荐)
-- 需要在 Supabase Dashboard 的 SQL Editor 执行

-- 方法2: 直接插入 auth.users 和 public.users (需要超级用户权限)

-- 步骤1: 创建 auth.users 记录
DO $$
DECLARE
  new_user_id UUID;
BEGIN
  -- 生成新的UUID
  new_user_id := gen_random_uuid();
  
  -- 插入到 auth.users
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
    new_user_id,
    'authenticated',
    'authenticated',
    '123@123.com',
    crypt('123123', gen_salt('bf')),  -- 密码: 123123
    NOW(),
    '{"provider":"email","providers":["email"]}'::jsonb,
    '{"display_name":"测试账号"}'::jsonb,
    NOW(),
    NOW(),
    '',
    '',
    '',
    ''
  );
  
  -- 插入到 auth.identities
  INSERT INTO auth.identities (
    id,
    user_id,
    identity_data,
    provider,
    last_sign_in_at,
    created_at,
    updated_at
  ) VALUES (
    gen_random_uuid(),
    new_user_id,
    format('{"sub":"%s","email":"123@123.com"}', new_user_id)::jsonb,
    'email',
    NOW(),
    NOW(),
    NOW()
  );
  
  -- 插入到 public.users (触发器应该自动创建，但手动确保)
  INSERT INTO public.users (
    id,
    email,
    display_name,
    role,
    invites_remaining,
    created_at,
    updated_at
  ) VALUES (
    new_user_id,
    '123@123.com',
    '测试账号',
    'free',
    2,
    NOW(),
    NOW()
  )
  ON CONFLICT (id) DO NOTHING;
  
  -- 创建两个邀请码
  INSERT INTO public.invites (code, created_by, is_used, created_at)
  VALUES 
    ('USER123A', new_user_id, FALSE, NOW()),
    ('USER123B', new_user_id, FALSE, NOW());
  
  RAISE NOTICE 'User created successfully with ID: %', new_user_id;
END $$;

-- 步骤2: 验证创建结果
SELECT 
  u.id,
  u.email,
  u.email_confirmed_at,
  u.created_at,
  p.display_name,
  p.role,
  p.invites_remaining
FROM auth.users u
LEFT JOIN public.users p ON u.id = p.id
WHERE u.email = '123@123.com';

-- 步骤3: 查看邀请码
SELECT code, is_used, created_at
FROM public.invites
WHERE created_by = (SELECT id FROM auth.users WHERE email = '123@123.com');

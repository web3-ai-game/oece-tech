// Supabase连接测试脚本
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://qhgdymgxcbyhtxezvoqt.supabase.co';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFoZ2R5bWd4Y2J5aHR4ZXp2b3F0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIxODU3MTYsImV4cCI6MjA3Nzc2MTcxNn0.6LBkr5EWygKpWeOTs7Hnap0nu7Mp76UQjxt1UXbcbPY';

const supabase = createClient(supabaseUrl, supabaseKey);

async function testConnection() {
  console.log('\n🧪 测试 Supabase 连接...\n');
  console.log('📍 URL:', supabaseUrl);
  console.log('🔑 Key:', supabaseKey.substring(0, 20) + '...\n');

  try {
    // 1. 测试数据库连接
    console.log('1️⃣  检查 invites 表...');
    const { data: invites, error: invitesError } = await supabase
      .from('invites')
      .select('code, is_used')
      .limit(5);

    if (invitesError) {
      console.log('❌ invites 表不存在或无权限访问');
      console.log('   错误:', invitesError.message);
      console.log('\n📝 请在 Supabase Dashboard 执行 SQL:');
      console.log('   1. 打开 https://supabase.com/dashboard');
      console.log('   2. 选择项目: qhgdymgxcbyhtxezvoqt');
      console.log('   3. 进入 SQL Editor');
      console.log('   4. 复制粘贴 supabase_schema.sql 内容');
      console.log('   5. 点击 Run 执行\n');
      return;
    }

    console.log('✅ invites 表连接成功');
    console.log('   可用邀请码数量:', invites?.length || 0);
    if (invites && invites.length > 0) {
      console.log('   示例邀请码:', invites.slice(0, 3).map(i => `${i.code} (${i.is_used ? '已使用' : '未使用'})`).join(', '));
    }

    // 2. 测试 users 表
    console.log('\n2️⃣  检查 users 表...');
    const { data: users, error: usersError } = await supabase
      .from('users')
      .select('id, email, role')
      .limit(1);

    if (usersError) {
      console.log('❌ users 表不存在或无权限访问');
      console.log('   错误:', usersError.message);
    } else {
      console.log('✅ users 表连接成功');
      console.log('   现有用户数量:', users?.length || 0);
    }

    // 3. 测试认证
    console.log('\n3️⃣  检查认证服务...');
    const { data: session } = await supabase.auth.getSession();
    if (session?.session) {
      console.log('✅ 当前已登录');
      console.log('   用户:', session.session.user.email);
    } else {
      console.log('ℹ️  当前未登录（正常）');
    }

    console.log('\n✅ Supabase 配置正确！');
    console.log('\n📋 下一步操作:');
    
    if (!invites || invites.length === 0) {
      console.log('   ⚠️  没有可用邀请码，请执行 SQL 创建初始数据');
    } else {
      console.log('   1. 访问登录页: http://localhost:3000/login');
      console.log('   2. 点击"注册账号"');
      console.log('   3. 使用邀请码注册测试账号:');
      console.log('      - 邀请码: WELCOME2024 (或其他未使用的码)');
      console.log('      - 用户名: 测试用户');
      console.log('      - 邮箱: test@test.com');
      console.log('      - 密码: 123456');
      console.log('   4. 注册成功后登录');
      console.log('   5. 自动跳转到 Dashboard\n');
    }

  } catch (error) {
    console.log('\n❌ 连接失败:', error.message);
    console.log('\n🔧 可能的原因:');
    console.log('   - Supabase 项目未启动');
    console.log('   - 网络连接问题');
    console.log('   - API Key 错误\n');
  }
}

testConnection();

// 创建测试账号脚本
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://qhgdymgxcbyhtxezvoqt.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFoZ2R5bWd4Y2J5aHR4ZXp2b3F0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIxODU3MTYsImV4cCI6MjA3Nzc2MTcxNn0.6LBkr5EWygKpWeOTs7Hnap0nu7Mp76UQjxt1UXbcbPY';

const supabase = createClient(supabaseUrl, supabaseKey);

async function createTestUser() {
  console.log('\n🧪 Creating test user...\n');

  try {
    // 1. Sign up the user
    console.log('1️⃣  Signing up user: 123@123.com');
    const { data: authData, error: signUpError } = await supabase.auth.signUp({
      email: '123@123.com',
      password: '123123',
      options: {
        data: {
          display_name: '测试账号',
        },
      },
    });

    if (signUpError) {
      console.log('❌ Sign up error:', signUpError.message);
      
      // 如果用户已存在，尝试登录
      if (signUpError.message.includes('already registered')) {
        console.log('\n⚠️  User already exists, trying to sign in...');
        const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
          email: '123@123.com',
          password: '123123',
        });
        
        if (signInError) {
          console.log('❌ Sign in error:', signInError.message);
          return;
        }
        
        console.log('✅ Signed in successfully');
        console.log('   User ID:', signInData.user.id);
      } else {
        return;
      }
    } else {
      console.log('✅ User created successfully');
      console.log('   User ID:', authData.user?.id);
    }

    // 2. Check if user profile exists
    console.log('\n2️⃣  Checking user profile...');
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      console.log('❌ No authenticated user');
      return;
    }

    const { data: profile, error: profileError } = await supabase
      .from('users')
      .select('*')
      .eq('id', user.id)
      .single();

    if (profileError && profileError.code !== 'PGRST116') {
      console.log('❌ Profile check error:', profileError.message);
    } else if (!profile) {
      console.log('⚠️  Profile not found, creating...');
      
      // Create profile manually if trigger didn't work
      const { error: insertError } = await supabase
        .from('users')
        .insert({
          id: user.id,
          email: user.email,
          display_name: '测试账号',
          role: 'free',
          invites_remaining: 2,
        });

      if (insertError) {
        console.log('❌ Profile creation error:', insertError.message);
      } else {
        console.log('✅ Profile created');
      }
    } else {
      console.log('✅ Profile exists');
      console.log('   Display Name:', profile.display_name);
      console.log('   Role:', profile.role);
      console.log('   Invites Remaining:', profile.invites_remaining);
    }

    // 3. Assign invite codes to the user
    console.log('\n3️⃣  Assigning invite codes...');
    
    const { data: invites, error: invitesError } = await supabase
      .from('invites')
      .select('code')
      .in('code', ['TEST123A', 'TEST123B'])
      .is('created_by', null);

    if (invitesError) {
      console.log('❌ Invites check error:', invitesError.message);
    } else if (invites && invites.length > 0) {
      console.log('   Found', invites.length, 'unassigned codes');
      
      for (const invite of invites) {
        const { error: updateError } = await supabase
          .from('invites')
          .update({ created_by: user.id })
          .eq('code', invite.code);

        if (updateError) {
          console.log('   ❌ Error assigning', invite.code);
        } else {
          console.log('   ✅ Assigned', invite.code);
        }
      }
    } else {
      console.log('   ℹ️  No unassigned codes found');
    }

    console.log('\n✅ Test user setup complete!');
    console.log('\n📋 Login credentials:');
    console.log('   Email: 123@123.com');
    console.log('   Password: 123123');
    console.log('\n🔗 Login URL: http://localhost:3000/login\n');

  } catch (error) {
    console.log('\n❌ Unexpected error:', error.message);
  }
}

createTestUser();

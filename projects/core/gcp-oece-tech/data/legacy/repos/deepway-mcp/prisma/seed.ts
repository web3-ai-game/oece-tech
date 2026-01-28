import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 開始播種數據...')

  // 創建管理員用戶
  const adminPassword = await bcrypt.hash('admin123', 10)
  const admin = await prisma.user.upsert({
    where: { email: 'admin@deepway.me' },
    update: {},
    create: {
      email: 'admin@deepway.me',
      username: 'admin',
      password: adminPassword,
      name: 'DeepWay 管理員',
      role: 'ADMIN',
      verified: true,
      bio: 'DeepWay.me 平台管理員',
    },
  })

  console.log('✅ 管理員創建成功:', admin.username)

  // 創建測試用戶
  const userPassword = await bcrypt.hash('user123', 10)
  const users = await Promise.all([
    prisma.user.upsert({
      where: { email: 'user1@example.com' },
      update: {},
      create: {
        email: 'user1@example.com',
        username: 'mushroom_lover',
        password: userPassword,
        name: '菇菇愛好者',
        bio: '熱愛種植各種食用菌',
        verified: true,
      },
    }),
    prisma.user.upsert({
      where: { email: 'user2@example.com' },
      update: {},
      create: {
        email: 'user2@example.com',
        username: 'fungi_master',
        password: userPassword,
        name: '真菌大師',
        bio: '10年栽培經驗',
        verified: true,
        level: 5,
        points: 500,
      },
    }),
  ])

  console.log('✅ 測試用戶創建成功')

  // 創建分類
  const categories = await Promise.all([
    prisma.category.upsert({
      where: { slug: 'cultivation' },
      update: {},
      create: {
        name: '栽培技術',
        slug: 'cultivation',
        description: '各種真菌栽培技術討論',
        icon: '🌱',
        color: '#5a8f5a',
      },
    }),
    prisma.category.upsert({
      where: { slug: 'identification' },
      update: {},
      create: {
        name: '菌種識別',
        slug: 'identification',
        description: '真菌品種識別與鑑定',
        icon: '🔍',
        color: '#9c855f',
      },
    }),
    prisma.category.upsert({
      where: { slug: 'recipes' },
      update: {},
      create: {
        name: '料理分享',
        slug: 'recipes',
        description: '美味菇類料理食譜',
        icon: '🍳',
        color: '#ad997a',
      },
    }),
  ])

  console.log('✅ 分類創建成功')

  // 創建標籤
  const tags = await Promise.all([
    prisma.tag.create({ data: { name: '新手入門', slug: 'beginner' } }),
    prisma.tag.create({ data: { name: '進階技巧', slug: 'advanced' } }),
    prisma.tag.create({ data: { name: '常見問題', slug: 'faq' } }),
    prisma.tag.create({ data: { name: '經驗分享', slug: 'experience' } }),
  ])

  console.log('✅ 標籤創建成功')

  // 創建示例帖子
  const posts = await Promise.all([
    prisma.post.create({
      data: {
        title: '新手如何開始種植平菇',
        slug: 'how-to-grow-oyster-mushrooms',
        content: '這是一篇詳細的平菇種植教程...',
        summary: '適合新手的平菇種植入門指南',
        published: true,
        featured: true,
        authorId: users[1].id,
        categoryId: categories[0].id,
        tags: {
          create: [
            { tagId: tags[0].id },
            { tagId: tags[3].id },
          ],
        },
      },
    }),
    prisma.post.create({
      data: {
        title: '香菇栽培常見問題解答',
        slug: 'shiitake-cultivation-faq',
        content: '整理了香菇栽培中最常見的問題...',
        summary: '香菇種植過程中遇到的問題和解決方案',
        published: true,
        authorId: admin.id,
        categoryId: categories[0].id,
        tags: {
          create: [
            { tagId: tags[2].id },
          ],
        },
      },
    }),
  ])

  console.log('✅ 示例帖子創建成功')

  // 創建成就
  const achievements = await Promise.all([
    prisma.achievement.create({
      data: {
        name: '初來乍到',
        description: '完成註冊',
        icon: '🎉',
        points: 10,
      },
    }),
    prisma.achievement.create({
      data: {
        name: '發帖達人',
        description: '發布第一篇帖子',
        icon: '✍️',
        points: 20,
      },
    }),
    prisma.achievement.create({
      data: {
        name: '熱心助人',
        description: '回覆他人問題10次',
        icon: '🤝',
        points: 50,
      },
    }),
  ])

  console.log('✅ 成就創建成功')

  console.log('🎉 數據播種完成！')
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error('❌ 播種失敗:', e)
    await prisma.$disconnect()
    process.exit(1)
  })

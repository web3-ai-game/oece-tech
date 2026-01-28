import { defineCollection, z } from 'astro:content';

const tutorialsCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    
    // 分类
    category: z.enum(['vps', 'domain', 'payment', 'seo', 'tools', 'security']),
    
    // 标签
    tags: z.array(z.string()).default([]),
    
    // 难度
    difficulty: z.enum(['beginner', 'intermediate', 'advanced']),
    
    // 阅读时间（分钟）
    readTime: z.number(),
    
    // 是否付费
    isPremium: z.boolean().default(false),
    
    // 联盟产品
    affiliateProducts: z.array(z.string()).optional(),
    
    // 作者
    author: z.string().default('GeekSEA'),
    
    // 日期
    publishedAt: z.date(),
    updatedAt: z.date().optional(),
    
    // SEO
    ogImage: z.string().optional(),
    
    // 语言
    lang: z.enum(['zh-TW', 'en']),
    
    // 相关教程
    relatedTutorials: z.array(z.string()).optional(),
  }),
});

const experimentsCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    status: z.enum(['planning', 'in-progress', 'completed', 'failed']),
    startDate: z.date(),
    endDate: z.date().optional(),
    tags: z.array(z.string()),
    cost: z.string().optional(),
    githubRepo: z.string().optional(),
  }),
});

const toolsCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    category: z.enum(['hosting', 'domain', 'payment', 'development', 'marketing']),
    pricing: z.string(),
    affiliate: z.object({
      link: z.string(),
      commission: z.string(),
    }).optional(),
    pros: z.array(z.string()),
    cons: z.array(z.string()),
    rating: z.number().min(1).max(5),
    lang: z.enum(['zh-TW', 'en']),
  }),
});

export const collections = {
  tutorials: tutorialsCollection,
  experiments: experimentsCollection,
  tools: toolsCollection,
};

export const siteConfig = {
  name: 'AI Tools Hub',
  description: 'Professional AI tools for content creation',
  url: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
  ogImage: '/og-image.jpg',
  links: {
    twitter: 'https://twitter.com/aitoolshub',
    github: 'https://github.com/aitoolshub',
  },
  features: {
    imageGeneration: {
      name: 'Image Generation',
      description: 'Create stunning images from text descriptions',
      price: 0.5,
      currency: 'USD',
      unit: 'per image',
    },
    videoGeneration: {
      name: 'Video Generation',
      description: 'Generate short videos from descriptions',
      price: 2.0,
      currency: 'USD',
      unit: 'per 30 seconds',
    },
    contentWriting: {
      name: 'Content Writing',
      description: 'AI-powered content writing assistant',
      price: 0.2,
      currency: 'USD',
      unit: 'per 100 words',
    },
  },
};

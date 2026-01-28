export type Article = {
  slug: string;
  category: 'Digital Nomad' | 'Geographic Arbitrage' | 'Urban Hermit' | 'Time Negotiation';
  date: string;
  author: string;
  image: {
    src: string;
    alt: string;
    width: number;
    height: number;
    hint: string;
  };
};

export type AiTool = {
  icon: React.ComponentType<{ className?: string }>;
  title?: string;
  description?: string;
  cta?: string;
  titleKey?: string;
  descriptionKey?: string;
  ctaKey?: string;
  href: string;
  category: string;
  isPro: boolean;
}

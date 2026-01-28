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
  icon: React.ElementType;
  titleKey: string;
  descriptionKey: string;
  href: string;
  ctaKey: string;
  category: 'Travel Cost' | 'Digital Nomad Security and Remote Work';
  isPro: boolean;
}

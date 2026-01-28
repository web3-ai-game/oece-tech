
import type { Article } from '@/lib/types';
import placeholderImages from '@/lib/placeholder-images.json';

const findImage = (id: string) => {
    const image = placeholderImages.find(img => img.id === id);
    if (!image) {
        return {
            src: 'https://picsum.photos/seed/default/800/600',
            width: 800,
            height: 600,
            alt: 'Default placeholder image',
            hint: 'placeholder',
        }
    }
    return {
        src: image.imageUrl,
        width: image.width,
        height: image.height,
        alt: image.description,
        hint: image.imageHint,
    }
};

export const articles: Article[] = [
  {
    slug: 'my-digital-nomad-setup-in-chiang-mai',
    category: 'Digital Nomad',
    date: '2024-07-15',
    author: 'Alex Doe',
    image: findImage('tech-setup'),
  },
  {
    slug: 'island-hopping-in-the-philippines',
    category: 'Geographic Arbitrage',
    date: '2024-06-28',
    author: 'Jane Smith',
    image: findImage('philippines-beach'),
  },
  {
    slug: 'building-a-pwa-for-offline-travel',
    category: 'Digital Nomad',
    date: '2024-05-19',
    author: 'Alex Doe',
    image: findImage('pwa-code'),
  },
  {
    slug: 'a-week-in-hanoi',
    category: 'Geographic Arbitrage',
    date: '2024-04-22',
    author: 'Jane Smith',
    image: findImage('hanoi-street'),
  },
  {
    slug: 'kuala-lumpur-digital-hub',
    category: 'Geographic Arbitrage',
    date: '2024-03-10',
    author: 'Chris Wong',
    image: findImage('kuala-lumpur-skyline'),
  },
  {
    slug: 'ubud-work-life-balance',
    category: 'Urban Hermit',
    date: '2024-02-18',
    author: 'Emily Chen',
    image: findImage('bali-rice-fields'),
  },
  {
    slug: 'singapore-tech-innovation',
    category: 'Digital Nomad',
    date: '2024-01-25',
    author: 'David Lee',
    image: findImage('singapore-gardens'),
  },
  {
    slug: 'bangkok-street-food-adventure',
    category: 'Geographic Arbitrage',
    date: '2023-12-12',
    author: 'Sarah Kim',
    image: findImage('bangkok-market'),
  },
  {
    slug: 'essential-remote-work-tools',
    category: 'Digital Nomad',
    date: '2023-11-30',
    author: 'Alex Doe',
    image: findImage('remote-work-tools'),
  },
  {
    slug: 'why-you-need-a-vpn',
    category: 'Digital Nomad',
    date: '2023-10-15',
    author: 'Alex Doe',
    image: findImage('vpn-security'),
  },
  {
    slug: 'fintech-in-southeast-asia',
    category: 'Time Negotiation',
    date: '2023-09-05',
    author: 'David Lee',
    image: findImage('fintech-asia'),
  },
  {
    slug: 'esim-vs-physical-sim',
    category: 'Digital Nomad',
    date: '2023-08-21',
    author: 'Jane Smith',
    image: findImage('e-sim-travel'),
  }
];

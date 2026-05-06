export interface Product {
  id: string;
  name: string;
  category: 'Incense' | 'Literature' | 'Artifacts' | 'Attire';
  price: number;
  description: string;
  imageUrl: string;
  specifications: Record<string, string>;
}
export interface Article {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  imageUrl: string;
  date: string;
}
export const MOCK_PRODUCTS: Product[] = [
  {
    id: 'p1',
    name: 'Ancient Bronze Incense Burner',
    category: 'Incense',
    price: 185.00,
    description: 'A hand-cast bronze burner inspired by the Han Dynasty. Designed for spiral incense and sandalwood chips, evoking a sense of ancient ritual.',
    imageUrl: 'https://images.unsplash.com/photo-1612487528505-d2338264c821?q=80&w=800&auto=format&fit=crop',
    specifications: { Material: 'Bronze', Weight: '1.2kg', Origin: 'Longquan' }
  },
  {
    id: 'p2',
    name: 'Laozi\'s Daodejing - Special Edition',
    category: 'Literature',
    price: 45.00,
    description: 'A beautifully bound, dual-language edition of the Tao Te Ching, featuring traditional calligraphy and modern scholarly commentary.',
    imageUrl: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=800&auto=format&fit=crop',
    specifications: { Format: 'Hardcover', Pages: '240', Language: 'English/Mandarin' }
  },
  {
    id: 'p3',
    name: 'Jade Yin-Yang Pendant',
    category: 'Artifacts',
    price: 320.00,
    description: 'Carved from premium Hetian jade, this pendant represents the balance of opposing forces. Each piece has unique natural veining.',
    imageUrl: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?q=80&w=800&auto=format&fit=crop',
    specifications: { Stone: 'Hetian Jade', Diameter: '30mm', Chain: 'Silk cord' }
  },
  {
    id: 'p4',
    name: 'Meditative Linen Robe',
    category: 'Attire',
    price: 120.00,
    description: 'Hand-sewn from organic linen, this robe offers maximum comfort for meditation and daily practice. Dyed with natural indigo.',
    imageUrl: 'https://images.unsplash.com/photo-1515446059691-889895058f47?q=80&w=800&auto=format&fit=crop',
    specifications: { Material: '100% Organic Linen', Color: 'Sage Green', Fit: 'Loose' }
  },
  {
    id: 'p5',
    name: 'Handmade Bamboo Flute (Dizi)',
    category: 'Artifacts',
    price: 95.00,
    description: 'Crafted by master luthiers, this bitter bamboo flute produces a clear, resonant tone perfect for mountain melodies.',
    imageUrl: 'https://images.unsplash.com/photo-1573511860302-28c52431992a?q=80&w=800&auto=format&fit=crop',
    specifications: { Material: 'Bitter Bamboo', Key: 'F', Length: '48cm' }
  },
  {
    id: 'p6',
    name: 'Natural Sandalwood Coils',
    category: 'Incense',
    price: 28.00,
    description: 'Pure aged Australian sandalwood with no chemical additives. Each coil burns for approximately 4 hours.',
    imageUrl: 'https://images.unsplash.com/photo-1602143354807-62a81816528d?q=80&w=800&auto=format&fit=crop',
    specifications: { Quantity: '40 Coils', BurnTime: '4h', Scent: 'Woody/Earthyp' }
  }
];
export const MOCK_ARTICLES: Article[] = [
  {
    id: 'a1',
    title: 'Wu Wei: The Art of Effortless Action',
    excerpt: 'Understanding the core Taoist principle of non-striving and aligning with the natural flow of the universe.',
    content: 'Wu Wei is often translated as "non-action" or "effortless action." It does not mean doing nothing, but rather acting in a way that is so natural and aligned with the Tao that there is no resistance...',
    imageUrl: 'https://images.unsplash.com/photo-1507415492521-917f60c93bfe?q=80&w=800&auto=format&fit=crop',
    date: 'Autumn Equinox, 2024'
  },
  {
    id: 'a2',
    title: 'The Symbolism of Jade in Taoism',
    excerpt: 'Why this precious stone has been revered as the "Stone of Heaven" for millennia in Eastern philosophy.',
    content: 'Jade is more than a decorative stone; it represents purity, longevity, and the five virtues. In Taoist practice, it is believed to bridge the gap between the physical and spiritual realms...',
    imageUrl: 'https://images.unsplash.com/photo-1569333550881-30ca887c2f6d?q=80&w=800&auto=format&fit=crop',
    date: 'Summer Solstice, 2024'
  },
  {
    id: 'a3',
    title: 'Creating a Zen Space at Home',
    excerpt: 'Simple steps to transform your living environment into a sanctuary of peace and balance.',
    content: 'Our environment deeply impacts our internal state. By incorporating natural materials, soft lighting, and meaningful artifacts, we can create a space that encourages mindfulness...',
    imageUrl: 'https://images.unsplash.com/photo-1545205597-3d9d02c29597?q=80&w=800&auto=format&fit=crop',
    date: 'Spring Equinox, 2024'
  }
];
export const MOCK_USERS = [{ id: 'u1', name: 'Master Zhou' }];
export const MOCK_CHATS = [{ id: 'c1', title: 'Philosophy Discussion' }];
export const MOCK_CHAT_MESSAGES = [];
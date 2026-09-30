export interface SeedProductVariant {
  sizeValue: string // e.g. '16cm', '20cm', '24cm'
  colorValue: string // e.g. 'chocolate', 'pastel-pink', 'matcha-green'
  priceInIDR: number
}

export interface SeedProduct {
  title: string
  slug: string
  categorySlug: string
  description: string
  priceInIDR: number
  imageUrl: string
  enableVariants: boolean
  variants?: SeedProductVariant[]
}

export const BAKERY_CATEGORIES = [
  {
    title: 'Birthday Cake',
    slug: 'birthday-cake',
  },
  {
    title: 'Cakes & Tarts',
    slug: 'cakes-tarts',
  },
  {
    title: 'Artisan Sourdough',
    slug: 'artisan-sourdough',
  },
  {
    title: 'Viennoiserie & Pastry',
    slug: 'viennoiserie-pastry',
  },
]

export const BAKERY_VARIANT_TYPES = {
  size: {
    name: 'size',
    label: 'Ukuran Kue',
    options: [
      { label: 'Diameter 16 cm (4-6 Porsi)', value: '16cm' },
      { label: 'Diameter 20 cm (8-10 Porsi)', value: '20cm' },
      { label: 'Diameter 24 cm (12-16 Porsi)', value: '24cm' },
    ],
  },
  color: {
    name: 'color',
    label: 'Pilihan Warna / Tema',
    options: [
      { label: 'Classic Dark Chocolate', value: 'chocolate' },
      { label: 'Pastel Pink & Berry', value: 'pastel-pink' },
      { label: 'Earthy Matcha Green', value: 'matcha-green' },
    ],
  },
}

export const BAKERY_PRODUCTS: SeedProduct[] = [
  // 1. Birthday Cake (Dengan Varian Ukuran & Warna/Tema)
  {
    title: 'Signature Basque Burnt Cheesecake',
    slug: 'signature-basque-burnt-cheesecake',
    categorySlug: 'birthday-cake',
    description:
      'Cheesecake khas Basque dengan permukaan karamel gosong yang gurih manis dan bagian tengah krim keju meleleh lembut. Dibuat dengan keju Philadelphia murni.',
    priceInIDR: 220000,
    imageUrl:
      'https://images.unsplash.com/photo-1533134242443-d4fd215305ad?auto=format&fit=crop&w=800&q=80',
    enableVariants: true,
    variants: [
      { sizeValue: '16cm', colorValue: 'chocolate', priceInIDR: 220000 },
      { sizeValue: '20cm', colorValue: 'chocolate', priceInIDR: 320000 },
      { sizeValue: '24cm', colorValue: 'chocolate', priceInIDR: 420000 },
    ],
  },
  {
    title: 'Valrhona Dark Chocolate Birthday Cake',
    slug: 'valrhona-dark-chocolate-birthday-cake',
    categorySlug: 'birthday-cake',
    description:
      'Kue cokelat berlapis sponge cake lembut, dark chocolate mousse Valrhona 70%, dan lapisan glaze cokelat mengilap. Pilihan tepat untuk perayaan ulang tahun istimewa.',
    priceInIDR: 240000,
    imageUrl:
      'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=800&q=80',
    enableVariants: true,
    variants: [
      { sizeValue: '16cm', colorValue: 'chocolate', priceInIDR: 240000 },
      { sizeValue: '16cm', colorValue: 'pastel-pink', priceInIDR: 240000 },
      { sizeValue: '20cm', colorValue: 'chocolate', priceInIDR: 350000 },
      { sizeValue: '20cm', colorValue: 'pastel-pink', priceInIDR: 350000 },
      { sizeValue: '24cm', colorValue: 'chocolate', priceInIDR: 460000 },
      { sizeValue: '24cm', colorValue: 'pastel-pink', priceInIDR: 460000 },
    ],
  },
  {
    title: 'Fresh Strawberry Chantilly Cake',
    slug: 'fresh-strawberry-chantilly-cake',
    categorySlug: 'birthday-cake',
    description:
      'Sponge vanilla Jepang super lembut dipadukan dengan krim Chantilly segar ringan dan potongan stroberi manis berlimpah.',
    priceInIDR: 210000,
    imageUrl:
      'https://images.unsplash.com/photo-1565958011703-44f9829ba187?auto=format&fit=crop&w=800&q=80',
    enableVariants: true,
    variants: [
      { sizeValue: '16cm', colorValue: 'pastel-pink', priceInIDR: 210000 },
      { sizeValue: '20cm', colorValue: 'pastel-pink', priceInIDR: 310000 },
      { sizeValue: '24cm', colorValue: 'pastel-pink', priceInIDR: 410000 },
    ],
  },

  // 2. Cakes & Tarts (Non-Varian)
  {
    title: 'Classic French Lemon Tart (Tarte au Citron)',
    slug: 'classic-french-lemon-tart',
    categorySlug: 'cakes-tarts',
    description:
      'Kulit tart mentega renyah dengan isian curd lemon segar yang asam manis seimbang, dihiasi meringue bakar halus.',
    priceInIDR: 48000,
    imageUrl:
      'https://images.unsplash.com/photo-1587314168485-3236d6710814?auto=format&fit=crop&w=800&q=80',
    enableVariants: false,
  },
  {
    title: 'Traditional Canelé de Bordeaux (Box of 4)',
    slug: 'traditional-canele-de-bordeaux',
    categorySlug: 'cakes-tarts',
    description:
      'Kudapan tradisional Bordeaux dengan kerak karamel garing beraroma madu dan custard lembut beraroma vanilla rum.',
    priceInIDR: 110000,
    imageUrl:
      'https://images.unsplash.com/photo-1519869325930-281384150729?auto=format&fit=crop&w=800&q=80',
    enableVariants: false,
  },
  {
    title: 'Caramelized Pecan & Almond Tartlet',
    slug: 'caramelized-pecan-almond-tartlet',
    categorySlug: 'cakes-tarts',
    description:
      'Tartlet gurih manis dengan kacang pecan dan almond panggang yang diselimuti sirup karamel gula aren lembut.',
    priceInIDR: 52000,
    imageUrl:
      'https://images.unsplash.com/photo-1509365465985-25d11c17e812?auto=format&fit=crop&w=800&q=80',
    enableVariants: false,
  },

  // 3. Artisan Sourdough (Non-Varian)
  {
    title: 'The Signature Country Sourdough Loaf',
    slug: 'signature-country-sourdough-loaf',
    categorySlug: 'artisan-sourdough',
    description:
      'Roti sourdough klasik yang difermentasi dingin lambat selama 24 jam dengan starter alami murni. Kerak garing kecokelatan dengan remah berongga kenyal.',
    priceInIDR: 65000,
    imageUrl:
      'https://images.unsplash.com/photo-1589367920969-ab8e050bbb04?auto=format&fit=crop&w=800&q=80',
    enableVariants: false,
  },
  {
    title: 'Rosemary & Garlic Sea Salt Focaccia',
    slug: 'rosemary-garlic-focaccia',
    categorySlug: 'artisan-sourdough',
    description:
      'Roti focaccia lembut khas Italia berlimpah minyak zaitun extra virgin, bawang putih panggang manis, dan daun rosemary segar.',
    priceInIDR: 45000,
    imageUrl:
      'https://images.unsplash.com/photo-1586444248902-2f64eddc13df?auto=format&fit=crop&w=800&q=80',
    enableVariants: false,
  },
  {
    title: 'Traditional French Baguette',
    slug: 'traditional-french-baguette',
    categorySlug: 'artisan-sourdough',
    description:
      'Baguette tradisional Prancis berkerak garing renyah keemasan dengan remah berongga khas Paris. Dipanggang segar setiap pagi.',
    priceInIDR: 32000,
    imageUrl:
      'https://images.unsplash.com/photo-1597079910443-60c43fc4f729?auto=format&fit=crop&w=800&q=80',
    enableVariants: false,
  },

  // 4. Viennoiserie & Pastry (Non-Varian)
  {
    title: 'French Butter Croissant AOP',
    slug: 'french-butter-croissant',
    categorySlug: 'viennoiserie-pastry',
    description:
      'Croissant berlapis dengan 100% mentega Prancis AOP. Tekstur sarang lebah yang renyah di luar dan lumer harum di mulut.',
    priceInIDR: 35000,
    imageUrl:
      'https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=800&q=80',
    enableVariants: false,
  },
  {
    title: 'Pain au Chocolat Valrhona',
    slug: 'pain-au-chocolat-valrhona',
    categorySlug: 'viennoiserie-pastry',
    description:
      'Pastry berlapis mentega Prancis dengan isian dua batang cokelat hitam Valrhona Prancis yang meleleh saat dinikmati hangat.',
    priceInIDR: 42000,
    imageUrl:
      'https://images.unsplash.com/photo-1623334044303-241021148842?auto=format&fit=crop&w=800&q=80',
    enableVariants: false,
  },
  {
    title: 'Almond Twice-Baked Croissant',
    slug: 'almond-twice-baked-croissant',
    categorySlug: 'viennoiserie-pastry',
    description:
      'Croissant yang dipanggang ulang dengan krim frangipane almond lembut di dalam dan taburan irisan almond garing serta gula halus di atasnya.',
    priceInIDR: 46000,
    imageUrl:
      'https://images.unsplash.com/photo-1530610476181-d83430b64dcd?auto=format&fit=crop&w=800&q=80',
    enableVariants: false,
  },
]

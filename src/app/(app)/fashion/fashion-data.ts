export interface FashionProduct {
  id: string
  name: string
  category: string
  categorySlug: 'outerwear' | 'tops' | 'bags'
  price: number
  rating: number
  reviewCount: number
  image: string
  colors: string[]
  moods: string[]
  description: string
  isNewArrival?: boolean
}

export interface ProductCategoryGroup {
  id: 'outerwear' | 'tops' | 'bags'
  title: string
  subtitle?: string
  products: FashionProduct[]
}

export interface TestimonialItem {
  id: string
  quote: string
  author: string
  role?: string
  rating: number
  featuredProduct: {
    name: string
    color: string
    price: number
    image: string
  }
  lookImage: string
}

export const MOOD_TAGS = [
  'Percaya Diri',
  'Minimalis',
  'Abadi',
  'Santai',
  'Klasik',
  'Ceria',
] as const

export const FEATURE_BENEFITS = [
  {
    id: 'shipping',
    title: 'Bebas Ongkir',
    subtitle: 'Pesanan di atas Rp 1.000.000',
    iconType: 'truck',
  },
  {
    id: 'returns',
    title: 'Retur Mudah',
    subtitle: 'Garansi tukar 30 hari',
    iconType: 'refresh',
  },
  {
    id: 'checkout',
    title: 'Transaksi Aman',
    subtitle: 'Terlindungi & tepercaya',
    iconType: 'shield',
  },
]

export const PRODUCT_CATEGORIES: ProductCategoryGroup[] = [
  {
    id: 'outerwear',
    title: 'Jaket & Luaran',
    products: [
      {
        id: 'stand-up-collar',
        name: 'Stand-up Collar Jacket',
        category: 'Jaket',
        categorySlug: 'outerwear',
        price: 599000,
        rating: 5,
        reviewCount: 123,
        image: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?q=80&w=800&auto=format&fit=crop',
        colors: ['Krem', 'Pasir', 'Batu'],
        moods: ['Minimalis', 'Abadi', 'Santai'],
        description: 'Jaket ritsleting bersiluet rapi dengan kerah tegak arsitektural berbahan katun premium.',
        isNewArrival: true,
      },
      {
        id: 'bomber-jacket',
        name: 'Bomber Jacket Crimson',
        category: 'Luaran',
        categorySlug: 'outerwear',
        price: 1190000,
        rating: 5,
        reviewCount: 123,
        image: 'https://images.unsplash.com/photo-1544441893-675973e31985?q=80&w=800&auto=format&fit=crop',
        colors: ['Merah Crimson', 'Hitam Jet', 'Zaitun'],
        moods: ['Percaya Diri', 'Ceria'],
        description: 'Jaket bomber dengan volume proporsional, bahu santai, dan lapisan furing satin halus.',
        isNewArrival: true,
      },
      {
        id: 'croppet-rib-collar',
        name: 'Cropped Rib-Collar',
        category: 'Jaket',
        categorySlug: 'outerwear',
        price: 499000,
        rating: 5,
        reviewCount: 123,
        image: 'https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?q=80&w=800&auto=format&fit=crop',
        colors: ['Hitam Oniks', 'Arang', 'Biru Tua'],
        moods: ['Minimalis', 'Klasik', 'Percaya Diri'],
        description: 'Model cropped bergaris bersih dengan rajutan rib elastis di bagian leher dan hem bawah.',
        isNewArrival: true,
      },
      {
        id: 'relaxed-car-coat',
        name: 'Relaxed Car Coat',
        category: 'Mantel',
        categorySlug: 'outerwear',
        price: 1450000,
        rating: 5,
        reviewCount: 76,
        image: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=800&auto=format&fit=crop',
        colors: ['Camel', 'Espresso', 'Abu Sabak'],
        moods: ['Abadi', 'Santai'],
        description: 'Mantel semi panjang dengan kancing tersembunyi dan saku dalam yang lapang.',
        isNewArrival: true,
      },
      {
        id: 'wool-overshirt',
        name: 'Wool Overshirt',
        category: 'Jaket Kemeja',
        categorySlug: 'outerwear',
        price: 850000,
        rating: 5,
        reviewCount: 64,
        image: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=800&auto=format&fit=crop',
        colors: ['Arang Gelap', 'Abu Abu'],
        moods: ['Klasik', 'Minimalis'],
        description: 'Jaket kemeja berbahan wol padat bergaris lurus dengan saku ganda di dada.',
        isNewArrival: true,
      },
    ],
  },
  {
    id: 'tops',
    title: 'Atasan & Kemeja',
    products: [
      {
        id: 'tailored-linen-blazer',
        name: 'Tailored Linen Blazer',
        category: 'Blazer',
        categorySlug: 'tops',
        price: 890000,
        rating: 5,
        reviewCount: 98,
        image: 'https://images.unsplash.com/photo-1584273143981-41c073dfe8f8?q=80&w=800&auto=format&fit=crop',
        colors: ['Ekru Hangat', 'Oatmeal', 'Grafit'],
        moods: ['Klasik', 'Abadi', 'Minimalis'],
        description: 'Blazer linen tanpa bantalan kaku yang ringan dan nyaman untuk layering berlapis.',
        isNewArrival: true,
      },
      {
        id: 'boxy-cotton-crewneck',
        name: 'Boxy Cotton Crewneck',
        category: 'Kaus',
        categorySlug: 'tops',
        price: 360000,
        rating: 5,
        reviewCount: 142,
        image: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?q=80&w=800&auto=format&fit=crop',
        colors: ['Putih Kapur', 'Zaitun Pudar', 'Abu Abu'],
        moods: ['Santai', 'Minimalis'],
        description: 'Kaus katun combed 280gsm dengan potongan bahu rileks dan kerah bundar padat.',
        isNewArrival: true,
      },
      {
        id: 'fine-gauge-knit',
        name: 'Fine-Gauge Knit Polo',
        category: 'Rajut',
        categorySlug: 'tops',
        price: 680000,
        rating: 5,
        reviewCount: 89,
        image: 'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?q=80&w=800&auto=format&fit=crop',
        colors: ['Taupe', 'Biru Malam', 'Putih Tulang'],
        moods: ['Abadi', 'Klasik'],
        description: 'Kemeja polo rajut katun bertekstur micro rib dengan kerah rapi tanpa kancing.',
        isNewArrival: true,
      },
      {
        id: 'poplin-oversized-shirt',
        name: 'Crisp Poplin Shirt',
        category: 'Kemeja',
        categorySlug: 'tops',
        price: 540000,
        rating: 5,
        reviewCount: 110,
        image: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?q=80&w=800&auto=format&fit=crop',
        colors: ['Biru Langit', 'Putih Murni', 'Garis Biru'],
        moods: ['Percaya Diri', 'Abadi'],
        description: 'Kemeja poplin katun Mesir yang ringan dengan manset lurus dan kerah runcing rapi.',
        isNewArrival: true,
      },
      {
        id: 'merino-cardigan',
        name: 'Merino Rib Cardigan',
        category: 'Rajut',
        categorySlug: 'tops',
        price: 950000,
        rating: 5,
        reviewCount: 78,
        image: 'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?q=80&w=800&auto=format&fit=crop',
        colors: ['Kastanye', 'Arang', 'Alabaster'],
        moods: ['Santai', 'Abadi'],
        description: 'Kardigan wol merino ekstra lembut dengan detail kancing tanduk alami.',
        isNewArrival: true,
      },
    ],
  },
  {
    id: 'bags',
    title: 'Tas & Aksesori',
    products: [
      {
        id: 'crossbody-bag',
        name: 'Crossbody Bag Noir',
        category: 'Tas',
        categorySlug: 'bags',
        price: 599000,
        rating: 5,
        reviewCount: 123,
        image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?q=80&w=800&auto=format&fit=crop',
        colors: ['Hitam', 'Cokelat Kayu', 'Tulang'],
        moods: ['Abadi', 'Minimalis', 'Percaya Diri'],
        description: 'Tas selempang kulit anak sapi dengan tali yang dapat disesuaikan dan dua kompartemen dalam.',
        isNewArrival: true,
      },
      {
        id: 'minimalist-leather-tote',
        name: 'Studio Leather Tote',
        category: 'Tas',
        categorySlug: 'bags',
        price: 1350000,
        rating: 5,
        reviewCount: 88,
        image: 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?q=80&w=800&auto=format&fit=crop',
        colors: ['Espresso', 'Cognac', 'Tinta'],
        moods: ['Klasik', 'Abadi'],
        description: 'Tote bag kulit lapang dengan pegangan berlapis kuat dan pengait kunci interior.',
        isNewArrival: true,
      },
      {
        id: 'canvas-weekender',
        name: 'Heavyweight Daypack',
        category: 'Tas',
        categorySlug: 'bags',
        price: 820000,
        rating: 5,
        reviewCount: 95,
        image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?q=80&w=800&auto=format&fit=crop',
        colors: ['Hijau Lapangan', 'Khaki Gurun', 'Hitam'],
        moods: ['Santai', 'Ceria'],
        description: 'Ransel harian kanvas tahan air dengan aksen tali kulit bridle yang kokoh.',
        isNewArrival: true,
      },
      {
        id: 'structured-shoulder-bag',
        name: 'Structured Shoulder Bag',
        category: 'Tas',
        categorySlug: 'bags',
        price: 740000,
        rating: 5,
        reviewCount: 67,
        image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?q=80&w=800&auto=format&fit=crop',
        colors: ['Burgundy', 'Hitam', 'Zaitun'],
        moods: ['Percaya Diri', 'Minimalis'],
        description: 'Tas bahu bersiluet tegas dengan kancing magnetik tersembunyi dan tepian halus.',
        isNewArrival: true,
      },
      {
        id: 'woven-cardholder-pouch',
        name: 'Woven Zip Pouch',
        category: 'Aksesori',
        categorySlug: 'bags',
        price: 320000,
        rating: 5,
        reviewCount: 154,
        image: 'https://images.unsplash.com/photo-1627123424574-724758594e93?q=80&w=800&auto=format&fit=crop',
        colors: ['Tan', 'Hitam', 'Hutan'],
        moods: ['Ceria', 'Minimalis'],
        description: 'Dompet anyaman kulit sintetis mewah dengan ritsleting kuningan dan slot kartu.',
        isNewArrival: true,
      },
    ],
  },
]

export const ALL_PRODUCTS = PRODUCT_CATEGORIES.flatMap((c) => c.products)

export const TESTIMONIALS: TestimonialItem[] = [
  {
    id: 'testimonial-1',
    quote: '“Kualitas bahannya sangat nyaman, potongannya rapi, dan terasa lebih istimewa saat dikenakan langsung. Selalu jadi pilihan pakaian yang ingin saya kenakan setiap hari.”',
    author: 'EMMA R.',
    role: 'Pelanggan Terverifikasi',
    rating: 5,
    featuredProduct: {
      name: 'TAS SELEMPANG',
      color: 'Warna: Hitam',
      price: 599000,
      image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?q=80&w=400&auto=format&fit=crop',
    },
    lookImage: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?q=80&w=1000&auto=format&fit=crop',
  },
  {
    id: 'testimonial-2',
    quote: '“Potongan jaket bombernya sangat presisi. Bahannya nyaman, tidak panas, dan cocok dipakai di berbagai suasana kasual maupun semi formal.”',
    author: 'CLARA S.',
    role: 'Pelanggan Terverifikasi',
    rating: 5,
    featuredProduct: {
      name: 'STAND-UP COLLAR',
      color: 'Warna: Pasir',
      price: 599000,
      image: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?q=80&w=400&auto=format&fit=crop',
    },
    lookImage: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=1000&auto=format&fit=crop',
  },
  {
    id: 'testimonial-3',
    quote: '“Avenue berhasil menghadirkan esensial bergaya dengan bahan luar biasa. Tekstur kain dan siluetnya terasa seperti busana butik papan atas.”',
    author: 'MARCUS V.',
    role: 'Pelanggan Terverifikasi',
    rating: 5,
    featuredProduct: {
      name: 'CROPPED RIB-COLLAR',
      color: 'Warna: Oniks',
      price: 499000,
      image: 'https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?q=80&w=400&auto=format&fit=crop',
    },
    lookImage: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?q=80&w=1000&auto=format&fit=crop',
  },
]

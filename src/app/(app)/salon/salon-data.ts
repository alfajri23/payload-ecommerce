export interface Treatment {
  id: string
  name: string
  category: string
  duration: string
  price: number
  priceFormatted: string
  description: string
  image: string
  featured?: boolean
  popularBadge?: string
  benefits: string[]
}

export interface PricingPlan {
  id: string
  name: string
  subtitle: string
  monthlyPrice: number
  monthlyPriceFormatted: string
  yearlyPrice: number
  yearlyPriceFormatted: string
  isPopular?: boolean
  features: string[]
}

export interface Testimonial {
  id: string
  name: string
  role: string
  rating: number
  quote: string
  avatar: string
  serviceUsed: string
}

export const TREATMENTS: Treatment[] = [
  {
    id: 'deep-tissue',
    name: 'Pijat Jaringan Dalam',
    category: 'Nyeri Otot & Bahu',
    duration: '60 mnt',
    price: 280000,
    priceFormatted: 'Rp 280.000',
    description: 'Tekanan kuat untuk melepas simpul otot kaku di leher, bahu, dan punggung.',
    image: 'https://images.unsplash.com/photo-1519823551278-64ac92734fb1?q=80&w=800&auto=format&fit=crop',
    benefits: ['Urai otot kaku', 'Lancarkan sirkulasi', 'Ringankan tubuh'],
  },
  {
    id: 'therapeutic-massage',
    name: 'Pijat Terapeutik',
    category: 'Seluruh Tubuh',
    duration: '90 mnt',
    price: 350000,
    priceFormatted: 'Rp 350.000',
    description: 'Pijatan ritmis dengan minyak hangat untuk meredakan lelah dan stres.',
    image: 'https://images.unsplash.com/photo-1600334129128-685c5582fd35?q=80&w=800&auto=format&fit=crop',
    featured: true,
    popularBadge: 'Paling Diminati',
    benefits: ['Minyak aromaterapi hangat', 'Rileks menyeluruh', 'Tidur lebih nyenyak'],
  },
  {
    id: 'sports-recovery',
    name: 'Pemulihan Olahraga',
    category: 'Peregangan Atlet',
    duration: '60 mnt',
    price: 300000,
    priceFormatted: 'Rp 300.000',
    description: 'Peregangan pasif untuk mempercepat pemulihan otot setelah berolahraga.',
    image: 'https://images.unsplash.com/photo-1574680096145-d05b474e2155?q=80&w=800&auto=format&fit=crop',
    benefits: ['Cegah kram otot', 'Tingkatkan kelenturan', 'Cepat pulih'],
  },
  {
    id: 'herbal-warm-stone',
    name: 'Terapi Batu Hangat',
    category: 'Relaksasi Herbal',
    duration: '75 mnt',
    price: 320000,
    priceFormatted: 'Rp 320.000',
    description: 'Batu basal hangat dan rempah herbal untuk menghangatkan tubuh.',
    image: 'https://images.unsplash.com/photo-1507652313519-d4e9174996dd?q=80&w=800&auto=format&fit=crop',
    benefits: ['Hangatkan badan', 'Redakan pegal', 'Tidur lelap'],
  },
  {
    id: 'reflexology-scalp',
    name: 'Refleksi & Totok Kepala',
    category: 'Penyegaran Cepat',
    duration: '45 mnt',
    price: 190000,
    priceFormatted: 'Rp 190.000',
    description: 'Titik tekan telapak kaki dan kepala untuk segarkan pikiran.',
    image: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?q=80&w=800&auto=format&fit=crop',
    benefits: ['Redakan pusing', 'Lancarkan peredaran', 'Kembalikan fokus'],
  },
  {
    id: 'lymphatic-detox',
    name: 'Detoks Limfatik',
    category: 'Sirkulasi Tubuh',
    duration: '90 mnt',
    price: 420000,
    priceFormatted: 'Rp 420.000',
    description: 'Usapan lembut untuk melancarkan getah bening dan kurangi rasa bengkak.',
    image: 'https://images.unsplash.com/photo-1515377905703-c4788e51af15?q=80&w=800&auto=format&fit=crop',
    benefits: ['Kurangi bengkak', 'Bantu imunitas', 'Badan lebih enteng'],
  },
]

export const PRICING_PLANS: PricingPlan[] = [
  {
    id: 'basic',
    name: 'Basic',
    subtitle: '2 sesi per bulan untuk relaksasi rutin',
    monthlyPrice: 450000,
    monthlyPriceFormatted: 'Rp 450.000',
    yearlyPrice: 380000,
    yearlyPriceFormatted: 'Rp 380.000',
    features: [
      '2 sesi pijat pilihan per bulan',
      'Diskon 10% untuk sesi tambahan',
      'Bebas pilih jadwal akhir pekan',
    ],
  },
  {
    id: 'premium',
    name: 'Premium',
    subtitle: '4 sesi per bulan untuk tubuh tetap bugar',
    monthlyPrice: 850000,
    monthlyPriceFormatted: 'Rp 850.000',
    yearlyPrice: 720000,
    yearlyPriceFormatted: 'Rp 720.000',
    isPopular: true,
    features: [
      '4 sesi pijat pilihan per bulan',
      'Diskon 20% untuk sesi tambahan',
      'Prioritas jadwal terapis',
      'Sajian teh herbal hangat',
    ],
  },
  {
    id: 'elite',
    name: 'Elite',
    subtitle: 'Sesi mingguan dengan layanan penuh',
    monthlyPrice: 1500000,
    monthlyPriceFormatted: 'Rp 1.500.000',
    yearlyPrice: 1275000,
    yearlyPriceFormatted: 'Rp 1.275.000',
    features: [
      'Sesi mingguan bebas pilih',
      'Diskon 30% semua layanan',
      'Terapis pribadi tetap',
      'Akses ruang VIP privat',
    ],
  },
]

export const TESTIMONIALS: Testimonial[] = [
  {
    id: 'testi-1',
    name: 'Sarah Santoso',
    role: 'Marketing',
    rating: 5,
    quote:
      'Pijat 90 menitnya pas sekali. Pegal di punggung bawah langsung berkurang dan terapisnya sangat sopan.',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=300&auto=format&fit=crop',
    serviceUsed: 'Pijat Terapeutik 90m',
  },
  {
    id: 'testi-2',
    name: 'Michael Hendrawan',
    role: 'Pelari',
    rating: 5,
    quote:
      'Rutin ambil sehabis lari mingguan. Otot kaki cepat rileks dan tidak gampang kram.',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=300&auto=format&fit=crop',
    serviceUsed: 'Pemulihan Olahraga 60m',
  },
  {
    id: 'testi-3',
    name: 'Robert Williams',
    role: 'Desainer',
    rating: 5,
    quote:
      'Tempatnya bersih, wangi serai hangat, dan tekanan pijatnya pas sesuai permintaan.',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=300&auto=format&fit=crop',
    serviceUsed: 'Terapi Batu Hangat',
  },
]

export const SPA_GALLERY_IMAGES = [
  {
    url: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?q=80&w=800&auto=format&fit=crop',
    caption: 'Ruang Perawatan Privat dengan Pencahayaan Tenang',
  },
  {
    url: 'https://images.unsplash.com/photo-1515377905703-c4788e51af15?q=80&w=800&auto=format&fit=crop',
    caption: 'Terapi Relaksasi & Perawatan Tubuh Alami',
  },
  {
    url: 'https://images.unsplash.com/photo-1507652313519-d4e9174996dd?q=80&w=800&auto=format&fit=crop',
    caption: 'Batu Basal Hangat Alami dengan Minyak Atsiri',
  },
  {
    url: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?q=80&w=800&auto=format&fit=crop',
    caption: 'Totok Wajah & Relaksasi Kulit Kepala',
  },
]


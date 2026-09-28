import type { Metadata } from 'next'
import { HomePageClient } from './page.client'

export const metadata: Metadata = {
    title: 'The Bakery | Artisan Sourdough, Pastry & Fresh Bakes',
    description:
        'Toko roti dan pastry artisan dengan bahan alami terbaik. Menyajikan sourdough fermentasi lambat, croissant mentega Prancis, dan aneka kue segar setiap hari.',
    openGraph: {
        title: 'The Bakery | Artisan Sourdough, Pastry & Fresh Bakes',
        description:
            'Dipanggang segar setiap pagi. Jl. Senopati No. 42, Kebayoran Baru, Jakarta Selatan. Hubungi kami di +62 812-8899-7722.',
    },
}

export default function HomePage() {
    return <HomePageClient />
}

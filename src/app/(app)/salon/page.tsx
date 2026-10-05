import type { Metadata } from 'next'
import React from 'react'
import { SalonPageClient } from './page.client'

export const metadata: Metadata = {
  title: 'Wellnest Wellness & Spa | Sanctuary Pijat Terapeutik & Relaksasi Holistik',
  description:
    'Sanctuary perawatan pijat terapeutik dan relaksasi holistik. Pulihkan tubuh, redakan nyeri otot kronis, dan kembalikan ketenangan pikiran bersama terapis bersertifikasi.',
  openGraph: {
    title: 'Wellnest Wellness & Spa | Sanctuary Perawatan Tubuh & Relaksasi',
    description:
      'Pijat terapeutik terarah untuk meredakan ketegangan otot, mengurangi stres, dan memulihkan vitalitas alami tubuh Anda.',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?q=80&w=1200&auto=format&fit=crop',
        width: 1200,
        height: 630,
        alt: 'Wellnest Spa Experience',
      },
    ],
  },
}

export default function SalonPage() {
  return <SalonPageClient />
}

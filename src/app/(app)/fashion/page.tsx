import type { Metadata } from 'next'
import React from 'react'
import { FashionPageClient } from './page.client'

export const metadata: Metadata = {
  title: 'Avenue | The Art of Everyday Style | Elevated Wardrobe Essentials',
  description:
    'Discover elevated fashion essentials designed with simplicity, comfort, and modern living in mind. Shop new season arrivals, tailored jackets, and timeless outerwear.',
  openGraph: {
    title: 'Avenue | The Art of Everyday Style',
    description:
      'Elevated essentials designed with simplicity, comfort, and modern living in mind.',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?q=85&w=1200&auto=format&fit=crop',
        width: 1200,
        height: 630,
        alt: 'Avenue Fashion - The Art of Everyday Style',
      },
    ],
  },
}

export default function FashionPage() {
  return <FashionPageClient />
}

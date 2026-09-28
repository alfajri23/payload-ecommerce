import type { Metadata } from 'next'

import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { mergeOpenGraph } from '@/utilities/mergeOpenGraph'

import { QuickOrderClient } from './page.client'

export default async function QuickOrderPage() {
  const payload = await getPayload({ config: configPromise })

  const { docs: products } = await payload.find({
    collection: 'products',
    depth: 1,
    limit: 50,
    sort: 'title',
  })

  return <QuickOrderClient products={products} />
}

export const metadata: Metadata = {
  description: 'Pilih produk dan pesan langsung dalam satu halaman.',
  openGraph: mergeOpenGraph({
    title: 'Pesan Langsung',
    url: '/order',
  }),
  title: 'Pesan Langsung',
}

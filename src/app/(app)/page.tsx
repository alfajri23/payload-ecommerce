import type { Metadata } from 'next'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { getCachedGlobal } from '@/utilities/getGlobals'
import type { GeneralSetting } from '@/payload-types'
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

export default async function HomePage() {
  const payload = await getPayload({ config: configPromise })
  const generalSettings: GeneralSetting = await getCachedGlobal('general-settings', 1)()

  // 1. Ambil daftar kategori
  const { docs: categories } = await payload.find({
    collection: 'categories',
    limit: 100,
  })

  // 2. Ambil produk yang published
  const { docs: products } = await payload.find({
    collection: 'products',
    draft: false,
    limit: 100,
    depth: 1,
  })

  // 3. Kelompokkan produk berdasarkan kategori
  const categoriesWithProducts = categories
    .map((category) => ({
      id: category.id,
      title: category.title,
      products: products.filter((product) =>
        product.categories?.some((cat) =>
          typeof cat === 'object' ? cat.id === category.id : cat === category.id,
        ),
      ),
    }))
    .filter((group) => group.products.length > 0)

  // Masukkan juga produk yang belum memiliki kategori jika ada
  const uncategorizedProducts = products.filter(
    (product) => !product.categories || product.categories.length === 0,
  )
  if (uncategorizedProducts.length > 0) {
    categoriesWithProducts.push({
      id: 0,
      title: 'Lainnya',
      products: uncategorizedProducts,
    })
  }

  return (
    <HomePageClient
      categoriesWithProducts={categoriesWithProducts}
      generalSettings={generalSettings}
    />
  )
}

import type { Media, Product, GeneralSetting } from '@/payload-types'

import { RenderBlocks } from '@/blocks/RenderBlocks'
import { ProductGridItem } from '@/components/ProductGridItem'
import { Gallery } from '@/components/product/Gallery'
import { ProductDescription } from '@/components/product/ProductDescription'
import { getCachedGlobal } from '@/utilities/getGlobals'
import configPromise from '@payload-config'
import { ChevronLeftIcon } from 'lucide-react'
import { Metadata } from 'next'
import { draftMode } from 'next/headers'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getPayload } from 'payload'
import React, { Suspense } from 'react'

type Args = {
  params: Promise<{
    slug: string
  }>
}

export async function generateMetadata({ params }: Args): Promise<Metadata> {
  const { slug } = await params
  const product = await queryProductBySlug({ slug })

  if (!product) return notFound()

  const gallery = product.gallery?.filter((item) => typeof item.image === 'object') || []

  const metaImage = typeof product.meta?.image === 'object' ? product.meta?.image : undefined
  const canIndex = product._status === 'published'

  const seoImage = metaImage || (gallery.length ? (gallery[0]?.image as Media) : undefined)

  return {
    description: product.meta?.description || '',
    openGraph: seoImage?.url
      ? {
        images: [
          {
            alt: seoImage?.alt,
            height: seoImage.height!,
            url: seoImage?.url,
            width: seoImage.width!,
          },
        ],
      }
      : null,
    robots: {
      follow: canIndex,
      googleBot: {
        follow: canIndex,
        index: canIndex,
      },
      index: canIndex,
    },
    title: product.meta?.title || product.title,
  }
}

export default async function ProductPage({ params }: Args) {
  const { slug } = await params
  const [product, generalSettings] = await Promise.all([
    queryProductBySlug({ slug }),
    getCachedGlobal('general-settings', 1)().catch(() => null) as Promise<GeneralSetting | null>,
  ])

  if (!product) return notFound()

  const gallery =
    product.gallery
      ?.filter((item) => typeof item.image === 'object')
      .map((item) => ({
        ...item,
        image: item.image as Media,
      })) || []

  const metaImage = typeof product.meta?.image === 'object' ? product.meta?.image : undefined
  const hasStock = product.enableVariants
    ? product?.variants?.docs?.some((variant) => {
      if (typeof variant !== 'object') return false
      return variant.inventory && variant?.inventory > 0
    })
    : product.inventory! > 0

  let price = product.priceInIDR

  if (product.enableVariants && product?.variants?.docs?.length) {
    price = product?.variants?.docs?.reduce((acc, variant) => {
      if (typeof variant === 'object' && variant?.priceInIDR && acc && variant?.priceInIDR > acc) {
        return variant.priceInIDR
      }
      return acc
    }, price)
  }

  const productJsonLd = {
    name: product.title,
    '@context': 'https://schema.org',
    '@type': 'Product',
    description: product.description,
    image: metaImage?.url,
    offers: {
      '@type': 'AggregateOffer',
      availability: hasStock ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
      price: price,
      priceCurrency: 'idr',
    },
  }

  const relatedProducts =
    product.relatedProducts?.filter((relatedProduct) => typeof relatedProduct === 'object') ?? []

  return (
    <React.Fragment>
      <script
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(productJsonLd),
        }}
        type="application/ld+json"
      />
      <div className="container mx-auto px-4 sm:px-8 lg:px-12 py-8 sm:py-12">
        {/* Navigation Breadcrumb / Back Link */}
        <nav aria-label="Breadcrumb" className="mb-8">
          <Link
            href="/shop"
            className="inline-flex items-center gap-1.5 text-xs font-medium uppercase tracking-wider text-slate-500 hover:text-slate-900 transition-colors"
          >
            <ChevronLeftIcon className="h-3.5 w-3.5" />
            <span>Kembali ke Katalog Produk</span>
          </Link>
        </nav>

        {/* Clean, open 2-column showcase without card boxing */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start">
          {/* Gallery Column */}
          <div className="lg:col-span-6 xl:col-span-7">
            <Suspense
              fallback={
                <div className="relative aspect-square w-full rounded-none bg-slate-50 animate-pulse border border-slate-100" />
              }
            >
              {Boolean(gallery?.length) && <Gallery gallery={gallery} />}
            </Suspense>
          </div>

          {/* Product Info & Buying Actions Column */}
          <div className="lg:col-span-6 xl:col-span-5">
            <Suspense fallback={null}>
              <ProductDescription
                product={product}
                enableInventoryValidation={generalSettings?.enableInventoryValidation}
              />
            </Suspense>
          </div>
        </div>
      </div>

      {product.layout?.length ? <RenderBlocks blocks={product.layout} /> : <></>}

      {relatedProducts.length ? (
        <div className="container mx-auto px-4 sm:px-8 lg:px-12">
          <RelatedProducts products={relatedProducts as Product[]} />
        </div>
      ) : (
        <></>
      )}
    </React.Fragment>
  )
}

function RelatedProducts({ products }: { products: Product[] }) {
  if (!products.length) return null

  return (
    <section className="py-16 border-t border-slate-200 mt-12">
      <div className="flex items-end justify-between mb-8">
        <div>
          <p className="text-xs uppercase tracking-widest font-semibold text-slate-400">
            Rekomendasi Kami
          </p>
          <h2 className="text-2xl font-medium tracking-tight text-slate-900 mt-1">
            Produk Pilihan Lainnya
          </h2>
        </div>
        <Link
          href="/shop"
          className="text-xs font-medium text-slate-600 hover:text-slate-900 transition-colors"
        >
          Lihat Semua Produk &rarr;
        </Link>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {products.slice(0, 4).map((product) => (
          <ProductGridItem key={product.id} product={product} />
        ))}
      </div>
    </section>
  )
}

const queryProductBySlug = async ({ slug }: { slug: string }) => {
  const { isEnabled: draft } = await draftMode()

  const payload = await getPayload({ config: configPromise })

  const result = await payload.find({
    collection: 'products',
    depth: 3,
    draft,
    limit: 1,
    overrideAccess: draft,
    pagination: false,
    where: {
      and: [
        {
          slug: {
            equals: slug,
          },
        },
        ...(draft ? [] : [{ _status: { equals: 'published' } }]),
      ],
    },
    populate: {
      variants: {
        title: true,
        priceInIDR: true,
        inventory: true,
        options: true,
      },
    },
  })

  return result.docs?.[0] || null
}

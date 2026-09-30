import type { Product } from '@/payload-types'

import { Media } from '@/components/Media'
import { Price } from '@/components/Price'
import { Wheat } from 'lucide-react'
import Link from 'next/link'
import React from 'react'

type Props = {
  product: Partial<Product>
}

export const ProductGridItem: React.FC<Props> = ({ product }) => {
  const { gallery, priceInIDR, title, description, slug } = product

  let price = priceInIDR

  const variants = product.variants?.docs

  if (variants && variants.length > 0) {
    const variant = variants[0]
    if (
      variant &&
      typeof variant === 'object' &&
      variant?.priceInIDR &&
      typeof variant.priceInIDR === 'number'
    ) {
      price = variant.priceInIDR
    }
  }

  const image =
    gallery?.[0]?.image && typeof gallery[0]?.image !== 'string' ? gallery[0]?.image : false

  // Deskripsi / subtitle produk (diambil dari meta description atau description string)
  let subtitle = product.meta?.description || ''
  if (!subtitle && typeof description === 'string') {
    subtitle = description
  }

  return (
    <Link
      className="group flex flex-col justify-between transition-all duration-300 h-full"
      href={`/products/${slug}`}
    >
      {/* 1:1 Square Image tanpa border dengan latar warm cream artisan */}
      <div className="relative aspect-square w-full rounded-2xl overflow-hidden bg-[#faf7f2]">
        {image ? (
          <Media
            className="relative h-full w-full"
            fill
            imgClassName="h-full w-full object-cover group-hover:scale-104 transition-transform duration-500"
            resource={image}
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-[#d1c7b7]">
            <Wheat className="h-10 w-10 stroke-[1.5]" />
          </div>
        )}
      </div>

      {/* Rincian Produk: Hirarki tipografi rapi & proporsional */}
      <div className="pt-3.5 space-y-2.5 flex-1 flex flex-col justify-between">
        <div className="space-y-1">
          <h4 className="text-base font-semibold text-slate-900 group-hover:text-[#bc6432] transition-colors leading-snug">
            {title}
          </h4>
          {subtitle ? (
            <p className="text-xs text-slate-600 font-normal leading-relaxed line-clamp-2">
              {subtitle}
            </p>
          ) : null}
        </div>

        {/* Harga & Tombol Pesan Terracotta */}
        <div className="pt-1 flex items-center justify-between">
          {typeof price === 'number' ? (
            <Price
              amount={price}
              as="span"
              className="text-sm sm:text-base font-medium text-slate-900"
            />
          ) : (
            <span className="text-sm text-slate-400">-</span>
          )}
          <span className="rounded-lg bg-[#bc6432] group-hover:bg-[#a35224] px-4 py-2 text-xs font-semibold text-white shadow-xs transition-colors">
            Pesan
          </span>
        </div>
      </div>
    </Link>
  )
}

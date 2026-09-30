import { Media } from '@/components/Media'
import type { Media as MediaType, Product, ThreeItemGridBlock as ThreeItemGridBlockProps } from '@/payload-types'
import { cn } from '@/utilities/cn'
import { Wheat } from 'lucide-react'
import Link from 'next/link'
import type { DefaultDocumentIDType } from 'payload'
import React from 'react'

type ThreeItemCardProps = {
  item: Product
  priority?: boolean
  isFeatured?: boolean
}

export const ThreeItemGridItem: React.FC<ThreeItemCardProps> = ({ item, isFeatured = false }) => {
  const image =
    (item.meta?.image && typeof item.meta.image !== 'string' ? item.meta.image : null) ||
    (item.gallery?.[0]?.image && typeof item.gallery[0]?.image !== 'string' ? item.gallery[0]?.image : null)

  return (
    <Link
      href={`/products/${item.slug}`}
      className="group relative block h-full w-full overflow-hidden rounded-xl sm:rounded-2xl border border-slate-200/80 bg-[#faf7f2] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-900 transition-shadow duration-300 hover:shadow-md"
    >
      {/* Background Media */}
      {image ? (
        <Media
          fill
          resource={image as MediaType}
          className="absolute inset-0 h-full w-full"
          imgClassName="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center text-[#d1c7b7] bg-[#faf7f2]">
          <Wheat className="h-10 w-10 stroke-[1.5]" />
        </div>
      )}

      {/* Subtle Gradient Overlay for Text Readability */}
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent pointer-events-none transition-opacity duration-300 group-hover:from-slate-950/90" />



      {/* Title Only (No Price) */}
      <div className="absolute bottom-0 inset-x-0 p-4 sm:p-5 lg:p-6 z-10">
        <h3
          className={cn(
            'text-white tracking-tight leading-snug drop-shadow-xs line-clamp-2 transition-transform duration-300 group-hover:translate-x-0.5',
            isFeatured ? 'text-lg sm:text-xl md:text-2xl font-semibold' : 'text-sm sm:text-base md:text-lg font-medium',
          )}
        >
          {item.title}
        </h3>
      </div>
    </Link>
  )
}

export const ThreeItemGridBlock: React.FC<
  ThreeItemGridBlockProps & {
    id?: DefaultDocumentIDType
    className?: string
  }
> = async ({ products, className }) => {
  if (!products || !products[0] || !products[1] || !products[2]) return null

  const [firstProduct, secondProduct, thirdProduct] = products

  return (
    <section className={cn('container mx-auto px-4 sm:px-8 lg:px-12 my-10 sm:my-14 lg:my-16', className)}>
      <div className="grid grid-cols-1 md:grid-cols-12 gap-3 sm:gap-4 md:h-[420px] lg:h-[460px]">
        {/* Dominant Hero Showcase (Left, ~60-65% width) */}
        <div className="h-[280px] sm:h-[340px] md:h-full md:col-span-7 lg:col-span-8">
          <ThreeItemGridItem isFeatured item={firstProduct as Product} priority />
        </div>

        {/* Two Stacked Items (Right, ~35-40% width) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-1 gap-3 sm:gap-4 md:col-span-5 lg:col-span-4 md:h-full">
          <div className="h-[180px] sm:h-[200px] md:h-full">
            <ThreeItemGridItem item={secondProduct as Product} />
          </div>
          <div className="h-[180px] sm:h-[200px] md:h-full">
            <ThreeItemGridItem item={thirdProduct as Product} />
          </div>
        </div>
      </div>
    </section>
  )
}

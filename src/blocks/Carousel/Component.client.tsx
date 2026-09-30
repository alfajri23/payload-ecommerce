'use client'
import type { Media, Product } from '@/payload-types'

import { GridTileImage } from '@/components/Grid/tile'
import { Carousel, CarouselContent, CarouselItem } from '@/components/ui/carousel'
import AutoScroll from 'embla-carousel-auto-scroll'
import Link from 'next/link'
import React from 'react'

export const CarouselClient: React.FC<{ products: Product[] }> = ({ products }) => {
  if (!products?.length) return null

  // Purposefully duplicating products to make the carousel loop and not run out of products on wide screens.
  const carouselProducts = [...products, ...products, ...products]

  return (
    <Carousel
      className="w-full"
      opts={{ align: 'start', loop: true }}
      plugins={[
        AutoScroll({
          playOnInit: true,
          speed: 1,
          stopOnInteraction: false,
          stopOnMouseEnter: true,
        }),
      ]}
    >
      <CarouselContent className="-ml-4 sm:-ml-6">
        {carouselProducts.map((product, i) => (
          <CarouselItem
            className="relative aspect-[4/3] h-[240px] sm:h-[280px] md:h-[320px] w-auto max-w-[85vw] flex-none pl-4 sm:pl-6"
            key={`${product.slug}${i}`}
          >
            <Link
              className="relative block aspect-[4/3] h-full w-full rounded-xl sm:rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-900"
              href={`/products/${product.slug}`}
            >
              <GridTileImage
                label={{
                  title: product.title,
                }}
                media={(product.meta?.image as Media) || (product.gallery?.[0]?.image as Media)}
              />
            </Link>
          </CarouselItem>
        ))}
      </CarouselContent>
    </Carousel>
  )
}


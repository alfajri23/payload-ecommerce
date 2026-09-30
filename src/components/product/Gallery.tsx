'use client'

import type { Product } from '@/payload-types'

import { Media } from '@/components/Media'
import { useSearchParams } from 'next/navigation'
import { DefaultDocumentIDType } from 'payload'
import React, { useEffect } from 'react'

type Props = {
  gallery: NonNullable<Product['gallery']>
}

export const Gallery: React.FC<Props> = ({ gallery }) => {
  const searchParams = useSearchParams()
  const [current, setCurrent] = React.useState(0)

  useEffect(() => {
    const values = Array.from(searchParams.values())

    if (values) {
      const index = gallery.findIndex((item) => {
        if (!item.variantOption) return false

        let variantID: DefaultDocumentIDType

        if (typeof item.variantOption === 'object') {
          variantID = item.variantOption.id
        } else variantID = item.variantOption

        return Boolean(values.find((value) => value === String(variantID)))
      })
      console.log(index)
      if (index !== -1) {
        setCurrent(index)
      } else {
        setCurrent(0)
      }
    }
  }, [searchParams, gallery])

  return (
    <div className="flex flex-col gap-4">
      {/* 1:1 Square Main Image with clean sharp edges (no radius) */}
      <div className="relative aspect-square w-full rounded-none overflow-hidden bg-slate-50 border border-slate-200/80">
        {gallery[current]?.image && typeof gallery[current].image === 'object' && (
          <Media
            resource={gallery[current].image}
            fill
            priority
            className="h-full w-full"
            imgClassName="h-full w-full object-cover rounded-none"
          />
        )}
      </div>

      {/* Thumbnails without radius */}
      {gallery.length > 1 && (
        <div className="flex items-center gap-2.5 overflow-x-auto pt-1 pb-1">
          {gallery.map((item, i) => {
            if (typeof item.image !== 'object') return null

            const isSelected = i === current

            return (
              <button
                type="button"
                key={`${item.image.id}-${i}`}
                onClick={() => setCurrent(i)}
                aria-label={`Lihat gambar produk ke-${i + 1}`}
                className={`relative h-16 w-16 sm:h-20 sm:w-20 shrink-0 rounded-none overflow-hidden border transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-900 ${isSelected
                  ? 'border-2 border-slate-900 ring-1 ring-slate-900/10 opacity-100'
                  : 'border-slate-200 opacity-60 hover:opacity-100 hover:border-slate-400'
                  }`}
              >
                <Media
                  resource={item.image}
                  fill
                  className="h-full w-full"
                  imgClassName="h-full w-full object-cover rounded-none"
                />
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}

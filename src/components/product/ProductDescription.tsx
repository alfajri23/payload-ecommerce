'use client'
import type { Product, Variant } from '@/payload-types'

import { AddToCart } from '@/components/Cart/AddToCart'
import { Price } from '@/components/Price'
import { useSearchParams } from 'next/navigation'
import { Suspense, useMemo } from 'react'

import { StockIndicator } from '@/components/product/StockIndicator'
import { useCurrency } from '@payloadcms/plugin-ecommerce/client/react'
import { VariantSelector } from './VariantSelector'

export function ProductDescription({ product }: { product: Product }) {
  const { currency } = useCurrency()
  const searchParams = useSearchParams()

  let amount = 0,
    lowestAmount = 0,
    highestAmount = 0

  const priceField = `priceIn${currency.code}` as keyof Product
  const variantPriceField = `priceIn${currency.code}` as keyof Variant
  const hasVariants = Boolean(product.enableVariants && product.variants?.docs?.length)

  // Find currently selected variant based on searchParams (?variant=... or selected options)
  const selectedVariant = useMemo<Variant | undefined>(() => {
    if (product.enableVariants && product.variants?.docs?.length) {
      const variantId = searchParams.get('variant')

      if (variantId) {
        const found = product.variants.docs.find(
          (v) => typeof v === 'object' && String(v.id) === variantId,
        )
        if (found && typeof found === 'object') return found as Variant
      }

      // Fallback: match by current option parameters in searchParams
      const searchParamValues = Array.from(searchParams.values())
      if (searchParamValues.length > 0) {
        const matchedExact = product.variants.docs.find((variant) => {
          if (
            !variant ||
            typeof variant !== 'object' ||
            !variant.options ||
            !Array.isArray(variant.options)
          )
            return false
          return variant.options.every((opt) => {
            const optId = typeof opt === 'object' ? String(opt.id) : String(opt)
            return searchParamValues.includes(optId)
          })
        })
        if (matchedExact && typeof matchedExact === 'object') return matchedExact as Variant

        const matchedPartial = product.variants.docs.find((variant) => {
          if (
            !variant ||
            typeof variant !== 'object' ||
            !variant.options ||
            !Array.isArray(variant.options)
          )
            return false
          return variant.options.some((opt) => {
            const optId = typeof opt === 'object' ? String(opt.id) : String(opt)
            return searchParamValues.includes(optId)
          })
        })
        if (matchedPartial && typeof matchedPartial === 'object') return matchedPartial as Variant
      }
    }
    return undefined
  }, [product.enableVariants, product.variants?.docs, searchParams])

  // Get price of selected variant if one is selected and has price
  const selectedVariantPrice = useMemo<number | undefined>(() => {
    if (
      selectedVariant &&
      typeof selectedVariant[variantPriceField] === 'number' &&
      selectedVariant[variantPriceField] !== null
    ) {
      return selectedVariant[variantPriceField] as number
    }
    return undefined
  }, [selectedVariant, variantPriceField])

  if (hasVariants) {
    const variantsOrderedByPrice = product.variants?.docs
      ?.filter((variant) => variant && typeof variant === 'object')
      .sort((a, b) => {
        if (
          typeof a === 'object' &&
          typeof b === 'object' &&
          variantPriceField in a &&
          variantPriceField in b &&
          typeof a[variantPriceField] === 'number' &&
          typeof b[variantPriceField] === 'number'
        ) {
          return (a[variantPriceField] as number) - (b[variantPriceField] as number)
        }

        return 0
      }) as Variant[]

    const lowestVariant = variantsOrderedByPrice[0]?.[variantPriceField]
    const highestVariant = variantsOrderedByPrice[variantsOrderedByPrice.length - 1]?.[variantPriceField]
    if (
      variantsOrderedByPrice &&
      typeof lowestVariant === 'number' &&
      typeof highestVariant === 'number'
    ) {
      lowestAmount = lowestVariant
      highestAmount = highestVariant
    }
  } else if (product[priceField] && typeof product[priceField] === 'number') {
    amount = product[priceField]
  }

  return (
    <div className="flex flex-col space-y-3">
      {/* Title & Price Header with distinct colors */}
      <div className="space-y-2">
        <h1 className="text-2xl sm:text-3xl lg:text-3xl font-medium tracking-tight text-slate-900 leading-tight">
          {product.title}
        </h1>
        <div className="flex items-baseline gap-3">
          <div className="text-xl sm:text-2xl font-semibold text-[#bc6432] tracking-tight">
            {selectedVariantPrice !== undefined ? (
              <Price amount={selectedVariantPrice} />
            ) : hasVariants ? (
              <Price highestAmount={highestAmount} lowestAmount={lowestAmount} />
            ) : (
              <Price amount={amount} />
            )}
          </div>
          <span className="text-xs text-slate-400 font-normal">
            Belum termasuk ongkir
          </span>
        </div>
      </div>

      {/* Hairline Divider */}
      <div className="border-t border-slate-200/70" />

      {/* Description */}
      {product.description ? (
        <div className="text-sm text-slate-600 leading-relaxed font-normal">
          <p>{product.description}</p>
        </div>
      ) : null}

      {/* Variants Selection */}
      {hasVariants && (
        <Suspense fallback={null}>
          <VariantSelector product={product} />
        </Suspense>
      )}

      {/* Stock Status */}
      <div>
        <Suspense fallback={null}>
          <StockIndicator product={product} />
        </Suspense>
      </div>

      {/* Action Buttons */}
      <div className="pt-2">
        <Suspense fallback={null}>
          <AddToCart product={product} />
        </Suspense>
      </div>
    </div>
  )
}

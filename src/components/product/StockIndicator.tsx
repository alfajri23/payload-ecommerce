'use client'
import type { Product, Variant } from '@/payload-types'
import { isInventoryValidationEnabled } from '@/utilities/isInventoryEnabled'
import { useSearchParams } from 'next/navigation'
import { useMemo } from 'react'

type Props = {
  product: Product
  enableInventoryValidation?: boolean | null
}

export const StockIndicator: React.FC<Props> = ({ product, enableInventoryValidation }) => {
  const searchParams = useSearchParams()
  const checkInventory = isInventoryValidationEnabled(enableInventoryValidation)

  const variants = product.variants?.docs || []

  const selectedVariant = useMemo<Variant | undefined>(() => {
    if (product.enableVariants && variants.length) {
      const variantId = searchParams.get('variant')
      const validVariant = variants.find((variant) => {
        if (typeof variant === 'object') {
          return String(variant.id) === variantId
        }
        return String(variant) === variantId
      })

      if (validVariant && typeof validVariant === 'object') {
        return validVariant
      }
    }

    return undefined
  }, [product.enableVariants, searchParams, variants])

  const stockQuantity = useMemo(() => {
    if (product.enableVariants) {
      if (selectedVariant) {
        return selectedVariant.inventory || 0
      }
    }
    return product.inventory || 0
  }, [product.enableVariants, selectedVariant, product.inventory])

  if (!checkInventory) {
    return (
      <div className="text-xs font-normal">
        <span className="inline-flex items-center gap-2 text-emerald-700 font-medium">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 shrink-0" />
          Tersedia fresh hari ini
        </span>
      </div>
    )
  }

  if (product.enableVariants && !selectedVariant) {
    return null
  }

  return (
    <div className="text-xs font-normal">
      {stockQuantity < 10 && stockQuantity > 0 && (
        <span className="inline-flex items-center gap-2 text-amber-700 font-medium">
          <span className="h-1.5 w-1.5 rounded-full bg-amber-500 shrink-0" />
          Sisa {stockQuantity} porsi untuk hari ini
        </span>
      )}
      {(stockQuantity === 0 || !stockQuantity) && (
        <span className="inline-flex items-center gap-2 text-rose-600 font-medium">
          <span className="h-1.5 w-1.5 rounded-full bg-rose-500 shrink-0" />
          Stok varian ini sedang habis
        </span>
      )}
      {stockQuantity >= 10 && (
        <span className="inline-flex items-center gap-2 text-emerald-700 font-medium">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 shrink-0" />
          Tersedia fresh hari ini
        </span>
      )}
    </div>
  )
}

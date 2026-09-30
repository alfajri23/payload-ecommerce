'use client'

import { Button } from '@/components/ui/button'
import type { Product, Variant } from '@/payload-types'
import { isInventoryValidationEnabled } from '@/utilities/isInventoryEnabled'

import { useCart } from '@payloadcms/plugin-ecommerce/client/react'
import clsx from 'clsx'
import { ShoppingBag } from 'lucide-react'
import { useRouter, useSearchParams } from 'next/navigation'
import React, { useCallback, useMemo, useState } from 'react'
import { toast } from 'sonner'
type Props = {
  product: Product
}

export function AddToCart({ product }: Props) {
  const { addItem, cart, isLoading } = useCart()
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isBuyingNow, setIsBuyingNow] = useState(false)
  const checkInventory = isInventoryValidationEnabled()

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

  const addToCart = useCallback(
    async (e: React.FormEvent<HTMLButtonElement>) => {
      e.preventDefault()

      try {
        await addItem({
          product: product.id,
          variant: selectedVariant?.id ?? undefined,
        })
        toast.success('Produk berhasil ditambahkan ke keranjang.')
      } catch (err) {
        console.error('Add to cart error:', err)
        toast.error('Gagal menambahkan produk ke keranjang.')
      }
    },
    [addItem, product, selectedVariant],
  )

  const handleBuyNow = useCallback(
    async (e: React.FormEvent<HTMLButtonElement>) => {
      e.preventDefault()
      setIsBuyingNow(true)

      try {
        await addItem({
          product: product.id,
          variant: selectedVariant?.id ?? undefined,
        })
        router.push('/cart')
      } catch (err) {
        console.error('Buy now error:', err)
        toast.error('Gagal memproses pesanan.')
      } finally {
        setIsBuyingNow(false)
      }
    },
    [addItem, product, selectedVariant, router],
  )

  const disabled = useMemo<boolean>(() => {
    // Jika produk memiliki varian, wajib memilih varian terlebih dahulu
    if (product.enableVariants && !selectedVariant) {
      return true
    }

    // Jika validasi stok dinonaktifkan, tombol selalu aktif untuk pembelian
    if (!checkInventory) {
      return false
    }

    // Validasi stok aktif (mode ketat)
    const existingItem = cart?.items?.find((item) => {
      const productID = typeof item.product === 'object' ? item.product?.id : item.product
      const variantID = item.variant
        ? typeof item.variant === 'object'
          ? item.variant?.id
          : item.variant
        : undefined

      if (productID === product.id) {
        if (product.enableVariants) {
          return variantID === selectedVariant?.id
        }
        return true
      }
    })

    if (existingItem) {
      const existingQuantity = existingItem.quantity

      if (product.enableVariants) {
        return existingQuantity >= (selectedVariant?.inventory || 0)
      }
      return existingQuantity >= (product.inventory || 0)
    }

    if (product.enableVariants) {
      if (selectedVariant && selectedVariant.inventory === 0) {
        return true
      }
    } else {
      if (product.inventory === 0) {
        return true
      }
    }

    return false
  }, [selectedVariant, cart?.items, product, checkInventory])

  const isVariantMissing = Boolean(product.enableVariants && !selectedVariant)

  const buyButtonLabel = isBuyingNow
    ? 'Memproses...'
    : isVariantMissing
      ? 'Pilih Varian'
      : disabled
        ? 'Stok Habis'
        : 'Beli Sekarang'

  const cartButtonLabel = isLoading
    ? 'Menambahkan...'
    : isVariantMissing
      ? 'Pilih Varian'
      : disabled
        ? 'Stok Habis'
        : 'Tambah ke Keranjang'

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
      {/* Primary Action: Buy Now */}
      <Button
        aria-label="Beli sekarang"
        disabled={disabled || isLoading || isBuyingNow}
        onClick={handleBuyNow}
        type="button"
        className={clsx(
          'w-full h-12 rounded-none font-medium text-xs uppercase tracking-wider transition-all duration-150 flex items-center justify-center gap-2',
          disabled || isLoading || isBuyingNow
            ? 'bg-slate-200 text-slate-400 cursor-not-allowed border-0'
            : 'bg-slate-900 hover:bg-black text-white cursor-pointer active:scale-[0.99] border-0 focus-visible:ring-2 focus-visible:ring-slate-900 focus-visible:ring-offset-2',
        )}
      >
        <span>{buyButtonLabel}</span>
      </Button>

      {/* Secondary Action: Add to Cart */}
      <Button
        aria-label="Tambah ke keranjang"
        disabled={disabled || isLoading || isBuyingNow}
        onClick={addToCart}
        type="button"
        variant="outline"
        className={clsx(
          'w-full h-12 rounded-none font-medium text-xs uppercase tracking-wider transition-all duration-150 flex items-center justify-center gap-2 border',
          disabled || isLoading || isBuyingNow
            ? 'border-slate-200 bg-slate-50 text-slate-400 cursor-not-allowed'
            : 'border-slate-300 bg-white text-slate-900 hover:border-slate-900 hover:bg-slate-50 cursor-pointer active:scale-[0.99] focus-visible:ring-2 focus-visible:ring-slate-900 focus-visible:ring-offset-2',
        )}
      >
        <ShoppingBag className="h-4 w-4" />
        <span>{cartButtonLabel}</span>
      </Button>
    </div>
  )
}

'use client'

import { Media } from '@/components/Media'
import { Price } from '@/components/Price'
import type { Product } from '@/payload-types'
import { useCart } from '@payloadcms/plugin-ecommerce/client/react'
import { Minus, Plus, ShoppingBag } from 'lucide-react'
import { useRouter } from 'next/navigation'
import React, { useCallback, useMemo, useState } from 'react'
import { toast } from 'sonner'

type SelectedItems = Record<number, number>

type Props = {
  products: Product[]
}

export function QuickOrderClient({ products }: Props) {
  const [selected, setSelected] = useState<SelectedItems>({})
  const { addItem } = useCart()
  const router = useRouter()
  const [isAdding, setIsAdding] = useState(false)

  const updateQuantity = useCallback((productId: number, delta: number) => {
    setSelected((prev) => {
      const current = prev[productId] || 0
      const next = Math.max(0, current + delta)
      if (next === 0) {
        const { [productId]: _, ...rest } = prev
        return rest
      }
      return { ...prev, [productId]: next }
    })
  }, [])

  const totalItems = useMemo(() => {
    return Object.values(selected).reduce((sum, qty) => sum + qty, 0)
  }, [selected])

  const totalPrice = useMemo(() => {
    return Object.entries(selected).reduce((sum, [idStr, qty]) => {
      const product = products.find((p) => p.id === Number(idStr))
      if (product && typeof product.priceInIDR === 'number') {
        return sum + product.priceInIDR * qty
      }
      return sum
    }, 0)
  }, [selected, products])

  const selectedCount = Object.keys(selected).length

  const handleCheckout = useCallback(async () => {
    if (totalItems === 0) return
    setIsAdding(true)

    try {
      for (const [idStr, qty] of Object.entries(selected)) {
        const productId = Number(idStr)
        for (let i = 0; i < qty; i++) {
          await addItem({ product: productId })
        }
      }
      toast.success(`${totalItems} item ditambahkan ke keranjang`)
      router.push('/checkout')
    } catch (err) {
      toast.error('Gagal menambahkan ke keranjang.')
      setIsAdding(false)
    }
  }, [selected, totalItems, addItem, router])

  return (
    <div className="container min-h-[80vh] py-8 pb-32">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-[#2c1810]">Pesan Langsung</h1>
        <p className="text-[#8a7d72] text-sm mt-1">
          Pilih produk dan jumlahnya, lalu lanjutkan ke checkout.
        </p>
      </div>

      {products.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 gap-4">
          <ShoppingBag className="w-12 h-12 text-[#c9bfb2]" strokeWidth={1.5} />
          <p className="text-[#8a7d72]">Belum ada produk tersedia.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5">
          {products.map((product) => {
            const qty = selected[product.id] || 0
            const image = product.gallery?.[0]?.image || product.meta?.image
            const isSelected = qty > 0

            return (
              <div
                key={product.id}
                className={`
                  group relative bg-white rounded-xl border transition-all duration-200
                  ${isSelected
                    ? 'border-[#bc6432] ring-1 ring-[#bc6432]/20'
                    : 'border-[#e8ded0] hover:border-[#d4c8b8]'
                  }
                `}
              >
                {/* Product Image */}
                <div className="relative aspect-square overflow-hidden rounded-t-xl bg-[#f5f0ea]">
                  {image && typeof image !== 'string' ? (
                    <Media
                      fill
                      imgClassName="object-cover group-hover:scale-[1.02] transition-transform duration-300"
                      resource={image}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <ShoppingBag className="w-8 h-8 text-[#c9bfb2]" strokeWidth={1.5} />
                    </div>
                  )}

                  {/* Selected badge */}
                  {isSelected && (
                    <div className="absolute top-2 right-2 bg-[#bc6432] text-white text-xs font-medium w-6 h-6 rounded-full flex items-center justify-center">
                      {qty}
                    </div>
                  )}
                </div>

                {/* Product Info */}
                <div className="p-3 sm:p-4">
                  <h3 className="text-sm font-medium text-[#2c1810] line-clamp-2 leading-snug">
                    {product.title}
                  </h3>

                  {typeof product.priceInIDR === 'number' && (
                    <Price
                      className="text-sm text-[#6b5e54] mt-1"
                      amount={product.priceInIDR}
                    />
                  )}

                  {/* Quantity Controls */}
                  <div className="mt-3 flex items-center gap-2">
                    {qty === 0 ? (
                      <button
                        type="button"
                        onClick={() => updateQuantity(product.id, 1)}
                        className="w-full flex items-center justify-center gap-1.5 px-3 py-2 bg-[#faf6f0] hover:bg-[#f2ece3] border border-[#e0d6ca] rounded-lg text-sm text-[#4a3f35] font-medium transition-colors"
                      >
                        <Plus className="w-3.5 h-3.5" strokeWidth={2} />
                        Tambah
                      </button>
                    ) : (
                      <div className="w-full flex items-center justify-between bg-[#faf6f0] border border-[#e0d6ca] rounded-lg">
                        <button
                          type="button"
                          onClick={() => updateQuantity(product.id, -1)}
                          className="flex items-center justify-center w-9 h-9 hover:bg-[#e8ded0] rounded-l-lg transition-colors"
                          aria-label={`Kurangi ${product.title}`}
                        >
                          <Minus className="w-3.5 h-3.5 text-[#4a3f35]" strokeWidth={2} />
                        </button>
                        <span className="text-sm font-medium text-[#2c1810] tabular-nums min-w-[2ch] text-center">
                          {qty}
                        </span>
                        <button
                          type="button"
                          onClick={() => updateQuantity(product.id, 1)}
                          className="flex items-center justify-center w-9 h-9 hover:bg-[#e8ded0] rounded-r-lg transition-colors"
                          aria-label={`Tambah ${product.title}`}
                        >
                          <Plus className="w-3.5 h-3.5 text-[#4a3f35]" strokeWidth={2} />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Sticky Bottom Bar */}
      <div
        className={`
          fixed bottom-0 left-0 right-0 z-40
          transition-transform duration-300 ease-out
          ${totalItems > 0 ? 'translate-y-0' : 'translate-y-full'}
        `}
      >
        <div className="bg-white/95 backdrop-blur-sm border-t border-[#e8ded0] shadow-[0_-4px_20px_rgba(0,0,0,0.06)]">
          <div className="container flex items-center justify-between py-4 gap-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:gap-3">
              <span className="text-sm text-[#6b5e54]">
                {selectedCount} produk dipilih
              </span>
              <Price
                className="text-lg font-semibold text-[#2c1810]"
                amount={totalPrice}
              />
            </div>

            <button
              type="button"
              onClick={handleCheckout}
              disabled={isAdding || totalItems === 0}
              className="bg-[#bc6432] hover:bg-[#a35224] text-white font-medium py-2.5 px-6 rounded-lg text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 flex-shrink-0"
            >
              {isAdding ? (
                'Menambahkan...'
              ) : (
                <>
                  Lanjut ke Checkout
                  <ShoppingBag className="w-4 h-4" strokeWidth={2} />
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

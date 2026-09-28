'use client'

import { Media } from '@/components/Media'
import { Price } from '@/components/Price'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useAuth } from '@/providers/Auth'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import React, { useCallback, useEffect, useState } from 'react'

import { LoadingSpinner } from '@/components/LoadingSpinner'
import { useCart } from '@payloadcms/plugin-ecommerce/client/react'
import { toast } from 'sonner'
import { MessageSquare, ShoppingBag, User, Phone } from 'lucide-react'

export const CheckoutPage: React.FC = () => {
  const { user } = useAuth()
  const router = useRouter()
  const { cart, clearCart } = useCart()

  const [customerName, setCustomerName] = useState('')
  const [customerPhone, setCustomerPhone] = useState('')
  const [customerEmail, setCustomerEmail] = useState('')
  const [message, setMessage] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (user) {
      setCustomerName(user.name || '')
      setCustomerEmail(user.email || '')
    }
  }, [user])

  const cartIsEmpty = !cart || !cart.items || !cart.items.length

  const canSubmit = Boolean(customerName.trim() && customerPhone.trim())

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault()
      if (!canSubmit || isSubmitting) return

      setIsSubmitting(true)
      setError(null)

      try {
        const items = cart?.items?.map((item) => ({
          product: typeof item.product === 'object' ? item.product?.id : item.product,
          variant: item.variant
            ? typeof item.variant === 'object'
              ? item.variant?.id
              : item.variant
            : undefined,
          quantity: item.quantity,
        }))

        const res = await fetch('/api/direct-order', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            items,
            customerName: customerName.trim(),
            customerPhone: customerPhone.trim(),
            customerEmail: customerEmail.trim() || undefined,
            message: message.trim() || undefined,
          }),
        })

        const data = await res.json()

        if (!res.ok || !data.success) {
          throw new Error(data.error || 'Gagal membuat pesanan.')
        }

        clearCart()

        const queryParams = new URLSearchParams()
        if (customerEmail) {
          queryParams.set('email', customerEmail)
        }
        if (data.accessToken) {
          queryParams.set('accessToken', data.accessToken)
        }
        const queryString = queryParams.toString()

        toast.success('Pesanan berhasil dikirim!')
        router.push(`/orders/${data.orderID}${queryString ? `?${queryString}` : ''}`)
      } catch (err) {
        const msg = err instanceof Error ? err.message : 'Terjadi kesalahan.'
        setError(msg)
        toast.error(msg)
        setIsSubmitting(false)
      }
    },
    [canSubmit, isSubmitting, cart, customerName, customerPhone, customerEmail, message, clearCart, router],
  )

  if (cartIsEmpty && isSubmitting) {
    return (
      <div className="py-16 w-full flex flex-col items-center justify-center gap-4">
        <LoadingSpinner />
        <p className="text-[#6b5e54]">Memproses pesanan Anda...</p>
      </div>
    )
  }

  if (cartIsEmpty) {
    return (
      <div className="py-16 w-full flex flex-col items-center gap-4">
        <ShoppingBag className="w-12 h-12 text-[#c9bfb2]" strokeWidth={1.5} />
        <p className="text-[#6b5e54] text-lg">Keranjang Anda kosong.</p>
        <Link
          href="/search"
          className="text-[#bc6432] hover:text-[#a35224] font-medium transition-colors"
        >
          Lihat menu kami
        </Link>
      </div>
    )
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col lg:flex-row my-8 grow gap-8 lg:gap-10"
    >
      {/* Left Column: Customer Data + Message */}
      <div className="basis-full lg:basis-3/5 flex flex-col gap-6">
        <div>
          <h2 className="text-2xl font-semibold text-[#2c1810] mb-1">Checkout</h2>
          <p className="text-[#8a7d72] text-sm">
            Lengkapi data Anda untuk mengirim pesanan.
          </p>
        </div>

        {/* Login prompt for guests */}
        {!user && (
          <div className="bg-[#faf6f0] border border-[#e8ded0] rounded-xl px-5 py-4 flex items-center gap-4">
            <p className="text-[#6b5e54] text-sm flex-1">
              Sudah punya akun?{' '}
              <Link href="/login" className="text-[#bc6432] hover:text-[#a35224] font-medium">
                Masuk
              </Link>{' '}
              untuk isi otomatis.
            </p>
          </div>
        )}

        {/* Customer Info */}
        <fieldset className="bg-white border border-[#e8ded0] rounded-xl p-6 space-y-5">
          <legend className="flex items-center gap-2 text-sm font-medium text-[#2c1810] px-1">
            <User className="w-4 h-4 text-[#bc6432]" strokeWidth={2} />
            Data Pemesan
          </legend>

          <div className="space-y-1.5">
            <Label htmlFor="customerName" className="text-[#4a3f35] text-sm">
              Nama Lengkap <span className="text-[#bc6432]">*</span>
            </Label>
            <Input
              id="customerName"
              name="customerName"
              type="text"
              required
              placeholder="Nama Anda"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              className="border-[#e0d6ca] focus:border-[#bc6432] focus:ring-[#bc6432]/20 bg-white"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="customerPhone" className="text-[#4a3f35] text-sm">
              No. WhatsApp <span className="text-[#bc6432]">*</span>
            </Label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#b0a69a]" strokeWidth={1.5} />
              <Input
                id="customerPhone"
                name="customerPhone"
                type="tel"
                required
                placeholder="08xxxxxxxxxx"
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
                className="pl-10 border-[#e0d6ca] focus:border-[#bc6432] focus:ring-[#bc6432]/20 bg-white"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="customerEmail" className="text-[#4a3f35] text-sm">
              Email <span className="text-[#9a918a] text-xs font-normal">(opsional)</span>
            </Label>
            <Input
              id="customerEmail"
              name="customerEmail"
              type="email"
              placeholder="email@contoh.com"
              value={customerEmail}
              onChange={(e) => setCustomerEmail(e.target.value)}
              className="border-[#e0d6ca] focus:border-[#bc6432] focus:ring-[#bc6432]/20 bg-white"
            />
          </div>
        </fieldset>

        {/* Order Message */}
        <fieldset className="bg-white border border-[#e8ded0] rounded-xl p-6 space-y-4">
          <legend className="flex items-center gap-2 text-sm font-medium text-[#2c1810] px-1">
            <MessageSquare className="w-4 h-4 text-[#bc6432]" strokeWidth={2} />
            Catatan Pesanan
          </legend>

          <div className="space-y-1.5">
            <Label htmlFor="message" className="text-[#4a3f35] text-sm">
              Request khusus, ucapan, atau tanggal ambil
            </Label>
            <textarea
              id="message"
              name="message"
              rows={4}
              placeholder="Contoh: Tolong tuliskan &quot;Selamat Ulang Tahun Rani&quot; di kue. Ambil tanggal 15 Oktober jam 10 pagi."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full rounded-lg border border-[#e0d6ca] bg-white px-3 py-2.5 text-sm text-[#2c1810] placeholder:text-[#b0a69a] focus:border-[#bc6432] focus:ring-2 focus:ring-[#bc6432]/20 focus:outline-none resize-y min-h-[100px]"
            />
          </div>
        </fieldset>

        {/* Payment info */}
        <div className="bg-[#faf6f0] border border-[#e8ded0] rounded-xl px-5 py-4">
          <p className="text-[#6b5e54] text-sm leading-relaxed">
            Pesanan Anda akan dicek oleh tim kami terlebih dahulu. Setelah dikonfirmasi,
            instruksi pembayaran (transfer bank/QRIS/COD) akan dikirimkan langsung ke WhatsApp Anda.
          </p>
        </div>

        {/* Error message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl px-5 py-4">
            <p className="text-red-700 text-sm">{error}</p>
          </div>
        )}

        {/* Submit Button */}
        <Button
          type="submit"
          disabled={!canSubmit || isSubmitting}
          className="w-full sm:w-auto self-start bg-[#bc6432] hover:bg-[#a35224] text-white font-medium py-3 px-8 rounded-lg text-base transition-colors disabled:opacity-50 disabled:cursor-not-allowed h-auto"
        >
          {isSubmitting ? (
            <span className="flex items-center gap-2">
              <LoadingSpinner />
              Mengirim pesanan...
            </span>
          ) : (
            'Saya Mau Pesan'
          )}
        </Button>
      </div>

      {/* Right Column: Cart Summary */}
      <div className="basis-full lg:basis-2/5">
        <div className="lg:sticky lg:top-24 bg-[#faf6f0] border border-[#e8ded0] rounded-xl p-6 flex flex-col gap-5">
          <h2 className="text-lg font-semibold text-[#2c1810]">Ringkasan Pesanan</h2>

          <div className="flex flex-col gap-4">
            {cart?.items?.map((item, index) => {
              if (typeof item.product === 'object' && item.product) {
                const {
                  product,
                  product: { id, meta, title, gallery },
                  quantity,
                  variant,
                } = item

                if (!quantity) return null

                let image = gallery?.[0]?.image || meta?.image
                let price = product?.priceInIDR

                const isVariant = Boolean(variant) && typeof variant === 'object'

                if (isVariant && typeof variant === 'object') {
                  price = variant?.priceInIDR

                  const imageVariant = product.gallery?.find((galleryItem: any) => {
                    if (!galleryItem.variantOption) return false
                    const variantOptionID =
                      typeof galleryItem.variantOption === 'object'
                        ? galleryItem.variantOption.id
                        : galleryItem.variantOption

                    const hasMatch = variant?.options?.some((option: any) => {
                      if (typeof option === 'object') return option.id === variantOptionID
                      return option === variantOptionID
                    })

                    return hasMatch
                  })

                  if (imageVariant && typeof imageVariant.image !== 'string') {
                    image = imageVariant.image
                  }
                }

                return (
                  <div className="flex items-start gap-3" key={index}>
                    <div className="flex-shrink-0 w-16 h-16 rounded-lg border border-[#e0d6ca] overflow-hidden bg-white">
                      <div className="relative w-full h-full">
                        {image && typeof image !== 'string' && (
                          <Media fill imgClassName="object-cover rounded-lg" resource={image} />
                        )}
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm text-[#2c1810] truncate">{title}</p>
                      {variant && typeof variant === 'object' && (
                        <p className="text-xs text-[#8a7d72] mt-0.5">
                          {variant.options
                            ?.map((option: any) => {
                              if (typeof option === 'object') return option.label
                              return null
                            })
                            .join(', ')}
                        </p>
                      )}
                      <div className="flex items-center justify-between mt-1">
                        <span className="text-xs text-[#8a7d72]">x{quantity}</span>
                        {typeof price === 'number' && (
                          <Price className="text-sm font-medium text-[#2c1810]" amount={price * quantity} />
                        )}
                      </div>
                    </div>
                  </div>
                )
              }
              return null
            })}
          </div>

          <div className="border-t border-[#e0d6ca] pt-4 flex justify-between items-center">
            <span className="text-sm text-[#6b5e54] font-medium">Total</span>
            <Price className="text-xl font-semibold text-[#2c1810]" amount={cart.subtotal || 0} />
          </div>
        </div>
      </div>
    </form>
  )
}

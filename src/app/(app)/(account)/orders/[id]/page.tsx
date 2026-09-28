import type { Order } from '@/payload-types'
import type { Metadata } from 'next'

import { Price } from '@/components/Price'
import { Button } from '@/components/ui/button'
import { formatDateTime } from '@/utilities/formatDateTime'
import { mergeOpenGraph } from '@/utilities/mergeOpenGraph'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ChevronLeftIcon } from 'lucide-react'
import { ProductItem } from '@/components/ProductItem'
import { headers as getHeaders } from 'next/headers.js'
import configPromise from '@payload-config'
import { getPayload } from 'payload'

export const dynamic = 'force-dynamic'

type PageProps = {
  params: Promise<{ id: string }>
  searchParams: Promise<{ email?: string; accessToken?: string }>
}

const ORDER_PROGRESS_MAP: Record<string, { label: string; color: string }> = {
  belum_konfirmasi: { label: 'Belum Dikonfirmasi', color: 'bg-amber-100 text-amber-800' },
  dikonfirmasi: { label: 'Dikonfirmasi', color: 'bg-blue-100 text-blue-800' },
  diproses: { label: 'Sedang Diproses', color: 'bg-indigo-100 text-indigo-800' },
  pengiriman: { label: 'Pengiriman / Siap Diambil', color: 'bg-cyan-100 text-cyan-800' },
  selesai: { label: 'Selesai', color: 'bg-emerald-100 text-emerald-800' },
  dibatalkan: { label: 'Dibatalkan', color: 'bg-red-100 text-red-800' },
}

const PAYMENT_STATUS_MAP: Record<string, { label: string; color: string }> = {
  unpaid: { label: 'Belum Bayar', color: 'bg-amber-100 text-amber-800' },
  dp_paid: { label: 'DP Terbayar', color: 'bg-sky-100 text-sky-800' },
  paid: { label: 'Lunas', color: 'bg-emerald-100 text-emerald-800' },
  cancelled: { label: 'Dibatalkan', color: 'bg-red-100 text-red-800' },
}

function StatusBadge({ value, map }: { value: string; map: Record<string, { label: string; color: string }> }) {
  const entry = map[value] || { label: value, color: 'bg-gray-100 text-gray-600' }
  return (
    <span className={`inline-block text-xs font-medium px-2.5 py-1 rounded-md ${entry.color}`}>
      {entry.label}
    </span>
  )
}

function buildWhatsAppUrl(order: Order) {
  const adminPhone = process.env.NEXT_PUBLIC_ADMIN_WHATSAPP || '6281234567890'
  const customerName = (order as any).customerName || 'Pelanggan'
  const orderId = order.id
  const amount = order.amount || 0

  const formattedAmount = new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(amount)

  const items = order.items
    ?.map((item) => {
      const productName = typeof item.product === 'object' ? item.product?.title : `#${item.product}`
      return `- ${productName} (x${item.quantity})`
    })
    .join('\n') || ''

  const text = `Halo, saya telah memesan melalui web.\n\nID Pesanan: #${orderId}\nNama: ${customerName}\nTotal: ${formattedAmount}\n\nItem:\n${items}\n\nMohon konfirmasi ketersediaan pesanannya. Terima kasih!`

  return `https://wa.me/${adminPhone}?text=${encodeURIComponent(text)}`
}

export default async function OrderPage({ params, searchParams }: PageProps) {
  const headers = await getHeaders()
  const payload = await getPayload({ config: configPromise })
  const { user } = await payload.auth({ headers })

  const { id } = await params
  const { email = '', accessToken = '' } = await searchParams

  let order: Order | null = null

  try {
    const {
      docs: [orderResult],
    } = await payload.find({
      collection: 'orders',
      user,
      overrideAccess: !Boolean(user),
      depth: 2,
      where: {
        and: [
          {
            id: {
              equals: id,
            },
          },
          ...(user
            ? [
                {
                  customer: {
                    equals: user.id,
                  },
                },
              ]
            : [
                {
                  accessToken: {
                    equals: accessToken,
                  },
                },
                ...(email
                  ? [
                      {
                        customerEmail: {
                          equals: email,
                        },
                      },
                    ]
                  : []),
              ]),
        ],
      },
      select: {
        amount: true,
        currency: true,
        items: true,
        customerEmail: true,
        customer: true,
        status: true,
        orderProgress: true,
        paymentStatus: true,
        customerName: true,
        customerPhone: true,
        message: true,
        createdAt: true,
        updatedAt: true,
        shippingAddress: true,
      },
    })

    const canAccessAsGuest =
      !user &&
      email &&
      accessToken &&
      orderResult &&
      orderResult.customerEmail &&
      orderResult.customerEmail === email
    const canAccessAsUser =
      user &&
      orderResult &&
      orderResult.customer &&
      (typeof orderResult.customer === 'object'
        ? orderResult.customer.id
        : orderResult.customer) === user.id
    const canAccessViaToken = !user && accessToken && orderResult

    if (orderResult && (canAccessAsGuest || canAccessAsUser || canAccessViaToken)) {
      order = orderResult
    }
  } catch (error) {
    console.error(error)
  }

  if (!order) {
    notFound()
  }

  const orderProgress = (order as any).orderProgress as string | undefined
  const paymentStatus = (order as any).paymentStatus as string | undefined
  const customerName = (order as any).customerName as string | undefined
  const customerPhone = (order as any).customerPhone as string | undefined
  const orderMessage = (order as any).message as string | undefined

  return (
    <div className="container max-w-3xl py-8">
      {/* Header */}
      <div className="flex gap-4 justify-between items-center mb-6">
        {user ? (
          <Button asChild variant="ghost" className="text-[#6b5e54] hover:text-[#2c1810]">
            <Link href="/orders">
              <ChevronLeftIcon className="w-4 h-4" />
              Semua Pesanan
            </Link>
          </Button>
        ) : (
          <div />
        )}

        <span className="text-xs font-mono text-[#8a7d72] bg-[#faf6f0] px-2.5 py-1 rounded">
          Pesanan #{order.id}
        </span>
      </div>

      {/* Confirmation Banner */}
      {orderProgress === 'belum_konfirmasi' && (
        <div className="bg-[#faf6f0] border border-[#e8ded0] rounded-xl px-5 py-4 mb-6">
          <p className="text-[#6b5e54] text-sm leading-relaxed">
            Pesanan Anda telah kami terima. Tim kami akan segera mengecek dan menghubungi Anda melalui WhatsApp
            untuk konfirmasi ketersediaan dan instruksi pembayaran.
          </p>
        </div>
      )}

      {/* Main Card */}
      <div className="bg-white border border-[#e8ded0] rounded-xl overflow-hidden">
        {/* Order Overview */}
        <div className="px-6 py-5 border-b border-[#f0e8dc]">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div>
              <p className="text-xs text-[#8a7d72] mb-1">Tanggal</p>
              <p className="text-sm font-medium text-[#2c1810]">
                <time dateTime={order.createdAt}>
                  {formatDateTime({ date: order.createdAt, format: 'dd MMM yyyy' })}
                </time>
              </p>
            </div>

            <div>
              <p className="text-xs text-[#8a7d72] mb-1">Total</p>
              {order.amount != null && (
                <Price className="text-sm font-medium text-[#2c1810]" amount={order.amount} />
              )}
            </div>

            <div>
              <p className="text-xs text-[#8a7d72] mb-1">Status Pesanan</p>
              {orderProgress ? (
                <StatusBadge value={orderProgress} map={ORDER_PROGRESS_MAP} />
              ) : (
                <span className="text-sm text-[#8a7d72]">-</span>
              )}
            </div>

            <div>
              <p className="text-xs text-[#8a7d72] mb-1">Pembayaran</p>
              {paymentStatus ? (
                <StatusBadge value={paymentStatus} map={PAYMENT_STATUS_MAP} />
              ) : (
                <span className="text-sm text-[#8a7d72]">-</span>
              )}
            </div>
          </div>
        </div>

        {/* Customer Info */}
        {(customerName || customerPhone) && (
          <div className="px-6 py-5 border-b border-[#f0e8dc]">
            <h2 className="text-xs text-[#8a7d72] mb-3 font-medium">Data Pemesan</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {customerName && (
                <div>
                  <p className="text-xs text-[#8a7d72]">Nama</p>
                  <p className="text-sm text-[#2c1810]">{customerName}</p>
                </div>
              )}
              {customerPhone && (
                <div>
                  <p className="text-xs text-[#8a7d72]">WhatsApp</p>
                  <p className="text-sm text-[#2c1810]">{customerPhone}</p>
                </div>
              )}
              {order.customerEmail && (
                <div>
                  <p className="text-xs text-[#8a7d72]">Email</p>
                  <p className="text-sm text-[#2c1810]">{order.customerEmail}</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Order Message */}
        {orderMessage && (
          <div className="px-6 py-5 border-b border-[#f0e8dc]">
            <h2 className="text-xs text-[#8a7d72] mb-2 font-medium">Catatan Pesanan</h2>
            <p className="text-sm text-[#2c1810] whitespace-pre-wrap leading-relaxed">{orderMessage}</p>
          </div>
        )}

        {/* Items */}
        {order.items && (
          <div className="px-6 py-5">
            <h2 className="text-xs text-[#8a7d72] mb-4 font-medium">Item Pesanan</h2>
            <ul className="flex flex-col gap-4">
              {order.items?.map((item, index) => {
                if (typeof item.product === 'string') {
                  return null
                }

                if (!item.product || typeof item.product !== 'object') {
                  return (
                    <li key={index} className="text-sm text-[#8a7d72]">
                      Item ini tidak tersedia lagi.
                    </li>
                  )
                }

                const variant =
                  item.variant && typeof item.variant === 'object' ? item.variant : undefined

                return (
                  <li key={item.id}>
                    <ProductItem
                      product={item.product}
                      quantity={item.quantity}
                      variant={variant}
                    />
                  </li>
                )
              })}
            </ul>
          </div>
        )}
      </div>

      {/* WhatsApp CTA */}
      <div className="mt-6 flex flex-col sm:flex-row items-start sm:items-center gap-3">
        <a
          href={buildWhatsAppUrl(order)}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 bg-[#25D366] hover:bg-[#1fb855] text-white font-medium py-2.5 px-5 rounded-lg text-sm transition-colors"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
          </svg>
          Konfirmasi via WhatsApp
        </a>
        <span className="text-xs text-[#8a7d72]">
          Kirim ringkasan pesanan langsung ke tim kami
        </span>
      </div>
    </div>
  )
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params

  return {
    description: `Detail pesanan #${id}.`,
    openGraph: mergeOpenGraph({
      title: `Pesanan #${id}`,
      url: `/orders/${id}`,
    }),
    title: `Pesanan #${id}`,
  }
}

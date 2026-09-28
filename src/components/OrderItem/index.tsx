import { OrderStatus } from '@/components/OrderStatus'
import { Price } from '@/components/Price'
import { Button } from '@/components/ui/button'
import { Order } from '@/payload-types'
import { formatDateTime } from '@/utilities/formatDateTime'
import Link from 'next/link'

type Props = {
  order: Order
}

const ORDER_PROGRESS_MAP: Record<string, { label: string; bg: string; text: string }> = {
  belum_konfirmasi: { label: 'Belum Dikonfirmasi', bg: 'bg-amber-100', text: 'text-amber-800' },
  dikonfirmasi: { label: 'Dikonfirmasi', bg: 'bg-blue-100', text: 'text-blue-800' },
  diproses: { label: 'Sedang Diproses', bg: 'bg-indigo-100', text: 'text-indigo-800' },
  pengiriman: { label: 'Siap / Dikirim', bg: 'bg-cyan-100', text: 'text-cyan-800' },
  selesai: { label: 'Selesai', bg: 'bg-emerald-100', text: 'text-emerald-800' },
  dibatalkan: { label: 'Dibatalkan', bg: 'bg-rose-100', text: 'text-rose-800' },
}

const PAYMENT_STATUS_MAP: Record<string, { label: string; bg: string; text: string }> = {
  unpaid: { label: 'Belum Bayar', bg: 'bg-amber-50 border border-amber-200', text: 'text-amber-700' },
  dp_paid: { label: 'DP Terbayar', bg: 'bg-sky-50 border border-sky-200', text: 'text-sky-700' },
  paid: { label: 'Lunas', bg: 'bg-emerald-50 border border-emerald-200', text: 'text-emerald-700' },
  cancelled: { label: 'Batal', bg: 'bg-rose-50 border border-rose-200', text: 'text-rose-700' },
}

export const OrderItem: React.FC<Props> = ({ order }) => {
  const itemsLabel = order.items?.length === 1 ? 'Item' : 'Items'
  const progress = (order as any).orderProgress || 'belum_konfirmasi'
  const payment = (order as any).paymentStatus || 'unpaid'
  const progressMeta = ORDER_PROGRESS_MAP[progress] || { label: progress, bg: 'bg-stone-100', text: 'text-stone-700' }
  const paymentMeta = PAYMENT_STATUS_MAP[payment] || { label: payment, bg: 'bg-stone-100', text: 'text-stone-700' }

  return (
    <div className="bg-white border border-[#e8dfd5] rounded-xl p-5 md:p-6 flex flex-col sm:flex-row gap-6 sm:items-center sm:justify-between shadow-sm hover:border-[#b85d38]/40 transition-colors">
      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-3 flex-wrap">
          <span className="font-mono text-xs font-semibold text-[#8a7d72] tracking-wider">
            #{order.id}
          </span>
          <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${progressMeta.bg} ${progressMeta.text}`}>
            {progressMeta.label}
          </span>
          <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${paymentMeta.bg} ${paymentMeta.text}`}>
            {paymentMeta.label}
          </span>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-sm">
          <time className="text-[#5c4a3e] font-medium" dateTime={order.createdAt}>
            {formatDateTime({ date: order.createdAt, format: 'dd MMMM yyyy' })}
          </time>
          <span className="hidden sm:inline text-stone-300">•</span>
          <span className="text-[#8a7d72] text-xs">
            {order.items?.length} {itemsLabel}
          </span>
          {order.amount && (
            <>
              <span className="hidden sm:inline text-stone-300">•</span>
              <Price className="font-semibold text-[#2c1810]" amount={order.amount} currencyCode={order.currency ?? undefined} />
            </>
          )}
        </div>
      </div>

      <Button
        variant="outline"
        asChild
        className="self-start sm:self-auto border-[#d9cebe] text-[#2c1810] hover:bg-[#f6efe6] hover:border-[#b85d38]"
      >
        <Link href={`/orders/${order.id}`}>Lihat Detail</Link>
      </Button>
    </div>
  )
}

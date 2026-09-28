import { getPayload } from 'payload'
import config from '@payload-config'
import { headers as getHeaders } from 'next/headers.js'

export async function POST(req: Request) {
  try {
    const payload = await getPayload({ config })
    const headers = await getHeaders()
    const { user } = await payload.auth({ headers })

    const body = await req.json()

    const {
      items,
      customerName,
      customerPhone,
      customerEmail,
      message,
    } = body

    if (!items || !Array.isArray(items) || items.length === 0) {
      return Response.json(
        { success: false, error: 'Pesanan harus memiliki minimal satu item.' },
        { status: 400 },
      )
    }

    if (!customerName || !customerPhone) {
      return Response.json(
        { success: false, error: 'Nama dan nomor WhatsApp wajib diisi.' },
        { status: 400 },
      )
    }

    let totalAmount = 0

    const validatedItems: { product: number; variant?: number; quantity: number }[] = []

    for (const item of items) {
      const productId = typeof item.product === 'object' ? item.product.id : item.product

      const product = await payload.findByID({
        collection: 'products',
        id: productId,
        depth: 0,
      })

      if (!product) {
        return Response.json(
          { success: false, error: `Produk dengan ID ${productId} tidak ditemukan.` },
          { status: 400 },
        )
      }

      let itemPrice = product.priceInIDR || 0

      if (item.variant) {
        const variantId = typeof item.variant === 'object' ? item.variant.id : item.variant
        const variant = await payload.findByID({
          collection: 'variants',
          id: variantId,
          depth: 0,
        })
        if (variant && typeof variant.priceInIDR === 'number') {
          itemPrice = variant.priceInIDR
        }
      }

      const quantity = item.quantity || 1
      totalAmount += itemPrice * quantity

      validatedItems.push({
        product: productId,
        variant: item.variant
          ? typeof item.variant === 'object'
            ? item.variant.id
            : item.variant
          : undefined,
        quantity,
      })
    }

    const order = await payload.create({
      collection: 'orders',
      data: {
        items: validatedItems,
        customer: user?.id || undefined,
        customerEmail: customerEmail || user?.email || undefined,
        customerName,
        customerPhone,
        message: message || undefined,
        amount: totalAmount,
        currency: 'IDR',
        orderProgress: 'belum_konfirmasi',
        paymentStatus: 'unpaid',
        status: 'processing',
      } as any,
    })

    return Response.json({
      success: true,
      orderID: order.id,
      accessToken: order.accessToken,
    })
  } catch (error) {
    console.error('Direct order error:', error)
    const errorMessage = error instanceof Error ? error.message : 'Terjadi kesalahan saat membuat pesanan.'
    return Response.json(
      { success: false, error: errorMessage },
      { status: 500 },
    )
  }
}

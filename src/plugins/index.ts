import { ecommercePlugin } from '@payloadcms/plugin-ecommerce'
import { formBuilderPlugin } from '@payloadcms/plugin-form-builder'
import { seoPlugin } from '@payloadcms/plugin-seo'
import { GenerateTitle, GenerateURL } from '@payloadcms/plugin-seo/types'
import { FixedToolbarFeature, HeadingFeature, lexicalEditor } from '@payloadcms/richtext-lexical'
import { Plugin } from 'payload'

import { adminOnlyFieldAccess } from '@/access/adminOnlyFieldAccess'
import { adminOrPublishedStatus } from '@/access/adminOrPublishedStatus'
import { customerOnlyFieldAccess } from '@/access/customerOnlyFieldAccess'
import { isAdmin } from '@/access/isAdmin'
import { isDocumentOwner } from '@/access/isDocumentOwner'
import { ProductsCollection } from '@/collections/Products'
import { Page, Product } from '@/payload-types'
import { getServerSideURL } from '@/utilities/getURL'

const generateTitle: GenerateTitle<Product | Page> = ({ doc }) => {
  return doc?.title ? `${doc.title} | Payload Ecommerce Template` : 'Payload Ecommerce Template'
}

const generateURL: GenerateURL<Product | Page> = ({ doc }) => {
  const url = getServerSideURL()

  return doc?.slug ? `${url}/${doc.slug}` : url
}

export const plugins: Plugin[] = [
  seoPlugin({
    generateTitle,
    generateURL,
  }),
  formBuilderPlugin({
    fields: {
      payment: false,
    },
    formSubmissionOverrides: {
      access: {
        delete: isAdmin,
        read: isAdmin,
        update: isAdmin,
      },
      admin: {
        group: 'Content',
      },
    },
    formOverrides: {
      access: {
        delete: isAdmin,
        read: isAdmin,
        update: isAdmin,
        create: isAdmin,
      },
      admin: {
        group: 'Content',
      },
      fields: ({ defaultFields }) => {
        return defaultFields.map((field) => {
          if ('name' in field && field.name === 'confirmationMessage') {
            return {
              ...field,
              editor: lexicalEditor({
                features: ({ rootFeatures }) => {
                  return [
                    ...rootFeatures,
                    FixedToolbarFeature(),
                    HeadingFeature({ enabledHeadingSizes: ['h1', 'h2', 'h3', 'h4'] }),
                  ]
                },
              }),
            }
          }
          return field
        })
      },
    },
  }),
  ecommercePlugin({
    access: {
      adminOnlyFieldAccess,
      adminOrPublishedStatus,
      customerOnlyFieldAccess,
      isAdmin,
      isDocumentOwner,
    },
    customers: {
      slug: 'users',
    },
    orders: {
      ordersCollectionOverride: ({ defaultCollection }) => ({
        ...defaultCollection,
        admin: {
          ...defaultCollection.admin,
          defaultColumns: [
            'id',
            'customerName',
            'customerPhone',
            'orderProgress',
            'paymentStatus',
            'amount',
            'createdAt',
          ],
        },
        fields: [
          ...defaultCollection.fields,
          {
            name: 'accessToken',
            type: 'text',
            unique: true,
            index: true,
            admin: {
              position: 'sidebar',
              readOnly: true,
            },
            hooks: {
              beforeValidate: [
                ({ value, operation }) => {
                  if (operation === 'create' || !value) {
                    return crypto.randomUUID()
                  }
                  return value
                },
              ],
            },
          },
          {
            name: 'orderProgress',
            type: 'select',
            label: 'Status Pemesanan',
            defaultValue: 'belum_konfirmasi',
            required: true,
            options: [
              { label: 'Pesanan Belum Dikonfirmasi', value: 'belum_konfirmasi' },
              { label: 'Pesanan Dikonfirmasi', value: 'dikonfirmasi' },
              { label: 'Sedang Diproses', value: 'diproses' },
              { label: 'Dalam Pengiriman / Siap Diambil', value: 'pengiriman' },
              { label: 'Selesai', value: 'selesai' },
              { label: 'Dibatalkan', value: 'dibatalkan' },
            ],
            admin: {
              position: 'sidebar',
              components: {
                Cell: '@/components/admin/OrderBadges#OrderProgressCell',
              },
            },
          },
          {
            name: 'paymentStatus',
            type: 'select',
            label: 'Status Pembayaran',
            defaultValue: 'unpaid',
            required: true,
            options: [
              { label: 'Belum Bayar', value: 'unpaid' },
              { label: 'DP Terbayar', value: 'dp_paid' },
              { label: 'Lunas', value: 'paid' },
              { label: 'Dibatalkan', value: 'cancelled' },
            ],
            admin: {
              position: 'sidebar',
              components: {
                Cell: '@/components/admin/OrderBadges#PaymentStatusCell',
              },
            },
          },
          {
            name: 'customerName',
            type: 'text',
            label: 'Nama Pemesan',
            required: true,
          },
          {
            name: 'customerPhone',
            type: 'text',
            label: 'No. WhatsApp / Telepon',
            required: true,
          },
          {
            name: 'message',
            type: 'textarea',
            label: 'Catatan Pesanan / Request Khusus',
          },
          {
            name: 'adminNotes',
            type: 'textarea',
            label: 'Catatan Internal Admin',
            admin: { position: 'sidebar' },
          },
        ],
      }),
    },
    carts: {
      cartsCollectionOverride: ({ defaultCollection }) => ({
        ...defaultCollection,
        hooks: {
          ...defaultCollection.hooks,
          beforeChange: [
            async ({ data, originalDoc, req }) => {
              const currency = data?.currency || originalDoc?.currency || 'IDR'
              if (data && !data.currency) {
                data.currency = currency
              }

              if (data?.items && Array.isArray(data.items)) {
                const priceField = `priceIn${currency}`
                let subtotal = 0
                for (const item of data.items) {
                  const quantity = item.quantity || 1
                  if (item.variant) {
                    const variantId = typeof item.variant === 'object' ? item.variant.id : item.variant
                    try {
                      const variant = await req.payload.findByID({
                        id: variantId,
                        collection: 'variants',
                        depth: 0,
                        select: { [priceField]: true, [`${priceField}Enabled`]: true, product: true },
                      })
                      const isPriceEnabled = (variant as any)?.[`${priceField}Enabled`] !== false
                      let price = isPriceEnabled ? (variant as any)?.[priceField] : undefined
                      if (price === undefined || price === null || price === 0) {
                        const productId =
                          typeof item.product === 'object'
                            ? item.product.id
                            : item.product || (variant as any)?.product
                        if (productId) {
                          const product = await req.payload.findByID({
                            id: productId,
                            collection: 'products',
                            depth: 0,
                            select: { [priceField]: true, [`${priceField}Enabled`]: true },
                          })
                          const isProductPriceEnabled =
                            (product as any)?.[`${priceField}Enabled`] !== false
                          price = isProductPriceEnabled ? (product as any)?.[priceField] || 0 : 0
                        }
                      }
                      subtotal += (price || 0) * quantity
                    } catch {
                      // ignore lookup error
                    }
                  } else if (item.product) {
                    const productId = typeof item.product === 'object' ? item.product.id : item.product
                    try {
                      const product = await req.payload.findByID({
                        id: productId,
                        collection: 'products',
                        depth: 0,
                        select: { [priceField]: true, [`${priceField}Enabled`]: true },
                      })
                      const isProductPriceEnabled =
                        (product as any)?.[`${priceField}Enabled`] !== false
                      const price = isProductPriceEnabled ? (product as any)?.[priceField] || 0 : 0
                      subtotal += price * quantity
                    } catch {
                      // ignore lookup error
                    }
                  }
                }
                data.subtotal = subtotal
              }
            },
            ...(defaultCollection.hooks?.beforeChange || []),
          ],
          afterRead: [
            ...(defaultCollection.hooks?.afterRead || []),
            ({ doc }) => {
              if (doc && (!doc.subtotal || doc.subtotal === 0) && doc.items?.length > 0) {
                const currency = doc.currency || 'IDR'
                const priceField = `priceIn${currency}`
                let subtotal = 0
                for (const item of doc.items) {
                  const isVariantPriceEnabled =
                    typeof item.variant === 'object'
                      ? (item.variant as any)?.[`${priceField}Enabled`] !== false
                      : true
                  const isProductPriceEnabled =
                    typeof item.product === 'object'
                      ? (item.product as any)?.[`${priceField}Enabled`] !== false
                      : true

                  const variantPrice =
                    typeof item.variant === 'object' && isVariantPriceEnabled
                      ? (item.variant as any)?.[priceField]
                      : undefined
                  const productPrice =
                    typeof item.product === 'object' && isProductPriceEnabled
                      ? (item.product as any)?.[priceField]
                      : undefined
                  const price =
                    variantPrice && variantPrice > 0 ? variantPrice : productPrice || 0
                  subtotal += price * (item.quantity || 1)
                }
                if (subtotal > 0) {
                  doc.subtotal = subtotal
                }
              }
              return doc
            },
          ],
        },
      }),
    },
    payments: {
      paymentMethods: [],
    },
    products: {
      productsCollectionOverride: ProductsCollection,
      variants: {
        variantsCollectionOverride: ({ defaultCollection }: { defaultCollection: any }) => ({
          ...defaultCollection,
          hooks: {
            ...defaultCollection.hooks,
            beforeChange: [
              ...(defaultCollection.hooks?.beforeChange || []),
              ({ data }: { data: any }) => {
                if (data && data.priceInIDREnabled === false) {
                  data.priceInIDR = null
                }
                return data
              },
            ],
            afterRead: [
              ...(defaultCollection.hooks?.afterRead || []),
              ({ doc }: { doc: any }) => {
                if (doc && doc.priceInIDREnabled === false) {
                  doc.priceInIDR = null
                }
                return doc
              },
            ],
          },
        }),
      },
    },
    currencies: {
      defaultCurrency: 'IDR',
      supportedCurrencies: [
        {
          code: 'IDR',
          label: 'Indonesian Rupiah',
          symbol: 'Rp',
          decimals: 0,
        },
      ],
    },
  }),
]

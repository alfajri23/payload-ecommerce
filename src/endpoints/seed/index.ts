import type { CollectionSlug, GlobalSlug, Payload, PayloadRequest, File } from 'payload'

import {
  BAKERY_CATEGORIES,
  BAKERY_PRODUCTS,
  BAKERY_VARIANT_TYPES,
  type SeedProduct,
} from './bakery-data'
import { contactFormData } from './contact-form'
import { contactPageData } from './contact-page'
import { homePageData } from './home'
import type { Category, VariantOption } from '@/payload-types'

const collections: CollectionSlug[] = [
  'categories',
  'media',
  'pages',
  'products',
  'forms',
  'form-submissions',
  'variants',
  'variantOptions',
  'variantTypes',
  'carts',
  'transactions',
  'addresses',
  'orders',
]

const navGlobals: ('header' | 'footer')[] = ['header', 'footer']

export const seed = async ({
  payload,
  req,
}: {
  payload: Payload
  req: PayloadRequest
}): Promise<void> => {
  payload.logger.info('Seeding database for The Bakery...')

  payload.logger.info('— Clearing collections and globals...')

  // 1. Reset globals
  await Promise.all(
    navGlobals.map((global) =>
      payload.updateGlobal({
        slug: global,
        data: {
          navItems: [],
        },
        depth: 0,
        context: {
          disableRevalidate: true,
        },
      }),
    ),
  )

  // 2. Clear collections (pass req for transaction atomicity)
  for (const collection of collections) {
    await payload.db.deleteMany({ collection, req, where: {} })
    if (payload.collections[collection].config.versions) {
      await payload.db.deleteVersions({ collection, req, where: {} })
    }
  }

  // 3. Clear existing customer user if exists
  await payload.delete({
    collection: 'users',
    depth: 0,
    where: {
      email: {
        equals: 'customer@example.com',
      },
    },
    req,
  })

  payload.logger.info('— Creating sample customer...')
  const customer = await payload.create({
    collection: 'users',
    data: {
      name: 'Pelanggan Setia',
      email: 'customer@example.com',
      password: 'password',
      roles: ['customer'],
    },
    req,
  })

  // 4. Seed Categories
  payload.logger.info('— Seeding bakery categories...')
  const categoryMap = new Map<string, Category>()
  for (const cat of BAKERY_CATEGORIES) {
    const createdCat = await payload.create({
      collection: 'categories',
      data: {
        title: cat.title,
        slug: cat.slug,
      },
      req,
    })
    categoryMap.set(cat.slug, createdCat)
  }

  // 5. Seed Variant Types & Options
  payload.logger.info('— Seeding variant types (Ukuran & Warna/Tema)...')

  // 5a. Variant Type: Ukuran (Size)
  const sizeVariantType = await payload.create({
    collection: 'variantTypes',
    data: {
      name: BAKERY_VARIANT_TYPES.size.name,
      label: BAKERY_VARIANT_TYPES.size.label,
    },
    req,
  })

  const sizeOptionMap = new Map<string, VariantOption>()
  for (const opt of BAKERY_VARIANT_TYPES.size.options) {
    const createdOpt = await payload.create({
      collection: 'variantOptions',
      data: {
        label: opt.label,
        value: opt.value,
        variantType: sizeVariantType.id,
      },
      req,
    })
    sizeOptionMap.set(opt.value, createdOpt)
  }

  // 5b. Variant Type: Warna/Tema (Color)
  const colorVariantType = await payload.create({
    collection: 'variantTypes',
    data: {
      name: BAKERY_VARIANT_TYPES.color.name,
      label: BAKERY_VARIANT_TYPES.color.label,
    },
    req,
  })

  const colorOptionMap = new Map<string, VariantOption>()
  for (const opt of BAKERY_VARIANT_TYPES.color.options) {
    const createdOpt = await payload.create({
      collection: 'variantOptions',
      data: {
        label: opt.label,
        value: opt.value,
        variantType: colorVariantType.id,
      },
      req,
    })
    colorOptionMap.set(opt.value, createdOpt)
  }

  // 6. Seed Bakery Products & Media Images
  payload.logger.info('— Seeding bakery products with images and tiered variants...')

  const createdProducts: any[] = []
  const createdCakeVariants: any[] = []

  for (const productDef of BAKERY_PRODUCTS) {
    // 6a. Download 1 product image
    let mediaDoc: any = null
    try {
      const fileData = await fetchImageFile(productDef.imageUrl, productDef.slug)
      mediaDoc = await payload.create({
        collection: 'media',
        data: {
          alt: productDef.title,
        },
        file: fileData,
        req,
      })
    } catch (err) {
      payload.logger.warn(`Could not download image for ${productDef.slug}: ${err}`)
    }

    const category = categoryMap.get(productDef.categorySlug)

    // 6b. Create Product document
    const productDoc = await payload.create({
      collection: 'products',
      depth: 0,
      data: {
        title: productDef.title,
        slug: productDef.slug,
        description: productDef.description,
        priceInIDR: productDef.priceInIDR,
        priceInIDREnabled: true,
        enableVariants: productDef.enableVariants,
        variantTypes: productDef.enableVariants ? [sizeVariantType.id, colorVariantType.id] : [],
        categories: category ? [category.id] : [],
        gallery: mediaDoc ? [{ image: mediaDoc.id }] : [],
        meta: {
          title: `${productDef.title} | The Bakery`,
          description: productDef.description,
          image: mediaDoc ? mediaDoc.id : undefined,
        },
        _status: 'published',
      },
      req,
    })

    createdProducts.push(productDoc)

    // 6c. If product has variants, create variant documents with tiered pricing
    if (productDef.enableVariants && productDef.variants && productDef.variants.length > 0) {
      for (const variantDef of productDef.variants) {
        const sizeOpt = sizeOptionMap.get(variantDef.sizeValue)
        const colorOpt = colorOptionMap.get(variantDef.colorValue)

        if (sizeOpt && colorOpt) {
          const variantDoc = await payload.create({
            collection: 'variants',
            depth: 0,
            data: {
              title: `${productDef.title} — ${sizeOpt.label} — ${colorOpt.label}`,
              product: productDoc.id,
              options: [sizeOpt.id, colorOpt.id],
              priceInIDR: variantDef.priceInIDR,
              priceInIDREnabled: true,
              inventory: 20,
              _status: 'published',
            },
            req,
          })
          createdCakeVariants.push(variantDoc)
        }
      }
    }
  }

  // 7. Seed Contact Form & Pages
  payload.logger.info('— Seeding contact form and pages...')
  const contactForm = await payload.create({
    collection: 'forms',
    depth: 0,
    data: contactFormData(),
    req,
  })

  const heroMedia = createdProducts[0]?.gallery?.[0]?.image || null

  await Promise.all([
    payload.create({
      collection: 'pages',
      depth: 0,
      data: homePageData({
        contentImage: heroMedia,
        metaImage: heroMedia,
      }),
      context: {
        disableRevalidate: true,
      },
      req,
    }),
    payload.create({
      collection: 'pages',
      depth: 0,
      data: contactPageData({
        contactForm: contactForm,
      }),
      context: {
        disableRevalidate: true,
      },
      req,
    }),
  ])

  // 8. Seed 2 Realistic Orders (Showcasing Custom Admin Status Badges)
  payload.logger.info('— Seeding sample bakery orders...')
  const firstCake = createdProducts[0]
  const firstVariant = createdCakeVariants[0]

  if (firstCake) {
    // Order 1: Sedang Diproses & Sudah Bayar
    await payload.create({
      collection: 'orders',
      data: {
        amount: firstVariant ? firstVariant.priceInIDR : firstCake.priceInIDR,
        currency: 'IDR',
        customer: customer.id,
        customerName: 'Siti Rahmawati',
        customerPhone: '081299887766',
        message: 'Mohon lilin angka 25 dan ucapan "Happy Birthday Sarah!"',
        orderProgress: 'diproses',
        paymentStatus: 'paid',
        items: [
          {
            product: firstCake.id,
            variant: firstVariant ? firstVariant.id : undefined,
            quantity: 1,
          },
        ],
      },
      req,
    })

    // Order 2: Belum Konfirmasi & Belum Bayar
    await payload.create({
      collection: 'orders',
      data: {
        amount: 145000,
        currency: 'IDR',
        customer: customer.id,
        customerName: 'Budi Hartono',
        customerPhone: '085711223344',
        message: 'Pengiriman kurir instan untuk jam 10 pagi',
        orderProgress: 'belum_konfirmasi',
        paymentStatus: 'unpaid',
        items: [
          {
            product: firstCake.id,
            quantity: 1,
          },
        ],
      },
      req,
    })
  }

  // 10. Update Header & Footer Globals
  payload.logger.info('— Seeding navigation globals...')
  await Promise.all([
    payload.updateGlobal({
      slug: 'header',
      data: {
        navItems: [
          {
            link: {
              type: 'custom',
              label: 'Beranda',
              url: '/',
            },
          },
          {
            link: {
              type: 'custom',
              label: 'Katalog Shop',
              url: '/shop',
            },
          },
          {
            link: {
              type: 'custom',
              label: 'Akun Saya',
              url: '/account',
            },
          },
        ],
      },
      req,
    }),
    payload.updateGlobal({
      slug: 'footer',
      data: {
        navItems: [
          {
            link: {
              type: 'custom',
              label: 'Katalog Roti',
              url: '/shop',
            },
          },
          {
            link: {
              type: 'custom',
              label: 'Admin Panel',
              url: '/admin',
            },
          },
        ],
      },
      req,
    }),
    payload.updateGlobal({
      slug: 'general-settings',
      data: {
        storeName: 'The Bakery',
        address: 'Jl. Senopati No. 42, Kebayoran Baru, Jakarta Selatan 12190',
        phoneNumber: '+62 812-8899-7722',
        secondaryPhone: '(021) 720-8899',
        email: 'kontak@thebakery.id',
        openingHours: 'Buka Setiap Hari: 07.00 - 21.00 WIB',
        enableInventoryValidation: false,
      },
      req,
    }),
  ])

  payload.logger.info('Database seeded successfully for The Bakery!')
}

/**
 * Helper untuk mengunduh gambar remote dan mengembalikannya dalam format File Payload
 */
async function fetchImageFile(url: string, filename: string): Promise<File> {
  const res = await fetch(url)
  if (!res.ok) {
    throw new Error(`Failed to fetch image from ${url}, status: ${res.status}`)
  }

  const data = await res.arrayBuffer()
  const buffer = Buffer.from(data)

  return {
    name: `${filename}.jpg`,
    data: buffer,
    mimetype: 'image/jpeg',
    size: buffer.length,
  }
}

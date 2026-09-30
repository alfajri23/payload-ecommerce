import type { Category, Media, Product, VariantType } from '@/payload-types'
import { RequiredDataFromCollectionSlug } from 'payload'

type ProductArgs = {
  galleryImage: Media
  metaImage: Media
  variantTypes: VariantType[]
  categories: Category[]
  relatedProducts: Product[]
}

export const productHatData: (args: ProductArgs) => RequiredDataFromCollectionSlug<'products'> = ({
  galleryImage,
  relatedProducts,
  metaImage,
  variantTypes,
  categories,
}) => {
  return {
    meta: {
      title: 'Hat | Payload Ecommerce Template',
      image: metaImage,
      description:
        'Top off your look with our classic hat, crafted for style and comfort. Made with breathable, high-quality materials and an adjustable strap for the perfect fit.',
    },
    _status: 'published',
    layout: [],
    categories: categories,
    description:
      'Top off your look with our classic hat, crafted for style and comfort. Made with breathable, high-quality materials and an adjustable strap for the perfect fit, it’s ideal for everyday wear or outdoor adventures. Available in a range of colors to match any outfit.',

    gallery: [{ image: galleryImage }],
    title: 'Hat',
    slug: 'hat',
    priceInIDREnabled: true,
    priceInIDR: 2500,
    relatedProducts: relatedProducts,
  }
}

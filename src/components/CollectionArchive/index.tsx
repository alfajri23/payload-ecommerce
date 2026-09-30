import React from 'react'

import type { Product } from '@/payload-types'
import { ProductGridItem } from '@/components/ProductGridItem'

export type Props = {
  posts: Product[]
}

export const CollectionArchive: React.FC<Props> = (props) => {
  const { posts } = props

  if (!posts?.length) {
    return null
  }

  return (
    <div className="w-full">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 sm:gap-8">
        {posts.map((result, index) => {
          if (typeof result === 'object' && result !== null) {
            return <ProductGridItem key={result.id || index} product={result} />
          }

          return null
        })}
      </div>
    </div>
  )
}

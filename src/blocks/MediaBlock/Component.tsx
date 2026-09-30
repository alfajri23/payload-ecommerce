import type { StaticImageData } from 'next/image'

import { cn } from '@/utilities/cn'
import React from 'react'
import { RichText } from '@/components/RichText'
import type { MediaBlock as MediaBlockProps } from '@/payload-types'

import { Media } from '../../components/Media'

export const MediaBlock: React.FC<
  MediaBlockProps & {
    id?: string | number
    breakout?: boolean
    captionClassName?: string
    className?: string
    enableGutter?: boolean
    imgClassName?: string
    staticImage?: StaticImageData
    disableInnerContainer?: boolean
  }
> = (props) => {
  const {
    captionClassName,
    className,
    enableGutter = true,
    imgClassName,
    media,
    staticImage,
    disableInnerContainer,
  } = props

  let caption
  if (media && typeof media === 'object') caption = media.caption

  return (
    <div
      className={cn(
        'my-8 sm:my-12 md:my-16',
        {
          'container mx-auto px-4 sm:px-8 lg:px-12': enableGutter,
        },
        className,
      )}
    >
      <div className="relative overflow-hidden border border-slate-200/90 bg-[#faf7f2]">
        <Media
          imgClassName={cn('w-full h-auto object-cover rounded-none', imgClassName)}
          resource={media}
          src={staticImage}
        />
      </div>
      {caption && (
        <div
          className={cn(
            'mt-3 text-xs sm:text-sm text-slate-500 italic',
            {
              'container mx-auto px-4 sm:px-8': !disableInnerContainer && !enableGutter,
            },
            captionClassName,
          )}
        >
          <RichText data={caption} enableGutter={false} />
        </div>
      )}
    </div>
  )
}

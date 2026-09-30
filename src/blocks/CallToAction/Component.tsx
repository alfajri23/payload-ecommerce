import React from 'react'

import { CMSLink } from '@/components/Link'
import { RichText } from '@/components/RichText'
import type { CallToActionBlock as CTABlockProps } from '@/payload-types'

import { cn } from '@/utilities/cn'

export const CallToActionBlock: React.FC<
  CTABlockProps & {
    id?: string | number
    className?: string
  }
> = ({ links, richText, className }) => {
  return (
    <div className={cn('container mx-auto px-4 sm:px-6 lg:px-8 my-10 sm:my-14 lg:my-16 max-w-4xl', className)}>
      <div className="relative overflow-hidden rounded-3xl bg-amber-200 border border-slate-200/90 py-12 px-6 sm:py-16 sm:px-12 md:py-10 md:px-16 flex flex-col items-center justify-center text-center shadow-xs">
        {/* Subtle decorative silhouette rings in the background */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-40">
          <div className="w-[300px] h-[300px] sm:w-[380px] sm:h-[380px] rounded-full border-[24px] sm:border-[32px] border-slate-100/80 -mr-16 sm:-mr-20" />
          <div className="w-[300px] h-[300px] sm:w-[380px] sm:h-[380px] rounded-full border-[24px] sm:border-[32px] border-slate-100/80 -ml-16 sm:-ml-20" />
        </div>

        {/* Content from props */}
        <div className="relative z-10 max-w-2xl mx-auto">
          {richText && (
            <RichText
              className="mb-0 text-slate-900 prose max-w-none prose-headings:text-slate-900 prose-headings:font-bold prose-headings:tracking-tight prose-headings:text-2xl sm:prose-headings:text-3xl md:prose-headings:text-4xl lg:prose-headings:text-5xl prose-headings:leading-tight prose-p:text-slate-600 prose-p:text-xs sm:prose-p:text-sm md:prose-p:text-base prose-p:leading-relaxed prose-p:mt-3 sm:prose-p:mt-4 prose-p:max-w-lg prose-p:mx-auto"
              data={richText}
              enableGutter={false}
            />
          )}
        </div>

        {/* Action Button(s) - Matching reference design pill styling */}
        <div className="relative z-10 flex flex-wrap items-center justify-center gap-3 sm:gap-4 mt-7 sm:mt-8">
          {(links || []).map(({ link }, i) => {
            const isSolid =
              (links?.length === 1 && i === 0) || (links?.length && links.length > 1 && i === 1)

            return (
              <CMSLink
                key={i}
                size="lg"
                className={cn(
                  'rounded-md px-7 py-2.5 text-xs sm:text-sm font-medium transition-all duration-200 inline-flex items-center justify-center gap-2 active:scale-95',
                  isSolid
                    ? 'bg-slate-900 text-white hover:bg-slate-800 shadow-xs'
                    : 'border border-slate-900 bg-white text-slate-900 hover:bg-slate-50',
                )}
                {...link}
              />
            )
          })}
        </div>
      </div>
    </div>
  )
}

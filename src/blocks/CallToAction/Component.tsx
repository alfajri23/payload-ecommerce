import React from 'react'

import type { CallToActionBlock as CTABlockProps } from '@/payload-types'
import { RichText } from '@/components/RichText'
import { CMSLink } from '@/components/Link'

import { cn } from '@/utilities/cn'

export const CallToActionBlock: React.FC<
  CTABlockProps & {
    id?: string | number
    className?: string
  }
> = ({ links, richText, className }) => {
  return (
    <div className={cn('container mx-auto px-4 sm:px-8 lg:px-12 my-12 sm:my-16 md:my-20', className)}>
      <div className="relative bg-[#faf7f2] border border-[#e8ded0] p-8 sm:p-12 lg:p-16 flex flex-col md:flex-row md:items-center md:justify-between gap-8 sm:gap-12 rounded-none">
        <div className="max-w-2xl">
          {richText && (
            <RichText
              className="mb-0 text-slate-900 prose prose-slate max-w-none prose-headings:font-serif prose-headings:tracking-tight prose-headings:text-slate-900 prose-p:text-slate-600 prose-p:leading-relaxed"
              data={richText}
              enableGutter={false}
            />
          )}
        </div>
        <div className="flex flex-wrap sm:flex-nowrap items-center gap-4 shrink-0">
          {(links || []).map(({ link }, i) => {
            return (
              <CMSLink
                key={i}
                size="lg"
                className="rounded-none bg-slate-900 hover:bg-slate-800 text-white px-6 py-3 text-xs sm:text-sm font-semibold uppercase tracking-wider transition-colors inline-flex items-center justify-center"
                {...link}
              />
            )
          })}
        </div>
      </div>
    </div>
  )
}

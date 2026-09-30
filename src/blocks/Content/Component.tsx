import { cn } from '@/utilities/cn'
import React from 'react'
import { RichText } from '@/components/RichText'
import type { DefaultDocumentIDType } from 'payload'
import type { ContentBlock as ContentBlockProps } from '@/payload-types'

import { CMSLink } from '../../components/Link'

export const ContentBlock: React.FC<
  ContentBlockProps & {
    id?: DefaultDocumentIDType
    className?: string
  }
> = (props) => {
  const { columns, className } = props

  const colsSpanClasses = {
    full: '12',
    half: '6',
    oneThird: '4',
    twoThirds: '8',
  }

  return (
    <div className={cn('container mx-auto px-4 sm:px-8 lg:px-12 my-12 sm:my-16 md:my-20', className)}>
      <div className="grid grid-cols-4 lg:grid-cols-12 gap-y-8 sm:gap-y-10 gap-x-8 lg:gap-x-12">
        {columns &&
          columns.length > 0 &&
          columns.map((col, index) => {
            const { enableLink, link, richText, size } = col

            return (
              <div
                className={cn(`col-span-4 lg:col-span-${colsSpanClasses[size!]}`, {
                  'md:col-span-2': size !== 'full',
                })}
                key={index}
              >
                {richText && (
                  <div className="prose prose-slate max-w-none text-slate-700 leading-relaxed prose-headings:font-serif prose-headings:text-slate-900 prose-headings:tracking-tight">
                    <RichText data={richText} enableGutter={false} />
                  </div>
                )}

                {enableLink && (
                  <div className="mt-6">
                    <CMSLink
                      className="inline-flex items-center gap-2 rounded-none bg-slate-900 hover:bg-slate-800 text-white px-5 py-2.5 text-xs sm:text-sm font-semibold uppercase tracking-wider transition-colors"
                      {...link}
                    />
                  </div>
                )}
              </div>
            )
          })}
      </div>
    </div>
  )
}

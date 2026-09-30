import type { BannerBlock as BannerBlockProps } from '@/payload-types'
import { cn } from '@/utilities/cn'
import React from 'react'
import { RichText } from '@/components/RichText'

export const BannerBlock: React.FC<
  BannerBlockProps & {
    id?: string | number
    className?: string
  }
> = ({ className, content, style }) => {
  return (
    <div className={cn('mx-auto my-6 sm:my-8 w-full max-w-4xl px-4', className)}>
      <div
        className={cn(
          'border py-3.5 px-5 sm:px-6 flex items-start sm:items-center gap-3 rounded-none text-sm leading-relaxed transition-colors',
          {
            'border-[#e8ded0] bg-[#faf7f2] text-slate-900': style === 'info' || !style,
            'border-red-200 bg-red-50 text-red-900': style === 'error',
            'border-emerald-200 bg-emerald-50 text-emerald-950': style === 'success',
            'border-amber-200 bg-amber-50 text-amber-950': style === 'warning',
          },
        )}
      >
        <RichText data={content} enableGutter={false} enableProse={false} />
      </div>
    </div>
  )
}

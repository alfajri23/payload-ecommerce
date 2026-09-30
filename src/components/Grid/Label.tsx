import clsx from 'clsx'
import React from 'react'

import { Price } from '@/components/Price'

type Props = {
  amount?: number
  position?: 'bottom' | 'center'
  title: string
}

export const Label: React.FC<Props> = ({ amount, position = 'bottom', title }) => {
  return (
    <div
      className={clsx('absolute bottom-0 left-0 flex w-full p-3 sm:p-4 @container/label', {
        'lg:items-center lg:justify-center': position === 'center',
      })}
    >
      <div className="flex items-center justify-between gap-2 w-full">
        <h3 className="line-clamp-1 border border-slate-200/90 bg-white/95 px-3 py-1.5 text-xs sm:text-sm font-medium tracking-tight text-slate-900 rounded-lg shadow-2xs backdrop-blur-xs">
          {title}
        </h3>

        {typeof amount === 'number' && amount > 0 && (
          <Price
            amount={amount}
            className="flex-none bg-[#bc6432] text-white px-3 py-1.5 text-xs sm:text-sm font-semibold tracking-wide rounded-lg shadow-2xs"
            currencyCodeClassName="hidden @[275px]/label:inline"
          />
        )}
      </div>
    </div>
  )
}

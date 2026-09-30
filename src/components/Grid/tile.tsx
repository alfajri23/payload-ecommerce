import type { Media as MediaType } from '@/payload-types'

import { Media } from '@/components/Media'
import { Label } from '@/components/Grid/Label'
import clsx from 'clsx'
import React from 'react'

type Props = {
  active?: boolean
  className?: string
  isInteractive?: boolean
  label?: {
    amount?: number
    position?: 'bottom' | 'center'
    title: string
  }
  media: MediaType
}

export const GridTileImage: React.FC<Props> = ({
  active,
  className,
  isInteractive = true,
  label,
  ...props
}) => {
  return (
    <div
      className={clsx(
        'group flex h-full w-full items-center justify-center overflow-hidden rounded-xl sm:rounded-2xl border bg-[#faf7f2] transition-all duration-300',
        {
          'border-2 border-slate-900 shadow-sm': active,
          'border-slate-200/90 hover:border-slate-900 hover:shadow-sm': !active,
          relative: label,
        },
        className,
      )}
    >
      {props.media ? (
        <Media
          className={clsx('relative h-full w-full object-cover', {
            'transition duration-500 ease-out group-hover:scale-104': isInteractive,
          })}
          height={80}
          imgClassName="h-full w-full object-cover"
          resource={props.media}
          width={80}
        />
      ) : null}
      {label ? <Label amount={label.amount} position={label.position} title={label.title} /> : null}
    </div>
  )
}

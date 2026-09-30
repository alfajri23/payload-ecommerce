import clsx from 'clsx'
import { ShoppingBag } from 'lucide-react'
import React from 'react'

export const OpenCartButton = React.forwardRef<
  HTMLButtonElement,
  React.ComponentProps<'button'> & { quantity?: number }
>(({ className, quantity, ...rest }, ref) => {
  return (
    <button
      ref={ref}
      type="button"
      aria-label="Keranjang Belanja"
      className={clsx(
        'relative flex items-center gap-2 text-sm font-medium text-slate-700 hover:text-[#bc6432] transition-colors p-2 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-900',
        className,
      )}
      {...rest}
    >
      <div className="relative flex items-center justify-center">
        <ShoppingBag className="h-5 w-5 stroke-[1.8]" />
        {Boolean(quantity && quantity > 0) && (
          <span className="absolute -top-1.5 -right-2 flex h-4 w-4 items-center justify-center rounded-full bg-[#bc6432] text-[10px] font-bold text-white leading-none">
            {quantity}
          </span>
        )}
      </div>
      <span className="hidden lg:inline text-xs font-medium uppercase tracking-wider">
        Keranjang
      </span>
    </button>
  )
})

OpenCartButton.displayName = 'OpenCartButton'


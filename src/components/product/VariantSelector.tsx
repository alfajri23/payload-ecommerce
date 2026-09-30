'use client'

import type { Product } from '@/payload-types'
import { isInventoryValidationEnabled } from '@/utilities/isInventoryEnabled'

import { createUrl } from '@/utilities/createUrl'
import clsx from 'clsx'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import React from 'react'

export function VariantSelector({ product }: { product: Product }) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const checkInventory = isInventoryValidationEnabled()
  const variants = product.variants?.docs
  const variantTypes = product.variantTypes
  const hasVariants = Boolean(product.enableVariants && variants?.length && variantTypes?.length)

  if (!hasVariants) {
    return null
  }

  return variantTypes?.map((type) => {
    if (!type || typeof type !== 'object') {
      return <></>
    }

    const options = type.options?.docs

    if (!options || !Array.isArray(options) || !options.length) {
      return <></>
    }

    return (
      <dl className="space-y-3" key={type.id}>
        <dt className="text-xs uppercase tracking-wider text-slate-500 font-medium">
          {type.label}:
        </dt>
        <dd className="flex flex-wrap gap-2">
          <React.Fragment>
            {options?.map((option) => {
              if (!option || typeof option !== 'object') {
                return <></>
              }

              const optionID = option.id
              const optionKeyLowerCase = type.name

              // Base option params on current params so we can preserve any other param state in the url.
              const optionSearchParams = new URLSearchParams(searchParams.toString())

              // Remove image and variant ID from this search params so we can loop over it safely.
              optionSearchParams.delete('variant')
              optionSearchParams.delete('image')

              // Update the option params using the current option to reflect how the url *would* change,
              // if the option was clicked.
              optionSearchParams.set(optionKeyLowerCase, String(optionID))

              const currentOptions = Array.from(optionSearchParams.values())

              let isAvailableForSale = true

              // Find a matching variant
              if (variants) {
                const matchingVariant = variants
                  .filter((variant) => typeof variant === 'object')
                  .find((variant) => {
                    if (!variant.options || !Array.isArray(variant.options)) return false

                    // Check if all variant options match the current options in the URL
                    return variant.options.every((variantOption) => {
                      if (typeof variantOption !== 'object')
                        return currentOptions.includes(String(variantOption))

                      return currentOptions.includes(String(variantOption.id))
                    })
                  })

                if (matchingVariant) {
                  // If we found a matching variant, set the variant ID in the search params.
                  optionSearchParams.set('variant', String(matchingVariant.id))

                  if (checkInventory) {
                    isAvailableForSale = Boolean(
                      matchingVariant.inventory && matchingVariant.inventory > 0,
                    )
                  } else {
                    isAvailableForSale = true
                  }
                }
              }

              const optionUrl = createUrl(pathname, optionSearchParams)

              // The option is active if it's in the url params.
              const isActive =
                Boolean(isAvailableForSale) &&
                searchParams.get(optionKeyLowerCase) === String(optionID)

              return (
                <button
                  type="button"
                  aria-disabled={!isAvailableForSale}
                  aria-pressed={isActive}
                  disabled={!isAvailableForSale}
                  key={option.id}
                  onClick={() => {
                    router.replace(`${optionUrl}`, {
                      scroll: false,
                    })
                  }}
                  title={`${option.label} ${!isAvailableForSale ? ' (Stok Habis)' : ''}`}
                  className={clsx(
                    'relative min-w-[50px] h-10 px-4 rounded-none text-xs font-medium transition-all duration-150 select-none text-center',
                    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-900 focus-visible:ring-offset-1',
                    {
                      // Active: Crisp high-contrast dark border and subtle background
                      'border-2 border-slate-900 bg-white text-slate-900 font-semibold shadow-xs ring-1 ring-slate-900/10':
                        isActive,
                      // Inactive: Clean border
                      'border border-slate-300 bg-white text-slate-700 hover:border-slate-800 hover:text-slate-900 cursor-pointer':
                        !isActive && isAvailableForSale,
                      // Out of stock
                      'border border-slate-200 bg-slate-50 text-slate-400 opacity-50 cursor-not-allowed line-through':
                        !isAvailableForSale,
                    },
                  )}
                >
                  {option.label}
                </button>
              )
            })}
          </React.Fragment>
        </dd>
      </dl>
    )
  })
}

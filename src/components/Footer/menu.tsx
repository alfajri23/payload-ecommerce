import type { Footer } from '@/payload-types'

import { CMSLink } from '@/components/Link'
import React from 'react'

interface Props {
  menu: Footer['navItems']
}

export function FooterMenu({ menu }: Props) {
  if (!menu?.length) return null

  return (
    <nav aria-label="Footer Navigation">
      <ul className="flex flex-col space-y-2.5">
        {menu.map((item) => {
          return (
            <li key={item.id}>
              <CMSLink
                appearance="inline"
                className="text-xs sm:text-sm font-medium text-slate-600 hover:text-[#bc6432] dark:text-slate-400 dark:hover:text-amber-400 transition-colors inline-block py-0.5"
                {...item.link}
              />
            </li>
          )
        })}
      </ul>
    </nav>
  )
}

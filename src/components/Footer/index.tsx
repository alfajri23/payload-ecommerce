import type { Footer as FooterType, GeneralSetting } from '@/payload-types'
import { FooterMenu } from '@/components/Footer/menu'
import { ThemeSelector } from '@/providers/Theme/ThemeSelector'
import { getCachedGlobal } from '@/utilities/getGlobals'
import Link from 'next/link'
import React, { Suspense } from 'react'
import { Wheat, MapPin, Phone } from 'lucide-react'

import { FooterWrapper } from './wrapper'

export async function Footer() {
  const [footer, generalSettings] = await Promise.all([
    getCachedGlobal('footer', 1)() as Promise<FooterType>,
    getCachedGlobal('general-settings', 1)().catch(() => null) as Promise<GeneralSetting | null>,
  ])

  const menu = footer.navItems || []
  const currentYear = new Date().getFullYear()
  const copyrightDate = 2024 + (currentYear > 2024 ? `-${currentYear}` : '')

  const storeName = generalSettings?.storeName || 'The Bakery'
  const address = generalSettings?.address || 'Jl. Kemang Raya No. 42, Jakarta Selatan'
  const phoneNumber = generalSettings?.phoneNumber || '+62 812-3456-7890'
  const mapsUrl = generalSettings?.mapsUrl

  return (
    <FooterWrapper>
      <footer className="w-full border-t border-slate-200 bg-stone-50/60 dark:bg-slate-950 dark:border-slate-800 text-sm text-slate-600 dark:text-slate-400 transition-colors">
      <div className="container mx-auto px-4 sm:px-8 lg:px-12 py-12 sm:py-16">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12">
          {/* Kolom 1: Brand & Filosofi Bakery */}
          <div className="md:col-span-6 lg:col-span-5 space-y-4">
            <Link
              href="/"
              className="inline-flex items-center gap-2.5 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-800 rounded-md"
            >
              <Wheat className="h-6 w-6 text-[#bc6432] group-hover:scale-105 transition-transform" />
              <span className="text-xl font-bold tracking-tight text-slate-900 dark:text-white group-hover:text-[#bc6432] transition-colors">
                {storeName}
              </span>
            </Link>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-sm leading-relaxed">
              Toko roti artisan dengan pilihan bahan terbaik, dipanggang segar setiap pagi dengan ragi alami dan dedikasi penuh.
            </p>
            <div className="space-y-2 pt-1 text-xs text-slate-600 dark:text-slate-400">
              <div className="flex items-center gap-2.5">
                <MapPin className="h-4 w-4 text-[#bc6432] shrink-0" />
                {mapsUrl ? (
                  <a
                    href={mapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-[#bc6432] transition-colors"
                  >
                    {address}
                  </a>
                ) : (
                  <span>{address}</span>
                )}
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="h-4 w-4 text-[#bc6432] shrink-0" />
                <span>{phoneNumber}</span>
              </div>
            </div>
          </div>

          {/* Kolom 2: Navigasi Tautan */}
          <div className="md:col-span-3 lg:col-span-4 space-y-3">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-900 dark:text-white">
              Menu & Navigasi
            </h3>
            <Suspense
              fallback={
                <div className="flex flex-col gap-2">
                  <div className="w-24 h-4 animate-pulse rounded bg-slate-200 dark:bg-slate-700" />
                  <div className="w-20 h-4 animate-pulse rounded bg-slate-200 dark:bg-slate-700" />
                  <div className="w-28 h-4 animate-pulse rounded bg-slate-200 dark:bg-slate-700" />
                </div>
              }
            >
              <FooterMenu menu={menu} />
            </Suspense>
          </div>

          {/* Kolom 3: Pengaturan Tema Tampilan */}
          <div className="md:col-span-3 lg:col-span-3 flex flex-col md:items-end justify-between gap-4">
            <div className="space-y-2 w-full md:w-auto">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-900 dark:text-white block md:text-right">
                Tema Tampilan
              </span>
              <div className="flex md:justify-end">
                <ThemeSelector />
              </div>
            </div>
          </div>
        </div>

        {/* Baris Bawah: Hak Cipta */}
        <div className="mt-12 pt-6 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 dark:text-slate-400">
          <p>
            &copy; {copyrightDate} The Bakery. Seluruh hak cipta dilindungi.
          </p>
          <p className="flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-[#bc6432]" />
            <span>Artisan Bakery & Pastry</span>
          </p>
        </div>
      </div>
    </footer>
    </FooterWrapper>
  )
}


'use client'

import {
  ArrowRight,
  Award,
  Check,
  Clock,
  Coffee,
  Gift,
  MapPin,
  Phone,
  ShoppingBag,
  Truck,
  Wheat,
  X
} from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'

import { Grid } from '@/components/Grid'
import { ProductGridItem } from '@/components/ProductGridItem'
import type { Product } from '@/payload-types'

// Format Rupiah
const formatRupiah = (amount: number): string => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(amount)
}

type Props = {
  categoriesWithProducts?: {
    id: number | string
    title: string
    products: Product[]
  }[]
}

export function HomePageClient({ categoriesWithProducts = [] }: Props) {
  const [cartCount, setCartCount] = useState(0)
  const [toastMessage, setToastMessage] = useState<string | null>(null)

  const showToast = (message: string) => {
    setToastMessage(message)
    setTimeout(() => setToastMessage(null), 3200)
  }

  const handleAddToCart = (productTitle: string) => {
    setCartCount((prev) => prev + 1)
    showToast(`${productTitle} ditambahkan ke pesanan`)
  }

  return (
    <div className="min-h-screen bg-white text-[#1f2421] selection:bg-[#bc6432] selection:text-white">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 rounded-lg bg-[#1f2421] px-5 py-3 text-sm text-white shadow-2xl animate-in fade-in duration-200">
          <div className="flex h-5 w-5 items-center justify-center rounded-full bg-[#bc6432] text-white">
            <Check className="h-3 w-3 stroke-[3]" />
          </div>
          <span className="font-medium text-xs sm:text-sm">{toastMessage}</span>
          <button
            onClick={() => setToastMessage(null)}
            className="ml-2 text-slate-400 hover:text-white"
            aria-label="Tutup notifikasi"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* 1. HERO SECTION: Kept as approved with large prominent center image & left Order Now */}
      <section
        aria-label="The Bakery Hero"
        className="relative bg-white pb-6 sm:pb-8"
      >
        <div className="container mx-auto px-4 sm:px-8 lg:px-12 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center min-h-[520px]">
            {/* Left Column: Big Bold Typography "Bakery", Bun roll, and Terracotta ORDER NOW Button */}
            <div className="lg:col-span-3 xl:col-span-3 space-y-6">
              <div className="space-y-1">
                <p className="text-xs uppercase tracking-[0.25em] text-[#bc6432] font-semibold">
                  Artisan Sourdough & Pastry
                </p>
                <h1 className="text-6xl sm:text-6xl lg:text-6xl xl:text-6xl font-black tracking-tight text-slate-900 leading-none">
                  Bakery
                </h1>
              </div>

              {/* Sliced Roll with crumbs accent */}
              <div className="flex items-center gap-3 text-xs text-slate-500">
                <div className="relative h-12 w-12 rounded-full overflow-hidden shadow-xs border border-slate-100 shrink-0">
                  <Image
                    src="https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=200&q=80"
                    alt="Artisan bun roll"
                    fill
                    sizes="48px"
                    className="object-cover"
                  />
                </div>
                <span className="italic font-serif leading-tight">
                  Dipanggang segar setiap pagi dengan ragi alami
                </span>
              </div>

              {/* ORDER NOW Button placed on the LEFT SIDE */}
              <div className="pt-2">
                <Link
                  href="/shop"
                  className="inline-flex items-center gap-2.5 rounded-lg bg-[#bc6432] hover:bg-[#a35224] px-8 py-3.5 text-xs font-bold uppercase tracking-wider text-white shadow-md active:scale-95 transition-all"
                >
                  <Wheat className="h-4 w-4" />
                  ORDER NOW
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>

            {/* Center Column: ENLARGED, DOMINANT & PROMINENT IMAGE */}
            <div className="lg:col-span-6 xl:col-span-6 flex items-center justify-center">
              <div className="relative w-full aspect-4/3 sm:aspect-16/11 max-w-[800px] rounded-3xl overflow-hidden group">
                <Image
                  src="https://images.unsplash.com/photo-1691480162735-9b91238080f6?q=80&w=1200&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                  alt="Aneka roti artisan hangat The Bakery"
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 800px"
                  className="object-cover group-hover:scale-103 transition-transform duration-700"
                />
              </div>
            </div>

            {/* Right Column: Editorial Paragraph with Business Location & Phone */}
            <div className="lg:col-span-3 xl:col-span-3 space-y-6 lg:pl-2">
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-light">
                The bakery is an establishment that produces food baked in an oven such as bread,
                cookies, cakes, pastries, and pies. Some retail bakeries are also categorized as
                cafés, serving coffee and tea to customers.
              </p>

              {/* Business Location & Phone */}
              <div className="space-y-3 pt-4 border-t border-slate-100 text-xs text-slate-600">
                <div className="flex items-start gap-2.5">
                  <MapPin className="h-4 w-4 text-[#bc6432] shrink-0 mt-0.5" />
                  <div>
                    <strong className="block text-slate-900 font-semibold">Alamat Toko:</strong>
                    <span className="text-slate-500 leading-normal">
                      Jl. Senopati No. 42, Kebayoran Baru, Jakarta Selatan 12190
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <Phone className="h-4 w-4 text-[#bc6432] shrink-0 mt-0.5" />
                  <div>
                    <strong className="block text-slate-900 font-semibold">Telepon & WhatsApp:</strong>
                    <span className="text-[#bc6432] font-semibold">+62 812-8899-7722</span>
                    <span className="block text-slate-400 text-2xs">(021) 720-8899</span>
                  </div>
                </div>

                <div className="flex items-start gap-2.5 text-2xs text-slate-400">
                  <Clock className="h-3.5 w-3.5 text-[#bc6432] shrink-0 mt-0.5" />
                  <span>Buka Setiap Hari: 07.00 - 21.00 WIB</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. SECTION PROMO (Refined typographic ribbon with iconic promo accents) */}
      <section
        id="promo"
        aria-label="Informasi Penawaran Khusus"
        className="bg-white pt-2 pb-8 sm:pb-10"
      >
        <div className="container mx-auto px-4 sm:px-8 lg:px-12">
          <div className="rounded-xl border border-[#e6dcce] bg-[#f9f6f0] p-1.5 shadow-2xs">
            <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-[#e8ded0]">
              {/* Promo 1: Delivery */}
              <div className="px-5 py-3.5 flex items-center gap-3.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#eedecf] text-[#bc6432] shrink-0 shadow-2xs">
                  <Truck className="h-4.5 w-4.5" />
                </div>
                <div className="min-w-0">
                  <h4 className="text-xs font-semibold text-slate-900">Bebas Ongkir Senopati</h4>
                  <p className="text-xs text-slate-600 font-normal">Pengiriman radius 10 km tanpa minimal order</p>
                </div>
              </div>

              {/* Promo 2: Breakfast */}
              <div className="px-5 py-3.5 flex items-center gap-3.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#eedecf] text-[#bc6432] shrink-0 shadow-2xs">
                  <Coffee className="h-4.5 w-4.5" />
                </div>
                <div className="min-w-0">
                  <h4 className="text-xs font-semibold text-slate-900">Menu Sarapan Pagi</h4>
                  <p className="text-xs text-slate-600 font-normal">Diskon 20% menu croissant & kopi s/d 10.00 WIB</p>
                </div>
              </div>

              {/* Promo 3: Weekend Treat */}
              <div className="px-5 py-3.5 flex items-center gap-3.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#eedecf] text-[#bc6432] shrink-0 shadow-2xs">
                  <Gift className="h-4.5 w-4.5" />
                </div>
                <div className="min-w-0">
                  <h4 className="text-xs font-semibold text-slate-900">Weekend Artisan Treat</h4>
                  <p className="text-xs text-slate-600 font-normal">Beli 1 sourdough loaf bonus 2 pastry pilihan</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. SECTION TOP PRODUCT OF THE MONTH (Artisan Showcase Card on clean white canvas) */}
      <section
        id="top-product"
        aria-labelledby="heading-top-product"
        className="bg-white py-6 sm:py-10"
      >
        <div className="container mx-auto px-4 sm:px-8 lg:px-12">
          {/* Showcase Spotlight Card */}
          <div className="rounded-2xl sm:rounded-3xl bg-[#fbf8f3] border border-[#e8ded0] p-6 sm:p-10 lg:p-12 shadow-2xs">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
              {/* Left: Product Image with iconic artisan seal badge */}
              <div className="lg:col-span-7">
                <div className="relative aspect-16/10 w-full rounded-xl sm:rounded-2xl overflow-hidden shadow-xs border border-[#e5d8c6] bg-white group">
                  {/* Iconic Seal Badge */}
                  <div className="absolute top-4 left-4 z-10 flex items-center gap-1.5 rounded-full bg-white/95 px-3 py-1.5 shadow-xs border border-[#ebdccb]">
                    <Award className="h-3.5 w-3.5 text-[#bc6432]" />
                    <span className="text-2xs font-semibold uppercase tracking-wider text-slate-800">
                      Signature Bake No. 01
                    </span>
                  </div>

                  <Image
                    src="https://images.unsplash.com/photo-1589367920969-ab8e050bbb04?auto=format&fit=crop&w=800&q=85"
                    alt="Country Sourdough Loaf The Bakery"
                    fill
                    sizes="(max-width: 1024px) 100vw, 550px"
                    className="object-cover group-hover:scale-103 transition-transform duration-700"
                  />
                </div>
              </div>

              {/* Right: Pure typographic hierarchy (Title, Description, Price, CTA) */}
              <div className="lg:col-span-5 space-y-6 lg:pl-2">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#bc6432]">
                    <Award className="h-3.5 w-3.5 shrink-0" />
                    <span>Top Product of the Month</span>
                  </div>
                  <h2
                    id="heading-top-product"
                    className="text-3xl sm:text-4xl font-serif text-slate-900 leading-tight"
                  >
                    The Signature Sourdough Loaf
                  </h2>
                </div>

                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                  Roti sourdough klasik yang difermentasi dingin lambat selama 24 jam dengan starter alami murni.
                  Memiliki kerak garing kecokelatan dengan rongga remah kenyal, aroma gandum panggang yang dalam,
                  serta cita rasa asam segar yang seimbang.
                </p>

                {/* Price & CTA Order */}
                <div className="pt-4 border-t border-[#e2d5c3] flex items-center justify-between gap-6">
                  <div>
                    <span className="text-2xs uppercase tracking-wider text-slate-500 block font-medium">
                      Harga
                    </span>
                    <span className="text-2xl font-serif font-bold text-slate-900">
                      {formatRupiah(65000)}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleAddToCart('The Signature Sourdough Loaf')}
                    className="inline-flex items-center gap-2 rounded-lg bg-[#bc6432] hover:bg-[#a35224] focus-visible:ring-2 focus-visible:ring-[#bc6432] focus-visible:outline-none px-7 py-3 text-xs font-semibold uppercase tracking-wider text-white shadow-xs active:scale-95 transition-all"
                  >
                    <Wheat className="h-4 w-4" />
                    PESAN SEKARANG
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. KATALOG PRODUK PER KATEGORI (Menggunakan data collection dari Payload) */}
      <section id="katalog" aria-label="Katalog Roti per Kategori" className="container mx-auto px-4 sm:px-8 lg:px-12 py-14 sm:py-20 space-y-14 sm:space-y-18">
        {categoriesWithProducts.length > 0 ? (
          categoriesWithProducts.map((category) => (
            <div key={category.id} className="space-y-6 sm:space-y-8">
              {/* Category Header */}
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                  {category.title}
                </h3>
                <Link
                  href="/shop"
                  className="inline-flex items-center gap-1 text-xs font-semibold text-[#bc6432] hover:text-[#964218] transition-colors"
                >
                  Lihat Semua
                  <ArrowRight className="h-3 w-3" />
                </Link>
              </div>

              {/* Grid Produk menggunakan komponen <Grid> dan <ProductGridItem> */}
              <Grid className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 gap-8 sm:gap-10">
                {category.products.map((product) => (
                  <ProductGridItem key={product.id} product={product} />
                ))}
              </Grid>
            </div>
          ))
        ) : (
          <div className="text-center py-12 text-slate-500">
            <p>Belum ada produk yang tersedia.</p>
          </div>
        )}
      </section>

      {/* 5. CLEAN & EYE-CATCHING ARTISAN CTA (Blended with Card) */}
      <section id="order-cta" aria-label="Pesan Roti Segar" className="container mx-auto px-4 sm:px-8 lg:px-12 py-8 sm:py-12">
        <div className="relative rounded-2xl bg-[#faf6f0] border border-[#e8ded0] overflow-hidden shadow-2xs">
          {/* Background Blended Artisan Image */}
          <div className="absolute right-0 inset-y-0 w-full sm:w-2/3 lg:w-1/2 pointer-events-none">
            <Image
              src="https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=1000&q=85"
              alt="Adonan dan roti artisan The Bakery di meja tepung"
              fill
              sizes="(max-width: 1024px) 100vw, 600px"
              className="object-cover object-center opacity-45 sm:opacity-60 mix-blend-multiply"
            />
            {/* Soft Organic Fade into Card */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#faf6f0] via-[#faf6f0]/75 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#faf6f0]/70 via-transparent to-transparent sm:hidden" />
          </div>

          {/* Foreground Content */}
          <div className="relative z-10 p-6 sm:p-10 lg:p-12 max-w-xl space-y-4">
            <span className="text-2xs font-semibold uppercase tracking-[0.2em] text-[#bc6432] block">
              Dipanggang Terbatas Setiap Pagi
            </span>

            <h3 className="text-2xl sm:text-3xl font-serif text-slate-900 leading-snug tracking-tight">
              Nikmati Roti Hangat Hari Ini di Meja Makan Anda
            </h3>

            <p className="text-xs sm:text-sm text-slate-600 font-normal leading-relaxed">
              Setiap varian dipanggang segar dalam kuantitas terbatas. Pesan sebelum pukul 14.00 WIB untuk pengiriman hari ini langsung dari dapur kami.
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-3">
              <Link
                href="/shop"
                className="inline-flex items-center gap-2 rounded-lg bg-[#bc6432] hover:bg-[#a35224] focus-visible:ring-2 focus-visible:ring-[#bc6432] focus-visible:outline-none px-6 py-2.5 text-xs font-semibold uppercase tracking-wider text-white shadow-2xs transition-all active:scale-95"
              >
                <ShoppingBag className="h-3.5 w-3.5" />
                Pesan Sekarang
              </Link>

              <a
                href="https://wa.me/6281288997722"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 rounded-lg border border-[#e0d3c3] bg-white/90 hover:bg-white px-4 py-2.5 text-xs font-medium text-slate-700 transition-colors shadow-2xs"
              >
                <Phone className="h-3.5 w-3.5 text-[#bc6432]" />
                WhatsApp Senopati
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* 6. FILOSOFI DAPUR KAMI (Artisan Editorial Spread, Zero Slop Cards) */}
      <section
        id="filosofi"
        aria-label="Filosofi Toko Roti"
        className="container mx-auto px-4 sm:px-8 lg:px-12 py-10 sm:py-16"
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-center">
          {/* Left Column: Heading and Story */}
          <div className="lg:col-span-6 space-y-4">
            <div className="space-y-1.5">
              <span className="text-xs uppercase tracking-[0.25em] text-[#bc6432] font-semibold block">
                Filosofi Dapur Kami
              </span>
              <h2 className="text-2xl sm:text-3xl font-serif text-slate-900 leading-tight">
                Kelezatan Murni dari <br />
                <span className="italic text-[#bc6432]">Kesabaran & Tradisi</span>
              </h2>
            </div>

            <p className="text-xs sm:text-sm text-slate-600 font-normal leading-relaxed">
              Kami percaya roti sejati tidak membutuhkan bahan pengembang instan atau pelembut kimia.
              Hanya gandum murni, air, garam laut, dan waktu fermentasi yang cukup agar nutrisi terurai alami,
              menghasilkan remah berongga kenyal yang ringan serta ramah di pencernaan.
            </p>
          </div>

          {/* Right Column: Artisan Craft Photo */}
          <div className="lg:col-span-6">
            <div className="relative aspect-16/10 w-full rounded-xl overflow-hidden border border-[#e8ded0] bg-white group shadow-2xs">
              <Image
                src="https://images.unsplash.com/photo-1608198093002-ad4e005484ec?auto=format&fit=crop&w=800&q=80"
                alt="Pembuatan adonan roti artisan di The Bakery"
                fill
                sizes="(max-width: 1024px) 100vw, 550px"
                className="object-cover group-hover:scale-103 transition-transform duration-700"
              />
            </div>
          </div>
        </div>

        {/* Bottom Part: 3 Pillars as Pure Typography (No Cards, No Box Containers) */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 sm:gap-10 pt-10 mt-10 border-t border-[#e8ded0]">
          <div className="space-y-1.5">
            <h3 className="text-sm sm:text-base font-semibold text-slate-900">
              Gandum Organik T65 Prancis
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 font-normal leading-relaxed">
              Digiling perlahan tanpa pemutih kimia untuk mempertahankan nutrisi endosperma dan aroma manis alami gandum panggang.
            </p>
          </div>

          <div className="space-y-1.5">
            <h3 className="text-sm sm:text-base font-semibold text-slate-900">
              Fermentasi Dingin 24 Jam
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 font-normal leading-relaxed">
              Biang ragi alami yang dirawat setiap hari mengurai gluten secara biologis, menjadikan roti bertekstur kenyal dan mudah dicerna.
            </p>
          </div>

          <div className="space-y-1.5">
            <h3 className="text-sm sm:text-base font-semibold text-slate-900">
              Mentega Murni AOP Prancis
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 font-normal leading-relaxed">
              Pastry dan croissant dilaminasi manual dengan mentega berlabel AOP tanpa lemak nabati, menghasilkan lapisan renyah sarang lebah yang gurih.
            </p>
          </div>
        </div>
      </section>

    </div>
  )
}

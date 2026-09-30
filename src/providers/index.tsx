'use client'

import { AuthProvider } from '@/providers/Auth'
import { EcommerceProvider, useCart } from '@payloadcms/plugin-ecommerce/client/react'
import React, { useEffect } from 'react'

import { HeaderThemeProvider } from './HeaderTheme'
import { ThemeProvider } from './Theme'
import { SonnerProvider } from '@/providers/Sonner'

const currenciesConfig = {
  defaultCurrency: 'IDR',
  supportedCurrencies: [
    {
      code: 'IDR',
      decimals: 0,
      label: 'Indonesian Rupiah',
      symbol: 'Rp',
    },
  ],
}

function CartSanitizer() {
  const { cart, clearCart } = useCart()

  useEffect(() => {
    if (cart && cart.currency && cart.currency !== 'IDR') {
      void clearCart()
    }
  }, [cart, clearCart])

  return null
}

export const Providers: React.FC<{
  children: React.ReactNode
}> = ({ children }) => {
  return (
    <ThemeProvider>
      <AuthProvider>
        <HeaderThemeProvider>
          <SonnerProvider />
          <EcommerceProvider
            enableVariants={true}
            currenciesConfig={currenciesConfig}
            debug={process.env.NODE_ENV !== 'production'}
            paymentMethods={[]}
            api={{
              cartsFetchQuery: {
                depth: 2,
                populate: {
                  products: {
                    slug: true,
                    title: true,
                    gallery: true,
                    inventory: true,
                    priceInIDR: true,
                    priceInIDREnabled: true,
                  },
                  variants: {
                    title: true,
                    inventory: true,
                    priceInIDR: true,
                    priceInIDREnabled: true,
                    options: true,
                  },
                },
              },
            }}
          >
            <CartSanitizer />
            {children}
          </EcommerceProvider>
        </HeaderThemeProvider>
      </AuthProvider>
    </ThemeProvider>
  )
}

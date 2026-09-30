import type { Metadata } from 'next'

import { RenderParams } from '@/components/RenderParams'
import React from 'react'

import { headers as getHeaders } from 'next/headers'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { LoginForm } from '@/components/forms/LoginForm'
import { redirect } from 'next/navigation'

export default async function Login() {
  const headers = await getHeaders()
  const payload = await getPayload({ config: configPromise })
  const { user } = await payload.auth({ headers })

  if (user) {
    redirect(`/account?warning=${encodeURIComponent('You are already logged in.')}`)
  }

  return (
    <div className="min-h-[calc(100vh-220px)] py-10 sm:py-16 lg:py-20 flex flex-col justify-center items-center px-4 sm:px-6">
      <div className="w-full max-w-md sm:max-w-lg">
        <RenderParams />

        <div className="bg-white border border-slate-300 rounded-2xl p-6 sm:p-10 shadow-sm">
          <div className="mb-8 text-center sm:text-left">
            <span className="text-xs uppercase tracking-[0.25em] text-[#bc6432] font-semibold block mb-1.5">
              The Bakery
            </span>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
              Sign In
            </h1>
            <p className="mt-2 text-sm text-slate-600">
              Masuk ke akun Anda untuk melacak pesanan dan menikmati kemudahan berbelanja roti hangat.
            </p>
          </div>

          <LoginForm />
        </div>
      </div>
    </div>
  )
}

export const metadata: Metadata = {
  description: 'Login or create an account to get started.',
  openGraph: {
    title: 'Login',
    url: '/login',
  },
  title: 'Login',
}

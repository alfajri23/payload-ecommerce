'use client'

import { FormError } from '@/components/forms/FormError'
import { FormItem } from '@/components/forms/FormItem'
import { Message } from '@/components/Message'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useAuth } from '@/providers/Auth'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { getSafeRedirect } from 'payload/shared'
import React, { useCallback, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'

type FormData = {
  email: string
  password: string
  passwordConfirm: string
}

export const CreateAccountForm: React.FC = () => {
  const searchParams = useSearchParams()
  const allParams = searchParams.toString() ? `?${searchParams.toString()}` : ''
  const { login } = useAuth()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<null | string>(null)

  const {
    formState: { errors },
    handleSubmit,
    register,
    watch,
  } = useForm<FormData>()

  const password = useRef({})
  password.current = watch('password', '')

  const onSubmit = useCallback(
    async (data: FormData) => {
      const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/users`, {
        body: JSON.stringify(data),
        headers: {
          'Content-Type': 'application/json',
        },
        method: 'POST',
      })

      if (!response.ok) {
        const message = response.statusText || 'There was an error creating the account.'
        setError(message)
        return
      }

      const redirect = getSafeRedirect({
        fallbackTo: `/account?success=${encodeURIComponent('Account created successfully')}`,
        redirectTo: searchParams.get('redirect') ?? '',
      })

      const timer = setTimeout(() => {
        setLoading(true)
      }, 1000)

      try {
        await login(data)
        clearTimeout(timer)
        router.push(redirect)
      } catch (_) {
        clearTimeout(timer)
        setError('There was an error with the credentials provided. Please try again.')
      }
    },
    [login, router, searchParams],
  )

  return (
    <form className="w-full" onSubmit={handleSubmit(onSubmit)}>
      {error && <Message error={error} className="mb-6" />}

      <div className="flex flex-col gap-5">
        <FormItem>
          <Label htmlFor="email" className="text-sm font-semibold text-slate-800">
            Email
          </Label>
          <Input
            id="email"
            type="email"
            placeholder="nama@email.com"
            className="h-11 rounded-lg border-slate-300 focus-visible:border-amber-800 focus-visible:ring-amber-800/20 text-slate-900"
            {...register('email', { required: 'Email wajib diisi.' })}
          />
          {errors.email && <FormError message={errors.email.message} />}
        </FormItem>

        <FormItem>
          <Label htmlFor="password" className="text-sm font-semibold text-slate-800">
            Password Baru
          </Label>
          <Input
            id="password"
            type="password"
            placeholder="Minimal 8 karakter"
            className="h-11 rounded-lg border-slate-300 focus-visible:border-amber-800 focus-visible:ring-amber-800/20 text-slate-900"
            {...register('password', { required: 'Password wajib diisi.' })}
          />
          {errors.password && <FormError message={errors.password.message} />}
        </FormItem>

        <FormItem>
          <Label htmlFor="passwordConfirm" className="text-sm font-semibold text-slate-800">
            Konfirmasi Password
          </Label>
          <Input
            id="passwordConfirm"
            type="password"
            placeholder="Ulangi password baru"
            className="h-11 rounded-lg border-slate-300 focus-visible:border-amber-800 focus-visible:ring-amber-800/20 text-slate-900"
            {...register('passwordConfirm', {
              required: 'Konfirmasi password wajib diisi.',
              validate: (value) => value === password.current || 'Password tidak cocok.',
            })}
          />
          {errors.passwordConfirm && <FormError message={errors.passwordConfirm.message} />}
        </FormItem>

        <div className="pt-2">
          <Button
            className="w-full h-11 bg-[#bc6432] hover:bg-[#a35224] text-white font-medium rounded-lg text-sm transition-all shadow-xs hover:shadow-sm active:scale-98 cursor-pointer flex items-center justify-center"
            disabled={loading}
            type="submit"
          >
            {loading ? 'Mendaftarkan...' : 'Daftar Akun'}
          </Button>
        </div>
      </div>

      <div className="mt-8 pt-6 border-t border-slate-100 text-center text-sm text-slate-600">
        Sudah memiliki akun?{' '}
        <Link
          href={`/login${allParams}`}
          className="font-semibold text-[#bc6432] hover:text-[#a35224] hover:underline transition-colors"
        >
          Masuk ke akun
        </Link>
      </div>
    </form>
  )
}

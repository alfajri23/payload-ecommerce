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
import React, { useCallback, useRef } from 'react'
import { useForm } from 'react-hook-form'

type FormData = {
  email: string
  password: string
}

export const LoginForm: React.FC = () => {
  const searchParams = useSearchParams()
  const allParams = searchParams.toString() ? `?${searchParams.toString()}` : ''
  const redirect = useRef(
    getSafeRedirect({
      fallbackTo: '/account',
      redirectTo: searchParams.get('redirect') ?? '',
    }),
  )
  const { login } = useAuth()
  const router = useRouter()
  const [error, setError] = React.useState<null | string>(null)

  const {
    formState: { errors, isLoading },
    handleSubmit,
    register,
  } = useForm<FormData>()

  const onSubmit = useCallback(
    async (data: FormData) => {
      try {
        await login(data)
        router.push(redirect.current)
      } catch (_) {
        setError('There was an error with the credentials provided. Please try again.')
      }
    },
    [login, router],
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
          <div className="flex items-center justify-between">
            <Label htmlFor="password" className="text-sm font-semibold text-slate-800">
              Password
            </Label>
            <Link
              href={`/forgot-password${allParams}`}
              className="text-xs font-medium text-slate-500 hover:text-[#bc6432] transition-colors"
            >
              Lupa password?
            </Link>
          </div>
          <Input
            id="password"
            type="password"
            placeholder="••••••••"
            className="h-11 rounded-lg border-slate-300 focus-visible:border-amber-800 focus-visible:ring-amber-800/20 text-slate-900"
            {...register('password', { required: 'Password wajib diisi.' })}
          />
          {errors.password && <FormError message={errors.password.message} />}
        </FormItem>

        <div className="pt-2">
          <Button
            className="w-full h-11 bg-[#bc6432] hover:bg-[#a35224] text-white font-medium rounded-lg text-sm transition-all shadow-xs hover:shadow-sm active:scale-98 cursor-pointer flex items-center justify-center"
            disabled={isLoading}
            type="submit"
          >
            {isLoading ? 'Memproses...' : 'Masuk'}
          </Button>
        </div>
      </div>

      <div className="mt-8 pt-6 border-t border-slate-100 text-center text-sm text-slate-600">
        Belum memiliki akun?{' '}
        <Link
          href={`/create-account${allParams}`}
          className="font-semibold text-[#bc6432] hover:text-[#a35224] hover:underline transition-colors"
        >
          Daftar sekarang
        </Link>
      </div>
    </form>
  )
}

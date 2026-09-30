'use client'
import type { Form as FormType } from '@payloadcms/plugin-form-builder/types'

import { useRouter } from 'next/navigation'
import React, { useCallback, useState } from 'react'
import { useForm, FormProvider } from 'react-hook-form'
import { RichText } from '@/components/RichText'
import { Button } from '@/components/ui/button'
import type { SerializedEditorState } from '@payloadcms/richtext-lexical/lexical'

import { buildInitialFormState } from './buildInitialFormState'
import { fields } from './fields'
import { getClientSideURL } from '@/utilities/getURL'
import { DefaultDocumentIDType } from 'payload'

export type Value = unknown

export interface Property {
  [key: string]: Value
}

export interface Data {
  [key: string]: Property | Property[]
}

export type FormBlockType = {
  blockName?: string
  blockType?: 'formBlock'
  enableIntro: boolean
  form: FormType
  introContent?: SerializedEditorState
}

export const FormBlock: React.FC<
  FormBlockType & {
    id?: DefaultDocumentIDType
  }
> = (props) => {
  const {
    enableIntro,
    form: formFromProps,
    introContent,
  } = props

  const isFormObject = typeof formFromProps === 'object' && formFromProps !== null
  const formID = isFormObject ? formFromProps.id : formFromProps
  const confirmationMessage = isFormObject ? formFromProps.confirmationMessage : undefined
  const confirmationType = isFormObject ? formFromProps.confirmationType : undefined
  const redirect = isFormObject ? formFromProps.redirect : undefined
  const submitButtonLabel = isFormObject ? formFromProps.submitButtonLabel : undefined

  const formMethods = useForm({
    defaultValues: buildInitialFormState(isFormObject && formFromProps.fields ? formFromProps.fields : []),
  })
  const {
    control,
    formState: { errors },
    handleSubmit,
    register,
  } = formMethods

  const [isLoading, setIsLoading] = useState(false)
  const [hasSubmitted, setHasSubmitted] = useState<boolean>()
  const [error, setError] = useState<{ message: string; status?: string } | undefined>()
  const router = useRouter()

  const onSubmit = useCallback(
    (data: Data) => {
      let loadingTimerID: ReturnType<typeof setTimeout>
      const submitForm = async () => {
        setError(undefined)

        const dataToSend = Object.entries(data).map(([name, value]) => ({
          field: name,
          value: typeof value === 'string' ? value : String(value ?? ''),
        }))

        // delay loading indicator by 1s
        loadingTimerID = setTimeout(() => {
          setIsLoading(true)
        }, 1000)

        try {
          const req = await fetch(`${getClientSideURL()}/api/form-submissions`, {
            body: JSON.stringify({
              form: formID,
              submissionData: dataToSend,
            }),
            headers: {
              'Content-Type': 'application/json',
            },
            method: 'POST',
          })

          const res = await req.json()

          clearTimeout(loadingTimerID)

          if (req.status >= 400) {
            setIsLoading(false)

            setError({
              message: res.errors?.[0]?.message || 'Internal Server Error',
              status: res.status,
            })

            return
          }

          setIsLoading(false)
          setHasSubmitted(true)

          if (confirmationType === 'redirect' && redirect) {
            const { url } = redirect

            const redirectUrl = url

            if (redirectUrl) router.push(redirectUrl)
          }
        } catch (err) {
          console.warn(err)
          setIsLoading(false)
          setError({
            message: 'Terjadi kesalahan pada sistem formulir.',
          })
        }
      }

      void submitForm()
    },
    [router, formID, redirect, confirmationType],
  )

  if (!isFormObject || !formFromProps?.fields) {
    return null
  }

  return (
    <div className="container mx-auto px-4 sm:px-8 lg:max-w-3xl my-10 sm:my-14 lg:my-16">
      {enableIntro && introContent && !hasSubmitted && (
        <div className="mb-8 lg:mb-10 prose prose-slate max-w-none prose-headings:font-sans prose-headings:font-bold prose-headings:text-slate-900 prose-headings:tracking-tight prose-p:text-slate-600">
          <RichText data={introContent} enableGutter={false} />
        </div>
      )}
      <div className="p-6 sm:p-10 border border-slate-300 rounded-xl bg-white shadow-sm">
        <FormProvider {...formMethods}>
          {!isLoading && hasSubmitted && confirmationType === 'message' && (
            <div className="prose prose-slate max-w-none">
              <RichText data={confirmationMessage} />
            </div>
          )}
          {isLoading && !hasSubmitted && (
            <div className="py-4 text-sm text-slate-500 animate-pulse">
              Mengirim formulir, mohon tunggu...
            </div>
          )}
          {error && (
            <div className="p-4 mb-6 text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg">
              <p className="font-semibold">{error.status ? `Error ${error.status}` : 'Terjadi Kesalahan'}</p>
              <p className="mt-1">{error.message || 'Gagal mengirim formulir. Silakan coba lagi.'}</p>
            </div>
          )}
          {!hasSubmitted && (
            <form id={String(formID)} onSubmit={handleSubmit(onSubmit)}>
              <div className="mb-6 last:mb-0 space-y-4">
                {formFromProps.fields.map((field, index) => {
                  const Field: React.FC<any> | undefined =
                    fields?.[field.blockType as keyof typeof fields]

                  if (Field) {
                    return (
                      <div className="mb-5 last:mb-0" key={index}>
                        <Field
                          form={formFromProps}
                          {...field}
                          {...formMethods}
                          control={control}
                          errors={errors}
                          register={register}
                        />
                      </div>
                    )
                  }
                  return null
                })}
              </div>

              <Button
                form={String(formID)}
                type="submit"
                disabled={isLoading}
                className="bg-amber-800 hover:bg-amber-900 text-white rounded-lg px-6 py-2.5 font-medium transition-all shadow-xs hover:shadow-sm active:scale-98 cursor-pointer"
              >
                {isLoading ? 'Mengirim...' : submitButtonLabel || 'Kirim'}
              </Button>
            </form>
          )}
        </FormProvider>
      </div>
    </div>
  )
}

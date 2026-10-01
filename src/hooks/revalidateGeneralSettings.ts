import type { GlobalAfterChangeHook } from 'payload'
import { revalidateTag } from 'next/cache'

export const revalidateGeneralSettings: GlobalAfterChangeHook = ({ doc, req: { payload, context } }) => {
  if (!context?.disableRevalidate) {
    payload.logger.info(`Revalidating general settings`)

    try {
      revalidateTag('global_general-settings', 'max')
    } catch {
      // In case called outside request context
    }
  }

  return doc
}

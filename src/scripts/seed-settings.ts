import { getPayload } from 'payload'
import config from '@payload-config'
import { generalSettingsData } from '../endpoints/seed/general-settings'

async function seedSettings() {
  const payload = await getPayload({ config })

  payload.logger.info('— Seeding General Settings (Toko & Kontak)...')

  await payload.updateGlobal({
    slug: 'general-settings',
    data: generalSettingsData,
  })

  payload.logger.info('✅ General Settings berhasil di-seed!')
  process.exit(0)
}

seedSettings().catch((err) => {
  console.error('❌ Gagal seeding General Settings:', err)
  process.exit(1)
})

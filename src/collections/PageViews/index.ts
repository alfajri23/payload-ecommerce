import type { CollectionConfig } from 'payload'
import { adminOnly } from '@/access/adminOnly'
import { checkRole } from '@/access/utilities'

export const PageViews: CollectionConfig = {
  slug: 'page-views',
  labels: {
    singular: 'Page View',
    plural: 'Page Views',
  },
  admin: {
    group: 'Analytics',
    useAsTitle: 'path',
    defaultColumns: ['path', 'referrer', 'device', 'createdAt'],
    description: 'Catatan analitik kunjungan website (First-Party).',
  },
  access: {
    create: () => true,
    read: ({ req: { user } }) => checkRole(['admin', 'viewer'], user),
    update: () => false,
    delete: adminOnly,
  },
  fields: [
    {
      name: 'path',
      type: 'text',
      required: true,
      label: 'Landing Path',
      admin: {
        description: 'Halaman tempat pengunjung pertama kali mendarat',
      },
    },
    {
      name: 'referrer',
      type: 'text',
      label: 'Referrer / Ref Parameter',
      admin: {
        description: 'Sumber asal (dari ?ref=, ?utm_source=, atau hostname browser)',
      },
    },
    {
      name: 'device',
      type: 'select',
      label: 'Perangkat',
      options: [
        { label: 'Mobile (HP)', value: 'mobile' },
        { label: 'Tablet', value: 'tablet' },
        { label: 'Desktop (Laptop/PC)', value: 'desktop' },
      ],
      defaultValue: 'desktop',
      required: true,
    },
    {
      name: 'sessionId',
      type: 'text',
      required: true,
      label: 'Session ID',
      admin: {
        description: 'ID sesi unik anonim pengunjung',
      },
    },
  ],
  timestamps: true,
}

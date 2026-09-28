import type { GlobalConfig } from 'payload'

import { link } from '@/fields/link'
import { revalidateHeader } from '@/hooks/revalidateHeader'

export const Header: GlobalConfig = {
  slug: 'header',
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'navItems',
      type: 'array',
      fields: [
        link({
          appearances: false,
        }),
        {
          name: 'hasDropdown',
          label: 'hasDropdown',
          type: 'checkbox',
          defaultValue: false,
        },

        // 3. SUBMENU / ANAK (Hanya muncul jika hasDropdown dicentang)
        {
          name: 'subMenu',
          label: 'Daftar Submenu',
          type: 'array',
          admin: {
            condition: (_, siblingData) => Boolean(siblingData?.hasDropdown),
            initCollapsed: true,
          },
          fields: [
            // Memakai helper link() yang sama persis untuk anak-anaknya!
            link({
              appearances: false,
            }),
          ],
        },
      ],
      maxRows: 6,
    },
  ],
  hooks: {
    afterChange: [revalidateHeader],
  },
}

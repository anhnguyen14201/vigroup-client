'use client'

import { ROUTES } from '@/constants'
import { useTranslations } from 'next-intl'
import { useMemo } from 'react'

export const useNavigationLinks = () => {
  const t = useTranslations('navigation')

  const navigationLinks = useMemo(
    () => [
      {
        id: 1,
        type: 'SINGLE',
        label: t('home'),
        path: ROUTES.HOME,
      },
      {
        id: 2,
        type: 'SINGLE',
        label: t('shop'),
        path: ROUTES.SHOP,
      },
      {
        id: 3,
        type: 'SINGLE',
        label: t('about'),
        path: ROUTES.ABOUT,
      },
      {
        id: 4,
        type: 'PARENT',
        label: t('services'),
        submenu: [
          {
            label: t('consultancy'),
            path: ROUTES.CONSULTANCY,
          },
          {
            label: t('smarthome'),
            path: ROUTES.SMARTHOME,
          },
          {
            label: t('heatpump'),
            path: ROUTES.AIR_CONDITIONER_HEAT_PUMP,
          },
        ],
      },
      {
        id: 5,
        type: 'SINGLE',
        label: t('template'),
        path: ROUTES.TEMPLATE,
      },
      {
        id: 6,
        type: 'SINGLE',
        label: t('projects'),
        path: ROUTES.PROJECT,
      },
      {
        id: 7,
        type: 'SINGLE',
        label: t('contact'),
        path: ROUTES.CONTACT,
      },
    ],
    [t],
  )

  return { navigationLinks }
}

export default useNavigationLinks

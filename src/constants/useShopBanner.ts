import moneyIconFree18 from '@/assets/images/money-icon-free-18.23bda3ad8ee815c69896.webp'
import businessTeamIcon from '@/assets/images/business-team-icon.9f036b44bdfc50d6d561.webp'
import imageFeature from '@/assets/images/images.8bdca03fd947f1d464da.webp'
import { useTranslations } from 'next-intl'

export const useShopBanner = () => {
  const t = useTranslations('shopBanner')

  return {
    shopBanner: [
      {
        value: t('warrantyTitle'),
        image: imageFeature,
        description: t('warrantyDesc'),
      },

      {
        value: t('payTitle'),
        image: moneyIconFree18,
        description: t('payDesc'),
      },

      {
        value: t('professiionTitle'),
        image: businessTeamIcon,
        description: t('professiionDesc'),
      },
    ],
  }
}

export default useShopBanner

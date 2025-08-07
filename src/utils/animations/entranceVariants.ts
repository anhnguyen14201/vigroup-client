import type { Variants } from 'framer-motion'

export const entranceVariants: Record<
  'heading' | 'paragraph' | 'button',
  Variants
> = {
  heading: {
    active: {
      opacity: 1,
      y: 0,
      transition: { type: 'spring', stiffness: 80, damping: 15, delay: 0.3 },
    },
    inactive: {
      opacity: 0,
      y: 50,
      transition: { type: 'spring', stiffness: 80, damping: 15 },
    },
  },
  paragraph: {
    active: {
      opacity: 1,
      y: 0,
      transition: { type: 'spring', stiffness: 80, damping: 15, delay: 0.5 },
    },
    inactive: {
      opacity: 0,
      y: 30,
      transition: { type: 'spring', stiffness: 80, damping: 15 },
    },
  },
  button: {
    active: {
      opacity: 1,
      y: 0,
      transition: { type: 'spring', stiffness: 80, damping: 15, delay: 0.7 },
    },
    inactive: {
      opacity: 0,
      y: 20,
      transition: { type: 'spring', stiffness: 80, damping: 15 },
    },
  },
}

export default entranceVariants

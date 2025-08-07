// authSchemas.ts
import Joi from 'joi'

export function createSignInSchema(
  t: (key: string, values?: Record<string, any>) => string,
) {
  return Joi.object({
    username: Joi.string()
      .custom((value, helpers) => {
        const isEmail = /\S+@\S+\.\S+/.test(value)
        const isPhone = /^[0-9]{9,}$/.test(value)
        if (isEmail || isPhone) return value
        return helpers.message({ custom: t('errors.username.invalid') })
      })
      .required()
      .messages({
        'string.empty': t('errors.username.empty'),
        'any.required': t('errors.username.required'),
      }),

    password: Joi.string()
      .min(8)
      .max(30)
      .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,30}$/)
      .required()
      .messages({
        'string.empty': t('errors.password.empty'),
        'any.required': t('errors.password.required'),
        'string.min': t('errors.password.min', { limit: 8 }),
        'string.max': t('errors.password.max', { limit: 30 }),
        'string.pattern.base': t('errors.password.pattern'),
      }),
  })
}

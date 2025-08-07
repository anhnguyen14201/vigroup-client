import Joi from 'joi'

export function createForgotPasswordSchema(
  t: (key: string, values?: Record<string, any>) => string,
) {
  return Joi.object({
    email: Joi.string()
      .email({ tlds: { allow: false } })
      .required()
      .messages({
        'string.empty': t('errors.email.empty'),
        'string.email': t('errors.email.invalid'),
        'any.required': t('errors.email.required'),
      }),
  })
}

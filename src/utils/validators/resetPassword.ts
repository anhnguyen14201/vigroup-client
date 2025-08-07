import Joi from 'joi'

export function createResetPasswordSchema(
  t: (key: string, values?: Record<string, any>) => string,
) {
  return Joi.object({
    password: Joi.string()
      .min(8)
      .max(15)
      .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,15}$/)
      .required()
      .messages({
        'string.empty': t('errors.password.empty'),
        'any.required': t('errors.password.required'),
        'string.min': t('errors.password.min', { limit: 8 }),
        'string.pattern.base': t('errors.password.pattern'),
      }),
    confirmPassword: Joi.any()
      .valid(Joi.ref('password'))
      .required()
      .messages({
        'any.only': t('errors.confirmPassword.only'),
        'any.required': t('errors.confirmPassword.required'),
      }),
  })
}

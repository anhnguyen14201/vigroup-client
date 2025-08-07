// src/utils/jwt.ts
import { IJwtPayload } from '@/interface'
import { jwtVerify } from 'jose'

/**
 * Giải mã và xác thực JWT, trả về payload {_id, role, iat, exp} hoặc null nếu không hợp lệ.
 */
export async function decodeJwtPayload(
  token: string,
): Promise<IJwtPayload | null> {
  try {
    const secretEnv = process.env.JWT_SECRET
    if (!secretEnv) throw new Error('JWT_SECRET is not defined')

    const secret = new TextEncoder().encode(secretEnv)
    const { payload } = await jwtVerify(token, secret)

    const data = payload as Partial<IJwtPayload>
    if (
      typeof data._id === 'string' &&
      (typeof data.role === 'number' || typeof data.role === 'string') &&
      typeof data.iat === 'number' &&
      typeof data.exp === 'number'
    ) {
      const roleNum =
        typeof data.role === 'number' ? data.role : parseInt(data.role, 10) || 0

      return {
        _id: data._id,
        role: roleNum,
        iat: data.iat,
        exp: data.exp,
      }
    }

    return null
  } catch {
    return null
  }
}

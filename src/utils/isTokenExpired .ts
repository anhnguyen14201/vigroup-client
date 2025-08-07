/* import jwtDecode from 'jwt-decode'

interface JwtPayload {
  exp: number
  [key: string]: any
}

export function isTokenExpired(token: string): boolean {
  if (!token) return true
  try {
    const decoded = jwtDecode<JwtPayload>(token)
    const currentTime = Date.now() / 1000 // Thời gian hiện tại tính bằng giây
    return decoded.exp < currentTime
  } catch {
    return true // Nếu không thể giải mã, coi như token đã hết hạn
  }
}
 */

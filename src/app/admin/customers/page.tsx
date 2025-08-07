// Dynamically import the client-side component
import dynamic from 'next/dynamic'
const UserClient = dynamic(
  () => import('@/components/common/Customers/userClient'),
)
// Next.js metadata export (supported in server components)
export const metadata = {
  title: 'Quản lý người dùng',
}

const UserPage = () => {
  return <UserClient />
}

export default UserPage

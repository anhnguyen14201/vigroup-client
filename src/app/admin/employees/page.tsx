// Dynamically import the client-side component
import dynamic from 'next/dynamic'
const EmployeeClient = dynamic(
  () => import('@/components/common/Employees/employeeClient'),
)
// Next.js metadata export (supported in server components)
export const metadata = {
  title: 'Quản lý nhân viên',
}

const UserPage = () => {
  return <EmployeeClient />
}

export default UserPage

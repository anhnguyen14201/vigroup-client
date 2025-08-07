'use client'

import React, { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'

import {
  AdditionalCostCard,
  CustomerInfoCard,
  PaymentStatusCard,
  ProjectActionBar,
  ProjectInfoCard,
  ProjectTimelineCard,
} from '@/components'
import { IQuotation } from '@/interface'
import { useAttendanceByProjectAndEmployees, useProjectById } from '@/hooks'
import { UserIcon } from 'lucide-react'
import {
  formatCurrency,
  formatDateCZ,
  formatPhone,
  formatTimeCZ,
} from '@/utils'

const ProjectDetailPage: React.FC = () => {
  const { id } = useParams()

  const projectId = typeof id === 'string' ? id : Array.isArray(id) ? id[0] : ''
  const { data: projectData, mutate } = useProjectById(projectId)

  const { code, location, status, quotes } = projectData || {}
  // Tìm thông tin dự án tiếng Việt nếu có
  const translations = projectData?.translations
  const vietnameseProject =
    Array.isArray(translations) &&
    translations.find(
      t =>
        typeof t?.language === 'object' &&
        t?.language !== null &&
        'code' in t.language &&
        (t.language as { code?: string }).code === 'vi',
    )
  const projectNameVI =
    vietnameseProject && typeof vietnameseProject === 'object'
      ? vietnameseProject.projectName || ''
      : ''

  const [selectedQuotation, setSelectedQuotation] = useState<IQuotation | null>(
    null,
  )
  const [selectedVariation, setSelectedVariation] = useState<IQuotation | null>(
    null,
  )

  const [selectedDeposited, setSelectedDeposited] = useState<IQuotation | null>(
    null,
  )
  const [selectedPayment, setSelectedPayment] = useState<IQuotation | null>(
    null,
  )

  const [isModalOpen, setModalOpen] = useState(false)
  const [modalType, setModalType] = useState<
    'customer' | 'quotation' | 'variation' | 'deposited' | 'payment'
  >('customer')
  // Lọc mảng cho báo giá kiểu 'quotation'
  const quotations = quotes?.filter(item => item.quotationType === 'quotation')

  // Lọc mảng cho báo giá kiểu 'variation'
  const variations = quotes?.filter(item => item.quotationType === 'variation')

  const openModal = (
    type: 'customer' | 'quotation' | 'variation' | 'deposited' | 'payment',
    payload?: IQuotation,
  ) => {
    switch (type) {
      case 'quotation':
        setSelectedQuotation((payload as IQuotation) || null)
        break
      case 'variation':
        setSelectedVariation((payload as IQuotation) || null)
        break
      case 'deposited':
        setSelectedDeposited((payload as IQuotation) || null)
        break
      case 'payment':
        setSelectedPayment((payload as IQuotation) || null)
        break
      default:
        break
    }
    setModalType(type)
    setModalOpen(true)
  }

  // Sử dụng hàm chung openModal cho các trường hợp xử lý sau:
  const handleAdditionalCost = () => openModal('variation')
  const handleEditVariation = (quote: IQuotation) =>
    openModal('variation', quote)
  const handleAddQuotation = () => openModal('quotation')
  const handleEditQuotation = (quote: IQuotation) =>
    openModal('quotation', quote)
  const handleAddCustomer = () => openModal('customer')
  const handleAddPayment = () => openModal('payment')
  const handleAddDeposit = () => openModal('deposited')

  useEffect(() => {
    if (projectNameVI) {
      const capitalizedTitle =
        projectNameVI.charAt(0).toUpperCase() + projectNameVI.slice(1)
      document.title = capitalizedTitle
    }
  }, [projectNameVI])

  const raw = projectData?.employees

  const employeeIds: string[] = Array.isArray(raw)
    ? raw.map(emp =>
        typeof emp === 'string'
          ? emp
          : typeof emp._id === 'string'
          ? emp._id
          : emp._id.toString(),
      )
    : []
  const { attendanceByEmployee } = useAttendanceByProjectAndEmployees(
    projectId,
    employeeIds,
  )

  const getAttendanceSummary = (project: any, attendanceByEmployee: any) => {
    const summaries: any[] = []

    for (const emp of project?.employees ?? []) {
      const empId = String(emp._id)
      const records = attendanceByEmployee[empId] ?? []

      if (records.length === 0) {
        summaries.push({
          employeeId: empId,
          fullName: emp.fullName,
          email: emp.email,
          phone: emp.phone,
          role: emp.role,
          hourlyRate: emp.hourlyRate || 0,
          totalHours: 0,
          totalDays: 0,
          averageHoursPerDay: 0,
          shiftCount: 0,
          salaryEarned: 0,
          attendanceRecords: [],
        })
        continue
      }

      let sumHours = 0
      let sumSalary = 0
      let shiftCount = 0

      for (const rec of records) {
        sumHours += rec.totalHours ?? 0
        sumSalary += rec.salary ?? 0
        for (const sh of rec.shifts) {
          if (sh.totalShiftHours > 0) {
            shiftCount++
          }
        }
      }

      const days = records.length
      const avgHours = days > 0 ? sumHours / days : 0

      summaries.push({
        employeeId: empId,
        fullName: emp.fullName,
        email: emp.email,
        phone: emp.phone,
        role: emp.role,
        hourlyRate: emp.hourlyRate || 0,
        totalHours: Number(sumHours.toFixed(2)),
        totalDays: days,
        averageHoursPerDay: Number(avgHours.toFixed(2)),
        shiftCount,
        salaryEarned: Number(sumSalary.toFixed(2)),
        attendanceRecords: records,
      })
    }

    // Nếu muốn: bạn có thể sắp xếp theo totalHours giảm dần
    summaries.sort((a, b) => b.totalHours - a.totalHours)

    return summaries
  }

  const summaries = getAttendanceSummary(projectData, attendanceByEmployee)

  const LaborInfo = ({ employee }: any) => {
    const sortedRecords = [...employee.attendanceRecords].sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
    )

    return (
      <div className='w-full bg-white border border-gray-200 rounded-lg p-5 space-y-1'>
        {/* 🔹 Header – Tên + Icon */}
        <div className='flex items-center space-x-2'>
          <UserIcon className='h-6 w-6 text-blue-500' />
          <h3 className='text-xl font-semibold text-gray-800'>
            {employee.fullName}
          </h3>
        </div>

        <div className='flex flex-wrap gap-4 text-sm text-gray-600'>
          {[
            ['Email', employee.email],
            ['SĐT', formatPhone(employee.phone)],
            ['Tổng giờ', `${employee.totalHours.toFixed(2)} giờ`],
            ['Tổng ngày', employee.totalDays],
            ['Tổng ca', employee.shiftCount],
            ['Lương', `${formatCurrency(employee.salaryEarned, 203)} `],
          ].map(([label, value]) => (
            <div
              key={label}
              className='bg-white rounded-lg px-4 py-2 flex items-center space-x-2'
            >
              <span className='font-medium text-gray-500'>{label}:</span>
              <span
                className={`${
                  label === 'Lương'
                    ? 'font-semibold text-green-600'
                    : 'text-gray-900'
                }`}
              >
                {value}
              </span>
            </div>
          ))}
        </div>

        <details className=''>
          <summary className='cursor-pointer text-blue-600 underline'>
            Xem chi tiết chấm công
          </summary>
          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-4'>
            {sortedRecords.map((rec: any) => (
              <div key={rec._id} className='bg-white border rounded-lg p-4'>
                <div className='mb-2 text-sm text-gray-700 dark:text-gray-200'>
                  <p>
                    <strong>Ngày:</strong> {formatDateCZ(rec.date)}
                  </p>
                  <p>
                    <strong>Tổng giờ:</strong> {rec.totalHours.toFixed(2)} giờ —{' '}
                    {formatCurrency(rec.salary, 203)}
                  </p>
                </div>

                <ul className='list-decimal list-inside space-y-1 text-sm text-gray-800 dark:text-white'>
                  {rec.shifts.map((s: any) => {
                    const shiftNumberMatch = s.shift?.match(/(\d+)$/)
                    const shiftLabel = shiftNumberMatch
                      ? `Ca ${shiftNumberMatch[1]}`
                      : `Ca ${s.shift}`

                    return (
                      <li key={s._id}>
                        <strong>{shiftLabel}:</strong> từ&nbsp;
                        <code className='bg-gray-100 dark:bg-gray-700 px-1 rounded'>
                          {formatTimeCZ(s.checkIn)}
                        </code>{' '}
                        đến&nbsp;
                        <code className='bg-gray-100 dark:bg-gray-700 px-1 rounded'>
                          {s.checkOut
                            ? formatTimeCZ(s.checkOut)
                            : '– chưa kết thúc –'}
                        </code>{' '}
                        ({s.totalShiftHours.toFixed(2)} giờ)
                        {s.notes && (
                          <div className='mt-1 text-gray-600 italic dark:text-gray-400'>
                            <strong>Ghi chú:</strong> {s.notes}
                          </div>
                        )}
                      </li>
                    )
                  })}
                </ul>
              </div>
            ))}
          </div>
        </details>
      </div>
    )
  }
  return (
    <div className='w-full p-6 bg-gray-100 min-h-screen'>
      {/* Header: Thanh điều khiển */}
      <ProjectActionBar
        handleAddDeposit={handleAddDeposit}
        handleAddPayment={handleAddPayment}
        projectId={projectId}
      />

      {/* Nội dung chính */}
      <div className='space-y-4 '>
        {/* Top Section */}
        <div className='top-section flex flex-wrap gap-4'>
          {/* Left Side */}
          <div className='left-side flex-1 space-y-4'>
            {/* Upper Row: Dự án & Khách hàng */}
            <div className='upper-row flex flex-col md:flex-row gap-4'>
              <div className='flex flex-col flex-1 gap-4'>
                <ProjectInfoCard
                  code={code}
                  location={location}
                  status={status}
                  projectNameVI={projectNameVI}
                />
                <PaymentStatusCard
                  projectId={projectId}
                  isModalOpen={isModalOpen}
                  setModalOpen={setModalOpen}
                  modalType={modalType}
                  selectedDeposited={selectedDeposited}
                  setSelectedDeposited={setSelectedDeposited}
                  selectedPayment={selectedPayment}
                  setSelectedPayment={setSelectedPayment}
                />
              </div>
              <CustomerInfoCard
                handleAddCustomer={handleAddCustomer}
                isModalOpen={isModalOpen}
                setModalOpen={setModalOpen}
                modalType={modalType}
                customerType='customer'
                projectId={projectId}
              />
            </div>
            {/* Lower Row: Báo giá & Chi phí phát sinh */}
            <div className='lower-row space-y-4'>
              {/* <QuotationCard /> */}
              <AdditionalCostCard
                id={projectId}
                quotationType='quotation'
                selectedQuotation={selectedQuotation}
                setSelectedQuotation={setSelectedQuotation}
                quotes={quotations ?? []}
                isModalOpen={isModalOpen}
                setModalOpen={setModalOpen}
                modalType={modalType}
                handleEditQuotation={handleEditQuotation}
                handleAddQuotation={handleAddQuotation}
                editQuotation='Sửa thông tin báo giá'
                createQuotation='Thêm báo giá'
                labelQuotation='Báo giá'
              />
              <AdditionalCostCard
                id={projectId}
                quotationType='variation'
                selectedQuotation={selectedVariation}
                setSelectedQuotation={setSelectedVariation}
                quotes={variations ?? []}
                isModalOpen={isModalOpen}
                setModalOpen={setModalOpen}
                modalType={modalType}
                handleEditQuotation={handleEditVariation}
                handleAddQuotation={handleAdditionalCost}
                editQuotation='Sửa thông tin phát sinh'
                createQuotation='Thêm phát sinh'
                labelQuotation='Chi phí phát sinh thêm'
              />
            </div>
          </div>
        </div>
        {/* Bottom Section: Tiến độ dự án */}
        <ProjectTimelineCard projectData={projectData} mutate={mutate} />

        <div className='project-info relative flex-1 p-6 border rounded-lg bg-white'>
          <div className='flex justify-between items-center mb-4'>
            <h2 className='text-xl font-bold'>Nhân công</h2>
          </div>
          <div className='w-full gap-4 mt-6'>
            {summaries.map(emp => (
              <LaborInfo key={emp.employeeId} employee={emp} />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProjectDetailPage

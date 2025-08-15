'use client'

import React, { useEffect, useMemo, useState } from 'react'
import {
  useForm,
  Controller,
  FieldValues,
  SubmitHandler,
  Path,
  DefaultValues,
} from 'react-hook-form'
import { Button, Input, Label, Switch, Textarea } from '@/components/ui'
import { ChevronDown, Eye, EyeClosed, X } from 'lucide-react'
import Image from 'next/image'
import { GenericFormProps } from '@/interface'
import TextEditor from '@/components/common/Editor/TextEditor'
import PhoneInput from 'react-phone-input-2'
import Select from 'react-select'
import countryList from 'react-select-country-list'
import 'react-phone-input-2/lib/style.css'
type FileOrPlaceholder = File | null

export function GenericForm<T extends FieldValues>(props: GenericFormProps<T>) {
  const {
    initialData,
    title,
    fields,
    languages,
    currentLang,
    onLangChange,
    onSubmitApi,
    onSuccess,
    preview,
    onPreviewChange,
  } = props

  const {
    control,
    register,
    handleSubmit,
    reset,
    setValue,
    getValues,
    formState: { errors, isSubmitting },
  } = useForm<T>({
    mode: 'onChange',
    defaultValues: (initialData as DefaultValues<T>) || {},
  })

  // fileMap: chứa File hoặc null (placeholder)
  const [fileMap, setFileMap] = useState<Record<string, FileOrPlaceholder[]>>(
    {},
  )
  // previewMap: chứa URL string (từ server hoặc URL.createObjectURL)
  const [previewMap, setPreviewMap] = useState<Record<string, string[]>>({})
  const [removedImages, setRemovedImages] = useState<string[]>([])
  const countryOptions = useMemo(() => countryList().getData(), [])

  // Khi props.preview (initialData) thay đổi, khởi tạo hai map đồng bộ
  useEffect(() => {
    if (!preview || Array.isArray(preview)) return

    const incoming = preview as Record<string, string[]>
    setPreviewMap(incoming)

    // Đưa null làm placeholder cho mỗi ảnh initial
    const placeholderMap: Record<string, FileOrPlaceholder[]> = {}
    Object.entries(incoming).forEach(([key, urls]) => {
      placeholderMap[key] = urls.map(() => null)
    })
    setFileMap(placeholderMap)
    setRemovedImages([])
  }, [preview])

  const onFilesChange =
    (name: Path<T>, multiple?: boolean) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const sel = e.target.files
      if (!sel) return
      const newFiles = Array.from(sel)
      const newPreviews = newFiles.map(f => URL.createObjectURL(f))

      // Lấy giá trị từ fileMap và previewMap trước khi lọc uniqueFiles
      const key = name as string
      const prevFiles = fileMap[key] || []
      const prevPreviews = previewMap[key] || []

      // Lọc những file hợp lệ
      const validFiles = newFiles.filter(
        f =>
          ['image/jpeg', 'image/png', 'image/webp'].includes(f.type) &&
          f.size <= 5 * 1024 * 1024,
      )
      if (!validFiles.length) {
        alert('Ảnh phải có định dạng là jpeg/png và có kích thước ≤5MB.')
        return
      }

      // Lọc các file mới không trùng với prevFiles
      const uniqueFiles = newFiles.filter(
        f =>
          !prevFiles.some(
            pf =>
              pf &&
              pf.name === f.name &&
              pf.size === f.size &&
              pf.lastModified === f.lastModified,
          ),
      )
      if (!uniqueFiles.length) {
        alert('Ảnh này đã được chọn rồi.')
        return
      }

      if (multiple) {
        // Thêm File mới vào cuối danh sách
        const combinedFiles = [...prevFiles, ...validFiles]
        const combinedPreviews = [...prevPreviews, ...newPreviews]
        setFileMap(m => ({ ...m, [key]: combinedFiles }))
        setPreviewMap(m => ({ ...m, [key]: combinedPreviews }))
        setValue(name, combinedFiles.filter(f => f !== null) as any, {
          shouldValidate: true,
        })
        onPreviewChange?.(combinedPreviews)
      } else {
        // Trong trường hợp single: thu hồi hết URL cũ rồi ghi đè
        prevPreviews.forEach(URL.revokeObjectURL)
        setFileMap(m => ({ ...m, [key]: [validFiles[0]] }))
        setPreviewMap(m => ({ ...m, [key]: [newPreviews[0]] }))
        setValue(name, validFiles[0] as any, { shouldValidate: true })
        onPreviewChange?.([newPreviews[0]])
      }
    }

  const removeFile = (idx: number, name: Path<T>, multiple?: boolean) => {
    const key = name as string
    const prevFiles = fileMap[key] || []
    const prevPreviews = previewMap[key] || []
    const url = prevPreviews[idx]

    setRemovedImages(r => [...r, url])

    // filter đồng bộ cả hai mảng
    const newFiles = prevFiles.filter((_, i) => i !== idx)
    const newPreviews = prevPreviews.filter((_, i) => i !== idx)

    // chỉ revoke URL.createObjectURL (tức khi fileMap[idx] !== null)
    if (prevFiles[idx] instanceof File) {
      URL.revokeObjectURL(prevPreviews[idx])
    }

    setFileMap(m => ({ ...m, [key]: newFiles }))
    setPreviewMap(m => ({ ...m, [key]: newPreviews }))

    // cập nhật value form với mảng File thực tế
    const filesToSet = multiple
      ? newFiles.filter((f): f is File => f instanceof File)
      : newFiles[0] || null

    setValue(name, filesToSet as any, { shouldValidate: true })
    onPreviewChange?.(newPreviews)
  }

  const onSubmit: SubmitHandler<T> = async values => {
    // Khởi tạo payload với các giá trị từ form
    const payload: any = { ...values }

    // Chỉ thêm removedImageUrls nếu removedImages có giá trị (và là array không rỗng)
    if (
      removedImages &&
      Array.isArray(removedImages) &&
      removedImages.length > 0
    ) {
      payload.removedImageUrls = removedImages
    }

    await onSubmitApi(payload)
    if (onSuccess) onSuccess()
  }

  // reset khi initialData thay đổi
  useEffect(() => {
    if (initialData) {
      reset(initialData)
      setRemovedImages([])
    } else {
      // clear
      reset(
        fields.reduce((acc, f) => {
          acc[f.name as string] = f.defaultValue ?? ''
          return acc
        }, {} as any) as DefaultValues<T>,
      )
      // revoke old URLs
      setPreviewMap({})
      setFileMap({})
      setRemovedImages([])
    }
  }, [initialData, fields, reset])

  // cleanup on unmount
  useEffect(
    () => () => {
      Object.values(previewMap).flat().forEach(URL.revokeObjectURL)
    },
    [previewMap],
  )

  // render preview giống cũ, chỉ khác removeFile
  const renderFilePreview = (name: string, multiple?: boolean) => {
    const previews = previewMap[name] || []
    if (!previews.length) return null
    const cols = 'grid-cols-3'
    return (
      <div className={`grid gap-4 ${cols} mt-2`}>
        {previews.map((url, i) => (
          <div key={url} className='relative'>
            <Image
              src={url}
              priority
              alt={`preview-${i}`}
              width={200} // chiều rộng mong muốn (px)
              height={200} // chiều cao mong muốn (px)
              className='w-full h-24 object-contain rounded bg-gray-100'
            />
            <button
              type='button'
              onClick={() => removeFile(i, name as Path<T>, multiple)}
              className='absolute top-1 right-1 bg-white rounded-full p-1 hover:bg-red-100 
                          cursor-pointer transition duration-300'
            >
              <X size={16} className='text-red-500' />
            </button>
          </div>
        ))}
      </div>
    )
  }

  const [showPwd, setShowPwd] = useState(false)
  const [showConfirmPwd, setShowConfirmPwd] = useState(false)

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className='grid grid-cols-1 md:grid-cols-2 gap-6 p-6 auto-rows-min bg-white rounded-xl'
    >
      {title && (
        <div className='col-span-full'>
          <h2 className='text-2xl font-semibold'>{title}</h2>
        </div>
      )}

      {languages && onLangChange && currentLang && (
        <div className='col-span-full flex justify-center space-x-3'>
          {languages.map(lang => (
            <button
              key={lang.code}
              type='button'
              onClick={() => onLangChange(lang.code)}
              className={`p-0.5 border rounded-full cursor-pointer transition duration-300 ${
                currentLang === lang.code
                  ? 'border-red-600 opacity-100'
                  : 'opacity-50 hover:border-red-600'
              }`}
            >
              <Image
                src={lang.iconUrl}
                alt={lang.name}
                width={24}
                priority
                height={24}
                className='rounded-full'
                loading='eager'
              />
            </button>
          ))}
        </div>
      )}

      {fields.map(f => {
        const name = f.name as string
        const parts = name.split('_')
        if (parts.length === 2 && currentLang && parts[1] !== currentLang)
          return null
        const fieldName = f.name as Path<T>

        const rules: Record<string, any> = {}
        if (f.required) rules.required = f.requiredMessage || 'Bắt buộc'
        if ((f as any).pattern)
          rules.pattern = {
            value: (f as any).pattern!,
            message: (f as any).patternMessage || 'Sai định dạng',
          }

        if (fieldName === ('confirmPassword' as unknown as Path<T>)) {
          rules.validate = (value: any) =>
            value === getValues('password' as Path<T>) ||
            'Xác nhận mật khẩu không khớp.'
        }

        if (f.type === 'textarea') {
          return (
            <div key={name} className='flex flex-col gap-2'>
              {f.label && <Label htmlFor={name}>{f.label}</Label>}
              <Textarea
                id={name}
                {...register(name as any, rules)}
                placeholder={f.placeholder}
                disabled={isSubmitting}
                className='border rounded-md p-2 focus:ring-0.5 focus:ring-red-300 transition duration-300'
              />
              {errors[name] && (
                <p className='text-red-500 text-sm mt-1'>
                  {errors[name]?.message as string}
                </p>
              )}
            </div>
          )
        }

        if (f.type === 'select') {
          return (
            <div key={name} className='flex flex-col gap-2'>
              {f.label && <Label htmlFor={name}>{f.label}</Label>}
              <Controller
                name={name as any}
                control={control}
                rules={rules}
                render={({ field }) => (
                  <div className='relative'>
                    <select
                      {...field}
                      disabled={isSubmitting}
                      className='w-full border rounded-md py-2.5 pl-3 px-10 
                                focus:outline-none focus:ring-0.5 focus:ring-red-500 
                              focus:border-red-500 appearance-none transition duration-300'
                    >
                      <option value='' disabled>
                        {f.placeholder || 'Chọn'}
                      </option>
                      {f.options?.map(opt => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                    <ChevronDown
                      className='absolute top-1/2 right-3 -translate-y-1/2 text-gray-400'
                      size={20}
                    />
                  </div>
                )}
              />
              {errors[name] && (
                <p className='text-red-500 text-sm mt-1 gap-2'>
                  {errors[name]?.message as string}
                </p>
              )}
            </div>
          )
        }

        if (f.type === 'switch') {
          return (
            <div key={name} className='flex items-center space-x-2'>
              {f.label && <Label htmlFor={name}>{f.label}</Label>}
              <Controller
                name={name as any}
                control={control}
                render={({ field }) => (
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                )}
              />
            </div>
          )
        }

        if (f.type === 'file') {
          return (
            <div key={name} className='flex flex-col gap-2'>
              {f.label && <Label>{f.label}</Label>}
              <Input
                id={name}
                type='file'
                accept={f.accept}
                multiple={!!f.multiple}
                {...register(name as any, rules)}
                onChange={onFilesChange(name as Path<T>, f.multiple)}
                disabled={isSubmitting}
                className='hidden'
              />

              <label
                htmlFor={name}
                className='cursor-pointer border-2 border-dashed rounded-md p-4 
                          text-center hover:border-red-400 transition duration-300'
              >
                {f.multiple ? 'Chọn nhiều ảnh' : 'Chọn ảnh'}
              </label>
              {renderFilePreview(name, f.multiple)}
            </div>
          )
        }

        if (f.type === 'editor') {
          return (
            <div key={name} className='flex flex-col gap-2'>
              {f.label && <Label htmlFor={name}>{f.label}</Label>}
              <Controller
                name={name as any}
                control={control}
                rules={rules}
                defaultValue={initialData ? (initialData as any)[name] : ''}
                render={({ field }) => (
                  <TextEditor
                    value={field.value}
                    onChange={field.onChange}
                    placeholder={f.placeholder}
                  />
                )}
              />
              {errors[name] && (
                <p className='text-red-500 text-sm mt-1'>
                  {errors[name]?.message as string}
                </p>
              )}
            </div>
          )
        }

        if (f.type === 'country') {
          return (
            <div key={name} className='flex flex-col gap-2'>
              {f.label && <Label htmlFor={name}>{f.label}</Label>}
              <Controller
                name={name as any}
                control={control}
                rules={rules}
                render={({ field }) => {
                  const selected = countryOptions.find(
                    opt => opt.value === (field.value as string),
                  )
                  return (
                    <Select
                      options={countryOptions}
                      getOptionLabel={(opt: any) => opt.label}
                      getOptionValue={(opt: any) => opt.value}
                      placeholder={f.placeholder || 'Chọn quốc gia'}
                      isClearable={!f.required}
                      value={selected}
                      onChange={(opt: any) => field.onChange(opt?.value)}
                      styles={{
                        control: (base: any, state: any) => ({
                          ...base,
                          borderRadius: '0.5rem',
                          padding: '0.3rem 0',
                          width: '100%',
                          borderColor: state.isFocused
                            ? 'red'
                            : base.borderColor,
                          boxShadow: state.isFocused
                            ? '0 0 0 0.3px red'
                            : base.boxShadow,
                          '&:hover': {
                            borderColor: state.isFocused
                              ? 'red'
                              : base.borderColor,
                          },
                        }),
                        menu: (base: any) => ({
                          ...base,
                          borderRadius: '0.5rem',
                        }),
                      }}
                    />
                  )
                }}
              />
              {errors[name] && (
                <p className='text-red-500 text-sm mt-1'>
                  {errors[name]?.message as string}
                </p>
              )}
            </div>
          )
        }

        if (f.type === 'phone') {
          return (
            <div key={name} className='flex flex-col gap-2'>
              {f.label && <Label htmlFor={name}>{f.label}</Label>}
              <Controller
                name={name as any}
                control={control}
                rules={rules}
                render={({ field }) => (
                  <PhoneInput
                    country={
                      control._formValues['country']?.toLowerCase() || 'cz'
                    }
                    value={field.value || ''}
                    onChange={value => field.onChange(value)}
                    containerClass='w-full'
                    inputClass='w-full border border-gray-300 rounded-lg px-3 py-[22px] focus:ring-1 focus:ring-red-500'
                    buttonClass='border border-gray-300 rounded-lg'
                    dropdownClass='rounded-lg'
                  />
                )}
              />
              {errors[name] && (
                <p className='text-red-500 text-sm mt-1'>
                  {errors[name]?.message as string}
                </p>
              )}
            </div>
          )
        }

        const isPass = f.type === 'password'
        const visible = name === 'confirmPassword' ? showConfirmPwd : showPwd
        return (
          <div key={name} className='flex flex-col gap-2'>
            {f.label && <Label htmlFor={name}>{f.label}</Label>}
            <div className='relative'>
              <Input
                id={name}
                type={
                  isPass ? (visible ? 'text' : 'password') : (f.type as any)
                }
                placeholder={f.placeholder}
                disabled={isSubmitting}
                {...register(name as any, rules)}
                className='border rounded-md p-2 focus:ring-0.5 focus:ring-red-300 w-full transition duration-300'
              />
              {isPass && (
                <button
                  type='button'
                  onClick={() =>
                    name === 'confirmPassword'
                      ? setShowConfirmPwd(v => !v)
                      : setShowPwd(v => !v)
                  }
                  className='absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer text-gray-400'
                >
                  {visible ? <Eye /> : <EyeClosed />}
                </button>
              )}
            </div>
            {errors[name] && (
              <p className='text-red-500 text-sm mt-1'>
                {errors[name]?.message as string}
              </p>
            )}
          </div>
        )
      })}

      <div className='col-span-full flex justify-center space-x-3 mt-3'>
        <Button
          type='submit'
          disabled={isSubmitting}
          className='w-xl border border-blue-600 bg-blue-100 text-blue-700 hover:bg-blue-300 '
        >
          {isSubmitting ? 'Đang lưu...' : 'Lưu'}
        </Button>
      </div>
    </form>
  )
}

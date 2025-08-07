// components/common/Editor/TextEditor.tsx
'use client'

import dynamic from 'next/dynamic'
import { useMemo, useEffect } from 'react'
import 'react-quill-new/dist/quill.snow.css'

// Import ReactQuill động, tắt SSR
const ReactQuill = dynamic(() => import('react-quill-new'), { ssr: false })

interface TextEditorProps {
  value: string
  onChange: (val: string) => void
  placeholder?: string
}

export default function TextEditor({
  value,
  onChange,
  placeholder,
}: TextEditorProps) {
  useEffect(() => {
    if (typeof window === 'undefined') return

    // Chuyển require() thành dynamic import()
    Promise.all([
      import('react-quill-new').then(mod => mod.Quill),
      import('quill-blot-formatter-2').then(mod => mod.default),
    ]).then(([Quill, BlotFormatter]) => {
      // Đăng ký BlotFormatter
      Quill.register('modules/blotFormatter', BlotFormatter)

      // Đăng ký whitelist cho size
      const Size = Quill.import('attributors/style/size') as {
        whitelist: string[]
      }
      Size.whitelist = [
        '10px',
        '12px',
        '14px',
        '16px',
        '18px',
        '20px',
        '24px',
        '30px',
        '36px',
        '42px',
        '48px',
        '56px',
        '72px',
      ]
      Quill.register({ 'formats/size': Size }, true)

      /*       Quill.register(Size, true)
       */
    })
  }, [])

  const modules = useMemo(
    () => ({
      toolbar: [
        [
          { align: '' },
          { align: 'center' },
          { align: 'right' },
          { align: 'justify' },
        ],
        [
          {
            size: [
              '10px',
              '12px',
              '14px',
              '16px',
              '18px',
              '20px',
              '24px',
              '30px',
              '36px',
              '42px',
              '48px',
              '56px',
              '72px',
            ],
          },
        ],
        [{ color: [] }],
        ['bold', 'italic', 'underline', 'strike', 'blockquote'],
        [
          { list: 'ordered' },
          { list: 'bullet' },
          { indent: '-1' },
          { indent: '+1' },
        ],
        ['link', 'image', 'video'],
        ['clean'],
      ],
      blotFormatter: {},
    }),
    [],
  )

  const formats = useMemo(
    () => [
      'align',
      'size',
      'color',
      'bold',
      'italic',
      'underline',
      'strike',
      'blockquote',
      'list',
      'indent',
      'link',
      'image',
      'video',
    ],
    [],
  )

  return (
    <>
      <style jsx global>{`
        .ql-editor {
          font-size: 16px;
          line-height: 1.6;
        }
        .ql-editor img {
          width: 100%;
          height: auto;
        }
        .ql-snow .ql-picker.ql-size .ql-picker-label::before,
        .ql-snow .ql-picker.ql-size .ql-picker-item::before {
          content: attr(data-value) !important;
        }
        .ql-snow .ql-picker.ql-font .ql-picker-label::before,
        .ql-snow .ql-picker.ql-font .ql-picker-item::before {
          content: attr(data-value) !important;
          text-transform: capitalize;
        }
      `}</style>

      <div style={{ width: '100%', margin: '0 auto' }}>
        <ReactQuill
          theme='snow'
          value={value}
          onChange={onChange}
          modules={modules}
          formats={formats}
          placeholder={placeholder || ''}
        />
      </div>
    </>
  )
}

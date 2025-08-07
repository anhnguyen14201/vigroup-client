import React from 'react'

interface ShowHtmlProps {
  description?: string
}

const ShowHtml: React.FC<ShowHtmlProps> = ({ description }) => {
  // Cắt nội dung description theo giới hạn ký tự

  return (
    <div
      className='px-5 mb-1 text-sm text-gray-700
               overflow-hidden
               line-clamp-2       /* chỉ hiển thị 3 dòng */
               break-words'
      dangerouslySetInnerHTML={{ __html: description ?? '' }}
    />
  )
}

export default ShowHtml

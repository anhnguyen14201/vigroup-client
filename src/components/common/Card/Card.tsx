import React from 'react'
import clsx from 'clsx'

type CardProps = {
  image?: React.ReactNode;
  iconCard?: React.ComponentType<{ className?: string }>;
  title?: React.ReactNode;
  description?: React.ReactNode;
  footer?: React.ReactNode;
  children?: React.ReactNode;
  className?: string;
  [key: string]: any;
};

const Card: React.FC<CardProps> = ({
  image,
  iconCard: IconCard,
  title,
  description,
  footer,
  children,
  className,
  ...props
}) => {
  return (
    <div className={clsx('p-4 cursor-pointer', className)} {...props}>
      {image && <div className='object-cover rounded-lg'>{image}</div>}
      <div className='flex flex-col'>
        {IconCard && <IconCard className='text-3xl text-blue-500 mb-2' />}
        {title && <div className='text-xl'>{title}</div>}
        {description && <div className='text-lg'>{description}</div>}
        {children}
      </div>
      {footer && <div className='mt-4'>{footer}</div>}
    </div>
  )
}

export default Card

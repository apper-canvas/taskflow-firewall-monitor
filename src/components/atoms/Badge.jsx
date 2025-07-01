import ApperIcon from '@/components/ApperIcon'

const Badge = ({ 
  variant = 'default', 
  size = 'md',
  children, 
  icon,
  className = '',
  ...props 
}) => {
  const baseClasses = 'inline-flex items-center font-medium rounded-full'
  
  const variants = {
    default: 'bg-gray-100 text-gray-700',
    primary: 'bg-gradient-to-r from-primary-100 to-primary-200 text-primary-700',
    success: 'bg-gradient-to-r from-green-100 to-green-200 text-green-700',
    warning: 'bg-gradient-to-r from-amber-100 to-amber-200 text-amber-700',
    danger: 'bg-gradient-to-r from-red-100 to-red-200 text-red-700',
    info: 'bg-gradient-to-r from-blue-100 to-blue-200 text-blue-700',
    high: 'bg-gradient-to-r from-red-100 to-red-200 text-red-700',
    medium: 'bg-gradient-to-r from-amber-100 to-amber-200 text-amber-700',
    low: 'bg-gradient-to-r from-green-100 to-green-200 text-green-700'
  }
  
  const sizes = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-1 text-sm',
    lg: 'px-3 py-1.5 text-base'
  }
  
  const iconSizes = {
    sm: 12,
    md: 14,
    lg: 16
  }

  const badgeClasses = `${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`

  return (
    <span className={badgeClasses} {...props}>
      {icon && (
        <ApperIcon name={icon} size={iconSizes[size]} className="mr-1" />
      )}
      {children}
    </span>
  )
}

export default Badge
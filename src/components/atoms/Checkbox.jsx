import { motion } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'

const Checkbox = ({ 
  checked = false, 
  onChange, 
  disabled = false,
  size = 'md',
  label,
  className = '',
  ...props 
}) => {
  const sizes = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6'
  }
  
  const iconSizes = {
    sm: 12,
    md: 14,
    lg: 16
  }

  const checkboxClasses = `
    ${sizes[size]} rounded border-2 transition-all duration-200 cursor-pointer
    ${checked 
      ? 'bg-gradient-to-r from-primary-500 to-primary-600 border-primary-500' 
      : 'bg-white border-gray-300 hover:border-primary-300'
    }
    ${disabled 
      ? 'opacity-50 cursor-not-allowed' 
      : 'hover:shadow-md'
    }
    ${className}
  `

  return (
    <div className="flex items-center space-x-2">
      <motion.div
        whileTap={{ scale: 0.9 }}
        className={checkboxClasses}
        onClick={() => !disabled && onChange(!checked)}
        {...props}
      >
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ 
            scale: checked ? 1 : 0, 
            opacity: checked ? 1 : 0 
          }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          className="flex items-center justify-center h-full"
        >
          <ApperIcon 
            name="Check" 
            size={iconSizes[size]} 
            className="text-white" 
          />
        </motion.div>
      </motion.div>
      
      {label && (
        <label 
          className={`text-sm font-medium cursor-pointer ${
            disabled ? 'text-gray-400 cursor-not-allowed' : 'text-gray-700'
          }`}
          onClick={() => !disabled && onChange(!checked)}
        >
          {label}
        </label>
      )}
    </div>
  )
}

export default Checkbox
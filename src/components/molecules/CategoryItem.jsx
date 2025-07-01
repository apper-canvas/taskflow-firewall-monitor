import { motion } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'
import Badge from '@/components/atoms/Badge'

const CategoryItem = ({ 
  category, 
  taskCount = 0,
  isActive = false,
  onClick,
  onEdit,
  onDelete,
  className = '' 
}) => {
  const itemClasses = `
    flex items-center justify-between p-3 rounded-lg cursor-pointer transition-all duration-200
    ${isActive 
      ? 'bg-gradient-to-r from-primary-50 to-primary-100 border-l-4 border-primary-500' 
      : 'hover:bg-gray-50'
    }
    ${className}
  `

  return (
    <motion.div
      whileHover={{ x: 4 }}
      whileTap={{ scale: 0.98 }}
      className={itemClasses}
      onClick={onClick}
    >
      <div className="flex items-center space-x-3 flex-1">
        <div 
          className="w-3 h-3 rounded-full"
          style={{ backgroundColor: category.color }}
        />
        
        <div className="flex-1 min-w-0">
          <span className={`font-medium truncate ${
            isActive ? 'text-primary-700' : 'text-gray-700'
          }`}>
            {category.name}
          </span>
        </div>
        
        <Badge variant="default" size="sm">
          {taskCount}
        </Badge>
      </div>
      
      <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          onClick={(e) => {
            e.stopPropagation()
            onEdit(category)
          }}
          className="p-1 text-gray-400 hover:text-gray-600 rounded"
        >
          <ApperIcon name="Edit2" size={14} />
        </button>
        
        <button
          onClick={(e) => {
            e.stopPropagation()
            onDelete(category.Id)
          }}
          className="p-1 text-gray-400 hover:text-red-600 rounded"
        >
          <ApperIcon name="Trash2" size={14} />
        </button>
      </div>
    </motion.div>
  )
}

export default CategoryItem
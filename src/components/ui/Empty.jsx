import { motion } from 'framer-motion'
import Button from '@/components/atoms/Button'
import ApperIcon from '@/components/ApperIcon'

const Empty = ({ 
  icon = "CheckSquare",
  title = "No tasks yet",
  description = "Get started by creating your first task and stay organized!",
  action,
  className = ""
}) => {
  const suggestions = [
    "Add your daily to-dos",
    "Set up project tasks",
    "Create reminder notes",
    "Plan your week ahead"
  ]

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex flex-col items-center justify-center py-16 px-4 ${className}`}
    >
      <div className="text-center max-w-md">
        {/* Empty State Icon */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          className="mb-8"
        >
          <div className="w-24 h-24 bg-gradient-to-r from-primary-100 to-primary-200 rounded-full flex items-center justify-center mx-auto">
            <ApperIcon name={icon} size={48} className="text-primary-500" />
          </div>
        </motion.div>

        {/* Empty State Content */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="space-y-4"
        >
          <h3 className="text-2xl font-bold font-display text-gray-900">
            {title}
          </h3>
          
          <p className="text-gray-600 text-lg">
            {description}
          </p>
        </motion.div>

        {/* Suggestions */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-8"
        >
          <h4 className="text-sm font-medium text-gray-700 mb-4">
            You can start by:
          </h4>
          
          <div className="grid grid-cols-2 gap-3 mb-8">
            {suggestions.map((suggestion, index) => (
              <motion.div
                key={suggestion}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.8 + (index * 0.1) }}
                className="flex items-center space-x-2 text-left p-3 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg"
              >
                <ApperIcon name="CheckCircle" size={16} className="text-primary-500 flex-shrink-0" />
                <span className="text-sm text-gray-600">{suggestion}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Call to Action */}
        {action && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.0 }}
            className="space-y-4"
          >
            {action}
            
            <p className="text-sm text-gray-500">
              Start organizing your tasks and boost your productivity! 🚀
            </p>
          </motion.div>
        )}

        {/* Decorative Elements */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="mt-8 flex justify-center space-x-2"
        >
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={i}
              animate={{ 
                scale: [1, 1.2, 1],
                opacity: [0.3, 0.8, 0.3] 
              }}
              transition={{ 
                duration: 2, 
                repeat: Infinity, 
                delay: i * 0.3 
              }}
              className="w-2 h-2 bg-primary-400 rounded-full"
            />
          ))}
        </motion.div>
      </div>
    </motion.div>
  )
}

export default Empty
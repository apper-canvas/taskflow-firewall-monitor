import { motion } from 'framer-motion'
import Button from '@/components/atoms/Button'
import ApperIcon from '@/components/ApperIcon'

const Error = ({ 
  error = "Something went wrong", 
  onRetry,
  title = "Oops! Something went wrong",
  description = "We encountered an error while loading your tasks. This might be a temporary issue.",
  showRetry = true 
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center py-16 px-4"
    >
      <div className="text-center max-w-md">
        {/* Error Icon */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          className="mb-6"
        >
          <div className="w-20 h-20 bg-gradient-to-r from-red-100 to-red-200 rounded-full flex items-center justify-center mx-auto">
            <ApperIcon name="AlertTriangle" size={40} className="text-red-500" />
          </div>
        </motion.div>

        {/* Error Content */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="space-y-4"
        >
          <h3 className="text-2xl font-bold font-display text-gray-900">
            {title}
          </h3>
          
          <p className="text-gray-600">
            {description}
          </p>
          
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-left">
            <p className="text-sm text-red-700 font-mono">
              Error: {error}
            </p>
          </div>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-8 space-y-3"
        >
          {showRetry && onRetry && (
            <Button
              variant="primary"
              onClick={onRetry}
              icon="RefreshCw"
              className="w-full sm:w-auto"
            >
              Try Again
            </Button>
          )}
          
          <div className="text-sm text-gray-500 space-y-2">
            <p>If the problem persists, try:</p>
            <ul className="text-left space-y-1">
              <li>• Refreshing the page</li>
              <li>• Checking your internet connection</li>
              <li>• Clearing your browser cache</li>
            </ul>
          </div>
        </motion.div>

        {/* Additional Actions */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-6 pt-6 border-t border-gray-200"
        >
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button
              variant="ghost"
              onClick={() => window.location.reload()}
              icon="RotateCcw"
              size="sm"
            >
              Refresh Page
            </Button>
            
            <Button
              variant="ghost"
              onClick={() => window.location.href = '/'}
              icon="Home"
              size="sm"
            >
              Go Home
            </Button>
          </div>
        </motion.div>
      </div>
    </motion.div>
  )
}

export default Error
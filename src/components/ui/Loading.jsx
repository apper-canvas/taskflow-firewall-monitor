import { motion } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'

const Loading = ({ message = "Loading tasks..." }) => {
  const skeletonItems = Array.from({ length: 6 }, (_, i) => i)

  return (
    <div className="space-y-6">
      {/* Header Skeleton */}
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <div className="h-8 bg-gradient-to-r from-gray-200 to-gray-300 rounded-lg w-48 animate-pulse" />
          <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-32 animate-pulse" />
        </div>
        <div className="hidden sm:flex space-x-2">
          <div className="h-8 bg-gradient-to-r from-gray-200 to-gray-300 rounded-lg w-20 animate-pulse" />
          <div className="h-8 bg-gradient-to-r from-gray-200 to-gray-300 rounded-lg w-20 animate-pulse" />
        </div>
      </div>

      {/* Filter Bar Skeleton */}
      <div className="p-4 bg-white rounded-lg border">
        <div className="flex items-center justify-between mb-4">
          <div className="h-5 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-16 animate-pulse" />
          <div className="h-8 bg-gradient-to-r from-gray-200 to-gray-300 rounded-lg w-24 animate-pulse" />
        </div>
      </div>

      {/* Task Cards Skeleton */}
      <div className="space-y-4">
        {skeletonItems.map((item, index) => (
          <motion.div
            key={item}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-lg p-4 border border-gray-200"
          >
            <div className="flex items-start space-x-3">
              {/* Checkbox Skeleton */}
              <div className="mt-1 w-5 h-5 bg-gradient-to-r from-gray-200 to-gray-300 rounded animate-pulse" />
              
              <div className="flex-1 space-y-3">
                {/* Title and Description */}
                <div className="space-y-2">
                  <div className="h-5 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-3/4 animate-pulse" />
                  <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-1/2 animate-pulse" />
                </div>
                
                {/* Meta Information */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="h-6 bg-gradient-to-r from-gray-200 to-gray-300 rounded-full w-16 animate-pulse" />
                    <div className="h-6 bg-gradient-to-r from-gray-200 to-gray-300 rounded-full w-20 animate-pulse" />
                  </div>
                  <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-24 animate-pulse" />
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Loading Indicator */}
      <div className="flex items-center justify-center py-8">
        <div className="flex items-center space-x-3 text-primary-600">
          <ApperIcon name="Loader2" size={24} className="animate-spin" />
          <span className="text-lg font-medium">{message}</span>
        </div>
      </div>
    </div>
  )
}

export default Loading
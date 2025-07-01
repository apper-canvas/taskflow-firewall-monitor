import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Button from '@/components/atoms/Button'
import ApperIcon from '@/components/ApperIcon'

const BulkActionsToolbar = ({
  selectedCount,
  categories = [],
  onComplete,
  onMarkPending,
  onDelete,
  onMoveCategory,
  onCancel
}) => {
  const [showMoveDropdown, setShowMoveDropdown] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  const handleMoveCategory = (categoryId) => {
    onMoveCategory(categoryId)
    setShowMoveDropdown(false)
  }

  const handleDelete = () => {
    onDelete()
    setShowDeleteConfirm(false)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className="sticky top-4 z-10 bg-white border border-gray-200 rounded-lg shadow-lg p-4 mb-6"
    >
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <ApperIcon name="CheckSquare" size={20} className="text-primary-500" />
            <span className="font-medium text-gray-900">
              {selectedCount} task{selectedCount !== 1 ? 's' : ''} selected
            </span>
          </div>
          
          <Button
            variant="ghost"
            size="sm"
            icon="X"
            onClick={onCancel}
            className="text-gray-500 hover:text-gray-700"
          >
            Cancel
          </Button>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Complete Action */}
          <Button
            variant="success"
            size="sm"
            icon="Check"
            onClick={onComplete}
            className="bg-green-500 hover:bg-green-600 text-white"
          >
            Mark Complete
          </Button>

          {/* Mark Pending Action */}
          <Button
            variant="secondary"
            size="sm"
            icon="Clock"
            onClick={onMarkPending}
          >
            Mark Pending
          </Button>

          {/* Move Category Action */}
          <div className="relative">
            <Button
              variant="secondary"
              size="sm"
              icon="FolderOpen"
              onClick={() => setShowMoveDropdown(!showMoveDropdown)}
              className="flex items-center space-x-1"
            >
              Move to Category
              <ApperIcon name="ChevronDown" size={14} />
            </Button>

            <AnimatePresence>
              {showMoveDropdown && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: -10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: -10 }}
                  className="absolute top-full mt-2 right-0 bg-white border border-gray-200 rounded-lg shadow-lg z-20 min-w-48"
                >
                  <div className="p-2 max-h-64 overflow-y-auto">
                    <button
                      onClick={() => handleMoveCategory(null)}
                      className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md flex items-center space-x-2"
                    >
                      <ApperIcon name="Folder" size={16} className="text-gray-400" />
                      <span>No Category</span>
                    </button>
                    
                    {categories.map(category => (
                      <button
                        key={category.Id}
                        onClick={() => handleMoveCategory(category.Id)}
                        className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md flex items-center space-x-2"
                      >
                        <div 
                          className="w-3 h-3 rounded-full" 
                          style={{ backgroundColor: category.color }}
                        />
                        <span>{category.name}</span>
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Delete Action */}
          <Button
            variant="danger"
            size="sm"
            icon="Trash2"
            onClick={() => setShowDeleteConfirm(true)}
            className="bg-red-500 hover:bg-red-600 text-white"
          >
            Delete
          </Button>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {showDeleteConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowDeleteConfirm(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-lg p-6 max-w-md w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center space-x-3 mb-4">
                <div className="flex-shrink-0 w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                  <ApperIcon name="Trash2" size={20} className="text-red-600" />
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-900">Delete Tasks</h3>
                  <p className="text-sm text-gray-600">
                    Are you sure you want to delete {selectedCount} task{selectedCount !== 1 ? 's' : ''}? 
                    This action cannot be undone.
                  </p>
                </div>
              </div>

              <div className="flex justify-end space-x-3">
                <Button
                  variant="ghost"
                  onClick={() => setShowDeleteConfirm(false)}
                >
                  Cancel
                </Button>
                <Button
                  variant="danger"
                  onClick={handleDelete}
                  className="bg-red-500 hover:bg-red-600 text-white"
                >
                  Delete Tasks
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Click outside handler for dropdown */}
      {showMoveDropdown && (
        <div
          className="fixed inset-0 z-10"
          onClick={() => setShowMoveDropdown(false)}
        />
      )}
    </motion.div>
  )
}

export default BulkActionsToolbar
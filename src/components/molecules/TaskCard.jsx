import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { format, isToday, isPast, isTomorrow } from 'date-fns'
import { toast } from 'react-toastify'
import Checkbox from '@/components/atoms/Checkbox'
import Badge from '@/components/atoms/Badge'
import Button from '@/components/atoms/Button'
import ApperIcon from '@/components/ApperIcon'
import TaskForm from '@/components/organisms/TaskForm'

const TaskCard = ({ 
  task, 
  category,
  onUpdate, 
  onDelete,
  onComplete,
  className = '' 
}) => {
  const [isEditing, setIsEditing] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  const formatDueDate = (date) => {
    if (!date) return null
    
    const taskDate = new Date(date)
    if (isToday(taskDate)) return 'Today'
    if (isTomorrow(taskDate)) return 'Tomorrow'
    if (isPast(taskDate) && !isToday(taskDate)) return `Overdue - ${format(taskDate, 'MMM d')}`
    return format(taskDate, 'MMM d, yyyy')
  }

  const getDueDateColor = (date) => {
    if (!date) return 'text-gray-500'
    
    const taskDate = new Date(date)
    if (isPast(taskDate) && !isToday(taskDate)) return 'text-red-600'
    if (isToday(taskDate)) return 'text-amber-600'
    return 'text-gray-600'
  }

  const getPriorityIcon = (priority) => {
    switch (priority) {
      case 'high': return 'AlertCircle'
      case 'medium': return 'Circle'
      case 'low': return 'Minus'
      default: return 'Circle'
    }
  }

  const handleComplete = async () => {
    try {
      await onComplete(task.Id, !task.completed)
      toast.success(task.completed ? 'Task marked as incomplete' : 'Task completed! 🎉')
    } catch (error) {
      toast.error('Failed to update task')
    }
  }

  const handleEdit = () => {
    setIsEditing(true)
  }

  const handleSave = async (updatedTask) => {
    try {
      await onUpdate(task.Id, updatedTask)
      setIsEditing(false)
      toast.success('Task updated successfully')
    } catch (error) {
      toast.error('Failed to update task')
    }
  }

  const handleDelete = async () => {
    try {
      await onDelete(task.Id)
      setShowDeleteConfirm(false)
      toast.success('Task deleted successfully')
    } catch (error) {
      toast.error('Failed to delete task')
    }
  }

  const dueDateText = formatDueDate(task.dueDate)
  const dueDateColor = getDueDateColor(task.dueDate)

  return (
    <AnimatePresence>
      <motion.div
        layout
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className={`card p-4 ${task.completed ? 'opacity-75' : ''} ${className}`}
      >
        {isEditing ? (
          <TaskForm
            task={task}
            onSave={handleSave}
            onCancel={() => setIsEditing(false)}
            mode="edit"
          />
        ) : (
          <>
            <div className="flex items-start space-x-3">
              <motion.div
                whileTap={{ scale: 0.9 }}
                className="mt-1"
              >
                <Checkbox
                  checked={task.completed}
                  onChange={handleComplete}
                  size="md"
                />
              </motion.div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className={`font-medium text-gray-900 ${
                      task.completed ? 'line-through text-gray-500' : ''
                    }`}>
                      {task.title}
                    </h3>
                    
                    {task.description && (
                      <p className={`text-sm text-gray-600 mt-1 ${
                        task.completed ? 'line-through' : ''
                      }`}>
                        {task.description}
                      </p>
                    )}
                  </div>
                  
                  <div className="flex items-center space-x-2 ml-4">
                    <Button
                      variant="ghost"
                      size="sm"
                      icon="Edit2"
                      onClick={handleEdit}
                      className="opacity-0 group-hover:opacity-100 transition-opacity"
                    />
                    
                    <Button
                      variant="ghost"
                      size="sm"
                      icon="Trash2"
                      onClick={() => setShowDeleteConfirm(true)}
                      className="opacity-0 group-hover:opacity-100 transition-opacity text-red-600 hover:text-red-700"
                    />
                  </div>
                </div>
                
                <div className="flex items-center justify-between mt-3">
                  <div className="flex items-center space-x-2">
                    <Badge 
                      variant={task.priority} 
                      size="sm"
                      icon={getPriorityIcon(task.priority)}
                    >
                      {task.priority}
                    </Badge>
                    
                    {category && (
                      <Badge variant="default" size="sm">
                        {category.name}
                      </Badge>
                    )}
                  </div>
                  
                  {dueDateText && (
                    <div className={`flex items-center text-xs ${dueDateColor}`}>
                      <ApperIcon name="Calendar" size={12} className="mr-1" />
                      {dueDateText}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </>
        )}
        
        {/* Delete Confirmation Modal */}
        <AnimatePresence>
          {showDeleteConfirm && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
              onClick={() => setShowDeleteConfirm(false)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-white rounded-lg p-6 max-w-sm mx-4"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center mb-4">
                  <ApperIcon name="AlertTriangle" size={20} className="text-red-500 mr-2" />
                  <h3 className="text-lg font-semibold text-gray-900">Delete Task</h3>
                </div>
                
                <p className="text-gray-600 mb-6">
                  Are you sure you want to delete "{task.title}"? This action cannot be undone.
                </p>
                
                <div className="flex space-x-3">
                  <Button
                    variant="danger"
                    onClick={handleDelete}
                    className="flex-1"
                  >
                    Delete
                  </Button>
                  <Button
                    variant="secondary"
                    onClick={() => setShowDeleteConfirm(false)}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </AnimatePresence>
  )
}

export default TaskCard
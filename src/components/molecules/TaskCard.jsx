import React, { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { format, isPast, isToday, isTomorrow } from "date-fns";
import { toast } from "react-toastify";
import ReactMarkdown from "react-markdown";
import { formatDueDate, getDueDateColor } from "@/utils/dateHelpers";
import { getPriorityIcon } from "@/utils/taskHelpers";
import ApperIcon from "@/components/ApperIcon";
import TaskForm from "@/components/organisms/TaskForm";
import Badge from "@/components/atoms/Badge";
import Button from "@/components/atoms/Button";
import Checkbox from "@/components/atoms/Checkbox";

const TaskCard = ({ 
  task, 
  category, 
  onUpdate, 
  onDelete, 
  onComplete, 
  selected = false,
  onSelect,
  className = '' 
}) => {
  const [isEditing, setIsEditing] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  const handleComplete = async () => {
    try {
      await onComplete(task.id, !task.completed)
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
      await onUpdate(task.id, updatedTask)
      setIsEditing(false)
      toast.success('Task updated successfully')
    } catch (error) {
      toast.error('Failed to update task')
    }
  }

  const handleCardClick = (e) => {
    // Prevent selection when clicking on interactive elements
    if (e.target.closest('button') || e.target.closest('input') || e.target.closest('[role="button"]')) {
      return
    }
    
    if (onSelect) {
      onSelect(!selected)
    }
  }

  const handleCheckboxChange = (e) => {
    e.stopPropagation()
    if (onSelect) {
      onSelect(!selected)
    }
  }

  const handleDelete = async () => {
    try {
      await onDelete(task.id)
      setShowDeleteConfirm(false)
      toast.success('Task deleted successfully')
    } catch (error) {
      toast.error('Failed to delete task')
    }
  }

  // Use imported utility functions instead of local duplicates
  const dueDateText = formatDueDate(task.dueDate)
  const dueDateColor = getDueDateColor(task.dueDate)

  return (
<motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      onClick={handleCardClick}
      className={`group bg-white rounded-lg border transition-all duration-200 p-6 cursor-pointer
        ${selected 
          ? 'border-primary-300 bg-primary-50 shadow-md' 
          : 'border-gray-200 hover:border-gray-300 hover:shadow-md'
        } 
        ${task.completed ? 'opacity-75' : ''} 
        ${className}`}
    >
      {isEditing ? (
        <TaskForm
          task={task}
          category={category}
          onSave={handleSave}
          onCancel={() => setIsEditing(false)}
          mode="edit"
        />
) : (
        <>
          {/* Task Header */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center space-x-3 flex-1">
              {/* Selection Checkbox */}
              {onSelect && (
                <Checkbox
                  checked={selected}
                  onChange={handleCheckboxChange}
                  size="sm"
                  className="flex-shrink-0"
                />
              )}
              
              {/* Completion Checkbox */}
              <motion.div
                whileTap={{ scale: 0.9 }}
                className="flex-shrink-0"
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
                      <div className={`text-sm text-gray-600 mt-1 ${
                        task.completed ? 'line-through' : ''
                      }`}>
                        <div className="prose prose-sm max-w-none">
                          <ReactMarkdown>{task.description}</ReactMarkdown>
                        </div>
                      </div>
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
  )
}

export default TaskCard
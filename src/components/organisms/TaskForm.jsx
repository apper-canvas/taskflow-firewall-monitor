import React, { useState, useRef } from "react";
import { format } from "date-fns";
import { motion } from "framer-motion";
import ReactMarkdown from "react-markdown";
import ApperIcon from "@/components/ApperIcon";
import Badge from "@/components/atoms/Badge";
import Input from "@/components/atoms/Input";
import Button from "@/components/atoms/Button";
const TaskForm = ({ 
  task = null,
  categories = [],
  onSave,
  onCancel,
  mode = 'create' // 'create' or 'edit'
}) => {
  const [formData, setFormData] = useState({
    title: task?.title || '',
    description: task?.description || '',
    categoryId: task?.categoryId || (categories[0]?.Id || ''),
    priority: task?.priority || 'medium',
    dueDate: task?.dueDate ? format(new Date(task.dueDate), 'yyyy-MM-dd') : ''
  })
  
const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [showPreview, setShowPreview] = useState(false)
  
  const textareaRef = useRef(null)

  const priorities = [
    { value: 'low', label: 'Low Priority', color: 'bg-green-100 text-green-700', icon: 'Minus' },
    { value: 'medium', label: 'Medium Priority', color: 'bg-amber-100 text-amber-700', icon: 'Circle' },
    { value: 'high', label: 'High Priority', color: 'bg-red-100 text-red-700', icon: 'AlertCircle' }
  ]

  const handleInputChange = (field) => (e) => {
    const value = e.target.value
    setFormData(prev => ({ ...prev, [field]: value }))
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

const handlePrioritySelect = (priority) => {
    setFormData(prev => ({ ...prev, priority }))
  }

  const insertMarkdown = (type) => {
    if (!textareaRef.current) return
    
    const textarea = textareaRef.current
    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    const selectedText = formData.description.substring(start, end)
    
    let insertText = ''
    let cursorOffset = 0
    
    switch (type) {
      case 'bold':
        insertText = `**${selectedText || 'bold text'}**`
        cursorOffset = selectedText ? 0 : -9
        break
      case 'italic':
        insertText = `*${selectedText || 'italic text'}*`
        cursorOffset = selectedText ? 0 : -11
        break
      case 'heading':
        insertText = `## ${selectedText || 'Heading'}`
        cursorOffset = selectedText ? 0 : -7
        break
      case 'link':
        insertText = `[${selectedText || 'link text'}](url)`
        cursorOffset = selectedText ? -5 : -14
        break
      case 'list':
        insertText = `- ${selectedText || 'list item'}`
        cursorOffset = selectedText ? 0 : -9
        break
      case 'code':
        insertText = `\`${selectedText || 'code'}\``
        cursorOffset = selectedText ? 0 : -5
        break
      default:
        return
    }
    
    const newText = formData.description.substring(0, start) + insertText + formData.description.substring(end)
    setFormData(prev => ({ ...prev, description: newText }))
    
    setTimeout(() => {
      textarea.focus()
      const newCursorPos = start + insertText.length + cursorOffset
      textarea.setSelectionRange(newCursorPos, newCursorPos)
    }, 0)
  }

  const validateForm = () => {
    const newErrors = {}
    
    if (!formData.title.trim()) {
      newErrors.title = 'Task title is required'
    }
    
    if (formData.dueDate && new Date(formData.dueDate) < new Date().setHours(0, 0, 0, 0)) {
      newErrors.dueDate = 'Due date cannot be in the past'
    }

setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) return
    
    setLoading(true)
    
    try {
      const taskData = {
        ...formData,
        dueDate: formData.dueDate ? new Date(formData.dueDate).toISOString() : null
      }
      
      await onSave(taskData)
    } catch (error) {
      console.error('Error saving task:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-white"
    >
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold font-display text-gray-900">
          {mode === 'edit' ? 'Edit Task' : 'Create New Task'}
        </h3>
        <Button
          variant="ghost"
          size="sm"
          icon="X"
          onClick={onCancel}
        />
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Title */}
        <Input
          label="Task Title"
          type="text"
          placeholder="Enter task title..."
          value={formData.title}
          onChange={handleInputChange('title')}
          error={errors.title}
          required
          icon="Type"
        />

{/* Description with Markdown Support */}
        <div className="space-y-1">
          <div className="flex items-center justify-between mb-2">
            <label className="block text-sm font-medium text-gray-700">
              Description
            </label>
            <div className="flex items-center space-x-2">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setShowPreview(!showPreview)}
                className="text-xs"
              >
                {showPreview ? 'Edit' : 'Preview'}
              </Button>
            </div>
          </div>
          
          <div className="markdown-editor">
            {!showPreview && (
              <div className="markdown-toolbar">
                <button
                  type="button"
                  onClick={() => insertMarkdown('bold')}
                  title="Bold"
                >
                  <ApperIcon name="Bold" size={14} />
                </button>
                <button
                  type="button"
                  onClick={() => insertMarkdown('italic')}
                  title="Italic"
                >
                  <ApperIcon name="Italic" size={14} />
                </button>
                <button
                  type="button"
                  onClick={() => insertMarkdown('heading')}
                  title="Heading"
                >
                  <ApperIcon name="Heading" size={14} />
                </button>
                <button
                  type="button"
                  onClick={() => insertMarkdown('link')}
                  title="Link"
                >
                  <ApperIcon name="Link" size={14} />
                </button>
                <button
                  type="button"
                  onClick={() => insertMarkdown('list')}
                  title="List"
                >
                  <ApperIcon name="List" size={14} />
                </button>
                <button
                  type="button"
                  onClick={() => insertMarkdown('code')}
                  title="Code"
                >
                  <ApperIcon name="Code" size={14} />
                </button>
              </div>
            )}
            
            {showPreview ? (
              <div className="markdown-preview">
                {formData.description ? (
                  <ReactMarkdown>{formData.description}</ReactMarkdown>
                ) : (
                  <p className="text-gray-500 italic">Nothing to preview yet...</p>
                )}
              </div>
) : (
              <textarea
                ref={textareaRef}
                placeholder="Add task description... (Supports Markdown formatting)"
                value={formData.description}
                onChange={handleInputChange('description')}
                className="markdown-content w-full min-h-[120px] px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors duration-200 resize-vertical"
              />
            )}
          </div>
        </div>
        {/* Category */}
        {categories.length > 0 && (
          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Category
            </label>
            <select
              value={formData.categoryId}
              onChange={handleInputChange('categoryId')}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors duration-200"
            >
              {categories.map(category => (
                <option key={category.Id} value={category.Id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Priority */}
        <div className="space-y-1">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Priority Level
          </label>
          <div className="flex space-x-2">
            {priorities.map(priority => (
              <button
                key={priority.value}
                type="button"
                onClick={() => handlePrioritySelect(priority.value)}
                className={`flex items-center space-x-2 px-3 py-2 rounded-lg border transition-all ${
                  formData.priority === priority.value
                    ? 'border-primary-300 bg-primary-50 text-primary-700'
                    : 'border-gray-200 hover:border-gray-300 text-gray-600'
                }`}
              >
                <ApperIcon name={priority.icon} size={14} />
                <span className="text-sm font-medium">{priority.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Due Date */}
        <Input
          label="Due Date"
          type="date"
          value={formData.dueDate}
          onChange={handleInputChange('dueDate')}
          error={errors.dueDate}
          icon="Calendar"
        />

        {/* Actions */}
        <div className="flex space-x-3 pt-4">
          <Button
            type="submit"
            variant="primary"
            loading={loading}
            className="flex-1"
            icon={mode === 'edit' ? 'Save' : 'Plus'}
          >
            {mode === 'edit' ? 'Save Changes' : 'Create Task'}
          </Button>
          
          <Button
            type="button"
            variant="secondary"
            onClick={onCancel}
            disabled={loading}
            className="flex-1"
          >
            Cancel
          </Button>
        </div>
      </form>
    </motion.div>
  )
}

export default TaskForm
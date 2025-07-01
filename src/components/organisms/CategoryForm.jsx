import { useState } from 'react'
import { motion } from 'framer-motion'
import Input from '@/components/atoms/Input'
import Button from '@/components/atoms/Button'
import ApperIcon from '@/components/ApperIcon'

const CategoryForm = ({ 
  category = null,
  onSave,
  onCancel
}) => {
  const [formData, setFormData] = useState({
    name: category?.name || '',
    color: category?.color || '#8B5CF6'
  })
  
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)

  const colorOptions = [
    { value: '#8B5CF6', name: 'Purple' },
    { value: '#F59E0B', name: 'Amber' },
    { value: '#10B981', name: 'Green' },
    { value: '#EF4444', name: 'Red' },
    { value: '#3B82F6', name: 'Blue' },
    { value: '#8B5A2B', name: 'Brown' },
    { value: '#EC4899', name: 'Pink' },
    { value: '#6B7280', name: 'Gray' }
  ]

  const handleInputChange = (field) => (e) => {
    const value = e.target.value
    setFormData(prev => ({ ...prev, [field]: value }))
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  const handleColorSelect = (color) => {
    setFormData(prev => ({ ...prev, color }))
  }

  const validateForm = () => {
    const newErrors = {}
    
    if (!formData.name.trim()) {
      newErrors.name = 'Category name is required'
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Category name must be at least 2 characters'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) return
    
    setLoading(true)
    
    try {
      await onSave({
        name: formData.name.trim(),
        color: formData.color
      })
    } catch (error) {
      console.error('Error saving category:', error)
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
        <div className="flex items-center space-x-3">
          <div 
            className="w-4 h-4 rounded-full"
            style={{ backgroundColor: formData.color }}
          />
          <h3 className="text-lg font-semibold font-display text-gray-900">
            {category ? 'Edit Category' : 'Create New Category'}
          </h3>
        </div>
        <Button
          variant="ghost"
          size="sm"
          icon="X"
          onClick={onCancel}
        />
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Name */}
        <Input
          label="Category Name"
          type="text"
          placeholder="Enter category name..."
          value={formData.name}
          onChange={handleInputChange('name')}
          error={errors.name}
          required
          icon="Tag"
        />

        {/* Color Selection */}
        <div className="space-y-1">
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Choose Color
          </label>
          <div className="grid grid-cols-4 gap-3">
            {colorOptions.map(color => (
              <button
                key={color.value}
                type="button"
                onClick={() => handleColorSelect(color.value)}
                className={`flex items-center justify-center w-12 h-12 rounded-lg transition-all ${
                  formData.color === color.value
                    ? 'ring-2 ring-primary-500 ring-offset-2 scale-110'
                    : 'hover:scale-105'
                }`}
                style={{ backgroundColor: color.value }}
                title={color.name}
              >
                {formData.color === color.value && (
                  <ApperIcon name="Check" size={16} className="text-white" />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Preview */}
        <div className="p-4 bg-gray-50 rounded-lg">
          <h4 className="text-sm font-medium text-gray-700 mb-2">Preview</h4>
          <div className="flex items-center space-x-3 p-3 bg-white rounded-lg border">
            <div 
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: formData.color }}
            />
            <span className="font-medium text-gray-700">
              {formData.name || 'Category Name'}
            </span>
            <div className="ml-auto">
              <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                0 tasks
              </span>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex space-x-3 pt-4">
          <Button
            type="submit"
            variant="primary"
            loading={loading}
            className="flex-1"
            icon={category ? 'Save' : 'Plus'}
          >
            {category ? 'Save Changes' : 'Create Category'}
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

export default CategoryForm
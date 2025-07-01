import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import CategoryItem from '@/components/molecules/CategoryItem'
import Button from '@/components/atoms/Button'
import ApperIcon from '@/components/ApperIcon'
import CategoryForm from '@/components/organisms/CategoryForm'

const Sidebar = ({ 
  categories = [], 
  activeCategory,
  onCategorySelect,
  onCategoryCreate,
  onCategoryUpdate,
  onCategoryDelete,
  taskCounts = {},
  className = '' 
}) => {
  const [showCategoryForm, setShowCategoryForm] = useState(false)
  const [editingCategory, setEditingCategory] = useState(null)
  const [isMobileOpen, setIsMobileOpen] = useState(false)

  const handleCategoryEdit = (category) => {
    setEditingCategory(category)
    setShowCategoryForm(true)
  }

  const handleCategoryFormClose = () => {
    setShowCategoryForm(false)
    setEditingCategory(null)
  }

  const handleCategoryFormSave = async (categoryData) => {
    if (editingCategory) {
      await onCategoryUpdate(editingCategory.Id, categoryData)
    } else {
      await onCategoryCreate(categoryData)
    }
    handleCategoryFormClose()
  }

  const sidebarContent = (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold font-display text-gray-900">Categories</h2>
          <Button
            variant="ghost"
            size="sm"
            icon="Plus"
            onClick={() => setShowCategoryForm(true)}
            className="lg:hidden xl:flex"
          >
            <span className="hidden xl:inline">Add</span>
          </Button>
        </div>
      </div>

      {/* Quick Filters */}
      <div className="p-4 border-b border-gray-100">
        <div className="space-y-2">
          <CategoryItem
            category={{ Id: 'all', name: 'All Tasks', color: '#8B5CF6' }}
            taskCount={Object.values(taskCounts).reduce((sum, count) => sum + count, 0)}
            isActive={activeCategory === 'all'}
            onClick={() => onCategorySelect('all')}
            onEdit={() => {}}
            onDelete={() => {}}
          />
          
          <CategoryItem
            category={{ Id: 'today', name: 'Due Today', color: '#F59E0B' }}
            taskCount={taskCounts.today || 0}
            isActive={activeCategory === 'today'}
            onClick={() => onCategorySelect('today')}
            onEdit={() => {}}
            onDelete={() => {}}
          />
          
          <CategoryItem
            category={{ Id: 'completed', name: 'Completed', color: '#10B981' }}
            taskCount={taskCounts.completed || 0}
            isActive={activeCategory === 'completed'}
            onClick={() => onCategorySelect('completed')}
            onEdit={() => {}}
            onDelete={() => {}}
          />
        </div>
      </div>

      {/* Custom Categories */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="space-y-1">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide">
              My Lists
            </h3>
            <Button
              variant="ghost"
              size="sm"
              icon="Plus"
              onClick={() => setShowCategoryForm(true)}
              className="text-gray-400 hover:text-gray-600"
            />
          </div>
          
          {categories.length === 0 ? (
            <div className="text-center py-8">
              <ApperIcon name="FolderPlus" size={48} className="text-gray-300 mx-auto mb-3" />
              <p className="text-sm text-gray-500 mb-3">No custom lists yet</p>
              <Button
                variant="primary"
                size="sm"
                icon="Plus"
                onClick={() => setShowCategoryForm(true)}
              >
                Create First List
              </Button>
            </div>
          ) : (
            <div className="space-y-1 group">
              {categories.map(category => (
                <CategoryItem
                  key={category.Id}
                  category={category}
                  taskCount={taskCounts[category.Id] || 0}
                  isActive={activeCategory === category.Id}
                  onClick={() => onCategorySelect(category.Id)}
                  onEdit={handleCategoryEdit}
                  onDelete={onCategoryDelete}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200">
        <div className="text-xs text-gray-500 text-center">
          <p>TaskFlow v1.0</p>
          <p className="mt-1">Organize • Focus • Achieve</p>
        </div>
      </div>
    </div>
  )

  return (
    <>
      {/* Mobile Menu Button */}
      <Button
        variant="ghost"
        size="sm"
        icon="Menu"
        onClick={() => setIsMobileOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-40 bg-white shadow-md"
      />

      {/* Desktop Sidebar */}
      <aside className={`hidden lg:flex w-80 bg-white border-r border-gray-200 ${className}`}>
        {sidebarContent}
      </aside>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {isMobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
              onClick={() => setIsMobileOpen(false)}
            />
            
            <motion.aside
              initial={{ x: -320 }}
              animate={{ x: 0 }}
              exit={{ x: -320 }}
              transition={{ type: "tween", duration: 0.3 }}
              className="lg:hidden fixed left-0 top-0 w-80 h-full bg-white z-50 shadow-xl"
            >
              <div className="flex items-center justify-between p-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold font-display text-gray-900">Menu</h2>
                <Button
                  variant="ghost"
                  size="sm"
                  icon="X"
                  onClick={() => setIsMobileOpen(false)}
                />
              </div>
              {sidebarContent}
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Category Form Modal */}
      <AnimatePresence>
        {showCategoryForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            onClick={handleCategoryFormClose}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-lg p-6 max-w-md w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <CategoryForm
                category={editingCategory}
                onSave={handleCategoryFormSave}
                onCancel={handleCategoryFormClose}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

export default Sidebar
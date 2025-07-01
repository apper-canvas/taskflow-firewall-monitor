import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'react-toastify'
import Header from '@/components/organisms/Header'
import Sidebar from '@/components/organisms/Sidebar'
import TaskList from '@/components/organisms/TaskList'
import TaskForm from '@/components/organisms/TaskForm'
import Button from '@/components/atoms/Button'
import { taskService } from '@/services/api/taskService'
import { categoryService } from '@/services/api/categoryService'

const Dashboard = () => {
  const [tasks, setTasks] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
const [searchQuery, setSearchQuery] = useState('')
  const [activeCategory, setActiveCategory] = useState('all')
  const [showTaskForm, setShowTaskForm] = useState(false)
  const [selectedTasks, setSelectedTasks] = useState([])

  // Load initial data
  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const [tasksData, categoriesData] = await Promise.all([
        taskService.getAll(),
        categoryService.getAll()
      ])
      
      setTasks(tasksData)
      setCategories(categoriesData)
    } catch (err) {
      setError('Failed to load data. Please try again.')
      console.error('Error loading data:', err)
    } finally {
      setLoading(false)
    }
  }

  // Task operations
  const handleTaskCreate = async (taskData) => {
    try {
      const newTask = await taskService.create(taskData)
      setTasks(prev => [newTask, ...prev])
      setShowTaskForm(false)
      toast.success('Task created successfully! 🎉')
    } catch (error) {
      toast.error('Failed to create task')
      throw error
    }
  }

  const handleTaskUpdate = async (taskId, taskData) => {
    try {
      const updatedTask = await taskService.update(taskId, taskData)
      setTasks(prev => prev.map(task => 
        task.Id === taskId ? updatedTask : task
      ))
      toast.success('Task updated successfully')
    } catch (error) {
      toast.error('Failed to update task')
      throw error
    }
  }

  const handleTaskDelete = async (taskId) => {
    try {
      await taskService.delete(taskId)
      setTasks(prev => prev.filter(task => task.Id !== taskId))
      toast.success('Task deleted successfully')
    } catch (error) {
      toast.error('Failed to delete task')
      throw error
    }
  }

  const handleTaskComplete = async (taskId, completed) => {
    try {
      const updatedTask = await taskService.update(taskId, { completed })
      setTasks(prev => prev.map(task => 
        task.Id === taskId ? updatedTask : task
      ))
    } catch (error) {
      toast.error('Failed to update task')
      throw error
    }
}

  // Bulk operations
  const handleBulkComplete = async (taskIds, completed) => {
    try {
      await taskService.bulkComplete(taskIds, completed)
      setTasks(prev => prev.map(task => 
        taskIds.includes(task.Id) ? { ...task, completed } : task
      ))
      setSelectedTasks([])
      toast.success(`${taskIds.length} task(s) ${completed ? 'completed' : 'marked as pending'}`)
    } catch (error) {
      toast.error('Failed to update tasks')
      throw error
    }
  }

  const handleBulkDelete = async (taskIds) => {
    try {
      await taskService.bulkDelete(taskIds)
      setTasks(prev => prev.filter(task => !taskIds.includes(task.Id)))
      setSelectedTasks([])
      toast.success(`${taskIds.length} task(s) deleted successfully`)
    } catch (error) {
      toast.error('Failed to delete tasks')
      throw error
    }
  }

  const handleBulkMoveCategory = async (taskIds, categoryId) => {
    try {
      await taskService.bulkUpdateCategory(taskIds, categoryId)
      setTasks(prev => prev.map(task => 
        taskIds.includes(task.Id) ? { ...task, categoryId } : task
      ))
      setSelectedTasks([])
      const categoryName = categories.find(cat => cat.Id === categoryId)?.name || 'Unknown Category'
      toast.success(`${taskIds.length} task(s) moved to ${categoryName}`)
    } catch (error) {
      toast.error('Failed to move tasks')
      throw error
    }
  }
  // Category operations
  const handleCategoryCreate = async (categoryData) => {
    try {
      const newCategory = await categoryService.create(categoryData)
      setCategories(prev => [...prev, newCategory])
      toast.success('Category created successfully')
    } catch (error) {
      toast.error('Failed to create category')
      throw error
    }
  }

  const handleCategoryUpdate = async (categoryId, categoryData) => {
    try {
      const updatedCategory = await categoryService.update(categoryId, categoryData)
      setCategories(prev => prev.map(category => 
        category.Id === categoryId ? updatedCategory : category
      ))
      toast.success('Category updated successfully')
    } catch (error) {
      toast.error('Failed to update category')
      throw error
    }
  }

  const handleCategoryDelete = async (categoryId) => {
    try {
      // Check if category has tasks
      const categoryTasks = tasks.filter(task => task.categoryId === categoryId)
      if (categoryTasks.length > 0) {
        toast.error('Cannot delete category with existing tasks')
        return
      }

      await categoryService.delete(categoryId)
      setCategories(prev => prev.filter(category => category.Id !== categoryId))
      
      // Reset active category if deleted
      if (activeCategory === categoryId) {
        setActiveCategory('all')
      }
      
      toast.success('Category deleted successfully')
    } catch (error) {
      toast.error('Failed to delete category')
    }
  }

  // Search and filter handlers
  const handleSearch = (query) => {
    setSearchQuery(query)
  }

  const handleCategorySelect = (categoryId) => {
    setActiveCategory(categoryId)
  }

  // Calculate task counts for categories
  const getTaskCounts = () => {
    const counts = {}
    
    categories.forEach(category => {
      counts[category.Id] = tasks.filter(task => task.categoryId === category.Id).length
    })
    
    counts.today = tasks.filter(task => {
      if (!task.dueDate) return false
      const today = new Date()
      const taskDate = new Date(task.dueDate)
      return taskDate.toDateString() === today.toDateString()
    }).length
    
    counts.completed = tasks.filter(task => task.completed).length
    
    return counts
  }

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar
        categories={categories}
        activeCategory={activeCategory}
        onCategorySelect={handleCategorySelect}
        onCategoryCreate={handleCategoryCreate}
        onCategoryUpdate={handleCategoryUpdate}
        onCategoryDelete={handleCategoryDelete}
        taskCounts={getTaskCounts()}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <Header
          onSearch={handleSearch}
          onAddTask={() => setShowTaskForm(true)}
          searchValue={searchQuery}
          onSearchChange={setSearchQuery}
        />

        {/* Content Area */}
        <main className="flex-1 overflow-y-auto p-6">
<div className="max-w-4xl mx-auto">
            <TaskList
              tasks={tasks}
              categories={categories}
              loading={loading}
              error={error}
              onTaskUpdate={handleTaskUpdate}
              onTaskDelete={handleTaskDelete}
              onTaskComplete={handleTaskComplete}
              onRetry={loadData}
              searchQuery={searchQuery}
              activeCategory={activeCategory}
              selectedTasks={selectedTasks}
              onTaskSelect={setSelectedTasks}
              onBulkComplete={handleBulkComplete}
              onBulkDelete={handleBulkDelete}
              onBulkMoveCategory={handleBulkMoveCategory}
            />
          </div>

          {/* Floating Add Button */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="fixed bottom-6 right-6 lg:hidden"
          >
            <Button
              variant="primary"
              size="lg"
              icon="Plus"
              onClick={() => setShowTaskForm(true)}
              className="w-14 h-14 rounded-full shadow-lg"
            />
          </motion.div>
        </main>
      </div>

      {/* Task Form Modal */}
      <AnimatePresence>
        {showTaskForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowTaskForm(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-lg p-6 max-w-md w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <TaskForm
                categories={categories}
                onSave={handleTaskCreate}
                onCancel={() => setShowTaskForm(false)}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default Dashboard
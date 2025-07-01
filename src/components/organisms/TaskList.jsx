import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { isToday, isTomorrow, isPast, startOfDay, endOfDay, startOfWeek, endOfWeek } from 'date-fns'
import TaskCard from '@/components/molecules/TaskCard'
import FilterBar from '@/components/molecules/FilterBar'
import Button from '@/components/atoms/Button'
import ApperIcon from '@/components/ApperIcon'
import Loading from '@/components/ui/Loading'
import Error from '@/components/ui/Error'
import Empty from '@/components/ui/Empty'

const TaskList = ({ 
  tasks = [],
  categories = [],
  loading = false,
  error = null,
  onTaskUpdate,
  onTaskDelete,
  onTaskComplete,
  onRetry,
  searchQuery = '',
  activeCategory = 'all',
  className = '' 
}) => {
  const [filters, setFilters] = useState({
    priority: [],
    status: [],
    date: []
  })
  const [sortBy, setSortBy] = useState('createdAt')
  const [sortOrder, setSortOrder] = useState('desc')

  // Filter and sort tasks
  const filteredAndSortedTasks = useMemo(() => {
    let filtered = [...tasks]

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(task =>
        task.title.toLowerCase().includes(query) ||
        task.description?.toLowerCase().includes(query)
      )
    }

    // Apply category filter
    if (activeCategory !== 'all') {
      if (activeCategory === 'today') {
        filtered = filtered.filter(task => 
          task.dueDate && isToday(new Date(task.dueDate))
        )
      } else if (activeCategory === 'completed') {
        filtered = filtered.filter(task => task.completed)
      } else {
        filtered = filtered.filter(task => task.categoryId === activeCategory)
      }
    }

    // Apply priority filter
    if (filters.priority.length > 0) {
      filtered = filtered.filter(task => filters.priority.includes(task.priority))
    }

    // Apply status filter
    if (filters.status.length > 0) {
      if (filters.status.includes('completed')) {
        filtered = filtered.filter(task => task.completed)
      }
      if (filters.status.includes('pending')) {
        filtered = filtered.filter(task => !task.completed)
      }
    }

    // Apply date filter
    if (filters.date.length > 0) {
      filtered = filtered.filter(task => {
        if (!task.dueDate) return false
        const taskDate = new Date(task.dueDate)
        
        return filters.date.some(dateFilter => {
          switch (dateFilter) {
            case 'today':
              return isToday(taskDate)
            case 'tomorrow':
              return isTomorrow(taskDate)
            case 'overdue':
              return isPast(taskDate) && !isToday(taskDate)
            case 'this-week':
              const now = new Date()
              return taskDate >= startOfWeek(now) && taskDate <= endOfWeek(now)
            default:
              return false
          }
        })
      })
    }

    // Sort tasks
    filtered.sort((a, b) => {
      let aValue, bValue

      switch (sortBy) {
        case 'title':
          aValue = a.title.toLowerCase()
          bValue = b.title.toLowerCase()
          break
        case 'priority':
          const priorityOrder = { high: 3, medium: 2, low: 1 }
          aValue = priorityOrder[a.priority] || 0
          bValue = priorityOrder[b.priority] || 0
          break
        case 'dueDate':
          aValue = a.dueDate ? new Date(a.dueDate).getTime() : 0
          bValue = b.dueDate ? new Date(b.dueDate).getTime() : 0
          break
        case 'createdAt':
        default:
          aValue = new Date(a.createdAt).getTime()
          bValue = new Date(b.createdAt).getTime()
          break
      }

      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1
      } else {
        return aValue < bValue ? 1 : -1
      }
    })

    return filtered
  }, [tasks, searchQuery, activeCategory, filters, sortBy, sortOrder])

  const handleClearFilters = () => {
    setFilters({
      priority: [],
      status: [],
      date: []
    })
  }

  const toggleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
    } else {
      setSortBy(field)
      setSortOrder('desc')
    }
  }

  if (loading) {
    return <Loading />
  }

  if (error) {
    return <Error error={error} onRetry={onRetry} />
  }

  const getCategoryById = (categoryId) => {
    return categories.find(cat => cat.Id === categoryId)
  }

  const getCategoryName = (categoryId) => {
    if (categoryId === 'all') return 'All Tasks'
    if (categoryId === 'today') return 'Due Today'
    if (categoryId === 'completed') return 'Completed Tasks'
    const category = getCategoryById(categoryId)
    return category ? category.name : 'Unknown Category'
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header with Sort Options */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold font-display text-gray-900">
            {getCategoryName(activeCategory)}
          </h2>
          <p className="text-sm text-gray-600 mt-1">
            {filteredAndSortedTasks.length} {filteredAndSortedTasks.length === 1 ? 'task' : 'tasks'}
            {searchQuery && ` matching "${searchQuery}"`}
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <div className="flex items-center space-x-1 bg-white rounded-lg border border-gray-200 p-1">
            <Button
              variant={sortBy === 'createdAt' ? 'primary' : 'ghost'}
              size="sm"
              onClick={() => toggleSort('createdAt')}
            >
              Date
            </Button>
            <Button
              variant={sortBy === 'priority' ? 'primary' : 'ghost'}
              size="sm"
              onClick={() => toggleSort('priority')}
            >
              Priority
            </Button>
            <Button
              variant={sortBy === 'dueDate' ? 'primary' : 'ghost'}
              size="sm"
              onClick={() => toggleSort('dueDate')}
            >
              Due Date
            </Button>
          </div>

          <Button
            variant="ghost"
            size="sm"
            icon={sortOrder === 'asc' ? 'ArrowUp' : 'ArrowDown'}
            onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
          />
        </div>
      </div>

      {/* Filters */}
      <FilterBar
        filters={filters}
        onFilterChange={setFilters}
        onClearFilters={handleClearFilters}
      />

      {/* Task List */}
      {filteredAndSortedTasks.length === 0 ? (
        <Empty
          icon="CheckSquare"
          title="No tasks found"
          description={
            searchQuery 
              ? `No tasks match your search for "${searchQuery}"`
              : activeCategory === 'completed'
              ? "No completed tasks yet. Start by completing some tasks!"
              : activeCategory === 'today'
              ? "No tasks due today. You're all caught up!"
              : "No tasks in this category yet."
          }
          action={
            <Button variant="primary" icon="Plus">
              Add Your First Task
            </Button>
          }
        />
      ) : (
        <div className="space-y-3">
          <AnimatePresence>
            {filteredAndSortedTasks.map((task, index) => (
              <motion.div
                key={task.Id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ delay: index * 0.05 }}
                className="group"
              >
                <TaskCard
                  task={task}
                  category={getCategoryById(task.categoryId)}
                  onUpdate={onTaskUpdate}
                  onDelete={onTaskDelete}
                  onComplete={onTaskComplete}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  )
}

export default TaskList
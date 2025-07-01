export const getPriorityWeight = (priority) => {
  const weights = {
    high: 3,
    medium: 2,
    low: 1
  }
  return weights[priority] || 0
}

export const getPriorityColor = (priority) => {
  const colors = {
    high: 'text-red-600 bg-red-100',
    medium: 'text-amber-600 bg-amber-100', 
    low: 'text-green-600 bg-green-100'
  }
  return colors[priority] || 'text-gray-600 bg-gray-100'
}

export const getPriorityIcon = (priority) => {
  const icons = {
    high: 'AlertCircle',
    medium: 'Circle',
    low: 'Minus'
  }
  return icons[priority] || 'Circle'
}

export const filterTasksBySearch = (tasks, searchQuery) => {
  if (!searchQuery) return tasks
  
  const query = searchQuery.toLowerCase()
  return tasks.filter(task =>
    task.title.toLowerCase().includes(query) ||
    task.description?.toLowerCase().includes(query)
  )
}

export const filterTasksByCategory = (tasks, categoryId) => {
  if (categoryId === 'all') return tasks
  return tasks.filter(task => task.categoryId === categoryId)
}

export const filterTasksByStatus = (tasks, status) => {
  switch (status) {
    case 'completed':
      return tasks.filter(task => task.completed)
    case 'pending':
      return tasks.filter(task => !task.completed)
    default:
      return tasks
  }
}

export const sortTasks = (tasks, sortBy = 'createdAt', sortOrder = 'desc') => {
  return [...tasks].sort((a, b) => {
    let aValue, bValue
    
    switch (sortBy) {
      case 'title':
        aValue = a.title.toLowerCase()
        bValue = b.title.toLowerCase()
        break
      case 'priority':
        aValue = getPriorityWeight(a.priority)
        bValue = getPriorityWeight(b.priority)
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
}

export const getTaskStats = (tasks) => {
  const total = tasks.length
  const completed = tasks.filter(task => task.completed).length
  const pending = total - completed
  const highPriority = tasks.filter(task => task.priority === 'high' && !task.completed).length
  
  const overdue = tasks.filter(task => {
    if (!task.dueDate || task.completed) return false
    return new Date(task.dueDate) < new Date()
  }).length
  
  const dueToday = tasks.filter(task => {
    if (!task.dueDate || task.completed) return false
    const today = new Date()
    const taskDate = new Date(task.dueDate)
    return taskDate.toDateString() === today.toDateString()
  }).length
  
  return {
    total,
    completed,
    pending,
    highPriority,
    overdue,
    dueToday,
    completionRate: total > 0 ? Math.round((completed / total) * 100) : 0
  }
}
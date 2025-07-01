import { 
  format, 
  isToday, 
  isTomorrow, 
  isPast, 
  isThisWeek, 
  isThisMonth,
  differenceInDays,
  startOfDay,
  endOfDay
} from 'date-fns'

export const formatDueDate = (date) => {
  if (!date) return null
  
  const taskDate = new Date(date)
  
  if (isToday(taskDate)) return 'Today'
  if (isTomorrow(taskDate)) return 'Tomorrow'
  if (isPast(taskDate) && !isToday(taskDate)) {
    const daysOverdue = Math.abs(differenceInDays(taskDate, new Date()))
    return `${daysOverdue} day${daysOverdue > 1 ? 's' : ''} overdue`
  }
  
  const daysDiff = differenceInDays(taskDate, new Date())
  if (daysDiff <= 7) return `In ${daysDiff} day${daysDiff > 1 ? 's' : ''}`
  
  return format(taskDate, 'MMM d, yyyy')
}

export const getDueDateColor = (date) => {
  if (!date) return 'text-gray-500'
  
  const taskDate = new Date(date)
  if (isPast(taskDate) && !isToday(taskDate)) return 'text-red-600'
  if (isToday(taskDate)) return 'text-amber-600'
  if (isTomorrow(taskDate)) return 'text-blue-600'
  return 'text-gray-600'
}

export const getDueDateUrgency = (date) => {
  if (!date) return 'none'
  
  const taskDate = new Date(date)
  if (isPast(taskDate) && !isToday(taskDate)) return 'overdue'
  if (isToday(taskDate)) return 'today'
  if (isTomorrow(taskDate)) return 'tomorrow'
  
  const daysDiff = differenceInDays(taskDate, new Date())
  if (daysDiff <= 3) return 'soon'
  if (daysDiff <= 7) return 'this-week'
  
  return 'future'
}

export const sortTasksByDueDate = (tasks) => {
  return [...tasks].sort((a, b) => {
    // Tasks without due dates go to the end
    if (!a.dueDate && !b.dueDate) return 0
    if (!a.dueDate) return 1
    if (!b.dueDate) return -1
    
    return new Date(a.dueDate) - new Date(b.dueDate)
  })
}

export const groupTasksByDueDate = (tasks) => {
  const groups = {
    overdue: [],
    today: [],
    tomorrow: [],
    thisWeek: [],
    later: [],
    noDueDate: []
  }
  
  tasks.forEach(task => {
    if (!task.dueDate) {
      groups.noDueDate.push(task)
      return
    }
    
    const urgency = getDueDateUrgency(task.dueDate)
    switch (urgency) {
      case 'overdue':
        groups.overdue.push(task)
        break
      case 'today':
        groups.today.push(task)
        break
      case 'tomorrow':
        groups.tomorrow.push(task)
        break
      case 'this-week':
      case 'soon':
        groups.thisWeek.push(task)
        break
      default:
        groups.later.push(task)
    }
  })
  
  return groups
}
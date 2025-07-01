import { mockTasks } from '@/services/mockData/tasks.json'

class TaskService {
  constructor() {
    this.tasks = [...mockTasks]
    this.nextId = Math.max(...this.tasks.map(task => task.Id)) + 1
  }

  // Simulate API delay
  async delay(ms = 300) {
    return new Promise(resolve => setTimeout(resolve, ms))
  }

  async getAll() {
    await this.delay()
    return [...this.tasks].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
  }

  async getById(id) {
    await this.delay()
    const task = this.tasks.find(task => task.Id === parseInt(id))
    if (!task) {
      throw new Error('Task not found')
    }
    return { ...task }
  }

  async create(taskData) {
    await this.delay()
    
    const newTask = {
      Id: this.nextId++,
      title: taskData.title,
      description: taskData.description || '',
      categoryId: taskData.categoryId || null,
      priority: taskData.priority || 'medium',
      dueDate: taskData.dueDate || null,
      completed: false,
      createdAt: new Date().toISOString(),
      order: this.tasks.length
    }
    
    this.tasks.unshift(newTask)
    return { ...newTask }
  }

  async update(id, updateData) {
    await this.delay()
    
    const taskIndex = this.tasks.findIndex(task => task.Id === parseInt(id))
    if (taskIndex === -1) {
      throw new Error('Task not found')
    }
    
    this.tasks[taskIndex] = {
      ...this.tasks[taskIndex],
      ...updateData,
      Id: parseInt(id) // Ensure Id remains integer
    }
    
    return { ...this.tasks[taskIndex] }
  }

  async delete(id) {
    await this.delay()
    
    const taskIndex = this.tasks.findIndex(task => task.Id === parseInt(id))
    if (taskIndex === -1) {
      throw new Error('Task not found')
    }
    
    this.tasks.splice(taskIndex, 1)
    return true
  }

  async getByCategory(categoryId) {
    await this.delay()
    return this.tasks
      .filter(task => task.categoryId === categoryId)
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
  }

  async getCompleted() {
    await this.delay()
    return this.tasks
      .filter(task => task.completed)
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
  }

  async getPending() {
    await this.delay()
    return this.tasks
      .filter(task => !task.completed)
.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
  }

  // Bulk operations
  async bulkComplete(taskIds, completed) {
    await this.delay()
    
    const validIds = taskIds.map(id => parseInt(id)).filter(id => !isNaN(id))
    const updatedTasks = []
    
    for (const id of validIds) {
      const taskIndex = this.tasks.findIndex(task => task.Id === id)
      if (taskIndex !== -1) {
        this.tasks[taskIndex] = {
          ...this.tasks[taskIndex],
          completed
        }
        updatedTasks.push({ ...this.tasks[taskIndex] })
      }
    }
    
    if (updatedTasks.length === 0) {
      throw new Error('No valid tasks found for bulk completion')
    }
    
    return updatedTasks
  }

  async bulkDelete(taskIds) {
    await this.delay()
    
    const validIds = taskIds.map(id => parseInt(id)).filter(id => !isNaN(id))
    let deletedCount = 0
    
    for (const id of validIds) {
      const taskIndex = this.tasks.findIndex(task => task.Id === id)
      if (taskIndex !== -1) {
        this.tasks.splice(taskIndex, 1)
        deletedCount++
      }
    }
    
    if (deletedCount === 0) {
      throw new Error('No valid tasks found for bulk deletion')
    }
    
    return { deletedCount }
  }

  async bulkUpdateCategory(taskIds, categoryId) {
    await this.delay()
    
    const validIds = taskIds.map(id => parseInt(id)).filter(id => !isNaN(id))
    const updatedTasks = []
    
    for (const id of validIds) {
      const taskIndex = this.tasks.findIndex(task => task.Id === id)
      if (taskIndex !== -1) {
        this.tasks[taskIndex] = {
          ...this.tasks[taskIndex],
          categoryId: categoryId === 'none' ? null : categoryId
        }
        updatedTasks.push({ ...this.tasks[taskIndex] })
      }
    }
    
    if (updatedTasks.length === 0) {
      throw new Error('No valid tasks found for bulk category update')
    }
    
    return updatedTasks
  }
}

export const taskService = new TaskService()
import { mockCategories } from '@/services/mockData/categories.json'

class CategoryService {
  constructor() {
    this.categories = [...mockCategories]
    this.nextId = Math.max(...this.categories.map(category => category.Id)) + 1
  }

  // Simulate API delay
  async delay(ms = 250) {
    return new Promise(resolve => setTimeout(resolve, ms))
  }

  async getAll() {
    await this.delay()
    return [...this.categories].sort((a, b) => a.order - b.order)
  }

  async getById(id) {
    await this.delay()
    const category = this.categories.find(category => category.Id === parseInt(id))
    if (!category) {
      throw new Error('Category not found')
    }
    return { ...category }
  }

  async create(categoryData) {
    await this.delay()
    
    const newCategory = {
      Id: this.nextId++,
      name: categoryData.name,
      color: categoryData.color || '#8B5CF6',
      order: this.categories.length
    }
    
    this.categories.push(newCategory)
    return { ...newCategory }
  }

  async update(id, updateData) {
    await this.delay()
    
    const categoryIndex = this.categories.findIndex(category => category.Id === parseInt(id))
    if (categoryIndex === -1) {
      throw new Error('Category not found')
    }
    
    this.categories[categoryIndex] = {
      ...this.categories[categoryIndex],
      ...updateData,
      Id: parseInt(id) // Ensure Id remains integer
    }
    
    return { ...this.categories[categoryIndex] }
  }

  async delete(id) {
    await this.delay()
    
    const categoryIndex = this.categories.findIndex(category => category.Id === parseInt(id))
    if (categoryIndex === -1) {
      throw new Error('Category not found')
    }
    
    this.categories.splice(categoryIndex, 1)
    return true
  }
}

export const categoryService = new CategoryService()
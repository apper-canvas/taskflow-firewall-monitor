import { useState } from 'react'
import Button from '@/components/atoms/Button'
import ApperIcon from '@/components/ApperIcon'

const FilterBar = ({ 
  filters = {}, 
  onFilterChange,
  onClearFilters,
  className = '' 
}) => {
  const [showFilters, setShowFilters] = useState(false)

  const priorityOptions = [
    { value: 'high', label: 'High Priority', color: 'text-red-600' },
    { value: 'medium', label: 'Medium Priority', color: 'text-amber-600' },
    { value: 'low', label: 'Low Priority', color: 'text-green-600' }
  ]

  const statusOptions = [
    { value: 'pending', label: 'Pending' },
    { value: 'completed', label: 'Completed' }
  ]

  const dateOptions = [
    { value: 'today', label: 'Due Today' },
    { value: 'tomorrow', label: 'Due Tomorrow' },
    { value: 'overdue', label: 'Overdue' },
    { value: 'this-week', label: 'This Week' }
  ]

  const hasActiveFilters = Object.values(filters).some(filter => 
    Array.isArray(filter) ? filter.length > 0 : filter
  )

  const handleFilterToggle = (filterType, value) => {
    const currentFilter = filters[filterType] || []
    const newFilter = currentFilter.includes(value)
      ? currentFilter.filter(item => item !== value)
      : [...currentFilter, value]
    
    onFilterChange({ ...filters, [filterType]: newFilter })
  }

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-gray-700">Filters</h3>
        
        <div className="flex items-center space-x-2">
          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onClearFilters}
              icon="X"
            >
              Clear
            </Button>
          )}
          
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowFilters(!showFilters)}
            icon={showFilters ? "ChevronUp" : "ChevronDown"}
          >
            {showFilters ? 'Hide' : 'Show'} Filters
          </Button>
        </div>
      </div>

      {showFilters && (
        <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
          {/* Priority Filter */}
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-2">Priority</h4>
            <div className="flex flex-wrap gap-2">
              {priorityOptions.map(option => (
                <button
                  key={option.value}
                  onClick={() => handleFilterToggle('priority', option.value)}
                  className={`px-3 py-1 text-sm rounded-full border transition-all ${
                    filters.priority?.includes(option.value)
                      ? 'bg-primary-100 border-primary-300 text-primary-700'
                      : 'bg-white border-gray-200 text-gray-600 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center space-x-1">
                    <div className={`w-2 h-2 rounded-full ${
                      option.value === 'high' ? 'bg-red-500' :
                      option.value === 'medium' ? 'bg-amber-500' : 'bg-green-500'
                    }`} />
                    <span>{option.label}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Status Filter */}
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-2">Status</h4>
            <div className="flex flex-wrap gap-2">
              {statusOptions.map(option => (
                <button
                  key={option.value}
                  onClick={() => handleFilterToggle('status', option.value)}
                  className={`px-3 py-1 text-sm rounded-full border transition-all ${
                    filters.status?.includes(option.value)
                      ? 'bg-primary-100 border-primary-300 text-primary-700'
                      : 'bg-white border-gray-200 text-gray-600 hover:border-gray-300'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          {/* Date Filter */}
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-2">Due Date</h4>
            <div className="flex flex-wrap gap-2">
              {dateOptions.map(option => (
                <button
                  key={option.value}
                  onClick={() => handleFilterToggle('date', option.value)}
                  className={`px-3 py-1 text-sm rounded-full border transition-all ${
                    filters.date?.includes(option.value)
                      ? 'bg-primary-100 border-primary-300 text-primary-700'
                      : 'bg-white border-gray-200 text-gray-600 hover:border-gray-300'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default FilterBar
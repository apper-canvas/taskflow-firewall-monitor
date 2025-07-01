import { useState } from 'react'
import { motion } from 'framer-motion'
import SearchBar from '@/components/molecules/SearchBar'
import Button from '@/components/atoms/Button'
import ApperIcon from '@/components/ApperIcon'

const Header = ({ 
  onSearch, 
  onAddTask,
  searchValue = '',
  onSearchChange,
  className = '' 
}) => {
  const [showMobileSearch, setShowMobileSearch] = useState(false)

  return (
    <header className={`bg-white border-b border-gray-200 ${className}`}>
      <div className="px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo and Title */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-primary-500 to-primary-600 rounded-lg flex items-center justify-center">
                <ApperIcon name="CheckSquare" size={20} className="text-white" />
              </div>
              <h1 className="text-2xl font-bold font-display bg-gradient-to-r from-primary-600 to-primary-700 bg-clip-text text-transparent">
                TaskFlow
              </h1>
            </div>
          </div>

          {/* Desktop Search and Actions */}
          <div className="hidden md:flex items-center space-x-4 flex-1 max-w-2xl mx-8">
            <SearchBar
              onSearch={onSearch}
              value={searchValue}
              onChange={onSearchChange}
              placeholder="Search tasks, categories, or descriptions..."
              className="flex-1"
            />
          </div>

          <div className="flex items-center space-x-3">
            {/* Mobile Search Toggle */}
            <Button
              variant="ghost"
              size="sm"
              icon="Search"
              onClick={() => setShowMobileSearch(!showMobileSearch)}
              className="md:hidden"
            />

            {/* Add Task Button */}
            <Button
              variant="primary"
              onClick={onAddTask}
              icon="Plus"
              className="hidden sm:flex"
            >
              Add Task
            </Button>

            {/* Mobile Add Task */}
            <Button
              variant="primary"
              size="sm"
              icon="Plus"
              onClick={onAddTask}
              className="sm:hidden"
            />

            {/* Quick Actions */}
            <div className="hidden lg:flex items-center space-x-2">
              <Button variant="ghost" size="sm" icon="Filter">
                Filter
              </Button>
              <Button variant="ghost" size="sm" icon="SortDesc">
                Sort
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile Search Bar */}
        {showMobileSearch && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden mt-4"
          >
            <SearchBar
              onSearch={onSearch}
              value={searchValue}
              onChange={onSearchChange}
              placeholder="Search tasks..."
            />
          </motion.div>
        )}

        {/* Stats Bar */}
        <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-gradient-to-r from-primary-50 to-primary-100 p-3 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-primary-600 font-medium">Total Tasks</p>
                <p className="text-2xl font-bold text-primary-700">24</p>
              </div>
              <ApperIcon name="CheckSquare" size={24} className="text-primary-500" />
            </div>
          </div>

          <div className="bg-gradient-to-r from-green-50 to-green-100 p-3 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-green-600 font-medium">Completed</p>
                <p className="text-2xl font-bold text-green-700">18</p>
              </div>
              <ApperIcon name="CheckCircle" size={24} className="text-green-500" />
            </div>
          </div>

          <div className="bg-gradient-to-r from-amber-50 to-amber-100 p-3 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-amber-600 font-medium">Due Today</p>
                <p className="text-2xl font-bold text-amber-700">3</p>
              </div>
              <ApperIcon name="Calendar" size={24} className="text-amber-500" />
            </div>
          </div>

          <div className="bg-gradient-to-r from-red-50 to-red-100 p-3 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-red-600 font-medium">Overdue</p>
                <p className="text-2xl font-bold text-red-700">2</p>
              </div>
              <ApperIcon name="AlertCircle" size={24} className="text-red-500" />
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header
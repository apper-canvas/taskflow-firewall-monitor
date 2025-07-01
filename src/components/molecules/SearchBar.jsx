import React, { useState } from "react";
import Input from "@/components/atoms/Input";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";
const SearchBar = ({
  onSearch, 
  placeholder = "Search tasks...", 
  className = '',
  value = '',
  onChange 
}) => {
  const [searchTerm, setSearchTerm] = useState(value)

  const handleSearch = (e) => {
    e.preventDefault()
    onSearch(searchTerm)
  }

  const handleInputChange = (e) => {
    const newValue = e.target.value
    setSearchTerm(newValue)
    if (onChange) {
      onChange(newValue)
    }
  }

  const handleClear = () => {
    setSearchTerm('')
    if (onChange) {
      onChange('')
    }
    onSearch('')
  }

  return (
    <form onSubmit={handleSearch} className={`flex space-x-2 ${className}`}>
      <div className="flex-1 relative">
        <Input
          type="text"
          placeholder={placeholder}
          value={searchTerm}
          onChange={handleInputChange}
          icon="Search"
          iconPosition="left"
          className={searchTerm ? 'pr-10' : ''}
        />
        {searchTerm && (
<button
            type="button"
            onClick={handleClear}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <ApperIcon name="X" size={16} />
          </button>
        )}
      </div>
      <Button type="submit" variant="primary" icon="Search">
        Search
      </Button>
    </form>
  )
}

export default SearchBar
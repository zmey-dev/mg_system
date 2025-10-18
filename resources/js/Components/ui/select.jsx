import * as React from "react"

const SelectContext = React.createContext({})

const Select = ({ children, value, onValueChange, defaultValue }) => {
  const [isOpen, setIsOpen] = React.useState(false)
  const [internalValue, setInternalValue] = React.useState(value || defaultValue || '')
  const [itemsMap, setItemsMap] = React.useState(new Map())
  const triggerRef = React.useRef(null)

  // Update internal value when prop value changes
  React.useEffect(() => {
    if (value !== undefined) {
      setInternalValue(value)
    }
  }, [value])

  const handleValueChange = (newValue) => {
    setInternalValue(newValue)
    onValueChange?.(newValue)
    setIsOpen(false)
  }

  const registerItem = React.useCallback((itemValue, label) => {
    setItemsMap(prev => {
      const newMap = new Map(prev)
      newMap.set(itemValue, label)
      return newMap
    })
  }, [])

  const unregisterItem = React.useCallback((itemValue) => {
    setItemsMap(prev => {
      const newMap = new Map(prev)
      newMap.delete(itemValue)
      return newMap
    })
  }, [])

  const getLabel = React.useCallback((itemValue) => {
    return itemsMap.get(itemValue) || ''
  }, [itemsMap])

  return (
    <SelectContext.Provider value={{
      isOpen,
      setIsOpen,
      value: internalValue,
      onValueChange: handleValueChange,
      registerItem,
      unregisterItem,
      getLabel,
      triggerRef
    }}>
      <div className="relative">
        {children}
      </div>
    </SelectContext.Provider>
  )
}

const SelectTrigger = React.forwardRef(({ className, children, ...props }, ref) => {
  const { isOpen, setIsOpen, triggerRef } = React.useContext(SelectContext)

  const handleClick = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setIsOpen(!isOpen)
  }

  return (
    <button
      type="button"
      className={`flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${className || ''}`}
      ref={(node) => {
        triggerRef.current = node
        if (typeof ref === 'function') ref(node)
        else if (ref) ref.current = node
      }}
      onClick={handleClick}
      {...props}
    >
      {children}
      <svg
        className={`h-4 w-4 opacity-50 transition-transform ${isOpen ? 'rotate-180' : ''}`}
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <polyline points="6 9 12 15 18 9" />
      </svg>
    </button>
  )
})
SelectTrigger.displayName = "SelectTrigger"

const SelectValue = ({ placeholder }) => {
  const { value, getLabel } = React.useContext(SelectContext)
  const displayValue = getLabel(value)

  return (
    <span className="pointer-events-none">
      {displayValue || placeholder}
    </span>
  )
}

const SelectContent = ({ className, children, ...props }) => {
  const { isOpen, setIsOpen, triggerRef } = React.useContext(SelectContext)
  const contentRef = React.useRef(null)

  React.useEffect(() => {
    const handleClickOutside = (event) => {
      // Don't close if clicking the trigger
      if (triggerRef.current && triggerRef.current.contains(event.target)) {
        return
      }

      if (contentRef.current && !contentRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      return () => document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen, setIsOpen, triggerRef])

  // Always render children so items can register themselves
  return (
    <div
      ref={contentRef}
      style={{
        visibility: isOpen ? 'visible' : 'hidden',
        pointerEvents: isOpen ? 'auto' : 'none',
        opacity: isOpen ? 1 : 0
      }}
      className={`absolute z-[100] mt-1 max-h-60 w-full overflow-auto rounded-md border bg-popover text-popover-foreground shadow-md transition-opacity ${className || ''}`}
      {...props}
    >
      <div className="p-1">
        {children}
      </div>
    </div>
  )
}

const SelectItem = React.forwardRef(({ className, children, value: itemValue, ...props }, ref) => {
  const { value: selectedValue, onValueChange, registerItem, unregisterItem } = React.useContext(SelectContext)
  const isSelected = selectedValue === itemValue

  // Register this item's label when it mounts
  React.useEffect(() => {
    const label = typeof children === 'string' ? children : children?.toString() || ''
    registerItem(itemValue, label)
    return () => unregisterItem(itemValue)
  }, [itemValue, children, registerItem, unregisterItem])

  const handleClick = (e) => {
    e.preventDefault()
    e.stopPropagation()
    onValueChange(itemValue)
  }

  return (
    <button
      type="button"
      ref={ref}
      className={`relative flex w-full cursor-pointer select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none hover:bg-accent hover:text-accent-foreground ${
        isSelected ? 'bg-accent text-accent-foreground' : ''
      } ${className || ''}`}
      onClick={handleClick}
      {...props}
    >
      {isSelected && (
        <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
          <svg
            className="h-4 w-4"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </span>
      )}
      {children}
    </button>
  )
})
SelectItem.displayName = "SelectItem"

export {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
}

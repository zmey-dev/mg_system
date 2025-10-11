import * as React from "react"

const Select = ({ children, value, onValueChange }) => {
  return (
    <div className="relative">
      {React.Children.map(children, child => {
        if (child.type === SelectTrigger) {
          return React.cloneElement(child, { value, onValueChange })
        }
        if (child.type === SelectContent) {
          return React.cloneElement(child, { value, onValueChange })
        }
        return child
      })}
    </div>
  )
}

const SelectTrigger = React.forwardRef(({ className, children, value, onValueChange, ...props }, ref) => (
  <button
    className={`flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${className || ''}`}
    ref={ref}
    {...props}
  >
    {children}
  </button>
))
SelectTrigger.displayName = "SelectTrigger"

const SelectValue = ({ placeholder }) => (
  <span className="pointer-events-none">{placeholder}</span>
)

const SelectContent = ({ className, children, value, onValueChange, ...props }) => {
  const [isOpen, setIsOpen] = React.useState(false)

  return (
    <div
      className={`relative z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover text-popover-foreground shadow-md ${isOpen ? 'block' : 'hidden'} ${className || ''}`}
      {...props}
    >
      <div className="p-1">
        {React.Children.map(children, child =>
          React.cloneElement(child, { onValueChange, onSelect: () => setIsOpen(false) })
        )}
      </div>
    </div>
  )
}

const SelectItem = React.forwardRef(({ className, children, value, onValueChange, onSelect, ...props }, ref) => (
  <button
    ref={ref}
    className={`relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 ${className || ''}`}
    onClick={() => {
      onValueChange?.(value)
      onSelect?.()
    }}
    {...props}
  >
    {children}
  </button>
))
SelectItem.displayName = "SelectItem"

export {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
}
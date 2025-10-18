import * as React from "react"

const TabsContext = React.createContext({})

const Tabs = ({ defaultValue, value, onValueChange, children, className, ...props }) => {
  const [internalValue, setInternalValue] = React.useState(defaultValue || value)

  const currentValue = value !== undefined ? value : internalValue
  const handleValueChange = (newValue) => {
    if (value === undefined) {
      setInternalValue(newValue)
    }
    onValueChange?.(newValue)
  }

  return (
    <TabsContext.Provider value={{ currentValue, onValueChange: handleValueChange }}>
      <div className={className} {...props}>
        {children}
      </div>
    </TabsContext.Provider>
  )
}

const TabsList = React.forwardRef(({ className, children, ...domProps }, ref) => {
  const { currentValue, onValueChange } = React.useContext(TabsContext)

  return (
    <div
      ref={ref}
      className={`inline-flex items-center justify-center rounded-md bg-muted p-1 text-muted-foreground ${className || ''}`}
      {...domProps}
    >
      {React.Children.map(children, child =>
        React.isValidElement(child) ? React.cloneElement(child, { currentValue, onValueChange }) : child
      )}
    </div>
  );
})
TabsList.displayName = "TabsList"

const TabsTrigger = React.forwardRef(({ className, children, value, currentValue, onValueChange, ...props }, ref) => {
  return (
    <button
      ref={ref}
      type="button"
      className={`inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 ${
        currentValue === value ? 'bg-background text-foreground shadow-sm' : ''
      } ${className || ''}`}
      onClick={() => onValueChange?.(value)}
      {...props}
    >
      {children}
    </button>
  );
})
TabsTrigger.displayName = "TabsTrigger"

const TabsContent = React.forwardRef(({ className, children, value, ...domProps }, ref) => {
  const { currentValue } = React.useContext(TabsContext)

  return (
    <div
      ref={ref}
      className={`mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ${
        currentValue === value ? 'block' : 'hidden'
      } ${className || ''}`}
      {...domProps}
    >
      {children}
    </div>
  );
})
TabsContent.displayName = "TabsContent"

export { Tabs, TabsList, TabsTrigger, TabsContent }
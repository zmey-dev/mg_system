import * as React from "react"

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
    <div className={className} {...props}>
      {React.Children.map(children, child =>
        React.cloneElement(child, { value: currentValue, onValueChange: handleValueChange })
      )}
    </div>
  )
}

const TabsList = React.forwardRef(({ className, children, value, onValueChange, ...props }, ref) => {
  // Extract onValueChange from props to avoid passing it to DOM
  const { onValueChange: _, ...domProps } = props;

  return (
    <div
      ref={ref}
      className={`inline-flex h-10 items-center justify-center rounded-md bg-muted p-1 text-muted-foreground ${className || ''}`}
      {...domProps}
    >
      {React.Children.map(children, child =>
        React.cloneElement(child, { value, onValueChange })
      )}
    </div>
  );
})
TabsList.displayName = "TabsList"

const TabsTrigger = React.forwardRef(({ className, children, value: triggerValue, value: currentValue, onValueChange, ...props }, ref) => (
  <button
    ref={ref}
    className={`inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 ${
      currentValue === triggerValue ? 'bg-background text-foreground shadow-sm' : ''
    } ${className || ''}`}
    onClick={() => onValueChange?.(triggerValue)}
    {...props}
  >
    {children}
  </button>
))
TabsTrigger.displayName = "TabsTrigger"

const TabsContent = React.forwardRef(({ className, children, value: contentValue, value: currentValue, onValueChange, ...props }, ref) => {
  // Extract onValueChange from props to avoid passing it to DOM
  const { onValueChange: _, ...domProps } = { onValueChange, ...props };

  return (
    <div
      ref={ref}
      className={`mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ${
        currentValue === contentValue ? 'block' : 'hidden'
      } ${className || ''}`}
      {...domProps}
    >
      {children}
    </div>
  );
})
TabsContent.displayName = "TabsContent"

export { Tabs, TabsList, TabsTrigger, TabsContent }
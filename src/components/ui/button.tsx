import * as React from "react"
import { cn } from "@/lib/utils"

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "outline" | "ghost"
  size?: "sm" | "default" | "lg"
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "default", ...props }, ref) => {
    const baseClasses = "inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background"
    
    let variantClasses = ""
    if (variant === "default") {
      variantClasses = "bg-primary text-primary-foreground hover:bg-primary/90"
    } else if (variant === "outline") {
      variantClasses = "border border-input hover:bg-accent hover:text-accent-foreground"
    } else if (variant === "ghost") {
      variantClasses = "hover:bg-accent hover:text-accent-foreground"
    }
    
    let sizeClasses = ""
    if (size === "sm") {
      sizeClasses = "h-8 px-3 text-xs"
    } else if (size === "lg") {
      sizeClasses = "h-11 px-8 text-base"
    } else {
      sizeClasses = "h-10 px-4 text-sm"
    }
    
    return (
      <button
        className={cn(baseClasses, variantClasses, sizeClasses, className)}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button }

export function buttonVariants({ variant = "default", size = "default" }: { variant?: "default" | "outline" | "ghost"; size?: "sm" | "default" | "lg" } = {}) {
  const baseClasses = "inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background"
  
  let variantClasses = ""
  if (variant === "default") {
    variantClasses = "bg-primary text-primary-foreground hover:bg-primary/90"
  } else if (variant === "outline") {
    variantClasses = "border border-input hover:bg-accent hover:text-accent-foreground"
  } else if (variant === "ghost") {
    variantClasses = "hover:bg-accent hover:text-accent-foreground"
  }
  
  let sizeClasses = ""
  if (size === "sm") {
    sizeClasses = "h-8 px-3 text-xs"
  } else if (size === "lg") {
    sizeClasses = "h-11 px-8 text-base"
  } else {
    sizeClasses = "h-10 px-4 text-sm"
  }
  
  return cn(baseClasses, variantClasses, sizeClasses)
}

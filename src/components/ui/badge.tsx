import * as React from "react"
import { cn } from "@/lib/utils"

export interface BadgeProps extends React.HTMLProps<HTMLSpanElement> {
  variant?: "default" | "secondary"
}

const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, variant = "default", ...props }, ref) => {
    let variantClasses = ""
    if (variant === "secondary") {
      variantClasses = "bg-secondary text-secondary-foreground"
    } else {
      variantClasses = "bg-primary text-primary-foreground"
    }
    
    return (
      <span className={cn("inline-flex items-center px-2 py-1 text-sm font-medium rounded-full", variantClasses, className)} ref={ref} {...props} />
    )
  }
)
Badge.displayName = "Badge"

export { Badge }


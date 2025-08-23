import * as React from "react"
import { cn } from "@/lib/utils"

const Card = React.forwardRef<HTMLDivElement, React.HTMLProps<HTMLDivElement>>(
  ({ className, ...props }, ref) => {
    return (
      <div className={cn("border rounded-lg p-4", className)} ref={ref} {...props} />
    )
  }
)
Card.displayName = "Card"

export { Card }

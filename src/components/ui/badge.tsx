import * as React from "react"
import { cn } from "@/lib/utils"

const Badge = React.forwardRef<HTMLSpanElement, React.HTMLProps<HTMLSpanElement>>(
  ({ className, ...props }, ref) => {
    return (
      <span className={cn("inline-flex items-center px-2 py-1 text-sm font-medium rounded-full", className)} ref={ref} {...props} />
    )
  }
)
Badge.displayName = "Badge"

export { Badge }

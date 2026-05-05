import * as React from "react"

import { cn } from "@/lib/utils"

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, type, ...props }, ref) => {
     return (
      <input
        type={type}
        className={cn(
          "flex h-12 w-full rounded-2xl border border-white/12 bg-black/25 px-4 py-3 text-sm text-foreground shadow-[0_18px_34px_rgba(0,0,0,0.14)] backdrop-blur-xl transition-all duration-300 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground/80 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/25 focus-visible:border-primary/60 disabled:cursor-not-allowed disabled:opacity-50", 
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"

export { Input }

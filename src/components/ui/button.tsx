import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-semibold transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default:
          "bg-gradient-to-r from-primary via-[#ffb347] to-accent text-primary-foreground shadow-[0_14px_40px_rgba(255,186,73,0.28)] hover:-translate-y-0.5 hover:brightness-105",
        destructive:
          "bg-gradient-to-r from-red-600 to-orange-500 text-white shadow-[0_14px_34px_rgba(220,38,38,0.28)] hover:-translate-y-0.5 hover:brightness-105",
        outline:
          "border border-white/12 bg-white/6 text-foreground backdrop-blur-xl shadow-[0_10px_30px_rgba(0,0,0,0.18)] hover:border-primary/40 hover:bg-white/10",
        secondary:
          "bg-white/8 text-foreground shadow-[0_10px_30px_rgba(0,0,0,0.18)] hover:bg-white/12",
        ghost: "text-foreground/80 hover:bg-white/8 hover:text-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-11 px-4 py-2",
        sm: "h-9 rounded-lg px-3 text-xs",
        lg: "h-12 rounded-xl px-8 text-base",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }

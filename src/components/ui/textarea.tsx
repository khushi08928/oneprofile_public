import * as React from "react"

import { cn } from "@/lib/utils"

const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  React.ComponentProps<"textarea">
>(({ className, ...props }, ref) => {
  return (
    <textarea
      className={cn(
        "flex min-h-[80px] w-full rounded-xl border-2 border-[#2C3947]/20 hover:border-[#2C3947]/50 bg-white px-3.5 py-2 text-base text-[#2C3947] transition-all placeholder:text-muted-foreground/50 focus-visible:outline-none focus-visible:border-[#2C3947] focus-visible:ring-0 focus-visible:shadow-[2px_2px_0px_0px_rgba(44,57,71,1)] disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        className
      )}
      ref={ref}
      {...props}
    />
  )
})
Textarea.displayName = "Textarea"

export { Textarea }

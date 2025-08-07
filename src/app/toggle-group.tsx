import { cn } from "@/lib/utils"
import { ReactNode } from "react"

interface ToggleGroupProps {
  children: ReactNode
  className?: string
}

interface ToggleGroupItemProps {
  value: string
  children: ReactNode
  isActive?: boolean
  onClick: () => void
}

export function ToggleGroup({
  children,
  className,
}: ToggleGroupProps) {
  return (
    <div
      role="group"
      className={cn(
        "inline-flex items-center border rounded-md overflow-hidden",
        className
      )}
    >
      {children}
    </div>
  )
}

export function ToggleGroupItem({
  value,
  children,
  isActive = false,
  onClick,
}: ToggleGroupItemProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "px-4 py-2 text-sm font-medium focus:outline-none transition-colors",
        isActive
          ? "bg-black text-white"
          : "bg-white text-black hover:bg-muted"
      )}
    >
      {children}
    </button>
  )
}

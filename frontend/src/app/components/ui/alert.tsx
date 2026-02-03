import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "./utils"
import {
  CheckCircle,
  XCircle,
  AlertTriangle,
  Info,
} from "lucide-react"

const alertVariants = cva(
  "relative w-full rounded-xl px-4 py-3 text-sm leading-relaxed border overflow-hidden",
  {
    variants: {
      variant: {
        default: "bg-muted text-foreground border-border",

        success:
          "bg-green-500/10 text-green-700 border-green-500/30",

        error:
          "bg-red-500/10 text-red-700 border-red-500/30",

        warning:
          "bg-yellow-500/10 text-yellow-800 border-yellow-500/30",

        info:
          "bg-blue-500/10 text-blue-700 border-blue-500/30",
      },

      toast: {
        true: `
    fixed top-6 right-6 z-50 w-[320px]
    shadow-2xl ring-1 ring-black/10
    backdrop-blur-md
    transform-gpu
    will-change-transform will-change-opacity
  `,
        false: "",
      },

    },

    defaultVariants: {
      variant: "default",
      toast: false,
    },
  }
)

export interface AlertProps
  extends React.HTMLAttributes<HTMLDivElement>,
  VariantProps<typeof alertVariants> {
  duration?: number // ms
}

const icons = {
  success: CheckCircle,
  error: XCircle,
  warning: AlertTriangle,
  info: Info,
}

export function Alert({
  className,
  variant = "default",
  toast,
  duration = 3000,
  children,
  ...props
}: AlertProps) {
  const Icon = icons[variant as keyof typeof icons]
  const [leaving, setLeaving] = React.useState(false)

  React.useEffect(() => {
    if (!toast) return

    const t = setTimeout(() => {
      setLeaving(true)
    }, duration - 200) // chừa thời gian animation out

    return () => clearTimeout(t)
  }, [toast, duration])

  return (
    <div
      role="alert"
      className={cn(
        alertVariants({ variant, toast }),
        toast &&
        (leaving
          ? "animate-[toast-out_200ms_ease-in_forwards]"
          : "animate-[toast-in_200ms_cubic-bezier(0.16,1,0.3,1)]"),
        className
      )}
      {...props}
    >
      <div className="flex gap-3">
        {Icon && <Icon className="mt-0.5 h-5 w-5 flex-shrink-0" />}
        <div className="flex-1">{children}</div>
      </div>

      {toast && (
        <span
          className={cn(
            "absolute bottom-0 left-0 h-[3px] w-full origin-left",
            variant === "success" && "bg-green-500",
            variant === "error" && "bg-red-500",
            variant === "warning" && "bg-yellow-500",
            variant === "info" && "bg-blue-500"
          )}
          style={{
            animation: `toast-progress ${duration}ms linear forwards`,
          }}
        />
      )}
    </div>
  )
}

export function AlertTitle({
  className,
  ...props
}: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h5
      className={cn("mb-1 font-semibold leading-none", className)}
      {...props}
    />
  )
}

export function AlertDescription({
  className,
  ...props
}: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p
      className={cn("text-sm opacity-90", className)}
      {...props}
    />
  )
}

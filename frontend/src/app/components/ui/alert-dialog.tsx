import * as React from "react"
import { cn } from "./utils"
import { X } from "lucide-react"

interface AlertDialogProps {
  open: boolean
  onClose: () => void
  children: React.ReactNode
}

export function AlertDialog({
  open,
  onClose,
  children,
}: AlertDialogProps) {
  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-50 grid place-content-center bg-black/50 p-4"
      role="dialog"
      aria-modal="true"
      onClick={onClose}
    >
      <div
        className={cn(
          "w-full max-w-md rounded-lg bg-white p-6 shadow-lg",
          "animate-[alert-dialog-in_200ms_cubic-bezier(0.16,1,0.3,1)]"
        )}
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  )
}

/* ---------- Sub components ---------- */

export function AlertDialogHeader({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex items-start justify-between">
      {children}
    </div>
  )
}

export function AlertDialogTitle({
  className,
  ...props
}: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h2
      className={cn(
        "text-xl font-bold text-gray-900 sm:text-2xl",
        className
      )}
      {...props}
    />
  )
}

export function AlertDialogClose({
  onClick,
}: {
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label="Close"
      className="-me-4 -mt-4 rounded-full p-2 text-gray-400 transition hover:bg-gray-50 hover:text-gray-600"
    >
      <X className="h-5 w-5" />
    </button>
  )
}

export function AlertDialogDescription({
  className,
  ...props
}: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p
      className={cn("mt-4 text-gray-700 leading-relaxed", className)}
      {...props}
    />
  )
}

export function AlertDialogFooter({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <footer
      className={cn("mt-6 flex justify-end gap-2", className)}
      {...props}
    />
  )
}

export function AlertDialogCancel({
  className,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      type="button"
      className={cn(
        "rounded bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 transition-all duration-200 \
   hover:bg-gray-200 hover:-translate-y-1 hover:shadow-lg active:translate-y-0",
        className
      )}
      {...props}
    />
  )
}

export function AlertDialogAction({
  className,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      type="button"
      className={cn(
        "rounded btn-gradient px-4 py-2 text-sm font-medium text-white transition",
        className
      )}
      {...props}
    />
  )
}

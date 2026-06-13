import * as React from "react"
import { cn } from "@/lib/utils"

interface InputV2Props extends React.ComponentProps<"input"> {
  label: string
}

function InputV2({ className, type, label, id, ...props }: InputV2Props) {
  // Generar un id único si no se pasa uno para mantener la accesibilidad del label
  const generatedId = React.useId()
  const inputId = id || generatedId

  return (
    <div className="relative w-full group flex flex-col justify-end h-11">
      <input
        type={type}
        id={inputId}
        placeholder=" " // CRÍTICO: Debe ser un espacio en blanco para activar peer-placeholder-shown
        data-slot="input"
        className={cn(
          "peer h-11 w-full min-w-0 border bg-background border-border px-3 pt-4 pb-1 text-xs transition-all outline-none rounded-md text-foreground",
          "disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50",
          "focus-visible:border-ring focus-visible:ring-ring focus-visible:ring-[1px]",
          "aria-invalid:ring-destructive/20 aria-invalid:border-destructive",
          className
        )}
        {...props}
      />
      <label
        htmlFor={inputId}
        className={cn(
          "absolute left-3 top-1 text-[10px] text-muted-foreground pointer-events-none transition-all origin-left select-none",
          "peer-placeholder-shown:top-3 peer-placeholder-shown:text-xs",
          "peer-focus:top-1 peer-focus:text-[10px] peer-focus:text-muted-foreground"
        )}
      >
        {label}
      </label>
    </div>
  )
}

export { InputV2 }
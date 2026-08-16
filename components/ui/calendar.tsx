// File: frontend/components/ui/calendar.tsx
import * as React from "react"
import {
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from "lucide-react"
import {
  DayPicker,
  getDefaultClassNames,
  type DayButton,
} from "react-day-picker"

import { cn } from "@/lib/utils"
import { Button, buttonVariants } from "@/components/ui/button"

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  captionLayout = "label",
  buttonVariant = "ghost",
  formatters,
  components,
  ...props
}: React.ComponentProps<typeof DayPicker> & {
  buttonVariant?: React.ComponentProps<typeof Button>["variant"]
}) {
  const defaultClassNames = getDefaultClassNames()

  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn(
        "group/calendar bg-white p-3 [--cell-size:--spacing(8)] rounded-xl border border-slate-200 shadow-sm",
        String.raw`rtl:**:[.rdp-button\_next>svg]:rotate-180`,
        String.raw`rtl:**:[.rdp-button\_previous>svg]:rotate-180`,
        className
      )}
      captionLayout={captionLayout}
      formatters={{
        formatMonthDropdown: (date) =>
          date.toLocaleString("default", { month: "short" }),
        ...formatters,
      }}
      classNames={{
        root: cn("w-fit", defaultClassNames.root),
        months: cn(
          "relative flex flex-col gap-4 md:flex-row",
          defaultClassNames.months
        ),
        month: cn("flex w-full flex-col gap-4", defaultClassNames.month),
        nav: cn(
          "absolute inset-x-0 top-0 flex w-full items-center justify-between gap-1 z-10",
          defaultClassNames.nav
        ),
        button_previous: cn(
          buttonVariants({ variant: buttonVariant }),
          "size-(--cell-size) p-0 select-none hover:bg-slate-100 text-slate-600 rounded-md transition-colors",
          defaultClassNames.button_previous
        ),
        button_next: cn(
          buttonVariants({ variant: buttonVariant }),
          "size-(--cell-size) p-0 select-none hover:bg-slate-100 text-slate-600 rounded-md transition-colors",
          defaultClassNames.button_next
        ),
        month_caption: cn(
          "flex h-(--cell-size) w-full items-center justify-center px-(--cell-size) font-semibold text-slate-800 text-sm",
          defaultClassNames.month_caption
        ),
        dropdowns: cn(
          "flex h-(--cell-size) w-full items-center justify-center gap-1.5 text-sm font-medium",
          defaultClassNames.dropdowns
        ),
        dropdown_root: cn(
          "relative rounded-md border border-slate-200 shadow-xs has-focus:border-blue-500",
          defaultClassNames.dropdown_root
        ),
        dropdown: cn(
          "absolute inset-0 bg-white opacity-0",
          defaultClassNames.dropdown
        ),
        caption_label: cn(
          "font-semibold text-slate-800 select-none text-sm",
          defaultClassNames.caption_label
        ),
        weekdays: cn("flex justify-between", defaultClassNames.weekdays),
        weekday: cn(
          "flex-1 rounded-md text-[0.75rem] font-medium text-slate-400 select-none text-center uppercase tracking-wider",
          defaultClassNames.weekday
        ),
        week: cn("mt-1.5 flex w-full justify-between", defaultClassNames.week),
        week_number_header: cn(
          "w-(--cell-size) select-none",
          defaultClassNames.week_number_header
        ),
        week_number: cn(
          "text-[0.8rem] text-slate-400 select-none",
          defaultClassNames.week_number
        ),
        day: cn(
          "group/day relative aspect-square h-full w-full p-0 text-center select-none",
          defaultClassNames.day
        ),
        range_start: cn(
          "rounded-l-md !bg-blue-50",
          defaultClassNames.range_start
        ),
        range_middle: cn(
          "rounded-none !bg-blue-50",
          defaultClassNames.range_middle
        ),
        range_end: cn(
          "rounded-r-md !bg-blue-50",
          defaultClassNames.range_end
        ),
        today: cn(
          "font-bold text-blue-600 bg-blue-50/50 rounded-md",
          defaultClassNames.today
        ),
        outside: cn(
          "text-slate-300 opacity-40 aria-selected:text-slate-400",
          defaultClassNames.outside
        ),
        disabled: cn(
          "text-slate-300 opacity-40",
          defaultClassNames.disabled
        ),
        hidden: cn("invisible", defaultClassNames.hidden),
        ...classNames,
      }}
      components={{
        Root: ({ className, rootRef, ...props }) => {
          return (
            <div
              data-slot="calendar"
              ref={rootRef}
              className={cn(className)}
              {...props}
            />
          )
        },
        Chevron: ({ className, orientation, ...props }) => {
          if (orientation === "left") {
            return (
              <ChevronLeftIcon className={cn("size-4 text-slate-600", className)} {...props} />
            )
          }

          if (orientation === "right") {
            return (
              <ChevronRightIcon
                className={cn("size-4 text-slate-600", className)}
                {...props}
              />
            )
          }

          return (
            <ChevronDownIcon className={cn("size-4 text-slate-600", className)} {...props} />
          )
        },
        DayButton: CalendarDayButton,
        WeekNumber: ({ children, ...props }) => {
          return (
            <td {...props}>
              <div className="flex size-(--cell-size) items-center justify-center text-center">
                {children}
              </div>
            </td>
          )
        },
        ...components,
      }}
      {...props}
    />
  )
}

function CalendarDayButton({
  className,
  day,
  modifiers,
  ...props
}: React.ComponentProps<typeof DayButton>) {
  const defaultClassNames = getDefaultClassNames()

  const ref = React.useRef<HTMLButtonElement>(null)
  React.useEffect(() => {
    if (modifiers.focused) ref.current?.focus()
  }, [modifiers.focused])

  return (
    <Button
      ref={ref}
      variant="ghost"
      size="icon"
      data-day={day.date.toLocaleDateString()}
      data-selected-single={
        modifiers.selected &&
        !modifiers.range_start &&
        !modifiers.range_end &&
        !modifiers.range_middle
      }
      data-range-start={modifiers.range_start}
      data-range-end={modifiers.range_end}
      data-range-middle={modifiers.range_middle}
      className={cn(
        "flex aspect-square size-auto w-full min-w-(--cell-size) flex-col gap-1 leading-none font-normal text-slate-700 hover:bg-blue-50 hover:text-blue-600 transition-colors",
        // Día seleccionado único
        "data-[selected-single=true]:!bg-blue-600 data-[selected-single=true]:!text-white data-[selected-single=true]:font-semibold data-[selected-single=true]:rounded-md",
        // Inicio de rango
        "data-[range-start=true]:!bg-blue-600 data-[range-start=true]:!text-white data-[range-start=true]:font-semibold data-[range-start=true]:!rounded-l-md data-[range-start=true]:!rounded-r-none",
        // Fin de rango
        "data-[range-end=true]:!bg-blue-600 data-[range-end=true]:!text-white data-[range-end=true]:font-semibold data-[range-end=true]:!rounded-r-md data-[range-end=true]:!rounded-l-none",
        // Días intermedios del rango
        "data-[range-middle=true]:!bg-blue-50 data-[range-middle=true]:!text-blue-700 data-[range-middle=true]:!rounded-none font-normal",
        defaultClassNames.day,
        className
      )}
      {...props}
    />
  )
}

export { Calendar, CalendarDayButton }
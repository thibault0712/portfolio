"use client"

import * as React from "react"
import { ChevronDown, ChevronLeft, ChevronRight } from "lucide-react"
import { DayPicker } from "react-day-picker"
import { fr } from "date-fns/locale"

import { buttonVariants } from "@/src/ui/components/atoms/shadcnUI/button"
import { cn } from "@/lib/utils"

export type CalendarProps = React.ComponentProps<typeof DayPicker>

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}: CalendarProps) {
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      locale={fr}
      className={cn(
        "group/calendar rounded-base border-2 border-border bg-secondary-background p-3 font-heading text-foreground shadow-shadow",
        className
      )}
      classNames={{
        root: "w-fit",
        months: "relative flex flex-col gap-2 sm:flex-row",
        month: "flex w-full flex-col gap-4",
        nav: "absolute inset-x-0 top-0 flex w-full items-center justify-between gap-1 z-10",
        button_previous: cn(
          buttonVariants({ variant: "noShadow" }),
          "size-7 bg-main text-main-foreground p-0 select-none cursor-pointer aria-disabled:opacity-50"
        ),
        button_next: cn(
          buttonVariants({ variant: "noShadow" }),
          "size-7 bg-main text-main-foreground p-0 select-none cursor-pointer aria-disabled:opacity-50"
        ),
        month_caption: "flex h-7 w-full items-center justify-center px-8 font-heading text-sm capitalize",
        dropdowns: "flex h-7 w-full items-center justify-center gap-1.5 text-sm font-heading",
        month_grid: "w-full border-collapse",
        weekdays: "flex",
        weekday: "w-9 rounded-base text-[0.8rem] font-base text-foreground/70 select-none text-center",
        week: "mt-2 flex w-full",
        day: "group/day relative size-9 p-0 text-center text-sm select-none flex items-center justify-center",
        day_button: cn(
          buttonVariants({ variant: "noShadow" }),
          "size-9 bg-secondary-background p-0 font-base text-foreground hover:bg-main/30 cursor-pointer"
        ),
        selected: "!bg-main !text-main-foreground font-heading rounded-base border-2 border-border",
        range_start: "!bg-main !text-main-foreground font-heading rounded-l-base border-2 border-border",
        range_middle: "!bg-main/30 !text-foreground rounded-none",
        range_end: "!bg-main !text-main-foreground font-heading rounded-r-base border-2 border-border",
        today: "font-heading underline decoration-2 decoration-main underline-offset-4",
        outside: "opacity-40",
        disabled: "opacity-30 pointer-events-none",
        hidden: "invisible",
        ...classNames,
      }}
      components={{
        Chevron: ({ className: chevronClassName, orientation, ...chevronProps }) => {
          if (orientation === "left") {
            return <ChevronLeft className={cn("size-4", chevronClassName)} {...chevronProps} />
          }
          if (orientation === "right") {
            return <ChevronRight className={cn("size-4", chevronClassName)} {...chevronProps} />
          }
          return <ChevronDown className={cn("size-4", chevronClassName)} {...chevronProps} />
        },
      }}
      {...props}
    />
  )
}

export { Calendar }

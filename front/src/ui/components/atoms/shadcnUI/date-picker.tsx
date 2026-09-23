"use client"

import * as React from "react"
import { format } from "date-fns"
import { fr } from "date-fns/locale"
import { Calendar as CalendarIcon, X } from "lucide-react"

import { Button } from "@/src/ui/components/atoms/shadcnUI/button"
import { Calendar } from "@/src/ui/components/atoms/shadcnUI/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/src/ui/components/atoms/shadcnUI/popover"
import { cn } from "@/lib/utils"
import type { Matcher } from "react-day-picker"

export type DatePickerProps = {
  date: Date | undefined
  setDate: (date: Date | undefined) => void
  placeholder?: string
  className?: string
  disabled?: Matcher | Matcher[]
  id?: string
}

export function DatePicker({
  date,
  setDate,
  placeholder = "Sélectionner une date",
  className,
  disabled,
  id,
}: DatePickerProps) {
  const [open, setOpen] = React.useState(false)

  return (
    <div className={cn("group relative flex items-center w-full sm:w-auto", className)}>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            id={id}
            variant="neutral"
            className={cn(
              "w-full sm:w-[220px] justify-start text-left font-base cursor-pointer pr-8 group-hover:translate-x-boxShadowX group-hover:translate-y-boxShadowY group-hover:shadow-none",
              !date && "text-foreground/70"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4 shrink-0" />
            <span className="truncate">
              {date ? format(date, "d MMMM yyyy", { locale: fr }) : placeholder}
            </span>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0 border-0" align="start">
          <Calendar
            mode="single"
            selected={date}
            disabled={disabled}
            onSelect={(newDate) => {
              setDate(newDate)
              setOpen(false)
            }}
            autoFocus
          />
        </PopoverContent>
      </Popover>
      {date && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation()
            setDate(undefined)
          }}
          className="absolute right-2.5 rounded-base p-1 text-foreground/60 transition-all hover:bg-main hover:text-main-foreground group-hover:translate-x-boxShadowX group-hover:translate-y-boxShadowY cursor-pointer"
          title="Effacer la date"
        >
          <X className="size-3.5" />
        </button>
      )}
    </div>
  )
}

"use client";

import * as React from "react";
import { format, Locale } from "date-fns";
import { ru } from "date-fns/locale";
import { Calendar as CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface DatePickerProps {
  /**
   * Selected date
   */
  date?: Date;
  
  /**
   * Change handler
   */
  onSelect?: (date?: Date) => void;
  
  /**
   * Placeholder text when no date is selected
   */
  placeholder?: string;
  
  /**
   * Format string for the date display
   */
  format?: string;
  
  /**
   * Locale for date formatting
   */
  locale?: Locale;
  
  /**
   * Additional CSS class names
   */
  className?: string;
  
  /**
   * Disabled state
   */
  disabled?: boolean;
}

/**
 * Date picker component with popover calendar
 * 
 * Built on top of shadcn/ui Calendar and Popover components
 */
export function DatePicker({
  date,
  onSelect,
  placeholder = "Выберите дату",
  format: formatStr = "PPP",
  locale = ru,
  className,
  disabled = false,
}: DatePickerProps) {
  const [popoverOpen, setPopoverOpen] = React.useState(false);
  
  const handleSelect = (newDate?: Date) => {
    if (onSelect) {
      onSelect(newDate);
    }
    setPopoverOpen(false);
  };
  
  return (
    <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "w-full justify-start text-left font-normal",
            !date && "text-muted-foreground",
            className
          )}
          disabled={disabled}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date ? (
            format(date, formatStr, { locale })
          ) : (
            <span>{placeholder}</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar
          mode="single"
          selected={date}
          onSelect={handleSelect}
          initialFocus
          locale={locale}
        />
      </PopoverContent>
    </Popover>
  );
}
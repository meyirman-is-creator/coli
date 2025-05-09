import * as React from "react";
import { format, addDays, isToday, isTomorrow, isAfter, Locale } from "date-fns";
import { ru } from "date-fns/locale";
import { Calendar as CalendarIcon, ChevronDown, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";

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
   * Show quick presets
   */
  showPresets?: boolean;
  
  /**
   * Minimum selectable date
   */
  minDate?: Date;
  
  /**
   * Maximum selectable date
   */
  maxDate?: Date;
  
  /**
   * Show badges with date labels
   */
  showDateLabels?: boolean;
  
  /**
   * Additional CSS class names
   */
  className?: string;
  
  /**
   * Disabled state
   */
  disabled?: boolean;
  
  /**
   * Variant
   */
  variant?: "default" | "outline" | "card";
}

/**
 * Enhanced date picker component with presets and animations
 */
export function DatePicker({
  date,
  onSelect,
  placeholder = "Выберите дату",
  format: formatStr = "PPP",
  locale = ru,
  showPresets = true,
  minDate,
  maxDate,
  showDateLabels = true,
  className,
  disabled = false,
  variant = "default",
}: DatePickerProps) {
  const [popoverOpen, setPopoverOpen] = React.useState(false);
  const [dropdownOpen, setDropdownOpen] = React.useState(false);
  
  const handleSelect = (newDate?: Date) => {
    if (onSelect) {
      onSelect(newDate);
    }
    setPopoverOpen(false);
  };
  
  // Define preset options
  const presets = React.useMemo(() => [
    { value: "today", label: "Сегодня", date: new Date() },
    { value: "tomorrow", label: "Завтра", date: addDays(new Date(), 1) },
    { value: "in_week", label: "Через неделю", date: addDays(new Date(), 7) },
    { value: "in_month", label: "Через месяц", date: addDays(new Date(), 30) },
  ], []);
  
  // Helper to get a label for a date
  const getDateLabel = (date: Date | undefined): string | null => {
    if (!date) return null;
    if (isToday(date)) return "Сегодня";
    if (isTomorrow(date)) return "Завтра";
    return null;
  };
  
  // Button variant styles based on prop
  const buttonStyles = React.useMemo(() => {
    switch (variant) {
      case "outline":
        return "border border-input hover:bg-accent hover:text-accent-foreground";
      case "card":
        return "bg-card text-card-foreground shadow-sm border";
      default:
        return "bg-background border border-input";
    }
  }, [variant]);
  
  return (
    <div className={cn("relative", className)}>
      <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              "w-full justify-between text-left font-normal",
              !date && "text-muted-foreground",
              buttonStyles
            )}
            disabled={disabled}
          >
            <div className="flex items-center">
              <CalendarIcon className="mr-2 h-4 w-4 opacity-70" />
              {date ? (
                <div className="flex items-center space-x-2">
                  <span>{format(date, formatStr, { locale })}</span>
                  {showDateLabels && getDateLabel(date) && (
                    <Badge variant="secondary" className="text-xs font-normal">
                      {getDateLabel(date)}
                    </Badge>
                  )}
                </div>
              ) : (
                <span>{placeholder}</span>
              )}
            </div>
            <ChevronDown className="h-4 w-4 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent 
          className="w-auto p-0 animate-in fade-in-50 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95" 
          align="start"
        >
          <div className="p-3 border-b">
            <div className="flex justify-between items-center">
              <h4 className="font-medium text-sm">Календарь</h4>
              
              {showPresets && (
                <DropdownMenu open={dropdownOpen} onOpenChange={setDropdownOpen}>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-8 text-xs gap-1">
                      Быстрый выбор
                      <ChevronDown className="h-3 w-3" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-40">
                    <DropdownMenuRadioGroup
                      value="custom"
                      onValueChange={(value) => {
                        const preset = presets.find((p) => p.value === value);
                        if (preset) {
                          handleSelect(preset.date);
                          setDropdownOpen(false);
                        }
                      }}
                    >
                      {presets.map((preset) => (
                        <DropdownMenuRadioItem 
                          key={preset.value} 
                          value={preset.value}
                          disabled={minDate && isAfter(minDate, preset.date)}
                          className="cursor-pointer"
                        >
                          {preset.label}
                        </DropdownMenuRadioItem>
                      ))}
                    </DropdownMenuRadioGroup>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>
          </div>
          
          <Calendar
            mode="single"
            selected={date}
            onSelect={handleSelect}
            initialFocus
            locale={locale}
            disabled={(date) => {
              if (minDate && date < minDate) return true;
              if (maxDate && date > maxDate) return true;
              return false;
            }}
            classNames={{
              day_today: "bg-primary/10 text-primary font-medium",
              day_selected: "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
            }}
          />
          
          {date && (
            <div className="p-3 border-t flex justify-between items-center">
              <span className="text-sm text-muted-foreground">
                {getDateLabel(date) || "Выбранная дата"}
              </span>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => handleSelect(undefined)}
                className="h-8 text-xs"
              >
                Очистить
              </Button>
            </div>
          )}
        </PopoverContent>
      </Popover>
    </div>
  );
}
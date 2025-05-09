import React from "react";
import { cn } from "@/lib/utils";
import { Slider } from "@/components/ui/slider";

interface RangeSliderProps {
  /**
   * Current slider values [min, max]
   */
  value: [number, number];
  
  /**
   * Minimum possible value
   */
  min: number;
  
  /**
   * Maximum possible value
   */
  max: number;
  
  /**
   * Step size
   */
  step?: number;
  
  /**
   * Change handler
   */
  onValueChange: (values: [number, number]) => void;
  
  /**
   * Show min-max labels
   */
  showLabels?: boolean;
  
  /**
   * Format function for min-max labels
   */
  formatLabel?: (value: number) => string;
  
  /**
   * Additional CSS class names
   */
  className?: string;
  
  /**
   * Disable the slider
   */
  disabled?: boolean;
}

/**
 * Range slider that allows selection of a range between min and max values
 * 
 * Built on top of shadcn/ui Slider component
 */
export function RangeSlider({
  value,
  min,
  max,
  step = 1,
  onValueChange,
  showLabels = true,
  formatLabel = (value) => value.toString(),
  className,
  disabled = false,
}: RangeSliderProps) {
  return (
    <div className={cn("space-y-2", className)}>
      <Slider
        defaultValue={value}
        value={value}
        max={max}
        min={min}
        step={step}
        onValueChange={onValueChange}
        disabled={disabled}
      />
      
      {showLabels && (
        <div className="flex justify-between mt-2 text-xs text-muted-foreground">
          <span>{formatLabel(min)}</span>
          <span>{formatLabel(max)}</span>
        </div>
      )}
    </div>
  );
}
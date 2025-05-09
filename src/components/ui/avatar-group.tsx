import React from "react";
import { cn } from "@/lib/utils";

interface AvatarGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * The maximum number of avatars to display before showing a count
   */
  max?: number;
  /**
   * The spacing between avatars in pixels (negative value for overlap)
   */
  spacing?: number;
}

/**
 * A component for displaying a group of avatars with overlap
 */
export function AvatarGroup({
  children,
  className,
  max = 5,
  spacing = -8,
  ...props
}: AvatarGroupProps) {
  const childrenArray = React.Children.toArray(children);
  const hasOverflow = childrenArray.length > max;
  const visibleAvatars = hasOverflow ? childrenArray.slice(0, max) : childrenArray;

  return (
    <div
      className={cn("flex items-center", className)}
      {...props}
    >
      {visibleAvatars.map((child, index) => (
        <div
          key={index}
          className="relative inline-block"
          style={{
            marginLeft: index === 0 ? 0 : `${spacing}px`,
            zIndex: childrenArray.length - index,
          }}
        >
          {child}
        </div>
      ))}
    </div>
  );
}
import * as React from "react";
import { cn } from "~/utils/utils";

export interface EmptyStateProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Icon element to display
   */
  icon?: React.ReactNode;
  /**
   * Title text
   */
  title: string;
  /**
   * Description text
   */
  description?: string;
  /**
   * Action button or element
   */
  action?: React.ReactNode;
  /**
   * Vertical spacing size
   */
  spacing?: "sm" | "md" | "lg";
}

/**
 * EmptyState - Display empty state with icon, title, description, and optional action
 *
 * A flexible component for showing empty states in lists, tables, search results, etc.
 * Supports custom icons, descriptions, and action buttons.
 *
 * @example
 * ```tsx
 * // Basic empty state
 * <EmptyState
 *   icon={<MessageSquare className="w-6 h-6" />}
 *   title="No sessions found"
 *   description="Create a new session to get started"
 * />
 *
 * // With action button
 * <EmptyState
 *   icon={<Inbox className="w-6 h-6" />}
 *   title="No messages"
 *   description="Your inbox is empty"
 *   action={<Button>Compose Message</Button>}
 * />
 *
 * // Search results empty state
 * <EmptyState
 *   icon={<Search className="w-6 h-6" />}
 *   title="No matching results"
 *   description="Try adjusting your search term"
 *   spacing="sm"
 * />
 * ```
 */
export const EmptyState = React.forwardRef<HTMLDivElement, EmptyStateProps>(
  ({ icon, title, description, action, spacing = "md", className, ...props }, ref) => {
    const spacingClasses = {
      sm: "py-8",
      md: "py-12",
      lg: "py-16",
    };

    const titleSpacingClasses = {
      sm: "mb-1",
      md: "mb-2",
      lg: "mb-3",
    };

    const actionSpacingClasses = {
      sm: "mt-3",
      md: "mt-4",
      lg: "mt-6",
    };

    return (
      <div
        ref={ref}
        className={cn("flex flex-col items-center justify-center h-full text-center px-6 animate-fade-in", spacingClasses[spacing], className)}
        {...props}
      >
        {icon && (
          <div
            className={cn(
              "w-24 h-24 rounded-full bg-gradient-to-tr from-primary/20 to-secondary/20 shadow-soulhug-glow animate-breathe backdrop-blur-sm flex items-center justify-center text-primary/60",
              "mb-6"
            )}
          >
            <div className="scale-150">{icon}</div>
          </div>
        )}
        <h3 className={cn("text-xl font-medium text-foreground/80 tracking-wide", titleSpacingClasses[spacing])}>
          {title}
        </h3>
        {description && (
          <p className="text-base text-muted-foreground/80 max-w-md mx-auto leading-relaxed">{description}</p>
        )}
        {action && <div className={cn(actionSpacingClasses[spacing])}>{action}</div>}
      </div>
    );
  }
);

EmptyState.displayName = "EmptyState";

/**
 * Utility function to combine class names
 * Similar to clsx or classnames library
 */
export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ');
}

/**
 * Utility functions
 */

/**
 * Shuffle an array using Fisher-Yates algorithm
 */
export function shuffle<T>(array: T[]): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

/**
 * Send an event to Google Analytics
 */
export function sendEvent(
  category: string,
  action: string,
  label?: string,
  value?: number
): void {
  if (typeof (window as any).gtag !== 'undefined') {
    (window as any).gtag('event', action, {
      event_category: category,
      event_label: label,
      value: value
    });
  }
}

/**
 * Generate a random whole number between min and max
 */
export function randomNumber(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min)) + min;
}

/**
 * Select a random item from an array
 */
export function randomFrom<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

/**
 * Format a number with commas
 */
export function addCommas(x: number): string {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

/**
 * Calculate percentage
 */
export function percentOf(total: number, part: number): number {
  if (total === 0 || part === 0) return 0;
  return Math.round((part * 100) / total);
}

/**
 * Find index of item in array
 */
export function findInArray<T>(haystack: T[], needle: T): number | null {
  const index = haystack.indexOf(needle);
  return index > -1 ? index : null;
}

/**
 * Remove item from array
 */
export function removeFromArray<T>(haystack: T[], needle: T): void {
  for (let i = haystack.length - 1; i >= 0; i--) {
    if (haystack[i] === needle) {
      haystack.splice(i, 1);
    }
  }
}

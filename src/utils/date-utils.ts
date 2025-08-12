import { 
  format, 
  parse, 
  isValid, 
  differenceInYears, 
  startOfDay, 
  endOfDay,
  isBefore,
  isAfter,
  parseISO
} from 'date-fns';

/**
 * Date formatting utilities for medical forms
 */

/**
 * Formats a date for display in various formats
 */
export const formatDateForDisplay = (date: Date | string, formatString: string = 'PPP'): string => {
  try {
    const dateObj = typeof date === 'string' ? parseISO(date) : date;
    return isValid(dateObj) ? format(dateObj, formatString) : 'Invalid date';
  } catch {
    return 'Invalid date';
  }
};

/**
 * Formats a date for form inputs (YYYY-MM-DD)
 */
export const formatDateForInput = (date: Date | string): string => {
  try {
    const dateObj = typeof date === 'string' ? parseISO(date) : date;
    return isValid(dateObj) ? format(dateObj, 'yyyy-MM-dd') : '';
  } catch {
    return '';
  }
};

/**
 * Calculates age from date of birth
 */
export const calculateAgeFromDate = (dateOfBirth: Date | string): number => {
  try {
    const birthDate = typeof dateOfBirth === 'string' ? parseISO(dateOfBirth) : dateOfBirth;
    return isValid(birthDate) ? differenceInYears(new Date(), birthDate) : 0;
  } catch {
    return 0;
  }
};

/**
 * Validates if a date is a valid date of birth (not in future, not too old)
 */
export const isValidDateOfBirth = (date: Date | string, maxAge: number = 120): boolean => {
  try {
    const dateObj = typeof date === 'string' ? parseISO(date) : date;
    if (!isValid(dateObj)) return false;
    
    const now = new Date();
    const age = differenceInYears(now, dateObj);
    
    return !isAfter(dateObj, now) && age <= maxAge && age >= 0;
  } catch {
    return false;
  }
};

/**
 * Validates if a date is not in the future
 */
export const isNotFutureDate = (date: Date | string): boolean => {
  try {
    const dateObj = typeof date === 'string' ? parseISO(date) : date;
    if (!isValid(dateObj)) return false;
    
    return !isAfter(startOfDay(dateObj), endOfDay(new Date()));
  } catch {
    return false;
  }
};

/**
 * Validates if a date is within a reasonable range for medical events
 */
export const isValidMedicalDate = (date: Date | string, yearsBack: number = 50): boolean => {
  try {
    const dateObj = typeof date === 'string' ? parseISO(date) : date;
    if (!isValid(dateObj)) return false;
    
    const now = new Date();
    const earliestDate = new Date(now.getFullYear() - yearsBack, 0, 1);
    
    return !isAfter(dateObj, now) && !isBefore(dateObj, earliestDate);
  } catch {
    return false;
  }
};

/**
 * Gets the start and end of a day for date comparisons
 */
export const getDayBounds = (date: Date | string): { start: Date; end: Date } => {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  return {
    start: startOfDay(dateObj),
    end: endOfDay(dateObj),
  };
};

/**
 * Formats a date range for display
 */
export const formatDateRange = (startDate: Date | string, endDate: Date | string): string => {
  try {
    const start = typeof startDate === 'string' ? parseISO(startDate) : startDate;
    const end = typeof endDate === 'string' ? parseISO(endDate) : endDate;
    
    if (!isValid(start) || !isValid(end)) return 'Invalid date range';
    
    const startFormatted = format(start, 'MMM d, yyyy');
    const endFormatted = format(end, 'MMM d, yyyy');
    
    return `${startFormatted} - ${endFormatted}`;
  } catch {
    return 'Invalid date range';
  }
};

/**
 * Parses various date string formats
 */
export const parseFlexibleDate = (dateString: string): Date | null => {
  if (!dateString) return null;
  
  const formats = [
    'yyyy-MM-dd',
    'MM/dd/yyyy',
    'MM-dd-yyyy',
    'M/d/yyyy',
    'M-d-yyyy',
    'PPP',
    'P',
  ];
  
  // Try parsing with ISO first
  try {
    const isoDate = parseISO(dateString);
    if (isValid(isoDate)) return isoDate;
  } catch {
    // Continue to other formats
  }
  
  // Try each format
  for (const formatString of formats) {
    try {
      const parsed = parse(dateString, formatString, new Date());
      if (isValid(parsed)) return parsed;
    } catch {
      continue;
    }
  }
  
  return null;
};

/**
 * Gets relative time description (e.g., "2 days ago", "in 3 weeks")
 */
export const getRelativeTimeDescription = (date: Date | string): string => {
  try {
    const dateObj = typeof date === 'string' ? parseISO(date) : date;
    if (!isValid(dateObj)) return 'Invalid date';
    
    const now = new Date();
    const diffInDays = Math.abs(differenceInYears(now, dateObj) * 365);
    
    if (isBefore(dateObj, now)) {
      if (diffInDays === 0) return 'Today';
      if (diffInDays === 1) return 'Yesterday';
      if (diffInDays < 7) return `${diffInDays} days ago`;
      if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} weeks ago`;
      if (diffInDays < 365) return `${Math.floor(diffInDays / 30)} months ago`;
      return `${Math.floor(diffInDays / 365)} years ago`;
    } else {
      if (diffInDays === 0) return 'Today';
      if (diffInDays === 1) return 'Tomorrow';
      if (diffInDays < 7) return `In ${diffInDays} days`;
      if (diffInDays < 30) return `In ${Math.floor(diffInDays / 7)} weeks`;
      if (diffInDays < 365) return `In ${Math.floor(diffInDays / 30)} months`;
      return `In ${Math.floor(diffInDays / 365)} years`;
    }
  } catch {
    return 'Invalid date';
  }
};

/**
 * Common date format presets
 */
export const DateFormats = {
  SHORT: 'M/d/yyyy',
  MEDIUM: 'MMM d, yyyy',
  LONG: 'MMMM d, yyyy',
  FULL: 'EEEE, MMMM d, yyyy',
  ISO: 'yyyy-MM-dd',
  TIME: 'h:mm a',
  DATETIME: 'MMM d, yyyy h:mm a',
} as const;

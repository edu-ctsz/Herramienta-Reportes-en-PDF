/**
 * Utility functions for Spanish date formatting and manipulation.
 */

const MONTHS_SPANISH = [
  'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
  'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'
];

/**
 * Formats a YYYY-MM-DD string to Spanish formal format:
 * e.g. "2026-07-01" -> "01 de julio de 2026"
 */
export function formatDateToSpanish(isoDate: string): string {
  if (!isoDate) return '';
  
  try {
    const parts = isoDate.split('-');
    if (parts.length !== 3) return isoDate;
    
    const year = parts[0];
    const monthIndex = parseInt(parts[1], 10) - 1;
    const day = parts[2].padStart(2, '0');
    
    if (monthIndex < 0 || monthIndex > 11) return isoDate;
    
    const monthName = MONTHS_SPANISH[monthIndex];
    return `${day} de ${monthName} de ${year}`;
  } catch {
    return isoDate;
  }
}

/**
 * Returns today's date formatted as YYYY-MM-DD
 */
export function getTodayISO(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Modifies an ISO date by N days
 */
export function addDaysToISO(isoDate: string, days: number): string {
  try {
    const parts = isoDate.split('-');
    if (parts.length !== 3) return getTodayISO();
    
    const date = new Date(parseInt(parts[0], 10), parseInt(parts[1], 10) - 1, parseInt(parts[2], 10));
    date.setDate(date.getDate() + days);
    
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  } catch {
    return isoDate;
  }
}

/**
 * Gets Spanish Month and Year from ISO date: e.g. "Julio 2026"
 */
export function getMonthYearSpanish(isoDate: string): string {
  if (!isoDate) return '';
  try {
    const parts = isoDate.split('-');
    const year = parts[0];
    const monthIndex = parseInt(parts[1], 10) - 1;
    const monthName = MONTHS_SPANISH[monthIndex] || '';
    return `${monthName.charAt(0).toUpperCase() + monthName.slice(1)} ${year}`;
  } catch {
    return '';
  }
}

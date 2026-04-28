export function isMobile(): boolean {
  if (typeof window === 'undefined') return false;
  if (window.innerWidth < 768) return true;
  const hasHover = window.matchMedia('(hover: hover)').matches;
  return !hasHover;
}

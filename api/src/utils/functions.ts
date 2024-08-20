export function isValidURL(str: string | null): boolean {
  if (str === null) return false;
  try {
    new URL(str);
    return true;
  } catch (_) {
    return false;
  }
}

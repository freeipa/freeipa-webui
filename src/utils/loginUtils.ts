/**
 * Strips diacritics and removes characters not valid in a FreeIPA login.
 */
export const sanitizeLoginPart = (s: string): string =>
  s
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^A-Za-z0-9._\-$]/g, "")
    .toLowerCase();

/**
 * Generates a sanitized login from first + last name,
 * matching FreeIPA's default: givenname[0] + sn (lowercased).
 */
export const generateLogin = (first: string, last: string): string => {
  const sanitizedFirst = sanitizeLoginPart(first);
  const sanitizedLast = sanitizeLoginPart(last);

  if (!sanitizedFirst || !sanitizedLast) return "";
  return sanitizedFirst.charAt(0) + sanitizedLast;
};

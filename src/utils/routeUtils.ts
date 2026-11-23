/**
 * Encode an entity ID for use in a route.
 *
 * Slashes are double-encoded because the web server rejects encoded slashes
 * (AllowEncodedSlashes Off by default) before the SPA can handle a hard
 * refresh. Other characters only need to be encoded once. React Router
 * decodes the params when matching the route, so pages receive the original
 * ID without an extra decode step.
 */
export const encodeRouteId = (id: string): string =>
  encodeURIComponent(id).replace(/%2F/gi, "%252F");

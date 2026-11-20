/**
 * Encode an entity ID for use in a route.
 *
 * Slashes are double-encoded because the web server rejects encoded slashes
 * (AllowEncodedSlashes Off by default) before the SPA can handle a hard
 * refresh. Other characters only need to be encoded once.
 */
export const encodeRouteId = (id: string): string =>
  encodeURIComponent(id).replace(/%2F/gi, "%252F");

/**
 * Undo the extra slash encoding applied by encodeRouteId.
 * Values without an encoded slash are returned unchanged.
 */
export const decodeRouteId = (id: string): string =>
  /%2F/i.test(id) ? decodeURIComponent(id) : id;

// utils/matchRoute.js
import { match } from "path-to-regexp";

/**
 * Matches a request path against a route pattern.
 * e.g. matchRoute("/user/:id", "/user/123") => { matched: true, params: { id: "123" } }
 *
 * @param {string} pattern - The stored route pattern (e.g. /api/:id/details)
 * @param {string} path - The incoming request path
 * @returns {{ matched: boolean, params?: Object }}
 */

export function matchRoute(pattern, path) {
  try {
    const matcher = match(pattern, { decode: decodeURIComponent, end: true });
    const result = matcher(path);
    // console.log(result);
    if (!result) 
    return { matched: false };
  // console.log({ matched: true, params: result.params })
    return { matched: true, params: result.params };
  } catch (err) {
    console.error("Route matching error:", err);
    return { matched: false };
  }
}

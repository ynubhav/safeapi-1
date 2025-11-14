// Convert route to a normalized pattern for easy collision detection
// /users/:id/orders/:oid --> /users/:/orders/: 
export function normalizePath(path) {
  return path
    .split("/")
    .map(seg => seg.startsWith(":") ? ":" : seg)
    .join("/");
}

export function hasCollision(existingRoutes, newRoute) {
  const normalizedNew = normalizePath(newRoute.path);

  return existingRoutes.some(r => {
    if (r.method !== newRoute.method) return false;

    const normalizedExisting = normalizePath(r.path);

    // exact same normalized pattern => collision
    if (normalizedExisting === normalizedNew) return true;

    return false;
  });
}

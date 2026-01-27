/**
 * Helper to resolve static asset paths correctly when deploying with or without a basePath (e.g. GitHub Pages).
 */
export function getAssetPath(path: string): string {
  if (!path || path.startsWith('http://') || path.startsWith('https://') || path.startsWith('data:')) {
    return path;
  }
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';
  if (basePath && path.startsWith('/') && !path.startsWith(basePath)) {
    return `${basePath}${path}`;
  }
  return path;
}

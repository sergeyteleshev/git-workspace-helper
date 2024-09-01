export function isSha(sha: string): boolean {
  return /^[0-9a-fA-F]{40}$/.test(sha || '');
}

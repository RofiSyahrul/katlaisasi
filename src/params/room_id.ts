export function match(param: string): boolean {
  return /\d{3}-\d{3}-\d{3}/.test(param);
}

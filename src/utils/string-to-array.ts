export function StringToArray(input: string): string[] {
  if (!input) {
    return [];
  }

  if (input && Array.isArray(input) === false) {
    return [input];
  }

  return input as unknown as string[];
}

export * from "./invariants";

export const forceArray = <T>(val: T | T[] | null) => {
  if (Array.isArray(val)) return val;
  if (!val) return [];
  return [val];
};

export const isEqualCaseInsensitive = (string1: string, string2: string) =>
  string1.toLowerCase() === string2.toLowerCase();

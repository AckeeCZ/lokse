export const forceArray = <T>(val: T | T[] | null) => {
  if (Array.isArray(val)) return val;
  if (!val) return [];
  return [val];
};

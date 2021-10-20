import { Patterns, CustomPatterns } from ".";

export const lowerCaseKeys = (patterns: CustomPatterns) =>
  Object.keys(patterns).reduce((prev, current) => {
    prev[current.toLowerCase()] = patterns[current];
    return prev;
  }, {} as CustomPatterns);

const convertStringToRegex = (string: string) => new RegExp(string, "gim");

export const regexifyValues = (patterns: CustomPatterns) => {
  const regexified: Patterns = {};

  Object.keys(patterns).forEach((key) => {
    regexified[key] = convertStringToRegex(patterns[key]);
  });

  return regexified;
};

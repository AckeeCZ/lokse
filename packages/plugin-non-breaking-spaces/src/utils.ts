import { mapKeys, mapValues } from "lodash";

import { CustomPatterns } from ".";

export const lowerCaseKeys = (patterns: CustomPatterns) =>
  mapKeys(patterns, (_, key) => key.toLowerCase());

const convertStringToRegex = (string: string) => new RegExp(string, "gim");

export const regexifyValues = (patterns: CustomPatterns) =>
  mapValues(patterns, (value) => convertStringToRegex(value));

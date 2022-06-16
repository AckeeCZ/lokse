import { Errors } from "@oclif/core";
import type { Logger } from "@lokse/core";

const logger: Logger = {
  ...console,
  warn: Errors.warn,
};

export default logger;

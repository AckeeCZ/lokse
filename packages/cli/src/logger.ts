import type { Logger } from '@lokse/core';

import { warn } from '@oclif/errors';

const logger: Logger = {
    ...console,
    warn,
};

export default logger;

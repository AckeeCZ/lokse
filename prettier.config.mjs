// @ts-check

/**
 * @type {import('prettier').Options}
 */
const config = {
    singleQuote: true,
    jsxSingleQuote: true,
    semi: true,
    arrowParens: 'avoid',
    printWidth: 120,
    tabWidth: 4,
    trailingComma: 'all',
    overrides: [
        {
            files: ['*.json', '*.jsonc'],
            options: {
                trailingComma: 'none',
            },
        },
    ],
};

export default config;

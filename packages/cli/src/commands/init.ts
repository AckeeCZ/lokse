import { flags } from '@oclif/command';
import { promisifyAll } from 'bluebird';
import { template } from 'lodash';
import * as path from 'path';
import { prompt } from 'inquirer';

const fs = promisifyAll(require('fs'));

import { NAME } from '@lokse/core';
import Base from '../base';
import logger from '../logger';

const configTypes = {
    typescript: 'lokse.config.ts.tmpl',
    javascript: 'lokse.config.js.tmpl',
    'rc file': '.lokserc.tmpl',
} as const;

class Init extends Base {
    static description = 'create a new config file';

    static examples = [`$ ${NAME} init`];

    static flags = {
        help: flags.help({ char: 'h' }),
    };

    async run(): Promise<void> {
        if (this.conf) {
            logger.log(`🤷‍♂️ Lokse config already exists, skipping init.`);
            return;
        }

        const rootDir = process.cwd();

        const choices = Object.entries(configTypes).map(([type, templateName]) => ({
            name: `${type} (${templateName.replace('.tmpl', '')})`,
            value: type,
        }));
        const answer = await prompt<{ type: keyof typeof configTypes }>([
            {
                type: 'list',
                name: 'type',
                message: 'What kind of config do you wish?',
                choices,
                default: 'typescript',
            },
        ]);

        const templateName = configTypes[answer.type];
        const templatePath = path.resolve(__dirname, '../templates', templateName);

        const configTemplate = await fs.readFileAsync(templatePath);
        const createConfig = template(configTemplate);

        const initValues = await prompt<{
            sheetId: string;
            outDir: string;
            languagesString: string;
            column: string;
        }>([
            {
                type: 'input',
                name: 'sheetId',
                message: 'What is the sheet id?',
                default: '',
            },
            {
                type: 'input',
                name: 'outDir',
                message: "What's the target dir for translations?",
                default: '',
            },
            {
                type: 'input',
                name: 'languagesString',
                message: 'What are supported languages? (comma separated)',
                default: null,
            },
            {
                type: 'input',
                name: 'column',
                message: 'What is the name of column holding keys?',
                default: '',
            },
        ]);

        const languages = initValues.languagesString?.split(',') ?? [];
        const config = createConfig({
            ...initValues,
            languages,
        });
        const configFilename = templateName.replace('.tmpl', '');

        await fs.writeFileAsync(path.resolve(rootDir, configFilename), config);

        logger.log(`🔧 Generated config ${configFilename}`);
    }
}

export = Init;

import { flags } from "@oclif/command";
import { promisifyAll } from "bluebird";
import { template } from "lodash";
import * as path from "path";
import { prompt } from "inquirer";

const fs = promisifyAll(require("fs"));

import { NAME } from "../constants";
import Base from "../base";
import logger from "../logger";

const configTypes = {
  typescript: "lokse.config.ts.tmpl",
  javascript: "lokse.config.js.tmpl",
} as const;

class Init extends Base {
  static description = "create a new config file";

  static examples = [`$ ${NAME} init`];

  static flags = {
    help: flags.help({ char: "h" }),
  };

  async run() {
    if (this.conf) {
      logger.log(`🤷‍♂️ Lokse config already exists, skipping init.`);
      return;
    }

    // TODO check if package.json availalble - ensure we're in project root

    const rootDir = process.cwd();

    const answer = await prompt<{ type: keyof typeof configTypes }>([
      {
        type: "list",
        name: "type",
        message: "What kind of config do you wish?",
        choices: Object.keys(configTypes),
        default: "typescript",
      },
    ]);

    const templateName = configTypes[answer.type];
    const templatePath = path.resolve(__dirname, "../templates", templateName);

    const configTemplate = await fs.readFileAsync(templatePath);
    const createConfig = template(configTemplate);

    // TODO - prompt for values
    const initValues = {
      sheetId: "",
      outDir: "",
      languages: [],
      column: "",
    };

    const config = createConfig(initValues);
    const configFilename = templateName.replace(".tmpl", "");

    await fs.writeFileAsync(path.resolve(rootDir, configFilename), config);

    logger.log(`🔧 Generated config ${configFilename}`);
  }
}

export = Init;

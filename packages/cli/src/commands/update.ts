import * as path from "path";
import { flags } from "@oclif/command";
import * as ora from "ora";
import * as slugify from "@sindresorhus/slugify";
import * as dedent from "dedent";
import * as flat from "array.prototype.flat";
import {
  Reader,
  OutputFormat,
  WorksheetReader,
  InvalidFilterError,
  transformersByFormat,
  FileWriter,
  Line,
} from "@lokse/core";
import { WorksheetLinesByTitle } from "@lokse/core";

import { NAME } from "../constants";
import Base from "../base";

import * as cliFlags from "../flags";
import { MissingFlagValue, IncorrectFlagValue } from "../flags/errors";

flat.shim();

const outputFormats = Object.values(OutputFormat);
const defaultFormat = OutputFormat.JSON;

class Update extends Base {
  static description = "update translations from localization spreadsheet";

  static examples = [
    `$ ${NAME} update`,
    `$ ${NAME} update -i 1HKjvejcuHIY73WvEkipD7_dmF9dFeNLji3nS2RXcIzk -d locales -l cz,en,fr -t key_web`,
  ];

  static flags = {
    help: flags.help({ char: "h" }),
    id: cliFlags.id.flag(),
    dir: flags.string({ char: "d", name: "dir", description: "output folder" }),
    languages: flags.string({
      char: "l",
      description:
        "translation columns languages. Multiple values are comma separated. For example cs,en,fr",
    }),
    col: flags.string({
      char: "c",
      description: "column containing translations keys. For example key_web.",
    }),
    format: flags.enum({
      char: "f",
      options: outputFormats,
      description: `output format. Default is ${defaultFormat}.`,
    }),
    sheets: flags.string({
      char: "s",
      description:
        "sheets to get translations from. Name or list of names, comma separated. For example Translations1,Translations2",
    }),
  };

  splitTranslations(
    domains: boolean | string[],
    linesByWorkshet: WorksheetLinesByTitle,
    langName: string
  ): { lines: Line[]; domain?: string }[] {
    // Variant 1: true => split by title name
    if (typeof domains === "boolean" && domains === true) {
      const worksheetLinesEntries = Object.entries(linesByWorkshet);

      if (worksheetLinesEntries.length === 1) {
        this.warn(
          dedent`Requested splitting translations by sheet but only one sheet 
                called ${worksheetLinesEntries[0][0]} got. Check if this is intended.`
        );
      }

      return worksheetLinesEntries.map(([title, lines]) => ({
        lines,
        domain: slugify(title),
      }));
    }

    if (Array.isArray(domains)) {
      // Variant 2: Array.<string> => split by domain
      const allWorksheetLines = Object.values(linesByWorkshet).flat();
      const OTHER_DOMAIN = "__other__";

      const linesByDomain = allWorksheetLines.reduce(
        (domainLines: { [domain: string]: Line[] }, line: Line) => {
          const [parsedDomain] = line.key.split(".");
          const domain = domains.includes(parsedDomain)
            ? parsedDomain
            : OTHER_DOMAIN;

          domainLines[domain] = domainLines[domain] ?? [];
          domainLines[domain].push(line);

          return domainLines;
        },
        {}
      );

      domains
        .filter((domain) => linesByDomain[domain].length === 0)
        .forEach((domain) => {
          this.warn(
            `😐 Received no lines for language ${langName} and domain ${domain}`
          );
        });

      return (
        Object.keys(linesByDomain)
          // move OTHER_DOMAIN to the end
          .sort((d1, d2) =>
            d1 === OTHER_DOMAIN ? 1 : d2 === OTHER_DOMAIN ? -1 : 0
          )
          .map((domain) => ({
            domain: domain === OTHER_DOMAIN ? undefined : domain,
            lines: linesByDomain[domain],
          }))
      );
    }

    this.error("💥 Unknown error occured when splitting translations");
  }

  async run() {
    const { flags } = this.parse(Update);

    const sheetId = flags.id ?? "";
    const dir = flags.dir ?? this.conf?.dir;
    const languages = flags.languages?.split(",") ?? this.conf?.languages;
    const column = flags.col ?? this.conf?.column;
    const format = flags.format ?? this.conf?.format ?? defaultFormat;
    const sheets = flags.sheets?.split(",") ?? this.conf?.sheets;
    const splitTranslations: boolean | string[] =
      this.conf?.splitTranslations ?? false;

    cliFlags.id.invariant(sheetId);

    if (!dir) {
      throw new MissingFlagValue("Output directory");
    }

    if (!column) {
      throw new MissingFlagValue(`Keys column`);
    }

    if (!Array.isArray(languages)) {
      throw new IncorrectFlagValue(
        `🤷‍♂️ Translation columns have to be list of languages, but ${languages} given`
      );
    }

    let worksheetReader;

    try {
      worksheetReader = new WorksheetReader(sheets);
    } catch (error) {
      if (error instanceof InvalidFilterError) {
        throw new IncorrectFlagValue(error.message);
      } else {
        throw error;
      }
    }

    const outputTransformer = transformersByFormat[format];

    const reader = new Reader(sheetId, worksheetReader);
    const writer = new FileWriter();

    const outputDir = path.resolve(process.cwd(), dir);
    const relativeOutputPath = path.relative(process.cwd(), outputDir);

    async function writeLines(
      lines: Line[],
      language: string,
      domain?: string
    ): Promise<string> {
      const fileName = outputTransformer.getFileName(language, domain);
      const filePath = path.resolve(outputDir, fileName);

      await writer.write(filePath, lines, outputTransformer);

      return path.join(relativeOutputPath, fileName);
    }

    for (const language of languages) {
      const spinner = ora({ spinner: "dots" });

      const langName = `${language}`;

      spinner.start(
        `Saving ${langName} translations into ${relativeOutputPath}`
      );

      // Reason: Process languages sequentially
      /* eslint-disable no-await-in-loop */
      try {
        const linesByWorkshet = await reader.read(column, language);
        const allWorksheetLines = Object.values(linesByWorkshet).flat();

        if (allWorksheetLines.length === 0) {
          spinner.warn(`Received empty lines set for language ${langName}`);
          continue;
        }

        if (splitTranslations && outputTransformer.supportsSplit) {
          const linesWithDomain = this.splitTranslations(
            splitTranslations,
            linesByWorkshet,
            langName
          );

          const writeResults = await Promise.all(
            linesWithDomain.map(({ lines, domain }) =>
              writeLines(lines, language, domain).catch(() => {
                this.warn(`Failed writing ${domain}.${language} translations`);
                return null;
              })
            )
          );

          if (writeResults.some((r) => !r)) {
            spinner.warn(
              `Some of ${langName} splitted translations were not saved`
            );
          } else {
            const names = linesWithDomain
              .map((l) => l.domain ?? "other")
              .join(", ");
            spinner.succeed(
              dedent`All ${langName} translations saved into ${relativeOutputPath}
                  Splitted to ${names}`
            );
          }
        } else {
          const filePath = await writeLines(allWorksheetLines, language);
          spinner.succeed(
            `All ${langName} translations saved into ${filePath}`
          );
        }
      } catch (error) {
        spinner.fail(`Generating ${langName} translations failed.`);

        this.error(error, {
          exit: error?.oclif?.exit,
        });
      }
    }
  }
}

export = Update;

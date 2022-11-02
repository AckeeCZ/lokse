import * as slugify from "@sindresorhus/slugify";
import * as dedent from "dedent";
import { createPlugin } from "@lokse/core";
import type {
  GeneralPluginOptions,
  LoksePlugin,
  Line,
  WorksheetLinesByTitle,
  LinesWithNamespace,
  SortLinesMeta,
} from "@lokse/core";

export interface PluginOptions extends GeneralPluginOptions {
  namespaces?: string[];
}

function insertItem<T>(targetObj: Record<string, T[]>, key: string, item: T) {
  if (!targetObj[key]) {
    targetObj[key] = [];
  }

  targetObj[key].push(item);
}

export default function (options: PluginOptions): LoksePlugin {
  function splitBySheet(
    linesByTitle: WorksheetLinesByTitle,
    linesWithNs: LinesWithNamespace[]
  ) {
    const worksheetLinesEntries = Object.entries(linesByTitle);

    if (worksheetLinesEntries.length === 1) {
      options.logger
        .warn(dedent`Requested splitting translations by sheet but only one sheet
      called ${worksheetLinesEntries[0][0]} got. Check if this is intended.`);
    }

    for (const [title, lines] of worksheetLinesEntries) {
      linesWithNs.push({ lines, ns: slugify(title) });
    }

    return {};
  }

  function splitByNamespace(
    namespaces: string[],
    linesByTitle: WorksheetLinesByTitle,
    { linesWithNamespace, language }: SortLinesMeta
  ) {
    const worksheetLinesEntries = Object.entries(linesByTitle);

    const linesByNamespace: { [domain: string]: Line[] } = {};
    const restLinesByWorksheet: WorksheetLinesByTitle = {};

    for (const [sheetTitle, sheetLines] of worksheetLinesEntries) {
      for (const line of sheetLines) {
        const namespace = namespaces.find((ns) =>
          line.key.startsWith(`${ns}.`)
        );

        if (!namespace) {
          insertItem(restLinesByWorksheet, sheetTitle, line);

          continue;
        }

        insertItem(linesByNamespace, namespace, line);
      }
    }

    for (const namespace of namespaces) {
      if (linesByNamespace[namespace]?.length > 0) {
        linesWithNamespace.push({
          ns: namespace,
          lines: linesByNamespace[namespace],
        });
      } else {
        options.logger.warn(
          `😐 Received no lines for language ${language} and namespace ${namespace}`
        );
      }
    }

    return restLinesByWorksheet;
  }

  return createPlugin({
    sortLines(linesByWorkshet, meta) {
      const { namespaces } = options;

      if (typeof namespaces === "undefined") {
        return splitBySheet(linesByWorkshet, meta.linesWithNamespace);
      }

      if (Array.isArray(namespaces)) {
        return splitByNamespace(namespaces, linesByWorkshet, meta);
      }

      throw new Error(
        `"namespaces" must be omitted or an array in plugin-split config`
      );
    },
  });
}

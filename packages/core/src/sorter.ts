import { OTHER_TRANSLATIONS_NAMESPACE } from "./constants";

import type Line from "./line";
import type { PluginsRunner } from "./plugins";
import type { WorksheetLinesByTitle } from "./reader";

export interface LinesWithNamespace {
  lines: Line[];
  ns: string;
}

const isOtherNamespace = ({ ns }: LinesWithNamespace) =>
  ns === OTHER_TRANSLATIONS_NAMESPACE;

const isNotOtherNamespace = (lwn: LinesWithNamespace) => !isOtherNamespace(lwn);

export class Sorter {
  constructor(private plugins?: PluginsRunner) {}

  async sort(
    linesByWorkshet: WorksheetLinesByTitle,
    language: string
  ): Promise<LinesWithNamespace[]> {
    const otherTranslations: LinesWithNamespace = {
      lines: [],
      ns: OTHER_TRANSLATIONS_NAMESPACE,
    };

    let linesWithNamespace = [otherTranslations];
    let remainingLinesByWorksheet = linesByWorkshet;

    if (this.plugins) {
      remainingLinesByWorksheet = await this.plugins.runHook(
        "sortLines",
        remainingLinesByWorksheet,
        {
          linesWithNamespace,
          language,
        }
      );
    }

    if (!linesWithNamespace.some((l) => isOtherNamespace(l))) {
      linesWithNamespace.push(otherTranslations);
    }

    otherTranslations.lines = [
      ...otherTranslations.lines,
      ...Object.values(remainingLinesByWorksheet).flat(),
    ];

    if (otherTranslations.lines.length === 0) {
      linesWithNamespace = linesWithNamespace.filter((l) =>
        isNotOtherNamespace(l)
      );
    }

    return [...linesWithNamespace].sort((d1, d2) =>
      d1.ns === OTHER_TRANSLATIONS_NAMESPACE
        ? 1
        : d2.ns === OTHER_TRANSLATIONS_NAMESPACE
        ? -1
        : 0
    );
  }
}

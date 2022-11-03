---
title: Lokse plugins
description: Introduction into lokse plugins
layout: ../../layouts/MainLayout.astro
---

Lokse ecosystem is extensible using independent units called plugins. Each plugin is a standalone NPM package and none is required to run basic functionality.

## What can plugin do

Plugin can hook into various transformation process steps and modify the final result of the operation. To transform the result use any of possible hooks listed below.

### `readTranslation`

Invoked when reading each individual translation from the spreadsheet.

Receives object of the type `Line` which is just read translation and must return `Line` too. Second argument are meta information containing translation key, language and source row from which it was read.

```ts
interface MetaInfo {
  key: string;
  language: string;
  row: GoogleSpreadsheetRow;
}

readTranslation: async (line: Line, meta: MetaInfo) => {
  if (!line.value) {
    line.setValue("🤷‍♂️");
  }

  return line;
};
```

### `sortLines`

Invoked after translation lines are read from the spreadsheet.

Receives object lines by title of worksheet they belong to. Second argument are meta information containing language and more importatntly **target list of lines with associated namespaces**. If some lines needs to be assigned to specific namespace, that's the place to move them.

It's important to return `linesByWorksheet` object only with lines not assigned to any other namespace, otherwise these lines will be duplicated in resulting translation files. That's because default behaviour executed after the hook is to assign remaining lines to the "other translations" namespace. The "other translations" namespace with no lines is also always available in the `linesWithNamespace`.

```ts
interface MetaInfo {
  language: string;
  linesWithNamespace: { ns: string; lines: Line[] }[];
}

sortLines: async (linesByWorkshet: Record<string, Line[]>, meta: MetaInfo) => {
  const otherLinesByWorksheet: Record<string, Line[]> = {};

  for (const [title, lines] of linesByWorksheet.entries()) {
    if (title.startsWith("Legal")) {
      meta.linesWithNamespace.push({
        ns: title.toLowerCase().replaceAll(" ", "-"),
        lines,
      });
    } else {
      otherLinesByWorksheet[title] = lines;
    }
  }

  return otherLinesByWorksheet;
};
```

### `transformLine`

Invoked before adding the line to the final output string.

Receives object of the type `Line` and must return `Line` too. On the line you can utilize `setKey` and `setValue` methods which accepts function with current key/value and returns modified key/value.

```ts
interface MetaInfo {
  language: string;
  namespace?: string;
}

transformLine: async (line: Line, meta: MetaInfo) => {
  line.setKey((key) => key.substr(0, 1));
  line.setValue((value) => value.toUpperCase());

  return line;
};
```

### `transformFullOutput`

Invoked just before writing the result output string into the file.

Receives composed output string that is about to write into a file . Like JSON object for json format type. As a second argument it receives meta information, which can be used for example to determine output type (using `meta.transformer.outputFormat`).

```ts
import { OutputFormat } from "@lokse/core";

interface MetaInfo {
  transformer: Transformer;
  language: string;
  namespace?: string;
}

transformFullOutput: async (output: string, meta: MetaInfo) => {
  if (meta.transformer.outputFormat === OutputFormat.JSON) {
    return processOutput(output);
  }

  return output;
};
```

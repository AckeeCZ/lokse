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

### `transformLine`

Invoked before writing the line into the final output string.

Receives object of the type `Line` and must return `Line` too. On the line you can utilize `setKey` and `setValue` methods which accepts function with current key/value and returns modified key/value.

```ts
interface MetaInfo {
  language: string;
  domain?: string;
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
  domain?: string;
}

transformFullOutput: async (output: string, meta: MetaInfo) => {
  if (meta.transformer.outputFormat === OutputFormat.JSON) {
    return processOutput(output);
  }

  return output;
};
```

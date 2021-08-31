# Plugins

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

## How to create plugin

### 1. Invent plugin

Great, you have and idea for plugin. Give it a suitable NAME.

### 2. Use template

Run these commands where NAME is plugin name you invented in step 1.

```sh
$ git clone git@github.com:AckeeCZ/lokse.git
$ cd lokse
$ cp -r plugin-template packages/plugin-NAME
```

### 3. Initialize the plugin

Set NAME of your plugin and its description in `package.json` fields and `README.md` description.

Plugin's name should always start with `@lokse/plugin-`.

### 4. Implement the plugin

Implement plugin factory in `src/index.ts` by exporting default function returning plugin (it's already prepared for you) with any of hooks mentioned in section [What can plugin do](#what-can-plugin-do).

All hooks are optional, you can implement any of them. Plugin factory receives `options` object which contains common options for all plugins plus any other options user passed in config file and also some meta information as a second argument

```ts
export default function (options: GeneralPluginOptions, meta: GeneralPluginMeta) {
  return createPlugin({
      transformLine: ...
      transformFullOutput: ...
  });
}

```

If you find plugin misconfigured or any other problem, you can throw a `PluginError` which will be gracefuly handled when initializing plugin.

```ts
import { createPlugin, PluginError } from "@lokse/core";

export default function (options: GeneralPluginOptions, meta: GeneralPluginMeta) {
  if (...) {
    throw new PluginError(`This is not a valid configuration`);
  }

  ...
}
```

Now please write at least few tests for the plugin's feature 🙏 You'll practice you're testing skills and contribute to better project quality and maintainability.

### 5. Voilà - plugin is ready 🎉

Don't forget to add him into [Packages](https://github.com/AckeeCZ/lokse/#packages) list in main readme.

Create PR to add it into the repo, wait for code review and approval for adding it into ecosystem.

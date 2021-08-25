# Plugins

## What can plugin do

Plugin can hook into various transformation process steps and modify the final result of the operation. To transform the result use any of possible hooks listed below.

### `transformLine`

Receives object of the type `Line` and must return `Line` too. On the line you can utilize `setKey` and `setValue` methods which accepts function with current key/value and returns modified key/value.

```ts
transformLine: async (line: Line) => {
    line.setKey((key) => key.substr(0, 1));
    line.setValue((value) => value.toUpperCase());

    return line;
};
```

### `transformFullOutput`

Receives composed output string that is about to write into a file. Like JSON object for json format type

```ts
transformFullOutput: async (output: string) => {
    return processOutput(output)
}
```

## How to create plugin

### 1. Invent plugin

Great, you have and idea for plugin. Invent him a suitable NAME.

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

All hooks are optional, you can implement any of them. Plugin factory receives `options` object which contains common options for all plugins  plus any other options user passed in config file.

```ts
export default function (options: GeneralPluginOptions) {
  return createPlugin({
      transformLine: ...
      transformFullOutput: ...
  });
}

```

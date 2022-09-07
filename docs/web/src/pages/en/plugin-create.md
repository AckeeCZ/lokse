---
title: How to create a plugin
description: Steps to create another lokse plugin
layout: ../../layouts/MainLayout.astro
---

### 1. Invent plugin

Great, you have and idea for plugin. Give it a suitable NAME.

### 2. Use template

Run these commands where NAME is plugin name you invented in step&nbsp;1.

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

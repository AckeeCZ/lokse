# lokse

A tool for efficient usage of translations stored in google spreadsheet

[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Version](https://img.shields.io/npm/v/lokse.svg)](https://npmjs.org/package/lokse)
[![Downloads/week](https://img.shields.io/npm/dw/lokse.svg)](https://npmjs.org/package/lokse)
[![License](https://img.shields.io/npm/l/lokse.svg)](https://github.com/AckeeCZ/lokse/blob/master/package.json)

- [Usage](#-usage)
- [Authentication](#-authentication)
- [Configuration](#-configuration)
- [Commands](#-commands)

## 🚀 Usage

<!-- usage -->

```sh-session
$ npm install -g lokse
$ lokse COMMAND
running command...
$ lokse (-v|--version|version)
lokse/2.2.2 darwin-x64 node-v14.18.0
$ lokse --help [COMMAND]
USAGE
  $ lokse COMMAND
...
```

<!-- usagestop -->

## 🔑 Authentication

The last version of Google Spreadsheets API requires us to be authenticated to allow fetching spreadsheet data. Read more about [authentication here](https://ackeecz.github.io/lokse/en/authentication/)

## 🔧 Configuration

CLI uses [`Cosmiconfig`](https://www.npmjs.com/package/cosmiconfig) which means you can hold the configuration in [any format it supports](https://github.com/davidtheclark/cosmiconfig#cosmiconfig).

So just create `lokse.config.js`, `.lokserc`, `.lokserc.yml`, `.lokserc.json` or add `lokse` property into the `package.json` and there you can setup on of the options:

### `sheetId`

Spreadsheet id. When you open your spreadsheet it's this string  
![](https://raw.githubusercontent.com/AckeeCZ/lokse/master/docs/spreadsheet-id.png)

### `dir`

Output directory where generated translation files will be written to.

### `languages`

List of languages you want to generate translations for. Also names of columns in spreadsheet.

### `column`

Name of spreadsheet columm containing translation ids.

### `format`

Format of output translation file.

### `sheets`

Target spreadsheet can contain more than one sheet and default behaviour is to use all of them, but sometimes you need only some of them. This option determines sheets to fetch translations from. You can define sheets you want to use or those you don't want to or combine these definition.

You can choose from various formats to define sheets to use

1. Special value `*` means to include all sheets and is the default behaviour when you omit the `sheets` option.

   ```json
   {
     "sheets": "*"
   }
   ```

2. Titles of sheets to use. Can be string or array of strings

   ```json
     {
       "sheets": "Web translations",
     }
     // or
     {
       "sheets": ["App translations", "Legal docs"]
     }
   ```

3. Definition of sheets to include or exclude from the list of all sheets. Can be one of formats mentioned above

   ```json
     {
       "sheets": {
         "include": ["Web translations", "Legal docs"],
         "exclude": "CMS translations"
       }
     }
     // or
     {
       "sheets": {
         "exclude": ["CMS translations"]
       }
     }
     // or
     {
       "sheets": {
         "include": ["Web translations", "Legal docs"],
       }
     }
   ```

### Plugins

List of plugins to use. Plugin can be either name of plugin, or object containing name and options. **You must install first.**

```shell
$ yarn add -D @lokse/plugin-prettify @lokse/plugin-transform-values
```

```json
plugins: [
  "@lokse/plugin-prettify",
  {
    "name": "@lokse/plugin-transform-values",
    "options": {
      "uppercase": "true"
    }
  }
],
```

---

### Example of `.lokserc`

```json
{
  "sheetId": "1HKjvejcuHIY73WvEkipD7_dmF9dFeNLji3nS2RXcIzk",
  "dir": "locales",
  "languages": ["cs", "en", "fr"],
  "column": "key_web",
  "format": "json",
  "sheets": ["App translations", "Legal docs"],
  "plugins": []
}
```

## 🕹 Commands

<!-- commands -->

- [`lokse help [COMMAND]`](#lokse-help-command)
- [`lokse init`](#lokse-init)
- [`lokse open`](#lokse-open)
- [`lokse update`](#lokse-update)

## `lokse help [COMMAND]`

display help for lokse

```
USAGE
  $ lokse help [COMMAND]

ARGUMENTS
  COMMAND  command to show help for

OPTIONS
  --all  see all commands in CLI
```

_See code: [@oclif/plugin-help](https://github.com/oclif/plugin-help/blob/v3.3.1/src/commands/help.ts)_

## `lokse init`

create a new config file

```
USAGE
  $ lokse init

OPTIONS
  -h, --help  show CLI help

EXAMPLE
  $ lokse init
```

_See code: [lib/commands/init.js](https://github.com/AckeeCZ/lokse/blob/v2.2.2/lib/commands/init.js)_

## `lokse open`

open localization spreadsheet in default browser

```
USAGE
  $ lokse open

OPTIONS
  -h, --help   show CLI help
  -i, --id=id  spreadsheet id

EXAMPLE
  $ lokse open -i 1HKjvejcuHIY73WvEkipD7_dmF9dFeNLji3nS2RXcIzk
```

_See code: [lib/commands/open.js](https://github.com/AckeeCZ/lokse/blob/v2.2.2/lib/commands/open.js)_

## `lokse update`

update translations from localization spreadsheet

```
USAGE
  $ lokse update

OPTIONS
  -c, --col=col                    column containing translations keys. For example key_web.
  -d, --dir=dir                    output folder
  -f, --format=(json|android|ios)  output format. Default is json.
  -h, --help                       show CLI help
  -i, --id=id                      spreadsheet id

  -l, --languages=languages        translation columns languages. Multiple values are comma separated. For example
                                   cs,en,fr

  -s, --sheets=sheets              sheets to get translations from. Name or list of names, comma separated. For example
                                   Translations1,Translations2

EXAMPLES
  $ lokse update
  $ lokse update -i 1HKjvejcuHIY73WvEkipD7_dmF9dFeNLji3nS2RXcIzk -d locales -l cz,en,fr -t key_web
```

_See code: [lib/commands/update.js](https://github.com/AckeeCZ/lokse/blob/v2.2.2/lib/commands/update.js)_

<!-- commandsstop -->

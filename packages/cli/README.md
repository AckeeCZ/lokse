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
$ lokse (--version)
lokse/3.1.0 darwin-arm64 node-v20.16.0
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
      "sheets": "*",
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
### `splitTranslations`

Enables splitting translations into multiple files which is useful for lazy loading of some big parts of translations (eg. translation of the whole legal document).

You have two ways of how to split your translations:

- **Split by sheets - `splitTranslations: true`** - each sheet means one translations file and name of file is determined by sheet title. Given 3 sheets in yout spreadsheet named "App translations", "Legal docs", "Landing Page" the result will be 3 files named `app-translations.cs.json`, `legal-docs.cs.json`, `landing-page.cs.json` (of course the language and format depends on your settings).

- **Split by domains - `splitTranslations: string[]`** - this configuration expects an array of domain names. Domain is a first part of your translation id, given translation id `news.mostRead.error.text` the domain is `news`. The domain name determines also the filename, `news.cs.json` in our example.  
  Translations that starts with domain `news.` will be written into the `news.cs.json`, other translations that does not belong to any other group will be saved into general translations in file `cs.json`.

The `splitTranslations` option can be provided only through configuration not inline CLI parameter.

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
  "splitTranslations": ["news", "documents"],
  "plugins": []
}
```

## 🕹 Commands

<!-- commands -->
* [`lokse help [COMMAND]`](#lokse-help-command)
* [`lokse init`](#lokse-init)
* [`lokse open`](#lokse-open)
* [`lokse update`](#lokse-update)

## `lokse help [COMMAND]`

Display help for lokse.

```
USAGE
  $ lokse help [COMMAND...] [-n]

ARGUMENTS
  COMMAND...  Command to show help for.

FLAGS
  -n, --nested-commands  Include all nested commands in the output.

DESCRIPTION
  Display help for lokse.
```

_See code: [@oclif/plugin-help](https://github.com/oclif/plugin-help/blob/v6.2.27/src/commands/help.ts)_

## `lokse init`

create a new config file

```
USAGE
  $ lokse init [-h]

FLAGS
  -h, --help  Show CLI help.

DESCRIPTION
  create a new config file

EXAMPLES
  $ lokse init
```

_See code: [lib/commands/init.js](https://github.com/AckeeCZ/lokse/blob/v3.1.0/lib/commands/init.js)_

## `lokse open`

open localization spreadsheet in default browser

```
USAGE
  $ lokse open [-h] [-i <value>]

FLAGS
  -h, --help        Show CLI help.
  -i, --id=<value>  spreadsheet id

DESCRIPTION
  open localization spreadsheet in default browser

EXAMPLES
  $ lokse open -i 1HKjvejcuHIY73WvEkipD7_dmF9dFeNLji3nS2RXcIzk
```

_See code: [lib/commands/open.js](https://github.com/AckeeCZ/lokse/blob/v3.1.0/lib/commands/open.js)_

## `lokse update`

update translations from localization spreadsheet

```
USAGE
  $ lokse update [-h] [-i <value>] [-d <value>] [-l <value>] [-c <value>] [-f json|android|ios] [-s <value>]

FLAGS
  -c, --col=<value>        column containing translations keys. For example key_web.
  -d, --dir=<value>        output folder
  -f, --format=<option>    output format. Default is json.
                           <options: json|android|ios>
  -h, --help               Show CLI help.
  -i, --id=<value>         spreadsheet id
  -l, --languages=<value>  translation columns languages. Multiple values are comma separated. For example cs,en,fr
  -s, --sheets=<value>     sheets to get translations from. Name or list of names, comma separated. For example
                           Translations1,Translations2

DESCRIPTION
  update translations from localization spreadsheet

EXAMPLES
  $ lokse update

  $ lokse update -i 1HKjvejcuHIY73WvEkipD7_dmF9dFeNLji3nS2RXcIzk -d locales -l cz,en,fr -t key_web
```

_See code: [lib/commands/update.js](https://github.com/AckeeCZ/lokse/blob/v3.1.0/lib/commands/update.js)_
<!-- commandsstop -->

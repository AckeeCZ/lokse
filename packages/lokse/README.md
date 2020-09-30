lokse
===

Tool to efficient usage of translations stored in google spreadsheet

[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Version](https://img.shields.io/npm/v/lokse.svg)](https://npmjs.org/package/lokse)
[![Downloads/week](https://img.shields.io/npm/dw/lokse.svg)](https://npmjs.org/package/lokse)
[![License](https://img.shields.io/npm/l/lokse.svg)](https://github.com/AckeeCZ/lokse/blob/master/package.json)


* [Usage](#usage)
* [Authentication](#authentication)
* [Configuration](#configuration)
* [Commands](#commands)

# Usage
<!-- usage -->
```sh-session
$ npm install -g lokse
$ lokse COMMAND
running command...
$ lokse (-v|--version|version)
lokse/1.0.0-beta.0 darwin-x64 node-v12.17.0
$ lokse --help [COMMAND]
USAGE
  $ lokse COMMAND
...
```
<!-- usagestop -->
# Authentication

Last version of Google Spreadsheets API requires us to be authenticated to allow fetching spreadsheet data.

For read only access, we're good with usage of API key, if you don't have any, follow [the instructions here](https://theoephraim.github.io/node-google-spreadsheet/#/getting-started/authentication?id=api-key) to create one. 

Once you have the key, you can use it with each command

```sh-session
$ LOKSE_API_KEY=put_here_you_own_api_key lokse update
```

or export it to be able using commands without the it

```sh-session
$ export LOKSE_API_KEY=put_here_you_own_api_key 
$ lokse update
```

> For the sake of security reasons **Never check your API keys / secrets into version control** (git)

# Configuration

CLI uses [`Cosmiconfig`](https://www.npmjs.com/package/cosmiconfig) which means you can hold the configuration in [any format it supports](https://github.com/davidtheclark/cosmiconfig#cosmiconfig). 

So just create `lokse.config.js`, `.lokserc`, `lokse.yml`, `lokse.json` or add `lokse` property into the `package.json` and there you can setup on of the options:

## Options

* **`sheetId`** - spreadsheet id. When you open your spreadsheet it's this string ![](https://github.com/AckeeCZ/lokse/doc/spreadsheet-id.png)
* **`dir`** - output directory where generatd translation files will be written
* **`languages`** - list of languages you want to generate translations for. Also names of columns in spreadsheet
* **`column`** - name of spreadsheet columm containing translation ids
* **`format`** - format of output translation file

Example of `.lokserc`

```json
{
  "sheetId": "1HKjvejcuHIY73WvEkipD7_dmF9dFeNLji3nS2RXcIzk",
  "dir": "locales",
  "languages": [
    "cs",
    "en",
    "fr"
  ],
  "column": "key_web",
  "format": "json"
}
```

# Commands
<!-- commands -->
* [`lokse help [COMMAND]`](#lokse-help-command)
* [`lokse open`](#lokse-open)
* [`lokse update`](#lokse-update)

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

_See code: [@oclif/plugin-help](https://github.com/oclif/plugin-help/blob/v3.2.0/src/commands/help.ts)_

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

_See code: [src/commands/open.ts](https://github.com/AckeeCZ/lokse/blob/v1.0.0-beta.0/src/commands/open.ts)_

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

EXAMPLE
  $ lokse update -i 1HKjvejcuHIY73WvEkipD7_dmF9dFeNLji3nS2RXcIzk -d locales -l cz,en,fr -t key_web
```

_See code: [src/commands/update.ts](https://github.com/AckeeCZ/lokse/blob/v1.0.0-beta.0/src/commands/update.ts)_
<!-- commandsstop -->

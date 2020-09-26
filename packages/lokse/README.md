lokse
===

Tool to efficient usage of translations stored in google spreadsheet

[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Version](https://img.shields.io/npm/v/lokse.svg)](https://npmjs.org/package/lokse)
[![Downloads/week](https://img.shields.io/npm/dw/lokse.svg)](https://npmjs.org/package/lokse)
[![License](https://img.shields.io/npm/l/lokse.svg)](https://github.com/AckeeCZ/lokse/blob/master/package.json)

<!-- toc -->
* [Usage](#usage)
* [Commands](#commands)
<!-- tocstop -->
# Usage
<!-- usage -->
```sh-session
$ npm install -g lokse
$ lokse COMMAND
running command...
$ lokse (-v|--version|version)
lokse/0.1.0 darwin-x64 node-v12.17.0
$ lokse --help [COMMAND]
USAGE
  $ lokse COMMAND
...
```
<!-- usagestop -->
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

opens localization spreadsheet

```
USAGE
  $ lokse open

OPTIONS
  -h, --help   show CLI help
  -i, --id=id  spreadsheet id

EXAMPLE
  $ lokse open -i 1HKjvejcuHIY73WvEkipD7_dmF9dFeNLji3nS2RXcIzk
```

_See code: [src/commands/open.ts](https://github.com/AckeeCZ/lokse/blob/v0.1.0/src/commands/open.ts)_

## `lokse update`

updates localization files

```
USAGE
  $ lokse update

OPTIONS
  -c, --col=col                    column containing translations keys. For example key_web.
  -d, --dir=dir                    output folder
  -f, --format=(json|android|ios)  output format. One of json, android, ios. Default is json.
  -h, --help                       show CLI help
  -i, --id=id                      spreadsheet id

  -l, --languages=languages        translation columns languages. Multiple values are comma separated. For example
                                   cs,en,fr

EXAMPLE
  $ lokse update -i 1HKjvejcuHIY73WvEkipD7_dmF9dFeNLji3nS2RXcIzk -d locales -l cz,en,fr -t key_web
```

_See code: [src/commands/update.ts](https://github.com/AckeeCZ/lokse/blob/v0.1.0/src/commands/update.ts)_
<!-- commandsstop -->

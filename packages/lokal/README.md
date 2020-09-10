lokal
===

Tool to efficient usage of translations stored in google spreadsheet

[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Version](https://img.shields.io/npm/v/lokal.svg)](https://npmjs.org/package/lokal)
[![Downloads/week](https://img.shields.io/npm/dw/lokal.svg)](https://npmjs.org/package/lokal)
[![License](https://img.shields.io/npm/l/lokal.svg)](https://github.com/AckeeCZ/localize-with-spreadsheet/blob/master/package.json)

<!-- toc -->
* [Usage](#usage)
* [Commands](#commands)
<!-- tocstop -->
# Usage
<!-- usage -->
```sh-session
$ npm install -g lokal
$ lokal COMMAND
running command...
$ lokal (-v|--version|version)
lokal/0.1.0 darwin-x64 node-v12.17.0
$ lokal --help [COMMAND]
USAGE
  $ lokal COMMAND
...
```
<!-- usagestop -->
# Commands
<!-- commands -->
* [`lokal help [COMMAND]`](#lokal-help-command)
* [`lokal open`](#lokal-open)
* [`lokal update`](#lokal-update)

## `lokal help [COMMAND]`

display help for lokal

```
USAGE
  $ lokal help [COMMAND]

ARGUMENTS
  COMMAND  command to show help for

OPTIONS
  --all  see all commands in CLI
```

_See code: [@oclif/plugin-help](https://github.com/oclif/plugin-help/blob/v3.2.0/src/commands/help.ts)_

## `lokal open`

opens localization spreadsheet

```
USAGE
  $ lokal open

OPTIONS
  -h, --help   show CLI help
  -i, --id=id  spreadsheet id

EXAMPLE
  $ lokal open -i 1HKjvejcuHIY73WvEkipD7_dmF9dFeNLji3nS2RXcIzk
```

_See code: [src/commands/open.ts](https://github.com/AckeeCZ/lokal/blob/v0.1.0/src/commands/open.ts)_

## `lokal update`

updates localization files

```
USAGE
  $ lokal update

OPTIONS
  -c, --col=col                                 column containing translations keys. For example key_web.
  -d, --dir=dir                                 output folder

  -f, --format=(json|android|ios|dart|dot-net)  output format. One of json, android, ios, dart, dot-net. Default is
                                                json.

  -h, --help                                    show CLI help

  -i, --id=id                                   spreadsheet id

  -l, --languages=languages                     translation columns languages. Multiple values are comma separated. For
                                                example cs,en,fr

EXAMPLE
  $ lokal update -i 1HKjvejcuHIY73WvEkipD7_dmF9dFeNLji3nS2RXcIzk -d locales -l cz,en,fr -t key_web
```

_See code: [src/commands/update.ts](https://github.com/AckeeCZ/lokal/blob/v0.1.0/src/commands/update.ts)_
<!-- commandsstop -->

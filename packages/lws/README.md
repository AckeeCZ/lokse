lws
===

Tool to efficient usage of translations stored in google spreadsheet

[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Version](https://img.shields.io/npm/v/lws.svg)](https://npmjs.org/package/lws)
[![Downloads/week](https://img.shields.io/npm/dw/lws.svg)](https://npmjs.org/package/lws)
[![License](https://img.shields.io/npm/l/lws.svg)](https://github.com/AckeeCZ/localize-with-spreadsheet/blob/master/package.json)

<!-- toc -->
* [Usage](#usage)
* [Commands](#commands)
<!-- tocstop -->
# Usage
<!-- usage -->
```sh-session
$ npm install -g lws
$ lws COMMAND
running command...
$ lws (-v|--version|version)
lws/0.1.0 darwin-x64 node-v12.17.0
$ lws --help [COMMAND]
USAGE
  $ lws COMMAND
...
```
<!-- usagestop -->
# Commands
<!-- commands -->
* [`lws hello [FILE]`](#lws-hello-file)
* [`lws help [COMMAND]`](#lws-help-command)

## `lws hello [FILE]`

describe the command here

```
USAGE
  $ lws hello [FILE]

OPTIONS
  -f, --force
  -h, --help       show CLI help
  -n, --name=name  name to print

EXAMPLE
  $ lws hello
  hello world from ./src/hello.ts!
```

_See code: [src/commands/hello.ts](https://github.com/AckeeCZ/localize-with-spreadsheet/blob/v0.1.0/src/commands/hello.ts)_

## `lws help [COMMAND]`

display help for lws

```
USAGE
  $ lws help [COMMAND]

ARGUMENTS
  COMMAND  command to show help for

OPTIONS
  --all  see all commands in CLI
```

_See code: [@oclif/plugin-help](https://github.com/oclif/plugin-help/blob/v3.2.0/src/commands/help.ts)_
<!-- commandsstop -->

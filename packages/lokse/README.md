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

## 🚀 Usage
<!-- usage -->
```sh-session
$ npm install -g lokse
$ lokse COMMAND
running command...
$ lokse (-v|--version|version)
lokse/1.2.0 darwin-x64 node-v12.17.0
$ lokse --help [COMMAND]
USAGE
  $ lokse COMMAND
...
```
<!-- usagestop -->
## 🔑 Authentication 

Last version of Google Spreadsheets API requires us to be authenticated to allow fetching spreadsheet data.

There are two options for authentication: Service Account or API key. For each of these options we have to define some values as  environment variables.

### Environment variables
 
We have practically two ways of how to define environment variables containing API key or Service Account credentials

Use it before the command like

```sh-session
$ LOKSE_SERVICE_ACCOUNT_EMAIL=this_is_account_email LOKSE_PRIVATE_KEY=this_is_the_private_key lokse update
```

or use more flexible and handy way of keeping variables inside the `.env.local` file. Create the file if you don't have it yet  and put your variables into it like

```
LOKSE_SERVICE_ACCOUNT_EMAIL=this_is_account_email
LOKSE_PRIVATE_KEY=this_is_the_private_key
```

then you'll be able to run

```sh-session 
$ lokse update
```

> For the sake of security reasons **Never check your API keys / secrets into version control**. That means you should **not forget to add `.env.local` into the `.gitignore`**.


### Service Account

Currently the best option of authentication is to create a Service account (if you don't have any, follow [the instructions here](https://theoephraim.github.io/node-google-spreadsheet/#/getting-started/authentication?id=service-account)) and then setup at least read permissions for your account in the spreadsheet. 

Since every Service account contains email adress just click the "Share" button at top right corner of the spreadsheet and add your Service account email there.

Once you have the Service account created, you should have its client email and private key. It looks smilar to this

```
"client_email": "localize-with-spreadsheet@localize-with-spreadsheet.iam.gserviceaccount.com",
"private_key": "-----BEGIN PRIVATE KEY-----\nAnd_there_is_long_text_of_random_characters_that_defines_the_private_key\n-----END PRIVATE KEY-----\n",
```

Take these two values, put them into `LOKSE_SERVICE_ACCOUNT_EMAIL` and `LOKSE_PRIVATE_KEY` variables using one of two ways [described above](#environment-variables) and there you go, fetching data from spreadsheet should work now.


### API key

For read only access, we're good with usage of API key, if you don't have any, follow [the instructions here](https://theoephraim.github.io/node-google-spreadsheet/#/getting-started/authentication?id=api-key) to create one. 

Then define the variable `LOKSE_API_KEY=this_is_your_api_key` and then if the key is valid fetching data should work for you.

Using API key instead of Service account has one important limitation: You spreadsheet must set permissions to be visible for everyone in the Internet.

## 🔧 Configuration

CLI uses [`Cosmiconfig`](https://www.npmjs.com/package/cosmiconfig) which means you can hold the configuration in [any format it supports](https://github.com/davidtheclark/cosmiconfig#cosmiconfig). 

So just create `lokse.config.js`, `.lokserc`, `.lokserc.yml`, `.lokserc.json` or add `lokse` property into the `package.json` and there you can setup on of the options:

### Options

* **`sheetId`** - spreadsheet id. When you open your spreadsheet it's this string ![](https://github.com/AckeeCZ/lokse/doc/spreadsheet-id.png)
* **`dir`** - output directory where generatd translation files will be written
* **`languages`** - list of languages you want to generate translations for. Also names of columns in spreadsheet
* **`column`** - name of spreadsheet columm containing translation ids
* **`format`** - format of output translation file
* **`sheets`** - titles of sheets to use. Can be string or array of string. If none provided, all sheets are used.

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
  "format": "json",
  "sheets": ["App translations", "Legal docs"]
}
```

## 🕹 Commands 
<!-- commands -->
* [`lokse help [COMMAND]`](#lokse-help-command)
* [`lokse open`](#lokse-open)
* [`lokse update`](#lokse-update)

### `lokse help [COMMAND]`

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

### `lokse open`

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

_See code: [src/commands/open.ts](https://github.com/AckeeCZ/lokse/blob/v1.2.0/src/commands/open.ts)_

### `lokse update`

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

_See code: [src/commands/update.ts](https://github.com/AckeeCZ/lokse/blob/v1.2.0/src/commands/update.ts)_
<!-- commandsstop -->

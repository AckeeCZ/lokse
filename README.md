# Convert a Google Spreadsheet to a localization file


## Installation
	npm install ackee-localize-spreadsheet-sdk -g

## Usage

ackee-localize-spreadsheet-sdk [options]

| Shortcut   |      Option      |  Description |
|----------|:-------------:|------:|
| -i | --id [value] | Spreadsheet ID |
| -d | --dir [value] | Output folder |
| -c | --cols [value] | Translation collumns |
| -t | --type [value] | Type (key_web, key_android, key_ios) |
| -h | --help | Output usage information |

## Example
### Use configuration file '.ackeeconfig.json' and run
    ackee-localize-spreadsheet-sdk

### or use flags 
    ackee-localize-spreadsheet-sdk -i 1HKjvejcuHIY73WvEkipD7_dmF9dFeNLji3nS2RXcIzk -d locales/ -c cz,en,fr -t key_web

## Notes
- Your spreadsheet should be "Published" for this to work
- You need to have git installed for the installation

Jakub Baierl & Jiří Šmolík & Lukáš Kočí

Fork of <a href="https://github.com/xavierha/localize-with-spreadsheet" target="_blank">https://github.com/xavierha/localize-with-spreadsheet</a>
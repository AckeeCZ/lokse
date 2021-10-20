# @lokse/plugin-

Plugin for replacing white spaces after single letter characters with non-breking space.

In some languages there are special chracters such as `§ or ¶` or even single letter words like `a` etc.
These characters should not stay by the end of the lines, by the languge typographic rules,
therefore we replace them with non-breking space, to force them appera on a new line.

https://practicaltypography.com/nonbreaking-spaces.html

## Installation

```sh
$ yarn add -D @lokse/plugin-non-breaking-spaces
```

## Usage

Add it into plugins section of lokse config

### Options 

`useNbsp` — Replacese adds HTML entity for non-breking space instead regular non-breaking white space

`customPatterns` — Adds the possibility to extend the default patterns with custom language patterns

```json
{
    "plugins": [
        { 
            "name": "@lokse/plugin-non-breaking-spaces", 
            // options are optional )))
            "options": { 
                useNbsp: true;
                customPatterns: {
                    // provide custom regex patter without flags
                    // default flag is gim
                    // use the language code as key (has to be the same as your lang in the spreadsheet)
                    "ad-HD": "(\\s|^)(a|i|k|o|s|u|v|z)(\\s+)"
                }
            }
        }
    ]
}
```

## License
Lokse is licensed under the MIT License.
Documentation is licensed under Creative Commons License.
Created with ♥ by [@horaklukas](https://github.com/horaklukas) and all the great contributors.
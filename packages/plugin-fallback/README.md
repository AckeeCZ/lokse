# @lokse/plugin-fallback

Plugin for fallbacking missing translations to the default language translation.

## Installation

```sh
$ yarn add -D @lokse/plugin-fallback
```

## Usage

Add it into plugins section of lokse config, and pass an options with default language

```json
{
    "plugins": [
        { 
            "name": "@lokse/plugin-fallback", 
            "options": { 
                "defaultLanguage": "cs-CZ" 
            }
        }
    ]
}
```

## License
Lokse is licensed under the MIT License.
Documentation is licensed under Creative Commons License.
Created with ♥ by [@horaklukas](https://github.com/horaklukas) and all the great contributors.
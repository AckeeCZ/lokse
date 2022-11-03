# @lokse/plugin-split

Plugin for splitting translations into multiple files. It might be useful eg. for lazy loading of some big parts of translations (eg. translation of the whole legal document).

## Installation

```sh
$ yarn add -D @lokse/plugin-split
```

## Usage

Add it into plugins section of lokse config

```json
{
  "plugins": ["@lokse/plugin-split"]
}
```

or

```json
{
    "plugins": [
        {
            "name": "@lokse/plugin-split",
            "options" // ...plugin options
        }
    ]
}
```

### Plugin options

`namespaces` — List of namespaces to split by, see explanation in [Splitting](#splitting) section below 👇

```json
{
    "plugins": [
        {
            "name": "@lokse/plugin-split",
            "options" {
                "namespaces": ["app", "login", "home"]
            }
        }
    ]
}
```

### Splitting

You have two ways of how to split your translations:

1. Split by sheets - is automatically done when you don't provide a `namespaces` option. Each sheet means one translations file and name of file is determined by sheet title. Given 3 sheets in yout spreadsheet named “App translations”, “Legal docs”, “Landing Page” the result will be 3 files named `app-translations.cs.json`, `legal-docs.cs.json`, `landing-page.cs.json` (of course the language adepends on your settings).

2. Split by namespaces - split by list of provided namespaces. Namespace is a first part of your translation id. Given translation id `news.mostRead.error.text` the namespace is `news`. The namespace name determines also the filename, `news.cs.json` in our example.
   Translations that starts with namespace `news`. will be written into the `news.cs.json`, other translations that does not belong to any other group will be processed by native meachanism that saves them into the general translations file `cs.json`.

## License

Lokse is licensed under the MIT License.
Documentation is licensed under Creative Commons License.
Created with ♥ by [@horaklukas](https://github.com/horaklukas) and all the great contributors.

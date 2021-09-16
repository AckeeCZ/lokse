# @lokse/plugin-prettier

Plugin used to format output translations file using Prettier.

## Installation

```sh
$ yarn add -D @lokse/plugin-prettier
```

## Usage

Add it into plugins section of lokse config

```json
{
    "plugins": ["@lokse/plugin-prettier"]
}
```

If you have [Prettier config](https://prettier.io/docs/en/configuration.html) in your project it will be automatically loaded, otherwise default prettier config is used. 
The file where translations are outputed into is then formatted with Prettier.

**Prettier plugin currently supports only JSON output format.** If you need other format, please make a [Feature request](https://github.com/AckeeCZ/lokse/issues) or better implement it and make pull request 🙂

## Options

Plugin has no configuration options.

## License
Lokse is licensed under the MIT License.
Documentation is licensed under Creative Commons License.
Created with ♥ by [@horaklukas](https://github.com/horaklukas) and all the great contributors.
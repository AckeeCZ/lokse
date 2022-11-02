<p align="center">
  <img width="150" src="./images/lokse256.png">
</p>
<h1 align="center"> Lokse </h1>
<p align="center">
    <b>Localize your app from spreadsheet</b>
</p>

## Description

This is a multi package repository of the **lokse** project. The project's goal is to faciliate the work with translations held in Google spreadsheet.

## Brief history

- The original idea is from [`localize-with-spreadsheet`](https://github.com/xavierha/localize-with-spreadsheet) package
- We adopted it and made a package "fork" [`ackee-localize-spreadsheet-sdk`](https://www.npmjs.com/package/ackee-localize-spreadsheet-sdk) used by all 3 platforms (iOS, Android, Web)
- As the time went, other platforms (iOS, Android) abandoned the package and the Web platform remained as the only one using it
- Because of several reasons, the tool was reworked into the next generation version and first released in September 2020 (before Google [stopped support for unauthenticated access to its Sheets API](https://cloud.google.com/blog/products/g-suite/migrate-your-apps-use-latest-sheets-api), which was on of the resons) 🚀

## The name meaning

You're maybe curious what the name means. Some people can pronounce it as Lokše which is a name for [Slovak potato flatbread](https://www.google.com/search?q=lok%C5%A1e+recipe&oq=lok%C5%A1e+recipe&aqs=chrome..69i57j0l7.2201j0j7&sourceid=chrome&ie=UTF-8).  
Maybe it was an inspiration. But the truth is, it's a little pun. The name has evolved by abbreaviating the term localization sheet and transcripting Czech pronounciation:

**Loc**alization **She**et ➡ **LocShe** ➡ **LokShe** ("c" is pronounced as "k" in Czech) ➡ **LokŠe** ("sh" is pronounced as "š") ➡ **Lokse** 🤓

## Packages

- [`lokse`](./packages/cli) - CLI tool for updating project's translations from Google spreadsheet
- [`@lokse/core`](./packages/core) - Core functionality handling fetch of sheet, extracting, parsing data and writing in output format.
- [`@lokse/plugin-prettier`](./packages/plugin-prettier) - Plugin used to format output translations file using Prettier.
- [`@lokse/plugin-fallback`](./packages/plugin-fallback) - Plugin for fallbacking missing translations to the default language translation.
- [`@lokse/plugin-non-breaking-spaces`](./packages/plugin-non-breaking-spaces) - Plugin for replacing white spaces after single letter characters with non-breking space.
- [`@lokse/plugin-split`](./packages/plugin-split) - Plugin for splitting translations into multiple files.

## VsCode extension

There is an [extension](https://marketplace.visualstudio.com/items?itemName=ackee.lokse) into VsCode editor that allows you to run commands easily.

## Credits

- Author of `localize-with-spreadsheet` - [Xavier H.](https://github.com/xvrh)
- Authors of `ackee-localize-spreadsheet-sdk` - [Jakub Baierl](https://github.com/baierjak), [Jiří Šmolík](https://github.com/smoliji), Lukáš Kočí

Fork of <a href="https://github.com/xavierha/localize-with-spreadsheet" target="_blank">https://github.com/xavierha/localize-with-spreadsheet</a>

## License

Lokse is licensed under the MIT License.  
Documentation is licensed under Creative Commons License.  
Created with ♥ by [@horaklukas](https://github.com/horaklukas) and all the great contributors.

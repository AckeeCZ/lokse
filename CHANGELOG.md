# Changelog

<a name="2.0.1"></a>
## 2.0.1 (2021-09-16)

### Fixed

- 🐛 Fix splitting translations by domain that contains dot char [[8c444a7](https://github.com/AckeeCZ/lokse/commit/8c444a72755cd7a8cc560d180b7b4f3d164b03ea)]
- 💚 Fix release step by running build before release [[6dd70bf](https://github.com/AckeeCZ/lokse/commit/6dd70bf4076eb73f4beb72615b33ea1b1ba58736)]

### Changed

- 📝 Add fallback plugin into the list of plugins [[ad72a06](https://github.com/AckeeCZ/lokse/commit/ad72a06c49ddad658178071d0d686d25a60f651e)]


<a name="2.0.0"></a>
## 2.0.0 (2021-09-16)

### Added

- ✨ Add runtime code for creating and loading plugins [[1b899d0](https://github.com/AckeeCZ/lokse/commit/1b899d0411d2b8ee74f8e42a42dcb62c90654582)]
- ✨ Support plugins in output writer [[c1945d3](https://github.com/AckeeCZ/lokse/commit/c1945d3bd085a4ea8346f620f951aac260373426)]
- ✨ Add support for plugins in config file [[1ac7faf](https://github.com/AckeeCZ/lokse/commit/1ac7fafe28d079ed8e3ff0bb1e7c018bdc5ae1d6]
- ✨ Load and use plugins in update command [[2ff4835](https://github.com/AckeeCZ/lokse/commit/2ff483539f0be9c51d4390726ea54f749426c6b5)]
- ✨ Add handling of known plugin errors [[e308a5d](https://github.com/AckeeCZ/lokse/commit/e308a5d8a85d74c7b97a40d97a9746bee2f295aa)]
- ✨ Add fallback language plugin [[66736a3](https://github.com/AckeeCZ/lokse/commit/66736a31ee5d5ffc86a30260042b6547babb7874)]
- ✨ Add new plugin hook readTranslation [[8dafcbd](https://github.com/AckeeCZ/lokse/commit/8dafcbdecf55ae63a9761a6c4372738b218e279d)]
- ✨ Extract formatting by prettier into plugin-prettier [[7c04006](https://github.com/AckeeCZ/lokse/commit/7c04006686c3ac5130328467ea9557087c969632)]
- ✨ Add outputFormat property on Transformer object [[9e62808](https://github.com/AckeeCZ/lokse/commit/9e62808aeb198d944366159611be90e10679b193)]
- ✨ Pass general meta info into the plugins runner [[4070869](https://github.com/AckeeCZ/lokse/commit/40708691420753b371d78ad0b2ba0bce6e8d9f61)]
- ✨ Pass meta information into transformLine hook [[cd8601b](https://github.com/AckeeCZ/lokse/commit/cd8601ba9f5e1cbf2d29c7c849cbe9f71ded0dbd)]
- ✨ Add meta info as a 2nd argument to transformFullOuput [[a5d4b98](https://github.com/AckeeCZ/lokse/commit/a5d4b983ef33af94cb7eb7d2e3bd1f951519477f)]
- ✨ Add plugins template [[3ddd4d7](https://github.com/AckeeCZ/lokse/commit/3ddd4d790dec05b2d00f23d6fb79a1eef93ccf49)]

### Changed

- ♻️ Get rid of oclif dependency in core package [[7aa59ca](https://github.com/AckeeCZ/lokse/commit/7aa59ca37b099c58c33e57bd0453763a8aba9db2)]
- ♻️ Allow optionally passing logger into worksheet and spreadsheet reader [[94b2f90](https://github.com/AckeeCZ/lokse/commit/94b2f90bde00c39df261cbc0ed4cadeee4fe556e)]
- ♻️ Make lokse/core from peer a regular dependency [[d0a85eb](https://github.com/AckeeCZ/lokse/commit/d0a85eba09c5b7e50a9ab0165c76b7ee032bbc8f)]
- 🔧 Set preserveSymlinks TS compiler flag [[a137958](https://github.com/AckeeCZ/lokse/commit/a137958f0d83484464464d26fe115ae3a4aabe3f)]
- 💬 Change text of error message a bit [[569ee22](https://github.com/AckeeCZ/lokse/commit/569ee223e8f3caa857e23b0e1f6f6dcb6fc9a3b7)]
- ⬆️ Run instant yarn upgrade to fix vulnerabilities [[4018428](https://github.com/AckeeCZ/lokse/commit/40184283b18a32d32852a86f1f7ad6ca3018f9f7)]
- ⬆️ Bump axios from 0.21.1 to 0.21.4 [[63845a9](https://github.com/AckeeCZ/lokse/commit/63845a91543e74346f5aaf70b6cc364c9f57364f)]
- ⬆️ Bump ssri from 6.0.1 to 6.0.2 [[d935efb](https://github.com/AckeeCZ/lokse/commit/d935efbeeba42b253ae444cbfe2b437ba1b5b9c8)]
- ⬆️ Bump browserslist from 4.16.3 to 4.16.6 [[fa4a77d](https://github.com/AckeeCZ/lokse/commit/fa4a77dcc26a7b42983721cf9e323dc48a418199)]
- 🔧 Disable automatic creating of GH release [[3e10ab9](https://github.com/AckeeCZ/lokse/commit/3e10ab96dddb81d4539aafe288335d48530de7ba)]
- 📝 Add @lokse/core into the list of packages in readme [[1d93566](https://github.com/AckeeCZ/lokse/commit/1d935667540fa9126c6f5ec69b0c4c54b82e04e2)]
- 📝 Add plugins documentation [[c5558e6](https://github.com/AckeeCZ/lokse/commit/c5558e6179e458c4bf7d858b1409addfcad0a16d)]
- 📝 Extract authentication into standalone document [[a0e7b6d](https://github.com/AckeeCZ/lokse/commit/a0e7b6dfc90d3479cf3e4d2b49605ed976e05730)]
- 🏷️ Remove type of error from catch in runner [[4ada757](https://github.com/AckeeCZ/lokse/commit/4ada757bce296f8b271efff3064e7cb68f6e7208)]

### Removed

- 🔥 Remove duplicated config in example [[3ffd7c0](https://github.com/AckeeCZ/lokse/commit/3ffd7c078b58854260010a58e46577feb0a4d731)]
- ➖ Use npx to execute gitmoji-changelog, remove it from deps [[a64529e](https://github.com/AckeeCZ/lokse/commit/a64529e9a4c5cfc3319a55e4b519471fb5d07602)]


<a name="1.7.0"></a>
## 1.7.0 (2021-05-25)

### Changed

- 🔧 Remove distTag alpha from lerna config [[55909ca](https://github.com/AckeeCZ/lokse/commit/55909ca0d5908b9c2c64553f65b7987445028662)]


<a name="1.7.0-alpha.3"></a>
## 1.7.0-alpha.3 (2021-05-25)

### Changed

- ⬆️ Update dependencies in yarn.lock [[6851aff](https://github.com/AckeeCZ/lokse/commit/6851affcf5d7d9504926f81753b1a1214bc3fb30)]

### Fixed

- 🐛 Set typescript loader compiler options [[c5e655a](https://github.com/AckeeCZ/lokse/commit/c5e655abe1fc004377a60d092d8d72ebcca8bedc)]

<a name="1.7.0-alpha.2"></a>
## 1.7.0-alpha.2 (2021-05-25)

### Changed

- ♻️ Change typescript loader package [[8ffb124](https://github.com/AckeeCZ/lokse/commit/8ffb124b8c22263e33e045fe9c8a502c053956f8)]


<a name="1.7.0-alpha.1"></a>
## 1.7.0-alpha.1 (2021-05-25)

### Changed

- 🔧 Change casing of dist-tag config option [[73a4bca](https://github.com/AckeeCZ/lokse/commit/73a4bca40938da4fcf78c0357e14bd256590b379)]
- ⬆️ Update dependencies in yarn.lock [[59fbd62](https://github.com/AckeeCZ/lokse/commit/59fbd624367dc6c0201aa72aac5ab93b68d40eaf)]


<a name="1.7.0-alpha.0"></a>
## 1.7.0-alpha.0 (2021-05-25)

### Added

- ✨ Add support for typescript config [[805d5fa](https://github.com/AckeeCZ/lokse/commit/805d5fa5f0fef6b6c5f1a3cb02b32cd0260d9194)]

### Changed

- 🔧 Move publishConfig configuration to the right place [[b46f856](https://github.com/AckeeCZ/lokse/commit/b46f856419e484f88a73d30c4870f2c106aed73f)]
- 🔧 Don&#x27;t verify access when publishing with lerna [[d02279b](https://github.com/AckeeCZ/lokse/commit/d02279b5fca6eaf1d53dc27f53c9b1f9890e0cb7)]

### Miscellaneous

- 🙈 Add tsconfig and src folder into npmignore [[53978bf](https://github.com/AckeeCZ/lokse/commit/53978bf4c63eda1249f2fac0661b24b153fd4e90)]


<a name="1.6.0"></a>
## 1.6.0 (2021-04-06)

### Changed

- ♻️ Extract core from cli into standalone package [[24aa5ac](https://github.com/AckeeCZ/lokse/commit/24aa5ac68b863353fceb103356069b46f66e5c03)]


<a name="1.5.2"></a>
## 1.5.2 (2021-04-03)

### Fixed

- 🐛 Fix casing of line.ts import in writer [[e592808](https://github.com/AckeeCZ/lokse/commit/e5928087185a5b7987262ea927fbc4dc62607dfc)]


<a name="1.5.1"></a>
## 1.5.1 (2021-03-02)

### Changed

- ⬆️ Bumb update-notifier version to v5.1.0 [[08f934a](https://github.com/AckeeCZ/lokse/commit/08f934adb03d979f5f926427441ab9d3b574984d)]


<a name="1.5.0"></a>
## 1.5.0 (2021-03-02)

### Added

- ✨ Add support for exclude filter into the worksheet reader [[aaaa31d](https://github.com/AckeeCZ/lokse/commit/aaaa31dd1ba782b43fd060c5d06cc51a130362bf)]

### Changed

- 🔧 Turn off diagnostics in lokse tests [[8ab49fe](https://github.com/AckeeCZ/lokse/commit/8ab49fecaecfca8bc55a8caa8568fb8f2d2ae265)]
- ♻️ Inject worksheet reader instance into spreadsheet reader [[36b7c93](https://github.com/AckeeCZ/lokse/commit/36b7c938664d79bdf7011c9d92458730c6400377)]


<a name="1.4.1"></a>
## 1.4.1 (2021-02-28)

### Changed

- ⬆️ Upgrade yargs-parser, mem n&amp; npm-registry-fetch [[ac9e1e4](https://github.com/AckeeCZ/lokse/commit/ac9e1e44022d6e4e62ccd8ee79996e8ff9c90674)]
- ⬆️ Make general upgrade of lokse package deps [[0f97037](https://github.com/AckeeCZ/lokse/commit/0f970377db32cdb88af931bbefcf6932e13d47ea)]
- ⬆️ Bump node-notifier from 8.0.0 to 8.0.1 [[0afd2c9](https://github.com/AckeeCZ/lokse/commit/0afd2c954bb96812ee951eeba8020dffaedc9679)]
- ⬆️ Bump ini from 1.3.5 to 1.3.8 [[fbc4309](https://github.com/AckeeCZ/lokse/commit/fbc43098d65f9284a027c5becdb0f7691680413b)]


<a name="1.4.0"></a>
## 1.4.0 (2021-02-04)

### Changed

- ♻️ Consider line without a translation empty [[9aaca5e](https://github.com/AckeeCZ/lokse/commit/9aaca5e179e637e7fee970b227c8ad4aa137af32)]

### Fixed

- 🐛 Take in account editorconfig when resolving prettier configuration [[02fbfa8](https://github.com/AckeeCZ/lokse/commit/02fbfa8de9a913e206fbb4f83dd5187506217e99)]


<a name="1.3.1"></a>
## 1.3.1 (2020-11-23)

### Added

- ➕ Shim array.flat to support older node.js versions [[2912a5a](https://github.com/AckeeCZ/lokse/commit/2912a5a53a026c5c693519f0c6b838135e1d08f5)]

### Changed

- 📝 Fix TOC in package readme [[4ef1c8d](https://github.com/AckeeCZ/lokse/commit/4ef1c8d19a34a9a1b8c5969ba6e30a3767e1e6a0)]


<a name="1.3.0"></a>
## 1.3.0 (2020-11-12)

### Added

- ✨ Add splitting translations by domain or sheet title [[abea79c](https://github.com/AckeeCZ/lokse/commit/abea79cdf1cab066e5a4a179b7f11754f59ea7a9)]

### Changed

- ♻️ Change reader to return lines by worksheet title instead of flat list [[c2c177b](https://github.com/AckeeCZ/lokse/commit/c2c177be1acc34807392a868783866a019c5db7d)]
- 🔧 Exclude test files from typescript check [[9d4f5b5](https://github.com/AckeeCZ/lokse/commit/9d4f5b5763d7ba1436aa93e2cc475063720703d1)]

### Removed

- 🔥 Remove name from flag definitions, it&#x27;s useless there [[2dbe4a0](https://github.com/AckeeCZ/lokse/commit/2dbe4a0cc279c009f81a2dca7f7222a81a073287)]


<a name="1.2.0"></a>
## 1.2.0 (2020-11-03)

### Added

- ✨ Add sheets flag into the update command [[b3325b3](https://github.com/AckeeCZ/lokse/commit/b3325b3b2b7ac5d37da3ab6e85df2afd5671e943)]
- ✨ Add warning when no sheets pass the filter [[6b305ef](https://github.com/AckeeCZ/lokse/commit/6b305efe5dc70c0b013770fd542d23cd77fa2033)]
- ➕ Add husky and lint-staged [[9b65157](https://github.com/AckeeCZ/lokse/commit/9b651579a9e276f9ad160541a2a14e00869b46f0)]
- ✅ Add update command tests [[5aee1af](https://github.com/AckeeCZ/lokse/commit/5aee1af0d41c3a3985857a23a36d7fd436dc08c7)]
- ✅ Add open command tests [[08925c0](https://github.com/AckeeCZ/lokse/commit/08925c0824442c8faf962403e452edb77f2c7ce7)]

### Changed

- ⬆️ Upgrade eslint packages [[e04d477](https://github.com/AckeeCZ/lokse/commit/e04d47778d9065c6c1b893c8c256c23115e20dbf)]
- ♻️ Handle failed extraction of sheet data in spreadsheet reader [[c26149d](https://github.com/AckeeCZ/lokse/commit/c26149dd02017987631ac8520d5b9de5ece13761)]
- ♻️ Move worksheet extraction into the worksheet class [[196ebbb](https://github.com/AckeeCZ/lokse/commit/196ebbb6653af758a148592a8f5d4051fb03081a)]
- 🔨 Move lint and prettier scripts to the root [[fa36c40](https://github.com/AckeeCZ/lokse/commit/fa36c40444c8a952bc33729ca879dd14e793f8a0)]
- 🚚 Move tests to the src/**/__tests__ folder [[122c66f](https://github.com/AckeeCZ/lokse/commit/122c66fa1daca3aa2cbc313a046a0d394bc51dc6)]

### Removed

- 🔥 Remove known output format check [[7adc4d0](https://github.com/AckeeCZ/lokse/commit/7adc4d0e82fbfb906ba4acc8ed987d62c735a677)]
- 🔥 Remove different tsconfig for tests [[48b2d37](https://github.com/AckeeCZ/lokse/commit/48b2d37f10c8dd0eebd00dd4b832ed900f243a1d)]


<a name="1.1.1"></a>
## 1.1.1 (2020-10-23)

### Fixed

- 🐛 Only warn, don&#x27;t throw, when key column not found in worksheet [[649dc00](https://github.com/AckeeCZ/lokse/commit/649dc00a03815410f01dfe7638e2a777f0cfbe01)]


<a name="1.1.0"></a>
## 1.1.0 (2020-10-22)

### Added

- ✨ Add update notifier [[e692e4a](https://github.com/AckeeCZ/lokse/commit/e692e4a10267e99912027c0e53caa3395ccef460)]

### Changed

- 📝 Decrease README heading level by one level [[28e2b69](https://github.com/AckeeCZ/lokse/commit/28e2b69f9fa08255038d1dcc761d8a5ad0b7b09d)]


<a name="1.0.0"></a>
## 1.0.0 (2020-10-22)

### Added

- ✨ Add service account support [[8b26da6](https://github.com/AckeeCZ/lokse/commit/8b26da60d790c230be7d6ee27bc98bb31ad4d4e4)]
- ✨ Handle mispelled key column name and missing language column [[b6a84c0](https://github.com/AckeeCZ/lokse/commit/b6a84c0d133ad0aa08d10275e7de6d1477993cb0)]
- ✨ Print CLI error with reason when loading data fail [[1375363](https://github.com/AckeeCZ/lokse/commit/1375363861af170c6b54e93e559b1fab58d94bfa)]
- 📝 Document usage of service account [[a4b9f6c](https://github.com/AckeeCZ/lokse/commit/a4b9f6ca8bfa98fd526eeacdd64959553394d6ab)]

### Fixed

- 🐛 Fix accessing exit property of error [[a390014](https://github.com/AckeeCZ/lokse/commit/a39001413f9f0d4206ae3983b1cc30ca7890d8b1)]

<a name="1.0.0-beta.7"></a>
## 1.0.0-beta.7 (2020-10-05)

### Added

- ✨ Add formatting json output with prettier [[eeb505b](https://github.com/AckeeCZ/localize-with-spreadsheet/commit/eeb505bf958b7d39eefbc57f4a0d405c4705715a)]


<a name="1.0.0-beta.6"></a>
## 1.0.0-beta.6 (2020-10-02)

### Fixed

- 🐛 Fix throwing cli errors with exit code from update command [[c21a41f](https://github.com/AckeeCZ/localize-with-spreadsheet/commit/c21a41ff25f25a3ee769b490c433be6195d5405f)]


<a name="1.0.0-beta.5"></a>
## 1.0.0-beta.5 (2020-10-02)

### Added

- ✨ Set exit code 1 for missing api key error [[d851326](https://github.com/AckeeCZ/localize-with-spreadsheet/commit/d851326a5d5986f69b65f108d8b04fa24b02ad96)]


<a name="1.0.0-beta.4"></a>
## 1.0.0-beta.4 (2020-10-02)

### Added

- ✨ Support loading API key from .env.local [[e4f91ae](https://github.com/AckeeCZ/localize-with-spreadsheet/commit/e4f91ae53d2f2b1a07aa869c4e2e811ea143dafc)]


<a name="1.0.0-beta.3"></a>
## 1.0.0-beta.3 (2020-10-02)

### Changed

- ⏪ Revert handling update as a default command [[bd51c87](https://github.com/AckeeCZ/localize-with-spreadsheet/commit/bd51c87a26edea534a9d801260d26524f738a11b)]
- 📝 Describe exporting API key better [[973847d](https://github.com/AckeeCZ/localize-with-spreadsheet/commit/973847d843b17c8a5766036cff1a78ebe825fcff)]

### Fixed

- ✏️ Fix typo in readme [[548cb30](https://github.com/AckeeCZ/localize-with-spreadsheet/commit/548cb300359e10acfa67e79fd1bfaf34eb8d2a52)]


<a name="1.0.0-beta.2"></a>
## 1.0.0-beta.2 (2020-10-01)

### Changed

- ✨ MissingApiKeyError extends CLIError [[cdb9b43](https://github.com/AckeeCZ/localize-with-spreadsheet/commit/cdb9b439865600e71a9166725b5e21228f4b6a68)]
- 💄 Beautify displaying &quot;not api key&quot; error message [[b599427](https://github.com/AckeeCZ/localize-with-spreadsheet/commit/b59942752c66e6a3833abf7edfec4812a16ebd3e)]
- 🔨 Extract tsc command into the &quot;build&quot; script [[b3faef4](https://github.com/AckeeCZ/localize-with-spreadsheet/commit/b3faef4bde5b9e1d2a41fa766d587b5b1531e8e2)]

### Fixed

- 📝 Fix possible config names in readme [[a2d5f09](https://github.com/AckeeCZ/localize-with-spreadsheet/commit/a2d5f0952058fda588b6b6029992b9b62761bc45)]

<a name="1.0.0-beta.1"></a>
## 1.0.0-beta.1 (2020-09-30)

### Changed

- 💬 Fix name of variable in MissingApiKeyError msg [[dd4e03b](https://github.com/AckeeCZ/localize-with-spreadsheet/commit/dd4e03b95d3b9891d1221ef1b9e9981dc9af6855)]


<a name="1.0.0-beta.0"></a>
## 1.0.0-beta.0 (2020-09-30)

### Added

- ✨ Make update a default command [[8e2a659](https://github.com/AckeeCZ/localize-with-spreadsheet/commit/8e2a65971939da7a383fb8bc773452daecc0b02d)]
- ✨ Add &#x60;open&#x60; command [[76dfc65](https://github.com/AckeeCZ/localize-with-spreadsheet/commit/76dfc657b0e4c0daa5c61874b56f9c03543f7b77)]
- ✨ Use cosmiconfig and new config format [[6efe8ae](https://github.com/AckeeCZ/localize-with-spreadsheet/commit/6efe8ae8c9fa73bbfa52779a5bb6b9f261097ec5)]
- ➕ Add and use ora, alias console as logger [[99a7cb4](https://github.com/AckeeCZ/localize-with-spreadsheet/commit/99a7cb4aba45b2defada44866377eef0a0b5e430)]

### Changed

- ♻️ Rename sheet_id config flag to sheetId [[964bd10](https://github.com/AckeeCZ/localize-with-spreadsheet/commit/964bd100baa2598bb061586d4c7bf95e2f2f24da)]
- ♻️ Use new name &quot;lokse&quot; [[744d250](https://github.com/AckeeCZ/localize-with-spreadsheet/commit/744d250f8c6b7bbb94ce106bf14d8bd5c7219135)]
- ⬆️ Use mkdirp instead of mkpath in writer [[f0fa2c2](https://github.com/AckeeCZ/localize-with-spreadsheet/commit/f0fa2c2d634d79055c587697ffed22ee14366ddd)]
- ⬆️ Upgrade to google-spreadsheet@3 [[78ef3e1](https://github.com/AckeeCZ/localize-with-spreadsheet/commit/78ef3e1848dcab2c6ec4df8df485e70430b8072b)]
- ♻️ Beautify line and writer code, use promises instead of sync methods [[f56b0a2](https://github.com/AckeeCZ/localize-with-spreadsheet/commit/f56b0a25ed4b34693b83bb646ee0dc23e52058fe)]
- ♻️ Rename cols &#x3D;&gt; languages, type &#x3D;&gt; column &amp; output format [[c9a74b0](https://github.com/AckeeCZ/localize-with-spreadsheet/commit/c9a74b04cce2bd8b419f0bbafcb9603dea1f4321)]
- ♻️ Split transformers into standalone files [[d7d78b5](https://github.com/AckeeCZ/localize-with-spreadsheet/commit/d7d78b547d3a9fbf974a1a67ad1a6fb924dff0c0)]
- 🎨 Add prettier, format sources and tests [[6d3d31f](https://github.com/AckeeCZ/localize-with-spreadsheet/commit/6d3d31f2c69175e66ccf2178f66a82f2f1695b7d)]
- ♻️ Rewrite source files to Typescript and move to package subdir [[796533f](https://github.com/AckeeCZ/localize-with-spreadsheet/commit/796533f46b938fc3b36c69a4cac06e7fb91d59e0)]

### Removed

- 🔥 Remove dart and .net output formats [[1b35e37](https://github.com/AckeeCZ/localize-with-spreadsheet/commit/1b35e3741b41092a081bae79d64745213f1041b8)]
- 🔥 Cleanup root repository package.json [[4d26be5](https://github.com/AckeeCZ/localize-with-spreadsheet/commit/4d26be593a776d102ff488f4bf2666204d946abb)]

### Fixed

- 🐛 Remove new lines from json values [[ec97bcf](https://github.com/AckeeCZ/localize-with-spreadsheet/commit/ec97bcf232797134e41adaeae34a5f1a82a27edf)]
- 🐛 Match column names case insensitively [[aadedee](https://github.com/AckeeCZ/localize-with-spreadsheet/commit/aadedee998a5d906d0f65db435f9f351158276a0)]

### Miscellaneous

- 🔨 Add script for patching gitmoji-changelog [[65e8214](https://github.com/AckeeCZ/localize-with-spreadsheet/commit/65e8214d7e80882b76f99b41a1b3ce8e48d5f013)]
- 🔨 Add release script for CLI [[fea58ce](https://github.com/AckeeCZ/localize-with-spreadsheet/commit/fea58ce6060c2e4d7e0052e6714c5e6f70e6f62e)]
- 🔨 Setup changelog script for lokse package [[d8bf186](https://github.com/AckeeCZ/localize-with-spreadsheet/commit/d8bf18648cbb6b3a9d365e1104ec3bb88a050406)]


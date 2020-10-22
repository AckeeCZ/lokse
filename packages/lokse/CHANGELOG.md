# Changelog

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


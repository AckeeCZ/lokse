const fs = require("fs").promises;

const lernaJson = require("../lerna.json");
const pkgJson = require("../package.json");

const gitmojiChangelogFilepath = require.resolve("../.gitmoji-changelogrc");

fs.readFile(gitmojiChangelogFilepath)
  .then((content) => JSON.parse(content.toString() || "{}"))
  .then((gitmojiChangelog) =>
    fs.writeFile(
      gitmojiChangelogFilepath,
      JSON.stringify(
        {
          project: {
            ...gitmojiChangelog.project,
            name: pkgJson.name,
            description: pkgJson.description,
            version: lernaJson.version,
          },
        },
        null,
        2
      )
    )
  )
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

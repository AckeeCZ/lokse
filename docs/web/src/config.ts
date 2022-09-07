export const SITE = {
  title: "Lokse",
  description: "Localize your app from spreadsheet",
  defaultLanguage: "en_US",
};

export const OPEN_GRAPH = {
  image: {
    src: "https://github.com/withastro/astro/blob/main/assets/social/banner.jpg?raw=true",
    alt:
      "astro logo on a starry expanse of space," +
      " with a purple saturn-like planet floating in the right foreground",
  },
  twitter: "astrodotbuild",
};

// This is the type of the frontmatter you put in the docs markdown files.
export type Frontmatter = {
  title: string;
  description: string;
  layout: string;
  image?: { src: string; alt: string };
  dir?: "ltr" | "rtl";
  ogLocale?: string;
  lang?: string;
};

export const KNOWN_LANGUAGES = {
  English: "en",
} as const;
export const KNOWN_LANGUAGE_CODES = Object.values(KNOWN_LANGUAGES);

export const GITHUB_EDIT_URL = `https://github.com/AckeeCZ/lokse/docs`;

export const COMMUNITY_INVITE_URL = ``;

// See "Algolia" section of the README for more information.
export const ALGOLIA = {
  indexName: "XXXXXXXXXX",
  appId: "XXXXXXXXXX",
  apiKey: "XXXXXXXXXX",
};

export type Sidebar = Record<
  typeof KNOWN_LANGUAGE_CODES[number],
  Record<string, { text: string; link: string }[]>
>;

const BASE = "lokse/";

export const SIDEBAR: Sidebar = {
  en: {
    Basics: [
      { text: "Introduction", link: `${BASE}en/introduction` },
      { text: "Lokse CLI", link: `${BASE}en/cli` },
      { text: "Authentication", link: `${BASE}en/authentication` },
      { text: "VsCode extension", link: `${BASE}en/extension` },
    ],
    Plugins: [
      { text: "Intro", link: `${BASE}en/plugins` },
      { text: "How to create", link: `${BASE}en/plugin-create` },
      { text: "Prettier plugin", link: `${BASE}en/plugin/prettier` },
      { text: "Fallback plugin", link: `${BASE}en/plugin/fallback` },
      {
        text: "Non-breaking spaces plugin",
        link: `${BASE}en/plugin/non-breaking-spaces`,
      },
    ],
  },
};

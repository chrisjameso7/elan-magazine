import type { GlobalConfig } from "payload";
import { editorOnly } from "../access";

export const indexPageDefaults = {
  intro:
    "Fifty people we think are about to be everywhere: musicians, actors, creators, designers, writers, athletes and anyone else on the way up. We pick them before everyone else catches on.",
  rules: [
    "Nobody already famous. If they’ve headlined arenas, won a major award or already have a mainstream following, they’re too big for this list.",
    "Growth over size. We build the shortlist from public numbers like streams, views, followers and search interest, and we look at how fast someone is rising, not how big they already are.",
    "Editors set the order, and can move anyone five places at most from where the numbers put them.",
    "Nobody pays to be here, and we don’t list friends or anyone we work with.",
    "A new list comes out every Thursday.",
  ].join("\n"),
};

export const IndexPage: GlobalConfig = {
  slug: "index-page",
  label: "The Index page",
  admin: {
    group: "The Index",
    description: "The text at the top of /the-index. Entries themselves live in Index Entries.",
  },
  access: { read: () => true, update: editorOnly },
  fields: [
    {
      name: "intro",
      type: "textarea",
      required: true,
      defaultValue: indexPageDefaults.intro,
      admin: { description: "One or two sentences under the headline." },
    },
    {
      name: "rules",
      type: "textarea",
      required: true,
      defaultValue: indexPageDefaults.rules,
      admin: { description: "How the list is made. One rule per line." },
    },
    {
      name: "weekNote",
      type: "textarea",
      admin: {
        description:
          "Optional note for this week, shown above the list. Clear it when the next list goes up.",
      },
    },
  ],
};

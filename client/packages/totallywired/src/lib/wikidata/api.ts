import { sendQuery } from "../requests";
import {
  WikiDataSiteLinkEntities,
  WikipediaPageExtract,
  WikipediaPageQuery,
} from "./types";

const WIKIDATA_API = "https://www.wikidata.org/w/api.php";

const WIKIPEDIA_API = (lang: string) =>
  `https://${lang}.wikipedia.org/w/api.php`;

/**
 * Retrieves the wikidata sitelinks entities
 */
const getWikiDataSiteLinks = (wikidataId: string, sitefilter = "enwiki") => {
  return sendQuery<WikiDataSiteLinkEntities>(
    WIKIDATA_API,
    new URLSearchParams({
      ids: wikidataId,
      action: "wbgetentities",
      props: "sitelinks/urls",
      format: "json",
      origin: "*",
      sitefilter,
    }),
  );
};

/**
 * Retrieves the extract of the wikipedia page, specified by `title`
 */
export const getWikiPageExtract = (title: string, lang = "en") => {
  return sendQuery<WikipediaPageQuery>(
    WIKIPEDIA_API(lang),
    new URLSearchParams({
      titles: title,
      action: "query",
      prop: "extracts",
      redirects: "1",
      explaintext: "",
      exintro: "",
      origin: "*",
      format: "json",
    }),
  );
};

/**
 * For the given `wikidataId`, it will retrieve the wikipedia page extract information (if any exists)
 */
export const getPageExract = async (
  wikidataId: string,
  lang = "en",
): Promise<WikipediaPageExtract | undefined> => {
  const site = `${lang}wiki`;
  const { data: wikidata } = await getWikiDataSiteLinks(wikidataId, site);
  const page = wikidata?.entities[wikidataId]?.sitelinks[site];
  const title = page?.title;

  if (!title) {
    return;
  }

  const { data: wikipedia } = await getWikiPageExtract(title, lang);
  if (!wikipedia) {
    return;
  }

  const pageid = Object.keys(wikipedia.query.pages)[0];
  if (!pageid) {
    return;
  }

  return {
    pageid,
    url: page.url,
    title: page.title,
    extract: wikipedia.query.pages[pageid].extract,
    wikidataUrl: `https://www.wikidata.org/wiki/${wikidataId}`,
  };
};

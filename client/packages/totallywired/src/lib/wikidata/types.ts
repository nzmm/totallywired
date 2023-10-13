export type WikiDataSiteLinkEntities = {
  entities: Record<
    string,
    {
      type: string;
      id: string;
      sitelinks: Record<
        string,
        {
          site: string;
          title: string;
          url: string;
        }
      >;
    }
  >;
};

export type WikipediaPageQuery = {
  query: {
    pages: Record<
      string,
      {
        pageid: number;
        ns: number;
        title: string;
        extract: string;
      }
    >;
  };
};

export type WikipediaPageExtract = {
  pageid: string;
  title: string;
  extract: string;
  url: string;
  wikidataUrl: string;
};

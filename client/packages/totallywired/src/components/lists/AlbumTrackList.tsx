import React, { useEffect, useState } from "react";
import { MBReleaseGroup } from "../../lib/musicbrainz/types";
import { WikipediaPageExtract } from "../../lib/wikidata/types";
import { AlbumCollection } from "../../lib/types";
import { getMBReleaseGroup } from "../../lib/musicbrainz/api";
import { getPageExract } from "../../lib/wikidata/api";
import { ReleaseCollection } from "./MusicCollectionListItem";
import "./AlbumTrackList.css";

type AlbumTrackListProps = {
  collections: AlbumCollection[];
};

type ReleaseGroupExtract = {
  loaded?: {
    releaseGroup: MBReleaseGroup;
    pageExtract: WikipediaPageExtract;
  };
};

const INIT_DATA: ReleaseGroupExtract = {
  loaded: undefined,
};

const getWikidataId = (releaseGroup: MBReleaseGroup | undefined) => {
  const wikidata = releaseGroup?.relations.find(
    (rel) => rel.type === "wikidata",
  );
  if (!wikidata) {
    return "";
  }
  return wikidata.url.resource.split("/").slice(-1)[0] ?? "";
};

const asyncLoader = async (
  releaseId: string,
  setData: React.Dispatch<React.SetStateAction<ReleaseGroupExtract>>,
) => {
  const { data: rgData } = await getMBReleaseGroup(releaseId);
  const releaseGroup = rgData?.["release-groups"][0];
  if (!releaseGroup) {
    return;
  }

  const wikidataId = getWikidataId(releaseGroup);
  if (!wikidataId) {
    return;
  }

  const pageExtract = await getPageExract(wikidataId);
  if (!pageExtract) {
    return;
  }

  setData({
    loaded: { releaseGroup, pageExtract },
  });
};

const useReleaseGroupExtract = (releaseId: string) => {
  const [data, setData] = useState(INIT_DATA);

  useEffect(() => {
    if (!releaseId) {
      return;
    }

    asyncLoader(releaseId, setData);
  }, [releaseId, setData]);

  return data;
};

function AboutReleaseGroup({ loaded }: ReleaseGroupExtract) {
  if (!loaded) {
    return null;
  }

  const { releaseGroup, pageExtract } = loaded;
  return (
    <section className="about-rg">
      <h2>About</h2>
      <div>
        <div>Type: {releaseGroup["primary-type"]}</div>
        <div>First released: {releaseGroup["first-release-date"]}</div>

        {pageExtract ? (
          <>
            <p className="wiki-extract">{pageExtract.extract}</p>
            <a href={pageExtract.url} target="_blank">
              Read more at Wikipedia&hellip;
            </a>
          </>
        ) : null}
      </div>
    </section>
  );
}

export default function AlbumTrackList({ collections }: AlbumTrackListProps) {
  const collection = collections[0];
  const rg = useReleaseGroupExtract(collection?.mbid);

  if (!collection) {
    return null;
  }

  const { id, trackCount, ...release } = collection;
  return (
    <div className="release vlist">
      <ol>
        <li>
          <ReleaseCollection
            scope="release"
            id={id}
            trackCount={trackCount}
            {...release}
          />
        </li>
        <li>
          <AboutReleaseGroup {...rg} />
        </li>
      </ol>
    </div>
  );
}

import React, { useEffect, useState } from "react";
import { getYear } from "../../../lib/utils";
import { MBReleaseGroup } from "../../../lib/musicbrainz/types";
import { WikipediaPageExtract } from "../../../lib/wikidata/types";
import { AlbumCollection } from "../../../lib/types";
import { getMBReleaseGroup } from "../../../lib/musicbrainz/api";
import { getPageExract } from "../../../lib/wikidata/api";
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

const getWikidataRel = (releaseGroup: MBReleaseGroup | undefined) => {
  const wikidata = releaseGroup?.relations.find(
    (rel) => rel.type === "wikidata",
  );
  if (!wikidata) {
    return { id: "", url: "" };
  }
  const url = wikidata.url.resource;
  const id = url.split("/").slice(-1)[0] ?? "";
  return { id, url };
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

  const { id: wikidataId } = getWikidataRel(releaseGroup);
  if (!wikidataId) {
    return;
  }

  const pageExtract = await getPageExract(wikidataId);
  if (!pageExtract) {
    return;
  }

  setData({
    loaded: { releaseGroup, pageExtract: pageExtract },
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
  const { ["primary-type"]: primaryType, ["secondary-types"]: secondaryTypes } =
    releaseGroup;
  return (
    <section className="about-rg">
      <h2>About</h2>
      <div>
        {pageExtract ? <p>{pageExtract.extract}</p> : null}

        <dl>
          <dt>First Released</dt>
          <dd>{getYear(releaseGroup["first-release-date"])}</dd>

          <dt>Type</dt>
          <dd>
            {primaryType}
            {secondaryTypes.length ? ` + ${secondaryTypes.join(" + ")}` : ""}
          </dd>

          <dt>Genres</dt>
          <dd>
            {releaseGroup.genres
              .sort((a, b) => b.count - a.count)
              .slice(0, 10)
              .map((g) => g.name)
              .join("; ")}
          </dd>

          <dt>Sources</dt>
          <dd className="sources">
            <a
              href={`https://musicbrainz.org/release-group/${releaseGroup.id}`}
              target="_blank"
            >
              MusicBrainz
            </a>{" "}
            (
            <a
              href="https://creativecommons.org/publicdomain/zero/1.0/"
              target="_blank"
            >
              CC0
            </a>
            );{" "}
            <a className="cc" href={pageExtract.wikidataUrl} target="_blank">
              Wikidata
            </a>
            ;{" "}
            <a href={pageExtract.url} target="_blank">
              Wikipedia
            </a>{" "}
            (
            <a
              className="cc"
              href="https://creativecommons.org/licenses/by-sa/3.0/"
              target="_blank"
            >
              CC BY-SA
            </a>
            )
          </dd>
        </dl>

        <p>
          <a href={pageExtract.url} target="_blank">
            Read more at Wikipedia&hellip;
          </a>
        </p>
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

import { MBReleaseSearchItem } from "../../lib/musicbrainz/types";
import { Thumbnail } from "../display/Thumbnail";

export type AlbumSearchResultProps = MBReleaseSearchItem & {
  similarity?: number;
};

const dateCountryStr = (date?: number, country?: string) => {
  return [date, country].filter((v) => !!v).join(", ");
};

export default function AlbumSearchResult({
  title,
  date,
  country,
  similarity,
  "track-count": trackCount = 0,
  "artist-credit": artistCredit,
}: AlbumSearchResultProps) {
  const whenWhere = dateCountryStr(date, country);

  return (
    <button className="search-result">
      <div>
        <Thumbnail
          className="search-release-art"
          src=""
          alt="The release art for the album search result"
        />
      </div>
      <div>
        <div>
          <strong>{title}</strong>
          <span>{similarity}</span>
        </div>
        <div>{artistCredit.map((a) => a.name).join(", ")}</div>
        <div>
          {trackCount} tracks {whenWhere ? ` · ${whenWhere}` : null}
        </div>
      </div>
    </button>
  );
}

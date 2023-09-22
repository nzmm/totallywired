import { CheckCircledIcon } from "@radix-ui/react-icons";
import { MBReleaseSearchItem } from "../../lib/musicbrainz/types";
import { Thumbnail } from "../display/Thumbnail";

export type AlbumSearchResultProps = MBReleaseSearchItem & {
  similarity: number;
  onSelect: (result: MBReleaseSearchItem) => void;
};

const dateCountryStr = (date?: number, country?: string) => {
  return [date, country].filter((v) => !!v).join(", ");
};

export function AlbumSearchResult({
  onSelect,
  similarity,
  ...result
}: AlbumSearchResultProps) {
  const whenWhere = dateCountryStr(result.date, result.country);
  return (
    <button className="search-result" onClick={() => onSelect(result)}>
      <div>
        <Thumbnail
          className="search-release-art"
          src=""
          alt="The release art for the album search result"
        />
      </div>
      <div>
        <div>
          <strong>
            {result.title}
            <span className="similarity">
              {similarity <= 10 ? <CheckCircledIcon /> : null}
            </span>
          </strong>
        </div>
        <div>{result["artist-credit"].map((a) => a.name).join(", ")}</div>
        <div>
          {result["track-count"]} tracks {whenWhere ? ` · ${whenWhere}` : null}
        </div>
      </div>
    </button>
  );
}

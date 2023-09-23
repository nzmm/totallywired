import { QuestionMarkCircledIcon } from "@radix-ui/react-icons";
import { MBReleaseSearchItem } from "../../lib/musicbrainz/types";
import { SearchResult, similar } from "../../lib/hooks/editor";
import { Thumbnail } from "../display/Thumbnail";
import "./SearchResult.css";

export type AlbumSearchResultProps = SearchResult & {
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
            {!similar(similarity) ? (
              <span
                className="low-similarity"
                title="Possible low relevance search result"
              >
                <QuestionMarkCircledIcon />
              </span>
            ) : null}
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

import { MouseEventHandler, useMemo } from "react";
import { AttributeChangeRequest } from "../../lib/editor/types";
import { Thumbnail } from "../common/Thumbnail";
import "./ArtSelector.css";

type ArtSelectorProps = {
  mbid: string;
  coverArt: AttributeChangeRequest<string>;
  artCollection: Record<string, string>;
  onSelect?: MouseEventHandler<HTMLButtonElement>;
};

const getShortList = (
  newValue: string,
  artCollection: Record<string, string>,
) => {
  const entries = Object.entries(artCollection);
  const i = entries.findIndex(([, v]) => v === newValue);

  if (i !== -1) {
    const entry = entries[i];
    entries.splice(i, 1);
    entries.splice(0, 0, entry);
  }
  return entries.slice(0, 8);
};

export default function ArtSelector({
  mbid,
  coverArt,
  artCollection,
  onSelect,
}: ArtSelectorProps) {
  // Only update shortlist when the musicbrainz selection changes
  /* eslint-disable react-hooks/exhaustive-deps */
  const entries = useMemo(
    () => getShortList(coverArt.newValue, artCollection),
    [mbid, artCollection],
  );
  /* eslint-enable */

  if (entries.length <= 1) {
    return null;
  }
  return (
    <ol className="art-selector">
      {entries.map(([mbid, artSrc]) => {
        return (
          <li key={mbid}>
            <button
              value={artSrc}
              className={artSrc === coverArt.newValue ? "active" : ""}
              onClick={onSelect}
            >
              <Thumbnail
                src={artSrc}
                alt="Cover art"
                className="tiny-release-art"
              />
            </button>
          </li>
        );
      })}
    </ol>
  );
}

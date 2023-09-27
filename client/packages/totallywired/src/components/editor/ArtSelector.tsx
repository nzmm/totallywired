import { MouseEventHandler } from "react";
import { AttributeChangeRequest } from "../../lib/editor/types";
import { Thumbnail } from "../display/Thumbnail";
import "./ArtSelector.css";

type ArtSelectorProps = {
  coverArt: AttributeChangeRequest<string>;
  artCollection: Record<string, string>;
  onSelect?: MouseEventHandler<HTMLButtonElement>;
};

export default function ArtSelector({
  coverArt,
  artCollection,
  onSelect,
}: ArtSelectorProps) {
  return (
    <ol className="art-selector">
      {Object.entries(artCollection).map(([mbid, artSrc]) => {
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

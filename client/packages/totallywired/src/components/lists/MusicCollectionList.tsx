import { VirtualList } from "@totallywired/ui-components";
import { AlbumCollection } from "../../lib/types";
import MusicCollectionListItem, {
  MusicCollectionListScopes,
} from "./MusicCollectionListItem";
import "./MuiscCollectionList.css";

type MusicCollectionListProps = {
  collections: AlbumCollection[];
  scope?: MusicCollectionListScopes;
};

export default function MusicCollectionList({
  collections,
  scope = "releases",
}: MusicCollectionListProps) {
  return collections.length ? (
    <VirtualList
      className="collection"
      itemRenderer={MusicCollectionListItem}
      items={collections.map((c) => ({
        ...c,
        scope,
        key: c.id,
        height: 270 + c.trackCount * 32,
      }))}
    />
  ) : (
    <section>
      <p>Collection empty</p>
    </section>
  );
}

import { ListItemProps, VirtualList } from "@totallywired/ui-components";
import { Link } from "react-router-dom";
import { Artist } from "../../lib/types";

function ArtistItem({ top, height, ...artist }: ListItemProps<Artist>) {
  return (
    <li tabIndex={0} style={{ top, height }}>
      <button className="col lgutter" data-intent="add" title="Enqueue">
        &nbsp;
      </button>
      <Link
        className="col name"
        to={`/lib/artists/${artist.id}`}
      >{`${artist.name}`}</Link>
    </li>
  );
}

export default function ArtistList({ artists }: { artists: Artist[] }) {
  return artists.length ? (
    <VirtualList
      className="tracklist"
      items={artists.map((a) => ({ ...a, key: a.id, height: 42 }))}
      itemRenderer={ArtistItem}
    />
  ) : (
    <section>
      <p>No albums</p>
    </section>
  );
}

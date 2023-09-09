import { Link } from "react-router-dom";
import { ListItemProps, VirtualList } from "@totallywired/ui-components";
import { Artist } from "../lib/types";

function ArtistItem({ top, height, ...artist }: ListItemProps<Artist>) {
  return (
    <li tabIndex={0} style={{ top, height }}>
      <button className="col lgutter">&nbsp;</button>
      <Link
        className="col name"
        to={`/lib/artists/${artist.id}/tracks`}
      >{`${artist.name}`}</Link>
    </li>
  );
}

export default function ArtistList({ artists }: { artists: Artist[] }) {
  return artists.length ? (
    <VirtualList
      items={artists.map((a) => ({ ...a, height: 42 }))}
      renderer={ArtistItem}
    />
  ) : (
    <section>
      <p>No albums</p>
    </section>
  );
}

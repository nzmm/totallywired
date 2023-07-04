import { Link, useAsyncValue } from "react-router-dom";
import {
  IVirtualListItem,
  ListItemProps,
  VirtualList,
} from "@totallywired/ui-components";
import { Artist } from "../lib/types";

export type ArtistItemProps = ListItemProps<Artist>;
export type ArtistDataProps = IVirtualListItem & Artist;

function ArtistItem({ top, height, ...artist }: ArtistItemProps) {
  return (
    <li tabIndex={0} style={{ top, height }}>
      <button className="col lgutter">&nbsp;</button>
      <Link
        className="col name"
        to={`/lib/artists/${artist.id}/albums`}
      >{`${artist.name}`}</Link>
    </li>
  );
}

export default function ArtistList() {
  const artists = useAsyncValue() as ArtistDataProps[];

  return artists?.length ?? 0 ? (
    <VirtualList items={artists} renderer={ArtistItem} />
  ) : (
    <section>
      <p>No albums</p>
    </section>
  );
}

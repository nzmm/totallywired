import { Link, useAsyncValue } from "react-router-dom";
import { Album } from "../lib/types";
import {
  IVirtualListItem,
  ListItemProps,
  VirtualList,
} from "@totallywired/ui-components";

export type AlbumItemProps = ListItemProps<Album>;
export type AlbumDataProps = IVirtualListItem & Album;

function AlbumItem({ top, height, ...album }: AlbumItemProps) {
  return (
    <li tabIndex={0} style={{ top, height }}>
      <button className="col lgutter" title="Play all now">
        &nbsp;
      </button>
      <Link
        className="col name"
        to={`/lib/albums/${album.id}/tracks`}
      >{`${album.name}`}</Link>
      <Link className="col year" to={`/lib/years/${album.year}/albums`}>{`${
        album.year ?? "–"
      }`}</Link>
      <Link className="col artist" to={`/lib/artists/${album.artistId}/albums`}>
        {`${album.artistName}`}
      </Link>
    </li>
  );
}

export default function AlbumList() {
  const albums = useAsyncValue() as AlbumDataProps[];

  return albums?.length ?? 0 ? (
    <VirtualList items={albums} renderer={AlbumItem} />
  ) : (
    <section>
      <p>No albums</p>
    </section>
  );
}

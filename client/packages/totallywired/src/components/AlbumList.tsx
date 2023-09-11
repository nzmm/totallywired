import { ListItemProps, VirtualList } from "@totallywired/ui-components";
import { Link } from "react-router-dom";
import { Album } from "../lib/types";

function AlbumItem({ top, height, ...album }: ListItemProps<Album>) {
  return (
    <li tabIndex={0} style={{ top, height }}>
      <button className="col lgutter" title="Play all now">
        &nbsp;
      </button>
      <Link
        className="col name"
        to={`/lib/albums/${album.id}/tracks`}
      >{`${album.name}`}</Link>
      <Link className="col year" to={`/lib/albums?year=${album.year}`}>{`${
        album.year ?? "–"
      }`}</Link>
      <Link className="col artist" to={`/lib/artists/${album.artistId}/tracks`}>
        {`${album.artistName}`}
      </Link>
    </li>
  );
}

export default function AlbumList({ albums }: { albums: Album[] }) {
  return albums.length ? (
    <VirtualList
      items={albums.map((a) => ({ ...a, height: 42 }))}
      renderer={AlbumItem}
    />
  ) : (
    <section>
      <p>No albums</p>
    </section>
  );
}

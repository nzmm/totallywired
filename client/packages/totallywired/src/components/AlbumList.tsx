import { Link, useAsyncValue } from "react-router-dom";
import { Album } from "../lib/types";
import { VirtualList } from "@totallywired/ui-components";

export type AlbumItemProps = Album & {
  height: number;
};

function AlbumItem(album: AlbumItemProps) {
  return (
    <>
      <button className="row lgutter" title="Play all now">
        &nbsp;
      </button>
      <Link
        className="row name"
        to={`/lib/albums/${album.id}/tracks`}
      >{`${album.name}`}</Link>
      <Link className="row year" to={`/lib/years/${album.year}/albums`}>{`${
        album.year ?? "–"
      }`}</Link>
      <Link className="row artist" to={`/lib/artists/${album.artistId}/albums`}>
        {`${album.artistName}`}
      </Link>
    </>
  );
}

export default function AlbumList() {
  const tracks = useAsyncValue() as AlbumItemProps[];

  return tracks?.length ?? 0 ? (
    <VirtualList items={tracks} renderer={AlbumItem} />
  ) : (
    <section>
      <p>No albums</p>
    </section>
  );
}

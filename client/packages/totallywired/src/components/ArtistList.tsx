import { Link, useAsyncValue } from "react-router-dom";
import { VirtualList } from "@totallywired/ui-components";
import { Album } from "../lib/types";

export type ArtistItemProps = Album & {
  height: number;
};

function ArtistItem(album: ArtistItemProps) {
  return (
    <>
      <button className="row lgutter" title="Play all now">
        &nbsp;
      </button>
      <Link
        className="row name"
        to={`/lib/artists/${album.id}/albums`}
      >{`${album.name}`}</Link>
    </>
  );
}

export default function ArtistList() {
  const tracks = useAsyncValue() as ArtistItemProps[];

  return tracks?.length ?? 0 ? (
    <VirtualList items={tracks} renderer={ArtistItem} />
  ) : (
    <section>
      <p>No albums</p>
    </section>
  );
}

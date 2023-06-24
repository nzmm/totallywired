import { VirtualList } from "@totallywired/ui-components";
import { createItems } from "../lib/dummy";

type AlbumItemProps = {
  albumName: string;
  artistName: string;
  year: number;
};

const albums = createItems<AlbumItemProps>(1_000, (i) => ({
  albumName: `AlbumName ${i}`,
  artistName: `ArtistName ${i}`,
  year: 2023,
  height: 50,
}));

function AlbumItem(props: AlbumItemProps) {
  return (
    <div className="album">
      <div className="name">
        <a href="#">{`${props.albumName}`}</a>
      </div>
      <div className="artist">
        <a href="#">{`${props.artistName}`}</a>
      </div>
      <div className="year">
        <a href="#">{`${props.year}`}</a>
      </div>
    </div>
  );
}

export default function Albums() {
  return <VirtualList items={albums} renderer={AlbumItem} />;
}

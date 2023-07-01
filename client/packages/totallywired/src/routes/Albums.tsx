import { VirtualList } from "@totallywired/ui-components";

type AlbumItemProps = {
  albumName: string;
  artistName: string;
  year: number;
};

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
  return <VirtualList items={[]} renderer={AlbumItem} />;
}

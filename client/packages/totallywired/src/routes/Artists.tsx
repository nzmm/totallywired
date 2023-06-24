import { VirtualList } from "@totallywired/ui-components";
import { createItems } from "../lib/dummy";

type ArtistItemProps = {
  artistName: string;
};

const artists = createItems<ArtistItemProps>(500, (i) => ({
  artistName: `ArtistName ${i}`,
  height: 50,
}));

function ArtistItem(props: ArtistItemProps) {
  return (
    <div className="artist">
      <div className="name">
        <a href="#">{`${props.artistName}`}</a>
      </div>
    </div>
  );
}

export default function Artists() {
  return <VirtualList items={artists} renderer={ArtistItem} />;
}

import { Link, useAsyncValue } from "react-router-dom";
import {
  IVirtualListItem,
  ListItemProps,
  VirtualList,
  VisibleItem,
} from "@totallywired/ui-components";
import { usePlayer } from "../providers/AudioProvider";
import { Track } from "../lib/types";

export type TrackItemProps = ListItemProps<Track>;
export type TrackDataProps = IVirtualListItem & Track;

function TrackItem({ index, top, height, ...track }: TrackItemProps) {
  return (
    <li tabIndex={0} key={index} style={{ top, height }}>
      <button className="col lgutter" title="Play now" data-action="add">
        {`${track.number}.`}
      </button>
      <span className="col name">{`${track.name}`}</span>
      <span className="col album">
        <Link to={`/lib/albums/${track.releaseId}/tracks`}>
          {`${track.releaseName}`}
        </Link>
      </span>
      <span className="col artist">
        <Link to={`/lib/artists/${track.artistId}/tracks`}>
          {`${track.artistName}`}
        </Link>
      </span>
      <a className="col liked" href="#">{`${track.liked}`}</a>
      <span className="duration">{`${track.displayLength}`}</span>
    </li>
  );
}

export default function TrackList() {
  const player = usePlayer();
  const tracks = useAsyncValue() as Track[];

  const handleClick = (
    e: React.MouseEvent<HTMLElement>,
    item: VisibleItem<TrackDataProps>
  ) => {
    const target = e.target as HTMLElement;
    switch (target.dataset.action) {
      case "add": {
        player.addTrack(item.data);
      }
    }
  };

  const handleDoubleClick = (
    _: React.MouseEvent<HTMLElement>,
    item: VisibleItem<TrackDataProps>
  ) => {
    player.playNow(item.data);
  };

  return tracks?.length ?? 0 ? (
    <VirtualList
      items={tracks.map((t) => ({ ...t, height: 42 }))}
      renderer={TrackItem}
      onClick={handleClick}
      onDoubleClick={handleDoubleClick}
    />
  ) : (
    <section>
      <p>No tracks</p>
    </section>
  );
}

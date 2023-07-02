import { Link, useAsyncValue } from "react-router-dom";
import { VirtualList, VisibleItem } from "@totallywired/ui-components";
import { usePlayer } from "../providers/AudioProvider";
import { Track } from "../lib/types";

export type TrackItemProps = Track & {
  height: number;
};

function TrackItem(track: TrackItemProps) {
  return (
    <>
      <button
        className="row lgutter"
        title="Play now"
        data-action="playnow"
      >
        {`${track.number}.`}
      </button>
      <span className="row name">{`${track.name}`}</span>
      <span className="row album">
        <Link to={`/lib/albums/${track.releaseId}/tracks`}>
          {`${track.releaseName}`}
        </Link>
      </span>
      <span className="row artist">
        <Link to={`/lib/artists/${track.artistId}/tracks`}>
          {`${track.artistName}`}
        </Link>
      </span>
      <a className="row liked" href="#">{`${track.liked}`}</a>
      <span className="row duration">{`${track.displayLength}`}</span>
    </>
  );
}

export default function TrackList() {
  const player = usePlayer(); 
  const tracks = useAsyncValue() as TrackItemProps[];

  const handleClick = (e: React.MouseEvent<HTMLElement>, item: VisibleItem<TrackItemProps>) => {
    const target = e.target as HTMLElement;
    switch(target.dataset.action) {
      case 'playnow': {
        player.addTrack(item.data);
      }
    }
  }

  const handleDoubleClick = (_: React.MouseEvent<HTMLElement>, item: VisibleItem<TrackItemProps>) => {
    player.playNow(item.data);
  }

  return tracks?.length ?? 0 ? (
    <VirtualList
      items={tracks}
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

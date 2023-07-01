import { Link, useAsyncValue } from "react-router-dom";
import { VirtualList } from "@totallywired/ui-components";
import { Track } from "../lib/types";

export type TrackItemProps = Track & {
  onAction(e: React.MouseEvent, action: string, track: Track): void;
};

function TrackItem({ onAction, ...track }: TrackItemProps) {
  return (
    <>
      <button
        className="row lgutter"
        title="Play now"
        onClick={(e) => onAction(e, "play", track)}
      >
        {`${track.number}.`}
      </button>
      <span className="row name">{`${track.name}`}</span>
      <Link
        className="row album"
        to={`/lib/albums/${track.releaseId}/tracks`}
      >{`${track.releaseName}`}</Link>
      <Link
        className="row artist"
        to={`/lib/artists/${track.artistId}/tracks`}
      >{`${track.artistName}`}</Link>
      <a className="row liked" href="#">{`${track.liked}`}</a>
      <span className="row duration">{`${track.displayLength}`}</span>
    </>
  );
}

export default function TrackList() {
  const tracks = useAsyncValue() as TrackItemProps[];

  return tracks?.length ?? 0 ? (
    <VirtualList items={tracks} renderer={TrackItem} />
  ) : (
    <section>
      <p>No tracks</p>
    </section>
  );
}

import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { VirtualList } from "@totallywired/ui-components";

import { getTracks } from "../lib/requests";
import { Track } from "../lib/types";
import Loading from "../components/Loading";

type TrackItemProps = {
  id: string;
  position: number;
  number: string;
  name: string;
  releaseName: string;
  artistName: string;
  displayLength: string;
  length: number;
  liked: boolean;
};

function TrackItem(track: TrackItemProps) {
  return (
    <>
      <div className="track num">{`${track.number}.`}</div>
      <div className="track name">{`${track.name}`}</div>
      <div className="track album">
        <a href="#">{`${track.releaseName}`}</a>
      </div>
      <div className="track artist">
        <a href="#">{`${track.artistName}`}</a>
      </div>
      <div className="track liked">
        <a href="#">{`${track.liked}`}</a>
      </div>
      <div className="track duration">{`${track.displayLength}`}</div>
    </>
  );
}

export default function Tracks() {
  const [tracks, setTracks] = useState<Track[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    getTracks().then((data) => {
      const tracks = data.map((x) => ({ ...x, height: 42 }));
      setTracks(tracks);
      setLoading(false);
    });
  }, []);

  return loading ? (
    <Loading />
  ) : tracks.length ? (
    <VirtualList items={tracks} renderer={TrackItem} />
  ) : (
    <section>
      <p>You have no tracks in your library.</p>
      <p>
        Get started by setting up a{" "}
        <Link to="/lib/providers">content provider</Link>.
      </p>
    </section>
  );
}

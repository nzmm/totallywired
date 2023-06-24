import { VirtualList } from "@totallywired/ui-components";
import { useEffect, useState } from "react";
import { getTracks } from "../lib/requests";
import { Track } from "../lib/types";

type TrackItemProps = {
  trackNumber: string | number;
  trackName: string;
  trackAlbum: string;
  trackArtist: string;
  duration: string;
  liked: boolean;
};

function TrackItem(props: TrackItemProps) {
  return (
    <>
      <div className="track num">{`${props.trackNumber}.`}</div>
      <div className="track name">{`${props.trackName}`}</div>
      <div className="track album">
        <a href="#">{`${props.trackAlbum}`}</a>
      </div>
      <div className="track artist">
        <a href="#">{`${props.trackArtist}`}</a>
      </div>
      <div className="track liked">
        <a href="#">{`${props.liked}`}</a>
      </div>
      <div className="track duration">{`${props.duration}`}</div>
    </>
  );
}

export default function Tracks() {
  const [tracks, setTracks] = useState<Track[]>([]);

  useEffect(() => {
    getTracks().then(async res => {
      const trackData = await res.json();
      setTracks(trackData);
    });
  }, []);
  
  return <VirtualList items={tracks} renderer={TrackItem} />;
}

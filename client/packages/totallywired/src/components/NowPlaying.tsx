import { Track } from "../lib/types";

type NowPlayingProps = {
  currentTrack?: Track;
};

export default function NowPlaying({ currentTrack }: NowPlayingProps) {
  return (
    <div className="now-playing panel">
      <div className="cover-art">
        {currentTrack?.releaseId ? (
          <img
            src={`/api/v1/releases/${currentTrack.releaseId}/art`}
            alt="The current album cover art"
          />
        ) : null}
      </div>

      {currentTrack ? (
        <div className="track d-flex col">
          <div className="name">{currentTrack.name}</div>
          <div className="album">
            <a href="#">{currentTrack.releaseName}</a> (<a href="#">2023</a>)
          </div>
          <div className="artist">
            <a href="#">{currentTrack.artistName}</a>
          </div>
        </div>
      ) : null}
    </div>
  );
}

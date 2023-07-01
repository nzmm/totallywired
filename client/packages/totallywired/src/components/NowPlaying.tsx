import { Link } from "react-router-dom";
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
            <Link to={`/lib/albums/${currentTrack.releaseId}/tracks`}>
              {currentTrack.releaseName}
            </Link>{" "}
            (<Link to={`/lib/years/2023/tracks`}>2023</Link>)
          </div>
          <div className="artist">
            <Link to={`/lib/artists/${currentTrack.artistId}/tracks`}>
              {currentTrack.artistName}
            </Link>
          </div>
        </div>
      ) : null}
    </div>
  );
}

import { Link } from "react-router-dom";
import { Track, Artist } from "../../lib/types";
import { ReleaseArt } from "./Thumbnail";

type NowPlayingProps = {
  currentTrack?: Track;
  currentArtist?: Artist;
};

export default function NowPlaying({ currentTrack }: NowPlayingProps) {
  return (
    <div className="now-playing panel">
      <ReleaseArt releaseId={currentTrack?.releaseId} />

      {currentTrack ? (
        <div className="track d-flex col">
          <div className="name">{currentTrack.name}</div>
          <div className="album">
            <Link to={`/lib/albums/${currentTrack.releaseId}/tracks`}>
              {currentTrack.releaseName}
            </Link>{" "}
            &middot; <Link to={`/lib/albums?year=${2023}`}>2023</Link>
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

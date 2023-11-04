import { Link } from "react-router-dom";
import { Track, Artist } from "../../../lib/types";
import { ReleaseArt } from "../../common/Thumbnail";
import "./NowPlaying.css";

type NowPlayingProps = {
  currentTrack?: Track;
  currentArtist?: Artist;
};

export default function NowPlaying({ currentTrack }: NowPlayingProps) {
  return (
    <div id="now-playing">
      <ReleaseArt releaseId={currentTrack?.releaseId} />

      {currentTrack ? (
        <div className="track">
          <div className="name">{currentTrack.name}</div>
          <div className="album">
            <Link to={`/lib/albums/${currentTrack.releaseId}`}>
              {currentTrack.releaseName}
            </Link>
          </div>
          <div className="artist">
            {currentTrack.artistId ? (
              <Link key="artist" to={`/lib/artists/${currentTrack.artistId}`}>
                {currentTrack.artistName}
              </Link>
            ) : null}
          </div>
        </div>
      ) : null}
    </div>
  );
}

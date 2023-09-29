import { Link } from "react-router-dom";
import { Track, Artist } from "../../lib/types";
import { ReleaseArt } from "../common/Thumbnail";
import { useAlbum } from "../../lib/lists/hooks";
import { separatedNodes } from "../../components/helpers";

type NowPlayingProps = {
  currentTrack?: Track;
  currentArtist?: Artist;
};

export default function NowPlaying({ currentTrack }: NowPlayingProps) {
  const album = useAlbum(currentTrack?.releaseId);
  return (
    <div className="now-playing panel">
      <ReleaseArt releaseId={currentTrack?.releaseId} />

      {currentTrack ? (
        <div className="track d-flex col">
          <div className="name">{currentTrack.name}</div>
          <div className="album">
            <Link to={`/lib/albums/${currentTrack.releaseId}`}>
              {currentTrack.releaseName}
            </Link>
          </div>
          <div className="artist">
            {separatedNodes(
              [
                !!currentTrack.artistId,
                <Link key="artist" to={`/lib/artists/${currentTrack.artistId}`}>
                  {currentTrack.artistName}
                </Link>,
              ],
              [
                !!album?.year,
                <Link key="year" to={`/lib/albums?year=${album?.year}`}>
                  {album?.year}
                </Link>,
              ],
            )}
          </div>
        </div>
      ) : null}
    </div>
  );
}

import { useMemo } from "react";
import { Link } from "react-router-dom";
import { AlbumDetail, Track } from "../../lib/types";
import { duration } from "../../lib/utils";
import { usePlayer } from "../../lib/player/hooks";
import { useTracks } from "../../lib/tracks/hooks";
import HeaderTrackList, {
  HeaderTrackDataProps,
  HeaderTrackItemProps,
} from "./HeaderTrackList";
import TrackItem from "./TrackListItem";
import { ReleaseArt } from "../display/Thumbnail";
import "./AlbumTrackList.css";

const useAlbumHeaderInfo = (tracks: Track[]) => {
  return useMemo(() => {
    const { releases, lengthMs } = tracks.reduce<{
      releases: Set<string>;
      lengthMs: number;
    }>(
      (acc, track) => {
        acc.lengthMs += track.length;
        return acc;
      },
      { releases: new Set(), lengthMs: 0 },
    );

    const releaseCount = releases.size;
    const durationHms = duration(lengthMs);

    return { releaseCount, durationHms };
  }, [tracks]);
};

function AlbumHeader({
  album,
  top,
  height,
}: {
  album: AlbumDetail;
  top: number;
  height: number;
}) {
  const player = usePlayer();
  const tracks = useTracks();
  const { durationHms } = useAlbumHeaderInfo(tracks);
  return (
    <li className="list-header" style={{ top, height }}>
      <ReleaseArt releaseId={album.id} />

      <div className="album-info">
        <h2>{album.name}</h2>
        <div>
          <Link to={`/lib/artists/${album.artistId}`}>{album.artistName}</Link>{" "}
          &middot;{" "}
          <Link to={`/lib/albums?year=${album.year}`}>{album.year}</Link>
        </div>
        <div>
          {tracks.length} tracks, {durationHms}
        </div>
        <div className="actions">
          <button
            onClick={() => {
              player.addTracks(tracks);
            }}
          >
            Play all
          </button>

          <Link to={`/lib/albums/${album.id}/editor`}>Edit</Link>
        </div>
      </div>
    </li>
  );
}

function AlbumTrackItem({
  header: album,
  track,
  index,
  top,
  height,
}: HeaderTrackItemProps<AlbumDetail>) {
  return track ? (
    <TrackItem {...track} index={index} top={top} height={height} />
  ) : album ? (
    <AlbumHeader album={album} top={top} height={height} />
  ) : null;
}

export default function AlbumTracksList({
  album,
  tracks,
}: {
  album: AlbumDetail;
  tracks: Track[];
}) {
  const items = useMemo(() => {
    const header = {
      height: 172,
      header: album,
    };

    return tracks.reduce<HeaderTrackDataProps<AlbumDetail>[]>(
      (acc, track) => {
        acc.push({ track, height: 42 });
        return acc;
      },
      [header],
    );
  }, [album, tracks]);

  return <HeaderTrackList items={items} itemRenderer={AlbumTrackItem} />;
}

import { useMemo } from "react";
import { Link } from "react-router-dom";
import { AlbumDetail, Track } from "../lib/types";
import { duration } from "../lib/utils";
import { usePlayer } from "../providers/AudioProvider";
import { cacheTracks, useTracks } from "../providers/TracksProvider";
import CoverArt from "../components/CoverArt";
import HeaderTrackList, {
  HeaderTrackDataProps,
  HeaderTrackItemProps,
} from "../components/HeaderTrackList";
import TrackItem from "../components/TrackListItem";

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
      { releases: new Set(), lengthMs: 0 }
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
      <CoverArt releaseId={album.id} />

      <div className="album-info">
        <h2>{album.name}</h2>
        <div>
          <Link to={`/lib/artists/${album.artistId}/tracks`}>
            {album.artistName}
          </Link>{" "}
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
          {/* <button>Edit</button> */}
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
  ) : (
    <AlbumHeader album={album!} top={top} height={height} />
  );
}

export default function AlbumTracksList({
  album,
  tracks,
}: {
  album: AlbumDetail;
  tracks: Track[];
}) {
  cacheTracks(tracks);

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
      [header]
    );
  }, [album, tracks]);

  return <HeaderTrackList items={items} itemRenderer={AlbumTrackItem} />;
}

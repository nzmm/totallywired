import { useEffect, useMemo } from "react";
import { usePlayer } from "../providers/AudioProvider";
import { set } from "../lib/reducer";
import {
  syncTracks,
  tracksDisptach,
  useTracks,
} from "../providers/TracksProvider";
import { AlbumDetail, Track } from "../lib/types";
import TrackItem from "../components/TrackListItem";
import CoverArt from "../components/CoverArt";
import HeaderTrackList, {
  HeaderTrackDataProps,
  HeaderTrackItemProps,
} from "../components/HeaderTrackList";
import { duration } from "../lib/utils";

const useAlbumHeaderInfo = (tracks: Track[]) => {
  return useMemo(() => {
    const { releases, lengthMs } = tracks.reduce<{
      releases: Set<string>;
      lengthMs: number;
    }>(
      (acc, track) => {
        acc.lengthMs += track.length;
        acc.releases.add(track.releaseId);
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
  const { releaseCount, durationHms } = useAlbumHeaderInfo(tracks);
  return (
    <li className="list-header" style={{ top, height }}>
      <CoverArt releaseId={album.id} />

      <div className="album-info">
        <h2>{album.name}</h2>
        <div>
          {album.artistName} &middot; {album.year} &middot; {releaseCount}{" "}
          tracks, {durationHms}
        </div>
        <div>Record label &middot; NZ</div>
        <div className="actions">
          <button
            onClick={() => {
              console.log(tracks);
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
  syncTracks(tracks);

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

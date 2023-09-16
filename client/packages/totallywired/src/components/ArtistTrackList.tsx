import { useMemo } from "react";
import { ArtistDetail, Track } from "../lib/types";
import { duration } from "../lib/utils";
import { usePlayer } from "../providers/AudioProvider";
import { useTracks } from "../providers/TracksProvider";
import HeaderTrackList, {
  HeaderTrackDataProps,
  HeaderTrackItemProps,
} from "../components/HeaderTrackList";
import TrackItem from "../components/TrackListItem";
import ArtistArt from "./ArtistArt";

const useArtistHeaderInfo = (tracks: Track[]) => {
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
      { releases: new Set(), lengthMs: 0 },
    );

    const releaseCount = releases.size;
    const durationHms = duration(lengthMs);

    return { releaseCount, durationHms };
  }, [tracks]);
};

function ArtistHeader({
  artist,
  top,
  height,
}: {
  artist: ArtistDetail;
  top: number;
  height: number;
}) {
  const player = usePlayer();
  const tracks = useTracks();
  const { releaseCount, durationHms } = useArtistHeaderInfo(tracks);
  return (
    <li className="list-header" style={{ top, height }}>
      {/* todo: support artists */}
      <ArtistArt artistId={artist.id} />

      <div className="album-info">
        <h2>{artist.name}</h2>
        <div>
          {releaseCount} album{releaseCount === 1 ? "" : "s"} &middot;{" "}
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

function ArtistTrackItem({
  header: artist,
  track,
  index,
  top,
  height,
}: HeaderTrackItemProps<ArtistDetail>) {
  return track ? (
    <TrackItem {...track} index={index} top={top} height={height} />
  ) : (
    <ArtistHeader artist={artist!} top={top} height={height} />
  );
}

export function ArtistTrackList({
  artist,
  tracks,
}: {
  artist: ArtistDetail;
  tracks: Track[];
}) {
  const items = useMemo(() => {
    const header = {
      height: 172,
      header: artist,
    };

    return tracks.reduce<HeaderTrackDataProps<ArtistDetail>[]>(
      (acc, track) => {
        acc.push({ track, height: 42 });
        return acc;
      },
      [header],
    );
  }, [artist, tracks]);

  return <HeaderTrackList items={items} itemRenderer={ArtistTrackItem} />;
}

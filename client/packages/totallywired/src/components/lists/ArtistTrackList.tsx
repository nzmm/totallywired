import { useMemo } from "react";
import { ArtistDetail, Track } from "../../lib/types";
import { ArtistArt } from "../common/Thumbnail";
import { usePlayer } from "../../lib/player/hooks";
import { useTracks } from "../../lib/tracks/hooks";
import { useArtistHeaderInfo } from "../../lib/lists/hooks";
import HeaderTrackList, {
  HeaderTrackDataProps,
  HeaderTrackItemProps,
} from "./HeaderTrackList";
import TrackItem from "./TrackListItem";

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
    <li className="artist list-header" style={{ top, height }}>
      {/* todo: support artists */}
      <ArtistArt artistId={artist.id} />

      <div className="details">
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
  ) : artist ? (
    <ArtistHeader artist={artist} top={top} height={height} />
  ) : null;
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

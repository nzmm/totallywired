import { useMemo } from "react";
import { ArtistDetail, Track } from "../lib/types";
import TrackItem from "../components/TrackListItem";
import HeaderTrackList, {
  HeaderTrackDataProps,
  HeaderTrackItemProps,
} from "../components/HeaderTrackList";
import CoverArt from "../components/CoverArt";

function ArtistHeader({
  artist,
  top,
  height,
}: {
  artist: ArtistDetail;
  top: number;
  height: number;
}) {
  return (
    <li className="list-header" style={{ top, height }}>
      {/* todo: support artists */}
      <CoverArt releaseId={artist.id} />

      <div className="album-info">
        <h2>{artist.name}</h2>
        <div>3 albums &middot; 32 tracks, 2h 10m</div>
        <div>Record label &middot; NZ</div>
        <div className="actions">
          <button>Play all</button>
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
      [header]
    );
  }, [artist, tracks]);

  return <HeaderTrackList items={items} itemRenderer={ArtistTrackItem} />;
}

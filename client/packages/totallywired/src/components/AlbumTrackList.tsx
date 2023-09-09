import { useMemo } from "react";
import { AlbumDetail, Track } from "../lib/types";
import TrackItem from "../components/TrackListItem";
import CoverArt from "../components/CoverArt";
import HeaderTrackList, {
  HeaderTrackDataProps,
  HeaderTrackItemProps,
} from "../components/HeaderTrackList";

function AlbumHeader({
  album,
  top,
  height,
}: {
  album: AlbumDetail;
  top: number;
  height: number;
}) {
  return (
    <li className="list-header" style={{ top, height }}>
      <CoverArt releaseId={album.id} />

      <div className="album-info">
        <h2>{album.name}</h2>
        <div>
          {album.artistName} &middot; {album.year} &middot; 32 tracks, 2h 10m
        </div>
        <div>Record label &middot; NZ</div>
        <div className="actions">
          <button>Play all</button>
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

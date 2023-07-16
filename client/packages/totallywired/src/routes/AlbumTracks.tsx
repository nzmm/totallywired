import { Suspense, useMemo } from "react";
import { Await, useAsyncValue } from "react-router-dom";
import { useTracks } from "../providers/TracksProvider";
import { useAlbum } from "../providers/AlbumProvider";
import { AlbumDetails, Track } from "../lib/types";
import TrackItem from "../components/TrackListItem";
import HeaderTrackList, {
  HeaderTrackDataProps,
  HeaderTrackItemProps,
} from "../components/HeaderTrackList";

function AlbumTrackItem({
  header: album,
  track,
  index,
  top,
  height,
}: HeaderTrackItemProps<AlbumDetails>) {
  return track ? (
    <TrackItem {...track} index={index} top={top} height={height} />
  ) : (
    <li className="list-header" style={{ top, height }}>
      <div className="cover-art"></div>
      <div className="album-info">
        <h2>{album?.name}</h2>
        <div>{album?.artistName} &middot; {album?.year} &middot; 32 tracks, 2h 10m</div>
        <div>Record label &middot; NZ</div>
      </div>
    </li>
  );
}

function AlbumTracksInner() {
  const [album, tracks] = useAsyncValue() as [AlbumDetails, Track[]];

  const items = useMemo(() => {
    const header = {
      height: 142,
      header: album
    };

    return tracks.reduce<HeaderTrackDataProps<AlbumDetails>[]>(
      (acc, track) => {
        acc.push({ track, height: 42 });
        return acc;
      },
      [header]
    );
  }, [album, tracks]);

  return <HeaderTrackList items={items} itemRenderer={AlbumTrackItem} />
}

export default function AlbumTracks() {
  const albumPromise = useAlbum();
  const tracksPromise = useTracks();
  return (
    <Suspense>
      <Await resolve={Promise.all([albumPromise, tracksPromise])}>
        <AlbumTracksInner />
      </Await>
    </Suspense>
  );
}

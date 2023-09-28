import { useMemo } from "react";
import { Link } from "react-router-dom";
import { AlbumDetail, Track } from "../../lib/types";
import { usePlayer } from "../../lib/player/hooks";
import { useTracks } from "../../lib/tracks/hooks";
import { useAlbumHeaderInfo } from "../../lib/lists/hooks";
import { separatedNodes } from "../../lib/lists/helpers";
import HeaderTrackList, {
  HeaderTrackDataProps,
  HeaderTrackItemProps,
} from "./HeaderTrackList";
import TrackItem from "./TrackListItem";
import { ReleaseArt } from "../common/Thumbnail";
import "./AlbumTrackList.css";

function PrimaryDetails({ artistId, artistName, year, recordLabel, country }: AlbumDetail) {
  return (
    <div className="primary">
      {separatedNodes(
        [true, <Link to={`/lib/artists/${artistId}`}>{artistName}</Link>],
        [!!year, <Link to={`/lib/albums?year=${year}`}>{year}</Link>],
        [
          !!recordLabel,
          <Link to={`/lib/albums?label=${recordLabel}`}>{recordLabel}</Link>,
        ],
        [
          // country of XW represents [Worldwide] which isn't super meaningful so we hide it
          !!country && country !== 'XW',
          <Link to={`/lib/albums?country=${country}`}>{country}</Link>,
        ],
      )}
    </div>
  );
}

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
    <li className="release list-header" style={{ top, height }}>
      <ReleaseArt releaseId={album.id} />

      <div className="details">
        <h2>{album.name}</h2>
        <PrimaryDetails {...album} />

        {tracks.length} tracks, {durationHms}
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

import { Link } from "react-router-dom";
import { HeartFilledIcon, HeartIcon } from "@radix-ui/react-icons";
import { ListItemProps } from "@totallywired/ui-components";
import { separatedNodes } from "../helpers";
import { usePlayer } from "../../lib/player/hooks";
import { useCollection, useToggleTrackReaction } from "../../lib/tracks/hooks";
import { AlbumCollection, AlbumDetail } from "../../lib/types";
import { ReleaseArt } from "../common/Thumbnail";

export type MusicCollectionListScopes = "releases" | "release" | "artist";
export type CollectionItemProps = ListItemProps<
  AlbumCollection & { scope: MusicCollectionListScopes }
>;

function PrimaryDetails({
  artistId,
  artistName,
  year,
  recordLabel,
  country,
}: AlbumDetail) {
  return (
    <div className="primary">
      {separatedNodes(
        [
          true,
          <Link key="artist" to={`/lib/artists/${artistId}`}>
            {artistName}
          </Link>,
        ],
        [
          !!year,
          <Link key="year" to={`/lib/albums?year=${year}`}>
            {year}
          </Link>,
        ],
        [
          !!recordLabel,
          <Link key="label" to={`/lib/albums?label=${recordLabel}`}>
            {recordLabel}
          </Link>,
        ],
        [
          // country of XW represents [Worldwide] which isn't super meaningful so we hide it
          !!country && country !== "XW",
          <Link key="country" to={`/lib/albums?country=${country}`}>
            {country}
          </Link>,
        ],
      )}
    </div>
  );
}

export default function MusicCollectionListItem({
  scope,
  top,
  height,
  trackCount,
  ...album
}: CollectionItemProps) {
  const player = usePlayer();
  const tracks = useCollection(album.id);
  const toggleLike = useToggleTrackReaction();
  return (
    <li tabIndex={0} style={{ top, height }}>
      <div className="release-collection">
        <div className="header">
          <ReleaseArt releaseId={album.id} />

          <div className="details">
            <h2>{album.name}</h2>
            <PrimaryDetails {...album} />
            {trackCount} tracks
            <div className="actions">
              <button onClick={() => player.addTracks(tracks)}>Play all</button>
              {scope !== "release" ? (
                <Link to={`/lib/albums/${album.id}`}>Details</Link>
              ) : null}
              <Link to={`/lib/albums/${album.id}/editor`}>Edit</Link>
            </div>
          </div>
        </div>

        <table
          className={`tracklist${tracks == null ? " loading" : ""}`}
          cellSpacing={0}
        >
          <caption className="sr-only">Track list</caption>
          <thead>
            <tr>
              <th className="num" scope="column">
                #
              </th>
              <th className="name" scope="column">
                Track
              </th>
              <th className="like" scope="column">
                Liked
              </th>
              <th className="len" scope="column">
                <span>Length</span>
              </th>
            </tr>
          </thead>

          <tbody>
            {tracks.map((t) => (
              <tr key={t.id} tabIndex={0}>
                <td className="num">
                  <button onClick={() => player.addTrack(t)}>{t.number}</button>
                </td>
                <td className="name">{t.name}</td>
                <td className="like">
                  <button onClick={() => toggleLike(t)}>
                    {t.liked ? (
                      <HeartFilledIcon className="liked" />
                    ) : (
                      <HeartIcon />
                    )}
                  </button>
                </td>
                <td className="len">{t.displayLength}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </li>
  );
}

import {
  IVirtualListItem,
  VirtualList,
  VisibleItem,
} from "@totallywired/ui-components";
import { setTrackReaction } from "../lib/api";
import { GenericDispatch, update } from "../lib/reducer";
import { ReactionType, Track } from "../lib/types";
import { usePlayer } from "../providers/AudioProvider";
import { tracksDisptach } from "../providers/TracksProvider";
import TrackItem from "./TrackListItem";
import "./styles/TrackList.css";

export type TrackDataProps = IVirtualListItem & Track;

async function toggleReaction(
  dispatch: GenericDispatch<Track[]>,
  track: TrackDataProps
) {
  const { data: reaction } = await setTrackReaction(
    track.id,
    track.liked ? ReactionType.None : ReactionType.Liked
  );

  const action = (tracks: Track[]) =>
    tracks.map((t) =>
      t.id !== track.id ? t : { ...t, liked: reaction === ReactionType.Liked }
    );

  dispatch(update(action));
}

export default function TrackList({ tracks }: { tracks: Track[] }) {
  const player = usePlayer();
  const dispatch = tracksDisptach();

  const handleClick = async (
    e: React.MouseEvent<HTMLElement>,
    item: VisibleItem<TrackDataProps>
  ) => {
    const target = e.target as HTMLElement;
    switch (target.dataset.intent) {
      case "add": {
        player.addTrack(item.data);
        break;
      }
      case "react": {
        await toggleReaction(dispatch, item.data);
        break;
      }
    }
  };

  const handleDoubleClick = (
    _: React.MouseEvent<HTMLElement>,
    item: VisibleItem<TrackDataProps>
  ) => {
    player.playNow(item.data);
  };

  return tracks.length ? (
    <VirtualList
      items={tracks.map((t) => ({ ...t, height: 42 }))}
      renderer={TrackItem}
      onClick={handleClick}
      onDoubleClick={handleDoubleClick}
    />
  ) : (
    <section>
      <p>No tracks</p>
    </section>
  );
}

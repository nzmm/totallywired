import {
  IVirtualListItem,
  ListItemProps,
  VirtualList,
  VisibleItem,
} from "@totallywired/ui-components";
import { Track } from "../../lib/types";
import { useToggleTrackReaction } from "../../lib/tracks/hooks";
import { usePlayer } from "../../lib/player/hooks";
import "./HeaderTrackList.css";

export type HeaderTrackDataProps<T> = IVirtualListItem & {
  track?: Track;
  header?: T;
};

export type HeaderTrackItemProps<T> = ListItemProps<{
  track?: Track;
  header?: T;
  height: number;
}>;

type HeaderTrackListProps<T> = {
  items: HeaderTrackDataProps<T>[];
  itemRenderer: (props: HeaderTrackItemProps<T>) => React.ReactNode;
};

export default function HeaderTrackList<T>({
  itemRenderer,
  items,
}: HeaderTrackListProps<T>) {
  const player = usePlayer();
  const toggleReaction = useToggleTrackReaction();

  const handleClick = async (
    e: React.MouseEvent<HTMLElement>,
    item: VisibleItem<HeaderTrackDataProps<T>>,
  ) => {
    if (!item.data.track) {
      return;
    }

    const target = e.target as HTMLElement;
    switch (target.dataset.intent) {
      case "add": {
        player.addTrack(item.data.track);
        break;
      }
      case "react": {
        await toggleReaction(item.data.track);
        break;
      }
    }
  };

  const handleDoubleClick = (
    _: React.MouseEvent<HTMLElement>,
    item: VisibleItem<HeaderTrackDataProps<T>>,
  ) => {
    if (item.data.track) {
      player.playNow(item.data.track);
    }
  };

  return items?.length ?? 0 ? (
    <VirtualList
      className="tracklist"
      items={items}
      renderer={itemRenderer}
      onClick={handleClick}
      onDoubleClick={handleDoubleClick}
    />
  ) : (
    <section>
      <p>No tracks</p>
    </section>
  );
}

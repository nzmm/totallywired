import { VirtualList, VisibleItem } from "@totallywired/ui-components";
import { useRef } from "react";
import {
  PlaylistItem as Item,
  PlayerTrack,
  AudioPlayer,
} from "../../lib/player";
import PlaylistItem from "./PlaylistItem";
import "./Playlist.css";

type PlaylistProps = {
  player: AudioPlayer;
  items: Item<PlayerTrack>[];
};

const NOOP = () => null;

export default function Playlist({ player, items }: PlaylistProps) {
  const dragMovingIndex = useRef<number>(0);

  const handlDragStart = (e: React.DragEvent, item: VisibleItem) => {
    e.stopPropagation();
    dragMovingIndex.current = item.i;
  };

  const handleDragOver = (e: React.DragEvent, item: VisibleItem) => {
    e.stopPropagation();

    if (item.i === dragMovingIndex.current) {
      return;
    }

    player.moveTo(dragMovingIndex.current, item.i);
    dragMovingIndex.current = item.i;
  };

  return (
    <VirtualList
      className="tracklist playlist"
      items={items.map((it) => ({ ...it, height: 42, key: it.id }))}
      renderer={PlaylistItem}
      onDragStart={handlDragStart}
      onDragOver={handleDragOver}
      onDrop={NOOP}
    />
  );
}

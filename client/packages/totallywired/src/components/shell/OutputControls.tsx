import { useEffect, useState } from "react";
import type { AudioPlayer } from "../../lib/player";

type OutputControlsProps = {
  player: AudioPlayer;
};

export default function OutputControls({ player }: OutputControlsProps) {
  const [volume, setVolume] = useState<number>(player.getVolume());

  useEffect(() => {
    const handleVolumeChange = () => {
      setVolume(player.getVolume());
    };

    player.addEventHandler("volume-change", handleVolumeChange);
    return () => {
      player.removeEventHandler("volume-change", handleVolumeChange);
    };
  }, [player]);

  return (
    <div id="output-controls">
      <button
        className="round md"
        onClick={() => {
          player.isMuted() ? player.unmute() : player.mute();
        }}
      >
        vol {volume}
      </button>
    </div>
  );
}

/// <reference types="vite/client" />

declare module "@regosen/gapless-5" {
  export class Gapless5 {
    constructor(opts: { loadLimit: number });

    // Parameterized Functions

    addTrack(url: string): void;

    // Accessors

    getTracks(): string[];

    // Actions

    play(): void;

    // Callbacks

    /**
     * Playback requested by user
     */
    onplayrequest: (track_path: string) => void;

    /**
     * Playback actually starts
     */
    onplay: (track_path: string) => void;

    /**
     * PLayback is paused
     */
    onpause: (track_path: string) => void;

    /**
     * Playback is stopped
     */
    onstop: (track_path: string) => void;

    /**
     * prev track, where:
     * @param from_track track that we're switching from
     * @param to_track track that we're switching to
     */
    onprev: (from_track: string, to_track: string) => void;

    /**
     * next track, where:
     * @param from_track track that we're switching from
     * @param to_track track that we're switching to
     */
    onnext: (from_track: string, to_track: string) => void;

    /**
     * Loading started
     */
    onloadstart: (track_path: string) => void;

    /**
     * Loading completed
     */
    onload: (track_path: string) => void;

    /**
     * Track unloaded (to save memory)
     */
    onunload: (track_path: string) => void;

    /**
     * Track failed to load or play
     */
    onerror: (track_path: string, error?: Error | string) => void;

    /**
     * Track finished playing
     */
    onfinishedtrack: (track_path: string) => void;

    /**
     * Entire playlist finished playing
     */
    onfinishedall: () => void;
  }
}

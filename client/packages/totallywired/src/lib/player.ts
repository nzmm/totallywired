import { Track } from "../lib/types";
import { Playlist, PlaylistItem } from "./playlist";
import { debounce } from "./utils";
import { getTrackUrl } from "./api";

type PlayerEvent =
  | "tracks-changed"
  | "state-change"
  | "current-state-change"
  | "volume-change";

export enum TrackState {
  Unknown = 0,
  Queued = 1 << 0,
  Loading = 1 << 1,
  Loaded = 1 << 2,
  Playing = 1 << 3,
  Paused = 1 << 4,
  Finished = 1 << 5,
  Error = 1 << 6,
}

export const IS_QUEUED =
  TrackState.Queued | TrackState.Playing | TrackState.Paused;

export type PlayerTrack = {
  track: Track;
  state: TrackState;
  src?: string;
};

type Handlers = Record<PlayerEvent, ((...tracks: PlayerTrack[]) => void)[]>;

export const TRACK_STATE_ARRAY = [
  TrackState.Unknown,
  TrackState.Queued,
  TrackState.Loading,
  TrackState.Loaded,
  TrackState.Playing,
  TrackState.Paused,
  TrackState.Finished,
  TrackState.Error,
];

const PRELOAD_DELAY_SECONDS = 10;

const PLAYER = (e: Event) => e.target as HTMLAudioElement;

export class AudioPlayer {
  private _player0!: HTMLAudioElement;
  private _player1!: HTMLAudioElement;

  private _playlist = new Playlist<PlayerTrack>();
  private _currentId: string = "";
  private _timeout = -1;

  private _handlers: Handlers = {
    "state-change": [],
    "current-state-change": [],
    "tracks-changed": [],
    "volume-change": [],
  };

  private _init() {
    // Audio element initialisation is delayed until there has been interaction with the page
    // https://developer.chrome.com/blog/autoplay/#webaudio

    if (this._player0 && this._player1) {
      return;
    }

    this._player0 = new Audio();
    this._player1 = new Audio();

    this._player0.preload = "auto";
    this._player1.preload = "auto";

    this._player0.onloadstart = this._handleLoadStart.bind(this);
    this._player1.onloadstart = this._handleLoadStart.bind(this);

    this._player0.oncanplay = this._handleCanPlay.bind(this);
    this._player1.oncanplay = this._handleCanPlay.bind(this);

    this._player0.onplay = this._handlePlay.bind(this);
    this._player1.onplay = this._handlePlay.bind(this);

    this._player0.onplaying = this._handlePlaying.bind(this);
    this._player1.onplaying = this._handlePlaying.bind(this);

    this._player0.onpause = this._handlePause.bind(this);
    this._player1.onpause = this._handlePause.bind(this);

    this._player0.onended = this._handleEnded.bind(this);
    this._player1.onended = this._handleEnded.bind(this);
  }

  private _handlePreload(player: HTMLAudioElement) {
    clearTimeout(this._timeout);

    const nextItem = this._playlist.getNextById(player.id);
    if (!nextItem) {
      return;
    }

    const remaining = player.duration - player.currentTime;
    const preloadDelayMs =
      Math.min(remaining / 2, PRELOAD_DELAY_SECONDS) * 1000;

    this._timeout = window.setTimeout(async () => {
      let { track, src } = nextItem;

      console.log(`${nextItem.track.name}: preloading...`);

      const nextPlayer = this._getNextPlayer();
      src = src ?? (await this._getUrl(track, nextItem.id));
      nextPlayer.id = nextItem.id;
      nextPlayer.src = src;
      nextItem.src = src;
    }, preloadDelayMs);
  }

  private _setupPreload: (player: HTMLAudioElement) => void = debounce(
    this._handlePreload.bind(this)
  );

  private _emit(event: PlayerEvent, ...items: PlaylistItem<PlayerTrack>[]) {
    this._handlers[event].forEach((fn) => fn(...items));
  }

  private _emitStateChange(_: string, item: PlaylistItem<PlayerTrack>) {
    this._emit("state-change", item);
    if (this._currentId === item.id) {
      this._emit("current-state-change", item);
    }
  }

  private _handlePlay(e: Event) {
    const player = PLAYER(e);
    this._currentId = player.id;

    const item = this._playlist.getById(player.id);
    if (!item) {
      return;
    }

    item.state &= ~TrackState.Queued;
    item.state &= ~TrackState.Paused;
    item.state &= ~TrackState.Finished;
    item.state |= TrackState.Playing;
    this._emitStateChange("play", item);
  }

  private _handlePlaying(e: Event) {
    const player = PLAYER(e);
    this._setupPreload(player);
  }

  private _handlePause(e: Event) {
    clearTimeout(this._timeout);

    const player = PLAYER(e);
    if (!player.src) {
      return;
    }

    const item = this._playlist.getById(player.id);
    if (!item) {
      return;
    }

    item.state &= ~TrackState.Playing;
    item.state |= TrackState.Paused;
    this._emitStateChange("pause", item);
  }

  private async _handleEnded(e: Event) {
    const player = PLAYER(e);
    this._playNext(player);
  }

  private _handleLoadStart(e: Event) {
    const player = PLAYER(e);
    const item = this._playlist.getById(player.id);
    item.state |= TrackState.Loading;
    this._emitStateChange("loadstart", item);
  }

  private _handleCanPlay(e: Event) {
    const player = PLAYER(e);
    const item = this._playlist.getById(player.id);
    item.state &= ~TrackState.Loading;
    item.state |= TrackState.Loaded;
    this._emitStateChange("canplay", item);
  }

  private async _getUrl(track: Track, id: string) {
    let { data: url } = await getTrackUrl(track.id);
    return `${url}#${id}`;
  }

  private _getPlayer() {
    return this._currentId === this._player0.id ? this._player0 : this._player1;
  }

  private _getNextPlayer() {
    return this._currentId === this._player0.id ? this._player1 : this._player0;
  }

  private async _play(player: HTMLAudioElement, id: string) {
    this._currentId = id;
    let { src, track } = this._playlist.getById(id);
    src = src ?? (await this._getUrl(track, id));

    if (player.id !== id) {
      player.id = id;
    }
    if (player.src !== src) {
      player.src = src;
    }

    await player.play();
    return src;
  }

  private async _playNext(currentPlayer: HTMLAudioElement) {
    const item = this.getCurrentTrack();

    if (item.i >= 0) {
      currentPlayer.pause();
      currentPlayer.removeAttribute("src");

      item.state = TrackState.Finished;
      item.src = undefined;

      this._emitStateChange("ended", item);
    }

    const nextId = this._playlist.getId(item.i + 1);
    if (!nextId) {
      // finished all
      // todo: handle looping
      console.log("finished");
      this.stop();
      return;
    }

    const nextPlayer = this._getNextPlayer();
    await this._play(nextPlayer, nextId);
  }

  private async _playPrev(currentPlayer: HTMLAudioElement) {
    const item = this.getCurrentTrack();

    if (item.i >= 1) {
      currentPlayer.pause();
      currentPlayer.removeAttribute("src");

      item.state = TrackState.Queued;
      this._emitStateChange("prev", item);
    }

    const prevId = this._playlist.getId(item.i - 1);
    if (!prevId) {
      // no more history
      return;
    }

    const nextPlayer = this._getNextPlayer();
    await this._play(nextPlayer, prevId);
  }

  /**
   * Add a single track to the queue.
   * Playback of the supplied item will begin if the queue was previously empty.
   */
  async addTrack(track: Track) {
    this._init();

    const item = this._playlist.addItem({
      state: TrackState.Queued,
      track,
    });

    this._emit("tracks-changed");

    if (!this._currentId) {
      const player = this._getPlayer();
      await this._play(player, item.id);
    }
  }

  /**
   * Adds multiple tracks to the queue.
   * Playback of the first supplied item will begin if the queue was previously empty.
   * @param shuffle Optional flag to shuffle the supplied tracks
   */
  async addTracks(tracks: Track[]) {
    this._init();

    if (!tracks.length) {
      return;
    }

    const added: PlaylistItem<PlayerTrack>[] = [];

    for (const track of tracks) {
      const item = this._playlist.addItem({
        state: TrackState.Queued,
        track,
      });

      added.push(item);
    }

    this._emit("tracks-changed");

    if (!this._currentId) {
      const player = this._getPlayer();
      const { id } = added[0];
      await this._play(player, id);
    }
  }

  /**
   * Inserts the track just after the current item in the playlist and begins playback.
   */
  async playNow(track: Track) {
    this._init();

    const { i } = this.getCurrentTrack();
    const ta = new Date();
    const id = `${ta.getTime()}-${i}`;
    const src = await this._getUrl(track, id);

    this._playlist.insertItem(i + 1, {
      state: TrackState.Queued,
      track,
      src,
    });

    this._emit("tracks-changed");

    const player = this._getPlayer();
    await this._playNext(player);
  }

  /**
   * Toggles playback
   */
  async playPause() {
    this._init();

    const player = this._getPlayer();
    const { state } = this.getCurrentTrack();

    if (state & TrackState.Unknown) {
      return;
    }
    if (state & TrackState.Playing) {
      player.pause();
    } else {
      await player.play();
    }
  }

  /**
   * Stops playback
   */
  stop() {
    const currentId = this._currentId;
    if (!currentId) {
      return;
    }

    const player = this._getPlayer();
    this._currentId = "";
    player.pause();

    const item = this._playlist.getById(currentId);
    item.state = TrackState.Finished;
    player.removeAttribute("src");
    clearTimeout(this._timeout);

    this._emitStateChange("stop", item);
  }

  /**
   * If playback has not progressed past 15% of the duration, then seeks to the start.
   * Otherwise, skips to the previous track in the queue.
   */
  async prev() {
    this._init();
    const player = this._getPlayer();

    if (this.getProgress() <= 0.15) {
      await this._playPrev(player);
    } else {
      player.currentTime = 0;
    }
  }

  async next() {
    this._init();
    const player = this._getPlayer();
    await this._playNext(player);
  }

  /**
   * Moves the item at `fromIndex` to the `toIndex` position.
   * Only tracks waiting to be played can be repositioned.
   */
  moveTo(fromIndex: number, toIndex: number) {
    if (fromIndex === toIndex) {
      return;
    }

    const playlist = this._playlist;
    const from = playlist.getByIndex(fromIndex);
    const to = playlist.getByIndex(toIndex);

    if ((from.state & TrackState.Queued) === 0) {
      return;
    }
    if ((to.state & TrackState.Queued) === 0) {
      return;
    }

    playlist.moveTo(fromIndex, toIndex);

    const { i } = this.getCurrentTrack();
    const isNext = fromIndex === i + 1 || toIndex === i + 1;

    if (isNext) {
      from.src = undefined;
      from.state &= ~TrackState.Loading;
      from.state &= ~TrackState.Loaded;

      to.src = undefined;
      to.state &= ~TrackState.Loading;
      to.state &= ~TrackState.Loaded;

      const player = this._getPlayer();
      this._setupPreload(player);
    }

    this._emit("tracks-changed");
  }

  /**
   * Removes all queued items from the playlist.
   * If there is a current playing track, playback will be stopped and the current track marked as `Finished`.
   */
  removeAll() {
    const currentId = this._currentId;
    if (!currentId) {
      return 0;
    }

    this.stop();
    const current = this._playlist.getById(currentId);
    const fromIndex = current.i + 1;
    const toIndex = this._playlist.getItemCount();
    console.log(current, toIndex);

    const nRemoved = this._playlist.removeRange(fromIndex, toIndex);

    if (nRemoved) {
      this._emit("tracks-changed");
    }

    return nRemoved;
  }

  /**
   * Returns the current `QueueTrack`
   */
  getCurrentTrack(): PlaylistItem<PlayerTrack> {
    return (
      this._playlist.getById(this._currentId) ?? {
        i: -1,
        state: TrackState.Unknown,
      }
    );
  }

  /**
   * Returns the current `HTMLAudioElement` playback progress as a value between 0 and 1
   */
  getProgress() {
    const player = this._getPlayer();
    return player.currentTime / player.duration;
  }

  /**
   * Returns all playlist items in their current order
   */
  getPlaylistItems() {
    return this._playlist.getItems();
  }

  /**
   * Returns the playlist length
   */
  getPlaylistCount() {
    return this._playlist.count();
  }

  /**
   * Returns the current volume of the `HTMLAudioElement`
   */
  getVolume() {
    this._init();
    return this._player0.muted ? 0 : this._player0.volume;
  }

  /**
   * Returns true if the current `HTMLAudioElement` is muted
   */
  isMuted() {
    this._init();
    return this._player0.muted;
  }

  /**
   * Mutes playback
   */
  mute() {
    this._init();
    this._player0.muted = true;
    this._player1.muted = true;
    this._emit("volume-change");
  }

  /**
   * Unmutes playback
   */
  unmute() {
    this._init();
    this._player0.muted = false;
    this._player1.muted = false;
    this._emit("volume-change");
  }

  /**
   * Add an event handler for the specified event
   */
  addEventHandler(event: PlayerEvent, handler: (item: PlayerTrack) => void) {
    const handlers = this._handlers[event];
    handlers.push(handler);
  }

  /**
   * Remove an event handler for the specified event
   */
  removeEventHandler(event: PlayerEvent, handler: (item: PlayerTrack) => void) {
    const handlers = this._handlers[event];
    this._handlers[event] = handlers.filter((h) => h !== handler);
  }
}

export type { PlaylistItem };

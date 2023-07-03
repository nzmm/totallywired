import { shuffle as shuffleTracks } from "./utils";
import { getTrackUrl } from "./webapi";
import { Track } from "../lib/types";

type PlayerEvent = "tracks-changed" | "state-change" | "current-state-change";

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

export type QueuedTrack = {
  track: Track;
  state: TrackState;
  src?: string;
  id: string;
  ta: Date;
  i: number;
};

type Queue = string[];
type History = Record<string, QueuedTrack>;
type Handlers = Record<string, ((...tracks: QueuedTrack[]) => void)[]>;

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

export class AudioPlayer {
  player0!: HTMLAudioElement;
  player1!: HTMLAudioElement;

  private _queue: Queue = [];
  private _history: History = {};
  private _handlers: Handlers = {};

  private _timeout = -1;
  private _currentId: string = "";

  private _init() {
    // Audio element initialisation is delayed until there has been interaction with the page
    // https://developer.chrome.com/blog/autoplay/#webaudio

    if (this.player0 && this.player1) {
      return;
    }

    this.player0 = new Audio();
    this.player1 = new Audio();

    this.player0.preload = "auto";
    this.player1.preload = "auto";

    this.player0.onloadstart = this._handleLoadStart.bind(this);
    this.player1.onloadstart = this._handleLoadStart.bind(this);

    this.player0.oncanplay = this._handleCanPlay.bind(this);
    this.player1.oncanplay = this._handleCanPlay.bind(this);

    this.player0.onplay = this._handlePlay.bind(this);
    this.player1.onplay = this._handlePlay.bind(this);

    this.player0.onplaying = this._handlePlaying.bind(this);
    this.player1.onplaying = this._handlePlaying.bind(this);

    this.player0.onpause = this._handlePause.bind(this);
    this.player1.onpause = this._handlePause.bind(this);

    this.player0.onended = this._handleEnded.bind(this);
    this.player1.onended = this._handleEnded.bind(this);
  }

  private _playerFromEvent(e: Event) {
    return e.target as HTMLAudioElement;
  }

  private _setupPreload(player: HTMLAudioElement) {
    clearTimeout(this._timeout);

    const remaining = player.duration - player.currentTime;
    const preloadDelayMs = Math.max(remaining / 2, remaining - 10) * 1000;

    console.log({ preloadDelayMs });

    this._timeout = window.setTimeout(async () => {
      const qt = this._history[player.id];
      const nextId = this._queue[qt.i + 1];

      if (!nextId) {
        return;
      }

      let { src, track } = this._history[nextId];
      console.log(`${track.name}: preloading...`);

      const altPlayer = this._getNextPlayer();
      src = src ?? (await this._getUrl(track, nextId));
      altPlayer.id = nextId;
      altPlayer.src = src;
    }, preloadDelayMs);
  }

  private _emitStateChange(_: string, qt: QueuedTrack) {
    this._handlers["state-change"]?.forEach((fn) => fn(qt));
    if (this._currentId === qt.id) {
      this._handlers["current-state-change"]?.forEach((fn) => fn(qt));
    }
  }

  private _handlePlay(e: Event) {
    const player = this._playerFromEvent(e);
    this._currentId = player.id;

    const qt = this._history[this._currentId];
    qt.state &= ~TrackState.Queued;
    qt.state &= ~TrackState.Paused;
    qt.state &= ~TrackState.Finished;
    qt.state |= TrackState.Playing;
    this._emitStateChange("play", qt);
  }

  private _handlePlaying(e: Event) {
    const player = this._playerFromEvent(e);
    this._setupPreload(player);
  }

  private _handlePause(e: Event) {
    clearTimeout(this._timeout);

    const player = this._playerFromEvent(e);
    if (!player.src) {
      return;
    }

    const qt = this._history[player.id];
    qt.state &= ~TrackState.Playing;
    qt.state |= TrackState.Paused;
    this._emitStateChange("pause", qt);
  }

  private async _handleEnded(e: Event) {
    const player = this._playerFromEvent(e);
    this._playNext(player);
  }

  private _handleLoadStart(e: Event) {
    const player = this._playerFromEvent(e);
    const qt = this._history[player.id];
    qt.state |= TrackState.Loading;
    this._emitStateChange("loadstart", qt);
  }

  private _handleCanPlay(e: Event) {
    const player = this._playerFromEvent(e);
    const qt = this._history[player.id];
    qt.state &= ~TrackState.Loading;
    qt.state |= TrackState.Loaded;
    this._emitStateChange("canplay", qt);
  }

  private async _getUrl(track: Track, id: string) {
    let url = await getTrackUrl(track.id);
    return `${url}#${id}`;
  }

  private _getPlayer() {
    return this._currentId === this.player0.id ? this.player0 : this.player1;
  }

  private _getNextPlayer() {
    return this._currentId === this.player0.id ? this.player1 : this.player0;
  }

  private async _play(player: HTMLAudioElement, id: string) {
    this._currentId = id;
    let { src, track } = this._history[id];
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
    const qt = this.getCurrentTrack();

    if (qt.i >= 0) {
      currentPlayer.pause();
      currentPlayer.removeAttribute("src");

      qt.state = TrackState.Finished;
      qt.src = undefined;

      this._emitStateChange("ended", qt);
    }

    const nextId = this._queue[qt.i + 1];
    if (!nextId) {
      // finished all
      return;
    }

    const nextPlayer = this._getNextPlayer();
    await this._play(nextPlayer, nextId);
  }

  private async _playPrev(currentPlayer: HTMLAudioElement) {
    const qt = this.getCurrentTrack();

    if (qt.i >= 1) {
      currentPlayer.pause();
      currentPlayer.removeAttribute("src");

      qt.state = TrackState.Queued;
      this._emitStateChange("prev", qt);
    }

    const prevId = this._queue[qt.i - 1];
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

    const i = this._queue.length;
    const ta = new Date();
    const id = `${ta.getTime()}-${i}`;

    this._queue.push(id);

    const qt = (this._history[id] = {
      state: TrackState.Queued,
      track,
      id,
      ta,
      i,
    });

    this._handlers["tracks-changed"]?.forEach((fn) => fn(qt));

    if (i === 0) {
      const player = this._getPlayer();
      await this._play(player, id);
    }
  }

  /**
   * Adds multiple tracks to the queue.
   * Playback of the first supplied item will begin if the queue was previously empty.
   * @param shuffle Optional flag to shuffle the supplied tracks
   */
  async addTracks(tracks: Track[], shuffle = false) {
    this._init();

    if (!tracks.length) {
      return;
    }

    const tracksToAdd = !shuffle ? tracks : shuffleTracks([...tracks]);

    const l = this.getQueueLength();
    const added: QueuedTrack[] = [];

    for (const track of tracksToAdd) {
      const i = this.getQueueLength();
      const ta = new Date();
      const id = `${ta.getTime()}-${i}`;

      this._queue.push(id);

      const qt = (this._history[id] = {
        state: TrackState.Queued,
        track,
        id,
        ta,
        i,
      });

      added.push(qt);
    }

    this._handlers["tracks-changed"]?.forEach((fn) => fn(...added));

    if (l === 0) {
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

    this._queue.splice(i + 1, 0, id);

    const qt = (this._history[id] = {
      state: TrackState.Queued,
      track,
      src,
      ta,
      id,
      i: i + 1,
    });

    this._handlers["tracks-changed"]?.forEach((fn) => fn(qt));

    const player = this._getPlayer();
    await this._playNext(player);
  }

  /**
   * Toggles playback
   */
  async playPause() {
    const player = this._getPlayer();
    if (!player) {
      console.warn("Player not initialised");
      return;
    }

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
   * If playback has not progressed past 15% of the duration, then seeks to the start.
   * Otherwise, skips to the previous track in the queue.
   */
  async prev() {
    const player = this._getPlayer();
    if (!player) {
      console.warn("Player not initialised");
      return;
    }

    if (this.getProgress() <= 0.15) {
      await this._playPrev(player);
    } else {
      player.currentTime = 0;
    }
  }

  async next() {
    const player = this._getPlayer();
    if (!player) {
      console.warn("Player not initialised");
      return;
    }

    await this._playNext(player);
  }

  /**
   * Swap the positions of the queue items
   */
  swap(fromIndex: number, toIndex: number) {
    const l = this.getQueueLength();
    if (!l || toIndex > l - 1) {
      return;
    }

    const fromId = this._queue[fromIndex];
    const toId = this._queue[toIndex];

    const from = this._history[fromId];
    const to = this._history[toId];

    from.i = toIndex;
    to.i = fromIndex;

    this._queue[toIndex] = fromId;
    this._queue[fromIndex] = toId;

    this._handlers["tracks-changed"]?.forEach((fn) => fn(from, to));
  }

  /**
   * Returns the current `QueueTrack`
   */
  getCurrentTrack(): QueuedTrack {
    return (
      this._history[this._currentId] ?? { i: -1, state: TrackState.Unknown }
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
   * Returns all `QueueTrack` items in their current order
   */
  getQueue() {
    const history = this._history;
    return this._queue.map((src) => history[src]);
  }

  /**
   * Returns the queue length
   */
  getQueueLength() {
    return this._queue.length;
  }

  /**
   * Add an event handler for the specified event
   */
  addEventHandler(event: PlayerEvent, handler: (qt: QueuedTrack) => void) {
    const handlers = this._handlers[event];
    if (!handlers?.length) {
      this._handlers[event] = [handler];
    } else {
      handlers.push(handler);
    }
  }

  /**
   * Remove an event handler for the specified event
   */
  removeEventHandler(event: PlayerEvent, handler: (qt: QueuedTrack) => void) {
    const handlers = this._handlers[event];
    if (!handlers?.length) {
      return;
    } else {
      this._handlers[event] = handlers.filter((h) => h !== handler);
    }
  }
}

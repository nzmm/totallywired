import { ReleaseUpdateCommand } from "./editor/types";
import { sendCommand, sendQuery } from "./requests";
import {
  Album,
  AlbumCollection,
  AlbumDetail,
  Artist,
  Playlist,
  ProviderCollection,
  ReactionType,
  Track,
  User,
} from "./types";

const API = "/api/v1";

/* Users */
export function whoami() {
  return sendQuery<User>(`${API}/whoami`);
}

/* Tracks */
export function getTracks(searchParams?: URLSearchParams) {
  return sendQuery<Track[]>(`${API}/tracks`, searchParams);
}

export function getTracksByAlbum(
  releaseId: string,
  searchParams?: URLSearchParams,
) {
  return sendQuery<Track[]>(
    `${API}/releases/${releaseId}/tracks`,
    searchParams,
  );
}

export function getTracksByArtist(
  artistId: string,
  searchParams?: URLSearchParams,
) {
  return sendQuery<Track[]>(`${API}/artists/${artistId}/tracks`, searchParams);
}

export function getTrackUrl(trackId: string) {
  return sendQuery<string>(`${API}/tracks/${trackId}/downloadUrl`);
}

export function setTrackReaction(trackId: string, reaction: ReactionType) {
  return sendCommand<ReactionType>(`${API}/tracks/${trackId}/react`, {
    reaction,
  });
}

/* Albums */

export function getCollection(searchParams?: URLSearchParams) {
  return sendQuery<AlbumCollection[]>(
    `${API}/releases/as-collection`,
    searchParams,
  );
}

export function getAlbums(searchParams?: URLSearchParams) {
  return sendQuery<Album[]>(`${API}/releases`, searchParams);
}

export function getAlbum(releaseId: string) {
  return sendQuery<AlbumDetail>(`${API}/releases/${releaseId}`);
}

export function setAlbumMetadata(
  releaseId: string,
  updateCommand: ReleaseUpdateCommand,
) {
  return sendCommand<{ releaseId: string }>(
    `${API}/releases/${releaseId}`,
    updateCommand,
  );
}

/* Artists */

export function getArtists(searchParams?: URLSearchParams) {
  return sendQuery<Artist[]>(`${API}/artists`, searchParams);
}

export function getArtist(artistId: string) {
  return sendQuery<Artist>(`${API}/artists/${artistId}`);
}

/* Playlists */

export function getPlaylists() {
  return sendQuery<Playlist[]>(`${API}/playlists`);
}

/* Content Providers */

export function getProviders() {
  return sendQuery<ProviderCollection[]>(`${API}/providers`);
}

export function syncProvider(sourceId: string) {
  return sendCommand(`${API}/providers/${sourceId}/sync`);
}

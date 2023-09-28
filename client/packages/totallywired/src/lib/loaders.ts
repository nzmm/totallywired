import { LoaderFunctionArgs } from "react-router-dom";
import { requestSearchParams } from "./requests";
import { ReactionType } from "./types";
import {
  getAlbum,
  getAlbums,
  getArtist,
  getArtists,
  getTracks,
  getTracksByAlbum,
  getTracksByArtist,
} from "./api";

export function tracksLoader({ request }: LoaderFunctionArgs) {
  const searchParams = requestSearchParams(request);
  return getTracks(searchParams);
}

export function artistsLoader({ request }: LoaderFunctionArgs) {
  const searchParams = requestSearchParams(request);
  return getArtists(searchParams);
}

export function artistTracksLoader({ request, params }: LoaderFunctionArgs) {
  const artistId = params["artistId"];

  if (!artistId) {
    throw new Error("artistId required");
  }

  const searchParams = requestSearchParams(request);
  return Promise.all([
    getArtist(artistId),
    getTracksByArtist(artistId, searchParams),
  ]);
}

export function albumsLoader({ request }: LoaderFunctionArgs) {
  const searchParams = requestSearchParams(request);
  return getAlbums(searchParams);
}

export function albumTracksLoader({ request, params }: LoaderFunctionArgs) {
  const releaseId = params["releaseId"];

  if (!releaseId) {
    throw new Error("releaseId required");
  }

  const searchParams = requestSearchParams(request);
  return Promise.all([
    getAlbum(releaseId),
    getTracksByAlbum(releaseId, searchParams),
  ]);
}

export function likedLoader({ request }: LoaderFunctionArgs) {
  const searchParams = requestSearchParams(request);
  searchParams.append("reaction", ReactionType.Liked.toString());
  return getTracks(searchParams);
}

import { useEffect, useMemo, useState } from "react";
import { AlbumDetail, Track } from "../types";
import { duration } from "../utils";
import { getAlbum } from "../api";

export const useAlbum = (albumId: string | undefined) => {
  const [album, setAlbum] = useState<AlbumDetail>();

  useEffect(() => {
    if (!albumId) {
      setAlbum(undefined);
      return;
    }
    getAlbum(albumId).then((res) => setAlbum(res.data));
  }, [albumId]);

  return album;
};

export const useAlbumHeaderInfo = (tracks: Track[]) => {
  return useMemo(() => {
    const { releases, lengthMs } = tracks.reduce<{
      releases: Set<string>;
      lengthMs: number;
    }>(
      (acc, track) => {
        acc.lengthMs += track.length;
        return acc;
      },
      { releases: new Set(), lengthMs: 0 },
    );

    const releaseCount = releases.size;
    const durationHms = duration(lengthMs);

    return { releaseCount, durationHms };
  }, [tracks]);
};

export const useArtistHeaderInfo = (tracks: Track[]) => {
  return useMemo(() => {
    const { releases, lengthMs } = tracks.reduce<{
      releases: Set<string>;
      lengthMs: number;
    }>(
      (acc, track) => {
        acc.lengthMs += track.length;
        acc.releases.add(track.releaseId);
        return acc;
      },
      { releases: new Set(), lengthMs: 0 },
    );

    const releaseCount = releases.size;
    const durationHms = duration(lengthMs);

    return { releaseCount, durationHms };
  }, [tracks]);
};

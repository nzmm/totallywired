import { useEffect, useState } from "react";
import { AlbumDetail } from "../types";
import { getAlbum } from "./v1";

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

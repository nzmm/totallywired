import * as Dialog from "@radix-ui/react-dialog";
import { useEffect, useState } from "react";
import { Splitter } from "@totallywired/ui-components";
import { AlbumDetail, Track } from "../../lib/types";
import { getAlbum, getTracksByAlbum } from "../../lib/api";
import { MBReleaseSearchItem } from "../../lib/musicbrainz/types";
import Header from "../nav/Header";
import AlbumMetadataSearch from "./AlbumSearch";
import AlbumMetadataComparison from "./AlbumComparison";
import "./AlbumEditor.css";

type AlbumMetadataEditorProps = {
  releaseId: string;
  onSave: () => void;
  onDiscard: () => void;
};

export default function AlbumMetadataEditor({
  releaseId,
  onSave,
  onDiscard,
}: AlbumMetadataEditorProps) {
  const [release, setRelease] = useState<AlbumDetail>();
  const [tracks, setTracks] = useState<Track[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    const albumLoader = getAlbum(releaseId).then((res) => setRelease(res.data));

    const tracksLoader = getTracksByAlbum(releaseId).then((res) =>
      setTracks(res.data ?? []),
    );

    Promise.all([albumLoader, tracksLoader]).finally(() => setLoading(false));
  }, []);

  const onSelect = (result: MBReleaseSearchItem) => {
    console.log(result);
  };

  return (
    <Dialog.Root open>
      <Dialog.Portal>
        <Dialog.Content className="DialogContent editor fullscreen">
          <Header />

          <Splitter
            orientation="horizontal"
            initialPosition="300px"
            minSize="200px"
          >
            <AlbumMetadataSearch
              release={release}
              disabled={loading}
              onSelect={onSelect}
            />

            <AlbumMetadataComparison
              currentRelease={release}
              currentTracks={tracks}
            />
          </Splitter>

          <div className="toolbar">
            <Dialog.Close asChild onClick={onDiscard}>
              <button className="Button">Discard</button>
            </Dialog.Close>

            <Dialog.Close asChild onClick={onSave}>
              <button className="Button green">Save changes</button>
            </Dialog.Close>
            <div />
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

import * as Dialog from "@radix-ui/react-dialog";
import { useEffect, useState } from "react";
import { Splitter } from "@totallywired/ui-components";
import { AlbumDetail } from "../../lib/types";
import { getAlbum } from "../../lib/api";
import { MBReleaseSearchItem } from "../../lib/musicbrainz/types";
import Header from "../nav/Header";
import AlbumMetadataSearch from "./AlbumMetadataSearch";
import AlbumMetadataComparison from "./AlbumComparison";
import "./AlbumMetadataEditor.css";

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
  const [releaseLoading, setReleaseLoading] = useState(false);

  useEffect(() => {
    setReleaseLoading(true);
    getAlbum(releaseId)
      .then((res) => setRelease(res.data))
      .finally(() => setReleaseLoading(false));
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
            initialPosition="350px"
            minSize="200px"
          >
            <AlbumMetadataSearch
              release={release}
              disabled={releaseLoading}
              onSelect={onSelect}
            />

            <AlbumMetadataComparison />
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

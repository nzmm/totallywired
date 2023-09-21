import * as Dialog from "@radix-ui/react-dialog";
import { FormEvent, useEffect, useState } from "react";
import { Splitter } from "@totallywired/ui-components";
import { searchReleases } from "../../lib/musicbrainz";
import Header from "../nav/Header";
import Loading from "../display/Loading";
import AlbumSearchResult, { AlbumSearchResultProps } from "./AlbumSearchResult";
import "./AlbumMetadataEditor.css";
import { AlbumDetail } from "../../lib/types";
import { getAlbum } from "../../lib/api";
import { distance } from "../../lib/editor/damerau-lvenshtein";

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
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchResults, setSearchResults] = useState<AlbumSearchResultProps[]>(
    [],
  );

  const onSearch = async (
    e: FormEvent<HTMLFormElementWithInputs<"album" | "artist">>,
  ) => {
    e.preventDefault();
    setSearchLoading(true);

    const { album, artist } = e.currentTarget;
    const res = await searchReleases(album.value, artist.value);
    if (!res.ok) {
      return;
    }

    const releases = (res.data?.releases ?? []).map((r) => {
      return {
        ...r,
        similarity: distance(
          `${release?.artistName} ${release?.name}`,
          `${r["artist-credit"][0]?.name} ${r.title}`,
        ),
      };
    });

    setSearchResults(releases);
    setSearchLoading(false);
  };

  useEffect(() => {
    setReleaseLoading(true);
    getAlbum(releaseId)
      .then((res) => setRelease(res.data))
      .finally(() => setReleaseLoading(false));
  }, []);

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
            <section className="album-search">
              <form onSubmit={onSearch} autoComplete="off">
                <fieldset disabled={releaseLoading || searchLoading}>
                  <input
                    type="text"
                    name="album"
                    placeholder="Album"
                    defaultValue={release?.name}
                  />
                  <input
                    type="text"
                    name="artist"
                    placeholder="Artist"
                    defaultValue={release?.artistName}
                  />
                  <button type="submit">Search</button>
                </fieldset>
              </form>

              <hr />

              <div className="album-search-results">
                {searchLoading ? (
                  <Loading />
                ) : (
                  searchResults.map((sr) => (
                    <AlbumSearchResult key={sr.id} {...sr} />
                  ))
                )}
              </div>
            </section>

            <section className="album-compare">
              <div></div>
              <div></div>
            </section>
          </Splitter>

          <div className="toolbar">
            <Dialog.Close asChild onClick={onDiscard}>
              <button className="Button">Discard</button>
            </Dialog.Close>

            <Dialog.Close asChild onClick={onSave}>
              <button className="Button green">Save changes</button>
            </Dialog.Close>

            <div></div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

import { Splitter } from "@totallywired/ui-components";
import { Thumbnail } from "../display/Thumbnail";
import { Album, Track } from "../../lib/types";
import ReleaseTable from "./ReleaseTable";
import TrackTable from "./TrackTable";
import "./AlbumComparison.css";

type AlbumMetadataComparison = {
  currentRelease: Album | undefined;
  currentTracks: Track[];
};

export default function AlbumMetadataComparison({
  currentRelease,
  currentTracks,
}: AlbumMetadataComparison) {
  if (!currentRelease) {
    return null;
  }

  return (
    <section className="album-compare">
      <Splitter orientation="horizontal">
        <div className="current metadata">
          <div>
            <h4 className="muted">Current</h4>
          </div>

          <Thumbnail
            src=""
            alt="The current album thumbnail"
            className="large-release-art"
          />

          <ReleaseTable release={currentRelease} />

          <TrackTable tracks={currentTracks} />
        </div>

        <div className="proposed metadata">
          <div>
            <h4 className="muted">Proposed</h4>
          </div>

          <Thumbnail
            src=""
            alt="The updated album thumbnail"
            className="large-release-art"
          />

          <ReleaseTable release={currentRelease} />

          <TrackTable tracks={currentTracks} />
        </div>
      </Splitter>
    </section>
  );
}

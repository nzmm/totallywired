import { Splitter } from "@totallywired/ui-components";
import { Thumbnail } from "../display/Thumbnail";
import { AlbumWithTracks } from "../../lib/types";
import { AlbumChangeProposal } from "../../lib/editor/types";
import { MBTrack } from "../../lib/musicbrainz/types";
import ReleaseTable from "./ReleaseTable";
import TrackTable from "./TrackTable";
import "./AlbumComparison.css";

type AlbumMetadataComparisonProps = {
  current?: AlbumWithTracks;
  proposal?: AlbumChangeProposal;
  candidateTracks: MBTrack[];
};

export default function AlbumMetadataComparison({
  current,
  proposal,
  candidateTracks,
}: AlbumMetadataComparisonProps) {
  if (!current) {
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

          <ReleaseTable current={current} readOnly />

          <TrackTable currentTracks={current.tracks} readOnly />
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

          <ReleaseTable
            current={current}
            proposal={proposal}
            readOnly={proposal == null}
          />

          <TrackTable
            currentTracks={current.tracks}
            proposedTracks={proposal?.tracks ?? []}
            candidateTracks={candidateTracks}
            readOnly={proposal == null}
          />
        </div>
      </Splitter>
    </section>
  );
}

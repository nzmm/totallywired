import { Splitter } from "@totallywired/ui-components";
import { Thumbnail } from "../display/Thumbnail";
import { MBTrack } from "../../lib/musicbrainz/types";
import {
  AlbumChangeProposal,
  EditorInputEventHandler,
} from "../../lib/editor/types";
import { editorDisptach } from "../../providers/EditorProvider";
import {
  updateAttrApproval,
  updateAttrValue,
  updateTrackApproval,
  updateTrackValue,
} from "../../lib/editor/actions";
import ReleaseTable from "./ReleaseTable";
import TrackTable from "./TrackTable";
import "./AlbumComparison.css";

type AlbumMetadataComparisonProps = {
  proposal: AlbumChangeProposal;
  candidateTracks: MBTrack[];
};

export default function AlbumMetadataComparison({
  proposal,
  candidateTracks,
}: AlbumMetadataComparisonProps) {
  const dispatch = editorDisptach();

  const onAttrChange: EditorInputEventHandler = (e) => {
    const { dataset, value } = e.currentTarget;
    dispatch(updateAttrValue(dataset.key, value));
  };

  const onAttrApprove: EditorInputEventHandler = (e) => {
    const { dataset, checked } = e.currentTarget;
    dispatch(updateAttrApproval(dataset.key, checked));
  };

  const onTrackChange: EditorInputEventHandler = (e) => {
    const { dataset, value } = e.currentTarget;
    dispatch(updateTrackValue(dataset.tid, dataset.key, value));
  };

  const onTrackApprove: EditorInputEventHandler = (e) => {
    const { dataset, checked } = e.currentTarget;
    dispatch(updateTrackApproval(dataset.key, checked));
  };

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

          <ReleaseTable proposal={proposal} version="oldValue" readOnly />

          <TrackTable tracks={proposal.tracks} version="oldValue" readOnly />
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
            proposal={proposal}
            version="newValue"
            readOnly={!proposal?.mbid}
            onChange={onAttrChange}
            onApprove={onAttrApprove}
          />

          <TrackTable
            tracks={proposal.tracks}
            version="newValue"
            candidateTracks={candidateTracks}
            readOnly={!proposal?.mbid}
            onChange={onTrackChange}
            onApprove={onTrackApprove}
          />
        </div>
      </Splitter>
    </section>
  );
}

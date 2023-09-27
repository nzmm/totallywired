import { Splitter } from "@totallywired/ui-components";
import { MBTrack } from "../../lib/musicbrainz/types";
import {
  AlbumChangeProposal,
  EditorInputEventHandler,
} from "../../lib/editor/types";
import {
  updateAttrApproval,
  updateAttrValue,
  updateCoverArt,
  updateTrackApproval,
  updateTrackValue,
} from "../../lib/editor/actions";
import { useEditorDisptach } from "../../lib/editor/hooks";
import ArtTable from "./ArtTable";
import ReleaseTable from "./ReleaseTable";
import TrackTable from "./TrackTable";
import "./AlbumComparison.css";
import { MouseEventHandler } from "react";

type AlbumMetadataComparisonProps = {
  proposal: AlbumChangeProposal;
  candidateTracks: MBTrack[];
  artCollection: Record<string, string>;
};

const EMPTY_COLLECTION = {};

export default function AlbumMetadataComparison({
  proposal,
  candidateTracks,
  artCollection,
}: AlbumMetadataComparisonProps) {
  const dispatch = useEditorDisptach();

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

  const onArtSelect: MouseEventHandler<HTMLButtonElement> = (e) => {
    const { value: artSrc } = e.currentTarget;
    dispatch(updateCoverArt(artSrc));
  };

  const proposalReadOnly = !proposal?.mbid;

  return (
    <section className="album-compare">
      <Splitter orientation="horizontal">
        <div className="current metadata">
          <div>
            <h4 className="muted">Current Metadata</h4>
          </div>

          <ArtTable
            proposal={proposal}
            artCollection={EMPTY_COLLECTION}
            label="The current release cover art"
            version="oldValue"
            readOnly
          />

          <ReleaseTable proposal={proposal} version="oldValue" readOnly />

          <TrackTable tracks={proposal.tracks} version="oldValue" readOnly />
        </div>

        <div className="proposed metadata">
          <div>
            <h4 className="muted">Proposed Metadata</h4>
          </div>

          <ArtTable
            proposal={proposal}
            artCollection={artCollection}
            label="The proposed release cover art"
            version="newValue"
            readOnly={proposalReadOnly}
            onSelect={onArtSelect}
            onApprove={onAttrApprove}
          />

          <ReleaseTable
            proposal={proposal}
            version="newValue"
            readOnly={proposalReadOnly}
            onChange={onAttrChange}
            onApprove={onAttrApprove}
          />

          <TrackTable
            tracks={proposal.tracks}
            version="newValue"
            candidateTracks={candidateTracks}
            readOnly={proposalReadOnly}
            onChange={onTrackChange}
            onApprove={onTrackApprove}
          />
        </div>
      </Splitter>
    </section>
  );
}

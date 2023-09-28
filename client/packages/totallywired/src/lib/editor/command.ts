import {
  AlbumChangeProposal,
  AttributeChangeRequest,
  ReleaseUpdateCommand,
  TrackChangeRequest,
  TrackUpdate,
} from "./types";

const getAttrValue = <T>(cr: AttributeChangeRequest<T>) => {
  if (cr.active && cr.approved) {
    return cr.newValue;
  }
  return cr.oldValue;
};

const getTrackValue = (cr: TrackChangeRequest) => {
  let disc: number, number: string, name: string;

  if (cr.active && cr.approved) {
    disc = cr.disc.newValue;
    number = cr.number.newValue;
    name = cr.name.newValue;
  } else {
    disc = cr.disc.oldValue;
    number = cr.number.oldValue;
    name = cr.name.oldValue;
  }
  return { disc, number, name };
};

export function createReleaseUpdateCommand(
  proposal: AlbumChangeProposal,
): ReleaseUpdateCommand {
  return {
    releaseId: proposal.id,
    artistMbid: proposal.artistMbid,
    releaseMbid: proposal.mbid,
    name: getAttrValue(proposal.name),
    artistName: getAttrValue(proposal.artistName),
    recordLabel: getAttrValue(proposal.recordLabel),
    type: getAttrValue(proposal.type),
    country: getAttrValue(proposal.country),
    year: getAttrValue(proposal.year),
    coverArtUrl: getAttrValue(proposal.coverArt),
    tracks: proposal.tracks.map((t): TrackUpdate => {
      const { disc, number, name } = getTrackValue(t);
      const position = parseInt(t.number.newValue);
      return {
        trackId: t.id,
        trackMbid: t.mbid,
        name,
        disc,
        number,
        position,
      };
    }),
  };
}

/*

  For development only!!!
  Removes all tracks and related data, and resets any deltas.

*/

TRUNCATE "TrackReactions", "Tracks", "Releases", "Artists";
UPDATE "Sources" SET "Delta" = '';

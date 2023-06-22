CREATE OR REPLACE FUNCTION search_tracks(userId uuid, terms text) RETURNS SETOF "Tracks" AS $$
SELECT
    t."Id",
    t."UserId",
    t."Created",
    t."Modified",
    t."SourceId",
    t."ArtistId",
    t."ReleaseId",
    t."ResourceId",
    t."Disc",
    t."Position",
    t."Number",
    t."FileName",
    t."Name",
    t."ReleaseName",
    t."ArtistCredit",
    t."Genre",
    t."ThumbnailUrl",
    t."Year",
    t."MusicBrainzId",
    t."BitRate",
    t."Length",
    t."DisplayLength",
    t."SearchVector_EN"
FROM (
    SELECT t.*, ts_rank(t."SearchVector_EN", query) AS rank
    FROM "Tracks" AS t, to_tsquery('simple', $2) AS query
    WHERE t."UserId" = $1 AND t."SearchVector_EN" @@ query
    ORDER BY rank DESC, t."Position"
) t
$$ LANGUAGE SQL;
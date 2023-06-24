CREATE OR REPLACE FUNCTION search_releases(userId uuid, terms text) RETURNS SETOF "Releases" AS $$
SELECT
    r."Id",
    r."UserId",
    r."Created",
    r."Modified",
    r."ArtistId",
    r."ResourceId",
    r."Name",
    r."ThumbnailUrl",
    r."Year",
    r."Country",
    r."RecordLabel",
    r."MusicBrainzId",
    r."SearchVector_EN"
FROM (
    SELECT r.*, ts_rank(r."SearchVector_EN", query) AS rank
    FROM "Releases" AS r, to_tsquery('simple', $2) AS query
    WHERE r."UserId" = $1 AND r."SearchVector_EN" @@ query
    ORDER BY rank DESC, r."Name"
) r
$$ LANGUAGE SQL;
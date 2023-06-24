CREATE OR REPLACE FUNCTION search_artists(userId uuid, terms text) RETURNS SETOF "Artists" AS $$
SELECT
    a."Id",
    a."UserId",
    a."Created",
    a."Modified",
    a."Name",
    a."Description",
    a."ThumbnailUrl",
    a."MusicBrainzId",
    a."SearchVector_EN"
FROM (
         SELECT a.*, ts_rank(a."SearchVector_EN", query) AS rank
         FROM "Artists" AS a, to_tsquery('simple', $2) AS query
         WHERE a."UserId" = $1 AND a."SearchVector_EN" @@ query
         ORDER BY rank DESC, a."Name"
     ) a
$$ LANGUAGE SQL;
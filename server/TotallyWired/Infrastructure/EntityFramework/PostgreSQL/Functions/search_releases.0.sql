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
     SELECT r.*
     FROM "Releases" AS r
          CROSS JOIN to_tsquery('simple', $2) AS query
          INNER JOIN "Artists" a on a."Id" = r."ArtistId" and a."UserId" = r."UserId"
     WHERE
         r."UserId" = $1 AND
         (r."SearchVector_EN" @@ query OR
          a."SearchVector_EN" @@ query)

    ORDER BY r."Name"
) r
$$ LANGUAGE SQL;
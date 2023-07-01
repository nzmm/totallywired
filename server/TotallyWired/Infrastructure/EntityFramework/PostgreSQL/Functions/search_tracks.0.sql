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
     SELECT t.*,
            ts_rank(t."SearchVector_EN", query) AS track_rank,
            ts_rank(r."SearchVector_EN", query) AS release_rank,
            ts_rank(a."SearchVector_EN", query) AS artist_rank
     FROM "Tracks" AS t
              CROSS JOIN to_tsquery('simple', $2) AS query
              INNER JOIN "Releases" r on r."Id" = t."ReleaseId" and r."UserId" = t."UserId"
              INNER JOIN "Artists" a on a."Id" = t."ArtistId" and a."UserId" = r."UserId"
     WHERE
         t."UserId" = $1 AND
             (t."SearchVector_EN" @@ query OR
              r."SearchVector_EN" @@ query OR
              a."SearchVector_EN" @@ query)

     ORDER BY track_rank DESC, release_rank DESC, artist_rank DESC
 ) t
$$ LANGUAGE SQL;
# Migrations
---

```
dotnet ef migrations add "$1" --output-dir ../TotallyWired/Infrastructure/EntityFramework/Migrations
```
```
dotnet ef database update
```

# Other

```sql
TRUNCATE "TrackReactions", "Tracks", "Releases", "Artists";
UPDATE "Sources" SET "Delta" = '';
```
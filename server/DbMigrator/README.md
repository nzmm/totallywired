# Migrations
---

Ensure you have the dotnet-ef tools install.

```dotnet tool install --global dotnet-ef```

For more info on the dotnet-ef cli tools, visit: https://learn.microsoft.com/en-gb/ef/core/cli/dotnet 

### Adding new migrations

1. Change into `DbMigrator` project directory
2. Update the `DbMigrator/appsettings.json` with a valid connection string to the postgres database
3. Run the following command (updating the migration name):
```
dotnet ef migrations add <MigrationNameHere> --project ../TotallyWired --output-dir ../TotallyWired/Infrastructure/EntityFramework/Migrations
```

### Reverting a migration

1. Change into `DbMigrator` project directory
2. Update the `DbMigrator/appsettings.json` with a valid connection string to the postgres database
3. If required, revert the database migrations using `dotnet ef database update <The MigrationId prior to the one I want to remove>`
4. Revert the migration using the following command:
```
dotnet ef migrations remove --project ../TotallyWired
```

### Applying migrations to a database

New migrations should apply on an application restart. 

However, if you need to apply migrations manually using the cli, the following steps apply.

1. Change into `DbMigrator` project directory
2. Update the `DbMigrator/appsettings.json` with a valid connection string to the postgres database
3. Run the following command:
```
dotnet ef database update
```

# Other

To blow away all library data when testing, the following SQL can be used:

```sql
TRUNCATE "TrackReactions", "Tracks", "Releases", "Artists";
UPDATE "Sources" SET "Delta" = '';
```

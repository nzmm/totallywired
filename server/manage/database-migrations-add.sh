cd ../TotallyWired.Infrastructure || exit
dotnet ef migrations add "$1" --output-dir ../TotallyWired.Infrastructure/EntityFramework/Migrations

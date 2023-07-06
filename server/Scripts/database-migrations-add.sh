cd ../TotallyWired || exit
dotnet ef migrations add "$1" --output-dir ../TotallyWired/Infrastructure/EntityFramework/Migrations

FROM mcr.microsoft.com/dotnet/sdk:7.0 AS build-server
WORKDIR /app
COPY ./server/TotallyWired ./TotallyWired
COPY ./server/TotallyWired.WebApi ./TotallyWired.WebApi
RUN dotnet publish ./TotallyWired.WebApi/TotallyWired.WebApi.csproj -c Release -o out
RUN dotnet dev-certs https -ep /https/aspnetapp.pfx -p password

FROM node:18-alpine3.17 as build-client
WORKDIR /app
COPY ./client/packages ./packages
COPY ./client/*.json ./
RUN npm ci
RUN npm run build
RUN ls -l ./packages/totallywired/dist

# Build runtime image
FROM mcr.microsoft.com/dotnet/aspnet:7.0 as final
WORKDIR /app
EXPOSE 80
EXPOSE 443
COPY --from=build-server /app/out .
COPY --from=build-server /https/* /https/
COPY --from=build-client /app/packages/totallywired/dist ./wwwroot
ENV ASPNETCORE_Kestrel__Certificates__Default__Password=password
ENV ASPNETCORE_Kestrel__Certificates__Default__Path=/https/aspnetapp.pfx
ENTRYPOINT ["dotnet", "TotallyWired.WebApi.dll"]

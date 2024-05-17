FROM mcr.microsoft.com/dotnet/sdk:7.0 AS build

WORKDIR /src
COPY ["src/Event_Planning_System.Web.Host/Event_Planning_System.Web.Host.csproj", "src/Event_Planning_System.Web.Host/"]
COPY ["src/Event_Planning_System.Web.Core/Event_Planning_System.Web.Core.csproj", "src/Event_Planning_System.Web.Core/"]
COPY ["src/Event_Planning_System.Application/Event_Planning_System.Application.csproj", "src/Event_Planning_System.Application/"]
COPY ["src/Event_Planning_System.Core/Event_Planning_System.Core.csproj", "src/Event_Planning_System.Core/"]
COPY ["src/Event_Planning_System.EntityFrameworkCore/Event_Planning_System.EntityFrameworkCore.csproj", "src/Event_Planning_System.EntityFrameworkCore/"]
WORKDIR "/src/src/Event_Planning_System.Web.Host"
RUN dotnet restore 

WORKDIR /src
COPY ["src/Event_Planning_System.Web.Host", "src/Event_Planning_System.Web.Host"]
COPY ["src/Event_Planning_System.Web.Core", "src/Event_Planning_System.Web.Core"]
COPY ["src/Event_Planning_System.Application", "src/Event_Planning_System.Application"]
COPY ["src/Event_Planning_System.Core", "src/Event_Planning_System.Core"]
COPY ["src/Event_Planning_System.EntityFrameworkCore", "src/Event_Planning_System.EntityFrameworkCore"]
WORKDIR "/src/src/Event_Planning_System.Web.Host"
RUN dotnet publish -c Release -o /publish --no-restore

FROM mcr.microsoft.com/dotnet/aspnet:7.0
EXPOSE 80
WORKDIR /app
COPY --from=build /publish .
ENTRYPOINT ["dotnet", "Event_Planning_System.Web.Host.dll"]

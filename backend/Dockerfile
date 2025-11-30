# Use the official .NET 8 runtime as the base image
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
WORKDIR /app
EXPOSE 3000

# Use the official .NET 8 SDK for building
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

# Copy Directory.Build.props first (needed for build)
COPY ["Directory.Build.props", "./"]

# Copy project files in dependency order
COPY ["HospitalSystem.Domain/HospitalSystem.Domain.csproj", "HospitalSystem.Domain/"]
COPY ["HospitalSystem.Infrastructure/HospitalSystem.Infrastructure.csproj", "HospitalSystem.Infrastructure/"]
COPY ["HospitalSystem.Application/HospitalSystem.Application.csproj", "HospitalSystem.Application/"]
COPY ["HospitalSystem.Api/HospitalSystem.Api.csproj", "HospitalSystem.Api/"]

# Restore dependencies for the solution
# This will restore all projects and their dependencies
RUN dotnet restore "HospitalSystem.Api/HospitalSystem.Api.csproj"

# Copy all source code
COPY . .

# Build the application
WORKDIR "/src/HospitalSystem.Api"
RUN dotnet build "HospitalSystem.Api.csproj" -c Release -o /app/build --no-restore

# Publish the application
FROM build AS publish
WORKDIR "/src/HospitalSystem.Api"
RUN dotnet publish "HospitalSystem.Api.csproj" -c Release -o /app/publish /p:UseAppHost=false --no-restore

# Final stage
FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .

# Create logs and data protection keys directories
RUN mkdir -p /app/logs && \
    mkdir -p /app/data/keys

# Set environment variables
ENV ASPNETCORE_ENVIRONMENT=Production
ENV PORT=3000
ENV ASPNETCORE_URLS=http://0.0.0.0:3000
ENV DATA_PROTECTION_KEYS_PATH=/app/data/keys

ENTRYPOINT ["dotnet", "HospitalSystem.Api.dll"]

# Use the official .NET 8 runtime as the base image
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
WORKDIR /app
EXPOSE 80
EXPOSE 443

# Use the official .NET 8 SDK for building
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

# Copy project files
COPY ["HospitalSystem.Api/HospitalSystem.Api.csproj", "HospitalSystem.Api/"]
COPY ["HospitalSystem.Application/HospitalSystem.Application.csproj", "HospitalSystem.Application/"]
COPY ["HospitalSystem.Domain/HospitalSystem.Domain.csproj", "HospitalSystem.Domain/"]
COPY ["HospitalSystem.Infrastructure/HospitalSystem.Infrastructure.csproj", "HospitalSystem.Infrastructure/"]

# Restore dependencies
RUN dotnet restore "HospitalSystem.Api/HospitalSystem.Api.csproj"

# Copy all source code
COPY . .

# Build the application
WORKDIR "/src/HospitalSystem.Api"
RUN dotnet build "HospitalSystem.Api.csproj" -c Release -o /app/build

# Publish the application
FROM build AS publish
RUN dotnet publish "HospitalSystem.Api.csproj" -c Release -o /app/publish /p:UseAppHost=false

# Final stage
FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .

# Create logs directory
RUN mkdir -p /app/logs

# Set environment variables
ENV ASPNETCORE_ENVIRONMENT=Production
ENV ASPNETCORE_URLS=http://+:80

ENTRYPOINT ["dotnet", "HospitalSystem.Api.dll"]

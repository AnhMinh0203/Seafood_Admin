using System;
using System.IO;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;
using Microsoft.Extensions.Configuration;

namespace SeaFood.EntityFrameworkCore;

/* This class is needed for EF Core console commands
 * (like Add-Migration and Update-Database commands) */
public class SeaFoodDbContextFactory : IDesignTimeDbContextFactory<SeaFoodDbContext>
{
    public SeaFoodDbContext CreateDbContext(string[] args)
    {
        var configuration = BuildConfiguration();
        
        SeaFoodEfCoreEntityExtensionMappings.Configure();

        var builder = new DbContextOptionsBuilder<SeaFoodDbContext>()
            .UseSqlServer(configuration.GetConnectionString("Default"));
        
        return new SeaFoodDbContext(builder.Options);
    }

    private static IConfigurationRoot BuildConfiguration()
    {
        var builder = new ConfigurationBuilder()
            .SetBasePath(Path.Combine(Directory.GetCurrentDirectory(), "../SeaFood.DbMigrator/"))
            .AddJsonFile("appsettings.json", optional: false);

        return builder.Build();
    }
}

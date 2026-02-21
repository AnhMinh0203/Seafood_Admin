using System;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using SeaFood.Data;
using Volo.Abp.DependencyInjection;

namespace SeaFood.EntityFrameworkCore;

public class EntityFrameworkCoreSeaFoodDbSchemaMigrator
    : ISeaFoodDbSchemaMigrator, ITransientDependency
{
    private readonly IServiceProvider _serviceProvider;

    public EntityFrameworkCoreSeaFoodDbSchemaMigrator(IServiceProvider serviceProvider)
    {
        _serviceProvider = serviceProvider;
    }

    public async Task MigrateAsync()
    {
        /* We intentionally resolving the SeaFoodDbContext
         * from IServiceProvider (instead of directly injecting it)
         * to properly get the connection string of the current tenant in the
         * current scope.
         */

        await _serviceProvider
            .GetRequiredService<SeaFoodDbContext>()
            .Database
            .MigrateAsync();
    }
}

using System.Threading.Tasks;
using Volo.Abp.DependencyInjection;

namespace SeaFood.Data;

/* This is used if database provider does't define
 * ISeaFoodDbSchemaMigrator implementation.
 */
public class NullSeaFoodDbSchemaMigrator : ISeaFoodDbSchemaMigrator, ITransientDependency
{
    public Task MigrateAsync()
    {
        return Task.CompletedTask;
    }
}

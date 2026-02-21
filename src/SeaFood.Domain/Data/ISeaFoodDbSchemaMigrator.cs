using System.Threading.Tasks;

namespace SeaFood.Data;

public interface ISeaFoodDbSchemaMigrator
{
    Task MigrateAsync();
}

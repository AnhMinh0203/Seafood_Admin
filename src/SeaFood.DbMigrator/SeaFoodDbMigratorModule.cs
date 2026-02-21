using SeaFood.EntityFrameworkCore;
using Volo.Abp.Autofac;
using Volo.Abp.Modularity;

namespace SeaFood.DbMigrator;

[DependsOn(
    typeof(AbpAutofacModule),
    typeof(SeaFoodEntityFrameworkCoreModule),
    typeof(SeaFoodApplicationContractsModule)
)]
public class SeaFoodDbMigratorModule : AbpModule
{
}

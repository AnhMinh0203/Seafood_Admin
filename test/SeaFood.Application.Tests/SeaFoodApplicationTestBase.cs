using Volo.Abp.Modularity;

namespace SeaFood;

public abstract class SeaFoodApplicationTestBase<TStartupModule> : SeaFoodTestBase<TStartupModule>
    where TStartupModule : IAbpModule
{

}

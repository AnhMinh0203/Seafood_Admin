using Volo.Abp.Modularity;

namespace SeaFood;

/* Inherit from this class for your domain layer tests. */
public abstract class SeaFoodDomainTestBase<TStartupModule> : SeaFoodTestBase<TStartupModule>
    where TStartupModule : IAbpModule
{

}

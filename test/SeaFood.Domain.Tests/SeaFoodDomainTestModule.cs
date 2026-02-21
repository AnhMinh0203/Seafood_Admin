using Volo.Abp.Modularity;

namespace SeaFood;

[DependsOn(
    typeof(SeaFoodDomainModule),
    typeof(SeaFoodTestBaseModule)
)]
public class SeaFoodDomainTestModule : AbpModule
{

}

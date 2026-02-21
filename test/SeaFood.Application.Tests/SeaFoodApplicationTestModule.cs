using Volo.Abp.Modularity;

namespace SeaFood;

[DependsOn(
    typeof(SeaFoodApplicationModule),
    typeof(SeaFoodDomainTestModule)
)]
public class SeaFoodApplicationTestModule : AbpModule
{

}

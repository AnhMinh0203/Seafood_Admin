using SeaFood.Samples;
using Xunit;

namespace SeaFood.EntityFrameworkCore.Applications;

[Collection(SeaFoodTestConsts.CollectionDefinitionName)]
public class EfCoreSampleAppServiceTests : SampleAppServiceTests<SeaFoodEntityFrameworkCoreTestModule>
{

}

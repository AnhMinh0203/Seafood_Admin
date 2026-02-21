using SeaFood.Samples;
using Xunit;

namespace SeaFood.EntityFrameworkCore.Domains;

[Collection(SeaFoodTestConsts.CollectionDefinitionName)]
public class EfCoreSampleDomainTests : SampleDomainTests<SeaFoodEntityFrameworkCoreTestModule>
{

}

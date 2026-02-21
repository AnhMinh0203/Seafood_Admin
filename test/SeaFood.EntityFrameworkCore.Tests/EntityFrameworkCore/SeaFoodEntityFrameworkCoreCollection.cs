using Xunit;

namespace SeaFood.EntityFrameworkCore;

[CollectionDefinition(SeaFoodTestConsts.CollectionDefinitionName)]
public class SeaFoodEntityFrameworkCoreCollection : ICollectionFixture<SeaFoodEntityFrameworkCoreFixture>
{

}

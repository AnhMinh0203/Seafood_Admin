using Volo.Abp.Settings;

namespace SeaFood.Settings;

public class SeaFoodSettingDefinitionProvider : SettingDefinitionProvider
{
    public override void Define(ISettingDefinitionContext context)
    {
        //Define your own settings here. Example:
        //context.Add(new SettingDefinition(SeaFoodSettings.MySetting1));
    }
}

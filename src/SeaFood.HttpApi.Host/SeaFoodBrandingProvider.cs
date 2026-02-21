using Microsoft.Extensions.Localization;
using SeaFood.Localization;
using Volo.Abp.DependencyInjection;
using Volo.Abp.Ui.Branding;

namespace SeaFood;

[Dependency(ReplaceServices = true)]
public class SeaFoodBrandingProvider : DefaultBrandingProvider
{
    private IStringLocalizer<SeaFoodResource> _localizer;

    public SeaFoodBrandingProvider(IStringLocalizer<SeaFoodResource> localizer)
    {
        _localizer = localizer;
    }

    public override string AppName => _localizer["AppName"];
}

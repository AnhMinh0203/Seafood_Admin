using SeaFood.Localization;
using Volo.Abp.Application.Services;

namespace SeaFood;

/* Inherit your application services from this class.
 */
public abstract class SeaFoodAppService : ApplicationService
{
    protected SeaFoodAppService()
    {
        LocalizationResource = typeof(SeaFoodResource);
    }
}

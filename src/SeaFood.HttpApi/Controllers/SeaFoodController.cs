using SeaFood.Localization;
using Volo.Abp.AspNetCore.Mvc;

namespace SeaFood.Controllers;

/* Inherit your controllers from this class.
 */
public abstract class SeaFoodController : AbpControllerBase
{
    protected SeaFoodController()
    {
        LocalizationResource = typeof(SeaFoodResource);
    }
}

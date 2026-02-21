using SeaFood.Localization;
using Volo.Abp.Authorization.Permissions;
using Volo.Abp.Localization;
using Volo.Abp.MultiTenancy;

namespace SeaFood.Permissions;

public class SeaFoodPermissionDefinitionProvider : PermissionDefinitionProvider
{
    public override void Define(IPermissionDefinitionContext context)
    {
        var myGroup = context.AddGroup(SeaFoodPermissions.GroupName);

        //Define your own permissions here. Example:
        //myGroup.AddPermission(SeaFoodPermissions.MyPermission1, L("Permission:MyPermission1"));
    }

    private static LocalizableString L(string name)
    {
        return LocalizableString.Create<SeaFoodResource>(name);
    }
}

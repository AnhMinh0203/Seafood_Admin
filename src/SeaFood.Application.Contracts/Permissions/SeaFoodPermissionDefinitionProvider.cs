using SeaFood.Localization;
using Volo.Abp.Authorization.Permissions;
using Volo.Abp.Localization;
using Volo.Abp.MultiTenancy;

namespace SeaFood.Permissions;

public class SeaFoodPermissionDefinitionProvider : PermissionDefinitionProvider
{
    public override void Define(IPermissionDefinitionContext context)
    {
        var group = context.AddGroup(SeaFoodPermissions.GroupName);

        AddModulePermission(
            group,
            SeaFoodPermissions.ContactRequests.Default,
            "ContactRequests",
            (SeaFoodPermissions.ContactRequests.Create, "Create"),
            (SeaFoodPermissions.ContactRequests.Delete, "Delete"),
            (SeaFoodPermissions.ContactRequests.BatchDelete, "BatchDelete"),
            (SeaFoodPermissions.ContactRequests.UpdateStatus, "UpdateStatus"),
            (SeaFoodPermissions.ContactRequests.BatchApprove, "BatchApprove")
        );

        AddModulePermission(
            group,
            SeaFoodPermissions.Categories.Default,
            "Categories",
            (SeaFoodPermissions.Categories.Create, "Create"),
            (SeaFoodPermissions.Categories.Delete, "Delete"),
            (SeaFoodPermissions.Categories.BatchDelete, "BatchDelete"),
            (SeaFoodPermissions.Categories.UpdateStatus, "UpdateStatus"),
            (SeaFoodPermissions.Categories.BatchApprove, "BatchApprove")
        );
    }

    private static void AddModulePermission(
        PermissionGroupDefinition group,
        string parentPermission,
        string localizationKeyPrefix,
        params (string PermissionName, string ActionName)[] children)
    {
        var parent = group.AddPermission(
            parentPermission,
            L($"Permission:{localizationKeyPrefix}")
        );

        foreach (var (permissionName, actionName) in children)
        {
            parent.AddChild(
                permissionName,
                L($"Permission:{localizationKeyPrefix}.{actionName}")
            );
        }
    }

    private static LocalizableString L(string name)
    {
        return LocalizableString.Create<SeaFoodResource>(name);
    }
}

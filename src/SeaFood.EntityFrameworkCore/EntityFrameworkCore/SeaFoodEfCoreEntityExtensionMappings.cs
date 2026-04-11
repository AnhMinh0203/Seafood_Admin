using Microsoft.EntityFrameworkCore;
using SeaFood.Entities.Users;
using System;
using Volo.Abp.Identity;
using Volo.Abp.ObjectExtending;
using Volo.Abp.Threading;

namespace SeaFood.EntityFrameworkCore;

public static class SeaFoodEfCoreEntityExtensionMappings
{
    private static readonly OneTimeRunner OneTimeRunner = new OneTimeRunner();

    public static void Configure()
    {
        SeaFoodGlobalFeatureConfigurator.Configure();
        SeaFoodModuleExtensionConfigurator.Configure();

        OneTimeRunner.Run(() =>
        {
            ObjectExtensionManager.Instance
            .MapEfCoreProperty<IdentityUser, DateTime?>(
                "Dob",
                (entityBuilder, propertyBuilder) =>
                {
                    propertyBuilder.HasColumnName("Dob");
                }
            );

            // Avatar
            ObjectExtensionManager.Instance
                .MapEfCoreProperty<IdentityUser, string>(
                    "Avatar",
                    (entityBuilder, propertyBuilder) =>
                    {
                        propertyBuilder.HasMaxLength(256);
                        propertyBuilder.HasColumnName("Avatar");
                    }
                );

            // UserType (enum lưu dạng int)
            ObjectExtensionManager.Instance
                .MapEfCoreProperty<IdentityUser, int>(
                    "UserType",
                    (entityBuilder, propertyBuilder) =>
                    {
                        propertyBuilder.HasDefaultValue((int)UserType.Normal);
                        propertyBuilder.HasColumnName("UserType");
                    }
                );

            ObjectExtensionManager.Instance
                .MapEfCoreProperty<IdentityUser, string>(
                    "Address",
                    (entityBuilder, propertyBuilder) =>
                    {
                        propertyBuilder.HasMaxLength(500);
                        propertyBuilder.HasColumnName("Address");
                        propertyBuilder.HasDefaultValue(string.Empty);
                    }
                );
        });
    }
}

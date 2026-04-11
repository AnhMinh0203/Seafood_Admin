using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.DependencyInjection.Extensions;
using SeaFood.Localization;
using SeaFood.MultiTenancy;
using Volo.Abp.AuditLogging;
using Volo.Abp.BackgroundJobs;
using Volo.Abp.BlobStoring.Database;
using Volo.Abp.Caching;
using Volo.Abp.Emailing;
using Volo.Abp.FeatureManagement;
using Volo.Abp.Identity;
using Volo.Abp.Localization;
using Volo.Abp.Modularity;
using Volo.Abp.MultiTenancy;
using Volo.Abp.OpenIddict;
using Volo.Abp.PermissionManagement.Identity;
using Volo.Abp.PermissionManagement.OpenIddict;
using Volo.Abp.SettingManagement;

namespace SeaFood;

[DependsOn(
    typeof(SeaFoodDomainSharedModule),
    typeof(AbpAuditLoggingDomainModule),
    typeof(AbpCachingModule),
    typeof(AbpBackgroundJobsDomainModule),
    typeof(AbpFeatureManagementDomainModule),
    typeof(AbpPermissionManagementDomainIdentityModule),
    typeof(AbpPermissionManagementDomainOpenIddictModule),
    typeof(AbpSettingManagementDomainModule),
    typeof(AbpEmailingModule),
    typeof(AbpIdentityDomainModule),
    typeof(AbpOpenIddictDomainModule),
    typeof(BlobStoringDatabaseDomainModule)
    )]
public class SeaFoodDomainModule : AbpModule
{
    public override void ConfigureServices(ServiceConfigurationContext context)
    {
        Configure<AbpMultiTenancyOptions>(options =>
        {
            options.IsEnabled = MultiTenancyConsts.IsEnabled;
        });

        Configure<IdentityOptions>(options =>
        {
            options.Password.RequireDigit = false; // M?t kh?u kh?ng b?t bu?c c車 ch? s?
            options.Password.RequireLowercase = false; // M?t kh?u kh?ng b?t bu?c c車 ch? th??ng
            options.Password.RequireUppercase = false; // M?t kh?u kh?ng b?t bu?c c車 ch? in hoa
            options.Password.RequireNonAlphanumeric = false; // M?t kh?u kh?ng b?t bu?c c車 k? t? ??c bi?t
            options.Password.RequiredLength = 4; // M?t kh?u ph?i c車 t?i thi?u 4 k? t?
            options.Password.RequiredUniqueChars = 1; // M?t kh?u ph?i c車 t?i thi?u 1 k? t? kh芍c bi?t
            options.User.RequireUniqueEmail = false; // Email kh?ng b?t bu?c l角 duy nh?t
            options.Lockout.AllowedForNewUsers = false; // User m?i kh?ng 芍p d?ng c? ch? kh車a t?m th?i
        });


#if DEBUG
        context.Services.Replace(ServiceDescriptor.Singleton<IEmailSender, NullEmailSender>());
#endif
    }
}

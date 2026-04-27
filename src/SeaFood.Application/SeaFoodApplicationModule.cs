using Amazon;
using Amazon.Runtime;
using Amazon.S3;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using SeaFood.Storage;
using SeaFood.VnPay;
using System;
using Volo.Abp.Account;
using Volo.Abp.AutoMapper;
using Volo.Abp.FeatureManagement;
using Volo.Abp.Identity;
using Volo.Abp.Modularity;
using Volo.Abp.PermissionManagement;
using Volo.Abp.SettingManagement;

namespace SeaFood;

[DependsOn(
    typeof(SeaFoodDomainModule),
    typeof(SeaFoodApplicationContractsModule),
    typeof(AbpPermissionManagementApplicationModule),
    typeof(AbpFeatureManagementApplicationModule),
    typeof(AbpIdentityApplicationModule),
    typeof(AbpAccountApplicationModule),
    typeof(AbpSettingManagementApplicationModule)
    )]
public class SeaFoodApplicationModule : AbpModule
{
    public override void ConfigureServices(ServiceConfigurationContext context)
    {
        /* AWS config */
        context.Services.AddSingleton<IAmazonS3>(sp =>
        {
            var configuration = sp.GetRequiredService<IConfiguration>();

            var accessKey = configuration["AWS:AccessKey"];
            var secretKey = configuration["AWS:SecretKey"];
            var regionName = configuration["AWS:Region"];

            var creds = new BasicAWSCredentials(accessKey, secretKey);
            var region = RegionEndpoint.GetBySystemName(regionName);

            return new AmazonS3Client(creds, region);
        });
        context.Services.AddScoped<IFileStorageService, FileStorageService>();

        context.Services.AddScoped<IVnPayAppService, VnPayAppService>();
        Configure<AbpAutoMapperOptions>(options =>
        {
            options.AddMaps<SeaFoodApplicationModule>();
        });
    }
}

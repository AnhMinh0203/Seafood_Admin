using Amazon.S3;
using Amazon.S3.Model;
using AutoMapper;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Polly;
using SeaFood.Entities;
using SeaFood.EntityFrameworkCore;
using SeaFood.Products.Dtos;
using SeaFood.Utils;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Linq.Dynamic.Core;
using System.Text;
using System.Threading.Tasks;
using Volo.Abp;
using Volo.Abp.Application.Dtos;
using Volo.Abp.Application.Services;
using Volo.Abp.Content;
using Volo.Abp.Domain.Repositories;
using Volo.Abp.ObjectMapping;
namespace SeaFood.Products
{
    public class ProductAppService : ApplicationService, IProductAppService
    {
        private readonly string? _bucketName;
        private readonly string? _cloudFrontDomain;
        private readonly string? _s3Domain;
        private readonly IAmazonS3 _s3Client;
        private readonly string? _containerCoverImg;
        private readonly IRepository<Product, Guid> _productRepo;
        public readonly IConfiguration _config;
        private readonly IMapper _mapper;

        public ProductAppService(
            SeaFoodDbContext context,
            IConfiguration config,
            IAmazonS3 s3Client,
            IMapper mapper,
            IRepository<Product, Guid> productRepo
            )
        {
            _config = config;     
            _s3Client = s3Client;
            _bucketName = _config["BucketName"];
            _containerCoverImg = _config["ContainerCoverImg"];
            _cloudFrontDomain = _config["AWS:CloudFrontDomain"];
            _s3Domain = _config["AWS:S3Domain"];
            _mapper = mapper;
            _productRepo = productRepo;
        }

        public async Task<PagedResultDto<ProductDto>> GetListWithUnitsAsync(PagedAndSortedResultRequestDto input)
        {
            var query = await _productRepo.WithDetailsAsync(p => p.Units, p => p.Images);
            var totalCount = await AsyncExecuter.CountAsync(query);
            if (!input.Sorting.IsNullOrWhiteSpace())
            {
                query = query.OrderBy(input.Sorting);
            }
            else
            {
                query = query.OrderByDescending(p => p.Id);
            }

            var entities = await AsyncExecuter.ToListAsync(query.Skip(input.SkipCount).Take(input.MaxResultCount));
            var items = ObjectMapper.Map<List<Product>,List<ProductDto>>(entities); 
            return new PagedResultDto<ProductDto>(totalCount, items);
        }

        public async Task<ProductDto> GetDetailAsync(Guid id)
        {
            var query = await _productRepo.WithDetailsAsync(
                p => p.Units,
                p => p.Images
            );
            var product = await AsyncExecuter.FirstOrDefaultAsync(
                query.Where(p => p.Id == id)
            );

            if (product == null)
            {
                throw new UserFriendlyException("Sản phẩm không tồn tại");
            }

            return ObjectMapper.Map<Product, ProductDto>(product);

        }

        public async Task DeleteAsync(Guid id)
        {
            var query = await _productRepo.WithDetailsAsync(
                p => p.Units,
                p => p.Images
            );

            var product = await AsyncExecuter.FirstOrDefaultAsync(
                query.Where(p => p.Id == id)
            );
            if (product == null)
            {
                throw new UserFriendlyException("Sản phẩm không tồn tại");
            }
            // Xóa hình ảnh trên S3
            await DeleteFileFromS3(product.CoverImage);
            foreach (var img in product.Images)
            {
                await DeleteFileFromS3(img.ImageUrl);
            }
            await _productRepo.DeleteAsync(product);

        }

        public async Task<BaseResponse<ProductDto>> CreateProductAsync(CreateProductDto input, List<IRemoteStreamContent> childImages)
        {
           
            var product = new Product
            {
                Name = input.Name,
                Slug = input.Slug ?? "",
                Origin = input.Origin ?? "",
                Description = input.Description ?? "",
                CategoryId = input.CategoryId,
                Units = new List<ProductUnit>(),
                Images = new List<ProductImage>()
            };

            // Units
            if (input.Units != null && input.Units.Any())
            {
                foreach (var unit in input.Units)
                {
                    product.Units.Add(new ProductUnit
                    {
                        UnitName = unit.UnitName,
                        Price = unit.Price,
                        StockQuantity = unit.StockQuantity,
                        IsDefault = unit.IsDefault
                    });
                }
            }

            await _productRepo.InsertAsync(product, autoSave: true);
            var prefix = $"products/{product.Id}";
            try
            {
                // Upload Cover
                if (input.CoverImage != null)
                {
                    var extension = Path.GetExtension(input.CoverImage.FileName);
                    var fileName = $"cover-{Guid.NewGuid()}{extension}";

                    var coverUrl = await UploadFileToS3(
                        input.CoverImage,
                        prefix,
                        fileName
                    );
                    product.CoverImage = coverUrl;
                }

                // Upload Child Images
                if (childImages != null && childImages.Any())
                {
                    for (int i = 0; i < childImages.Count; i++)
                    {
                        var item = childImages[i];

                        var extension = Path.GetExtension(item.FileName);
                        var fileName = $"child-{Guid.NewGuid()}{extension}";

                        var url = await UploadFileToS3(
                            item,
                            prefix,
                            fileName
                        );

                        product.Images.Add(new ProductImage
                        {
                            ImageUrl = url,
                            DisplayOrder = i  
                        });
                    }
                }
                await _productRepo.UpdateAsync(product, autoSave: true);
                var productDto = ObjectMapper.Map<Product, ProductDto>(product);

                return BaseResponse<ProductDto>.Success("Tạo sản phẩm thành công", productDto);
            }
            catch
            {
                await _productRepo.DeleteAsync(product.Id);
                throw;
            }

        }

        public async Task<BaseResponse<ProductDto>> UpdateProductAsync(
            Guid id,
            UpdateProductDto input,
            List<IRemoteStreamContent>? childImages)
        {
            var product = await _productRepo
                .WithDetailsAsync(p => p.Units, p => p.Images);

            var entity = await AsyncExecuter
                .FirstOrDefaultAsync(product.Where(p => p.Id == id));

            if (entity == null)
                throw new UserFriendlyException("Product not found");

            entity.Name = input.Name;
            entity.Slug = input.Slug ?? "";
            entity.Origin = input.Origin ?? "";
            entity.Description = input.Description ?? "";
            entity.CategoryId = input.CategoryId;
            entity.Units.Clear();

            if (input.Units != null && input.Units.Any())
            {
                foreach (var unit in input.Units)
                {
                    entity.Units.Add(new ProductUnit
                    {
                        UnitName = unit.UnitName,
                        Price = unit.Price,
                        StockQuantity = unit.StockQuantity,
                        IsDefault = unit.IsDefault
                    });
                }
            }

            var prefix = $"products/{entity.Id}";

            try
            {
                if (input.CoverImage != null)
                {
                    var extension = Path.GetExtension(input.CoverImage.FileName);
                    var fileName = $"cover-{Guid.NewGuid()}{extension}";

                    var coverUrl = await UploadFileToS3(
                        input.CoverImage,
                        prefix,
                        fileName
                    );

                    entity.CoverImage = coverUrl;
                }

                if (childImages != null && childImages.Any())
                {
                    var startOrder = entity.Images.Count;

                    for (int i = 0; i < childImages.Count; i++)
                    {
                        var item = childImages[i];

                        var extension = Path.GetExtension(item.FileName);
                        var fileName = $"child-{Guid.NewGuid()}{extension}";

                        var url = await UploadFileToS3(
                            item,
                            prefix,
                            fileName
                        );

                        entity.Images.Add(new ProductImage
                        {
                            ImageUrl = url,
                            DisplayOrder = startOrder + i
                        });
                    }
                }

                await _productRepo.UpdateAsync(entity, autoSave: true);
                var productDto = ObjectMapper.Map<Product, ProductDto>(entity);

                return BaseResponse<ProductDto>.Success(
                    "Cập nhật sản phẩm thành công",
                    productDto
                );
            }
            catch
            {
                throw;
            }
        }

        public async Task<BaseResponse<bool>> DeleteProductAsync(Guid id)
        {
            var product = await _productRepo
                .WithDetailsAsync(p => p.Units, p => p.Images);

            var entity = await AsyncExecuter
                .FirstOrDefaultAsync(product.Where(p => p.Id == id));

            if (entity == null)
                throw new UserFriendlyException("Product not found");
            await _productRepo.DeleteAsync(entity, autoSave: true);
            return BaseResponse<bool>.Success("Xóa sản phẩm thành công", true);
        }

        public async Task<BaseResponse<bool>> BatchDeleteProductsAsync(List<Guid> ids)
        {
            if (ids == null || !ids.Any())
                throw new UserFriendlyException("Danh sách sản phẩm cần xóa không hợp lệ");

            var query = await _productRepo
                .WithDetailsAsync(p => p.Units, p => p.Images);
            var products = query.Where(p => ids.Contains(p.Id));
            var entities = await AsyncExecuter.ToListAsync(products);

            if (!entities.Any())
                throw new UserFriendlyException("Không tìm thấy sản phẩm nào");

            await _productRepo.DeleteManyAsync(entities, autoSave: true);

            return BaseResponse<bool>.Success(
                $"Đã xóa {entities.Count} sản phẩm thành công",
                true
            );
        }

        public async Task<string> UploadFileToS3(IRemoteStreamContent file, string prefix, string fileName)
        {
            try
            {
                var key = $"{prefix}/{fileName}";
                using var stream = file.GetStream();
                var request = new PutObjectRequest
                {
                    BucketName = _bucketName,
                    Key = key,
                    InputStream = stream,
                    ContentType = file.ContentType,
                    Headers = { CacheControl = "no-store, no-cache, must-revalidate" }
                };

                var response = await _s3Client.PutObjectAsync(request);
                if (response.HttpStatusCode == System.Net.HttpStatusCode.OK)
                {
                    return $"{_s3Domain}/{key}";
                }

                throw new Exception("Upload file lên S3 thất bại");
            }
            catch (AmazonS3Exception ex)
            {
                throw new Exception($"Lỗi upload file lên S3: {ex.Message}");
            }
        }

        public async Task DeleteFileFromS3(string fileUrl)
        {
            try
            {
                if (string.IsNullOrEmpty(fileUrl))
                    return;
                var uri = new Uri(fileUrl);
                var key = uri.AbsolutePath.Substring(1);

                var request = new DeleteObjectRequest
                {
                    BucketName = _bucketName,
                    Key = key
                };

                await _s3Client.DeleteObjectAsync(request);
            }
            catch (AmazonS3Exception ex)
            {
                throw new Exception($"Lỗi xóa file trên S3: {ex.Message}");
            }
        }

    }

}

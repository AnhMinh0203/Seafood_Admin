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
using SeaFood.Storage;
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
using Volo.Abp.Domain.Entities;
using Volo.Abp.Domain.Repositories;
using Volo.Abp.ObjectMapping;
namespace SeaFood.Products
{
    public class ProductAppService : ApplicationService, IProductAppService
    {
        private readonly string? _bucketName;
        private readonly string? _cloudFrontDomain;
        private readonly string? _s3Domain;
        //private readonly IAmazonS3 _s3Client;
        private readonly string? _containerCoverImg;
        private readonly IRepository<Product, Guid> _productRepo;
        public readonly IConfiguration _config;
        //private readonly IMapper _mapper;
        private readonly IFileStorageService _fileService;

        public ProductAppService(
            SeaFoodDbContext context,
            IConfiguration config,
            IMapper mapper,
            IRepository<Product, Guid> productRepo,
            IFileStorageService fileService
            )
        {
            _config = config;
            _bucketName = _config["BucketName"];
            _containerCoverImg = _config["ContainerCoverImg"];
            _cloudFrontDomain = _config["AWS:CloudFrontDomain"];
            _s3Domain = _config["AWS:S3Domain"];
            _productRepo = productRepo;
            _fileService = fileService;
        }

        public async Task<PagedResultDto<ProductCardDto>> GetPagedCardsAsync(PagedAndSortedResultRequestDto input)
        {
            var queryable = await _productRepo.GetQueryableAsync();

            var query = queryable.AsQueryable();

            var totalCount = await AsyncExecuter.CountAsync(query);

            if (!input.Sorting.IsNullOrWhiteSpace())
            {
                query = query.OrderBy(input.Sorting);
            }
            else
            {
                query = query.OrderByDescending(p => p.CreationTime);
            }

            var items = await AsyncExecuter.ToListAsync(
                query
                    .Skip(input.SkipCount)
                    .Take(input.MaxResultCount)
                    .Select(p => new ProductCardDto
                    {
                        Id = p.Id,
                        Name = p.Name,
                        Origin = p.Origin,
                        CoverImage = p.CoverImage,
                        Slug = p.Slug,
                        DefaultUnitName = p.Units
                            .Where(u => u.IsDefault)
                            .Select(u => u.UnitName)
                            .FirstOrDefault(),
                        DefaultPrice = p.Units
                            .Where(u => u.IsDefault)
                            .Select(u => (decimal?)u.Price)
                            .FirstOrDefault()
                    })
            );

            return new PagedResultDto<ProductCardDto>(totalCount, items);
        }

        public async Task<ProductDto> GetDetailBySlugAsync(string slug)
        {
            var query = await _productRepo.WithDetailsAsync(p => p.Units, p => p.Images, p => p.Category);

            var entity = await AsyncExecuter.FirstOrDefaultAsync(
                query.Where(p => p.Slug == slug)
            );

            var dto = ObjectMapper.Map<Product, ProductDto>(entity);
            dto.CategoryName = entity.Category?.Name;

            return dto;
        }

        // Admin stage
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
            var items = ObjectMapper.Map<List<Product>, List<ProductDto>>(entities);
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
            await _fileService.DeleteFileFromS3(product.CoverImage);
            foreach (var img in product.Images)
            {
                await _fileService.DeleteFileFromS3(img.ImageUrl);
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

                    var coverUrl = await _fileService.UploadFileToS3(
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

                        var url = await _fileService.UploadFileToS3(
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

        public async Task<BaseResponse<ProductDto>> UpdateProductAsync(Guid id, UpdateProductDto input, List<IRemoteStreamContent>? childImages)
        {
            var query = await _productRepo.WithDetailsAsync(p => p.Units, p => p.Images);

            var entity = await AsyncExecuter.FirstOrDefaultAsync(query.Where(p => p.Id == id));

            if (entity == null)
                throw new UserFriendlyException("Product not found");

            var oldCoverImageUrl = entity.CoverImage;
            var newUploadedFileUrls = new List<string>();

            entity.Name = input.Name;
            entity.Slug = input.Slug ?? "";
            entity.Origin = input.Origin ?? "";
            entity.Description = input.Description ?? "";
            entity.CategoryId = input.CategoryId;

            // Update units
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
                // 1. Update cover nếu có file mới
                if (input.CoverImage != null)
                {
                    var extension = Path.GetExtension(input.CoverImage.FileName);
                    var fileName = $"cover-{Guid.NewGuid()}{extension}";

                    var newCoverUrl = await _fileService.UploadFileToS3(
                        input.CoverImage,
                        prefix,
                        fileName
                    );

                    newUploadedFileUrls.Add(newCoverUrl);
                    entity.CoverImage = newCoverUrl;
                }

                // 2. Xóa CHỌN LỌC ảnh cũ
                var deletedImageUrls = (input.DeletedImageUrls ?? new List<string>())
                    .Where(x => !string.IsNullOrWhiteSpace(x))
                    .Distinct()
                    .ToList();

                if (deletedImageUrls.Any())
                {
                    var imagesToRemove = entity.Images
                        .Where(x => deletedImageUrls.Contains(x.ImageUrl))
                        .ToList();

                    foreach (var image in imagesToRemove)
                    {
                        entity.Images.Remove(image);
                    }
                }

                // 3. Add thêm ảnh mới, KHÔNG xóa ảnh cũ còn lại
                if (childImages != null && childImages.Any())
                {
                    foreach (var item in childImages)
                    {
                        var extension = Path.GetExtension(item.FileName);
                        var fileName = $"child-{Guid.NewGuid()}{extension}";

                        var url = await _fileService.UploadFileToS3(
                            item,
                            prefix,
                            fileName
                        );

                        newUploadedFileUrls.Add(url);

                        entity.Images.Add(new ProductImage
                        {
                            ProductId = entity.Id,
                            ImageUrl = url
                        });
                    }
                }

                // 4. Sắp lại DisplayOrder cho toàn bộ ảnh còn lại
                var reorderedImages = entity.Images
                    .OrderBy(x => x.DisplayOrder)
                    .ToList();

                for (int i = 0; i < reorderedImages.Count; i++)
                {
                    reorderedImages[i].DisplayOrder = i;
                }

                // 5. Save DB
                await _productRepo.UpdateAsync(entity, autoSave: true);

                // 6. Xóa cover cũ trên S3 nếu có thay cover
                if (input.CoverImage != null &&
                    !string.IsNullOrWhiteSpace(oldCoverImageUrl) &&
                    oldCoverImageUrl != entity.CoverImage)
                {
                    await _fileService.DeleteFileFromS3(oldCoverImageUrl);
                }

                // 7. Chỉ xóa trên S3 những ảnh cũ user đã bấm X
                foreach (var deletedUrl in deletedImageUrls)
                {
                    await _fileService.DeleteFileFromS3(deletedUrl);
                }

                var productDto = ObjectMapper.Map<Product, ProductDto>(entity);

                return BaseResponse<ProductDto>.Success(
                    "Cập nhật sản phẩm thành công",
                    productDto
                );
            }
            catch
            {
                // rollback các file mới upload nếu lỗi
                foreach (var uploadedUrl in newUploadedFileUrls)
                {
                    try
                    {
                        await _fileService.DeleteFileFromS3(uploadedUrl);
                    }
                    catch
                    {
                    }
                }

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


    }

}

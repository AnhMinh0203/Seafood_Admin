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
using Volo.Abp.Domain.Repositories;
using Volo.Abp.ObjectMapping;
namespace SeaFood.Products
{
    public class ProductAppService : ApplicationService, IProductAppService
    {
        private readonly string? _bucketName;
        private readonly string? _cloudFrontDomain;
        private readonly IAmazonS3 _s3Client;
        private readonly string? _containerCoverImg;
        //private readonly SeaFoodDbContext _context;
        private readonly IRepository<Product, int> _productRepo;
        public readonly IConfiguration _config;
        private readonly IMapper _mapper;

        public ProductAppService(
            SeaFoodDbContext context,
            IConfiguration config,
            IAmazonS3 s3Client,
            IMapper mapper,
            IRepository<Product, int> productRepo
            )
        {
            _config = config;     
            _s3Client = s3Client;
            _bucketName = _config["BucketName"];
            _containerCoverImg = _config["ContainerCoverImg"];
            _cloudFrontDomain = _config["CloudFrontDomain"];
            _mapper = mapper;
            _productRepo = productRepo;
        }

        public async Task<PagedResultDto<ProductDto>> GetListWithUnitsAsync(PagedAndSortedResultRequestDto input)
        {
            //var query = _context.Products
            //    .Include(p => p.Units)
            //    .AsQueryable();

            //var totalCount = await query.CountAsync();  
            //if(!input.Sorting.IsNullOrWhiteSpace())
            //{
            //    query = query.OrderBy(input.Sorting);
            //}
            //else
            //{
            //    query = query.OrderByDescending(p => p.Id);
            //}
            //var entities = await query
            //    .Skip(input.SkipCount)
            //    .Take(input.MaxResultCount)
            //    .ToListAsync();

            //var items = ObjectMapper.Map<List<Product>, List<ProductDto>>(entities);
            //return new PagedResultDto<ProductDto>(totalCount, items);
            var query = await _productRepo.WithDetailsAsync(p => p.Units);
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

        public async Task<ProductDto> GetDetailAsync(int id)
        {
            //var product = await _context.Products
            //    .Include(p => p.Units)
            //    .Include(p => p.Images)
            //    .FirstOrDefaultAsync(p => p.Id == id);
            //if(product == null)
            //{
            //    throw new UserFriendlyException("Sản phẩm không tồn tại");
            //}
            //return ObjectMapper.Map<Product, ProductDto>(product);
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

        public async Task DeleteAsync(int id)
        {
            //var product = await _context.Products
            //    .Include(p => p.Units)
            //    .Include(p => p.Images)
            //    .FirstOrDefaultAsync(p => p.Id == id);
            //if(product == null)
            //{
            //    throw new UserFriendlyException("Sản phẩm không tồn tại");
            //}
            //// Xóa hình ảnh trên S3
            //await DeleteFileFromS3(product.CoverImage);
            //foreach(var img in product.Images)
            //{
            //    await DeleteFileFromS3(img.ImageUrl);
            //}
            //_context.Products.Remove(product);
            //await _context.SaveChangesAsync();

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

        public async Task<BaseResponse<ProductDto>> CreateProductAsync(CreateProductDto input)
        {
            var coverImgFile =
                    $"cover-{Guid.NewGuid()}{Path.GetExtension(input.CoverImage.FileName)}";

            string primaryImgUrl = await UploadFileToS3(
                input.CoverImage,
                _containerCoverImg,
                coverImgFile
            );

            var product = new Product
            {
                Name = input.Name,
                Slug = input.Slug ?? "",
                Origin = input.Origin ?? "",
                Description = input.Description ?? "",
                CategoryId = input.CategoryId,
                CoverImage = primaryImgUrl,
                Units = new List<ProductUnit>(),
                Images = new List<ProductImage>()
            };


            // Units
            if (input.Units != null)
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



            if (input.ChildImages != null && input.ChildImages.Any())
            {
                var uploadTasks = input.ChildImages.Select(async item =>
                {
                    var fileName = $"child-{Guid.NewGuid()}{Path.GetExtension(item.ChildImage.FileName)}";

                    var url = await UploadFileToS3(
                        item.ChildImage,
                        _containerCoverImg,
                        fileName
                    );

                    return new ProductImage
                    {
                        ImageUrl = url,
                        DisplayOrder = item.DisplayOrder
                    };
                });

                var images = await Task.WhenAll(uploadTasks);
                product.Images.AddRange(images);
            }

            //_context.Products.Add(product);
            //await _context.SaveChangesAsync();
            await _productRepo.InsertAsync(product, autoSave: true);
            var productDto = _mapper.Map<ProductDto>(product);
            return BaseResponse<ProductDto>.Success("Tạo sản phẩm thành công", productDto);
        }

        public async Task<string> UploadFileToS3(IFormFile file, string prefix, string fileName)
        {
            try
            {             
                var key = $"{prefix}/{fileName}";
                using var stream = file.OpenReadStream();
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
                    return $"{_cloudFrontDomain}/{key}";
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

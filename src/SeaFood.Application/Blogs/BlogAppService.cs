using SeaFood.Blogs.Dtos;
using SeaFood.Categories.Dtos;
using SeaFood.Entities;
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
using Volo.Abp.Identity;
using Volo.Abp.ObjectMapping;

namespace SeaFood.Blogs
{
    public class BlogAppService : ApplicationService, IBlogAppService
    {
        private readonly IRepository<Blog, int> _blogRepository;
        private readonly IFileStorageService _fileService;
        private readonly IIdentityUserRepository _identityUserRepository;

        public BlogAppService(IRepository<Blog, int> blogRepository, IFileStorageService fileStorageService, IIdentityUserRepository identityUserRepository)
        {
            _blogRepository = blogRepository;
            _fileService = fileStorageService;
            _identityUserRepository = identityUserRepository;

        }

        public async Task<PagedResultDto<BlogListDto>> GetListAsync(PagedAndSortedResultRequestDto input)
        {
            var query = await _blogRepository.GetQueryableAsync();

            var totalCount = await AsyncExecuter.CountAsync(query);

            query = !input.Sorting.IsNullOrWhiteSpace()
            ? query.OrderBy(input.Sorting)
            : query.OrderByDescending(x => x.Id);

            var itemsQuery = query
                .Skip(input.SkipCount)
                .Take(input.MaxResultCount)
                .Select(x => new BlogListDto
                {
                    Id = x.Id,
                    Title = x.Title,
                    Summary = x.Summary,
                    CoverImage = x.CoverImage,
                    View = x.View,
                    CreationTime = x.CreationTime
                });

            var items = await AsyncExecuter.ToListAsync(itemsQuery);

            return new PagedResultDto<BlogListDto>(totalCount, items);
        }

        public async Task<BlogDto> GetDetailAsync(int id)
        {
            var blog = await _blogRepository.FirstOrDefaultAsync(x => x.Id == id);

            if (blog == null)
            {
                throw new UserFriendlyException("Blog không tồn tại");
            }

            return ObjectMapper.Map<Blog, BlogDto>(blog);
        }

        public async Task<BaseResponse<BlogDto>> CreateBlogAsync(CreateBlogDto input)
        {
            if (input.CoverImage == null)
                throw new UserFriendlyException("Cover image is required");

            var prefix = $"blogs/{Guid.NewGuid()}";

            try
            {
                var extension = Path.GetExtension(input.CoverImage.FileName);
                var fileName = $"cover-{Guid.NewGuid()}{extension}";

                var coverUrl = await _fileService.UploadFileToS3(
                    input.CoverImage,
                    prefix,
                    fileName
                );


                var entity = new Blog
                {
                    Title = input.Title,
                    Content = input.Content ?? "",
                    CoverImage = coverUrl
                };

                await _blogRepository.InsertAsync(entity, autoSave: true);

                var itemDto = ObjectMapper.Map<Blog, BlogDto>(entity);

                return BaseResponse<BlogDto>.Success("Tạo blog thành công", itemDto);
            }
            catch (Exception ex)
            {
                throw new UserFriendlyException($"Create failed: {ex.Message}");
            }

        }

        public async Task<BaseResponse<BlogDto>> UpdateBlogAsync(int iteamId, UpdateBlogDto input)
        {
            var entity = await _blogRepository.FirstOrDefaultAsync(x => x.Id == iteamId);
            if (entity == null)
                throw new UserFriendlyException("Blog not found");

            entity.Title = input.Title;
            entity.Content = input.Content ?? "";
            var prefix = $"blogs/{entity.Id}";

            try
            {
                if (input.CoverImage != null)
                {
                    if (!string.IsNullOrEmpty(entity.CoverImage))
                    {
                        await _fileService.DeleteFileFromS3(entity.CoverImage);
                    }

                    var extension = Path.GetExtension(input.CoverImage.FileName);
                    var fileName = $"cover-{Guid.NewGuid()}{extension}";

                    var coverUrl = await _fileService.UploadFileToS3(
                        input.CoverImage,
                        prefix,
                        fileName
                    );

                    entity.CoverImage = coverUrl;
                }

                await _blogRepository.UpdateAsync(entity, autoSave: true);
                var itemDto = ObjectMapper.Map<Blog, BlogDto>(entity);
                return BaseResponse<BlogDto>.Success("Cập nhật blog thành công", itemDto);
            }
            catch (Exception ex)
            {
                throw new UserFriendlyException($"Update failed: {ex.Message}");
            }
        }

        public async Task<BaseResponse<bool>> DeleteBlogAsync(int id)
        {
            var entity = await _blogRepository.FirstOrDefaultAsync(x => x.Id == id);

            if (entity == null)
                throw new UserFriendlyException("Product not found");
            await _blogRepository.DeleteAsync(entity, autoSave: true);
            return BaseResponse<bool>.Success("Xóa sản phẩm thành công", true);
        }

        public async Task<BaseResponse<bool>> BatchDeleteBlogsAsync(List<int> ids)
        {
            if (ids == null || !ids.Any())
                throw new UserFriendlyException("Danh sách sản phẩm cần xóa không hợp lệ");

            var blogs = await _blogRepository.GetListAsync(x => ids.Contains(x.Id));

            if (blogs == null || !blogs.Any())
                throw new UserFriendlyException("Không tìm thấy blog nào để xóa");

            await _blogRepository.DeleteManyAsync(blogs, autoSave: true);

            return BaseResponse<bool>.Success("Xóa danh sách blog thành công", true);
        }
    }
}

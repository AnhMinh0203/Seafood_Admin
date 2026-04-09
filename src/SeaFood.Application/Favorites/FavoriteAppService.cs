using SeaFood.Entities;
using SeaFood.Favorites.Dtos;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Volo.Abp;
using Volo.Abp.Application.Services;
using Volo.Abp.Authorization;
using Volo.Abp.Domain.Repositories;
using Volo.Abp.Users;

namespace SeaFood.Favorites
{
    public class FavoriteAppService: ApplicationService, IFavoriteAppService
    {
        private readonly IRepository<Favorite, Guid> _favoriteRepository;
        private readonly IRepository<Product, Guid> _productRepository;
        private readonly ICurrentUser _currentUser;

        public FavoriteAppService(
            IRepository<Favorite, Guid> favoriteRepository,
            IRepository<Product, Guid> productRepository,
            ICurrentUser currentUser)
        {
            _favoriteRepository = favoriteRepository;
            _productRepository = productRepository;
            _currentUser = currentUser;
        }

        public async Task<ToggleFavoriteResultDto> AddAsync(Guid productId)
        {
            var userId = _currentUser.Id;
            if (!userId.HasValue)
            {
                throw new AbpAuthorizationException("Bạn chưa đăng nhập.");
            }

            var product = await _productRepository.FindAsync(productId);
            if (product == null)
            {
                throw new UserFriendlyException("Sản phẩm không tồn tại.");
            }

            var existed = await _favoriteRepository.FirstOrDefaultAsync(x =>
                x.UserId == userId.Value && x.ProductId == productId);

            if (existed != null)
            {
                return new ToggleFavoriteResultDto
                {
                    IsFavorite = true,
                    Message = "Sản phẩm đã có trong danh sách yêu thích."
                };
            }

            var favorite = new Favorite
            {
                UserId = userId.Value,
                ProductId = productId
            };

            await _favoriteRepository.InsertAsync(favorite, autoSave: true);

            return new ToggleFavoriteResultDto
            {
                IsFavorite = true,
                Message = "Đã thêm vào yêu thích."
            };
        }

        public async Task<ToggleFavoriteResultDto> RemoveAsync(Guid productId)
        {
            var userId = _currentUser.Id;
            if (!userId.HasValue)
            {
                throw new AbpAuthorizationException("Bạn chưa đăng nhập.");
            }

            var existed = await _favoriteRepository.FirstOrDefaultAsync(x =>
                x.UserId == userId.Value && x.ProductId == productId);

            if (existed == null)
            {
                return new ToggleFavoriteResultDto
                {
                    IsFavorite = false,
                    Message = "Sản phẩm chưa có trong danh sách yêu thích."
                };
            }

            await _favoriteRepository.DeleteAsync(existed, autoSave: true);

            return new ToggleFavoriteResultDto
            {
                IsFavorite = false,
                Message = "Đã bỏ yêu thích."
            };
        }

        public async Task<ToggleFavoriteResultDto> ToggleAsync(Guid productId)
        {
            var userId = _currentUser.Id;
            if (!userId.HasValue)
            {
                throw new AbpAuthorizationException("Bạn chưa đăng nhập.");
            }

            var product = await _productRepository.FindAsync(productId);
            if (product == null)
            {
                throw new UserFriendlyException("Sản phẩm không tồn tại.");
            }

            var existed = await _favoriteRepository.FirstOrDefaultAsync(x =>
                x.UserId == userId.Value && x.ProductId == productId);

            if (existed != null)
            {
                await _favoriteRepository.DeleteAsync(existed, autoSave: true);

                return new ToggleFavoriteResultDto
                {
                    IsFavorite = false,
                    Message = "Đã bỏ yêu thích."
                };
            }

            var favorite = new Favorite
            {
                UserId = userId.Value,
                ProductId = productId
            };

            await _favoriteRepository.InsertAsync(favorite, autoSave: true);

            return new ToggleFavoriteResultDto
            {
                IsFavorite = true,
                Message = "Đã thêm vào yêu thích."
            };
        }

        public async Task<bool> IsFavoriteAsync(Guid productId)
        {
            var userId = _currentUser.Id;
            if (!userId.HasValue)
            {
                return false;
            }

            var existed = await _favoriteRepository.FirstOrDefaultAsync(x =>
                x.UserId == userId.Value && x.ProductId == productId);

            return existed != null;
        }

        public async Task<List<FavoriteProductDto>> GetMyFavoritesAsync()
        {
            var userId = _currentUser.Id;
            if (!userId.HasValue)
            {
                throw new AbpAuthorizationException("Bạn chưa đăng nhập.");
            }

            var favoriteQuery = await _favoriteRepository.GetQueryableAsync();
            var productQuery = await _productRepository.GetQueryableAsync();

            var query = from f in favoriteQuery
                        join p in productQuery on f.ProductId equals p.Id
                        where f.UserId == userId.Value
                        select new FavoriteProductDto
                        {
                            ProductId = p.Id,
                            Name = p.Name,
                            CoverImage = p.CoverImage,
                            Origin = p.Origin,
                            Slug = p.Slug
                        };

            return await AsyncExecuter.ToListAsync(query);
        }
    }
}

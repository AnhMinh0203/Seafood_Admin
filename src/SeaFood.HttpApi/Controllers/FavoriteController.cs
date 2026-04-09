using Microsoft.AspNetCore.Mvc;
using SeaFood.Categories;
using SeaFood.Favorites;
using SeaFood.Favorites.Dtos;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SeaFood.Controllers
{
    [ApiController]
    [Route("api/app/favorite")]
    [IgnoreAntiforgeryToken]

    public class FavoriteController: SeaFoodController
    {
        private readonly IFavoriteAppService _favoriteAppService;
        public FavoriteController(IFavoriteAppService favoriteAppService)
        {
            _favoriteAppService = favoriteAppService;
        }

        /// <summary>
        /// Thích sản phẩm
        /// </summary>
        [HttpPost("{productId}")]
        public async Task<ToggleFavoriteResultDto> AddAsync(Guid productId)
        {
            return await _favoriteAppService.AddAsync(productId);
        }

        /// <summary>
        /// Bỏ thích sản phẩm
        /// </summary>
        [HttpDelete("{productId}")]
        public async Task<ToggleFavoriteResultDto> RemoveAsync(Guid productId)
        {
            return await _favoriteAppService.RemoveAsync(productId);
        }

        /// <summary>
        /// Toggle thích / bỏ thích
        /// </summary>
        [HttpPost("toggle/{productId}")]
        public async Task<ToggleFavoriteResultDto> ToggleAsync(Guid productId)
        {
            return await _favoriteAppService.ToggleAsync(productId);
        }

        /// <summary>
        /// Kiểm tra sản phẩm hiện tại có được user thích không
        /// </summary>
        [HttpGet("is-favorite/{productId}")]
        public async Task<bool> IsFavoriteAsync(Guid productId)
        {
            return await _favoriteAppService.IsFavoriteAsync(productId);
        }

        /// <summary>
        /// Lấy danh sách sản phẩm yêu thích của user hiện tại
        /// </summary>
        [HttpGet("my-favorites")]
        public async Task<List<FavoriteProductDto>> GetMyFavoritesAsync()
        {
            return await _favoriteAppService.GetMyFavoritesAsync();
        }
    }
}

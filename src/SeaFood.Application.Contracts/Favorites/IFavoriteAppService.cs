using SeaFood.Favorites.Dtos;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SeaFood.Favorites
{
    public interface IFavoriteAppService
    {
        Task<ToggleFavoriteResultDto> AddAsync(Guid productId);
        Task<ToggleFavoriteResultDto> RemoveAsync(Guid productId);
        Task<ToggleFavoriteResultDto> ToggleAsync(Guid productId);
        Task<bool> IsFavoriteAsync(Guid productId);
        Task<List<FavoriteProductDto>> GetMyFavoritesAsync();

    }
}

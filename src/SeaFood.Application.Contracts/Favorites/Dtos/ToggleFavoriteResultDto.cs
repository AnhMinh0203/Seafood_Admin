using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SeaFood.Favorites.Dtos
{
    public class ToggleFavoriteResultDto
    {
        public bool IsFavorite { get; set; }
        public string Message { get; set; }
    }
}

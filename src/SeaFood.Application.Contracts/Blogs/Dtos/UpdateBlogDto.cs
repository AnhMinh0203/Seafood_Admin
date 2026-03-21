using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Volo.Abp.Content;

namespace SeaFood.Blogs.Dtos
{
    public class UpdateBlogDto
    {
        public string? Title { get; set; }
        public IRemoteStreamContent? CoverImage { get; set; }
        public string? Content { get; set; }
    }
}

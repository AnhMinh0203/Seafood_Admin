using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Volo.Abp.Application.Dtos;

namespace SeaFood.Blogs.Dtos
{
    public class BlogDetailDto : EntityDto<int>
    {
        public string Title { get; set; }
        public string CoverImage { get; set; }
        public int View { get; set; }
        public DateTime CreationTime { get; set; }
        public string Content { get; set; }
    }
}

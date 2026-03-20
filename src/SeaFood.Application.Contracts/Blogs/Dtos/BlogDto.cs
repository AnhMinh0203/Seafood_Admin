using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SeaFood.Blogs.Dtos
{
    public class BlogDto
    {
        public int Id { get; set; }
        public string Title { get; set; }
        public string CoverImage { get; set; }  
        public string Content { get; set; }
        public DateTime CreationTime { get; set; }
    }
}

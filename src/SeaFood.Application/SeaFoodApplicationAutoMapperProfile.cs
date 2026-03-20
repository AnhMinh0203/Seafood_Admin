using AutoMapper;
using SeaFood.Blogs.Dtos;
using SeaFood.Categories.Dtos;
using SeaFood.Entities;
using SeaFood.Products;
using SeaFood.Products.Dtos;

namespace SeaFood;

public class SeaFoodApplicationAutoMapperProfile : Profile
{
    public SeaFoodApplicationAutoMapperProfile()
    {
        CreateMap<Product, ProductDto>();
        CreateMap<CreateUpdateProductDto, Product>();
        CreateMap<ProductUnit, ProductUnitDto>();
        CreateMap<ProductImage, ProductImageDto>();
        CreateMap<Category, CategoryDto>();
        CreateMap<Blog, BlogDto>();

    }
}

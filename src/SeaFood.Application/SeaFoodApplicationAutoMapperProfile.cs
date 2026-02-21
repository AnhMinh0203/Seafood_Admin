using AutoMapper;
using SeaFood.Categories.Dtos;
using SeaFood.Entities;
using SeaFood.Products;

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


    }
}

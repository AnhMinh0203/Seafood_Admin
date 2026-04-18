using Microsoft.AspNetCore.Authorization;
using SeaFood.Carts.Dtos;
using SeaFood.Entities;
using SeaFood.Utils;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Volo.Abp.Application.Services;
using Volo.Abp.Domain.Repositories;
using Volo.Abp.Users;

namespace SeaFood.Carts
{
    [Authorize]
    public class CartAppService: ApplicationService, ICartAppService
    {
        private readonly IRepository<Cart, Guid> _cartRepository;
        private readonly IRepository<Product, Guid> _productRepository;
        private readonly ICurrentUser _currentUser;

        public CartAppService(
            IRepository<Cart, Guid> cartRepository,
            IRepository<Product, Guid> productRepository,
            ICurrentUser currentUser)
        {
            _cartRepository = cartRepository;
            _productRepository = productRepository;
            _currentUser = currentUser;
        }

        public async Task<BaseResponse<CartItemDto>> AddToCartAsync(AddToCartDto input)
        {
            try
            {
                if (!_currentUser.Id.HasValue)
                {
                    return BaseResponse<CartItemDto>.BadRequest("Bạn chưa đăng nhập");
                }

                if (input.ProductId == Guid.Empty)
                {
                    return BaseResponse<CartItemDto>.BadRequest("Sản phẩm không hợp lệ");
                }

                if (input.Quantity <= 0)
                {
                    return BaseResponse<CartItemDto>.BadRequest("Số lượng phải lớn hơn 0");
                }

                var product = await _productRepository.FindAsync(input.ProductId);
                if (product == null)
                {
                    return BaseResponse<CartItemDto>.BadRequest("Sản phẩm không tồn tại");
                }

                var allCartItems = await _cartRepository.GetListAsync();
                var existedCart = allCartItems.FirstOrDefault(x =>
                    x.UserId == _currentUser.Id.Value &&
                    x.ProductId == input.ProductId);

                if (existedCart != null)
                {
                    existedCart.Quantity += input.Quantity;
                    await _cartRepository.UpdateAsync(existedCart, autoSave: true);

                    return BaseResponse<CartItemDto>.Success(
                        "Cập nhật giỏ hàng thành công",
                        MapToCartItemDto(existedCart)
                    );
                }

                var cart = new Cart
                {
                    UserId = _currentUser.Id.Value,
                    ProductId = input.ProductId,
                    Quantity = input.Quantity
                };

                await _cartRepository.InsertAsync(cart, autoSave: true);

                return BaseResponse<CartItemDto>.Success(
                    "Thêm vào giỏ hàng thành công",
                    MapToCartItemDto(cart)
                );
            }
            catch (Exception ex)
            {
                return BaseResponse<CartItemDto>.Fail(ex.Message);
            }
        }

        public async Task<BaseResponse<CartSummaryDto>> GetMyCartAsync()
        {
            try
            {
                if (!_currentUser.Id.HasValue)
                {
                    return BaseResponse<CartSummaryDto>.BadRequest("Bạn chưa đăng nhập");
                }

                var userId = _currentUser.Id.Value;

                var cartQuery = await _cartRepository.GetQueryableAsync();
                var userCartItems = await AsyncExecuter.ToListAsync(
                    cartQuery
                        .Where(x => x.UserId == userId)
                        .OrderByDescending(x => x.CreationTime)
                );

                if (!userCartItems.Any())
                {
                    return BaseResponse<CartSummaryDto>.Success(
                        "Lấy giỏ hàng thành công",
                        new CartSummaryDto
                        {
                            Items = new List<CartItemDto>(),
                            TotalItems = 0,
                            TotalQuantity = 0
                        }
                    );
                }

                var productIds = userCartItems
                    .Select(x => x.ProductId)
                    .Distinct()
                    .ToList();

                var productQuery = await _productRepository.WithDetailsAsync(x => x.Units);
                var products = await AsyncExecuter.ToListAsync(
                    productQuery.Where(x => productIds.Contains(x.Id))
                );

                var productDict = products.ToDictionary(x => x.Id, x => x);

                var response = new CartSummaryDto
                {
                    Items = userCartItems.Select(cart =>
                    {
                        productDict.TryGetValue(cart.ProductId, out var product);

                        var defaultUnit = product?.Units?
                            .OrderByDescending(x => x.IsDefault)
                            .ThenBy(x => x.Id)
                            .FirstOrDefault();

                        return new CartItemDto
                        {
                            Id = cart.Id,
                            ProductId = cart.ProductId,
                            ProductName = product?.Name ?? string.Empty,
                            ImageUrl = product?.CoverImage ?? string.Empty,
                            Price = defaultUnit?.Price ?? 0,
                            UnitName = defaultUnit?.UnitName ?? string.Empty,
                            Quantity = cart.Quantity
                        };
                    }).ToList(),

                    TotalItems = userCartItems.Count,
                    TotalQuantity = userCartItems.Sum(x => x.Quantity)
                };

                return BaseResponse<CartSummaryDto>.Success(
                    "Lấy giỏ hàng thành công",
                    response
                );
            }
            catch (Exception ex)
            {
                return BaseResponse<CartSummaryDto>.Fail(ex.Message);
            }
        }

        public async Task<BaseResponse<CartItemDto>> UpdateQuantityAsync(UpdateCartQuantityDto input)
        {
            try
            {
                if (!_currentUser.Id.HasValue)
                {
                    return BaseResponse<CartItemDto>.BadRequest("Bạn chưa đăng nhập");
                }

                if (input.CartId == Guid.Empty)
                {
                    return BaseResponse<CartItemDto>.BadRequest("Giỏ hàng không hợp lệ");
                }

                if (input.Quantity <= 0)
                {
                    return BaseResponse<CartItemDto>.BadRequest("Số lượng phải lớn hơn 0");
                }

                var cart = await _cartRepository.FindAsync(input.CartId);
                if (cart == null || cart.UserId != _currentUser.Id.Value)
                {
                    return BaseResponse<CartItemDto>.BadRequest("Không tìm thấy sản phẩm trong giỏ hàng");
                }

                cart.Quantity = input.Quantity;
                await _cartRepository.UpdateAsync(cart, autoSave: true);

                return BaseResponse<CartItemDto>.Success(
                    "Cập nhật số lượng thành công",
                    MapToCartItemDto(cart)
                );
            }
            catch (Exception ex)
            {
                return BaseResponse<CartItemDto>.Fail(ex.Message);
            }
        }

        public async Task<BaseResponse<bool>> RemoveItemAsync(Guid cartId)
        {
            try
            {
                if (!_currentUser.Id.HasValue)
                {
                    return BaseResponse<bool>.BadRequest("Bạn chưa đăng nhập");
                }

                if (cartId == Guid.Empty)
                {
                    return BaseResponse<bool>.BadRequest("Giỏ hàng không hợp lệ");
                }

                var cart = await _cartRepository.FindAsync(cartId);
                if (cart == null || cart.UserId != _currentUser.Id.Value)
                {
                    return BaseResponse<bool>.BadRequest("Không tìm thấy sản phẩm trong giỏ hàng");
                }

                await _cartRepository.DeleteAsync(cart, autoSave: true);

                return BaseResponse<bool>.Success("Xóa sản phẩm khỏi giỏ hàng thành công", true);
            }
            catch (Exception ex)
            {
                return BaseResponse<bool>.Fail(ex.Message);
            }
        }

        public async Task<BaseResponse<bool>> ClearMyCartAsync()
        {
            try
            {
                if (!_currentUser.Id.HasValue)
                {
                    return BaseResponse<bool>.BadRequest("Bạn chưa đăng nhập");
                }

                var allCartItems = await _cartRepository.GetListAsync();

                var userCartItems = allCartItems
                    .Where(x => x.UserId == _currentUser.Id.Value)
                    .ToList();

                foreach (var item in userCartItems)
                {
                    await _cartRepository.DeleteAsync(item);
                }

                return BaseResponse<bool>.Success("Xóa toàn bộ giỏ hàng thành công", true);
            }
            catch (Exception ex)
            {
                return BaseResponse<bool>.Fail(ex.Message);
            }
        }

        private CartItemDto MapToCartItemDto(Cart cart)
        {
            return new CartItemDto
            {
                Id = cart.Id,
                ProductId = cart.ProductId,
                Quantity = cart.Quantity
            };
        }
    }
}

using Microsoft.AspNetCore.Identity;
using SeaFood.Users.Dtos;
using SeaFood.Utils;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Volo.Abp;
using Volo.Abp.Application.Services;
using Volo.Abp.Data;
using Volo.Abp.Identity;

namespace SeaFood.Users
{
    public class UserAppService: ApplicationService, IUserAppService
    {
        private readonly UserManager<IdentityUser> _userManager;
        public UserAppService(UserManager<IdentityUser> userManager)
        {
            _userManager = userManager;
        }

        public async Task<BaseResponse<RegisterResponseDto>> RegisterAsync(RegisterDto input)
        {
            try
            {
                var existingUser = await _userManager.FindByNameAsync(input.UserName);
                if (existingUser != null)
                {
                    return BaseResponse<RegisterResponseDto>.BadRequest("Tên đăng nhập đã tồn tại");
                }

                var user = new IdentityUser(
                    GuidGenerator.Create(),
                    input.UserName,
                    ""
                );

                await _userManager.SetPhoneNumberAsync(user, input.PhoneNumber);
                user.Name = input.FullName;

                var result = await _userManager.CreateAsync(user, input.Password);

                if (!result.Succeeded)
                {
                    var errors = string.Join(", ", result.Errors.Select(x => x.Description));
                    return BaseResponse<RegisterResponseDto>.BadRequest(errors);
                }

                var response = new RegisterResponseDto
                {
                    Id = user.Id,
                    UserName = user.UserName,
                    PhoneNumber = user.PhoneNumber,
                    FullName = user.Name
                };

                return BaseResponse<RegisterResponseDto>.Created("Đăng ký thành công", response);
            }
            catch (Exception ex)
            {
                return BaseResponse<RegisterResponseDto>.Fail(ex.Message);
            }
        }
    }
}

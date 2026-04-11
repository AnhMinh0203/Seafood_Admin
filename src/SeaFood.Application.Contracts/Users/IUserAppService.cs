using SeaFood.Users.Dtos;
using SeaFood.Utils;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SeaFood.Users
{
    public interface IUserAppService
    {
        Task<BaseResponse<RegisterResponseDto>> RegisterAsync(RegisterDto input);
        Task<BaseResponse<LoginResponseDto>> LoginAsync(LoginDto input);
        Task<BaseResponse<UserProfileDto>> GetMyProfileAsync();
        Task<BaseResponse<UserProfileDto>> UpdateMyProfileAsync(UpdateUserProfileDto input);
    }
}

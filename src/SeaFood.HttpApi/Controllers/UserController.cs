using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SeaFood.Categories.Dtos;
using SeaFood.Users;
using SeaFood.Users.Dtos;
using SeaFood.Utils;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SeaFood.Controllers
{
    [ApiController]
    [Route("api/app/user")]
    [IgnoreAntiforgeryToken]
    public class UserController: SeaFoodController
    {
        private readonly IUserAppService _userAppService;
        public UserController(IUserAppService userAppService)
        {
            _userAppService = userAppService;
        }

        [HttpPost("register")]
        public async Task<BaseResponse<RegisterResponseDto>> Register( RegisterDto input)
        {
            return await _userAppService.RegisterAsync(input);
        }

        [HttpPost("login")]
        public async Task<BaseResponse<LoginResponseDto>> Login(LoginDto input)
        {
            return await _userAppService.LoginAsync(input);
        }

        [Authorize]
        [HttpGet("my-profile")]
        public async Task<BaseResponse<UserProfileDto>> GetMyProfile()
        {
            return await _userAppService.GetMyProfileAsync();
        }

        [Authorize]
        [HttpPut("my-profile")]
        public async Task<BaseResponse<UserProfileDto>> UpdateMyProfile([FromBody] UpdateUserProfileDto input)
        {
            return await _userAppService.UpdateMyProfileAsync(input);
        }
    }
}

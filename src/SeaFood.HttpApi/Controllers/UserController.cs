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
    public class UserController: SeaFoodController
    {
        private readonly IUserAppService _userAppService;
        public UserController(IUserAppService userAppService)
        {
            _userAppService = userAppService;
        }

        [HttpPost("create")]
        public async Task<BaseResponse<RegisterResponseDto>> Register( RegisterDto input)
        {
            return await _userAppService.RegisterAsync(input);
        }
    }
}

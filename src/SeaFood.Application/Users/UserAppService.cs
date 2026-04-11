using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
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
using Volo.Abp.Users;

namespace SeaFood.Users
{
    public class UserAppService: ApplicationService, IUserAppService
    {
        private const string AddressPropertyName = "Address";

        private readonly UserManager<IdentityUser> _userManager;
        private readonly SignInManager<IdentityUser> _signInManager;
        private readonly ICurrentUser _currentUser;
        private readonly IIdentityUserRepository _identityUserRepository;



        public UserAppService(
            UserManager<IdentityUser> userManager, 
            SignInManager<IdentityUser> signInManager,
            ICurrentUser currentUser,
            IIdentityUserRepository identityUserRepository
            )
        {
            _userManager = userManager;
            _signInManager = signInManager;
            _currentUser = currentUser;
            _identityUserRepository = identityUserRepository;
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

        public async Task<BaseResponse<LoginResponseDto>> LoginAsync(LoginDto input)
        {
            try
            {
                var account = input.UserNameOrPhoneNumber?.Trim();

                IdentityUser? user = await _userManager.FindByNameAsync(account);

                if (user == null)
                {
                    user = await _userManager.Users
                        .FirstOrDefaultAsync(x => x.PhoneNumber == account);
                }

                if (user == null)
                {
                    return BaseResponse<LoginResponseDto>.BadRequest("Tài khoản hoặc mật khẩu không đúng");
                }

                var result = await _signInManager.CheckPasswordSignInAsync(
                    user,
                    input.Password,
                    lockoutOnFailure: false
                );

                if (result.IsLockedOut)
                {
                    return BaseResponse<LoginResponseDto>.BadRequest("Tài khoản đã bị khóa tạm thời, vui lòng thử lại sau");
                }

                if (result.IsNotAllowed)
                {
                    return BaseResponse<LoginResponseDto>.BadRequest("Tài khoản hiện không được phép đăng nhập");
                }

                if (!result.Succeeded)
                {
                    return BaseResponse<LoginResponseDto>.BadRequest("Tài khoản hoặc mật khẩu không đúng");
                }

                await _signInManager.SignInAsync(user, input.RememberMe);

                var response = new LoginResponseDto
                {
                    Id = user.Id,
                    UserName = user.UserName,
                    PhoneNumber = user.PhoneNumber,
                    FullName = user.Name
                };

                return BaseResponse<LoginResponseDto>.Success("Đăng nhập thành công", response);
            }
            catch (Exception ex)
            {
                return BaseResponse<LoginResponseDto>.Fail(ex.Message);
            }
        }

        [Authorize]
        public async Task<BaseResponse<UserProfileDto>> GetMyProfileAsync()
        {
            try
            {
                if (!_currentUser.Id.HasValue)
                {
                    return BaseResponse<UserProfileDto>.BadRequest("Bạn chưa đăng nhập");
                }

                var user = await _userManager.FindByIdAsync(_currentUser.Id.Value.ToString());
                if (user == null)
                {
                    return BaseResponse<UserProfileDto>.BadRequest("Không tìm thấy thông tin người dùng");
                }

                var response = new UserProfileDto
                {
                    Id = user.Id,
                    UserName = user.UserName ?? string.Empty,
                    FullName = user.Name ?? string.Empty,
                    PhoneNumber = user.PhoneNumber ?? string.Empty,
                    Address = user.GetProperty<string>(AddressPropertyName) ?? string.Empty
                };

                return BaseResponse<UserProfileDto>.Success("Lấy thông tin cá nhân thành công", response);
            }
            catch (Exception ex)
            {
                return BaseResponse<UserProfileDto>.Fail(ex.Message);
            }
        }

        [Authorize]
        public async Task<BaseResponse<UserProfileDto>> UpdateMyProfileAsync(UpdateUserProfileDto input)
        {
            try
            {
                var user = await _userManager.FindByIdAsync(_currentUser.Id.Value.ToString());
                if (user == null)
                {
                    return BaseResponse<UserProfileDto>.BadRequest("Không tìm thấy thông tin người dùng");
                }

                var fullName = input.FullName?.Trim() ?? string.Empty;
                var phoneNumber = input.PhoneNumber?.Trim() ?? string.Empty;
                var address = input.Address?.Trim() ?? string.Empty;

                var users = await _identityUserRepository.GetListAsync(phoneNumber: phoneNumber);
                var existedPhoneUser = users.FirstOrDefault(x => x.Id != user.Id);

                if (existedPhoneUser != null)
                {
                    return BaseResponse<UserProfileDto>.BadRequest("Số điện thoại đã được sử dụng");
                }

                user.Name = fullName;
                user.SetPhoneNumber(phoneNumber, false);
                user.SetProperty(AddressPropertyName, address);

                var result = await _userManager.UpdateAsync(user);
                if (!result.Succeeded)
                {
                    var errors = string.Join(", ", result.Errors.Select(x => x.Description));
                    return BaseResponse<UserProfileDto>.BadRequest(errors);
                }

                var response = new UserProfileDto
                {
                    Id = user.Id,
                    UserName = user.UserName ?? string.Empty,
                    FullName = user.Name ?? string.Empty,
                    PhoneNumber = user.PhoneNumber ?? string.Empty,
                    Address = user.GetProperty<string>(AddressPropertyName) ?? string.Empty
                };

                return BaseResponse<UserProfileDto>.Success("Cập nhật thông tin cá nhân thành công", response);
            }
            catch (Exception ex)
            {
                return BaseResponse<UserProfileDto>.Fail(ex.Message);
            }
        }
    }
}

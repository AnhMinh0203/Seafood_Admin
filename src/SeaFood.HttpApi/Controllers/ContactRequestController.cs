using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SeaFood.ContactRequests;
using SeaFood.ContactRequests.Dtos;
using SeaFood.Utils;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SeaFood.Controllers
{
    [ApiController]
    [Route("api/app/contact-request")]
    [IgnoreAntiforgeryToken]
    public class ContactRequestController : SeaFoodController
    {
        private readonly IContactRequestAppService _contactRequestAppService;

        public ContactRequestController(IContactRequestAppService contactRequestAppService)
        {
            _contactRequestAppService = contactRequestAppService;
        }

        [HttpPost]
        [AllowAnonymous]
        public async Task<BaseResponse<string>> CreateAsync([FromBody] CreateContactRequestDto input)
        {
            return await _contactRequestAppService.CreateAsync(input);
        }

        [HttpGet("{id:guid}")]
        public async Task<ContactRequestDto> GetAsync(Guid id)
        {
            return await _contactRequestAppService.GetAsync(id);
        }

        [HttpGet]
        public async Task<List<ContactRequestDto>> GetListAsync()
        {
            return await _contactRequestAppService.GetListAsync();
        }

        [HttpDelete("{id:guid}")]
        public async Task<BaseResponse<bool>> DeleteAsync(Guid id)
        {
            await _contactRequestAppService.DeleteAsync(id);
            return BaseResponse<bool>.Success("Xóa yêu cầu liên hệ thành công.", true);
        }

        [HttpPost("batch-delete")]
        public async Task<BaseResponse<bool>> BatchDeleteAsync([FromBody] List<Guid> ids)
        {
            return await _contactRequestAppService.BatchDeleteAsync(ids);
        }
    }
}

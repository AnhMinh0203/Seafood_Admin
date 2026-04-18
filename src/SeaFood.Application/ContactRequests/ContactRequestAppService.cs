using SeaFood.ContactRequests.Dtos;
using SeaFood.Entities;
using SeaFood.Entities.ContactRequests;
using SeaFood.Utils;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Volo.Abp;
using Volo.Abp.Application.Services;
using Volo.Abp.Domain.Repositories;

namespace SeaFood.ContactRequests
{
    public class ContactRequestAppService : ApplicationService, IContactRequestAppService
    {
        private readonly IRepository<ContactRequest, Guid> _contactRequestRepository;
        public ContactRequestAppService(IRepository<ContactRequest, Guid> contactRequestRepository)
        {
            _contactRequestRepository = contactRequestRepository;
        }

        public async Task<BaseResponse<string>> CreateAsync(CreateContactRequestDto input)
        {

            var entity = new ContactRequest
            {
                FullName = input.FullName.Trim(),
                Phone = input.Phone.Trim(),
                InterestedProduct = input.InterestedProduct,
                InquiryType = input.InquiryType,
                Message = input.Message.Trim(),
                Status = ContactRequestStatus.Pending
            };

            await _contactRequestRepository.InsertAsync(entity, autoSave: true);

            return BaseResponse<string>.Created("Gửi yêu cầu liên hệ thành công.");
        }

        public async Task<ContactRequestDto> GetAsync(Guid id)
        {
            var entity = await _contactRequestRepository.GetAsync(id);
            return ObjectMapper.Map<ContactRequest, ContactRequestDto>(entity);
        }

        public async Task<List<ContactRequestDto>> GetListAsync()
        {
            var queryable = await _contactRequestRepository.GetQueryableAsync();

            var list = await AsyncExecuter.ToListAsync(
                queryable.OrderByDescending(x => x.CreationTime)
            );

            return ObjectMapper.Map<List<ContactRequest>, List<ContactRequestDto>>(list);
        }

        public async Task DeleteAsync(Guid id)
        {
            await _contactRequestRepository.DeleteAsync(id);
        }

        public async Task<BaseResponse<bool>> BatchDeleteAsync(List<Guid> ids)
        {
            if (ids == null || !ids.Any())
                throw new UserFriendlyException("Danh sách yêu cầu liên hệ cần xóa không hợp lệ.");

            var entities = await _contactRequestRepository.GetListAsync(x => ids.Contains(x.Id));

            if (entities == null || !entities.Any())
                throw new UserFriendlyException("Không tìm thấy yêu cầu liên hệ nào để xóa.");

            await _contactRequestRepository.DeleteManyAsync(entities, autoSave: true);

            return BaseResponse<bool>.Success("Xóa danh sách yêu cầu liên hệ thành công.", true);
        }

    }
}

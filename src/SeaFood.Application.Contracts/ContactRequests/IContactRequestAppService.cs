using SeaFood.ContactRequests.Dtos;
using SeaFood.Utils;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SeaFood.ContactRequests
{
    public interface IContactRequestAppService
    {
        Task<BaseResponse<string>> CreateAsync(CreateContactRequestDto input);
        Task<ContactRequestDto> GetAsync(Guid id);
        Task<List<ContactRequestDto>> GetListAsync();
        Task DeleteAsync(Guid id);
        Task<BaseResponse<bool>> BatchDeleteAsync(List<Guid> ids);
        Task<BaseResponse<bool>> UpdateStatusAsync(Guid id, int status);
        Task<BaseResponse<bool>> BatchApproveAsync(List<Guid> ids);

    }
}

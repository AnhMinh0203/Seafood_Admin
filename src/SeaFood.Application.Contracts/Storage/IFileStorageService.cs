using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Volo.Abp.Content;

namespace SeaFood.Storage
{
    public interface IFileStorageService
    {
        Task<string> UploadFileToS3(IRemoteStreamContent file, string prefix, string fileName);
        Task DeleteFileFromS3(string fileUrl);
    }
}

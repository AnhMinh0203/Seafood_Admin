using Amazon.S3;
using Amazon.S3.Model;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Volo.Abp.Content;

namespace SeaFood.Storage
{
    public class FileStorageService: IFileStorageService
    {
        private readonly string? _bucketName;
        private readonly string? _cloudFrontDomain;
        private readonly string? _s3Domain;
        private readonly IAmazonS3 _s3Client;
        public readonly IConfiguration _config;
        private readonly string? _containerCoverImg;

        public FileStorageService(IAmazonS3 s3Client, IConfiguration config)
        {
            _config = config;
            _s3Client = s3Client;
            _bucketName = _config["BucketName"];
            _s3Domain = _config["AWS:S3Domain"];
            _containerCoverImg = _config["ContainerCoverImg"];
            _cloudFrontDomain = _config["AWS:CloudFrontDomain"];
        }

        public async Task<string> UploadFileToS3(IRemoteStreamContent file, string prefix, string fileName)
        {
            try
            {
                var key = $"{prefix}/{fileName}";
                using var stream = file.GetStream();
                var request = new PutObjectRequest
                {
                    BucketName = _bucketName,
                    Key = key,
                    InputStream = stream,
                    ContentType = file.ContentType,
                    Headers = { CacheControl = "no-store, no-cache, must-revalidate" }
                };

                var response = await _s3Client.PutObjectAsync(request);
                if (response.HttpStatusCode == System.Net.HttpStatusCode.OK)
                {
                    return $"{_s3Domain}/{key}";
                }

                throw new Exception("Upload file lên S3 thất bại");
            }
            catch (AmazonS3Exception ex)
            {
                throw new Exception($"Lỗi upload file lên S3: {ex.Message}");
            }
        }

        public async Task DeleteFileFromS3(string fileUrl)
        {
            try
            {
                if (string.IsNullOrEmpty(fileUrl))
                    return;
                var uri = new Uri(fileUrl);
                var key = uri.AbsolutePath.Substring(1);

                var request = new DeleteObjectRequest
                {
                    BucketName = _bucketName,
                    Key = key
                };

                await _s3Client.DeleteObjectAsync(request);
            }
            catch (AmazonS3Exception ex)
            {
                throw new Exception($"Lỗi xóa file trên S3: {ex.Message}");
            }
        }
    }
}

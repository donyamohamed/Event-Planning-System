using CloudinaryDotNet.Actions;
using CloudinaryDotNet;
using Event_Planning_System.Image;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.IO;

namespace Event_Planning_System.Image
{

    public class CloudinaryService : ICloudinaryService
    {
        private readonly Cloudinary _cloudinary;

        public CloudinaryService(CloudinaryConfig config)
        {
            _cloudinary = config.Cloudinary;
        }

        public async Task<ImageUploadResult> UploadImageAsync(Stream imageStream, string fileName)
        {
            var uploadParams = new ImageUploadParams()
            {
                File = new FileDescription(fileName, imageStream),
                Transformation = new Transformation().Crop("limit").Width(2000).Height(2000)
            };

            var uploadResult = await _cloudinary.UploadAsync(uploadParams);

            if (uploadResult.StatusCode != System.Net.HttpStatusCode.OK)
            {
                throw new Exception($"Cloudinary upload failed: {uploadResult.Error.Message}");
            }

            return uploadResult;
        }
    }

}




using CloudinaryDotNet.Actions;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Event_Planning_System.Image
{
    public interface ICloudinaryService
    {
        Task<ImageUploadResult> UploadImageAsync(Stream imageStream, string fileName);
    }
}

using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using CloudinaryDotNet;
using Microsoft.Extensions.Configuration;
namespace Event_Planning_System.Image
{
    public class CloudinaryConfig
    {
        public Cloudinary Cloudinary { get; }

        public CloudinaryConfig(IConfiguration configuration)
        {
            var cloudinarySettings = configuration.GetSection("Cloudinary");
            var account = new Account(
                cloudinarySettings["CloudName"],
                cloudinarySettings["ApiKey"],
                cloudinarySettings["ApiSecret"]);

            Cloudinary = new Cloudinary(account);
        }
    }
}

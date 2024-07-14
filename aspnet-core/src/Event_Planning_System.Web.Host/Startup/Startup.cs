using System;
using System.Linq;
using System.Reflection;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Castle.Facilities.Logging;
using Abp.AspNetCore;
using Abp.AspNetCore.Mvc.Antiforgery;
using Abp.Castle.Logging.Log4Net;
using Abp.Extensions;
using Event_Planning_System.Configuration;
using Event_Planning_System.Identity;
using Abp.AspNetCore.SignalR.Hubs;
using Microsoft.Extensions.Hosting;
using Microsoft.OpenApi.Models;
using System.IO;
using Event_Planning_System.Image;
using Event_Planning_System.Chats;
using Microsoft.AspNetCore.SignalR;
using Abp.Domain.Uow;
using Event_Planning_System.Entities;
using Hangfire;
using Event_Planning_System.Email;
using Hangfire.SqlServer;
using Event_Planning_System.GuestsFeed;
using Microsoft.AspNetCore.RateLimiting;
using Microsoft.AspNetCore.Http;
using DinkToPdf.Contracts;
using DinkToPdf;

namespace Event_Planning_System.Web.Host.Startup
{
    public class Startup
    {
        private const string _defaultCorsPolicyName = "localhost";

        private const string _apiVersion = "v1";

        private readonly IConfigurationRoot _appConfiguration;
        private readonly IWebHostEnvironment _hostingEnvironment;

        public Startup(IWebHostEnvironment env)
        {
            _hostingEnvironment = env;
            _appConfiguration = env.GetAppConfiguration();
        }

        public void ConfigureServices(IServiceCollection services)
        {
            services.AddSingleton(typeof(IConverter), new SynchronizedConverter(new PdfTools()));

            services.AddHangfire(x => x.UseSqlServerStorage("Server=.; Database=Event_Planning_SystemDb,1433; Trusted_Connection=True; TrustServerCertificate=True;"));



            //services.AddHangfire(x => x.UseSqlServerStorage("Server=tcp:examinationdb.database.windows.net,1433;Initial Catalog=Event_Planning_SystemDb;Persist Security Info=False;User ID=examDb;Password=esraa_2000;MultipleActiveResultSets=False;Encrypt=True;TrustServerCertificate=False;Connection Timeout=30;"));

            services.AddHangfire(configuration =>
		configuration.SetDataCompatibilityLevel(CompatibilityLevel.Version_170)
					 .UseSimpleAssemblyNameTypeSerializer()
					 .UseRecommendedSerializerSettings()
					 .UseSqlServerStorage("Server=.; Database=Event_Planning_SystemDb; Trusted_Connection=True; TrustServerCertificate=True;", new SqlServerStorageOptions
					 {
						 CommandBatchMaxTimeout = TimeSpan.FromMinutes(5),
						 SlidingInvisibilityTimeout = TimeSpan.FromMinutes(5),
						 QueuePollInterval = TimeSpan.Zero,
						 UseRecommendedIsolationLevel = true,
						 UsePageLocksOnDequeue = true,
						 DisableGlobalLocks = true
					 }));
			services.AddHangfireServer();
			//MVC
			services.AddControllersWithViews(options =>
            {
                options.Filters.Add(new AbpAutoValidateAntiforgeryTokenAttribute());
            });

            IdentityRegistrar.Register(services);
            AuthConfigurer.Configure(services, _appConfiguration);
            services.AddSingleton<IUserIdProvider, CustomUserIdProvider>();
            services.AddTransient<IChatUserConnectionRepository, ChatUserConnectionRepository>();
            services.AddTransient<IChatMessageAppService, ChatMessageAppService>();
			services.AddTransient<IEmailService, EmailService>();
			services.AddTransient<IGuestsFeedbackAppService, GuestsFeedbackAppService>();
			//services.AddScoped<IUnitOfWorkManager, UnitOfWorkManager>();

			services.AddSignalR();

		   //services.AddTransient<IChatMessageAppService, ChatMessageAppService>();

			// Configure CORS for angular2 UI
			services.AddCors(
                options => options.AddPolicy(
                    _defaultCorsPolicyName,
                    builder => builder
                        .WithOrigins(
                            // App:CorsOrigins in appsettings.json can contain more than one address separated by comma.
                            _appConfiguration["App:CorsOrigins"]
                                .Split(",", StringSplitOptions.RemoveEmptyEntries)
                                .Select(o => o.RemovePostFix("/"))
                                .ToArray()
                        )
                        .AllowAnyHeader()
                        .AllowAnyMethod()
                        .AllowCredentials()
                )
            );

            //testing 
            services.AddRateLimiter(reteLimiterOption =>
            {
                reteLimiterOption.AddFixedWindowLimiter("fixed", option =>
                {
                    option.PermitLimit = 1;
                    option.Window=TimeSpan.FromSeconds(5);
                    option.QueueLimit = 0;
                });
                reteLimiterOption.RejectionStatusCode = StatusCodes.Status429TooManyRequests;
            });

            // Swagger - Enable this line and the related lines in Configure method to enable swagger UI
            ConfigureSwagger(services);
            services.AddSingleton<CloudinaryConfig>();
            services.AddTransient<ICloudinaryService, CloudinaryService>();

            // Configure Abp and Dependency Injection
            services.AddAbpWithoutCreatingServiceProvider<Event_Planning_SystemWebHostModule>(
                // Configure Log4Net logging
                options => options.IocManager.IocContainer.AddFacility<LoggingFacility>(
                    f => f.UseAbpLog4Net().WithConfig(_hostingEnvironment.IsDevelopment()
                        ? "log4net.config"
                        : "log4net.Production.config"
                    )
                )
            );
        }

        public void Configure(IApplicationBuilder app, IWebHostEnvironment env, ILoggerFactory loggerFactory)
        {
            app.UseAbp(options => { options.UseAbpRequestLocalization = false; }); // Initializes ABP framework.

            app.UseCors(_defaultCorsPolicyName); // Enable CORS!



            app.UseStaticFiles();

            app.UseRouting();

            

            app.UseAuthentication();
            app.UseAuthorization();
			app.UseHangfireDashboard();

			app.UseAbpRequestLocalization();

            app.UseRateLimiter();

            app.UseEndpoints(endpoints =>
            {

                endpoints.MapHub<AbpCommonHub>("/signalr");
                endpoints.MapHub<ChatHub>("/chathub");
                endpoints.MapHub<ChatbotHub>("/chatbothub");

                endpoints.MapControllerRoute("default", "{controller=Home}/{action=Index}/{id?}");
                endpoints.MapControllerRoute("defaultWithArea", "{area}/{controller=Home}/{action=Index}/{id?}");
            });

            // Enable middleware to serve generated Swagger as a JSON endpoint
            app.UseSwagger(c => { c.RouteTemplate = "swagger/{documentName}/swagger.json"; });

            // Enable middleware to serve swagger-ui assets (HTML, JS, CSS etc.)
            app.UseSwaggerUI(options =>
            {
                // specifying the Swagger JSON endpoint.
                options.SwaggerEndpoint($"/swagger/{_apiVersion}/swagger.json", $"Event_Planning_System API {_apiVersion}");
                options.IndexStream = () => Assembly.GetExecutingAssembly()
                    .GetManifestResourceStream("Event_Planning_System.Web.Host.wwwroot.swagger.ui.index.html");
                options.DisplayRequestDuration(); // Controls the display of the request duration (in milliseconds) for "Try it out" requests.
            }); // URL: /swagger

          
        }

        private void ConfigureSwagger(IServiceCollection services)
        {
            services.AddSwaggerGen(options =>
            {
                options.SwaggerDoc(_apiVersion, new OpenApiInfo
                {
                    Version = _apiVersion,
                    Title = "Event_Planning_System API",
                    Description = "Event_Planning_System",
                    // uncomment if needed TermsOfService = new Uri("https://example.com/terms"),
                    Contact = new OpenApiContact
                    {
                        Name = "Event_Planning_System",
                        Email = string.Empty,
                        Url = new Uri("https://twitter.com/aspboilerplate"),
                    },
                    License = new OpenApiLicense
                    {
                        Name = "MIT License",
                        Url = new Uri("https://github.com/aspnetboilerplate/aspnetboilerplate/blob/dev/LICENSE"),
                    }
                });
                options.DocInclusionPredicate((docName, description) => true);

                // Define the BearerAuth scheme that's in use
                options.AddSecurityDefinition("bearerAuth", new OpenApiSecurityScheme()
                {
                    Description =
                        "JWT Authorization header using the Bearer scheme. Example: \"Authorization: Bearer {token}\"",
                    Name = "Authorization",
                    In = ParameterLocation.Header,
                    Type = SecuritySchemeType.ApiKey
                });

                //add summaries to swagger
                bool canShowSummaries = _appConfiguration.GetValue<bool>("Swagger:ShowSummaries");
                if (canShowSummaries)
                {
                    var hostXmlFile = $"{Assembly.GetExecutingAssembly().GetName().Name}.xml";
                    var hostXmlPath = Path.Combine(AppContext.BaseDirectory, hostXmlFile);
                    options.IncludeXmlComments(hostXmlPath);

                    var applicationXml = $"Event_Planning_System.Application.xml";
                    var applicationXmlPath = Path.Combine(AppContext.BaseDirectory, applicationXml);
                    options.IncludeXmlComments(applicationXmlPath);

                    var webCoreXmlFile = $"Event_Planning_System.Web.Core.xml";
                    var webCoreXmlPath = Path.Combine(AppContext.BaseDirectory, webCoreXmlFile);
                    options.IncludeXmlComments(webCoreXmlPath);
                }
            });
        }
    }
}
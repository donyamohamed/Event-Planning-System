using Abp.Configuration.Startup;
using Abp.Localization.Dictionaries;
using Abp.Localization.Dictionaries.Xml;
using Abp.Reflection.Extensions;

namespace Event_Planning_System.Localization
{
    public static class Event_Planning_SystemLocalizationConfigurer
    {
        public static void Configure(ILocalizationConfiguration localizationConfiguration)
        {
            localizationConfiguration.Sources.Add(
                new DictionaryBasedLocalizationSource(Event_Planning_SystemConsts.LocalizationSourceName,
                    new XmlEmbeddedFileLocalizationDictionaryProvider(
                        typeof(Event_Planning_SystemLocalizationConfigurer).GetAssembly(),
                        "Event_Planning_System.Localization.SourceFiles"
                    )
                )
            );
        }
    }
}

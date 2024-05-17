using Event_Planning_System.Debugging;

namespace Event_Planning_System
{
    public class Event_Planning_SystemConsts
    {
        public const string LocalizationSourceName = "Event_Planning_System";

        public const string ConnectionStringName = "Default";

        public const bool MultiTenancyEnabled = true;


        /// <summary>
        /// Default pass phrase for SimpleStringCipher decrypt/encrypt operations
        /// </summary>
        public static readonly string DefaultPassPhrase =
            DebugHelper.IsDebug ? "gsKxGZ012HLL3MI5" : "0c2e85ff947540d6b8420eb476f7b6a3";
    }
}

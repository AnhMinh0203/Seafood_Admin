namespace SeaFood.Permissions;

public static class SeaFoodPermissions
{
    public const string GroupName = "SeaFood";



    //Add your own permission names. Example:
    //public const string MyPermission1 = GroupName + ".MyPermission1";

    public static class ContactRequests
    {
        public const string Default = GroupName + ".ContactRequests";
        public const string Create = Default + ".Create";
        public const string Delete = Default + ".Delete";
        public const string BatchDelete = Default + ".BatchDelete";
        public const string UpdateStatus = Default + ".UpdateStatus";
        public const string BatchApprove = Default + ".BatchApprove";
    }

    public static class Categories
    {
        public const string Default = GroupName + ".Categories";
        public const string Create = Default + ".Create";
        public const string Delete = Default + ".Delete";
        public const string BatchDelete = Default + ".BatchDelete";
        public const string UpdateStatus = Default + ".UpdateStatus";
        public const string BatchApprove = Default + ".BatchApprove";
    }
}

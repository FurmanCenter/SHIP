namespace Furman.PDP.Data.Nychanis
{
    /// <summary>
    /// Metadata for the "geography" column
    /// </summary>
    public class NycGeogColumnMetadata : AbstractTableColumnMetadata
    {
        public NycGeogColumnMetadata(string name)
        {
            Name = name;
            Order = double.MinValue;
            ValType = "text";
        }
    }
}
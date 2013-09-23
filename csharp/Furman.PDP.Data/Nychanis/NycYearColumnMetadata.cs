namespace Furman.PDP.Data.Nychanis
{
    /// <summary>
    /// The metadata used for the column headers in the results.
    /// </summary>
    public class NycYearColumnMetadata : AbstractTableColumnMetadata
    {
        /// <summary>
        /// Constructs the metadata from a timeframe.
        /// </summary>
        /// <param name="timeframe"></param>
        /// <param name="valueType">Type of the value for this indicator.</param>
        public NycYearColumnMetadata(NycTimeframe timeframe, NycValueType? valueType)
        {
            Name = timeframe.Name;
            // Sort descending.
            Order = -timeframe.Value;
            ValType = valueType == null ? null : valueType.ToString();
        }
    }
}
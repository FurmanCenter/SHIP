namespace Furman.PDP.Data.Nychanis
{
    /// <summary>
    /// Indicators have values in one or more time frame types, I.E. years, or quarters, or months.
    /// </summary>
    public enum NycTimeframeType
    {
        /// <summary>
        /// The indicator has values by year.
        /// </summary>
        Year,
        /// <summary>
        /// The indicator has values by quarter.
        /// </summary>
        Quarter,
        /// <summary>
        /// The indicator has values by month.
        /// </summary>
        Month
    }
}
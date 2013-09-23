namespace Furman.PDP.Data.Nychanis
{
    /// <summary>
    /// Represents a single resolution and time for which a particular indicator has data.
    /// </summary>
    public class NycResolutionForIndicator
    {
        /// <summary>
        /// Unique ID of the indicator that has data at this resolution and time.
        /// </summary>
        public object IndicatorId;
        /// <summary>
        /// Unique ID of the resolution this indicator has data for.
        /// </summary>
        public NycResolutionType Resolution;
        /// <summary>
        /// Unique ID of the timeframe this indicator has data for.
        /// </summary>
        public object TimeId;
    }
}
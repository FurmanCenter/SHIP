namespace Furman.PDP.Data.Nychanis
{
    /// <summary>
    /// A single value for a single time/place/indicator.
    /// </summary>
    public class NycDatum {
        /// <summary>
        /// Unique ID of the geographic unit this is the datum for.
        /// </summary>
        public object GeographyId;
        /// <summary>
        /// Unique ID of the timeframe this is the datum for.
        /// </summary>
        public object TimeId;
        /// <summary>
        /// Value of the indicator for the specified resolution, geography, and time.
        /// </summary>
        public object Value;
        /// <summary>
        /// This is the normalized (0-100) version of the Value when using "Historical" breakpoints.
        /// </summary>
        public int HistoricalBreakpoint;
        /// <summary>
        /// This is the normalized (0-100) version of the Value when using "Contemporary" breakpoints.
        /// </summary>
        public int ContemporaryBreakpoint;
        /// <summary>
        /// Unique ID of the indicator this is the datum for.
        /// </summary>
        public object IndicatorId;
        /// <summary>
        /// Unique ID of the resolution this is the datum for.
        /// </summary>
        public NycResolutionType Resolution;

        public override string ToString()
        {
            return IndicatorId + "," + Resolution + "-" + GeographyId + "," + TimeId + "=" + Value;
        }
    }
}
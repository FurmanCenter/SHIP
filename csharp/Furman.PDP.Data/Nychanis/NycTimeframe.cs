namespace Furman.PDP.Data.Nychanis
{
    /// <summary>
    /// A single time unit value thing.  I.E. the year 1975 or the quarter 1998 - Q2.
    /// </summary>
    public class NycTimeframe {
        /// <summary>
        /// Unique ID.
        /// </summary>
        public object UID;
        /// <summary>
        /// The year this timeframe is within (used for getting all timeframes within a year
        /// range).
        /// </summary>
        public int Year;
        /// <summary>
        /// Value, as it appears in the indicators table.
        /// </summary>
        public double Value;
        /// <summary>
        /// What type is this timeframe, I.E. year or quarter?
        /// </summary>
        public NycTimeframeType Type;
        /// <summary>
        /// The user-friendly label to display for this timeframe.
        /// </summary>
        public string Name;

        public override string ToString()
        {
            return Name + " (" + UID + ")";
        }
    }
}
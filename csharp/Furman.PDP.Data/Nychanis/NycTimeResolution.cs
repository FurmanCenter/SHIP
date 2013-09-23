using System;

namespace Furman.PDP.Data.Nychanis
{
    /// <summary>
    /// A single time unit value thing.  I.E. the year 1975 or the quarter 1998 - Q2.
    /// </summary>
    public class NycTimeResolution : IComparable<NycTimeResolution> {
        /// <summary>
        /// What type is this timeframe, I.E. year or quarter?
        /// </summary>
        public NycTimeframeType UID;
        /// <summary>
        /// The user-friendly label to display for this timeframe.
        /// </summary>
        public string Name
        {
            get { return UID.ToString(); }
        }

        /// <summary>
        /// Construct it from an enum value.
        /// </summary>
        /// <param name="type"></param>
        public NycTimeResolution(NycTimeframeType type)
        {
            UID = type;
        }

        public int CompareTo(NycTimeResolution other)
        {
            return UID.CompareTo(other.UID);
        }

        public override string ToString()
        {
            return Name;
        }
    }
}
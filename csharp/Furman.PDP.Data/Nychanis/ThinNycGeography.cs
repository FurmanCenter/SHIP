namespace Furman.PDP.Data.Nychanis
{
    /// <summary>
    /// A single geographical unit, I.E. a census tract.
    /// </summary>
    public class ThinNycGeography : AbstractNamedSortable {
        /// <summary>
        /// Database Unique ID.
        /// </summary>
        public object UID;
        /// <summary>
        /// The Borough this geographical unit falls within, or null if larger than
        /// Borough or N/A.
        /// </summary>
        public string Borough;
        /// <summary>
        /// The sub-Borough area this geographical unit falls within, or null if larger than
        /// sub-Borough or N/A.
        /// </summary>
        public string SubBorough;
        /// <summary>
        /// The resolution-specific ID of this geographic unit.  I.E. the census tract number.
        /// </summary>
        public object ActualId;

        /// <summary>
        /// Only child classes can instantiate a blank one.
        /// </summary>
        protected ThinNycGeography()
        {
        }

        /// <summary>
        /// Copy constructor.
        /// </summary>
        /// <param name="other"></param>
        public ThinNycGeography(ThinNycGeography other)
        {
            UID = other.UID;
            Borough = other.Borough;
            SubBorough = other.SubBorough;
            ActualId = other.ActualId;
            Name = other.Name;
            Order = other.Order;
        }
    }
}
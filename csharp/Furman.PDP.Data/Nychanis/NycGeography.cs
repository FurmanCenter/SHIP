namespace Furman.PDP.Data.Nychanis
{
    /// <summary>
    /// A single geographical unit, I.E. a census tract.
    /// </summary>
    public class NycGeography : ThinNycGeography {
        /// <summary>
        /// User-friendly name of the resolution this geography is at.
        /// </summary>
        public string ResolutionName;
        /// <summary>
        /// Unique ID of the resolution this is the datum for.
        /// </summary>
        public NycResolutionType Resolution;
        /// <summary>
        /// The order this geography's resolution should appear in compared to other
        /// resolutions.
        /// </summary>
        public object ResolutionOrder;

        public override string ToString()
        {
            return Name + " (" + Resolution + ": " + ResolutionName + ", " + UID + ")";
        }
    }
}
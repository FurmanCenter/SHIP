using System.Collections.Generic;

namespace Furman.PDP.Data.Nychanis
{
    /// <summary>
    /// The One Metadata Object To Bind Them.
    /// </summary>
    public class NycQueryMetadata
    {
        /// <summary>
        /// All the possible timeframes.
        /// </summary>
        public IList<NycTimeResolution> Times;
        /// <summary>
        /// All the possible geographic areas, organized by resolutions.
        /// </summary>
        public IList<NycResolution> Resolutions;
        /// <summary>
        /// All the possible indicators, organized by category and subcategory.
        /// </summary>
        public IList<NycIndicatorCategory> IndCats;
    }
}
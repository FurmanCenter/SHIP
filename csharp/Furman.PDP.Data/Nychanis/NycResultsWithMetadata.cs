using System.Collections.Generic;

namespace Furman.PDP.Data.Nychanis
{
    /// <summary>
    /// Nychanis results also include the Indicator and Resolution IDs that
    /// were specified in the query.
    /// </summary>
    public class NycResultsWithMetadata : ResultsWithMetadata<AbstractNamedSortable>
    {
        /// <summary>
        /// Display name of the indicator these are the results for.
        /// </summary>
        public string Indicator;
        /// <summary>
        /// Display name of the resolution these are the results for.
        /// </summary>
        public string Resolution;
        /// <summary>
        /// Minimum year these results contain.  May be different from that requested if
        /// you requested a year range outside what we actually have.
        /// </summary>
        public int MinYear;
        /// <summary>
        /// Maximum year these results contain.  May be different from that requested if
        /// you requested a year range outside what we actually have.
        /// </summary>
        public int MaxYear;
        /// <summary>
        /// These are rows of data at higher geographic areas than the values, so if you asked for
        /// values by borough, this would have the row for city.
        /// </summary>
        public IList<IList<object>> ContextRows;
        /// <summary>
        /// Info about the map layers to be created to display the nychanis
        /// results as a cloropleth layer.
        /// </summary>
        public NycMapInfo MapInfo;
        /// <summary>
        /// Info about the map layers to display the nychanis
        /// results map legend.
        /// </summary>
        public NycLegendInfo LegendInfo;
    }
}
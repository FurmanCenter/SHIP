using System.Collections.Generic;

namespace Furman.PDP.Data.Nychanis
{
    /// <summary>
    /// Everything necessary to render the color legend.
    /// </summary>
    public class NycLegendInfo
    {
        /// <summary>
        /// The opacity of the polygons, necessary for the legend so that the colors rendered
        /// in the legend match those actually on the map.  I.E. "0.5".
        /// </summary>
        public string Opacity;
        /// <summary>
        /// The items to show in the legend.
        /// </summary>
        public IList<NycLegendElement> Elements;
        /// <summary>
        /// The type of the values (money, percent, etc).
        /// </summary>
        public string ValueType;
    }
}
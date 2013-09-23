using System.Collections.Generic;

namespace Furman.PDP.Data.Nychanis
{
    /// <summary>
    /// A subcategory consists of a display name, a sort order, and a group of indicators.
    /// </summary>
    public class NycIndicatorSubCategory : AbstractNamedSortable
    {
        /// <summary>
        /// Every subcategory has a collection of indicators.
        /// </summary>
        public List<ThinNycIndicator> Indicators = new List<ThinNycIndicator>();

        public NycIndicatorSubCategory(IList<NycIndicator> indicators)
        {
            Name = indicators[0].SubCategory;
            Order = indicators[0].FilterSubCatOrder;
            foreach (NycIndicator indicator in indicators)
            {
                Indicators.Add(new ThinNycIndicator(indicator));
            }
            Indicators.Sort();
        }
    }
}
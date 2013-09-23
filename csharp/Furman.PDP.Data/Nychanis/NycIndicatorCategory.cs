using System;
using System.Collections.Generic;

namespace Furman.PDP.Data.Nychanis
{
    /// <summary>
    /// A category consists of a display name, a sort order, and a group of subcategories.
    /// </summary>
    public class NycIndicatorCategory : AbstractNamedSortable
    {
        /// <summary>
        /// Every category has a collection of subcategories.
        /// </summary>
        public List<NycIndicatorSubCategory> SubCats;

        /// <summary>
        /// Construct it with the list of children, and one indicator to pull the name and order off of.
        /// </summary>
        /// <param name="indicator"></param>
        /// <param name="subcats"></param>
        public NycIndicatorCategory(NycIndicator indicator, List<NycIndicatorSubCategory> subcats)
        {
            Name = indicator.Category;
            Order = indicator.FilterCatOrder;
            SubCats = subcats;
            SubCats.Sort();
        }
    }
}
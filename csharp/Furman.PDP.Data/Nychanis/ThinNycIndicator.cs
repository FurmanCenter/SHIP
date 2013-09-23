using System;
using System.Collections.Generic;

namespace Furman.PDP.Data.Nychanis
{
    /// <summary>
    /// The slimmed down version of an indicator that will be returned to the client.
    /// </summary>
    public class ThinNycIndicator : AbstractNycIndicator
    {
        /// <summary>
        /// All the years of data that are available at each resolution and time resolution.
        /// </summary>
        public IDictionary<int, IDictionary<int, IList<int>>> AvailableYearsByResolution;
        /// <summary>
        /// Can only construct one from a real indicator object.
        /// </summary>
        /// <param name="orig"></param>
        public ThinNycIndicator(AbstractNycIndicator orig)
            : base(orig)
        {
        }
    }
}
using System;
using System.Collections.Generic;
using Azavea.Open.Common;

namespace Furman.PDP.Data.Nychanis
{
    /// <summary>
    /// A "Resolution" is a geographic level, examples are Borough, Census Tract, etc.
    /// </summary>
    public class NycResolution : AbstractNamedSortable
    {
        /// <summary>
        /// Unique ID of the resolution this is the datum for.
        /// </summary>
        public NycResolutionType UID;
        /// <summary>
        /// Set to true if all the geographies in this resolution have the borough field
        /// populated.
        /// </summary>
        public bool HasBoroughData = true;
        /// <summary>
        /// Set to true if all the geographies in this resolution have the sub borough field
        /// populated.
        /// </summary>
        public bool HasSubBoroughData = true;
        /// <summary>
        /// For serialization, we can include a colletion of "thin" geography objects,
        /// that do not duplicate the data on the resolution object.
        /// </summary>
        public List<ThinNycGeography> Geographies = new List<ThinNycGeography>();

        /// <summary>
        /// Empty default constructor.
        /// </summary>
        public NycResolution()
        {
        }

        /// <summary>
        /// Extract its info from a geography.
        /// </summary>
        /// <param name="geog"></param>
        public NycResolution(NycGeography geog)
        {
            Name = geog.ResolutionName;
            UID = geog.Resolution;
            Order = geog.ResolutionOrder;
            HasBoroughData = StringHelper.IsNonBlank(geog.Borough);
            HasSubBoroughData = StringHelper.IsNonBlank(geog.SubBorough);
            Geographies.Add(new ThinNycGeography(geog));
        }

        /// <summary>
        /// When iterating over all the geographies, call this method and we'll update
        /// the hasxxxdata flags based on whether the geography has that data or not, and
        /// add a "thin" version of this geography to our collection.
        /// </summary>
        /// <param name="geog"></param>
        public void Add(NycGeography geog)
        {
            HasBoroughData = HasBoroughData && StringHelper.IsNonBlank(geog.Borough);
            HasSubBoroughData = HasSubBoroughData && StringHelper.IsNonBlank(geog.SubBorough);
            Geographies.Add(new ThinNycGeography(geog));
        }

        public override string ToString()
        {
            return Name + "(" + UID + ")";
        }
    }
}
using System.Collections.Generic;

namespace Furman.PDP.Data.Nychanis
{
    /// <summary>
    /// Info about a single map layer for a single time frame for an indicator.
    /// </summary>
    public class NycLayerInfo
    {
        /// <summary>
        /// Display name of the map layer.
        /// </summary>
        public string Name;
        /// <summary>
        /// OpenLayers config object for the layer.
        /// </summary>
        public IDictionary<string,object> Config;

        /// <summary>
        /// Returns a <see cref="T:System.String"/> that represents the current <see cref="T:System.Object"/>.
        /// </summary>
        /// <returns>
        /// A <see cref="T:System.String"/> that represents the current <see cref="T:System.Object"/>.
        /// </returns>
        /// <filterpriority>2</filterpriority>
        public override string ToString()
        {
            return Name;
        }
    }
}
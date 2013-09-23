using System.Collections.Generic;

namespace Furman.PDP.Data.Nychanis
{
    /// <summary>
    /// Info about the map layers to be created to display the nychanis
    /// results as a cloropleth layer.
    /// </summary>
    public class NycMapInfo
    {
        /// <summary>
        /// URL to the WMS map server.
        /// </summary>
        public string Server;
        /// <summary>
        /// Info about each of the layers available.
        /// </summary>
        public IList<NycLayerInfo> Layers;
    }
}
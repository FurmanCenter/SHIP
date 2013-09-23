using System.Web;
using Azavea.Web;
using Azavea.Web.Handler;
using Furman.PDP.Data.Nychanis;

namespace Furman.PDP.Handlers
{
    /// <summary>
    /// Returns information about the attributes in the PDB.
    /// </summary>
    public class NychanisMetadataHandler : CachedHandler
    {
        /// <summary>
        /// Enable response compression.
        /// </summary>
        public NychanisMetadataHandler()
            : base(true)
        {
        }

        protected override void InternalGET(HttpContext context, HandlerTimedCache cache)
        {
            NycQueryMetadata data = NychanisHelper.GetQueryMetadata();
            
            context.Response.Write(WebUtil.ObjectToJson(data));
        }
    }
}

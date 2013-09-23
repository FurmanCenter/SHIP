using System.Web;
using Azavea.Web;
using Azavea.Web.Handler;
using Furman.PDP.Data.Nychanis;

namespace Furman.PDP.Handlers
{
    /// <summary>
    /// Returns an SLD for a particular indicator/geography/timeframe.
    /// </summary>
    public class NychanisSldHandler : CachedHandler
    {
        /// <summary>
        /// Enable response compression.
        /// </summary>
        public NychanisSldHandler()
            : base(true) { }

        protected override void InternalGET(HttpContext context, HandlerTimedCache cache)
        {
            string indicatorId = WebUtil.GetParam(context, "indicator", false);
            NycResolutionType resolution = WebUtil.ParseEnumParam<NycResolutionType>(context, "resolution");
            string timeId = WebUtil.GetParam(context, "time", false);

            // These two params are for "scope".  These should be "ActualId" not "UID".
            string borough = WebUtil.GetParam(context, "borough", true);
            string subborough = WebUtil.GetParam(context, "subborough", true);

            string sld = NychanisHelper.GenerateSld(indicatorId, resolution, timeId, borough, subborough);

            context.Response.ContentType = "text/xml";
            context.Response.Write(sld);
        }
    }
}

using System;
using System.Collections;
using System.Collections.Generic;
using Azavea.Open.Common;
using Azavea.Open.DAO.Criteria;
using Azavea.Web;
using Azavea.Web.Handler;
using Furman.PDP.Data;
using Furman.PDP.Data.Nychanis;
using Furman.PDP.Data.PDB;

namespace Furman.PDP.Handlers
{
    public class NychanisQueryHandler : BaseHandler
    {
        private const string ATTRIBUTE_KEY = "attr";
        private const string OPERATOR_KEY = "oper";
        private const string VALUE_KEY = "val";

        /// <summary>
        /// Enable response compression.
        /// </summary>
        public NychanisQueryHandler()
            : base(true)
        {
        }

        protected override void InternalGET(System.Web.HttpContext context, HandlerTimedCache cache)
        {
            IList<SecurityRole> roles = UserHelper.GetUserRoles(context.User.Identity.Name);
            //Get the paging parameters...
            int page = WebUtil.ParseIntParam(context, "page");
            int pageSize = WebUtil.ParseIntParam(context, "pageSize");

            // Check to see if this is a csv export request.  Runs the normal query (with no paging).
            bool csv = false;
            WebUtil.ParseOptionalBoolParam(context, "csv", ref csv);
            
            // If this is csv, we want all data - override any paging
            if (csv)
            {
                page = -1;
                pageSize = -1;
            }

            // Now get the ordering parameters, if specified.
            int sortCol = -1;
            WebUtil.ParseOptionalIntParam(context, "sortBy", ref sortCol);
            SortType? sortDir = null;
            if (sortCol >= 0)
            {
                // Default is ascending sort, passing false means descending.
                bool ascending = true;
                WebUtil.ParseOptionalBoolParam(context, "sortasc", ref ascending);
                sortDir = ascending ? SortType.Asc : SortType.Desc;
            }

            string indicatorId = WebUtil.GetParam(context, "indicator", false);
            NycResolutionType resolution = WebUtil.ParseEnumParam<NycResolutionType>(context, "resolution");
            NycTimeframeType timetype = WebUtil.ParseEnumParam<NycTimeframeType>(context, "timetype");
            int minyear = WebUtil.ParseIntParam(context, "minyear");
            int maxyear = WebUtil.ParseIntParam(context, "maxyear");

            // These two params are for "scope".  These should be "ActualId" not "UID".
            string borough = WebUtil.GetParam(context, "borough", true);
            string subborough = WebUtil.GetParam(context, "subborough", true);

            NycResultsWithMetadata list = NychanisHelper.Query(indicatorId, resolution, timetype, minyear, maxyear, borough, subborough, sortCol, sortDir, pageSize, page);

            // If this was a csv request, format it and return it instead
            if (csv)
            {
                // Generate actual csv data, determine if this is groupby'd or not
                string export = NychanisHelper.ResultsAsCsv(list, indicatorId);

                // Setup the response to handle this type of request
                context.Response.AddHeader("Content-Disposition", "attachment;filename=Furman_Center_Neighborhood_Info.csv");
                context.Response.ContentType = "text/csv";
                context.Response.Write(export);
                return;
            }
            // Return the results to the client
            context.Response.Write(WebUtil.ObjectToJson(list));
        }
    }
}

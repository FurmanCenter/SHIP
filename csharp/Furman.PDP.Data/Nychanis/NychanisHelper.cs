using System;
using System.Collections.Generic;
using System.IO;
using System.Text;
using Azavea.Open.Common;
using Azavea.Open.Common.Collections;
using Azavea.Open.DAO;
using Azavea.Open.DAO.Criteria;
using Azavea.Open.DAO.Criteria.Joins;
using Azavea.Open.DAO.CSV;
using log4net;

namespace Furman.PDP.Data.Nychanis
{
    /// <summary>
    /// This class contains all the methods used by the handlers to get Nychanis data.
    /// </summary>
    public static class NychanisHelper
    {
        private static readonly ILog _log = LogManager.GetLogger(
            new System.Diagnostics.StackTrace().GetFrame(0).GetMethod().DeclaringType.Namespace);

        private static readonly Azavea.Database.FastDAO<NycIndicator> _indicatorDao = new Azavea.Database.FastDAO<NycIndicator>("PDP.Data", "NYCHANIS");
        private static readonly Azavea.Database.FastDAO<NycGeography> _geogDao = new Azavea.Database.FastDAO<NycGeography>("PDP.Data", "NYCHANIS");
        private static readonly Azavea.Database.FastDAO<NycTimeframe> _timeDao = new Azavea.Database.FastDAO<NycTimeframe>("PDP.Data", "NYCHANIS");
        private static readonly Azavea.Database.FastDAO<NycDatum> _dataDao = new Azavea.Database.FastDAO<NycDatum>("PDP.Data", "NYCHANIS");
        private static readonly Azavea.Database.FastDAO<NycResolutionForIndicator> _resolutionDao = new Azavea.Database.FastDAO<NycResolutionForIndicator>("PDP.Data", "NYCHANIS");

        private const string _csvHeaderText = "New York City Neighborhood Information provided by the Furman Center, " + 
                                              "retrieved from http://www.furmancenter.org/data/search on <%DATE%>. " +
                                              "Terms can be found at http://www.furmancenter.org/data/disclaimer/.";

        /// <summary>
        /// Returns all the metadata, on times, indicators, geographies and resolutions,
        /// necessary for the client to set up its query interface, in a single call.
        /// </summary>
        /// <returns>Everything.</returns>
        public static NycQueryMetadata GetQueryMetadata()
        {
            NycQueryMetadata retVal = new NycQueryMetadata();
            retVal.Times = GetTimeMetadata();
            retVal.IndCats = GetIndicatorMetadata();
            retVal.Resolutions = GetResolutionMetadata();
            return retVal;
        }

        /// <summary>
        /// Returns metadata about all the types of time frames available.
        /// </summary>
        /// <returns></returns>
        public static IList<NycTimeResolution> GetTimeMetadata()
        {
            // Doesn't even make a DB call, since the time frame types are fixed.
            List<NycTimeResolution> retVal = new List<NycTimeResolution>();
            foreach (NycTimeframeType type in Enum.GetValues(typeof(NycTimeframeType)))
            {
                retVal.Add(new NycTimeResolution(type));
            }
            retVal.Sort();
            return retVal;
        }

        public static IDictionary<object, IDictionary<int, IDictionary<int, IList<int>>>> GetResolutionsByIndicator()
        {
            // First get the timeframes and make a dictionary for fast lookups.
            IDictionary<object, NycTimeframe> timesById = new Dictionary<object, NycTimeframe>();
            foreach (NycTimeframe time in _timeDao.Get())
            {
                timesById[time.UID] = time;
            }

            // Now get all the times available for every indicator at every resolution, and
            // organize them.  Start with dictionaries of years so we can easily avoid dupes.
            IDictionary<object, IDictionary<NycResolutionType, IDictionary<NycTimeframeType, IDictionary<int,int>>>> dictionaryPile =
                new Dictionary<object, IDictionary<NycResolutionType, IDictionary<NycTimeframeType, IDictionary<int,int>>>>();
            foreach (NycResolutionForIndicator res in _resolutionDao.Get())
            {
                IDictionary<NycResolutionType, IDictionary<NycTimeframeType, IDictionary<int, int>>> resForInd;
                if (dictionaryPile.ContainsKey(res.IndicatorId))
                {
                    resForInd = dictionaryPile[res.IndicatorId];
                }
                else
                {
                    resForInd = new Dictionary<NycResolutionType, IDictionary<NycTimeframeType, IDictionary<int, int>>>();
                    dictionaryPile[res.IndicatorId] = resForInd;
                }
                IDictionary<NycTimeframeType, IDictionary<int, int>> yearsByTimeType;
                if (resForInd.ContainsKey(res.Resolution))
                {
                    yearsByTimeType = resForInd[res.Resolution];
                }
                else
                {
                    yearsByTimeType = new Dictionary<NycTimeframeType, IDictionary<int, int>>();
                    resForInd[res.Resolution] = yearsByTimeType;
                }
                // This check is just to protect us from bad data, a time being claimed to be
                // supported in the indicator time list but not actually existing.
                if (timesById.ContainsKey(res.TimeId))
                {
                    NycTimeframe time = timesById[res.TimeId];
                    IDictionary<int, int> years;
                    if (yearsByTimeType.ContainsKey(time.Type))
                    {
                        years = yearsByTimeType[time.Type];
                    }
                    else
                    {
                        years = new Dictionary<int, int>();
                        yearsByTimeType[time.Type] = years;
                    }
                    years[time.Year] = time.Year; 
                }
            }
            // Now convert those dictionaries to lists and sort 'em.
            IDictionary<object, IDictionary<int, IDictionary<int, IList<int>>>> retVal =
                new Dictionary<object, IDictionary<int, IDictionary<int, IList<int>>>>();
            foreach (KeyValuePair<object,IDictionary<NycResolutionType, IDictionary<NycTimeframeType, IDictionary<int, int>>>> dict1 in dictionaryPile)
            {
                IDictionary<int, IDictionary<int, IList<int>>> list1 =
                    new Dictionary<int, IDictionary<int, IList<int>>>();
                foreach (KeyValuePair<NycResolutionType, IDictionary<NycTimeframeType, IDictionary<int, int>>> dict2 in dict1.Value)
                {
                    IDictionary<int, IList<int>> list2 =
                        new Dictionary<int, IList<int>>();
                    foreach (KeyValuePair<NycTimeframeType, IDictionary<int, int>> dict3 in dict2.Value)
                    {
                        List<int> list3 = new List<int>(dict3.Value.Keys);
                        list3.Sort();
                        list2[(int)dict3.Key] = list3;
                    }
                    list1[(int)dict2.Key] = list2;
                }
                retVal[dict1.Key] = list1;
            }
            return retVal;
        }

        /// <summary>
        /// Returns metadata about all the indicators available.
        /// </summary>
        /// <returns></returns>
        public static IList<NycIndicatorCategory> GetIndicatorMetadata()
        {
            IDictionary<string, IDictionary<string, IList<NycIndicator>>> groups =
                new CheckedDictionary<string, IDictionary<string, IList<NycIndicator>>>();

            // Get all the indicators and split 'em up.
            foreach (NycIndicator ind in _indicatorDao.Get())
            {
                IDictionary<string, IList<NycIndicator>> catGroup;
                if (groups.ContainsKey(ind.Category))
                {
                    catGroup = groups[ind.Category];
                }
                else
                {
                    catGroup = new CheckedDictionary<string, IList<NycIndicator>>();
                    groups[ind.Category] = catGroup;
                }
                IList<NycIndicator> subcatList;
                if (catGroup.ContainsKey(ind.SubCategory))
                {
                    subcatList = catGroup[ind.SubCategory];
                }
                else
                {
                    subcatList = new List<NycIndicator>();
                    catGroup[ind.SubCategory] = subcatList;
                }
                subcatList.Add(ind);
            }
            // Now they're all split up, create the returnable object types.
            // Remember it is impossible for any of the collections to be empty, since we created
            // them all based on records we had.
            List<NycIndicatorCategory> retVal = new List<NycIndicatorCategory>();
            foreach (IDictionary<string, IList<NycIndicator>> catGroup in groups.Values)
            {
                List<NycIndicatorSubCategory> subCats = new List<NycIndicatorSubCategory>();
                NycIndicator anIndicator = null;
                foreach (IList<NycIndicator> subcatList in catGroup.Values)
                {
                    subCats.Add(new NycIndicatorSubCategory(subcatList));
                    // save one indicator for the category info.
                    if (anIndicator == null)
                    {
                        anIndicator = subcatList[0];
                    }
                }
                retVal.Add(new NycIndicatorCategory(anIndicator, subCats));
            }
            retVal.Sort();

            // Now populate the available times based on resolutions for each indicator.
            IDictionary<object, IDictionary<int, IDictionary<int, IList<int>>>> resByIndic =
                GetResolutionsByIndicator();
            foreach (NycIndicatorCategory cat in retVal)
            {
                foreach (NycIndicatorSubCategory subCat in cat.SubCats)
                {
                    foreach (ThinNycIndicator indic in subCat.Indicators)
                    {
                        // Protect against bad data.
                        if (resByIndic.ContainsKey(indic.UID))
                        {
                            indic.AvailableYearsByResolution = resByIndic[indic.UID];
                        }
                    }
                }
            }
            return retVal;
        }

        /// <summary>
        /// Extracts the resolution metadata from the geograpy metadata.
        /// NOTE: At the moment there is no way to get resolution metadata by itself
        /// since it is not stored separately from geography metadata.
        /// </summary>
        /// <returns></returns>
        public static IList<NycResolution> GetResolutionMetadata()
        {
            // First get all the geographies, sorting as we do so.
            DaoCriteria crit = new DaoCriteria();
            crit.Orders.Add(new SortOrder("Order"));
            IList<NycGeography> geographies = _geogDao.Get(crit);

            // Now sort 'em up into groups by resolution.
            IDictionary<NycResolutionType, NycResolution> foundSoFar = new Dictionary<NycResolutionType, NycResolution>();
            foreach (NycGeography geog in geographies)
            {
                // Only construct a resolution object once per type found.
                if (!foundSoFar.ContainsKey(geog.Resolution))
                {
                    foundSoFar[geog.Resolution] = new NycResolution(geog);
                }
                else
                {
                    foundSoFar[geog.Resolution].Add(geog);
                }
            }
            List<NycResolution> retVal = new List<NycResolution>(foundSoFar.Values);
            // Don't need to sort the individual geographies because the DB call did that for us.
            retVal.Sort();
            return retVal;
        }

        /// <summary>
        /// Queries for Nychanis data for the specified year range, resolution, and indicator.
        /// </summary>
        /// <param name="indicatorId">ID of the indicator being queried.</param>
        /// <param name="resolutionType">What resolution are we querying for.</param>
        /// <param name="timeUnitType">What type of time units should the data be in?</param>
        /// <param name="startYear">First year to include in the results.</param>
        /// <param name="endYear">Last year to include in the results.</param>
        /// <param name="scopeSubborough"></param>
        /// <param name="scopeBorough"></param>
        /// <param name="orderCol">The column to sort by.</param>
        /// <param name="orderDir">The direction to sort, ignored if order is less than zero.  
        /// <param name="numPerPage">Number of records to be returned in the page sequence, if not less than zero</param>
        /// <param name="page">Which page in this page sequence is this request for.
        ///                        If null, assumed to be ascending.</param>
        /// <returns>The results!</returns>
        public static NycResultsWithMetadata Query(object indicatorId,
            NycResolutionType resolutionType, NycTimeframeType timeUnitType, int startYear, int endYear, 
            object scopeBorough, object scopeSubborough,
            int orderCol, SortType? orderDir, int numPerPage, int page)
        {
            NycResultsWithMetadata retVal = new NycResultsWithMetadata();
            // First load the indicator metadata, both because we need the display name, and because
            // if the query is for data that doesn't exist, we can skip a lot of work.
            NycIndicator indicator = GetIndicator(indicatorId);
            retVal.Indicator = indicator.Name;
            retVal.Resolution = resolutionType.ToString();
            // Now verify the query against the metadata.
            retVal.MinYear = (startYear < indicator.MinYear) ? indicator.MinYear : startYear;
            retVal.MaxYear = (endYear > indicator.MaxYear) ? indicator.MaxYear : endYear;
            bool validRequest = (retVal.MaxYear >= retVal.MinYear);
            if (!validRequest)
            {
                // Return a completely blank result object.
                return retVal;
            }

            // We only want to load time metadata for times this indicator actually has data for.
            DaoJoinCriteria joinCrit = new DaoJoinCriteria();
            joinCrit.RightCriteria = new DaoCriteria();
            joinCrit.RightCriteria.Expressions.Add(new EqualExpression("IndicatorId", indicatorId));
            joinCrit.RightCriteria.Expressions.Add(new EqualExpression("Resolution", resolutionType));
            joinCrit.Expressions.Add(new EqualJoinExpression("UID", "TimeId"));
            // Load the time metadata.
            joinCrit.LeftCriteria = new DaoCriteria();
            // These are not-ed so they are <= and >=;
            joinCrit.LeftCriteria.Expressions.Add(new GreaterExpression("Year", retVal.MaxYear, false));
            joinCrit.LeftCriteria.Expressions.Add(new LesserExpression("Year", retVal.MinYear, false));
            joinCrit.LeftCriteria.Expressions.Add(new EqualExpression("Type", timeUnitType));
            // Sort by value descending, so the most recent year comes first.
            joinCrit.Orders.Add(new JoinSortOrder("Value", SortType.Asc, true));
            List<JoinResult<NycTimeframe, NycResolutionForIndicator>> timeframes = _timeDao.Get(joinCrit, _resolutionDao);

            // We also need to know what all possible times are though, so we can render the fancy slider with appropriate gaps.
            joinCrit.LeftCriteria.Orders.Add(new SortOrder("Value", SortType.Asc));
            IList<NycTimeframe> allTimeframes = _timeDao.Get(joinCrit.LeftCriteria);

            // Use them to assemble the metadata, since one year is one column.
            retVal.Attrs = new List<AbstractNamedSortable>();
            retVal.Attrs.Add(new NycGeogColumnMetadata("Area"));
            IDictionary<object, int> colsByTimeId = new CheckedDictionary<object, int>();
            foreach (JoinResult<NycTimeframe, NycResolutionForIndicator> timeframe in timeframes)
            {
                colsByTimeId[timeframe.Left.UID] = retVal.Attrs.Count;
                retVal.Attrs.Add(new NycYearColumnMetadata(timeframe.Left, indicator.ValueType));
            }

            NycTableResults results = QueryNychanisData(indicatorId, resolutionType,
                scopeBorough, scopeSubborough, colsByTimeId);

            retVal.TotalResults = results.Values.Count;
            
            // Don't do any further processing if there are no results
            if (results.Values.Count == 0)
            {
                return retVal;
            }

            // If the user specified a sort order, use that, otherwise sort by the first column (area).
            List<KeyValuePair<int, SortType>> colSorts = new List<KeyValuePair<int, SortType>>();
            colSorts.Add(new KeyValuePair<int, SortType>(orderCol < 0 ? 0 : orderCol, orderDir ?? SortType.Asc));
            results.Values.Sort(new MultipleColumnListComparer(colSorts));

            // Truncate the results by the requested paging information
            retVal.Values = ResultsWithMetadata<AbstractNamedSortable>.GetPagedSubset(results.Values, numPerPage, page);

            // Now get context rows.  Always get City, unless we're querying for City.
            if (resolutionType != NycResolutionType.City)
            {
                List<IList<object>> contextRows = QueryNychanisData(indicatorId, NycResolutionType.City,
                                                                    null, null, colsByTimeId).Values;
                // Now, if they provided a borough scope and didn't ask for a borough resolution,
                // include borough.
                if ((resolutionType != NycResolutionType.Borough) && (scopeBorough != null))
                {
                    contextRows.AddRange(QueryNychanisData(indicatorId, NycResolutionType.Borough,
                                                           scopeBorough, null, colsByTimeId).Values);
                    // Then if not subborough but a subborough is provided, include that.
                    if ((resolutionType != NycResolutionType.SubBorough) && (scopeSubborough != null))
                    {
                        contextRows.AddRange(QueryNychanisData(indicatorId, NycResolutionType.SubBorough,
                                                               scopeBorough, scopeSubborough, colsByTimeId).Values);
                    }
                }
                retVal.ContextRows = contextRows;
            }
            // Now generate the map info for showing the results as a cloropleth layer.
            Config cfg = Config.GetConfig("PDP.Data");
            string sldHandlerUrl = cfg.GetParameter("Mapping", "SldHandlerURL");
            retVal.MapInfo = new NycMapInfo();
            retVal.MapInfo.Server = cfg.GetParameter("Mapping", "MapServerURL");
            retVal.MapInfo.Layers = new List<NycLayerInfo>();
            string layerName = Config.GetConfig("NYC.SLD").GetParameter("LayerNames", resolutionType.ToString(), null);
            // City doesn't have a map layer, so don't create any OL layers for it.
            if (layerName != null)
            {
                int possibleTimeIndex = 0;
                int actualTimeIndex = 0;
                while (possibleTimeIndex < allTimeframes.Count)
                {
                    // We need to pad out the list of layers with blanks for timeframes that lack data.
                    NycLayerInfo layer = new NycLayerInfo();
                    layer.Name = allTimeframes[possibleTimeIndex].Name;
                    // Years that actually have data go up faster than all years, so check if the current
                    // possible year is lower than the next actual year.
                    if (allTimeframes[possibleTimeIndex].Value < timeframes[actualTimeIndex].Left.Value)
                    {
                        // Need to pad with a blank, so just let the blank layer object be added.
                        // Increment the possible time index to the next timeframe.
                        possibleTimeIndex++;
                    }
                    else
                    {
                        NycTimeframe time = timeframes[actualTimeIndex].Left;

                        // I think this check is no longer necessary, since we're probably
                        // always excluding unavailable data.  But if it ain't broke...
                        if (results.DataAvailableByTime[actualTimeIndex])
                        {
                            layer.Config = new Dictionary<string, object>();
                            layer.Config["layers"] = layerName;
                            layer.Config["styles"] = "";
                            layer.Config["format"] = "image/png";
                            layer.Config["tiled"] = true;
                            layer.Config["srs"] = "EPSG:4326";
                            layer.Config["transparent"] = true;
                            StringBuilder sb = new StringBuilder(sldHandlerUrl);
                            sb.Append("?indicator=").Append(indicatorId);
                            sb.Append("&resolution=").Append(resolutionType.ToString());
                            sb.Append("&time=").Append(time.UID);
                            if (scopeBorough != null)
                            {
                                sb.Append("&borough=").Append(scopeBorough);
                                if (scopeSubborough != null)
                                {
                                    sb.Append("&subborough=").Append(scopeSubborough);
                                }
                            }
                            layer.Config["SLD"] = sb.ToString();
                        }
                        // Increment both indexes.
                        possibleTimeIndex++;
                        actualTimeIndex++;
                    }

                    retVal.MapInfo.Layers.Add(layer);
                }

                // If we are creating layers, we must create a legend to describe them
                retVal.LegendInfo = GenerateLegendList(indicator, resolutionType);

            }
            return retVal;
        }

        private static NycIndicator GetIndicator(object indicatorId)
        {
            IList<NycIndicator> indicatorList = _indicatorDao.Get("UID", indicatorId);
            if (indicatorList.Count != 1)
            {
                throw new ArgumentException("Indicator " + indicatorId + " does not seem to exist.");
            }
            return indicatorList[0];
        }

        private static NycTableResults QueryNychanisData(object indicatorId,
            NycResolutionType resolutionType,
            object scopeBorough, object scopeSubborough, IDictionary<object, int> colsByTimeId)
        {
            // Query both the geography and data tables in a join so we can get the
            // nice display name of the geography rather than just the ID.  NOTE: This could
            // be done by obtaining the geographies in a single query then the data in a second
            // query.  At the moment this seems better.
            DaoJoinCriteria joinCrit = new DaoJoinCriteria();
            joinCrit.Expressions.Add(new EqualJoinExpression("GeographyId", "UID"));
            // Add filters to the data (left) side of the join.
            DaoCriteria dataCrit = new DaoCriteria();
            joinCrit.LeftCriteria = dataCrit;
            // Only the indicator that was requested.
            dataCrit.Expressions.Add(new EqualExpression("IndicatorId", indicatorId));
            // Only the resolution that was requested.
            dataCrit.Expressions.Add(new EqualExpression("Resolution", resolutionType));
            // Only the time span that was requested.
            dataCrit.Expressions.Add(new PropertyInListExpression("TimeId", colsByTimeId.Keys));

            // Add support for querying for a single borough or subborough, "scope"
            DaoCriteria scopeCrit = new DaoCriteria();
            if (scopeBorough != null)
            {
                scopeCrit.Expressions.Add(new EqualExpression("Borough", scopeBorough));
                if (scopeSubborough != null)
                {
                    scopeCrit.Expressions.Add(new EqualExpression("SubBorough", scopeSubborough));
                }
            }

            // If we added any expressions, add the criteria to the geography side of the join
            if (scopeCrit.Expressions.Count > 0)
            {
                joinCrit.RightCriteria = scopeCrit;
            }

            // Sort the results by geography then by time (descending).  This allows us to populate
            // the results structure easily, even if we later resort based on the user's choice.
            // We sort first by geography name, which "should" be unique, but just in case we also
            // sort by geography ID.
            joinCrit.Orders.Add(new JoinSortOrder("Name", false));
            joinCrit.Orders.Add(new JoinSortOrder("GeographyId", true));
            joinCrit.Orders.Add(new JoinSortOrder("TimeId", SortType.Desc, true));

            IList<JoinResult<NycDatum, NycGeography>> dataAndGeogs = _dataDao.Get(joinCrit, _geogDao);

            NycTableResults results = new NycTableResults();
            List<IList<object>> values = new List<IList<object>>();
            // Now, for each geography ID, add all its year values to a list and add to the values collection.
            if (dataAndGeogs.Count > 0)
            {
                object lastGeogId = null;
                IList<object> resultArray = null;
                IList<bool> dataAvailableByTime = new bool[colsByTimeId.Count];

                foreach (JoinResult<NycDatum, NycGeography> result in dataAndGeogs)
                {
                    if ((lastGeogId == null) || (!lastGeogId.Equals(result.Left.GeographyId)))
                    {
                        // Create a new array, at the correct length already in case there
                        // are holes in the data.
                        resultArray = new object[colsByTimeId.Count + 1];
                        resultArray[0] = result.Right.Name;
                        lastGeogId = result.Left.GeographyId;
                        // Add it to the list to be returned.
                        values.Add(resultArray);
                    }
                    // Always populate this value in the array.
                    resultArray[colsByTimeId[result.Left.TimeId]] = result.Left.Value;
                    dataAvailableByTime[colsByTimeId[result.Left.TimeId]-1] = true;
                }

                results.DataAvailableByTime = dataAvailableByTime;
            }
            results.Values = values;

            return results;
        }

        /// <summary>
        /// Queries for Nychanis data for the specified year range, resolution, and indicator.
        /// </summary>
        /// <param name="indicatorId">ID of the indicator being queried.</param>
        /// <param name="resolutionType">What resolution are we querying for.</param>
        /// <param name="timeUnitType">What type of time units should the data be in?</param>
        /// <param name="startYear">First year to include in the results.</param>
        /// <param name="endYear">Last year to include in the results.</param>
        public static NycResultsWithMetadata Query(object indicatorId,
            NycResolutionType resolutionType, NycTimeframeType timeUnitType, int startYear, int endYear)
        {
            // Overload with default ordering
            return Query(indicatorId, resolutionType, timeUnitType, startYear, endYear,null,null,0, SortType.Asc, -1, -1);
        }

        /// <summary>
        /// Convert a Pdb Property quert result into a CSV string.
        /// </summary>
        /// <param name="result">The result to convert</param>
        /// <param name="indicatorId">Indicator Id that represtents this export</param>
        /// <returns>A string of comma seperated values, with header row and 
        ///          escaped with "" around strings</returns>
        public static string ResultsAsCsv(NycResultsWithMetadata result, string indicatorId)
        {
            
            StringWriter writer = new StringWriter();

            List<ClassMapColDefinition> colMap = new List<ClassMapColDefinition>();

            // Additional Header properties
            NycIndicator indicator = GetIndicator(indicatorId);
            colMap.Add(new ClassMapColDefinition(_csvHeaderText, _csvHeaderText.Replace("<%DATE%>", DateTime.Now.ToShortDateString()), null));
            colMap.Add(new ClassMapColDefinition("Indicator", "Indicator", null));
            colMap.Add(new ClassMapColDefinition("Description", "Description", null));

            // Some hardcoded values need to be added to each row
            Dictionary<String, String> valuesToStuff = new Dictionary<string, string>();
            valuesToStuff.Add("Indicator", result.Indicator);
            valuesToStuff.Add("Description", indicator.Description);

            // Create some column mappings by looping through the attributes
            foreach (AbstractNamedSortable attr in result.Attrs)
            {
                // Only add it if we've got something
                if (attr.Name != null)
                {
                    string displayName = attr.Name == "Area" ? result.Resolution : attr.Name;
                    colMap.Add(new ClassMapColDefinition(attr.Name, displayName, null));
                }
            }

            ClassMapping map = new ClassMapping("csv", "csv", colMap, false);
            DictionaryDao csvDao = new DictionaryDao(new CsvDescriptor(writer, CsvQuoteLevel.QuoteAlways), map);

            List<CheckedDictionary<string, object>> list = new List<CheckedDictionary<string, object>>();

            if (result.ContextRows != null)
            {
                // Add context rows
                AddValuesToDictionary(result, list, result.ContextRows, valuesToStuff);
            }
            if (result.Values != null)
            {
                // Add value rows
                AddValuesToDictionary(result, list, result.Values, valuesToStuff);
            }

            // If there were no results, just give them nothing
            if (list.Count == 0)
            {
                return "";
            }
            // Add these values to the csv writer
            csvDao.Insert(list);

            // Return our result
            return writer.ToString();
        }

        /// <summary>
        /// Add values into a dictionary
        /// </summary>
        /// <param name="result"></param>
        /// <param name="list"></param>
        /// <param name="values"></param>
        /// <param name="valuesToStuff">If there are hardcoded values to stuff into dictionary, add a column name/value pair here</param>
        private static void AddValuesToDictionary(NycResultsWithMetadata result,
            ICollection<CheckedDictionary<string, object>> list, IEnumerable<IList<object>> values, 
            Dictionary<String, String> valuesToStuff )
        {
            CheckedDictionary<string, object> dic;
            foreach (object[] val in values)
            {
                // Loop through the attributes we have, and get the values
                dic = new CheckedDictionary<string, object>();
                for (int i = 0; i < result.Attrs.Count; i++)
                {
                    // Get name/val pairs 
                    string name = result.Attrs[i].Name;
                    dic.Add(name, val[i]);
                }

                // If there are values to stuff into this dictionary, do it here
                foreach (KeyValuePair<String, String> row in valuesToStuff)
                {
                    dic.Add(row.Key, row.Value);
                }

                // Add the whole dictionary to a list of dictionaries
                list.Add(dic);
            }
        }

        /// <summary>
        /// Generates a list of label/color pairs with which one can create a legend
        /// </summary>
        /// <returns></returns>
        public static NycLegendInfo GenerateLegendList(NycIndicator indicator, NycResolutionType resolution)
        {
            NycLegendInfo retVal = new NycLegendInfo();
            // Get the color and breakpoint information from the config file
            Config cfg = Config.GetConfig("NYC.SLD");

            retVal.Opacity = cfg.GetParameter("Polygons", "Opacity");
            retVal.ValueType = (indicator.ValueType == null) ? null : indicator.ValueType.ToString();

            IList<KeyValuePair<string, string>> paramList = cfg.GetParametersAsList(indicator.UseAlternateColors ? "AlternateBreakpoints" : "BreakPoints");
            retVal.Elements = new List<NycLegendElement>();

            // Loop through each named breakpoint and get a list of associated colors
            float absoluteMinVal;
            float absoluteMaxVal;
            switch (indicator.Breakpoint)
            {
                case NycBreakpointType.HistoricalBreakpoint:
                    switch (resolution)
                    {
                        case NycResolutionType.Borough:
                            absoluteMinVal = indicator.HistoricBoroughMin;
                            absoluteMaxVal = indicator.HistoricBoroughMax;
                            break;
                        case NycResolutionType.CensusTract:
                            absoluteMinVal = indicator.HistoricCensusTractMin;
                            absoluteMaxVal = indicator.HistoricCensusTractMax;
                            break;
                        case NycResolutionType.City:
                            absoluteMinVal = indicator.HistoricCityMin;
                            absoluteMaxVal = indicator.HistoricCityMax;
                            break;
                        case NycResolutionType.CommunityDistrict:
                            absoluteMinVal = indicator.HistoricCommunityDistrictMin;
                            absoluteMaxVal = indicator.HistoricCommunityDistrictMax;
                            break;
                        case NycResolutionType.PolicePrecinct:
                            absoluteMinVal = indicator.HistoricPolicePrecinctMin;
                            absoluteMaxVal = indicator.HistoricPolicePrecinctMax;
                            break;
                        case NycResolutionType.SchoolDistrict:
                            absoluteMinVal = indicator.HistoricSchoolDistrictMin;
                            absoluteMaxVal = indicator.HistoricSchoolDistrictMax;
                            break;
                        case NycResolutionType.SubBorough:
                            absoluteMinVal = indicator.HistoricSubBoroughMin;
                            absoluteMaxVal = indicator.HistoricSubBoroughMax;
                            break;
                        default:
                            throw new NotSupportedException("Resolution type " + resolution + " isn't supported yet.");
                    }
                    break;
                case NycBreakpointType.ContemporaryBreakpoint:
                    switch (resolution)
                    {
                        case NycResolutionType.Borough:
                            absoluteMinVal = indicator.ContemporaryBoroughMin;
                            absoluteMaxVal = indicator.ContemporaryBoroughMax;
                            break;
                        case NycResolutionType.CensusTract:
                            absoluteMinVal = indicator.ContemporaryCensusTractMin;
                            absoluteMaxVal = indicator.ContemporaryCensusTractMax;
                            break;
                        case NycResolutionType.City:
                            absoluteMinVal = indicator.ContemporaryCityMin;
                            absoluteMaxVal = indicator.ContemporaryCityMax;
                            break;
                        case NycResolutionType.CommunityDistrict:
                            absoluteMinVal = indicator.ContemporaryCommunityDistrictMin;
                            absoluteMaxVal = indicator.ContemporaryCommunityDistrictMax;
                            break;
                        case NycResolutionType.PolicePrecinct:
                            absoluteMinVal = indicator.ContemporaryPolicePrecinctMin;
                            absoluteMaxVal = indicator.ContemporaryPolicePrecinctMax;
                            break;
                        case NycResolutionType.SchoolDistrict:
                            absoluteMinVal = indicator.ContemporarySchoolDistrictMin;
                            absoluteMaxVal = indicator.ContemporarySchoolDistrictMax;
                            break;
                        case NycResolutionType.SubBorough:
                            absoluteMinVal = indicator.ContemporarySubBoroughMin;
                            absoluteMaxVal = indicator.ContemporarySubBoroughMax;
                            break;
                        default:
                            throw new NotSupportedException("Resolution type " + resolution + " isn't supported yet.");
                    }
                    break;
                default:
                    throw new NotSupportedException("Breakpoint type " + indicator.Breakpoint + " isn't supported yet.");
            }
            float totalRange = absoluteMaxVal - absoluteMinVal;
            for (int i=0; i < paramList.Count; i++ )
            {
                NycLegendElement element = new NycLegendElement();
                element.Color = paramList[i].Value;
                // Always start at the absolute min val.
                element.MinValue = absoluteMinVal;
                // If this is after the first one, add the fraction of the range.
                if (i > 0)
                {
                    element.MinValue += ((float.Parse(paramList[i].Key) / 100.0f) * totalRange);
                }

                if (i + 1 < paramList.Count)
                {
                    // This isn't the last element, so use the next one to get the range.
                    element.MaxValue = ((float.Parse(paramList[i + 1].Key) / 100.0f) * totalRange) + absoluteMinVal;
                } 
                else
                {
                    // Last element, so always use the absolute max value.
                    element.MaxValue = absoluteMaxVal;
                }

                // Add our range and color
                retVal.Elements.Add(element);
            }

            return retVal;
        }

        /// <summary>
        /// Runs a query for the data for a particular indicator/resolution/time,
        /// and generates an SLD to color the geographies correctly based on the values.
        /// </summary>
        /// <param name="indicatorId"></param>
        /// <param name="resolutionType"></param>
        /// <param name="timeId"></param>
        /// <param name="scopeBorough"></param>
        /// <param name="scopeSubborough"></param>
        /// <returns></returns>
        public static string GenerateSld(object indicatorId, NycResolutionType resolutionType,
            object timeId, object scopeBorough, object scopeSubborough)
        {
            // First load the indicator metadata, both because we need the info, and because
            // if the query is for data that doesn't exist, we can skip a lot of work.
            NycIndicator indicator = GetIndicator(indicatorId);
            // Don't validate time, since there's no easy way to do it other than querying and seeing
            // if we get anything.

            // Now load the configs that tell us what color to render everything as.
            Config cfg = Config.GetConfig("NYC.SLD");
            // Acceptable values are 0 to 100.  So we need a 101 length array.
            string[] colors = new string[101];
            string color = null;
            IDictionary<string, IList<object>> geogIdsByColor = new CheckedDictionary<string, IList<object>>();
            for (int x = 0; x < colors.Length; x++)
            {
                // If the value isn't in the config, use the same as the last value.
                color = cfg.GetParameter(indicator.UseAlternateColors ? "AlternateBreakpoints" : "BreakPoints",
                    x.ToString(), color);
                // Make sure we have a list created for the geogs that will be this color.
                if ((color != null) && (!geogIdsByColor.ContainsKey(color)))
                {
                    geogIdsByColor[color] = new List<object>();
                }
                colors[x] = color;
            }

            string mapLayerName = cfg.GetParameter("LayerNames", resolutionType.ToString(), null);
            string layerGeogIdField = cfg.GetParameter("LayerGeographyIdFields", resolutionType.ToString(), null);
            string layerDisplayNameField = cfg.GetParameter("LayerDisplayNameFields", resolutionType.ToString(), null);

            // This includes any labeling and outlines, default background color, etc.
            StringBuilder sldRules = new StringBuilder(cfg.GetConfigInnerXml("DefaultSLD"));
            // Replace any tokens with the appropriate values for this layer.
            sldRules.Replace("{LayerName}", mapLayerName);
            sldRules.Replace("{LayerGeographyIdField}", layerGeogIdField);
            sldRules.Replace("{LayerDisplayNameField}", layerDisplayNameField);

            // If no map layer is defined (I.E. "City"), or the request is invalid in some way,
            // use just the default SLD.
            if (mapLayerName != null)
            {
                // Now query for all the data.
                DaoCriteria crit = new DaoCriteria();
                crit.Expressions.Add(new EqualExpression("IndicatorId", indicatorId));
                crit.Expressions.Add(new EqualExpression("Resolution", resolutionType));
                crit.Expressions.Add(new EqualExpression("TimeId", timeId));
                DaoCriteria geogCrit = null;
                if (scopeBorough != null)
                {
                    geogCrit = new DaoCriteria();
                    geogCrit.Expressions.Add(new EqualExpression("Borough", scopeBorough));
                    if (scopeSubborough != null)
                    {
                        geogCrit.Expressions.Add(new EqualExpression("SubBorough", scopeSubborough));
                    }
                }
                if (geogCrit != null)
                {
                    // Scope and/or subscope was defined.
                    geogCrit.Expressions.Add(new EqualExpression("Resolution", resolutionType));
                    IList<object> geogIdsInScope = new List<object>();
                    foreach (NycGeography geog in _geogDao.Get(geogCrit))
                    {
                        geogIdsInScope.Add(geog.UID);
                    }
                    crit.Expressions.Add(new PropertyInListExpression("GeographyId", geogIdsInScope));
                }
                IList<NycDatum> data = _dataDao.Get(crit);

                // If there's no data, don't make any SLD rules.
                if ((data != null) && (data.Count > 0))
                {
                    foreach (NycDatum datum in data)
                    {
                        int val;
                        switch (indicator.Breakpoint)
                        {
                            case NycBreakpointType.HistoricalBreakpoint:
                                val = datum.HistoricalBreakpoint;
                                break;
                            case NycBreakpointType.ContemporaryBreakpoint:
                                val = datum.ContemporaryBreakpoint;
                                break;
                            default:
                                throw new ArgumentOutOfRangeException("Indicator " + indicator +
                                                                      " has invalid breakpoint: " + indicator.Breakpoint);
                        }
                        if ((val < 0) || (val > 100))
                        {
                            _log.Warn("'Normalized' value " + datum + " was outside 0-100 range.");
                        }

                        // Figure out, based on the value, which color group it belongs to.
                        string thisColor = colors[val];
                        if (thisColor != null)
                        {
                            // Put it in that group.
                            geogIdsByColor[thisColor].Add(datum.GeographyId);
                        }
                    }

                    // Now append the rules for those color groups.
                    foreach (KeyValuePair<string, IList<object>> kvp in geogIdsByColor)
                    {
                        // Only add rules for colors that actually have values.
                        if (kvp.Value.Count > 0)
                        {
                            sldRules.Append("<Rule>");

                            // The part that says what geography IDs get this color.
                            sldRules.Append("<ogc:Filter>");
                            sldRules.Append("<ogc:Or>");
                            foreach (object geogId in kvp.Value)
                            {
                                sldRules.Append("<ogc:PropertyIsEqualTo>");
                                sldRules.Append("<ogc:PropertyName>").Append(layerGeogIdField).Append(
                                    "</ogc:PropertyName>");
                                sldRules.Append("<ogc:Literal>").Append(geogId).Append("</ogc:Literal>");
                                sldRules.Append("</ogc:PropertyIsEqualTo>");
                            }
                            sldRules.Append("</ogc:Or>");
                            sldRules.Append("</ogc:Filter>");

                            // The part that says what color to fill with.
                            sldRules.Append("<PolygonSymbolizer>");
                            sldRules.Append("<Fill>");
                            sldRules.Append("<CssParameter name=\"fill\">").Append(kvp.Key).Append("</CssParameter>");
                            sldRules.Append("<CssParameter name=\"fill-opacity\">").Append(
                                cfg.GetParameter("Polygons", "Opacity")).Append("</CssParameter>");
                            sldRules.Append("</Fill>");
                            sldRules.Append("</PolygonSymbolizer>");

                            sldRules.Append("</Rule>");
                        }
                    }
                }
            }
            // Now wrap all the rendering rules in the SLD outer tags.
            StringBuilder sld = new StringBuilder();
            sld.Append("<?xml version=\"1.0\" encoding=\"ISO-8859-1\"?>\n")
                .Append("<StyledLayerDescriptor version=\"1.0.0\"")
                .Append(" xsi:schemaLocation=\"http://www.opengis.net/sld StyledLayerDescriptor.xsd\"")
                .Append(" xmlns=\"http://www.opengis.net/sld\"")
                .Append(" xmlns:ogc=\"http://www.opengis.net/ogc\"")
                .Append(" xmlns:xlink=\"http://www.w3.org/1999/xlink\"")
                .Append(" xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\">")
                .Append("<NamedLayer>")
                .Append("<Name>").Append(mapLayerName).Append("</Name>")
                .Append("<UserStyle>")
                .Append("<FeatureTypeStyle>")
                .Append(sldRules.ToString())
                .Append("</FeatureTypeStyle>")
                .Append("</UserStyle>")
                .Append("</NamedLayer>")
                .Append("</StyledLayerDescriptor>");

            return sld.ToString();
        }
    }
}

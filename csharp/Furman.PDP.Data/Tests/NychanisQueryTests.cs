using System;
using System.Collections.Generic;
using Azavea.Open.Common;
using Furman.PDP.Data.Nychanis;
using NUnit.Framework;
using Azavea.Open.DAO.Criteria;

namespace Furman.PDP.Data.Tests
{
    /// <exclude/>
    [TestFixture]
    public class NychanisQueryTests
    {
        private static readonly Azavea.Database.FastDAO<NycIndicator> _indicatorDao = new Azavea.Database.FastDAO<NycIndicator>("PDP.Data", "NYCHANIS");
        /// <exclude/>
        [Test]
        public void TestBasicGet()
        {
            object indicatorId = 10;
            NycResultsWithMetadata results =
                NychanisHelper.Query(indicatorId, NycResolutionType.Borough, NycTimeframeType.Year, 1970, 2020);
            DumpResults(results);
            Assert.AreEqual(5, results.TotalResults, "Wrong value for TotalResults.");
            Assert.AreEqual(results.TotalResults, results.Values.Count, "Number of values didn't match TotalResults.");
            Assert.AreEqual("Housing Units", results.Indicator, "Results claimed to be for the wrong indicator.");
            Assert.AreEqual(NycResolutionType.Borough.ToString(), results.Resolution, "Results claimed to be for the wrong resolution.");
            Assert.AreEqual(2009, results.MaxYear, "Results claimed to end at the wrong year.");
            Assert.AreEqual(2000, results.MinYear, "Results claimed to start at the wrong year.");
            Assert.AreEqual(7, results.Attrs.Count, "Wrong number of columns (cols = years)");
        }

        /// <exclude/>
        [Test]
        public void TestGetWithYearGaps()
        {
            object indicatorId = 1;
            NycResultsWithMetadata results =
                NychanisHelper.Query(indicatorId, NycResolutionType.Borough, NycTimeframeType.Year, 1970, 2020);
            DumpResults(results);
            Assert.AreEqual(5, results.TotalResults, "Wrong value for TotalResults.");
            Assert.AreEqual(results.TotalResults, results.Values.Count, "Number of values didn't match TotalResults.");
            Assert.AreEqual("Condominiums, Owner Occupied or For Sale", results.Indicator, "Results claimed to be for the wrong indicator.");
            Assert.AreEqual(NycResolutionType.Borough.ToString(), results.Resolution, "Results claimed to be for the wrong resolution.");
            Assert.AreEqual(2008, results.MaxYear, "Results claimed to end at the wrong year.");
            Assert.AreEqual(2002, results.MinYear, "Results claimed to start at the wrong year.");
            // There should just be the area column, then 2002, 2005, and 2008.
            Assert.AreEqual(4, results.Attrs.Count, "Wrong number of columns (cols = years)");
        }

        [Test]
        public void TestOrderedResults()
        {
            object indicatorId = 10;
            int sortCol = 0;
            SortType type = SortType.Desc;
            NycResultsWithMetadata results =
                NychanisHelper.Query(indicatorId, NycResolutionType.Borough, NycTimeframeType.Year, 1970, 2020, null, null, sortCol, type, -1, -1);
            DumpResults(results);
            AssertOrdering(results.Values, sortCol, type);
        }
        [Test]
        public void TestPaging()
        {
            object indicatorId = 10;
            int numPerPage = 10;

            // Note that page numbering is 1-based.
            NycResultsWithMetadata page1 = NychanisHelper.Query(indicatorId, NycResolutionType.SubBorough, NycTimeframeType.Year, 1999, 2009, null, null, 0, SortType.Asc, numPerPage, 1);
            NycResultsWithMetadata page2 = NychanisHelper.Query(indicatorId, NycResolutionType.SubBorough, NycTimeframeType.Year, 1999, 2009, null, null, 0, SortType.Asc, numPerPage, 2);
            NycResultsWithMetadata page5 = NychanisHelper.Query(indicatorId, NycResolutionType.SubBorough, NycTimeframeType.Year, 1999, 2009, null, null, 0, SortType.Asc, numPerPage, 5);

            // Should be the same number regardless of the page, but they shouldn't be the same.

            Assert.AreEqual(numPerPage, page1.Values.Count, "Wrong number of results for page 1.");
            Assert.AreEqual(numPerPage, page2.Values.Count, "Wrong number of results for page 2.");
            Assert.AreEqual(numPerPage, page5.Values.Count, "Wrong number of results for page 5.");
            
            Assert.AreNotEqual(page1.Values[0][1], page2.Values[0][1], "Page 1 and 2 had the same first object.");
            Assert.AreNotEqual(page1.Values[0][1], page5.Values[0][1], "Page 1 and 50 had the same first object.");
            Assert.AreNotEqual(page2.Values[0][1], page5.Values[0][1], "Page 2 and 50 had the same first object.");
            Assert.Greater(page1.TotalResults, numPerPage, "Total results should have been higher than what is returned on page 1.");
            Assert.Greater(page2.TotalResults, numPerPage, "Total results should have been higher than what is returned on page 2.");
            Assert.Greater(page5.TotalResults, numPerPage, "Total results should have been higher than what is returned on page 50.");
        }

        [Test]
        public void TestPagingPastTheEnd()
        {
            // Should return nothing.
            object indicatorId = 10;
            int numPerPage = 10;
            NycResultsWithMetadata page500 = NychanisHelper.Query(indicatorId, NycResolutionType.SubBorough, NycTimeframeType.Year, 1999, 2009, null, null, 0, SortType.Asc, numPerPage, 500);
            Assert.AreEqual(0, page500.Values.Count, "Page 500 should be past the end, so we should get no results.");
            Assert.Greater(page500.TotalResults, numPerPage, "Total results should have been higher than what is returned on page 500.");
 
        }
        [Test]
        public void TestScopeByBorough()
        {
            object indicatorId = 10;
            int borough = 3;
            NycResultsWithMetadata results = NychanisHelper.Query(indicatorId, NycResolutionType.Borough, NycTimeframeType.Year, 1999, 2009, 
                                            borough, null, 0, SortType.Asc, -1, -1);
            Assert.AreEqual(1, results.Values.Count, "Wrong value for Total Results, a single borough [Manhattan] should have been returned");
            Assert.AreEqual("Manhattan", results.Values[0][0], "Results should have been limited to Manhattan, but were not.");

            
        }
        [Test]
        public void TestScopeByBoroughAndSubborough()
        {
            object indicatorId = 10;
            int borough = 3; // Manhattan
            int subbourough = 308; // Central Harlem
            NycResultsWithMetadata results = NychanisHelper.Query(indicatorId, NycResolutionType.SubBorough, NycTimeframeType.Year, 1999, 2009,
                                            borough, subbourough, 0, SortType.Asc, -1, -1);
            Assert.AreEqual(1, results.Values.Count, "Wrong value for Total Results, a single SBA [Central Harlem] should have been returned.");
            Assert.AreEqual("Central Harlem", results.Values[0][0], "Results should have been limited to Central Harlem, but were not.");
        }
        [Test]
        public void TestContextRowsCity()
        {
            object indicatorId = 201;
            NycResultsWithMetadata results = NychanisHelper.Query(indicatorId, NycResolutionType.City, NycTimeframeType.Year, 1999, 2009,
                                            null, null, 0, SortType.Asc, -1, -1);
            Assert.IsNull(results.ContextRows, "City should have no context rows.");
        }
        [Test]
        public void TestContextRowsNoScope()
        {
            object indicatorId = 201;
            NycResultsWithMetadata results = NychanisHelper.Query(indicatorId, NycResolutionType.CensusTract, NycTimeframeType.Year, 1999, 2009,
                                            null, null, 0, SortType.Asc, -1, -1);
            Assert.IsNotNull(results.ContextRows, "Context rows should be populated.");
            Assert.AreEqual(1, results.ContextRows.Count, "Should have a context row.");
            Assert.AreEqual("New York City", results.ContextRows[0][0], "Should be a context row for NY (city).");
        }
        [Test]
        public void TestContextRowsBorough()
        {
            object indicatorId = 201;
            int borough = 3; // Manhattan
            NycResultsWithMetadata results = NychanisHelper.Query(indicatorId, NycResolutionType.CensusTract, NycTimeframeType.Year, 1999, 2009,
                                            borough, null, 0, SortType.Asc, -1, -1);
            Assert.IsNotNull(results.ContextRows, "Context rows should be populated.");
            Assert.AreEqual(2, results.ContextRows.Count, "Should have a context row.");
            Assert.AreEqual("New York City", results.ContextRows[0][0], "Should be a context row for NY (city).");
            Assert.AreEqual("Manhattan", results.ContextRows[1][0], "Should be a context row for Manhattan (borough).");
        }
        [Test]
        public void TestContextRowsBoroughAndSBA()
        {
            object indicatorId = 201;
            int borough = 3; // Manhattan
            int subbourough = 308; // Central Harlem
            NycResultsWithMetadata results = NychanisHelper.Query(indicatorId, NycResolutionType.CensusTract, NycTimeframeType.Year, 1999, 2009,
                                            borough, subbourough, 0, SortType.Asc, -1, -1);
            Assert.IsNotNull(results.ContextRows, "Context rows should be populated.");
            Assert.AreEqual(3, results.ContextRows.Count, "Should have a context row.");
            Assert.AreEqual("New York City", results.ContextRows[0][0], "Should be a context row for NY (city).");
            Assert.AreEqual("Manhattan", results.ContextRows[1][0], "Should be a context row for Manhattan (borough).");
            Assert.AreEqual("Central Harlem", results.ContextRows[2][0], "Should be a context row for Central Harlem (SBA).");
        }
        [Test]
        public void TestMapLegendNoScope()
        {
            object indicatorId = 201;
            NycResultsWithMetadata results = NychanisHelper.Query(indicatorId, NycResolutionType.CensusTract, NycTimeframeType.Year, 2005, 2008,
                                            null, null, 0, SortType.Asc, -1, -1);
            Assert.IsNotNull(results.LegendInfo, "Should have a Legend.");
            Assert.Greater(results.LegendInfo.Elements.Count, 0, "Legend should have more than 0 values");

        }

        [Test]
        public void TestMapLegendBorough()
        {
            object indicatorId = 201;
            int borough = 3; // Manhattan
            NycResultsWithMetadata results = NychanisHelper.Query(indicatorId, NycResolutionType.CensusTract, NycTimeframeType.Year, 2005, 2008,
                                            borough, null, 0, SortType.Asc, -1, -1);
            Assert.IsNotNull(results.LegendInfo, "Should have a Legend.");
            Assert.Greater(results.LegendInfo.Elements.Count, 0, "Legend should have more than 0 values");

        }
        [Test]
        public void TestMapLegendSubBorough()
        {
            object indicatorId = 201;
            int borough = 3; // Manhattan
            int subbourough = 308; // Central Harlem
            NycResultsWithMetadata results = NychanisHelper.Query(indicatorId, NycResolutionType.CensusTract, NycTimeframeType.Year, 2005, 2008,
                                            borough, subbourough, 0, SortType.Asc, -1, -1);
            Assert.IsNotNull(results.LegendInfo, "Should have a Legend.");
            Assert.Greater(results.LegendInfo.Elements.Count, 0, "Legend should have more than 0 values");

        }
        [Test]
        public void TestMapLayersNoScope()
        {
            object indicatorId = 201;
            NycResultsWithMetadata results = NychanisHelper.Query(indicatorId, NycResolutionType.CensusTract, NycTimeframeType.Year, 2005, 2008,
                                            null, null, 0, SortType.Asc, -1, -1);
            Assert.IsNotNull(results.MapInfo, "Map stuff should be populated.");
            Assert.AreEqual(results.MapInfo.Server, "http://207.245.89.220:8080/geoserver/wms", "Wrong map server URL.");
            Assert.IsNotNull(results.MapInfo.Layers, "Should have a list of layers.");
            Assert.AreEqual(4, results.MapInfo.Layers.Count, "Wrong number of layers: " + StringHelper.Join(results.MapInfo.Layers));

            Assert.AreEqual("2005", results.MapInfo.Layers[0].Name, "Wrong name for layer 0.");
            Assert.IsNull(results.MapInfo.Layers[0].Config, "Should NOT have a config for layer 0");

            Assert.AreEqual("2006", results.MapInfo.Layers[1].Name, "Wrong name for layer 1.");
            Assert.IsNotNull(results.MapInfo.Layers[1].Config, "Should have a config for layer 1");
            string sld = (string)results.MapInfo.Layers[1].Config["SLD"];
            Assert.IsNotNull(sld, "Should have an SLD for layer 1");
            Assert.AreEqual("http://localhost/pdp/handlers/NychanisSldHandler.ashx?indicator=201&resolution=CensusTract&time=201",
                sld, "Wrong SLD URL for layer 1");
            string layerName = (string)results.MapInfo.Layers[1].Config["layers"];
            Assert.IsNotNull(layerName, "Should have a layer for layer 1");
            Assert.AreEqual("fc:census_tracts", layerName, "Wrong layer name for layer 1");

            Assert.AreEqual("2007", results.MapInfo.Layers[2].Name, "Wrong name for layer 2.");
            Assert.IsNotNull(results.MapInfo.Layers[2].Config, "Should have a config for layer 2");
            sld = (string)results.MapInfo.Layers[2].Config["SLD"];
            Assert.IsNotNull(sld, "Should have an SLD for layer 2");
            Assert.AreEqual("http://localhost/pdp/handlers/NychanisSldHandler.ashx?indicator=201&resolution=CensusTract&time=206",
                sld, "Wrong SLD URL for layer 2");
            layerName = (string)results.MapInfo.Layers[1].Config["layers"];
            Assert.IsNotNull(layerName, "Should have a layer for layer 2");
            Assert.AreEqual("fc:census_tracts", layerName, "Wrong layer name for layer 2");

            Assert.AreEqual("2008", results.MapInfo.Layers[3].Name, "Wrong name for layer 3.");
            Assert.IsNotNull(results.MapInfo.Layers[3].Config, "Should have a config for layer 3");
            sld = (string)results.MapInfo.Layers[3].Config["SLD"];
            Assert.IsNotNull(sld, "Should have an SLD for layer 3");
            Assert.AreEqual("http://localhost/pdp/handlers/NychanisSldHandler.ashx?indicator=201&resolution=CensusTract&time=211", 
                sld, "Wrong SLD URL for layer 3");
            layerName = (string)results.MapInfo.Layers[3].Config["layers"];
            Assert.IsNotNull(layerName, "Should have a layer for layer 3");
            Assert.AreEqual("fc:census_tracts", layerName, "Wrong layer name for layer 3");
                       
        }
        [Test]
        public void TestMapLayersBorough()
        {
            object indicatorId = 201;
            int borough = 3; // Manhattan
            NycResultsWithMetadata results = NychanisHelper.Query(indicatorId, NycResolutionType.CensusTract, NycTimeframeType.Year, 2005, 2008,
                                            borough, null, 0, SortType.Asc, -1, -1);
            Assert.IsNotNull(results.MapInfo, "Map stuff should be populated.");
            Assert.AreEqual(results.MapInfo.Server, "http://207.245.89.220:8080/geoserver/wms", "Wrong map server URL.");
            Assert.IsNotNull(results.MapInfo.Layers, "Should have a list of layers.");
            Assert.AreEqual(4, results.MapInfo.Layers.Count, "Wrong number of layers: " + StringHelper.Join(results.MapInfo.Layers));
            string sld = (string)results.MapInfo.Layers[3].Config["SLD"];
            Assert.IsNotNull(sld, "Should have an SLD for layer 3");
            Assert.AreEqual("http://localhost/pdp/handlers/NychanisSldHandler.ashx?indicator=201&resolution=CensusTract&time=211&borough=3",
                sld, "Wrong SLD URL for layer 3");
            string layerName = (string)results.MapInfo.Layers[3].Config["layers"];
            Assert.IsNotNull(layerName, "Should have a layer for layer 3");
            Assert.AreEqual("fc:census_tracts", layerName, "Wrong layer name for layer 3");
        }
        [Test]
        public void TestMapLayersBoroughAndSBA()
        {
            object indicatorId = 201;
            int borough = 3; // Manhattan
            int subbourough = 308; // Central Harlem
            NycResultsWithMetadata results = NychanisHelper.Query(indicatorId, NycResolutionType.CensusTract, NycTimeframeType.Year, 2005, 2008,
                                            borough, subbourough, 0, SortType.Asc, -1, -1);
            Assert.IsNotNull(results.MapInfo, "Map stuff should be populated.");
            Assert.AreEqual(results.MapInfo.Server, "http://207.245.89.220:8080/geoserver/wms", "Wrong map server URL.");
            Assert.IsNotNull(results.MapInfo.Layers, "Should have a list of layers.");
            Assert.AreEqual(4, results.MapInfo.Layers.Count, "Wrong number of layers: " + StringHelper.Join(results.MapInfo.Layers));
            string sld = (string)results.MapInfo.Layers[3].Config["SLD"];
            Assert.IsNotNull(sld, "Should have an SLD for layer 3");
            Assert.AreEqual("http://localhost/pdp/handlers/NychanisSldHandler.ashx?indicator=201&resolution=CensusTract&time=211&borough=3&subborough=308",
                sld, "Wrong SLD URL for layer 3");
            string layerName = (string)results.MapInfo.Layers[3].Config["layers"];
            Assert.IsNotNull(layerName, "Should have a layer for layer 3");
            Assert.AreEqual("fc:census_tracts", layerName, "Wrong layer name for layer 3");
        }

        [Test]
        public void TestCsvExport()
        {
            object indicatorId = 201;
            int borough = 3; // Manhattan
            int subbourough = 308; // Central Harlem
            NycResultsWithMetadata results = NychanisHelper.Query(indicatorId, NycResolutionType.CensusTract, NycTimeframeType.Year, 1999, 2009,
                                            borough, subbourough, 0, SortType.Asc, -1, -1);

            string csv = NychanisHelper.ResultsAsCsv(results, indicatorId.ToString());
            Assert.IsNotEmpty(csv, "CSV Export should be populated.");
        }

        [Test]
        public void TestLegendList()
        {
            NycLegendInfo info = NychanisHelper.GenerateLegendList(_indicatorDao.GetFirst("UID", 201), NycResolutionType.Borough);
            Assert.AreEqual("percent", info.ValueType, "Wrong type for values.");
            Assert.IsNotNull(info, "Legend info was null.");
            Assert.IsNotNull(info.Elements, "Elements list was null.");
            AssertLegendValueList(new float[] { 2.52f, 4.20f, 5.79f, 7.47f, 9.06f, 10.75f, 12.43f }, info);
        }

        private static void AssertLegendValueList(float[] expected, NycLegendInfo info)
        {
            Console.WriteLine("Legend elements: " + StringHelper.Join(info.Elements));
            Assert.AreEqual(expected.Length - 1, info.Elements.Count, "Wrong number of legend elements.");
            for (int x = 0; x < (expected.Length - 1); x++)
            {
                float expectedMinVal = expected[x];
                float expectedMaxVal = expected[x + 1];
                Assert.Greater(info.Elements[x].MinValue, expectedMinVal - 0.1, "Min val " + x + " was too low.");
                Assert.Less(info.Elements[x].MinValue, expectedMinVal + 0.1, "Min val " + x + " was too high.");
                Assert.Greater(info.Elements[x].MaxValue, expectedMaxVal - 0.1, "Max val " + x + " was too low.");
                Assert.Less(info.Elements[x].MaxValue, expectedMaxVal + 0.1, "Max val " + x + " was too high.");
            }
        }
        private void AssertOrdering(IList<IList<object>> results, int col, SortType type)
        {
            IComparable lastVal = null;
            foreach (IList<object> obj in results)
            {
                IComparable thisVal = (IComparable)obj[col];
                if (lastVal != null)
                {
                    switch (type)
                    {
                        case SortType.Asc:
                            Assert.Less(lastVal.CompareTo(thisVal), 1,
                                        "Next value (" + thisVal + ") should be greater than or equal to the last one (" +
                                        lastVal + ").");
                            break;
                        case SortType.Desc:
                            Assert.Greater(lastVal.CompareTo(thisVal), -1,
                                        "Next value (" + thisVal + ") should be less than or equal to the last one (" +
                                        lastVal + ").");
                            break;
                        default:
                            throw new Exception("Unsupported sort type: " + type);
                    }
                }
                lastVal = thisVal;
            }
        }

        private static void DumpResults(NycResultsWithMetadata results)
        {
            Console.WriteLine("Indicator: " + results.Indicator + ", Resolution: " + results.Resolution +
                ", Years: " + results.MinYear + "-" + results.MaxYear);
            PropertyTests.DumpResultsWithMetadata(results);
        }
    }
}

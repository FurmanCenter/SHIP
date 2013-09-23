using System;
using System.Collections;
using System.Collections.Generic;
using Furman.PDP.Data.Nychanis;
using NUnit.Framework;

namespace Furman.PDP.Data.Tests
{
    /// <exclude/>
    [TestFixture]
    public class NychanisMetadataTests
    {
        /// <exclude/>
        [Test]
        public void TestGetTimeMetadata()
        {
            IList<NycTimeResolution> data = NychanisHelper.GetTimeMetadata();
            DumpResults(data);
            Assert.AreEqual(3, data.Count, "Wrong number of timeframes.");
        }
        /// <exclude/>
        [Test]
        public void TestGetIndicatorMetadata()
        {
            IList<NycIndicatorCategory> data = NychanisHelper.GetIndicatorMetadata();
            foreach (NycIndicatorCategory cat in data)
            {
                Console.WriteLine(cat);
                foreach (NycIndicatorSubCategory subCat in cat.SubCats)
                {
                    Console.WriteLine("    " + subCat);
                    DumpResults(subCat.Indicators, "       ");
                    Assert.Greater(subCat.Indicators.Count, 0, "Should have been some indicators.");
                }
                Assert.Greater(cat.SubCats.Count, 0, "Should have been some subcategories.");
            }
            Assert.AreEqual(16, data.Count, "Wrong number of categories.");
        }
        /// <exclude/>
        [Test]
        public void TestGetResolutionMetadata()
        {
            IList<NycResolution> data = NychanisHelper.GetResolutionMetadata();
            foreach (NycResolution res in data)
            {
                Console.WriteLine(res);
                DumpResults(res.Geographies, "    ");
                Assert.Greater(res.Geographies.Count, 0, "Should have been some geographies.");
            }
            Assert.AreEqual(Enum.GetValues(typeof(NycResolutionType)).Length, data.Count,
                "Wrong number of resolutions.");
        }

        private static void DumpResults(IEnumerable data)
        {
            DumpResults(data, null);
        }
        private static void DumpResults(IEnumerable data, string prefix)
        {
            if (data == null)
            {
                Console.WriteLine("Null results.");
            }
            else
            {
                int x = 0;
                foreach (object datum in data)
                {
                    string val = datum == null ? "<null>" : datum.ToString();
                    Console.WriteLine((prefix ?? "") + x.ToString().PadLeft(5) + ": " + val);
                    x++;
                }
            }
        }
    }
}

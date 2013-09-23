using System;
using Furman.PDP.Data.Nychanis;
using NUnit.Framework;

namespace Furman.PDP.Data.Tests
{
    /// <exclude/>
    [TestFixture]
    public class NychanisSldTests
    {
        /// <exclude/>
        [Test]
        public void TestSld2()
        {
            object indicatorId = 362;
            object timeId = 0;
            string sld = NychanisHelper.GenerateSld(indicatorId, NycResolutionType.SubBorough,
                timeId, null, null);
            Console.WriteLine(sld);
            Assert.IsNotNull(sld, "Got null SLD.");
            Assert.Greater(sld.Length, 500, "SLD should be a large blob of XML...");
            Assert.Less(sld.Length, 2000, "SLD should be a large blob of XML...");
        }
        /// <exclude/>
        [Test]
        public void TestSld()
        {
            object indicatorId = 201;
            object timeId = 181;
            string sld = NychanisHelper.GenerateSld(indicatorId, NycResolutionType.CensusTract,
                timeId, null, null);
            Console.WriteLine(sld);
            Assert.IsNotNull(sld, "Got null SLD.");
            Assert.Greater(sld.Length, 100000, "SLD should be a large blob of XML...");
            Assert.Less(sld.Length, 1000000, "SLD should be a large blob of XML...");
        }
        /// <exclude/>
        [Test]
        public void TestSldWithScope()
        {
            object indicatorId = 201;
            object timeId = 181;
            int borough = 3; // Manhattan
            string sld = NychanisHelper.GenerateSld(indicatorId, NycResolutionType.CensusTract, 
                timeId, borough, null);
            Console.WriteLine(sld);
            Assert.IsNotNull(sld, "Got null SLD.");
            Assert.Greater(sld.Length, 10000, "SLD should be a medium blob of XML...");
            Assert.Less(sld.Length, 100000, "SLD should be a medium blob of XML...");
        }
        /// <exclude/>
        [Test]
        public void TestSldWithSubScope()
        {
            object indicatorId = 201;
            object timeId = 181;
            int borough = 3; // Manhattan
            int subbourough = 308; // Central Harlem
            string sld = NychanisHelper.GenerateSld(indicatorId, NycResolutionType.CensusTract, 
                timeId, borough, subbourough);
            Console.WriteLine(sld);
            Assert.IsNotNull(sld, "Got null SLD.");
            Assert.Greater(sld.Length, 1000, "SLD should be a small blob of XML...");
            Assert.Less(sld.Length, 10000, "SLD should be a small blob of XML...");
        }
    }
}

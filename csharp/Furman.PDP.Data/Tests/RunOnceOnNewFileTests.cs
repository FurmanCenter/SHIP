using System;
using System.Collections.Generic;
using Azavea.Database;
using Azavea.Open.Common;
using Azavea.Open.DAO.Criteria;
using Furman.PDP.Data.Nychanis;
using Furman.PDP.Data.PDB;
using NUnit.Framework;

namespace Furman.PDP.Data.Tests
{
    /// <exclude/>
    [TestFixture]
    public class RunOnceOnNewFileTests
    {
        /// <exclude/>
        [Ignore("Run this whenever a new data file has been received from the Furman Center, it will delete records we don't need for the unit tests.")]
        [Test]
        public void TestGetPrimaryMetadataForEveryone()
        {
            // Blow away excessive nychanis data.
            FastDAO<NycDatum> dataDao = new FastDAO<NycDatum>("PDP.Data", "NYCHANIS");
            DaoCriteria crit = new DaoCriteria();
            crit.Expressions.Add(new EqualExpression("IndicatorId", 201, false));
            crit.Expressions.Add(new GreaterExpression("IndicatorId", 10));
            dataDao.Delete(crit);

            // And also excessive PDB data.
            PdbTwoTableHelper helper = new PdbTwoTableHelper(Config.GetConfig("PDP.Data"), "Properties",
                PdbEntityType.Properties);
            DictionaryDao primaryPdbDao = new DictionaryDao(
                dataDao.ConnDesc, helper.GetClassMapForPrimaryTable(new SecurityRole[] { SecurityRole.@public }));
            FastDAO<PdbSecondaryTableProperty> secondaryPdbDao = new FastDAO<PdbSecondaryTableProperty>(
                dataDao.ConnDesc, helper.GetClassMapForSecondaryTable());

            crit.Expressions.Clear();
            crit.Expressions.Add(new GreaterExpression("UID", 100630));
            primaryPdbDao.Delete(crit);
            crit.Expressions.Clear();
            crit.Expressions.Add(new GreaterExpression("ForeignKey", 100630));
            secondaryPdbDao.Delete(crit);
        }
    }
}

using System.Collections.Generic;

namespace Furman.PDP.Data.Nychanis
{
    /// <summary>
    /// Nychanis table results as a list of rows, where a rows is an 
    /// ordered array of values.
    /// </summary>
    public class NycTableResults
    {
        /// <summary>
        /// The Nychanis query values. A list of rows, where each row has an array of values.
        /// </summary>
        public List<IList<object>> Values;

        /// <summary>
        /// An IList that maps to the time columns. If true, data exist in that
        /// time column.  If false, it does not exist.
        /// </summary>
        public IList<bool> DataAvailableByTime;
    }
}

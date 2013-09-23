namespace Furman.PDP.Data.Nychanis
{
    /// <summary>
    /// Base class with all the common fields.
    /// </summary>
    public abstract class AbstractNycIndicator : AbstractNamedSortable
    {
        /// <summary>
        /// Unique ID.
        /// </summary>
        public object UID;
        /// <summary>
        /// A verbose description that can be offered to the user.
        /// </summary>
        public string Description;
        /// <summary>
        /// Money, year, text, etc.
        /// </summary>
        public NycValueType? ValueType;
        /// <summary>
        /// Number of decimal places to display to the user.
        /// </summary>
        public int NumDecimals;

        /// <summary>
        /// Default constructor.
        /// </summary>
        protected AbstractNycIndicator()
        {
        }
        /// <summary>
        /// Copy constructor.
        /// </summary>
        /// <param name="other"></param>
        protected AbstractNycIndicator(AbstractNycIndicator other)
        {
            Name = other.Name;
            Order = other.Order;
            UID = other.UID;
            Description = other.Description;
            ValueType = other.ValueType;
            NumDecimals = other.NumDecimals;
        }
    }
}
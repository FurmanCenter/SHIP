namespace Furman.PDP.Data.Nychanis
{
    /// <summary>
    /// Represents a single color shown on the legend, with associated info.
    /// </summary>
    public class NycLegendElement
    {
        /// <summary>
        /// The color, with the hash symbol (I.E. "#FFFFFF").
        /// </summary>
        public string Color;
        /// <summary>
        /// Minimum value that will be this color.  Inclusive.
        /// </summary>
        public float MinValue;
        /// <summary>
        /// Maximum value that will be this color.  Inclusive.
        /// </summary>
        public float MaxValue;

        public override string ToString()
        {
            return MinValue + " - " + MaxValue + ": " + Color;
        }
    }
}
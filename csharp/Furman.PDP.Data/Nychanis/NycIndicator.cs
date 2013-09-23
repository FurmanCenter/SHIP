namespace Furman.PDP.Data.Nychanis
{
    /// <summary>
    /// The "thing" being measured, I.E. poverty rate, or property sales, etc.
    /// </summary>
    public class NycIndicator : AbstractNycIndicator
    {
        /// <summary>
        /// Used for grouping related properties.
        /// </summary>
        public string Category;
        /// <summary>
        /// A "subgrouping" within categories that may be excessively large.
        /// Corresponds to "Grouping".
        /// </summary>
        public string SubCategory;
        /// <summary>
        /// What order should this attribute's category be displayed in for the criteria list?
        /// </summary>
        public int FilterCatOrder;
        /// <summary>
        /// What order should this attribute's subcategory be displayed in for the criteria list
        /// within the category?
        /// </summary>
        public int FilterSubCatOrder;
        /// <summary>
        /// Certain indicators have high = good, others have low = good, so sometimes
        /// we want to invert the colors used for the color ramp.
        /// </summary>
        public bool UseAlternateColors;
        /// <summary>
        /// Minimum year for which data is available for this indicator.
        /// </summary>
        public int MinYear;
        /// <summary>
        /// Maximum year for which data is available for this indicator.
        /// </summary>
        public int MaxYear;
        /// <summary>
        /// Which set of breakpoint data do we use for this indicator?
        /// </summary>
        public NycBreakpointType Breakpoint;

        /// <summary>
        /// Min/Max values for this indicator (across all years) at the given resolution.
        /// </summary>
        public float HistoricBoroughMin;
        /// <summary>
        /// Min/Max values for this indicator (across all years) at the given resolution.
        /// </summary>
        public float HistoricBoroughMax;
        /// <summary>
        /// Min/Max values for this indicator (across all years) at the given resolution.
        /// </summary>
        public float HistoricCommunityDistrictMin;
        /// <summary>
        /// Min/Max values for this indicator (across all years) at the given resolution.
        /// </summary>
        public float HistoricCommunityDistrictMax;
        /// <summary>
        /// Min/Max values for this indicator (across all years) at the given resolution.
        /// </summary>
        public float HistoricCensusTractMin;
        /// <summary>
        /// Min/Max values for this indicator (across all years) at the given resolution.
        /// </summary>
        public float HistoricCensusTractMax;
        /// <summary>
        /// Min/Max values for this indicator (across all years) at the given resolution.
        /// </summary>
        public float HistoricPolicePrecinctMin;
        /// <summary>
        /// Min/Max values for this indicator (across all years) at the given resolution.
        /// </summary>
        public float HistoricPolicePrecinctMax;
        /// <summary>
        /// Min/Max values for this indicator (across all years) at the given resolution.
        /// </summary>
        public float HistoricCityMin;
        /// <summary>
        /// Min/Max values for this indicator (across all years) at the given resolution.
        /// </summary>
        public float HistoricCityMax;
        /// <summary>
        /// Min/Max values for this indicator (across all years) at the given resolution.
        /// </summary>
        public float HistoricSubBoroughMin;
        /// <summary>
        /// Min/Max values for this indicator (across all years) at the given resolution.
        /// </summary>
        public float HistoricSubBoroughMax;
        /// <summary>
        /// Min/Max values for this indicator (across all years) at the given resolution.
        /// </summary>
        public float HistoricSchoolDistrictMin;
        /// <summary>
        /// Min/Max values for this indicator (across all years) at the given resolution.
        /// </summary>
        public float HistoricSchoolDistrictMax;

        /// <summary>
        /// No data provided yet so this will be the same as historic.
        /// </summary>
        public float ContemporaryBoroughMin;
        /// <summary>
        /// No data provided yet so this will be the same as historic.
        /// </summary>
        public float ContemporaryBoroughMax;
        /// <summary>
        /// No data provided yet so this will be the same as historic.
        /// </summary>
        public float ContemporaryCommunityDistrictMin;
        /// <summary>
        /// No data provided yet so this will be the same as historic.
        /// </summary>
        public float ContemporaryCommunityDistrictMax;
        /// <summary>
        /// No data provided yet so this will be the same as historic.
        /// </summary>
        public float ContemporaryCensusTractMin;
        /// <summary>
        /// No data provided yet so this will be the same as historic.
        /// </summary>
        public float ContemporaryCensusTractMax;
        /// <summary>
        /// No data provided yet so this will be the same as historic.
        /// </summary>
        public float ContemporaryPolicePrecinctMin;
        /// <summary>
        /// No data provided yet so this will be the same as historic.
        /// </summary>
        public float ContemporaryPolicePrecinctMax;
        /// <summary>
        /// No data provided yet so this will be the same as historic.
        /// </summary>
        public float ContemporaryCityMin;
        /// <summary>
        /// No data provided yet so this will be the same as historic.
        /// </summary>
        public float ContemporaryCityMax;
        /// <summary>
        /// No data provided yet so this will be the same as historic.
        /// </summary>
        public float ContemporarySubBoroughMin;
        /// <summary>
        /// No data provided yet so this will be the same as historic.
        /// </summary>
        public float ContemporarySubBoroughMax;
        /// <summary>
        /// No data provided yet so this will be the same as historic.
        /// </summary>
        public float ContemporarySchoolDistrictMin;
        /// <summary>
        /// No data provided yet so this will be the same as historic.
        /// </summary>
        public float ContemporarySchoolDistrictMax;
    }
}
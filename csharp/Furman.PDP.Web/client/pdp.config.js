(function(P) {
    P.Config = {
        Outlines: {
            Server: 'http://207.245.89.220:8080/geoserver/wms',
            Layers: {
                    Borough: { Name: 'Borough', Config: {layers: 'fc:boroughs', styles: 'fc_default', format: 'image/png', tiled: true, srs: 'EPSG:4326', transparent: true } },
                    Subborough: { Name: 'Subborough Area', Config: {layers: 'fc:sbas', styles: 'fc_default', format: 'image/png', tiled: true, srs: 'EPSG:4326', transparent: true } },
                    CD: { Name: 'Community District', Config: {layers: 'fc:community_districts', styles: 'fc_default', format: 'image/png', tiled: true, srs: 'EPSG:4326', transparent: true } },
                    Police: { Name: 'Police Precinct', Config: {layers: 'fc:police_precincts', styles: 'fc_default', format: 'image/png', tiled: true, srs: 'EPSG:4326', transparent: true } },
                    School: { Name: 'School District', Config: {layers: 'fc:school_districts', styles: 'fc_default', format: 'image/png', tiled: true, srs: 'EPSG:4326', transparent: true } },
                    Census: { Name: 'Census Tract', Config: {layers: 'fc:census_tracts', styles: 'fc_census', format: 'image/png', tiled: true, srs: 'EPSG:4326', transparent: true } },
					CityCouncil: { Name: 'City Council District', Config: {layers: 'fc:city_council', styles: 'fc_default', format: 'image/png', tiled: true, srs: 'EPSG:4326', transparent: true } },
					Congressional: { Name: 'Congressional District', Config: {layers: 'fc:congressional_district', styles: 'fc_default', format: 'image/png', tiled: true, srs: 'EPSG:4326', transparent: true } },
					Health: { Name: 'Health Center District', Config: {layers: 'fc:health_center', styles: 'fc_default', format: 'image/png', tiled: true, srs: 'EPSG:4326', transparent: true } },
					Municipal: { Name: 'Municipal Court District', Config: {layers: 'fc:municipal_court', styles: 'fc_default', format: 'image/png', tiled: true, srs: 'EPSG:4326', transparent: true } },
					StateAssembly: { Name: 'State Assembly District', Config: {layers: 'fc:state_assembly', styles: 'fc_default', format: 'image/png', tiled: true, srs: 'EPSG:4326', transparent: true } },
					StateSenate: { Name: 'State Senate District', Config: {layers: 'fc:state_senate', styles: 'fc_default', format: 'image/png', tiled: true, srs: 'EPSG:4326', transparent: true } }
                }
            }
    };
})(PDP);

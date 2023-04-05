import React, { useState } from 'react';
import { GoogleMap, useJsApiLoader , useLoadScript, MarkerF, InfoWindow, } from "@react-google-maps/api";
import './css/GoogleMapEntity.css'

function GoogleMapEntity() {
    function Map() {
        return (
            <GoogleMap
                zoom={12}
                mapContainerClassName="map-container"
                id='map'
                center={{ lat: 47.62, lng: -122.203}}
            >
            </GoogleMap>
        )
    }

    const googleMapsApiKey = process.env.REACT_APP_GOOGLE_MAPS_API_KEY
    const { isLoaded } = useJsApiLoader({
        googleMapsApiKey: googleMapsApiKey,
        libraries: ['places']
    });

    
    if (!isLoaded) return <div>Loading</div>
    return <Map />;

}

export default GoogleMapEntity



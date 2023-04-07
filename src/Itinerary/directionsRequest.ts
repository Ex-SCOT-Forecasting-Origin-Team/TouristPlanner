export interface DirectionsRequest {
    origin: string | google.maps.LatLng | google.maps.Place;
    destination: string | google.maps.LatLng | google.maps.Place;
    transitOptions: google.maps.TransitOptions;
    travelMode: google.maps.TravelMode;
  }
import { Site } from '../Model/site';

/** 
 * Calculate distance and time from origin to destinations
 * 
 * {
          "distance": {
            "text": "1,886 km",
            "value": 1885966
          },
          "duration": {
            "text": "21 hours 24 mins",
            "value": 77011
          },
          "status": "OK"
        },
        {
          "distance": {
            "text": "1,262 km",
            "value": 1262498
          },
          "duration": {
            "text": "13 hours 36 mins",
            "value": 48964
          },
          "status": "OK"
        }
 */
export function calculateDistanceTime(method: google.maps.TravelMode, origin: Site, destinations: Site[]) {
    const service = new google.maps.DistanceMatrixService();
    const request = getRequest(method, origin, destinations);

    let ret = new Array();
    service.getDistanceMatrix(request).then((response) => {
        const rows = response.rows;
        if (rows.length !== 1) {
            throw new Error("One origin is specified but multiple rows are returned. ")
        }

        const elts = rows[0].elements;
        for (let dest = 0; dest < elts.length; ++dest) {
            ret.push(elts[dest]);
        }
    })
    
    return ret;
};

function getRequest(method: google.maps.TravelMode, origin: Site, destinations: Site[]) {
    let destLatLng = new Array();
    for (let dest = 0; dest < destinations.length; ++dest) {
        destLatLng.push({
            lat: destinations[dest].getLatitude(), 
            lng: destinations[dest].getLongitude()
        });
    }

    return {
        origins: [{
            lat: origin.getLatitude(), 
            lng: origin.getLongitude()
        }],
        destinations: destLatLng,
        travelMode: method,
        unitSystem: google.maps.UnitSystem.METRIC,
        avoidHighways: false,
        avoidTolls: false,
    };

};



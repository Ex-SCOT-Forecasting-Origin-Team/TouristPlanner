import { Site } from '../Model/site';

/** 
 * Calculate distance and time from origin to destinations
 * 
 * {
 *       {
          "distance": {
            "text": "1,886 km",
            "value": 1885966
          },
          "duration": {
            "text": "21 hours 24 mins",
            "value": 77011 (seconds)
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
            "value": 48964 (seconds)
          },
          "status": "OK"
        }
 */
export function calculateDistanceTime(method: google.maps.TravelMode, destinations: Site[]) {
    const service = new google.maps.DistanceMatrixService();
    const request = getRequest(method, destinations);

    let ret = new Array();
    service.getDistanceMatrix(request).then((response) => {
        const rows = response.rows;
        if (rows.length !== destinations.length) {
            throw new Error("Returned value does not match destination length . ")
        }

        for (let origin = 0; origin < rows.length; ++origin) {
          let row = new Array();
          for (let dest = 0; dest < rows[0].elements.length; ++dest) {
            row.push(rows[origin].elements[dest]);
          }
          ret.push(row);
        }
    })
    
    return ret;
};

function getRequest(method: google.maps.TravelMode,  destinations: Site[]) {
    let destLatLng = new Array();
    for (let dest = 0; dest < destinations.length; ++dest) {
        destLatLng.push(destinations[dest].getCoordinate());
    }

    return {
        origins: destLatLng,
        destinations: destLatLng,
        travelMode: method,
        unitSystem: google.maps.UnitSystem.METRIC,
        avoidHighways: false,
        avoidTolls: false,
    };

};



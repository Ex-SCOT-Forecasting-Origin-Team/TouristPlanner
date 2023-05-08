class Site {
    private name: String;
    private coordinate: google.maps.LatLng;
    private openingHours: google.maps.places.PlaceOpeningHoursPeriod[] | null;

    constructor(name: String, coordinate: google.maps.LatLng, openingHours: google.maps.places.PlaceOpeningHoursPeriod[] | null) {
        this.name = name;
        this.coordinate = coordinate;

        if (openingHours === null) {
            this.openingHours = null;
        } else {
            this.openingHours = new Array(openingHours.length);
            for (let day = 0; day < openingHours.length; ++day) {
                this.openingHours[day] = openingHours[day];
            }
        }
    }

    public getName(): String {
        return this.name;
    }
    public getCoordinate(): google.maps.LatLng {
        return this.coordinate;
    }
    public getOpeningHours(): google.maps.places.PlaceOpeningHoursPeriod[] | null{
        return this.openingHours;
    }
}

export { Site };

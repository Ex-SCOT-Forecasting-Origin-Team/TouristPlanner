
class Site {
    private name: string;
    private latitude: number;
    private longitude: number;
    private openingHours: google.maps.places.PlaceOpeningHoursPeriod[] | null;

    constructor(name: string, lat: number, lng: number, openingHours: google.maps.places.PlaceOpeningHoursPeriod[] | null) {
        this.name = name;

        this.latitude = lat;
        this.longitude = lng;

        if(openingHours === null){
            this.openingHours = null;
        } else {
            this.openingHours = new Array(openingHours.length);
            for (let day = 0; day < openingHours.length; ++day) {
                this.openingHours[day] = openingHours[day];
            }
        }
    }

    public getName(): string {
        return this.name;
    }
    public getLatitude(): number {
        return this.latitude;
    }
    public getLongitude(): number {
        return this.longitude;
    }
    public getOpeningHours(): google.maps.places.PlaceOpeningHoursPeriod[] | null {
        return this.openingHours;
    }
}

export { Site };

class Site {
    private name: string;
    private latitude: number;
    private longitude: number;
    private openingHours: google.maps.places.OpeningHoursPeriod[];

    constructor(name: string, lat: number, lng: number, openingHours: google.maps.places.OpeningHoursPeriod[]) {
        this.name = name;

        this.latitude = lat;
        this.longitude = lng;

        this.openingHours = new Array(openingHours.length);
        for (let day = 0; day < openingHours.length; ++day) {
            this.openingHours[day] = openingHours[day];
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
    public getOpeningHours(): google.maps.places.OpeningHoursPeriod[] {
        return this.openingHours;
    }
}

export { Site };
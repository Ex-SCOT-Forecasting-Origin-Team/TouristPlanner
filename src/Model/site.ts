
class Site {
    name: string;
    coordinate: [number, number];
    openingHours: google.maps.places.OpeningHoursPeriod[];

    constructor(name: string, coordinate: [number, number], openingHours: google.maps.places.OpeningHoursPeriod[]) {
        this.name = name;

        this.coordinate = [0, 0];
        this.coordinate[0] = coordinate[0];
        this.coordinate[1] = coordinate[1];

        this.openingHours = new Array(openingHours.length);
        for (let day = 0; day < openingHours.length; ++day) {
            this.openingHours[day] = openingHours[day];
        }
    }
}

export { Site };
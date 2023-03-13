import { Site } from "./site";

class Constraint {
    site: Site;
    visitTime: Date;
    duration: Number;

    constructor(site : Site, visitTime: Date, duration: Number) {
        this.site = new Site(site.name, site.coordinate, site.openingHours);
        this.visitTime = new Date(visitTime);
        this.duration = new Number(duration);
    }
}

export { Constraint };
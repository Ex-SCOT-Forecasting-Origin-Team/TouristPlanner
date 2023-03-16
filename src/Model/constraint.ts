import { Site } from "./site";

class Constraint {
    private site: Site;
    private visitTime: Date;
    private duration: Number;

    constructor(site : Site, visitTime: Date, duration: Number) {
        this.site = new Site(site.getName(), site.getLatitude(), site.getLongitude(), site.getOpeningHours());
        this.visitTime = new Date(visitTime);
        this.duration = new Number(duration);
    }
}

export { Constraint };
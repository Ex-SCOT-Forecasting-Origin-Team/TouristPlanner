import { Site } from "./site";

class Constraint {
    private site: Site;
    private visitTime: String;
    private duration: Number;

    constructor(site : Site, visitTime: String, duration: Number) {
        this.site = new Site(site.getName(), site.getCoordinate(), site.getOpeningHours());
        this.visitTime = visitTime
        this.duration = new Number(duration);
    }

    public getVisitTime(): String {
        return this.visitTime;
    }
    public getDuration(): Number {
        return this.duration;
    }
    public getSite(): Site {
        return this.site;
    }
}

export { Constraint };
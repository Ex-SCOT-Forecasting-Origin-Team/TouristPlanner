import { Site } from "./site";

class Constraint {
    private site: Site;
    private visitTime: String;
    private duration: number; // in seconds

    // visitTime of null and duration of -1 mean no constraint
    constructor(site : Site, visitTime: String, duration: number) {
        this.site = new Site(site.getName(), site.getCoordinate(), site.getOpeningHours());
        this.visitTime = visitTime;
        this.duration = duration;
    }

    public getSite(): Site {
        return this.site;
    }

    public getVisitTime(): String {
        return this.visitTime;
    }

    public getDuration(): number {
        return this.duration;
    }

}

export { Constraint };
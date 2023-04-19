import { Site } from "./site";

class Schedule {
    private site: Site;
    private visitTime: String;
    private leaveTime : String;
    private commuteMethod: String;

    constructor(site: Site, visitTime: String, leaveTime: String, commuteMethod: String) {
        this.site = new Site(site.getName(), site.getCoordinate(), site.getOpeningHours());

        this.visitTime = visitTime;
        this.leaveTime = leaveTime;
        this.commuteMethod = commuteMethod;
    }
}

export { Schedule };

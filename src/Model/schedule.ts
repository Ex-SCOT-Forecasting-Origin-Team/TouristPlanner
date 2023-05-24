import { Site } from "./site";

class Schedule {
    private site: Site | null;
    private visitTime: String;
    private leaveTime : String;
    private commuteMethod: String;

    constructor(site: Site | null, visitTime: String, leaveTime: String, commuteMethod: String) {
        if (site != null) {
            this.site = new Site(site.getName(), site.getCoordinate(), site.getOpeningHours());
        } else {
            this.site = null;
        }

        this.visitTime = visitTime;
        this.leaveTime = leaveTime;
        this.commuteMethod = commuteMethod;
    }

    public getSite(): Site | null {
        return this.site;
    }

}

export { Schedule };

import { Site } from './site';

class Schedule {
    private site: Site;
    private visitTime: Date;
    private leaveTime : Date;

    constructor(site: Site, visitTime: Date, leaveTime: Date) {
        this.site = new Site(site.getName(), site.getCoordinate(), site.getOpeningHours());

        this.visitTime = new Date(visitTime);
        this.leaveTime = new Date(leaveTime);
    }
}

export { Schedule };
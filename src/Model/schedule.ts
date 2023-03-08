import { Site } from './site';

class Schedule {
    site: Site;
    visitTime: Date;
    leaveTime : Date;

    constructor(site: Site, visitTime: Date, leaveTime: Date) {
        this.site = new Site(site.name, site.coordinate, site.openingHours);

        this.visitTime = new Date(visitTime);
        this.leaveTime = new Date(leaveTime);
    }
}

export { Schedule };
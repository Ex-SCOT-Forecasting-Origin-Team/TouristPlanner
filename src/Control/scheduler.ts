import { Constraint } from '../Model/constraint';
import { Schedule } from '../Model/schedule';
import { Site } from '../Model/site';
import { calculateDistanceTime } from './commuteTimeCalculator';
import { convertStrToHourAndMin } from './timeFormatConverter';
import { less, getDivisibleByFifteenMin, convertHourAndMinToStr, add } from './timeFormatConverter';


export class Scheduler {
    readonly MAX_SIZE = 10;
    readonly HOURS = 24;

    private startLocation: number;
    private stayDuration: [String, String];
    private method: google.maps.TravelMode;
    private constraints: Constraint[];
    private destinations: Site[]
    private cache: number[][][];
    private commuteTime: number[][];
    private result: Schedule[];


    constructor(method: google.maps.TravelMode, stayDuration: [string, string], constraints: Constraint[]) {
        this.method = method;
        this.stayDuration = stayDuration;
        this.startLocation = 0;

        const sz = constraints.length;
        if (sz > this.MAX_SIZE) {
            throw new Error("Not supporting more than " + this.MAX_SIZE + " locations. ");
        }

        this.destinations = new Array<Site> ();
        for (let idx = 0; idx < sz; ++idx) {
            let src = constraints[idx].getSite();
            this.destinations.push(new Site(src.getName(), src.getCoordinate(), src.getOpeningHours()));
        }

        this.constraints = new Array<Constraint> ();
        for (let idx = 0; idx < sz; ++idx) {
            let src = constraints[idx];
            this.constraints.push(new Constraint(this.destinations[idx], src.getVisitTime(), src.getDuration()));
        }

        this.cache = new Array<Array<Array<number>>>();
        for (let visited = 0; visited < (2 << sz); ++visited) {
            let x = new Array();
            for (let origin = 0; origin < sz; ++origin) {
                let y = new Array();
                for (let hour = 0; hour < this.HOURS * 4; ++hour) {
                    y.push(-1);
                }
                x.push(y)
            }
            this.cache.push(x);
        }  

        this.result = new Array<Schedule>();
        this.commuteTime = new Array<Array<number>>();
    }

    /**
     * 
     * @param startLocation : -1 if we want the scheduler to find out the start location
     * Else, the index specified is used as the start location
     */
    public setStartLocation(startLocation: number) {
        if (startLocation !== -1) {
            this.startLocation = startLocation;
            return;
        }

        for (let site = 0; site < this.constraints.length; ++site) {
            if (startLocation === -1 || 
                (this.constraints[site].getSite().getCoordinate().lat() < this.constraints[startLocation].getSite().getCoordinate().lat())) {
                startLocation = site;
            }
        }

        this.startLocation = startLocation;
    }

    public getResult() {
        return this.result;
    }

    public getSchedule() {
        const ret = calculateDistanceTime(this.method, this.destinations).then((commuteInfo) => {
            console.log(commuteInfo);
            for (let origin = 0; origin < commuteInfo.length; ++origin) {
                let row = new Array();
                for (let dest = 0; dest < commuteInfo[0].length; ++dest) {
                    row.push(commuteInfo[origin][dest].duration.value)
                }
                this.commuteTime.push(row);
            }
        }).then(() => {
            this.result = this.createSchedule()
            console.log(this.result);
        })

        return ret;
    }

    private createSchedule() {
        // get leave time of the first location
        let time = convertStrToHourAndMin(this.stayDuration[0]);
        if (this.constraints[this.startLocation].getVisitTime() != null) {
            time = convertStrToHourAndMin(this.constraints[this.startLocation].getVisitTime());
        }
        console.log(time);

        let hour = time[0];
        let minute = time[1];
        console.log("Start time: ", hour, minute);

        let here = this.startLocation;
        let visited: number = 0;
        let maxDuration = this.getMaxDurationSum(visited, here, hour, minute);
        console.log("start duration: ", maxDuration);
        if (maxDuration === 0) {
            throw new Error("Schedule cannot be generated. ");
        }

        let schedule : Schedule[] = [];

        do {
            let currEndTime = getDivisibleByFifteenMin(add(hour, minute, this.constraints[here].getDuration()))
            schedule.push(new Schedule(this.constraints[here].getSite(), convertHourAndMinToStr(hour, minute)
         , convertHourAndMinToStr(currEndTime[0], currEndTime[1]), this.method.toString()))
            console.log(here, ": ", currEndTime[0], currEndTime[1]);
            
            visited |= (1 << here);

            let temp = this.getEarliest(visited);
            let earliest = temp[0];
            let earliestIdx = temp[1];

            let bestChoice = -1;
            let bestDuration = 0;
            let nextStartHour = 0;
            let nextStartMinute = 0;

            let commuteTimes = this.commuteTime[here];
            for (let next = 0; next < this.constraints.length; ++next) {
                if (visited & (1 << next)) {
                    continue;
                }

                let nextStartTime = getDivisibleByFifteenMin(add(currEndTime[0], currEndTime[1], commuteTimes[next]));
                let nextStartTimeStr = convertHourAndMinToStr(nextStartTime[0], nextStartTime[1]);
                if (nextStartTime[0] > 23 || less(earliest, nextStartTimeStr)) {
                    continue;
                }

                if (next === earliestIdx) {
                    let hourMin = convertStrToHourAndMin(earliest);
                    nextStartTime = getDivisibleByFifteenMin(hourMin);
                }
                
                let cand = this.getMaxDurationSum(visited, next, nextStartTime[0], nextStartTime[1]) 
                + this.constraints[next].getDuration();

                if (cand > bestDuration) {
                    bestDuration = cand;
                    bestChoice = next;
                    [nextStartHour, nextStartMinute] = nextStartTime;
                }
            }

            [hour, minute] = [nextStartHour, nextStartMinute];
            if (bestChoice !== -1) {
                // add transit time here
                let arriveTime = getDivisibleByFifteenMin(add(currEndTime[0], currEndTime[1], commuteTimes[bestChoice]));
                schedule.push(new Schedule(null, convertHourAndMinToStr(currEndTime[0], currEndTime[1])
         , convertHourAndMinToStr(arriveTime[0], arriveTime[1]), this.method.toString()))
                console.log(here, ": ", arriveTime[0], arriveTime[1]);
            }

            here = bestChoice;
        }
        while(here !== -1);

        return schedule;
    }

    private getEarliest(visited: number): [String, number] {
        let earliest = this.stayDuration[1];
        let earliestIdx = -1;
        for (let idx = 0; idx < this.constraints.length; ++idx) {
            if (visited & (1 << idx)) {
                continue;
            }
            if (this.constraints[idx].getVisitTime() == null) {
                continue;
            }

            if (less(this.constraints[idx].getVisitTime(), earliest)) {
                earliest = this.constraints[idx].getVisitTime();
                earliestIdx = idx;
            }
        }  

        return [earliest, earliestIdx];
    }



    /**
     * 
     * @param visited : bitmap on whether a site is already visited
     * @param origin : the current location index
     * @param hour : 0 <= hour <= 23, assuming that no time zone calculation is needed
     * @param minute : 15 minute interval (0, 15, 30, 45)
     * 
     * hour and minute are the leave time of the previous schedule
     * @returns the maximum duration sum
     */
    private getMaxDurationSum(visited: number, origin: number, hour: number, minute: number): number {
        let time = hour * 4 + minute / 15;
        let ret = this.cache[visited][origin][time];
        if (ret !== -1) {
            return ret;
        }

        let temp = this.getEarliest(visited);  
        let earliest = temp[0];
        let earliestIdx = temp[1]; 

        // If the end time is earlier than the leave time of the current activity, don't choose this activity 
        let currEndTime = getDivisibleByFifteenMin(add(hour, minute, this.constraints[origin].getDuration()));
        let currEndTimeStr = convertHourAndMinToStr(currEndTime[0], currEndTime[1]);
        if (currEndTime[0] > 23 || (earliestIdx === -1 && less(earliest, currEndTimeStr))) {
            this.cache[visited][origin][time] = 0;
            return 0;
        }

        let commuteInfo = this.commuteTime[origin];

        ret = 0; 
        for (let next = 0; next < this.constraints.length; ++next) {
            if (visited & (1 << next)) {
                continue;
            }

            // compute the visit time to the next location by adding the commute time to the current end time
            let nextStartTime = getDivisibleByFifteenMin(add(currEndTime[0], currEndTime[1], commuteInfo[next]));
            let nextStartTimeStr = convertHourAndMinToStr(nextStartTime[0], nextStartTime[1]);
            if (nextStartTime[0] > 23 || less(earliest, nextStartTimeStr)) {
                continue;
            }

            // If the user has a particular visit time in mind, use that for the start time
            if (earliestIdx === next) {
                let hourMin = convertStrToHourAndMin(earliest);
                nextStartTime = getDivisibleByFifteenMin(hourMin);
            } 

            console.log(nextStartTime);
            let cand = this.getMaxDurationSum(visited | (1 << origin), next, nextStartTime[0], nextStartTime[1]);
            ret = Math.max(ret, cand);
        }

        ret += this.constraints[origin].getDuration(); 
        this.cache[visited][origin][time] = ret;

        return ret;
    }
}
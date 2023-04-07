import { Constraint } from '../Model/constraint';
import { Schedule } from '../Model/schedule';
import { Site } from '../Model/site';
import { calculateDistanceTime } from './commuteTimeCalculator';
import { convertStrToHourAndMin } from './timeFormatConverter';
import { less, getDivisibleByFifteenMin, convertHourAndMinToStr, add } from './timeFormatConverter';


export class Scheduler {
    readonly MAX_SIZE = 10;
    readonly HOURS = 24;

    private stayDuration: [String, String];
    private method: google.maps.TravelMode;
    private constraints: Constraint[];
    private destinations: Site[]
    private cache: number[][][];
    private commuteTime: number[][];


    constructor(method: google.maps.TravelMode, stayDuration: [string, string], constraints: Constraint[]) {
        this.method = method;
        this.stayDuration = stayDuration;

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
            for (let origin = 0; origin < sz; ++origin) {
                for (let hour = 0; hour < this.HOURS * 4; ++hour) {
                    this.cache[visited][origin][hour] = -1;
                }
            } 
        }  

        this.commuteTime = new Array<Array<number>>();
    }

    public createSchedule() {
        let startLocation: number = -1;

        let commuteInfo = calculateDistanceTime(this.method, this.destinations);
        for (let origin = 0; origin < commuteInfo.length; ++origin) {
            let row = new Array();
            for (let dest = 0; dest < commuteInfo[0].length; ++dest) {
                row.push(commuteInfo[origin][dest].duration.value)
            }
            this.commuteTime.push(row);
        }

        for (let site = 0; site < this.constraints.length; ++site) {
            if (startLocation == -1 || 
                (this.constraints[site].getSite().getCoordinate().lat() < this.constraints[startLocation].getSite().getCoordinate().lat())) {
                startLocation = site;
            }
        }

        // get leave time of the first location
        let time = convertStrToHourAndMin(this.stayDuration[0]);
        let hour = time[0];
        let minute = time[1];

        let here = startLocation;
        let visited: number = (1 << here);
        let maxDuration = this.getMaxDurationSum(visited, here, hour, minute);
        if (maxDuration == 0) {
            throw new Error("Schedule cannot be generated. ");
        }

        let schedule : Schedule[] = [];
        schedule.push(new Schedule(this.constraints[startLocation].getSite(), this.stayDuration[0]
        , this.stayDuration[0], this.method.toString()))

        while (true) {
            let temp = this.getEarliest(visited);
            let earliest = temp[0];
            let earliestIdx = temp[1];

            let bestChoice = -1;
            let bestDuration = 0;
            let startHour = -1;
            let startMinute = -1;
            let endHour = -1;
            let endMinute = -1;

            let commuteTimes = this.commuteTime[here];
            for (let next = 0; next < this.constraints.length; ++next) {
                if (visited & (1 << next)) {
                    continue;
                }

                let nextStartTime = getDivisibleByFifteenMin(add(hour, minute, commuteTimes[next]));
                let nextStartTimeStr = convertHourAndMinToStr(nextStartTime[0], nextStartTime[1]);
                if (nextStartTime[0] > 23 || less(earliest, nextStartTimeStr)) {
                    continue;
                }

                let nextEndTime = getDivisibleByFifteenMin(
                    add(hour, minute, commuteTimes[next] + this.constraints[next].getDuration()));
                let nextEndTimeStr = convertHourAndMinToStr(nextEndTime[0], nextEndTime[1]);
                if (nextEndTime[0] > 23 || (earliestIdx == -1 && less(earliest, nextEndTimeStr))) {
                    continue;
                }

                if (next == earliestIdx) { // need to add duration also
                    let hourMin = convertStrToHourAndMin(earliest);
                    nextStartTime = getDivisibleByFifteenMin(hourMin);
                    nextEndTime = getDivisibleByFifteenMin(add(hourMin[0], hourMin[1], this.constraints[next].getDuration()));
                }

                let cand = this.cache[visited | (1 << next)][nextEndTime[0]][nextEndTime[1]];
                if (cand > bestDuration) {
                    bestDuration = cand;
                    bestChoice = next;
                    startHour = nextStartTime[0];
                    startMinute = nextStartTime[1];
                    endHour = nextEndTime[0];
                    endMinute = nextEndTime[1];
                }
            }

            if (bestChoice != -1) {
                visited |= (1 << bestChoice);
                hour = endHour;
                minute = endMinute;
                here = bestChoice;
                
                schedule.push(new Schedule(this.constraints[bestChoice].getSite(), 
                convertHourAndMinToStr(startHour, startMinute), convertHourAndMinToStr(endHour, endMinute), 
                this.method.toString()));
            } else {
                break;
            }
        }

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
        if (ret != -1) {
            return ret;
        }

        let commuteInfo = this.commuteTime[origin];
        let temp = this.getEarliest(visited);  
        let earliest = temp[0];
        let earliestIdx = temp[1];   

        ret = 0; 
        for (let next = 0; next < this.constraints.length; ++next) {
            if (visited & (1 << next)) {
                continue;
            }

            let nextStartTime = getDivisibleByFifteenMin(add(hour, minute, commuteInfo[next]));
            let nextStartTimeStr = convertHourAndMinToStr(nextStartTime[0], nextStartTime[1]);
            if (nextStartTime[0] > 23 || less(earliest, nextStartTimeStr)) {
                continue;
            }

            let nextEndTime = getDivisibleByFifteenMin(
                add(hour, minute, commuteInfo[next] + this.constraints[next].getDuration()));
            let nextEndTimeStr = convertHourAndMinToStr(nextEndTime[0], nextEndTime[1]);
            if (nextEndTime[0] > 23 || (earliestIdx == -1 && less(earliest, nextEndTimeStr))) {
                continue;
            }

            if (earliestIdx == next) {
                let hourMin = convertStrToHourAndMin(earliest);
                nextStartTime = getDivisibleByFifteenMin(hourMin);
                nextEndTime = getDivisibleByFifteenMin(add(hourMin[0], hourMin[1], this.constraints[next].getDuration()));
            } 
            let cand = this.getMaxDurationSum(visited | (1 << next), next, nextEndTime[0], nextEndTime[1]) 
            + this.constraints[next].getDuration();

            ret = Math.max(ret, cand);
        }

        this.cache[visited][origin][time] = ret;
        return ret;
    }
}


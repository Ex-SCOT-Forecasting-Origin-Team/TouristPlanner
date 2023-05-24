/**

 * 

 * @param timeStr time in String eg) "12:00", "21:30", etc.

 * @returns [12, 0]

 */

export function convertStrToHourAndMin(timeStr: String): [number, number] {
    let hourMinStr = timeStr.split(":")
    if (hourMinStr.length !== 2) {
        throw new Error("Invalid time format: an example of valid format is '12:00'. ")
    }

    let ret: [number, number] = [0, 0];
    for (let i = 0; i < 2; ++i) {
        ret[i] = +hourMinStr[i];
    }

    return ret;
};




export function convertHourAndMinToStr(hour: number, minute: number): String {
    let minStr = "";
    if (minute == 0) {
        minStr = "00";
    } else {
        minStr = minute.toString();
    }
    return hour.toString() + ":" + minStr;
}




/**

 * 

 * @param timeStr1 time in String eg) "12:00", "21:30", etc.
 * @param timeStr2 time in String eg) "12:00", "21:30", etc.
 * @returns whether timeStr1 occurs earlier than timeStr2
 */

export function less(timeStr1: String, timeStr2: String): boolean {
    let time1 = convertStrToHourAndMin(timeStr1);
    let time2 = convertStrToHourAndMin(timeStr2);
    if (time1[0] === time2[0]) {
        return time1[1] < time2[1];
    }

    return time1[0] < time2[0];
};




/**
 * 
 * @param timeStr : time in String eg) "12:13"
 * @returns time in future divisible by 15 minutes eg) "12:15"
 */

export function getDivisibleByFifteenMin(time: [number, number]): [number, number] {
    let hour = Math.floor(time[0]);
    let minute = Math.floor(time[1]);
    if (minute % 15 === 0) {
        return [hour, minute];
    }

    minute = (Math.floor(minute / 15) + 1) * 15
    if (minute === 60) {
        minute = 0;
        ++hour;
    } 

    return [hour, minute];
}


/**
 * 
 * @param hour 0 <= hour < 24
 * @param minute 0 <= minute < 60
 * @param duration duration in seconds
 * @returns duration added to hour and minute
 */
export function add(hour: number, minute: number, duration: number): [number, number] {
    minute += (duration / 60);
    let carry = minute / 60;
    let remainder = minute % 60;

    hour += carry;
    minute = remainder;
    return [hour, minute];
}
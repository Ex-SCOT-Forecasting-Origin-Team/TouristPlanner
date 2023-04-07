import React from 'react';

class Day{
    day: number;
    numDays: number;

    constructor(numDays: number){
        this.day = 0;
        this.numDays = numDays;
    }

    nextDay(){
        if(this.getDay() + 1 < this.numDays){
            this.day = this.day +  1;
            console.log("day", this.day)
            console.log("numDays", this.numDays)
        }
        else{
            console.log('Invalid Day')
        }
    }

    previousDay(){
        if(this.day- 1 >= 0){
            this.day -= 1;
            console.log("day", this.day)
            console.log("numDays", this.numDays)
        }
        else{
            console.log('Invalid Day')
        }
    }

    getDay(){
        return this.day;
    }
}

export { Day }
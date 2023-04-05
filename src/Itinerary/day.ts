import React from 'react';

class Day{
    day: number;
    numDays: number;

    constructor(numDays: number){
        this.day = 0;
        this.numDays = numDays;
    }

    nextDay(){
        if(this.day < this.numDays){
            this.day += 1;
        }
    }

    previousDay(){
        if(this.day > 0){
            this.day -= 1;
        }
    }

    getDay(){
        return this.day;
    }
}

export { Day }
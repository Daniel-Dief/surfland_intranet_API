export function addMonth(date : Date, months : number): Date {
    let newDate = new Date(date);

    for (let index = 0; index < months; index++) {        
        newDate.setMonth(newDate.getMonth() + 1);
    }
    
    return newDate;
};

export function resetHours(date: Date) : Date {
    date.setUTCHours(0);
    date.setUTCMinutes(0);
    date.setUTCSeconds(0);
    date.setUTCMilliseconds(0);

    return date;
}

export function lastHours(date: Date) : Date {
    date.setUTCHours(23);
    date.setUTCMinutes(59);
    date.setUTCSeconds(59);
    date.setUTCMilliseconds(999);

    return date;
}

export function giveDateByTime(time : string) {
    let date = new Date();
    date.setUTCHours(Number(time.split(":")[0]), Number(time.split(":")[1]), 0, 0);

    return date;
}

export function getWeekOfMonth(date: Date) {
    let firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
    let day = firstDay.getDay();
    let diff = date.getDate() + day - 1;

    return Math.ceil(diff / 7);
}
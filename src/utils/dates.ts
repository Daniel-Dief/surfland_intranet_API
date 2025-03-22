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
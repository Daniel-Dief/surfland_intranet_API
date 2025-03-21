export function addMonth(date : Date, months : number): Date {
    let newDate = new Date(date);

    for (let index = 0; index < months; index++) {        
        newDate.setMonth(newDate.getMonth() + 1);
    }
    
    return newDate;
};

export function resetHours(date: Date) : Date {
    date.setHours(0);
    date.setMinutes(0);
    date.setSeconds(0);
    date.setMilliseconds(0);

    return date;
}
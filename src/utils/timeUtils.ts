function getTimeDifference(date1: Date, date2: Date) {
    return date1.getTime() - date2.getTime();
}

function getMinuteDifference(date1: Date, date2: Date) {
    let minuteDiff = getTimeDifference(date1, date2) / 60000;
    return Math.abs(Math.round(minuteDiff));
}

export function isOlderThan(date: Date, minutes: number): boolean {

    const td = getMinuteDifference(date, new Date());
    return td > minutes;
}
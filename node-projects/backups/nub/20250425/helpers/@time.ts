const TIMEZONE = process.env.TZ || 'Africa/Lagos'; // Default to 'Africa/Lagos' if TZ is not set

function month(): string {
    const date = new Date();
    const month = date.toLocaleString('default', { month: 'long', timeZone: TIMEZONE });
    return month;
}

function year(): string {
    const date = new Date();
    const year = date.toLocaleString('default', { year: 'numeric', timeZone: TIMEZONE });
    return year;
}

function day(): string {
    const date = new Date();
    const day = date.toLocaleString('default', { day: 'numeric', timeZone: TIMEZONE });
    return day;
}

function unix(): number {
    // Unix timestamp remains UTC-based, no need for timezone handling here
    const date = new Date();
    return date.getTime();
}

export { month, year, day, unix };

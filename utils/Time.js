import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';

dayjs.extend(utc);

function getLocaleDateTimeString(date, offset) {
    return dayjs.utc(date).add(offset, 'm').format('DD.MM.YY HH:mm');
}

function getLocaleDateTime(date, offset) {
    return dayjs.utc(date).add(offset, 'm');
}

export { getLocaleDateTimeString, getLocaleDateTime };

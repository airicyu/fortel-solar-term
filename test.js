const moment = require('moment');
const fortelSolarTerm = require('./main');
let { TermDatetime, TermYearMonth } = fortelSolarTerm;

let run = async () => {
    let year = 2019;

    for (let i = 0; i < 12; i++) {
        //let solarTermMoment = getDatetimeOfYearSolarTerm(year, i);
        let termMonthRange = new TermYearMonth(year, i + 1).getRange();
        console.log(i + 1, termMonthRange.start.toLocaleString(), termMonthRange.end.toLocaleString());
    }
    //console.log(getDatetimeBySunLongitude(2019, 314).toLocaleString());
    //console.log(getEightWordByDatetime(moment()));
    let testDate = moment.parseZone("2020-01-06T05:29:58+08:00");

    console.log(testDate.toLocaleString(), new TermDatetime(testDate).getEightWords());
};

run();
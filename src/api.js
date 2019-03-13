'use strict';

const lib = require('./lib.js');

class TermDatetime {
    constructor(datetime) {
        this.datetime = datetime;
    }

    getSunLongitude() {
        return lib.getSunLongitudeByDatetime(this.datetime);
    }

    getYearTermMonth() {
        let {
            termYear,
            termMonth
        } = lib.getYearTermMonthByDatetime(this.datetime)
        return new TermYearMonth(termYear, termMonth);
    }

    getEightWords() {
        return lib.getEightWordsByDatetime(this.datetime);
    }
}

class TermYearMonth {
    constructor(termYear, termMonth) {
        this.termYear = termYear;
        this.termMonth = termMonth;
    }

    getRange() {
        return lib.getYearTermMonthDatetimeRange(this.termYear, this.termMonth);
    }

}

module.exports = {
    TermDatetime,
    TermYearMonth
}
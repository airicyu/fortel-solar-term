'use strict';

const lib = require('./lib.js');
const moment = require('moment');

class TermDatetime {
    constructor(datetime) {
        this.datetime = moment(datetime);
    }

    /*getSunLongitude() {
        return lib.getSunLongitudeByDatetime(this.datetime);
    }*/

    getYearTermMonth() {
        let {
            termYear,
            termMonth
        } = lib.getYearTermMonthByDatetime(this.datetime)
        return new TermYearMonth(termYear, termMonth);
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

class Term {
    constructor(index, displayName) {
        this.index = index;
        this.displayName = displayName;
    }

    getIndex() {
        return this.index;
    }

    getDisplayName() {
        return this.displayName;
    }

    getSunLongitude() {
        return (315 + this.index * 15) % 360;
    }

    getTermMonth() {
        return Math.floor(this.index / 2) + 1;
    }

    /**
     * get by index or name
     * 
     * @static
     * @param {number|string} key 
     * @returns {Term}
     * 
     * @memberOf Term
     */
    static get(key) {
        if (typeof key === 'string') {
            return Term.items[Term.items.map.indexOf(key)];
        } else {
            let items = Term.items;
            return items[((key % items.length) + items.length) % items.length]
        }
    }
}
Term.items = [
    new Term(0, '立春'),
    new Term(1, '雨水'),
    new Term(2, '驚蟄'),
    new Term(3, '春分'),
    new Term(4, '清明'),
    new Term(5, '穀雨'),
    new Term(6, '立夏'),
    new Term(7, '小滿'),
    new Term(8, '芒種'),
    new Term(9, '夏至'),
    new Term(10, '小暑'),
    new Term(11, '大暑'),
    new Term(12, '立秋'),
    new Term(13, '處暑'),
    new Term(14, '白露'),
    new Term(15, '秋分'),
    new Term(16, '寒露'),
    new Term(17, '霜降'),
    new Term(18, '立冬'),
    new Term(19, '小雪'),
    new Term(20, '大雪'),
    new Term(21, '冬至'),
    new Term(22, '小寒'),
    new Term(23, '大寒')
];

module.exports = {
    TermDatetime,
    TermYearMonth,
    Term
}
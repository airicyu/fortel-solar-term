'use strict';

const moment = require('moment');
const { Stem, Branch } = require('fortel-codex');

const timeToLongitude = require('./timeToLongitude');

function _bisection(target, initMin, initMax, formulaFunc, minMaxRangeThershold = 0.5, maxLoop = 50) {
    let done = false;
    let min = initMin;
    let max = initMax;
    let loopCount = 0;

    while (!done) {
        loopCount++;

        let minY = formulaFunc(min);
        let maxY = formulaFunc(max);
        let midX = (min + max) / 2;
        let midY = formulaFunc(midX);
        if (midY === target) {
            return midY;
        } else if (midY > target) {
            if (minY < target) {
                max = midX;
            } else {
                min = midX;
            }
        } else if (midY < target) {
            if (minY > target) {
                max = midX;
            } else {
                min = midX;
            }
        }

        if ((max - min) < minMaxRangeThershold) {
            return Math.round((min + max) / 2);
            //return min + (max - min) * (target - minY) / (maxY - minY);
        }
        if (loopCount >= maxLoop) {
            return Math.round((min + max) / 2);
            //return min + (max - min) * (target - minY) / (maxY - minY);
        }
    }
}

function _getSolarYearByYearTerm(year, term) {
    return (term >= 22) ? year + 1 : year;
}

function _getTermLongitude(solarTermIndex) {
    return ((315 + solarTermIndex * 15) % 360 + 360) % 360;
}

function _getTermDateRangeStartParams() {
    return [
        [2, 3],
        [2, 18],
        [3, 4],
        [3, 19],
        [4, 3],
        [4, 19],
        [5, 4],
        [5, 20],
        [6, 4],
        [6, 20],
        [7, 6],
        [7, 22],
        [8, 6],
        [8, 22],
        [9, 6],
        [9, 22],
        [10, 7],
        [10, 22],
        [11, 6],
        [11, 21],
        [12, 6],
        [12, 20],
        [1, 4],
        [1, 19],
    ];
}

function _getLongitudeByTime(targetLongitude, refMinTimestamp, refMaxTimestamp) {
    let timeToLongitudeSmoothFunc = (target) => {
        return (timestamp) => {
            let longitude1 = timeToLongitude(timestamp);
            let longitude2 = timeToLongitude(timestamp) + 360;
            let longitude3 = timeToLongitude(timestamp) - 360;
            if (Math.abs(longitude1 - target) < Math.abs(longitude2 - target) && Math.abs(longitude1 - target) < Math.abs(longitude3 - target)) {
                return longitude1;
            } else if (Math.abs(longitude2 - target) < Math.abs(longitude1 - target) && Math.abs(longitude2 - target) < Math.abs(longitude3 - target)) {
                return longitude2;
            } else {
                return longitude3;
            }
        }
    };

    let targetLongitudeTimestamp = _bisection(targetLongitude, refMinTimestamp, refMaxTimestamp, timeToLongitudeSmoothFunc(targetLongitude));
    return moment.unix(targetLongitudeTimestamp);
}

function _getDatetimeOfYearSolarTerm(year, solarTermIndex) {
    if (solarTermIndex >= 22) {
        year = year + 1;
    }

    let targetLongitude = _getTermLongitude(solarTermIndex);
    let termDateRangeStartParam = _getTermDateRangeStartParams()[solarTermIndex];

    let dateRangeStart = moment.utc([year, termDateRangeStartParam[0] - 1, termDateRangeStartParam[1]])
    dateRangeStart.add(-1, 'days');
    let dateRangeEnd = moment(dateRangeStart).add(4, 'days');
    let dateRangeStartTimestamp = dateRangeStart.unix();
    let dateRangeEndTimestamp = dateRangeEnd.unix();

    return _getLongitudeByTime(targetLongitude, dateRangeStartTimestamp, dateRangeEndTimestamp);
}

function getYearTermMonthByDatetime(datetime) {
    let termDateRangeParams = _getTermDateRangeStartParams();
    let year = datetime.get('year');

    //within this year abs range
    if (datetime.isBetween(
        moment.utc([year, termDateRangeParams[0][0] - 1, termDateRangeParams[0][1]]),
        moment.utc([year + 1, termDateRangeParams[0][0] - 1, termDateRangeParams[0][1]])
    )) {

        // for each month, check within abs range
        for (let i = 0; i < 12 - 1; i++) {
            //if in abs range, no need detail checking
            if (datetime.isBetween(
                moment.utc([year, termDateRangeParams[i * 2][0] - 1, termDateRangeParams[i * 2][1] + 3]),
                moment.utc([year, termDateRangeParams[(i + 1) * 2][0] - 1, termDateRangeParams[(i + 1) * 2][1]]),
            )) {
                return {
                    termYear: year,
                    termMonth: i + 1
                };
            }
            // if in margin range, check boundary
            else if (datetime.isBetween(
                moment.utc([year, termDateRangeParams[i * 2][0] - 1, termDateRangeParams[i * 2][1]]),
                moment.utc([year, termDateRangeParams[i * 2][0] - 1, termDateRangeParams[i * 2][1] + 3]),
            )) {
                let { start } = getYearTermMonthDatetimeRange(year, i + 1);
                if (datetime.isBefore(start)) {
                    return {
                        termYear: (i - 1 < 0) ? year - 1 : year,
                        termMonth: (i - 1 < 0) ? 12 : i
                    }
                } else {
                    return {
                        termYear: year,
                        termMonth: i + 1
                    }
                }
            }
        }
        if (datetime.isBetween(
            moment.utc([year, termDateRangeParams[(12 - 1) * 2][0] - 1, termDateRangeParams[(12 - 1) * 2][1] + 3]),
            moment.utc([year + 1, termDateRangeParams[0][0] - 1, termDateRangeParams[0][1]]),
        )) {
            return {
                termYear: year,
                termMonth: 11
            };
        }
    } else if (datetime.isBefore(
        moment.utc([year, termDateRangeParams[0][0] - 1, termDateRangeParams[0][1]])
    )) {
        let { start, end } = getYearTermMonthDatetimeRange(year - 1, 12);
        if (datetime.isBetween(start, end)) {
            return {
                termYear: year - 1,
                termMonth: 12
            };
        } else {
            return {
                termYear: year - 1,
                termMonth: 11
            };
        }
    } else if (datetime.isAfter(
        moment.utc([year + 1, termDateRangeParams[0][0] - 1, termDateRangeParams[0][1]])
    )) {
        return {
            termYear: year + 1,
            termMonth: 1
        };
    }

    return {
        termYear: null,
        termMonth: null
    };
}

function getYearTermMonthDatetimeRange(termYear, termMonth) {
    let startTerm = (termMonth - 1) * 2;
    let termMonthStartTime = _getDatetimeOfYearSolarTerm(termYear, startTerm);

    let endTimeYear = termYear;
    let nextStartTerm = (termMonth - 1) * 2 + 2;
    if (termMonth == 12) {
        endTimeYear = termYear + 1;
        nextStartTerm = 0;
    }
    let termMonthEndTime = _getDatetimeOfYearSolarTerm(endTimeYear, nextStartTerm);

    return {
        start: termMonthStartTime,
        end: termMonthEndTime
    }
}

function getSunLongitudeByDatetime(datetime) {
    return (timeToLongitude(datetime.unix()) + 360) % 360;
}

function getDatetimeBySunLongitude(year, sunLongitude) {
    sunLongitude = (sunLongitude % 360 + 360) % 360;
    if (sunLongitude < 315) {
        sunLongitude += 360;
    }
    let referenceTermIndex = (sunLongitude - 315) / 15;
    let referenceMinYear = year;
    let referenceMinTerm = Math.floor(referenceTermIndex - 0.5);
    if (referenceMinTerm < 0) {
        referenceMinYear -= 1;
        referenceMinTerm += 24;
    }
    let referenceMaxYear = year;
    let referenceMaxTerm = Math.ceil(referenceTermIndex + 0.5);
    if (referenceMaxTerm >= 24) {
        referenceMaxYear += 1;
        referenceMaxTerm -= 24;
    }

    sunLongitude = (sunLongitude % 360 + 360) % 360;

    let minDateParam = _getTermDateRangeStartParams()[referenceMinTerm];
    let referenceMinTime = moment.utc([_getSolarYearByYearTerm(referenceMinYear, referenceMinTerm), minDateParam[0] - 1, minDateParam[1]]);

    let maxDateParam = _getTermDateRangeStartParams()[referenceMaxTerm];
    let referenceMaxTime = moment.utc([_getSolarYearByYearTerm(referenceMaxYear, referenceMaxTerm), maxDateParam[0] - 1, maxDateParam[1]])

    return _getLongitudeByTime(sunLongitude, referenceMinTime.unix(), referenceMaxTime.unix());
}



function getEightWordsByDatetime(datetime) {
    datetime = moment(datetime).utcOffset("+08:00");
    let year = datetime.get('year');
    let month = datetime.get('month') + 1;
    let day = datetime.get('date');
    let hour = datetime.get('hour');
    let minute = datetime.get('minute');
    let second = datetime.get('second');
    let hourBranchIndex = Math.floor((hour * 3600 + minute * 60 + second + 3600) / 7200);

    let { termYear, termMonth } = getYearTermMonthByDatetime(datetime);

    let yearStem = Stem.get([termYear - 4] % 10);
    let yearBranch = Branch.get([termYear - 4] % 12);

    let monthStem = Stem.get(((yearStem.index + 1) % 5) * 2).shift(termMonth - 1);
    let monthBranch = Branch.get(termMonth + 1);

    let dayStem;
    let dayBranch;

    {
        let y = year;
        let m = month;
        let d = day;
        if (m <= 2) {
            y -= 1;
            m += 12;
        }
        let c = (y - y % 100) / 100;
        y = y % 100;
        let g = 4 * c + Math.floor(c / 4) + 5 * y + Math.floor(y / 4) + Math.floor(3 * (m + 1) / 5) + d - 4;
        let z = 8 * c + Math.floor(c / 4) + 5 * y + Math.floor(y / 4) + Math.floor(3 * (m + 1) / 5) + d + 6 + (m % 2 == 0 ? 6 : 0);

        dayStem = Stem.get(g);
        dayBranch = Branch.get(z);
    }


    let hourStem = Stem.get(dayStem.index * 2 + hourBranchIndex);
    let hourBranch = Branch.get(hourBranchIndex);

    hourStem = hourStem.displayName;
    dayStem = dayStem.displayName;
    monthStem = monthStem.displayName;
    yearStem = yearStem.displayName;
    hourBranch = hourBranch.displayName;
    dayBranch = dayBranch.displayName;
    monthBranch = monthBranch.displayName;
    yearBranch = yearBranch.displayName;

    let eightWords = {
        'array2d.groupByStemBranch': [
            [hourStem, dayStem, monthStem, yearStem],
            [hourBranch, dayBranch, monthBranch, yearBranch],
        ],
        'array2d.groupByPillar': [
            [hourStem, hourBranch],
            [dayStem, dayBranch],
            [monthStem, monthBranch],
            [yearStem, yearBranch]
        ],
        'map': {
            hourStem,
            dayStem,
            monthStem,
            yearStem,
            hourBranch,
            dayBranch,
            monthBranch,
            yearBranch,
        }
    }

    return eightWords;
}

module.exports = {
    getYearTermMonthDatetimeRange,
    getYearTermMonthByDatetime,
    getSunLongitudeByDatetime,
    getDatetimeBySunLongitude,
    getEightWordsByDatetime
}
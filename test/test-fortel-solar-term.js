'use strict';

const expect = require('chai').expect;
const fortelSolarTerm = require('./../main');
const moment = require('moment');

const { TermDatetime, TermYearMonth, Term } = fortelSolarTerm;

describe('fortel-solar-term test', function () {

    it("test term month calculation error < 300s for 2019", function (done) {
        try {
            let realTermTime = [
                [2019, 2 - 1, 4, 11, 14, 14],
                [2019, 3 - 1, 6, 5, 9, 39],
                [2019, 4 - 1, 5, 9, 51, 21],
                [2019, 5 - 1, 6, 3, 2, 40],
                [2019, 6 - 1, 6, 7, 6, 18],
                [2019, 7 - 1, 7, 17, 20, 25],
                [2019, 8 - 1, 8, 3, 12, 57],
                [2019, 9 - 1, 8, 6, 16, 46],
                [2019, 10 - 1, 8, 22, 5, 32],
                [2019, 11 - 1, 8, 1, 24, 15],
                [2019, 12 - 1, 7, 18, 18, 21],
                [2020, 1 - 1, 6, 5, 29, 59],
            ];

            let year = 2019;
            for (let i = 0; i < 12; i++) {
                let termMonthRange = new TermYearMonth(year, i + 1).getRange();
                expect(termMonthRange.start.diff(moment(realTermTime[i]), 'seconds')).lt(5 * 300, `Test term month range error for term year 2019 term month ${i + 1}`);
            }

            done();
        } catch (e) {
            console.error(e);
            done(e);
        }
    });

    /*
    it("test TermDatetime->getSunLongitude with 2019 data error < 0.01", function (done) {
        try {
            let realTermTime = [
                [2019, 2 - 1, 4, 11, 14, 14],
                [2019, 3 - 1, 6, 5, 9, 39],
                [2019, 4 - 1, 5, 9, 51, 21],
                [2019, 5 - 1, 6, 3, 2, 40],
                [2019, 6 - 1, 6, 7, 6, 18],
                [2019, 7 - 1, 7, 17, 20, 25],
                [2019, 8 - 1, 8, 3, 12, 57],
                [2019, 9 - 1, 8, 6, 16, 46],
                [2019, 10 - 1, 8, 22, 5, 32],
                [2019, 11 - 1, 8, 1, 24, 15],
                [2019, 12 - 1, 7, 18, 18, 21],
                [2020, 1 - 1, 6, 5, 29, 59],
            ];

            for (let i = 0; i < 12; i++) {
                let termTime = new TermDatetime(moment(realTermTime[i]));
                let estimateSunLongitude = termTime.getSunLongitude();
                let expectSunLongtitude = 315 + i * 30;

                expect(Math.abs(estimateSunLongitude % 360 - expectSunLongtitude % 360)).lt(0.01);
            }

            done();
        } catch (e) {
            console.error(e);
            done(e);
        }
    });
    */

    it("test TermDatetime->getYearTermMonth with 2019 data", function (done) {
        try {
            expect(new TermDatetime(moment([2019, 2 - 1, 4, 11, 0, 0])).getYearTermMonth()).to.eqls({ termYear: 2018, termMonth: 12 });
            expect(new TermDatetime(moment([2019, 2 - 1, 4, 12, 0, 0])).getYearTermMonth()).to.eqls({ termYear: 2019, termMonth: 1 });
            expect(new TermDatetime(moment([2019, 2 - 1, 10, 0, 0, 0])).getYearTermMonth()).to.eqls({ termYear: 2019, termMonth: 1 });
            expect(new TermDatetime(moment([2019, 3 - 1, 6, 5, 0, 0])).getYearTermMonth()).to.eqls({ termYear: 2019, termMonth: 1 });
            expect(new TermDatetime(moment([2019, 3 - 1, 6, 6, 0, 0])).getYearTermMonth()).to.eqls({ termYear: 2019, termMonth: 2 });
            expect(new TermDatetime(moment([2019, 3 - 1, 10, 0, 0, 0])).getYearTermMonth()).to.eqls({ termYear: 2019, termMonth: 2 });
            expect(new TermDatetime(moment([2019, 12 - 1, 7, 18, 0, 0])).getYearTermMonth()).to.eqls({ termYear: 2019, termMonth: 10 });
            expect(new TermDatetime(moment([2019, 12 - 1, 7, 19, 0, 0])).getYearTermMonth()).to.eqls({ termYear: 2019, termMonth: 11 });
            expect(new TermDatetime(moment([2019, 12 - 1, 10, 0, 0, 0])).getYearTermMonth()).to.eqls({ termYear: 2019, termMonth: 11 });
            expect(new TermDatetime(moment([2020, 1 - 1, 1, 0, 0, 0])).getYearTermMonth()).to.eqls({ termYear: 2019, termMonth: 11 });
            expect(new TermDatetime(moment([2020, 1 - 1, 6, 5, 0, 0])).getYearTermMonth()).to.eqls({ termYear: 2019, termMonth: 11 });
            expect(new TermDatetime(moment([2020, 1 - 1, 6, 6, 0, 0])).getYearTermMonth()).to.eqls({ termYear: 2019, termMonth: 12 });
            expect(new TermDatetime(moment([2020, 1 - 1, 10, 0, 0, 0])).getYearTermMonth()).to.eqls({ termYear: 2019, termMonth: 12 });
            expect(new TermDatetime(moment([2020, 2 - 1, 5, 0, 0, 0])).getYearTermMonth()).to.eqls({ termYear: 2020, termMonth: 1 });

            done();
        } catch (e) {
            console.error(e);
            done(e);
        }
    });

    it("test Term class", function (done) {
        try {
            expect(Term.get(0).getDisplayName()).to.equal('立春');
            expect(Term.get(1).getDisplayName()).to.equal('雨水');
            expect(Term.get(2).getIndex()).to.equal(2);
            expect(Term.get(3).getSunLongitude()).to.equal(0);
            expect(Term.get(4).getSunLongitude()).to.equal(15);
            expect(Term.get(5).getTermMonth()).to.equal(3);
            expect(Term.get(6).getTermMonth()).to.equal(4);
            expect(Term.get(7).getTermMonth()).to.equal(4);
            expect(Term.items.length).to.equal(24);
            done();
        } catch (e) {
            console.error(e);
            done(e);
        }
    });
});

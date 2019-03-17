# fortel-solar-term

[![npm version](https://img.shields.io/npm/v/fortel-solar-term.svg)](https://www.npmjs.com/package/fortel-solar-term)
[![node](https://img.shields.io/node/v/fortel-solar-term.svg)](https://www.npmjs.com/package/fortel-solar-term)
[![Build](https://travis-ci.org/airicyu/fortel-solar-term.svg?branch=master)](https://travis-ci.org/airicyu/fortel-solar-term)
[![Codecov branch](https://img.shields.io/codecov/c/github/airicyu/fortel-solar-term/master.svg)](https://codecov.io/gh/airicyu/fortel-solar-term)

[![GitHub issues](https://img.shields.io/github/issues/airicyu/fortel-solar-term.svg)](https://github.com/airicyu/fortel-solar-term/issues)
[![GitHub forks](https://img.shields.io/github/forks/airicyu/fortel-solar-term.svg)](https://github.com/airicyu/fortel-solar-term/network)
[![GitHub stars](https://img.shields.io/github/stars/airicyu/fortel-solar-term.svg)](https://github.com/airicyu/fortel-solar-term/stargazers)
[![GitHub License](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](https://raw.githubusercontent.com/airicyu/ahp/master/LICENSE)
[![dependencies Status](https://david-dm.org/airicyu/fortel-solar-term/status.svg)](https://david-dm.org/airicyu/fortel-solar-term)
[![devDependencies Status](https://david-dm.org/airicyu/fortel-solar-term/dev-status.svg)](https://david-dm.org/airicyu/fortel-solar-term?type=dev)

This node.js module is a library for some Chinese Astrology 24 terms.(24節氣)
這是一個關於24節氣的nodejs library. 能在時間與節氣年份月份之間換算。


## Project page

- [Github](https://github.com/airicyu/fortel-solar-term)
- [NPM](https://www.npmjs.com/package/fortel-solar-term)

Wiki pages for Chinese Astrology:
- [24節氣](https://zh-yue.wikipedia.org/wiki/%E7%AF%80%E6%B0%A3)

------------------------

## Install

```bash
$ npm install --save fortel-solar-term
```

------------------------

## API & Samples

remarks:
- 年份的定義為該年的立春直至下年的立春
- 月份的定義為以節氣計算的月份 (e.g: 1月 = 立春直至驚蟄之間)
- <strong>換算會有約在5分鍾以內的誤差</strong>

### 估算該年月份的開始及完結時間

API:
```
new TermYearMonth(year, month).getRange();
```

input:
- year: 以節氣計的年份
- month: 節氣月份

output:
- format: { start: xxx, end: xxx }
- start: 節氣月份的開始時間 (moment object)
- end: 節氣月份的開始時間 (moment object)

remarks:
- 這個年份的定義為該年的立春直至下年的立春
- 這個月份的定義為以節氣計算的月份 (e.g: 1月 = 立春直至驚蟄之間)
- <strong>Expected error within 5 min</strong>

code:
```javascript
const fortelSolarTerm = require('fortel-solar-term');
let { TermDatetime, TermYearMonth } = fortelSolarTerm;

// 2019年1月
let {start, end} = new TermYearMonth(2019, 1).getRange();
console.log(`start: ${start.toLocaleString()}`);
console.log(`end: ${end.toLocaleString()}`);
```

output:
```
start: Mon Feb 04 2019 11:11:22 GMT+0800
end: Wed Mar 06 2019 05:06:35 GMT+0800
```

### 估算某時間所屬的節氣月份

API:
```
new TermDatetime(datetime).getYearTermMonth();
```

input:
- datetime: moment object or moment object constructor parameter (single parameter)

output:
- format: { termYear: 2019, termMonth: 1 }
- termYear: 以節氣計算所屬的年份
- termMonth: 以節氣計算所屬的月份

code:
```javascript
const fortelSolarTerm = require('fortel-solar-term');
const moment = require('moment');
let { TermDatetime, TermYearMonth } = fortelSolarTerm;

// 2019年1月
console.log(new TermDatetime(moment.parseZone("2019-02-04T11:00:00+08:00")).getYearTermMonth());
```

output:
```
TermYearMonth { termYear: 2018, termMonth: 12 }
```

------------------------
## Author Contact

- Eric Yu: airic.yu@gmail.com
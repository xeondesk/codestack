"use strict";
/**
 * Copyright (c) 2020 Codestack GmbH. All rights reserved.
 * Licensed under the GNU Affero General Public License (AGPL).
 * See License.AGPL.txt in the project root for license information.
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.liftDate = exports.liftDate1 = exports.orderAsc = exports.earliest = exports.oldest = exports.isDateSmaller = exports.isDateSmallerOrEqual = exports.isDateGreaterOrEqual = exports.durationInMillis = exports.durationInHours = exports.addMillis = exports.yearsLater = void 0;
exports.oneMonthLater = oneMonthLater;
exports.daysBefore = daysBefore;
exports.hoursBefore = hoursBefore;
exports.hoursLater = hoursLater;
exports.secondsBefore = secondsBefore;
exports.rightAfter = rightAfter;
exports.rightBefore = rightBefore;
exports.durationLongerThanSeconds = durationLongerThanSeconds;
exports.millisecondsToHours = millisecondsToHours;
exports.hoursToMilliseconds = hoursToMilliseconds;
exports.goDurationToHumanReadable = goDurationToHumanReadable;
exports.parseGoDurationToMs = parseGoDurationToMs;
const parse_duration_1 = __importDefault(require("parse-duration"));
/**
 * Returns the <code>day</code>th of the next month from <code>formDate</code>.
 * If the next month does not have a <code>day</code>th, the last day of that
 * month is taken.
 * The time is copied from <code>fromDate</code>.
 *
 * @param fromDate
 * @param day
 */
function oneMonthLater(fromDate, day) {
    const later = new Date(fromDate);
    day = day || later.getDate();
    const fromMonth = later.getMonth();
    later.setDate(day);
    later.setMonth(later.getMonth() + 1);
    if (later.getMonth() - fromMonth > 1) {
        later.setDate(0);
    }
    return later.toISOString();
}
const yearsLater = (fromDate, years) => (0, exports.liftDate1)(fromDate, (d) => {
    d.setUTCFullYear(d.getUTCFullYear() + years);
    return d.toISOString();
});
exports.yearsLater = yearsLater;
const addMillis = (d1, millis) => (0, exports.liftDate1)(d1, (d1) => new Date(d1.getTime() + millis).toISOString());
exports.addMillis = addMillis;
const durationInHours = (d1, d2) => (0, exports.liftDate)(d1, d2, (d1, d2) => millisecondsToHours(d1.getTime() - d2.getTime()));
exports.durationInHours = durationInHours;
const durationInMillis = (d1, d2) => (0, exports.liftDate)(d1, d2, (d1, d2) => d1.getTime() - d2.getTime());
exports.durationInMillis = durationInMillis;
const isDateGreaterOrEqual = (d1, d2) => (0, exports.liftDate)(d1, d2, (d1, d2) => d1.getTime() >= d2.getTime());
exports.isDateGreaterOrEqual = isDateGreaterOrEqual;
const isDateSmallerOrEqual = (d1, d2) => !d2 || d1 <= d2;
exports.isDateSmallerOrEqual = isDateSmallerOrEqual;
const isDateSmaller = (d1, d2) => !d2 || d1 < d2;
exports.isDateSmaller = isDateSmaller;
const oldest = (d1, d2) => (d1 > d2 ? d1 : d2);
exports.oldest = oldest;
const earliest = (d1, d2) => (d1 < d2 ? d1 : d2);
exports.earliest = earliest;
const orderAsc = (d1, d2) => (0, exports.liftDate)(d1, d2, (d1, d2) => d1.getTime() - d2.getTime());
exports.orderAsc = orderAsc;
const liftDate1 = (d1, f) => f(new Date(d1));
exports.liftDate1 = liftDate1;
const liftDate = (d1, d2, f) => f(new Date(d1), new Date(d2));
exports.liftDate = liftDate;
function daysBefore(date, days) {
    const result = new Date(date);
    result.setDate(result.getDate() - days);
    return result.toISOString();
}
function hoursBefore(date, hours) {
    const result = new Date(date);
    result.setHours(result.getHours() - hours);
    return result.toISOString();
}
function hoursLater(date, hours) {
    const result = new Date(date);
    result.setHours(result.getHours() + hours);
    return result.toISOString();
}
function secondsBefore(date, seconds) {
    return new Date(new Date(date).getTime() - seconds * 1000).toISOString();
}
function rightAfter(date) {
    return new Date(new Date(date).getTime() + 1).toISOString();
}
function rightBefore(date) {
    return new Date(new Date(date).getTime() - 1).toISOString();
}
function durationLongerThanSeconds(time, durationSeconds, now = Date.now()) {
    return (now - time) / 1000 > durationSeconds;
}
function millisecondsToHours(milliseconds) {
    return milliseconds / 1000 / 60 / 60;
}
function hoursToMilliseconds(hours) {
    return hours * 60 * 60 * 1000;
}
function goDurationToHumanReadable(goDuration) {
    const durationMs = parseGoDurationToMs(goDuration);
    let remainingMs = durationMs;
    const hours = Math.floor(remainingMs / (60 * 60 * 1000));
    remainingMs = remainingMs - hours * 60 * 60 * 1000;
    const minutes = Math.floor(remainingMs / (60 * 1000));
    remainingMs = remainingMs - minutes * 60 * 1000;
    const seconds = Math.floor(remainingMs / 1000);
    remainingMs = remainingMs - seconds * 1000;
    const segments = [];
    if (hours) {
        segments.push(`${hours} hour${hours === 1 ? "" : "s"}`);
    }
    if (minutes) {
        segments.push(`${minutes} minute${minutes === 1 ? "" : "s"}`);
    }
    if (seconds) {
        segments.push(`${seconds} second${seconds === 1 ? "" : "s"}`);
    }
    return segments.join(" ");
}
function parseGoDurationToMs(goDuration) {
    // Handle empty or whitespace-only strings as 0 duration
    if (!goDuration || goDuration.trim() === "") {
        return 0;
    }
    const result = (0, parse_duration_1.default)(goDuration);
    if (result === null || result === undefined) {
        throw new Error(`Invalid Go duration format: ${goDuration}`);
    }
    return result;
}
//# sourceMappingURL=timeutil.js.map
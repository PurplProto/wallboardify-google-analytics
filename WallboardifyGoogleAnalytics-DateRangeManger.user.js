// ==UserScript==
// @name         Wallboardify Google Analytics - Date Range Manger
// @version      1.0.1
// @description  Refreshes the page on the hour and selects yesterday's date range for the data GA uses
// @author       PairedPrototype
// @match        https://analytics.google.com/analytics/web/*
// @run-at       document-idle
// @grant        none
// ==/UserScript==

(function () {
    'use strict';

    const location = window.location;
    const scriptInfo = GM_info;

    const logTag = 'WGA-DRM [' + location.pathname + ']: ';

    function logIt(message, data) {
        if (data) {
            console.log(logTag + message, data);
            return
        }

        console.log(logTag + message);
    }

    function logInfo(message, data) {
        if (data) {
            console.info(logTag + message, data);
            return
        }

        console.info(logTag + message);
    }

    function beginAutoRefresh(currentTime) {
        const refreshTime = new Date();
        const oneHourInMilliseconds = 3600000;

        refreshTime.setTime(refreshTime.getTime() + oneHourInMilliseconds);
        refreshTime.setMinutes(0);
        refreshTime.setSeconds(0);

        const timeout = (refreshTime.getTime() - currentTime.getTime());
        setTimeout(function () {
            window.location.reload(true);
        }, timeout);

        logInfo('Page loaded at:', currentTime);
        logInfo('Expected refresh at:', refreshTime);
    }

    function getCurrentSelectedDateRange() {
        const dateRange = {
            from: null,
            to: null,
        };

        const regex = /\/_u\.date.*\//;
        const encodedDateRange = location.href.match(regex);

        if (encodedDateRange.length === 0) {
            return dateRange;
        }

        const sanitisedDate = encodedDateRange[0].replace(/\//g, "").split("&");

        sanitisedDate.forEach(dirtyDate => {
            const cleanDate = dirtyDate.split("=");

            if (cleanDate[0] === '_u.date00') {
                dateRange.from = cleanDate[1]
            }

            if (cleanDate[0] === '_u.date01') {
                dateRange.to = cleanDate[1]
            }
        });

        return dateRange;
    }

    function navigateToUrl(url) {
        logInfo(`Navigating to '${url}'`);

        window.location = url;
    }

    function buildUrlWithDateRangeAppended(date) {
        const datePrefix00 = '_u.date00';
        const datePrefix01 = '_u.date01';

        let builtUrl = window.location.href.replace(/\/_u\.date.*/g, '');
        builtUrl += `/${datePrefix00}=${date}&${datePrefix01}=${date}/`;

        logIt('Built URL with new date range:', builtUrl);

        return builtUrl;
    }

    function selectYesterdayForDataRange(currentTime) {
        const currentYear = currentTime.getFullYear().toString();
        const currentMonth = (currentTime.getMonth() + 1).toString().padStart(2, '0');
        const yesterdayDate = (currentTime.getDate() - 1).toString().padStart(2, '0');
        const yesterdaysDateString = currentYear + currentMonth + yesterdayDate;

        const currentSelectedRange = getCurrentSelectedDateRange();

        const oneSecondInMilliseconds = 1000;
        const dateRangeNotMatchingMessage = 'Date range "from" and "to" do not match.';
        const dateRangeNotYesterdayMessage = 'Date range is not yesterday.';
        const actionMessage = ' Refreshing...';

        if (currentSelectedRange.from === null || currentSelectedRange.to === null) {
            logInfo('Could not get the current selected date range for the data. It probably isn\'t set.');
            return;
        }

        if (currentSelectedRange.from !== currentSelectedRange.to) {
            logInfo(dateRangeNotMatchingMessage + actionMessage);

            const url = buildUrlWithDateRangeAppended(yesterdaysDateString);
            navigateToUrl(url, oneSecondInMilliseconds * 10);
        }

        if (currentSelectedRange.from !== yesterdaysDateString
            || currentSelectedRange.to !== yesterdaysDateString
        ) {
            logInfo(dateRangeNotYesterdayMessage + actionMessage);

            const url = buildUrlWithDateRangeAppended(yesterdaysDateString);
            navigateToUrl(url, oneSecondInMilliseconds * 10);
        }
    }

    function main() {
        logInfo(scriptInfo.script.name + ' v' + scriptInfo.script.version + ' is running!');

        const currentTime = new Date();

        beginAutoRefresh(currentTime);
        selectYesterdayForDataRange(currentTime);
    }

    main();

})();

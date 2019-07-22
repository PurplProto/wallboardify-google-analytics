// ==UserScript==
// @name         Wallboardify Google Analytics
// @namespace    https://pairedprototype.com/
// @version      1.0.2
// @description  Scrolls useful content into view and hides the left menu bar on page load
// @author       PairedPrototype
// @match        https://analytics.google.com/analytics/web/*
// @match        https://analytics.google.com/analytics/app/*
// @run-at       document-idle
// @updateURL    https://github.com/PairedPrototype/wallboardify-google-analytics/raw/master/WallboardifyGoogleAnalytics.user.js
// @grant        none
// ==/UserScript==

(function () {
    'use strict';

    const scriptInfo = GM_info;

    const hideMenuButtonIdSelector = 'ga-nav-collapse';
    const analyticsContentIdSelector = 'ID-layout';

    const analyticsPage = window.location.pathname;
    const logTag = 'WGA [' + analyticsPage + ']: ';

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

    function hideLeftMenu(element) {
        logInfo('Clicking ' + hideMenuButtonIdSelector);

        element.onLoad = element.click();
    }

    function scrollToAnalytics(element) {
        setTimeout(() => {
            logInfo('Scrolling to ' + analyticsContentIdSelector);
            element.onLoad = element.scrollIntoView();
        }, 1000);
    }

    function waitForAddedNode(params) {
        logInfo('Started watching for mutations on: ', params.id);

        new MutationObserver(function (mutations) {
            var el = document.getElementById(params.id);
            if (el) {
                this.disconnect();
                params.done(el);
            }
        }).observe(params.parent || document, {
            subtree: !!params.recursive,
            childList: true,
        });
    }

    function main() {
        logIt('Wallboardify Google Analytics v' + scriptInfo.script.version + ' is running!');

        if (analyticsPage === '/analytics/web/') {
            waitForAddedNode({
                id: hideMenuButtonIdSelector,
                parent: document.body,
                recursive: false,
                done: hideLeftMenu,
            });
        }

        if (analyticsPage === '/analytics/app/') {
            waitForAddedNode({
                id: analyticsContentIdSelector,
                parent: document.body,
                recursive: false,
                done: scrollToAnalytics,
            });
        }
    }

    main();

})();

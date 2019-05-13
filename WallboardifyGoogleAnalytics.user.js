// ==UserScript==
// @name         Wallboardify Google Analytics
// @namespace    https://pairedprototype.com/
// @version      1.0.0
// @description  Scrolls useful content into view and hides the left menu bar on page load
// @author       PairedPrototype
// @match        https://analytics.google.com/analytics/web/*
// @match        https://analytics.google.com/analytics/app/*
// @grant        none
// ==/UserScript==

(function () {
    'use strict';

    const analyticsPage = window.location.pathname;
    const logTag = 'WGA [' + analyticsPage + ']: ';

    const hideMenuButtonIdSelector = 'ga-nav-collapse';
    const analyticsContentIdSelector = 'ID-layout';

    function logIt(message, data) {
        if (data) {
            console.log(logTag + message, data);
            return
        }

        console.log(logTag + message);
    }

    function hideLeftMenu(element) {
        window.requestIdleCallback(() => {
            logIt('WGA: clicking ' + hideMenuButtonIdSelector);

            element.click();
        });
    }

    function scrollToAnalytics(element) {
        window.requestIdleCallback(() => {
            logIt('WGA: scrolling to ' + analyticsContentIdSelector);

            element.firstElementChild.scrollIntoView(true);
        });
    }

    function waitForAddedNode(params) {
        logIt('started watching for mutations');

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

    logIt('Wallboardify Google Analytics is running!');

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
})();

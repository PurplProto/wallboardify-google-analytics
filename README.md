# Wallboardify Google Analytics

A User script for making Google Analytic pages more wallboard friendly on Chrome!
This may work with other browsers but it has not be tried or tested on anything other than Chrome so your mileage will vary.

## What do the scripts do?

### WallboardifyGoogleAnalytics.user.js

This script is used to hide the left menu bar on page load since it takes up some valuable screen space.
This script will also scroll down to the section displaying the data you actually want to see, on page load.
Because both things are done on page load, this works great with anything the causes the page to refresh, perhaps something like the `WallboardifyGoogleAnalytics-DateRangeManger.user.js` script.

### WallboardifyGoogleAnalytics-DateRangeManger.user.js

This script is used to refresh the page on the hour (at every o'clock). i.e if the page is initially loaded at 8:38 AM, the page will refresh at 9:00 AM.
This script also checks that the selected date range is set to 'Yesterday' on each refresh.

## To use on Chrome

* Get [Tampermonkey](https://chrome.google.com/webstore/detail/tampermonkey/dhdgffkkebhmkfjojejmpbldmpobfkfo)
* Install the [User-script](https://github.com/PairedPrototype/wallboardify-google-analytics/raw/master/WallboardifyGoogleAnalytics.user.js)!
* Vist a GA Dashboard and watch it work :)

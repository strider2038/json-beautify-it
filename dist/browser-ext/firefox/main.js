browser.browserAction.onClicked.addListener(function (tab) {
    browser.tabs.executeScript(null, {file: 'json-beautify-run.min.js'});;
});
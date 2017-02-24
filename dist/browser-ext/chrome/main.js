chrome.browserAction.onClicked.addListener(function (tab) {
    chrome.tabs.executeScript(null, {file: 'json-beautify-run.min.js'});;
});
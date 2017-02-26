# JSON Beautifier

Set of tools for parsing and beautifying JSON data in browser.
* JavaScript function
* Browser extensions for Chrome and Firefox

<a name="JSONBeautifyIt"></a>

## JSONBeautifyIt(selector, [config]) ⇒ <code>Boolean</code>
Function for parsing and beautifying JSON data. To use it just pass selector
argument for searching containers with JSON. Function as default will replace
text data with beautifully formatted HTML structure.

*Example*

Source html
```
<div class="json">{"s":"string","a":[1, 2, 3], "n": null}</div>
```

Function call
```javascript
JSONBeautifyIt('.json');
```

Will be displayed as

![JSONBeautifyIt example](https://raw.githubusercontent.com/strider2038/json-beautify-it/master/docs/example1.jpg "Result of processing JSON data")



**Kind**: global function  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| selector | <code>String</code> |  | Selector for DOM container(s) with source JSON data |
| [config] | <code>Object</code> |  | Configuration array |
| [config.indent] | <code>Number</code> | <code>4</code> | Left indent space length |
| [config.callback] | <code>function</code> |  | Callback function. If is defined all process results will be send via it. Callback parameters are: *html* (generated html code), *container* (source container with JSON data) and *error* (boolean value) |
| [config.uriRegExp] | <code>RegExp</code> | <code>/(https?:\/\/[^\s]+)/g</code> | Regular expression for detecting uri links |
| [config.stylesheetId] | <code>String</code> | <code>&quot;json-beautify-it-stylesheet&quot;</code> | Id for inlined stylesheet |
| [config.encodeStrings] | <code>Boolean</code> | <code>true</code> | Enables/disables html encoding for strings |


## Browser extensions for Chrome and Firefox

Chrome and Firefox extensions for beautifying JSON data in AJAX or API responses in browser.
You have to manually install it in your browser (not available in web stores right now).
All source codes are available here:
* [Chrome](https://github.com/strider2038/json-beautify-it/dist/browser-ext/chrome)
* [Firefox](https://github.com/strider2038/json-beautify-it/dist/browser-ext/firefox)

To use it open page with AJAX or API response and click on extension icon
![JSONBeautifyIt icon](https://raw.githubusercontent.com/strider2038/json-beautify-it/master/dist/browser-ext/chrome/icon16.png "JSONBeautifyIt chrome extension").
After that extension will automatically launch script for beautifiyng JSON.

For example, if you open this link
<https://maps.google.com/maps/api/geocode/json?address=Moscow>
and click on extension's icon you will see something like this

![JSONBeautifyIt extension example](https://raw.githubusercontent.com/strider2038/json-beautify-it/master/docs/example2.jpg "Result of processing JSON data in Chrome")


## Known issues

Numbers in exponential notation will be transformed into simple numeric notation.
For example "3e+1" will be displayed as "30".

/**
 * Function for parsing and beautifying JSON data. To use it just pass selector
 * argument for searching containers with JSON. Function as default will replace
 * text data with beautifully formatted HTML structure.
 * 
 * *Example*
 * 
 * Source html
 * ```
 * <div class="json">{"s":"string","a":[1, 2, 3], "n": null}</div>
 * ```
 * 
 * Function call
 * ```javascript
 * JSONBeautifyIt('.json');
 * ```
 * 
 * Will be displayed as
 * 
 * ![JSONBeautifyIt example](https://github.com/strider2038/json-beautify-it/docs/example1.jpg "Result of processing JSON data")
 * 
 * {doc-extras}
 * @param {String} selector Selector for DOM container(s) with source JSON data
 * @param {Object} [config] Configuration array
 * @param {Number} [config.indent=4] Left indent space length
 * @param {Function} [config.callback] Callback function. If is defined all process
 * results will be send via it. Callback parameters are: *html* (generated html code),
 * *container* (source container with JSON data) and *error* (boolean value)
 * @param {RegExp} [config.uriRegExp=/(https?:\/\/[^\s]+)/g] Regular expression for detecting uri links
 * @param {String} [config.stylesheetId="json-beautify-it-stylesheet"] Id for inlined stylesheet
 * @returns {Boolean}
 */
function JSONBeautifyIt(selector, config) {
    /* {config-file} */
    
    /**
     * Containers with JSON data
     * @type NodeList
     * @private
     */
    var $containers = document.querySelectorAll(selector);
    if (!$containers.length) {
        throw new Error('JSON containers not found');
        return false;
    }

    /* {inline-stylesheet} */

    /**
     * Block ID for folding parts of json data
     * @type Number
     * @private
     */
    var blockId = 0;
    
    /**
     * Generates html for left indent
     * @private
     * @param {Number} size
     * @returns {String}
     */
    var getSpaceHtml = function(size) {
        if (size <= 0) {
            return '';
        }
        var html = '<span class="' + config.classes.space + '">';
        for (var i = 0; i < size * config.indent; i++) {
            html += '&nbsp;';
        }
        return html + '</span>';
    };
    
    /**
     * Generates html for start of the block with toggle trigger
     * @private
     * @returns {String}
     */
    var getBlockStartHtml = function() {
        var html = '<a href="javascript:void(0);" class="' 
                + config.classes.toggle + '" data-id="' + blockId + '"></a>'
                + '<span class="' + config.classes.block + '" data-id="' 
                + blockId + '">';
        blockId++;
        return html;
    };
    
    /**
     * Generates type block
     * @private
     * @param {String} content
     * @param {String} type
     * @returns {String}
     */
    var getTypeBlock = function(content, type) {
        var cls = config.classes.types[type];
        if (type === 'uri') {
            return '<span class="' + cls + '">"</span>'
                + '<a href="' + content + '" target="_blank" class="' 
                + cls + '">' + content + '</a>'
                + '<span class="' + cls + '">"</span>';
        }
        return '<span class="' + cls + '">'
            + content + '</span>';
    };
    
    var regexEncode = /["&'<>`]/g;
    var encodeMap = {
        '"': '&quot;',
        '&': '&amp;',
        '\'': '&#x27;',
        '<': '&lt;',
        '>': '&gt;',
        '`': '&#x60;'
    };
    
    /**
     * Encodes html symbols
     * @private
     * @param {String} s
     * @returns {String}
     */
    var encode = function(s) {
        return s.replace(regexEncode, function(c) {
            return encodeMap[c];
        });
    };
    
    /**
     * Parses node of data and returns formatted html
     * @private
     * @param {*} node
     * @param {Number} level
     * @returns {String}
     */
    var parseNode = function(node, level) {
        level = level || 1;
        
        var html = '';
        var space = getSpaceHtml(level);

        if (node === null) {
            return getTypeBlock('null', null);
        }

        if (Array.isArray(node)) {
            html += '[' + getBlockStartHtml() + '<br />';
            var items = [];
            for (var key in node) {
                items.push(space + parseNode(node[key], level + 1));
            }
            html += items.join(',<br />') + '<br />' + getSpaceHtml(level - 1) 
                    + '</span>]';
            return html;
        }

        if (typeof node === 'object') {
            html += '{' + getBlockStartHtml() + '<br />';
            var items = [];
            for (var key in node) {
                items.push(space + '"' + getTypeBlock(key, 'key') 
                        + '":' + parseNode(node[key], level + 1));
            }
            html += items.join(',<br />') + '<br />' + getSpaceHtml(level - 1) 
                    + '</span>}';
            return html;
        }

        if (typeof node === 'string') {
            if (node.match(config.uriRegExp)) {
                return getTypeBlock(node, 'uri');
            }
            return getTypeBlock(encode(JSON.stringify(node)), 'string');
        }

        if (node === true || node === false) {
            return getTypeBlock(node, 'boolean');
        }

        return getTypeBlock(node, 'number');
    };
    
    /**
     * Binding events (toggling visibility of data sections)
     * @private
     */
    var bindEvents = function() {
        var onToggleClick = function(event) {
            var id = event.target.dataset.id;
            var block = document.querySelector(
                '.' + config.classes.block + '[data-id="' + id + '"]'
            );
            if (event.target.className.match(config.classes.toggleActive)) {
                block.style.display = 'inline';
                event.target.className = event.target.className.replace(
                    config.classes.toggleActive, ''
                ).trim();
            } else {
                block.style.display = 'none';
                event.target.className += ' ' + config.classes.toggleActive;
            }
        };
        
        var buttons = document.getElementsByClassName(config.classes.toggle);
        for (var i = 0; i < buttons.length; i++) {
            buttons[i].addEventListener('click', onToggleClick);
        }
    };
    
    var regexJsonp = /^[$A-Z_][0-9A-Z_$]*\(/i;
    
    var html, htmlData, sourceData, data, error, isJsonp, jsonpPrefix;
    for (var i = 0; i < $containers.length; i++) {
        error = false;
        sourceData = $containers[i].innerHTML.trim();
        if (isJsonp = sourceData.match(regexJsonp)) {
            jsonpPrefix = isJsonp[0];
            isJsonp = isJsonp.length && jsonpPrefix.length && sourceData.slice(-1) === ')';
        }
        if (isJsonp) {
            sourceData = sourceData.replace(jsonpPrefix, '').slice(0, -1);
        }
        try {
            data = JSON.parse(sourceData);
            htmlData = parseNode(data);
            if (isJsonp) {
                htmlData = jsonpPrefix + htmlData + ')';
            }
        } catch (e) {
            htmlData = e.toString();
            error = true;
        }
        html = '<pre class="' + config.classes.container + '">';
        if (!error) {
            html += htmlData;
        } else {
            html += '<span class="' + config.classes.error + '">' + htmlData 
                    + '</span><br>' + sourceData;
        }
        html += '</pre>';
        if (config.callback) {
            config.callback(html, $containers[i], error);
        } else {
            $containers[i].innerHTML = html;
        }
    }
    
    bindEvents();
};

    
    /* 
     * Inlining stylesheets 
     */
    function inlineStylesheets() {
        var css = '{inline-stylesheet-file}';
        var head = document.head || document.getElementsByTagName('head')[0];
        var style = document.createElement('style');

        style.type = 'text/css';
        style.id = config.stylesheetId;
        if (style.styleSheet) {
            style.styleSheet.cssText = css;
        } else {
            style.appendChild(document.createTextNode(css));
        }

        head.appendChild(style);
    };

    if (!document.getElementById(config.stylesheetId)) {
        inlineStylesheets();
    }
    
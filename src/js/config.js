
    /**
     * Default configuration array
     */
    config = config || {};
    config.indent = config.indent || 4;
    config.callback = typeof config.callback === 'function' ? config.callback : null;
    config.uriRegExp = config.uriRegExp || /(https?:\/\/[^\s]+)/g;
    config.stylesheetId = config.stylesheetId || 'json-beautify-it-stylesheet';

    var classPrefix = 'jbi-';
    var typePrefix = 'jbi-type-';
    
    config.classes = {
        container: classPrefix + 'container',
        toggle: classPrefix + 'toggle',
        toggleActive: classPrefix + 'toggle_active',
        block: classPrefix + 'block',
        space: classPrefix + 'space',
        error: classPrefix + 'error',
        types: {
            'key': typePrefix + 'key',
            'string': typePrefix + 'string',
            'number': typePrefix + 'number',
            'null': typePrefix + 'null',
            'boolean': typePrefix + 'boolean',
            uri: typePrefix + 'uri'
        }
    };
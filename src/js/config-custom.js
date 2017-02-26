
    /**
     * Customizable configuration array
     */
    config = config || {};
    config.indent = config.indent || 4;
    config.callback = typeof config.callback === 'function' ? config.callback : null;
    config.uriRegExp = config.uriRegExp || /(https?:\/\/[^\s]+)/g;
    config.stylesheetId = config.stylesheetId || 'json-beautify-it-stylesheet';
    config.encodeStrings = typeof config.encodeStrings === 'undefined' ? true : (config.encodeStrings ? true : false);
    
    config.classPrefix = config.classPrefix || 'jbi';
    config.classPrefix += '-';
    
    config.classes = config.classes || {};
    config.classes.container = config.classes.container || (config.classPrefix + 'container');
    config.classes.toggle = config.classes.toggle || (config.classPrefix + 'toggle');
    config.classes.toggleActive = config.classes.toggleActive || (config.classPrefix + 'toggle_active');
    config.classes.block = config.classes.block || (config.classPrefix + 'block');
    config.classes.space = config.classes.space || (config.classPrefix + 'space');
    config.classes.error = config.classes.error || (config.classPrefix + 'error');
    
    config.typePrefix = config.typePrefix || (config.classPrefix + 'type');
    config.typePrefix += '-';
    
    config.classes.types = config.classes.types || {};
    config.classes.types.key = config.classes.types.key || (config.typePrefix + 'key');
    config.classes.types.string = config.classes.types.string || (config.typePrefix + 'string');
    config.classes.types.number = config.classes.types.number || (config.typePrefix + 'number');
    config.classes.types.null = config.classes.types.null || (config.typePrefix + 'null');
    config.classes.types.uri = config.classes.types.uri || (config.typePrefix + 'uri');
    config.classes.types.boolean = config.classes.types.boolean || (config.typePrefix + 'boolean');
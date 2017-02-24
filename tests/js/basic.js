QUnit.test("basic", function (assert) {
    var buffer = '#test-basic';
    var $buffer = document.querySelector(buffer);
    $buffer.innerHTML = '';
    
    $buffer.innerHTML = 'true';
    JSONBeautifyIt(buffer);
    assert.equal($buffer.innerHTML, 
        '<pre class="jbi-container"><span class="jbi-type-boolean">true</span></pre>', 
        'Boolean true');
        
    $buffer.innerHTML = 'false';
    JSONBeautifyIt(buffer);
    assert.equal($buffer.innerHTML, 
        '<pre class="jbi-container"><span class="jbi-type-boolean">false</span></pre>', 
        'Boolean false');
    
    $buffer.innerHTML = 'null';
    JSONBeautifyIt(buffer);
    assert.equal($buffer.innerHTML, 
        '<pre class="jbi-container"><span class="jbi-type-null">null</span></pre>', 
        'Null value');
    
    $buffer.innerHTML = '391';
    JSONBeautifyIt(buffer);
    assert.equal($buffer.innerHTML, 
        '<pre class="jbi-container"><span class="jbi-type-number">391</span></pre>', 
        'Simple number');
    
    $buffer.innerHTML = '4.55';
    JSONBeautifyIt(buffer);
    assert.equal($buffer.innerHTML, 
        '<pre class="jbi-container"><span class="jbi-type-number">4.55</span></pre>', 
        'Float number');
    
    /*$buffer.innerHTML = '4e2';
    JSONBeautifyIt(buffer);
    assert.equal($buffer.innerHTML, 
        '<pre class="jbi-container"><span class="jbi-type-number">4e2</span></pre>', 
        'Float number in exponential notation');*/
    
    $buffer.innerHTML = '"this is string"';
    JSONBeautifyIt(buffer);
    assert.equal($buffer.innerHTML, 
        '<pre class="jbi-container"><span class="jbi-type-string">"this is string"</span></pre>', 
        'Simple string');
    
    $buffer.innerHTML = '"string \\n \\"with\\" special \\n symbols"';
    JSONBeautifyIt(buffer);
    assert.equal($buffer.innerHTML, 
        '<pre class="jbi-container"><span class="jbi-type-string">"string \\n \\"with\\" special \\n symbols"</span></pre>', 
        'String with special symbols');
    
    $buffer.innerHTML = '"string with <b>html</b> entities"';
    JSONBeautifyIt(buffer);
    assert.equal($buffer.innerHTML, 
        '<pre class="jbi-container"><span class="jbi-type-string">"string with &lt;b&gt;html&lt;/b&gt; entities"</span></pre>', 
        'String with html entities');
    
    $buffer.innerHTML = '[1, 3, "s"]';
    JSONBeautifyIt(buffer);
    assert.equal($buffer.innerHTML, 
        '<pre class="jbi-container">[<a href="javascript:void(0);" ' 
        + 'class="jbi-toggle" data-id="0"></a><span class="jbi-block" data-id="0">'
        + '<br><span class="jbi-space">&nbsp;&nbsp;&nbsp;&nbsp;</span>'
        + '<span class="jbi-type-number">1</span>,<br><span class="jbi-space">'
        + '&nbsp;&nbsp;&nbsp;&nbsp;</span><span class="jbi-type-number">3</span>,'
        + '<br><span class="jbi-space">&nbsp;&nbsp;&nbsp;&nbsp;</span>'
        + '<span class="jbi-type-string">"s"</span><br></span>]</pre>', 
        'Simple array');
        
    assert.ok(document.querySelector('.jbi-block').offsetParent !== null, 'Array block is visible');
    document.querySelector('.jbi-toggle').click();
    assert.ok(document.querySelector('.jbi-block').offsetParent === null, 'Array block is not visible');
    document.querySelector('.jbi-toggle').click();
    assert.ok(document.querySelector('.jbi-block').offsetParent !== null, 'Array block is visible again');
    
    $buffer.innerHTML = '{ "s": "str", "i": 1 }';
    JSONBeautifyIt(buffer);
    assert.equal($buffer.innerHTML, 
        '<pre class="jbi-container">{<a href="javascript:void(0);" class="jbi-toggle" '
        + 'data-id="0"></a><span class="jbi-block" data-id="0"><br><span class="jbi-space">'
        + '&nbsp;&nbsp;&nbsp;&nbsp;</span>"<span class="jbi-type-key">s</span>":'
        + '<span class="jbi-type-string">"str"</span>,<br><span class="jbi-space">'
        + '&nbsp;&nbsp;&nbsp;&nbsp;</span>"<span class="jbi-type-key">i</span>":'
        + '<span class="jbi-type-number">1</span><br></span>}</pre>', 
        'Simple object');
    
    assert.ok(document.querySelector('.jbi-block').offsetParent !== null, 'Object block is visible');
    document.querySelector('.jbi-toggle').click();
    assert.ok(document.querySelector('.jbi-block').offsetParent === null, 'Object block is not visible');
    document.querySelector('.jbi-toggle').click();
    assert.ok(document.querySelector('.jbi-block').offsetParent !== null, 'Object block is visible again');
    
    $buffer.innerHTML = 'callback({"jsonp":true})';
    JSONBeautifyIt(buffer);
    assert.equal($buffer.innerHTML, 
        '<pre class="jbi-container">callback({<a href="javascript:void(0);" '
        + 'class="jbi-toggle" data-id="0"></a><span class="jbi-block" data-id="0">'
        + '<br><span class="jbi-space">&nbsp;&nbsp;&nbsp;&nbsp;'
        + '</span>"<span class="jbi-type-key">jsonp</span>":'
        + '<span class="jbi-type-boolean">true</span><br></span>})</pre>', 
        'JSONP format');
    
    $buffer.innerHTML = '';
});
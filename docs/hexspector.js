(function () {
'use strict';

function appendNode ( node, target ) {
	target.appendChild( node );
}

function insertNode ( node, target, anchor ) {
	target.insertBefore( node, anchor );
}

function detachNode ( node ) {
	node.parentNode.removeChild( node );
}

function createElement ( name ) {
	return document.createElement( name );
}

function createText ( data ) {
	return document.createTextNode( data );
}

function addEventListener ( node, event, handler ) {
	node.addEventListener ( event, handler, false );
}

function removeEventListener ( node, event, handler ) {
	node.removeEventListener ( event, handler, false );
}

function setAttribute ( node, attribute, value ) {
	node.setAttribute ( attribute, value );
}

function get ( key ) {
	return key ? this._state[ key ] : this._state;
}

function fire ( eventName, data ) {
	var this$1 = this;

	var handlers = eventName in this._handlers && this._handlers[ eventName ].slice();
	if ( !handlers ) { return; }

	for ( var i = 0; i < handlers.length; i += 1 ) {
		handlers[i].call( this$1, data );
	}
}

function observe ( key, callback, options ) {
	var group = ( options && options.defer ) ? this._observers.pre : this._observers.post;

	( group[ key ] || ( group[ key ] = [] ) ).push( callback );

	if ( !options || options.init !== false ) {
		callback.__calling = true;
		callback.call( this, this._state[ key ] );
		callback.__calling = false;
	}

	return {
		cancel: function () {
			var index = group[ key ].indexOf( callback );
			if ( ~index ) { group[ key ].splice( index, 1 ); }
		}
	};
}

function on ( eventName, handler ) {
	var handlers = this._handlers[ eventName ] || ( this._handlers[ eventName ] = [] );
	handlers.push( handler );

	return {
		cancel: function () {
			var index = handlers.indexOf( handler );
			if ( ~index ) { handlers.splice( index, 1 ); }
		}
	};
}

function dispatchObservers ( component, group, newState, oldState ) {
	for ( var key in group ) {
		if ( !( key in newState ) ) { continue; }

		var newValue = newState[ key ];
		var oldValue = oldState[ key ];

		if ( newValue === oldValue && typeof newValue !== 'object' ) { continue; }

		var callbacks = group[ key ];
		if ( !callbacks ) { continue; }

		for ( var i = 0; i < callbacks.length; i += 1 ) {
			var callback = callbacks[i];
			if ( callback.__calling ) { continue; }

			callback.__calling = true;
			callback.call( component, newValue, oldValue );
			callback.__calling = false;
		}
	}
}

var addedCss = false;
function addCss () {
	var style = createElement( 'style' );
	style.textContent = "\n  .hexspector[svelte-1973377133], [svelte-1973377133] .hexspector {\n    \n\n    background: aquamarine;\n    font-family: sans-serif;\n    height: 80vh;\n    display: flex;\n    flex-direction: column;\n    font-family: monospace;\n\n    width: 80vw;\n  }\n  .hexspector.collapsed[svelte-1973377133], [svelte-1973377133] .hexspector.collapsed {\n    height: auto;\n    width: auto;\n  }\n  label[svelte-1973377133], [svelte-1973377133] label {\n    display: flex;\n    font-size: 1rem;\n  }\n  label  span[svelte-1973377133], label  [svelte-1973377133] span, label[svelte-1973377133]  span, [svelte-1973377133] label  span {\n    padding-right: .2rem;\n    font-weight: bold;\n  }\n  label  input[svelte-1973377133], label  [svelte-1973377133] input, label[svelte-1973377133]  input, [svelte-1973377133] label  input {\n    flex: 1;\n    border: none;\n    font-size: 1rem;\n    background: rgba(255,255,255,0.95);\n    font-family: monospace;\n  }\n  .panel[svelte-1973377133], [svelte-1973377133] .panel, label[svelte-1973377133], [svelte-1973377133] label, span[svelte-1973377133], [svelte-1973377133] span {\n    margin: 2px;\n  }\n  .panel[svelte-1973377133], [svelte-1973377133] .panel {\n    flex: 1;\n    background: rgba(255,255,255,0.95);\n    margin-top:0;\n    overflow: scroll\n  }\n";
	appendNode( style, document.head );

	addedCss = true;
}

function renderMainFragment ( root, component ) {
	var div = createElement( 'div' );
	setAttribute( div, 'svelte-1973377133', '' );
	div.className = "hexspector " + ( root.expanded ? '' : 'collapsed' );
	
	var label = createElement( 'label' );
	setAttribute( label, 'svelte-1973377133', '' );
	
	appendNode( label, div );
	
	var span = createElement( 'span' );
	setAttribute( span, 'svelte-1973377133', '' );
	
	appendNode( span, label );
	appendNode( createText( "hexspector" ), span );
	appendNode( createText( "\n    " ), label );
	
	var input = createElement( 'input' );
	setAttribute( input, 'svelte-1973377133', '' );
	input.type = "text";
	input.placeholder = "window.yourArrayBuffer";
	
	var input_updating = false;
	
	function inputChangeHandler () {
		input_updating = true;
		component.set({ eval: input.value });
		input_updating = false;
	}
	
	addEventListener( input, 'input', inputChangeHandler );
	input.value = root.eval;
	
	input.size = "25";
	
	appendNode( input, label );
	appendNode( createText( "\n\n  " ), div );
	
	var div1 = createElement( 'div' );
	setAttribute( div1, 'svelte-1973377133', '' );
	div1.className = "panel";
	component.refs.panel = div1;
	
	appendNode( div1, div );

	return {
		mount: function ( target, anchor ) {
			insertNode( div, target, anchor );
		},
		
		update: function ( changed, root ) {
			div.className = "hexspector " + ( root.expanded ? '' : 'collapsed' );
			
			if ( !input_updating ) { input.value = root.eval; }
		},
		
		teardown: function ( detach ) {
			removeEventListener( input, 'input', inputChangeHandler );
			if ( component.refs.panel === div1 ) { component.refs.panel = null; }
			
			if ( detach ) {
				detachNode( div );
			}
		}
	};
}

function template$1 ( options ) {
	options = options || {};
	
	this.refs = {};
	this._state = options.data || {};

	this._observers = {
		pre: Object.create( null ),
		post: Object.create( null )
	};

	this._handlers = Object.create( null );

	this._root = options._root;
	this._yield = options._yield;

	if ( !addedCss ) { addCss(); }
	
	this._fragment = renderMainFragment( this._state, this );
	if ( options.target ) { this._fragment.mount( options.target, null ); }
}

template$1.prototype.get = get;
template$1.prototype.fire = fire;
template$1.prototype.observe = observe;
template$1.prototype.on = on;

template$1.prototype.set = function set ( newState ) {
	var oldState = this._state;
	this._state = Object.assign( {}, oldState, newState );
	
	dispatchObservers( this, this._observers.pre, newState, oldState );
	if ( this._fragment ) { this._fragment.update( newState, this._state ); }
	dispatchObservers( this, this._observers.post, newState, oldState );
};

template$1.prototype.teardown = function teardown ( detach ) {
	this.fire( 'teardown' );

	this._fragment.teardown( detach !== false );
	this._fragment = null;

	this._state = {};
};

var padZero = function (str, i) {
  while(str.length < i)
    { str = "0" + str; }

  return str
};

var norm_map = {
  '\n': ' ',
  '\t': ' '
};

var norm = function (s) { return norm_map[s] || s; };

var UI = function (rows, cols, container) {
  if ( container === void 0 ) container = document.body;


  var root = createElement$1('aside');
  style(root);

  var number_root = createElement$1('section');
  var hex_root    = createElement$1('section');
  var text_root   = createElement$1('section');

  style(number_root);
  style(hex_root);
  style(text_root);

  root.appendChild(number_root);
  root.appendChild(hex_root);
  root.appendChild(text_root);

  for(var i = 0; i < rows; i++) {
    var number = createElement$1('div');
    number.innerText = i;

    var hexes = createElement$1('div');
    var texts = createElement$1('div');

    for(var j = 0; j < cols; j++) {

      var hex  = createElement$1('span');
      var text = createElement$1('span');

      hex.innerText = '__';
      text.innerText = '.';

      hexes.appendChild(hex);
      texts.appendChild(text);

    }

    number_root.appendChild(number);
    hex_root.appendChild(hexes);
    text_root.appendChild(texts);

  }

  container.appendChild(root);

  // display data to this
  return function(view) {

    var idx, j, value;

    for (var i = 0; i < rows; i++) {
      // populate number
      number_root.children[i].innerText =  padZero((i*cols).toString(16), 5);

      for(j = 0; j < cols; j++) {

        idx = i * cols + j;

        if(idx >= view.byteLength) {
          hex_root.children[i].children[j].innerText = '__';
          text_root.children[i].children[j].innerText = '_';


        } else {
          value = view.getUint8(i * cols + j);

          // populate hex
          hex_root.children[i].children[j].innerText =
            padZero(value.toString(16), 2);

          // populate text
          text_root.children[i].children[j].innerText =
            norm(String.fromCharCode(value));


        }

      }

    }

  }

};

function createElement$1(name) {
  var element = document.createElement(name);
  style(element);
  return element
}

function style(element) {
  switch (element.tagName) {

  case 'ASIDE':
    element.style.fontFamily = 'monospace';
    element.style.display = 'flex';
    element.style.justifyContent = 'space-around';
    break

  case 'SECTION':
    element.style.margin = '0 1em';
    break

  case 'DIV':
    element.style.whiteSpace = 'nowrap';
    element.style.height = '1em';
    break

  case 'SPAN':
    element.style.display = 'inline-block';
    element.style.margin = 'auto .2em';
    break

  }

}

var element = new template$1({
  target: document.body,
  data: {
    eval: '',
    expanded: false
  }
});

var panel = element.refs.panel;

element.observe( 'eval', function (answer) {
  var target;

  element.set({expanded: false});

  if(!answer) {
    return panel.innerText = ''
  }

  try {
    target = eval(answer);
  } catch (e) {
    panel.innerText = answer + " not found";
  }

  if(typeof target == 'undefined') {
    panel.innerText = answer + " is undefined ";
  }
  else {

    // urgh
    [
      Int8Array, Uint8Array, Uint8ClampedArray, Int16Array, Uint16Array, Int32Array, Uint32Array, Float32Array, Float64Array
    ].forEach(function (type) {
      if(target instanceof type) {
        target = target.buffer;
      }
    });


    if(!(target instanceof ArrayBuffer)) {
      panel.innerText = answer + " is not an ArrayBuffer or typed array";
    } else {
      panel.innerHTML = '';

      var cols = 16;
      var rows = Math.min(750,target.byteLength / cols);



      var ui = UI(rows, cols, panel);

      var view = new DataView(target);

      ui(view);

      element.set({expanded: true});

    }

  }

});


window.hexspector = function (e) {
  element.set({eval: e});
};

}());

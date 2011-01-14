/*!
 * _.require v0.10
 *  Copyright 2010, Andy VanWagoner
 *  Released under the MIT, and BSD Licenses.
 **/
(function(_, undefined) { _ = _ || window;
	_.module = false;
	var obj_map = {}, ns_map = {}, root = [], reqs = {}, q = [], empty = function(){},
		REQUESTED = 1, LOADED = 2, EXECUTED = 3, COMPLETE = 4, initproto = false,
		is_url = /:|#|\?|\/|\.(?:css|js|gif|jpe?g|png)$/i, is_css = /\.css$/i, is_img = /\.(?:gif|jpe?g|png)$/i,
		inOrder = !!(window.opera || document.getBoxObjectFor || window.mozInnerScreenX >= 0),
		d = document, head = d.head || d.getElementsByTagName('head')[0] || d.documentElement;

	function warn(text) { return window.console && console.warn && console.warn(text); }
	function add_b(url) { return require.build ? url + (url.indexOf('?') < 0 ? '?' : '&') + require.build : url; }

	function script(src, type, ready) { // create script tag and add to head
		var s = d.createElement('script'); s.type = type || 'text/javascript'; s.src = add_b(src);
		function cleanup() { return s.onload && (s.onload = s.onerror = s.onreadystatechange = null) || head.removeChild(s); }
		s.onload = function() { return cleanup() && ready(); }; // make sure event and cleanup happens only once
		s.onreadystatechange = function() { return (s.readyState.length % 2) || s.onload(); }; // loaded and complete have even lengths
		s.onerror = function() { warn('failed to load: ' + src); reqs[src].failed = true; return s.onload(); }
		return head.appendChild(s);
	}

	function link(req) { // create link and call complete on load
		var s = document.createElement('link'); s.rel = 'stylesheet'; s.type = 'text/css'; s.href = add_b(req.url);
		var load_t = setInterval(function() { return (s.sheet || s.styleSheet) && s.onload(); }, 100);
		s.onload = function() { clearInterval(load_t); s.onload = null; return req.complete(); }
		return head.appendChild(s);
	}

	function img(req) { // create image and call complete on load
		var img = new Image();
		img.onload = function() { return req.complete(); };
		img.src = add_b(req.url);
		return img;
	}

	function Requirement(url, type) { // object to keep track of files required
		this.url = url;
		this.listeners = [];
		this.status = 0;
		this.children = [];
		this.type = type;
		return reqs[url] = this;
	}

	Requirement.prototype = {
		push: function push(child) { this.children.push(child); },
		check: function check() {
			var list = this.children, i = list.length, l;
			while (i) { if (list[--i].status !== COMPLETE) { return; } }
			this.complete();
		},
		complete: function complete(explicit) {
			if (this.status === COMPLETE || (this.failed && !explicit)) { return false; } // don't complete twice
			this.status = COMPLETE;
			for (var list = this.listeners, i = 0, l = list.length; i < l; ++i) { list[i].call(this); }
			this.listeners = null;
		},
		loaded: function loaded(xhr) {
			this.status = LOADED;
			if (q.push(this) === 1) { q[0].execute(); }
		},
		execute: function execute() {
			var r = this, type = 'text/javascript';
			script(this.url, type, function() { r.executed(); });
		},
		executed: function executed() {
			if (q.shift() !== this) { throw new Error('Script execution order broken.'); }
			if (!inOrder && q.length) { q[0].execute(); }
			this.status = EXECUTED;
			this.check();
		},
		request: function request(onready) {
			if (this.status === COMPLETE) { onready(); return; }
			this.listeners.push(onready);

			var p = q[0] || root; p.push(this);
			if (p !== root) { this.listeners.push(function() { return p.check(); }); }
			if (this.status >= REQUESTED) { return; }

			this.status = REQUESTED;

			if (this.type === 'css') { return link(this); }
			if (this.type === 'img') { return img(this); }

            if (inOrder) { q.push(this); }
			var r = this, type = inOrder ? 'text/javascript' : 'text/plain';
			script(this.url, type, function() { return inOrder ? r.executed() : r.loaded(); });
		}
	};

	function each(arr, fn) {
		if (typeof arr === 'string') { arr = [ arr ]; } // make sure we have an array
		var i = arr.length;
		while (i) { // update or create the requirement node
			var url  = absolutize(resolve(arr[--i])),
				type = is_css.test(arr[i]) ? 'css' : (is_img.test(arr[i]) ? 'img' : 'js');
			fn(reqs[url] || new Requirement(url, type));
		}
		return _;
	}

	function require(arr, onready) {
		if (typeof arr === 'string') { arr = [ arr ]; } // make sure we have an array
		var left = arr.length; if (!left && onready) { return onready.apply(_, findAll(arr)); }
		function check() { if (!--left && onready) { onready.apply(_, findAll(arr)); } }
		return each(arr, function(req) { return req.request(check); });
	} _.require = require;

	function resolve(name) { // get url for object by name, pass through urls
		//if (is_url.test(name)) { return name; } // css and img should always be urls
		if (obj_map[name]) { return obj_map[name](name); }
		var parts = name.split('.'), ns;
		while (parts.length) {
			if (ns_map[ns = parts.join('.')]) { return ns_map[ns](name); }
			parts.pop();
		}
		if (ns_map['']) { return ns_map[''](name); }
		return name.split('.').join('/') + '.js';
	} require.resolve = resolve;

	function findAll(names) { // resolve an array of strings to objects
		var objs = [], i, l = names.length;
		for (i = 0; i < l; ++i) { objs[i] = find(names[i]); }
		return objs;
	} require.findAll = findAll;

	function find(name, create) { // resolve string to object
		if (typeof name !== 'string') { return name; }
		if (is_url.test(name)) { return undefined; }
		var o = window, a = name.split('.'), i, l = a.length;
		for (i = 0; i < l && o; ++i) { o = o[a[i]] || create && (o[a[i]] = {}); }
		return (i === l) ? o : undefined;
	} require.find = find;

	var div; (div = d.createElement('div')).innerHTML = '<a></a>';
	function absolutize(url) { // relative to absolute url
		div.firstChild.href = url;
		if (div.canHaveHTML) { div.innerHTML = div.innerHTML; } // run through the parser for IE
		return div.firstChild.href;
	} require.absolutize = absolutize;

	function complete(arr) { // declare a class name or file complete
		return each(arr, function(req) { return req.complete(true); });
	} require.complete = complete;

	function executed(arr) { // declare a class name or file executed
		return each(arr, function(req) { return req.status < EXECUTED && (req.status = EXECUTED) && req.check(); });
	} require.executed = executed;

	function requested(arr) { // declare a class name or file requested
		return each(arr, function(req) {
			req.status = Math.max(req.status, REQUESTED);
			req.request(empty);
		});
	} require.requested = requested;

	function makeFn(str) { return (typeof str === 'function') ? str : function() { return str; }; }

	// set urls for objects and namespaces - url can be function that takes name and returns url
	function setObjUrl(name, url) { obj_map[name] = makeFn(url); return this; }
	function setNsUrl (name, url) { ns_map[name]  = makeFn(url); return this; }
	require.setObjUrl = setObjUrl; require.setNsUrl = setNsUrl;

	function addObjMap(o) { for (var k in o) { obj_map[k] = makeFn(o[k]); } return this; }
	function addNsMap (o) { for (var k in o) { ns_map[k]  = makeFn(o[k]); } return this; }
	require.addObjMap = addObjMap; require.addNsMap = addNsMap;

	require.tree  = root; // make the required tree available
	require.build = 0;    // used to bust cache when a new site build occurs

	/** async class system with requiring and auto resolving names to objects
	 * o.base: String || Function - The base class or name of base class,
	 * o.requires: String || Array - Names or Objects required before defining */
	function declare(name, o, onready) {
		return require(o.requires || [], function build_class() { // load dependencies, then define class
			var BaseClass = find(o.base) || declare.base || Object, proto, p, i, l;

			initproto = true; proto = new BaseClass(); initproto = false; // Create the prototype

			for (p in o) { proto[p] = o[p]; } // Add new members
			proto.base = BaseClass; // so you don't need to hardcode super() calls

			function Class() { // Create the class
				return (!initproto && this.initialize) ? this.initialize.apply(this, arguments) : this;
			} Class.prototype = proto;

			name = name.split('.'); // Attach to namespace (create if necessary)
			var ns = find(name.slice(0, -1).join('.'), true);
			Class.className = name.slice(-1)[0];
			ns[Class.className] = Class;

			if (typeof onready === 'function') { onready(Class); } // call ready handler
		});
	} require.declare = (_.declare = declare);
	declare.base = function base(){ return this; };
})(window); // pass in namespace


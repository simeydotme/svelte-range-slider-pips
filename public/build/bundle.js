
(function(l, r) { if (l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (window.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(window.document);
var app = (function () {
    'use strict';

    function noop() { }
    function assign(tar, src) {
        // @ts-ignore
        for (const k in src)
            tar[k] = src[k];
        return tar;
    }
    function add_location(element, file, line, column, char) {
        element.__svelte_meta = {
            loc: { file, line, column, char }
        };
    }
    function run(fn) {
        return fn();
    }
    function blank_object() {
        return Object.create(null);
    }
    function run_all(fns) {
        fns.forEach(run);
    }
    function is_function(thing) {
        return typeof thing === 'function';
    }
    function safe_not_equal(a, b) {
        return a != a ? b == b : a !== b || ((a && typeof a === 'object') || typeof a === 'function');
    }
    function validate_store(store, name) {
        if (store != null && typeof store.subscribe !== 'function') {
            throw new Error(`'${name}' is not a store with a 'subscribe' method`);
        }
    }
    function subscribe(store, ...callbacks) {
        if (store == null) {
            return noop;
        }
        const unsub = store.subscribe(...callbacks);
        return unsub.unsubscribe ? () => unsub.unsubscribe() : unsub;
    }
    function component_subscribe(component, store, callback) {
        component.$$.on_destroy.push(subscribe(store, callback));
    }
    function create_slot(definition, ctx, $$scope, fn) {
        if (definition) {
            const slot_ctx = get_slot_context(definition, ctx, $$scope, fn);
            return definition[0](slot_ctx);
        }
    }
    function get_slot_context(definition, ctx, $$scope, fn) {
        return definition[1] && fn
            ? assign($$scope.ctx.slice(), definition[1](fn(ctx)))
            : $$scope.ctx;
    }
    function get_slot_changes(definition, $$scope, dirty, fn) {
        if (definition[2] && fn) {
            const lets = definition[2](fn(dirty));
            if ($$scope.dirty === undefined) {
                return lets;
            }
            if (typeof lets === 'object') {
                const merged = [];
                const len = Math.max($$scope.dirty.length, lets.length);
                for (let i = 0; i < len; i += 1) {
                    merged[i] = $$scope.dirty[i] | lets[i];
                }
                return merged;
            }
            return $$scope.dirty | lets;
        }
        return $$scope.dirty;
    }
    function update_slot(slot, slot_definition, ctx, $$scope, dirty, get_slot_changes_fn, get_slot_context_fn) {
        const slot_changes = get_slot_changes(slot_definition, $$scope, dirty, get_slot_changes_fn);
        if (slot_changes) {
            const slot_context = get_slot_context(slot_definition, ctx, $$scope, get_slot_context_fn);
            slot.p(slot_context, slot_changes);
        }
    }
    function exclude_internal_props(props) {
        const result = {};
        for (const k in props)
            if (k[0] !== '$')
                result[k] = props[k];
        return result;
    }

    const is_client = typeof window !== 'undefined';
    let now = is_client
        ? () => window.performance.now()
        : () => Date.now();
    let raf = is_client ? cb => requestAnimationFrame(cb) : noop;

    const tasks = new Set();
    function run_tasks(now) {
        tasks.forEach(task => {
            if (!task.c(now)) {
                tasks.delete(task);
                task.f();
            }
        });
        if (tasks.size !== 0)
            raf(run_tasks);
    }
    /**
     * Creates a new task that runs on each raf frame
     * until it returns a falsy value or is aborted
     */
    function loop(callback) {
        let task;
        if (tasks.size === 0)
            raf(run_tasks);
        return {
            promise: new Promise(fulfill => {
                tasks.add(task = { c: callback, f: fulfill });
            }),
            abort() {
                tasks.delete(task);
            }
        };
    }

    function append(target, node) {
        target.appendChild(node);
    }
    function insert(target, node, anchor) {
        target.insertBefore(node, anchor || null);
    }
    function detach(node) {
        node.parentNode.removeChild(node);
    }
    function destroy_each(iterations, detaching) {
        for (let i = 0; i < iterations.length; i += 1) {
            if (iterations[i])
                iterations[i].d(detaching);
        }
    }
    function element(name) {
        return document.createElement(name);
    }
    function text(data) {
        return document.createTextNode(data);
    }
    function space() {
        return text(' ');
    }
    function empty() {
        return text('');
    }
    function listen(node, event, handler, options) {
        node.addEventListener(event, handler, options);
        return () => node.removeEventListener(event, handler, options);
    }
    function prevent_default(fn) {
        return function (event) {
            event.preventDefault();
            // @ts-ignore
            return fn.call(this, event);
        };
    }
    function attr(node, attribute, value) {
        if (value == null)
            node.removeAttribute(attribute);
        else if (node.getAttribute(attribute) !== value)
            node.setAttribute(attribute, value);
    }
    function children(element) {
        return Array.from(element.childNodes);
    }
    function set_style(node, key, value, important) {
        node.style.setProperty(key, value, important ? 'important' : '');
    }
    function toggle_class(element, name, toggle) {
        element.classList[toggle ? 'add' : 'remove'](name);
    }
    function custom_event(type, detail) {
        const e = document.createEvent('CustomEvent');
        e.initCustomEvent(type, false, false, detail);
        return e;
    }
    class HtmlTag {
        constructor(anchor = null) {
            this.a = anchor;
            this.e = this.n = null;
        }
        m(html, target, anchor = null) {
            if (!this.e) {
                this.e = element(target.nodeName);
                this.t = target;
                this.h(html);
            }
            this.i(anchor);
        }
        h(html) {
            this.e.innerHTML = html;
            this.n = Array.from(this.e.childNodes);
        }
        i(anchor) {
            for (let i = 0; i < this.n.length; i += 1) {
                insert(this.t, this.n[i], anchor);
            }
        }
        p(html) {
            this.d();
            this.h(html);
            this.i(this.a);
        }
        d() {
            this.n.forEach(detach);
        }
    }

    let current_component;
    function set_current_component(component) {
        current_component = component;
    }

    const dirty_components = [];
    const binding_callbacks = [];
    const render_callbacks = [];
    const flush_callbacks = [];
    const resolved_promise = Promise.resolve();
    let update_scheduled = false;
    function schedule_update() {
        if (!update_scheduled) {
            update_scheduled = true;
            resolved_promise.then(flush);
        }
    }
    function tick() {
        schedule_update();
        return resolved_promise;
    }
    function add_render_callback(fn) {
        render_callbacks.push(fn);
    }
    function add_flush_callback(fn) {
        flush_callbacks.push(fn);
    }
    let flushing = false;
    const seen_callbacks = new Set();
    function flush() {
        if (flushing)
            return;
        flushing = true;
        do {
            // first, call beforeUpdate functions
            // and update components
            for (let i = 0; i < dirty_components.length; i += 1) {
                const component = dirty_components[i];
                set_current_component(component);
                update(component.$$);
            }
            dirty_components.length = 0;
            while (binding_callbacks.length)
                binding_callbacks.pop()();
            // then, once components are updated, call
            // afterUpdate functions. This may cause
            // subsequent updates...
            for (let i = 0; i < render_callbacks.length; i += 1) {
                const callback = render_callbacks[i];
                if (!seen_callbacks.has(callback)) {
                    // ...so guard against infinite loops
                    seen_callbacks.add(callback);
                    callback();
                }
            }
            render_callbacks.length = 0;
        } while (dirty_components.length);
        while (flush_callbacks.length) {
            flush_callbacks.pop()();
        }
        update_scheduled = false;
        flushing = false;
        seen_callbacks.clear();
    }
    function update($$) {
        if ($$.fragment !== null) {
            $$.update();
            run_all($$.before_update);
            const dirty = $$.dirty;
            $$.dirty = [-1];
            $$.fragment && $$.fragment.p($$.ctx, dirty);
            $$.after_update.forEach(add_render_callback);
        }
    }
    const outroing = new Set();
    let outros;
    function group_outros() {
        outros = {
            r: 0,
            c: [],
            p: outros // parent group
        };
    }
    function check_outros() {
        if (!outros.r) {
            run_all(outros.c);
        }
        outros = outros.p;
    }
    function transition_in(block, local) {
        if (block && block.i) {
            outroing.delete(block);
            block.i(local);
        }
    }
    function transition_out(block, local, detach, callback) {
        if (block && block.o) {
            if (outroing.has(block))
                return;
            outroing.add(block);
            outros.c.push(() => {
                outroing.delete(block);
                if (callback) {
                    if (detach)
                        block.d(1);
                    callback();
                }
            });
            block.o(local);
        }
    }

    function bind(component, name, callback) {
        const index = component.$$.props[name];
        if (index !== undefined) {
            component.$$.bound[index] = callback;
            callback(component.$$.ctx[index]);
        }
    }
    function create_component(block) {
        block && block.c();
    }
    function mount_component(component, target, anchor) {
        const { fragment, on_mount, on_destroy, after_update } = component.$$;
        fragment && fragment.m(target, anchor);
        // onMount happens before the initial afterUpdate
        add_render_callback(() => {
            const new_on_destroy = on_mount.map(run).filter(is_function);
            if (on_destroy) {
                on_destroy.push(...new_on_destroy);
            }
            else {
                // Edge case - component was destroyed immediately,
                // most likely as a result of a binding initialising
                run_all(new_on_destroy);
            }
            component.$$.on_mount = [];
        });
        after_update.forEach(add_render_callback);
    }
    function destroy_component(component, detaching) {
        const $$ = component.$$;
        if ($$.fragment !== null) {
            run_all($$.on_destroy);
            $$.fragment && $$.fragment.d(detaching);
            // TODO null out other refs, including component.$$ (but need to
            // preserve final state?)
            $$.on_destroy = $$.fragment = null;
            $$.ctx = [];
        }
    }
    function make_dirty(component, i) {
        if (component.$$.dirty[0] === -1) {
            dirty_components.push(component);
            schedule_update();
            component.$$.dirty.fill(0);
        }
        component.$$.dirty[(i / 31) | 0] |= (1 << (i % 31));
    }
    function init(component, options, instance, create_fragment, not_equal, props, dirty = [-1]) {
        const parent_component = current_component;
        set_current_component(component);
        const prop_values = options.props || {};
        const $$ = component.$$ = {
            fragment: null,
            ctx: null,
            // state
            props,
            update: noop,
            not_equal,
            bound: blank_object(),
            // lifecycle
            on_mount: [],
            on_destroy: [],
            before_update: [],
            after_update: [],
            context: new Map(parent_component ? parent_component.$$.context : []),
            // everything else
            callbacks: blank_object(),
            dirty
        };
        let ready = false;
        $$.ctx = instance
            ? instance(component, prop_values, (i, ret, ...rest) => {
                const value = rest.length ? rest[0] : ret;
                if ($$.ctx && not_equal($$.ctx[i], $$.ctx[i] = value)) {
                    if ($$.bound[i])
                        $$.bound[i](value);
                    if (ready)
                        make_dirty(component, i);
                }
                return ret;
            })
            : [];
        $$.update();
        ready = true;
        run_all($$.before_update);
        // `false` as a special case of no DOM component
        $$.fragment = create_fragment ? create_fragment($$.ctx) : false;
        if (options.target) {
            if (options.hydrate) {
                const nodes = children(options.target);
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.l(nodes);
                nodes.forEach(detach);
            }
            else {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.c();
            }
            if (options.intro)
                transition_in(component.$$.fragment);
            mount_component(component, options.target, options.anchor);
            flush();
        }
        set_current_component(parent_component);
    }
    class SvelteComponent {
        $destroy() {
            destroy_component(this, 1);
            this.$destroy = noop;
        }
        $on(type, callback) {
            const callbacks = (this.$$.callbacks[type] || (this.$$.callbacks[type] = []));
            callbacks.push(callback);
            return () => {
                const index = callbacks.indexOf(callback);
                if (index !== -1)
                    callbacks.splice(index, 1);
            };
        }
        $set() {
            // overridden by instance, if it has props
        }
    }

    function dispatch_dev(type, detail) {
        document.dispatchEvent(custom_event(type, Object.assign({ version: '3.24.0' }, detail)));
    }
    function append_dev(target, node) {
        dispatch_dev("SvelteDOMInsert", { target, node });
        append(target, node);
    }
    function insert_dev(target, node, anchor) {
        dispatch_dev("SvelteDOMInsert", { target, node, anchor });
        insert(target, node, anchor);
    }
    function detach_dev(node) {
        dispatch_dev("SvelteDOMRemove", { node });
        detach(node);
    }
    function listen_dev(node, event, handler, options, has_prevent_default, has_stop_propagation) {
        const modifiers = options === true ? ["capture"] : options ? Array.from(Object.keys(options)) : [];
        if (has_prevent_default)
            modifiers.push('preventDefault');
        if (has_stop_propagation)
            modifiers.push('stopPropagation');
        dispatch_dev("SvelteDOMAddEventListener", { node, event, handler, modifiers });
        const dispose = listen(node, event, handler, options);
        return () => {
            dispatch_dev("SvelteDOMRemoveEventListener", { node, event, handler, modifiers });
            dispose();
        };
    }
    function attr_dev(node, attribute, value) {
        attr(node, attribute, value);
        if (value == null)
            dispatch_dev("SvelteDOMRemoveAttribute", { node, attribute });
        else
            dispatch_dev("SvelteDOMSetAttribute", { node, attribute, value });
    }
    function set_data_dev(text, data) {
        data = '' + data;
        if (text.wholeText === data)
            return;
        dispatch_dev("SvelteDOMSetData", { node: text, data });
        text.data = data;
    }
    function validate_each_argument(arg) {
        if (typeof arg !== 'string' && !(arg && typeof arg === 'object' && 'length' in arg)) {
            let msg = '{#each} only iterates over array-like objects.';
            if (typeof Symbol === 'function' && arg && Symbol.iterator in arg) {
                msg += ' You can use a spread to convert this iterable into an array.';
            }
            throw new Error(msg);
        }
    }
    function validate_slots(name, slot, keys) {
        for (const slot_key of Object.keys(slot)) {
            if (!~keys.indexOf(slot_key)) {
                console.warn(`<${name}> received an unexpected slot "${slot_key}".`);
            }
        }
    }
    class SvelteComponentDev extends SvelteComponent {
        constructor(options) {
            if (!options || (!options.target && !options.$$inline)) {
                throw new Error(`'target' is a required option`);
            }
            super();
        }
        $destroy() {
            super.$destroy();
            this.$destroy = () => {
                console.warn(`Component was already destroyed`); // eslint-disable-line no-console
            };
        }
        $capture_state() { }
        $inject_state() { }
    }

    if (window.Prism)
        console.warn('Prism has already been initiated. Please ensure that svelte-prism is imported first.');

    window.Prism = window.Prism || {};
    window.Prism.manual = true;

    var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

    function createCommonjsModule(fn, basedir, module) {
    	return module = {
    	  path: basedir,
    	  exports: {},
    	  require: function (path, base) {
          return commonjsRequire(path, (base === undefined || base === null) ? module.path : base);
        }
    	}, fn(module, module.exports), module.exports;
    }

    function commonjsRequire () {
    	throw new Error('Dynamic requires are not currently supported by @rollup/plugin-commonjs');
    }

    var prism = createCommonjsModule(function (module) {
    /* **********************************************
         Begin prism-core.js
    ********************************************** */

    var _self = (typeof window !== 'undefined')
    	? window   // if in browser
    	: (
    		(typeof WorkerGlobalScope !== 'undefined' && self instanceof WorkerGlobalScope)
    		? self // if in worker
    		: {}   // if in node js
    	);

    /**
     * Prism: Lightweight, robust, elegant syntax highlighting
     * MIT license http://www.opensource.org/licenses/mit-license.php/
     * @author Lea Verou http://lea.verou.me
     */

    var Prism = (function (_self){

    // Private helper vars
    var lang = /\blang(?:uage)?-([\w-]+)\b/i;
    var uniqueId = 0;


    var _ = {
    	manual: _self.Prism && _self.Prism.manual,
    	disableWorkerMessageHandler: _self.Prism && _self.Prism.disableWorkerMessageHandler,
    	util: {
    		encode: function encode(tokens) {
    			if (tokens instanceof Token) {
    				return new Token(tokens.type, encode(tokens.content), tokens.alias);
    			} else if (Array.isArray(tokens)) {
    				return tokens.map(encode);
    			} else {
    				return tokens.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/\u00a0/g, ' ');
    			}
    		},

    		type: function (o) {
    			return Object.prototype.toString.call(o).slice(8, -1);
    		},

    		objId: function (obj) {
    			if (!obj['__id']) {
    				Object.defineProperty(obj, '__id', { value: ++uniqueId });
    			}
    			return obj['__id'];
    		},

    		// Deep clone a language definition (e.g. to extend it)
    		clone: function deepClone(o, visited) {
    			var clone, id, type = _.util.type(o);
    			visited = visited || {};

    			switch (type) {
    				case 'Object':
    					id = _.util.objId(o);
    					if (visited[id]) {
    						return visited[id];
    					}
    					clone = {};
    					visited[id] = clone;

    					for (var key in o) {
    						if (o.hasOwnProperty(key)) {
    							clone[key] = deepClone(o[key], visited);
    						}
    					}

    					return clone;

    				case 'Array':
    					id = _.util.objId(o);
    					if (visited[id]) {
    						return visited[id];
    					}
    					clone = [];
    					visited[id] = clone;

    					o.forEach(function (v, i) {
    						clone[i] = deepClone(v, visited);
    					});

    					return clone;

    				default:
    					return o;
    			}
    		},

    		/**
    		 * Returns the Prism language of the given element set by a `language-xxxx` or `lang-xxxx` class.
    		 *
    		 * If no language is set for the element or the element is `null` or `undefined`, `none` will be returned.
    		 *
    		 * @param {Element} element
    		 * @returns {string}
    		 */
    		getLanguage: function (element) {
    			while (element && !lang.test(element.className)) {
    				element = element.parentElement;
    			}
    			if (element) {
    				return (element.className.match(lang) || [, 'none'])[1].toLowerCase();
    			}
    			return 'none';
    		},

    		/**
    		 * Returns the script element that is currently executing.
    		 *
    		 * This does __not__ work for line script element.
    		 *
    		 * @returns {HTMLScriptElement | null}
    		 */
    		currentScript: function () {
    			if (typeof document === 'undefined') {
    				return null;
    			}
    			if ('currentScript' in document) {
    				return document.currentScript;
    			}

    			// IE11 workaround
    			// we'll get the src of the current script by parsing IE11's error stack trace
    			// this will not work for inline scripts

    			try {
    				throw new Error();
    			} catch (err) {
    				// Get file src url from stack. Specifically works with the format of stack traces in IE.
    				// A stack will look like this:
    				//
    				// Error
    				//    at _.util.currentScript (http://localhost/components/prism-core.js:119:5)
    				//    at Global code (http://localhost/components/prism-core.js:606:1)

    				var src = (/at [^(\r\n]*\((.*):.+:.+\)$/i.exec(err.stack) || [])[1];
    				if (src) {
    					var scripts = document.getElementsByTagName('script');
    					for (var i in scripts) {
    						if (scripts[i].src == src) {
    							return scripts[i];
    						}
    					}
    				}
    				return null;
    			}
    		}
    	},

    	languages: {
    		extend: function (id, redef) {
    			var lang = _.util.clone(_.languages[id]);

    			for (var key in redef) {
    				lang[key] = redef[key];
    			}

    			return lang;
    		},

    		/**
    		 * Insert a token before another token in a language literal
    		 * As this needs to recreate the object (we cannot actually insert before keys in object literals),
    		 * we cannot just provide an object, we need an object and a key.
    		 * @param inside The key (or language id) of the parent
    		 * @param before The key to insert before.
    		 * @param insert Object with the key/value pairs to insert
    		 * @param root The object that contains `inside`. If equal to Prism.languages, it can be omitted.
    		 */
    		insertBefore: function (inside, before, insert, root) {
    			root = root || _.languages;
    			var grammar = root[inside];
    			var ret = {};

    			for (var token in grammar) {
    				if (grammar.hasOwnProperty(token)) {

    					if (token == before) {
    						for (var newToken in insert) {
    							if (insert.hasOwnProperty(newToken)) {
    								ret[newToken] = insert[newToken];
    							}
    						}
    					}

    					// Do not insert token which also occur in insert. See #1525
    					if (!insert.hasOwnProperty(token)) {
    						ret[token] = grammar[token];
    					}
    				}
    			}

    			var old = root[inside];
    			root[inside] = ret;

    			// Update references in other language definitions
    			_.languages.DFS(_.languages, function(key, value) {
    				if (value === old && key != inside) {
    					this[key] = ret;
    				}
    			});

    			return ret;
    		},

    		// Traverse a language definition with Depth First Search
    		DFS: function DFS(o, callback, type, visited) {
    			visited = visited || {};

    			var objId = _.util.objId;

    			for (var i in o) {
    				if (o.hasOwnProperty(i)) {
    					callback.call(o, i, o[i], type || i);

    					var property = o[i],
    					    propertyType = _.util.type(property);

    					if (propertyType === 'Object' && !visited[objId(property)]) {
    						visited[objId(property)] = true;
    						DFS(property, callback, null, visited);
    					}
    					else if (propertyType === 'Array' && !visited[objId(property)]) {
    						visited[objId(property)] = true;
    						DFS(property, callback, i, visited);
    					}
    				}
    			}
    		}
    	},
    	plugins: {},

    	highlightAll: function(async, callback) {
    		_.highlightAllUnder(document, async, callback);
    	},

    	highlightAllUnder: function(container, async, callback) {
    		var env = {
    			callback: callback,
    			container: container,
    			selector: 'code[class*="language-"], [class*="language-"] code, code[class*="lang-"], [class*="lang-"] code'
    		};

    		_.hooks.run('before-highlightall', env);

    		env.elements = Array.prototype.slice.apply(env.container.querySelectorAll(env.selector));

    		_.hooks.run('before-all-elements-highlight', env);

    		for (var i = 0, element; element = env.elements[i++];) {
    			_.highlightElement(element, async === true, env.callback);
    		}
    	},

    	highlightElement: function(element, async, callback) {
    		// Find language
    		var language = _.util.getLanguage(element);
    		var grammar = _.languages[language];

    		// Set language on the element, if not present
    		element.className = element.className.replace(lang, '').replace(/\s+/g, ' ') + ' language-' + language;

    		// Set language on the parent, for styling
    		var parent = element.parentNode;
    		if (parent && parent.nodeName.toLowerCase() === 'pre') {
    			parent.className = parent.className.replace(lang, '').replace(/\s+/g, ' ') + ' language-' + language;
    		}

    		var code = element.textContent;

    		var env = {
    			element: element,
    			language: language,
    			grammar: grammar,
    			code: code
    		};

    		function insertHighlightedCode(highlightedCode) {
    			env.highlightedCode = highlightedCode;

    			_.hooks.run('before-insert', env);

    			env.element.innerHTML = env.highlightedCode;

    			_.hooks.run('after-highlight', env);
    			_.hooks.run('complete', env);
    			callback && callback.call(env.element);
    		}

    		_.hooks.run('before-sanity-check', env);

    		if (!env.code) {
    			_.hooks.run('complete', env);
    			callback && callback.call(env.element);
    			return;
    		}

    		_.hooks.run('before-highlight', env);

    		if (!env.grammar) {
    			insertHighlightedCode(_.util.encode(env.code));
    			return;
    		}

    		if (async && _self.Worker) {
    			var worker = new Worker(_.filename);

    			worker.onmessage = function(evt) {
    				insertHighlightedCode(evt.data);
    			};

    			worker.postMessage(JSON.stringify({
    				language: env.language,
    				code: env.code,
    				immediateClose: true
    			}));
    		}
    		else {
    			insertHighlightedCode(_.highlight(env.code, env.grammar, env.language));
    		}
    	},

    	highlight: function (text, grammar, language) {
    		var env = {
    			code: text,
    			grammar: grammar,
    			language: language
    		};
    		_.hooks.run('before-tokenize', env);
    		env.tokens = _.tokenize(env.code, env.grammar);
    		_.hooks.run('after-tokenize', env);
    		return Token.stringify(_.util.encode(env.tokens), env.language);
    	},

    	tokenize: function(text, grammar) {
    		var rest = grammar.rest;
    		if (rest) {
    			for (var token in rest) {
    				grammar[token] = rest[token];
    			}

    			delete grammar.rest;
    		}

    		var tokenList = new LinkedList();
    		addAfter(tokenList, tokenList.head, text);

    		matchGrammar(text, tokenList, grammar, tokenList.head, 0);

    		return toArray(tokenList);
    	},

    	hooks: {
    		all: {},

    		add: function (name, callback) {
    			var hooks = _.hooks.all;

    			hooks[name] = hooks[name] || [];

    			hooks[name].push(callback);
    		},

    		run: function (name, env) {
    			var callbacks = _.hooks.all[name];

    			if (!callbacks || !callbacks.length) {
    				return;
    			}

    			for (var i=0, callback; callback = callbacks[i++];) {
    				callback(env);
    			}
    		}
    	},

    	Token: Token
    };

    _self.Prism = _;

    function Token(type, content, alias, matchedStr, greedy) {
    	this.type = type;
    	this.content = content;
    	this.alias = alias;
    	// Copy of the full string this token was created from
    	this.length = (matchedStr || '').length|0;
    	this.greedy = !!greedy;
    }

    Token.stringify = function stringify(o, language) {
    	if (typeof o == 'string') {
    		return o;
    	}
    	if (Array.isArray(o)) {
    		var s = '';
    		o.forEach(function (e) {
    			s += stringify(e, language);
    		});
    		return s;
    	}

    	var env = {
    		type: o.type,
    		content: stringify(o.content, language),
    		tag: 'span',
    		classes: ['token', o.type],
    		attributes: {},
    		language: language
    	};

    	var aliases = o.alias;
    	if (aliases) {
    		if (Array.isArray(aliases)) {
    			Array.prototype.push.apply(env.classes, aliases);
    		} else {
    			env.classes.push(aliases);
    		}
    	}

    	_.hooks.run('wrap', env);

    	var attributes = '';
    	for (var name in env.attributes) {
    		attributes += ' ' + name + '="' + (env.attributes[name] || '').replace(/"/g, '&quot;') + '"';
    	}

    	return '<' + env.tag + ' class="' + env.classes.join(' ') + '"' + attributes + '>' + env.content + '</' + env.tag + '>';
    };

    /**
     * @param {string} text
     * @param {LinkedList<string | Token>} tokenList
     * @param {any} grammar
     * @param {LinkedListNode<string | Token>} startNode
     * @param {number} startPos
     * @param {boolean} [oneshot=false]
     * @param {string} [target]
     */
    function matchGrammar(text, tokenList, grammar, startNode, startPos, oneshot, target) {
    	for (var token in grammar) {
    		if (!grammar.hasOwnProperty(token) || !grammar[token]) {
    			continue;
    		}

    		var patterns = grammar[token];
    		patterns = Array.isArray(patterns) ? patterns : [patterns];

    		for (var j = 0; j < patterns.length; ++j) {
    			if (target && target == token + ',' + j) {
    				return;
    			}

    			var pattern = patterns[j],
    				inside = pattern.inside,
    				lookbehind = !!pattern.lookbehind,
    				greedy = !!pattern.greedy,
    				lookbehindLength = 0,
    				alias = pattern.alias;

    			if (greedy && !pattern.pattern.global) {
    				// Without the global flag, lastIndex won't work
    				var flags = pattern.pattern.toString().match(/[imsuy]*$/)[0];
    				pattern.pattern = RegExp(pattern.pattern.source, flags + 'g');
    			}

    			pattern = pattern.pattern || pattern;

    			for ( // iterate the token list and keep track of the current token/string position
    				var currentNode = startNode.next, pos = startPos;
    				currentNode !== tokenList.tail;
    				pos += currentNode.value.length, currentNode = currentNode.next
    			) {

    				var str = currentNode.value;

    				if (tokenList.length > text.length) {
    					// Something went terribly wrong, ABORT, ABORT!
    					return;
    				}

    				if (str instanceof Token) {
    					continue;
    				}

    				var removeCount = 1; // this is the to parameter of removeBetween

    				if (greedy && currentNode != tokenList.tail.prev) {
    					pattern.lastIndex = pos;
    					var match = pattern.exec(text);
    					if (!match) {
    						break;
    					}

    					var from = match.index + (lookbehind && match[1] ? match[1].length : 0);
    					var to = match.index + match[0].length;
    					var p = pos;

    					// find the node that contains the match
    					p += currentNode.value.length;
    					while (from >= p) {
    						currentNode = currentNode.next;
    						p += currentNode.value.length;
    					}
    					// adjust pos (and p)
    					p -= currentNode.value.length;
    					pos = p;

    					// the current node is a Token, then the match starts inside another Token, which is invalid
    					if (currentNode.value instanceof Token) {
    						continue;
    					}

    					// find the last node which is affected by this match
    					for (
    						var k = currentNode;
    						k !== tokenList.tail && (p < to || (typeof k.value === 'string' && !k.prev.value.greedy));
    						k = k.next
    					) {
    						removeCount++;
    						p += k.value.length;
    					}
    					removeCount--;

    					// replace with the new match
    					str = text.slice(pos, p);
    					match.index -= pos;
    				} else {
    					pattern.lastIndex = 0;

    					var match = pattern.exec(str);
    				}

    				if (!match) {
    					if (oneshot) {
    						break;
    					}

    					continue;
    				}

    				if (lookbehind) {
    					lookbehindLength = match[1] ? match[1].length : 0;
    				}

    				var from = match.index + lookbehindLength,
    					match = match[0].slice(lookbehindLength),
    					to = from + match.length,
    					before = str.slice(0, from),
    					after = str.slice(to);

    				var removeFrom = currentNode.prev;

    				if (before) {
    					removeFrom = addAfter(tokenList, removeFrom, before);
    					pos += before.length;
    				}

    				removeRange(tokenList, removeFrom, removeCount);

    				var wrapped = new Token(token, inside ? _.tokenize(match, inside) : match, alias, match, greedy);
    				currentNode = addAfter(tokenList, removeFrom, wrapped);

    				if (after) {
    					addAfter(tokenList, currentNode, after);
    				}


    				if (removeCount > 1)
    					matchGrammar(text, tokenList, grammar, currentNode.prev, pos, true, token + ',' + j);

    				if (oneshot)
    					break;
    			}
    		}
    	}
    }

    /**
     * @typedef LinkedListNode
     * @property {T} value
     * @property {LinkedListNode<T> | null} prev The previous node.
     * @property {LinkedListNode<T> | null} next The next node.
     * @template T
     */

    /**
     * @template T
     */
    function LinkedList() {
    	/** @type {LinkedListNode<T>} */
    	var head = { value: null, prev: null, next: null };
    	/** @type {LinkedListNode<T>} */
    	var tail = { value: null, prev: head, next: null };
    	head.next = tail;

    	/** @type {LinkedListNode<T>} */
    	this.head = head;
    	/** @type {LinkedListNode<T>} */
    	this.tail = tail;
    	this.length = 0;
    }

    /**
     * Adds a new node with the given value to the list.
     * @param {LinkedList<T>} list
     * @param {LinkedListNode<T>} node
     * @param {T} value
     * @returns {LinkedListNode<T>} The added node.
     * @template T
     */
    function addAfter(list, node, value) {
    	// assumes that node != list.tail && values.length >= 0
    	var next = node.next;

    	var newNode = { value: value, prev: node, next: next };
    	node.next = newNode;
    	next.prev = newNode;
    	list.length++;

    	return newNode;
    }
    /**
     * Removes `count` nodes after the given node. The given node will not be removed.
     * @param {LinkedList<T>} list
     * @param {LinkedListNode<T>} node
     * @param {number} count
     * @template T
     */
    function removeRange(list, node, count) {
    	var next = node.next;
    	for (var i = 0; i < count && next !== list.tail; i++) {
    		next = next.next;
    	}
    	node.next = next;
    	next.prev = node;
    	list.length -= i;
    }
    /**
     * @param {LinkedList<T>} list
     * @returns {T[]}
     * @template T
     */
    function toArray(list) {
    	var array = [];
    	var node = list.head.next;
    	while (node !== list.tail) {
    		array.push(node.value);
    		node = node.next;
    	}
    	return array;
    }


    if (!_self.document) {
    	if (!_self.addEventListener) {
    		// in Node.js
    		return _;
    	}

    	if (!_.disableWorkerMessageHandler) {
    		// In worker
    		_self.addEventListener('message', function (evt) {
    			var message = JSON.parse(evt.data),
    				lang = message.language,
    				code = message.code,
    				immediateClose = message.immediateClose;

    			_self.postMessage(_.highlight(code, _.languages[lang], lang));
    			if (immediateClose) {
    				_self.close();
    			}
    		}, false);
    	}

    	return _;
    }

    //Get current script and highlight
    var script = _.util.currentScript();

    if (script) {
    	_.filename = script.src;

    	if (script.hasAttribute('data-manual')) {
    		_.manual = true;
    	}
    }

    function highlightAutomaticallyCallback() {
    	if (!_.manual) {
    		_.highlightAll();
    	}
    }

    if (!_.manual) {
    	// If the document state is "loading", then we'll use DOMContentLoaded.
    	// If the document state is "interactive" and the prism.js script is deferred, then we'll also use the
    	// DOMContentLoaded event because there might be some plugins or languages which have also been deferred and they
    	// might take longer one animation frame to execute which can create a race condition where only some plugins have
    	// been loaded when Prism.highlightAll() is executed, depending on how fast resources are loaded.
    	// See https://github.com/PrismJS/prism/issues/2102
    	var readyState = document.readyState;
    	if (readyState === 'loading' || readyState === 'interactive' && script && script.defer) {
    		document.addEventListener('DOMContentLoaded', highlightAutomaticallyCallback);
    	} else {
    		if (window.requestAnimationFrame) {
    			window.requestAnimationFrame(highlightAutomaticallyCallback);
    		} else {
    			window.setTimeout(highlightAutomaticallyCallback, 16);
    		}
    	}
    }

    return _;

    })(_self);

    if ( module.exports) {
    	module.exports = Prism;
    }

    // hack for components to work correctly in node.js
    if (typeof commonjsGlobal !== 'undefined') {
    	commonjsGlobal.Prism = Prism;
    }


    /* **********************************************
         Begin prism-markup.js
    ********************************************** */

    Prism.languages.markup = {
    	'comment': /<!--[\s\S]*?-->/,
    	'prolog': /<\?[\s\S]+?\?>/,
    	'doctype': {
    		pattern: /<!DOCTYPE(?:[^>"'[\]]|"[^"]*"|'[^']*')+(?:\[(?:(?!<!--)[^"'\]]|"[^"]*"|'[^']*'|<!--[\s\S]*?-->)*\]\s*)?>/i,
    		greedy: true
    	},
    	'cdata': /<!\[CDATA\[[\s\S]*?]]>/i,
    	'tag': {
    		pattern: /<\/?(?!\d)[^\s>\/=$<%]+(?:\s(?:\s*[^\s>\/=]+(?:\s*=\s*(?:"[^"]*"|'[^']*'|[^\s'">=]+(?=[\s>]))|(?=[\s/>])))+)?\s*\/?>/i,
    		greedy: true,
    		inside: {
    			'tag': {
    				pattern: /^<\/?[^\s>\/]+/i,
    				inside: {
    					'punctuation': /^<\/?/,
    					'namespace': /^[^\s>\/:]+:/
    				}
    			},
    			'attr-value': {
    				pattern: /=\s*(?:"[^"]*"|'[^']*'|[^\s'">=]+)/i,
    				inside: {
    					'punctuation': [
    						/^=/,
    						{
    							pattern: /^(\s*)["']|["']$/,
    							lookbehind: true
    						}
    					]
    				}
    			},
    			'punctuation': /\/?>/,
    			'attr-name': {
    				pattern: /[^\s>\/]+/,
    				inside: {
    					'namespace': /^[^\s>\/:]+:/
    				}
    			}

    		}
    	},
    	'entity': /&#?[\da-z]{1,8};/i
    };

    Prism.languages.markup['tag'].inside['attr-value'].inside['entity'] =
    	Prism.languages.markup['entity'];

    // Plugin to make entity title show the real entity, idea by Roman Komarov
    Prism.hooks.add('wrap', function(env) {

    	if (env.type === 'entity') {
    		env.attributes['title'] = env.content.replace(/&amp;/, '&');
    	}
    });

    Object.defineProperty(Prism.languages.markup.tag, 'addInlined', {
    	/**
    	 * Adds an inlined language to markup.
    	 *
    	 * An example of an inlined language is CSS with `<style>` tags.
    	 *
    	 * @param {string} tagName The name of the tag that contains the inlined language. This name will be treated as
    	 * case insensitive.
    	 * @param {string} lang The language key.
    	 * @example
    	 * addInlined('style', 'css');
    	 */
    	value: function addInlined(tagName, lang) {
    		var includedCdataInside = {};
    		includedCdataInside['language-' + lang] = {
    			pattern: /(^<!\[CDATA\[)[\s\S]+?(?=\]\]>$)/i,
    			lookbehind: true,
    			inside: Prism.languages[lang]
    		};
    		includedCdataInside['cdata'] = /^<!\[CDATA\[|\]\]>$/i;

    		var inside = {
    			'included-cdata': {
    				pattern: /<!\[CDATA\[[\s\S]*?\]\]>/i,
    				inside: includedCdataInside
    			}
    		};
    		inside['language-' + lang] = {
    			pattern: /[\s\S]+/,
    			inside: Prism.languages[lang]
    		};

    		var def = {};
    		def[tagName] = {
    			pattern: RegExp(/(<__[\s\S]*?>)(?:<!\[CDATA\[[\s\S]*?\]\]>\s*|[\s\S])*?(?=<\/__>)/.source.replace(/__/g, function () { return tagName; }), 'i'),
    			lookbehind: true,
    			greedy: true,
    			inside: inside
    		};

    		Prism.languages.insertBefore('markup', 'cdata', def);
    	}
    });

    Prism.languages.xml = Prism.languages.extend('markup', {});
    Prism.languages.html = Prism.languages.markup;
    Prism.languages.mathml = Prism.languages.markup;
    Prism.languages.svg = Prism.languages.markup;


    /* **********************************************
         Begin prism-css.js
    ********************************************** */

    (function (Prism) {

    	var string = /("|')(?:\\(?:\r\n|[\s\S])|(?!\1)[^\\\r\n])*\1/;

    	Prism.languages.css = {
    		'comment': /\/\*[\s\S]*?\*\//,
    		'atrule': {
    			pattern: /@[\w-]+[\s\S]*?(?:;|(?=\s*\{))/,
    			inside: {
    				'rule': /^@[\w-]+/,
    				'selector-function-argument': {
    					pattern: /(\bselector\s*\((?!\s*\))\s*)(?:[^()]|\((?:[^()]|\([^()]*\))*\))+?(?=\s*\))/,
    					lookbehind: true,
    					alias: 'selector'
    				}
    				// See rest below
    			}
    		},
    		'url': {
    			pattern: RegExp('url\\((?:' + string.source + '|[^\n\r()]*)\\)', 'i'),
    			greedy: true,
    			inside: {
    				'function': /^url/i,
    				'punctuation': /^\(|\)$/
    			}
    		},
    		'selector': RegExp('[^{}\\s](?:[^{};"\']|' + string.source + ')*?(?=\\s*\\{)'),
    		'string': {
    			pattern: string,
    			greedy: true
    		},
    		'property': /[-_a-z\xA0-\uFFFF][-\w\xA0-\uFFFF]*(?=\s*:)/i,
    		'important': /!important\b/i,
    		'function': /[-a-z0-9]+(?=\()/i,
    		'punctuation': /[(){};:,]/
    	};

    	Prism.languages.css['atrule'].inside.rest = Prism.languages.css;

    	var markup = Prism.languages.markup;
    	if (markup) {
    		markup.tag.addInlined('style', 'css');

    		Prism.languages.insertBefore('inside', 'attr-value', {
    			'style-attr': {
    				pattern: /\s*style=("|')(?:\\[\s\S]|(?!\1)[^\\])*\1/i,
    				inside: {
    					'attr-name': {
    						pattern: /^\s*style/i,
    						inside: markup.tag.inside
    					},
    					'punctuation': /^\s*=\s*['"]|['"]\s*$/,
    					'attr-value': {
    						pattern: /.+/i,
    						inside: Prism.languages.css
    					}
    				},
    				alias: 'language-css'
    			}
    		}, markup.tag);
    	}

    }(Prism));


    /* **********************************************
         Begin prism-clike.js
    ********************************************** */

    Prism.languages.clike = {
    	'comment': [
    		{
    			pattern: /(^|[^\\])\/\*[\s\S]*?(?:\*\/|$)/,
    			lookbehind: true
    		},
    		{
    			pattern: /(^|[^\\:])\/\/.*/,
    			lookbehind: true,
    			greedy: true
    		}
    	],
    	'string': {
    		pattern: /(["'])(?:\\(?:\r\n|[\s\S])|(?!\1)[^\\\r\n])*\1/,
    		greedy: true
    	},
    	'class-name': {
    		pattern: /(\b(?:class|interface|extends|implements|trait|instanceof|new)\s+|\bcatch\s+\()[\w.\\]+/i,
    		lookbehind: true,
    		inside: {
    			'punctuation': /[.\\]/
    		}
    	},
    	'keyword': /\b(?:if|else|while|do|for|return|in|instanceof|function|new|try|throw|catch|finally|null|break|continue)\b/,
    	'boolean': /\b(?:true|false)\b/,
    	'function': /\w+(?=\()/,
    	'number': /\b0x[\da-f]+\b|(?:\b\d+\.?\d*|\B\.\d+)(?:e[+-]?\d+)?/i,
    	'operator': /[<>]=?|[!=]=?=?|--?|\+\+?|&&?|\|\|?|[?*/~^%]/,
    	'punctuation': /[{}[\];(),.:]/
    };


    /* **********************************************
         Begin prism-javascript.js
    ********************************************** */

    Prism.languages.javascript = Prism.languages.extend('clike', {
    	'class-name': [
    		Prism.languages.clike['class-name'],
    		{
    			pattern: /(^|[^$\w\xA0-\uFFFF])[_$A-Z\xA0-\uFFFF][$\w\xA0-\uFFFF]*(?=\.(?:prototype|constructor))/,
    			lookbehind: true
    		}
    	],
    	'keyword': [
    		{
    			pattern: /((?:^|})\s*)(?:catch|finally)\b/,
    			lookbehind: true
    		},
    		{
    			pattern: /(^|[^.]|\.\.\.\s*)\b(?:as|async(?=\s*(?:function\b|\(|[$\w\xA0-\uFFFF]|$))|await|break|case|class|const|continue|debugger|default|delete|do|else|enum|export|extends|for|from|function|get|if|implements|import|in|instanceof|interface|let|new|null|of|package|private|protected|public|return|set|static|super|switch|this|throw|try|typeof|undefined|var|void|while|with|yield)\b/,
    			lookbehind: true
    		},
    	],
    	'number': /\b(?:(?:0[xX](?:[\dA-Fa-f](?:_[\dA-Fa-f])?)+|0[bB](?:[01](?:_[01])?)+|0[oO](?:[0-7](?:_[0-7])?)+)n?|(?:\d(?:_\d)?)+n|NaN|Infinity)\b|(?:\b(?:\d(?:_\d)?)+\.?(?:\d(?:_\d)?)*|\B\.(?:\d(?:_\d)?)+)(?:[Ee][+-]?(?:\d(?:_\d)?)+)?/,
    	// Allow for all non-ASCII characters (See http://stackoverflow.com/a/2008444)
    	'function': /#?[_$a-zA-Z\xA0-\uFFFF][$\w\xA0-\uFFFF]*(?=\s*(?:\.\s*(?:apply|bind|call)\s*)?\()/,
    	'operator': /--|\+\+|\*\*=?|=>|&&|\|\||[!=]==|<<=?|>>>?=?|[-+*/%&|^!=<>]=?|\.{3}|\?[.?]?|[~:]/
    });

    Prism.languages.javascript['class-name'][0].pattern = /(\b(?:class|interface|extends|implements|instanceof|new)\s+)[\w.\\]+/;

    Prism.languages.insertBefore('javascript', 'keyword', {
    	'regex': {
    		pattern: /((?:^|[^$\w\xA0-\uFFFF."'\])\s])\s*)\/(?:\[(?:[^\]\\\r\n]|\\.)*]|\\.|[^/\\\[\r\n])+\/[gimyus]{0,6}(?=(?:\s|\/\*[\s\S]*?\*\/)*(?:$|[\r\n,.;:})\]]|\/\/))/,
    		lookbehind: true,
    		greedy: true
    	},
    	// This must be declared before keyword because we use "function" inside the look-forward
    	'function-variable': {
    		pattern: /#?[_$a-zA-Z\xA0-\uFFFF][$\w\xA0-\uFFFF]*(?=\s*[=:]\s*(?:async\s*)?(?:\bfunction\b|(?:\((?:[^()]|\([^()]*\))*\)|[_$a-zA-Z\xA0-\uFFFF][$\w\xA0-\uFFFF]*)\s*=>))/,
    		alias: 'function'
    	},
    	'parameter': [
    		{
    			pattern: /(function(?:\s+[_$A-Za-z\xA0-\uFFFF][$\w\xA0-\uFFFF]*)?\s*\(\s*)(?!\s)(?:[^()]|\([^()]*\))+?(?=\s*\))/,
    			lookbehind: true,
    			inside: Prism.languages.javascript
    		},
    		{
    			pattern: /[_$a-z\xA0-\uFFFF][$\w\xA0-\uFFFF]*(?=\s*=>)/i,
    			inside: Prism.languages.javascript
    		},
    		{
    			pattern: /(\(\s*)(?!\s)(?:[^()]|\([^()]*\))+?(?=\s*\)\s*=>)/,
    			lookbehind: true,
    			inside: Prism.languages.javascript
    		},
    		{
    			pattern: /((?:\b|\s|^)(?!(?:as|async|await|break|case|catch|class|const|continue|debugger|default|delete|do|else|enum|export|extends|finally|for|from|function|get|if|implements|import|in|instanceof|interface|let|new|null|of|package|private|protected|public|return|set|static|super|switch|this|throw|try|typeof|undefined|var|void|while|with|yield)(?![$\w\xA0-\uFFFF]))(?:[_$A-Za-z\xA0-\uFFFF][$\w\xA0-\uFFFF]*\s*)\(\s*)(?!\s)(?:[^()]|\([^()]*\))+?(?=\s*\)\s*\{)/,
    			lookbehind: true,
    			inside: Prism.languages.javascript
    		}
    	],
    	'constant': /\b[A-Z](?:[A-Z_]|\dx?)*\b/
    });

    Prism.languages.insertBefore('javascript', 'string', {
    	'template-string': {
    		pattern: /`(?:\\[\s\S]|\${(?:[^{}]|{(?:[^{}]|{[^}]*})*})+}|(?!\${)[^\\`])*`/,
    		greedy: true,
    		inside: {
    			'template-punctuation': {
    				pattern: /^`|`$/,
    				alias: 'string'
    			},
    			'interpolation': {
    				pattern: /((?:^|[^\\])(?:\\{2})*)\${(?:[^{}]|{(?:[^{}]|{[^}]*})*})+}/,
    				lookbehind: true,
    				inside: {
    					'interpolation-punctuation': {
    						pattern: /^\${|}$/,
    						alias: 'punctuation'
    					},
    					rest: Prism.languages.javascript
    				}
    			},
    			'string': /[\s\S]+/
    		}
    	}
    });

    if (Prism.languages.markup) {
    	Prism.languages.markup.tag.addInlined('script', 'javascript');
    }

    Prism.languages.js = Prism.languages.javascript;


    /* **********************************************
         Begin prism-file-highlight.js
    ********************************************** */

    (function () {
    	if (typeof self === 'undefined' || !self.Prism || !self.document || !document.querySelector) {
    		return;
    	}

    	/**
    	 * @param {Element} [container=document]
    	 */
    	self.Prism.fileHighlight = function(container) {
    		container = container || document;

    		var Extensions = {
    			'js': 'javascript',
    			'py': 'python',
    			'rb': 'ruby',
    			'ps1': 'powershell',
    			'psm1': 'powershell',
    			'sh': 'bash',
    			'bat': 'batch',
    			'h': 'c',
    			'tex': 'latex'
    		};

    		Array.prototype.slice.call(container.querySelectorAll('pre[data-src]')).forEach(function (pre) {
    			// ignore if already loaded
    			if (pre.hasAttribute('data-src-loaded')) {
    				return;
    			}

    			// load current
    			var src = pre.getAttribute('data-src');

    			var language, parent = pre;
    			var lang = /\blang(?:uage)?-([\w-]+)\b/i;
    			while (parent && !lang.test(parent.className)) {
    				parent = parent.parentNode;
    			}

    			if (parent) {
    				language = (pre.className.match(lang) || [, ''])[1];
    			}

    			if (!language) {
    				var extension = (src.match(/\.(\w+)$/) || [, ''])[1];
    				language = Extensions[extension] || extension;
    			}

    			var code = document.createElement('code');
    			code.className = 'language-' + language;

    			pre.textContent = '';

    			code.textContent = 'Loading…';

    			pre.appendChild(code);

    			var xhr = new XMLHttpRequest();

    			xhr.open('GET', src, true);

    			xhr.onreadystatechange = function () {
    				if (xhr.readyState == 4) {

    					if (xhr.status < 400 && xhr.responseText) {
    						code.textContent = xhr.responseText;

    						Prism.highlightElement(code);
    						// mark as loaded
    						pre.setAttribute('data-src-loaded', '');
    					}
    					else if (xhr.status >= 400) {
    						code.textContent = '✖ Error ' + xhr.status + ' while fetching file: ' + xhr.statusText;
    					}
    					else {
    						code.textContent = '✖ Error: File does not exist or is empty';
    					}
    				}
    			};

    			xhr.send(null);
    		});
    	};

    	document.addEventListener('DOMContentLoaded', function () {
    		// execute inside handler, for dropping Event as argument
    		self.Prism.fileHighlight();
    	});

    })();
    });

    const blocks = '(if|else if|await|then|catch|each|html|debug)';

    Prism.languages.svelte = Prism.languages.extend('markup', {
    	each: {
    		pattern: new RegExp(
    			'{#each' + '(?:(?:\\{(?:(?:\\{(?:[^{}])*\\})|(?:[^{}]))*\\})|(?:[^{}]))*}'
    		),
    		inside: {
    			'language-javascript': [
    				{
    					pattern: /(as[\s\S]*)\([\s\S]*\)(?=\s*\})/,
    					lookbehind: true,
    					inside: Prism.languages['javascript'],
    				},
    				{
    					pattern: /(as[\s]*)[\s\S]*(?=\s*)/,
    					lookbehind: true,
    					inside: Prism.languages['javascript'],
    				},
    				{
    					pattern: /(#each[\s]*)[\s\S]*(?=as)/,
    					lookbehind: true,
    					inside: Prism.languages['javascript'],
    				},
    			],
    			keyword: /#each|as/,
    			punctuation: /{|}/,
    		},
    	},
    	block: {
    		pattern: new RegExp(
    			'{[#:/@]/s' +
    				blocks +
    				'(?:(?:\\{(?:(?:\\{(?:[^{}])*\\})|(?:[^{}]))*\\})|(?:[^{}]))*}'
    		),
    		inside: {
    			punctuation: /^{|}$/,
    			keyword: [new RegExp('[#:/@]' + blocks + '( )*'), /as/, /then/],
    			'language-javascript': {
    				pattern: /[\s\S]*/,
    				inside: Prism.languages['javascript'],
    			},
    		},
    	},
    	tag: {
    		pattern: /<\/?(?!\d)[^\s>\/=$<%]+(?:\s(?:\s*[^\s>\/=]+(?:\s*=\s*(?:(?:"[^"]*"|'[^']*'|[^\s'">=]+(?=[\s>]))|(?:"[^"]*"|'[^']*'|{[\s\S]+?}(?=[\s/>])))|(?=[\s/>])))+)?\s*\/?>/i,
    		greedy: true,
    		inside: {
    			tag: {
    				pattern: /^<\/?[^\s>\/]+/i,
    				inside: {
    					punctuation: /^<\/?/,
    					namespace: /^[^\s>\/:]+:/,
    				},
    			},
    			'language-javascript': {
    				pattern: /\{(?:(?:\{(?:(?:\{(?:[^{}])*\})|(?:[^{}]))*\})|(?:[^{}]))*\}/,
    				inside: Prism.languages['javascript'],
    			},
    			'attr-value': {
    				pattern: /=\s*(?:"[^"]*"|'[^']*'|[^\s'">=]+)/i,
    				inside: {
    					punctuation: [
    						/^=/,
    						{
    							pattern: /^(\s*)["']|["']$/,
    							lookbehind: true,
    						},
    					],
    					'language-javascript': {
    						pattern: /{[\s\S]+}/,
    						inside: Prism.languages['javascript'],
    					},
    				},
    			},
    			punctuation: /\/?>/,
    			'attr-name': {
    				pattern: /[^\s>\/]+/,
    				inside: {
    					namespace: /^[^\s>\/:]+:/,
    				},
    			},
    		},
    	},
    	'language-javascript': {
    		pattern: /\{(?:(?:\{(?:(?:\{(?:[^{}])*\})|(?:[^{}]))*\})|(?:[^{}]))*\}/,
    		lookbehind: true,
    		inside: Prism.languages['javascript'],
    	},
    });

    Prism.languages.svelte['tag'].inside['attr-value'].inside['entity'] =
    	Prism.languages.svelte['entity'];

    Prism.hooks.add('wrap', env => {
    	if (env.type === 'entity') {
    		env.attributes['title'] = env.content.replace(/&amp;/, '&');
    	}
    });

    Object.defineProperty(Prism.languages.svelte.tag, 'addInlined', {
    	value: function addInlined(tagName, lang) {
    		const includedCdataInside = {};
    		includedCdataInside['language-' + lang] = {
    			pattern: /(^<!\[CDATA\[)[\s\S]+?(?=\]\]>$)/i,
    			lookbehind: true,
    			inside: Prism.languages[lang],
    		};
    		includedCdataInside['cdata'] = /^<!\[CDATA\[|\]\]>$/i;

    		const inside = {
    			'included-cdata': {
    				pattern: /<!\[CDATA\[[\s\S]*?\]\]>/i,
    				inside: includedCdataInside,
    			},
    		};
    		inside['language-' + lang] = {
    			pattern: /[\s\S]+/,
    			inside: Prism.languages[lang],
    		};

    		const def = {};
    		def[tagName] = {
    			pattern: RegExp(
    				/(<__[\s\S]*?>)(?:<!\[CDATA\[[\s\S]*?\]\]>\s*|[\s\S])*?(?=<\/__>)/.source.replace(
    					/__/g,
    					tagName
    				),
    				'i'
    			),
    			lookbehind: true,
    			greedy: true,
    			inside,
    		};

    		Prism.languages.insertBefore('svelte', 'cdata', def);
    	},
    });

    Prism.languages.svelte.tag.addInlined('style', 'css');
    Prism.languages.svelte.tag.addInlined('script', 'javascript');

    /* node_modules/svelte-prism/src/Prism.svelte generated by Svelte v3.24.0 */
    const file = "node_modules/svelte-prism/src/Prism.svelte";

    // (37:4) {:else}
    function create_else_block(ctx) {
    	let html_tag;
    	let html_anchor;

    	const block = {
    		c: function create() {
    			html_anchor = empty();
    			html_tag = new HtmlTag(html_anchor);
    		},
    		m: function mount(target, anchor) {
    			html_tag.m(/*formattedCode*/ ctx[2], target, anchor);
    			insert_dev(target, html_anchor, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*formattedCode*/ 4) html_tag.p(/*formattedCode*/ ctx[2]);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(html_anchor);
    			if (detaching) html_tag.d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block.name,
    		type: "else",
    		source: "(37:4) {:else}",
    		ctx
    	});

    	return block;
    }

    // (35:4) {#if language === 'none'}
    function create_if_block(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text(/*formattedCode*/ ctx[2]);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*formattedCode*/ 4) set_data_dev(t, /*formattedCode*/ ctx[2]);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block.name,
    		type: "if",
    		source: "(35:4) {#if language === 'none'}",
    		ctx
    	});

    	return block;
    }

    function create_fragment(ctx) {
    	let code0;
    	let t;
    	let pre;
    	let code1;
    	let code1_class_value;
    	let pre_class_value;
    	let current;
    	const default_slot_template = /*$$slots*/ ctx[6].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[5], null);

    	function select_block_type(ctx, dirty) {
    		if (/*language*/ ctx[0] === "none") return create_if_block;
    		return create_else_block;
    	}

    	let current_block_type = select_block_type(ctx);
    	let if_block = current_block_type(ctx);

    	const block = {
    		c: function create() {
    			code0 = element("code");
    			if (default_slot) default_slot.c();
    			t = space();
    			pre = element("pre");
    			code1 = element("code");
    			if_block.c();
    			set_style(code0, "display", "none");
    			add_location(code0, file, 28, 0, 766);
    			attr_dev(code1, "class", code1_class_value = "language-" + /*language*/ ctx[0]);
    			add_location(code1, file, 33, 2, 902);
    			attr_dev(pre, "class", pre_class_value = "language-" + /*language*/ ctx[0]);
    			attr_dev(pre, "command-line", "");
    			attr_dev(pre, "data-output", "2-17");
    			add_location(pre, file, 32, 0, 834);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, code0, anchor);

    			if (default_slot) {
    				default_slot.m(code0, null);
    			}

    			/*code0_binding*/ ctx[7](code0);
    			insert_dev(target, t, anchor);
    			insert_dev(target, pre, anchor);
    			append_dev(pre, code1);
    			if_block.m(code1, null);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (default_slot) {
    				if (default_slot.p && dirty & /*$$scope*/ 32) {
    					update_slot(default_slot, default_slot_template, ctx, /*$$scope*/ ctx[5], dirty, null, null);
    				}
    			}

    			if (current_block_type === (current_block_type = select_block_type(ctx)) && if_block) {
    				if_block.p(ctx, dirty);
    			} else {
    				if_block.d(1);
    				if_block = current_block_type(ctx);

    				if (if_block) {
    					if_block.c();
    					if_block.m(code1, null);
    				}
    			}

    			if (!current || dirty & /*language*/ 1 && code1_class_value !== (code1_class_value = "language-" + /*language*/ ctx[0])) {
    				attr_dev(code1, "class", code1_class_value);
    			}

    			if (!current || dirty & /*language*/ 1 && pre_class_value !== (pre_class_value = "language-" + /*language*/ ctx[0])) {
    				attr_dev(pre, "class", pre_class_value);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(code0);
    			if (default_slot) default_slot.d(detaching);
    			/*code0_binding*/ ctx[7](null);
    			if (detaching) detach_dev(t);
    			if (detaching) detach_dev(pre);
    			if_block.d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    const prism$1 = prism;
    const highlight = prism.highlightElement;
    const globalConfig = { transform: x => x };

    function instance($$self, $$props, $$invalidate) {
    	let { language = "javascript" } = $$props;
    	let { source = "" } = $$props;
    	let { transform = x => x } = $$props;
    	let element, formattedCode;

    	function highlightCode() {
    		const grammar = prism$1.languages[language];
    		let body = source || element.textContent;
    		body = globalConfig.transform(body);
    		body = transform(body);

    		$$invalidate(2, formattedCode = language === "none"
    		? body
    		: prism$1.highlight(body, grammar, language));
    	}

    	let { $$slots = {}, $$scope } = $$props;
    	validate_slots("Prism", $$slots, ['default']);

    	function code0_binding($$value) {
    		binding_callbacks[$$value ? "unshift" : "push"](() => {
    			element = $$value;
    			$$invalidate(1, element);
    		});
    	}

    	$$self.$set = $$new_props => {
    		$$invalidate(9, $$props = assign(assign({}, $$props), exclude_internal_props($$new_props)));
    		if ("language" in $$new_props) $$invalidate(0, language = $$new_props.language);
    		if ("source" in $$new_props) $$invalidate(3, source = $$new_props.source);
    		if ("transform" in $$new_props) $$invalidate(4, transform = $$new_props.transform);
    		if ("$$scope" in $$new_props) $$invalidate(5, $$scope = $$new_props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		_prism: prism,
    		prism: prism$1,
    		highlight,
    		globalConfig,
    		tick,
    		language,
    		source,
    		transform,
    		element,
    		formattedCode,
    		highlightCode
    	});

    	$$self.$inject_state = $$new_props => {
    		$$invalidate(9, $$props = assign(assign({}, $$props), $$new_props));
    		if ("language" in $$props) $$invalidate(0, language = $$new_props.language);
    		if ("source" in $$props) $$invalidate(3, source = $$new_props.source);
    		if ("transform" in $$props) $$invalidate(4, transform = $$new_props.transform);
    		if ("element" in $$props) $$invalidate(1, element = $$new_props.element);
    		if ("formattedCode" in $$props) $$invalidate(2, formattedCode = $$new_props.formattedCode);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		 $$props && (source || element) && highlightCode();
    	};

    	$$props = exclude_internal_props($$props);

    	return [
    		language,
    		element,
    		formattedCode,
    		source,
    		transform,
    		$$scope,
    		$$slots,
    		code0_binding
    	];
    }

    class Prism$1 extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance, create_fragment, safe_not_equal, { language: 0, source: 3, transform: 4 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Prism",
    			options,
    			id: create_fragment.name
    		});
    	}

    	get language() {
    		throw new Error("<Prism>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set language(value) {
    		throw new Error("<Prism>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get source() {
    		throw new Error("<Prism>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set source(value) {
    		throw new Error("<Prism>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get transform() {
    		throw new Error("<Prism>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set transform(value) {
    		throw new Error("<Prism>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    const subscriber_queue = [];
    /**
     * Create a `Writable` store that allows both updating and reading by subscription.
     * @param {*=}value initial value
     * @param {StartStopNotifier=}start start and stop notifications for subscriptions
     */
    function writable(value, start = noop) {
        let stop;
        const subscribers = [];
        function set(new_value) {
            if (safe_not_equal(value, new_value)) {
                value = new_value;
                if (stop) { // store is ready
                    const run_queue = !subscriber_queue.length;
                    for (let i = 0; i < subscribers.length; i += 1) {
                        const s = subscribers[i];
                        s[1]();
                        subscriber_queue.push(s, value);
                    }
                    if (run_queue) {
                        for (let i = 0; i < subscriber_queue.length; i += 2) {
                            subscriber_queue[i][0](subscriber_queue[i + 1]);
                        }
                        subscriber_queue.length = 0;
                    }
                }
            }
        }
        function update(fn) {
            set(fn(value));
        }
        function subscribe(run, invalidate = noop) {
            const subscriber = [run, invalidate];
            subscribers.push(subscriber);
            if (subscribers.length === 1) {
                stop = start(set) || noop;
            }
            run(value);
            return () => {
                const index = subscribers.indexOf(subscriber);
                if (index !== -1) {
                    subscribers.splice(index, 1);
                }
                if (subscribers.length === 0) {
                    stop();
                    stop = null;
                }
            };
        }
        return { set, update, subscribe };
    }

    function is_date(obj) {
        return Object.prototype.toString.call(obj) === '[object Date]';
    }

    function tick_spring(ctx, last_value, current_value, target_value) {
        if (typeof current_value === 'number' || is_date(current_value)) {
            // @ts-ignore
            const delta = target_value - current_value;
            // @ts-ignore
            const velocity = (current_value - last_value) / (ctx.dt || 1 / 60); // guard div by 0
            const spring = ctx.opts.stiffness * delta;
            const damper = ctx.opts.damping * velocity;
            const acceleration = (spring - damper) * ctx.inv_mass;
            const d = (velocity + acceleration) * ctx.dt;
            if (Math.abs(d) < ctx.opts.precision && Math.abs(delta) < ctx.opts.precision) {
                return target_value; // settled
            }
            else {
                ctx.settled = false; // signal loop to keep ticking
                // @ts-ignore
                return is_date(current_value) ?
                    new Date(current_value.getTime() + d) : current_value + d;
            }
        }
        else if (Array.isArray(current_value)) {
            // @ts-ignore
            return current_value.map((_, i) => tick_spring(ctx, last_value[i], current_value[i], target_value[i]));
        }
        else if (typeof current_value === 'object') {
            const next_value = {};
            for (const k in current_value)
                // @ts-ignore
                next_value[k] = tick_spring(ctx, last_value[k], current_value[k], target_value[k]);
            // @ts-ignore
            return next_value;
        }
        else {
            throw new Error(`Cannot spring ${typeof current_value} values`);
        }
    }
    function spring(value, opts = {}) {
        const store = writable(value);
        const { stiffness = 0.15, damping = 0.8, precision = 0.01 } = opts;
        let last_time;
        let task;
        let current_token;
        let last_value = value;
        let target_value = value;
        let inv_mass = 1;
        let inv_mass_recovery_rate = 0;
        let cancel_task = false;
        function set(new_value, opts = {}) {
            target_value = new_value;
            const token = current_token = {};
            if (value == null || opts.hard || (spring.stiffness >= 1 && spring.damping >= 1)) {
                cancel_task = true; // cancel any running animation
                last_time = now();
                last_value = new_value;
                store.set(value = target_value);
                return Promise.resolve();
            }
            else if (opts.soft) {
                const rate = opts.soft === true ? .5 : +opts.soft;
                inv_mass_recovery_rate = 1 / (rate * 60);
                inv_mass = 0; // infinite mass, unaffected by spring forces
            }
            if (!task) {
                last_time = now();
                cancel_task = false;
                task = loop(now => {
                    if (cancel_task) {
                        cancel_task = false;
                        task = null;
                        return false;
                    }
                    inv_mass = Math.min(inv_mass + inv_mass_recovery_rate, 1);
                    const ctx = {
                        inv_mass,
                        opts: spring,
                        settled: true,
                        dt: (now - last_time) * 60 / 1000
                    };
                    const next_value = tick_spring(ctx, last_value, value, target_value);
                    last_time = now;
                    last_value = value;
                    store.set(value = next_value);
                    if (ctx.settled)
                        task = null;
                    return !ctx.settled;
                });
            }
            return new Promise(fulfil => {
                task.promise.then(() => {
                    if (token === current_token)
                        fulfil();
                });
            });
        }
        const spring = {
            set,
            update: (fn, opts) => set(fn(target_value, value), opts),
            subscribe: store.subscribe,
            stiffness,
            damping,
            precision
        };
        return spring;
    }

    /* node_modules/svelte-range-slider-pips/src/RangePips.svelte generated by Svelte v3.24.0 */

    const file$1 = "node_modules/svelte-range-slider-pips/src/RangePips.svelte";

    function get_each_context(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[20] = list[i];
    	child_ctx[22] = i;
    	return child_ctx;
    }

    // (135:2) {#if ( all && first !== false ) || first }
    function create_if_block_5(ctx) {
    	let span;
    	let span_style_value;
    	let if_block = (/*all*/ ctx[3] === "label" || /*first*/ ctx[4] === "label") && create_if_block_6(ctx);

    	const block = {
    		c: function create() {
    			span = element("span");
    			if (if_block) if_block.c();
    			attr_dev(span, "class", "pip first");
    			attr_dev(span, "style", span_style_value = "" + ((/*vertical*/ ctx[2] ? "top" : "left") + ": 0%;"));
    			toggle_class(span, "selected", /*isSelected*/ ctx[14](/*min*/ ctx[0]));
    			toggle_class(span, "in-range", /*inRange*/ ctx[15](/*min*/ ctx[0]));
    			add_location(span, file$1, 135, 4, 3267);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, span, anchor);
    			if (if_block) if_block.m(span, null);
    		},
    		p: function update(ctx, dirty) {
    			if (/*all*/ ctx[3] === "label" || /*first*/ ctx[4] === "label") {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block_6(ctx);
    					if_block.c();
    					if_block.m(span, null);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}

    			if (dirty & /*vertical*/ 4 && span_style_value !== (span_style_value = "" + ((/*vertical*/ ctx[2] ? "top" : "left") + ": 0%;"))) {
    				attr_dev(span, "style", span_style_value);
    			}

    			if (dirty & /*isSelected, min*/ 16385) {
    				toggle_class(span, "selected", /*isSelected*/ ctx[14](/*min*/ ctx[0]));
    			}

    			if (dirty & /*inRange, min*/ 32769) {
    				toggle_class(span, "in-range", /*inRange*/ ctx[15](/*min*/ ctx[0]));
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(span);
    			if (if_block) if_block.d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_5.name,
    		type: "if",
    		source: "(135:2) {#if ( all && first !== false ) || first }",
    		ctx
    	});

    	return block;
    }

    // (141:6) {#if all === 'label' || first === 'label'}
    function create_if_block_6(ctx) {
    	let span;
    	let t0;
    	let t1_value = /*formatter*/ ctx[9](/*min*/ ctx[0]) + "";
    	let t1;
    	let t2;

    	const block = {
    		c: function create() {
    			span = element("span");
    			t0 = text(/*prefix*/ ctx[7]);
    			t1 = text(t1_value);
    			t2 = text(/*suffix*/ ctx[8]);
    			attr_dev(span, "class", "pipVal");
    			add_location(span, file$1, 141, 8, 3477);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, span, anchor);
    			append_dev(span, t0);
    			append_dev(span, t1);
    			append_dev(span, t2);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*prefix*/ 128) set_data_dev(t0, /*prefix*/ ctx[7]);
    			if (dirty & /*formatter, min*/ 513 && t1_value !== (t1_value = /*formatter*/ ctx[9](/*min*/ ctx[0]) + "")) set_data_dev(t1, t1_value);
    			if (dirty & /*suffix*/ 256) set_data_dev(t2, /*suffix*/ ctx[8]);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(span);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_6.name,
    		type: "if",
    		source: "(141:6) {#if all === 'label' || first === 'label'}",
    		ctx
    	});

    	return block;
    }

    // (148:2) {#if ( all && rest !== false ) || rest}
    function create_if_block_2(ctx) {
    	let each_1_anchor;
    	let each_value = Array(/*pipCount*/ ctx[12] + 1);
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block(get_each_context(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			each_1_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(target, anchor);
    			}

    			insert_dev(target, each_1_anchor, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*vertical, percentOf, pipVal, isSelected, inRange, suffix, formatter, prefix, all, rest, min, max, pipCount*/ 64463) {
    				each_value = Array(/*pipCount*/ ctx[12] + 1);
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(each_1_anchor.parentNode, each_1_anchor);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}
    		},
    		d: function destroy(detaching) {
    			destroy_each(each_blocks, detaching);
    			if (detaching) detach_dev(each_1_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_2.name,
    		type: "if",
    		source: "(148:2) {#if ( all && rest !== false ) || rest}",
    		ctx
    	});

    	return block;
    }

    // (150:6) {#if pipVal(i) !== min && pipVal(i) !== max}
    function create_if_block_3(ctx) {
    	let span;
    	let t;
    	let span_style_value;
    	let if_block = (/*all*/ ctx[3] === "label" || /*rest*/ ctx[6] === "label") && create_if_block_4(ctx);

    	const block = {
    		c: function create() {
    			span = element("span");
    			if (if_block) if_block.c();
    			t = space();
    			attr_dev(span, "class", "pip");
    			attr_dev(span, "style", span_style_value = "" + ((/*vertical*/ ctx[2] ? "top" : "left") + ": " + /*percentOf*/ ctx[11](/*pipVal*/ ctx[13](/*i*/ ctx[22])) + "%;"));
    			toggle_class(span, "selected", /*isSelected*/ ctx[14](/*pipVal*/ ctx[13](/*i*/ ctx[22])));
    			toggle_class(span, "in-range", /*inRange*/ ctx[15](/*pipVal*/ ctx[13](/*i*/ ctx[22])));
    			add_location(span, file$1, 150, 8, 3731);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, span, anchor);
    			if (if_block) if_block.m(span, null);
    			append_dev(span, t);
    		},
    		p: function update(ctx, dirty) {
    			if (/*all*/ ctx[3] === "label" || /*rest*/ ctx[6] === "label") {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block_4(ctx);
    					if_block.c();
    					if_block.m(span, t);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}

    			if (dirty & /*vertical, percentOf, pipVal*/ 10244 && span_style_value !== (span_style_value = "" + ((/*vertical*/ ctx[2] ? "top" : "left") + ": " + /*percentOf*/ ctx[11](/*pipVal*/ ctx[13](/*i*/ ctx[22])) + "%;"))) {
    				attr_dev(span, "style", span_style_value);
    			}

    			if (dirty & /*isSelected, pipVal*/ 24576) {
    				toggle_class(span, "selected", /*isSelected*/ ctx[14](/*pipVal*/ ctx[13](/*i*/ ctx[22])));
    			}

    			if (dirty & /*inRange, pipVal*/ 40960) {
    				toggle_class(span, "in-range", /*inRange*/ ctx[15](/*pipVal*/ ctx[13](/*i*/ ctx[22])));
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(span);
    			if (if_block) if_block.d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_3.name,
    		type: "if",
    		source: "(150:6) {#if pipVal(i) !== min && pipVal(i) !== max}",
    		ctx
    	});

    	return block;
    }

    // (156:10) {#if all === 'label' || rest === 'label'}
    function create_if_block_4(ctx) {
    	let span;
    	let t0;
    	let t1_value = /*formatter*/ ctx[9](/*pipVal*/ ctx[13](/*i*/ ctx[22])) + "";
    	let t1;
    	let t2;

    	const block = {
    		c: function create() {
    			span = element("span");
    			t0 = text(/*prefix*/ ctx[7]);
    			t1 = text(t1_value);
    			t2 = text(/*suffix*/ ctx[8]);
    			attr_dev(span, "class", "pipVal");
    			add_location(span, file$1, 156, 12, 3991);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, span, anchor);
    			append_dev(span, t0);
    			append_dev(span, t1);
    			append_dev(span, t2);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*prefix*/ 128) set_data_dev(t0, /*prefix*/ ctx[7]);
    			if (dirty & /*formatter, pipVal*/ 8704 && t1_value !== (t1_value = /*formatter*/ ctx[9](/*pipVal*/ ctx[13](/*i*/ ctx[22])) + "")) set_data_dev(t1, t1_value);
    			if (dirty & /*suffix*/ 256) set_data_dev(t2, /*suffix*/ ctx[8]);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(span);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_4.name,
    		type: "if",
    		source: "(156:10) {#if all === 'label' || rest === 'label'}",
    		ctx
    	});

    	return block;
    }

    // (149:4) {#each Array(pipCount + 1) as _, i}
    function create_each_block(ctx) {
    	let show_if = /*pipVal*/ ctx[13](/*i*/ ctx[22]) !== /*min*/ ctx[0] && /*pipVal*/ ctx[13](/*i*/ ctx[22]) !== /*max*/ ctx[1];
    	let if_block_anchor;
    	let if_block = show_if && create_if_block_3(ctx);

    	const block = {
    		c: function create() {
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*pipVal, min, max*/ 8195) show_if = /*pipVal*/ ctx[13](/*i*/ ctx[22]) !== /*min*/ ctx[0] && /*pipVal*/ ctx[13](/*i*/ ctx[22]) !== /*max*/ ctx[1];

    			if (show_if) {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block_3(ctx);
    					if_block.c();
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}
    		},
    		d: function destroy(detaching) {
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block.name,
    		type: "each",
    		source: "(149:4) {#each Array(pipCount + 1) as _, i}",
    		ctx
    	});

    	return block;
    }

    // (165:2) {#if ( all && last !== false ) || last}
    function create_if_block$1(ctx) {
    	let span;
    	let span_style_value;
    	let if_block = (/*all*/ ctx[3] === "label" || /*last*/ ctx[5] === "label") && create_if_block_1(ctx);

    	const block = {
    		c: function create() {
    			span = element("span");
    			if (if_block) if_block.c();
    			attr_dev(span, "class", "pip last");
    			attr_dev(span, "style", span_style_value = "" + ((/*vertical*/ ctx[2] ? "top" : "left") + ": 100%;"));
    			toggle_class(span, "selected", /*isSelected*/ ctx[14](/*max*/ ctx[1]));
    			toggle_class(span, "in-range", /*inRange*/ ctx[15](/*max*/ ctx[1]));
    			add_location(span, file$1, 165, 4, 4196);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, span, anchor);
    			if (if_block) if_block.m(span, null);
    		},
    		p: function update(ctx, dirty) {
    			if (/*all*/ ctx[3] === "label" || /*last*/ ctx[5] === "label") {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block_1(ctx);
    					if_block.c();
    					if_block.m(span, null);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}

    			if (dirty & /*vertical*/ 4 && span_style_value !== (span_style_value = "" + ((/*vertical*/ ctx[2] ? "top" : "left") + ": 100%;"))) {
    				attr_dev(span, "style", span_style_value);
    			}

    			if (dirty & /*isSelected, max*/ 16386) {
    				toggle_class(span, "selected", /*isSelected*/ ctx[14](/*max*/ ctx[1]));
    			}

    			if (dirty & /*inRange, max*/ 32770) {
    				toggle_class(span, "in-range", /*inRange*/ ctx[15](/*max*/ ctx[1]));
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(span);
    			if (if_block) if_block.d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$1.name,
    		type: "if",
    		source: "(165:2) {#if ( all && last !== false ) || last}",
    		ctx
    	});

    	return block;
    }

    // (171:6) {#if all === 'label' || last === 'label'}
    function create_if_block_1(ctx) {
    	let span;
    	let t0;
    	let t1_value = /*formatter*/ ctx[9](/*max*/ ctx[1]) + "";
    	let t1;
    	let t2;

    	const block = {
    		c: function create() {
    			span = element("span");
    			t0 = text(/*prefix*/ ctx[7]);
    			t1 = text(t1_value);
    			t2 = text(/*suffix*/ ctx[8]);
    			attr_dev(span, "class", "pipVal");
    			add_location(span, file$1, 171, 8, 4406);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, span, anchor);
    			append_dev(span, t0);
    			append_dev(span, t1);
    			append_dev(span, t2);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*prefix*/ 128) set_data_dev(t0, /*prefix*/ ctx[7]);
    			if (dirty & /*formatter, max*/ 514 && t1_value !== (t1_value = /*formatter*/ ctx[9](/*max*/ ctx[1]) + "")) set_data_dev(t1, t1_value);
    			if (dirty & /*suffix*/ 256) set_data_dev(t2, /*suffix*/ ctx[8]);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(span);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1.name,
    		type: "if",
    		source: "(171:6) {#if all === 'label' || last === 'label'}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$1(ctx) {
    	let div;
    	let t0;
    	let t1;
    	let if_block0 = (/*all*/ ctx[3] && /*first*/ ctx[4] !== false || /*first*/ ctx[4]) && create_if_block_5(ctx);
    	let if_block1 = (/*all*/ ctx[3] && /*rest*/ ctx[6] !== false || /*rest*/ ctx[6]) && create_if_block_2(ctx);
    	let if_block2 = (/*all*/ ctx[3] && /*last*/ ctx[5] !== false || /*last*/ ctx[5]) && create_if_block$1(ctx);

    	const block = {
    		c: function create() {
    			div = element("div");
    			if (if_block0) if_block0.c();
    			t0 = space();
    			if (if_block1) if_block1.c();
    			t1 = space();
    			if (if_block2) if_block2.c();
    			attr_dev(div, "class", "rangePips");
    			toggle_class(div, "focus", /*focus*/ ctx[10]);
    			toggle_class(div, "vertical", /*vertical*/ ctx[2]);
    			add_location(div, file$1, 133, 0, 3167);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			if (if_block0) if_block0.m(div, null);
    			append_dev(div, t0);
    			if (if_block1) if_block1.m(div, null);
    			append_dev(div, t1);
    			if (if_block2) if_block2.m(div, null);
    		},
    		p: function update(ctx, [dirty]) {
    			if (/*all*/ ctx[3] && /*first*/ ctx[4] !== false || /*first*/ ctx[4]) {
    				if (if_block0) {
    					if_block0.p(ctx, dirty);
    				} else {
    					if_block0 = create_if_block_5(ctx);
    					if_block0.c();
    					if_block0.m(div, t0);
    				}
    			} else if (if_block0) {
    				if_block0.d(1);
    				if_block0 = null;
    			}

    			if (/*all*/ ctx[3] && /*rest*/ ctx[6] !== false || /*rest*/ ctx[6]) {
    				if (if_block1) {
    					if_block1.p(ctx, dirty);
    				} else {
    					if_block1 = create_if_block_2(ctx);
    					if_block1.c();
    					if_block1.m(div, t1);
    				}
    			} else if (if_block1) {
    				if_block1.d(1);
    				if_block1 = null;
    			}

    			if (/*all*/ ctx[3] && /*last*/ ctx[5] !== false || /*last*/ ctx[5]) {
    				if (if_block2) {
    					if_block2.p(ctx, dirty);
    				} else {
    					if_block2 = create_if_block$1(ctx);
    					if_block2.c();
    					if_block2.m(div, null);
    				}
    			} else if (if_block2) {
    				if_block2.d(1);
    				if_block2 = null;
    			}

    			if (dirty & /*focus*/ 1024) {
    				toggle_class(div, "focus", /*focus*/ ctx[10]);
    			}

    			if (dirty & /*vertical*/ 4) {
    				toggle_class(div, "vertical", /*vertical*/ ctx[2]);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if (if_block0) if_block0.d();
    			if (if_block1) if_block1.d();
    			if (if_block2) if_block2.d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$1.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$1($$self, $$props, $$invalidate) {
    	let { range = false } = $$props;
    	let { min = 0 } = $$props;
    	let { max = 100 } = $$props;
    	let { step = 1 } = $$props;
    	let { values = [(max + min) / 2] } = $$props;
    	let { vertical = false } = $$props;

    	let { pipstep = (max - min) / step >= (vertical ? 50 : 100)
    	? (max - min) / (vertical ? 10 : 20)
    	: 1 } = $$props;

    	let { all = true } = $$props;
    	let { first } = $$props;
    	let { last } = $$props;
    	let { rest } = $$props;
    	let { prefix = "" } = $$props;
    	let { suffix = "" } = $$props;
    	let { formatter = v => v } = $$props;
    	let { focus } = $$props;
    	let { percentOf } = $$props;

    	const writable_props = [
    		"range",
    		"min",
    		"max",
    		"step",
    		"values",
    		"vertical",
    		"pipstep",
    		"all",
    		"first",
    		"last",
    		"rest",
    		"prefix",
    		"suffix",
    		"formatter",
    		"focus",
    		"percentOf"
    	];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<RangePips> was created with unknown prop '${key}'`);
    	});

    	let { $$slots = {}, $$scope } = $$props;
    	validate_slots("RangePips", $$slots, []);

    	$$self.$set = $$props => {
    		if ("range" in $$props) $$invalidate(16, range = $$props.range);
    		if ("min" in $$props) $$invalidate(0, min = $$props.min);
    		if ("max" in $$props) $$invalidate(1, max = $$props.max);
    		if ("step" in $$props) $$invalidate(17, step = $$props.step);
    		if ("values" in $$props) $$invalidate(18, values = $$props.values);
    		if ("vertical" in $$props) $$invalidate(2, vertical = $$props.vertical);
    		if ("pipstep" in $$props) $$invalidate(19, pipstep = $$props.pipstep);
    		if ("all" in $$props) $$invalidate(3, all = $$props.all);
    		if ("first" in $$props) $$invalidate(4, first = $$props.first);
    		if ("last" in $$props) $$invalidate(5, last = $$props.last);
    		if ("rest" in $$props) $$invalidate(6, rest = $$props.rest);
    		if ("prefix" in $$props) $$invalidate(7, prefix = $$props.prefix);
    		if ("suffix" in $$props) $$invalidate(8, suffix = $$props.suffix);
    		if ("formatter" in $$props) $$invalidate(9, formatter = $$props.formatter);
    		if ("focus" in $$props) $$invalidate(10, focus = $$props.focus);
    		if ("percentOf" in $$props) $$invalidate(11, percentOf = $$props.percentOf);
    	};

    	$$self.$capture_state = () => ({
    		range,
    		min,
    		max,
    		step,
    		values,
    		vertical,
    		pipstep,
    		all,
    		first,
    		last,
    		rest,
    		prefix,
    		suffix,
    		formatter,
    		focus,
    		percentOf,
    		pipCount,
    		pipVal,
    		isSelected,
    		inRange
    	});

    	$$self.$inject_state = $$props => {
    		if ("range" in $$props) $$invalidate(16, range = $$props.range);
    		if ("min" in $$props) $$invalidate(0, min = $$props.min);
    		if ("max" in $$props) $$invalidate(1, max = $$props.max);
    		if ("step" in $$props) $$invalidate(17, step = $$props.step);
    		if ("values" in $$props) $$invalidate(18, values = $$props.values);
    		if ("vertical" in $$props) $$invalidate(2, vertical = $$props.vertical);
    		if ("pipstep" in $$props) $$invalidate(19, pipstep = $$props.pipstep);
    		if ("all" in $$props) $$invalidate(3, all = $$props.all);
    		if ("first" in $$props) $$invalidate(4, first = $$props.first);
    		if ("last" in $$props) $$invalidate(5, last = $$props.last);
    		if ("rest" in $$props) $$invalidate(6, rest = $$props.rest);
    		if ("prefix" in $$props) $$invalidate(7, prefix = $$props.prefix);
    		if ("suffix" in $$props) $$invalidate(8, suffix = $$props.suffix);
    		if ("formatter" in $$props) $$invalidate(9, formatter = $$props.formatter);
    		if ("focus" in $$props) $$invalidate(10, focus = $$props.focus);
    		if ("percentOf" in $$props) $$invalidate(11, percentOf = $$props.percentOf);
    		if ("pipCount" in $$props) $$invalidate(12, pipCount = $$props.pipCount);
    		if ("pipVal" in $$props) $$invalidate(13, pipVal = $$props.pipVal);
    		if ("isSelected" in $$props) $$invalidate(14, isSelected = $$props.isSelected);
    		if ("inRange" in $$props) $$invalidate(15, inRange = $$props.inRange);
    	};

    	let pipCount;
    	let pipVal;
    	let isSelected;
    	let inRange;

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*max, min, step, pipstep*/ 655363) {
    			 $$invalidate(12, pipCount = parseInt((max - min) / (step * pipstep), 10));
    		}

    		if ($$self.$$.dirty & /*min, step, pipstep*/ 655361) {
    			 $$invalidate(13, pipVal = function (val) {
    				return min + val * step * pipstep;
    			});
    		}

    		if ($$self.$$.dirty & /*values*/ 262144) {
    			 $$invalidate(14, isSelected = function (val) {
    				return values.some(v => v === val);
    			});
    		}

    		if ($$self.$$.dirty & /*range, values*/ 327680) {
    			 $$invalidate(15, inRange = function (val) {
    				if (range === "min") {
    					return values[0] < val;
    				} else if (range === "max") {
    					return values[0] > val;
    				} else if (range) {
    					return values[0] < val && values[1] > val;
    				}
    			});
    		}
    	};

    	return [
    		min,
    		max,
    		vertical,
    		all,
    		first,
    		last,
    		rest,
    		prefix,
    		suffix,
    		formatter,
    		focus,
    		percentOf,
    		pipCount,
    		pipVal,
    		isSelected,
    		inRange,
    		range,
    		step,
    		values,
    		pipstep
    	];
    }

    class RangePips extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$1, create_fragment$1, safe_not_equal, {
    			range: 16,
    			min: 0,
    			max: 1,
    			step: 17,
    			values: 18,
    			vertical: 2,
    			pipstep: 19,
    			all: 3,
    			first: 4,
    			last: 5,
    			rest: 6,
    			prefix: 7,
    			suffix: 8,
    			formatter: 9,
    			focus: 10,
    			percentOf: 11
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "RangePips",
    			options,
    			id: create_fragment$1.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*first*/ ctx[4] === undefined && !("first" in props)) {
    			console.warn("<RangePips> was created without expected prop 'first'");
    		}

    		if (/*last*/ ctx[5] === undefined && !("last" in props)) {
    			console.warn("<RangePips> was created without expected prop 'last'");
    		}

    		if (/*rest*/ ctx[6] === undefined && !("rest" in props)) {
    			console.warn("<RangePips> was created without expected prop 'rest'");
    		}

    		if (/*focus*/ ctx[10] === undefined && !("focus" in props)) {
    			console.warn("<RangePips> was created without expected prop 'focus'");
    		}

    		if (/*percentOf*/ ctx[11] === undefined && !("percentOf" in props)) {
    			console.warn("<RangePips> was created without expected prop 'percentOf'");
    		}
    	}

    	get range() {
    		throw new Error("<RangePips>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set range(value) {
    		throw new Error("<RangePips>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get min() {
    		throw new Error("<RangePips>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set min(value) {
    		throw new Error("<RangePips>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get max() {
    		throw new Error("<RangePips>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set max(value) {
    		throw new Error("<RangePips>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get step() {
    		throw new Error("<RangePips>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set step(value) {
    		throw new Error("<RangePips>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get values() {
    		throw new Error("<RangePips>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set values(value) {
    		throw new Error("<RangePips>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get vertical() {
    		throw new Error("<RangePips>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set vertical(value) {
    		throw new Error("<RangePips>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get pipstep() {
    		throw new Error("<RangePips>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set pipstep(value) {
    		throw new Error("<RangePips>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get all() {
    		throw new Error("<RangePips>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set all(value) {
    		throw new Error("<RangePips>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get first() {
    		throw new Error("<RangePips>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set first(value) {
    		throw new Error("<RangePips>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get last() {
    		throw new Error("<RangePips>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set last(value) {
    		throw new Error("<RangePips>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get rest() {
    		throw new Error("<RangePips>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set rest(value) {
    		throw new Error("<RangePips>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get prefix() {
    		throw new Error("<RangePips>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set prefix(value) {
    		throw new Error("<RangePips>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get suffix() {
    		throw new Error("<RangePips>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set suffix(value) {
    		throw new Error("<RangePips>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get formatter() {
    		throw new Error("<RangePips>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set formatter(value) {
    		throw new Error("<RangePips>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get focus() {
    		throw new Error("<RangePips>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set focus(value) {
    		throw new Error("<RangePips>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get percentOf() {
    		throw new Error("<RangePips>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set percentOf(value) {
    		throw new Error("<RangePips>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* node_modules/svelte-range-slider-pips/src/RangeSlider.svelte generated by Svelte v3.24.0 */
    const file$2 = "node_modules/svelte-range-slider-pips/src/RangeSlider.svelte";

    function get_each_context$1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[50] = list[i];
    	child_ctx[52] = i;
    	return child_ctx;
    }

    // (628:6) {#if float}
    function create_if_block_2$1(ctx) {
    	let span;
    	let t0;
    	let t1_value = /*handleFormatter*/ ctx[18](/*value*/ ctx[50]) + "";
    	let t1;
    	let t2;

    	const block = {
    		c: function create() {
    			span = element("span");
    			t0 = text(/*prefix*/ ctx[15]);
    			t1 = text(t1_value);
    			t2 = text(/*suffix*/ ctx[16]);
    			attr_dev(span, "class", "rangeFloat");
    			add_location(span, file$2, 628, 8, 17911);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, span, anchor);
    			append_dev(span, t0);
    			append_dev(span, t1);
    			append_dev(span, t2);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*prefix*/ 32768) set_data_dev(t0, /*prefix*/ ctx[15]);
    			if (dirty[0] & /*handleFormatter, values*/ 262145 && t1_value !== (t1_value = /*handleFormatter*/ ctx[18](/*value*/ ctx[50]) + "")) set_data_dev(t1, t1_value);
    			if (dirty[0] & /*suffix*/ 65536) set_data_dev(t2, /*suffix*/ ctx[16]);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(span);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_2$1.name,
    		type: "if",
    		source: "(628:6) {#if float}",
    		ctx
    	});

    	return block;
    }

    // (611:2) {#each values as value, index}
    function create_each_block$1(ctx) {
    	let span1;
    	let span0;
    	let t;
    	let span1_style_value;
    	let span1_aria_valuemin_value;
    	let span1_aria_valuemax_value;
    	let span1_aria_valuenow_value;
    	let span1_aria_valuetext_value;
    	let span1_aria_orientation_value;
    	let mounted;
    	let dispose;
    	let if_block = /*float*/ ctx[6] && create_if_block_2$1(ctx);

    	const block = {
    		c: function create() {
    			span1 = element("span");
    			span0 = element("span");
    			t = space();
    			if (if_block) if_block.c();
    			attr_dev(span0, "class", "rangeNub");
    			add_location(span0, file$2, 626, 6, 17859);
    			attr_dev(span1, "role", "slider");
    			attr_dev(span1, "class", "rangeHandle");
    			attr_dev(span1, "tabindex", "0");
    			attr_dev(span1, "style", span1_style_value = "" + ((/*vertical*/ ctx[5] ? "top" : "left") + ": " + /*$springPositions*/ ctx[23][/*index*/ ctx[52]] + "%; z-index: " + (/*activeHandle*/ ctx[21] === /*index*/ ctx[52] ? 3 : 2) + ";"));

    			attr_dev(span1, "aria-valuemin", span1_aria_valuemin_value = /*range*/ ctx[1] === true && /*index*/ ctx[52] === 1
    			? /*values*/ ctx[0][0]
    			: /*min*/ ctx[2]);

    			attr_dev(span1, "aria-valuemax", span1_aria_valuemax_value = /*range*/ ctx[1] === true && /*index*/ ctx[52] === 0
    			? /*values*/ ctx[0][1]
    			: /*max*/ ctx[3]);

    			attr_dev(span1, "aria-valuenow", span1_aria_valuenow_value = /*value*/ ctx[50]);
    			attr_dev(span1, "aria-valuetext", span1_aria_valuetext_value = "" + (/*prefix*/ ctx[15] + /*handleFormatter*/ ctx[18](/*value*/ ctx[50]) + /*suffix*/ ctx[16]));
    			attr_dev(span1, "aria-orientation", span1_aria_orientation_value = /*vertical*/ ctx[5] ? "vertical" : "horizontal");
    			toggle_class(span1, "hoverable", /*hover*/ ctx[7]);
    			toggle_class(span1, "active", /*focus*/ ctx[20] && /*activeHandle*/ ctx[21] === /*index*/ ctx[52]);
    			add_location(span1, file$2, 611, 4, 17189);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, span1, anchor);
    			append_dev(span1, span0);
    			append_dev(span1, t);
    			if (if_block) if_block.m(span1, null);

    			if (!mounted) {
    				dispose = [
    					listen_dev(span1, "blur", /*sliderBlurHandle*/ ctx[27], false, false, false),
    					listen_dev(span1, "focus", /*sliderFocusHandle*/ ctx[28], false, false, false),
    					listen_dev(span1, "keydown", /*sliderKeydown*/ ctx[29], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (/*float*/ ctx[6]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block_2$1(ctx);
    					if_block.c();
    					if_block.m(span1, null);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}

    			if (dirty[0] & /*vertical, $springPositions, activeHandle*/ 10485792 && span1_style_value !== (span1_style_value = "" + ((/*vertical*/ ctx[5] ? "top" : "left") + ": " + /*$springPositions*/ ctx[23][/*index*/ ctx[52]] + "%; z-index: " + (/*activeHandle*/ ctx[21] === /*index*/ ctx[52] ? 3 : 2) + ";"))) {
    				attr_dev(span1, "style", span1_style_value);
    			}

    			if (dirty[0] & /*range, values, min*/ 7 && span1_aria_valuemin_value !== (span1_aria_valuemin_value = /*range*/ ctx[1] === true && /*index*/ ctx[52] === 1
    			? /*values*/ ctx[0][0]
    			: /*min*/ ctx[2])) {
    				attr_dev(span1, "aria-valuemin", span1_aria_valuemin_value);
    			}

    			if (dirty[0] & /*range, values, max*/ 11 && span1_aria_valuemax_value !== (span1_aria_valuemax_value = /*range*/ ctx[1] === true && /*index*/ ctx[52] === 0
    			? /*values*/ ctx[0][1]
    			: /*max*/ ctx[3])) {
    				attr_dev(span1, "aria-valuemax", span1_aria_valuemax_value);
    			}

    			if (dirty[0] & /*values*/ 1 && span1_aria_valuenow_value !== (span1_aria_valuenow_value = /*value*/ ctx[50])) {
    				attr_dev(span1, "aria-valuenow", span1_aria_valuenow_value);
    			}

    			if (dirty[0] & /*prefix, handleFormatter, values, suffix*/ 360449 && span1_aria_valuetext_value !== (span1_aria_valuetext_value = "" + (/*prefix*/ ctx[15] + /*handleFormatter*/ ctx[18](/*value*/ ctx[50]) + /*suffix*/ ctx[16]))) {
    				attr_dev(span1, "aria-valuetext", span1_aria_valuetext_value);
    			}

    			if (dirty[0] & /*vertical*/ 32 && span1_aria_orientation_value !== (span1_aria_orientation_value = /*vertical*/ ctx[5] ? "vertical" : "horizontal")) {
    				attr_dev(span1, "aria-orientation", span1_aria_orientation_value);
    			}

    			if (dirty[0] & /*hover*/ 128) {
    				toggle_class(span1, "hoverable", /*hover*/ ctx[7]);
    			}

    			if (dirty[0] & /*focus, activeHandle*/ 3145728) {
    				toggle_class(span1, "active", /*focus*/ ctx[20] && /*activeHandle*/ ctx[21] === /*index*/ ctx[52]);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(span1);
    			if (if_block) if_block.d();
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$1.name,
    		type: "each",
    		source: "(611:2) {#each values as value, index}",
    		ctx
    	});

    	return block;
    }

    // (633:2) {#if range}
    function create_if_block_1$1(ctx) {
    	let span;
    	let span_style_value;

    	const block = {
    		c: function create() {
    			span = element("span");
    			attr_dev(span, "class", "rangeBar");
    			attr_dev(span, "style", span_style_value = "" + ((/*vertical*/ ctx[5] ? "top" : "left") + ": " + /*rangeStart*/ ctx[25](/*$springPositions*/ ctx[23]) + "%; " + (/*vertical*/ ctx[5] ? "bottom" : "right") + ":\n      " + /*rangeEnd*/ ctx[26](/*$springPositions*/ ctx[23]) + "%;"));
    			add_location(span, file$2, 633, 4, 18036);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, span, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*vertical, $springPositions*/ 8388640 && span_style_value !== (span_style_value = "" + ((/*vertical*/ ctx[5] ? "top" : "left") + ": " + /*rangeStart*/ ctx[25](/*$springPositions*/ ctx[23]) + "%; " + (/*vertical*/ ctx[5] ? "bottom" : "right") + ":\n      " + /*rangeEnd*/ ctx[26](/*$springPositions*/ ctx[23]) + "%;"))) {
    				attr_dev(span, "style", span_style_value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(span);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$1.name,
    		type: "if",
    		source: "(633:2) {#if range}",
    		ctx
    	});

    	return block;
    }

    // (639:2) {#if pips}
    function create_if_block$2(ctx) {
    	let rangepips;
    	let current;

    	rangepips = new RangePips({
    			props: {
    				values: /*values*/ ctx[0],
    				min: /*min*/ ctx[2],
    				max: /*max*/ ctx[3],
    				step: /*step*/ ctx[4],
    				range: /*range*/ ctx[1],
    				vertical: /*vertical*/ ctx[5],
    				all: /*all*/ ctx[10],
    				first: /*first*/ ctx[11],
    				last: /*last*/ ctx[12],
    				rest: /*rest*/ ctx[13],
    				pipstep: /*pipstep*/ ctx[9],
    				prefix: /*prefix*/ ctx[15],
    				suffix: /*suffix*/ ctx[16],
    				formatter: /*formatter*/ ctx[17],
    				focus: /*focus*/ ctx[20],
    				percentOf: /*percentOf*/ ctx[22]
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(rangepips.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(rangepips, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const rangepips_changes = {};
    			if (dirty[0] & /*values*/ 1) rangepips_changes.values = /*values*/ ctx[0];
    			if (dirty[0] & /*min*/ 4) rangepips_changes.min = /*min*/ ctx[2];
    			if (dirty[0] & /*max*/ 8) rangepips_changes.max = /*max*/ ctx[3];
    			if (dirty[0] & /*step*/ 16) rangepips_changes.step = /*step*/ ctx[4];
    			if (dirty[0] & /*range*/ 2) rangepips_changes.range = /*range*/ ctx[1];
    			if (dirty[0] & /*vertical*/ 32) rangepips_changes.vertical = /*vertical*/ ctx[5];
    			if (dirty[0] & /*all*/ 1024) rangepips_changes.all = /*all*/ ctx[10];
    			if (dirty[0] & /*first*/ 2048) rangepips_changes.first = /*first*/ ctx[11];
    			if (dirty[0] & /*last*/ 4096) rangepips_changes.last = /*last*/ ctx[12];
    			if (dirty[0] & /*rest*/ 8192) rangepips_changes.rest = /*rest*/ ctx[13];
    			if (dirty[0] & /*pipstep*/ 512) rangepips_changes.pipstep = /*pipstep*/ ctx[9];
    			if (dirty[0] & /*prefix*/ 32768) rangepips_changes.prefix = /*prefix*/ ctx[15];
    			if (dirty[0] & /*suffix*/ 65536) rangepips_changes.suffix = /*suffix*/ ctx[16];
    			if (dirty[0] & /*formatter*/ 131072) rangepips_changes.formatter = /*formatter*/ ctx[17];
    			if (dirty[0] & /*focus*/ 1048576) rangepips_changes.focus = /*focus*/ ctx[20];
    			if (dirty[0] & /*percentOf*/ 4194304) rangepips_changes.percentOf = /*percentOf*/ ctx[22];
    			rangepips.$set(rangepips_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(rangepips.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(rangepips.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(rangepips, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$2.name,
    		type: "if",
    		source: "(639:2) {#if pips}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$2(ctx) {
    	let div;
    	let t0;
    	let t1;
    	let current;
    	let mounted;
    	let dispose;
    	let each_value = /*values*/ ctx[0];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$1(get_each_context$1(ctx, each_value, i));
    	}

    	let if_block0 = /*range*/ ctx[1] && create_if_block_1$1(ctx);
    	let if_block1 = /*pips*/ ctx[8] && create_if_block$2(ctx);

    	const block = {
    		c: function create() {
    			div = element("div");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t0 = space();
    			if (if_block0) if_block0.c();
    			t1 = space();
    			if (if_block1) if_block1.c();
    			attr_dev(div, "id", /*id*/ ctx[14]);
    			attr_dev(div, "class", "rangeSlider");
    			toggle_class(div, "min", /*range*/ ctx[1] === "min");
    			toggle_class(div, "range", /*range*/ ctx[1]);
    			toggle_class(div, "vertical", /*vertical*/ ctx[5]);
    			toggle_class(div, "focus", /*focus*/ ctx[20]);
    			toggle_class(div, "max", /*range*/ ctx[1] === "max");
    			toggle_class(div, "pips", /*pips*/ ctx[8]);
    			toggle_class(div, "pip-labels", /*all*/ ctx[10] === "label" || /*first*/ ctx[11] === "label" || /*last*/ ctx[12] === "label" || /*rest*/ ctx[13] === "label");
    			add_location(div, file$2, 597, 0, 16790);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(div, null);
    			}

    			append_dev(div, t0);
    			if (if_block0) if_block0.m(div, null);
    			append_dev(div, t1);
    			if (if_block1) if_block1.m(div, null);
    			/*div_binding*/ ctx[38](div);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(window, "mousedown", /*bodyInteractStart*/ ctx[31], false, false, false),
    					listen_dev(window, "touchstart", /*bodyInteractStart*/ ctx[31], false, false, false),
    					listen_dev(window, "mousemove", /*bodyInteract*/ ctx[32], false, false, false),
    					listen_dev(window, "touchmove", /*bodyInteract*/ ctx[32], false, false, false),
    					listen_dev(window, "mouseup", /*bodyMouseUp*/ ctx[33], false, false, false),
    					listen_dev(window, "touchend", /*bodyTouchEnd*/ ctx[34], false, false, false),
    					listen_dev(window, "keydown", /*bodyKeyDown*/ ctx[35], false, false, false),
    					listen_dev(div, "touchstart", prevent_default(/*sliderInteractStart*/ ctx[30]), false, true, false),
    					listen_dev(div, "mousedown", /*sliderInteractStart*/ ctx[30], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*vertical, $springPositions, activeHandle, range, values, min, max, prefix, handleFormatter, suffix, hover, focus, sliderKeydown, sliderBlurHandle, sliderFocusHandle, float*/ 951419119) {
    				each_value = /*values*/ ctx[0];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$1(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block$1(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(div, t0);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}

    			if (/*range*/ ctx[1]) {
    				if (if_block0) {
    					if_block0.p(ctx, dirty);
    				} else {
    					if_block0 = create_if_block_1$1(ctx);
    					if_block0.c();
    					if_block0.m(div, t1);
    				}
    			} else if (if_block0) {
    				if_block0.d(1);
    				if_block0 = null;
    			}

    			if (/*pips*/ ctx[8]) {
    				if (if_block1) {
    					if_block1.p(ctx, dirty);

    					if (dirty[0] & /*pips*/ 256) {
    						transition_in(if_block1, 1);
    					}
    				} else {
    					if_block1 = create_if_block$2(ctx);
    					if_block1.c();
    					transition_in(if_block1, 1);
    					if_block1.m(div, null);
    				}
    			} else if (if_block1) {
    				group_outros();

    				transition_out(if_block1, 1, 1, () => {
    					if_block1 = null;
    				});

    				check_outros();
    			}

    			if (!current || dirty[0] & /*id*/ 16384) {
    				attr_dev(div, "id", /*id*/ ctx[14]);
    			}

    			if (dirty[0] & /*range*/ 2) {
    				toggle_class(div, "min", /*range*/ ctx[1] === "min");
    			}

    			if (dirty[0] & /*range*/ 2) {
    				toggle_class(div, "range", /*range*/ ctx[1]);
    			}

    			if (dirty[0] & /*vertical*/ 32) {
    				toggle_class(div, "vertical", /*vertical*/ ctx[5]);
    			}

    			if (dirty[0] & /*focus*/ 1048576) {
    				toggle_class(div, "focus", /*focus*/ ctx[20]);
    			}

    			if (dirty[0] & /*range*/ 2) {
    				toggle_class(div, "max", /*range*/ ctx[1] === "max");
    			}

    			if (dirty[0] & /*pips*/ 256) {
    				toggle_class(div, "pips", /*pips*/ ctx[8]);
    			}

    			if (dirty[0] & /*all, first, last, rest*/ 15360) {
    				toggle_class(div, "pip-labels", /*all*/ ctx[10] === "label" || /*first*/ ctx[11] === "label" || /*last*/ ctx[12] === "label" || /*rest*/ ctx[13] === "label");
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block1);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block1);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_each(each_blocks, detaching);
    			if (if_block0) if_block0.d();
    			if (if_block1) if_block1.d();
    			/*div_binding*/ ctx[38](null);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$2.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function index(el) {
    	if (!el) return -1;
    	var i = 0;

    	while (el = el.previousElementSibling) {
    		i++;
    	}

    	return i;
    }

    /**
     * noramlise a mouse or touch event to return the
     * client (x/y) object for that event
     * @param {event} e a mouse/touch event to normalise
     * @returns {object} normalised event client object (x,y)
     **/
    function normalisedClient(e) {
    	if (e.type.includes("touch")) {
    		return e.touches[0];
    	} else {
    		return e;
    	}
    }

    function instance$2($$self, $$props, $$invalidate) {
    	let $springPositions;
    	let { range = false } = $$props;
    	let { min = 0 } = $$props;
    	let { max = 100 } = $$props;
    	let { step = 1 } = $$props;
    	let { values = [(max + min) / 2] } = $$props;
    	let { vertical = false } = $$props;
    	let { float = false } = $$props;
    	let { hover = true } = $$props;
    	let { pips = false } = $$props;
    	let { pipstep } = $$props;
    	let { all } = $$props;
    	let { first } = $$props;
    	let { last } = $$props;
    	let { rest } = $$props;
    	let { id } = $$props;
    	let { prefix = "" } = $$props;
    	let { suffix = "" } = $$props;
    	let { formatter = v => v } = $$props;
    	let { handleFormatter = formatter } = $$props;
    	let { precision = 2 } = $$props;
    	let { springValues = { stiffness: 0.15, damping: 0.4 } } = $$props;

    	// dom references
    	let slider;

    	// state management
    	let focus = false;

    	let handleActivated = false;
    	let keyboardActive = false;
    	let activeHandle = values.length - 1;

    	// save spring-tweened copies of the values for use
    	// when changing values and animating the handle/range nicely
    	let springPositions = spring(values.map(v => 50), springValues);

    	validate_store(springPositions, "springPositions");
    	component_subscribe($$self, springPositions, value => $$invalidate(23, $springPositions = value));

    	/**
     * get the position (x/y) of a mouse/touch event on the screen
     * @param {event} e a mouse/touch event
     * @returns {object} position on screen (x,y)
     **/
    	function eventPosition(e) {
    		return vertical
    		? normalisedClient(e).clientY
    		: normalisedClient(e).clientX;
    	}

    	/**
     * check if an element is a handle on the slider
     * @param {object} el dom object reference we want to check
     * @returns {boolean}
     **/
    	function targetIsHandle(el) {
    		const handles = slider.querySelectorAll(".handle");
    		const isHandle = Array.prototype.includes.call(handles, el);
    		const isChild = Array.prototype.some.call(handles, e => e.contains(el));
    		return isHandle || isChild;
    	}

    	/**
     * take in the value from the "range" parameter and see if
     * we should make a min/max/range slider.
     * @param {array} values the input values for the rangeSlider
     * @return {array} the range array for creating a rangeSlider
     **/
    	function trimRange(values) {
    		if (range === "min" || range === "max") {
    			return values.slice(0, 1);
    		} else if (range) {
    			return values.slice(0, 2);
    		} else {
    			return values;
    		}
    	}

    	/**
     * helper to return the slider dimensions for finding
     * the closest handle to user interaction
     * @return {object} the range slider DOM client rect
     **/
    	function getSliderDimensions() {
    		return slider.getBoundingClientRect();
    	}

    	/**
     * helper to return closest handle to user interaction
     * @param {number} clientPos the pixel (clientX/Y) to check against
     * @return {number} the index of the closest handle to clientPos
     **/
    	function getClosestHandle(clientPos) {
    		// first make sure we have the latest dimensions
    		// of the slider, as it may have changed size
    		const dims = getSliderDimensions();

    		// calculate the interaction position, percent and value
    		let iPos = 0;

    		let iPercent = 0;
    		let iVal = 0;

    		if (vertical) {
    			iPos = clientPos - dims.y;
    			iPercent = iPos / dims.height * 100;
    			iVal = (max - min) / 100 * iPercent + min;
    		} else {
    			iPos = clientPos - dims.x;
    			iPercent = iPos / dims.width * 100;
    			iVal = (max - min) / 100 * iPercent + min;
    		}

    		let closest;

    		// if we have a range, and the handles are at the same
    		// position, we want a simple check if the interaction
    		// value is greater than return the second handle
    		if (range === true && values[0] === values[1]) {
    			if (iVal > values[1]) {
    				return 1;
    			} else {
    				return 0;
    			}
    		} else // we sort the handles values, and return the first one closest
    		// to the interaction value
    		{
    			closest = values.indexOf([...values].sort((a, b) => Math.abs(iVal - a) - Math.abs(iVal - b))[0]); // if there are multiple handles, and not a range, then
    		}

    		return closest;
    	}

    	/**
     * take the interaction position on the slider, convert
     * it to a value on the range, and then send that value
     * through to the moveHandle() method to set the active
     * handle's position
     * @param {number} clientPos the clientX/Y of the interaction
     **/
    	function handleInteract(clientPos) {
    		// first make sure we have the latest dimensions
    		// of the slider, as it may have changed size
    		const dims = getSliderDimensions();

    		// calculate the interaction position, percent and value
    		let iPos = 0;

    		let iPercent = 0;
    		let iVal = 0;

    		if (vertical) {
    			iPos = clientPos - dims.y;
    			iPercent = iPos / dims.height * 100;
    			iVal = (max - min) / 100 * iPercent + min;
    		} else {
    			iPos = clientPos - dims.x;
    			iPercent = iPos / dims.width * 100;
    			iVal = (max - min) / 100 * iPercent + min;
    		}

    		// move handle to the value
    		moveHandle(activeHandle, iVal);
    	}

    	/**
     * move a handle to a specific value, respecting the clamp/align rules
     * @param {number} index the index of the handle we want to move
     * @param {number} value the value to move the handle to
     * @return {number} the value that was moved to (after alignment/clamping)
     **/
    	function moveHandle(index, value) {
    		// restrict the handles of a range-slider from
    		// going past one-another
    		if (range && index === 0 && value > values[1]) {
    			value = values[1];
    		} else if (range && index === 1 && value < values[0]) {
    			value = values[0];
    		}

    		// set the value for the handle, and align/clamp it
    		$$invalidate(0, values[index] = value, values);
    	}

    	/**
     * helper to find the beginning range value for use with css style
     * @param {array} values the input values for the rangeSlider
     * @return {number} the beginning of the range
     **/
    	function rangeStart(values) {
    		if (range === "min") {
    			return 0;
    		} else {
    			return values[0];
    		}
    	}

    	/**
     * helper to find the ending range value for use with css style
     * @param {array} values the input values for the rangeSlider
     * @return {number} the end of the range
     **/
    	function rangeEnd(values) {
    		if (range === "max") {
    			return 0;
    		} else if (range === "min") {
    			return 100 - values[0];
    		} else {
    			return 100 - values[1];
    		}
    	}

    	/**
     * when the user has unfocussed (blurred) from the
     * slider, deactivated all handles
     * @param {event} e the event from browser
     **/
    	function sliderBlurHandle(e) {
    		if (keyboardActive) {
    			$$invalidate(20, focus = false);
    			handleActivated = false;
    		}
    	}

    	/**
     * when the user focusses the handle of a slider
     * set it to be active
     * @param {event} e the event from browser
     **/
    	function sliderFocusHandle(e) {
    		$$invalidate(21, activeHandle = index(e.target));
    		$$invalidate(20, focus = true);
    	}

    	/**
     * handle the keyboard accessible features by checking the
     * input type, and modfier key then moving handle by appropriate amount
     * @param {event} e the event from browser
     **/
    	function sliderKeydown(e) {
    		const handle = index(e.target);
    		let jump = e.ctrlKey || e.metaKey || e.shiftKey ? step * 10 : step;
    		let prevent = false;

    		switch (e.key) {
    			case "PageDown":
    				jump *= 10;
    			case "ArrowRight":
    			case "ArrowUp":
    				moveHandle(handle, values[handle] + jump);
    				prevent = true;
    				break;
    			case "PageUp":
    				jump *= 10;
    			case "ArrowLeft":
    			case "ArrowDown":
    				moveHandle(handle, values[handle] - jump);
    				prevent = true;
    				break;
    			case "Home":
    				moveHandle(handle, min);
    				prevent = true;
    				break;
    			case "End":
    				moveHandle(handle, max);
    				prevent = true;
    				break;
    		}

    		if (prevent) {
    			e.preventDefault();
    			e.stopPropagation();
    		}
    	}

    	/**
     * function to run when the user touches
     * down on the slider element anywhere
     * @param {event} e the event from browser
     **/
    	function sliderInteractStart(e) {
    		const p = eventPosition(e);

    		// set the closest handle as active
    		$$invalidate(20, focus = true);

    		handleActivated = true;
    		$$invalidate(21, activeHandle = getClosestHandle(p));

    		// for touch devices we want the handle to instantly
    		// move to the position touched for more responsive feeling
    		if (e.type === "touchstart") {
    			handleInteract(p);
    		}
    	}

    	/**
     * unfocus the slider if the user clicked off of
     * it, somewhere else on the screen
     * @param {event} e the event from browser
     **/
    	function bodyInteractStart(e) {
    		keyboardActive = false;

    		if (focus && e.target !== slider && !slider.contains(e.target)) {
    			$$invalidate(20, focus = false);
    		}
    	}

    	/**
     * send the clientX through to handle the interaction
     * whenever the user moves acros screen while active
     * @param {event} e the event from browser
     **/
    	function bodyInteract(e) {
    		if (handleActivated) {
    			handleInteract(eventPosition(e));
    		}
    	}

    	/**
     * if user triggers mouseup on the body while
     * a handle is active (without moving) then we
     * trigger an interact event there
     * @param {event} e the event from browser
     **/
    	function bodyMouseUp(e) {
    		const el = e.target;

    		// this only works if a handle is active, which can
    		// only happen if there was sliderInteractStart triggered
    		// on the slider, already
    		if (handleActivated && (el === slider || slider.contains(el))) {
    			$$invalidate(20, focus = true);

    			if (!targetIsHandle(el)) {
    				handleInteract(eventPosition(e));
    			}
    		}

    		handleActivated = false;
    	}

    	/**
     * if user triggers touchend on the body then we
     * defocus the slider completely
     * @param {event} e the event from browser
     **/
    	function bodyTouchEnd(e) {
    		handleActivated = false;
    	}

    	function bodyKeyDown(e) {
    		if (e.target === slider || slider.contains(e.target)) {
    			keyboardActive = true;
    		}
    	}

    	const writable_props = [
    		"range",
    		"min",
    		"max",
    		"step",
    		"values",
    		"vertical",
    		"float",
    		"hover",
    		"pips",
    		"pipstep",
    		"all",
    		"first",
    		"last",
    		"rest",
    		"id",
    		"prefix",
    		"suffix",
    		"formatter",
    		"handleFormatter",
    		"precision",
    		"springValues"
    	];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<RangeSlider> was created with unknown prop '${key}'`);
    	});

    	let { $$slots = {}, $$scope } = $$props;
    	validate_slots("RangeSlider", $$slots, []);

    	function div_binding($$value) {
    		binding_callbacks[$$value ? "unshift" : "push"](() => {
    			slider = $$value;
    			$$invalidate(19, slider);
    		});
    	}

    	$$self.$set = $$props => {
    		if ("range" in $$props) $$invalidate(1, range = $$props.range);
    		if ("min" in $$props) $$invalidate(2, min = $$props.min);
    		if ("max" in $$props) $$invalidate(3, max = $$props.max);
    		if ("step" in $$props) $$invalidate(4, step = $$props.step);
    		if ("values" in $$props) $$invalidate(0, values = $$props.values);
    		if ("vertical" in $$props) $$invalidate(5, vertical = $$props.vertical);
    		if ("float" in $$props) $$invalidate(6, float = $$props.float);
    		if ("hover" in $$props) $$invalidate(7, hover = $$props.hover);
    		if ("pips" in $$props) $$invalidate(8, pips = $$props.pips);
    		if ("pipstep" in $$props) $$invalidate(9, pipstep = $$props.pipstep);
    		if ("all" in $$props) $$invalidate(10, all = $$props.all);
    		if ("first" in $$props) $$invalidate(11, first = $$props.first);
    		if ("last" in $$props) $$invalidate(12, last = $$props.last);
    		if ("rest" in $$props) $$invalidate(13, rest = $$props.rest);
    		if ("id" in $$props) $$invalidate(14, id = $$props.id);
    		if ("prefix" in $$props) $$invalidate(15, prefix = $$props.prefix);
    		if ("suffix" in $$props) $$invalidate(16, suffix = $$props.suffix);
    		if ("formatter" in $$props) $$invalidate(17, formatter = $$props.formatter);
    		if ("handleFormatter" in $$props) $$invalidate(18, handleFormatter = $$props.handleFormatter);
    		if ("precision" in $$props) $$invalidate(36, precision = $$props.precision);
    		if ("springValues" in $$props) $$invalidate(37, springValues = $$props.springValues);
    	};

    	$$self.$capture_state = () => ({
    		spring,
    		RangePips,
    		range,
    		min,
    		max,
    		step,
    		values,
    		vertical,
    		float,
    		hover,
    		pips,
    		pipstep,
    		all,
    		first,
    		last,
    		rest,
    		id,
    		prefix,
    		suffix,
    		formatter,
    		handleFormatter,
    		precision,
    		springValues,
    		slider,
    		focus,
    		handleActivated,
    		keyboardActive,
    		activeHandle,
    		springPositions,
    		index,
    		normalisedClient,
    		eventPosition,
    		targetIsHandle,
    		trimRange,
    		getSliderDimensions,
    		getClosestHandle,
    		handleInteract,
    		moveHandle,
    		rangeStart,
    		rangeEnd,
    		sliderBlurHandle,
    		sliderFocusHandle,
    		sliderKeydown,
    		sliderInteractStart,
    		bodyInteractStart,
    		bodyInteract,
    		bodyMouseUp,
    		bodyTouchEnd,
    		bodyKeyDown,
    		alignValueToStep,
    		percentOf,
    		clampValue,
    		$springPositions
    	});

    	$$self.$inject_state = $$props => {
    		if ("range" in $$props) $$invalidate(1, range = $$props.range);
    		if ("min" in $$props) $$invalidate(2, min = $$props.min);
    		if ("max" in $$props) $$invalidate(3, max = $$props.max);
    		if ("step" in $$props) $$invalidate(4, step = $$props.step);
    		if ("values" in $$props) $$invalidate(0, values = $$props.values);
    		if ("vertical" in $$props) $$invalidate(5, vertical = $$props.vertical);
    		if ("float" in $$props) $$invalidate(6, float = $$props.float);
    		if ("hover" in $$props) $$invalidate(7, hover = $$props.hover);
    		if ("pips" in $$props) $$invalidate(8, pips = $$props.pips);
    		if ("pipstep" in $$props) $$invalidate(9, pipstep = $$props.pipstep);
    		if ("all" in $$props) $$invalidate(10, all = $$props.all);
    		if ("first" in $$props) $$invalidate(11, first = $$props.first);
    		if ("last" in $$props) $$invalidate(12, last = $$props.last);
    		if ("rest" in $$props) $$invalidate(13, rest = $$props.rest);
    		if ("id" in $$props) $$invalidate(14, id = $$props.id);
    		if ("prefix" in $$props) $$invalidate(15, prefix = $$props.prefix);
    		if ("suffix" in $$props) $$invalidate(16, suffix = $$props.suffix);
    		if ("formatter" in $$props) $$invalidate(17, formatter = $$props.formatter);
    		if ("handleFormatter" in $$props) $$invalidate(18, handleFormatter = $$props.handleFormatter);
    		if ("precision" in $$props) $$invalidate(36, precision = $$props.precision);
    		if ("springValues" in $$props) $$invalidate(37, springValues = $$props.springValues);
    		if ("slider" in $$props) $$invalidate(19, slider = $$props.slider);
    		if ("focus" in $$props) $$invalidate(20, focus = $$props.focus);
    		if ("handleActivated" in $$props) handleActivated = $$props.handleActivated;
    		if ("keyboardActive" in $$props) keyboardActive = $$props.keyboardActive;
    		if ("activeHandle" in $$props) $$invalidate(21, activeHandle = $$props.activeHandle);
    		if ("springPositions" in $$props) $$invalidate(24, springPositions = $$props.springPositions);
    		if ("alignValueToStep" in $$props) $$invalidate(41, alignValueToStep = $$props.alignValueToStep);
    		if ("percentOf" in $$props) $$invalidate(22, percentOf = $$props.percentOf);
    		if ("clampValue" in $$props) $$invalidate(42, clampValue = $$props.clampValue);
    	};

    	let percentOf;
    	let clampValue;
    	let alignValueToStep;

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty[0] & /*min, max*/ 12) {
    			/**
     * clamp a value from the range so that it always
     * falls within the min/max values
     * @param {number} val the value to clamp
     * @return {number} the value after it's been clamped
     **/
    			 $$invalidate(42, clampValue = function (val) {
    				// return the min/max if outside of that range
    				return val <= min ? min : val >= max ? max : val;
    			});
    		}

    		if ($$self.$$.dirty[0] & /*min, max, step*/ 28 | $$self.$$.dirty[1] & /*clampValue, precision*/ 2080) {
    			/**
     * align the value with the steps so that it
     * always sits on the closest (above/below) step
     * @param {number} val the value to align
     * @return {number} the value after it's been aligned
     **/
    			 $$invalidate(41, alignValueToStep = function (val) {
    				// sanity check for performance
    				if (val <= min) {
    					return min;
    				} else if (val >= max) {
    					return max;
    				}

    				// find the middle-point between steps
    				// and see if the value is closer to the
    				// next step, or previous step
    				let remainder = (val - min) % step;

    				let aligned = val - remainder;

    				if (Math.abs(remainder) * 2 >= step) {
    					aligned += remainder > 0 ? step : -step;
    				}

    				// make sure the value is within acceptable limits
    				aligned = clampValue(aligned);

    				// make sure the returned value is set to the precision desired
    				// this is also because javascript often returns weird floats
    				// when dealing with odd numbers and percentages
    				return parseFloat(aligned.toFixed(precision));
    			});
    		}

    		if ($$self.$$.dirty[0] & /*values*/ 1 | $$self.$$.dirty[1] & /*alignValueToStep*/ 1024) {
    			// watch the values array, and trim / clamp the values to the steps
    			// and boundaries set up in the slider on change
    			 $$invalidate(0, values = trimRange(values).map(v => alignValueToStep(v)));
    		}

    		if ($$self.$$.dirty[0] & /*min, max*/ 12 | $$self.$$.dirty[1] & /*precision*/ 32) {
    			/**
     * take in a value, and then calculate that value's percentage
     * of the overall range (min-max);
     * @param {number} val the value we're getting percent for
     * @return {number} the percentage value
     **/
    			 $$invalidate(22, percentOf = function (val) {
    				let perc = (val - min) / (max - min) * 100;

    				if (perc >= 100) {
    					return 100;
    				} else if (perc <= 0) {
    					return 0;
    				} else {
    					return parseFloat(perc.toFixed(precision));
    				}
    			});
    		}

    		if ($$self.$$.dirty[0] & /*values, percentOf*/ 4194305) {
    			// update the spring function so that movement can happen in the UI
    			 {
    				springPositions.set(values.map(v => percentOf(v)));
    			}
    		}
    	};

    	return [
    		values,
    		range,
    		min,
    		max,
    		step,
    		vertical,
    		float,
    		hover,
    		pips,
    		pipstep,
    		all,
    		first,
    		last,
    		rest,
    		id,
    		prefix,
    		suffix,
    		formatter,
    		handleFormatter,
    		slider,
    		focus,
    		activeHandle,
    		percentOf,
    		$springPositions,
    		springPositions,
    		rangeStart,
    		rangeEnd,
    		sliderBlurHandle,
    		sliderFocusHandle,
    		sliderKeydown,
    		sliderInteractStart,
    		bodyInteractStart,
    		bodyInteract,
    		bodyMouseUp,
    		bodyTouchEnd,
    		bodyKeyDown,
    		precision,
    		springValues,
    		div_binding
    	];
    }

    class RangeSlider extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(
    			this,
    			options,
    			instance$2,
    			create_fragment$2,
    			safe_not_equal,
    			{
    				range: 1,
    				min: 2,
    				max: 3,
    				step: 4,
    				values: 0,
    				vertical: 5,
    				float: 6,
    				hover: 7,
    				pips: 8,
    				pipstep: 9,
    				all: 10,
    				first: 11,
    				last: 12,
    				rest: 13,
    				id: 14,
    				prefix: 15,
    				suffix: 16,
    				formatter: 17,
    				handleFormatter: 18,
    				precision: 36,
    				springValues: 37
    			},
    			[-1, -1]
    		);

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "RangeSlider",
    			options,
    			id: create_fragment$2.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*pipstep*/ ctx[9] === undefined && !("pipstep" in props)) {
    			console.warn("<RangeSlider> was created without expected prop 'pipstep'");
    		}

    		if (/*all*/ ctx[10] === undefined && !("all" in props)) {
    			console.warn("<RangeSlider> was created without expected prop 'all'");
    		}

    		if (/*first*/ ctx[11] === undefined && !("first" in props)) {
    			console.warn("<RangeSlider> was created without expected prop 'first'");
    		}

    		if (/*last*/ ctx[12] === undefined && !("last" in props)) {
    			console.warn("<RangeSlider> was created without expected prop 'last'");
    		}

    		if (/*rest*/ ctx[13] === undefined && !("rest" in props)) {
    			console.warn("<RangeSlider> was created without expected prop 'rest'");
    		}

    		if (/*id*/ ctx[14] === undefined && !("id" in props)) {
    			console.warn("<RangeSlider> was created without expected prop 'id'");
    		}
    	}

    	get range() {
    		throw new Error("<RangeSlider>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set range(value) {
    		throw new Error("<RangeSlider>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get min() {
    		throw new Error("<RangeSlider>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set min(value) {
    		throw new Error("<RangeSlider>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get max() {
    		throw new Error("<RangeSlider>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set max(value) {
    		throw new Error("<RangeSlider>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get step() {
    		throw new Error("<RangeSlider>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set step(value) {
    		throw new Error("<RangeSlider>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get values() {
    		throw new Error("<RangeSlider>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set values(value) {
    		throw new Error("<RangeSlider>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get vertical() {
    		throw new Error("<RangeSlider>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set vertical(value) {
    		throw new Error("<RangeSlider>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get float() {
    		throw new Error("<RangeSlider>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set float(value) {
    		throw new Error("<RangeSlider>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get hover() {
    		throw new Error("<RangeSlider>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set hover(value) {
    		throw new Error("<RangeSlider>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get pips() {
    		throw new Error("<RangeSlider>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set pips(value) {
    		throw new Error("<RangeSlider>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get pipstep() {
    		throw new Error("<RangeSlider>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set pipstep(value) {
    		throw new Error("<RangeSlider>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get all() {
    		throw new Error("<RangeSlider>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set all(value) {
    		throw new Error("<RangeSlider>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get first() {
    		throw new Error("<RangeSlider>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set first(value) {
    		throw new Error("<RangeSlider>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get last() {
    		throw new Error("<RangeSlider>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set last(value) {
    		throw new Error("<RangeSlider>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get rest() {
    		throw new Error("<RangeSlider>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set rest(value) {
    		throw new Error("<RangeSlider>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get id() {
    		throw new Error("<RangeSlider>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set id(value) {
    		throw new Error("<RangeSlider>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get prefix() {
    		throw new Error("<RangeSlider>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set prefix(value) {
    		throw new Error("<RangeSlider>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get suffix() {
    		throw new Error("<RangeSlider>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set suffix(value) {
    		throw new Error("<RangeSlider>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get formatter() {
    		throw new Error("<RangeSlider>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set formatter(value) {
    		throw new Error("<RangeSlider>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get handleFormatter() {
    		throw new Error("<RangeSlider>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set handleFormatter(value) {
    		throw new Error("<RangeSlider>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get precision() {
    		throw new Error("<RangeSlider>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set precision(value) {
    		throw new Error("<RangeSlider>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get springValues() {
    		throw new Error("<RangeSlider>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set springValues(value) {
    		throw new Error("<RangeSlider>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/Components/Example.svelte generated by Svelte v3.24.0 */
    const file$3 = "src/Components/Example.svelte";
    const get_slider_slot_changes = dirty => ({ v: dirty & /*values*/ 8 });
    const get_slider_slot_context = ctx => ({ v: /*values*/ ctx[3] });
    const get_css_slot_changes = dirty => ({});
    const get_css_slot_context = ctx => ({});
    const get_code_slot_changes = dirty => ({});
    const get_code_slot_context = ctx => ({});

    // (107:6) {#if code}
    function create_if_block_2$2(ctx) {
    	let prism;
    	let current;

    	prism = new Prism$1({
    			props: {
    				language: "svelte",
    				$$slots: { default: [create_default_slot_1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(prism.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(prism, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const prism_changes = {};

    			if (dirty & /*$$scope*/ 128) {
    				prism_changes.$$scope = { dirty, ctx };
    			}

    			prism.$set(prism_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(prism.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(prism.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(prism, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_2$2.name,
    		type: "if",
    		source: "(107:6) {#if code}",
    		ctx
    	});

    	return block;
    }

    // (108:6) <Prism language="svelte">
    function create_default_slot_1(ctx) {
    	let current;
    	const code_slot_template = /*$$slots*/ ctx[4].code;
    	const code_slot = create_slot(code_slot_template, ctx, /*$$scope*/ ctx[7], get_code_slot_context);

    	const block = {
    		c: function create() {
    			if (code_slot) code_slot.c();
    		},
    		m: function mount(target, anchor) {
    			if (code_slot) {
    				code_slot.m(target, anchor);
    			}

    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (code_slot) {
    				if (code_slot.p && dirty & /*$$scope*/ 128) {
    					update_slot(code_slot, code_slot_template, ctx, /*$$scope*/ ctx[7], dirty, get_code_slot_changes, get_code_slot_context);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(code_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(code_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (code_slot) code_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_1.name,
    		type: "slot",
    		source: "(108:6) <Prism language=\\\"svelte\\\">",
    		ctx
    	});

    	return block;
    }

    // (117:6) {#if css}
    function create_if_block_1$2(ctx) {
    	let prism;
    	let current;

    	prism = new Prism$1({
    			props: {
    				language: "css",
    				$$slots: { default: [create_default_slot] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(prism.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(prism, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const prism_changes = {};

    			if (dirty & /*$$scope*/ 128) {
    				prism_changes.$$scope = { dirty, ctx };
    			}

    			prism.$set(prism_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(prism.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(prism.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(prism, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$2.name,
    		type: "if",
    		source: "(117:6) {#if css}",
    		ctx
    	});

    	return block;
    }

    // (118:6) <Prism language="css">
    function create_default_slot(ctx) {
    	let current;
    	const css_slot_template = /*$$slots*/ ctx[4].css;
    	const css_slot = create_slot(css_slot_template, ctx, /*$$scope*/ ctx[7], get_css_slot_context);

    	const block = {
    		c: function create() {
    			if (css_slot) css_slot.c();
    		},
    		m: function mount(target, anchor) {
    			if (css_slot) {
    				css_slot.m(target, anchor);
    			}

    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (css_slot) {
    				if (css_slot.p && dirty & /*$$scope*/ 128) {
    					update_slot(css_slot, css_slot_template, ctx, /*$$scope*/ ctx[7], dirty, get_css_slot_changes, get_css_slot_context);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(css_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(css_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (css_slot) css_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot.name,
    		type: "slot",
    		source: "(118:6) <Prism language=\\\"css\\\">",
    		ctx
    	});

    	return block;
    }

    // (127:37)          
    function fallback_block(ctx) {
    	let rangeslider;
    	let current;
    	rangeslider = new RangeSlider({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(rangeslider.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(rangeslider, target, anchor);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(rangeslider.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(rangeslider.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(rangeslider, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: fallback_block.name,
    		type: "fallback",
    		source: "(127:37)          ",
    		ctx
    	});

    	return block;
    }

    // (131:6) {#if values}
    function create_if_block$3(ctx) {
    	let span;
    	let t0;
    	let code_1;
    	let t1;
    	let t2;
    	let t3;

    	const block = {
    		c: function create() {
    			span = element("span");
    			t0 = text("values: ");
    			code_1 = element("code");
    			t1 = text("[");
    			t2 = text(/*values*/ ctx[3]);
    			t3 = text("]");
    			attr_dev(code_1, "class", "svelte-byqmbg");
    			add_location(code_1, file$3, 131, 35, 2387);
    			attr_dev(span, "class", "values svelte-byqmbg");
    			add_location(span, file$3, 131, 6, 2358);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, span, anchor);
    			append_dev(span, t0);
    			append_dev(span, code_1);
    			append_dev(code_1, t1);
    			append_dev(code_1, t2);
    			append_dev(code_1, t3);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*values*/ 8) set_data_dev(t2, /*values*/ ctx[3]);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(span);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$3.name,
    		type: "if",
    		source: "(131:6) {#if values}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$3(ctx) {
    	let section;
    	let div2;
    	let div0;
    	let img0;
    	let img0_src_value;
    	let t0;
    	let div1;
    	let img1;
    	let img1_src_value;
    	let t1;
    	let div6;
    	let div3;
    	let t2;
    	let div4;
    	let t3;
    	let div5;
    	let t4;
    	let current;
    	let mounted;
    	let dispose;
    	let if_block0 = /*code*/ ctx[1] && create_if_block_2$2(ctx);
    	let if_block1 = /*css*/ ctx[2] && create_if_block_1$2(ctx);
    	const slider_slot_template = /*$$slots*/ ctx[4].slider;
    	const slider_slot = create_slot(slider_slot_template, ctx, /*$$scope*/ ctx[7], get_slider_slot_context);
    	const slider_slot_or_fallback = slider_slot || fallback_block(ctx);
    	let if_block2 = /*values*/ ctx[3] && create_if_block$3(ctx);

    	const block = {
    		c: function create() {
    			section = element("section");
    			div2 = element("div");
    			div0 = element("div");
    			img0 = element("img");
    			t0 = space();
    			div1 = element("div");
    			img1 = element("img");
    			t1 = space();
    			div6 = element("div");
    			div3 = element("div");
    			if (if_block0) if_block0.c();
    			t2 = space();
    			div4 = element("div");
    			if (if_block1) if_block1.c();
    			t3 = space();
    			div5 = element("div");
    			if (slider_slot_or_fallback) slider_slot_or_fallback.c();
    			t4 = space();
    			if (if_block2) if_block2.c();
    			if (img0.src !== (img0_src_value = "public/images/icons8-svelte-100.png")) attr_dev(img0, "src", img0_src_value);
    			attr_dev(img0, "alt", "icon of the svelte logo, for viewing the input code");
    			attr_dev(img0, "class", "svelte-byqmbg");
    			add_location(img0, file$3, 84, 6, 1425);
    			attr_dev(div0, "class", "tab tab-code svelte-byqmbg");
    			toggle_class(div0, "active", /*active*/ ctx[0] === "code");
    			add_location(div0, file$3, 78, 4, 1289);
    			if (img1.src !== (img1_src_value = "public/images/icons8-css3-100.png")) attr_dev(img1, "src", img1_src_value);
    			attr_dev(img1, "alt", "icon of the css3 logo, for viewing the css code");
    			attr_dev(img1, "class", "svelte-byqmbg");
    			add_location(img1, file$3, 95, 6, 1698);
    			attr_dev(div1, "class", "tab tab-css svelte-byqmbg");
    			toggle_class(div1, "active", /*active*/ ctx[0] === "css");
    			add_location(div1, file$3, 89, 4, 1565);
    			attr_dev(div2, "class", "tabs border svelte-byqmbg");
    			toggle_class(div2, "hide", !/*css*/ ctx[2]);
    			add_location(div2, file$3, 76, 2, 1238);
    			attr_dev(div3, "class", "slot code svelte-byqmbg");
    			toggle_class(div3, "active", /*active*/ ctx[0] === "code");
    			add_location(div3, file$3, 104, 4, 1865);
    			attr_dev(div4, "class", "slot css svelte-byqmbg");
    			toggle_class(div4, "active", /*active*/ ctx[0] === "css");
    			add_location(div4, file$3, 114, 4, 2050);
    			attr_dev(div5, "class", "slot slider svelte-byqmbg");
    			add_location(div5, file$3, 124, 4, 2228);
    			attr_dev(div6, "class", "slots");
    			add_location(div6, file$3, 102, 2, 1840);
    			attr_dev(section, "class", "example svelte-byqmbg");
    			add_location(section, file$3, 74, 0, 1209);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, section, anchor);
    			append_dev(section, div2);
    			append_dev(div2, div0);
    			append_dev(div0, img0);
    			append_dev(div2, t0);
    			append_dev(div2, div1);
    			append_dev(div1, img1);
    			append_dev(section, t1);
    			append_dev(section, div6);
    			append_dev(div6, div3);
    			if (if_block0) if_block0.m(div3, null);
    			append_dev(div6, t2);
    			append_dev(div6, div4);
    			if (if_block1) if_block1.m(div4, null);
    			append_dev(div6, t3);
    			append_dev(div6, div5);

    			if (slider_slot_or_fallback) {
    				slider_slot_or_fallback.m(div5, null);
    			}

    			append_dev(div5, t4);
    			if (if_block2) if_block2.m(div5, null);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(div0, "click", /*click_handler*/ ctx[5], false, false, false),
    					listen_dev(div1, "click", /*click_handler_1*/ ctx[6], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*active*/ 1) {
    				toggle_class(div0, "active", /*active*/ ctx[0] === "code");
    			}

    			if (dirty & /*active*/ 1) {
    				toggle_class(div1, "active", /*active*/ ctx[0] === "css");
    			}

    			if (dirty & /*css*/ 4) {
    				toggle_class(div2, "hide", !/*css*/ ctx[2]);
    			}

    			if (/*code*/ ctx[1]) {
    				if (if_block0) {
    					if_block0.p(ctx, dirty);

    					if (dirty & /*code*/ 2) {
    						transition_in(if_block0, 1);
    					}
    				} else {
    					if_block0 = create_if_block_2$2(ctx);
    					if_block0.c();
    					transition_in(if_block0, 1);
    					if_block0.m(div3, null);
    				}
    			} else if (if_block0) {
    				group_outros();

    				transition_out(if_block0, 1, 1, () => {
    					if_block0 = null;
    				});

    				check_outros();
    			}

    			if (dirty & /*active*/ 1) {
    				toggle_class(div3, "active", /*active*/ ctx[0] === "code");
    			}

    			if (/*css*/ ctx[2]) {
    				if (if_block1) {
    					if_block1.p(ctx, dirty);

    					if (dirty & /*css*/ 4) {
    						transition_in(if_block1, 1);
    					}
    				} else {
    					if_block1 = create_if_block_1$2(ctx);
    					if_block1.c();
    					transition_in(if_block1, 1);
    					if_block1.m(div4, null);
    				}
    			} else if (if_block1) {
    				group_outros();

    				transition_out(if_block1, 1, 1, () => {
    					if_block1 = null;
    				});

    				check_outros();
    			}

    			if (dirty & /*active*/ 1) {
    				toggle_class(div4, "active", /*active*/ ctx[0] === "css");
    			}

    			if (slider_slot) {
    				if (slider_slot.p && dirty & /*$$scope, values*/ 136) {
    					update_slot(slider_slot, slider_slot_template, ctx, /*$$scope*/ ctx[7], dirty, get_slider_slot_changes, get_slider_slot_context);
    				}
    			}

    			if (/*values*/ ctx[3]) {
    				if (if_block2) {
    					if_block2.p(ctx, dirty);
    				} else {
    					if_block2 = create_if_block$3(ctx);
    					if_block2.c();
    					if_block2.m(div5, null);
    				}
    			} else if (if_block2) {
    				if_block2.d(1);
    				if_block2 = null;
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block0);
    			transition_in(if_block1);
    			transition_in(slider_slot_or_fallback, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block0);
    			transition_out(if_block1);
    			transition_out(slider_slot_or_fallback, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(section);
    			if (if_block0) if_block0.d();
    			if (if_block1) if_block1.d();
    			if (slider_slot_or_fallback) slider_slot_or_fallback.d(detaching);
    			if (if_block2) if_block2.d();
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$3.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$3($$self, $$props, $$invalidate) {
    	let { active = "code" } = $$props;
    	let { code = true } = $$props;
    	let { css = false } = $$props;
    	let { values } = $$props;
    	const writable_props = ["active", "code", "css", "values"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Example> was created with unknown prop '${key}'`);
    	});

    	let { $$slots = {}, $$scope } = $$props;
    	validate_slots("Example", $$slots, ['code','css','slider']);

    	const click_handler = () => {
    		$$invalidate(0, active = "code");
    	};

    	const click_handler_1 = () => {
    		$$invalidate(0, active = "css");
    	};

    	$$self.$set = $$props => {
    		if ("active" in $$props) $$invalidate(0, active = $$props.active);
    		if ("code" in $$props) $$invalidate(1, code = $$props.code);
    		if ("css" in $$props) $$invalidate(2, css = $$props.css);
    		if ("values" in $$props) $$invalidate(3, values = $$props.values);
    		if ("$$scope" in $$props) $$invalidate(7, $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		Prism: Prism$1,
    		RangeSlider,
    		active,
    		code,
    		css,
    		values
    	});

    	$$self.$inject_state = $$props => {
    		if ("active" in $$props) $$invalidate(0, active = $$props.active);
    		if ("code" in $$props) $$invalidate(1, code = $$props.code);
    		if ("css" in $$props) $$invalidate(2, css = $$props.css);
    		if ("values" in $$props) $$invalidate(3, values = $$props.values);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [active, code, css, values, $$slots, click_handler, click_handler_1, $$scope];
    }

    class Example extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$3, create_fragment$3, safe_not_equal, { active: 0, code: 1, css: 2, values: 3 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Example",
    			options,
    			id: create_fragment$3.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*values*/ ctx[3] === undefined && !("values" in props)) {
    			console.warn("<Example> was created without expected prop 'values'");
    		}
    	}

    	get active() {
    		throw new Error("<Example>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set active(value) {
    		throw new Error("<Example>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get code() {
    		throw new Error("<Example>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set code(value) {
    		throw new Error("<Example>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get css() {
    		throw new Error("<Example>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set css(value) {
    		throw new Error("<Example>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get values() {
    		throw new Error("<Example>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set values(value) {
    		throw new Error("<Example>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/Components/Options.svx generated by Svelte v3.24.0 */

    const file$4 = "src/Components/Options.svx";

    function create_fragment$4(ctx) {
    	let div;
    	let table;
    	let thead;
    	let tr0;
    	let th0;
    	let t1;
    	let th1;
    	let t3;
    	let th2;
    	let t5;
    	let th3;
    	let t6;
    	let tbody;
    	let tr1;
    	let td0;
    	let strong0;
    	let t8;
    	let td1;
    	let code0;
    	let t10;
    	let td2;
    	let code1;
    	let t12;
    	let td3;
    	let t13;
    	let em;
    	let strong1;
    	let t15;
    	let code2;
    	let t17;
    	let t18;
    	let t19;
    	let tr2;
    	let td4;
    	let strong2;
    	let t21;
    	let td5;
    	let code3;
    	let t23;
    	let td6;
    	let code4;
    	let t25;
    	let td7;
    	let t27;
    	let tr3;
    	let td8;
    	let strong3;
    	let t29;
    	let td9;
    	let code5;
    	let t31;
    	let td10;
    	let code6;
    	let t33;
    	let td11;
    	let t35;
    	let tr4;
    	let td12;
    	let strong4;
    	let t37;
    	let td13;
    	let code7;
    	let t39;
    	let td14;
    	let code8;
    	let t41;
    	let td15;
    	let t42;
    	let code9;
    	let t44;
    	let t45;
    	let tr5;
    	let td16;
    	let strong5;
    	let t47;
    	let td17;
    	let code10;
    	let t49;
    	let code11;
    	let t51;
    	let td18;
    	let code12;
    	let t53;
    	let td19;
    	let t54;
    	let code13;
    	let t56;
    	let code14;
    	let t58;
    	let t59;
    	let tr6;
    	let td20;
    	let strong6;
    	let t61;
    	let td21;
    	let code15;
    	let t63;
    	let td22;
    	let code16;
    	let t65;
    	let td23;
    	let t67;
    	let tr7;
    	let td24;
    	let strong7;
    	let t69;
    	let td25;
    	let code17;
    	let t71;
    	let td26;
    	let code18;
    	let t73;
    	let td27;
    	let t75;
    	let tr8;
    	let td28;
    	let strong8;
    	let t77;
    	let td29;
    	let code19;
    	let t79;
    	let td30;
    	let code20;
    	let t81;
    	let td31;
    	let t83;
    	let tr9;
    	let td32;
    	let strong9;
    	let t85;
    	let td33;
    	let code21;
    	let t87;
    	let td34;
    	let code22;
    	let t89;
    	let code23;
    	let t91;
    	let code24;
    	let t93;
    	let td35;
    	let t94;
    	let code25;
    	let t96;
    	let code26;
    	let t98;
    	let t99;
    	let tr10;
    	let td36;
    	let strong10;
    	let t101;
    	let td37;
    	let code27;
    	let t103;
    	let code28;
    	let t105;
    	let td38;
    	let code29;
    	let t107;
    	let td39;
    	let t108;
    	let code30;
    	let t110;
    	let t111;
    	let tr11;
    	let td40;
    	let strong11;
    	let t113;
    	let td41;
    	let code31;
    	let t115;
    	let code32;
    	let t117;
    	let td42;
    	let code33;
    	let t119;
    	let td43;
    	let t120;
    	let code34;
    	let t122;
    	let t123;
    	let tr12;
    	let td44;
    	let strong12;
    	let t125;
    	let td45;
    	let code35;
    	let t127;
    	let code36;
    	let t129;
    	let td46;
    	let code37;
    	let t131;
    	let td47;
    	let t132;
    	let code38;
    	let t134;
    	let t135;
    	let tr13;
    	let td48;
    	let strong13;
    	let t137;
    	let td49;
    	let code39;
    	let t139;
    	let code40;
    	let t141;
    	let td50;
    	let code41;
    	let t143;
    	let td51;
    	let t144;
    	let code42;
    	let t146;
    	let t147;
    	let tr14;
    	let td52;
    	let strong14;
    	let t149;
    	let td53;
    	let code43;
    	let t151;
    	let td54;
    	let code44;
    	let t153;
    	let td55;
    	let t155;
    	let tr15;
    	let td56;
    	let strong15;
    	let t157;
    	let td57;
    	let code45;
    	let t159;
    	let td58;
    	let code46;
    	let t161;
    	let td59;
    	let t163;
    	let tr16;
    	let td60;
    	let strong16;
    	let t165;
    	let td61;
    	let code47;
    	let t167;
    	let td62;
    	let code48;
    	let t169;
    	let td63;
    	let t171;
    	let tr17;
    	let td64;
    	let strong17;
    	let t173;
    	let td65;
    	let code49;
    	let t175;
    	let td66;
    	let code50;
    	let t177;
    	let td67;
    	let t178;
    	let code51;
    	let t180;
    	let t181;
    	let tr18;
    	let td68;
    	let strong18;
    	let t183;
    	let td69;
    	let code52;
    	let t185;
    	let td70;
    	let code53;
    	let t187;
    	let td71;
    	let t189;
    	let tr19;
    	let td72;
    	let strong19;
    	let t191;
    	let td73;
    	let code54;
    	let t193;
    	let td74;
    	let code55;
    	let t195;
    	let td75;
    	let t197;
    	let tr20;
    	let td76;
    	let strong20;
    	let t199;
    	let td77;
    	let code56;
    	let t201;
    	let td78;
    	let code57;
    	let t203;
    	let td79;
    	let t204;
    	let code58;
    	let t206;

    	const block = {
    		c: function create() {
    			div = element("div");
    			table = element("table");
    			thead = element("thead");
    			tr0 = element("tr");
    			th0 = element("th");
    			th0.textContent = "prop";
    			t1 = space();
    			th1 = element("th");
    			th1.textContent = "type";
    			t3 = space();
    			th2 = element("th");
    			th2.textContent = "default";
    			t5 = space();
    			th3 = element("th");
    			t6 = space();
    			tbody = element("tbody");
    			tr1 = element("tr");
    			td0 = element("td");
    			strong0 = element("strong");
    			strong0.textContent = "values";
    			t8 = space();
    			td1 = element("td");
    			code0 = element("code");
    			code0.textContent = "Array";
    			t10 = space();
    			td2 = element("td");
    			code1 = element("code");
    			code1.textContent = "[50]";
    			t12 = space();
    			td3 = element("td");
    			t13 = text("Array of values to apply on the slider. Multiple values creates multiple handles. (");
    			em = element("em");
    			strong1 = element("strong");
    			strong1.textContent = "note:";
    			t15 = text(" A slider with ");
    			code2 = element("code");
    			code2.textContent = "range";
    			t17 = text(" property set can only have two values max");
    			t18 = text(")");
    			t19 = space();
    			tr2 = element("tr");
    			td4 = element("td");
    			strong2 = element("strong");
    			strong2.textContent = "min";
    			t21 = space();
    			td5 = element("td");
    			code3 = element("code");
    			code3.textContent = "Number";
    			t23 = space();
    			td6 = element("td");
    			code4 = element("code");
    			code4.textContent = "0";
    			t25 = space();
    			td7 = element("td");
    			td7.textContent = "Minimum value for the slider";
    			t27 = space();
    			tr3 = element("tr");
    			td8 = element("td");
    			strong3 = element("strong");
    			strong3.textContent = "max";
    			t29 = space();
    			td9 = element("td");
    			code5 = element("code");
    			code5.textContent = "Number";
    			t31 = space();
    			td10 = element("td");
    			code6 = element("code");
    			code6.textContent = "100";
    			t33 = space();
    			td11 = element("td");
    			td11.textContent = "Maximum value for the slider";
    			t35 = space();
    			tr4 = element("tr");
    			td12 = element("td");
    			strong4 = element("strong");
    			strong4.textContent = "step";
    			t37 = space();
    			td13 = element("td");
    			code7 = element("code");
    			code7.textContent = "Number";
    			t39 = space();
    			td14 = element("td");
    			code8 = element("code");
    			code8.textContent = "1";
    			t41 = space();
    			td15 = element("td");
    			t42 = text("Every ");
    			code9 = element("code");
    			code9.textContent = "nth";
    			t44 = text(" value to allow handle to stop at");
    			t45 = space();
    			tr5 = element("tr");
    			td16 = element("td");
    			strong5 = element("strong");
    			strong5.textContent = "range";
    			t47 = space();
    			td17 = element("td");
    			code10 = element("code");
    			code10.textContent = "Boolean";
    			t49 = text("/");
    			code11 = element("code");
    			code11.textContent = "String";
    			t51 = space();
    			td18 = element("td");
    			code12 = element("code");
    			code12.textContent = "false";
    			t53 = space();
    			td19 = element("td");
    			t54 = text("Whether to style as a range picker. Use ");
    			code13 = element("code");
    			code13.textContent = "range='min'";
    			t56 = text(" or ");
    			code14 = element("code");
    			code14.textContent = "range='max'";
    			t58 = text(" for min/max variants");
    			t59 = space();
    			tr6 = element("tr");
    			td20 = element("td");
    			strong6 = element("strong");
    			strong6.textContent = "float";
    			t61 = space();
    			td21 = element("td");
    			code15 = element("code");
    			code15.textContent = "Boolean";
    			t63 = space();
    			td22 = element("td");
    			code16 = element("code");
    			code16.textContent = "false";
    			t65 = space();
    			td23 = element("td");
    			td23.textContent = "Set true to add a floating label above focussed handles";
    			t67 = space();
    			tr7 = element("tr");
    			td24 = element("td");
    			strong7 = element("strong");
    			strong7.textContent = "vertical";
    			t69 = space();
    			td25 = element("td");
    			code17 = element("code");
    			code17.textContent = "Boolean";
    			t71 = space();
    			td26 = element("td");
    			code18 = element("code");
    			code18.textContent = "false";
    			t73 = space();
    			td27 = element("td");
    			td27.textContent = "Make the slider render vertically";
    			t75 = space();
    			tr8 = element("tr");
    			td28 = element("td");
    			strong8 = element("strong");
    			strong8.textContent = "pips";
    			t77 = space();
    			td29 = element("td");
    			code19 = element("code");
    			code19.textContent = "Boolean";
    			t79 = space();
    			td30 = element("td");
    			code20 = element("code");
    			code20.textContent = "false";
    			t81 = space();
    			td31 = element("td");
    			td31.textContent = "Whether to show pips/notches on the slider";
    			t83 = space();
    			tr9 = element("tr");
    			td32 = element("td");
    			strong9 = element("strong");
    			strong9.textContent = "pipstep";
    			t85 = space();
    			td33 = element("td");
    			code21 = element("code");
    			code21.textContent = "Number";
    			t87 = space();
    			td34 = element("td");
    			code22 = element("code");
    			code22.textContent = "1";
    			t89 = text("/");
    			code23 = element("code");
    			code23.textContent = "10";
    			t91 = text("/");
    			code24 = element("code");
    			code24.textContent = "20";
    			t93 = space();
    			td35 = element("td");
    			t94 = text("Every ");
    			code25 = element("code");
    			code25.textContent = "nth";
    			t96 = text(" step to show a pip for. This has multiple defaults depending on ");
    			code26 = element("code");
    			code26.textContent = "values";
    			t98 = text(" property");
    			t99 = space();
    			tr10 = element("tr");
    			td36 = element("td");
    			strong10 = element("strong");
    			strong10.textContent = "all";
    			t101 = space();
    			td37 = element("td");
    			code27 = element("code");
    			code27.textContent = "Boolean";
    			t103 = text("/");
    			code28 = element("code");
    			code28.textContent = "String";
    			t105 = space();
    			td38 = element("td");
    			code29 = element("code");
    			code29.textContent = "true";
    			t107 = space();
    			td39 = element("td");
    			t108 = text("Whether to show a pip or label for all the slider values. Use ");
    			code30 = element("code");
    			code30.textContent = "all='label'";
    			t110 = text(" to show a labels");
    			t111 = space();
    			tr11 = element("tr");
    			td40 = element("td");
    			strong11 = element("strong");
    			strong11.textContent = "first";
    			t113 = space();
    			td41 = element("td");
    			code31 = element("code");
    			code31.textContent = "Boolean";
    			t115 = text("/");
    			code32 = element("code");
    			code32.textContent = "String";
    			t117 = space();
    			td42 = element("td");
    			code33 = element("code");
    			code33.textContent = "false";
    			t119 = space();
    			td43 = element("td");
    			t120 = text("Whether to show a pip or label for the first value on slider. Use ");
    			code34 = element("code");
    			code34.textContent = "first='label'";
    			t122 = text(" to show a label value");
    			t123 = space();
    			tr12 = element("tr");
    			td44 = element("td");
    			strong12 = element("strong");
    			strong12.textContent = "last";
    			t125 = space();
    			td45 = element("td");
    			code35 = element("code");
    			code35.textContent = "Boolean";
    			t127 = text("/");
    			code36 = element("code");
    			code36.textContent = "String";
    			t129 = space();
    			td46 = element("td");
    			code37 = element("code");
    			code37.textContent = "false";
    			t131 = space();
    			td47 = element("td");
    			t132 = text("Whether to show a pip or label for the last value on slider. Use ");
    			code38 = element("code");
    			code38.textContent = "last='label'";
    			t134 = text(" to show a label value");
    			t135 = space();
    			tr13 = element("tr");
    			td48 = element("td");
    			strong13 = element("strong");
    			strong13.textContent = "rest";
    			t137 = space();
    			td49 = element("td");
    			code39 = element("code");
    			code39.textContent = "Boolean";
    			t139 = text("/");
    			code40 = element("code");
    			code40.textContent = "String";
    			t141 = space();
    			td50 = element("td");
    			code41 = element("code");
    			code41.textContent = "false";
    			t143 = space();
    			td51 = element("td");
    			t144 = text("Whether to show a pip or label for the all other values. Use ");
    			code42 = element("code");
    			code42.textContent = "rest='label'";
    			t146 = text(" to show a label value");
    			t147 = space();
    			tr14 = element("tr");
    			td52 = element("td");
    			strong14 = element("strong");
    			strong14.textContent = "prefix";
    			t149 = space();
    			td53 = element("td");
    			code43 = element("code");
    			code43.textContent = "String";
    			t151 = space();
    			td54 = element("td");
    			code44 = element("code");
    			code44.textContent = "\"\"";
    			t153 = space();
    			td55 = element("td");
    			td55.textContent = "A string to prefix to all displayed values";
    			t155 = space();
    			tr15 = element("tr");
    			td56 = element("td");
    			strong15 = element("strong");
    			strong15.textContent = "suffix";
    			t157 = space();
    			td57 = element("td");
    			code45 = element("code");
    			code45.textContent = "String";
    			t159 = space();
    			td58 = element("td");
    			code46 = element("code");
    			code46.textContent = "\"\"";
    			t161 = space();
    			td59 = element("td");
    			td59.textContent = "A string to suffix to all displayed values";
    			t163 = space();
    			tr16 = element("tr");
    			td60 = element("td");
    			strong16 = element("strong");
    			strong16.textContent = "formatter";
    			t165 = space();
    			td61 = element("td");
    			code47 = element("code");
    			code47.textContent = "Function";
    			t167 = space();
    			td62 = element("td");
    			code48 = element("code");
    			code48.textContent = "(v) => v";
    			t169 = space();
    			td63 = element("td");
    			td63.textContent = "A function to re-format values before they are displayed";
    			t171 = space();
    			tr17 = element("tr");
    			td64 = element("td");
    			strong17 = element("strong");
    			strong17.textContent = "handleFormatter";
    			t173 = space();
    			td65 = element("td");
    			code49 = element("code");
    			code49.textContent = "Function";
    			t175 = space();
    			td66 = element("td");
    			code50 = element("code");
    			code50.textContent = "formatter";
    			t177 = space();
    			td67 = element("td");
    			t178 = text("A function to re-format values on the handle/float before they are displayed. Defaults to the same function given to the ");
    			code51 = element("code");
    			code51.textContent = "formatter";
    			t180 = text(" property");
    			t181 = space();
    			tr18 = element("tr");
    			td68 = element("td");
    			strong18 = element("strong");
    			strong18.textContent = "hover";
    			t183 = space();
    			td69 = element("td");
    			code52 = element("code");
    			code52.textContent = "Boolean";
    			t185 = space();
    			td70 = element("td");
    			code53 = element("code");
    			code53.textContent = "true";
    			t187 = space();
    			td71 = element("td");
    			td71.textContent = "Whether to allow labels to show on hover";
    			t189 = space();
    			tr19 = element("tr");
    			td72 = element("td");
    			strong19 = element("strong");
    			strong19.textContent = "springValues";
    			t191 = space();
    			td73 = element("td");
    			code54 = element("code");
    			code54.textContent = "Object";
    			t193 = space();
    			td74 = element("td");
    			code55 = element("code");
    			code55.textContent = "{ stiffness: 0.15, damping: 0.4 }";
    			t195 = space();
    			td75 = element("td");
    			td75.textContent = "Svelte spring physics object to change the behaviour of the handle when moving";
    			t197 = space();
    			tr20 = element("tr");
    			td76 = element("td");
    			strong20 = element("strong");
    			strong20.textContent = "id";
    			t199 = space();
    			td77 = element("td");
    			code56 = element("code");
    			code56.textContent = "String";
    			t201 = space();
    			td78 = element("td");
    			code57 = element("code");
    			code57.textContent = "undefined";
    			t203 = space();
    			td79 = element("td");
    			t204 = text("Provide an optional ");
    			code58 = element("code");
    			code58.textContent = "id";
    			t206 = text(" attribute to the component for styling/other reasons");
    			attr_dev(th0, "align", "left");
    			add_location(th0, file$4, 4, 0, 49);
    			attr_dev(th1, "align", "left");
    			add_location(th1, file$4, 5, 0, 76);
    			attr_dev(th2, "align", "left");
    			add_location(th2, file$4, 6, 0, 103);
    			add_location(th3, file$4, 7, 0, 133);
    			add_location(tr0, file$4, 3, 0, 44);
    			add_location(thead, file$4, 2, 0, 36);
    			add_location(strong0, file$4, 12, 17, 188);
    			attr_dev(td0, "align", "left");
    			attr_dev(td0, "class", "svelte-rjzvba");
    			add_location(td0, file$4, 12, 0, 171);
    			add_location(code0, file$4, 13, 17, 234);
    			attr_dev(td1, "align", "left");
    			attr_dev(td1, "class", "svelte-rjzvba");
    			add_location(td1, file$4, 13, 0, 217);
    			add_location(code1, file$4, 14, 17, 275);
    			attr_dev(td2, "align", "left");
    			attr_dev(td2, "class", "svelte-rjzvba");
    			add_location(td2, file$4, 14, 0, 258);
    			add_location(strong1, file$4, 15, 91, 389);
    			add_location(code2, file$4, 15, 128, 426);
    			add_location(em, file$4, 15, 87, 385);
    			attr_dev(td3, "class", "svelte-rjzvba");
    			add_location(td3, file$4, 15, 0, 298);
    			add_location(tr1, file$4, 11, 0, 166);
    			add_location(strong2, file$4, 18, 17, 526);
    			attr_dev(td4, "align", "left");
    			attr_dev(td4, "class", "svelte-rjzvba");
    			add_location(td4, file$4, 18, 0, 509);
    			add_location(code3, file$4, 19, 17, 569);
    			attr_dev(td5, "align", "left");
    			attr_dev(td5, "class", "svelte-rjzvba");
    			add_location(td5, file$4, 19, 0, 552);
    			add_location(code4, file$4, 20, 17, 611);
    			attr_dev(td6, "align", "left");
    			attr_dev(td6, "class", "svelte-rjzvba");
    			add_location(td6, file$4, 20, 0, 594);
    			attr_dev(td7, "class", "svelte-rjzvba");
    			add_location(td7, file$4, 21, 0, 631);
    			add_location(tr2, file$4, 17, 0, 504);
    			add_location(strong3, file$4, 24, 17, 697);
    			attr_dev(td8, "align", "left");
    			attr_dev(td8, "class", "svelte-rjzvba");
    			add_location(td8, file$4, 24, 0, 680);
    			add_location(code5, file$4, 25, 17, 740);
    			attr_dev(td9, "align", "left");
    			attr_dev(td9, "class", "svelte-rjzvba");
    			add_location(td9, file$4, 25, 0, 723);
    			add_location(code6, file$4, 26, 17, 782);
    			attr_dev(td10, "align", "left");
    			attr_dev(td10, "class", "svelte-rjzvba");
    			add_location(td10, file$4, 26, 0, 765);
    			attr_dev(td11, "class", "svelte-rjzvba");
    			add_location(td11, file$4, 27, 0, 804);
    			add_location(tr3, file$4, 23, 0, 675);
    			add_location(strong4, file$4, 30, 17, 870);
    			attr_dev(td12, "align", "left");
    			attr_dev(td12, "class", "svelte-rjzvba");
    			add_location(td12, file$4, 30, 0, 853);
    			add_location(code7, file$4, 31, 17, 914);
    			attr_dev(td13, "align", "left");
    			attr_dev(td13, "class", "svelte-rjzvba");
    			add_location(td13, file$4, 31, 0, 897);
    			add_location(code8, file$4, 32, 17, 956);
    			attr_dev(td14, "align", "left");
    			attr_dev(td14, "class", "svelte-rjzvba");
    			add_location(td14, file$4, 32, 0, 939);
    			add_location(code9, file$4, 33, 10, 986);
    			attr_dev(td15, "class", "svelte-rjzvba");
    			add_location(td15, file$4, 33, 0, 976);
    			add_location(tr4, file$4, 29, 0, 848);
    			add_location(strong5, file$4, 36, 17, 1069);
    			attr_dev(td16, "align", "left");
    			attr_dev(td16, "class", "svelte-rjzvba");
    			add_location(td16, file$4, 36, 0, 1052);
    			add_location(code10, file$4, 37, 17, 1114);
    			add_location(code11, file$4, 37, 38, 1135);
    			attr_dev(td17, "align", "left");
    			attr_dev(td17, "class", "svelte-rjzvba");
    			add_location(td17, file$4, 37, 0, 1097);
    			add_location(code12, file$4, 38, 17, 1177);
    			attr_dev(td18, "align", "left");
    			attr_dev(td18, "class", "svelte-rjzvba");
    			add_location(td18, file$4, 38, 0, 1160);
    			add_location(code13, file$4, 39, 44, 1245);
    			add_location(code14, file$4, 39, 72, 1273);
    			attr_dev(td19, "class", "svelte-rjzvba");
    			add_location(td19, file$4, 39, 0, 1201);
    			add_location(tr5, file$4, 35, 0, 1047);
    			add_location(strong6, file$4, 42, 17, 1352);
    			attr_dev(td20, "align", "left");
    			attr_dev(td20, "class", "svelte-rjzvba");
    			add_location(td20, file$4, 42, 0, 1335);
    			add_location(code15, file$4, 43, 17, 1397);
    			attr_dev(td21, "align", "left");
    			attr_dev(td21, "class", "svelte-rjzvba");
    			add_location(td21, file$4, 43, 0, 1380);
    			add_location(code16, file$4, 44, 17, 1440);
    			attr_dev(td22, "align", "left");
    			attr_dev(td22, "class", "svelte-rjzvba");
    			add_location(td22, file$4, 44, 0, 1423);
    			attr_dev(td23, "class", "svelte-rjzvba");
    			add_location(td23, file$4, 45, 0, 1464);
    			add_location(tr6, file$4, 41, 0, 1330);
    			add_location(strong7, file$4, 48, 17, 1557);
    			attr_dev(td24, "align", "left");
    			attr_dev(td24, "class", "svelte-rjzvba");
    			add_location(td24, file$4, 48, 0, 1540);
    			add_location(code17, file$4, 49, 17, 1605);
    			attr_dev(td25, "align", "left");
    			attr_dev(td25, "class", "svelte-rjzvba");
    			add_location(td25, file$4, 49, 0, 1588);
    			add_location(code18, file$4, 50, 17, 1648);
    			attr_dev(td26, "align", "left");
    			attr_dev(td26, "class", "svelte-rjzvba");
    			add_location(td26, file$4, 50, 0, 1631);
    			attr_dev(td27, "class", "svelte-rjzvba");
    			add_location(td27, file$4, 51, 0, 1672);
    			add_location(tr7, file$4, 47, 0, 1535);
    			add_location(strong8, file$4, 54, 17, 1743);
    			attr_dev(td28, "align", "left");
    			attr_dev(td28, "class", "svelte-rjzvba");
    			add_location(td28, file$4, 54, 0, 1726);
    			add_location(code19, file$4, 55, 17, 1787);
    			attr_dev(td29, "align", "left");
    			attr_dev(td29, "class", "svelte-rjzvba");
    			add_location(td29, file$4, 55, 0, 1770);
    			add_location(code20, file$4, 56, 17, 1830);
    			attr_dev(td30, "align", "left");
    			attr_dev(td30, "class", "svelte-rjzvba");
    			add_location(td30, file$4, 56, 0, 1813);
    			attr_dev(td31, "class", "svelte-rjzvba");
    			add_location(td31, file$4, 57, 0, 1854);
    			add_location(tr8, file$4, 53, 0, 1721);
    			add_location(strong9, file$4, 60, 17, 1934);
    			attr_dev(td32, "align", "left");
    			attr_dev(td32, "class", "svelte-rjzvba");
    			add_location(td32, file$4, 60, 0, 1917);
    			add_location(code21, file$4, 61, 17, 1981);
    			attr_dev(td33, "align", "left");
    			attr_dev(td33, "class", "svelte-rjzvba");
    			add_location(td33, file$4, 61, 0, 1964);
    			add_location(code22, file$4, 62, 17, 2023);
    			add_location(code23, file$4, 62, 32, 2038);
    			add_location(code24, file$4, 62, 48, 2054);
    			attr_dev(td34, "align", "left");
    			attr_dev(td34, "class", "svelte-rjzvba");
    			add_location(td34, file$4, 62, 0, 2006);
    			add_location(code25, file$4, 63, 10, 2085);
    			add_location(code26, file$4, 63, 91, 2166);
    			attr_dev(td35, "class", "svelte-rjzvba");
    			add_location(td35, file$4, 63, 0, 2075);
    			add_location(tr9, file$4, 59, 0, 1912);
    			add_location(strong10, file$4, 66, 17, 2228);
    			attr_dev(td36, "align", "left");
    			attr_dev(td36, "class", "svelte-rjzvba");
    			add_location(td36, file$4, 66, 0, 2211);
    			add_location(code27, file$4, 67, 17, 2271);
    			add_location(code28, file$4, 67, 38, 2292);
    			attr_dev(td37, "align", "left");
    			attr_dev(td37, "class", "svelte-rjzvba");
    			add_location(td37, file$4, 67, 0, 2254);
    			add_location(code29, file$4, 68, 17, 2334);
    			attr_dev(td38, "align", "left");
    			attr_dev(td38, "class", "svelte-rjzvba");
    			add_location(td38, file$4, 68, 0, 2317);
    			add_location(code30, file$4, 69, 66, 2423);
    			attr_dev(td39, "class", "svelte-rjzvba");
    			add_location(td39, file$4, 69, 0, 2357);
    			add_location(tr10, file$4, 65, 0, 2206);
    			add_location(strong11, file$4, 72, 17, 2498);
    			attr_dev(td40, "align", "left");
    			attr_dev(td40, "class", "svelte-rjzvba");
    			add_location(td40, file$4, 72, 0, 2481);
    			add_location(code31, file$4, 73, 17, 2543);
    			add_location(code32, file$4, 73, 38, 2564);
    			attr_dev(td41, "align", "left");
    			attr_dev(td41, "class", "svelte-rjzvba");
    			add_location(td41, file$4, 73, 0, 2526);
    			add_location(code33, file$4, 74, 17, 2606);
    			attr_dev(td42, "align", "left");
    			attr_dev(td42, "class", "svelte-rjzvba");
    			add_location(td42, file$4, 74, 0, 2589);
    			add_location(code34, file$4, 75, 70, 2700);
    			attr_dev(td43, "class", "svelte-rjzvba");
    			add_location(td43, file$4, 75, 0, 2630);
    			add_location(tr11, file$4, 71, 0, 2476);
    			add_location(strong12, file$4, 78, 17, 2782);
    			attr_dev(td44, "align", "left");
    			attr_dev(td44, "class", "svelte-rjzvba");
    			add_location(td44, file$4, 78, 0, 2765);
    			add_location(code35, file$4, 79, 17, 2826);
    			add_location(code36, file$4, 79, 38, 2847);
    			attr_dev(td45, "align", "left");
    			attr_dev(td45, "class", "svelte-rjzvba");
    			add_location(td45, file$4, 79, 0, 2809);
    			add_location(code37, file$4, 80, 17, 2889);
    			attr_dev(td46, "align", "left");
    			attr_dev(td46, "class", "svelte-rjzvba");
    			add_location(td46, file$4, 80, 0, 2872);
    			add_location(code38, file$4, 81, 69, 2982);
    			attr_dev(td47, "class", "svelte-rjzvba");
    			add_location(td47, file$4, 81, 0, 2913);
    			add_location(tr12, file$4, 77, 0, 2760);
    			add_location(strong13, file$4, 84, 17, 3063);
    			attr_dev(td48, "align", "left");
    			attr_dev(td48, "class", "svelte-rjzvba");
    			add_location(td48, file$4, 84, 0, 3046);
    			add_location(code39, file$4, 85, 17, 3107);
    			add_location(code40, file$4, 85, 38, 3128);
    			attr_dev(td49, "align", "left");
    			attr_dev(td49, "class", "svelte-rjzvba");
    			add_location(td49, file$4, 85, 0, 3090);
    			add_location(code41, file$4, 86, 17, 3170);
    			attr_dev(td50, "align", "left");
    			attr_dev(td50, "class", "svelte-rjzvba");
    			add_location(td50, file$4, 86, 0, 3153);
    			add_location(code42, file$4, 87, 65, 3259);
    			attr_dev(td51, "class", "svelte-rjzvba");
    			add_location(td51, file$4, 87, 0, 3194);
    			add_location(tr13, file$4, 83, 0, 3041);
    			add_location(strong14, file$4, 90, 17, 3340);
    			attr_dev(td52, "align", "left");
    			attr_dev(td52, "class", "svelte-rjzvba");
    			add_location(td52, file$4, 90, 0, 3323);
    			add_location(code43, file$4, 91, 17, 3386);
    			attr_dev(td53, "align", "left");
    			attr_dev(td53, "class", "svelte-rjzvba");
    			add_location(td53, file$4, 91, 0, 3369);
    			add_location(code44, file$4, 92, 17, 3428);
    			attr_dev(td54, "align", "left");
    			attr_dev(td54, "class", "svelte-rjzvba");
    			add_location(td54, file$4, 92, 0, 3411);
    			attr_dev(td55, "class", "svelte-rjzvba");
    			add_location(td55, file$4, 93, 0, 3449);
    			add_location(tr14, file$4, 89, 0, 3318);
    			add_location(strong15, file$4, 96, 17, 3529);
    			attr_dev(td56, "align", "left");
    			attr_dev(td56, "class", "svelte-rjzvba");
    			add_location(td56, file$4, 96, 0, 3512);
    			add_location(code45, file$4, 97, 17, 3575);
    			attr_dev(td57, "align", "left");
    			attr_dev(td57, "class", "svelte-rjzvba");
    			add_location(td57, file$4, 97, 0, 3558);
    			add_location(code46, file$4, 98, 17, 3617);
    			attr_dev(td58, "align", "left");
    			attr_dev(td58, "class", "svelte-rjzvba");
    			add_location(td58, file$4, 98, 0, 3600);
    			attr_dev(td59, "class", "svelte-rjzvba");
    			add_location(td59, file$4, 99, 0, 3638);
    			add_location(tr15, file$4, 95, 0, 3507);
    			add_location(strong16, file$4, 102, 17, 3718);
    			attr_dev(td60, "align", "left");
    			attr_dev(td60, "class", "svelte-rjzvba");
    			add_location(td60, file$4, 102, 0, 3701);
    			add_location(code47, file$4, 103, 17, 3767);
    			attr_dev(td61, "align", "left");
    			attr_dev(td61, "class", "svelte-rjzvba");
    			add_location(td61, file$4, 103, 0, 3750);
    			add_location(code48, file$4, 104, 17, 3811);
    			attr_dev(td62, "align", "left");
    			attr_dev(td62, "class", "svelte-rjzvba");
    			add_location(td62, file$4, 104, 0, 3794);
    			attr_dev(td63, "class", "svelte-rjzvba");
    			add_location(td63, file$4, 105, 0, 3841);
    			add_location(tr16, file$4, 101, 0, 3696);
    			add_location(strong17, file$4, 108, 17, 3935);
    			attr_dev(td64, "align", "left");
    			attr_dev(td64, "class", "svelte-rjzvba");
    			add_location(td64, file$4, 108, 0, 3918);
    			add_location(code49, file$4, 109, 17, 3990);
    			attr_dev(td65, "align", "left");
    			attr_dev(td65, "class", "svelte-rjzvba");
    			add_location(td65, file$4, 109, 0, 3973);
    			add_location(code50, file$4, 110, 17, 4034);
    			attr_dev(td66, "align", "left");
    			attr_dev(td66, "class", "svelte-rjzvba");
    			add_location(td66, file$4, 110, 0, 4017);
    			add_location(code51, file$4, 111, 125, 4187);
    			attr_dev(td67, "class", "svelte-rjzvba");
    			add_location(td67, file$4, 111, 0, 4062);
    			add_location(tr17, file$4, 107, 0, 3913);
    			add_location(strong18, file$4, 114, 17, 4252);
    			attr_dev(td68, "align", "left");
    			attr_dev(td68, "class", "svelte-rjzvba");
    			add_location(td68, file$4, 114, 0, 4235);
    			add_location(code52, file$4, 115, 17, 4297);
    			attr_dev(td69, "align", "left");
    			attr_dev(td69, "class", "svelte-rjzvba");
    			add_location(td69, file$4, 115, 0, 4280);
    			add_location(code53, file$4, 116, 17, 4340);
    			attr_dev(td70, "align", "left");
    			attr_dev(td70, "class", "svelte-rjzvba");
    			add_location(td70, file$4, 116, 0, 4323);
    			attr_dev(td71, "class", "svelte-rjzvba");
    			add_location(td71, file$4, 117, 0, 4363);
    			add_location(tr18, file$4, 113, 0, 4230);
    			add_location(strong19, file$4, 120, 17, 4441);
    			attr_dev(td72, "align", "left");
    			attr_dev(td72, "class", "svelte-rjzvba");
    			add_location(td72, file$4, 120, 0, 4424);
    			add_location(code54, file$4, 121, 17, 4493);
    			attr_dev(td73, "align", "left");
    			attr_dev(td73, "class", "svelte-rjzvba");
    			add_location(td73, file$4, 121, 0, 4476);
    			add_location(code55, file$4, 122, 17, 4535);
    			attr_dev(td74, "align", "left");
    			attr_dev(td74, "class", "svelte-rjzvba");
    			add_location(td74, file$4, 122, 0, 4518);
    			attr_dev(td75, "class", "svelte-rjzvba");
    			add_location(td75, file$4, 123, 0, 4597);
    			add_location(tr19, file$4, 119, 0, 4419);
    			add_location(strong20, file$4, 126, 17, 4713);
    			attr_dev(td76, "align", "left");
    			attr_dev(td76, "class", "svelte-rjzvba");
    			add_location(td76, file$4, 126, 0, 4696);
    			add_location(code56, file$4, 127, 17, 4755);
    			attr_dev(td77, "align", "left");
    			attr_dev(td77, "class", "svelte-rjzvba");
    			add_location(td77, file$4, 127, 0, 4738);
    			add_location(code57, file$4, 128, 17, 4797);
    			attr_dev(td78, "align", "left");
    			attr_dev(td78, "class", "svelte-rjzvba");
    			add_location(td78, file$4, 128, 0, 4780);
    			add_location(code58, file$4, 129, 24, 4849);
    			attr_dev(td79, "class", "svelte-rjzvba");
    			add_location(td79, file$4, 129, 0, 4825);
    			add_location(tr20, file$4, 125, 0, 4691);
    			attr_dev(tbody, "class", "svelte-rjzvba");
    			add_location(tbody, file$4, 10, 0, 158);
    			add_location(table, file$4, 1, 0, 28);
    			attr_dev(div, "class", "table-wrapper");
    			add_location(div, file$4, 0, 0, 0);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, table);
    			append_dev(table, thead);
    			append_dev(thead, tr0);
    			append_dev(tr0, th0);
    			append_dev(tr0, t1);
    			append_dev(tr0, th1);
    			append_dev(tr0, t3);
    			append_dev(tr0, th2);
    			append_dev(tr0, t5);
    			append_dev(tr0, th3);
    			append_dev(table, t6);
    			append_dev(table, tbody);
    			append_dev(tbody, tr1);
    			append_dev(tr1, td0);
    			append_dev(td0, strong0);
    			append_dev(tr1, t8);
    			append_dev(tr1, td1);
    			append_dev(td1, code0);
    			append_dev(tr1, t10);
    			append_dev(tr1, td2);
    			append_dev(td2, code1);
    			append_dev(tr1, t12);
    			append_dev(tr1, td3);
    			append_dev(td3, t13);
    			append_dev(td3, em);
    			append_dev(em, strong1);
    			append_dev(em, t15);
    			append_dev(em, code2);
    			append_dev(em, t17);
    			append_dev(td3, t18);
    			append_dev(tbody, t19);
    			append_dev(tbody, tr2);
    			append_dev(tr2, td4);
    			append_dev(td4, strong2);
    			append_dev(tr2, t21);
    			append_dev(tr2, td5);
    			append_dev(td5, code3);
    			append_dev(tr2, t23);
    			append_dev(tr2, td6);
    			append_dev(td6, code4);
    			append_dev(tr2, t25);
    			append_dev(tr2, td7);
    			append_dev(tbody, t27);
    			append_dev(tbody, tr3);
    			append_dev(tr3, td8);
    			append_dev(td8, strong3);
    			append_dev(tr3, t29);
    			append_dev(tr3, td9);
    			append_dev(td9, code5);
    			append_dev(tr3, t31);
    			append_dev(tr3, td10);
    			append_dev(td10, code6);
    			append_dev(tr3, t33);
    			append_dev(tr3, td11);
    			append_dev(tbody, t35);
    			append_dev(tbody, tr4);
    			append_dev(tr4, td12);
    			append_dev(td12, strong4);
    			append_dev(tr4, t37);
    			append_dev(tr4, td13);
    			append_dev(td13, code7);
    			append_dev(tr4, t39);
    			append_dev(tr4, td14);
    			append_dev(td14, code8);
    			append_dev(tr4, t41);
    			append_dev(tr4, td15);
    			append_dev(td15, t42);
    			append_dev(td15, code9);
    			append_dev(td15, t44);
    			append_dev(tbody, t45);
    			append_dev(tbody, tr5);
    			append_dev(tr5, td16);
    			append_dev(td16, strong5);
    			append_dev(tr5, t47);
    			append_dev(tr5, td17);
    			append_dev(td17, code10);
    			append_dev(td17, t49);
    			append_dev(td17, code11);
    			append_dev(tr5, t51);
    			append_dev(tr5, td18);
    			append_dev(td18, code12);
    			append_dev(tr5, t53);
    			append_dev(tr5, td19);
    			append_dev(td19, t54);
    			append_dev(td19, code13);
    			append_dev(td19, t56);
    			append_dev(td19, code14);
    			append_dev(td19, t58);
    			append_dev(tbody, t59);
    			append_dev(tbody, tr6);
    			append_dev(tr6, td20);
    			append_dev(td20, strong6);
    			append_dev(tr6, t61);
    			append_dev(tr6, td21);
    			append_dev(td21, code15);
    			append_dev(tr6, t63);
    			append_dev(tr6, td22);
    			append_dev(td22, code16);
    			append_dev(tr6, t65);
    			append_dev(tr6, td23);
    			append_dev(tbody, t67);
    			append_dev(tbody, tr7);
    			append_dev(tr7, td24);
    			append_dev(td24, strong7);
    			append_dev(tr7, t69);
    			append_dev(tr7, td25);
    			append_dev(td25, code17);
    			append_dev(tr7, t71);
    			append_dev(tr7, td26);
    			append_dev(td26, code18);
    			append_dev(tr7, t73);
    			append_dev(tr7, td27);
    			append_dev(tbody, t75);
    			append_dev(tbody, tr8);
    			append_dev(tr8, td28);
    			append_dev(td28, strong8);
    			append_dev(tr8, t77);
    			append_dev(tr8, td29);
    			append_dev(td29, code19);
    			append_dev(tr8, t79);
    			append_dev(tr8, td30);
    			append_dev(td30, code20);
    			append_dev(tr8, t81);
    			append_dev(tr8, td31);
    			append_dev(tbody, t83);
    			append_dev(tbody, tr9);
    			append_dev(tr9, td32);
    			append_dev(td32, strong9);
    			append_dev(tr9, t85);
    			append_dev(tr9, td33);
    			append_dev(td33, code21);
    			append_dev(tr9, t87);
    			append_dev(tr9, td34);
    			append_dev(td34, code22);
    			append_dev(td34, t89);
    			append_dev(td34, code23);
    			append_dev(td34, t91);
    			append_dev(td34, code24);
    			append_dev(tr9, t93);
    			append_dev(tr9, td35);
    			append_dev(td35, t94);
    			append_dev(td35, code25);
    			append_dev(td35, t96);
    			append_dev(td35, code26);
    			append_dev(td35, t98);
    			append_dev(tbody, t99);
    			append_dev(tbody, tr10);
    			append_dev(tr10, td36);
    			append_dev(td36, strong10);
    			append_dev(tr10, t101);
    			append_dev(tr10, td37);
    			append_dev(td37, code27);
    			append_dev(td37, t103);
    			append_dev(td37, code28);
    			append_dev(tr10, t105);
    			append_dev(tr10, td38);
    			append_dev(td38, code29);
    			append_dev(tr10, t107);
    			append_dev(tr10, td39);
    			append_dev(td39, t108);
    			append_dev(td39, code30);
    			append_dev(td39, t110);
    			append_dev(tbody, t111);
    			append_dev(tbody, tr11);
    			append_dev(tr11, td40);
    			append_dev(td40, strong11);
    			append_dev(tr11, t113);
    			append_dev(tr11, td41);
    			append_dev(td41, code31);
    			append_dev(td41, t115);
    			append_dev(td41, code32);
    			append_dev(tr11, t117);
    			append_dev(tr11, td42);
    			append_dev(td42, code33);
    			append_dev(tr11, t119);
    			append_dev(tr11, td43);
    			append_dev(td43, t120);
    			append_dev(td43, code34);
    			append_dev(td43, t122);
    			append_dev(tbody, t123);
    			append_dev(tbody, tr12);
    			append_dev(tr12, td44);
    			append_dev(td44, strong12);
    			append_dev(tr12, t125);
    			append_dev(tr12, td45);
    			append_dev(td45, code35);
    			append_dev(td45, t127);
    			append_dev(td45, code36);
    			append_dev(tr12, t129);
    			append_dev(tr12, td46);
    			append_dev(td46, code37);
    			append_dev(tr12, t131);
    			append_dev(tr12, td47);
    			append_dev(td47, t132);
    			append_dev(td47, code38);
    			append_dev(td47, t134);
    			append_dev(tbody, t135);
    			append_dev(tbody, tr13);
    			append_dev(tr13, td48);
    			append_dev(td48, strong13);
    			append_dev(tr13, t137);
    			append_dev(tr13, td49);
    			append_dev(td49, code39);
    			append_dev(td49, t139);
    			append_dev(td49, code40);
    			append_dev(tr13, t141);
    			append_dev(tr13, td50);
    			append_dev(td50, code41);
    			append_dev(tr13, t143);
    			append_dev(tr13, td51);
    			append_dev(td51, t144);
    			append_dev(td51, code42);
    			append_dev(td51, t146);
    			append_dev(tbody, t147);
    			append_dev(tbody, tr14);
    			append_dev(tr14, td52);
    			append_dev(td52, strong14);
    			append_dev(tr14, t149);
    			append_dev(tr14, td53);
    			append_dev(td53, code43);
    			append_dev(tr14, t151);
    			append_dev(tr14, td54);
    			append_dev(td54, code44);
    			append_dev(tr14, t153);
    			append_dev(tr14, td55);
    			append_dev(tbody, t155);
    			append_dev(tbody, tr15);
    			append_dev(tr15, td56);
    			append_dev(td56, strong15);
    			append_dev(tr15, t157);
    			append_dev(tr15, td57);
    			append_dev(td57, code45);
    			append_dev(tr15, t159);
    			append_dev(tr15, td58);
    			append_dev(td58, code46);
    			append_dev(tr15, t161);
    			append_dev(tr15, td59);
    			append_dev(tbody, t163);
    			append_dev(tbody, tr16);
    			append_dev(tr16, td60);
    			append_dev(td60, strong16);
    			append_dev(tr16, t165);
    			append_dev(tr16, td61);
    			append_dev(td61, code47);
    			append_dev(tr16, t167);
    			append_dev(tr16, td62);
    			append_dev(td62, code48);
    			append_dev(tr16, t169);
    			append_dev(tr16, td63);
    			append_dev(tbody, t171);
    			append_dev(tbody, tr17);
    			append_dev(tr17, td64);
    			append_dev(td64, strong17);
    			append_dev(tr17, t173);
    			append_dev(tr17, td65);
    			append_dev(td65, code49);
    			append_dev(tr17, t175);
    			append_dev(tr17, td66);
    			append_dev(td66, code50);
    			append_dev(tr17, t177);
    			append_dev(tr17, td67);
    			append_dev(td67, t178);
    			append_dev(td67, code51);
    			append_dev(td67, t180);
    			append_dev(tbody, t181);
    			append_dev(tbody, tr18);
    			append_dev(tr18, td68);
    			append_dev(td68, strong18);
    			append_dev(tr18, t183);
    			append_dev(tr18, td69);
    			append_dev(td69, code52);
    			append_dev(tr18, t185);
    			append_dev(tr18, td70);
    			append_dev(td70, code53);
    			append_dev(tr18, t187);
    			append_dev(tr18, td71);
    			append_dev(tbody, t189);
    			append_dev(tbody, tr19);
    			append_dev(tr19, td72);
    			append_dev(td72, strong19);
    			append_dev(tr19, t191);
    			append_dev(tr19, td73);
    			append_dev(td73, code54);
    			append_dev(tr19, t193);
    			append_dev(tr19, td74);
    			append_dev(td74, code55);
    			append_dev(tr19, t195);
    			append_dev(tr19, td75);
    			append_dev(tbody, t197);
    			append_dev(tbody, tr20);
    			append_dev(tr20, td76);
    			append_dev(td76, strong20);
    			append_dev(tr20, t199);
    			append_dev(tr20, td77);
    			append_dev(td77, code56);
    			append_dev(tr20, t201);
    			append_dev(tr20, td78);
    			append_dev(td78, code57);
    			append_dev(tr20, t203);
    			append_dev(tr20, td79);
    			append_dev(td79, t204);
    			append_dev(td79, code58);
    			append_dev(td79, t206);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$4.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$4($$self, $$props) {
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Options> was created with unknown prop '${key}'`);
    	});

    	let { $$slots = {}, $$scope } = $$props;
    	validate_slots("Options", $$slots, []);
    	return [];
    }

    class Options extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$4, create_fragment$4, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Options",
    			options,
    			id: create_fragment$4.name
    		});
    	}
    }

    /* src/Components/Steps.svx generated by Svelte v3.24.0 */
    const file$5 = "src/Components/Steps.svx";

    function create_fragment$5(ctx) {
    	let div;
    	let table;
    	let thead;
    	let tr0;
    	let th0;
    	let code0;
    	let t1;
    	let th1;
    	let code1;
    	let t3;
    	let th2;
    	let t5;
    	let tbody;
    	let tr1;
    	let td0;
    	let code2;
    	let t7;
    	let td1;
    	let code3;
    	let t9;
    	let td2;
    	let rangeslider0;
    	let t10;
    	let tr2;
    	let td3;
    	let code4;
    	let t12;
    	let td4;
    	let code5;
    	let t14;
    	let td5;
    	let rangeslider1;
    	let t15;
    	let tr3;
    	let td6;
    	let code6;
    	let t17;
    	let td7;
    	let code7;
    	let t19;
    	let td8;
    	let rangeslider2;
    	let t20;
    	let tr4;
    	let td9;
    	let code8;
    	let t22;
    	let td10;
    	let code9;
    	let t24;
    	let td11;
    	let rangeslider3;
    	let t25;
    	let tr5;
    	let td12;
    	let code10;
    	let t27;
    	let td13;
    	let code11;
    	let t29;
    	let td14;
    	let rangeslider4;
    	let t30;
    	let tr6;
    	let td15;
    	let code12;
    	let t32;
    	let td16;
    	let code13;
    	let t34;
    	let td17;
    	let rangeslider5;
    	let t35;
    	let tr7;
    	let td18;
    	let code14;
    	let t37;
    	let td19;
    	let code15;
    	let t39;
    	let td20;
    	let rangeslider6;
    	let t40;
    	let tr8;
    	let td21;
    	let code16;
    	let t42;
    	let td22;
    	let code17;
    	let t44;
    	let td23;
    	let rangeslider7;
    	let t45;
    	let tr9;
    	let td24;
    	let code18;
    	let t47;
    	let td25;
    	let code19;
    	let t49;
    	let td26;
    	let rangeslider8;
    	let t50;
    	let tr10;
    	let td27;
    	let code20;
    	let t52;
    	let td28;
    	let code21;
    	let t54;
    	let td29;
    	let rangeslider9;
    	let current;

    	rangeslider0 = new RangeSlider({
    			props: {
    				step: 1,
    				pipstep: 1,
    				max: 20,
    				pips: true,
    				all: true,
    				float: true
    			},
    			$$inline: true
    		});

    	rangeslider1 = new RangeSlider({
    			props: {
    				step: 2.5,
    				pipstep: 1,
    				max: 20,
    				pips: true,
    				all: true,
    				float: true
    			},
    			$$inline: true
    		});

    	rangeslider2 = new RangeSlider({
    			props: {
    				step: 5,
    				pipstep: 1,
    				max: 20,
    				pips: true,
    				all: true,
    				float: true
    			},
    			$$inline: true
    		});

    	rangeslider3 = new RangeSlider({
    			props: {
    				step: 1,
    				pipstep: 2,
    				max: 20,
    				pips: true,
    				all: true,
    				float: true
    			},
    			$$inline: true
    		});

    	rangeslider4 = new RangeSlider({
    			props: {
    				step: 2.5,
    				pipstep: 2,
    				max: 20,
    				pips: true,
    				all: true,
    				float: true
    			},
    			$$inline: true
    		});

    	rangeslider5 = new RangeSlider({
    			props: {
    				step: 3,
    				pipstep: 2,
    				max: 20,
    				pips: true,
    				all: true,
    				float: true
    			},
    			$$inline: true
    		});

    	rangeslider6 = new RangeSlider({
    			props: {
    				step: 5,
    				pipstep: 2,
    				max: 20,
    				pips: true,
    				all: true,
    				float: true
    			},
    			$$inline: true
    		});

    	rangeslider7 = new RangeSlider({
    			props: {
    				step: 0.5,
    				pipstep: 5,
    				max: 20,
    				pips: true,
    				all: true,
    				float: true
    			},
    			$$inline: true
    		});

    	rangeslider8 = new RangeSlider({
    			props: {
    				step: 1,
    				pipstep: 5,
    				max: 20,
    				pips: true,
    				all: true,
    				float: true
    			},
    			$$inline: true
    		});

    	rangeslider9 = new RangeSlider({
    			props: {
    				step: 3,
    				pipstep: 5,
    				max: 20,
    				pips: true,
    				all: true,
    				float: true
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			div = element("div");
    			table = element("table");
    			thead = element("thead");
    			tr0 = element("tr");
    			th0 = element("th");
    			code0 = element("code");
    			code0.textContent = "step={𝑛}";
    			t1 = space();
    			th1 = element("th");
    			code1 = element("code");
    			code1.textContent = "pipstep={𝑛}";
    			t3 = space();
    			th2 = element("th");
    			th2.textContent = "Result";
    			t5 = space();
    			tbody = element("tbody");
    			tr1 = element("tr");
    			td0 = element("td");
    			code2 = element("code");
    			code2.textContent = "1";
    			t7 = space();
    			td1 = element("td");
    			code3 = element("code");
    			code3.textContent = "1";
    			t9 = space();
    			td2 = element("td");
    			create_component(rangeslider0.$$.fragment);
    			t10 = space();
    			tr2 = element("tr");
    			td3 = element("td");
    			code4 = element("code");
    			code4.textContent = "2.5";
    			t12 = space();
    			td4 = element("td");
    			code5 = element("code");
    			code5.textContent = "1";
    			t14 = space();
    			td5 = element("td");
    			create_component(rangeslider1.$$.fragment);
    			t15 = space();
    			tr3 = element("tr");
    			td6 = element("td");
    			code6 = element("code");
    			code6.textContent = "5";
    			t17 = space();
    			td7 = element("td");
    			code7 = element("code");
    			code7.textContent = "1";
    			t19 = space();
    			td8 = element("td");
    			create_component(rangeslider2.$$.fragment);
    			t20 = space();
    			tr4 = element("tr");
    			td9 = element("td");
    			code8 = element("code");
    			code8.textContent = "1";
    			t22 = space();
    			td10 = element("td");
    			code9 = element("code");
    			code9.textContent = "2";
    			t24 = space();
    			td11 = element("td");
    			create_component(rangeslider3.$$.fragment);
    			t25 = space();
    			tr5 = element("tr");
    			td12 = element("td");
    			code10 = element("code");
    			code10.textContent = "2.5";
    			t27 = space();
    			td13 = element("td");
    			code11 = element("code");
    			code11.textContent = "2";
    			t29 = space();
    			td14 = element("td");
    			create_component(rangeslider4.$$.fragment);
    			t30 = space();
    			tr6 = element("tr");
    			td15 = element("td");
    			code12 = element("code");
    			code12.textContent = "3";
    			t32 = space();
    			td16 = element("td");
    			code13 = element("code");
    			code13.textContent = "2";
    			t34 = space();
    			td17 = element("td");
    			create_component(rangeslider5.$$.fragment);
    			t35 = space();
    			tr7 = element("tr");
    			td18 = element("td");
    			code14 = element("code");
    			code14.textContent = "5";
    			t37 = space();
    			td19 = element("td");
    			code15 = element("code");
    			code15.textContent = "2";
    			t39 = space();
    			td20 = element("td");
    			create_component(rangeslider6.$$.fragment);
    			t40 = space();
    			tr8 = element("tr");
    			td21 = element("td");
    			code16 = element("code");
    			code16.textContent = "0.5";
    			t42 = space();
    			td22 = element("td");
    			code17 = element("code");
    			code17.textContent = "5";
    			t44 = space();
    			td23 = element("td");
    			create_component(rangeslider7.$$.fragment);
    			t45 = space();
    			tr9 = element("tr");
    			td24 = element("td");
    			code18 = element("code");
    			code18.textContent = "1";
    			t47 = space();
    			td25 = element("td");
    			code19 = element("code");
    			code19.textContent = "5";
    			t49 = space();
    			td26 = element("td");
    			create_component(rangeslider8.$$.fragment);
    			t50 = space();
    			tr10 = element("tr");
    			td27 = element("td");
    			code20 = element("code");
    			code20.textContent = "3";
    			t52 = space();
    			td28 = element("td");
    			code21 = element("code");
    			code21.textContent = "5";
    			t54 = space();
    			td29 = element("td");
    			create_component(rangeslider9.$$.fragment);
    			add_location(code0, file$5, 9, 17, 143);
    			attr_dev(th0, "align", "left");
    			add_location(th0, file$5, 9, 0, 126);
    			add_location(code1, file$5, 10, 17, 198);
    			attr_dev(th1, "align", "left");
    			add_location(th1, file$5, 10, 0, 181);
    			attr_dev(th2, "align", "left");
    			add_location(th2, file$5, 11, 0, 239);
    			add_location(tr0, file$5, 8, 0, 121);
    			add_location(thead, file$5, 7, 0, 113);
    			add_location(code2, file$5, 16, 17, 313);
    			attr_dev(td0, "align", "left");
    			attr_dev(td0, "class", "svelte-2rohti");
    			add_location(td0, file$5, 16, 0, 296);
    			add_location(code3, file$5, 17, 17, 350);
    			attr_dev(td1, "align", "left");
    			attr_dev(td1, "class", "svelte-2rohti");
    			add_location(td1, file$5, 17, 0, 333);
    			attr_dev(td2, "align", "left");
    			attr_dev(td2, "class", "svelte-2rohti");
    			add_location(td2, file$5, 18, 0, 370);
    			add_location(tr1, file$5, 15, 0, 291);
    			add_location(code4, file$5, 21, 17, 481);
    			attr_dev(td3, "align", "left");
    			attr_dev(td3, "class", "svelte-2rohti");
    			add_location(td3, file$5, 21, 0, 464);
    			add_location(code5, file$5, 22, 17, 520);
    			attr_dev(td4, "align", "left");
    			attr_dev(td4, "class", "svelte-2rohti");
    			add_location(td4, file$5, 22, 0, 503);
    			attr_dev(td5, "align", "left");
    			attr_dev(td5, "class", "svelte-2rohti");
    			add_location(td5, file$5, 23, 0, 540);
    			add_location(tr2, file$5, 20, 0, 459);
    			add_location(code6, file$5, 26, 17, 653);
    			attr_dev(td6, "align", "left");
    			attr_dev(td6, "class", "svelte-2rohti");
    			add_location(td6, file$5, 26, 0, 636);
    			add_location(code7, file$5, 27, 17, 690);
    			attr_dev(td7, "align", "left");
    			attr_dev(td7, "class", "svelte-2rohti");
    			add_location(td7, file$5, 27, 0, 673);
    			attr_dev(td8, "align", "left");
    			attr_dev(td8, "class", "svelte-2rohti");
    			add_location(td8, file$5, 28, 0, 710);
    			add_location(tr3, file$5, 25, 0, 631);
    			add_location(code8, file$5, 31, 17, 821);
    			attr_dev(td9, "align", "left");
    			attr_dev(td9, "class", "svelte-2rohti");
    			add_location(td9, file$5, 31, 0, 804);
    			add_location(code9, file$5, 32, 17, 858);
    			attr_dev(td10, "align", "left");
    			attr_dev(td10, "class", "svelte-2rohti");
    			add_location(td10, file$5, 32, 0, 841);
    			attr_dev(td11, "align", "left");
    			attr_dev(td11, "class", "svelte-2rohti");
    			add_location(td11, file$5, 33, 0, 878);
    			add_location(tr4, file$5, 30, 0, 799);
    			add_location(code10, file$5, 36, 17, 989);
    			attr_dev(td12, "align", "left");
    			attr_dev(td12, "class", "svelte-2rohti");
    			add_location(td12, file$5, 36, 0, 972);
    			add_location(code11, file$5, 37, 17, 1028);
    			attr_dev(td13, "align", "left");
    			attr_dev(td13, "class", "svelte-2rohti");
    			add_location(td13, file$5, 37, 0, 1011);
    			attr_dev(td14, "align", "left");
    			attr_dev(td14, "class", "svelte-2rohti");
    			add_location(td14, file$5, 38, 0, 1048);
    			add_location(tr5, file$5, 35, 0, 967);
    			add_location(code12, file$5, 41, 17, 1161);
    			attr_dev(td15, "align", "left");
    			attr_dev(td15, "class", "svelte-2rohti");
    			add_location(td15, file$5, 41, 0, 1144);
    			add_location(code13, file$5, 42, 17, 1198);
    			attr_dev(td16, "align", "left");
    			attr_dev(td16, "class", "svelte-2rohti");
    			add_location(td16, file$5, 42, 0, 1181);
    			attr_dev(td17, "align", "left");
    			attr_dev(td17, "class", "svelte-2rohti");
    			add_location(td17, file$5, 43, 0, 1218);
    			add_location(tr6, file$5, 40, 0, 1139);
    			add_location(code14, file$5, 46, 17, 1329);
    			attr_dev(td18, "align", "left");
    			attr_dev(td18, "class", "svelte-2rohti");
    			add_location(td18, file$5, 46, 0, 1312);
    			add_location(code15, file$5, 47, 17, 1366);
    			attr_dev(td19, "align", "left");
    			attr_dev(td19, "class", "svelte-2rohti");
    			add_location(td19, file$5, 47, 0, 1349);
    			attr_dev(td20, "align", "left");
    			attr_dev(td20, "class", "svelte-2rohti");
    			add_location(td20, file$5, 48, 0, 1386);
    			add_location(tr7, file$5, 45, 0, 1307);
    			add_location(code16, file$5, 51, 17, 1497);
    			attr_dev(td21, "align", "left");
    			attr_dev(td21, "class", "svelte-2rohti");
    			add_location(td21, file$5, 51, 0, 1480);
    			add_location(code17, file$5, 52, 17, 1536);
    			attr_dev(td22, "align", "left");
    			attr_dev(td22, "class", "svelte-2rohti");
    			add_location(td22, file$5, 52, 0, 1519);
    			attr_dev(td23, "align", "left");
    			attr_dev(td23, "class", "svelte-2rohti");
    			add_location(td23, file$5, 53, 0, 1556);
    			add_location(tr8, file$5, 50, 0, 1475);
    			add_location(code18, file$5, 56, 17, 1669);
    			attr_dev(td24, "align", "left");
    			attr_dev(td24, "class", "svelte-2rohti");
    			add_location(td24, file$5, 56, 0, 1652);
    			add_location(code19, file$5, 57, 17, 1706);
    			attr_dev(td25, "align", "left");
    			attr_dev(td25, "class", "svelte-2rohti");
    			add_location(td25, file$5, 57, 0, 1689);
    			attr_dev(td26, "align", "left");
    			attr_dev(td26, "class", "svelte-2rohti");
    			add_location(td26, file$5, 58, 0, 1726);
    			add_location(tr9, file$5, 55, 0, 1647);
    			add_location(code20, file$5, 61, 17, 1837);
    			attr_dev(td27, "align", "left");
    			attr_dev(td27, "class", "svelte-2rohti");
    			add_location(td27, file$5, 61, 0, 1820);
    			add_location(code21, file$5, 62, 17, 1874);
    			attr_dev(td28, "align", "left");
    			attr_dev(td28, "class", "svelte-2rohti");
    			add_location(td28, file$5, 62, 0, 1857);
    			attr_dev(td29, "align", "left");
    			attr_dev(td29, "class", "svelte-2rohti");
    			add_location(td29, file$5, 63, 0, 1894);
    			add_location(tr10, file$5, 60, 0, 1815);
    			add_location(tbody, file$5, 14, 0, 283);
    			attr_dev(table, "class", "svelte-2rohti");
    			add_location(table, file$5, 6, 0, 105);
    			attr_dev(div, "class", "table-wrapper");
    			add_location(div, file$5, 5, 0, 77);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, table);
    			append_dev(table, thead);
    			append_dev(thead, tr0);
    			append_dev(tr0, th0);
    			append_dev(th0, code0);
    			append_dev(tr0, t1);
    			append_dev(tr0, th1);
    			append_dev(th1, code1);
    			append_dev(tr0, t3);
    			append_dev(tr0, th2);
    			append_dev(table, t5);
    			append_dev(table, tbody);
    			append_dev(tbody, tr1);
    			append_dev(tr1, td0);
    			append_dev(td0, code2);
    			append_dev(tr1, t7);
    			append_dev(tr1, td1);
    			append_dev(td1, code3);
    			append_dev(tr1, t9);
    			append_dev(tr1, td2);
    			mount_component(rangeslider0, td2, null);
    			append_dev(tbody, t10);
    			append_dev(tbody, tr2);
    			append_dev(tr2, td3);
    			append_dev(td3, code4);
    			append_dev(tr2, t12);
    			append_dev(tr2, td4);
    			append_dev(td4, code5);
    			append_dev(tr2, t14);
    			append_dev(tr2, td5);
    			mount_component(rangeslider1, td5, null);
    			append_dev(tbody, t15);
    			append_dev(tbody, tr3);
    			append_dev(tr3, td6);
    			append_dev(td6, code6);
    			append_dev(tr3, t17);
    			append_dev(tr3, td7);
    			append_dev(td7, code7);
    			append_dev(tr3, t19);
    			append_dev(tr3, td8);
    			mount_component(rangeslider2, td8, null);
    			append_dev(tbody, t20);
    			append_dev(tbody, tr4);
    			append_dev(tr4, td9);
    			append_dev(td9, code8);
    			append_dev(tr4, t22);
    			append_dev(tr4, td10);
    			append_dev(td10, code9);
    			append_dev(tr4, t24);
    			append_dev(tr4, td11);
    			mount_component(rangeslider3, td11, null);
    			append_dev(tbody, t25);
    			append_dev(tbody, tr5);
    			append_dev(tr5, td12);
    			append_dev(td12, code10);
    			append_dev(tr5, t27);
    			append_dev(tr5, td13);
    			append_dev(td13, code11);
    			append_dev(tr5, t29);
    			append_dev(tr5, td14);
    			mount_component(rangeslider4, td14, null);
    			append_dev(tbody, t30);
    			append_dev(tbody, tr6);
    			append_dev(tr6, td15);
    			append_dev(td15, code12);
    			append_dev(tr6, t32);
    			append_dev(tr6, td16);
    			append_dev(td16, code13);
    			append_dev(tr6, t34);
    			append_dev(tr6, td17);
    			mount_component(rangeslider5, td17, null);
    			append_dev(tbody, t35);
    			append_dev(tbody, tr7);
    			append_dev(tr7, td18);
    			append_dev(td18, code14);
    			append_dev(tr7, t37);
    			append_dev(tr7, td19);
    			append_dev(td19, code15);
    			append_dev(tr7, t39);
    			append_dev(tr7, td20);
    			mount_component(rangeslider6, td20, null);
    			append_dev(tbody, t40);
    			append_dev(tbody, tr8);
    			append_dev(tr8, td21);
    			append_dev(td21, code16);
    			append_dev(tr8, t42);
    			append_dev(tr8, td22);
    			append_dev(td22, code17);
    			append_dev(tr8, t44);
    			append_dev(tr8, td23);
    			mount_component(rangeslider7, td23, null);
    			append_dev(tbody, t45);
    			append_dev(tbody, tr9);
    			append_dev(tr9, td24);
    			append_dev(td24, code18);
    			append_dev(tr9, t47);
    			append_dev(tr9, td25);
    			append_dev(td25, code19);
    			append_dev(tr9, t49);
    			append_dev(tr9, td26);
    			mount_component(rangeslider8, td26, null);
    			append_dev(tbody, t50);
    			append_dev(tbody, tr10);
    			append_dev(tr10, td27);
    			append_dev(td27, code20);
    			append_dev(tr10, t52);
    			append_dev(tr10, td28);
    			append_dev(td28, code21);
    			append_dev(tr10, t54);
    			append_dev(tr10, td29);
    			mount_component(rangeslider9, td29, null);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(rangeslider0.$$.fragment, local);
    			transition_in(rangeslider1.$$.fragment, local);
    			transition_in(rangeslider2.$$.fragment, local);
    			transition_in(rangeslider3.$$.fragment, local);
    			transition_in(rangeslider4.$$.fragment, local);
    			transition_in(rangeslider5.$$.fragment, local);
    			transition_in(rangeslider6.$$.fragment, local);
    			transition_in(rangeslider7.$$.fragment, local);
    			transition_in(rangeslider8.$$.fragment, local);
    			transition_in(rangeslider9.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(rangeslider0.$$.fragment, local);
    			transition_out(rangeslider1.$$.fragment, local);
    			transition_out(rangeslider2.$$.fragment, local);
    			transition_out(rangeslider3.$$.fragment, local);
    			transition_out(rangeslider4.$$.fragment, local);
    			transition_out(rangeslider5.$$.fragment, local);
    			transition_out(rangeslider6.$$.fragment, local);
    			transition_out(rangeslider7.$$.fragment, local);
    			transition_out(rangeslider8.$$.fragment, local);
    			transition_out(rangeslider9.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_component(rangeslider0);
    			destroy_component(rangeslider1);
    			destroy_component(rangeslider2);
    			destroy_component(rangeslider3);
    			destroy_component(rangeslider4);
    			destroy_component(rangeslider5);
    			destroy_component(rangeslider6);
    			destroy_component(rangeslider7);
    			destroy_component(rangeslider8);
    			destroy_component(rangeslider9);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$5.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$5($$self, $$props, $$invalidate) {
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Steps> was created with unknown prop '${key}'`);
    	});

    	let { $$slots = {}, $$scope } = $$props;
    	validate_slots("Steps", $$slots, []);
    	$$self.$capture_state = () => ({ RangeSlider });
    	return [];
    }

    class Steps extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$5, create_fragment$5, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Steps",
    			options,
    			id: create_fragment$5.name
    		});
    	}
    }

    /* src/Docs.svx generated by Svelte v3.24.0 */
    const file$6 = "src/Docs.svx";

    // (64:0) <Prism language="css">
    function create_default_slot_25(ctx) {
    	let t_value = `/* main slider element */
 .rangeSlider {}
 .rangeSlider.vertical {}   /* if slider is vertical */
 .rangeSlider.focus {}      /* if slider is focussed */
 .rangeSlider.range {}      /* if slider is a range */
 .rangeSlider.min {}        /* if slider is a min-range */
 .rangeSlider.max {}        /* if slider is a max-range */
 .rangeSlider.pips {}       /* if slider has visible pips */
 .rangeSlider.pip-labels {} /* if slider has labels for pips */
 /* slider handles */
 .rangeSlider > .rangeHandle {}               /* positioned wrapper for the handle/float */
 .rangeSlider > .rangeHandle.active {}        /* if a handle is being moved/selected */
 .rangeSlider > .rangeHandle.hoverable {}     /* if the handles allow hover effect */
 .rangeSlider > .rangeHandle > .rangeNub {}   /* the actual nub rendered as a handle */
 .rangeSlider > .rangeHandle > .rangeFloat {} /* the floating value above the handle */
 /* slider range */
 .rangeSlider > .rangeBar {}               /* the range between the two handles */
 /* slider pips */
 .rangeSlider > .rangePips {}                  /* the container element for the pips */
 .rangeSlider > .rangePips.focus {}            /* if slider is focussed */
 .rangeSlider > .rangePips.vertical {}         /* if slider is vertical */
 .rangeSlider > .rangePips > .pip {}           /* an individual pip */
 .rangeSlider > .rangePips > .pip.first {}     /* the first pip on the slider */
 .rangeSlider > .rangePips > .pip.last {}      /* the last pip on the slider */
 .rangeSlider > .rangePips > .pip.selected {}  /* if a pip is selected */
 .rangeSlider > .rangePips > .pip.in-range {}  /* if a pip is somewhere in the range */
 .rangeSlider > .rangePips > .pip > pipVal {}  /* the label for the pip */` + "";

    	let t;

    	const block = {
    		c: function create() {
    			t = text(t_value);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_25.name,
    		type: "slot",
    		source: "(64:0) <Prism language=\\\"css\\\">",
    		ctx
    	});

    	return block;
    }

    // (96:0) <Prism language="css">
    function create_default_slot_24(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("--range-slider:          #d7dada; /* slider main background color */\n --range-handle-inactive: #99a2a2; /* inactive handle color */\n --range-handle:          #838de7; /* non-focussed handle color */\n --range-handle-focus:    #4a40d4; /* focussed handle color */\n --range-range-inactive:  var(--range-handle-inactive); /* inactive range bar background color */\n --range-range:           var(--range-handle-focus); /* active range bar background color */\n --range-float-inactive:  var(--range-handle-inactive); /* inactive floating label background color */\n --range-float:           var(--range-handle-focus); /* floating label background color */\n --range-float-text:      white; /* text color on floating label */");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_24.name,
    		type: "slot",
    		source: "(96:0) <Prism language=\\\"css\\\">",
    		ctx
    	});

    	return block;
    }

    // (111:2) <div slot="code">
    function create_code_slot_23(ctx) {
    	let div;

    	const block = {
    		c: function create() {
    			div = element("div");
    			div.textContent = `${`<RangeSlider />`}`;
    			attr_dev(div, "slot", "code");
    			add_location(div, file$6, 110, 2, 4870);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_code_slot_23.name,
    		type: "slot",
    		source: "(111:2) <div slot=\\\"code\\\">",
    		ctx
    	});

    	return block;
    }

    // (112:2) <div slot="slider">
    function create_slider_slot_23(ctx) {
    	let div;
    	let rangeslider;
    	let current;
    	rangeslider = new RangeSlider({ $$inline: true });

    	const block = {
    		c: function create() {
    			div = element("div");
    			create_component(rangeslider.$$.fragment);
    			attr_dev(div, "slot", "slider");
    			add_location(div, file$6, 111, 2, 4915);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			mount_component(rangeslider, div, null);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(rangeslider.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(rangeslider.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_component(rangeslider);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_slider_slot_23.name,
    		type: "slot",
    		source: "(112:2) <div slot=\\\"slider\\\">",
    		ctx
    	});

    	return block;
    }

    // (110:0) <Example>
    function create_default_slot_23(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = space();
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_23.name,
    		type: "slot",
    		source: "(110:0) <Example>",
    		ctx
    	});

    	return block;
    }

    // (119:2) <div slot="code">
    function create_code_slot_22(ctx) {
    	let div;

    	const block = {
    		c: function create() {
    			div = element("div");
    			div.textContent = `${`<RangeSlider values={[11]} />`}`;
    			attr_dev(div, "slot", "code");
    			add_location(div, file$6, 118, 2, 5343);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_code_slot_22.name,
    		type: "slot",
    		source: "(119:2) <div slot=\\\"code\\\">",
    		ctx
    	});

    	return block;
    }

    // (120:2) <div slot="slider">
    function create_slider_slot_22(ctx) {
    	let div;
    	let rangeslider;
    	let updating_values;
    	let current;

    	function rangeslider_values_binding(value) {
    		/*rangeslider_values_binding*/ ctx[19].call(null, value);
    	}

    	let rangeslider_props = {};

    	if (/*values1*/ ctx[0] !== void 0) {
    		rangeslider_props.values = /*values1*/ ctx[0];
    	}

    	rangeslider = new RangeSlider({ props: rangeslider_props, $$inline: true });
    	binding_callbacks.push(() => bind(rangeslider, "values", rangeslider_values_binding));

    	const block = {
    		c: function create() {
    			div = element("div");
    			create_component(rangeslider.$$.fragment);
    			attr_dev(div, "slot", "slider");
    			add_location(div, file$6, 119, 2, 5402);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			mount_component(rangeslider, div, null);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const rangeslider_changes = {};

    			if (!updating_values && dirty[0] & /*values1*/ 1) {
    				updating_values = true;
    				rangeslider_changes.values = /*values1*/ ctx[0];
    				add_flush_callback(() => updating_values = false);
    			}

    			rangeslider.$set(rangeslider_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(rangeslider.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(rangeslider.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_component(rangeslider);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_slider_slot_22.name,
    		type: "slot",
    		source: "(120:2) <div slot=\\\"slider\\\">",
    		ctx
    	});

    	return block;
    }

    // (118:0) <Example values={values1}>
    function create_default_slot_22(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = space();
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_22.name,
    		type: "slot",
    		source: "(118:0) <Example values={values1}>",
    		ctx
    	});

    	return block;
    }

    // (123:2) <div slot="code">
    function create_code_slot_21(ctx) {
    	let div;

    	const block = {
    		c: function create() {
    			div = element("div");
    			div.textContent = `${`<RangeSlider values={[25,50,75]} />`}`;
    			attr_dev(div, "slot", "code");
    			add_location(div, file$6, 122, 2, 5505);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_code_slot_21.name,
    		type: "slot",
    		source: "(123:2) <div slot=\\\"code\\\">",
    		ctx
    	});

    	return block;
    }

    // (124:2) <div slot="slider">
    function create_slider_slot_21(ctx) {
    	let div;
    	let rangeslider;
    	let updating_values;
    	let current;

    	function rangeslider_values_binding_1(value) {
    		/*rangeslider_values_binding_1*/ ctx[20].call(null, value);
    	}

    	let rangeslider_props = {};

    	if (/*values2*/ ctx[1] !== void 0) {
    		rangeslider_props.values = /*values2*/ ctx[1];
    	}

    	rangeslider = new RangeSlider({ props: rangeslider_props, $$inline: true });
    	binding_callbacks.push(() => bind(rangeslider, "values", rangeslider_values_binding_1));

    	const block = {
    		c: function create() {
    			div = element("div");
    			create_component(rangeslider.$$.fragment);
    			attr_dev(div, "slot", "slider");
    			add_location(div, file$6, 123, 2, 5570);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			mount_component(rangeslider, div, null);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const rangeslider_changes = {};

    			if (!updating_values && dirty[0] & /*values2*/ 2) {
    				updating_values = true;
    				rangeslider_changes.values = /*values2*/ ctx[1];
    				add_flush_callback(() => updating_values = false);
    			}

    			rangeslider.$set(rangeslider_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(rangeslider.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(rangeslider.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_component(rangeslider);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_slider_slot_21.name,
    		type: "slot",
    		source: "(124:2) <div slot=\\\"slider\\\">",
    		ctx
    	});

    	return block;
    }

    // (122:0) <Example values={values2}>
    function create_default_slot_21(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = space();
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_21.name,
    		type: "slot",
    		source: "(122:0) <Example values={values2}>",
    		ctx
    	});

    	return block;
    }

    // (130:2) <div slot="code">
    function create_code_slot_20(ctx) {
    	let div;

    	const block = {
    		c: function create() {
    			div = element("div");
    			div.textContent = `${`<RangeSlider min={-33} max={33} />`}`;
    			attr_dev(div, "slot", "code");
    			add_location(div, file$6, 129, 2, 5877);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_code_slot_20.name,
    		type: "slot",
    		source: "(130:2) <div slot=\\\"code\\\">",
    		ctx
    	});

    	return block;
    }

    // (131:2) <div slot="slider">
    function create_slider_slot_20(ctx) {
    	let div;
    	let rangeslider;
    	let updating_values;
    	let current;

    	function rangeslider_values_binding_2(value) {
    		/*rangeslider_values_binding_2*/ ctx[21].call(null, value);
    	}

    	let rangeslider_props = { min: -33, max: 33 };

    	if (/*minmax1*/ ctx[2] !== void 0) {
    		rangeslider_props.values = /*minmax1*/ ctx[2];
    	}

    	rangeslider = new RangeSlider({ props: rangeslider_props, $$inline: true });
    	binding_callbacks.push(() => bind(rangeslider, "values", rangeslider_values_binding_2));

    	const block = {
    		c: function create() {
    			div = element("div");
    			create_component(rangeslider.$$.fragment);
    			attr_dev(div, "slot", "slider");
    			add_location(div, file$6, 130, 2, 5941);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			mount_component(rangeslider, div, null);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const rangeslider_changes = {};

    			if (!updating_values && dirty[0] & /*minmax1*/ 4) {
    				updating_values = true;
    				rangeslider_changes.values = /*minmax1*/ ctx[2];
    				add_flush_callback(() => updating_values = false);
    			}

    			rangeslider.$set(rangeslider_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(rangeslider.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(rangeslider.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_component(rangeslider);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_slider_slot_20.name,
    		type: "slot",
    		source: "(131:2) <div slot=\\\"slider\\\">",
    		ctx
    	});

    	return block;
    }

    // (129:0) <Example values={minmax1}>
    function create_default_slot_20(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = space();
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_20.name,
    		type: "slot",
    		source: "(129:0) <Example values={minmax1}>",
    		ctx
    	});

    	return block;
    }

    // (136:2) <div slot="code">
    function create_code_slot_19(ctx) {
    	let div;

    	const block = {
    		c: function create() {
    			div = element("div");

    			div.textContent = `${`<script> let bound = [75]; </script>
<RangeSlider min={50} bind:values={bound} />`}`;

    			attr_dev(div, "slot", "code");
    			add_location(div, file$6, 135, 2, 6190);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_code_slot_19.name,
    		type: "slot",
    		source: "(136:2) <div slot=\\\"code\\\">",
    		ctx
    	});

    	return block;
    }

    // (138:2) <div slot="slider">
    function create_slider_slot_19(ctx) {
    	let div;
    	let rangeslider;
    	let updating_values;
    	let current;

    	function rangeslider_values_binding_3(value) {
    		/*rangeslider_values_binding_3*/ ctx[22].call(null, value);
    	}

    	let rangeslider_props = { min: 50 };

    	if (/*minmax2*/ ctx[3] !== void 0) {
    		rangeslider_props.values = /*minmax2*/ ctx[3];
    	}

    	rangeslider = new RangeSlider({ props: rangeslider_props, $$inline: true });
    	binding_callbacks.push(() => bind(rangeslider, "values", rangeslider_values_binding_3));

    	const block = {
    		c: function create() {
    			div = element("div");
    			create_component(rangeslider.$$.fragment);
    			attr_dev(div, "slot", "slider");
    			add_location(div, file$6, 137, 2, 6301);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			mount_component(rangeslider, div, null);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const rangeslider_changes = {};

    			if (!updating_values && dirty[0] & /*minmax2*/ 8) {
    				updating_values = true;
    				rangeslider_changes.values = /*minmax2*/ ctx[3];
    				add_flush_callback(() => updating_values = false);
    			}

    			rangeslider.$set(rangeslider_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(rangeslider.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(rangeslider.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_component(rangeslider);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_slider_slot_19.name,
    		type: "slot",
    		source: "(138:2) <div slot=\\\"slider\\\">",
    		ctx
    	});

    	return block;
    }

    // (135:0) <Example values={minmax2}>
    function create_default_slot_19(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = space();
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_19.name,
    		type: "slot",
    		source: "(135:0) <Example values={minmax2}>",
    		ctx
    	});

    	return block;
    }

    // (143:2) <div slot="code">
    function create_code_slot_18(ctx) {
    	let div;

    	let t_value = `<!-- bound = [${/*minmax2*/ ctx[3]}] -->
 <RangeSlider min={bound[0]} max={200} values={[111]} />` + "";

    	let t;

    	const block = {
    		c: function create() {
    			div = element("div");
    			t = text(t_value);
    			attr_dev(div, "slot", "code");
    			add_location(div, file$6, 142, 2, 6421);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*minmax2*/ 8 && t_value !== (t_value = `<!-- bound = [${/*minmax2*/ ctx[3]}] -->
 <RangeSlider min={bound[0]} max={200} values={[111]} />` + "")) set_data_dev(t, t_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_code_slot_18.name,
    		type: "slot",
    		source: "(143:2) <div slot=\\\"code\\\">",
    		ctx
    	});

    	return block;
    }

    // (145:2) <div slot="slider">
    function create_slider_slot_18(ctx) {
    	let div;
    	let rangeslider;
    	let updating_values;
    	let current;

    	function rangeslider_values_binding_4(value) {
    		/*rangeslider_values_binding_4*/ ctx[23].call(null, value);
    	}

    	let rangeslider_props = { min: /*minmax2*/ ctx[3][0], max: 200 };

    	if (/*minmax3*/ ctx[4] !== void 0) {
    		rangeslider_props.values = /*minmax3*/ ctx[4];
    	}

    	rangeslider = new RangeSlider({ props: rangeslider_props, $$inline: true });
    	binding_callbacks.push(() => bind(rangeslider, "values", rangeslider_values_binding_4));

    	const block = {
    		c: function create() {
    			div = element("div");
    			create_component(rangeslider.$$.fragment);
    			attr_dev(div, "slot", "slider");
    			add_location(div, file$6, 144, 2, 6537);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			mount_component(rangeslider, div, null);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const rangeslider_changes = {};
    			if (dirty[0] & /*minmax2*/ 8) rangeslider_changes.min = /*minmax2*/ ctx[3][0];

    			if (!updating_values && dirty[0] & /*minmax3*/ 16) {
    				updating_values = true;
    				rangeslider_changes.values = /*minmax3*/ ctx[4];
    				add_flush_callback(() => updating_values = false);
    			}

    			rangeslider.$set(rangeslider_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(rangeslider.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(rangeslider.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_component(rangeslider);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_slider_slot_18.name,
    		type: "slot",
    		source: "(145:2) <div slot=\\\"slider\\\">",
    		ctx
    	});

    	return block;
    }

    // (142:0) <Example values={minmax3}>
    function create_default_slot_18(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = space();
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_18.name,
    		type: "slot",
    		source: "(142:0) <Example values={minmax3}>",
    		ctx
    	});

    	return block;
    }

    // (154:2) <div slot="code">
    function create_code_slot_17(ctx) {
    	let div;

    	const block = {
    		c: function create() {
    			div = element("div");
    			div.textContent = `${`<RangeSlider step={5} />`}`;
    			attr_dev(div, "slot", "code");
    			add_location(div, file$6, 153, 2, 7009);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_code_slot_17.name,
    		type: "slot",
    		source: "(154:2) <div slot=\\\"code\\\">",
    		ctx
    	});

    	return block;
    }

    // (155:2) <div slot="slider">
    function create_slider_slot_17(ctx) {
    	let div;
    	let rangeslider;
    	let updating_values;
    	let current;

    	function rangeslider_values_binding_5(value) {
    		/*rangeslider_values_binding_5*/ ctx[24].call(null, value);
    	}

    	let rangeslider_props = { step: 5 };

    	if (/*step1*/ ctx[5] !== void 0) {
    		rangeslider_props.values = /*step1*/ ctx[5];
    	}

    	rangeslider = new RangeSlider({ props: rangeslider_props, $$inline: true });
    	binding_callbacks.push(() => bind(rangeslider, "values", rangeslider_values_binding_5));

    	const block = {
    		c: function create() {
    			div = element("div");
    			create_component(rangeslider.$$.fragment);
    			attr_dev(div, "slot", "slider");
    			add_location(div, file$6, 154, 2, 7063);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			mount_component(rangeslider, div, null);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const rangeslider_changes = {};

    			if (!updating_values && dirty[0] & /*step1*/ 32) {
    				updating_values = true;
    				rangeslider_changes.values = /*step1*/ ctx[5];
    				add_flush_callback(() => updating_values = false);
    			}

    			rangeslider.$set(rangeslider_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(rangeslider.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(rangeslider.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_component(rangeslider);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_slider_slot_17.name,
    		type: "slot",
    		source: "(155:2) <div slot=\\\"slider\\\">",
    		ctx
    	});

    	return block;
    }

    // (153:0) <Example values={step1}>
    function create_default_slot_17(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = space();
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_17.name,
    		type: "slot",
    		source: "(153:0) <Example values={step1}>",
    		ctx
    	});

    	return block;
    }

    // (158:2) <div slot="code">
    function create_code_slot_16(ctx) {
    	let div;

    	const block = {
    		c: function create() {
    			div = element("div");
    			div.textContent = `${`<RangeSlider step={1000} values={[5000]} min={-10000} max={10000} />`}`;
    			attr_dev(div, "slot", "code");
    			add_location(div, file$6, 157, 2, 7171);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_code_slot_16.name,
    		type: "slot",
    		source: "(158:2) <div slot=\\\"code\\\">",
    		ctx
    	});

    	return block;
    }

    // (159:2) <div slot="slider">
    function create_slider_slot_16(ctx) {
    	let div;
    	let rangeslider;
    	let updating_values;
    	let current;

    	function rangeslider_values_binding_6(value) {
    		/*rangeslider_values_binding_6*/ ctx[25].call(null, value);
    	}

    	let rangeslider_props = { step: 1000, min: -10000, max: 10000 };

    	if (/*step3*/ ctx[7] !== void 0) {
    		rangeslider_props.values = /*step3*/ ctx[7];
    	}

    	rangeslider = new RangeSlider({ props: rangeslider_props, $$inline: true });
    	binding_callbacks.push(() => bind(rangeslider, "values", rangeslider_values_binding_6));

    	const block = {
    		c: function create() {
    			div = element("div");
    			create_component(rangeslider.$$.fragment);
    			attr_dev(div, "slot", "slider");
    			add_location(div, file$6, 158, 2, 7269);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			mount_component(rangeslider, div, null);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const rangeslider_changes = {};

    			if (!updating_values && dirty[0] & /*step3*/ 128) {
    				updating_values = true;
    				rangeslider_changes.values = /*step3*/ ctx[7];
    				add_flush_callback(() => updating_values = false);
    			}

    			rangeslider.$set(rangeslider_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(rangeslider.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(rangeslider.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_component(rangeslider);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_slider_slot_16.name,
    		type: "slot",
    		source: "(159:2) <div slot=\\\"slider\\\">",
    		ctx
    	});

    	return block;
    }

    // (157:0) <Example values={step3}>
    function create_default_slot_16(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = space();
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_16.name,
    		type: "slot",
    		source: "(157:0) <Example values={step3}>",
    		ctx
    	});

    	return block;
    }

    // (164:2) <div slot="code">
    function create_code_slot_15(ctx) {
    	let div;

    	const block = {
    		c: function create() {
    			div = element("div");
    			div.textContent = `${`<RangeSlider step={7} values={[-10,10]} min={-20} max={23} />`}`;
    			attr_dev(div, "slot", "code");
    			add_location(div, file$6, 163, 2, 7631);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_code_slot_15.name,
    		type: "slot",
    		source: "(164:2) <div slot=\\\"code\\\">",
    		ctx
    	});

    	return block;
    }

    // (165:2) <div slot="slider">
    function create_slider_slot_15(ctx) {
    	let div;
    	let rangeslider;
    	let updating_values;
    	let current;

    	function rangeslider_values_binding_7(value) {
    		/*rangeslider_values_binding_7*/ ctx[26].call(null, value);
    	}

    	let rangeslider_props = { step: 7, min: -20, max: 23 };

    	if (/*step2*/ ctx[6] !== void 0) {
    		rangeslider_props.values = /*step2*/ ctx[6];
    	}

    	rangeslider = new RangeSlider({ props: rangeslider_props, $$inline: true });
    	binding_callbacks.push(() => bind(rangeslider, "values", rangeslider_values_binding_7));

    	const block = {
    		c: function create() {
    			div = element("div");
    			create_component(rangeslider.$$.fragment);
    			attr_dev(div, "slot", "slider");
    			add_location(div, file$6, 164, 2, 7722);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			mount_component(rangeslider, div, null);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const rangeslider_changes = {};

    			if (!updating_values && dirty[0] & /*step2*/ 64) {
    				updating_values = true;
    				rangeslider_changes.values = /*step2*/ ctx[6];
    				add_flush_callback(() => updating_values = false);
    			}

    			rangeslider.$set(rangeslider_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(rangeslider.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(rangeslider.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_component(rangeslider);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_slider_slot_15.name,
    		type: "slot",
    		source: "(165:2) <div slot=\\\"slider\\\">",
    		ctx
    	});

    	return block;
    }

    // (163:0) <Example values={step2}>
    function create_default_slot_15(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = space();
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_15.name,
    		type: "slot",
    		source: "(163:0) <Example values={step2}>",
    		ctx
    	});

    	return block;
    }

    // (172:2) <div slot="code">
    function create_code_slot_14(ctx) {
    	let div;

    	const block = {
    		c: function create() {
    			div = element("div");
    			div.textContent = `${`<RangeSlider range values={[30,70]} />`}`;
    			attr_dev(div, "slot", "code");
    			add_location(div, file$6, 171, 2, 8201);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_code_slot_14.name,
    		type: "slot",
    		source: "(172:2) <div slot=\\\"code\\\">",
    		ctx
    	});

    	return block;
    }

    // (173:2) <div slot="slider">
    function create_slider_slot_14(ctx) {
    	let div;
    	let rangeslider;
    	let updating_values;
    	let current;

    	function rangeslider_values_binding_8(value) {
    		/*rangeslider_values_binding_8*/ ctx[27].call(null, value);
    	}

    	let rangeslider_props = { range: true };

    	if (/*range1*/ ctx[13] !== void 0) {
    		rangeslider_props.values = /*range1*/ ctx[13];
    	}

    	rangeslider = new RangeSlider({ props: rangeslider_props, $$inline: true });
    	binding_callbacks.push(() => bind(rangeslider, "values", rangeslider_values_binding_8));

    	const block = {
    		c: function create() {
    			div = element("div");
    			create_component(rangeslider.$$.fragment);
    			attr_dev(div, "slot", "slider");
    			add_location(div, file$6, 172, 2, 8269);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			mount_component(rangeslider, div, null);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const rangeslider_changes = {};

    			if (!updating_values && dirty[0] & /*range1*/ 8192) {
    				updating_values = true;
    				rangeslider_changes.values = /*range1*/ ctx[13];
    				add_flush_callback(() => updating_values = false);
    			}

    			rangeslider.$set(rangeslider_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(rangeslider.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(rangeslider.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_component(rangeslider);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_slider_slot_14.name,
    		type: "slot",
    		source: "(173:2) <div slot=\\\"slider\\\">",
    		ctx
    	});

    	return block;
    }

    // (171:0) <Example values={range1}>
    function create_default_slot_14(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = space();
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_14.name,
    		type: "slot",
    		source: "(171:0) <Example values={range1}>",
    		ctx
    	});

    	return block;
    }

    // (178:2) <div slot="code">
    function create_code_slot_13(ctx) {
    	let div;

    	const block = {
    		c: function create() {
    			div = element("div");
    			div.textContent = `${`<RangeSlider range="min" values={[50]} />`}`;
    			attr_dev(div, "slot", "code");
    			add_location(div, file$6, 177, 2, 8592);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_code_slot_13.name,
    		type: "slot",
    		source: "(178:2) <div slot=\\\"code\\\">",
    		ctx
    	});

    	return block;
    }

    // (179:2) <div slot="slider">
    function create_slider_slot_13(ctx) {
    	let div;
    	let rangeslider;
    	let updating_values;
    	let current;

    	function rangeslider_values_binding_9(value) {
    		/*rangeslider_values_binding_9*/ ctx[28].call(null, value);
    	}

    	let rangeslider_props = { range: "min" };

    	if (/*range2*/ ctx[14] !== void 0) {
    		rangeslider_props.values = /*range2*/ ctx[14];
    	}

    	rangeslider = new RangeSlider({ props: rangeslider_props, $$inline: true });
    	binding_callbacks.push(() => bind(rangeslider, "values", rangeslider_values_binding_9));

    	const block = {
    		c: function create() {
    			div = element("div");
    			create_component(rangeslider.$$.fragment);
    			attr_dev(div, "slot", "slider");
    			add_location(div, file$6, 178, 2, 8663);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			mount_component(rangeslider, div, null);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const rangeslider_changes = {};

    			if (!updating_values && dirty[0] & /*range2*/ 16384) {
    				updating_values = true;
    				rangeslider_changes.values = /*range2*/ ctx[14];
    				add_flush_callback(() => updating_values = false);
    			}

    			rangeslider.$set(rangeslider_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(rangeslider.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(rangeslider.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_component(rangeslider);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_slider_slot_13.name,
    		type: "slot",
    		source: "(179:2) <div slot=\\\"slider\\\">",
    		ctx
    	});

    	return block;
    }

    // (177:0) <Example values={range2}>
    function create_default_slot_13(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = space();
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_13.name,
    		type: "slot",
    		source: "(177:0) <Example values={range2}>",
    		ctx
    	});

    	return block;
    }

    // (182:2) <div slot="code">
    function create_code_slot_12(ctx) {
    	let div;

    	const block = {
    		c: function create() {
    			div = element("div");
    			div.textContent = `${`<RangeSlider range="max" values={[50]} />`}`;
    			attr_dev(div, "slot", "code");
    			add_location(div, file$6, 181, 2, 8776);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_code_slot_12.name,
    		type: "slot",
    		source: "(182:2) <div slot=\\\"code\\\">",
    		ctx
    	});

    	return block;
    }

    // (183:2) <div slot="slider">
    function create_slider_slot_12(ctx) {
    	let div;
    	let rangeslider;
    	let updating_values;
    	let current;

    	function rangeslider_values_binding_10(value) {
    		/*rangeslider_values_binding_10*/ ctx[29].call(null, value);
    	}

    	let rangeslider_props = { range: "max" };

    	if (/*range3*/ ctx[15] !== void 0) {
    		rangeslider_props.values = /*range3*/ ctx[15];
    	}

    	rangeslider = new RangeSlider({ props: rangeslider_props, $$inline: true });
    	binding_callbacks.push(() => bind(rangeslider, "values", rangeslider_values_binding_10));

    	const block = {
    		c: function create() {
    			div = element("div");
    			create_component(rangeslider.$$.fragment);
    			attr_dev(div, "slot", "slider");
    			add_location(div, file$6, 182, 2, 8847);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			mount_component(rangeslider, div, null);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const rangeslider_changes = {};

    			if (!updating_values && dirty[0] & /*range3*/ 32768) {
    				updating_values = true;
    				rangeslider_changes.values = /*range3*/ ctx[15];
    				add_flush_callback(() => updating_values = false);
    			}

    			rangeslider.$set(rangeslider_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(rangeslider.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(rangeslider.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_component(rangeslider);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_slider_slot_12.name,
    		type: "slot",
    		source: "(183:2) <div slot=\\\"slider\\\">",
    		ctx
    	});

    	return block;
    }

    // (181:0) <Example values={range3}>
    function create_default_slot_12(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = space();
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_12.name,
    		type: "slot",
    		source: "(181:0) <Example values={range3}>",
    		ctx
    	});

    	return block;
    }

    // (189:2) <div slot="code">
    function create_code_slot_11(ctx) {
    	let div;

    	const block = {
    		c: function create() {
    			div = element("div");
    			div.textContent = `${`<RangeSlider float />`}`;
    			attr_dev(div, "slot", "code");
    			add_location(div, file$6, 188, 2, 9231);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_code_slot_11.name,
    		type: "slot",
    		source: "(189:2) <div slot=\\\"code\\\">",
    		ctx
    	});

    	return block;
    }

    // (190:2) <div slot="slider">
    function create_slider_slot_11(ctx) {
    	let div;
    	let rangeslider;
    	let updating_values;
    	let current;

    	function rangeslider_values_binding_11(value) {
    		/*rangeslider_values_binding_11*/ ctx[30].call(null, value);
    	}

    	let rangeslider_props = { float: true };

    	if (/*float1*/ ctx[8] !== void 0) {
    		rangeslider_props.values = /*float1*/ ctx[8];
    	}

    	rangeslider = new RangeSlider({ props: rangeslider_props, $$inline: true });
    	binding_callbacks.push(() => bind(rangeslider, "values", rangeslider_values_binding_11));

    	const block = {
    		c: function create() {
    			div = element("div");
    			create_component(rangeslider.$$.fragment);
    			attr_dev(div, "slot", "slider");
    			add_location(div, file$6, 189, 2, 9282);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			mount_component(rangeslider, div, null);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const rangeslider_changes = {};

    			if (!updating_values && dirty[0] & /*float1*/ 256) {
    				updating_values = true;
    				rangeslider_changes.values = /*float1*/ ctx[8];
    				add_flush_callback(() => updating_values = false);
    			}

    			rangeslider.$set(rangeslider_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(rangeslider.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(rangeslider.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_component(rangeslider);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_slider_slot_11.name,
    		type: "slot",
    		source: "(190:2) <div slot=\\\"slider\\\">",
    		ctx
    	});

    	return block;
    }

    // (188:0) <Example values={float1}>
    function create_default_slot_11(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = space();
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_11.name,
    		type: "slot",
    		source: "(188:0) <Example values={float1}>",
    		ctx
    	});

    	return block;
    }

    // (193:2) <div slot="code">
    function create_code_slot_10(ctx) {
    	let div;

    	const block = {
    		c: function create() {
    			div = element("div");
    			div.textContent = `${`<RangeSlider float values={[40,60]}/>`}`;
    			attr_dev(div, "slot", "code");
    			add_location(div, file$6, 192, 2, 9389);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_code_slot_10.name,
    		type: "slot",
    		source: "(193:2) <div slot=\\\"code\\\">",
    		ctx
    	});

    	return block;
    }

    // (194:2) <div slot="slider">
    function create_slider_slot_10(ctx) {
    	let div;
    	let rangeslider;
    	let updating_values;
    	let current;

    	function rangeslider_values_binding_12(value) {
    		/*rangeslider_values_binding_12*/ ctx[31].call(null, value);
    	}

    	let rangeslider_props = { float: true };

    	if (/*float2*/ ctx[9] !== void 0) {
    		rangeslider_props.values = /*float2*/ ctx[9];
    	}

    	rangeslider = new RangeSlider({ props: rangeslider_props, $$inline: true });
    	binding_callbacks.push(() => bind(rangeslider, "values", rangeslider_values_binding_12));

    	const block = {
    		c: function create() {
    			div = element("div");
    			create_component(rangeslider.$$.fragment);
    			attr_dev(div, "slot", "slider");
    			add_location(div, file$6, 193, 2, 9456);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			mount_component(rangeslider, div, null);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const rangeslider_changes = {};

    			if (!updating_values && dirty[0] & /*float2*/ 512) {
    				updating_values = true;
    				rangeslider_changes.values = /*float2*/ ctx[9];
    				add_flush_callback(() => updating_values = false);
    			}

    			rangeslider.$set(rangeslider_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(rangeslider.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(rangeslider.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_component(rangeslider);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_slider_slot_10.name,
    		type: "slot",
    		source: "(194:2) <div slot=\\\"slider\\\">",
    		ctx
    	});

    	return block;
    }

    // (192:0) <Example values={float2}>
    function create_default_slot_10(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = space();
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_10.name,
    		type: "slot",
    		source: "(192:0) <Example values={float2}>",
    		ctx
    	});

    	return block;
    }

    // (200:2) <div slot="code">
    function create_code_slot_9(ctx) {
    	let div;

    	const block = {
    		c: function create() {
    			div = element("div");
    			div.textContent = `${`<RangeSlider pips />`}`;
    			attr_dev(div, "slot", "code");
    			add_location(div, file$6, 199, 2, 9811);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_code_slot_9.name,
    		type: "slot",
    		source: "(200:2) <div slot=\\\"code\\\">",
    		ctx
    	});

    	return block;
    }

    // (201:2) <div slot="slider">
    function create_slider_slot_9(ctx) {
    	let div;
    	let rangeslider;
    	let updating_values;
    	let current;

    	function rangeslider_values_binding_13(value) {
    		/*rangeslider_values_binding_13*/ ctx[32].call(null, value);
    	}

    	let rangeslider_props = { pips: true };

    	if (/*pips1*/ ctx[10] !== void 0) {
    		rangeslider_props.values = /*pips1*/ ctx[10];
    	}

    	rangeslider = new RangeSlider({ props: rangeslider_props, $$inline: true });
    	binding_callbacks.push(() => bind(rangeslider, "values", rangeslider_values_binding_13));

    	const block = {
    		c: function create() {
    			div = element("div");
    			create_component(rangeslider.$$.fragment);
    			attr_dev(div, "slot", "slider");
    			add_location(div, file$6, 200, 2, 9861);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			mount_component(rangeslider, div, null);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const rangeslider_changes = {};

    			if (!updating_values && dirty[0] & /*pips1*/ 1024) {
    				updating_values = true;
    				rangeslider_changes.values = /*pips1*/ ctx[10];
    				add_flush_callback(() => updating_values = false);
    			}

    			rangeslider.$set(rangeslider_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(rangeslider.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(rangeslider.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_component(rangeslider);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_slider_slot_9.name,
    		type: "slot",
    		source: "(201:2) <div slot=\\\"slider\\\">",
    		ctx
    	});

    	return block;
    }

    // (199:0) <Example values={pips1}>
    function create_default_slot_9(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = space();
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_9.name,
    		type: "slot",
    		source: "(199:0) <Example values={pips1}>",
    		ctx
    	});

    	return block;
    }

    // (204:2) <div slot="code">
    function create_code_slot_8(ctx) {
    	let div;

    	const block = {
    		c: function create() {
    			div = element("div");
    			div.textContent = `${`<RangeSlider pips max={5} />`}`;
    			attr_dev(div, "slot", "code");
    			add_location(div, file$6, 203, 2, 9965);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_code_slot_8.name,
    		type: "slot",
    		source: "(204:2) <div slot=\\\"code\\\">",
    		ctx
    	});

    	return block;
    }

    // (205:2) <div slot="slider">
    function create_slider_slot_8(ctx) {
    	let div;
    	let rangeslider;
    	let updating_values;
    	let current;

    	function rangeslider_values_binding_14(value) {
    		/*rangeslider_values_binding_14*/ ctx[33].call(null, value);
    	}

    	let rangeslider_props = { pips: true, max: 5 };

    	if (/*pips2*/ ctx[11] !== void 0) {
    		rangeslider_props.values = /*pips2*/ ctx[11];
    	}

    	rangeslider = new RangeSlider({ props: rangeslider_props, $$inline: true });
    	binding_callbacks.push(() => bind(rangeslider, "values", rangeslider_values_binding_14));

    	const block = {
    		c: function create() {
    			div = element("div");
    			create_component(rangeslider.$$.fragment);
    			attr_dev(div, "slot", "slider");
    			add_location(div, file$6, 204, 2, 10023);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			mount_component(rangeslider, div, null);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const rangeslider_changes = {};

    			if (!updating_values && dirty[0] & /*pips2*/ 2048) {
    				updating_values = true;
    				rangeslider_changes.values = /*pips2*/ ctx[11];
    				add_flush_callback(() => updating_values = false);
    			}

    			rangeslider.$set(rangeslider_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(rangeslider.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(rangeslider.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_component(rangeslider);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_slider_slot_8.name,
    		type: "slot",
    		source: "(205:2) <div slot=\\\"slider\\\">",
    		ctx
    	});

    	return block;
    }

    // (203:0) <Example values={pips2}>
    function create_default_slot_8(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = space();
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_8.name,
    		type: "slot",
    		source: "(203:0) <Example values={pips2}>",
    		ctx
    	});

    	return block;
    }

    // (211:2) <div slot="code">
    function create_code_slot_7(ctx) {
    	let div;

    	const block = {
    		c: function create() {
    			div = element("div");
    			div.textContent = `${`<RangeSlider pips all rest={false} />`}`;
    			attr_dev(div, "slot", "code");
    			add_location(div, file$6, 210, 2, 10440);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_code_slot_7.name,
    		type: "slot",
    		source: "(211:2) <div slot=\\\"code\\\">",
    		ctx
    	});

    	return block;
    }

    // (212:2) <div slot="slider">
    function create_slider_slot_7(ctx) {
    	let div;
    	let rangeslider;
    	let current;

    	rangeslider = new RangeSlider({
    			props: { pips: true, all: true, rest: false },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			div = element("div");
    			create_component(rangeslider.$$.fragment);
    			attr_dev(div, "slot", "slider");
    			add_location(div, file$6, 211, 2, 10507);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			mount_component(rangeslider, div, null);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(rangeslider.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(rangeslider.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_component(rangeslider);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_slider_slot_7.name,
    		type: "slot",
    		source: "(212:2) <div slot=\\\"slider\\\">",
    		ctx
    	});

    	return block;
    }

    // (210:0) <Example>
    function create_default_slot_7(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = space();
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_7.name,
    		type: "slot",
    		source: "(210:0) <Example>",
    		ctx
    	});

    	return block;
    }

    // (215:2) <div slot="code">
    function create_code_slot_6(ctx) {
    	let div;

    	const block = {
    		c: function create() {
    			div = element("div");
    			div.textContent = `${`<RangeSlider pips first='label' last='label' />`}`;
    			attr_dev(div, "slot", "code");
    			add_location(div, file$6, 214, 2, 10593);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_code_slot_6.name,
    		type: "slot",
    		source: "(215:2) <div slot=\\\"code\\\">",
    		ctx
    	});

    	return block;
    }

    // (216:2) <div slot="slider">
    function create_slider_slot_6(ctx) {
    	let div;
    	let rangeslider;
    	let current;

    	rangeslider = new RangeSlider({
    			props: {
    				pips: true,
    				first: "label",
    				last: "label"
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			div = element("div");
    			create_component(rangeslider.$$.fragment);
    			attr_dev(div, "slot", "slider");
    			add_location(div, file$6, 215, 2, 10670);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			mount_component(rangeslider, div, null);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(rangeslider.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(rangeslider.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_component(rangeslider);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_slider_slot_6.name,
    		type: "slot",
    		source: "(216:2) <div slot=\\\"slider\\\">",
    		ctx
    	});

    	return block;
    }

    // (214:0) <Example>
    function create_default_slot_6(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = space();
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_6.name,
    		type: "slot",
    		source: "(214:0) <Example>",
    		ctx
    	});

    	return block;
    }

    // (219:2) <div slot="code">
    function create_code_slot_5(ctx) {
    	let div;

    	const block = {
    		c: function create() {
    			div = element("div");
    			div.textContent = `${`<RangeSlider pips first='label' last={false} rest={false} />`}`;
    			attr_dev(div, "slot", "code");
    			add_location(div, file$6, 218, 2, 10766);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_code_slot_5.name,
    		type: "slot",
    		source: "(219:2) <div slot=\\\"code\\\">",
    		ctx
    	});

    	return block;
    }

    // (220:2) <div slot="slider">
    function create_slider_slot_5(ctx) {
    	let div;
    	let rangeslider;
    	let current;

    	rangeslider = new RangeSlider({
    			props: {
    				pips: true,
    				first: "label",
    				last: false,
    				rest: false
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			div = element("div");
    			create_component(rangeslider.$$.fragment);
    			attr_dev(div, "slot", "slider");
    			add_location(div, file$6, 219, 2, 10856);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			mount_component(rangeslider, div, null);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(rangeslider.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(rangeslider.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_component(rangeslider);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_slider_slot_5.name,
    		type: "slot",
    		source: "(220:2) <div slot=\\\"slider\\\">",
    		ctx
    	});

    	return block;
    }

    // (218:0) <Example>
    function create_default_slot_5(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = space();
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_5.name,
    		type: "slot",
    		source: "(218:0) <Example>",
    		ctx
    	});

    	return block;
    }

    // (223:2) <div slot="code">
    function create_code_slot_4(ctx) {
    	let div;

    	const block = {
    		c: function create() {
    			div = element("div");
    			div.textContent = `${`<RangeSlider pips all='label' />`}`;
    			attr_dev(div, "slot", "code");
    			add_location(div, file$6, 222, 2, 10965);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_code_slot_4.name,
    		type: "slot",
    		source: "(223:2) <div slot=\\\"code\\\">",
    		ctx
    	});

    	return block;
    }

    // (224:2) <div slot="slider">
    function create_slider_slot_4(ctx) {
    	let div;
    	let rangeslider;
    	let current;

    	rangeslider = new RangeSlider({
    			props: { pips: true, all: "label" },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			div = element("div");
    			create_component(rangeslider.$$.fragment);
    			attr_dev(div, "slot", "slider");
    			add_location(div, file$6, 223, 2, 11027);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			mount_component(rangeslider, div, null);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(rangeslider.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(rangeslider.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_component(rangeslider);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_slider_slot_4.name,
    		type: "slot",
    		source: "(224:2) <div slot=\\\"slider\\\">",
    		ctx
    	});

    	return block;
    }

    // (222:0) <Example>
    function create_default_slot_4(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = space();
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_4.name,
    		type: "slot",
    		source: "(222:0) <Example>",
    		ctx
    	});

    	return block;
    }

    // (233:2) <div slot="code">
    function create_code_slot_3(ctx) {
    	let div;

    	const block = {
    		c: function create() {
    			div = element("div");

    			div.textContent = `${`<!-- using default pipstep -->
 <RangeSlider pips />`}`;

    			attr_dev(div, "slot", "code");
    			add_location(div, file$6, 232, 2, 11616);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_code_slot_3.name,
    		type: "slot",
    		source: "(233:2) <div slot=\\\"code\\\">",
    		ctx
    	});

    	return block;
    }

    // (235:2) <div slot="slider">
    function create_slider_slot_3(ctx) {
    	let div;
    	let rangeslider;
    	let updating_values;
    	let current;

    	function rangeslider_values_binding_15(value) {
    		/*rangeslider_values_binding_15*/ ctx[34].call(null, value);
    	}

    	let rangeslider_props = {
    		pips: true,
    		first: "label",
    		last: "label",
    		rest: "label"
    	};

    	if (/*pipstep1*/ ctx[16] !== void 0) {
    		rangeslider_props.values = /*pipstep1*/ ctx[16];
    	}

    	rangeslider = new RangeSlider({ props: rangeslider_props, $$inline: true });
    	binding_callbacks.push(() => bind(rangeslider, "values", rangeslider_values_binding_15));

    	const block = {
    		c: function create() {
    			div = element("div");
    			create_component(rangeslider.$$.fragment);
    			attr_dev(div, "slot", "slider");
    			add_location(div, file$6, 234, 2, 11698);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			mount_component(rangeslider, div, null);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const rangeslider_changes = {};

    			if (!updating_values && dirty[0] & /*pipstep1*/ 65536) {
    				updating_values = true;
    				rangeslider_changes.values = /*pipstep1*/ ctx[16];
    				add_flush_callback(() => updating_values = false);
    			}

    			rangeslider.$set(rangeslider_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(rangeslider.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(rangeslider.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_component(rangeslider);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_slider_slot_3.name,
    		type: "slot",
    		source: "(235:2) <div slot=\\\"slider\\\">",
    		ctx
    	});

    	return block;
    }

    // (232:0) <Example values={pipstep1}>
    function create_default_slot_3(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = space();
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_3.name,
    		type: "slot",
    		source: "(232:0) <Example values={pipstep1}>",
    		ctx
    	});

    	return block;
    }

    // (238:2) <div slot="code">
    function create_code_slot_2(ctx) {
    	let div;

    	const block = {
    		c: function create() {
    			div = element("div");
    			div.textContent = `${`<RangeSlider pips pipstep={20} />`}`;
    			attr_dev(div, "slot", "code");
    			add_location(div, file$6, 237, 2, 11848);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_code_slot_2.name,
    		type: "slot",
    		source: "(238:2) <div slot=\\\"code\\\">",
    		ctx
    	});

    	return block;
    }

    // (239:2) <div slot="slider">
    function create_slider_slot_2(ctx) {
    	let div;
    	let rangeslider;
    	let updating_values;
    	let current;

    	function rangeslider_values_binding_16(value) {
    		/*rangeslider_values_binding_16*/ ctx[35].call(null, value);
    	}

    	let rangeslider_props = {
    		pips: true,
    		pipstep: 20,
    		first: "label",
    		last: "label",
    		rest: "label"
    	};

    	if (/*pipstep2*/ ctx[17] !== void 0) {
    		rangeslider_props.values = /*pipstep2*/ ctx[17];
    	}

    	rangeslider = new RangeSlider({ props: rangeslider_props, $$inline: true });
    	binding_callbacks.push(() => bind(rangeslider, "values", rangeslider_values_binding_16));

    	const block = {
    		c: function create() {
    			div = element("div");
    			create_component(rangeslider.$$.fragment);
    			attr_dev(div, "slot", "slider");
    			add_location(div, file$6, 238, 2, 11911);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			mount_component(rangeslider, div, null);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const rangeslider_changes = {};

    			if (!updating_values && dirty[0] & /*pipstep2*/ 131072) {
    				updating_values = true;
    				rangeslider_changes.values = /*pipstep2*/ ctx[17];
    				add_flush_callback(() => updating_values = false);
    			}

    			rangeslider.$set(rangeslider_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(rangeslider.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(rangeslider.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_component(rangeslider);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_slider_slot_2.name,
    		type: "slot",
    		source: "(239:2) <div slot=\\\"slider\\\">",
    		ctx
    	});

    	return block;
    }

    // (237:0) <Example values={pipstep2}>
    function create_default_slot_2(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = space();
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_2.name,
    		type: "slot",
    		source: "(237:0) <Example values={pipstep2}>",
    		ctx
    	});

    	return block;
    }

    // (242:2) <div slot="code">
    function create_code_slot_1(ctx) {
    	let div;

    	const block = {
    		c: function create() {
    			div = element("div");
    			div.textContent = `${`<RangeSlider pips step={2.5} pipstep={10} />`}`;
    			attr_dev(div, "slot", "code");
    			add_location(div, file$6, 241, 2, 12074);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_code_slot_1.name,
    		type: "slot",
    		source: "(242:2) <div slot=\\\"code\\\">",
    		ctx
    	});

    	return block;
    }

    // (243:2) <div slot="slider">
    function create_slider_slot_1(ctx) {
    	let div;
    	let rangeslider;
    	let updating_values;
    	let current;

    	function rangeslider_values_binding_17(value) {
    		/*rangeslider_values_binding_17*/ ctx[36].call(null, value);
    	}

    	let rangeslider_props = {
    		pips: true,
    		step: 2.5,
    		pipstep: 10,
    		first: "label",
    		last: "label",
    		rest: "label"
    	};

    	if (/*pipstep3*/ ctx[18] !== void 0) {
    		rangeslider_props.values = /*pipstep3*/ ctx[18];
    	}

    	rangeslider = new RangeSlider({ props: rangeslider_props, $$inline: true });
    	binding_callbacks.push(() => bind(rangeslider, "values", rangeslider_values_binding_17));

    	const block = {
    		c: function create() {
    			div = element("div");
    			create_component(rangeslider.$$.fragment);
    			attr_dev(div, "slot", "slider");
    			add_location(div, file$6, 242, 2, 12148);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			mount_component(rangeslider, div, null);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const rangeslider_changes = {};

    			if (!updating_values && dirty[0] & /*pipstep3*/ 262144) {
    				updating_values = true;
    				rangeslider_changes.values = /*pipstep3*/ ctx[18];
    				add_flush_callback(() => updating_values = false);
    			}

    			rangeslider.$set(rangeslider_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(rangeslider.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(rangeslider.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_component(rangeslider);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_slider_slot_1.name,
    		type: "slot",
    		source: "(243:2) <div slot=\\\"slider\\\">",
    		ctx
    	});

    	return block;
    }

    // (241:0) <Example values={pipstep3}>
    function create_default_slot_1$1(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = space();
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_1$1.name,
    		type: "slot",
    		source: "(241:0) <Example values={pipstep3}>",
    		ctx
    	});

    	return block;
    }

    // (253:2) <div slot="code">
    function create_code_slot(ctx) {
    	let div;

    	const block = {
    		c: function create() {
    			div = element("div");
    			div.textContent = `${`<RangeSlider pips id="reverse-pips" max={50} />`}`;
    			attr_dev(div, "slot", "code");
    			add_location(div, file$6, 252, 2, 12857);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_code_slot.name,
    		type: "slot",
    		source: "(253:2) <div slot=\\\"code\\\">",
    		ctx
    	});

    	return block;
    }

    // (254:2) <div slot="css">
    function create_css_slot(ctx) {
    	let div;

    	const block = {
    		c: function create() {
    			div = element("div");

    			div.textContent = `${`#reverse-pips .rangePips {
   bottom: auto;
   top: -1em;
 }
 #reverse-pips .pip {
   background: rgb(198, 187, 224);
   top: auto;
   bottom: 0.25em;
   width: 2px;
   transform: translateX(-1px);
   transition-duration: 0.5s;
   opacity: 0.7;
 }
 #reverse-pips .pip:nth-child(5n+1) {
   height: 0.8em;
   opacity: 0.9;
 }
 #reverse-pips .pip:nth-child(5n),
 #reverse-pips .pip:nth-child(5n+2) {
   height: 0.65em;
 }
 #reverse-pips .pip.selected {
   background: rgb(255, 0, 157);
   transition-duration: 0.05s;
   opacity: 1;
 }`}`;

    			attr_dev(div, "slot", "css");
    			add_location(div, file$6, 253, 2, 12934);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_css_slot.name,
    		type: "slot",
    		source: "(254:2) <div slot=\\\"css\\\">",
    		ctx
    	});

    	return block;
    }

    // (280:2) <div slot="slider">
    function create_slider_slot(ctx) {
    	let div;
    	let rangeslider;
    	let updating_values;
    	let current;

    	function rangeslider_values_binding_18(value) {
    		/*rangeslider_values_binding_18*/ ctx[37].call(null, value);
    	}

    	let rangeslider_props = { pips: true, id: "reverse-pips", max: 50 };

    	if (/*pips3*/ ctx[12] !== void 0) {
    		rangeslider_props.values = /*pips3*/ ctx[12];
    	}

    	rangeslider = new RangeSlider({ props: rangeslider_props, $$inline: true });
    	binding_callbacks.push(() => bind(rangeslider, "values", rangeslider_values_binding_18));

    	const block = {
    		c: function create() {
    			div = element("div");
    			create_component(rangeslider.$$.fragment);
    			attr_dev(div, "slot", "slider");
    			add_location(div, file$6, 279, 2, 13494);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			mount_component(rangeslider, div, null);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const rangeslider_changes = {};

    			if (!updating_values && dirty[0] & /*pips3*/ 4096) {
    				updating_values = true;
    				rangeslider_changes.values = /*pips3*/ ctx[12];
    				add_flush_callback(() => updating_values = false);
    			}

    			rangeslider.$set(rangeslider_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(rangeslider.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(rangeslider.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_component(rangeslider);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_slider_slot.name,
    		type: "slot",
    		source: "(280:2) <div slot=\\\"slider\\\">",
    		ctx
    	});

    	return block;
    }

    // (252:0) <Example values={pips3} css active="css">
    function create_default_slot$1(ctx) {
    	let t0;
    	let t1;

    	const block = {
    		c: function create() {
    			t0 = space();
    			t1 = space();
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t0, anchor);
    			insert_dev(target, t1, anchor);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(t1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$1.name,
    		type: "slot",
    		source: "(252:0) <Example values={pips3} css active=\\\"css\\\">",
    		ctx
    	});

    	return block;
    }

    function create_fragment$6(ctx) {
    	let h1;
    	let a0;
    	let t1;
    	let p0;
    	let t2;
    	let strong0;
    	let t4;
    	let t5;
    	let rangeslider;
    	let t6;
    	let h20;
    	let a1;
    	let t8;
    	let h30;
    	let a2;
    	let t10;
    	let p1;
    	let t11;
    	let code0;
    	let t13;
    	let t14;
    	let options;
    	let t15;
    	let h31;
    	let a3;
    	let t17;
    	let p2;
    	let t18;
    	let code1;
    	let t20;
    	let t21;
    	let prism0;
    	let t22;
    	let p3;
    	let t24;
    	let prism1;
    	let t25;
    	let h21;
    	let a4;
    	let t27;
    	let h32;
    	let a5;
    	let t29;
    	let p4;
    	let t31;
    	let example0;
    	let t32;
    	let h33;
    	let a6;
    	let t34;
    	let p5;
    	let t35;
    	let code2;
    	let t37;
    	let code3;
    	let t39;
    	let code4;
    	let t41;
    	let code5;
    	let t43;
    	let code6;
    	let t45;
    	let code7;
    	let t47;
    	let example1;
    	let t48;
    	let example2;
    	let t49;
    	let h34;
    	let a7;
    	let t51;
    	let p6;
    	let t52;
    	let code8;
    	let t54;
    	let code9;
    	let t56;
    	let t57;
    	let example3;
    	let t58;
    	let p7;
    	let t59;
    	let code10;
    	let t61;
    	let code11;
    	let t63;
    	let t64;
    	let example4;
    	let t65;
    	let example5;
    	let t66;
    	let h35;
    	let a8;
    	let t68;
    	let p8;
    	let t69;
    	let code12;
    	let t71;
    	let code13;
    	let t73;
    	let code14;
    	let t75;
    	let code15;
    	let t77;
    	let code16;
    	let t79;
    	let t80;
    	let example6;
    	let t81;
    	let example7;
    	let t82;
    	let p9;
    	let t83;
    	let code17;
    	let t85;
    	let code18;
    	let t87;
    	let code19;
    	let t89;
    	let t90;
    	let example8;
    	let t91;
    	let h36;
    	let a9;
    	let t93;
    	let p10;
    	let t94;
    	let code20;
    	let t96;
    	let code21;
    	let t98;
    	let strong1;
    	let t100;
    	let t101;
    	let example9;
    	let t102;
    	let p11;
    	let t103;
    	let code22;
    	let t105;
    	let code23;
    	let t107;
    	let code24;
    	let t109;
    	let code25;
    	let t111;
    	let t112;
    	let example10;
    	let t113;
    	let example11;
    	let t114;
    	let h37;
    	let a10;
    	let t116;
    	let p12;
    	let t117;
    	let code26;
    	let t119;
    	let em;
    	let t121;
    	let example12;
    	let t122;
    	let example13;
    	let t123;
    	let h38;
    	let a11;
    	let t125;
    	let p13;
    	let t126;
    	let code27;
    	let t128;
    	let t129;
    	let example14;
    	let t130;
    	let example15;
    	let t131;
    	let h39;
    	let a12;
    	let t133;
    	let p14;
    	let t134;
    	let code28;
    	let t136;
    	let code29;
    	let t138;
    	let code30;
    	let t140;
    	let code31;
    	let t142;
    	let code32;
    	let t144;
    	let code33;
    	let t146;
    	let t147;
    	let example16;
    	let t148;
    	let example17;
    	let t149;
    	let example18;
    	let t150;
    	let example19;
    	let t151;
    	let h310;
    	let a13;
    	let t153;
    	let p15;
    	let t154;
    	let code34;
    	let t156;
    	let code35;
    	let t158;
    	let t159;
    	let p16;
    	let t160;
    	let code36;
    	let t162;
    	let code37;
    	let t164;
    	let code38;
    	let t166;
    	let code39;
    	let t168;
    	let code40;
    	let t170;
    	let code41;
    	let t172;
    	let example20;
    	let t173;
    	let example21;
    	let t174;
    	let example22;
    	let t175;
    	let p17;
    	let t176;
    	let code42;
    	let t178;
    	let t179;
    	let h40;
    	let a14;
    	let t181;
    	let p18;
    	let t182;
    	let a15;
    	let t183;
    	let code43;
    	let t185;
    	let t186;
    	let example23;
    	let t187;
    	let h41;
    	let a16;
    	let t188;
    	let code44;
    	let t190;
    	let code45;
    	let t192;
    	let t193;
    	let steps;
    	let t194;
    	let hr;
    	let t195;
    	let div;
    	let p19;
    	let img;
    	let img_src_value;
    	let br;
    	let t196;
    	let t197;
    	let small;
    	let a17;
    	let t199;
    	let a18;
    	let t201;
    	let a19;
    	let current;

    	rangeslider = new RangeSlider({
    			props: {
    				id: "intro",
    				float: true,
    				pips: true,
    				first: "label",
    				last: "label"
    			},
    			$$inline: true
    		});

    	options = new Options({ $$inline: true });

    	prism0 = new Prism$1({
    			props: {
    				language: "css",
    				$$slots: { default: [create_default_slot_25] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	prism1 = new Prism$1({
    			props: {
    				language: "css",
    				$$slots: { default: [create_default_slot_24] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	example0 = new Example({
    			props: {
    				$$slots: {
    					default: [create_default_slot_23],
    					slider: [create_slider_slot_23],
    					code: [create_code_slot_23]
    				},
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	example1 = new Example({
    			props: {
    				values: /*values1*/ ctx[0],
    				$$slots: {
    					default: [create_default_slot_22],
    					slider: [create_slider_slot_22],
    					code: [create_code_slot_22]
    				},
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	example2 = new Example({
    			props: {
    				values: /*values2*/ ctx[1],
    				$$slots: {
    					default: [create_default_slot_21],
    					slider: [create_slider_slot_21],
    					code: [create_code_slot_21]
    				},
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	example3 = new Example({
    			props: {
    				values: /*minmax1*/ ctx[2],
    				$$slots: {
    					default: [create_default_slot_20],
    					slider: [create_slider_slot_20],
    					code: [create_code_slot_20]
    				},
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	example4 = new Example({
    			props: {
    				values: /*minmax2*/ ctx[3],
    				$$slots: {
    					default: [create_default_slot_19],
    					slider: [create_slider_slot_19],
    					code: [create_code_slot_19]
    				},
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	example5 = new Example({
    			props: {
    				values: /*minmax3*/ ctx[4],
    				$$slots: {
    					default: [create_default_slot_18],
    					slider: [create_slider_slot_18],
    					code: [create_code_slot_18]
    				},
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	example6 = new Example({
    			props: {
    				values: /*step1*/ ctx[5],
    				$$slots: {
    					default: [create_default_slot_17],
    					slider: [create_slider_slot_17],
    					code: [create_code_slot_17]
    				},
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	example7 = new Example({
    			props: {
    				values: /*step3*/ ctx[7],
    				$$slots: {
    					default: [create_default_slot_16],
    					slider: [create_slider_slot_16],
    					code: [create_code_slot_16]
    				},
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	example8 = new Example({
    			props: {
    				values: /*step2*/ ctx[6],
    				$$slots: {
    					default: [create_default_slot_15],
    					slider: [create_slider_slot_15],
    					code: [create_code_slot_15]
    				},
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	example9 = new Example({
    			props: {
    				values: /*range1*/ ctx[13],
    				$$slots: {
    					default: [create_default_slot_14],
    					slider: [create_slider_slot_14],
    					code: [create_code_slot_14]
    				},
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	example10 = new Example({
    			props: {
    				values: /*range2*/ ctx[14],
    				$$slots: {
    					default: [create_default_slot_13],
    					slider: [create_slider_slot_13],
    					code: [create_code_slot_13]
    				},
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	example11 = new Example({
    			props: {
    				values: /*range3*/ ctx[15],
    				$$slots: {
    					default: [create_default_slot_12],
    					slider: [create_slider_slot_12],
    					code: [create_code_slot_12]
    				},
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	example12 = new Example({
    			props: {
    				values: /*float1*/ ctx[8],
    				$$slots: {
    					default: [create_default_slot_11],
    					slider: [create_slider_slot_11],
    					code: [create_code_slot_11]
    				},
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	example13 = new Example({
    			props: {
    				values: /*float2*/ ctx[9],
    				$$slots: {
    					default: [create_default_slot_10],
    					slider: [create_slider_slot_10],
    					code: [create_code_slot_10]
    				},
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	example14 = new Example({
    			props: {
    				values: /*pips1*/ ctx[10],
    				$$slots: {
    					default: [create_default_slot_9],
    					slider: [create_slider_slot_9],
    					code: [create_code_slot_9]
    				},
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	example15 = new Example({
    			props: {
    				values: /*pips2*/ ctx[11],
    				$$slots: {
    					default: [create_default_slot_8],
    					slider: [create_slider_slot_8],
    					code: [create_code_slot_8]
    				},
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	example16 = new Example({
    			props: {
    				$$slots: {
    					default: [create_default_slot_7],
    					slider: [create_slider_slot_7],
    					code: [create_code_slot_7]
    				},
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	example17 = new Example({
    			props: {
    				$$slots: {
    					default: [create_default_slot_6],
    					slider: [create_slider_slot_6],
    					code: [create_code_slot_6]
    				},
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	example18 = new Example({
    			props: {
    				$$slots: {
    					default: [create_default_slot_5],
    					slider: [create_slider_slot_5],
    					code: [create_code_slot_5]
    				},
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	example19 = new Example({
    			props: {
    				$$slots: {
    					default: [create_default_slot_4],
    					slider: [create_slider_slot_4],
    					code: [create_code_slot_4]
    				},
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	example20 = new Example({
    			props: {
    				values: /*pipstep1*/ ctx[16],
    				$$slots: {
    					default: [create_default_slot_3],
    					slider: [create_slider_slot_3],
    					code: [create_code_slot_3]
    				},
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	example21 = new Example({
    			props: {
    				values: /*pipstep2*/ ctx[17],
    				$$slots: {
    					default: [create_default_slot_2],
    					slider: [create_slider_slot_2],
    					code: [create_code_slot_2]
    				},
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	example22 = new Example({
    			props: {
    				values: /*pipstep3*/ ctx[18],
    				$$slots: {
    					default: [create_default_slot_1$1],
    					slider: [create_slider_slot_1],
    					code: [create_code_slot_1]
    				},
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	example23 = new Example({
    			props: {
    				values: /*pips3*/ ctx[12],
    				css: true,
    				active: "css",
    				$$slots: {
    					default: [create_default_slot$1],
    					slider: [create_slider_slot],
    					css: [create_css_slot],
    					code: [create_code_slot]
    				},
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	steps = new Steps({ $$inline: true });

    	const block = {
    		c: function create() {
    			h1 = element("h1");
    			a0 = element("a");
    			a0.textContent = "Svelte Range Slider & Pips";
    			t1 = space();
    			p0 = element("p");
    			t2 = text("A reactive, accessible, ");
    			strong0 = element("strong");
    			strong0.textContent = "multi-thumb, range slider component for use in a svelte application";
    			t4 = text("; with the ability to display “pips” or “notches” along the range.");
    			t5 = space();
    			create_component(rangeslider.$$.fragment);
    			t6 = space();
    			h20 = element("h2");
    			a1 = element("a");
    			a1.textContent = "Customisation";
    			t8 = space();
    			h30 = element("h3");
    			a2 = element("a");
    			a2.textContent = "Options";
    			t10 = space();
    			p1 = element("p");
    			t11 = text("Here’s a list of all the props (options) that can be passed to the ");
    			code0 = element("code");
    			code0.textContent = "<RangeSlider />";
    			t13 = text(" component\nfor changing the behaviour/style of it.");
    			t14 = space();
    			create_component(options.$$.fragment);
    			t15 = space();
    			h31 = element("h3");
    			a3 = element("a");
    			a3.textContent = "Styling";
    			t17 = space();
    			p2 = element("p");
    			t18 = text("The component can be further styled after the props have been defined by overriding the default\ncss styling. The best way to do this is to use the ");
    			code1 = element("code");
    			code1.textContent = "id=\"\"";
    			t20 = text(" prop and then scope your global css\nwith this id.");
    			t21 = space();
    			create_component(prism0.$$.fragment);
    			t22 = space();
    			p3 = element("p");
    			p3.textContent = "There’s also a bunch of CSS Variables for color-themeing if only color changes\nare desired; These won’t affect IE, though, so if you’re looking for IE support it’s\nbetter to completely override the CSS above.";
    			t24 = space();
    			create_component(prism1.$$.fragment);
    			t25 = space();
    			h21 = element("h2");
    			a4 = element("a");
    			a4.textContent = "Usage";
    			t27 = space();
    			h32 = element("h3");
    			a5 = element("a");
    			a5.textContent = "Basic Usage";
    			t29 = space();
    			p4 = element("p");
    			p4.textContent = "This is how the slider would appear if no props/arguments are passed along with the component.";
    			t31 = space();
    			create_component(example0.$$.fragment);
    			t32 = space();
    			h33 = element("h3");
    			a6 = element("a");
    			a6.textContent = "Values";
    			t34 = space();
    			p5 = element("p");
    			t35 = text("Setting the defualt value(s) is done with ");
    			code2 = element("code");
    			code2.textContent = "values";
    			t37 = text(" which accepts an ");
    			code3 = element("code");
    			code3.textContent = "Array";
    			t39 = text(". It will accept any\nnumber of values from ");
    			code4 = element("code");
    			code4.textContent = "1";
    			t41 = text(". The values should be within the given ");
    			code5 = element("code");
    			code5.textContent = "min";
    			t43 = text(" and ");
    			code6 = element("code");
    			code6.textContent = "max";
    			t45 = text(" range. It can\nalso be bound with ");
    			code7 = element("code");
    			code7.textContent = "bind:values";
    			t47 = space();
    			create_component(example1.$$.fragment);
    			t48 = space();
    			create_component(example2.$$.fragment);
    			t49 = space();
    			h34 = element("h3");
    			a7 = element("a");
    			a7.textContent = "Min & Max";
    			t51 = space();
    			p6 = element("p");
    			t52 = text("The slider accepts props for ");
    			code8 = element("code");
    			code8.textContent = "min";
    			t54 = text(" and ");
    			code9 = element("code");
    			code9.textContent = "max";
    			t56 = text(" to set the range of the minimum and\nmaximum possible value respectively.");
    			t57 = space();
    			create_component(example3.$$.fragment);
    			t58 = space();
    			p7 = element("p");
    			t59 = text("The slider below has it’s ");
    			code10 = element("code");
    			code10.textContent = "values";
    			t61 = text(" property bound with the ");
    			code11 = element("code");
    			code11.textContent = "min";
    			t63 = text(" value for the\nslider below that.");
    			t64 = space();
    			create_component(example4.$$.fragment);
    			t65 = space();
    			create_component(example5.$$.fragment);
    			t66 = space();
    			h35 = element("h3");
    			a8 = element("a");
    			a8.textContent = "Steps";
    			t68 = space();
    			p8 = element("p");
    			t69 = text("Although the slider values are clamped between the ");
    			code12 = element("code");
    			code12.textContent = "min";
    			t71 = text(" and ");
    			code13 = element("code");
    			code13.textContent = "max";
    			t73 = text(" properties, there may be\ntimes when we’d like to limit the selectable ");
    			code14 = element("code");
    			code14.textContent = "values";
    			t75 = text(". This can be done with ");
    			code15 = element("code");
    			code15.textContent = "step";
    			t77 = text(" which is\na modulus of the possible ");
    			code16 = element("code");
    			code16.textContent = "values";
    			t79 = text(" range.");
    			t80 = space();
    			create_component(example6.$$.fragment);
    			t81 = space();
    			create_component(example7.$$.fragment);
    			t82 = space();
    			p9 = element("p");
    			t83 = text("As seen below; handles will always align to the ");
    			code17 = element("code");
    			code17.textContent = "step";
    			t85 = text(" value, even if set incorrectly at\ninitialisation. And the handles will always start at the ");
    			code18 = element("code");
    			code18.textContent = "min";
    			t87 = text(" value and end on the ");
    			code19 = element("code");
    			code19.textContent = "max";
    			t89 = text(" value.");
    			t90 = space();
    			create_component(example8.$$.fragment);
    			t91 = space();
    			h36 = element("h3");
    			a9 = element("a");
    			a9.textContent = "Ranges";
    			t93 = space();
    			p10 = element("p");
    			t94 = text("A stand-out feature which makes this component somewhat better than the standard\n");
    			code20 = element("code");
    			code20.textContent = "<input type=\"range\">";
    			t96 = text(" is the ");
    			code21 = element("code");
    			code21.textContent = "range";
    			t98 = text(" property which allows ");
    			strong1 = element("strong");
    			strong1.textContent = "two values";
    			t100 = text(" to display a selected\nrange between them and also prevent the values from going past each other.");
    			t101 = space();
    			create_component(example9.$$.fragment);
    			t102 = space();
    			p11 = element("p");
    			t103 = text("The property ");
    			code22 = element("code");
    			code22.textContent = "range";
    			t105 = text(" can also be ");
    			code23 = element("code");
    			code23.textContent = "\"min\"";
    			t107 = text(" or ");
    			code24 = element("code");
    			code24.textContent = "\"max\"";
    			t109 = text(" instead of a ");
    			code25 = element("code");
    			code25.textContent = "boolean";
    			t111 = text(", which will create\nthe visual appearance of a slider range which is growing or shrinking.");
    			t112 = space();
    			create_component(example10.$$.fragment);
    			t113 = space();
    			create_component(example11.$$.fragment);
    			t114 = space();
    			h37 = element("h3");
    			a10 = element("a");
    			a10.textContent = "With floating label";
    			t116 = space();
    			p12 = element("p");
    			t117 = text("By passing the ");
    			code26 = element("code");
    			code26.textContent = "float";
    			t119 = text(" prop to the component, we can have a nice label which floats above\nthe handle and shows the current value. ");
    			em = element("em");
    			em.textContent = "(hover/select to see it)";
    			t121 = space();
    			create_component(example12.$$.fragment);
    			t122 = space();
    			create_component(example13.$$.fragment);
    			t123 = space();
    			h38 = element("h3");
    			a11 = element("a");
    			a11.textContent = "With Pips";
    			t125 = space();
    			p13 = element("p");
    			t126 = text("And here, to demonstrate another stand-out feature are some notches, or as I call\nthem ");
    			code27 = element("code");
    			code27.textContent = "pips";
    			t128 = text(" which sit below the slider by default to mark regular intervals in the range.");
    			t129 = space();
    			create_component(example14.$$.fragment);
    			t130 = space();
    			create_component(example15.$$.fragment);
    			t131 = space();
    			h39 = element("h3");
    			a12 = element("a");
    			a12.textContent = "Pip Labels";
    			t133 = space();
    			p14 = element("p");
    			t134 = text("There are props for ");
    			code28 = element("code");
    			code28.textContent = "all";
    			t136 = text(", ");
    			code29 = element("code");
    			code29.textContent = "first";
    			t138 = text(", ");
    			code30 = element("code");
    			code30.textContent = "last";
    			t140 = text(" and ");
    			code31 = element("code");
    			code31.textContent = "rest";
    			t142 = text(" which determine how to display the pips\nalong the range. These props can be a ");
    			code32 = element("code");
    			code32.textContent = "Boolean";
    			t144 = text(" or ");
    			code33 = element("code");
    			code33.textContent = "\"label\"";
    			t146 = text(" to show a label with the pip.");
    			t147 = space();
    			create_component(example16.$$.fragment);
    			t148 = space();
    			create_component(example17.$$.fragment);
    			t149 = space();
    			create_component(example18.$$.fragment);
    			t150 = space();
    			create_component(example19.$$.fragment);
    			t151 = space();
    			h310 = element("h3");
    			a13 = element("a");
    			a13.textContent = "Pip Steps";
    			t153 = space();
    			p15 = element("p");
    			t154 = text("It is not always desirable to show every single value as a ");
    			code34 = element("code");
    			code34.textContent = "pip";
    			t156 = text(" on the range, and so\nthis option works much in the same way as ");
    			code35 = element("code");
    			code35.textContent = "step";
    			t158 = text(" but only affects the rendering of the\npips.");
    			t159 = space();
    			p16 = element("p");
    			t160 = text("By default, the ");
    			code36 = element("code");
    			code36.textContent = "pipstep";
    			t162 = text(" is set to 1/20 of the range of values (");
    			code37 = element("code");
    			code37.textContent = "max - min";
    			t164 = text("), so for a slider\nwith ");
    			code38 = element("code");
    			code38.textContent = "min=0";
    			t166 = text(" and ");
    			code39 = element("code");
    			code39.textContent = "max=100";
    			t168 = text(" the ");
    			code40 = element("code");
    			code40.textContent = "pipstep";
    			t170 = text(" would be ");
    			code41 = element("code");
    			code41.textContent = "5";
    			t172 = space();
    			create_component(example20.$$.fragment);
    			t173 = space();
    			create_component(example21.$$.fragment);
    			t174 = space();
    			create_component(example22.$$.fragment);
    			t175 = space();
    			p17 = element("p");
    			t176 = text("It’d be quite bad for performance to display too many pips as they each represent\nan individual DOM node. Also there are only so many pixels on a screen. So use the\n");
    			code42 = element("code");
    			code42.textContent = "pipstep";
    			t178 = text(" feature to aesthetically limit the amount of pips rendered to screen.");
    			t179 = space();
    			h40 = element("h4");
    			a14 = element("a");
    			a14.textContent = "Styling example for pips";
    			t181 = space();
    			p18 = element("p");
    			t182 = text("Additional control can be had over the display of pips ");
    			a15 = element("a");
    			t183 = text("by using css’ ");
    			code43 = element("code");
    			code43.textContent = "nth-child()";
    			t185 = text(" property.");
    			t186 = space();
    			create_component(example23.$$.fragment);
    			t187 = space();
    			h41 = element("h4");
    			a16 = element("a");
    			t188 = text("Example table of ");
    			code44 = element("code");
    			code44.textContent = "step";
    			t190 = text(" and ");
    			code45 = element("code");
    			code45.textContent = "pipstep";
    			t192 = text(" interaction");
    			t193 = space();
    			create_component(steps.$$.fragment);
    			t194 = space();
    			hr = element("hr");
    			t195 = space();
    			div = element("div");
    			p19 = element("p");
    			img = element("img");
    			br = element("br");
    			t196 = text("\nMore coming soon");
    			t197 = space();
    			small = element("small");
    			a17 = element("a");
    			a17.textContent = "Search";
    			t199 = text(", ");
    			a18 = element("a");
    			a18.textContent = "Code";
    			t201 = text(" and other icons by ");
    			a19 = element("a");
    			a19.textContent = "Icons8";
    			attr_dev(a0, "href", "#svelte-range-slider--pips");
    			add_location(a0, file$6, 51, 35, 1006);
    			attr_dev(h1, "id", "svelte-range-slider--pips");
    			add_location(h1, file$6, 51, 0, 971);
    			add_location(strong0, file$6, 52, 27, 1106);
    			add_location(p0, file$6, 52, 0, 1079);
    			attr_dev(a1, "href", "#customisation");
    			add_location(a1, file$6, 54, 23, 1349);
    			attr_dev(h20, "id", "customisation");
    			add_location(h20, file$6, 54, 0, 1326);
    			attr_dev(a2, "href", "#options");
    			add_location(a2, file$6, 55, 17, 1414);
    			attr_dev(h30, "id", "options");
    			add_location(h30, file$6, 55, 0, 1397);
    			add_location(code0, file$6, 56, 70, 1520);
    			add_location(p1, file$6, 56, 0, 1450);
    			attr_dev(a3, "href", "#styling");
    			add_location(a3, file$6, 59, 17, 1638);
    			attr_dev(h31, "id", "styling");
    			add_location(h31, file$6, 59, 0, 1621);
    			add_location(code1, file$6, 61, 51, 1824);
    			add_location(p2, file$6, 60, 0, 1674);
    			add_location(p3, file$6, 92, 0, 3679);
    			attr_dev(a4, "href", "#usage");
    			add_location(a4, file$6, 106, 15, 4659);
    			attr_dev(h21, "id", "usage");
    			add_location(h21, file$6, 106, 0, 4644);
    			attr_dev(a5, "href", "#basic-usage");
    			add_location(a5, file$6, 107, 21, 4712);
    			attr_dev(h32, "id", "basic-usage");
    			add_location(h32, file$6, 107, 0, 4691);
    			add_location(p4, file$6, 108, 0, 4756);
    			attr_dev(a6, "href", "#values");
    			add_location(a6, file$6, 113, 16, 4983);
    			attr_dev(h33, "id", "values");
    			add_location(h33, file$6, 113, 0, 4967);
    			add_location(code2, file$6, 114, 45, 5062);
    			add_location(code3, file$6, 114, 82, 5099);
    			add_location(code4, file$6, 115, 22, 5160);
    			add_location(code5, file$6, 115, 76, 5214);
    			add_location(code6, file$6, 115, 97, 5235);
    			add_location(code7, file$6, 116, 19, 5285);
    			add_location(p5, file$6, 114, 0, 5017);
    			attr_dev(a7, "href", "#min--max");
    			add_location(a7, file$6, 125, 18, 5662);
    			attr_dev(h34, "id", "min--max");
    			add_location(h34, file$6, 125, 0, 5644);
    			add_location(code8, file$6, 126, 32, 5733);
    			add_location(code9, file$6, 126, 53, 5754);
    			add_location(p6, file$6, 126, 0, 5701);
    			add_location(code10, file$6, 132, 29, 6063);
    			add_location(code11, file$6, 132, 73, 6107);
    			add_location(p7, file$6, 132, 0, 6034);
    			attr_dev(a8, "href", "#steps");
    			add_location(a8, file$6, 148, 15, 6661);
    			attr_dev(h35, "id", "steps");
    			add_location(h35, file$6, 148, 0, 6646);
    			add_location(code12, file$6, 149, 54, 6747);
    			add_location(code13, file$6, 149, 75, 6768);
    			add_location(code14, file$6, 150, 45, 6855);
    			add_location(code15, file$6, 150, 88, 6898);
    			add_location(code16, file$6, 151, 26, 6951);
    			add_location(p8, file$6, 149, 0, 6693);
    			add_location(code17, file$6, 160, 51, 7429);
    			add_location(code18, file$6, 161, 57, 7538);
    			add_location(code19, file$6, 161, 95, 7576);
    			add_location(p9, file$6, 160, 0, 7378);
    			attr_dev(a9, "href", "#ranges");
    			add_location(a9, file$6, 166, 16, 7838);
    			attr_dev(h36, "id", "ranges");
    			add_location(h36, file$6, 166, 0, 7822);
    			add_location(code20, file$6, 168, 0, 7956);
    			add_location(code21, file$6, 168, 47, 8003);
    			add_location(strong1, file$6, 168, 88, 8044);
    			add_location(p10, file$6, 167, 0, 7872);
    			add_location(code22, file$6, 174, 16, 8364);
    			add_location(code23, file$6, 174, 47, 8395);
    			add_location(code24, file$6, 174, 69, 8417);
    			add_location(code25, file$6, 174, 101, 8449);
    			add_location(p11, file$6, 174, 0, 8348);
    			attr_dev(a10, "href", "#with-floating-label");
    			add_location(a10, file$6, 184, 29, 8961);
    			attr_dev(h37, "id", "with-floating-label");
    			add_location(h37, file$6, 184, 0, 8932);
    			add_location(code26, file$6, 185, 18, 9039);
    			add_location(em, file$6, 186, 40, 9165);
    			add_location(p12, file$6, 185, 0, 9021);
    			attr_dev(a11, "href", "#with-pips");
    			add_location(a11, file$6, 195, 19, 9554);
    			attr_dev(h38, "id", "with-pips");
    			add_location(h38, file$6, 195, 0, 9535);
    			add_location(code27, file$6, 197, 5, 9684);
    			add_location(p13, file$6, 196, 0, 9594);
    			attr_dev(a12, "href", "#pip-labels");
    			add_location(a12, file$6, 206, 20, 10128);
    			attr_dev(h39, "id", "pip-labels");
    			add_location(h39, file$6, 206, 0, 10108);
    			add_location(code28, file$6, 207, 23, 10193);
    			add_location(code29, file$6, 207, 41, 10211);
    			add_location(code30, file$6, 207, 61, 10231);
    			add_location(code31, file$6, 207, 83, 10253);
    			add_location(code32, file$6, 208, 38, 10349);
    			add_location(code33, file$6, 208, 62, 10373);
    			add_location(p14, file$6, 207, 0, 10170);
    			attr_dev(a13, "href", "#pip-steps");
    			add_location(a13, file$6, 225, 19, 11115);
    			attr_dev(h310, "id", "pip-steps");
    			add_location(h310, file$6, 225, 0, 11096);
    			add_location(code34, file$6, 226, 62, 11217);
    			add_location(code35, file$6, 227, 42, 11297);
    			add_location(p15, file$6, 226, 0, 11155);
    			add_location(code36, file$6, 229, 19, 11383);
    			add_location(code37, file$6, 229, 79, 11443);
    			add_location(code38, file$6, 230, 5, 11489);
    			add_location(code39, file$6, 230, 28, 11512);
    			add_location(code40, file$6, 230, 53, 11537);
    			add_location(code41, file$6, 230, 83, 11567);
    			add_location(p16, file$6, 229, 0, 11364);
    			add_location(code42, file$6, 246, 0, 12460);
    			add_location(p17, file$6, 244, 0, 12292);
    			attr_dev(a14, "href", "#styling-example-for-pips");
    			add_location(a14, file$6, 247, 34, 12589);
    			attr_dev(h40, "id", "styling-example-for-pips");
    			add_location(h40, file$6, 247, 0, 12555);
    			add_location(code43, file$6, 250, 15, 12770);
    			attr_dev(a15, "href", "#styling-example-for-pips");
    			add_location(a15, file$6, 248, 58, 12717);
    			add_location(p18, file$6, 248, 0, 12659);
    			add_location(code44, file$6, 281, 129, 13727);
    			add_location(code45, file$6, 281, 151, 13749);
    			attr_dev(a16, "href", "#example-table-of-step-and-pipstep-interaction");
    			add_location(a16, file$6, 281, 55, 13653);
    			attr_dev(h41, "id", "example-table-of-step-and-pipstep-interaction");
    			add_location(h41, file$6, 281, 0, 13598);
    			add_location(hr, file$6, 283, 0, 13801);
    			if (img.src !== (img_src_value = "public/images/icons8-under-construction-100.png")) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", "icon of a magnifying glass, for viewing the output slider");
    			attr_dev(img, "class", "svelte-8kyhgt");
    			add_location(img, file$6, 285, 3, 13828);
    			add_location(br, file$6, 288, 1, 13956);
    			add_location(p19, file$6, 285, 0, 13825);
    			attr_dev(div, "class", "soon svelte-8kyhgt");
    			add_location(div, file$6, 284, 0, 13806);
    			attr_dev(a17, "target", "_blank");
    			attr_dev(a17, "href", "https://icons8.com/icons/set/search");
    			add_location(a17, file$6, 292, 2, 14014);
    			attr_dev(a18, "target", "_blank");
    			attr_dev(a18, "href", "https://icons8.com/icons/set/code");
    			add_location(a18, file$6, 292, 76, 14088);
    			attr_dev(a19, "target", "_blank");
    			attr_dev(a19, "href", "https://icons8.com");
    			add_location(a19, file$6, 292, 164, 14176);
    			attr_dev(small, "class", "credit svelte-8kyhgt");
    			add_location(small, file$6, 291, 0, 13989);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, h1, anchor);
    			append_dev(h1, a0);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, p0, anchor);
    			append_dev(p0, t2);
    			append_dev(p0, strong0);
    			append_dev(p0, t4);
    			insert_dev(target, t5, anchor);
    			mount_component(rangeslider, target, anchor);
    			insert_dev(target, t6, anchor);
    			insert_dev(target, h20, anchor);
    			append_dev(h20, a1);
    			insert_dev(target, t8, anchor);
    			insert_dev(target, h30, anchor);
    			append_dev(h30, a2);
    			insert_dev(target, t10, anchor);
    			insert_dev(target, p1, anchor);
    			append_dev(p1, t11);
    			append_dev(p1, code0);
    			append_dev(p1, t13);
    			insert_dev(target, t14, anchor);
    			mount_component(options, target, anchor);
    			insert_dev(target, t15, anchor);
    			insert_dev(target, h31, anchor);
    			append_dev(h31, a3);
    			insert_dev(target, t17, anchor);
    			insert_dev(target, p2, anchor);
    			append_dev(p2, t18);
    			append_dev(p2, code1);
    			append_dev(p2, t20);
    			insert_dev(target, t21, anchor);
    			mount_component(prism0, target, anchor);
    			insert_dev(target, t22, anchor);
    			insert_dev(target, p3, anchor);
    			insert_dev(target, t24, anchor);
    			mount_component(prism1, target, anchor);
    			insert_dev(target, t25, anchor);
    			insert_dev(target, h21, anchor);
    			append_dev(h21, a4);
    			insert_dev(target, t27, anchor);
    			insert_dev(target, h32, anchor);
    			append_dev(h32, a5);
    			insert_dev(target, t29, anchor);
    			insert_dev(target, p4, anchor);
    			insert_dev(target, t31, anchor);
    			mount_component(example0, target, anchor);
    			insert_dev(target, t32, anchor);
    			insert_dev(target, h33, anchor);
    			append_dev(h33, a6);
    			insert_dev(target, t34, anchor);
    			insert_dev(target, p5, anchor);
    			append_dev(p5, t35);
    			append_dev(p5, code2);
    			append_dev(p5, t37);
    			append_dev(p5, code3);
    			append_dev(p5, t39);
    			append_dev(p5, code4);
    			append_dev(p5, t41);
    			append_dev(p5, code5);
    			append_dev(p5, t43);
    			append_dev(p5, code6);
    			append_dev(p5, t45);
    			append_dev(p5, code7);
    			insert_dev(target, t47, anchor);
    			mount_component(example1, target, anchor);
    			insert_dev(target, t48, anchor);
    			mount_component(example2, target, anchor);
    			insert_dev(target, t49, anchor);
    			insert_dev(target, h34, anchor);
    			append_dev(h34, a7);
    			insert_dev(target, t51, anchor);
    			insert_dev(target, p6, anchor);
    			append_dev(p6, t52);
    			append_dev(p6, code8);
    			append_dev(p6, t54);
    			append_dev(p6, code9);
    			append_dev(p6, t56);
    			insert_dev(target, t57, anchor);
    			mount_component(example3, target, anchor);
    			insert_dev(target, t58, anchor);
    			insert_dev(target, p7, anchor);
    			append_dev(p7, t59);
    			append_dev(p7, code10);
    			append_dev(p7, t61);
    			append_dev(p7, code11);
    			append_dev(p7, t63);
    			insert_dev(target, t64, anchor);
    			mount_component(example4, target, anchor);
    			insert_dev(target, t65, anchor);
    			mount_component(example5, target, anchor);
    			insert_dev(target, t66, anchor);
    			insert_dev(target, h35, anchor);
    			append_dev(h35, a8);
    			insert_dev(target, t68, anchor);
    			insert_dev(target, p8, anchor);
    			append_dev(p8, t69);
    			append_dev(p8, code12);
    			append_dev(p8, t71);
    			append_dev(p8, code13);
    			append_dev(p8, t73);
    			append_dev(p8, code14);
    			append_dev(p8, t75);
    			append_dev(p8, code15);
    			append_dev(p8, t77);
    			append_dev(p8, code16);
    			append_dev(p8, t79);
    			insert_dev(target, t80, anchor);
    			mount_component(example6, target, anchor);
    			insert_dev(target, t81, anchor);
    			mount_component(example7, target, anchor);
    			insert_dev(target, t82, anchor);
    			insert_dev(target, p9, anchor);
    			append_dev(p9, t83);
    			append_dev(p9, code17);
    			append_dev(p9, t85);
    			append_dev(p9, code18);
    			append_dev(p9, t87);
    			append_dev(p9, code19);
    			append_dev(p9, t89);
    			insert_dev(target, t90, anchor);
    			mount_component(example8, target, anchor);
    			insert_dev(target, t91, anchor);
    			insert_dev(target, h36, anchor);
    			append_dev(h36, a9);
    			insert_dev(target, t93, anchor);
    			insert_dev(target, p10, anchor);
    			append_dev(p10, t94);
    			append_dev(p10, code20);
    			append_dev(p10, t96);
    			append_dev(p10, code21);
    			append_dev(p10, t98);
    			append_dev(p10, strong1);
    			append_dev(p10, t100);
    			insert_dev(target, t101, anchor);
    			mount_component(example9, target, anchor);
    			insert_dev(target, t102, anchor);
    			insert_dev(target, p11, anchor);
    			append_dev(p11, t103);
    			append_dev(p11, code22);
    			append_dev(p11, t105);
    			append_dev(p11, code23);
    			append_dev(p11, t107);
    			append_dev(p11, code24);
    			append_dev(p11, t109);
    			append_dev(p11, code25);
    			append_dev(p11, t111);
    			insert_dev(target, t112, anchor);
    			mount_component(example10, target, anchor);
    			insert_dev(target, t113, anchor);
    			mount_component(example11, target, anchor);
    			insert_dev(target, t114, anchor);
    			insert_dev(target, h37, anchor);
    			append_dev(h37, a10);
    			insert_dev(target, t116, anchor);
    			insert_dev(target, p12, anchor);
    			append_dev(p12, t117);
    			append_dev(p12, code26);
    			append_dev(p12, t119);
    			append_dev(p12, em);
    			insert_dev(target, t121, anchor);
    			mount_component(example12, target, anchor);
    			insert_dev(target, t122, anchor);
    			mount_component(example13, target, anchor);
    			insert_dev(target, t123, anchor);
    			insert_dev(target, h38, anchor);
    			append_dev(h38, a11);
    			insert_dev(target, t125, anchor);
    			insert_dev(target, p13, anchor);
    			append_dev(p13, t126);
    			append_dev(p13, code27);
    			append_dev(p13, t128);
    			insert_dev(target, t129, anchor);
    			mount_component(example14, target, anchor);
    			insert_dev(target, t130, anchor);
    			mount_component(example15, target, anchor);
    			insert_dev(target, t131, anchor);
    			insert_dev(target, h39, anchor);
    			append_dev(h39, a12);
    			insert_dev(target, t133, anchor);
    			insert_dev(target, p14, anchor);
    			append_dev(p14, t134);
    			append_dev(p14, code28);
    			append_dev(p14, t136);
    			append_dev(p14, code29);
    			append_dev(p14, t138);
    			append_dev(p14, code30);
    			append_dev(p14, t140);
    			append_dev(p14, code31);
    			append_dev(p14, t142);
    			append_dev(p14, code32);
    			append_dev(p14, t144);
    			append_dev(p14, code33);
    			append_dev(p14, t146);
    			insert_dev(target, t147, anchor);
    			mount_component(example16, target, anchor);
    			insert_dev(target, t148, anchor);
    			mount_component(example17, target, anchor);
    			insert_dev(target, t149, anchor);
    			mount_component(example18, target, anchor);
    			insert_dev(target, t150, anchor);
    			mount_component(example19, target, anchor);
    			insert_dev(target, t151, anchor);
    			insert_dev(target, h310, anchor);
    			append_dev(h310, a13);
    			insert_dev(target, t153, anchor);
    			insert_dev(target, p15, anchor);
    			append_dev(p15, t154);
    			append_dev(p15, code34);
    			append_dev(p15, t156);
    			append_dev(p15, code35);
    			append_dev(p15, t158);
    			insert_dev(target, t159, anchor);
    			insert_dev(target, p16, anchor);
    			append_dev(p16, t160);
    			append_dev(p16, code36);
    			append_dev(p16, t162);
    			append_dev(p16, code37);
    			append_dev(p16, t164);
    			append_dev(p16, code38);
    			append_dev(p16, t166);
    			append_dev(p16, code39);
    			append_dev(p16, t168);
    			append_dev(p16, code40);
    			append_dev(p16, t170);
    			append_dev(p16, code41);
    			insert_dev(target, t172, anchor);
    			mount_component(example20, target, anchor);
    			insert_dev(target, t173, anchor);
    			mount_component(example21, target, anchor);
    			insert_dev(target, t174, anchor);
    			mount_component(example22, target, anchor);
    			insert_dev(target, t175, anchor);
    			insert_dev(target, p17, anchor);
    			append_dev(p17, t176);
    			append_dev(p17, code42);
    			append_dev(p17, t178);
    			insert_dev(target, t179, anchor);
    			insert_dev(target, h40, anchor);
    			append_dev(h40, a14);
    			insert_dev(target, t181, anchor);
    			insert_dev(target, p18, anchor);
    			append_dev(p18, t182);
    			append_dev(p18, a15);
    			append_dev(a15, t183);
    			append_dev(a15, code43);
    			append_dev(a15, t185);
    			insert_dev(target, t186, anchor);
    			mount_component(example23, target, anchor);
    			insert_dev(target, t187, anchor);
    			insert_dev(target, h41, anchor);
    			append_dev(h41, a16);
    			append_dev(a16, t188);
    			append_dev(a16, code44);
    			append_dev(a16, t190);
    			append_dev(a16, code45);
    			append_dev(a16, t192);
    			insert_dev(target, t193, anchor);
    			mount_component(steps, target, anchor);
    			insert_dev(target, t194, anchor);
    			insert_dev(target, hr, anchor);
    			insert_dev(target, t195, anchor);
    			insert_dev(target, div, anchor);
    			append_dev(div, p19);
    			append_dev(p19, img);
    			append_dev(p19, br);
    			append_dev(p19, t196);
    			insert_dev(target, t197, anchor);
    			insert_dev(target, small, anchor);
    			append_dev(small, a17);
    			append_dev(small, t199);
    			append_dev(small, a18);
    			append_dev(small, t201);
    			append_dev(small, a19);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const prism0_changes = {};

    			if (dirty[1] & /*$$scope*/ 512) {
    				prism0_changes.$$scope = { dirty, ctx };
    			}

    			prism0.$set(prism0_changes);
    			const prism1_changes = {};

    			if (dirty[1] & /*$$scope*/ 512) {
    				prism1_changes.$$scope = { dirty, ctx };
    			}

    			prism1.$set(prism1_changes);
    			const example0_changes = {};

    			if (dirty[1] & /*$$scope*/ 512) {
    				example0_changes.$$scope = { dirty, ctx };
    			}

    			example0.$set(example0_changes);
    			const example1_changes = {};
    			if (dirty[0] & /*values1*/ 1) example1_changes.values = /*values1*/ ctx[0];

    			if (dirty[0] & /*values1*/ 1 | dirty[1] & /*$$scope*/ 512) {
    				example1_changes.$$scope = { dirty, ctx };
    			}

    			example1.$set(example1_changes);
    			const example2_changes = {};
    			if (dirty[0] & /*values2*/ 2) example2_changes.values = /*values2*/ ctx[1];

    			if (dirty[0] & /*values2*/ 2 | dirty[1] & /*$$scope*/ 512) {
    				example2_changes.$$scope = { dirty, ctx };
    			}

    			example2.$set(example2_changes);
    			const example3_changes = {};
    			if (dirty[0] & /*minmax1*/ 4) example3_changes.values = /*minmax1*/ ctx[2];

    			if (dirty[0] & /*minmax1*/ 4 | dirty[1] & /*$$scope*/ 512) {
    				example3_changes.$$scope = { dirty, ctx };
    			}

    			example3.$set(example3_changes);
    			const example4_changes = {};
    			if (dirty[0] & /*minmax2*/ 8) example4_changes.values = /*minmax2*/ ctx[3];

    			if (dirty[0] & /*minmax2*/ 8 | dirty[1] & /*$$scope*/ 512) {
    				example4_changes.$$scope = { dirty, ctx };
    			}

    			example4.$set(example4_changes);
    			const example5_changes = {};
    			if (dirty[0] & /*minmax3*/ 16) example5_changes.values = /*minmax3*/ ctx[4];

    			if (dirty[0] & /*minmax2, minmax3*/ 24 | dirty[1] & /*$$scope*/ 512) {
    				example5_changes.$$scope = { dirty, ctx };
    			}

    			example5.$set(example5_changes);
    			const example6_changes = {};
    			if (dirty[0] & /*step1*/ 32) example6_changes.values = /*step1*/ ctx[5];

    			if (dirty[0] & /*step1*/ 32 | dirty[1] & /*$$scope*/ 512) {
    				example6_changes.$$scope = { dirty, ctx };
    			}

    			example6.$set(example6_changes);
    			const example7_changes = {};
    			if (dirty[0] & /*step3*/ 128) example7_changes.values = /*step3*/ ctx[7];

    			if (dirty[0] & /*step3*/ 128 | dirty[1] & /*$$scope*/ 512) {
    				example7_changes.$$scope = { dirty, ctx };
    			}

    			example7.$set(example7_changes);
    			const example8_changes = {};
    			if (dirty[0] & /*step2*/ 64) example8_changes.values = /*step2*/ ctx[6];

    			if (dirty[0] & /*step2*/ 64 | dirty[1] & /*$$scope*/ 512) {
    				example8_changes.$$scope = { dirty, ctx };
    			}

    			example8.$set(example8_changes);
    			const example9_changes = {};
    			if (dirty[0] & /*range1*/ 8192) example9_changes.values = /*range1*/ ctx[13];

    			if (dirty[0] & /*range1*/ 8192 | dirty[1] & /*$$scope*/ 512) {
    				example9_changes.$$scope = { dirty, ctx };
    			}

    			example9.$set(example9_changes);
    			const example10_changes = {};
    			if (dirty[0] & /*range2*/ 16384) example10_changes.values = /*range2*/ ctx[14];

    			if (dirty[0] & /*range2*/ 16384 | dirty[1] & /*$$scope*/ 512) {
    				example10_changes.$$scope = { dirty, ctx };
    			}

    			example10.$set(example10_changes);
    			const example11_changes = {};
    			if (dirty[0] & /*range3*/ 32768) example11_changes.values = /*range3*/ ctx[15];

    			if (dirty[0] & /*range3*/ 32768 | dirty[1] & /*$$scope*/ 512) {
    				example11_changes.$$scope = { dirty, ctx };
    			}

    			example11.$set(example11_changes);
    			const example12_changes = {};
    			if (dirty[0] & /*float1*/ 256) example12_changes.values = /*float1*/ ctx[8];

    			if (dirty[0] & /*float1*/ 256 | dirty[1] & /*$$scope*/ 512) {
    				example12_changes.$$scope = { dirty, ctx };
    			}

    			example12.$set(example12_changes);
    			const example13_changes = {};
    			if (dirty[0] & /*float2*/ 512) example13_changes.values = /*float2*/ ctx[9];

    			if (dirty[0] & /*float2*/ 512 | dirty[1] & /*$$scope*/ 512) {
    				example13_changes.$$scope = { dirty, ctx };
    			}

    			example13.$set(example13_changes);
    			const example14_changes = {};
    			if (dirty[0] & /*pips1*/ 1024) example14_changes.values = /*pips1*/ ctx[10];

    			if (dirty[0] & /*pips1*/ 1024 | dirty[1] & /*$$scope*/ 512) {
    				example14_changes.$$scope = { dirty, ctx };
    			}

    			example14.$set(example14_changes);
    			const example15_changes = {};
    			if (dirty[0] & /*pips2*/ 2048) example15_changes.values = /*pips2*/ ctx[11];

    			if (dirty[0] & /*pips2*/ 2048 | dirty[1] & /*$$scope*/ 512) {
    				example15_changes.$$scope = { dirty, ctx };
    			}

    			example15.$set(example15_changes);
    			const example16_changes = {};

    			if (dirty[1] & /*$$scope*/ 512) {
    				example16_changes.$$scope = { dirty, ctx };
    			}

    			example16.$set(example16_changes);
    			const example17_changes = {};

    			if (dirty[1] & /*$$scope*/ 512) {
    				example17_changes.$$scope = { dirty, ctx };
    			}

    			example17.$set(example17_changes);
    			const example18_changes = {};

    			if (dirty[1] & /*$$scope*/ 512) {
    				example18_changes.$$scope = { dirty, ctx };
    			}

    			example18.$set(example18_changes);
    			const example19_changes = {};

    			if (dirty[1] & /*$$scope*/ 512) {
    				example19_changes.$$scope = { dirty, ctx };
    			}

    			example19.$set(example19_changes);
    			const example20_changes = {};
    			if (dirty[0] & /*pipstep1*/ 65536) example20_changes.values = /*pipstep1*/ ctx[16];

    			if (dirty[0] & /*pipstep1*/ 65536 | dirty[1] & /*$$scope*/ 512) {
    				example20_changes.$$scope = { dirty, ctx };
    			}

    			example20.$set(example20_changes);
    			const example21_changes = {};
    			if (dirty[0] & /*pipstep2*/ 131072) example21_changes.values = /*pipstep2*/ ctx[17];

    			if (dirty[0] & /*pipstep2*/ 131072 | dirty[1] & /*$$scope*/ 512) {
    				example21_changes.$$scope = { dirty, ctx };
    			}

    			example21.$set(example21_changes);
    			const example22_changes = {};
    			if (dirty[0] & /*pipstep3*/ 262144) example22_changes.values = /*pipstep3*/ ctx[18];

    			if (dirty[0] & /*pipstep3*/ 262144 | dirty[1] & /*$$scope*/ 512) {
    				example22_changes.$$scope = { dirty, ctx };
    			}

    			example22.$set(example22_changes);
    			const example23_changes = {};
    			if (dirty[0] & /*pips3*/ 4096) example23_changes.values = /*pips3*/ ctx[12];

    			if (dirty[0] & /*pips3*/ 4096 | dirty[1] & /*$$scope*/ 512) {
    				example23_changes.$$scope = { dirty, ctx };
    			}

    			example23.$set(example23_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(rangeslider.$$.fragment, local);
    			transition_in(options.$$.fragment, local);
    			transition_in(prism0.$$.fragment, local);
    			transition_in(prism1.$$.fragment, local);
    			transition_in(example0.$$.fragment, local);
    			transition_in(example1.$$.fragment, local);
    			transition_in(example2.$$.fragment, local);
    			transition_in(example3.$$.fragment, local);
    			transition_in(example4.$$.fragment, local);
    			transition_in(example5.$$.fragment, local);
    			transition_in(example6.$$.fragment, local);
    			transition_in(example7.$$.fragment, local);
    			transition_in(example8.$$.fragment, local);
    			transition_in(example9.$$.fragment, local);
    			transition_in(example10.$$.fragment, local);
    			transition_in(example11.$$.fragment, local);
    			transition_in(example12.$$.fragment, local);
    			transition_in(example13.$$.fragment, local);
    			transition_in(example14.$$.fragment, local);
    			transition_in(example15.$$.fragment, local);
    			transition_in(example16.$$.fragment, local);
    			transition_in(example17.$$.fragment, local);
    			transition_in(example18.$$.fragment, local);
    			transition_in(example19.$$.fragment, local);
    			transition_in(example20.$$.fragment, local);
    			transition_in(example21.$$.fragment, local);
    			transition_in(example22.$$.fragment, local);
    			transition_in(example23.$$.fragment, local);
    			transition_in(steps.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(rangeslider.$$.fragment, local);
    			transition_out(options.$$.fragment, local);
    			transition_out(prism0.$$.fragment, local);
    			transition_out(prism1.$$.fragment, local);
    			transition_out(example0.$$.fragment, local);
    			transition_out(example1.$$.fragment, local);
    			transition_out(example2.$$.fragment, local);
    			transition_out(example3.$$.fragment, local);
    			transition_out(example4.$$.fragment, local);
    			transition_out(example5.$$.fragment, local);
    			transition_out(example6.$$.fragment, local);
    			transition_out(example7.$$.fragment, local);
    			transition_out(example8.$$.fragment, local);
    			transition_out(example9.$$.fragment, local);
    			transition_out(example10.$$.fragment, local);
    			transition_out(example11.$$.fragment, local);
    			transition_out(example12.$$.fragment, local);
    			transition_out(example13.$$.fragment, local);
    			transition_out(example14.$$.fragment, local);
    			transition_out(example15.$$.fragment, local);
    			transition_out(example16.$$.fragment, local);
    			transition_out(example17.$$.fragment, local);
    			transition_out(example18.$$.fragment, local);
    			transition_out(example19.$$.fragment, local);
    			transition_out(example20.$$.fragment, local);
    			transition_out(example21.$$.fragment, local);
    			transition_out(example22.$$.fragment, local);
    			transition_out(example23.$$.fragment, local);
    			transition_out(steps.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(h1);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(p0);
    			if (detaching) detach_dev(t5);
    			destroy_component(rangeslider, detaching);
    			if (detaching) detach_dev(t6);
    			if (detaching) detach_dev(h20);
    			if (detaching) detach_dev(t8);
    			if (detaching) detach_dev(h30);
    			if (detaching) detach_dev(t10);
    			if (detaching) detach_dev(p1);
    			if (detaching) detach_dev(t14);
    			destroy_component(options, detaching);
    			if (detaching) detach_dev(t15);
    			if (detaching) detach_dev(h31);
    			if (detaching) detach_dev(t17);
    			if (detaching) detach_dev(p2);
    			if (detaching) detach_dev(t21);
    			destroy_component(prism0, detaching);
    			if (detaching) detach_dev(t22);
    			if (detaching) detach_dev(p3);
    			if (detaching) detach_dev(t24);
    			destroy_component(prism1, detaching);
    			if (detaching) detach_dev(t25);
    			if (detaching) detach_dev(h21);
    			if (detaching) detach_dev(t27);
    			if (detaching) detach_dev(h32);
    			if (detaching) detach_dev(t29);
    			if (detaching) detach_dev(p4);
    			if (detaching) detach_dev(t31);
    			destroy_component(example0, detaching);
    			if (detaching) detach_dev(t32);
    			if (detaching) detach_dev(h33);
    			if (detaching) detach_dev(t34);
    			if (detaching) detach_dev(p5);
    			if (detaching) detach_dev(t47);
    			destroy_component(example1, detaching);
    			if (detaching) detach_dev(t48);
    			destroy_component(example2, detaching);
    			if (detaching) detach_dev(t49);
    			if (detaching) detach_dev(h34);
    			if (detaching) detach_dev(t51);
    			if (detaching) detach_dev(p6);
    			if (detaching) detach_dev(t57);
    			destroy_component(example3, detaching);
    			if (detaching) detach_dev(t58);
    			if (detaching) detach_dev(p7);
    			if (detaching) detach_dev(t64);
    			destroy_component(example4, detaching);
    			if (detaching) detach_dev(t65);
    			destroy_component(example5, detaching);
    			if (detaching) detach_dev(t66);
    			if (detaching) detach_dev(h35);
    			if (detaching) detach_dev(t68);
    			if (detaching) detach_dev(p8);
    			if (detaching) detach_dev(t80);
    			destroy_component(example6, detaching);
    			if (detaching) detach_dev(t81);
    			destroy_component(example7, detaching);
    			if (detaching) detach_dev(t82);
    			if (detaching) detach_dev(p9);
    			if (detaching) detach_dev(t90);
    			destroy_component(example8, detaching);
    			if (detaching) detach_dev(t91);
    			if (detaching) detach_dev(h36);
    			if (detaching) detach_dev(t93);
    			if (detaching) detach_dev(p10);
    			if (detaching) detach_dev(t101);
    			destroy_component(example9, detaching);
    			if (detaching) detach_dev(t102);
    			if (detaching) detach_dev(p11);
    			if (detaching) detach_dev(t112);
    			destroy_component(example10, detaching);
    			if (detaching) detach_dev(t113);
    			destroy_component(example11, detaching);
    			if (detaching) detach_dev(t114);
    			if (detaching) detach_dev(h37);
    			if (detaching) detach_dev(t116);
    			if (detaching) detach_dev(p12);
    			if (detaching) detach_dev(t121);
    			destroy_component(example12, detaching);
    			if (detaching) detach_dev(t122);
    			destroy_component(example13, detaching);
    			if (detaching) detach_dev(t123);
    			if (detaching) detach_dev(h38);
    			if (detaching) detach_dev(t125);
    			if (detaching) detach_dev(p13);
    			if (detaching) detach_dev(t129);
    			destroy_component(example14, detaching);
    			if (detaching) detach_dev(t130);
    			destroy_component(example15, detaching);
    			if (detaching) detach_dev(t131);
    			if (detaching) detach_dev(h39);
    			if (detaching) detach_dev(t133);
    			if (detaching) detach_dev(p14);
    			if (detaching) detach_dev(t147);
    			destroy_component(example16, detaching);
    			if (detaching) detach_dev(t148);
    			destroy_component(example17, detaching);
    			if (detaching) detach_dev(t149);
    			destroy_component(example18, detaching);
    			if (detaching) detach_dev(t150);
    			destroy_component(example19, detaching);
    			if (detaching) detach_dev(t151);
    			if (detaching) detach_dev(h310);
    			if (detaching) detach_dev(t153);
    			if (detaching) detach_dev(p15);
    			if (detaching) detach_dev(t159);
    			if (detaching) detach_dev(p16);
    			if (detaching) detach_dev(t172);
    			destroy_component(example20, detaching);
    			if (detaching) detach_dev(t173);
    			destroy_component(example21, detaching);
    			if (detaching) detach_dev(t174);
    			destroy_component(example22, detaching);
    			if (detaching) detach_dev(t175);
    			if (detaching) detach_dev(p17);
    			if (detaching) detach_dev(t179);
    			if (detaching) detach_dev(h40);
    			if (detaching) detach_dev(t181);
    			if (detaching) detach_dev(p18);
    			if (detaching) detach_dev(t186);
    			destroy_component(example23, detaching);
    			if (detaching) detach_dev(t187);
    			if (detaching) detach_dev(h41);
    			if (detaching) detach_dev(t193);
    			destroy_component(steps, detaching);
    			if (detaching) detach_dev(t194);
    			if (detaching) detach_dev(hr);
    			if (detaching) detach_dev(t195);
    			if (detaching) detach_dev(div);
    			if (detaching) detach_dev(t197);
    			if (detaching) detach_dev(small);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$6.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$6($$self, $$props, $$invalidate) {
    	let values1 = [11];
    	let values2 = [25, 50, 75];
    	let minmax1 = [0];
    	let minmax2 = [75];
    	let minmax3 = [111];
    	let step1 = [50];
    	let step2 = [-10, 10];
    	let step3 = [5000];
    	let values4 = [50];
    	let float1 = [50];
    	let float2 = [40, 60];
    	let pips1 = [50];
    	let pips2 = [2];
    	let pips3 = [2];
    	let range1 = [30, 70];
    	let range2 = [50];
    	let range3 = [50];
    	let pipstep1 = [50];
    	let pipstep2 = [50];
    	let pipstep3 = [50];
    	let values12 = [50];
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Docs> was created with unknown prop '${key}'`);
    	});

    	let { $$slots = {}, $$scope } = $$props;
    	validate_slots("Docs", $$slots, []);

    	function rangeslider_values_binding(value) {
    		values1 = value;
    		$$invalidate(0, values1);
    	}

    	function rangeslider_values_binding_1(value) {
    		values2 = value;
    		$$invalidate(1, values2);
    	}

    	function rangeslider_values_binding_2(value) {
    		minmax1 = value;
    		$$invalidate(2, minmax1);
    	}

    	function rangeslider_values_binding_3(value) {
    		minmax2 = value;
    		$$invalidate(3, minmax2);
    	}

    	function rangeslider_values_binding_4(value) {
    		minmax3 = value;
    		$$invalidate(4, minmax3);
    	}

    	function rangeslider_values_binding_5(value) {
    		step1 = value;
    		$$invalidate(5, step1);
    	}

    	function rangeslider_values_binding_6(value) {
    		step3 = value;
    		$$invalidate(7, step3);
    	}

    	function rangeslider_values_binding_7(value) {
    		step2 = value;
    		$$invalidate(6, step2);
    	}

    	function rangeslider_values_binding_8(value) {
    		range1 = value;
    		$$invalidate(13, range1);
    	}

    	function rangeslider_values_binding_9(value) {
    		range2 = value;
    		$$invalidate(14, range2);
    	}

    	function rangeslider_values_binding_10(value) {
    		range3 = value;
    		$$invalidate(15, range3);
    	}

    	function rangeslider_values_binding_11(value) {
    		float1 = value;
    		$$invalidate(8, float1);
    	}

    	function rangeslider_values_binding_12(value) {
    		float2 = value;
    		$$invalidate(9, float2);
    	}

    	function rangeslider_values_binding_13(value) {
    		pips1 = value;
    		$$invalidate(10, pips1);
    	}

    	function rangeslider_values_binding_14(value) {
    		pips2 = value;
    		$$invalidate(11, pips2);
    	}

    	function rangeslider_values_binding_15(value) {
    		pipstep1 = value;
    		$$invalidate(16, pipstep1);
    	}

    	function rangeslider_values_binding_16(value) {
    		pipstep2 = value;
    		$$invalidate(17, pipstep2);
    	}

    	function rangeslider_values_binding_17(value) {
    		pipstep3 = value;
    		$$invalidate(18, pipstep3);
    	}

    	function rangeslider_values_binding_18(value) {
    		pips3 = value;
    		$$invalidate(12, pips3);
    	}

    	$$self.$capture_state = () => ({
    		Prism: Prism$1,
    		RangeSlider,
    		Example,
    		Options,
    		Steps,
    		values1,
    		values2,
    		minmax1,
    		minmax2,
    		minmax3,
    		step1,
    		step2,
    		step3,
    		values4,
    		float1,
    		float2,
    		pips1,
    		pips2,
    		pips3,
    		range1,
    		range2,
    		range3,
    		pipstep1,
    		pipstep2,
    		pipstep3,
    		values12
    	});

    	$$self.$inject_state = $$props => {
    		if ("values1" in $$props) $$invalidate(0, values1 = $$props.values1);
    		if ("values2" in $$props) $$invalidate(1, values2 = $$props.values2);
    		if ("minmax1" in $$props) $$invalidate(2, minmax1 = $$props.minmax1);
    		if ("minmax2" in $$props) $$invalidate(3, minmax2 = $$props.minmax2);
    		if ("minmax3" in $$props) $$invalidate(4, minmax3 = $$props.minmax3);
    		if ("step1" in $$props) $$invalidate(5, step1 = $$props.step1);
    		if ("step2" in $$props) $$invalidate(6, step2 = $$props.step2);
    		if ("step3" in $$props) $$invalidate(7, step3 = $$props.step3);
    		if ("values4" in $$props) values4 = $$props.values4;
    		if ("float1" in $$props) $$invalidate(8, float1 = $$props.float1);
    		if ("float2" in $$props) $$invalidate(9, float2 = $$props.float2);
    		if ("pips1" in $$props) $$invalidate(10, pips1 = $$props.pips1);
    		if ("pips2" in $$props) $$invalidate(11, pips2 = $$props.pips2);
    		if ("pips3" in $$props) $$invalidate(12, pips3 = $$props.pips3);
    		if ("range1" in $$props) $$invalidate(13, range1 = $$props.range1);
    		if ("range2" in $$props) $$invalidate(14, range2 = $$props.range2);
    		if ("range3" in $$props) $$invalidate(15, range3 = $$props.range3);
    		if ("pipstep1" in $$props) $$invalidate(16, pipstep1 = $$props.pipstep1);
    		if ("pipstep2" in $$props) $$invalidate(17, pipstep2 = $$props.pipstep2);
    		if ("pipstep3" in $$props) $$invalidate(18, pipstep3 = $$props.pipstep3);
    		if ("values12" in $$props) values12 = $$props.values12;
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		values1,
    		values2,
    		minmax1,
    		minmax2,
    		minmax3,
    		step1,
    		step2,
    		step3,
    		float1,
    		float2,
    		pips1,
    		pips2,
    		pips3,
    		range1,
    		range2,
    		range3,
    		pipstep1,
    		pipstep2,
    		pipstep3,
    		rangeslider_values_binding,
    		rangeslider_values_binding_1,
    		rangeslider_values_binding_2,
    		rangeslider_values_binding_3,
    		rangeslider_values_binding_4,
    		rangeslider_values_binding_5,
    		rangeslider_values_binding_6,
    		rangeslider_values_binding_7,
    		rangeslider_values_binding_8,
    		rangeslider_values_binding_9,
    		rangeslider_values_binding_10,
    		rangeslider_values_binding_11,
    		rangeslider_values_binding_12,
    		rangeslider_values_binding_13,
    		rangeslider_values_binding_14,
    		rangeslider_values_binding_15,
    		rangeslider_values_binding_16,
    		rangeslider_values_binding_17,
    		rangeslider_values_binding_18
    	];
    }

    class Docs extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$6, create_fragment$6, safe_not_equal, {}, [-1, -1]);

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Docs",
    			options,
    			id: create_fragment$6.name
    		});
    	}
    }

    /* src/App.svelte generated by Svelte v3.24.0 */
    const file$7 = "src/App.svelte";

    function create_fragment$7(ctx) {
    	let main;
    	let docs;
    	let current;
    	docs = new Docs({ $$inline: true });

    	const block = {
    		c: function create() {
    			main = element("main");
    			create_component(docs.$$.fragment);
    			attr_dev(main, "class", "svelte-xnzu95");
    			add_location(main, file$7, 12, 0, 142);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, main, anchor);
    			mount_component(docs, main, null);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(docs.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(docs.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(main);
    			destroy_component(docs);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$7.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$7($$self, $$props, $$invalidate) {
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<App> was created with unknown prop '${key}'`);
    	});

    	let { $$slots = {}, $$scope } = $$props;
    	validate_slots("App", $$slots, []);
    	$$self.$capture_state = () => ({ Docs });
    	return [];
    }

    class App extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$7, create_fragment$7, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "App",
    			options,
    			id: create_fragment$7.name
    		});
    	}
    }

    const app = new App({
    	target: document.body
    });

    return app;

}());
//# sourceMappingURL=bundle.js.map


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

    const file = "node_modules/svelte-range-slider-pips/src/RangePips.svelte";

    function get_each_context(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[19] = list[i];
    	child_ctx[21] = i;
    	return child_ctx;
    }

    // (134:2) {#if first}
    function create_if_block_5(ctx) {
    	let span;
    	let span_style_value;
    	let if_block = /*first*/ ctx[3] === "label" && create_if_block_6(ctx);

    	const block = {
    		c: function create() {
    			span = element("span");
    			if (if_block) if_block.c();
    			attr_dev(span, "class", "pip first");
    			attr_dev(span, "style", span_style_value = "" + ((/*vertical*/ ctx[2] ? "top" : "left") + ": 0%;"));
    			toggle_class(span, "selected", /*isSelected*/ ctx[13](/*min*/ ctx[0]));
    			toggle_class(span, "in-range", /*inRange*/ ctx[14](/*min*/ ctx[0]));
    			add_location(span, file, 134, 4, 3360);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, span, anchor);
    			if (if_block) if_block.m(span, null);
    		},
    		p: function update(ctx, dirty) {
    			if (/*first*/ ctx[3] === "label") {
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

    			if (dirty & /*isSelected, min*/ 8193) {
    				toggle_class(span, "selected", /*isSelected*/ ctx[13](/*min*/ ctx[0]));
    			}

    			if (dirty & /*inRange, min*/ 16385) {
    				toggle_class(span, "in-range", /*inRange*/ ctx[14](/*min*/ ctx[0]));
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
    		source: "(134:2) {#if first}",
    		ctx
    	});

    	return block;
    }

    // (140:6) {#if first === 'label'}
    function create_if_block_6(ctx) {
    	let span;
    	let t0;
    	let t1_value = /*formatter*/ ctx[8](/*min*/ ctx[0]) + "";
    	let t1;
    	let t2;

    	const block = {
    		c: function create() {
    			span = element("span");
    			t0 = text(/*prefix*/ ctx[6]);
    			t1 = text(t1_value);
    			t2 = text(/*suffix*/ ctx[7]);
    			attr_dev(span, "class", "pipVal");
    			add_location(span, file, 140, 8, 3551);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, span, anchor);
    			append_dev(span, t0);
    			append_dev(span, t1);
    			append_dev(span, t2);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*prefix*/ 64) set_data_dev(t0, /*prefix*/ ctx[6]);
    			if (dirty & /*formatter, min*/ 257 && t1_value !== (t1_value = /*formatter*/ ctx[8](/*min*/ ctx[0]) + "")) set_data_dev(t1, t1_value);
    			if (dirty & /*suffix*/ 128) set_data_dev(t2, /*suffix*/ ctx[7]);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(span);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_6.name,
    		type: "if",
    		source: "(140:6) {#if first === 'label'}",
    		ctx
    	});

    	return block;
    }

    // (147:2) {#if rest}
    function create_if_block_2(ctx) {
    	let each_1_anchor;
    	let each_value = Array(/*pipCount*/ ctx[11] + 1);
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
    			if (dirty & /*vertical, percentOf, pipVal, isSelected, inRange, suffix, formatter, prefix, rest, min, max, pipCount*/ 32231) {
    				each_value = Array(/*pipCount*/ ctx[11] + 1);
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
    		source: "(147:2) {#if rest}",
    		ctx
    	});

    	return block;
    }

    // (149:6) {#if pipVal(i) !== min && pipVal(i) !== max}
    function create_if_block_3(ctx) {
    	let span;
    	let t;
    	let span_style_value;
    	let if_block = /*rest*/ ctx[5] === "label" && create_if_block_4(ctx);

    	const block = {
    		c: function create() {
    			span = element("span");
    			if (if_block) if_block.c();
    			t = space();
    			attr_dev(span, "class", "pip");
    			attr_dev(span, "style", span_style_value = "" + ((/*vertical*/ ctx[2] ? "top" : "left") + ": " + /*percentOf*/ ctx[10](/*pipVal*/ ctx[12](/*i*/ ctx[21])) + "%;"));
    			toggle_class(span, "selected", /*isSelected*/ ctx[13](/*pipVal*/ ctx[12](/*i*/ ctx[21])));
    			toggle_class(span, "in-range", /*inRange*/ ctx[14](/*pipVal*/ ctx[12](/*i*/ ctx[21])));
    			add_location(span, file, 149, 8, 3776);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, span, anchor);
    			if (if_block) if_block.m(span, null);
    			append_dev(span, t);
    		},
    		p: function update(ctx, dirty) {
    			if (/*rest*/ ctx[5] === "label") {
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

    			if (dirty & /*vertical, percentOf, pipVal*/ 5124 && span_style_value !== (span_style_value = "" + ((/*vertical*/ ctx[2] ? "top" : "left") + ": " + /*percentOf*/ ctx[10](/*pipVal*/ ctx[12](/*i*/ ctx[21])) + "%;"))) {
    				attr_dev(span, "style", span_style_value);
    			}

    			if (dirty & /*isSelected, pipVal*/ 12288) {
    				toggle_class(span, "selected", /*isSelected*/ ctx[13](/*pipVal*/ ctx[12](/*i*/ ctx[21])));
    			}

    			if (dirty & /*inRange, pipVal*/ 20480) {
    				toggle_class(span, "in-range", /*inRange*/ ctx[14](/*pipVal*/ ctx[12](/*i*/ ctx[21])));
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
    		source: "(149:6) {#if pipVal(i) !== min && pipVal(i) !== max}",
    		ctx
    	});

    	return block;
    }

    // (155:10) {#if rest === 'label'}
    function create_if_block_4(ctx) {
    	let span;
    	let t0;
    	let t1_value = /*formatter*/ ctx[8](/*pipVal*/ ctx[12](/*i*/ ctx[21])) + "";
    	let t1;
    	let t2;

    	const block = {
    		c: function create() {
    			span = element("span");
    			t0 = text(/*prefix*/ ctx[6]);
    			t1 = text(t1_value);
    			t2 = text(/*suffix*/ ctx[7]);
    			attr_dev(span, "class", "pipVal");
    			add_location(span, file, 155, 12, 4017);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, span, anchor);
    			append_dev(span, t0);
    			append_dev(span, t1);
    			append_dev(span, t2);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*prefix*/ 64) set_data_dev(t0, /*prefix*/ ctx[6]);
    			if (dirty & /*formatter, pipVal*/ 4352 && t1_value !== (t1_value = /*formatter*/ ctx[8](/*pipVal*/ ctx[12](/*i*/ ctx[21])) + "")) set_data_dev(t1, t1_value);
    			if (dirty & /*suffix*/ 128) set_data_dev(t2, /*suffix*/ ctx[7]);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(span);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_4.name,
    		type: "if",
    		source: "(155:10) {#if rest === 'label'}",
    		ctx
    	});

    	return block;
    }

    // (148:4) {#each Array(pipCount + 1) as _, i}
    function create_each_block(ctx) {
    	let show_if = /*pipVal*/ ctx[12](/*i*/ ctx[21]) !== /*min*/ ctx[0] && /*pipVal*/ ctx[12](/*i*/ ctx[21]) !== /*max*/ ctx[1];
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
    			if (dirty & /*pipVal, min, max*/ 4099) show_if = /*pipVal*/ ctx[12](/*i*/ ctx[21]) !== /*min*/ ctx[0] && /*pipVal*/ ctx[12](/*i*/ ctx[21]) !== /*max*/ ctx[1];

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
    		source: "(148:4) {#each Array(pipCount + 1) as _, i}",
    		ctx
    	});

    	return block;
    }

    // (164:2) {#if last}
    function create_if_block(ctx) {
    	let span;
    	let span_style_value;
    	let if_block = /*last*/ ctx[4] === "label" && create_if_block_1(ctx);

    	const block = {
    		c: function create() {
    			span = element("span");
    			if (if_block) if_block.c();
    			attr_dev(span, "class", "pip last");
    			attr_dev(span, "style", span_style_value = "" + ((/*vertical*/ ctx[2] ? "top" : "left") + ": 100%;"));
    			toggle_class(span, "selected", /*isSelected*/ ctx[13](/*max*/ ctx[1]));
    			toggle_class(span, "in-range", /*inRange*/ ctx[14](/*max*/ ctx[1]));
    			add_location(span, file, 164, 4, 4193);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, span, anchor);
    			if (if_block) if_block.m(span, null);
    		},
    		p: function update(ctx, dirty) {
    			if (/*last*/ ctx[4] === "label") {
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

    			if (dirty & /*isSelected, max*/ 8194) {
    				toggle_class(span, "selected", /*isSelected*/ ctx[13](/*max*/ ctx[1]));
    			}

    			if (dirty & /*inRange, max*/ 16386) {
    				toggle_class(span, "in-range", /*inRange*/ ctx[14](/*max*/ ctx[1]));
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(span);
    			if (if_block) if_block.d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block.name,
    		type: "if",
    		source: "(164:2) {#if last}",
    		ctx
    	});

    	return block;
    }

    // (170:6) {#if last === 'label'}
    function create_if_block_1(ctx) {
    	let span;
    	let t0;
    	let t1_value = /*formatter*/ ctx[8](/*max*/ ctx[1]) + "";
    	let t1;
    	let t2;

    	const block = {
    		c: function create() {
    			span = element("span");
    			t0 = text(/*prefix*/ ctx[6]);
    			t1 = text(t1_value);
    			t2 = text(/*suffix*/ ctx[7]);
    			attr_dev(span, "class", "pipVal");
    			add_location(span, file, 170, 8, 4384);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, span, anchor);
    			append_dev(span, t0);
    			append_dev(span, t1);
    			append_dev(span, t2);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*prefix*/ 64) set_data_dev(t0, /*prefix*/ ctx[6]);
    			if (dirty & /*formatter, max*/ 258 && t1_value !== (t1_value = /*formatter*/ ctx[8](/*max*/ ctx[1]) + "")) set_data_dev(t1, t1_value);
    			if (dirty & /*suffix*/ 128) set_data_dev(t2, /*suffix*/ ctx[7]);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(span);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1.name,
    		type: "if",
    		source: "(170:6) {#if last === 'label'}",
    		ctx
    	});

    	return block;
    }

    function create_fragment(ctx) {
    	let div;
    	let t0;
    	let t1;
    	let if_block0 = /*first*/ ctx[3] && create_if_block_5(ctx);
    	let if_block1 = /*rest*/ ctx[5] && create_if_block_2(ctx);
    	let if_block2 = /*last*/ ctx[4] && create_if_block(ctx);

    	const block = {
    		c: function create() {
    			div = element("div");
    			if (if_block0) if_block0.c();
    			t0 = space();
    			if (if_block1) if_block1.c();
    			t1 = space();
    			if (if_block2) if_block2.c();
    			attr_dev(div, "class", "rangeSlider__pips");
    			toggle_class(div, "focus", /*focus*/ ctx[9]);
    			toggle_class(div, "vertical", /*vertical*/ ctx[2]);
    			add_location(div, file, 132, 0, 3283);
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
    			if (/*first*/ ctx[3]) {
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

    			if (/*rest*/ ctx[5]) {
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

    			if (/*last*/ ctx[4]) {
    				if (if_block2) {
    					if_block2.p(ctx, dirty);
    				} else {
    					if_block2 = create_if_block(ctx);
    					if_block2.c();
    					if_block2.m(div, null);
    				}
    			} else if (if_block2) {
    				if_block2.d(1);
    				if_block2 = null;
    			}

    			if (dirty & /*focus*/ 512) {
    				toggle_class(div, "focus", /*focus*/ ctx[9]);
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
    		id: create_fragment.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance($$self, $$props, $$invalidate) {
    	let { range = false } = $$props;
    	let { min = 0 } = $$props;
    	let { max = 100 } = $$props;
    	let { step = 1 } = $$props;
    	let { values = [(max + min) / 2] } = $$props;
    	let { vertical = false } = $$props;

    	let { pipstep = (max - min) / step >= (vertical ? 50 : 100)
    	? (max - min) / (vertical ? 10 : 20)
    	: 1 } = $$props;

    	let { first = true } = $$props;
    	let { last = true } = $$props;
    	let { rest = true } = $$props;
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
    		if ("range" in $$props) $$invalidate(15, range = $$props.range);
    		if ("min" in $$props) $$invalidate(0, min = $$props.min);
    		if ("max" in $$props) $$invalidate(1, max = $$props.max);
    		if ("step" in $$props) $$invalidate(16, step = $$props.step);
    		if ("values" in $$props) $$invalidate(17, values = $$props.values);
    		if ("vertical" in $$props) $$invalidate(2, vertical = $$props.vertical);
    		if ("pipstep" in $$props) $$invalidate(18, pipstep = $$props.pipstep);
    		if ("first" in $$props) $$invalidate(3, first = $$props.first);
    		if ("last" in $$props) $$invalidate(4, last = $$props.last);
    		if ("rest" in $$props) $$invalidate(5, rest = $$props.rest);
    		if ("prefix" in $$props) $$invalidate(6, prefix = $$props.prefix);
    		if ("suffix" in $$props) $$invalidate(7, suffix = $$props.suffix);
    		if ("formatter" in $$props) $$invalidate(8, formatter = $$props.formatter);
    		if ("focus" in $$props) $$invalidate(9, focus = $$props.focus);
    		if ("percentOf" in $$props) $$invalidate(10, percentOf = $$props.percentOf);
    	};

    	$$self.$capture_state = () => ({
    		range,
    		min,
    		max,
    		step,
    		values,
    		vertical,
    		pipstep,
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
    		if ("range" in $$props) $$invalidate(15, range = $$props.range);
    		if ("min" in $$props) $$invalidate(0, min = $$props.min);
    		if ("max" in $$props) $$invalidate(1, max = $$props.max);
    		if ("step" in $$props) $$invalidate(16, step = $$props.step);
    		if ("values" in $$props) $$invalidate(17, values = $$props.values);
    		if ("vertical" in $$props) $$invalidate(2, vertical = $$props.vertical);
    		if ("pipstep" in $$props) $$invalidate(18, pipstep = $$props.pipstep);
    		if ("first" in $$props) $$invalidate(3, first = $$props.first);
    		if ("last" in $$props) $$invalidate(4, last = $$props.last);
    		if ("rest" in $$props) $$invalidate(5, rest = $$props.rest);
    		if ("prefix" in $$props) $$invalidate(6, prefix = $$props.prefix);
    		if ("suffix" in $$props) $$invalidate(7, suffix = $$props.suffix);
    		if ("formatter" in $$props) $$invalidate(8, formatter = $$props.formatter);
    		if ("focus" in $$props) $$invalidate(9, focus = $$props.focus);
    		if ("percentOf" in $$props) $$invalidate(10, percentOf = $$props.percentOf);
    		if ("pipCount" in $$props) $$invalidate(11, pipCount = $$props.pipCount);
    		if ("pipVal" in $$props) $$invalidate(12, pipVal = $$props.pipVal);
    		if ("isSelected" in $$props) $$invalidate(13, isSelected = $$props.isSelected);
    		if ("inRange" in $$props) $$invalidate(14, inRange = $$props.inRange);
    	};

    	let pipCount;
    	let pipVal;
    	let isSelected;
    	let inRange;

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*max, min, step, pipstep*/ 327683) {
    			 $$invalidate(11, pipCount = parseInt((max - min) / (step * pipstep), 10));
    		}

    		if ($$self.$$.dirty & /*min, step, pipstep*/ 327681) {
    			 $$invalidate(12, pipVal = function (val) {
    				return min + val * step * pipstep;
    			});
    		}

    		if ($$self.$$.dirty & /*values*/ 131072) {
    			 $$invalidate(13, isSelected = function (val) {
    				return values.some(v => v === val);
    			});
    		}

    		if ($$self.$$.dirty & /*range, values*/ 163840) {
    			 $$invalidate(14, inRange = function (val) {
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

    		init(this, options, instance, create_fragment, safe_not_equal, {
    			range: 15,
    			min: 0,
    			max: 1,
    			step: 16,
    			values: 17,
    			vertical: 2,
    			pipstep: 18,
    			first: 3,
    			last: 4,
    			rest: 5,
    			prefix: 6,
    			suffix: 7,
    			formatter: 8,
    			focus: 9,
    			percentOf: 10
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "RangePips",
    			options,
    			id: create_fragment.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*focus*/ ctx[9] === undefined && !("focus" in props)) {
    			console.warn("<RangePips> was created without expected prop 'focus'");
    		}

    		if (/*percentOf*/ ctx[10] === undefined && !("percentOf" in props)) {
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
    const file$1 = "node_modules/svelte-range-slider-pips/src/RangeSlider.svelte";

    function get_each_context$1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[48] = list[i];
    	child_ctx[50] = i;
    	return child_ctx;
    }

    // (621:6) {#if float}
    function create_if_block_2$1(ctx) {
    	let span;
    	let t0;
    	let t1_value = /*handleFormatter*/ ctx[16](/*value*/ ctx[48]) + "";
    	let t1;
    	let t2;

    	const block = {
    		c: function create() {
    			span = element("span");
    			t0 = text(/*prefix*/ ctx[13]);
    			t1 = text(t1_value);
    			t2 = text(/*suffix*/ ctx[14]);
    			attr_dev(span, "class", "rangeFloat");
    			add_location(span, file$1, 621, 8, 17600);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, span, anchor);
    			append_dev(span, t0);
    			append_dev(span, t1);
    			append_dev(span, t2);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*prefix*/ 8192) set_data_dev(t0, /*prefix*/ ctx[13]);
    			if (dirty[0] & /*handleFormatter, values*/ 65537 && t1_value !== (t1_value = /*handleFormatter*/ ctx[16](/*value*/ ctx[48]) + "")) set_data_dev(t1, t1_value);
    			if (dirty[0] & /*suffix*/ 16384) set_data_dev(t2, /*suffix*/ ctx[14]);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(span);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_2$1.name,
    		type: "if",
    		source: "(621:6) {#if float}",
    		ctx
    	});

    	return block;
    }

    // (605:2) {#each values as value, index}
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
    			add_location(span0, file$1, 619, 6, 17548);
    			attr_dev(span1, "role", "slider");
    			attr_dev(span1, "class", "rangeHandle");
    			attr_dev(span1, "tabindex", "0");
    			attr_dev(span1, "style", span1_style_value = "" + ((/*vertical*/ ctx[5] ? "top" : "left") + ": " + /*$springPositions*/ ctx[21][/*index*/ ctx[50]] + "%; z-index: " + (/*activeHandle*/ ctx[19] === /*index*/ ctx[50] ? 3 : 2) + ";"));

    			attr_dev(span1, "aria-valuemin", span1_aria_valuemin_value = /*range*/ ctx[1] === true && /*index*/ ctx[50] === 1
    			? /*values*/ ctx[0][0]
    			: /*min*/ ctx[2]);

    			attr_dev(span1, "aria-valuemax", span1_aria_valuemax_value = /*range*/ ctx[1] === true && /*index*/ ctx[50] === 0
    			? /*values*/ ctx[0][1]
    			: /*max*/ ctx[3]);

    			attr_dev(span1, "aria-valuenow", span1_aria_valuenow_value = /*value*/ ctx[48]);
    			attr_dev(span1, "aria-valuetext", span1_aria_valuetext_value = "" + (/*prefix*/ ctx[13] + /*handleFormatter*/ ctx[16](/*value*/ ctx[48]) + /*suffix*/ ctx[14]));
    			attr_dev(span1, "aria-orientation", span1_aria_orientation_value = /*vertical*/ ctx[5] ? "vertical" : "horizontal");
    			toggle_class(span1, "active", /*focus*/ ctx[18] && /*activeHandle*/ ctx[19] === /*index*/ ctx[50]);
    			add_location(span1, file$1, 605, 4, 16908);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, span1, anchor);
    			append_dev(span1, span0);
    			append_dev(span1, t);
    			if (if_block) if_block.m(span1, null);

    			if (!mounted) {
    				dispose = [
    					listen_dev(span1, "blur", /*sliderBlurHandle*/ ctx[25], false, false, false),
    					listen_dev(span1, "focus", /*sliderFocusHandle*/ ctx[26], false, false, false),
    					listen_dev(span1, "keydown", /*sliderKeydown*/ ctx[27], false, false, false)
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

    			if (dirty[0] & /*vertical, $springPositions, activeHandle*/ 2621472 && span1_style_value !== (span1_style_value = "" + ((/*vertical*/ ctx[5] ? "top" : "left") + ": " + /*$springPositions*/ ctx[21][/*index*/ ctx[50]] + "%; z-index: " + (/*activeHandle*/ ctx[19] === /*index*/ ctx[50] ? 3 : 2) + ";"))) {
    				attr_dev(span1, "style", span1_style_value);
    			}

    			if (dirty[0] & /*range, values, min*/ 7 && span1_aria_valuemin_value !== (span1_aria_valuemin_value = /*range*/ ctx[1] === true && /*index*/ ctx[50] === 1
    			? /*values*/ ctx[0][0]
    			: /*min*/ ctx[2])) {
    				attr_dev(span1, "aria-valuemin", span1_aria_valuemin_value);
    			}

    			if (dirty[0] & /*range, values, max*/ 11 && span1_aria_valuemax_value !== (span1_aria_valuemax_value = /*range*/ ctx[1] === true && /*index*/ ctx[50] === 0
    			? /*values*/ ctx[0][1]
    			: /*max*/ ctx[3])) {
    				attr_dev(span1, "aria-valuemax", span1_aria_valuemax_value);
    			}

    			if (dirty[0] & /*values*/ 1 && span1_aria_valuenow_value !== (span1_aria_valuenow_value = /*value*/ ctx[48])) {
    				attr_dev(span1, "aria-valuenow", span1_aria_valuenow_value);
    			}

    			if (dirty[0] & /*prefix, handleFormatter, values, suffix*/ 90113 && span1_aria_valuetext_value !== (span1_aria_valuetext_value = "" + (/*prefix*/ ctx[13] + /*handleFormatter*/ ctx[16](/*value*/ ctx[48]) + /*suffix*/ ctx[14]))) {
    				attr_dev(span1, "aria-valuetext", span1_aria_valuetext_value);
    			}

    			if (dirty[0] & /*vertical*/ 32 && span1_aria_orientation_value !== (span1_aria_orientation_value = /*vertical*/ ctx[5] ? "vertical" : "horizontal")) {
    				attr_dev(span1, "aria-orientation", span1_aria_orientation_value);
    			}

    			if (dirty[0] & /*focus, activeHandle*/ 786432) {
    				toggle_class(span1, "active", /*focus*/ ctx[18] && /*activeHandle*/ ctx[19] === /*index*/ ctx[50]);
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
    		source: "(605:2) {#each values as value, index}",
    		ctx
    	});

    	return block;
    }

    // (626:2) {#if range}
    function create_if_block_1$1(ctx) {
    	let span;
    	let span_style_value;

    	const block = {
    		c: function create() {
    			span = element("span");
    			attr_dev(span, "class", "rangeBar");
    			attr_dev(span, "style", span_style_value = "" + ((/*vertical*/ ctx[5] ? "top" : "left") + ": " + /*rangeStart*/ ctx[23](/*$springPositions*/ ctx[21]) + "%; " + (/*vertical*/ ctx[5] ? "bottom" : "right") + ":\n      " + /*rangeEnd*/ ctx[24](/*$springPositions*/ ctx[21]) + "%;"));
    			add_location(span, file$1, 626, 4, 17725);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, span, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*vertical, $springPositions*/ 2097184 && span_style_value !== (span_style_value = "" + ((/*vertical*/ ctx[5] ? "top" : "left") + ": " + /*rangeStart*/ ctx[23](/*$springPositions*/ ctx[21]) + "%; " + (/*vertical*/ ctx[5] ? "bottom" : "right") + ":\n      " + /*rangeEnd*/ ctx[24](/*$springPositions*/ ctx[21]) + "%;"))) {
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
    		source: "(626:2) {#if range}",
    		ctx
    	});

    	return block;
    }

    // (632:2) {#if pips}
    function create_if_block$1(ctx) {
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
    				first: /*first*/ ctx[9],
    				last: /*last*/ ctx[10],
    				rest: /*rest*/ ctx[11],
    				pipstep: /*pipstep*/ ctx[8],
    				prefix: /*prefix*/ ctx[13],
    				suffix: /*suffix*/ ctx[14],
    				formatter: /*formatter*/ ctx[15],
    				focus: /*focus*/ ctx[18],
    				percentOf: /*percentOf*/ ctx[20]
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
    			if (dirty[0] & /*first*/ 512) rangepips_changes.first = /*first*/ ctx[9];
    			if (dirty[0] & /*last*/ 1024) rangepips_changes.last = /*last*/ ctx[10];
    			if (dirty[0] & /*rest*/ 2048) rangepips_changes.rest = /*rest*/ ctx[11];
    			if (dirty[0] & /*pipstep*/ 256) rangepips_changes.pipstep = /*pipstep*/ ctx[8];
    			if (dirty[0] & /*prefix*/ 8192) rangepips_changes.prefix = /*prefix*/ ctx[13];
    			if (dirty[0] & /*suffix*/ 16384) rangepips_changes.suffix = /*suffix*/ ctx[14];
    			if (dirty[0] & /*formatter*/ 32768) rangepips_changes.formatter = /*formatter*/ ctx[15];
    			if (dirty[0] & /*focus*/ 262144) rangepips_changes.focus = /*focus*/ ctx[18];
    			if (dirty[0] & /*percentOf*/ 1048576) rangepips_changes.percentOf = /*percentOf*/ ctx[20];
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
    		id: create_if_block$1.name,
    		type: "if",
    		source: "(632:2) {#if pips}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$1(ctx) {
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
    	let if_block1 = /*pips*/ ctx[7] && create_if_block$1(ctx);

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
    			attr_dev(div, "id", /*id*/ ctx[12]);
    			attr_dev(div, "class", "rangeSlider");
    			toggle_class(div, "min", /*range*/ ctx[1] === "min");
    			toggle_class(div, "range", /*range*/ ctx[1]);
    			toggle_class(div, "vertical", /*vertical*/ ctx[5]);
    			toggle_class(div, "focus", /*focus*/ ctx[18]);
    			toggle_class(div, "max", /*range*/ ctx[1] === "max");
    			toggle_class(div, "pips", /*pips*/ ctx[7]);
    			toggle_class(div, "pip-labels", /*first*/ ctx[9] === "label" || /*last*/ ctx[10] === "label" || /*rest*/ ctx[11] === "label");
    			add_location(div, file$1, 591, 0, 16528);
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
    			/*div_binding*/ ctx[36](div);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(window, "mousedown", /*bodyInteractStart*/ ctx[29], false, false, false),
    					listen_dev(window, "touchstart", /*bodyInteractStart*/ ctx[29], false, false, false),
    					listen_dev(window, "mousemove", /*bodyInteract*/ ctx[30], false, false, false),
    					listen_dev(window, "touchmove", /*bodyInteract*/ ctx[30], false, false, false),
    					listen_dev(window, "mouseup", /*bodyMouseUp*/ ctx[31], false, false, false),
    					listen_dev(window, "touchend", /*bodyTouchEnd*/ ctx[32], false, false, false),
    					listen_dev(window, "keydown", /*bodyKeyDown*/ ctx[33], false, false, false),
    					listen_dev(div, "touchstart", prevent_default(/*sliderInteractStart*/ ctx[28]), false, true, false),
    					listen_dev(div, "mousedown", /*sliderInteractStart*/ ctx[28], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*vertical, $springPositions, activeHandle, range, values, min, max, prefix, handleFormatter, suffix, focus, sliderKeydown, sliderBlurHandle, sliderFocusHandle, float*/ 237854831) {
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

    			if (/*pips*/ ctx[7]) {
    				if (if_block1) {
    					if_block1.p(ctx, dirty);

    					if (dirty[0] & /*pips*/ 128) {
    						transition_in(if_block1, 1);
    					}
    				} else {
    					if_block1 = create_if_block$1(ctx);
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

    			if (!current || dirty[0] & /*id*/ 4096) {
    				attr_dev(div, "id", /*id*/ ctx[12]);
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

    			if (dirty[0] & /*focus*/ 262144) {
    				toggle_class(div, "focus", /*focus*/ ctx[18]);
    			}

    			if (dirty[0] & /*range*/ 2) {
    				toggle_class(div, "max", /*range*/ ctx[1] === "max");
    			}

    			if (dirty[0] & /*pips*/ 128) {
    				toggle_class(div, "pips", /*pips*/ ctx[7]);
    			}

    			if (dirty[0] & /*first, last, rest*/ 3584) {
    				toggle_class(div, "pip-labels", /*first*/ ctx[9] === "label" || /*last*/ ctx[10] === "label" || /*rest*/ ctx[11] === "label");
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
    			/*div_binding*/ ctx[36](null);
    			mounted = false;
    			run_all(dispose);
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

    function instance$1($$self, $$props, $$invalidate) {
    	let $springPositions;
    	let { range = false } = $$props;
    	let { min = 0 } = $$props;
    	let { max = 100 } = $$props;
    	let { step = 1 } = $$props;
    	let { values = [(max + min) / 2] } = $$props;
    	let { vertical = false } = $$props;
    	let { float = false } = $$props;
    	let { pips = false } = $$props;
    	let { pipstep } = $$props;
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
    	component_subscribe($$self, springPositions, value => $$invalidate(21, $springPositions = value));

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
    			$$invalidate(18, focus = false);
    			handleActivated = false;
    		}
    	}

    	/**
     * when the user focusses the handle of a slider
     * set it to be active
     * @param {event} e the event from browser
     **/
    	function sliderFocusHandle(e) {
    		$$invalidate(19, activeHandle = index(e.target));
    		$$invalidate(18, focus = true);
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
    		$$invalidate(18, focus = true);

    		handleActivated = true;
    		$$invalidate(19, activeHandle = getClosestHandle(p));

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
    			$$invalidate(18, focus = false);
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
    			$$invalidate(18, focus = true);

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
    		"pips",
    		"pipstep",
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
    			$$invalidate(17, slider);
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
    		if ("pips" in $$props) $$invalidate(7, pips = $$props.pips);
    		if ("pipstep" in $$props) $$invalidate(8, pipstep = $$props.pipstep);
    		if ("first" in $$props) $$invalidate(9, first = $$props.first);
    		if ("last" in $$props) $$invalidate(10, last = $$props.last);
    		if ("rest" in $$props) $$invalidate(11, rest = $$props.rest);
    		if ("id" in $$props) $$invalidate(12, id = $$props.id);
    		if ("prefix" in $$props) $$invalidate(13, prefix = $$props.prefix);
    		if ("suffix" in $$props) $$invalidate(14, suffix = $$props.suffix);
    		if ("formatter" in $$props) $$invalidate(15, formatter = $$props.formatter);
    		if ("handleFormatter" in $$props) $$invalidate(16, handleFormatter = $$props.handleFormatter);
    		if ("precision" in $$props) $$invalidate(34, precision = $$props.precision);
    		if ("springValues" in $$props) $$invalidate(35, springValues = $$props.springValues);
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
    		pips,
    		pipstep,
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
    		if ("pips" in $$props) $$invalidate(7, pips = $$props.pips);
    		if ("pipstep" in $$props) $$invalidate(8, pipstep = $$props.pipstep);
    		if ("first" in $$props) $$invalidate(9, first = $$props.first);
    		if ("last" in $$props) $$invalidate(10, last = $$props.last);
    		if ("rest" in $$props) $$invalidate(11, rest = $$props.rest);
    		if ("id" in $$props) $$invalidate(12, id = $$props.id);
    		if ("prefix" in $$props) $$invalidate(13, prefix = $$props.prefix);
    		if ("suffix" in $$props) $$invalidate(14, suffix = $$props.suffix);
    		if ("formatter" in $$props) $$invalidate(15, formatter = $$props.formatter);
    		if ("handleFormatter" in $$props) $$invalidate(16, handleFormatter = $$props.handleFormatter);
    		if ("precision" in $$props) $$invalidate(34, precision = $$props.precision);
    		if ("springValues" in $$props) $$invalidate(35, springValues = $$props.springValues);
    		if ("slider" in $$props) $$invalidate(17, slider = $$props.slider);
    		if ("focus" in $$props) $$invalidate(18, focus = $$props.focus);
    		if ("handleActivated" in $$props) handleActivated = $$props.handleActivated;
    		if ("keyboardActive" in $$props) keyboardActive = $$props.keyboardActive;
    		if ("activeHandle" in $$props) $$invalidate(19, activeHandle = $$props.activeHandle);
    		if ("springPositions" in $$props) $$invalidate(22, springPositions = $$props.springPositions);
    		if ("alignValueToStep" in $$props) $$invalidate(39, alignValueToStep = $$props.alignValueToStep);
    		if ("percentOf" in $$props) $$invalidate(20, percentOf = $$props.percentOf);
    		if ("clampValue" in $$props) $$invalidate(40, clampValue = $$props.clampValue);
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
    			 $$invalidate(40, clampValue = function (val) {
    				// return the min/max if outside of that range
    				return val <= min ? min : val >= max ? max : val;
    			});
    		}

    		if ($$self.$$.dirty[0] & /*min, max, step*/ 28 | $$self.$$.dirty[1] & /*clampValue, precision*/ 520) {
    			/**
     * align the value with the steps so that it
     * always sits on the closest (above/below) step
     * @param {number} val the value to align
     * @return {number} the value after it's been aligned
     **/
    			 $$invalidate(39, alignValueToStep = function (val) {
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

    		if ($$self.$$.dirty[0] & /*values*/ 1 | $$self.$$.dirty[1] & /*alignValueToStep*/ 256) {
    			// watch the values array, and trim / clamp the values to the steps
    			// and boundaries set up in the slider on change
    			 $$invalidate(0, values = trimRange(values).map(v => alignValueToStep(v)));
    		}

    		if ($$self.$$.dirty[0] & /*min, max*/ 12 | $$self.$$.dirty[1] & /*precision*/ 8) {
    			/**
     * take in a value, and then calculate that value's percentage
     * of the overall range (min-max);
     * @param {number} val the value we're getting percent for
     * @return {number} the percentage value
     **/
    			 $$invalidate(20, percentOf = function (val) {
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

    		if ($$self.$$.dirty[0] & /*values, percentOf*/ 1048577) {
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
    		pips,
    		pipstep,
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
    			instance$1,
    			create_fragment$1,
    			safe_not_equal,
    			{
    				range: 1,
    				min: 2,
    				max: 3,
    				step: 4,
    				values: 0,
    				vertical: 5,
    				float: 6,
    				pips: 7,
    				pipstep: 8,
    				first: 9,
    				last: 10,
    				rest: 11,
    				id: 12,
    				prefix: 13,
    				suffix: 14,
    				formatter: 15,
    				handleFormatter: 16,
    				precision: 34,
    				springValues: 35
    			},
    			[-1, -1]
    		);

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "RangeSlider",
    			options,
    			id: create_fragment$1.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*pipstep*/ ctx[8] === undefined && !("pipstep" in props)) {
    			console.warn("<RangeSlider> was created without expected prop 'pipstep'");
    		}

    		if (/*first*/ ctx[9] === undefined && !("first" in props)) {
    			console.warn("<RangeSlider> was created without expected prop 'first'");
    		}

    		if (/*last*/ ctx[10] === undefined && !("last" in props)) {
    			console.warn("<RangeSlider> was created without expected prop 'last'");
    		}

    		if (/*rest*/ ctx[11] === undefined && !("rest" in props)) {
    			console.warn("<RangeSlider> was created without expected prop 'rest'");
    		}

    		if (/*id*/ ctx[12] === undefined && !("id" in props)) {
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
    const file$2 = "node_modules/svelte-prism/src/Prism.svelte";

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
    function create_if_block$2(ctx) {
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
    		id: create_if_block$2.name,
    		type: "if",
    		source: "(35:4) {#if language === 'none'}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$2(ctx) {
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
    		if (/*language*/ ctx[0] === "none") return create_if_block$2;
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
    			add_location(code0, file$2, 28, 0, 766);
    			attr_dev(code1, "class", code1_class_value = "language-" + /*language*/ ctx[0]);
    			add_location(code1, file$2, 33, 2, 902);
    			attr_dev(pre, "class", pre_class_value = "language-" + /*language*/ ctx[0]);
    			attr_dev(pre, "command-line", "");
    			attr_dev(pre, "data-output", "2-17");
    			add_location(pre, file$2, 32, 0, 834);
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
    		id: create_fragment$2.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    const prism$1 = prism;
    const highlight = prism.highlightElement;
    const globalConfig = { transform: x => x };

    function instance$2($$self, $$props, $$invalidate) {
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
    		init(this, options, instance$2, create_fragment$2, safe_not_equal, { language: 0, source: 3, transform: 4 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Prism",
    			options,
    			id: create_fragment$2.name
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

    /* src/Components/Example.svelte generated by Svelte v3.24.0 */

    const file$3 = "src/Components/Example.svelte";
    const get_code_slot_changes = dirty => ({});
    const get_code_slot_context = ctx => ({});
    const get_slider_slot_changes = dirty => ({});
    const get_slider_slot_context = ctx => ({});

    // (103:26)          
    function fallback_block_1(ctx) {
    	let rangeslider;
    	let updating_values;
    	let current;

    	function rangeslider_values_binding(value) {
    		/*rangeslider_values_binding*/ ctx[5].call(null, value);
    	}

    	let rangeslider_props = {};

    	if (/*values*/ ctx[1] !== void 0) {
    		rangeslider_props.values = /*values*/ ctx[1];
    	}

    	rangeslider = new RangeSlider({ props: rangeslider_props, $$inline: true });
    	binding_callbacks.push(() => bind(rangeslider, "values", rangeslider_values_binding));

    	const block = {
    		c: function create() {
    			create_component(rangeslider.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(rangeslider, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const rangeslider_changes = {};

    			if (!updating_values && dirty & /*values*/ 2) {
    				updating_values = true;
    				rangeslider_changes.values = /*values*/ ctx[1];
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
    			destroy_component(rangeslider, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: fallback_block_1.name,
    		type: "fallback",
    		source: "(103:26)          ",
    		ctx
    	});

    	return block;
    }

    // (107:6) {#if values}
    function create_if_block$3(ctx) {
    	let span;
    	let t0;
    	let code;
    	let t1;
    	let t2;
    	let t3;

    	const block = {
    		c: function create() {
    			span = element("span");
    			t0 = text("values: ");
    			code = element("code");
    			t1 = text("[");
    			t2 = text(/*values*/ ctx[1]);
    			t3 = text("]");
    			add_location(code, file$3, 107, 35, 2069);
    			attr_dev(span, "class", "values svelte-1t9hhd1");
    			add_location(span, file$3, 107, 6, 2040);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, span, anchor);
    			append_dev(span, t0);
    			append_dev(span, code);
    			append_dev(code, t1);
    			append_dev(code, t2);
    			append_dev(code, t3);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*values*/ 2) set_data_dev(t2, /*values*/ ctx[1]);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(span);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$3.name,
    		type: "if",
    		source: "(107:6) {#if values}",
    		ctx
    	});

    	return block;
    }

    // (116:26) &lt;RangeSlider /&gt;
    function fallback_block(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("<RangeSlider />");
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
    		id: fallback_block.name,
    		type: "fallback",
    		source: "(116:26) &lt;RangeSlider /&gt;",
    		ctx
    	});

    	return block;
    }

    // (115:6) <Prism language="svelte">
    function create_default_slot(ctx) {
    	let current;
    	const code_slot_template = /*$$slots*/ ctx[2].code;
    	const code_slot = create_slot(code_slot_template, ctx, /*$$scope*/ ctx[6], get_code_slot_context);
    	const code_slot_or_fallback = code_slot || fallback_block(ctx);

    	const block = {
    		c: function create() {
    			if (code_slot_or_fallback) code_slot_or_fallback.c();
    		},
    		m: function mount(target, anchor) {
    			if (code_slot_or_fallback) {
    				code_slot_or_fallback.m(target, anchor);
    			}

    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (code_slot) {
    				if (code_slot.p && dirty & /*$$scope*/ 64) {
    					update_slot(code_slot, code_slot_template, ctx, /*$$scope*/ ctx[6], dirty, get_code_slot_changes, get_code_slot_context);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(code_slot_or_fallback, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(code_slot_or_fallback, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (code_slot_or_fallback) code_slot_or_fallback.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot.name,
    		type: "slot",
    		source: "(115:6) <Prism language=\\\"svelte\\\">",
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
    	let div5;
    	let div3;
    	let t2;
    	let t3;
    	let div4;
    	let prism;
    	let current;
    	let mounted;
    	let dispose;
    	const slider_slot_template = /*$$slots*/ ctx[2].slider;
    	const slider_slot = create_slot(slider_slot_template, ctx, /*$$scope*/ ctx[6], get_slider_slot_context);
    	const slider_slot_or_fallback = slider_slot || fallback_block_1(ctx);
    	let if_block = /*values*/ ctx[1] && create_if_block$3(ctx);

    	prism = new Prism$1({
    			props: {
    				language: "svelte",
    				$$slots: { default: [create_default_slot] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

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
    			div5 = element("div");
    			div3 = element("div");
    			if (slider_slot_or_fallback) slider_slot_or_fallback.c();
    			t2 = space();
    			if (if_block) if_block.c();
    			t3 = space();
    			div4 = element("div");
    			create_component(prism.$$.fragment);
    			if (img0.src !== (img0_src_value = "public/images/icons8-search-100.png")) attr_dev(img0, "src", img0_src_value);
    			attr_dev(img0, "alt", "icon of a magnifying glass, for viewing the output slider");
    			attr_dev(img0, "class", "svelte-1t9hhd1");
    			add_location(img0, file$3, 83, 6, 1429);
    			attr_dev(div0, "class", "tab tab-view svelte-1t9hhd1");
    			toggle_class(div0, "active", /*active*/ ctx[0] === "view");
    			add_location(div0, file$3, 77, 4, 1293);
    			if (img1.src !== (img1_src_value = "public/images/icons8-code-100.png")) attr_dev(img1, "src", img1_src_value);
    			attr_dev(img1, "alt", "icon of a code editor, for viewing the input code");
    			attr_dev(img1, "class", "svelte-1t9hhd1");
    			add_location(img1, file$3, 93, 6, 1710);
    			attr_dev(div1, "class", "tab tab-code svelte-1t9hhd1");
    			toggle_class(div1, "active", /*active*/ ctx[0] === "code");
    			add_location(div1, file$3, 87, 4, 1574);
    			attr_dev(div2, "class", "tabs svelte-1t9hhd1");
    			toggle_class(div2, "border", /*active*/ ctx[0] === "view");
    			add_location(div2, file$3, 76, 2, 1237);
    			attr_dev(div3, "class", "slot slider svelte-1t9hhd1");
    			toggle_class(div3, "active", /*active*/ ctx[0] === "view");
    			add_location(div3, file$3, 100, 4, 1877);
    			attr_dev(div4, "class", "slot code svelte-1t9hhd1");
    			toggle_class(div4, "active", /*active*/ ctx[0] === "code");
    			add_location(div4, file$3, 112, 4, 2135);
    			attr_dev(div5, "class", "slots svelte-1t9hhd1");
    			add_location(div5, file$3, 99, 2, 1853);
    			attr_dev(section, "class", "example svelte-1t9hhd1");
    			add_location(section, file$3, 74, 0, 1208);
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
    			append_dev(section, div5);
    			append_dev(div5, div3);

    			if (slider_slot_or_fallback) {
    				slider_slot_or_fallback.m(div3, null);
    			}

    			append_dev(div3, t2);
    			if (if_block) if_block.m(div3, null);
    			append_dev(div5, t3);
    			append_dev(div5, div4);
    			mount_component(prism, div4, null);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(div0, "click", /*click_handler*/ ctx[3], false, false, false),
    					listen_dev(div1, "click", /*click_handler_1*/ ctx[4], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*active*/ 1) {
    				toggle_class(div0, "active", /*active*/ ctx[0] === "view");
    			}

    			if (dirty & /*active*/ 1) {
    				toggle_class(div1, "active", /*active*/ ctx[0] === "code");
    			}

    			if (dirty & /*active*/ 1) {
    				toggle_class(div2, "border", /*active*/ ctx[0] === "view");
    			}

    			if (slider_slot) {
    				if (slider_slot.p && dirty & /*$$scope*/ 64) {
    					update_slot(slider_slot, slider_slot_template, ctx, /*$$scope*/ ctx[6], dirty, get_slider_slot_changes, get_slider_slot_context);
    				}
    			} else {
    				if (slider_slot_or_fallback && slider_slot_or_fallback.p && dirty & /*values*/ 2) {
    					slider_slot_or_fallback.p(ctx, dirty);
    				}
    			}

    			if (/*values*/ ctx[1]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block$3(ctx);
    					if_block.c();
    					if_block.m(div3, null);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}

    			if (dirty & /*active*/ 1) {
    				toggle_class(div3, "active", /*active*/ ctx[0] === "view");
    			}

    			const prism_changes = {};

    			if (dirty & /*$$scope*/ 64) {
    				prism_changes.$$scope = { dirty, ctx };
    			}

    			prism.$set(prism_changes);

    			if (dirty & /*active*/ 1) {
    				toggle_class(div4, "active", /*active*/ ctx[0] === "code");
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(slider_slot_or_fallback, local);
    			transition_in(prism.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(slider_slot_or_fallback, local);
    			transition_out(prism.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(section);
    			if (slider_slot_or_fallback) slider_slot_or_fallback.d(detaching);
    			if (if_block) if_block.d();
    			destroy_component(prism);
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
    	let { active = "view" } = $$props;
    	let { values } = $$props;
    	const writable_props = ["active", "values"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Example> was created with unknown prop '${key}'`);
    	});

    	let { $$slots = {}, $$scope } = $$props;
    	validate_slots("Example", $$slots, ['slider','code']);

    	const click_handler = () => {
    		$$invalidate(0, active = "view");
    	};

    	const click_handler_1 = () => {
    		$$invalidate(0, active = "code");
    	};

    	function rangeslider_values_binding(value) {
    		values = value;
    		$$invalidate(1, values);
    	}

    	$$self.$set = $$props => {
    		if ("active" in $$props) $$invalidate(0, active = $$props.active);
    		if ("values" in $$props) $$invalidate(1, values = $$props.values);
    		if ("$$scope" in $$props) $$invalidate(6, $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => ({ Prism: Prism$1, RangeSlider, active, values });

    	$$self.$inject_state = $$props => {
    		if ("active" in $$props) $$invalidate(0, active = $$props.active);
    		if ("values" in $$props) $$invalidate(1, values = $$props.values);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		active,
    		values,
    		$$slots,
    		click_handler,
    		click_handler_1,
    		rangeslider_values_binding,
    		$$scope
    	];
    }

    class Example extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$3, create_fragment$3, safe_not_equal, { active: 0, values: 1 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Example",
    			options,
    			id: create_fragment$3.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*values*/ ctx[1] === undefined && !("values" in props)) {
    			console.warn("<Example> was created without expected prop 'values'");
    		}
    	}

    	get active() {
    		throw new Error("<Example>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set active(value) {
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
    	let td50;
    	let code40;
    	let t141;
    	let td51;
    	let t143;
    	let tr14;
    	let td52;
    	let strong14;
    	let t145;
    	let td53;
    	let code41;
    	let t147;
    	let td54;
    	let code42;
    	let t149;
    	let td55;
    	let t151;
    	let tr15;
    	let td56;
    	let strong15;
    	let t153;
    	let td57;
    	let code43;
    	let t155;
    	let td58;
    	let code44;
    	let t157;
    	let td59;
    	let t159;
    	let tr16;
    	let td60;
    	let strong16;
    	let t161;
    	let td61;
    	let code45;
    	let t163;
    	let td62;
    	let code46;
    	let t165;
    	let td63;
    	let t166;
    	let code47;
    	let t168;
    	let t169;
    	let tr17;
    	let td64;
    	let strong17;
    	let t171;
    	let td65;
    	let code48;
    	let t173;
    	let td66;
    	let code49;
    	let t175;
    	let td67;

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
    			strong9.textContent = "pipStep";
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
    			strong10.textContent = "first";
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
    			code29.textContent = "false";
    			t107 = space();
    			td39 = element("td");
    			t108 = text("Whether to show a pip or label for the first value on slider. Use ");
    			code30 = element("code");
    			code30.textContent = "first='label'";
    			t110 = text(" to show a label value");
    			t111 = space();
    			tr11 = element("tr");
    			td40 = element("td");
    			strong11 = element("strong");
    			strong11.textContent = "last";
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
    			t120 = text("Whether to show a pip or label for the last value on slider. Use ");
    			code34 = element("code");
    			code34.textContent = "last='label'";
    			t122 = text(" to show a label value");
    			t123 = space();
    			tr12 = element("tr");
    			td44 = element("td");
    			strong12 = element("strong");
    			strong12.textContent = "rest";
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
    			t132 = text("Whether to show a pip or label for the all other values. Use ");
    			code38 = element("code");
    			code38.textContent = "rest='label'";
    			t134 = text(" to show a label value");
    			t135 = space();
    			tr13 = element("tr");
    			td48 = element("td");
    			strong13 = element("strong");
    			strong13.textContent = "prefix";
    			t137 = space();
    			td49 = element("td");
    			code39 = element("code");
    			code39.textContent = "String";
    			t139 = space();
    			td50 = element("td");
    			code40 = element("code");
    			code40.textContent = "\"\"";
    			t141 = space();
    			td51 = element("td");
    			td51.textContent = "A string to prefix to all displayed values";
    			t143 = space();
    			tr14 = element("tr");
    			td52 = element("td");
    			strong14 = element("strong");
    			strong14.textContent = "suffix";
    			t145 = space();
    			td53 = element("td");
    			code41 = element("code");
    			code41.textContent = "String";
    			t147 = space();
    			td54 = element("td");
    			code42 = element("code");
    			code42.textContent = "\"\"";
    			t149 = space();
    			td55 = element("td");
    			td55.textContent = "A string to suffix to all displayed values";
    			t151 = space();
    			tr15 = element("tr");
    			td56 = element("td");
    			strong15 = element("strong");
    			strong15.textContent = "formatter";
    			t153 = space();
    			td57 = element("td");
    			code43 = element("code");
    			code43.textContent = "Function";
    			t155 = space();
    			td58 = element("td");
    			code44 = element("code");
    			code44.textContent = "(v) => v";
    			t157 = space();
    			td59 = element("td");
    			td59.textContent = "A function to re-format values before they are displayed";
    			t159 = space();
    			tr16 = element("tr");
    			td60 = element("td");
    			strong16 = element("strong");
    			strong16.textContent = "handleFormatter";
    			t161 = space();
    			td61 = element("td");
    			code45 = element("code");
    			code45.textContent = "Function";
    			t163 = space();
    			td62 = element("td");
    			code46 = element("code");
    			code46.textContent = "formatter";
    			t165 = space();
    			td63 = element("td");
    			t166 = text("A function to re-format values on the handle/float before they are displayed. Defaults to the same function given to the ");
    			code47 = element("code");
    			code47.textContent = "formatter";
    			t168 = text(" property");
    			t169 = space();
    			tr17 = element("tr");
    			td64 = element("td");
    			strong17 = element("strong");
    			strong17.textContent = "springValues";
    			t171 = space();
    			td65 = element("td");
    			code48 = element("code");
    			code48.textContent = "Object";
    			t173 = space();
    			td66 = element("td");
    			code49 = element("code");
    			code49.textContent = "{ stiffness: 0.15, damping: 0.4 }";
    			t175 = space();
    			td67 = element("td");
    			td67.textContent = "Svelte spring physics object to change the behaviour of the handle when moving";
    			attr_dev(th0, "align", "left");
    			attr_dev(th0, "class", "svelte-1bf8eo7");
    			add_location(th0, file$4, 4, 0, 49);
    			attr_dev(th1, "align", "left");
    			attr_dev(th1, "class", "svelte-1bf8eo7");
    			add_location(th1, file$4, 5, 0, 76);
    			attr_dev(th2, "align", "left");
    			attr_dev(th2, "class", "svelte-1bf8eo7");
    			add_location(th2, file$4, 6, 0, 103);
    			attr_dev(th3, "class", "svelte-1bf8eo7");
    			add_location(th3, file$4, 7, 0, 133);
    			attr_dev(tr0, "class", "svelte-1bf8eo7");
    			add_location(tr0, file$4, 3, 0, 44);
    			attr_dev(thead, "class", "svelte-1bf8eo7");
    			add_location(thead, file$4, 2, 0, 36);
    			attr_dev(strong0, "class", "svelte-1bf8eo7");
    			add_location(strong0, file$4, 12, 17, 188);
    			attr_dev(td0, "align", "left");
    			attr_dev(td0, "class", "svelte-1bf8eo7");
    			add_location(td0, file$4, 12, 0, 171);
    			add_location(code0, file$4, 13, 17, 234);
    			attr_dev(td1, "align", "left");
    			attr_dev(td1, "class", "svelte-1bf8eo7");
    			add_location(td1, file$4, 13, 0, 217);
    			add_location(code1, file$4, 14, 17, 275);
    			attr_dev(td2, "align", "left");
    			attr_dev(td2, "class", "svelte-1bf8eo7");
    			add_location(td2, file$4, 14, 0, 258);
    			attr_dev(strong1, "class", "svelte-1bf8eo7");
    			add_location(strong1, file$4, 15, 91, 389);
    			add_location(code2, file$4, 15, 128, 426);
    			add_location(em, file$4, 15, 87, 385);
    			attr_dev(td3, "class", "svelte-1bf8eo7");
    			add_location(td3, file$4, 15, 0, 298);
    			attr_dev(tr1, "class", "svelte-1bf8eo7");
    			add_location(tr1, file$4, 11, 0, 166);
    			attr_dev(strong2, "class", "svelte-1bf8eo7");
    			add_location(strong2, file$4, 18, 17, 526);
    			attr_dev(td4, "align", "left");
    			attr_dev(td4, "class", "svelte-1bf8eo7");
    			add_location(td4, file$4, 18, 0, 509);
    			add_location(code3, file$4, 19, 17, 569);
    			attr_dev(td5, "align", "left");
    			attr_dev(td5, "class", "svelte-1bf8eo7");
    			add_location(td5, file$4, 19, 0, 552);
    			add_location(code4, file$4, 20, 17, 611);
    			attr_dev(td6, "align", "left");
    			attr_dev(td6, "class", "svelte-1bf8eo7");
    			add_location(td6, file$4, 20, 0, 594);
    			attr_dev(td7, "class", "svelte-1bf8eo7");
    			add_location(td7, file$4, 21, 0, 631);
    			attr_dev(tr2, "class", "svelte-1bf8eo7");
    			add_location(tr2, file$4, 17, 0, 504);
    			attr_dev(strong3, "class", "svelte-1bf8eo7");
    			add_location(strong3, file$4, 24, 17, 697);
    			attr_dev(td8, "align", "left");
    			attr_dev(td8, "class", "svelte-1bf8eo7");
    			add_location(td8, file$4, 24, 0, 680);
    			add_location(code5, file$4, 25, 17, 740);
    			attr_dev(td9, "align", "left");
    			attr_dev(td9, "class", "svelte-1bf8eo7");
    			add_location(td9, file$4, 25, 0, 723);
    			add_location(code6, file$4, 26, 17, 782);
    			attr_dev(td10, "align", "left");
    			attr_dev(td10, "class", "svelte-1bf8eo7");
    			add_location(td10, file$4, 26, 0, 765);
    			attr_dev(td11, "class", "svelte-1bf8eo7");
    			add_location(td11, file$4, 27, 0, 804);
    			attr_dev(tr3, "class", "svelte-1bf8eo7");
    			add_location(tr3, file$4, 23, 0, 675);
    			attr_dev(strong4, "class", "svelte-1bf8eo7");
    			add_location(strong4, file$4, 30, 17, 870);
    			attr_dev(td12, "align", "left");
    			attr_dev(td12, "class", "svelte-1bf8eo7");
    			add_location(td12, file$4, 30, 0, 853);
    			add_location(code7, file$4, 31, 17, 914);
    			attr_dev(td13, "align", "left");
    			attr_dev(td13, "class", "svelte-1bf8eo7");
    			add_location(td13, file$4, 31, 0, 897);
    			add_location(code8, file$4, 32, 17, 956);
    			attr_dev(td14, "align", "left");
    			attr_dev(td14, "class", "svelte-1bf8eo7");
    			add_location(td14, file$4, 32, 0, 939);
    			add_location(code9, file$4, 33, 10, 986);
    			attr_dev(td15, "class", "svelte-1bf8eo7");
    			add_location(td15, file$4, 33, 0, 976);
    			attr_dev(tr4, "class", "svelte-1bf8eo7");
    			add_location(tr4, file$4, 29, 0, 848);
    			attr_dev(strong5, "class", "svelte-1bf8eo7");
    			add_location(strong5, file$4, 36, 17, 1069);
    			attr_dev(td16, "align", "left");
    			attr_dev(td16, "class", "svelte-1bf8eo7");
    			add_location(td16, file$4, 36, 0, 1052);
    			add_location(code10, file$4, 37, 17, 1114);
    			add_location(code11, file$4, 37, 38, 1135);
    			attr_dev(td17, "align", "left");
    			attr_dev(td17, "class", "svelte-1bf8eo7");
    			add_location(td17, file$4, 37, 0, 1097);
    			add_location(code12, file$4, 38, 17, 1177);
    			attr_dev(td18, "align", "left");
    			attr_dev(td18, "class", "svelte-1bf8eo7");
    			add_location(td18, file$4, 38, 0, 1160);
    			add_location(code13, file$4, 39, 44, 1245);
    			add_location(code14, file$4, 39, 72, 1273);
    			attr_dev(td19, "class", "svelte-1bf8eo7");
    			add_location(td19, file$4, 39, 0, 1201);
    			attr_dev(tr5, "class", "svelte-1bf8eo7");
    			add_location(tr5, file$4, 35, 0, 1047);
    			attr_dev(strong6, "class", "svelte-1bf8eo7");
    			add_location(strong6, file$4, 42, 17, 1352);
    			attr_dev(td20, "align", "left");
    			attr_dev(td20, "class", "svelte-1bf8eo7");
    			add_location(td20, file$4, 42, 0, 1335);
    			add_location(code15, file$4, 43, 17, 1397);
    			attr_dev(td21, "align", "left");
    			attr_dev(td21, "class", "svelte-1bf8eo7");
    			add_location(td21, file$4, 43, 0, 1380);
    			add_location(code16, file$4, 44, 17, 1440);
    			attr_dev(td22, "align", "left");
    			attr_dev(td22, "class", "svelte-1bf8eo7");
    			add_location(td22, file$4, 44, 0, 1423);
    			attr_dev(td23, "class", "svelte-1bf8eo7");
    			add_location(td23, file$4, 45, 0, 1464);
    			attr_dev(tr6, "class", "svelte-1bf8eo7");
    			add_location(tr6, file$4, 41, 0, 1330);
    			attr_dev(strong7, "class", "svelte-1bf8eo7");
    			add_location(strong7, file$4, 48, 17, 1557);
    			attr_dev(td24, "align", "left");
    			attr_dev(td24, "class", "svelte-1bf8eo7");
    			add_location(td24, file$4, 48, 0, 1540);
    			add_location(code17, file$4, 49, 17, 1605);
    			attr_dev(td25, "align", "left");
    			attr_dev(td25, "class", "svelte-1bf8eo7");
    			add_location(td25, file$4, 49, 0, 1588);
    			add_location(code18, file$4, 50, 17, 1648);
    			attr_dev(td26, "align", "left");
    			attr_dev(td26, "class", "svelte-1bf8eo7");
    			add_location(td26, file$4, 50, 0, 1631);
    			attr_dev(td27, "class", "svelte-1bf8eo7");
    			add_location(td27, file$4, 51, 0, 1672);
    			attr_dev(tr7, "class", "svelte-1bf8eo7");
    			add_location(tr7, file$4, 47, 0, 1535);
    			attr_dev(strong8, "class", "svelte-1bf8eo7");
    			add_location(strong8, file$4, 54, 17, 1743);
    			attr_dev(td28, "align", "left");
    			attr_dev(td28, "class", "svelte-1bf8eo7");
    			add_location(td28, file$4, 54, 0, 1726);
    			add_location(code19, file$4, 55, 17, 1787);
    			attr_dev(td29, "align", "left");
    			attr_dev(td29, "class", "svelte-1bf8eo7");
    			add_location(td29, file$4, 55, 0, 1770);
    			add_location(code20, file$4, 56, 17, 1830);
    			attr_dev(td30, "align", "left");
    			attr_dev(td30, "class", "svelte-1bf8eo7");
    			add_location(td30, file$4, 56, 0, 1813);
    			attr_dev(td31, "class", "svelte-1bf8eo7");
    			add_location(td31, file$4, 57, 0, 1854);
    			attr_dev(tr8, "class", "svelte-1bf8eo7");
    			add_location(tr8, file$4, 53, 0, 1721);
    			attr_dev(strong9, "class", "svelte-1bf8eo7");
    			add_location(strong9, file$4, 60, 17, 1934);
    			attr_dev(td32, "align", "left");
    			attr_dev(td32, "class", "svelte-1bf8eo7");
    			add_location(td32, file$4, 60, 0, 1917);
    			add_location(code21, file$4, 61, 17, 1981);
    			attr_dev(td33, "align", "left");
    			attr_dev(td33, "class", "svelte-1bf8eo7");
    			add_location(td33, file$4, 61, 0, 1964);
    			add_location(code22, file$4, 62, 17, 2023);
    			add_location(code23, file$4, 62, 32, 2038);
    			add_location(code24, file$4, 62, 48, 2054);
    			attr_dev(td34, "align", "left");
    			attr_dev(td34, "class", "svelte-1bf8eo7");
    			add_location(td34, file$4, 62, 0, 2006);
    			add_location(code25, file$4, 63, 10, 2085);
    			add_location(code26, file$4, 63, 91, 2166);
    			attr_dev(td35, "class", "svelte-1bf8eo7");
    			add_location(td35, file$4, 63, 0, 2075);
    			attr_dev(tr9, "class", "svelte-1bf8eo7");
    			add_location(tr9, file$4, 59, 0, 1912);
    			attr_dev(strong10, "class", "svelte-1bf8eo7");
    			add_location(strong10, file$4, 66, 17, 2228);
    			attr_dev(td36, "align", "left");
    			attr_dev(td36, "class", "svelte-1bf8eo7");
    			add_location(td36, file$4, 66, 0, 2211);
    			add_location(code27, file$4, 67, 17, 2273);
    			add_location(code28, file$4, 67, 38, 2294);
    			attr_dev(td37, "align", "left");
    			attr_dev(td37, "class", "svelte-1bf8eo7");
    			add_location(td37, file$4, 67, 0, 2256);
    			add_location(code29, file$4, 68, 17, 2336);
    			attr_dev(td38, "align", "left");
    			attr_dev(td38, "class", "svelte-1bf8eo7");
    			add_location(td38, file$4, 68, 0, 2319);
    			add_location(code30, file$4, 69, 70, 2430);
    			attr_dev(td39, "class", "svelte-1bf8eo7");
    			add_location(td39, file$4, 69, 0, 2360);
    			attr_dev(tr10, "class", "svelte-1bf8eo7");
    			add_location(tr10, file$4, 65, 0, 2206);
    			attr_dev(strong11, "class", "svelte-1bf8eo7");
    			add_location(strong11, file$4, 72, 17, 2512);
    			attr_dev(td40, "align", "left");
    			attr_dev(td40, "class", "svelte-1bf8eo7");
    			add_location(td40, file$4, 72, 0, 2495);
    			add_location(code31, file$4, 73, 17, 2556);
    			add_location(code32, file$4, 73, 38, 2577);
    			attr_dev(td41, "align", "left");
    			attr_dev(td41, "class", "svelte-1bf8eo7");
    			add_location(td41, file$4, 73, 0, 2539);
    			add_location(code33, file$4, 74, 17, 2619);
    			attr_dev(td42, "align", "left");
    			attr_dev(td42, "class", "svelte-1bf8eo7");
    			add_location(td42, file$4, 74, 0, 2602);
    			add_location(code34, file$4, 75, 69, 2712);
    			attr_dev(td43, "class", "svelte-1bf8eo7");
    			add_location(td43, file$4, 75, 0, 2643);
    			attr_dev(tr11, "class", "svelte-1bf8eo7");
    			add_location(tr11, file$4, 71, 0, 2490);
    			attr_dev(strong12, "class", "svelte-1bf8eo7");
    			add_location(strong12, file$4, 78, 17, 2793);
    			attr_dev(td44, "align", "left");
    			attr_dev(td44, "class", "svelte-1bf8eo7");
    			add_location(td44, file$4, 78, 0, 2776);
    			add_location(code35, file$4, 79, 17, 2837);
    			add_location(code36, file$4, 79, 38, 2858);
    			attr_dev(td45, "align", "left");
    			attr_dev(td45, "class", "svelte-1bf8eo7");
    			add_location(td45, file$4, 79, 0, 2820);
    			add_location(code37, file$4, 80, 17, 2900);
    			attr_dev(td46, "align", "left");
    			attr_dev(td46, "class", "svelte-1bf8eo7");
    			add_location(td46, file$4, 80, 0, 2883);
    			add_location(code38, file$4, 81, 65, 2989);
    			attr_dev(td47, "class", "svelte-1bf8eo7");
    			add_location(td47, file$4, 81, 0, 2924);
    			attr_dev(tr12, "class", "svelte-1bf8eo7");
    			add_location(tr12, file$4, 77, 0, 2771);
    			attr_dev(strong13, "class", "svelte-1bf8eo7");
    			add_location(strong13, file$4, 84, 17, 3070);
    			attr_dev(td48, "align", "left");
    			attr_dev(td48, "class", "svelte-1bf8eo7");
    			add_location(td48, file$4, 84, 0, 3053);
    			add_location(code39, file$4, 85, 17, 3116);
    			attr_dev(td49, "align", "left");
    			attr_dev(td49, "class", "svelte-1bf8eo7");
    			add_location(td49, file$4, 85, 0, 3099);
    			add_location(code40, file$4, 86, 17, 3158);
    			attr_dev(td50, "align", "left");
    			attr_dev(td50, "class", "svelte-1bf8eo7");
    			add_location(td50, file$4, 86, 0, 3141);
    			attr_dev(td51, "class", "svelte-1bf8eo7");
    			add_location(td51, file$4, 87, 0, 3179);
    			attr_dev(tr13, "class", "svelte-1bf8eo7");
    			add_location(tr13, file$4, 83, 0, 3048);
    			attr_dev(strong14, "class", "svelte-1bf8eo7");
    			add_location(strong14, file$4, 90, 17, 3259);
    			attr_dev(td52, "align", "left");
    			attr_dev(td52, "class", "svelte-1bf8eo7");
    			add_location(td52, file$4, 90, 0, 3242);
    			add_location(code41, file$4, 91, 17, 3305);
    			attr_dev(td53, "align", "left");
    			attr_dev(td53, "class", "svelte-1bf8eo7");
    			add_location(td53, file$4, 91, 0, 3288);
    			add_location(code42, file$4, 92, 17, 3347);
    			attr_dev(td54, "align", "left");
    			attr_dev(td54, "class", "svelte-1bf8eo7");
    			add_location(td54, file$4, 92, 0, 3330);
    			attr_dev(td55, "class", "svelte-1bf8eo7");
    			add_location(td55, file$4, 93, 0, 3368);
    			attr_dev(tr14, "class", "svelte-1bf8eo7");
    			add_location(tr14, file$4, 89, 0, 3237);
    			attr_dev(strong15, "class", "svelte-1bf8eo7");
    			add_location(strong15, file$4, 96, 17, 3448);
    			attr_dev(td56, "align", "left");
    			attr_dev(td56, "class", "svelte-1bf8eo7");
    			add_location(td56, file$4, 96, 0, 3431);
    			add_location(code43, file$4, 97, 17, 3497);
    			attr_dev(td57, "align", "left");
    			attr_dev(td57, "class", "svelte-1bf8eo7");
    			add_location(td57, file$4, 97, 0, 3480);
    			add_location(code44, file$4, 98, 17, 3541);
    			attr_dev(td58, "align", "left");
    			attr_dev(td58, "class", "svelte-1bf8eo7");
    			add_location(td58, file$4, 98, 0, 3524);
    			attr_dev(td59, "class", "svelte-1bf8eo7");
    			add_location(td59, file$4, 99, 0, 3571);
    			attr_dev(tr15, "class", "svelte-1bf8eo7");
    			add_location(tr15, file$4, 95, 0, 3426);
    			attr_dev(strong16, "class", "svelte-1bf8eo7");
    			add_location(strong16, file$4, 102, 17, 3665);
    			attr_dev(td60, "align", "left");
    			attr_dev(td60, "class", "svelte-1bf8eo7");
    			add_location(td60, file$4, 102, 0, 3648);
    			add_location(code45, file$4, 103, 17, 3720);
    			attr_dev(td61, "align", "left");
    			attr_dev(td61, "class", "svelte-1bf8eo7");
    			add_location(td61, file$4, 103, 0, 3703);
    			add_location(code46, file$4, 104, 17, 3764);
    			attr_dev(td62, "align", "left");
    			attr_dev(td62, "class", "svelte-1bf8eo7");
    			add_location(td62, file$4, 104, 0, 3747);
    			add_location(code47, file$4, 105, 125, 3917);
    			attr_dev(td63, "class", "svelte-1bf8eo7");
    			add_location(td63, file$4, 105, 0, 3792);
    			attr_dev(tr16, "class", "svelte-1bf8eo7");
    			add_location(tr16, file$4, 101, 0, 3643);
    			attr_dev(strong17, "class", "svelte-1bf8eo7");
    			add_location(strong17, file$4, 108, 17, 3982);
    			attr_dev(td64, "align", "left");
    			attr_dev(td64, "class", "svelte-1bf8eo7");
    			add_location(td64, file$4, 108, 0, 3965);
    			add_location(code48, file$4, 109, 17, 4034);
    			attr_dev(td65, "align", "left");
    			attr_dev(td65, "class", "svelte-1bf8eo7");
    			add_location(td65, file$4, 109, 0, 4017);
    			add_location(code49, file$4, 110, 17, 4076);
    			attr_dev(td66, "align", "left");
    			attr_dev(td66, "class", "svelte-1bf8eo7");
    			add_location(td66, file$4, 110, 0, 4059);
    			attr_dev(td67, "class", "svelte-1bf8eo7");
    			add_location(td67, file$4, 111, 0, 4138);
    			attr_dev(tr17, "class", "svelte-1bf8eo7");
    			add_location(tr17, file$4, 107, 0, 3960);
    			attr_dev(tbody, "class", "svelte-1bf8eo7");
    			add_location(tbody, file$4, 10, 0, 158);
    			attr_dev(table, "class", "svelte-1bf8eo7");
    			add_location(table, file$4, 1, 0, 28);
    			attr_dev(div, "class", "table-wrapper svelte-1bf8eo7");
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
    			append_dev(tr13, t139);
    			append_dev(tr13, td50);
    			append_dev(td50, code40);
    			append_dev(tr13, t141);
    			append_dev(tr13, td51);
    			append_dev(tbody, t143);
    			append_dev(tbody, tr14);
    			append_dev(tr14, td52);
    			append_dev(td52, strong14);
    			append_dev(tr14, t145);
    			append_dev(tr14, td53);
    			append_dev(td53, code41);
    			append_dev(tr14, t147);
    			append_dev(tr14, td54);
    			append_dev(td54, code42);
    			append_dev(tr14, t149);
    			append_dev(tr14, td55);
    			append_dev(tbody, t151);
    			append_dev(tbody, tr15);
    			append_dev(tr15, td56);
    			append_dev(td56, strong15);
    			append_dev(tr15, t153);
    			append_dev(tr15, td57);
    			append_dev(td57, code43);
    			append_dev(tr15, t155);
    			append_dev(tr15, td58);
    			append_dev(td58, code44);
    			append_dev(tr15, t157);
    			append_dev(tr15, td59);
    			append_dev(tbody, t159);
    			append_dev(tbody, tr16);
    			append_dev(tr16, td60);
    			append_dev(td60, strong16);
    			append_dev(tr16, t161);
    			append_dev(tr16, td61);
    			append_dev(td61, code45);
    			append_dev(tr16, t163);
    			append_dev(tr16, td62);
    			append_dev(td62, code46);
    			append_dev(tr16, t165);
    			append_dev(tr16, td63);
    			append_dev(td63, t166);
    			append_dev(td63, code47);
    			append_dev(td63, t168);
    			append_dev(tbody, t169);
    			append_dev(tbody, tr17);
    			append_dev(tr17, td64);
    			append_dev(td64, strong17);
    			append_dev(tr17, t171);
    			append_dev(tr17, td65);
    			append_dev(td65, code48);
    			append_dev(tr17, t173);
    			append_dev(tr17, td66);
    			append_dev(td66, code49);
    			append_dev(tr17, t175);
    			append_dev(tr17, td67);
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

    /* src/Docs.svx generated by Svelte v3.24.0 */
    const file$5 = "src/Docs.svx";

    // (52:2) <div slot="code">
    function create_code_slot_5(ctx) {
    	let div;

    	const block = {
    		c: function create() {
    			div = element("div");
    			div.textContent = `${`<RangeSlider min={-50} max={200} values={[0]} />`}`;
    			attr_dev(div, "slot", "code");
    			add_location(div, file$5, 51, 2, 1435);
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
    		source: "(52:2) <div slot=\\\"code\\\">",
    		ctx
    	});

    	return block;
    }

    // (53:2) <div slot="slider">
    function create_slider_slot_5(ctx) {
    	let div;
    	let rangeslider;
    	let updating_values;
    	let current;

    	function rangeslider_values_binding(value) {
    		/*rangeslider_values_binding*/ ctx[2].call(null, value);
    	}

    	let rangeslider_props = { min: -50, max: 200 };

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
    			add_location(div, file$5, 52, 2, 1513);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			mount_component(rangeslider, div, null);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const rangeslider_changes = {};

    			if (!updating_values && dirty & /*values1*/ 1) {
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
    		id: create_slider_slot_5.name,
    		type: "slot",
    		source: "(53:2) <div slot=\\\"slider\\\">",
    		ctx
    	});

    	return block;
    }

    // (51:0) <Example values={values1}>
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
    		source: "(51:0) <Example values={values1}>",
    		ctx
    	});

    	return block;
    }

    // (59:2) <div slot="code">
    function create_code_slot_4(ctx) {
    	let div;

    	const block = {
    		c: function create() {
    			div = element("div");
    			div.textContent = `${"<RangeSlider float />"}`;
    			attr_dev(div, "slot", "code");
    			add_location(div, file$5, 58, 2, 1847);
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
    		source: "(59:2) <div slot=\\\"code\\\">",
    		ctx
    	});

    	return block;
    }

    // (60:2) <div slot="slider">
    function create_slider_slot_4(ctx) {
    	let div;
    	let rangeslider;
    	let updating_values;
    	let current;

    	function rangeslider_values_binding_1(value) {
    		/*rangeslider_values_binding_1*/ ctx[3].call(null, value);
    	}

    	let rangeslider_props = { float: true };

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
    			add_location(div, file$5, 59, 2, 1898);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			mount_component(rangeslider, div, null);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const rangeslider_changes = {};

    			if (!updating_values && dirty & /*values2*/ 2) {
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
    		id: create_slider_slot_4.name,
    		type: "slot",
    		source: "(60:2) <div slot=\\\"slider\\\">",
    		ctx
    	});

    	return block;
    }

    // (58:0) <Example values={values2}>
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
    		source: "(58:0) <Example values={values2}>",
    		ctx
    	});

    	return block;
    }

    // (66:2) <div slot="code">
    function create_code_slot_3(ctx) {
    	let div;

    	const block = {
    		c: function create() {
    			div = element("div");
    			div.textContent = `${"<RangeSlider pips />"}`;
    			attr_dev(div, "slot", "code");
    			add_location(div, file$5, 65, 2, 2195);
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
    		source: "(66:2) <div slot=\\\"code\\\">",
    		ctx
    	});

    	return block;
    }

    // (67:2) <div slot="slider">
    function create_slider_slot_3(ctx) {
    	let div;
    	let rangeslider;
    	let current;
    	rangeslider = new RangeSlider({ props: { pips: true }, $$inline: true });

    	const block = {
    		c: function create() {
    			div = element("div");
    			create_component(rangeslider.$$.fragment);
    			attr_dev(div, "slot", "slider");
    			add_location(div, file$5, 66, 2, 2245);
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
    		id: create_slider_slot_3.name,
    		type: "slot",
    		source: "(67:2) <div slot=\\\"slider\\\">",
    		ctx
    	});

    	return block;
    }

    // (65:0) <Example>
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
    		source: "(65:0) <Example>",
    		ctx
    	});

    	return block;
    }

    // (74:2) <div slot="code">
    function create_code_slot_2(ctx) {
    	let div;

    	const block = {
    		c: function create() {
    			div = element("div");
    			div.textContent = `${"<RangeSlider pips first='label' last='label' rest />"}`;
    			attr_dev(div, "slot", "code");
    			add_location(div, file$5, 73, 2, 2591);
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
    		source: "(74:2) <div slot=\\\"code\\\">",
    		ctx
    	});

    	return block;
    }

    // (75:2) <div slot="slider">
    function create_slider_slot_2(ctx) {
    	let div;
    	let rangeslider;
    	let current;

    	rangeslider = new RangeSlider({
    			props: {
    				pips: true,
    				first: "label",
    				last: "label",
    				rest: true
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			div = element("div");
    			create_component(rangeslider.$$.fragment);
    			attr_dev(div, "slot", "slider");
    			add_location(div, file$5, 74, 2, 2673);
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
    		id: create_slider_slot_2.name,
    		type: "slot",
    		source: "(75:2) <div slot=\\\"slider\\\">",
    		ctx
    	});

    	return block;
    }

    // (73:0) <Example>
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
    		source: "(73:0) <Example>",
    		ctx
    	});

    	return block;
    }

    // (78:2) <div slot="code">
    function create_code_slot_1(ctx) {
    	let div;

    	const block = {
    		c: function create() {
    			div = element("div");
    			div.textContent = `${`<RangeSlider pips first='label' last='label' rest={false} />`}`;
    			attr_dev(div, "slot", "code");
    			add_location(div, file$5, 77, 2, 2774);
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
    		source: "(78:2) <div slot=\\\"code\\\">",
    		ctx
    	});

    	return block;
    }

    // (79:2) <div slot="slider">
    function create_slider_slot_1(ctx) {
    	let div;
    	let rangeslider;
    	let current;

    	rangeslider = new RangeSlider({
    			props: {
    				pips: true,
    				first: "label",
    				last: "label",
    				rest: false
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			div = element("div");
    			create_component(rangeslider.$$.fragment);
    			attr_dev(div, "slot", "slider");
    			add_location(div, file$5, 78, 2, 2864);
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
    		id: create_slider_slot_1.name,
    		type: "slot",
    		source: "(79:2) <div slot=\\\"slider\\\">",
    		ctx
    	});

    	return block;
    }

    // (77:0) <Example>
    function create_default_slot_1(ctx) {
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
    		id: create_default_slot_1.name,
    		type: "slot",
    		source: "(77:0) <Example>",
    		ctx
    	});

    	return block;
    }

    // (82:2) <div slot="code">
    function create_code_slot(ctx) {
    	let div;

    	const block = {
    		c: function create() {
    			div = element("div");
    			div.textContent = `${`<RangeSlider pips first='label' last='label' rest='label' />`}`;
    			attr_dev(div, "slot", "code");
    			add_location(div, file$5, 81, 2, 2973);
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
    		source: "(82:2) <div slot=\\\"code\\\">",
    		ctx
    	});

    	return block;
    }

    // (83:2) <div slot="slider">
    function create_slider_slot(ctx) {
    	let div;
    	let rangeslider;
    	let current;

    	rangeslider = new RangeSlider({
    			props: {
    				pips: true,
    				first: "label",
    				last: "label",
    				rest: "label"
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			div = element("div");
    			create_component(rangeslider.$$.fragment);
    			attr_dev(div, "slot", "slider");
    			add_location(div, file$5, 82, 2, 3063);
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
    		id: create_slider_slot.name,
    		type: "slot",
    		source: "(83:2) <div slot=\\\"slider\\\">",
    		ctx
    	});

    	return block;
    }

    // (81:0) <Example>
    function create_default_slot$1(ctx) {
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
    		id: create_default_slot$1.name,
    		type: "slot",
    		source: "(81:0) <Example>",
    		ctx
    	});

    	return block;
    }

    function create_fragment$5(ctx) {
    	let h1;
    	let t1;
    	let p0;
    	let t2;
    	let strong;
    	let t4;
    	let t5;
    	let rangeslider;
    	let t6;
    	let p1;
    	let t8;
    	let options;
    	let t9;
    	let h20;
    	let t11;
    	let p2;
    	let t13;
    	let example0;
    	let t14;
    	let h21;
    	let t16;
    	let p3;
    	let t17;
    	let code0;
    	let t19;
    	let code1;
    	let t21;
    	let code2;
    	let t23;
    	let code3;
    	let t25;
    	let t26;
    	let example1;
    	let t27;
    	let h22;
    	let t29;
    	let p4;
    	let t30;
    	let code4;
    	let t32;
    	let em;
    	let t34;
    	let example2;
    	let t35;
    	let h23;
    	let t37;
    	let p5;
    	let t38;
    	let code5;
    	let t40;
    	let t41;
    	let example3;
    	let t42;
    	let h24;
    	let t44;
    	let p6;
    	let t45;
    	let code6;
    	let t47;
    	let code7;
    	let t49;
    	let code8;
    	let t51;
    	let t52;
    	let example4;
    	let t53;
    	let example5;
    	let t54;
    	let example6;
    	let t55;
    	let div;
    	let p7;
    	let img;
    	let img_src_value;
    	let br;
    	let t56;
    	let t57;
    	let small;
    	let a0;
    	let t59;
    	let a1;
    	let t61;
    	let a2;
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
    	example0 = new Example({ $$inline: true });

    	example1 = new Example({
    			props: {
    				values: /*values1*/ ctx[0],
    				$$slots: {
    					default: [create_default_slot_5],
    					slider: [create_slider_slot_5],
    					code: [create_code_slot_5]
    				},
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	example2 = new Example({
    			props: {
    				values: /*values2*/ ctx[1],
    				$$slots: {
    					default: [create_default_slot_4],
    					slider: [create_slider_slot_4],
    					code: [create_code_slot_4]
    				},
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	example3 = new Example({
    			props: {
    				$$slots: {
    					default: [create_default_slot_3],
    					slider: [create_slider_slot_3],
    					code: [create_code_slot_3]
    				},
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	example4 = new Example({
    			props: {
    				$$slots: {
    					default: [create_default_slot_2],
    					slider: [create_slider_slot_2],
    					code: [create_code_slot_2]
    				},
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	example5 = new Example({
    			props: {
    				$$slots: {
    					default: [create_default_slot_1],
    					slider: [create_slider_slot_1],
    					code: [create_code_slot_1]
    				},
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	example6 = new Example({
    			props: {
    				$$slots: {
    					default: [create_default_slot$1],
    					slider: [create_slider_slot],
    					code: [create_code_slot]
    				},
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			h1 = element("h1");
    			h1.textContent = "Svelte Range Slider & Pips";
    			t1 = space();
    			p0 = element("p");
    			t2 = text("A reactive, accessible, ");
    			strong = element("strong");
    			strong.textContent = "multi-thumb, range slider component for use in a svelte application";
    			t4 = text("; with the ability to display “pips” or “notches” along the range.");
    			t5 = space();
    			create_component(rangeslider.$$.fragment);
    			t6 = space();
    			p1 = element("p");
    			p1.textContent = "Find a long list of possible options and examples below";
    			t8 = space();
    			create_component(options.$$.fragment);
    			t9 = space();
    			h20 = element("h2");
    			h20.textContent = "Basic Usage";
    			t11 = space();
    			p2 = element("p");
    			p2.textContent = "This is how the slider would appear if no props/arguments are passed along with the component.";
    			t13 = space();
    			create_component(example0.$$.fragment);
    			t14 = space();
    			h21 = element("h2");
    			h21.textContent = "Min, Max, Values";
    			t16 = space();
    			p3 = element("p");
    			t17 = text("The slider accepts props for ");
    			code0 = element("code");
    			code0.textContent = "min";
    			t19 = text(", ");
    			code1 = element("code");
    			code1.textContent = "max";
    			t21 = text(" and ");
    			code2 = element("code");
    			code2.textContent = "values";
    			t23 = text(" which can also be bound with ");
    			code3 = element("code");
    			code3.textContent = "bind:";
    			t25 = text("\nand these determine the corresponding values on the slider.");
    			t26 = space();
    			create_component(example1.$$.fragment);
    			t27 = space();
    			h22 = element("h2");
    			h22.textContent = "With floating label";
    			t29 = space();
    			p4 = element("p");
    			t30 = text("By passing the ");
    			code4 = element("code");
    			code4.textContent = "float";
    			t32 = text(" prop to the component, we can have a nice label which floats above\nthe handle and shows the current value. ");
    			em = element("em");
    			em.textContent = "(hover/select to see it)";
    			t34 = space();
    			create_component(example2.$$.fragment);
    			t35 = space();
    			h23 = element("h2");
    			h23.textContent = "With Pips";
    			t37 = space();
    			p5 = element("p");
    			t38 = text("And here, to demonstrate the stand-out feature are some notches, or as I call\nthem ");
    			code5 = element("code");
    			code5.textContent = "pips";
    			t40 = text(" which sit below the slider by default to mark regular intervals in the range.");
    			t41 = space();
    			create_component(example3.$$.fragment);
    			t42 = space();
    			h24 = element("h2");
    			h24.textContent = "Pip Labels";
    			t44 = space();
    			p6 = element("p");
    			t45 = text("There are props for ");
    			code6 = element("code");
    			code6.textContent = "first";
    			t47 = text(", ");
    			code7 = element("code");
    			code7.textContent = "last";
    			t49 = text(" and ");
    			code8 = element("code");
    			code8.textContent = "rest";
    			t51 = text(" which determine how to display the pips\nalong the range. Additionally to these simple props, you might also consider some advanced\ncss styles to get your desired result.");
    			t52 = space();
    			create_component(example4.$$.fragment);
    			t53 = space();
    			create_component(example5.$$.fragment);
    			t54 = space();
    			create_component(example6.$$.fragment);
    			t55 = space();
    			div = element("div");
    			p7 = element("p");
    			img = element("img");
    			br = element("br");
    			t56 = text("\nMore coming soon");
    			t57 = space();
    			small = element("small");
    			a0 = element("a");
    			a0.textContent = "Search";
    			t59 = text(", ");
    			a1 = element("a");
    			a1.textContent = "Code";
    			t61 = text(" and other icons by ");
    			a2 = element("a");
    			a2.textContent = "Icons8";
    			add_location(h1, file$5, 39, 0, 684);
    			add_location(strong, file$5, 40, 27, 747);
    			add_location(p0, file$5, 40, 0, 720);
    			add_location(p1, file$5, 42, 0, 967);
    			add_location(h20, file$5, 44, 0, 1042);
    			add_location(p2, file$5, 45, 0, 1063);
    			add_location(h21, file$5, 47, 0, 1177);
    			add_location(code0, file$5, 48, 32, 1235);
    			add_location(code1, file$5, 48, 50, 1253);
    			add_location(code2, file$5, 48, 71, 1274);
    			add_location(code3, file$5, 48, 120, 1323);
    			add_location(p3, file$5, 48, 0, 1203);
    			add_location(h22, file$5, 54, 0, 1607);
    			add_location(code4, file$5, 55, 18, 1654);
    			add_location(em, file$5, 56, 40, 1780);
    			add_location(p4, file$5, 55, 0, 1636);
    			add_location(h23, file$5, 61, 0, 1978);
    			add_location(code5, file$5, 63, 5, 2083);
    			add_location(p5, file$5, 62, 0, 1997);
    			add_location(h24, file$5, 68, 0, 2302);
    			add_location(code6, file$5, 69, 23, 2345);
    			add_location(code7, file$5, 69, 43, 2365);
    			add_location(code8, file$5, 69, 65, 2387);
    			add_location(p6, file$5, 69, 0, 2322);
    			if (img.src !== (img_src_value = "public/images/icons8-under-construction-100.png")) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", "icon of a magnifying glass, for viewing the output slider");
    			attr_dev(img, "class", "svelte-1dvc7i3");
    			add_location(img, file$5, 85, 5, 3184);
    			add_location(br, file$5, 88, 1, 3312);
    			add_location(p7, file$5, 85, 0, 3179);
    			attr_dev(div, "class", "soon svelte-1dvc7i3");
    			add_location(div, file$5, 84, 0, 3160);
    			attr_dev(a0, "target", "_blank");
    			attr_dev(a0, "href", "https://icons8.com/icons/set/search");
    			add_location(a0, file$5, 92, 2, 3370);
    			attr_dev(a1, "target", "_blank");
    			attr_dev(a1, "href", "https://icons8.com/icons/set/code");
    			add_location(a1, file$5, 92, 76, 3444);
    			attr_dev(a2, "target", "_blank");
    			attr_dev(a2, "href", "https://icons8.com");
    			add_location(a2, file$5, 92, 164, 3532);
    			attr_dev(small, "class", "credit svelte-1dvc7i3");
    			add_location(small, file$5, 91, 0, 3345);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, h1, anchor);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, p0, anchor);
    			append_dev(p0, t2);
    			append_dev(p0, strong);
    			append_dev(p0, t4);
    			insert_dev(target, t5, anchor);
    			mount_component(rangeslider, target, anchor);
    			insert_dev(target, t6, anchor);
    			insert_dev(target, p1, anchor);
    			insert_dev(target, t8, anchor);
    			mount_component(options, target, anchor);
    			insert_dev(target, t9, anchor);
    			insert_dev(target, h20, anchor);
    			insert_dev(target, t11, anchor);
    			insert_dev(target, p2, anchor);
    			insert_dev(target, t13, anchor);
    			mount_component(example0, target, anchor);
    			insert_dev(target, t14, anchor);
    			insert_dev(target, h21, anchor);
    			insert_dev(target, t16, anchor);
    			insert_dev(target, p3, anchor);
    			append_dev(p3, t17);
    			append_dev(p3, code0);
    			append_dev(p3, t19);
    			append_dev(p3, code1);
    			append_dev(p3, t21);
    			append_dev(p3, code2);
    			append_dev(p3, t23);
    			append_dev(p3, code3);
    			append_dev(p3, t25);
    			insert_dev(target, t26, anchor);
    			mount_component(example1, target, anchor);
    			insert_dev(target, t27, anchor);
    			insert_dev(target, h22, anchor);
    			insert_dev(target, t29, anchor);
    			insert_dev(target, p4, anchor);
    			append_dev(p4, t30);
    			append_dev(p4, code4);
    			append_dev(p4, t32);
    			append_dev(p4, em);
    			insert_dev(target, t34, anchor);
    			mount_component(example2, target, anchor);
    			insert_dev(target, t35, anchor);
    			insert_dev(target, h23, anchor);
    			insert_dev(target, t37, anchor);
    			insert_dev(target, p5, anchor);
    			append_dev(p5, t38);
    			append_dev(p5, code5);
    			append_dev(p5, t40);
    			insert_dev(target, t41, anchor);
    			mount_component(example3, target, anchor);
    			insert_dev(target, t42, anchor);
    			insert_dev(target, h24, anchor);
    			insert_dev(target, t44, anchor);
    			insert_dev(target, p6, anchor);
    			append_dev(p6, t45);
    			append_dev(p6, code6);
    			append_dev(p6, t47);
    			append_dev(p6, code7);
    			append_dev(p6, t49);
    			append_dev(p6, code8);
    			append_dev(p6, t51);
    			insert_dev(target, t52, anchor);
    			mount_component(example4, target, anchor);
    			insert_dev(target, t53, anchor);
    			mount_component(example5, target, anchor);
    			insert_dev(target, t54, anchor);
    			mount_component(example6, target, anchor);
    			insert_dev(target, t55, anchor);
    			insert_dev(target, div, anchor);
    			append_dev(div, p7);
    			append_dev(p7, img);
    			append_dev(p7, br);
    			append_dev(p7, t56);
    			insert_dev(target, t57, anchor);
    			insert_dev(target, small, anchor);
    			append_dev(small, a0);
    			append_dev(small, t59);
    			append_dev(small, a1);
    			append_dev(small, t61);
    			append_dev(small, a2);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const example1_changes = {};
    			if (dirty & /*values1*/ 1) example1_changes.values = /*values1*/ ctx[0];

    			if (dirty & /*$$scope, values1*/ 16385) {
    				example1_changes.$$scope = { dirty, ctx };
    			}

    			example1.$set(example1_changes);
    			const example2_changes = {};
    			if (dirty & /*values2*/ 2) example2_changes.values = /*values2*/ ctx[1];

    			if (dirty & /*$$scope, values2*/ 16386) {
    				example2_changes.$$scope = { dirty, ctx };
    			}

    			example2.$set(example2_changes);
    			const example3_changes = {};

    			if (dirty & /*$$scope*/ 16384) {
    				example3_changes.$$scope = { dirty, ctx };
    			}

    			example3.$set(example3_changes);
    			const example4_changes = {};

    			if (dirty & /*$$scope*/ 16384) {
    				example4_changes.$$scope = { dirty, ctx };
    			}

    			example4.$set(example4_changes);
    			const example5_changes = {};

    			if (dirty & /*$$scope*/ 16384) {
    				example5_changes.$$scope = { dirty, ctx };
    			}

    			example5.$set(example5_changes);
    			const example6_changes = {};

    			if (dirty & /*$$scope*/ 16384) {
    				example6_changes.$$scope = { dirty, ctx };
    			}

    			example6.$set(example6_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(rangeslider.$$.fragment, local);
    			transition_in(options.$$.fragment, local);
    			transition_in(example0.$$.fragment, local);
    			transition_in(example1.$$.fragment, local);
    			transition_in(example2.$$.fragment, local);
    			transition_in(example3.$$.fragment, local);
    			transition_in(example4.$$.fragment, local);
    			transition_in(example5.$$.fragment, local);
    			transition_in(example6.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(rangeslider.$$.fragment, local);
    			transition_out(options.$$.fragment, local);
    			transition_out(example0.$$.fragment, local);
    			transition_out(example1.$$.fragment, local);
    			transition_out(example2.$$.fragment, local);
    			transition_out(example3.$$.fragment, local);
    			transition_out(example4.$$.fragment, local);
    			transition_out(example5.$$.fragment, local);
    			transition_out(example6.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(h1);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(p0);
    			if (detaching) detach_dev(t5);
    			destroy_component(rangeslider, detaching);
    			if (detaching) detach_dev(t6);
    			if (detaching) detach_dev(p1);
    			if (detaching) detach_dev(t8);
    			destroy_component(options, detaching);
    			if (detaching) detach_dev(t9);
    			if (detaching) detach_dev(h20);
    			if (detaching) detach_dev(t11);
    			if (detaching) detach_dev(p2);
    			if (detaching) detach_dev(t13);
    			destroy_component(example0, detaching);
    			if (detaching) detach_dev(t14);
    			if (detaching) detach_dev(h21);
    			if (detaching) detach_dev(t16);
    			if (detaching) detach_dev(p3);
    			if (detaching) detach_dev(t26);
    			destroy_component(example1, detaching);
    			if (detaching) detach_dev(t27);
    			if (detaching) detach_dev(h22);
    			if (detaching) detach_dev(t29);
    			if (detaching) detach_dev(p4);
    			if (detaching) detach_dev(t34);
    			destroy_component(example2, detaching);
    			if (detaching) detach_dev(t35);
    			if (detaching) detach_dev(h23);
    			if (detaching) detach_dev(t37);
    			if (detaching) detach_dev(p5);
    			if (detaching) detach_dev(t41);
    			destroy_component(example3, detaching);
    			if (detaching) detach_dev(t42);
    			if (detaching) detach_dev(h24);
    			if (detaching) detach_dev(t44);
    			if (detaching) detach_dev(p6);
    			if (detaching) detach_dev(t52);
    			destroy_component(example4, detaching);
    			if (detaching) detach_dev(t53);
    			destroy_component(example5, detaching);
    			if (detaching) detach_dev(t54);
    			destroy_component(example6, detaching);
    			if (detaching) detach_dev(t55);
    			if (detaching) detach_dev(div);
    			if (detaching) detach_dev(t57);
    			if (detaching) detach_dev(small);
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
    	let values1 = [0];
    	let values2 = [50];
    	let values3 = [50];
    	let values4 = [50];
    	let values5 = [50];
    	let values6 = [50];
    	let values7 = [50];
    	let values8 = [50];
    	let values9 = [50];
    	let values10 = [50];
    	let values11 = [50];
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

    	$$self.$capture_state = () => ({
    		RangeSlider,
    		Example,
    		Options,
    		values1,
    		values2,
    		values3,
    		values4,
    		values5,
    		values6,
    		values7,
    		values8,
    		values9,
    		values10,
    		values11,
    		values12
    	});

    	$$self.$inject_state = $$props => {
    		if ("values1" in $$props) $$invalidate(0, values1 = $$props.values1);
    		if ("values2" in $$props) $$invalidate(1, values2 = $$props.values2);
    		if ("values3" in $$props) values3 = $$props.values3;
    		if ("values4" in $$props) values4 = $$props.values4;
    		if ("values5" in $$props) values5 = $$props.values5;
    		if ("values6" in $$props) values6 = $$props.values6;
    		if ("values7" in $$props) values7 = $$props.values7;
    		if ("values8" in $$props) values8 = $$props.values8;
    		if ("values9" in $$props) values9 = $$props.values9;
    		if ("values10" in $$props) values10 = $$props.values10;
    		if ("values11" in $$props) values11 = $$props.values11;
    		if ("values12" in $$props) values12 = $$props.values12;
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [values1, values2, rangeslider_values_binding, rangeslider_values_binding_1];
    }

    class Docs extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$5, create_fragment$5, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Docs",
    			options,
    			id: create_fragment$5.name
    		});
    	}
    }

    /* src/App.svelte generated by Svelte v3.24.0 */
    const file$6 = "src/App.svelte";

    function create_fragment$6(ctx) {
    	let main;
    	let docs;
    	let current;
    	docs = new Docs({ $$inline: true });

    	const block = {
    		c: function create() {
    			main = element("main");
    			create_component(docs.$$.fragment);
    			attr_dev(main, "class", "svelte-xnzu95");
    			add_location(main, file$6, 12, 0, 142);
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
    		id: create_fragment$6.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$6($$self, $$props, $$invalidate) {
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
    		init(this, options, instance$6, create_fragment$6, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "App",
    			options,
    			id: create_fragment$6.name
    		});
    	}
    }

    const app = new App({
    	target: document.body
    });

    return app;

}());
//# sourceMappingURL=bundle.js.map

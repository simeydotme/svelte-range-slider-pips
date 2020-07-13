
(function(l, r) { if (l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (window.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(window.document);
var app = (function () {
    'use strict';

    function noop() { }
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

    /* home/simey/Dev/Home/svelte-range-slider-pips/src/RangePips.svelte generated by Svelte v3.24.0 */

    const file = "home/simey/Dev/Home/svelte-range-slider-pips/src/RangePips.svelte";

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

    /* home/simey/Dev/Home/svelte-range-slider-pips/src/RangeSlider.svelte generated by Svelte v3.24.0 */
    const file$1 = "home/simey/Dev/Home/svelte-range-slider-pips/src/RangeSlider.svelte";

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
    	let if_block = /*float*/ ctx[1] && create_if_block_2$1(ctx);

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
    			attr_dev(span1, "style", span1_style_value = "" + ((/*vertical*/ ctx[6] ? "top" : "left") + ": " + /*$springPositions*/ ctx[21][/*index*/ ctx[50]] + "%; z-index: " + (/*activeHandle*/ ctx[19] === /*index*/ ctx[50] ? 3 : 2) + ";"));

    			attr_dev(span1, "aria-valuemin", span1_aria_valuemin_value = /*range*/ ctx[2] === true && /*index*/ ctx[50] === 1
    			? /*values*/ ctx[0][0]
    			: /*min*/ ctx[3]);

    			attr_dev(span1, "aria-valuemax", span1_aria_valuemax_value = /*range*/ ctx[2] === true && /*index*/ ctx[50] === 0
    			? /*values*/ ctx[0][1]
    			: /*max*/ ctx[4]);

    			attr_dev(span1, "aria-valuenow", span1_aria_valuenow_value = /*value*/ ctx[48]);
    			attr_dev(span1, "aria-valuetext", span1_aria_valuetext_value = "" + (/*prefix*/ ctx[13] + /*handleFormatter*/ ctx[16](/*value*/ ctx[48]) + /*suffix*/ ctx[14]));
    			attr_dev(span1, "aria-orientation", span1_aria_orientation_value = /*vertical*/ ctx[6] ? "vertical" : "horizontal");
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
    			if (/*float*/ ctx[1]) {
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

    			if (dirty[0] & /*vertical, $springPositions, activeHandle*/ 2621504 && span1_style_value !== (span1_style_value = "" + ((/*vertical*/ ctx[6] ? "top" : "left") + ": " + /*$springPositions*/ ctx[21][/*index*/ ctx[50]] + "%; z-index: " + (/*activeHandle*/ ctx[19] === /*index*/ ctx[50] ? 3 : 2) + ";"))) {
    				attr_dev(span1, "style", span1_style_value);
    			}

    			if (dirty[0] & /*range, values, min*/ 13 && span1_aria_valuemin_value !== (span1_aria_valuemin_value = /*range*/ ctx[2] === true && /*index*/ ctx[50] === 1
    			? /*values*/ ctx[0][0]
    			: /*min*/ ctx[3])) {
    				attr_dev(span1, "aria-valuemin", span1_aria_valuemin_value);
    			}

    			if (dirty[0] & /*range, values, max*/ 21 && span1_aria_valuemax_value !== (span1_aria_valuemax_value = /*range*/ ctx[2] === true && /*index*/ ctx[50] === 0
    			? /*values*/ ctx[0][1]
    			: /*max*/ ctx[4])) {
    				attr_dev(span1, "aria-valuemax", span1_aria_valuemax_value);
    			}

    			if (dirty[0] & /*values*/ 1 && span1_aria_valuenow_value !== (span1_aria_valuenow_value = /*value*/ ctx[48])) {
    				attr_dev(span1, "aria-valuenow", span1_aria_valuenow_value);
    			}

    			if (dirty[0] & /*prefix, handleFormatter, values, suffix*/ 90113 && span1_aria_valuetext_value !== (span1_aria_valuetext_value = "" + (/*prefix*/ ctx[13] + /*handleFormatter*/ ctx[16](/*value*/ ctx[48]) + /*suffix*/ ctx[14]))) {
    				attr_dev(span1, "aria-valuetext", span1_aria_valuetext_value);
    			}

    			if (dirty[0] & /*vertical*/ 64 && span1_aria_orientation_value !== (span1_aria_orientation_value = /*vertical*/ ctx[6] ? "vertical" : "horizontal")) {
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
    			attr_dev(span, "style", span_style_value = "" + ((/*vertical*/ ctx[6] ? "top" : "left") + ": " + /*rangeStart*/ ctx[23](/*$springPositions*/ ctx[21]) + "%; " + (/*vertical*/ ctx[6] ? "bottom" : "right") + ":\n      " + /*rangeEnd*/ ctx[24](/*$springPositions*/ ctx[21]) + "%;"));
    			add_location(span, file$1, 626, 4, 17725);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, span, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*vertical, $springPositions*/ 2097216 && span_style_value !== (span_style_value = "" + ((/*vertical*/ ctx[6] ? "top" : "left") + ": " + /*rangeStart*/ ctx[23](/*$springPositions*/ ctx[21]) + "%; " + (/*vertical*/ ctx[6] ? "bottom" : "right") + ":\n      " + /*rangeEnd*/ ctx[24](/*$springPositions*/ ctx[21]) + "%;"))) {
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
    				min: /*min*/ ctx[3],
    				max: /*max*/ ctx[4],
    				step: /*step*/ ctx[5],
    				range: /*range*/ ctx[2],
    				vertical: /*vertical*/ ctx[6],
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
    			if (dirty[0] & /*min*/ 8) rangepips_changes.min = /*min*/ ctx[3];
    			if (dirty[0] & /*max*/ 16) rangepips_changes.max = /*max*/ ctx[4];
    			if (dirty[0] & /*step*/ 32) rangepips_changes.step = /*step*/ ctx[5];
    			if (dirty[0] & /*range*/ 4) rangepips_changes.range = /*range*/ ctx[2];
    			if (dirty[0] & /*vertical*/ 64) rangepips_changes.vertical = /*vertical*/ ctx[6];
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

    	let if_block0 = /*range*/ ctx[2] && create_if_block_1$1(ctx);
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
    			toggle_class(div, "min", /*range*/ ctx[2] === "min");
    			toggle_class(div, "range", /*range*/ ctx[2]);
    			toggle_class(div, "vertical", /*vertical*/ ctx[6]);
    			toggle_class(div, "focus", /*focus*/ ctx[18]);
    			toggle_class(div, "max", /*range*/ ctx[2] === "max");
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
    			if (dirty[0] & /*vertical, $springPositions, activeHandle, range, values, min, max, prefix, handleFormatter, suffix, focus, sliderKeydown, sliderBlurHandle, sliderFocusHandle, float*/ 237854815) {
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

    			if (/*range*/ ctx[2]) {
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

    			if (dirty[0] & /*range*/ 4) {
    				toggle_class(div, "min", /*range*/ ctx[2] === "min");
    			}

    			if (dirty[0] & /*range*/ 4) {
    				toggle_class(div, "range", /*range*/ ctx[2]);
    			}

    			if (dirty[0] & /*vertical*/ 64) {
    				toggle_class(div, "vertical", /*vertical*/ ctx[6]);
    			}

    			if (dirty[0] & /*focus*/ 262144) {
    				toggle_class(div, "focus", /*focus*/ ctx[18]);
    			}

    			if (dirty[0] & /*range*/ 4) {
    				toggle_class(div, "max", /*range*/ ctx[2] === "max");
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
    	let { float = false } = $$props;
    	let { range = false } = $$props;
    	let { min = 0 } = $$props;
    	let { max = 100 } = $$props;
    	let { step = 1 } = $$props;
    	let { values = [(max + min) / 2] } = $$props;
    	let { vertical = false } = $$props;
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
    		"float",
    		"range",
    		"min",
    		"max",
    		"step",
    		"values",
    		"vertical",
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
    		if ("float" in $$props) $$invalidate(1, float = $$props.float);
    		if ("range" in $$props) $$invalidate(2, range = $$props.range);
    		if ("min" in $$props) $$invalidate(3, min = $$props.min);
    		if ("max" in $$props) $$invalidate(4, max = $$props.max);
    		if ("step" in $$props) $$invalidate(5, step = $$props.step);
    		if ("values" in $$props) $$invalidate(0, values = $$props.values);
    		if ("vertical" in $$props) $$invalidate(6, vertical = $$props.vertical);
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
    		float,
    		range,
    		min,
    		max,
    		step,
    		values,
    		vertical,
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
    		if ("float" in $$props) $$invalidate(1, float = $$props.float);
    		if ("range" in $$props) $$invalidate(2, range = $$props.range);
    		if ("min" in $$props) $$invalidate(3, min = $$props.min);
    		if ("max" in $$props) $$invalidate(4, max = $$props.max);
    		if ("step" in $$props) $$invalidate(5, step = $$props.step);
    		if ("values" in $$props) $$invalidate(0, values = $$props.values);
    		if ("vertical" in $$props) $$invalidate(6, vertical = $$props.vertical);
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
    		if ($$self.$$.dirty[0] & /*min, max*/ 24) {
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

    		if ($$self.$$.dirty[0] & /*min, max, step*/ 56 | $$self.$$.dirty[1] & /*clampValue, precision*/ 520) {
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

    		if ($$self.$$.dirty[0] & /*min, max*/ 24 | $$self.$$.dirty[1] & /*precision*/ 8) {
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
    		float,
    		range,
    		min,
    		max,
    		step,
    		vertical,
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
    				float: 1,
    				range: 2,
    				min: 3,
    				max: 4,
    				step: 5,
    				values: 0,
    				vertical: 6,
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

    	get float() {
    		throw new Error("<RangeSlider>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set float(value) {
    		throw new Error("<RangeSlider>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
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

    /* src/App.svelte generated by Svelte v3.24.0 */
    const file$2 = "src/App.svelte";

    function create_fragment$2(ctx) {
    	let style;
    	let t1;
    	let main;
    	let div;
    	let rangeslider0;
    	let t2;
    	let rangeslider1;
    	let t3;
    	let rangeslider2;
    	let t4;
    	let br0;
    	let t5;
    	let rangeslider3;
    	let t6;
    	let rangeslider4;
    	let updating_values;
    	let t7;
    	let t8;
    	let rangeslider5;
    	let t9;
    	let rangeslider6;
    	let t10;
    	let rangeslider7;
    	let t11;
    	let rangeslider8;
    	let t12;
    	let br1;
    	let t13;
    	let rangeslider9;
    	let t14;
    	let rangeslider10;
    	let t15;
    	let rangeslider11;
    	let t16;
    	let br2;
    	let t17;
    	let rangeslider12;
    	let t18;
    	let rangeslider13;
    	let t19;
    	let rangeslider14;
    	let t20;
    	let br3;
    	let t21;
    	let rangeslider15;
    	let updating_values_1;
    	let t22;
    	let rangeslider16;
    	let t23;
    	let rangeslider17;
    	let t24;
    	let rangeslider18;
    	let t25;
    	let br4;
    	let t26;
    	let rangeslider19;
    	let updating_values_2;
    	let t27;
    	let rangeslider20;
    	let updating_values_3;
    	let t28;
    	let br5;
    	let t29;
    	let br6;
    	let t30_value = /*dayFormatCn*/ ctx[8](/*day*/ ctx[1][0]) + "";
    	let t30;
    	let t31;
    	let t32_value = /*dayFormat*/ ctx[7](/*day*/ ctx[1][0]) + "";
    	let t32;
    	let br7;
    	let t33;
    	let br8;
    	let t34;
    	let rangeslider21;
    	let updating_values_4;
    	let current;

    	rangeslider0 = new RangeSlider({
    			props: {
    				vertical: true,
    				range: true,
    				values: [10, 30],
    				pips: true,
    				rest: "label"
    			},
    			$$inline: true
    		});

    	rangeslider1 = new RangeSlider({
    			props: {
    				vertical: true,
    				range: "min",
    				values: [10],
    				pips: true,
    				rest: "label"
    			},
    			$$inline: true
    		});

    	rangeslider2 = new RangeSlider({
    			props: {
    				vertical: true,
    				range: "max",
    				values: [30],
    				pips: true,
    				rest: "label"
    			},
    			$$inline: true
    		});

    	rangeslider3 = new RangeSlider({ $$inline: true });

    	function rangeslider4_values_binding(value) {
    		/*rangeslider4_values_binding*/ ctx[9].call(null, value);
    	}

    	let rangeslider4_props = {};

    	if (/*values*/ ctx[0] !== void 0) {
    		rangeslider4_props.values = /*values*/ ctx[0];
    	}

    	rangeslider4 = new RangeSlider({
    			props: rangeslider4_props,
    			$$inline: true
    		});

    	binding_callbacks.push(() => bind(rangeslider4, "values", rangeslider4_values_binding));
    	rangeslider5 = new RangeSlider({ props: { float: true }, $$inline: true });

    	rangeslider6 = new RangeSlider({
    			props: { float: true, pips: true },
    			$$inline: true
    		});

    	rangeslider7 = new RangeSlider({
    			props: {
    				float: true,
    				pips: true,
    				first: "label",
    				last: "label"
    			},
    			$$inline: true
    		});

    	rangeslider8 = new RangeSlider({
    			props: {
    				float: true,
    				pips: true,
    				first: "label",
    				last: "label",
    				rest: "label"
    			},
    			$$inline: true
    		});

    	rangeslider9 = new RangeSlider({
    			props: {
    				range: true,
    				values: [35, 65],
    				float: true,
    				pips: true
    			},
    			$$inline: true
    		});

    	rangeslider10 = new RangeSlider({
    			props: { range: "min", values: [65], float: true },
    			$$inline: true
    		});

    	rangeslider11 = new RangeSlider({
    			props: { range: "max", values: [35], pips: true },
    			$$inline: true
    		});

    	rangeslider12 = new RangeSlider({
    			props: {
    				float: true,
    				pips: true,
    				step: 10,
    				pipstep: 1
    			},
    			$$inline: true
    		});

    	rangeslider13 = new RangeSlider({
    			props: {
    				float: true,
    				pips: true,
    				step: 10,
    				pipstep: 2
    			},
    			$$inline: true
    		});

    	rangeslider14 = new RangeSlider({
    			props: {
    				float: true,
    				pips: true,
    				step: 0.1,
    				min: /*dynamic*/ ctx[3][0],
    				max: /*dynamic*/ ctx[3][1]
    			},
    			$$inline: true
    		});

    	function rangeslider15_values_binding(value) {
    		/*rangeslider15_values_binding*/ ctx[10].call(null, value);
    	}

    	let rangeslider15_props = {
    		float: true,
    		pips: true,
    		first: "label",
    		last: "label",
    		rest: true,
    		pipstep: 1,
    		range: true
    	};

    	if (/*dynamic*/ ctx[3] !== void 0) {
    		rangeslider15_props.values = /*dynamic*/ ctx[3];
    	}

    	rangeslider15 = new RangeSlider({
    			props: rangeslider15_props,
    			$$inline: true
    		});

    	binding_callbacks.push(() => bind(rangeslider15, "values", rangeslider15_values_binding));

    	rangeslider16 = new RangeSlider({
    			props: {
    				prefix: "$",
    				range: true,
    				values: [20, 80],
    				float: true,
    				pips: true,
    				first: "label",
    				last: "label"
    			},
    			$$inline: true
    		});

    	rangeslider17 = new RangeSlider({
    			props: {
    				prefix: "~",
    				suffix: "m²",
    				formatter: /*formatter*/ ctx[6],
    				range: true,
    				values: [100, 3000],
    				min: 100,
    				max: 3000,
    				step: 50,
    				float: true,
    				pips: true,
    				first: "label",
    				last: "label",
    				id: "clr-test"
    			},
    			$$inline: true
    		});

    	rangeslider18 = new RangeSlider({
    			props: {
    				handleFormatter: func,
    				formatter: func_1,
    				step: 1,
    				float: true,
    				pips: true,
    				first: "label",
    				last: "label"
    			},
    			$$inline: true
    		});

    	function rangeslider19_values_binding(value) {
    		/*rangeslider19_values_binding*/ ctx[11].call(null, value);
    	}

    	let rangeslider19_props = {
    		min: 0,
    		max: 6,
    		formatter: /*dayFormat*/ ctx[7],
    		float: true,
    		pips: true,
    		first: "label",
    		last: "label",
    		rest: "label"
    	};

    	if (/*day*/ ctx[1] !== void 0) {
    		rangeslider19_props.values = /*day*/ ctx[1];
    	}

    	rangeslider19 = new RangeSlider({
    			props: rangeslider19_props,
    			$$inline: true
    		});

    	binding_callbacks.push(() => bind(rangeslider19, "values", rangeslider19_values_binding));

    	function rangeslider20_values_binding(value) {
    		/*rangeslider20_values_binding*/ ctx[12].call(null, value);
    	}

    	let rangeslider20_props = {
    		min: 0,
    		max: 6,
    		formatter: /*dayFormatCn*/ ctx[8],
    		float: true,
    		pips: true,
    		first: "label",
    		last: "label",
    		rest: "label"
    	};

    	if (/*day*/ ctx[1] !== void 0) {
    		rangeslider20_props.values = /*day*/ ctx[1];
    	}

    	rangeslider20 = new RangeSlider({
    			props: rangeslider20_props,
    			$$inline: true
    		});

    	binding_callbacks.push(() => bind(rangeslider20, "values", rangeslider20_values_binding));

    	function rangeslider21_values_binding(value) {
    		/*rangeslider21_values_binding*/ ctx[14].call(null, value);
    	}

    	let rangeslider21_props = {
    		max: 360,
    		range: "min",
    		float: true,
    		formatter: /*func_2*/ ctx[13]
    	};

    	if (/*hue*/ ctx[2] !== void 0) {
    		rangeslider21_props.values = /*hue*/ ctx[2];
    	}

    	rangeslider21 = new RangeSlider({
    			props: rangeslider21_props,
    			$$inline: true
    		});

    	binding_callbacks.push(() => bind(rangeslider21, "values", rangeslider21_values_binding));

    	const block = {
    		c: function create() {
    			style = element("style");
    			style.textContent = "#clr-test {\n    --range-slider: rgb(195, 228, 222);\n    --range-handle-inactive: rgb(81, 185, 180);\n    --range-handle: rgb(81, 185, 180);\n    --range-handle-focus: rgb(35, 241, 214);\n    --range-float-text: darkcyan;\n    --pip: #eee;\n    --pip-text: #aaa;\n    --pip-active: black;\n    --pip-active-text: darkcyan;\n  }";
    			t1 = space();
    			main = element("main");
    			div = element("div");
    			create_component(rangeslider0.$$.fragment);
    			t2 = space();
    			create_component(rangeslider1.$$.fragment);
    			t3 = space();
    			create_component(rangeslider2.$$.fragment);
    			t4 = space();
    			br0 = element("br");
    			t5 = space();
    			create_component(rangeslider3.$$.fragment);
    			t6 = space();
    			create_component(rangeslider4.$$.fragment);
    			t7 = text(/*values*/ ctx[0]);
    			t8 = space();
    			create_component(rangeslider5.$$.fragment);
    			t9 = space();
    			create_component(rangeslider6.$$.fragment);
    			t10 = space();
    			create_component(rangeslider7.$$.fragment);
    			t11 = space();
    			create_component(rangeslider8.$$.fragment);
    			t12 = space();
    			br1 = element("br");
    			t13 = space();
    			create_component(rangeslider9.$$.fragment);
    			t14 = space();
    			create_component(rangeslider10.$$.fragment);
    			t15 = space();
    			create_component(rangeslider11.$$.fragment);
    			t16 = space();
    			br2 = element("br");
    			t17 = space();
    			create_component(rangeslider12.$$.fragment);
    			t18 = space();
    			create_component(rangeslider13.$$.fragment);
    			t19 = space();
    			create_component(rangeslider14.$$.fragment);
    			t20 = space();
    			br3 = element("br");
    			t21 = space();
    			create_component(rangeslider15.$$.fragment);
    			t22 = space();
    			create_component(rangeslider16.$$.fragment);
    			t23 = space();
    			create_component(rangeslider17.$$.fragment);
    			t24 = space();
    			create_component(rangeslider18.$$.fragment);
    			t25 = space();
    			br4 = element("br");
    			t26 = space();
    			create_component(rangeslider19.$$.fragment);
    			t27 = space();
    			create_component(rangeslider20.$$.fragment);
    			t28 = space();
    			br5 = element("br");
    			t29 = space();
    			br6 = element("br");
    			t30 = text(t30_value);
    			t31 = text(" | ");
    			t32 = text(t32_value);
    			br7 = element("br");
    			t33 = space();
    			br8 = element("br");
    			t34 = space();
    			create_component(rangeslider21.$$.fragment);
    			add_location(style, file$2, 32, 0, 754);
    			add_location(br0, file$2, 54, 4, 1430);
    			add_location(br1, file$2, 61, 4, 1685);
    			add_location(br2, file$2, 65, 4, 1851);
    			add_location(br3, file$2, 69, 4, 2042);
    			add_location(br4, file$2, 74, 4, 2532);
    			add_location(br5, file$2, 77, 4, 2797);
    			add_location(br6, file$2, 78, 4, 2806);
    			add_location(br7, file$2, 78, 51, 2853);
    			add_location(br8, file$2, 79, 4, 2862);
    			attr_dev(div, "class", "content");
    			set_style(div, "--range-handle-focus", /*color*/ ctx[5]);
    			set_style(div, "--range-handle", /*lightColor*/ ctx[4]);
    			add_location(div, file$2, 49, 2, 1119);
    			attr_dev(main, "class", "svelte-bufkk");
    			add_location(main, file$2, 47, 0, 1108);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			append_dev(document.head, style);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, main, anchor);
    			append_dev(main, div);
    			mount_component(rangeslider0, div, null);
    			append_dev(div, t2);
    			mount_component(rangeslider1, div, null);
    			append_dev(div, t3);
    			mount_component(rangeslider2, div, null);
    			append_dev(div, t4);
    			append_dev(div, br0);
    			append_dev(div, t5);
    			mount_component(rangeslider3, div, null);
    			append_dev(div, t6);
    			mount_component(rangeslider4, div, null);
    			append_dev(div, t7);
    			append_dev(div, t8);
    			mount_component(rangeslider5, div, null);
    			append_dev(div, t9);
    			mount_component(rangeslider6, div, null);
    			append_dev(div, t10);
    			mount_component(rangeslider7, div, null);
    			append_dev(div, t11);
    			mount_component(rangeslider8, div, null);
    			append_dev(div, t12);
    			append_dev(div, br1);
    			append_dev(div, t13);
    			mount_component(rangeslider9, div, null);
    			append_dev(div, t14);
    			mount_component(rangeslider10, div, null);
    			append_dev(div, t15);
    			mount_component(rangeslider11, div, null);
    			append_dev(div, t16);
    			append_dev(div, br2);
    			append_dev(div, t17);
    			mount_component(rangeslider12, div, null);
    			append_dev(div, t18);
    			mount_component(rangeslider13, div, null);
    			append_dev(div, t19);
    			mount_component(rangeslider14, div, null);
    			append_dev(div, t20);
    			append_dev(div, br3);
    			append_dev(div, t21);
    			mount_component(rangeslider15, div, null);
    			append_dev(div, t22);
    			mount_component(rangeslider16, div, null);
    			append_dev(div, t23);
    			mount_component(rangeslider17, div, null);
    			append_dev(div, t24);
    			mount_component(rangeslider18, div, null);
    			append_dev(div, t25);
    			append_dev(div, br4);
    			append_dev(div, t26);
    			mount_component(rangeslider19, div, null);
    			append_dev(div, t27);
    			mount_component(rangeslider20, div, null);
    			append_dev(div, t28);
    			append_dev(div, br5);
    			append_dev(div, t29);
    			append_dev(div, br6);
    			append_dev(div, t30);
    			append_dev(div, t31);
    			append_dev(div, t32);
    			append_dev(div, br7);
    			append_dev(div, t33);
    			append_dev(div, br8);
    			append_dev(div, t34);
    			mount_component(rangeslider21, div, null);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const rangeslider4_changes = {};

    			if (!updating_values && dirty & /*values*/ 1) {
    				updating_values = true;
    				rangeslider4_changes.values = /*values*/ ctx[0];
    				add_flush_callback(() => updating_values = false);
    			}

    			rangeslider4.$set(rangeslider4_changes);
    			if (!current || dirty & /*values*/ 1) set_data_dev(t7, /*values*/ ctx[0]);
    			const rangeslider14_changes = {};
    			if (dirty & /*dynamic*/ 8) rangeslider14_changes.min = /*dynamic*/ ctx[3][0];
    			if (dirty & /*dynamic*/ 8) rangeslider14_changes.max = /*dynamic*/ ctx[3][1];
    			rangeslider14.$set(rangeslider14_changes);
    			const rangeslider15_changes = {};

    			if (!updating_values_1 && dirty & /*dynamic*/ 8) {
    				updating_values_1 = true;
    				rangeslider15_changes.values = /*dynamic*/ ctx[3];
    				add_flush_callback(() => updating_values_1 = false);
    			}

    			rangeslider15.$set(rangeslider15_changes);
    			const rangeslider19_changes = {};

    			if (!updating_values_2 && dirty & /*day*/ 2) {
    				updating_values_2 = true;
    				rangeslider19_changes.values = /*day*/ ctx[1];
    				add_flush_callback(() => updating_values_2 = false);
    			}

    			rangeslider19.$set(rangeslider19_changes);
    			const rangeslider20_changes = {};

    			if (!updating_values_3 && dirty & /*day*/ 2) {
    				updating_values_3 = true;
    				rangeslider20_changes.values = /*day*/ ctx[1];
    				add_flush_callback(() => updating_values_3 = false);
    			}

    			rangeslider20.$set(rangeslider20_changes);
    			if ((!current || dirty & /*day*/ 2) && t30_value !== (t30_value = /*dayFormatCn*/ ctx[8](/*day*/ ctx[1][0]) + "")) set_data_dev(t30, t30_value);
    			if ((!current || dirty & /*day*/ 2) && t32_value !== (t32_value = /*dayFormat*/ ctx[7](/*day*/ ctx[1][0]) + "")) set_data_dev(t32, t32_value);
    			const rangeslider21_changes = {};
    			if (dirty & /*color*/ 32) rangeslider21_changes.formatter = /*func_2*/ ctx[13];

    			if (!updating_values_4 && dirty & /*hue*/ 4) {
    				updating_values_4 = true;
    				rangeslider21_changes.values = /*hue*/ ctx[2];
    				add_flush_callback(() => updating_values_4 = false);
    			}

    			rangeslider21.$set(rangeslider21_changes);

    			if (!current || dirty & /*color*/ 32) {
    				set_style(div, "--range-handle-focus", /*color*/ ctx[5]);
    			}

    			if (!current || dirty & /*lightColor*/ 16) {
    				set_style(div, "--range-handle", /*lightColor*/ ctx[4]);
    			}
    		},
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
    			transition_in(rangeslider10.$$.fragment, local);
    			transition_in(rangeslider11.$$.fragment, local);
    			transition_in(rangeslider12.$$.fragment, local);
    			transition_in(rangeslider13.$$.fragment, local);
    			transition_in(rangeslider14.$$.fragment, local);
    			transition_in(rangeslider15.$$.fragment, local);
    			transition_in(rangeslider16.$$.fragment, local);
    			transition_in(rangeslider17.$$.fragment, local);
    			transition_in(rangeslider18.$$.fragment, local);
    			transition_in(rangeslider19.$$.fragment, local);
    			transition_in(rangeslider20.$$.fragment, local);
    			transition_in(rangeslider21.$$.fragment, local);
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
    			transition_out(rangeslider10.$$.fragment, local);
    			transition_out(rangeslider11.$$.fragment, local);
    			transition_out(rangeslider12.$$.fragment, local);
    			transition_out(rangeslider13.$$.fragment, local);
    			transition_out(rangeslider14.$$.fragment, local);
    			transition_out(rangeslider15.$$.fragment, local);
    			transition_out(rangeslider16.$$.fragment, local);
    			transition_out(rangeslider17.$$.fragment, local);
    			transition_out(rangeslider18.$$.fragment, local);
    			transition_out(rangeslider19.$$.fragment, local);
    			transition_out(rangeslider20.$$.fragment, local);
    			transition_out(rangeslider21.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			detach_dev(style);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(main);
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
    			destroy_component(rangeslider10);
    			destroy_component(rangeslider11);
    			destroy_component(rangeslider12);
    			destroy_component(rangeslider13);
    			destroy_component(rangeslider14);
    			destroy_component(rangeslider15);
    			destroy_component(rangeslider16);
    			destroy_component(rangeslider17);
    			destroy_component(rangeslider18);
    			destroy_component(rangeslider19);
    			destroy_component(rangeslider20);
    			destroy_component(rangeslider21);
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

    const func = () => "O²";
    const func_1 = v => `${v}% O²`;

    function instance$2($$self, $$props, $$invalidate) {
    	const num = new Intl.NumberFormat("en-US");
    	const numzh = new Intl.NumberFormat("zh-Hans-CN-u-nu-hanidec");
    	let values = [20, 40, 60, 80];
    	let day = [3];
    	let hue = [244];
    	let dynamic = [0, 50];

    	const formatter = v => {
    		return num.format(v);
    	};

    	const days = [
    		"Monday",
    		"Tuesday",
    		"Wednesday",
    		"Thursday",
    		"Friday",
    		"Saturday",
    		"Happy Days"
    	];

    	const dayFormat = v => days[v];

    	const dayFormatCn = v => {
    		if (v === 6) {
    			return "星期日";
    		}

    		return "星期" + numzh.format(v + 1);
    	};

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<App> was created with unknown prop '${key}'`);
    	});

    	let { $$slots = {}, $$scope } = $$props;
    	validate_slots("App", $$slots, []);

    	function rangeslider4_values_binding(value) {
    		values = value;
    		$$invalidate(0, values);
    	}

    	function rangeslider15_values_binding(value) {
    		dynamic = value;
    		$$invalidate(3, dynamic);
    	}

    	function rangeslider19_values_binding(value) {
    		day = value;
    		$$invalidate(1, day);
    	}

    	function rangeslider20_values_binding(value) {
    		day = value;
    		$$invalidate(1, day);
    	}

    	const func_2 = v => color;

    	function rangeslider21_values_binding(value) {
    		hue = value;
    		$$invalidate(2, hue);
    	}

    	$$self.$capture_state = () => ({
    		RangeSlider,
    		num,
    		numzh,
    		values,
    		day,
    		hue,
    		dynamic,
    		formatter,
    		days,
    		dayFormat,
    		dayFormatCn,
    		lightColor,
    		color
    	});

    	$$self.$inject_state = $$props => {
    		if ("values" in $$props) $$invalidate(0, values = $$props.values);
    		if ("day" in $$props) $$invalidate(1, day = $$props.day);
    		if ("hue" in $$props) $$invalidate(2, hue = $$props.hue);
    		if ("dynamic" in $$props) $$invalidate(3, dynamic = $$props.dynamic);
    		if ("lightColor" in $$props) $$invalidate(4, lightColor = $$props.lightColor);
    		if ("color" in $$props) $$invalidate(5, color = $$props.color);
    	};

    	let lightColor;
    	let color;

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*hue*/ 4) {
    			 $$invalidate(4, lightColor = `hsl(${Math.round(hue[0]) - 10}, 65%, 70%)`);
    		}

    		if ($$self.$$.dirty & /*hue*/ 4) {
    			 $$invalidate(5, color = `hsl(${Math.round(hue[0])}, 63%, 54%)`);
    		}
    	};

    	return [
    		values,
    		day,
    		hue,
    		dynamic,
    		lightColor,
    		color,
    		formatter,
    		dayFormat,
    		dayFormatCn,
    		rangeslider4_values_binding,
    		rangeslider15_values_binding,
    		rangeslider19_values_binding,
    		rangeslider20_values_binding,
    		func_2,
    		rangeslider21_values_binding
    	];
    }

    class App extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$2, create_fragment$2, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "App",
    			options,
    			id: create_fragment$2.name
    		});
    	}
    }

    const app = new App({
    	target: document.body,
    	props: {
    		name: 'world'
    	}
    });

    return app;

}());
//# sourceMappingURL=bundle.js.map

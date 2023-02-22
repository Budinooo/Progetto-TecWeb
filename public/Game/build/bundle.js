
(function(l, r) { if (!l || l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (self.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(self.document);
var app = (function () {
    'use strict';

    function noop() { }
    const identity = x => x;
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
    let src_url_equal_anchor;
    function src_url_equal(element_src, url) {
        if (!src_url_equal_anchor) {
            src_url_equal_anchor = document.createElement('a');
        }
        src_url_equal_anchor.href = url;
        return element_src === src_url_equal_anchor.href;
    }
    function is_empty(obj) {
        return Object.keys(obj).length === 0;
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
    function update_slot_base(slot, slot_definition, ctx, $$scope, slot_changes, get_slot_context_fn) {
        if (slot_changes) {
            const slot_context = get_slot_context(slot_definition, ctx, $$scope, get_slot_context_fn);
            slot.p(slot_context, slot_changes);
        }
    }
    function get_all_dirty_from_scope($$scope) {
        if ($$scope.ctx.length > 32) {
            const dirty = [];
            const length = $$scope.ctx.length / 32;
            for (let i = 0; i < length; i++) {
                dirty[i] = -1;
            }
            return dirty;
        }
        return -1;
    }
    function exclude_internal_props(props) {
        const result = {};
        for (const k in props)
            if (k[0] !== '$')
                result[k] = props[k];
        return result;
    }
    function compute_rest_props(props, keys) {
        const rest = {};
        keys = new Set(keys);
        for (const k in props)
            if (!keys.has(k) && k[0] !== '$')
                rest[k] = props[k];
        return rest;
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
    function get_root_for_style(node) {
        if (!node)
            return document;
        const root = node.getRootNode ? node.getRootNode() : node.ownerDocument;
        if (root && root.host) {
            return root;
        }
        return node.ownerDocument;
    }
    function append_empty_stylesheet(node) {
        const style_element = element('style');
        append_stylesheet(get_root_for_style(node), style_element);
        return style_element.sheet;
    }
    function append_stylesheet(node, style) {
        append(node.head || node, style);
        return style.sheet;
    }
    function insert(target, node, anchor) {
        target.insertBefore(node, anchor || null);
    }
    function detach(node) {
        if (node.parentNode) {
            node.parentNode.removeChild(node);
        }
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
    function attr(node, attribute, value) {
        if (value == null)
            node.removeAttribute(attribute);
        else if (node.getAttribute(attribute) !== value)
            node.setAttribute(attribute, value);
    }
    function set_attributes(node, attributes) {
        // @ts-ignore
        const descriptors = Object.getOwnPropertyDescriptors(node.__proto__);
        for (const key in attributes) {
            if (attributes[key] == null) {
                node.removeAttribute(key);
            }
            else if (key === 'style') {
                node.style.cssText = attributes[key];
            }
            else if (key === '__value') {
                node.value = node[key] = attributes[key];
            }
            else if (descriptors[key] && descriptors[key].set) {
                node[key] = attributes[key];
            }
            else {
                attr(node, key, attributes[key]);
            }
        }
    }
    function children(element) {
        return Array.from(element.childNodes);
    }
    function set_style(node, key, value, important) {
        if (value === null) {
            node.style.removeProperty(key);
        }
        else {
            node.style.setProperty(key, value, important ? 'important' : '');
        }
    }
    function toggle_class(element, name, toggle) {
        element.classList[toggle ? 'add' : 'remove'](name);
    }
    function custom_event(type, detail, { bubbles = false, cancelable = false } = {}) {
        const e = document.createEvent('CustomEvent');
        e.initCustomEvent(type, bubbles, cancelable, detail);
        return e;
    }

    // we need to store the information for multiple documents because a Svelte application could also contain iframes
    // https://github.com/sveltejs/svelte/issues/3624
    const managed_styles = new Map();
    let active = 0;
    // https://github.com/darkskyapp/string-hash/blob/master/index.js
    function hash$2(str) {
        let hash = 5381;
        let i = str.length;
        while (i--)
            hash = ((hash << 5) - hash) ^ str.charCodeAt(i);
        return hash >>> 0;
    }
    function create_style_information(doc, node) {
        const info = { stylesheet: append_empty_stylesheet(node), rules: {} };
        managed_styles.set(doc, info);
        return info;
    }
    function create_rule(node, a, b, duration, delay, ease, fn, uid = 0) {
        const step = 16.666 / duration;
        let keyframes = '{\n';
        for (let p = 0; p <= 1; p += step) {
            const t = a + (b - a) * ease(p);
            keyframes += p * 100 + `%{${fn(t, 1 - t)}}\n`;
        }
        const rule = keyframes + `100% {${fn(b, 1 - b)}}\n}`;
        const name = `__svelte_${hash$2(rule)}_${uid}`;
        const doc = get_root_for_style(node);
        const { stylesheet, rules } = managed_styles.get(doc) || create_style_information(doc, node);
        if (!rules[name]) {
            rules[name] = true;
            stylesheet.insertRule(`@keyframes ${name} ${rule}`, stylesheet.cssRules.length);
        }
        const animation = node.style.animation || '';
        node.style.animation = `${animation ? `${animation}, ` : ''}${name} ${duration}ms linear ${delay}ms 1 both`;
        active += 1;
        return name;
    }
    function delete_rule(node, name) {
        const previous = (node.style.animation || '').split(', ');
        const next = previous.filter(name
            ? anim => anim.indexOf(name) < 0 // remove specific animation
            : anim => anim.indexOf('__svelte') === -1 // remove all Svelte animations
        );
        const deleted = previous.length - next.length;
        if (deleted) {
            node.style.animation = next.join(', ');
            active -= deleted;
            if (!active)
                clear_rules();
        }
    }
    function clear_rules() {
        raf(() => {
            if (active)
                return;
            managed_styles.forEach(info => {
                const { ownerNode } = info.stylesheet;
                // there is no ownerNode if it runs on jsdom.
                if (ownerNode)
                    detach(ownerNode);
            });
            managed_styles.clear();
        });
    }

    let current_component;
    function set_current_component(component) {
        current_component = component;
    }
    function get_current_component() {
        if (!current_component)
            throw new Error('Function called outside component initialization');
        return current_component;
    }
    /**
     * The `onMount` function schedules a callback to run as soon as the component has been mounted to the DOM.
     * It must be called during the component's initialisation (but doesn't need to live *inside* the component;
     * it can be called from an external module).
     *
     * `onMount` does not run inside a [server-side component](/docs#run-time-server-side-component-api).
     *
     * https://svelte.dev/docs#run-time-svelte-onmount
     */
    function onMount(fn) {
        get_current_component().$$.on_mount.push(fn);
    }
    /**
     * Schedules a callback to run immediately before the component is unmounted.
     *
     * Out of `onMount`, `beforeUpdate`, `afterUpdate` and `onDestroy`, this is the
     * only one that runs inside a server-side component.
     *
     * https://svelte.dev/docs#run-time-svelte-ondestroy
     */
    function onDestroy(fn) {
        get_current_component().$$.on_destroy.push(fn);
    }
    /**
     * Creates an event dispatcher that can be used to dispatch [component events](/docs#template-syntax-component-directives-on-eventname).
     * Event dispatchers are functions that can take two arguments: `name` and `detail`.
     *
     * Component events created with `createEventDispatcher` create a
     * [CustomEvent](https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent).
     * These events do not [bubble](https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Building_blocks/Events#Event_bubbling_and_capture).
     * The `detail` argument corresponds to the [CustomEvent.detail](https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent/detail)
     * property and can contain any type of data.
     *
     * https://svelte.dev/docs#run-time-svelte-createeventdispatcher
     */
    function createEventDispatcher() {
        const component = get_current_component();
        return (type, detail, { cancelable = false } = {}) => {
            const callbacks = component.$$.callbacks[type];
            if (callbacks) {
                // TODO are there situations where events could be dispatched
                // in a server (non-DOM) environment?
                const event = custom_event(type, detail, { cancelable });
                callbacks.slice().forEach(fn => {
                    fn.call(component, event);
                });
                return !event.defaultPrevented;
            }
            return true;
        };
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
    // flush() calls callbacks in this order:
    // 1. All beforeUpdate callbacks, in order: parents before children
    // 2. All bind:this callbacks, in reverse order: children before parents.
    // 3. All afterUpdate callbacks, in order: parents before children. EXCEPT
    //    for afterUpdates called during the initial onMount, which are called in
    //    reverse order: children before parents.
    // Since callbacks might update component values, which could trigger another
    // call to flush(), the following steps guard against this:
    // 1. During beforeUpdate, any updated components will be added to the
    //    dirty_components array and will cause a reentrant call to flush(). Because
    //    the flush index is kept outside the function, the reentrant call will pick
    //    up where the earlier call left off and go through all dirty components. The
    //    current_component value is saved and restored so that the reentrant call will
    //    not interfere with the "parent" flush() call.
    // 2. bind:this callbacks cannot trigger new flush() calls.
    // 3. During afterUpdate, any updated components will NOT have their afterUpdate
    //    callback called a second time; the seen_callbacks set, outside the flush()
    //    function, guarantees this behavior.
    const seen_callbacks = new Set();
    let flushidx = 0; // Do *not* move this inside the flush() function
    function flush() {
        const saved_component = current_component;
        do {
            // first, call beforeUpdate functions
            // and update components
            while (flushidx < dirty_components.length) {
                const component = dirty_components[flushidx];
                flushidx++;
                set_current_component(component);
                update(component.$$);
            }
            set_current_component(null);
            dirty_components.length = 0;
            flushidx = 0;
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
        seen_callbacks.clear();
        set_current_component(saved_component);
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

    let promise;
    function wait() {
        if (!promise) {
            promise = Promise.resolve();
            promise.then(() => {
                promise = null;
            });
        }
        return promise;
    }
    function dispatch(node, direction, kind) {
        node.dispatchEvent(custom_event(`${direction ? 'intro' : 'outro'}${kind}`));
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
        else if (callback) {
            callback();
        }
    }
    const null_transition = { duration: 0 };
    function create_in_transition(node, fn, params) {
        let config = fn(node, params);
        let running = false;
        let animation_name;
        let task;
        let uid = 0;
        function cleanup() {
            if (animation_name)
                delete_rule(node, animation_name);
        }
        function go() {
            const { delay = 0, duration = 300, easing = identity, tick = noop, css } = config || null_transition;
            if (css)
                animation_name = create_rule(node, 0, 1, duration, delay, easing, css, uid++);
            tick(0, 1);
            const start_time = now() + delay;
            const end_time = start_time + duration;
            if (task)
                task.abort();
            running = true;
            add_render_callback(() => dispatch(node, true, 'start'));
            task = loop(now => {
                if (running) {
                    if (now >= end_time) {
                        tick(1, 0);
                        dispatch(node, true, 'end');
                        cleanup();
                        return running = false;
                    }
                    if (now >= start_time) {
                        const t = easing((now - start_time) / duration);
                        tick(t, 1 - t);
                    }
                }
                return running;
            });
        }
        let started = false;
        return {
            start() {
                if (started)
                    return;
                started = true;
                delete_rule(node);
                if (is_function(config)) {
                    config = config();
                    wait().then(go);
                }
                else {
                    go();
                }
            },
            invalidate() {
                started = false;
            },
            end() {
                if (running) {
                    cleanup();
                    running = false;
                }
            }
        };
    }
    function create_bidirectional_transition(node, fn, params, intro) {
        let config = fn(node, params);
        let t = intro ? 0 : 1;
        let running_program = null;
        let pending_program = null;
        let animation_name = null;
        function clear_animation() {
            if (animation_name)
                delete_rule(node, animation_name);
        }
        function init(program, duration) {
            const d = (program.b - t);
            duration *= Math.abs(d);
            return {
                a: t,
                b: program.b,
                d,
                duration,
                start: program.start,
                end: program.start + duration,
                group: program.group
            };
        }
        function go(b) {
            const { delay = 0, duration = 300, easing = identity, tick = noop, css } = config || null_transition;
            const program = {
                start: now() + delay,
                b
            };
            if (!b) {
                // @ts-ignore todo: improve typings
                program.group = outros;
                outros.r += 1;
            }
            if (running_program || pending_program) {
                pending_program = program;
            }
            else {
                // if this is an intro, and there's a delay, we need to do
                // an initial tick and/or apply CSS animation immediately
                if (css) {
                    clear_animation();
                    animation_name = create_rule(node, t, b, duration, delay, easing, css);
                }
                if (b)
                    tick(0, 1);
                running_program = init(program, duration);
                add_render_callback(() => dispatch(node, b, 'start'));
                loop(now => {
                    if (pending_program && now > pending_program.start) {
                        running_program = init(pending_program, duration);
                        pending_program = null;
                        dispatch(node, running_program.b, 'start');
                        if (css) {
                            clear_animation();
                            animation_name = create_rule(node, t, running_program.b, running_program.duration, 0, easing, config.css);
                        }
                    }
                    if (running_program) {
                        if (now >= running_program.end) {
                            tick(t = running_program.b, 1 - t);
                            dispatch(node, running_program.b, 'end');
                            if (!pending_program) {
                                // we're done
                                if (running_program.b) {
                                    // intro — we can tidy up immediately
                                    clear_animation();
                                }
                                else {
                                    // outro — needs to be coordinated
                                    if (!--running_program.group.r)
                                        run_all(running_program.group.c);
                                }
                            }
                            running_program = null;
                        }
                        else if (now >= running_program.start) {
                            const p = now - running_program.start;
                            t = running_program.a + running_program.d * easing(p / running_program.duration);
                            tick(t, 1 - t);
                        }
                    }
                    return !!(running_program || pending_program);
                });
            }
        }
        return {
            run(b) {
                if (is_function(config)) {
                    wait().then(() => {
                        // @ts-ignore
                        config = config();
                        go(b);
                    });
                }
                else {
                    go(b);
                }
            },
            end() {
                clear_animation();
                running_program = pending_program = null;
            }
        };
    }

    const globals = (typeof window !== 'undefined'
        ? window
        : typeof globalThis !== 'undefined'
            ? globalThis
            : global);

    function destroy_block(block, lookup) {
        block.d(1);
        lookup.delete(block.key);
    }
    function outro_and_destroy_block(block, lookup) {
        transition_out(block, 1, 1, () => {
            lookup.delete(block.key);
        });
    }
    function update_keyed_each(old_blocks, dirty, get_key, dynamic, ctx, list, lookup, node, destroy, create_each_block, next, get_context) {
        let o = old_blocks.length;
        let n = list.length;
        let i = o;
        const old_indexes = {};
        while (i--)
            old_indexes[old_blocks[i].key] = i;
        const new_blocks = [];
        const new_lookup = new Map();
        const deltas = new Map();
        i = n;
        while (i--) {
            const child_ctx = get_context(ctx, list, i);
            const key = get_key(child_ctx);
            let block = lookup.get(key);
            if (!block) {
                block = create_each_block(key, child_ctx);
                block.c();
            }
            else if (dynamic) {
                block.p(child_ctx, dirty);
            }
            new_lookup.set(key, new_blocks[i] = block);
            if (key in old_indexes)
                deltas.set(key, Math.abs(i - old_indexes[key]));
        }
        const will_move = new Set();
        const did_move = new Set();
        function insert(block) {
            transition_in(block, 1);
            block.m(node, next);
            lookup.set(block.key, block);
            next = block.first;
            n--;
        }
        while (o && n) {
            const new_block = new_blocks[n - 1];
            const old_block = old_blocks[o - 1];
            const new_key = new_block.key;
            const old_key = old_block.key;
            if (new_block === old_block) {
                // do nothing
                next = new_block.first;
                o--;
                n--;
            }
            else if (!new_lookup.has(old_key)) {
                // remove old block
                destroy(old_block, lookup);
                o--;
            }
            else if (!lookup.has(new_key) || will_move.has(new_key)) {
                insert(new_block);
            }
            else if (did_move.has(old_key)) {
                o--;
            }
            else if (deltas.get(new_key) > deltas.get(old_key)) {
                did_move.add(new_key);
                insert(new_block);
            }
            else {
                will_move.add(old_key);
                o--;
            }
        }
        while (o--) {
            const old_block = old_blocks[o];
            if (!new_lookup.has(old_block.key))
                destroy(old_block, lookup);
        }
        while (n)
            insert(new_blocks[n - 1]);
        return new_blocks;
    }
    function validate_each_keys(ctx, list, get_context, get_key) {
        const keys = new Set();
        for (let i = 0; i < list.length; i++) {
            const key = get_key(get_context(ctx, list, i));
            if (keys.has(key)) {
                throw new Error('Cannot have duplicate keys in a keyed each');
            }
            keys.add(key);
        }
    }

    function get_spread_update(levels, updates) {
        const update = {};
        const to_null_out = {};
        const accounted_for = { $$scope: 1 };
        let i = levels.length;
        while (i--) {
            const o = levels[i];
            const n = updates[i];
            if (n) {
                for (const key in o) {
                    if (!(key in n))
                        to_null_out[key] = 1;
                }
                for (const key in n) {
                    if (!accounted_for[key]) {
                        update[key] = n[key];
                        accounted_for[key] = 1;
                    }
                }
                levels[i] = n;
            }
            else {
                for (const key in o) {
                    accounted_for[key] = 1;
                }
            }
        }
        for (const key in to_null_out) {
            if (!(key in update))
                update[key] = undefined;
        }
        return update;
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
    function mount_component(component, target, anchor, customElement) {
        const { fragment, after_update } = component.$$;
        fragment && fragment.m(target, anchor);
        if (!customElement) {
            // onMount happens before the initial afterUpdate
            add_render_callback(() => {
                const new_on_destroy = component.$$.on_mount.map(run).filter(is_function);
                // if the component was destroyed immediately
                // it will update the `$$.on_destroy` reference to `null`.
                // the destructured on_destroy may still reference to the old array
                if (component.$$.on_destroy) {
                    component.$$.on_destroy.push(...new_on_destroy);
                }
                else {
                    // Edge case - component was destroyed immediately,
                    // most likely as a result of a binding initialising
                    run_all(new_on_destroy);
                }
                component.$$.on_mount = [];
            });
        }
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
    function init(component, options, instance, create_fragment, not_equal, props, append_styles, dirty = [-1]) {
        const parent_component = current_component;
        set_current_component(component);
        const $$ = component.$$ = {
            fragment: null,
            ctx: [],
            // state
            props,
            update: noop,
            not_equal,
            bound: blank_object(),
            // lifecycle
            on_mount: [],
            on_destroy: [],
            on_disconnect: [],
            before_update: [],
            after_update: [],
            context: new Map(options.context || (parent_component ? parent_component.$$.context : [])),
            // everything else
            callbacks: blank_object(),
            dirty,
            skip_bound: false,
            root: options.target || parent_component.$$.root
        };
        append_styles && append_styles($$.root);
        let ready = false;
        $$.ctx = instance
            ? instance(component, options.props || {}, (i, ret, ...rest) => {
                const value = rest.length ? rest[0] : ret;
                if ($$.ctx && not_equal($$.ctx[i], $$.ctx[i] = value)) {
                    if (!$$.skip_bound && $$.bound[i])
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
            mount_component(component, options.target, options.anchor, options.customElement);
            flush();
        }
        set_current_component(parent_component);
    }
    /**
     * Base class for Svelte components. Used when dev=false.
     */
    class SvelteComponent {
        $destroy() {
            destroy_component(this, 1);
            this.$destroy = noop;
        }
        $on(type, callback) {
            if (!is_function(callback)) {
                return noop;
            }
            const callbacks = (this.$$.callbacks[type] || (this.$$.callbacks[type] = []));
            callbacks.push(callback);
            return () => {
                const index = callbacks.indexOf(callback);
                if (index !== -1)
                    callbacks.splice(index, 1);
            };
        }
        $set($$props) {
            if (this.$$set && !is_empty($$props)) {
                this.$$.skip_bound = true;
                this.$$set($$props);
                this.$$.skip_bound = false;
            }
        }
    }

    function dispatch_dev(type, detail) {
        document.dispatchEvent(custom_event(type, Object.assign({ version: '3.53.1' }, detail), { bubbles: true }));
    }
    function append_dev(target, node) {
        dispatch_dev('SvelteDOMInsert', { target, node });
        append(target, node);
    }
    function insert_dev(target, node, anchor) {
        dispatch_dev('SvelteDOMInsert', { target, node, anchor });
        insert(target, node, anchor);
    }
    function detach_dev(node) {
        dispatch_dev('SvelteDOMRemove', { node });
        detach(node);
    }
    function listen_dev(node, event, handler, options, has_prevent_default, has_stop_propagation) {
        const modifiers = options === true ? ['capture'] : options ? Array.from(Object.keys(options)) : [];
        if (has_prevent_default)
            modifiers.push('preventDefault');
        if (has_stop_propagation)
            modifiers.push('stopPropagation');
        dispatch_dev('SvelteDOMAddEventListener', { node, event, handler, modifiers });
        const dispose = listen(node, event, handler, options);
        return () => {
            dispatch_dev('SvelteDOMRemoveEventListener', { node, event, handler, modifiers });
            dispose();
        };
    }
    function attr_dev(node, attribute, value) {
        attr(node, attribute, value);
        if (value == null)
            dispatch_dev('SvelteDOMRemoveAttribute', { node, attribute });
        else
            dispatch_dev('SvelteDOMSetAttribute', { node, attribute, value });
    }
    function prop_dev(node, property, value) {
        node[property] = value;
        dispatch_dev('SvelteDOMSetProperty', { node, property, value });
    }
    function set_data_dev(text, data) {
        data = '' + data;
        if (text.wholeText === data)
            return;
        dispatch_dev('SvelteDOMSetData', { node: text, data });
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
    function construct_svelte_component_dev(component, props) {
        const error_message = 'this={...} of <svelte:component> should specify a Svelte component.';
        try {
            const instance = new component(props);
            if (!instance.$$ || !instance.$set || !instance.$on || !instance.$destroy) {
                throw new Error(error_message);
            }
            return instance;
        }
        catch (err) {
            const { message } = err;
            if (typeof message === 'string' && message.indexOf('is not a constructor') !== -1) {
                throw new Error(error_message);
            }
            else {
                throw err;
            }
        }
    }
    /**
     * Base class for Svelte components with some minor dev-enhancements. Used when dev=true.
     */
    class SvelteComponentDev extends SvelteComponent {
        constructor(options) {
            if (!options || (!options.target && !options.$$inline)) {
                throw new Error("'target' is a required option");
            }
            super();
        }
        $destroy() {
            super.$destroy();
            this.$destroy = () => {
                console.warn('Component was already destroyed'); // eslint-disable-line no-console
            };
        }
        $capture_state() { }
        $inject_state() { }
    }

    var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

    function getDefaultExportFromCjs (x) {
    	return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, 'default') ? x['default'] : x;
    }

    function createCommonjsModule(fn) {
      var module = { exports: {} };
    	return fn(module, module.exports), module.exports;
    }

    var page = createCommonjsModule(function (module, exports) {
    (function (global, factory) {
    	module.exports = factory() ;
    }(commonjsGlobal, (function () {
    var isarray = Array.isArray || function (arr) {
      return Object.prototype.toString.call(arr) == '[object Array]';
    };

    /**
     * Expose `pathToRegexp`.
     */
    var pathToRegexp_1 = pathToRegexp;
    var parse_1 = parse;
    var compile_1 = compile;
    var tokensToFunction_1 = tokensToFunction;
    var tokensToRegExp_1 = tokensToRegExp;

    /**
     * The main path matching regexp utility.
     *
     * @type {RegExp}
     */
    var PATH_REGEXP = new RegExp([
      // Match escaped characters that would otherwise appear in future matches.
      // This allows the user to escape special characters that won't transform.
      '(\\\\.)',
      // Match Express-style parameters and un-named parameters with a prefix
      // and optional suffixes. Matches appear as:
      //
      // "/:test(\\d+)?" => ["/", "test", "\d+", undefined, "?", undefined]
      // "/route(\\d+)"  => [undefined, undefined, undefined, "\d+", undefined, undefined]
      // "/*"            => ["/", undefined, undefined, undefined, undefined, "*"]
      '([\\/.])?(?:(?:\\:(\\w+)(?:\\(((?:\\\\.|[^()])+)\\))?|\\(((?:\\\\.|[^()])+)\\))([+*?])?|(\\*))'
    ].join('|'), 'g');

    /**
     * Parse a string for the raw tokens.
     *
     * @param  {String} str
     * @return {Array}
     */
    function parse (str) {
      var tokens = [];
      var key = 0;
      var index = 0;
      var path = '';
      var res;

      while ((res = PATH_REGEXP.exec(str)) != null) {
        var m = res[0];
        var escaped = res[1];
        var offset = res.index;
        path += str.slice(index, offset);
        index = offset + m.length;

        // Ignore already escaped sequences.
        if (escaped) {
          path += escaped[1];
          continue
        }

        // Push the current path onto the tokens.
        if (path) {
          tokens.push(path);
          path = '';
        }

        var prefix = res[2];
        var name = res[3];
        var capture = res[4];
        var group = res[5];
        var suffix = res[6];
        var asterisk = res[7];

        var repeat = suffix === '+' || suffix === '*';
        var optional = suffix === '?' || suffix === '*';
        var delimiter = prefix || '/';
        var pattern = capture || group || (asterisk ? '.*' : '[^' + delimiter + ']+?');

        tokens.push({
          name: name || key++,
          prefix: prefix || '',
          delimiter: delimiter,
          optional: optional,
          repeat: repeat,
          pattern: escapeGroup(pattern)
        });
      }

      // Match any characters still remaining.
      if (index < str.length) {
        path += str.substr(index);
      }

      // If the path exists, push it onto the end.
      if (path) {
        tokens.push(path);
      }

      return tokens
    }

    /**
     * Compile a string to a template function for the path.
     *
     * @param  {String}   str
     * @return {Function}
     */
    function compile (str) {
      return tokensToFunction(parse(str))
    }

    /**
     * Expose a method for transforming tokens into the path function.
     */
    function tokensToFunction (tokens) {
      // Compile all the tokens into regexps.
      var matches = new Array(tokens.length);

      // Compile all the patterns before compilation.
      for (var i = 0; i < tokens.length; i++) {
        if (typeof tokens[i] === 'object') {
          matches[i] = new RegExp('^' + tokens[i].pattern + '$');
        }
      }

      return function (obj) {
        var path = '';
        var data = obj || {};

        for (var i = 0; i < tokens.length; i++) {
          var token = tokens[i];

          if (typeof token === 'string') {
            path += token;

            continue
          }

          var value = data[token.name];
          var segment;

          if (value == null) {
            if (token.optional) {
              continue
            } else {
              throw new TypeError('Expected "' + token.name + '" to be defined')
            }
          }

          if (isarray(value)) {
            if (!token.repeat) {
              throw new TypeError('Expected "' + token.name + '" to not repeat, but received "' + value + '"')
            }

            if (value.length === 0) {
              if (token.optional) {
                continue
              } else {
                throw new TypeError('Expected "' + token.name + '" to not be empty')
              }
            }

            for (var j = 0; j < value.length; j++) {
              segment = encodeURIComponent(value[j]);

              if (!matches[i].test(segment)) {
                throw new TypeError('Expected all "' + token.name + '" to match "' + token.pattern + '", but received "' + segment + '"')
              }

              path += (j === 0 ? token.prefix : token.delimiter) + segment;
            }

            continue
          }

          segment = encodeURIComponent(value);

          if (!matches[i].test(segment)) {
            throw new TypeError('Expected "' + token.name + '" to match "' + token.pattern + '", but received "' + segment + '"')
          }

          path += token.prefix + segment;
        }

        return path
      }
    }

    /**
     * Escape a regular expression string.
     *
     * @param  {String} str
     * @return {String}
     */
    function escapeString (str) {
      return str.replace(/([.+*?=^!:${}()[\]|\/])/g, '\\$1')
    }

    /**
     * Escape the capturing group by escaping special characters and meaning.
     *
     * @param  {String} group
     * @return {String}
     */
    function escapeGroup (group) {
      return group.replace(/([=!:$\/()])/g, '\\$1')
    }

    /**
     * Attach the keys as a property of the regexp.
     *
     * @param  {RegExp} re
     * @param  {Array}  keys
     * @return {RegExp}
     */
    function attachKeys (re, keys) {
      re.keys = keys;
      return re
    }

    /**
     * Get the flags for a regexp from the options.
     *
     * @param  {Object} options
     * @return {String}
     */
    function flags (options) {
      return options.sensitive ? '' : 'i'
    }

    /**
     * Pull out keys from a regexp.
     *
     * @param  {RegExp} path
     * @param  {Array}  keys
     * @return {RegExp}
     */
    function regexpToRegexp (path, keys) {
      // Use a negative lookahead to match only capturing groups.
      var groups = path.source.match(/\((?!\?)/g);

      if (groups) {
        for (var i = 0; i < groups.length; i++) {
          keys.push({
            name: i,
            prefix: null,
            delimiter: null,
            optional: false,
            repeat: false,
            pattern: null
          });
        }
      }

      return attachKeys(path, keys)
    }

    /**
     * Transform an array into a regexp.
     *
     * @param  {Array}  path
     * @param  {Array}  keys
     * @param  {Object} options
     * @return {RegExp}
     */
    function arrayToRegexp (path, keys, options) {
      var parts = [];

      for (var i = 0; i < path.length; i++) {
        parts.push(pathToRegexp(path[i], keys, options).source);
      }

      var regexp = new RegExp('(?:' + parts.join('|') + ')', flags(options));

      return attachKeys(regexp, keys)
    }

    /**
     * Create a path regexp from string input.
     *
     * @param  {String} path
     * @param  {Array}  keys
     * @param  {Object} options
     * @return {RegExp}
     */
    function stringToRegexp (path, keys, options) {
      var tokens = parse(path);
      var re = tokensToRegExp(tokens, options);

      // Attach keys back to the regexp.
      for (var i = 0; i < tokens.length; i++) {
        if (typeof tokens[i] !== 'string') {
          keys.push(tokens[i]);
        }
      }

      return attachKeys(re, keys)
    }

    /**
     * Expose a function for taking tokens and returning a RegExp.
     *
     * @param  {Array}  tokens
     * @param  {Array}  keys
     * @param  {Object} options
     * @return {RegExp}
     */
    function tokensToRegExp (tokens, options) {
      options = options || {};

      var strict = options.strict;
      var end = options.end !== false;
      var route = '';
      var lastToken = tokens[tokens.length - 1];
      var endsWithSlash = typeof lastToken === 'string' && /\/$/.test(lastToken);

      // Iterate over the tokens and create our regexp string.
      for (var i = 0; i < tokens.length; i++) {
        var token = tokens[i];

        if (typeof token === 'string') {
          route += escapeString(token);
        } else {
          var prefix = escapeString(token.prefix);
          var capture = token.pattern;

          if (token.repeat) {
            capture += '(?:' + prefix + capture + ')*';
          }

          if (token.optional) {
            if (prefix) {
              capture = '(?:' + prefix + '(' + capture + '))?';
            } else {
              capture = '(' + capture + ')?';
            }
          } else {
            capture = prefix + '(' + capture + ')';
          }

          route += capture;
        }
      }

      // In non-strict mode we allow a slash at the end of match. If the path to
      // match already ends with a slash, we remove it for consistency. The slash
      // is valid at the end of a path match, not in the middle. This is important
      // in non-ending mode, where "/test/" shouldn't match "/test//route".
      if (!strict) {
        route = (endsWithSlash ? route.slice(0, -2) : route) + '(?:\\/(?=$))?';
      }

      if (end) {
        route += '$';
      } else {
        // In non-ending mode, we need the capturing groups to match as much as
        // possible by using a positive lookahead to the end or next path segment.
        route += strict && endsWithSlash ? '' : '(?=\\/|$)';
      }

      return new RegExp('^' + route, flags(options))
    }

    /**
     * Normalize the given path string, returning a regular expression.
     *
     * An empty array can be passed in for the keys, which will hold the
     * placeholder key descriptions. For example, using `/user/:id`, `keys` will
     * contain `[{ name: 'id', delimiter: '/', optional: false, repeat: false }]`.
     *
     * @param  {(String|RegExp|Array)} path
     * @param  {Array}                 [keys]
     * @param  {Object}                [options]
     * @return {RegExp}
     */
    function pathToRegexp (path, keys, options) {
      keys = keys || [];

      if (!isarray(keys)) {
        options = keys;
        keys = [];
      } else if (!options) {
        options = {};
      }

      if (path instanceof RegExp) {
        return regexpToRegexp(path, keys)
      }

      if (isarray(path)) {
        return arrayToRegexp(path, keys, options)
      }

      return stringToRegexp(path, keys, options)
    }

    pathToRegexp_1.parse = parse_1;
    pathToRegexp_1.compile = compile_1;
    pathToRegexp_1.tokensToFunction = tokensToFunction_1;
    pathToRegexp_1.tokensToRegExp = tokensToRegExp_1;

    /**
       * Module dependencies.
       */

      

      /**
       * Short-cuts for global-object checks
       */

      var hasDocument = ('undefined' !== typeof document);
      var hasWindow = ('undefined' !== typeof window);
      var hasHistory = ('undefined' !== typeof history);
      var hasProcess = typeof process !== 'undefined';

      /**
       * Detect click event
       */
      var clickEvent = hasDocument && document.ontouchstart ? 'touchstart' : 'click';

      /**
       * To work properly with the URL
       * history.location generated polyfill in https://github.com/devote/HTML5-History-API
       */

      var isLocation = hasWindow && !!(window.history.location || window.location);

      /**
       * The page instance
       * @api private
       */
      function Page() {
        // public things
        this.callbacks = [];
        this.exits = [];
        this.current = '';
        this.len = 0;

        // private things
        this._decodeURLComponents = true;
        this._base = '';
        this._strict = false;
        this._running = false;
        this._hashbang = false;

        // bound functions
        this.clickHandler = this.clickHandler.bind(this);
        this._onpopstate = this._onpopstate.bind(this);
      }

      /**
       * Configure the instance of page. This can be called multiple times.
       *
       * @param {Object} options
       * @api public
       */

      Page.prototype.configure = function(options) {
        var opts = options || {};

        this._window = opts.window || (hasWindow && window);
        this._decodeURLComponents = opts.decodeURLComponents !== false;
        this._popstate = opts.popstate !== false && hasWindow;
        this._click = opts.click !== false && hasDocument;
        this._hashbang = !!opts.hashbang;

        var _window = this._window;
        if(this._popstate) {
          _window.addEventListener('popstate', this._onpopstate, false);
        } else if(hasWindow) {
          _window.removeEventListener('popstate', this._onpopstate, false);
        }

        if (this._click) {
          _window.document.addEventListener(clickEvent, this.clickHandler, false);
        } else if(hasDocument) {
          _window.document.removeEventListener(clickEvent, this.clickHandler, false);
        }

        if(this._hashbang && hasWindow && !hasHistory) {
          _window.addEventListener('hashchange', this._onpopstate, false);
        } else if(hasWindow) {
          _window.removeEventListener('hashchange', this._onpopstate, false);
        }
      };

      /**
       * Get or set basepath to `path`.
       *
       * @param {string} path
       * @api public
       */

      Page.prototype.base = function(path) {
        if (0 === arguments.length) return this._base;
        this._base = path;
      };

      /**
       * Gets the `base`, which depends on whether we are using History or
       * hashbang routing.

       * @api private
       */
      Page.prototype._getBase = function() {
        var base = this._base;
        if(!!base) return base;
        var loc = hasWindow && this._window && this._window.location;

        if(hasWindow && this._hashbang && loc && loc.protocol === 'file:') {
          base = loc.pathname;
        }

        return base;
      };

      /**
       * Get or set strict path matching to `enable`
       *
       * @param {boolean} enable
       * @api public
       */

      Page.prototype.strict = function(enable) {
        if (0 === arguments.length) return this._strict;
        this._strict = enable;
      };


      /**
       * Bind with the given `options`.
       *
       * Options:
       *
       *    - `click` bind to click events [true]
       *    - `popstate` bind to popstate [true]
       *    - `dispatch` perform initial dispatch [true]
       *
       * @param {Object} options
       * @api public
       */

      Page.prototype.start = function(options) {
        var opts = options || {};
        this.configure(opts);

        if (false === opts.dispatch) return;
        this._running = true;

        var url;
        if(isLocation) {
          var window = this._window;
          var loc = window.location;

          if(this._hashbang && ~loc.hash.indexOf('#!')) {
            url = loc.hash.substr(2) + loc.search;
          } else if (this._hashbang) {
            url = loc.search + loc.hash;
          } else {
            url = loc.pathname + loc.search + loc.hash;
          }
        }

        this.replace(url, null, true, opts.dispatch);
      };

      /**
       * Unbind click and popstate event handlers.
       *
       * @api public
       */

      Page.prototype.stop = function() {
        if (!this._running) return;
        this.current = '';
        this.len = 0;
        this._running = false;

        var window = this._window;
        this._click && window.document.removeEventListener(clickEvent, this.clickHandler, false);
        hasWindow && window.removeEventListener('popstate', this._onpopstate, false);
        hasWindow && window.removeEventListener('hashchange', this._onpopstate, false);
      };

      /**
       * Show `path` with optional `state` object.
       *
       * @param {string} path
       * @param {Object=} state
       * @param {boolean=} dispatch
       * @param {boolean=} push
       * @return {!Context}
       * @api public
       */

      Page.prototype.show = function(path, state, dispatch, push) {
        var ctx = new Context(path, state, this),
          prev = this.prevContext;
        this.prevContext = ctx;
        this.current = ctx.path;
        if (false !== dispatch) this.dispatch(ctx, prev);
        if (false !== ctx.handled && false !== push) ctx.pushState();
        return ctx;
      };

      /**
       * Goes back in the history
       * Back should always let the current route push state and then go back.
       *
       * @param {string} path - fallback path to go back if no more history exists, if undefined defaults to page.base
       * @param {Object=} state
       * @api public
       */

      Page.prototype.back = function(path, state) {
        var page = this;
        if (this.len > 0) {
          var window = this._window;
          // this may need more testing to see if all browsers
          // wait for the next tick to go back in history
          hasHistory && window.history.back();
          this.len--;
        } else if (path) {
          setTimeout(function() {
            page.show(path, state);
          });
        } else {
          setTimeout(function() {
            page.show(page._getBase(), state);
          });
        }
      };

      /**
       * Register route to redirect from one path to other
       * or just redirect to another route
       *
       * @param {string} from - if param 'to' is undefined redirects to 'from'
       * @param {string=} to
       * @api public
       */
      Page.prototype.redirect = function(from, to) {
        var inst = this;

        // Define route from a path to another
        if ('string' === typeof from && 'string' === typeof to) {
          page.call(this, from, function(e) {
            setTimeout(function() {
              inst.replace(/** @type {!string} */ (to));
            }, 0);
          });
        }

        // Wait for the push state and replace it with another
        if ('string' === typeof from && 'undefined' === typeof to) {
          setTimeout(function() {
            inst.replace(from);
          }, 0);
        }
      };

      /**
       * Replace `path` with optional `state` object.
       *
       * @param {string} path
       * @param {Object=} state
       * @param {boolean=} init
       * @param {boolean=} dispatch
       * @return {!Context}
       * @api public
       */


      Page.prototype.replace = function(path, state, init, dispatch) {
        var ctx = new Context(path, state, this),
          prev = this.prevContext;
        this.prevContext = ctx;
        this.current = ctx.path;
        ctx.init = init;
        ctx.save(); // save before dispatching, which may redirect
        if (false !== dispatch) this.dispatch(ctx, prev);
        return ctx;
      };

      /**
       * Dispatch the given `ctx`.
       *
       * @param {Context} ctx
       * @api private
       */

      Page.prototype.dispatch = function(ctx, prev) {
        var i = 0, j = 0, page = this;

        function nextExit() {
          var fn = page.exits[j++];
          if (!fn) return nextEnter();
          fn(prev, nextExit);
        }

        function nextEnter() {
          var fn = page.callbacks[i++];

          if (ctx.path !== page.current) {
            ctx.handled = false;
            return;
          }
          if (!fn) return unhandled.call(page, ctx);
          fn(ctx, nextEnter);
        }

        if (prev) {
          nextExit();
        } else {
          nextEnter();
        }
      };

      /**
       * Register an exit route on `path` with
       * callback `fn()`, which will be called
       * on the previous context when a new
       * page is visited.
       */
      Page.prototype.exit = function(path, fn) {
        if (typeof path === 'function') {
          return this.exit('*', path);
        }

        var route = new Route(path, null, this);
        for (var i = 1; i < arguments.length; ++i) {
          this.exits.push(route.middleware(arguments[i]));
        }
      };

      /**
       * Handle "click" events.
       */

      /* jshint +W054 */
      Page.prototype.clickHandler = function(e) {
        if (1 !== this._which(e)) return;

        if (e.metaKey || e.ctrlKey || e.shiftKey) return;
        if (e.defaultPrevented) return;

        // ensure link
        // use shadow dom when available if not, fall back to composedPath()
        // for browsers that only have shady
        var el = e.target;
        var eventPath = e.path || (e.composedPath ? e.composedPath() : null);

        if(eventPath) {
          for (var i = 0; i < eventPath.length; i++) {
            if (!eventPath[i].nodeName) continue;
            if (eventPath[i].nodeName.toUpperCase() !== 'A') continue;
            if (!eventPath[i].href) continue;

            el = eventPath[i];
            break;
          }
        }

        // continue ensure link
        // el.nodeName for svg links are 'a' instead of 'A'
        while (el && 'A' !== el.nodeName.toUpperCase()) el = el.parentNode;
        if (!el || 'A' !== el.nodeName.toUpperCase()) return;

        // check if link is inside an svg
        // in this case, both href and target are always inside an object
        var svg = (typeof el.href === 'object') && el.href.constructor.name === 'SVGAnimatedString';

        // Ignore if tag has
        // 1. "download" attribute
        // 2. rel="external" attribute
        if (el.hasAttribute('download') || el.getAttribute('rel') === 'external') return;

        // ensure non-hash for the same path
        var link = el.getAttribute('href');
        if(!this._hashbang && this._samePath(el) && (el.hash || '#' === link)) return;

        // Check for mailto: in the href
        if (link && link.indexOf('mailto:') > -1) return;

        // check target
        // svg target is an object and its desired value is in .baseVal property
        if (svg ? el.target.baseVal : el.target) return;

        // x-origin
        // note: svg links that are not relative don't call click events (and skip page.js)
        // consequently, all svg links tested inside page.js are relative and in the same origin
        if (!svg && !this.sameOrigin(el.href)) return;

        // rebuild path
        // There aren't .pathname and .search properties in svg links, so we use href
        // Also, svg href is an object and its desired value is in .baseVal property
        var path = svg ? el.href.baseVal : (el.pathname + el.search + (el.hash || ''));

        path = path[0] !== '/' ? '/' + path : path;

        // strip leading "/[drive letter]:" on NW.js on Windows
        if (hasProcess && path.match(/^\/[a-zA-Z]:\//)) {
          path = path.replace(/^\/[a-zA-Z]:\//, '/');
        }

        // same page
        var orig = path;
        var pageBase = this._getBase();

        if (path.indexOf(pageBase) === 0) {
          path = path.substr(pageBase.length);
        }

        if (this._hashbang) path = path.replace('#!', '');

        if (pageBase && orig === path && (!isLocation || this._window.location.protocol !== 'file:')) {
          return;
        }

        e.preventDefault();
        this.show(orig);
      };

      /**
       * Handle "populate" events.
       * @api private
       */

      Page.prototype._onpopstate = (function () {
        var loaded = false;
        if ( ! hasWindow ) {
          return function () {};
        }
        if (hasDocument && document.readyState === 'complete') {
          loaded = true;
        } else {
          window.addEventListener('load', function() {
            setTimeout(function() {
              loaded = true;
            }, 0);
          });
        }
        return function onpopstate(e) {
          if (!loaded) return;
          var page = this;
          if (e.state) {
            var path = e.state.path;
            page.replace(path, e.state);
          } else if (isLocation) {
            var loc = page._window.location;
            page.show(loc.pathname + loc.search + loc.hash, undefined, undefined, false);
          }
        };
      })();

      /**
       * Event button.
       */
      Page.prototype._which = function(e) {
        e = e || (hasWindow && this._window.event);
        return null == e.which ? e.button : e.which;
      };

      /**
       * Convert to a URL object
       * @api private
       */
      Page.prototype._toURL = function(href) {
        var window = this._window;
        if(typeof URL === 'function' && isLocation) {
          return new URL(href, window.location.toString());
        } else if (hasDocument) {
          var anc = window.document.createElement('a');
          anc.href = href;
          return anc;
        }
      };

      /**
       * Check if `href` is the same origin.
       * @param {string} href
       * @api public
       */
      Page.prototype.sameOrigin = function(href) {
        if(!href || !isLocation) return false;

        var url = this._toURL(href);
        var window = this._window;

        var loc = window.location;

        /*
           When the port is the default http port 80 for http, or 443 for
           https, internet explorer 11 returns an empty string for loc.port,
           so we need to compare loc.port with an empty string if url.port
           is the default port 80 or 443.
           Also the comparition with `port` is changed from `===` to `==` because
           `port` can be a string sometimes. This only applies to ie11.
        */
        return loc.protocol === url.protocol &&
          loc.hostname === url.hostname &&
          (loc.port === url.port || loc.port === '' && (url.port == 80 || url.port == 443)); // jshint ignore:line
      };

      /**
       * @api private
       */
      Page.prototype._samePath = function(url) {
        if(!isLocation) return false;
        var window = this._window;
        var loc = window.location;
        return url.pathname === loc.pathname &&
          url.search === loc.search;
      };

      /**
       * Remove URL encoding from the given `str`.
       * Accommodates whitespace in both x-www-form-urlencoded
       * and regular percent-encoded form.
       *
       * @param {string} val - URL component to decode
       * @api private
       */
      Page.prototype._decodeURLEncodedURIComponent = function(val) {
        if (typeof val !== 'string') { return val; }
        return this._decodeURLComponents ? decodeURIComponent(val.replace(/\+/g, ' ')) : val;
      };

      /**
       * Create a new `page` instance and function
       */
      function createPage() {
        var pageInstance = new Page();

        function pageFn(/* args */) {
          return page.apply(pageInstance, arguments);
        }

        // Copy all of the things over. In 2.0 maybe we use setPrototypeOf
        pageFn.callbacks = pageInstance.callbacks;
        pageFn.exits = pageInstance.exits;
        pageFn.base = pageInstance.base.bind(pageInstance);
        pageFn.strict = pageInstance.strict.bind(pageInstance);
        pageFn.start = pageInstance.start.bind(pageInstance);
        pageFn.stop = pageInstance.stop.bind(pageInstance);
        pageFn.show = pageInstance.show.bind(pageInstance);
        pageFn.back = pageInstance.back.bind(pageInstance);
        pageFn.redirect = pageInstance.redirect.bind(pageInstance);
        pageFn.replace = pageInstance.replace.bind(pageInstance);
        pageFn.dispatch = pageInstance.dispatch.bind(pageInstance);
        pageFn.exit = pageInstance.exit.bind(pageInstance);
        pageFn.configure = pageInstance.configure.bind(pageInstance);
        pageFn.sameOrigin = pageInstance.sameOrigin.bind(pageInstance);
        pageFn.clickHandler = pageInstance.clickHandler.bind(pageInstance);

        pageFn.create = createPage;

        Object.defineProperty(pageFn, 'len', {
          get: function(){
            return pageInstance.len;
          },
          set: function(val) {
            pageInstance.len = val;
          }
        });

        Object.defineProperty(pageFn, 'current', {
          get: function(){
            return pageInstance.current;
          },
          set: function(val) {
            pageInstance.current = val;
          }
        });

        // In 2.0 these can be named exports
        pageFn.Context = Context;
        pageFn.Route = Route;

        return pageFn;
      }

      /**
       * Register `path` with callback `fn()`,
       * or route `path`, or redirection,
       * or `page.start()`.
       *
       *   page(fn);
       *   page('*', fn);
       *   page('/user/:id', load, user);
       *   page('/user/' + user.id, { some: 'thing' });
       *   page('/user/' + user.id);
       *   page('/from', '/to')
       *   page();
       *
       * @param {string|!Function|!Object} path
       * @param {Function=} fn
       * @api public
       */

      function page(path, fn) {
        // <callback>
        if ('function' === typeof path) {
          return page.call(this, '*', path);
        }

        // route <path> to <callback ...>
        if ('function' === typeof fn) {
          var route = new Route(/** @type {string} */ (path), null, this);
          for (var i = 1; i < arguments.length; ++i) {
            this.callbacks.push(route.middleware(arguments[i]));
          }
          // show <path> with [state]
        } else if ('string' === typeof path) {
          this['string' === typeof fn ? 'redirect' : 'show'](path, fn);
          // start [options]
        } else {
          this.start(path);
        }
      }

      /**
       * Unhandled `ctx`. When it's not the initial
       * popstate then redirect. If you wish to handle
       * 404s on your own use `page('*', callback)`.
       *
       * @param {Context} ctx
       * @api private
       */
      function unhandled(ctx) {
        if (ctx.handled) return;
        var current;
        var page = this;
        var window = page._window;

        if (page._hashbang) {
          current = isLocation && this._getBase() + window.location.hash.replace('#!', '');
        } else {
          current = isLocation && window.location.pathname + window.location.search;
        }

        if (current === ctx.canonicalPath) return;
        page.stop();
        ctx.handled = false;
        isLocation && (window.location.href = ctx.canonicalPath);
      }

      /**
       * Escapes RegExp characters in the given string.
       *
       * @param {string} s
       * @api private
       */
      function escapeRegExp(s) {
        return s.replace(/([.+*?=^!:${}()[\]|/\\])/g, '\\$1');
      }

      /**
       * Initialize a new "request" `Context`
       * with the given `path` and optional initial `state`.
       *
       * @constructor
       * @param {string} path
       * @param {Object=} state
       * @api public
       */

      function Context(path, state, pageInstance) {
        var _page = this.page = pageInstance || page;
        var window = _page._window;
        var hashbang = _page._hashbang;

        var pageBase = _page._getBase();
        if ('/' === path[0] && 0 !== path.indexOf(pageBase)) path = pageBase + (hashbang ? '#!' : '') + path;
        var i = path.indexOf('?');

        this.canonicalPath = path;
        var re = new RegExp('^' + escapeRegExp(pageBase));
        this.path = path.replace(re, '') || '/';
        if (hashbang) this.path = this.path.replace('#!', '') || '/';

        this.title = (hasDocument && window.document.title);
        this.state = state || {};
        this.state.path = path;
        this.querystring = ~i ? _page._decodeURLEncodedURIComponent(path.slice(i + 1)) : '';
        this.pathname = _page._decodeURLEncodedURIComponent(~i ? path.slice(0, i) : path);
        this.params = {};

        // fragment
        this.hash = '';
        if (!hashbang) {
          if (!~this.path.indexOf('#')) return;
          var parts = this.path.split('#');
          this.path = this.pathname = parts[0];
          this.hash = _page._decodeURLEncodedURIComponent(parts[1]) || '';
          this.querystring = this.querystring.split('#')[0];
        }
      }

      /**
       * Push state.
       *
       * @api private
       */

      Context.prototype.pushState = function() {
        var page = this.page;
        var window = page._window;
        var hashbang = page._hashbang;

        page.len++;
        if (hasHistory) {
            window.history.pushState(this.state, this.title,
              hashbang && this.path !== '/' ? '#!' + this.path : this.canonicalPath);
        }
      };

      /**
       * Save the context state.
       *
       * @api public
       */

      Context.prototype.save = function() {
        var page = this.page;
        if (hasHistory) {
            page._window.history.replaceState(this.state, this.title,
              page._hashbang && this.path !== '/' ? '#!' + this.path : this.canonicalPath);
        }
      };

      /**
       * Initialize `Route` with the given HTTP `path`,
       * and an array of `callbacks` and `options`.
       *
       * Options:
       *
       *   - `sensitive`    enable case-sensitive routes
       *   - `strict`       enable strict matching for trailing slashes
       *
       * @constructor
       * @param {string} path
       * @param {Object=} options
       * @api private
       */

      function Route(path, options, page) {
        var _page = this.page = page || globalPage;
        var opts = options || {};
        opts.strict = opts.strict || _page._strict;
        this.path = (path === '*') ? '(.*)' : path;
        this.method = 'GET';
        this.regexp = pathToRegexp_1(this.path, this.keys = [], opts);
      }

      /**
       * Return route middleware with
       * the given callback `fn()`.
       *
       * @param {Function} fn
       * @return {Function}
       * @api public
       */

      Route.prototype.middleware = function(fn) {
        var self = this;
        return function(ctx, next) {
          if (self.match(ctx.path, ctx.params)) {
            ctx.routePath = self.path;
            return fn(ctx, next);
          }
          next();
        };
      };

      /**
       * Check if this route matches `path`, if so
       * populate `params`.
       *
       * @param {string} path
       * @param {Object} params
       * @return {boolean}
       * @api private
       */

      Route.prototype.match = function(path, params) {
        var keys = this.keys,
          qsIndex = path.indexOf('?'),
          pathname = ~qsIndex ? path.slice(0, qsIndex) : path,
          m = this.regexp.exec(decodeURIComponent(pathname));

        if (!m) return false;

        delete params[0];

        for (var i = 1, len = m.length; i < len; ++i) {
          var key = keys[i - 1];
          var val = this.page._decodeURLEncodedURIComponent(m[i]);
          if (val !== undefined || !(hasOwnProperty.call(params, key.name))) {
            params[key.name] = val;
          }
        }

        return true;
      };


      /**
       * Module exports.
       */

      var globalPage = createPage();
      var page_js = globalPage;
      var default_1 = globalPage;

    page_js.default = default_1;

    return page_js;

    })));
    });

    /* src\component\Navbar.svelte generated by Svelte v3.53.1 */

    const file$r = "src\\component\\Navbar.svelte";

    // (36:4) {#if screenWidth>500}
    function create_if_block_2$3(ctx) {
    	let div0;
    	let input;
    	let t0;
    	let button;
    	let i;
    	let t1;
    	let div1;
    	let a0;
    	let t3;
    	let a1;
    	let t5;
    	let mounted;
    	let dispose;

    	function select_block_type(ctx, dirty) {
    		if (JSON.parse(localStorage.getItem("login")).islogged) return create_if_block_3$2;
    		return create_else_block_1$1;
    	}

    	let current_block_type = select_block_type();
    	let if_block = current_block_type(ctx);

    	const block = {
    		c: function create() {
    			div0 = element("div");
    			input = element("input");
    			t0 = space();
    			button = element("button");
    			i = element("i");
    			t1 = space();
    			div1 = element("div");
    			a0 = element("a");
    			a0.textContent = "SHOP";
    			t3 = space();
    			a1 = element("a");
    			a1.textContent = "BACKOFFICE";
    			t5 = space();
    			if_block.c();
    			attr_dev(input, "type", "text");
    			attr_dev(input, "class", "shopSearch svelte-114x7wo");
    			attr_dev(input, "placeholder", "Search for a product");
    			set_style(input, "width", "100%");
    			attr_dev(input, "id", "search");
    			add_location(input, file$r, 37, 8, 1138);
    			attr_dev(i, "class", "bi-search");
    			add_location(i, file$r, 38, 63, 1307);
    			attr_dev(button, "class", "shopSearchBtn svelte-114x7wo");
    			add_location(button, file$r, 38, 8, 1252);
    			set_style(div0, "display", "flex");
    			set_style(div0, "width", "57%");
    			set_style(div0, "height", "fit-content");
    			add_location(div0, file$r, 36, 6, 1070);
    			attr_dev(a0, "href", "/");
    			attr_dev(a0, "class", "svelte-114x7wo");
    			add_location(a0, file$r, 41, 8, 1435);
    			attr_dev(a1, "href", "/backoffice/");
    			attr_dev(a1, "class", "svelte-114x7wo");
    			add_location(a1, file$r, 42, 8, 1465);
    			attr_dev(div1, "class", "flex nav svelte-114x7wo");
    			set_style(div1, "justify-content", "space-between");
    			add_location(div1, file$r, 40, 6, 1363);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div0, anchor);
    			append_dev(div0, input);
    			append_dev(div0, t0);
    			append_dev(div0, button);
    			append_dev(button, i);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, div1, anchor);
    			append_dev(div1, a0);
    			append_dev(div1, t3);
    			append_dev(div1, a1);
    			append_dev(div1, t5);
    			if_block.m(div1, null);

    			if (!mounted) {
    				dispose = listen_dev(button, "click", /*searchProduct*/ ctx[3], false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if_block.p(ctx, dirty);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div0);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(div1);
    			if_block.d();
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_2$3.name,
    		type: "if",
    		source: "(36:4) {#if screenWidth>500}",
    		ctx
    	});

    	return block;
    }

    // (46:8) {:else}
    function create_else_block_1$1(ctx) {
    	let a;
    	let t;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			a = element("a");
    			t = text(/*log*/ ctx[1]);
    			attr_dev(a, "href", "/login/");
    			attr_dev(a, "class", "svelte-114x7wo");
    			add_location(a, file$r, 46, 10, 1667);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, a, anchor);
    			append_dev(a, t);

    			if (!mounted) {
    				dispose = listen_dev(a, "click", /*click_handler*/ ctx[4], false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*log*/ 2) set_data_dev(t, /*log*/ ctx[1]);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(a);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block_1$1.name,
    		type: "else",
    		source: "(46:8) {:else}",
    		ctx
    	});

    	return block;
    }

    // (44:8) {#if JSON.parse(localStorage.getItem("login")).islogged}
    function create_if_block_3$2(ctx) {
    	let a;
    	let t;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			a = element("a");
    			t = text(/*log*/ ctx[1]);
    			attr_dev(a, "href", window.location.href);
    			attr_dev(a, "class", "svelte-114x7wo");
    			add_location(a, file$r, 44, 10, 1580);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, a, anchor);
    			append_dev(a, t);

    			if (!mounted) {
    				dispose = listen_dev(a, "click", /*logout*/ ctx[2], false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*log*/ 2) set_data_dev(t, /*log*/ ctx[1]);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(a);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_3$2.name,
    		type: "if",
    		source: "(44:8) {#if JSON.parse(localStorage.getItem(\\\"login\\\")).islogged}",
    		ctx
    	});

    	return block;
    }

    // (52:2) {#if screenWidth<500}
    function create_if_block$g(ctx) {
    	let div0;
    	let input;
    	let t0;
    	let button;
    	let i;
    	let t1;
    	let div1;
    	let a0;
    	let t3;
    	let a1;
    	let t5;
    	let mounted;
    	let dispose;

    	function select_block_type_1(ctx, dirty) {
    		if (JSON.parse(localStorage.getItem("login")).islogged) return create_if_block_1$a;
    		return create_else_block$6;
    	}

    	let current_block_type = select_block_type_1();
    	let if_block = current_block_type(ctx);

    	const block = {
    		c: function create() {
    			div0 = element("div");
    			input = element("input");
    			t0 = space();
    			button = element("button");
    			i = element("i");
    			t1 = space();
    			div1 = element("div");
    			a0 = element("a");
    			a0.textContent = "SHOP";
    			t3 = space();
    			a1 = element("a");
    			a1.textContent = "BACKOFFICE";
    			t5 = space();
    			if_block.c();
    			attr_dev(input, "type", "text");
    			attr_dev(input, "class", "shopSearch svelte-114x7wo");
    			attr_dev(input, "placeholder", "Search for a product");
    			set_style(input, "width", "100%");
    			attr_dev(input, "id", "search");
    			add_location(input, file$r, 53, 6, 1921);
    			attr_dev(i, "class", "bi-search");
    			add_location(i, file$r, 54, 61, 2088);
    			attr_dev(button, "class", "shopSearchBtn svelte-114x7wo");
    			add_location(button, file$r, 54, 6, 2033);
    			set_style(div0, "display", "flex");
    			set_style(div0, "width", "90%");
    			set_style(div0, "height", "fit-content");
    			set_style(div0, "margin", "auto");
    			set_style(div0, "margin-top", "10px");
    			set_style(div0, "margin-bottom", "10px");
    			add_location(div0, file$r, 52, 4, 1805);
    			attr_dev(a0, "href", "/");
    			attr_dev(a0, "class", "svelte-114x7wo");
    			add_location(a0, file$r, 57, 6, 2208);
    			attr_dev(a1, "href", "/backoffice/");
    			attr_dev(a1, "class", "svelte-114x7wo");
    			add_location(a1, file$r, 58, 6, 2236);
    			attr_dev(div1, "class", "flex nav svelte-114x7wo");
    			set_style(div1, "justify-content", "space-around");
    			add_location(div1, file$r, 56, 4, 2140);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div0, anchor);
    			append_dev(div0, input);
    			append_dev(div0, t0);
    			append_dev(div0, button);
    			append_dev(button, i);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, div1, anchor);
    			append_dev(div1, a0);
    			append_dev(div1, t3);
    			append_dev(div1, a1);
    			append_dev(div1, t5);
    			if_block.m(div1, null);

    			if (!mounted) {
    				dispose = listen_dev(button, "click", /*searchProduct*/ ctx[3], false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if_block.p(ctx, dirty);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div0);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(div1);
    			if_block.d();
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$g.name,
    		type: "if",
    		source: "(52:2) {#if screenWidth<500}",
    		ctx
    	});

    	return block;
    }

    // (62:6) {:else}
    function create_else_block$6(ctx) {
    	let a;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			a = element("a");
    			a.textContent = "LOG IN";
    			attr_dev(a, "href", "/login/");
    			attr_dev(a, "class", "svelte-114x7wo");
    			add_location(a, file$r, 62, 8, 2432);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, a, anchor);

    			if (!mounted) {
    				dispose = listen_dev(a, "click", /*click_handler_1*/ ctx[5], false, false, false);
    				mounted = true;
    			}
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(a);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$6.name,
    		type: "else",
    		source: "(62:6) {:else}",
    		ctx
    	});

    	return block;
    }

    // (60:6) {#if JSON.parse(localStorage.getItem("login")).islogged}
    function create_if_block_1$a(ctx) {
    	let a;
    	let t;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			a = element("a");
    			t = text("LOG OUT");
    			attr_dev(a, "href", window.location.href);
    			attr_dev(a, "class", "svelte-114x7wo");
    			add_location(a, file$r, 60, 8, 2347);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, a, anchor);
    			append_dev(a, t);

    			if (!mounted) {
    				dispose = listen_dev(a, "click", /*logout*/ ctx[2], false, false, false);
    				mounted = true;
    			}
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(a);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$a.name,
    		type: "if",
    		source: "(60:6) {#if JSON.parse(localStorage.getItem(\\\"login\\\")).islogged}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$r(ctx) {
    	let header;
    	let div2;
    	let a0;
    	let div0;
    	let span0;
    	let t1;
    	let span1;
    	let img;
    	let img_src_value;
    	let t3;
    	let t4;
    	let div1;
    	let t6;
    	let t7;
    	let t8;
    	let div3;
    	let a1;
    	let t10;
    	let a2;
    	let t12;
    	let a3;
    	let t14;
    	let a4;
    	let t16;
    	let a5;
    	let t18;
    	let a6;
    	let t20;
    	let a7;
    	let t22;
    	let a8;
    	let if_block0 = /*screenWidth*/ ctx[0] > 500 && create_if_block_2$3(ctx);
    	let if_block1 = /*screenWidth*/ ctx[0] < 500 && create_if_block$g(ctx);

    	const block = {
    		c: function create() {
    			header = element("header");
    			div2 = element("div");
    			a0 = element("a");
    			div0 = element("div");
    			span0 = element("span");
    			span0.textContent = "A";
    			t1 = text("NIMAL");
    			span1 = element("span");
    			span1.textContent = "H";
    			img = element("img");
    			t3 = text("USE");
    			t4 = space();
    			div1 = element("div");
    			div1.textContent = "FOR YOUR PETS AND FOR YOUR MIND";
    			t6 = space();
    			if (if_block0) if_block0.c();
    			t7 = space();
    			if (if_block1) if_block1.c();
    			t8 = space();
    			div3 = element("div");
    			a1 = element("a");
    			a1.textContent = "HOME";
    			t10 = space();
    			a2 = element("a");
    			a2.textContent = "QUIZ";
    			t12 = space();
    			a3 = element("a");
    			a3.textContent = "WORDLE";
    			t14 = space();
    			a4 = element("a");
    			a4.textContent = "MEMORY";
    			t16 = space();
    			a5 = element("a");
    			a5.textContent = "FUNNY VIDEOS";
    			t18 = space();
    			a6 = element("a");
    			a6.textContent = "ANIMAL INFO";
    			t20 = space();
    			a7 = element("a");
    			a7.textContent = "MEDICAL INFO";
    			t22 = space();
    			a8 = element("a");
    			a8.textContent = "YOUR PETS";
    			attr_dev(span0, "class", "svelte-114x7wo");
    			add_location(span0, file$r, 32, 24, 851);
    			attr_dev(span1, "class", "svelte-114x7wo");
    			add_location(span1, file$r, 32, 43, 870);
    			if (!src_url_equal(img.src, img_src_value = "images/dog-house.png")) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", "logo");
    			attr_dev(img, "class", "svelte-114x7wo");
    			add_location(img, file$r, 32, 57, 884);
    			attr_dev(div0, "class", "logo svelte-114x7wo");
    			add_location(div0, file$r, 32, 6, 833);
    			attr_dev(div1, "class", "slogan svelte-114x7wo");
    			set_style(div1, "color", "#ff6a3d");
    			add_location(div1, file$r, 33, 6, 946);
    			attr_dev(a0, "class", "navbar-brand svelte-114x7wo");
    			attr_dev(a0, "href", "/game/");
    			add_location(a0, file$r, 31, 4, 787);
    			attr_dev(div2, "class", "container-fluid flex svelte-114x7wo");
    			toggle_class(div2, "width100", /*screenWidth*/ ctx[0] < 500);
    			add_location(div2, file$r, 30, 2, 714);
    			attr_dev(a1, "href", "/game/");
    			attr_dev(a1, "class", "svelte-114x7wo");
    			add_location(a1, file$r, 67, 4, 2596);
    			attr_dev(a2, "href", "/game/quiz");
    			attr_dev(a2, "class", "svelte-114x7wo");
    			add_location(a2, file$r, 68, 4, 2627);
    			attr_dev(a3, "href", "/game/wordle");
    			attr_dev(a3, "class", "svelte-114x7wo");
    			add_location(a3, file$r, 69, 4, 2662);
    			attr_dev(a4, "href", "/game/memory");
    			attr_dev(a4, "class", "svelte-114x7wo");
    			add_location(a4, file$r, 70, 4, 2701);
    			attr_dev(a5, "href", "/game/funnyvideos");
    			attr_dev(a5, "class", "svelte-114x7wo");
    			add_location(a5, file$r, 71, 4, 2740);
    			attr_dev(a6, "href", "/game/animalinfo");
    			attr_dev(a6, "class", "svelte-114x7wo");
    			add_location(a6, file$r, 72, 4, 2790);
    			attr_dev(a7, "href", "/game/medinfo");
    			attr_dev(a7, "class", "svelte-114x7wo");
    			add_location(a7, file$r, 73, 4, 2838);
    			attr_dev(a8, "href", "/game/yourpets");
    			attr_dev(a8, "class", "svelte-114x7wo");
    			add_location(a8, file$r, 74, 4, 2884);
    			attr_dev(div3, "class", "mininav container svelte-114x7wo");
    			toggle_class(div3, "mobile", /*screenWidth*/ ctx[0] < 500);
    			add_location(div3, file$r, 66, 2, 2528);
    			attr_dev(header, "class", "svelte-114x7wo");
    			add_location(header, file$r, 29, 0, 702);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, header, anchor);
    			append_dev(header, div2);
    			append_dev(div2, a0);
    			append_dev(a0, div0);
    			append_dev(div0, span0);
    			append_dev(div0, t1);
    			append_dev(div0, span1);
    			append_dev(div0, img);
    			append_dev(div0, t3);
    			append_dev(a0, t4);
    			append_dev(a0, div1);
    			append_dev(div2, t6);
    			if (if_block0) if_block0.m(div2, null);
    			append_dev(header, t7);
    			if (if_block1) if_block1.m(header, null);
    			append_dev(header, t8);
    			append_dev(header, div3);
    			append_dev(div3, a1);
    			append_dev(div3, t10);
    			append_dev(div3, a2);
    			append_dev(div3, t12);
    			append_dev(div3, a3);
    			append_dev(div3, t14);
    			append_dev(div3, a4);
    			append_dev(div3, t16);
    			append_dev(div3, a5);
    			append_dev(div3, t18);
    			append_dev(div3, a6);
    			append_dev(div3, t20);
    			append_dev(div3, a7);
    			append_dev(div3, t22);
    			append_dev(div3, a8);
    		},
    		p: function update(ctx, [dirty]) {
    			if (/*screenWidth*/ ctx[0] > 500) {
    				if (if_block0) {
    					if_block0.p(ctx, dirty);
    				} else {
    					if_block0 = create_if_block_2$3(ctx);
    					if_block0.c();
    					if_block0.m(div2, null);
    				}
    			} else if (if_block0) {
    				if_block0.d(1);
    				if_block0 = null;
    			}

    			if (dirty & /*screenWidth*/ 1) {
    				toggle_class(div2, "width100", /*screenWidth*/ ctx[0] < 500);
    			}

    			if (/*screenWidth*/ ctx[0] < 500) {
    				if (if_block1) {
    					if_block1.p(ctx, dirty);
    				} else {
    					if_block1 = create_if_block$g(ctx);
    					if_block1.c();
    					if_block1.m(header, t8);
    				}
    			} else if (if_block1) {
    				if_block1.d(1);
    				if_block1 = null;
    			}

    			if (dirty & /*screenWidth*/ 1) {
    				toggle_class(div3, "mobile", /*screenWidth*/ ctx[0] < 500);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(header);
    			if (if_block0) if_block0.d();
    			if (if_block1) if_block1.d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$r.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$r($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Navbar', slots, []);
    	var screenWidth = window.innerWidth;

    	window.addEventListener("resize", function (event) {
    		$$invalidate(0, screenWidth = window.innerWidth);
    	});

    	var log;
    	if (JSON.parse(localStorage.getItem("login")).islogged) log = "LOGOUT"; else log = "LOGIN";

    	const logout = () => {
    		const logInfo = { islogged: false, id: "" };
    		$$invalidate(1, log = "LOGIN");
    		localStorage.setItem("login", JSON.stringify(logInfo));
    	};

    	const searchProduct = () => {
    		let value = document.getElementById("search").value;
    		if (value && value != "" && value != " ") window.location.href = "/results?query=cat";
    	};

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Navbar> was created with unknown prop '${key}'`);
    	});

    	const click_handler = () => $$invalidate(1, log = "LOGOUT");
    	const click_handler_1 = () => $$invalidate(1, log = "LOGOUT");
    	$$self.$capture_state = () => ({ screenWidth, log, logout, searchProduct });

    	$$self.$inject_state = $$props => {
    		if ('screenWidth' in $$props) $$invalidate(0, screenWidth = $$props.screenWidth);
    		if ('log' in $$props) $$invalidate(1, log = $$props.log);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [screenWidth, log, logout, searchProduct, click_handler, click_handler_1];
    }

    class Navbar extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$r, create_fragment$r, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Navbar",
    			options,
    			id: create_fragment$r.name
    		});
    	}
    }

    /* src\component\Home.svelte generated by Svelte v3.53.1 */

    const file$q = "src\\component\\Home.svelte";

    function create_fragment$q(ctx) {
    	let div11;
    	let div0;
    	let t1;
    	let div9;
    	let div4;
    	let div2;
    	let div1;
    	let t3;
    	let div3;
    	let a0;
    	let img0;
    	let img0_src_value;
    	let t4;
    	let t5;
    	let a1;
    	let img1;
    	let img1_src_value;
    	let t6;
    	let t7;
    	let a2;
    	let img2;
    	let img2_src_value;
    	let t8;
    	let t9;
    	let div8;
    	let div6;
    	let div5;
    	let t11;
    	let div7;
    	let a3;
    	let img3;
    	let img3_src_value;
    	let t12;
    	let t13;
    	let a4;
    	let img4;
    	let img4_src_value;
    	let t14;
    	let t15;
    	let a5;
    	let img5;
    	let img5_src_value;
    	let t16;
    	let t17;
    	let div10;
    	let a6;
    	let t19;
    	let span;

    	const block = {
    		c: function create() {
    			div11 = element("div");
    			div0 = element("div");
    			div0.textContent = "WELCOME TO THE FUN ZONE";
    			t1 = space();
    			div9 = element("div");
    			div4 = element("div");
    			div2 = element("div");
    			div1 = element("div");
    			div1.textContent = "GAMES";
    			t3 = space();
    			div3 = element("div");
    			a0 = element("a");
    			img0 = element("img");
    			t4 = text(" QUIZ");
    			t5 = space();
    			a1 = element("a");
    			img1 = element("img");
    			t6 = text("WORDLE");
    			t7 = space();
    			a2 = element("a");
    			img2 = element("img");
    			t8 = text("MEMORY");
    			t9 = space();
    			div8 = element("div");
    			div6 = element("div");
    			div5 = element("div");
    			div5.textContent = "INFO & VIDEOS";
    			t11 = space();
    			div7 = element("div");
    			a3 = element("a");
    			img3 = element("img");
    			t12 = text("FUNNY VIDEOS");
    			t13 = space();
    			a4 = element("a");
    			img4 = element("img");
    			t14 = text("ANIMAL INFO");
    			t15 = space();
    			a5 = element("a");
    			img5 = element("img");
    			t16 = text("MEDICAL INFO");
    			t17 = space();
    			div10 = element("div");
    			a6 = element("a");
    			a6.textContent = "LOG IN";
    			t19 = text("  OR KEEP PLAYING AS A ");
    			span = element("span");
    			span.textContent = "GUEST";
    			attr_dev(div0, "class", "welcome svelte-3tbtcl");
    			toggle_class(div0, "moblogguest", /*screenWidth*/ ctx[0] < 500);
    			add_location(div0, file$q, 10, 4, 209);
    			add_location(div1, file$q, 16, 67, 612);
    			attr_dev(div2, "class", "title svelte-3tbtcl");
    			toggle_class(div2, "mobiletitle", /*screenWidth*/ ctx[0] < 500);
    			add_location(div2, file$q, 16, 12, 557);
    			if (!src_url_equal(img0.src, img0_src_value = "images/answer.png")) attr_dev(img0, "src", img0_src_value);
    			attr_dev(img0, "alt", "quiz");
    			attr_dev(img0, "class", "svelte-3tbtcl");
    			add_location(img0, file$q, 18, 89, 795);
    			attr_dev(a0, "class", "game flex svelte-3tbtcl");
    			attr_dev(a0, "href", "/game/quiz");
    			toggle_class(a0, "mobilefun", /*screenWidth*/ ctx[0] < 500);
    			add_location(a0, file$q, 18, 16, 722);
    			if (!src_url_equal(img1.src, img1_src_value = "https://static01.nyt.com/images/2022/03/02/crosswords/alpha-wordle-icon-new/alpha-wordle-icon-new-square320-v3.png?format=pjpg&quality=75&auto=webp&disable=upscale")) attr_dev(img1, "src", img1_src_value);
    			attr_dev(img1, "alt", "wordle");
    			attr_dev(img1, "class", "svelte-3tbtcl");
    			add_location(img1, file$q, 19, 91, 938);
    			attr_dev(a1, "class", "game flex svelte-3tbtcl");
    			attr_dev(a1, "href", "/game/wordle");
    			toggle_class(a1, "mobilefun", /*screenWidth*/ ctx[0] < 500);
    			add_location(a1, file$q, 19, 16, 863);
    			if (!src_url_equal(img2.src, img2_src_value = "images/memory.png")) attr_dev(img2, "src", img2_src_value);
    			attr_dev(img2, "alt", "memory");
    			attr_dev(img2, "class", "svelte-3tbtcl");
    			add_location(img2, file$q, 20, 91, 1230);
    			attr_dev(a2, "class", "game flex svelte-3tbtcl");
    			attr_dev(a2, "href", "/game/memory");
    			toggle_class(a2, "mobilefun", /*screenWidth*/ ctx[0] < 500);
    			add_location(a2, file$q, 20, 16, 1155);
    			attr_dev(div3, "class", "fun flex svelte-3tbtcl");
    			toggle_class(div3, "mobfun", /*screenWidth*/ ctx[0] < 500);
    			add_location(div3, file$q, 17, 12, 649);
    			attr_dev(div4, "class", "choosefun flex svelte-3tbtcl");
    			toggle_class(div4, "mobile", /*screenWidth*/ ctx[0] < 500);
    			add_location(div4, file$q, 15, 8, 483);
    			add_location(div5, file$q, 25, 68, 1525);
    			attr_dev(div6, "class", "title svelte-3tbtcl");
    			toggle_class(div6, "mobiletitle", /*screenWidth*/ ctx[0] < 500);
    			add_location(div6, file$q, 25, 12, 1469);
    			if (!src_url_equal(img3.src, img3_src_value = "images/youtube.png")) attr_dev(img3, "src", img3_src_value);
    			attr_dev(img3, "alt", "funny videos");
    			attr_dev(img3, "class", "svelte-3tbtcl");
    			add_location(img3, file$q, 27, 100, 1726);
    			attr_dev(a3, "class", "entertainment flex svelte-3tbtcl");
    			attr_dev(a3, "href", "/funnyvideos");
    			toggle_class(a3, "mobilefun", /*screenWidth*/ ctx[0] < 500);
    			add_location(a3, file$q, 27, 16, 1642);
    			if (!src_url_equal(img4.src, img4_src_value = "images/did-you-know.png")) attr_dev(img4, "src", img4_src_value);
    			attr_dev(img4, "alt", "quiz");
    			attr_dev(img4, "class", "svelte-3tbtcl");
    			add_location(img4, file$q, 28, 99, 1893);
    			attr_dev(a4, "class", "entertainment flex svelte-3tbtcl");
    			attr_dev(a4, "href", "/animalinfo");
    			toggle_class(a4, "mobilefun", /*screenWidth*/ ctx[0] < 500);
    			add_location(a4, file$q, 28, 16, 1810);
    			if (!src_url_equal(img5.src, img5_src_value = "images/stethoscope.png")) attr_dev(img5, "src", img5_src_value);
    			attr_dev(img5, "alt", "quiz");
    			attr_dev(img5, "class", "svelte-3tbtcl");
    			add_location(img5, file$q, 29, 96, 2053);
    			attr_dev(a5, "class", "entertainment flex svelte-3tbtcl");
    			attr_dev(a5, "href", "/medinfo");
    			toggle_class(a5, "mobilefun", /*screenWidth*/ ctx[0] < 500);
    			add_location(a5, file$q, 29, 16, 1973);
    			attr_dev(div7, "class", "fun flex svelte-3tbtcl");
    			toggle_class(div7, "mobfun", /*screenWidth*/ ctx[0] < 500);
    			add_location(div7, file$q, 26, 12, 1569);
    			attr_dev(div8, "class", "choosefun flex svelte-3tbtcl");
    			toggle_class(div8, "mobile", /*screenWidth*/ ctx[0] < 500);
    			add_location(div8, file$q, 24, 8, 1395);
    			attr_dev(div9, "class", "flex svelte-3tbtcl");
    			set_style(div9, "justify-content", "space-evenly");
    			toggle_class(div9, "mobileflex", /*screenWidth*/ ctx[0] < 500);
    			add_location(div9, file$q, 13, 4, 317);
    			attr_dev(a6, "href", "/");
    			set_style(a6, "color", "#ff6a3d");
    			set_style(a6, "font-weight", "800");
    			attr_dev(a6, "class", "svelte-3tbtcl");
    			add_location(a6, file$q, 34, 8, 2237);
    			set_style(span, "color", "#ff6a3d");
    			set_style(span, "font-weight", "800");
    			add_location(span, file$q, 34, 92, 2321);
    			attr_dev(div10, "class", "logguest svelte-3tbtcl");
    			toggle_class(div10, "moblogguest", /*screenWidth*/ ctx[0] < 500);
    			add_location(div10, file$q, 33, 4, 2169);
    			attr_dev(div11, "class", "container");
    			add_location(div11, file$q, 8, 0, 174);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div11, anchor);
    			append_dev(div11, div0);
    			append_dev(div11, t1);
    			append_dev(div11, div9);
    			append_dev(div9, div4);
    			append_dev(div4, div2);
    			append_dev(div2, div1);
    			append_dev(div4, t3);
    			append_dev(div4, div3);
    			append_dev(div3, a0);
    			append_dev(a0, img0);
    			append_dev(a0, t4);
    			append_dev(div3, t5);
    			append_dev(div3, a1);
    			append_dev(a1, img1);
    			append_dev(a1, t6);
    			append_dev(div3, t7);
    			append_dev(div3, a2);
    			append_dev(a2, img2);
    			append_dev(a2, t8);
    			append_dev(div9, t9);
    			append_dev(div9, div8);
    			append_dev(div8, div6);
    			append_dev(div6, div5);
    			append_dev(div8, t11);
    			append_dev(div8, div7);
    			append_dev(div7, a3);
    			append_dev(a3, img3);
    			append_dev(a3, t12);
    			append_dev(div7, t13);
    			append_dev(div7, a4);
    			append_dev(a4, img4);
    			append_dev(a4, t14);
    			append_dev(div7, t15);
    			append_dev(div7, a5);
    			append_dev(a5, img5);
    			append_dev(a5, t16);
    			append_dev(div11, t17);
    			append_dev(div11, div10);
    			append_dev(div10, a6);
    			append_dev(div10, t19);
    			append_dev(div10, span);
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*screenWidth*/ 1) {
    				toggle_class(div0, "moblogguest", /*screenWidth*/ ctx[0] < 500);
    			}

    			if (dirty & /*screenWidth*/ 1) {
    				toggle_class(div2, "mobiletitle", /*screenWidth*/ ctx[0] < 500);
    			}

    			if (dirty & /*screenWidth*/ 1) {
    				toggle_class(a0, "mobilefun", /*screenWidth*/ ctx[0] < 500);
    			}

    			if (dirty & /*screenWidth*/ 1) {
    				toggle_class(a1, "mobilefun", /*screenWidth*/ ctx[0] < 500);
    			}

    			if (dirty & /*screenWidth*/ 1) {
    				toggle_class(a2, "mobilefun", /*screenWidth*/ ctx[0] < 500);
    			}

    			if (dirty & /*screenWidth*/ 1) {
    				toggle_class(div3, "mobfun", /*screenWidth*/ ctx[0] < 500);
    			}

    			if (dirty & /*screenWidth*/ 1) {
    				toggle_class(div4, "mobile", /*screenWidth*/ ctx[0] < 500);
    			}

    			if (dirty & /*screenWidth*/ 1) {
    				toggle_class(div6, "mobiletitle", /*screenWidth*/ ctx[0] < 500);
    			}

    			if (dirty & /*screenWidth*/ 1) {
    				toggle_class(a3, "mobilefun", /*screenWidth*/ ctx[0] < 500);
    			}

    			if (dirty & /*screenWidth*/ 1) {
    				toggle_class(a4, "mobilefun", /*screenWidth*/ ctx[0] < 500);
    			}

    			if (dirty & /*screenWidth*/ 1) {
    				toggle_class(a5, "mobilefun", /*screenWidth*/ ctx[0] < 500);
    			}

    			if (dirty & /*screenWidth*/ 1) {
    				toggle_class(div7, "mobfun", /*screenWidth*/ ctx[0] < 500);
    			}

    			if (dirty & /*screenWidth*/ 1) {
    				toggle_class(div8, "mobile", /*screenWidth*/ ctx[0] < 500);
    			}

    			if (dirty & /*screenWidth*/ 1) {
    				toggle_class(div9, "mobileflex", /*screenWidth*/ ctx[0] < 500);
    			}

    			if (dirty & /*screenWidth*/ 1) {
    				toggle_class(div10, "moblogguest", /*screenWidth*/ ctx[0] < 500);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div11);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$q.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$q($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Home', slots, []);
    	var screenWidth = window.innerWidth;

    	window.addEventListener("resize", function (event) {
    		$$invalidate(0, screenWidth = window.innerWidth);
    	});

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Home> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({ screenWidth });

    	$$self.$inject_state = $$props => {
    		if ('screenWidth' in $$props) $$invalidate(0, screenWidth = $$props.screenWidth);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [screenWidth];
    }

    class Home extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$q, create_fragment$q, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Home",
    			options,
    			id: create_fragment$q.name
    		});
    	}
    }

    /* src\component\Footer.svelte generated by Svelte v3.53.1 */

    const file$p = "src\\component\\Footer.svelte";

    // (48:4) {:else}
    function create_else_block$5(ctx) {
    	let div0;
    	let span;
    	let t1;
    	let t2;
    	let div1;
    	let t3;
    	let img;
    	let img_src_value;
    	let t4;

    	const block = {
    		c: function create() {
    			div0 = element("div");
    			span = element("span");
    			span.textContent = "Number 1";
    			t1 = text(" Pet store");
    			t2 = space();
    			div1 = element("div");
    			t3 = text("in the W");
    			img = element("img");
    			t4 = text("rld");
    			set_style(span, "color", "#ff6a3d");
    			add_location(span, file$p, 48, 106, 1960);
    			set_style(div0, "font-weight", "bold");
    			set_style(div0, "text-align", "center");
    			set_style(div0, "font-size", "200%");
    			set_style(div0, "color", "white");
    			set_style(div0, "padding-top", "10px");
    			add_location(div0, file$p, 48, 8, 1862);
    			if (!src_url_equal(img.src, img_src_value = "images/dog-house.png")) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", "logo");
    			attr_dev(img, "width", "25px");
    			set_style(img, "margin-bottom", "5px");
    			add_location(img, file$p, 49, 134, 2155);
    			set_style(div1, "font-weight", "bold");
    			set_style(div1, "text-align", "center");
    			set_style(div1, "font-size", "190%");
    			set_style(div1, "color", "white");
    			set_style(div1, "padding-top", "10px");
    			set_style(div1, "margin-bottom", "20px");
    			add_location(div1, file$p, 49, 8, 2029);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div0, anchor);
    			append_dev(div0, span);
    			append_dev(div0, t1);
    			insert_dev(target, t2, anchor);
    			insert_dev(target, div1, anchor);
    			append_dev(div1, t3);
    			append_dev(div1, img);
    			append_dev(div1, t4);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div0);
    			if (detaching) detach_dev(t2);
    			if (detaching) detach_dev(div1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$5.name,
    		type: "else",
    		source: "(48:4) {:else}",
    		ctx
    	});

    	return block;
    }

    // (45:4) {#if screenWidth > 500}
    function create_if_block$f(ctx) {
    	let p;
    	let span;
    	let t1;
    	let img;
    	let img_src_value;
    	let t2;

    	const block = {
    		c: function create() {
    			p = element("p");
    			span = element("span");
    			span.textContent = "Number 1";
    			t1 = text(" Pet store in the W");
    			img = element("img");
    			t2 = text("rld");
    			set_style(span, "color", "#ff6a3d");
    			add_location(span, file$p, 46, 12, 1687);
    			if (!src_url_equal(img.src, img_src_value = "images/dog-house.png")) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", "logo");
    			attr_dev(img, "width", "25px");
    			set_style(img, "margin-bottom", "5px");
    			add_location(img, file$p, 46, 74, 1749);
    			set_style(p, "font-weight", "bold");
    			set_style(p, "text-align", "center");
    			set_style(p, "font-size", "200%");
    			set_style(p, "color", "white");
    			set_style(p, "padding-top", "10px");
    			add_location(p, file$p, 45, 8, 1578);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, p, anchor);
    			append_dev(p, span);
    			append_dev(p, t1);
    			append_dev(p, img);
    			append_dev(p, t2);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(p);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$f.name,
    		type: "if",
    		source: "(45:4) {#if screenWidth > 500}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$p(ctx) {
    	let footer;
    	let t0;
    	let div;
    	let i0;
    	let t1;
    	let i1;
    	let t2;
    	let i2;
    	let t3;
    	let i3;
    	let t4;
    	let i4;
    	let t5;
    	let i5;

    	function select_block_type(ctx, dirty) {
    		if (/*screenWidth*/ ctx[0] > 500) return create_if_block$f;
    		return create_else_block$5;
    	}

    	let current_block_type = select_block_type(ctx);
    	let if_block = current_block_type(ctx);

    	const block = {
    		c: function create() {
    			footer = element("footer");
    			if_block.c();
    			t0 = space();
    			div = element("div");
    			i0 = element("i");
    			t1 = space();
    			i1 = element("i");
    			t2 = space();
    			i2 = element("i");
    			t3 = space();
    			i3 = element("i");
    			t4 = space();
    			i4 = element("i");
    			t5 = space();
    			i5 = element("i");
    			attr_dev(i0, "class", "bi-facebook svelte-7kfg1h");
    			add_location(i0, file$p, 53, 8, 2316);
    			attr_dev(i1, "class", "bi-instagram svelte-7kfg1h");
    			add_location(i1, file$p, 54, 8, 2353);
    			attr_dev(i2, "class", "bi-twitter svelte-7kfg1h");
    			add_location(i2, file$p, 55, 8, 2391);
    			attr_dev(i3, "class", "bi-youtube svelte-7kfg1h");
    			add_location(i3, file$p, 56, 8, 2427);
    			attr_dev(i4, "class", "bi-linkedin svelte-7kfg1h");
    			add_location(i4, file$p, 57, 8, 2463);
    			attr_dev(i5, "class", "bi-tiktok svelte-7kfg1h");
    			add_location(i5, file$p, 58, 8, 2500);
    			attr_dev(div, "id", "socials");
    			attr_dev(div, "class", "container svelte-7kfg1h");
    			add_location(div, file$p, 52, 4, 2270);
    			attr_dev(footer, "class", "footer svelte-7kfg1h");
    			add_location(footer, file$p, 43, 0, 1516);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, footer, anchor);
    			if_block.m(footer, null);
    			append_dev(footer, t0);
    			append_dev(footer, div);
    			append_dev(div, i0);
    			append_dev(div, t1);
    			append_dev(div, i1);
    			append_dev(div, t2);
    			append_dev(div, i2);
    			append_dev(div, t3);
    			append_dev(div, i3);
    			append_dev(div, t4);
    			append_dev(div, i4);
    			append_dev(div, t5);
    			append_dev(div, i5);
    		},
    		p: function update(ctx, [dirty]) {
    			if (current_block_type !== (current_block_type = select_block_type(ctx))) {
    				if_block.d(1);
    				if_block = current_block_type(ctx);

    				if (if_block) {
    					if_block.c();
    					if_block.m(footer, t0);
    				}
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(footer);
    			if_block.d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$p.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$p($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Footer', slots, []);
    	var screenWidth = window.innerWidth;

    	window.addEventListener("resize", function (event) {
    		$$invalidate(0, screenWidth = window.innerWidth);
    	});

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Footer> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({ screenWidth });

    	$$self.$inject_state = $$props => {
    		if ('screenWidth' in $$props) $$invalidate(0, screenWidth = $$props.screenWidth);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [screenWidth];
    }

    class Footer extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$p, create_fragment$p, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Footer",
    			options,
    			id: create_fragment$p.name
    		});
    	}
    }

    function cubicOut(t) {
        const f = t - 1.0;
        return f * f * f + 1.0;
    }

    function fade(node, { delay = 0, duration = 400, easing = identity } = {}) {
        const o = +getComputedStyle(node).opacity;
        return {
            delay,
            duration,
            easing,
            css: t => `opacity: ${t * o}`
        };
    }
    function fly(node, { delay = 0, duration = 400, easing = cubicOut, x = 0, y = 0, opacity = 0 } = {}) {
        const style = getComputedStyle(node);
        const target_opacity = +style.opacity;
        const transform = style.transform === 'none' ? '' : style.transform;
        const od = target_opacity * (1 - opacity);
        return {
            delay,
            duration,
            easing,
            css: (t, u) => `
			transform: ${transform} translate(${(1 - t) * x}px, ${(1 - t) * y}px);
			opacity: ${target_opacity - (od * u)}`
        };
    }

    /* src\component\quiz\Answers.svelte generated by Svelte v3.53.1 */

    const { console: console_1$4 } = globals;
    const file$o = "src\\component\\quiz\\Answers.svelte";

    function get_each_context$c(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[20] = list[i];
    	child_ctx[22] = i;
    	return child_ctx;
    }

    // (144:28) 
    function create_if_block_1$9(ctx) {
    	let button;
    	let t_value = /*answer*/ ctx[20] + "";
    	let t;
    	let button_transition;
    	let current;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			button = element("button");
    			t = text(t_value);
    			attr_dev(button, "class", "wrong svelte-1g8s7qa");
    			toggle_class(button, "mobile", /*screenWidth*/ ctx[3] < 500);
    			add_location(button, file$o, 144, 12, 5887);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, button, anchor);
    			append_dev(button, t);
    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(button, "click", /*chooseWrongAnswer*/ ctx[5], false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			if ((!current || dirty & /*wrongAnswers*/ 2) && t_value !== (t_value = /*answer*/ ctx[20] + "")) set_data_dev(t, t_value);

    			if (!current || dirty & /*screenWidth*/ 8) {
    				toggle_class(button, "mobile", /*screenWidth*/ ctx[3] < 500);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;

    			add_render_callback(() => {
    				if (!button_transition) button_transition = create_bidirectional_transition(
    					button,
    					fly,
    					{
    						y: 200,
    						duration: 600 * (/*index*/ ctx[22] + 1)
    					},
    					true
    				);

    				button_transition.run(1);
    			});

    			current = true;
    		},
    		o: function outro(local) {
    			if (!button_transition) button_transition = create_bidirectional_transition(
    				button,
    				fly,
    				{
    					y: 200,
    					duration: 600 * (/*index*/ ctx[22] + 1)
    				},
    				false
    			);

    			button_transition.run(0);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(button);
    			if (detaching && button_transition) button_transition.end();
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$9.name,
    		type: "if",
    		source: "(144:28) ",
    		ctx
    	});

    	return block;
    }

    // (142:8) {#if correctAnswerPosition === index && quizReady}
    function create_if_block$e(ctx) {
    	let button;
    	let t_value = /*answer*/ ctx[20] + "";
    	let t;
    	let button_transition;
    	let current;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			button = element("button");
    			t = text(t_value);
    			attr_dev(button, "class", "correct svelte-1g8s7qa");
    			toggle_class(button, "mobile", /*screenWidth*/ ctx[3] < 500);
    			add_location(button, file$o, 142, 12, 5684);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, button, anchor);
    			append_dev(button, t);
    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(button, "click", /*chooseCorrectAnswer*/ ctx[4], false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			if ((!current || dirty & /*wrongAnswers*/ 2) && t_value !== (t_value = /*answer*/ ctx[20] + "")) set_data_dev(t, t_value);

    			if (!current || dirty & /*screenWidth*/ 8) {
    				toggle_class(button, "mobile", /*screenWidth*/ ctx[3] < 500);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;

    			add_render_callback(() => {
    				if (!button_transition) button_transition = create_bidirectional_transition(
    					button,
    					fly,
    					{
    						y: 200,
    						duration: 600 * (/*index*/ ctx[22] + 1)
    					},
    					true
    				);

    				button_transition.run(1);
    			});

    			current = true;
    		},
    		o: function outro(local) {
    			if (!button_transition) button_transition = create_bidirectional_transition(
    				button,
    				fly,
    				{
    					y: 200,
    					duration: 600 * (/*index*/ ctx[22] + 1)
    				},
    				false
    			);

    			button_transition.run(0);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(button);
    			if (detaching && button_transition) button_transition.end();
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$e.name,
    		type: "if",
    		source: "(142:8) {#if correctAnswerPosition === index && quizReady}",
    		ctx
    	});

    	return block;
    }

    // (141:4) {#each wrongAnswers as answer, index (index)}
    function create_each_block$c(key_1, ctx) {
    	let first;
    	let current_block_type_index;
    	let if_block;
    	let if_block_anchor;
    	let current;
    	const if_block_creators = [create_if_block$e, create_if_block_1$9];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*correctAnswerPosition*/ ctx[0] === /*index*/ ctx[22] && /*quizReady*/ ctx[2]) return 0;
    		if (/*quizReady*/ ctx[2]) return 1;
    		return -1;
    	}

    	if (~(current_block_type_index = select_block_type(ctx))) {
    		if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    	}

    	const block = {
    		key: key_1,
    		first: null,
    		c: function create() {
    			first = empty();
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    			this.first = first;
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, first, anchor);

    			if (~current_block_type_index) {
    				if_blocks[current_block_type_index].m(target, anchor);
    			}

    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if (~current_block_type_index) {
    					if_blocks[current_block_type_index].p(ctx, dirty);
    				}
    			} else {
    				if (if_block) {
    					group_outros();

    					transition_out(if_blocks[previous_block_index], 1, 1, () => {
    						if_blocks[previous_block_index] = null;
    					});

    					check_outros();
    				}

    				if (~current_block_type_index) {
    					if_block = if_blocks[current_block_type_index];

    					if (!if_block) {
    						if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    						if_block.c();
    					} else {
    						if_block.p(ctx, dirty);
    					}

    					transition_in(if_block, 1);
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				} else {
    					if_block = null;
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(first);

    			if (~current_block_type_index) {
    				if_blocks[current_block_type_index].d(detaching);
    			}

    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$c.name,
    		type: "each",
    		source: "(141:4) {#each wrongAnswers as answer, index (index)}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$o(ctx) {
    	let div;
    	let each_blocks = [];
    	let each_1_lookup = new Map();
    	let current;
    	let each_value = /*wrongAnswers*/ ctx[1];
    	validate_each_argument(each_value);
    	const get_key = ctx => /*index*/ ctx[22];
    	validate_each_keys(ctx, each_value, get_each_context$c, get_key);

    	for (let i = 0; i < each_value.length; i += 1) {
    		let child_ctx = get_each_context$c(ctx, each_value, i);
    		let key = get_key(child_ctx);
    		each_1_lookup.set(key, each_blocks[i] = create_each_block$c(key, child_ctx));
    	}

    	const block = {
    		c: function create() {
    			div = element("div");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr_dev(div, "class", "flex svelte-1g8s7qa");
    			add_location(div, file$o, 139, 0, 5541);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(div, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*wrongAnswers, screenWidth, chooseCorrectAnswer, correctAnswerPosition, quizReady, chooseWrongAnswer*/ 63) {
    				each_value = /*wrongAnswers*/ ctx[1];
    				validate_each_argument(each_value);
    				group_outros();
    				validate_each_keys(ctx, each_value, get_each_context$c, get_key);
    				each_blocks = update_keyed_each(each_blocks, dirty, get_key, 1, ctx, each_value, each_1_lookup, div, outro_and_destroy_block, create_each_block$c, null, get_each_context$c);
    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;

    			for (let i = 0; i < each_value.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			current = true;
    		},
    		o: function outro(local) {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].d();
    			}
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$o.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$o($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Answers', slots, []);
    	let { correctAnswer } = $$props;
    	let { questionCategory } = $$props;
    	let { quizReady } = $$props;
    	let { pointsModifier } = $$props;
    	let { correctAnswerPosition } = $$props;
    	let { wrongAnswers = [] } = $$props;
    	var screenWidth = window.innerWidth;

    	window.addEventListener("resize", function (event) {
    		$$invalidate(3, screenWidth = window.innerWidth);
    	});

    	const scientificNames = [
    		"Panthera leo",
    		"Otariidae",
    		"Felis catus",
    		"Loxodonta cyclotis",
    		"Carassius auratus",
    		"Carcharodon carcharias",
    		"Formicidae",
    		"Danaus plexippus",
    		"Diomedeidae",
    		"Chiroptera",
    		"Falco peregrinus",
    		"Canis lupus",
    		"haliaeetus leucocephalus",
    		"Lampyridae",
    		"Naja naja",
    		"Cerastes cerastes",
    		"Balsenoptera musculus",
    		"Oryctolagus cuniculus",
    		"Mesocricetus auratus",
    		"Ostreidae",
    		"Siluriformes",
    		"Bos Taurus",
    		"Gallus gallus",
    		"Syncerus caffer",
    		"Terrapene carolina"
    	];

    	const diet = ["Carnivore", "Herbivore", "Omnivore"];

    	const belongingClass = [
    		"Mammalia",
    		"Reptilia",
    		"Aves",
    		"Arachnida",
    		"Insecta",
    		"Actinopterygii",
    		"Chondrichthyes"
    	];

    	const prey = [
    		"Grass, Seeds, Flowers",
    		"Deer, Tapir, Wild Boar",
    		"Insects, roots, fruit, flowers, amphibians",
    		"Grass, Fruit, Roots",
    		"Human, Lion, Hyena",
    		"Squid, krill, and fish",
    		"Mice, Frogs, Fruit",
    		"Insects, Small mammals and reptiles",
    		"tarantulas",
    		"Fish, birds, and small mammals",
    		"Any existing animal",
    		"Bamboo, Fruits, Rodents",
    		"Krill, Crustaceans, Small Fish",
    		"Seals, Sea Lions, Dolphins",
    		"Rodents, lizards, and frogs",
    		"Leaves, Fruit, Flowers",
    		"Fish, crustaceans, deer, buffalo"
    	];

    	const predator = [
    		"Dogs, skunks, raccoons, snakes and some birds",
    		"Humans, sharks, cats, and rats",
    		"Owls, Eagles, Snakes",
    		"Birds, Reptiles, Mammals",
    		"Roadrunners and bullfrogs",
    		"Wolverines, bobcats, foxes, bears, raccoons, and birds",
    		"Any existing animal",
    		"Humans, Killer Whale pods",
    		"Waterbirds, turtles, larger fish",
    		"Human, Leopard, Crocodile",
    		"Humans, Large felines, Birds of prey",
    		"Humans",
    		"Human, Fox, Raccoon"
    	];

    	const lifespan = [
    		"3 - 8 years",
    		"12 - 15 years",
    		"25-30 years",
    		"100 plus years",
    		"60 - 70 years",
    		"A few weeks to four to five months",
    		"3-5 years",
    		"9-10 years",
    		"1 day",
    		"A few hours",
    		"30 - 45 years"
    	];

    	const defineAnswers = () => {
    		$$invalidate(1, wrongAnswers = []);
    		$$invalidate(0, correctAnswerPosition = Math.floor(Math.random() * 4));
    		var answers = [];

    		switch (questionCategory) {
    			case "scientific name":
    				answers = scientificNames;
    				break;
    			case "class":
    				answers = belongingClass;
    				break;
    			case "prey":
    				answers = prey;
    				break;
    			case "predator":
    				answers = predator;
    				break;
    			case "lifespan":
    				answers = lifespan;
    				break;
    			case "diet":
    				answers = diet;
    				$$invalidate(0, correctAnswerPosition = Math.floor(Math.random() * 3));
    				break;
    			default:
    				console.log("defaulr");
    		}

    		addWrongAnswers(answers);
    		addWrongAnswers(answers);

    		if (questionCategory != "diet") {
    			addWrongAnswers(answers);
    		} else if (wrongAnswers.length === 2) {
    			wrongAnswers.push(correctAnswer);
    		}
    	};

    	const addWrongAnswers = answers => {
    		if (correctAnswerPosition === 0 && wrongAnswers.length === 0) wrongAnswers.push(correctAnswer);
    		var i = Math.floor(Math.random() * answers.length);
    		var found = false;

    		if (answers[i] == correctAnswer) found = true; else {
    			wrongAnswers.forEach(element => {
    				if (answers[i] === element) {
    					found = true;
    				}
    			});
    		}

    		if (found) addWrongAnswers(answers); else if (wrongAnswers.length === correctAnswerPosition) {
    			wrongAnswers.push(correctAnswer);
    			wrongAnswers.push(answers[i]);
    		} else wrongAnswers.push(answers[i]);

    		if (correctAnswerPosition === 3 && wrongAnswers.length === 3) wrongAnswers.push(correctAnswer);
    	};

    	const chooseCorrectAnswer = () => {
    		let tmp = document.getElementsByClassName('correct');

    		for (var i = 0; i < tmp.length; i++) {
    			tmp[i].style.backgroundColor = 'rgb(33, 126, 7)';
    		}

    		gainPoints();
    	};

    	const chooseWrongAnswer = () => {
    		let tmp1 = document.getElementsByClassName('correct');

    		for (let i = 0; i < tmp1.length; i++) {
    			tmp1[i].style.backgroundColor = 'rgb(33, 126, 7)';
    		}

    		let tmp2 = document.getElementsByClassName('wrong');

    		for (let i = 0; i < tmp2.length; i++) {
    			tmp2[i].style.backgroundColor = 'rgb(168, 9, 9)';
    		}

    		losePoints();
    	};

    	const dispatch = createEventDispatcher();

    	const gainPoints = () => {
    		dispatch('answerChoosen', { pointsModifier });
    		$$invalidate(6, pointsModifier = pointsModifier + 5);
    	};

    	const losePoints = () => {
    		$$invalidate(6, pointsModifier = 0);
    		dispatch('answerChoosen', { pointsModifier });
    		$$invalidate(6, pointsModifier = 5);
    	};

    	$$self.$$.on_mount.push(function () {
    		if (correctAnswer === undefined && !('correctAnswer' in $$props || $$self.$$.bound[$$self.$$.props['correctAnswer']])) {
    			console_1$4.warn("<Answers> was created without expected prop 'correctAnswer'");
    		}

    		if (questionCategory === undefined && !('questionCategory' in $$props || $$self.$$.bound[$$self.$$.props['questionCategory']])) {
    			console_1$4.warn("<Answers> was created without expected prop 'questionCategory'");
    		}

    		if (quizReady === undefined && !('quizReady' in $$props || $$self.$$.bound[$$self.$$.props['quizReady']])) {
    			console_1$4.warn("<Answers> was created without expected prop 'quizReady'");
    		}

    		if (pointsModifier === undefined && !('pointsModifier' in $$props || $$self.$$.bound[$$self.$$.props['pointsModifier']])) {
    			console_1$4.warn("<Answers> was created without expected prop 'pointsModifier'");
    		}

    		if (correctAnswerPosition === undefined && !('correctAnswerPosition' in $$props || $$self.$$.bound[$$self.$$.props['correctAnswerPosition']])) {
    			console_1$4.warn("<Answers> was created without expected prop 'correctAnswerPosition'");
    		}
    	});

    	const writable_props = [
    		'correctAnswer',
    		'questionCategory',
    		'quizReady',
    		'pointsModifier',
    		'correctAnswerPosition',
    		'wrongAnswers'
    	];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1$4.warn(`<Answers> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('correctAnswer' in $$props) $$invalidate(7, correctAnswer = $$props.correctAnswer);
    		if ('questionCategory' in $$props) $$invalidate(8, questionCategory = $$props.questionCategory);
    		if ('quizReady' in $$props) $$invalidate(2, quizReady = $$props.quizReady);
    		if ('pointsModifier' in $$props) $$invalidate(6, pointsModifier = $$props.pointsModifier);
    		if ('correctAnswerPosition' in $$props) $$invalidate(0, correctAnswerPosition = $$props.correctAnswerPosition);
    		if ('wrongAnswers' in $$props) $$invalidate(1, wrongAnswers = $$props.wrongAnswers);
    	};

    	$$self.$capture_state = () => ({
    		createEventDispatcher,
    		fly,
    		correctAnswer,
    		questionCategory,
    		quizReady,
    		pointsModifier,
    		correctAnswerPosition,
    		wrongAnswers,
    		screenWidth,
    		scientificNames,
    		diet,
    		belongingClass,
    		prey,
    		predator,
    		lifespan,
    		defineAnswers,
    		addWrongAnswers,
    		chooseCorrectAnswer,
    		chooseWrongAnswer,
    		dispatch,
    		gainPoints,
    		losePoints
    	});

    	$$self.$inject_state = $$props => {
    		if ('correctAnswer' in $$props) $$invalidate(7, correctAnswer = $$props.correctAnswer);
    		if ('questionCategory' in $$props) $$invalidate(8, questionCategory = $$props.questionCategory);
    		if ('quizReady' in $$props) $$invalidate(2, quizReady = $$props.quizReady);
    		if ('pointsModifier' in $$props) $$invalidate(6, pointsModifier = $$props.pointsModifier);
    		if ('correctAnswerPosition' in $$props) $$invalidate(0, correctAnswerPosition = $$props.correctAnswerPosition);
    		if ('wrongAnswers' in $$props) $$invalidate(1, wrongAnswers = $$props.wrongAnswers);
    		if ('screenWidth' in $$props) $$invalidate(3, screenWidth = $$props.screenWidth);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		correctAnswerPosition,
    		wrongAnswers,
    		quizReady,
    		screenWidth,
    		chooseCorrectAnswer,
    		chooseWrongAnswer,
    		pointsModifier,
    		correctAnswer,
    		questionCategory,
    		defineAnswers
    	];
    }

    class Answers extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$o, create_fragment$o, safe_not_equal, {
    			correctAnswer: 7,
    			questionCategory: 8,
    			quizReady: 2,
    			pointsModifier: 6,
    			correctAnswerPosition: 0,
    			wrongAnswers: 1,
    			defineAnswers: 9
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Answers",
    			options,
    			id: create_fragment$o.name
    		});
    	}

    	get correctAnswer() {
    		throw new Error("<Answers>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set correctAnswer(value) {
    		throw new Error("<Answers>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get questionCategory() {
    		throw new Error("<Answers>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set questionCategory(value) {
    		throw new Error("<Answers>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get quizReady() {
    		throw new Error("<Answers>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set quizReady(value) {
    		throw new Error("<Answers>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get pointsModifier() {
    		throw new Error("<Answers>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set pointsModifier(value) {
    		throw new Error("<Answers>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get correctAnswerPosition() {
    		throw new Error("<Answers>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set correctAnswerPosition(value) {
    		throw new Error("<Answers>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get wrongAnswers() {
    		throw new Error("<Answers>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set wrongAnswers(value) {
    		throw new Error("<Answers>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get defineAnswers() {
    		return this.$$.ctx[9];
    	}

    	set defineAnswers(value) {
    		throw new Error("<Answers>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\component\quiz\Question.svelte generated by Svelte v3.53.1 */
    const file$n = "src\\component\\quiz\\Question.svelte";

    // (64:0) {#if quizReady}
    function create_if_block$d(ctx) {
    	let p;
    	let t0;
    	let t1;
    	let t2;
    	let t3;
    	let t4;
    	let p_transition;
    	let current;

    	const block = {
    		c: function create() {
    			p = element("p");
    			t0 = text("What is the ");
    			t1 = text(/*questionCategory*/ ctx[0]);
    			t2 = text(" of the ");
    			t3 = text(/*animalName*/ ctx[2]);
    			t4 = text("?");
    			attr_dev(p, "class", "svelte-ivy787");
    			toggle_class(p, "mobile", /*screenWidth*/ ctx[3] < 500);
    			add_location(p, file$n, 64, 4, 2155);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, p, anchor);
    			append_dev(p, t0);
    			append_dev(p, t1);
    			append_dev(p, t2);
    			append_dev(p, t3);
    			append_dev(p, t4);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (!current || dirty & /*questionCategory*/ 1) set_data_dev(t1, /*questionCategory*/ ctx[0]);
    			if (!current || dirty & /*animalName*/ 4) set_data_dev(t3, /*animalName*/ ctx[2]);

    			if (!current || dirty & /*screenWidth*/ 8) {
    				toggle_class(p, "mobile", /*screenWidth*/ ctx[3] < 500);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;

    			add_render_callback(() => {
    				if (!p_transition) p_transition = create_bidirectional_transition(p, fade, {}, true);
    				p_transition.run(1);
    			});

    			current = true;
    		},
    		o: function outro(local) {
    			if (!p_transition) p_transition = create_bidirectional_transition(p, fade, {}, false);
    			p_transition.run(0);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(p);
    			if (detaching && p_transition) p_transition.end();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$d.name,
    		type: "if",
    		source: "(64:0) {#if quizReady}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$n(ctx) {
    	let if_block_anchor;
    	let current;
    	let if_block = /*quizReady*/ ctx[1] && create_if_block$d(ctx);

    	const block = {
    		c: function create() {
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (/*quizReady*/ ctx[1]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);

    					if (dirty & /*quizReady*/ 2) {
    						transition_in(if_block, 1);
    					}
    				} else {
    					if_block = create_if_block$d(ctx);
    					if_block.c();
    					transition_in(if_block, 1);
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			} else if (if_block) {
    				group_outros();

    				transition_out(if_block, 1, 1, () => {
    					if_block = null;
    				});

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$n.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$n($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Question', slots, []);
    	let { questionCategory } = $$props;
    	let { quizReady } = $$props;
    	var animalName;
    	const questionCategories = ["scientific name", "belonging class", "prey", "predator", "lifespan", "diet"];
    	var screenWidth = window.innerWidth;

    	window.addEventListener("resize", function (event) {
    		$$invalidate(3, screenWidth = window.innerWidth);
    	});

    	const setQuestion = animal => {
    		var i = Math.floor(Math.random() * questionCategories.length);
    		$$invalidate(2, animalName = animal.name);

    		switch (i) {
    			case 0:
    				if (animal.taxonomy.scientific_name) {
    					$$invalidate(0, questionCategory = "scientific name");
    					return animal.taxonomy.scientific_name;
    				}
    			case 1:
    				if (animal.taxonomy.class) {
    					$$invalidate(0, questionCategory = "class");
    					return animal.taxonomy.class;
    				}
    			case 2:
    				if (animal.characteristics.prey) {
    					$$invalidate(0, questionCategory = "prey");
    					return animal.characteristics.prey;
    				}
    				if (animal.characteristics.main_prey) {
    					$$invalidate(0, questionCategory = "prey");
    					return animal.characteristics.main_prey;
    				}
    			case 3:
    				if (animal.characteristics.predators) {
    					$$invalidate(0, questionCategory = "predator");
    					return animal.characteristics.predators;
    				}
    			case 4:
    				if (animal.characteristics.lifespan) {
    					$$invalidate(0, questionCategory = "lifespan");
    					return animal.characteristics.lifespan;
    				}
    			case 5:
    				if (animal.characteristics.diet) {
    					$$invalidate(0, questionCategory = "diet");
    					return animal.characteristics.diet;
    				}
    		}

    		setQuestion(animal);
    	};

    	const setSavedQuestion = name => {
    		$$invalidate(2, animalName = name);
    	};

    	$$self.$$.on_mount.push(function () {
    		if (questionCategory === undefined && !('questionCategory' in $$props || $$self.$$.bound[$$self.$$.props['questionCategory']])) {
    			console.warn("<Question> was created without expected prop 'questionCategory'");
    		}

    		if (quizReady === undefined && !('quizReady' in $$props || $$self.$$.bound[$$self.$$.props['quizReady']])) {
    			console.warn("<Question> was created without expected prop 'quizReady'");
    		}
    	});

    	const writable_props = ['questionCategory', 'quizReady'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Question> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('questionCategory' in $$props) $$invalidate(0, questionCategory = $$props.questionCategory);
    		if ('quizReady' in $$props) $$invalidate(1, quizReady = $$props.quizReady);
    	};

    	$$self.$capture_state = () => ({
    		fade,
    		questionCategory,
    		quizReady,
    		animalName,
    		questionCategories,
    		screenWidth,
    		setQuestion,
    		setSavedQuestion
    	});

    	$$self.$inject_state = $$props => {
    		if ('questionCategory' in $$props) $$invalidate(0, questionCategory = $$props.questionCategory);
    		if ('quizReady' in $$props) $$invalidate(1, quizReady = $$props.quizReady);
    		if ('animalName' in $$props) $$invalidate(2, animalName = $$props.animalName);
    		if ('screenWidth' in $$props) $$invalidate(3, screenWidth = $$props.screenWidth);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		questionCategory,
    		quizReady,
    		animalName,
    		screenWidth,
    		setQuestion,
    		setSavedQuestion
    	];
    }

    class Question extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$n, create_fragment$n, safe_not_equal, {
    			questionCategory: 0,
    			quizReady: 1,
    			setQuestion: 4,
    			setSavedQuestion: 5
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Question",
    			options,
    			id: create_fragment$n.name
    		});
    	}

    	get questionCategory() {
    		throw new Error("<Question>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set questionCategory(value) {
    		throw new Error("<Question>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get quizReady() {
    		throw new Error("<Question>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set quizReady(value) {
    		throw new Error("<Question>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get setQuestion() {
    		return this.$$.ctx[4];
    	}

    	set setQuestion(value) {
    		throw new Error("<Question>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get setSavedQuestion() {
    		return this.$$.ctx[5];
    	}

    	set setSavedQuestion(value) {
    		throw new Error("<Question>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\component\quiz\Score.svelte generated by Svelte v3.53.1 */
    const file$m = "src\\component\\quiz\\Score.svelte";

    function get_each_context$b(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[4] = list[i];
    	return child_ctx;
    }

    // (15:31) {#key score}
    function create_key_block_1(ctx) {
    	let span;
    	let t;
    	let span_intro;

    	const block = {
    		c: function create() {
    			span = element("span");
    			t = text(/*score*/ ctx[0]);
    			add_location(span, file$m, 15, 8, 428);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, span, anchor);
    			append_dev(span, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*score*/ 1) set_data_dev(t, /*score*/ ctx[0]);
    		},
    		i: function intro(local) {
    			if (!span_intro) {
    				add_render_callback(() => {
    					span_intro = create_in_transition(span, fly, { y: -40 });
    					span_intro.start();
    				});
    			}
    		},
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(span);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_key_block_1.name,
    		type: "key",
    		source: "(15:31) {#key score}",
    		ctx
    	});

    	return block;
    }

    // (17:34) {#key pointsModifier}
    function create_key_block(ctx) {
    	let span;
    	let t;
    	let span_intro;

    	const block = {
    		c: function create() {
    			span = element("span");
    			t = text(/*pointsModifier*/ ctx[2]);
    			add_location(span, file$m, 17, 8, 535);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, span, anchor);
    			append_dev(span, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*pointsModifier*/ 4) set_data_dev(t, /*pointsModifier*/ ctx[2]);
    		},
    		i: function intro(local) {
    			if (!span_intro) {
    				add_render_callback(() => {
    					span_intro = create_in_transition(span, fly, { y: -40 });
    					span_intro.start();
    				});
    			}
    		},
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(span);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_key_block.name,
    		type: "key",
    		source: "(17:34) {#key pointsModifier}",
    		ctx
    	});

    	return block;
    }

    // (21:8) {#each Array(attemptsLeft) as _}
    function create_each_block$b(ctx) {
    	let img;
    	let img_src_value;

    	const block = {
    		c: function create() {
    			img = element("img");
    			if (!src_url_equal(img.src, img_src_value = "images/heart.png")) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", "life remaining");
    			attr_dev(img, "class", "svelte-6pvy2a");
    			add_location(img, file$m, 21, 12, 692);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, img, anchor);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(img);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$b.name,
    		type: "each",
    		source: "(21:8) {#each Array(attemptsLeft) as _}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$m(ctx) {
    	let div2;
    	let div0;
    	let t0;
    	let previous_key = /*score*/ ctx[0];
    	let t1;
    	let previous_key_1 = /*pointsModifier*/ ctx[2];
    	let t2;
    	let div1;
    	let t3;
    	let key_block0 = create_key_block_1(ctx);
    	let key_block1 = create_key_block(ctx);
    	let each_value = Array(/*attemptsLeft*/ ctx[1]);
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$b(get_each_context$b(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			div2 = element("div");
    			div0 = element("div");
    			t0 = text("SCORE:  ");
    			key_block0.c();
    			t1 = text("     COMBO: ");
    			key_block1.c();
    			t2 = space();
    			div1 = element("div");
    			t3 = text("LIVES:  \r\n        ");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr_dev(div0, "class", "score");
    			add_location(div0, file$m, 14, 4, 379);
    			attr_dev(div1, "class", "score");
    			add_location(div1, file$m, 19, 4, 609);
    			attr_dev(div2, "class", "scorediv flex content svelte-6pvy2a");
    			toggle_class(div2, "mobile", /*screenWidth*/ ctx[3] < 500);
    			add_location(div2, file$m, 13, 0, 307);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div2, anchor);
    			append_dev(div2, div0);
    			append_dev(div0, t0);
    			key_block0.m(div0, null);
    			append_dev(div0, t1);
    			key_block1.m(div0, null);
    			append_dev(div2, t2);
    			append_dev(div2, div1);
    			append_dev(div1, t3);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(div1, null);
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*score*/ 1 && safe_not_equal(previous_key, previous_key = /*score*/ ctx[0])) {
    				group_outros();
    				transition_out(key_block0, 1, 1, noop);
    				check_outros();
    				key_block0 = create_key_block_1(ctx);
    				key_block0.c();
    				transition_in(key_block0, 1);
    				key_block0.m(div0, t1);
    			} else {
    				key_block0.p(ctx, dirty);
    			}

    			if (dirty & /*pointsModifier*/ 4 && safe_not_equal(previous_key_1, previous_key_1 = /*pointsModifier*/ ctx[2])) {
    				group_outros();
    				transition_out(key_block1, 1, 1, noop);
    				check_outros();
    				key_block1 = create_key_block(ctx);
    				key_block1.c();
    				transition_in(key_block1, 1);
    				key_block1.m(div0, null);
    			} else {
    				key_block1.p(ctx, dirty);
    			}

    			if (dirty & /*attemptsLeft*/ 2) {
    				each_value = Array(/*attemptsLeft*/ ctx[1]);
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$b(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block$b(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(div1, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}

    			if (dirty & /*screenWidth*/ 8) {
    				toggle_class(div2, "mobile", /*screenWidth*/ ctx[3] < 500);
    			}
    		},
    		i: function intro(local) {
    			transition_in(key_block0);
    			transition_in(key_block1);
    		},
    		o: function outro(local) {
    			transition_out(key_block0);
    			transition_out(key_block1);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div2);
    			key_block0.d(detaching);
    			key_block1.d(detaching);
    			destroy_each(each_blocks, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$m.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$m($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Score', slots, []);
    	let { score } = $$props;
    	let { attemptsLeft } = $$props;
    	let { pointsModifier } = $$props;
    	var screenWidth = window.innerWidth;

    	window.addEventListener("resize", function (event) {
    		$$invalidate(3, screenWidth = window.innerWidth);
    	});

    	$$self.$$.on_mount.push(function () {
    		if (score === undefined && !('score' in $$props || $$self.$$.bound[$$self.$$.props['score']])) {
    			console.warn("<Score> was created without expected prop 'score'");
    		}

    		if (attemptsLeft === undefined && !('attemptsLeft' in $$props || $$self.$$.bound[$$self.$$.props['attemptsLeft']])) {
    			console.warn("<Score> was created without expected prop 'attemptsLeft'");
    		}

    		if (pointsModifier === undefined && !('pointsModifier' in $$props || $$self.$$.bound[$$self.$$.props['pointsModifier']])) {
    			console.warn("<Score> was created without expected prop 'pointsModifier'");
    		}
    	});

    	const writable_props = ['score', 'attemptsLeft', 'pointsModifier'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Score> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('score' in $$props) $$invalidate(0, score = $$props.score);
    		if ('attemptsLeft' in $$props) $$invalidate(1, attemptsLeft = $$props.attemptsLeft);
    		if ('pointsModifier' in $$props) $$invalidate(2, pointsModifier = $$props.pointsModifier);
    	};

    	$$self.$capture_state = () => ({
    		fly,
    		score,
    		attemptsLeft,
    		pointsModifier,
    		screenWidth
    	});

    	$$self.$inject_state = $$props => {
    		if ('score' in $$props) $$invalidate(0, score = $$props.score);
    		if ('attemptsLeft' in $$props) $$invalidate(1, attemptsLeft = $$props.attemptsLeft);
    		if ('pointsModifier' in $$props) $$invalidate(2, pointsModifier = $$props.pointsModifier);
    		if ('screenWidth' in $$props) $$invalidate(3, screenWidth = $$props.screenWidth);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [score, attemptsLeft, pointsModifier, screenWidth];
    }

    class Score extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$m, create_fragment$m, safe_not_equal, {
    			score: 0,
    			attemptsLeft: 1,
    			pointsModifier: 2
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Score",
    			options,
    			id: create_fragment$m.name
    		});
    	}

    	get score() {
    		throw new Error("<Score>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set score(value) {
    		throw new Error("<Score>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get attemptsLeft() {
    		throw new Error("<Score>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set attemptsLeft(value) {
    		throw new Error("<Score>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get pointsModifier() {
    		throw new Error("<Score>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set pointsModifier(value) {
    		throw new Error("<Score>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\component\loading\LoadingScreen.svelte generated by Svelte v3.53.1 */

    const file$l = "src\\component\\loading\\LoadingScreen.svelte";

    // (127:0) {#if isLoading}
    function create_if_block$c(ctx) {
    	let div3;
    	let div2;
    	let img;
    	let img_src_value;
    	let t0;
    	let div0;
    	let t2;
    	let div1;
    	let t3;

    	const block = {
    		c: function create() {
    			div3 = element("div");
    			div2 = element("div");
    			img = element("img");
    			t0 = space();
    			div0 = element("div");
    			div0.textContent = "LOADING";
    			t2 = space();
    			div1 = element("div");
    			t3 = text(/*curiosity*/ ctx[2]);
    			if (!src_url_equal(img.src, img_src_value = "images/dog-running.gif")) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", "dog running");
    			attr_dev(img, "class", "svelte-69yczf");
    			toggle_class(img, "mobileimg", /*screenWidth*/ ctx[1] < 500);
    			add_location(img, file$l, 129, 12, 5027);
    			attr_dev(div0, "class", "loadingtext svelte-69yczf");
    			toggle_class(div0, "mobiletxt", /*screenWidth*/ ctx[1] < 500);
    			add_location(div0, file$l, 130, 12, 5127);
    			attr_dev(div1, "class", "curiosity svelte-69yczf");
    			toggle_class(div1, "mobilecur", /*screenWidth*/ ctx[1] < 500);
    			add_location(div1, file$l, 131, 12, 5213);
    			attr_dev(div2, "id", "loading");
    			attr_dev(div2, "class", "flex svelte-69yczf");
    			add_location(div2, file$l, 128, 8, 4982);
    			attr_dev(div3, "class", "backdrop flex svelte-69yczf");
    			add_location(div3, file$l, 127, 4, 4945);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div3, anchor);
    			append_dev(div3, div2);
    			append_dev(div2, img);
    			append_dev(div2, t0);
    			append_dev(div2, div0);
    			append_dev(div2, t2);
    			append_dev(div2, div1);
    			append_dev(div1, t3);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*screenWidth*/ 2) {
    				toggle_class(img, "mobileimg", /*screenWidth*/ ctx[1] < 500);
    			}

    			if (dirty & /*screenWidth*/ 2) {
    				toggle_class(div0, "mobiletxt", /*screenWidth*/ ctx[1] < 500);
    			}

    			if (dirty & /*curiosity*/ 4) set_data_dev(t3, /*curiosity*/ ctx[2]);

    			if (dirty & /*screenWidth*/ 2) {
    				toggle_class(div1, "mobilecur", /*screenWidth*/ ctx[1] < 500);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div3);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$c.name,
    		type: "if",
    		source: "(127:0) {#if isLoading}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$l(ctx) {
    	let if_block_anchor;
    	let if_block = /*isLoading*/ ctx[0] && create_if_block$c(ctx);

    	const block = {
    		c: function create() {
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    		},
    		p: function update(ctx, [dirty]) {
    			if (/*isLoading*/ ctx[0]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block$c(ctx);
    					if_block.c();
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$l.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$l($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('LoadingScreen', slots, []);
    	let { isLoading = true } = $$props;
    	var screenWidth = window.innerWidth;
    	var animal = randomAnimal().trim().split(/\s+/);
    	var animalCuriosity;
    	var animalInfo;
    	var curiosity = "Did you know that...";
    	animal = animal[animal.length - 1].toLowerCase();

    	window.addEventListener("resize", function (event) {
    		$$invalidate(1, screenWidth = window.innerWidth);
    	});

    	const getCuriosity = () => {
    		var xmlHttp = new XMLHttpRequest();

    		xmlHttp.onreadystatechange = function () {
    			if (xmlHttp.readyState == 4 && xmlHttp.status == 200) {
    				var results = JSON.parse(xmlHttp.responseText);

    				if (results.length <= 0) {
    					chooseCatCuriosity();
    				} else {
    					animal = results[Math.floor(Math.random() * results.length)];
    					chooseCuriosity(0);
    					$$invalidate(2, curiosity = " Did you know that the " + animalInfo + " of the " + animal.name + " is " + animalCuriosity);
    				}
    			}
    		};

    		xmlHttp.open("GET", 'https://api.api-ninjas.com/v1/animals?name=' + animal, true);
    		xmlHttp.setRequestHeader("X-Api-Key", "XeRLqZeWmuiW7/PMyztdHQ==HoJJOzopIX90X1xe");
    		xmlHttp.send(null);
    	};

    	const chooseCuriosity = count => {
    		const categoryCount = 8;
    		let i = Math.floor(Math.random() * categoryCount);
    		if (count == categoryCount) i = 0; //Per evitare troppa ricorsione

    		switch (i) {
    			case 0:
    				if (animal.taxonomy.scientific_name) {
    					animalInfo = "scientific name";
    					animalCuriosity = animal.taxonomy.scientific_name.toLowerCase();
    				} else chooseCuriosity(++count);
    				break;
    			case 1:
    				if (animal.characteristics.most_distinctive_feature) {
    					animalInfo = "most distinctive feature";
    					animalCuriosity = animal.characteristics.most_distinctive_feature.toLowerCase();
    				} else chooseCuriosity(++count);
    				break;
    			case 2:
    				if (animal.characteristics.favorite_food) {
    					animalInfo = "favorite food";
    					animalCuriosity = animal.characteristics.favorite_food.toLowerCase();
    				} else chooseCuriosity(++count);
    				break;
    			case 3:
    				if (animal.characteristics.habitat) {
    					animalInfo = "habitat";
    					animalCuriosity = animal.characteristics.habitat.toLowerCase();
    				} else chooseCuriosity(++count);
    				break;
    			case 4:
    				if (animal.characteristics.favorite_food) {
    					animalInfo = "favorite food";
    					animalCuriosity = animal.characteristics.favorite_food.toLowerCase();
    				} else chooseCuriosity(++count);
    				break;
    			case 5:
    				if (animal.characteristics.estimated_population_size) {
    					animalInfo = "estimated population size";
    					animalCuriosity = animal.characteristics.estimated_population_size.toLowerCase();
    				} else chooseCuriosity(++count);
    				break;
    			case 6:
    				if (animal.characteristics.lifespan) {
    					animalInfo = "lifespan";
    					animalCuriosity = animal.characteristics.lifespan.toLowerCase();
    				} else chooseCuriosity(++count);
    				break;
    			case 7:
    				if (animal.characteristics.weight) {
    					animalInfo = "weight";
    					animalCuriosity = animal.characteristics.weight.toLowerCase();
    				} else chooseCuriosity(++count);
    				break;
    		}
    	};

    	const chooseCatCuriosity = () => {
    		var xmlHttp = new XMLHttpRequest();

    		xmlHttp.onreadystatechange = function () {
    			if (xmlHttp.readyState == 4 && xmlHttp.status == 200) {
    				var results = JSON.parse(xmlHttp.responseText);
    				$$invalidate(2, curiosity = " Did you know that " + results[Math.floor(Math.random() * results.length)].text);
    			}
    		};

    		xmlHttp.open("GET", 'https://cat-fact.herokuapp.com/facts', true);
    		xmlHttp.send(null);
    	};

    	getCuriosity();

    	setTimeout(
    		function () {
    			$$invalidate(0, isLoading = false);
    		},
    		7000
    	);

    	const writable_props = ['isLoading'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<LoadingScreen> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('isLoading' in $$props) $$invalidate(0, isLoading = $$props.isLoading);
    	};

    	$$self.$capture_state = () => ({
    		isLoading,
    		screenWidth,
    		animal,
    		animalCuriosity,
    		animalInfo,
    		curiosity,
    		getCuriosity,
    		chooseCuriosity,
    		chooseCatCuriosity
    	});

    	$$self.$inject_state = $$props => {
    		if ('isLoading' in $$props) $$invalidate(0, isLoading = $$props.isLoading);
    		if ('screenWidth' in $$props) $$invalidate(1, screenWidth = $$props.screenWidth);
    		if ('animal' in $$props) animal = $$props.animal;
    		if ('animalCuriosity' in $$props) animalCuriosity = $$props.animalCuriosity;
    		if ('animalInfo' in $$props) animalInfo = $$props.animalInfo;
    		if ('curiosity' in $$props) $$invalidate(2, curiosity = $$props.curiosity);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [isLoading, screenWidth, curiosity];
    }

    class LoadingScreen extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$l, create_fragment$l, safe_not_equal, { isLoading: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "LoadingScreen",
    			options,
    			id: create_fragment$l.name
    		});
    	}

    	get isLoading() {
    		throw new Error("<LoadingScreen>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set isLoading(value) {
    		throw new Error("<LoadingScreen>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    function toClassName(value) {
      let result = '';

      if (typeof value === 'string' || typeof value === 'number') {
        result += value;
      } else if (typeof value === 'object') {
        if (Array.isArray(value)) {
          result = value.map(toClassName).filter(Boolean).join(' ');
        } else {
          for (let key in value) {
            if (value[key]) {
              result && (result += ' ');
              result += key;
            }
          }
        }
      }

      return result;
    }

    function classnames(...args) {
      return args.map(toClassName).filter(Boolean).join(' ');
    }

    const subscriber_queue = [];
    /**
     * Create a `Writable` store that allows both updating and reading by subscription.
     * @param {*=}value initial value
     * @param {StartStopNotifier=}start start and stop notifications for subscriptions
     */
    function writable(value, start = noop) {
        let stop;
        const subscribers = new Set();
        function set(new_value) {
            if (safe_not_equal(value, new_value)) {
                value = new_value;
                if (stop) { // store is ready
                    const run_queue = !subscriber_queue.length;
                    for (const subscriber of subscribers) {
                        subscriber[1]();
                        subscriber_queue.push(subscriber, value);
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
            subscribers.add(subscriber);
            if (subscribers.size === 1) {
                stop = start(set) || noop;
            }
            run(value);
            return () => {
                subscribers.delete(subscriber);
                if (subscribers.size === 0) {
                    stop();
                    stop = null;
                }
            };
        }
        return { set, update, subscribe };
    }

    function getWindow(node) {
      if (node == null) {
        return window;
      }

      if (node.toString() !== '[object Window]') {
        var ownerDocument = node.ownerDocument;
        return ownerDocument ? ownerDocument.defaultView || window : window;
      }

      return node;
    }

    function isElement(node) {
      var OwnElement = getWindow(node).Element;
      return node instanceof OwnElement || node instanceof Element;
    }

    function isHTMLElement(node) {
      var OwnElement = getWindow(node).HTMLElement;
      return node instanceof OwnElement || node instanceof HTMLElement;
    }

    function isShadowRoot(node) {
      // IE 11 has no ShadowRoot
      if (typeof ShadowRoot === 'undefined') {
        return false;
      }

      var OwnElement = getWindow(node).ShadowRoot;
      return node instanceof OwnElement || node instanceof ShadowRoot;
    }

    var max = Math.max;
    var min = Math.min;
    var round = Math.round;

    function getUAString() {
      var uaData = navigator.userAgentData;

      if (uaData != null && uaData.brands) {
        return uaData.brands.map(function (item) {
          return item.brand + "/" + item.version;
        }).join(' ');
      }

      return navigator.userAgent;
    }

    function isLayoutViewport() {
      return !/^((?!chrome|android).)*safari/i.test(getUAString());
    }

    function getBoundingClientRect(element, includeScale, isFixedStrategy) {
      if (includeScale === void 0) {
        includeScale = false;
      }

      if (isFixedStrategy === void 0) {
        isFixedStrategy = false;
      }

      var clientRect = element.getBoundingClientRect();
      var scaleX = 1;
      var scaleY = 1;

      if (includeScale && isHTMLElement(element)) {
        scaleX = element.offsetWidth > 0 ? round(clientRect.width) / element.offsetWidth || 1 : 1;
        scaleY = element.offsetHeight > 0 ? round(clientRect.height) / element.offsetHeight || 1 : 1;
      }

      var _ref = isElement(element) ? getWindow(element) : window,
          visualViewport = _ref.visualViewport;

      var addVisualOffsets = !isLayoutViewport() && isFixedStrategy;
      var x = (clientRect.left + (addVisualOffsets && visualViewport ? visualViewport.offsetLeft : 0)) / scaleX;
      var y = (clientRect.top + (addVisualOffsets && visualViewport ? visualViewport.offsetTop : 0)) / scaleY;
      var width = clientRect.width / scaleX;
      var height = clientRect.height / scaleY;
      return {
        width: width,
        height: height,
        top: y,
        right: x + width,
        bottom: y + height,
        left: x,
        x: x,
        y: y
      };
    }

    function getWindowScroll(node) {
      var win = getWindow(node);
      var scrollLeft = win.pageXOffset;
      var scrollTop = win.pageYOffset;
      return {
        scrollLeft: scrollLeft,
        scrollTop: scrollTop
      };
    }

    function getHTMLElementScroll(element) {
      return {
        scrollLeft: element.scrollLeft,
        scrollTop: element.scrollTop
      };
    }

    function getNodeScroll(node) {
      if (node === getWindow(node) || !isHTMLElement(node)) {
        return getWindowScroll(node);
      } else {
        return getHTMLElementScroll(node);
      }
    }

    function getNodeName(element) {
      return element ? (element.nodeName || '').toLowerCase() : null;
    }

    function getDocumentElement(element) {
      // $FlowFixMe[incompatible-return]: assume body is always available
      return ((isElement(element) ? element.ownerDocument : // $FlowFixMe[prop-missing]
      element.document) || window.document).documentElement;
    }

    function getWindowScrollBarX(element) {
      // If <html> has a CSS width greater than the viewport, then this will be
      // incorrect for RTL.
      // Popper 1 is broken in this case and never had a bug report so let's assume
      // it's not an issue. I don't think anyone ever specifies width on <html>
      // anyway.
      // Browsers where the left scrollbar doesn't cause an issue report `0` for
      // this (e.g. Edge 2019, IE11, Safari)
      return getBoundingClientRect(getDocumentElement(element)).left + getWindowScroll(element).scrollLeft;
    }

    function getComputedStyle$1(element) {
      return getWindow(element).getComputedStyle(element);
    }

    function isScrollParent(element) {
      // Firefox wants us to check `-x` and `-y` variations as well
      var _getComputedStyle = getComputedStyle$1(element),
          overflow = _getComputedStyle.overflow,
          overflowX = _getComputedStyle.overflowX,
          overflowY = _getComputedStyle.overflowY;

      return /auto|scroll|overlay|hidden/.test(overflow + overflowY + overflowX);
    }

    function isElementScaled(element) {
      var rect = element.getBoundingClientRect();
      var scaleX = round(rect.width) / element.offsetWidth || 1;
      var scaleY = round(rect.height) / element.offsetHeight || 1;
      return scaleX !== 1 || scaleY !== 1;
    } // Returns the composite rect of an element relative to its offsetParent.
    // Composite means it takes into account transforms as well as layout.


    function getCompositeRect(elementOrVirtualElement, offsetParent, isFixed) {
      if (isFixed === void 0) {
        isFixed = false;
      }

      var isOffsetParentAnElement = isHTMLElement(offsetParent);
      var offsetParentIsScaled = isHTMLElement(offsetParent) && isElementScaled(offsetParent);
      var documentElement = getDocumentElement(offsetParent);
      var rect = getBoundingClientRect(elementOrVirtualElement, offsetParentIsScaled, isFixed);
      var scroll = {
        scrollLeft: 0,
        scrollTop: 0
      };
      var offsets = {
        x: 0,
        y: 0
      };

      if (isOffsetParentAnElement || !isOffsetParentAnElement && !isFixed) {
        if (getNodeName(offsetParent) !== 'body' || // https://github.com/popperjs/popper-core/issues/1078
        isScrollParent(documentElement)) {
          scroll = getNodeScroll(offsetParent);
        }

        if (isHTMLElement(offsetParent)) {
          offsets = getBoundingClientRect(offsetParent, true);
          offsets.x += offsetParent.clientLeft;
          offsets.y += offsetParent.clientTop;
        } else if (documentElement) {
          offsets.x = getWindowScrollBarX(documentElement);
        }
      }

      return {
        x: rect.left + scroll.scrollLeft - offsets.x,
        y: rect.top + scroll.scrollTop - offsets.y,
        width: rect.width,
        height: rect.height
      };
    }

    // means it doesn't take into account transforms.

    function getLayoutRect(element) {
      var clientRect = getBoundingClientRect(element); // Use the clientRect sizes if it's not been transformed.
      // Fixes https://github.com/popperjs/popper-core/issues/1223

      var width = element.offsetWidth;
      var height = element.offsetHeight;

      if (Math.abs(clientRect.width - width) <= 1) {
        width = clientRect.width;
      }

      if (Math.abs(clientRect.height - height) <= 1) {
        height = clientRect.height;
      }

      return {
        x: element.offsetLeft,
        y: element.offsetTop,
        width: width,
        height: height
      };
    }

    function getParentNode(element) {
      if (getNodeName(element) === 'html') {
        return element;
      }

      return (// this is a quicker (but less type safe) way to save quite some bytes from the bundle
        // $FlowFixMe[incompatible-return]
        // $FlowFixMe[prop-missing]
        element.assignedSlot || // step into the shadow DOM of the parent of a slotted node
        element.parentNode || ( // DOM Element detected
        isShadowRoot(element) ? element.host : null) || // ShadowRoot detected
        // $FlowFixMe[incompatible-call]: HTMLElement is a Node
        getDocumentElement(element) // fallback

      );
    }

    function getScrollParent(node) {
      if (['html', 'body', '#document'].indexOf(getNodeName(node)) >= 0) {
        // $FlowFixMe[incompatible-return]: assume body is always available
        return node.ownerDocument.body;
      }

      if (isHTMLElement(node) && isScrollParent(node)) {
        return node;
      }

      return getScrollParent(getParentNode(node));
    }

    /*
    given a DOM element, return the list of all scroll parents, up the list of ancesors
    until we get to the top window object. This list is what we attach scroll listeners
    to, because if any of these parent elements scroll, we'll need to re-calculate the
    reference element's position.
    */

    function listScrollParents(element, list) {
      var _element$ownerDocumen;

      if (list === void 0) {
        list = [];
      }

      var scrollParent = getScrollParent(element);
      var isBody = scrollParent === ((_element$ownerDocumen = element.ownerDocument) == null ? void 0 : _element$ownerDocumen.body);
      var win = getWindow(scrollParent);
      var target = isBody ? [win].concat(win.visualViewport || [], isScrollParent(scrollParent) ? scrollParent : []) : scrollParent;
      var updatedList = list.concat(target);
      return isBody ? updatedList : // $FlowFixMe[incompatible-call]: isBody tells us target will be an HTMLElement here
      updatedList.concat(listScrollParents(getParentNode(target)));
    }

    function isTableElement(element) {
      return ['table', 'td', 'th'].indexOf(getNodeName(element)) >= 0;
    }

    function getTrueOffsetParent(element) {
      if (!isHTMLElement(element) || // https://github.com/popperjs/popper-core/issues/837
      getComputedStyle$1(element).position === 'fixed') {
        return null;
      }

      return element.offsetParent;
    } // `.offsetParent` reports `null` for fixed elements, while absolute elements
    // return the containing block


    function getContainingBlock(element) {
      var isFirefox = /firefox/i.test(getUAString());
      var isIE = /Trident/i.test(getUAString());

      if (isIE && isHTMLElement(element)) {
        // In IE 9, 10 and 11 fixed elements containing block is always established by the viewport
        var elementCss = getComputedStyle$1(element);

        if (elementCss.position === 'fixed') {
          return null;
        }
      }

      var currentNode = getParentNode(element);

      if (isShadowRoot(currentNode)) {
        currentNode = currentNode.host;
      }

      while (isHTMLElement(currentNode) && ['html', 'body'].indexOf(getNodeName(currentNode)) < 0) {
        var css = getComputedStyle$1(currentNode); // This is non-exhaustive but covers the most common CSS properties that
        // create a containing block.
        // https://developer.mozilla.org/en-US/docs/Web/CSS/Containing_block#identifying_the_containing_block

        if (css.transform !== 'none' || css.perspective !== 'none' || css.contain === 'paint' || ['transform', 'perspective'].indexOf(css.willChange) !== -1 || isFirefox && css.willChange === 'filter' || isFirefox && css.filter && css.filter !== 'none') {
          return currentNode;
        } else {
          currentNode = currentNode.parentNode;
        }
      }

      return null;
    } // Gets the closest ancestor positioned element. Handles some edge cases,
    // such as table ancestors and cross browser bugs.


    function getOffsetParent(element) {
      var window = getWindow(element);
      var offsetParent = getTrueOffsetParent(element);

      while (offsetParent && isTableElement(offsetParent) && getComputedStyle$1(offsetParent).position === 'static') {
        offsetParent = getTrueOffsetParent(offsetParent);
      }

      if (offsetParent && (getNodeName(offsetParent) === 'html' || getNodeName(offsetParent) === 'body' && getComputedStyle$1(offsetParent).position === 'static')) {
        return window;
      }

      return offsetParent || getContainingBlock(element) || window;
    }

    var top = 'top';
    var bottom = 'bottom';
    var right = 'right';
    var left = 'left';
    var auto = 'auto';
    var basePlacements = [top, bottom, right, left];
    var start = 'start';
    var end = 'end';
    var clippingParents = 'clippingParents';
    var viewport = 'viewport';
    var popper = 'popper';
    var reference = 'reference';
    var variationPlacements = /*#__PURE__*/basePlacements.reduce(function (acc, placement) {
      return acc.concat([placement + "-" + start, placement + "-" + end]);
    }, []);
    var placements = /*#__PURE__*/[].concat(basePlacements, [auto]).reduce(function (acc, placement) {
      return acc.concat([placement, placement + "-" + start, placement + "-" + end]);
    }, []); // modifiers that need to read the DOM

    var beforeRead = 'beforeRead';
    var read = 'read';
    var afterRead = 'afterRead'; // pure-logic modifiers

    var beforeMain = 'beforeMain';
    var main = 'main';
    var afterMain = 'afterMain'; // modifier with the purpose to write to the DOM (or write into a framework state)

    var beforeWrite = 'beforeWrite';
    var write = 'write';
    var afterWrite = 'afterWrite';
    var modifierPhases = [beforeRead, read, afterRead, beforeMain, main, afterMain, beforeWrite, write, afterWrite];

    function order(modifiers) {
      var map = new Map();
      var visited = new Set();
      var result = [];
      modifiers.forEach(function (modifier) {
        map.set(modifier.name, modifier);
      }); // On visiting object, check for its dependencies and visit them recursively

      function sort(modifier) {
        visited.add(modifier.name);
        var requires = [].concat(modifier.requires || [], modifier.requiresIfExists || []);
        requires.forEach(function (dep) {
          if (!visited.has(dep)) {
            var depModifier = map.get(dep);

            if (depModifier) {
              sort(depModifier);
            }
          }
        });
        result.push(modifier);
      }

      modifiers.forEach(function (modifier) {
        if (!visited.has(modifier.name)) {
          // check for visited object
          sort(modifier);
        }
      });
      return result;
    }

    function orderModifiers(modifiers) {
      // order based on dependencies
      var orderedModifiers = order(modifiers); // order based on phase

      return modifierPhases.reduce(function (acc, phase) {
        return acc.concat(orderedModifiers.filter(function (modifier) {
          return modifier.phase === phase;
        }));
      }, []);
    }

    function debounce(fn) {
      var pending;
      return function () {
        if (!pending) {
          pending = new Promise(function (resolve) {
            Promise.resolve().then(function () {
              pending = undefined;
              resolve(fn());
            });
          });
        }

        return pending;
      };
    }

    function getBasePlacement(placement) {
      return placement.split('-')[0];
    }

    function mergeByName(modifiers) {
      var merged = modifiers.reduce(function (merged, current) {
        var existing = merged[current.name];
        merged[current.name] = existing ? Object.assign({}, existing, current, {
          options: Object.assign({}, existing.options, current.options),
          data: Object.assign({}, existing.data, current.data)
        }) : current;
        return merged;
      }, {}); // IE11 does not support Object.values

      return Object.keys(merged).map(function (key) {
        return merged[key];
      });
    }

    function getViewportRect(element, strategy) {
      var win = getWindow(element);
      var html = getDocumentElement(element);
      var visualViewport = win.visualViewport;
      var width = html.clientWidth;
      var height = html.clientHeight;
      var x = 0;
      var y = 0;

      if (visualViewport) {
        width = visualViewport.width;
        height = visualViewport.height;
        var layoutViewport = isLayoutViewport();

        if (layoutViewport || !layoutViewport && strategy === 'fixed') {
          x = visualViewport.offsetLeft;
          y = visualViewport.offsetTop;
        }
      }

      return {
        width: width,
        height: height,
        x: x + getWindowScrollBarX(element),
        y: y
      };
    }

    // of the `<html>` and `<body>` rect bounds if horizontally scrollable

    function getDocumentRect(element) {
      var _element$ownerDocumen;

      var html = getDocumentElement(element);
      var winScroll = getWindowScroll(element);
      var body = (_element$ownerDocumen = element.ownerDocument) == null ? void 0 : _element$ownerDocumen.body;
      var width = max(html.scrollWidth, html.clientWidth, body ? body.scrollWidth : 0, body ? body.clientWidth : 0);
      var height = max(html.scrollHeight, html.clientHeight, body ? body.scrollHeight : 0, body ? body.clientHeight : 0);
      var x = -winScroll.scrollLeft + getWindowScrollBarX(element);
      var y = -winScroll.scrollTop;

      if (getComputedStyle$1(body || html).direction === 'rtl') {
        x += max(html.clientWidth, body ? body.clientWidth : 0) - width;
      }

      return {
        width: width,
        height: height,
        x: x,
        y: y
      };
    }

    function contains(parent, child) {
      var rootNode = child.getRootNode && child.getRootNode(); // First, attempt with faster native method

      if (parent.contains(child)) {
        return true;
      } // then fallback to custom implementation with Shadow DOM support
      else if (rootNode && isShadowRoot(rootNode)) {
          var next = child;

          do {
            if (next && parent.isSameNode(next)) {
              return true;
            } // $FlowFixMe[prop-missing]: need a better way to handle this...


            next = next.parentNode || next.host;
          } while (next);
        } // Give up, the result is false


      return false;
    }

    function rectToClientRect(rect) {
      return Object.assign({}, rect, {
        left: rect.x,
        top: rect.y,
        right: rect.x + rect.width,
        bottom: rect.y + rect.height
      });
    }

    function getInnerBoundingClientRect(element, strategy) {
      var rect = getBoundingClientRect(element, false, strategy === 'fixed');
      rect.top = rect.top + element.clientTop;
      rect.left = rect.left + element.clientLeft;
      rect.bottom = rect.top + element.clientHeight;
      rect.right = rect.left + element.clientWidth;
      rect.width = element.clientWidth;
      rect.height = element.clientHeight;
      rect.x = rect.left;
      rect.y = rect.top;
      return rect;
    }

    function getClientRectFromMixedType(element, clippingParent, strategy) {
      return clippingParent === viewport ? rectToClientRect(getViewportRect(element, strategy)) : isElement(clippingParent) ? getInnerBoundingClientRect(clippingParent, strategy) : rectToClientRect(getDocumentRect(getDocumentElement(element)));
    } // A "clipping parent" is an overflowable container with the characteristic of
    // clipping (or hiding) overflowing elements with a position different from
    // `initial`


    function getClippingParents(element) {
      var clippingParents = listScrollParents(getParentNode(element));
      var canEscapeClipping = ['absolute', 'fixed'].indexOf(getComputedStyle$1(element).position) >= 0;
      var clipperElement = canEscapeClipping && isHTMLElement(element) ? getOffsetParent(element) : element;

      if (!isElement(clipperElement)) {
        return [];
      } // $FlowFixMe[incompatible-return]: https://github.com/facebook/flow/issues/1414


      return clippingParents.filter(function (clippingParent) {
        return isElement(clippingParent) && contains(clippingParent, clipperElement) && getNodeName(clippingParent) !== 'body';
      });
    } // Gets the maximum area that the element is visible in due to any number of
    // clipping parents


    function getClippingRect(element, boundary, rootBoundary, strategy) {
      var mainClippingParents = boundary === 'clippingParents' ? getClippingParents(element) : [].concat(boundary);
      var clippingParents = [].concat(mainClippingParents, [rootBoundary]);
      var firstClippingParent = clippingParents[0];
      var clippingRect = clippingParents.reduce(function (accRect, clippingParent) {
        var rect = getClientRectFromMixedType(element, clippingParent, strategy);
        accRect.top = max(rect.top, accRect.top);
        accRect.right = min(rect.right, accRect.right);
        accRect.bottom = min(rect.bottom, accRect.bottom);
        accRect.left = max(rect.left, accRect.left);
        return accRect;
      }, getClientRectFromMixedType(element, firstClippingParent, strategy));
      clippingRect.width = clippingRect.right - clippingRect.left;
      clippingRect.height = clippingRect.bottom - clippingRect.top;
      clippingRect.x = clippingRect.left;
      clippingRect.y = clippingRect.top;
      return clippingRect;
    }

    function getVariation(placement) {
      return placement.split('-')[1];
    }

    function getMainAxisFromPlacement(placement) {
      return ['top', 'bottom'].indexOf(placement) >= 0 ? 'x' : 'y';
    }

    function computeOffsets(_ref) {
      var reference = _ref.reference,
          element = _ref.element,
          placement = _ref.placement;
      var basePlacement = placement ? getBasePlacement(placement) : null;
      var variation = placement ? getVariation(placement) : null;
      var commonX = reference.x + reference.width / 2 - element.width / 2;
      var commonY = reference.y + reference.height / 2 - element.height / 2;
      var offsets;

      switch (basePlacement) {
        case top:
          offsets = {
            x: commonX,
            y: reference.y - element.height
          };
          break;

        case bottom:
          offsets = {
            x: commonX,
            y: reference.y + reference.height
          };
          break;

        case right:
          offsets = {
            x: reference.x + reference.width,
            y: commonY
          };
          break;

        case left:
          offsets = {
            x: reference.x - element.width,
            y: commonY
          };
          break;

        default:
          offsets = {
            x: reference.x,
            y: reference.y
          };
      }

      var mainAxis = basePlacement ? getMainAxisFromPlacement(basePlacement) : null;

      if (mainAxis != null) {
        var len = mainAxis === 'y' ? 'height' : 'width';

        switch (variation) {
          case start:
            offsets[mainAxis] = offsets[mainAxis] - (reference[len] / 2 - element[len] / 2);
            break;

          case end:
            offsets[mainAxis] = offsets[mainAxis] + (reference[len] / 2 - element[len] / 2);
            break;
        }
      }

      return offsets;
    }

    function getFreshSideObject() {
      return {
        top: 0,
        right: 0,
        bottom: 0,
        left: 0
      };
    }

    function mergePaddingObject(paddingObject) {
      return Object.assign({}, getFreshSideObject(), paddingObject);
    }

    function expandToHashMap(value, keys) {
      return keys.reduce(function (hashMap, key) {
        hashMap[key] = value;
        return hashMap;
      }, {});
    }

    function detectOverflow(state, options) {
      if (options === void 0) {
        options = {};
      }

      var _options = options,
          _options$placement = _options.placement,
          placement = _options$placement === void 0 ? state.placement : _options$placement,
          _options$strategy = _options.strategy,
          strategy = _options$strategy === void 0 ? state.strategy : _options$strategy,
          _options$boundary = _options.boundary,
          boundary = _options$boundary === void 0 ? clippingParents : _options$boundary,
          _options$rootBoundary = _options.rootBoundary,
          rootBoundary = _options$rootBoundary === void 0 ? viewport : _options$rootBoundary,
          _options$elementConte = _options.elementContext,
          elementContext = _options$elementConte === void 0 ? popper : _options$elementConte,
          _options$altBoundary = _options.altBoundary,
          altBoundary = _options$altBoundary === void 0 ? false : _options$altBoundary,
          _options$padding = _options.padding,
          padding = _options$padding === void 0 ? 0 : _options$padding;
      var paddingObject = mergePaddingObject(typeof padding !== 'number' ? padding : expandToHashMap(padding, basePlacements));
      var altContext = elementContext === popper ? reference : popper;
      var popperRect = state.rects.popper;
      var element = state.elements[altBoundary ? altContext : elementContext];
      var clippingClientRect = getClippingRect(isElement(element) ? element : element.contextElement || getDocumentElement(state.elements.popper), boundary, rootBoundary, strategy);
      var referenceClientRect = getBoundingClientRect(state.elements.reference);
      var popperOffsets = computeOffsets({
        reference: referenceClientRect,
        element: popperRect,
        strategy: 'absolute',
        placement: placement
      });
      var popperClientRect = rectToClientRect(Object.assign({}, popperRect, popperOffsets));
      var elementClientRect = elementContext === popper ? popperClientRect : referenceClientRect; // positive = overflowing the clipping rect
      // 0 or negative = within the clipping rect

      var overflowOffsets = {
        top: clippingClientRect.top - elementClientRect.top + paddingObject.top,
        bottom: elementClientRect.bottom - clippingClientRect.bottom + paddingObject.bottom,
        left: clippingClientRect.left - elementClientRect.left + paddingObject.left,
        right: elementClientRect.right - clippingClientRect.right + paddingObject.right
      };
      var offsetData = state.modifiersData.offset; // Offsets can be applied only to the popper element

      if (elementContext === popper && offsetData) {
        var offset = offsetData[placement];
        Object.keys(overflowOffsets).forEach(function (key) {
          var multiply = [right, bottom].indexOf(key) >= 0 ? 1 : -1;
          var axis = [top, bottom].indexOf(key) >= 0 ? 'y' : 'x';
          overflowOffsets[key] += offset[axis] * multiply;
        });
      }

      return overflowOffsets;
    }

    var DEFAULT_OPTIONS = {
      placement: 'bottom',
      modifiers: [],
      strategy: 'absolute'
    };

    function areValidElements() {
      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      return !args.some(function (element) {
        return !(element && typeof element.getBoundingClientRect === 'function');
      });
    }

    function popperGenerator(generatorOptions) {
      if (generatorOptions === void 0) {
        generatorOptions = {};
      }

      var _generatorOptions = generatorOptions,
          _generatorOptions$def = _generatorOptions.defaultModifiers,
          defaultModifiers = _generatorOptions$def === void 0 ? [] : _generatorOptions$def,
          _generatorOptions$def2 = _generatorOptions.defaultOptions,
          defaultOptions = _generatorOptions$def2 === void 0 ? DEFAULT_OPTIONS : _generatorOptions$def2;
      return function createPopper(reference, popper, options) {
        if (options === void 0) {
          options = defaultOptions;
        }

        var state = {
          placement: 'bottom',
          orderedModifiers: [],
          options: Object.assign({}, DEFAULT_OPTIONS, defaultOptions),
          modifiersData: {},
          elements: {
            reference: reference,
            popper: popper
          },
          attributes: {},
          styles: {}
        };
        var effectCleanupFns = [];
        var isDestroyed = false;
        var instance = {
          state: state,
          setOptions: function setOptions(setOptionsAction) {
            var options = typeof setOptionsAction === 'function' ? setOptionsAction(state.options) : setOptionsAction;
            cleanupModifierEffects();
            state.options = Object.assign({}, defaultOptions, state.options, options);
            state.scrollParents = {
              reference: isElement(reference) ? listScrollParents(reference) : reference.contextElement ? listScrollParents(reference.contextElement) : [],
              popper: listScrollParents(popper)
            }; // Orders the modifiers based on their dependencies and `phase`
            // properties

            var orderedModifiers = orderModifiers(mergeByName([].concat(defaultModifiers, state.options.modifiers))); // Strip out disabled modifiers

            state.orderedModifiers = orderedModifiers.filter(function (m) {
              return m.enabled;
            }); // Validate the provided modifiers so that the consumer will get warned

            runModifierEffects();
            return instance.update();
          },
          // Sync update – it will always be executed, even if not necessary. This
          // is useful for low frequency updates where sync behavior simplifies the
          // logic.
          // For high frequency updates (e.g. `resize` and `scroll` events), always
          // prefer the async Popper#update method
          forceUpdate: function forceUpdate() {
            if (isDestroyed) {
              return;
            }

            var _state$elements = state.elements,
                reference = _state$elements.reference,
                popper = _state$elements.popper; // Don't proceed if `reference` or `popper` are not valid elements
            // anymore

            if (!areValidElements(reference, popper)) {

              return;
            } // Store the reference and popper rects to be read by modifiers


            state.rects = {
              reference: getCompositeRect(reference, getOffsetParent(popper), state.options.strategy === 'fixed'),
              popper: getLayoutRect(popper)
            }; // Modifiers have the ability to reset the current update cycle. The
            // most common use case for this is the `flip` modifier changing the
            // placement, which then needs to re-run all the modifiers, because the
            // logic was previously ran for the previous placement and is therefore
            // stale/incorrect

            state.reset = false;
            state.placement = state.options.placement; // On each update cycle, the `modifiersData` property for each modifier
            // is filled with the initial data specified by the modifier. This means
            // it doesn't persist and is fresh on each update.
            // To ensure persistent data, use `${name}#persistent`

            state.orderedModifiers.forEach(function (modifier) {
              return state.modifiersData[modifier.name] = Object.assign({}, modifier.data);
            });

            for (var index = 0; index < state.orderedModifiers.length; index++) {

              if (state.reset === true) {
                state.reset = false;
                index = -1;
                continue;
              }

              var _state$orderedModifie = state.orderedModifiers[index],
                  fn = _state$orderedModifie.fn,
                  _state$orderedModifie2 = _state$orderedModifie.options,
                  _options = _state$orderedModifie2 === void 0 ? {} : _state$orderedModifie2,
                  name = _state$orderedModifie.name;

              if (typeof fn === 'function') {
                state = fn({
                  state: state,
                  options: _options,
                  name: name,
                  instance: instance
                }) || state;
              }
            }
          },
          // Async and optimistically optimized update – it will not be executed if
          // not necessary (debounced to run at most once-per-tick)
          update: debounce(function () {
            return new Promise(function (resolve) {
              instance.forceUpdate();
              resolve(state);
            });
          }),
          destroy: function destroy() {
            cleanupModifierEffects();
            isDestroyed = true;
          }
        };

        if (!areValidElements(reference, popper)) {

          return instance;
        }

        instance.setOptions(options).then(function (state) {
          if (!isDestroyed && options.onFirstUpdate) {
            options.onFirstUpdate(state);
          }
        }); // Modifiers have the ability to execute arbitrary code before the first
        // update cycle runs. They will be executed in the same order as the update
        // cycle. This is useful when a modifier adds some persistent data that
        // other modifiers need to use, but the modifier is run after the dependent
        // one.

        function runModifierEffects() {
          state.orderedModifiers.forEach(function (_ref3) {
            var name = _ref3.name,
                _ref3$options = _ref3.options,
                options = _ref3$options === void 0 ? {} : _ref3$options,
                effect = _ref3.effect;

            if (typeof effect === 'function') {
              var cleanupFn = effect({
                state: state,
                name: name,
                instance: instance,
                options: options
              });

              var noopFn = function noopFn() {};

              effectCleanupFns.push(cleanupFn || noopFn);
            }
          });
        }

        function cleanupModifierEffects() {
          effectCleanupFns.forEach(function (fn) {
            return fn();
          });
          effectCleanupFns = [];
        }

        return instance;
      };
    }

    var passive = {
      passive: true
    };

    function effect$2(_ref) {
      var state = _ref.state,
          instance = _ref.instance,
          options = _ref.options;
      var _options$scroll = options.scroll,
          scroll = _options$scroll === void 0 ? true : _options$scroll,
          _options$resize = options.resize,
          resize = _options$resize === void 0 ? true : _options$resize;
      var window = getWindow(state.elements.popper);
      var scrollParents = [].concat(state.scrollParents.reference, state.scrollParents.popper);

      if (scroll) {
        scrollParents.forEach(function (scrollParent) {
          scrollParent.addEventListener('scroll', instance.update, passive);
        });
      }

      if (resize) {
        window.addEventListener('resize', instance.update, passive);
      }

      return function () {
        if (scroll) {
          scrollParents.forEach(function (scrollParent) {
            scrollParent.removeEventListener('scroll', instance.update, passive);
          });
        }

        if (resize) {
          window.removeEventListener('resize', instance.update, passive);
        }
      };
    } // eslint-disable-next-line import/no-unused-modules


    var eventListeners = {
      name: 'eventListeners',
      enabled: true,
      phase: 'write',
      fn: function fn() {},
      effect: effect$2,
      data: {}
    };

    function popperOffsets(_ref) {
      var state = _ref.state,
          name = _ref.name;
      // Offsets are the actual position the popper needs to have to be
      // properly positioned near its reference element
      // This is the most basic placement, and will be adjusted by
      // the modifiers in the next step
      state.modifiersData[name] = computeOffsets({
        reference: state.rects.reference,
        element: state.rects.popper,
        strategy: 'absolute',
        placement: state.placement
      });
    } // eslint-disable-next-line import/no-unused-modules


    var popperOffsets$1 = {
      name: 'popperOffsets',
      enabled: true,
      phase: 'read',
      fn: popperOffsets,
      data: {}
    };

    var unsetSides = {
      top: 'auto',
      right: 'auto',
      bottom: 'auto',
      left: 'auto'
    }; // Round the offsets to the nearest suitable subpixel based on the DPR.
    // Zooming can change the DPR, but it seems to report a value that will
    // cleanly divide the values into the appropriate subpixels.

    function roundOffsetsByDPR(_ref) {
      var x = _ref.x,
          y = _ref.y;
      var win = window;
      var dpr = win.devicePixelRatio || 1;
      return {
        x: round(x * dpr) / dpr || 0,
        y: round(y * dpr) / dpr || 0
      };
    }

    function mapToStyles(_ref2) {
      var _Object$assign2;

      var popper = _ref2.popper,
          popperRect = _ref2.popperRect,
          placement = _ref2.placement,
          variation = _ref2.variation,
          offsets = _ref2.offsets,
          position = _ref2.position,
          gpuAcceleration = _ref2.gpuAcceleration,
          adaptive = _ref2.adaptive,
          roundOffsets = _ref2.roundOffsets,
          isFixed = _ref2.isFixed;
      var _offsets$x = offsets.x,
          x = _offsets$x === void 0 ? 0 : _offsets$x,
          _offsets$y = offsets.y,
          y = _offsets$y === void 0 ? 0 : _offsets$y;

      var _ref3 = typeof roundOffsets === 'function' ? roundOffsets({
        x: x,
        y: y
      }) : {
        x: x,
        y: y
      };

      x = _ref3.x;
      y = _ref3.y;
      var hasX = offsets.hasOwnProperty('x');
      var hasY = offsets.hasOwnProperty('y');
      var sideX = left;
      var sideY = top;
      var win = window;

      if (adaptive) {
        var offsetParent = getOffsetParent(popper);
        var heightProp = 'clientHeight';
        var widthProp = 'clientWidth';

        if (offsetParent === getWindow(popper)) {
          offsetParent = getDocumentElement(popper);

          if (getComputedStyle$1(offsetParent).position !== 'static' && position === 'absolute') {
            heightProp = 'scrollHeight';
            widthProp = 'scrollWidth';
          }
        } // $FlowFixMe[incompatible-cast]: force type refinement, we compare offsetParent with window above, but Flow doesn't detect it


        offsetParent = offsetParent;

        if (placement === top || (placement === left || placement === right) && variation === end) {
          sideY = bottom;
          var offsetY = isFixed && offsetParent === win && win.visualViewport ? win.visualViewport.height : // $FlowFixMe[prop-missing]
          offsetParent[heightProp];
          y -= offsetY - popperRect.height;
          y *= gpuAcceleration ? 1 : -1;
        }

        if (placement === left || (placement === top || placement === bottom) && variation === end) {
          sideX = right;
          var offsetX = isFixed && offsetParent === win && win.visualViewport ? win.visualViewport.width : // $FlowFixMe[prop-missing]
          offsetParent[widthProp];
          x -= offsetX - popperRect.width;
          x *= gpuAcceleration ? 1 : -1;
        }
      }

      var commonStyles = Object.assign({
        position: position
      }, adaptive && unsetSides);

      var _ref4 = roundOffsets === true ? roundOffsetsByDPR({
        x: x,
        y: y
      }) : {
        x: x,
        y: y
      };

      x = _ref4.x;
      y = _ref4.y;

      if (gpuAcceleration) {
        var _Object$assign;

        return Object.assign({}, commonStyles, (_Object$assign = {}, _Object$assign[sideY] = hasY ? '0' : '', _Object$assign[sideX] = hasX ? '0' : '', _Object$assign.transform = (win.devicePixelRatio || 1) <= 1 ? "translate(" + x + "px, " + y + "px)" : "translate3d(" + x + "px, " + y + "px, 0)", _Object$assign));
      }

      return Object.assign({}, commonStyles, (_Object$assign2 = {}, _Object$assign2[sideY] = hasY ? y + "px" : '', _Object$assign2[sideX] = hasX ? x + "px" : '', _Object$assign2.transform = '', _Object$assign2));
    }

    function computeStyles(_ref5) {
      var state = _ref5.state,
          options = _ref5.options;
      var _options$gpuAccelerat = options.gpuAcceleration,
          gpuAcceleration = _options$gpuAccelerat === void 0 ? true : _options$gpuAccelerat,
          _options$adaptive = options.adaptive,
          adaptive = _options$adaptive === void 0 ? true : _options$adaptive,
          _options$roundOffsets = options.roundOffsets,
          roundOffsets = _options$roundOffsets === void 0 ? true : _options$roundOffsets;

      var commonStyles = {
        placement: getBasePlacement(state.placement),
        variation: getVariation(state.placement),
        popper: state.elements.popper,
        popperRect: state.rects.popper,
        gpuAcceleration: gpuAcceleration,
        isFixed: state.options.strategy === 'fixed'
      };

      if (state.modifiersData.popperOffsets != null) {
        state.styles.popper = Object.assign({}, state.styles.popper, mapToStyles(Object.assign({}, commonStyles, {
          offsets: state.modifiersData.popperOffsets,
          position: state.options.strategy,
          adaptive: adaptive,
          roundOffsets: roundOffsets
        })));
      }

      if (state.modifiersData.arrow != null) {
        state.styles.arrow = Object.assign({}, state.styles.arrow, mapToStyles(Object.assign({}, commonStyles, {
          offsets: state.modifiersData.arrow,
          position: 'absolute',
          adaptive: false,
          roundOffsets: roundOffsets
        })));
      }

      state.attributes.popper = Object.assign({}, state.attributes.popper, {
        'data-popper-placement': state.placement
      });
    } // eslint-disable-next-line import/no-unused-modules


    var computeStyles$1 = {
      name: 'computeStyles',
      enabled: true,
      phase: 'beforeWrite',
      fn: computeStyles,
      data: {}
    };

    // and applies them to the HTMLElements such as popper and arrow

    function applyStyles(_ref) {
      var state = _ref.state;
      Object.keys(state.elements).forEach(function (name) {
        var style = state.styles[name] || {};
        var attributes = state.attributes[name] || {};
        var element = state.elements[name]; // arrow is optional + virtual elements

        if (!isHTMLElement(element) || !getNodeName(element)) {
          return;
        } // Flow doesn't support to extend this property, but it's the most
        // effective way to apply styles to an HTMLElement
        // $FlowFixMe[cannot-write]


        Object.assign(element.style, style);
        Object.keys(attributes).forEach(function (name) {
          var value = attributes[name];

          if (value === false) {
            element.removeAttribute(name);
          } else {
            element.setAttribute(name, value === true ? '' : value);
          }
        });
      });
    }

    function effect$1(_ref2) {
      var state = _ref2.state;
      var initialStyles = {
        popper: {
          position: state.options.strategy,
          left: '0',
          top: '0',
          margin: '0'
        },
        arrow: {
          position: 'absolute'
        },
        reference: {}
      };
      Object.assign(state.elements.popper.style, initialStyles.popper);
      state.styles = initialStyles;

      if (state.elements.arrow) {
        Object.assign(state.elements.arrow.style, initialStyles.arrow);
      }

      return function () {
        Object.keys(state.elements).forEach(function (name) {
          var element = state.elements[name];
          var attributes = state.attributes[name] || {};
          var styleProperties = Object.keys(state.styles.hasOwnProperty(name) ? state.styles[name] : initialStyles[name]); // Set all values to an empty string to unset them

          var style = styleProperties.reduce(function (style, property) {
            style[property] = '';
            return style;
          }, {}); // arrow is optional + virtual elements

          if (!isHTMLElement(element) || !getNodeName(element)) {
            return;
          }

          Object.assign(element.style, style);
          Object.keys(attributes).forEach(function (attribute) {
            element.removeAttribute(attribute);
          });
        });
      };
    } // eslint-disable-next-line import/no-unused-modules


    var applyStyles$1 = {
      name: 'applyStyles',
      enabled: true,
      phase: 'write',
      fn: applyStyles,
      effect: effect$1,
      requires: ['computeStyles']
    };

    function distanceAndSkiddingToXY(placement, rects, offset) {
      var basePlacement = getBasePlacement(placement);
      var invertDistance = [left, top].indexOf(basePlacement) >= 0 ? -1 : 1;

      var _ref = typeof offset === 'function' ? offset(Object.assign({}, rects, {
        placement: placement
      })) : offset,
          skidding = _ref[0],
          distance = _ref[1];

      skidding = skidding || 0;
      distance = (distance || 0) * invertDistance;
      return [left, right].indexOf(basePlacement) >= 0 ? {
        x: distance,
        y: skidding
      } : {
        x: skidding,
        y: distance
      };
    }

    function offset(_ref2) {
      var state = _ref2.state,
          options = _ref2.options,
          name = _ref2.name;
      var _options$offset = options.offset,
          offset = _options$offset === void 0 ? [0, 0] : _options$offset;
      var data = placements.reduce(function (acc, placement) {
        acc[placement] = distanceAndSkiddingToXY(placement, state.rects, offset);
        return acc;
      }, {});
      var _data$state$placement = data[state.placement],
          x = _data$state$placement.x,
          y = _data$state$placement.y;

      if (state.modifiersData.popperOffsets != null) {
        state.modifiersData.popperOffsets.x += x;
        state.modifiersData.popperOffsets.y += y;
      }

      state.modifiersData[name] = data;
    } // eslint-disable-next-line import/no-unused-modules


    var offset$1 = {
      name: 'offset',
      enabled: true,
      phase: 'main',
      requires: ['popperOffsets'],
      fn: offset
    };

    var hash$1 = {
      left: 'right',
      right: 'left',
      bottom: 'top',
      top: 'bottom'
    };
    function getOppositePlacement(placement) {
      return placement.replace(/left|right|bottom|top/g, function (matched) {
        return hash$1[matched];
      });
    }

    var hash = {
      start: 'end',
      end: 'start'
    };
    function getOppositeVariationPlacement(placement) {
      return placement.replace(/start|end/g, function (matched) {
        return hash[matched];
      });
    }

    function computeAutoPlacement(state, options) {
      if (options === void 0) {
        options = {};
      }

      var _options = options,
          placement = _options.placement,
          boundary = _options.boundary,
          rootBoundary = _options.rootBoundary,
          padding = _options.padding,
          flipVariations = _options.flipVariations,
          _options$allowedAutoP = _options.allowedAutoPlacements,
          allowedAutoPlacements = _options$allowedAutoP === void 0 ? placements : _options$allowedAutoP;
      var variation = getVariation(placement);
      var placements$1 = variation ? flipVariations ? variationPlacements : variationPlacements.filter(function (placement) {
        return getVariation(placement) === variation;
      }) : basePlacements;
      var allowedPlacements = placements$1.filter(function (placement) {
        return allowedAutoPlacements.indexOf(placement) >= 0;
      });

      if (allowedPlacements.length === 0) {
        allowedPlacements = placements$1;
      } // $FlowFixMe[incompatible-type]: Flow seems to have problems with two array unions...


      var overflows = allowedPlacements.reduce(function (acc, placement) {
        acc[placement] = detectOverflow(state, {
          placement: placement,
          boundary: boundary,
          rootBoundary: rootBoundary,
          padding: padding
        })[getBasePlacement(placement)];
        return acc;
      }, {});
      return Object.keys(overflows).sort(function (a, b) {
        return overflows[a] - overflows[b];
      });
    }

    function getExpandedFallbackPlacements(placement) {
      if (getBasePlacement(placement) === auto) {
        return [];
      }

      var oppositePlacement = getOppositePlacement(placement);
      return [getOppositeVariationPlacement(placement), oppositePlacement, getOppositeVariationPlacement(oppositePlacement)];
    }

    function flip(_ref) {
      var state = _ref.state,
          options = _ref.options,
          name = _ref.name;

      if (state.modifiersData[name]._skip) {
        return;
      }

      var _options$mainAxis = options.mainAxis,
          checkMainAxis = _options$mainAxis === void 0 ? true : _options$mainAxis,
          _options$altAxis = options.altAxis,
          checkAltAxis = _options$altAxis === void 0 ? true : _options$altAxis,
          specifiedFallbackPlacements = options.fallbackPlacements,
          padding = options.padding,
          boundary = options.boundary,
          rootBoundary = options.rootBoundary,
          altBoundary = options.altBoundary,
          _options$flipVariatio = options.flipVariations,
          flipVariations = _options$flipVariatio === void 0 ? true : _options$flipVariatio,
          allowedAutoPlacements = options.allowedAutoPlacements;
      var preferredPlacement = state.options.placement;
      var basePlacement = getBasePlacement(preferredPlacement);
      var isBasePlacement = basePlacement === preferredPlacement;
      var fallbackPlacements = specifiedFallbackPlacements || (isBasePlacement || !flipVariations ? [getOppositePlacement(preferredPlacement)] : getExpandedFallbackPlacements(preferredPlacement));
      var placements = [preferredPlacement].concat(fallbackPlacements).reduce(function (acc, placement) {
        return acc.concat(getBasePlacement(placement) === auto ? computeAutoPlacement(state, {
          placement: placement,
          boundary: boundary,
          rootBoundary: rootBoundary,
          padding: padding,
          flipVariations: flipVariations,
          allowedAutoPlacements: allowedAutoPlacements
        }) : placement);
      }, []);
      var referenceRect = state.rects.reference;
      var popperRect = state.rects.popper;
      var checksMap = new Map();
      var makeFallbackChecks = true;
      var firstFittingPlacement = placements[0];

      for (var i = 0; i < placements.length; i++) {
        var placement = placements[i];

        var _basePlacement = getBasePlacement(placement);

        var isStartVariation = getVariation(placement) === start;
        var isVertical = [top, bottom].indexOf(_basePlacement) >= 0;
        var len = isVertical ? 'width' : 'height';
        var overflow = detectOverflow(state, {
          placement: placement,
          boundary: boundary,
          rootBoundary: rootBoundary,
          altBoundary: altBoundary,
          padding: padding
        });
        var mainVariationSide = isVertical ? isStartVariation ? right : left : isStartVariation ? bottom : top;

        if (referenceRect[len] > popperRect[len]) {
          mainVariationSide = getOppositePlacement(mainVariationSide);
        }

        var altVariationSide = getOppositePlacement(mainVariationSide);
        var checks = [];

        if (checkMainAxis) {
          checks.push(overflow[_basePlacement] <= 0);
        }

        if (checkAltAxis) {
          checks.push(overflow[mainVariationSide] <= 0, overflow[altVariationSide] <= 0);
        }

        if (checks.every(function (check) {
          return check;
        })) {
          firstFittingPlacement = placement;
          makeFallbackChecks = false;
          break;
        }

        checksMap.set(placement, checks);
      }

      if (makeFallbackChecks) {
        // `2` may be desired in some cases – research later
        var numberOfChecks = flipVariations ? 3 : 1;

        var _loop = function _loop(_i) {
          var fittingPlacement = placements.find(function (placement) {
            var checks = checksMap.get(placement);

            if (checks) {
              return checks.slice(0, _i).every(function (check) {
                return check;
              });
            }
          });

          if (fittingPlacement) {
            firstFittingPlacement = fittingPlacement;
            return "break";
          }
        };

        for (var _i = numberOfChecks; _i > 0; _i--) {
          var _ret = _loop(_i);

          if (_ret === "break") break;
        }
      }

      if (state.placement !== firstFittingPlacement) {
        state.modifiersData[name]._skip = true;
        state.placement = firstFittingPlacement;
        state.reset = true;
      }
    } // eslint-disable-next-line import/no-unused-modules


    var flip$1 = {
      name: 'flip',
      enabled: true,
      phase: 'main',
      fn: flip,
      requiresIfExists: ['offset'],
      data: {
        _skip: false
      }
    };

    function getAltAxis(axis) {
      return axis === 'x' ? 'y' : 'x';
    }

    function within(min$1, value, max$1) {
      return max(min$1, min(value, max$1));
    }
    function withinMaxClamp(min, value, max) {
      var v = within(min, value, max);
      return v > max ? max : v;
    }

    function preventOverflow(_ref) {
      var state = _ref.state,
          options = _ref.options,
          name = _ref.name;
      var _options$mainAxis = options.mainAxis,
          checkMainAxis = _options$mainAxis === void 0 ? true : _options$mainAxis,
          _options$altAxis = options.altAxis,
          checkAltAxis = _options$altAxis === void 0 ? false : _options$altAxis,
          boundary = options.boundary,
          rootBoundary = options.rootBoundary,
          altBoundary = options.altBoundary,
          padding = options.padding,
          _options$tether = options.tether,
          tether = _options$tether === void 0 ? true : _options$tether,
          _options$tetherOffset = options.tetherOffset,
          tetherOffset = _options$tetherOffset === void 0 ? 0 : _options$tetherOffset;
      var overflow = detectOverflow(state, {
        boundary: boundary,
        rootBoundary: rootBoundary,
        padding: padding,
        altBoundary: altBoundary
      });
      var basePlacement = getBasePlacement(state.placement);
      var variation = getVariation(state.placement);
      var isBasePlacement = !variation;
      var mainAxis = getMainAxisFromPlacement(basePlacement);
      var altAxis = getAltAxis(mainAxis);
      var popperOffsets = state.modifiersData.popperOffsets;
      var referenceRect = state.rects.reference;
      var popperRect = state.rects.popper;
      var tetherOffsetValue = typeof tetherOffset === 'function' ? tetherOffset(Object.assign({}, state.rects, {
        placement: state.placement
      })) : tetherOffset;
      var normalizedTetherOffsetValue = typeof tetherOffsetValue === 'number' ? {
        mainAxis: tetherOffsetValue,
        altAxis: tetherOffsetValue
      } : Object.assign({
        mainAxis: 0,
        altAxis: 0
      }, tetherOffsetValue);
      var offsetModifierState = state.modifiersData.offset ? state.modifiersData.offset[state.placement] : null;
      var data = {
        x: 0,
        y: 0
      };

      if (!popperOffsets) {
        return;
      }

      if (checkMainAxis) {
        var _offsetModifierState$;

        var mainSide = mainAxis === 'y' ? top : left;
        var altSide = mainAxis === 'y' ? bottom : right;
        var len = mainAxis === 'y' ? 'height' : 'width';
        var offset = popperOffsets[mainAxis];
        var min$1 = offset + overflow[mainSide];
        var max$1 = offset - overflow[altSide];
        var additive = tether ? -popperRect[len] / 2 : 0;
        var minLen = variation === start ? referenceRect[len] : popperRect[len];
        var maxLen = variation === start ? -popperRect[len] : -referenceRect[len]; // We need to include the arrow in the calculation so the arrow doesn't go
        // outside the reference bounds

        var arrowElement = state.elements.arrow;
        var arrowRect = tether && arrowElement ? getLayoutRect(arrowElement) : {
          width: 0,
          height: 0
        };
        var arrowPaddingObject = state.modifiersData['arrow#persistent'] ? state.modifiersData['arrow#persistent'].padding : getFreshSideObject();
        var arrowPaddingMin = arrowPaddingObject[mainSide];
        var arrowPaddingMax = arrowPaddingObject[altSide]; // If the reference length is smaller than the arrow length, we don't want
        // to include its full size in the calculation. If the reference is small
        // and near the edge of a boundary, the popper can overflow even if the
        // reference is not overflowing as well (e.g. virtual elements with no
        // width or height)

        var arrowLen = within(0, referenceRect[len], arrowRect[len]);
        var minOffset = isBasePlacement ? referenceRect[len] / 2 - additive - arrowLen - arrowPaddingMin - normalizedTetherOffsetValue.mainAxis : minLen - arrowLen - arrowPaddingMin - normalizedTetherOffsetValue.mainAxis;
        var maxOffset = isBasePlacement ? -referenceRect[len] / 2 + additive + arrowLen + arrowPaddingMax + normalizedTetherOffsetValue.mainAxis : maxLen + arrowLen + arrowPaddingMax + normalizedTetherOffsetValue.mainAxis;
        var arrowOffsetParent = state.elements.arrow && getOffsetParent(state.elements.arrow);
        var clientOffset = arrowOffsetParent ? mainAxis === 'y' ? arrowOffsetParent.clientTop || 0 : arrowOffsetParent.clientLeft || 0 : 0;
        var offsetModifierValue = (_offsetModifierState$ = offsetModifierState == null ? void 0 : offsetModifierState[mainAxis]) != null ? _offsetModifierState$ : 0;
        var tetherMin = offset + minOffset - offsetModifierValue - clientOffset;
        var tetherMax = offset + maxOffset - offsetModifierValue;
        var preventedOffset = within(tether ? min(min$1, tetherMin) : min$1, offset, tether ? max(max$1, tetherMax) : max$1);
        popperOffsets[mainAxis] = preventedOffset;
        data[mainAxis] = preventedOffset - offset;
      }

      if (checkAltAxis) {
        var _offsetModifierState$2;

        var _mainSide = mainAxis === 'x' ? top : left;

        var _altSide = mainAxis === 'x' ? bottom : right;

        var _offset = popperOffsets[altAxis];

        var _len = altAxis === 'y' ? 'height' : 'width';

        var _min = _offset + overflow[_mainSide];

        var _max = _offset - overflow[_altSide];

        var isOriginSide = [top, left].indexOf(basePlacement) !== -1;

        var _offsetModifierValue = (_offsetModifierState$2 = offsetModifierState == null ? void 0 : offsetModifierState[altAxis]) != null ? _offsetModifierState$2 : 0;

        var _tetherMin = isOriginSide ? _min : _offset - referenceRect[_len] - popperRect[_len] - _offsetModifierValue + normalizedTetherOffsetValue.altAxis;

        var _tetherMax = isOriginSide ? _offset + referenceRect[_len] + popperRect[_len] - _offsetModifierValue - normalizedTetherOffsetValue.altAxis : _max;

        var _preventedOffset = tether && isOriginSide ? withinMaxClamp(_tetherMin, _offset, _tetherMax) : within(tether ? _tetherMin : _min, _offset, tether ? _tetherMax : _max);

        popperOffsets[altAxis] = _preventedOffset;
        data[altAxis] = _preventedOffset - _offset;
      }

      state.modifiersData[name] = data;
    } // eslint-disable-next-line import/no-unused-modules


    var preventOverflow$1 = {
      name: 'preventOverflow',
      enabled: true,
      phase: 'main',
      fn: preventOverflow,
      requiresIfExists: ['offset']
    };

    var toPaddingObject = function toPaddingObject(padding, state) {
      padding = typeof padding === 'function' ? padding(Object.assign({}, state.rects, {
        placement: state.placement
      })) : padding;
      return mergePaddingObject(typeof padding !== 'number' ? padding : expandToHashMap(padding, basePlacements));
    };

    function arrow(_ref) {
      var _state$modifiersData$;

      var state = _ref.state,
          name = _ref.name,
          options = _ref.options;
      var arrowElement = state.elements.arrow;
      var popperOffsets = state.modifiersData.popperOffsets;
      var basePlacement = getBasePlacement(state.placement);
      var axis = getMainAxisFromPlacement(basePlacement);
      var isVertical = [left, right].indexOf(basePlacement) >= 0;
      var len = isVertical ? 'height' : 'width';

      if (!arrowElement || !popperOffsets) {
        return;
      }

      var paddingObject = toPaddingObject(options.padding, state);
      var arrowRect = getLayoutRect(arrowElement);
      var minProp = axis === 'y' ? top : left;
      var maxProp = axis === 'y' ? bottom : right;
      var endDiff = state.rects.reference[len] + state.rects.reference[axis] - popperOffsets[axis] - state.rects.popper[len];
      var startDiff = popperOffsets[axis] - state.rects.reference[axis];
      var arrowOffsetParent = getOffsetParent(arrowElement);
      var clientSize = arrowOffsetParent ? axis === 'y' ? arrowOffsetParent.clientHeight || 0 : arrowOffsetParent.clientWidth || 0 : 0;
      var centerToReference = endDiff / 2 - startDiff / 2; // Make sure the arrow doesn't overflow the popper if the center point is
      // outside of the popper bounds

      var min = paddingObject[minProp];
      var max = clientSize - arrowRect[len] - paddingObject[maxProp];
      var center = clientSize / 2 - arrowRect[len] / 2 + centerToReference;
      var offset = within(min, center, max); // Prevents breaking syntax highlighting...

      var axisProp = axis;
      state.modifiersData[name] = (_state$modifiersData$ = {}, _state$modifiersData$[axisProp] = offset, _state$modifiersData$.centerOffset = offset - center, _state$modifiersData$);
    }

    function effect(_ref2) {
      var state = _ref2.state,
          options = _ref2.options;
      var _options$element = options.element,
          arrowElement = _options$element === void 0 ? '[data-popper-arrow]' : _options$element;

      if (arrowElement == null) {
        return;
      } // CSS selector


      if (typeof arrowElement === 'string') {
        arrowElement = state.elements.popper.querySelector(arrowElement);

        if (!arrowElement) {
          return;
        }
      }

      if (!contains(state.elements.popper, arrowElement)) {

        return;
      }

      state.elements.arrow = arrowElement;
    } // eslint-disable-next-line import/no-unused-modules


    var arrow$1 = {
      name: 'arrow',
      enabled: true,
      phase: 'main',
      fn: arrow,
      effect: effect,
      requires: ['popperOffsets'],
      requiresIfExists: ['preventOverflow']
    };

    function getSideOffsets(overflow, rect, preventedOffsets) {
      if (preventedOffsets === void 0) {
        preventedOffsets = {
          x: 0,
          y: 0
        };
      }

      return {
        top: overflow.top - rect.height - preventedOffsets.y,
        right: overflow.right - rect.width + preventedOffsets.x,
        bottom: overflow.bottom - rect.height + preventedOffsets.y,
        left: overflow.left - rect.width - preventedOffsets.x
      };
    }

    function isAnySideFullyClipped(overflow) {
      return [top, right, bottom, left].some(function (side) {
        return overflow[side] >= 0;
      });
    }

    function hide(_ref) {
      var state = _ref.state,
          name = _ref.name;
      var referenceRect = state.rects.reference;
      var popperRect = state.rects.popper;
      var preventedOffsets = state.modifiersData.preventOverflow;
      var referenceOverflow = detectOverflow(state, {
        elementContext: 'reference'
      });
      var popperAltOverflow = detectOverflow(state, {
        altBoundary: true
      });
      var referenceClippingOffsets = getSideOffsets(referenceOverflow, referenceRect);
      var popperEscapeOffsets = getSideOffsets(popperAltOverflow, popperRect, preventedOffsets);
      var isReferenceHidden = isAnySideFullyClipped(referenceClippingOffsets);
      var hasPopperEscaped = isAnySideFullyClipped(popperEscapeOffsets);
      state.modifiersData[name] = {
        referenceClippingOffsets: referenceClippingOffsets,
        popperEscapeOffsets: popperEscapeOffsets,
        isReferenceHidden: isReferenceHidden,
        hasPopperEscaped: hasPopperEscaped
      };
      state.attributes.popper = Object.assign({}, state.attributes.popper, {
        'data-popper-reference-hidden': isReferenceHidden,
        'data-popper-escaped': hasPopperEscaped
      });
    } // eslint-disable-next-line import/no-unused-modules


    var hide$1 = {
      name: 'hide',
      enabled: true,
      phase: 'main',
      requiresIfExists: ['preventOverflow'],
      fn: hide
    };

    var defaultModifiers = [eventListeners, popperOffsets$1, computeStyles$1, applyStyles$1, offset$1, flip$1, preventOverflow$1, arrow$1, hide$1];
    var createPopper = /*#__PURE__*/popperGenerator({
      defaultModifiers: defaultModifiers
    }); // eslint-disable-next-line import/no-unused-modules

    /* node_modules\sveltestrap\src\InlineContainer.svelte generated by Svelte v3.53.1 */

    const file$k = "node_modules\\sveltestrap\\src\\InlineContainer.svelte";

    function create_fragment$k(ctx) {
    	let div;
    	let current;
    	const default_slot_template = /*#slots*/ ctx[1].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[0], null);

    	const block = {
    		c: function create() {
    			div = element("div");
    			if (default_slot) default_slot.c();
    			add_location(div, file$k, 3, 0, 67);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);

    			if (default_slot) {
    				default_slot.m(div, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 1)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[0],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[0])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[0], dirty, null),
    						null
    					);
    				}
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
    			if (detaching) detach_dev(div);
    			if (default_slot) default_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$k.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$k($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('InlineContainer', slots, ['default']);
    	let x = 'wtf svelte?'; // eslint-disable-line
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<InlineContainer> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('$$scope' in $$props) $$invalidate(0, $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => ({ x });

    	$$self.$inject_state = $$props => {
    		if ('x' in $$props) x = $$props.x;
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [$$scope, slots];
    }

    class InlineContainer extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$k, create_fragment$k, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "InlineContainer",
    			options,
    			id: create_fragment$k.name
    		});
    	}
    }

    /* node_modules\sveltestrap\src\Portal.svelte generated by Svelte v3.53.1 */
    const file$j = "node_modules\\sveltestrap\\src\\Portal.svelte";

    function create_fragment$j(ctx) {
    	let div;
    	let current;
    	const default_slot_template = /*#slots*/ ctx[3].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[2], null);
    	let div_levels = [/*$$restProps*/ ctx[1]];
    	let div_data = {};

    	for (let i = 0; i < div_levels.length; i += 1) {
    		div_data = assign(div_data, div_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			div = element("div");
    			if (default_slot) default_slot.c();
    			set_attributes(div, div_data);
    			add_location(div, file$j, 18, 0, 346);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);

    			if (default_slot) {
    				default_slot.m(div, null);
    			}

    			/*div_binding*/ ctx[4](div);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 4)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[2],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[2])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[2], dirty, null),
    						null
    					);
    				}
    			}

    			set_attributes(div, div_data = get_spread_update(div_levels, [dirty & /*$$restProps*/ 2 && /*$$restProps*/ ctx[1]]));
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
    			if (detaching) detach_dev(div);
    			if (default_slot) default_slot.d(detaching);
    			/*div_binding*/ ctx[4](null);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$j.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$j($$self, $$props, $$invalidate) {
    	const omit_props_names = [];
    	let $$restProps = compute_rest_props($$props, omit_props_names);
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Portal', slots, ['default']);
    	let ref;
    	let portal;

    	onMount(() => {
    		portal = document.createElement('div');
    		document.body.appendChild(portal);
    		portal.appendChild(ref);
    	});

    	onDestroy(() => {
    		if (typeof document !== 'undefined') {
    			document.body.removeChild(portal);
    		}
    	});

    	function div_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			ref = $$value;
    			$$invalidate(0, ref);
    		});
    	}

    	$$self.$$set = $$new_props => {
    		$$props = assign(assign({}, $$props), exclude_internal_props($$new_props));
    		$$invalidate(1, $$restProps = compute_rest_props($$props, omit_props_names));
    		if ('$$scope' in $$new_props) $$invalidate(2, $$scope = $$new_props.$$scope);
    	};

    	$$self.$capture_state = () => ({ onMount, onDestroy, ref, portal });

    	$$self.$inject_state = $$new_props => {
    		if ('ref' in $$props) $$invalidate(0, ref = $$new_props.ref);
    		if ('portal' in $$props) portal = $$new_props.portal;
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [ref, $$restProps, $$scope, slots, div_binding];
    }

    class Portal extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$j, create_fragment$j, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Portal",
    			options,
    			id: create_fragment$j.name
    		});
    	}
    }

    /* node_modules\sveltestrap\src\Popover.svelte generated by Svelte v3.53.1 */

    const { Error: Error_1 } = globals;
    const file$i = "node_modules\\sveltestrap\\src\\Popover.svelte";
    const get_title_slot_changes = dirty => ({});
    const get_title_slot_context = ctx => ({});

    // (115:0) {#if isOpen}
    function create_if_block$b(ctx) {
    	let switch_instance;
    	let switch_instance_anchor;
    	let current;
    	var switch_value = /*outer*/ ctx[5];

    	function switch_props(ctx) {
    		return {
    			props: {
    				$$slots: { default: [create_default_slot$3] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		};
    	}

    	if (switch_value) {
    		switch_instance = construct_svelte_component_dev(switch_value, switch_props(ctx));
    	}

    	const block = {
    		c: function create() {
    			if (switch_instance) create_component(switch_instance.$$.fragment);
    			switch_instance_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if (switch_instance) mount_component(switch_instance, target, anchor);
    			insert_dev(target, switch_instance_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const switch_instance_changes = {};

    			if (dirty & /*$$scope, $$restProps, classes, popperPlacement, popoverEl, children, title*/ 1048798) {
    				switch_instance_changes.$$scope = { dirty, ctx };
    			}

    			if (switch_value !== (switch_value = /*outer*/ ctx[5])) {
    				if (switch_instance) {
    					group_outros();
    					const old_component = switch_instance;

    					transition_out(old_component.$$.fragment, 1, 0, () => {
    						destroy_component(old_component, 1);
    					});

    					check_outros();
    				}

    				if (switch_value) {
    					switch_instance = construct_svelte_component_dev(switch_value, switch_props(ctx));
    					create_component(switch_instance.$$.fragment);
    					transition_in(switch_instance.$$.fragment, 1);
    					mount_component(switch_instance, switch_instance_anchor.parentNode, switch_instance_anchor);
    				} else {
    					switch_instance = null;
    				}
    			} else if (switch_value) {
    				switch_instance.$set(switch_instance_changes);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			if (switch_instance) transition_in(switch_instance.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			if (switch_instance) transition_out(switch_instance.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(switch_instance_anchor);
    			if (switch_instance) destroy_component(switch_instance, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$b.name,
    		type: "if",
    		source: "(115:0) {#if isOpen}",
    		ctx
    	});

    	return block;
    }

    // (126:27) {title}
    function fallback_block(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text(/*title*/ ctx[2]);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*title*/ 4) set_data_dev(t, /*title*/ ctx[2]);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: fallback_block.name,
    		type: "fallback",
    		source: "(126:27) {title}",
    		ctx
    	});

    	return block;
    }

    // (131:8) {:else}
    function create_else_block$4(ctx) {
    	let current;
    	const default_slot_template = /*#slots*/ ctx[18].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[20], null);

    	const block = {
    		c: function create() {
    			if (default_slot) default_slot.c();
    		},
    		m: function mount(target, anchor) {
    			if (default_slot) {
    				default_slot.m(target, anchor);
    			}

    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 1048576)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[20],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[20])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[20], dirty, null),
    						null
    					);
    				}
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
    			if (default_slot) default_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$4.name,
    		type: "else",
    		source: "(131:8) {:else}",
    		ctx
    	});

    	return block;
    }

    // (129:8) {#if children}
    function create_if_block_1$8(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text(/*children*/ ctx[1]);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*children*/ 2) set_data_dev(t, /*children*/ ctx[1]);
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$8.name,
    		type: "if",
    		source: "(129:8) {#if children}",
    		ctx
    	});

    	return block;
    }

    // (116:2) <svelte:component this={outer}>
    function create_default_slot$3(ctx) {
    	let div2;
    	let div0;
    	let t0;
    	let h3;
    	let t1;
    	let div1;
    	let current_block_type_index;
    	let if_block;
    	let current;
    	const title_slot_template = /*#slots*/ ctx[18].title;
    	const title_slot = create_slot(title_slot_template, ctx, /*$$scope*/ ctx[20], get_title_slot_context);
    	const title_slot_or_fallback = title_slot || fallback_block(ctx);
    	const if_block_creators = [create_if_block_1$8, create_else_block$4];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*children*/ ctx[1]) return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type(ctx);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	let div2_levels = [
    		/*$$restProps*/ ctx[7],
    		{ class: /*classes*/ ctx[6] },
    		{ role: "tooltip" },
    		{
    			"x-placement": /*popperPlacement*/ ctx[4]
    		}
    	];

    	let div2_data = {};

    	for (let i = 0; i < div2_levels.length; i += 1) {
    		div2_data = assign(div2_data, div2_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			div2 = element("div");
    			div0 = element("div");
    			t0 = space();
    			h3 = element("h3");
    			if (title_slot_or_fallback) title_slot_or_fallback.c();
    			t1 = space();
    			div1 = element("div");
    			if_block.c();
    			attr_dev(div0, "class", "popover-arrow");
    			attr_dev(div0, "data-popper-arrow", "");
    			add_location(div0, file$i, 123, 6, 3186);
    			attr_dev(h3, "class", "popover-header");
    			add_location(h3, file$i, 124, 6, 3240);
    			attr_dev(div1, "class", "popover-body");
    			add_location(div1, file$i, 127, 6, 3328);
    			set_attributes(div2, div2_data);
    			add_location(div2, file$i, 116, 4, 3039);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div2, anchor);
    			append_dev(div2, div0);
    			append_dev(div2, t0);
    			append_dev(div2, h3);

    			if (title_slot_or_fallback) {
    				title_slot_or_fallback.m(h3, null);
    			}

    			append_dev(div2, t1);
    			append_dev(div2, div1);
    			if_blocks[current_block_type_index].m(div1, null);
    			/*div2_binding*/ ctx[19](div2);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (title_slot) {
    				if (title_slot.p && (!current || dirty & /*$$scope*/ 1048576)) {
    					update_slot_base(
    						title_slot,
    						title_slot_template,
    						ctx,
    						/*$$scope*/ ctx[20],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[20])
    						: get_slot_changes(title_slot_template, /*$$scope*/ ctx[20], dirty, get_title_slot_changes),
    						get_title_slot_context
    					);
    				}
    			} else {
    				if (title_slot_or_fallback && title_slot_or_fallback.p && (!current || dirty & /*title*/ 4)) {
    					title_slot_or_fallback.p(ctx, !current ? -1 : dirty);
    				}
    			}

    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if_blocks[current_block_type_index].p(ctx, dirty);
    			} else {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block = if_blocks[current_block_type_index];

    				if (!if_block) {
    					if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block.c();
    				} else {
    					if_block.p(ctx, dirty);
    				}

    				transition_in(if_block, 1);
    				if_block.m(div1, null);
    			}

    			set_attributes(div2, div2_data = get_spread_update(div2_levels, [
    				dirty & /*$$restProps*/ 128 && /*$$restProps*/ ctx[7],
    				(!current || dirty & /*classes*/ 64) && { class: /*classes*/ ctx[6] },
    				{ role: "tooltip" },
    				(!current || dirty & /*popperPlacement*/ 16) && {
    					"x-placement": /*popperPlacement*/ ctx[4]
    				}
    			]));
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(title_slot_or_fallback, local);
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(title_slot_or_fallback, local);
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div2);
    			if (title_slot_or_fallback) title_slot_or_fallback.d(detaching);
    			if_blocks[current_block_type_index].d();
    			/*div2_binding*/ ctx[19](null);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$3.name,
    		type: "slot",
    		source: "(116:2) <svelte:component this={outer}>",
    		ctx
    	});

    	return block;
    }

    function create_fragment$i(ctx) {
    	let if_block_anchor;
    	let current;
    	let if_block = /*isOpen*/ ctx[0] && create_if_block$b(ctx);

    	const block = {
    		c: function create() {
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    		},
    		l: function claim(nodes) {
    			throw new Error_1("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (/*isOpen*/ ctx[0]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);

    					if (dirty & /*isOpen*/ 1) {
    						transition_in(if_block, 1);
    					}
    				} else {
    					if_block = create_if_block$b(ctx);
    					if_block.c();
    					transition_in(if_block, 1);
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			} else if (if_block) {
    				group_outros();

    				transition_out(if_block, 1, 1, () => {
    					if_block = null;
    				});

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$i.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$i($$self, $$props, $$invalidate) {
    	let classes;
    	let outer;

    	const omit_props_names = [
    		"class","animation","children","container","dismissible","isOpen","placement","target","title","trigger"
    	];

    	let $$restProps = compute_rest_props($$props, omit_props_names);
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Popover', slots, ['title','default']);
    	let { class: className = '' } = $$props;
    	let { animation = true } = $$props;
    	let { children = undefined } = $$props;
    	let { container = undefined } = $$props;
    	let { dismissible = false } = $$props;
    	let { isOpen = false } = $$props;
    	let { placement = 'top' } = $$props;
    	let { target = '' } = $$props;
    	let { title = '' } = $$props;
    	let { trigger = 'click' } = $$props;
    	let targetEl;
    	let popoverEl;
    	let popperInstance;
    	let bsPlacement;
    	let popperPlacement = placement;

    	const checkPopperPlacement = {
    		name: 'checkPopperPlacement',
    		enabled: true,
    		phase: 'main',
    		fn({ state }) {
    			$$invalidate(4, popperPlacement = state.placement);
    		}
    	};

    	const open = () => $$invalidate(0, isOpen = true);
    	const close = () => $$invalidate(0, isOpen = false);
    	const toggle = () => $$invalidate(0, isOpen = !isOpen);

    	onMount(() => {
    		$$invalidate(15, targetEl = document.querySelector(`#${target}`));

    		switch (trigger) {
    			case 'hover':
    				targetEl.addEventListener('mouseover', open);
    				targetEl.addEventListener('mouseleave', close);
    				break;
    			case 'focus':
    				targetEl.addEventListener('focus', open);
    				targetEl.addEventListener('blur', close);
    				break;
    			default:
    				targetEl.addEventListener('click', toggle);
    				if (dismissible) targetEl.addEventListener('blur', close);
    				break;
    		}

    		return () => {
    			switch (trigger) {
    				case 'hover':
    					targetEl.removeEventListener('mouseover', open);
    					targetEl.removeEventListener('mouseleave', close);
    					break;
    				case 'focus':
    					targetEl.removeEventListener('focus', open);
    					targetEl.removeEventListener('blur', close);
    					break;
    				default:
    					targetEl.removeEventListener('click', toggle);
    					if (dismissible) targetEl.removeEventListener('blur', close);
    					break;
    			}
    		};
    	});

    	function div2_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			popoverEl = $$value;
    			$$invalidate(3, popoverEl);
    		});
    	}

    	$$self.$$set = $$new_props => {
    		$$props = assign(assign({}, $$props), exclude_internal_props($$new_props));
    		$$invalidate(7, $$restProps = compute_rest_props($$props, omit_props_names));
    		if ('class' in $$new_props) $$invalidate(8, className = $$new_props.class);
    		if ('animation' in $$new_props) $$invalidate(9, animation = $$new_props.animation);
    		if ('children' in $$new_props) $$invalidate(1, children = $$new_props.children);
    		if ('container' in $$new_props) $$invalidate(10, container = $$new_props.container);
    		if ('dismissible' in $$new_props) $$invalidate(11, dismissible = $$new_props.dismissible);
    		if ('isOpen' in $$new_props) $$invalidate(0, isOpen = $$new_props.isOpen);
    		if ('placement' in $$new_props) $$invalidate(12, placement = $$new_props.placement);
    		if ('target' in $$new_props) $$invalidate(13, target = $$new_props.target);
    		if ('title' in $$new_props) $$invalidate(2, title = $$new_props.title);
    		if ('trigger' in $$new_props) $$invalidate(14, trigger = $$new_props.trigger);
    		if ('$$scope' in $$new_props) $$invalidate(20, $$scope = $$new_props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		onMount,
    		createPopper,
    		classnames,
    		InlineContainer,
    		Portal,
    		className,
    		animation,
    		children,
    		container,
    		dismissible,
    		isOpen,
    		placement,
    		target,
    		title,
    		trigger,
    		targetEl,
    		popoverEl,
    		popperInstance,
    		bsPlacement,
    		popperPlacement,
    		checkPopperPlacement,
    		open,
    		close,
    		toggle,
    		outer,
    		classes
    	});

    	$$self.$inject_state = $$new_props => {
    		if ('className' in $$props) $$invalidate(8, className = $$new_props.className);
    		if ('animation' in $$props) $$invalidate(9, animation = $$new_props.animation);
    		if ('children' in $$props) $$invalidate(1, children = $$new_props.children);
    		if ('container' in $$props) $$invalidate(10, container = $$new_props.container);
    		if ('dismissible' in $$props) $$invalidate(11, dismissible = $$new_props.dismissible);
    		if ('isOpen' in $$props) $$invalidate(0, isOpen = $$new_props.isOpen);
    		if ('placement' in $$props) $$invalidate(12, placement = $$new_props.placement);
    		if ('target' in $$props) $$invalidate(13, target = $$new_props.target);
    		if ('title' in $$props) $$invalidate(2, title = $$new_props.title);
    		if ('trigger' in $$props) $$invalidate(14, trigger = $$new_props.trigger);
    		if ('targetEl' in $$props) $$invalidate(15, targetEl = $$new_props.targetEl);
    		if ('popoverEl' in $$props) $$invalidate(3, popoverEl = $$new_props.popoverEl);
    		if ('popperInstance' in $$props) $$invalidate(16, popperInstance = $$new_props.popperInstance);
    		if ('bsPlacement' in $$props) $$invalidate(17, bsPlacement = $$new_props.bsPlacement);
    		if ('popperPlacement' in $$props) $$invalidate(4, popperPlacement = $$new_props.popperPlacement);
    		if ('outer' in $$props) $$invalidate(5, outer = $$new_props.outer);
    		if ('classes' in $$props) $$invalidate(6, classes = $$new_props.classes);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*isOpen, popoverEl, targetEl, placement, popperInstance*/ 102409) {
    			{
    				if (isOpen && popoverEl) {
    					$$invalidate(16, popperInstance = createPopper(targetEl, popoverEl, {
    						placement,
    						modifiers: [
    							checkPopperPlacement,
    							{
    								name: 'offset',
    								options: {
    									offset: () => {
    										return [0, 8];
    									}
    								}
    							}
    						]
    					}));
    				} else if (popperInstance) {
    					popperInstance.destroy();
    					$$invalidate(16, popperInstance = undefined);
    				}
    			}
    		}

    		if ($$self.$$.dirty & /*target*/ 8192) {
    			if (!target) {
    				throw new Error('Need target!');
    			}
    		}

    		if ($$self.$$.dirty & /*popperPlacement*/ 16) {
    			{
    				if (popperPlacement === 'left') $$invalidate(17, bsPlacement = 'start'); else if (popperPlacement === 'right') $$invalidate(17, bsPlacement = 'end'); else $$invalidate(17, bsPlacement = popperPlacement);
    			}
    		}

    		if ($$self.$$.dirty & /*className, animation, bsPlacement, isOpen*/ 131841) {
    			$$invalidate(6, classes = classnames(className, 'popover', animation ? 'fade' : false, `bs-popover-${bsPlacement}`, isOpen ? 'show' : false));
    		}

    		if ($$self.$$.dirty & /*container*/ 1024) {
    			$$invalidate(5, outer = container === 'inline' ? InlineContainer : Portal);
    		}
    	};

    	return [
    		isOpen,
    		children,
    		title,
    		popoverEl,
    		popperPlacement,
    		outer,
    		classes,
    		$$restProps,
    		className,
    		animation,
    		container,
    		dismissible,
    		placement,
    		target,
    		trigger,
    		targetEl,
    		popperInstance,
    		bsPlacement,
    		slots,
    		div2_binding,
    		$$scope
    	];
    }

    class Popover extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$i, create_fragment$i, safe_not_equal, {
    			class: 8,
    			animation: 9,
    			children: 1,
    			container: 10,
    			dismissible: 11,
    			isOpen: 0,
    			placement: 12,
    			target: 13,
    			title: 2,
    			trigger: 14
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Popover",
    			options,
    			id: create_fragment$i.name
    		});
    	}

    	get class() {
    		throw new Error_1("<Popover>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set class(value) {
    		throw new Error_1("<Popover>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get animation() {
    		throw new Error_1("<Popover>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set animation(value) {
    		throw new Error_1("<Popover>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get children() {
    		throw new Error_1("<Popover>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set children(value) {
    		throw new Error_1("<Popover>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get container() {
    		throw new Error_1("<Popover>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set container(value) {
    		throw new Error_1("<Popover>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get dismissible() {
    		throw new Error_1("<Popover>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set dismissible(value) {
    		throw new Error_1("<Popover>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get isOpen() {
    		throw new Error_1("<Popover>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set isOpen(value) {
    		throw new Error_1("<Popover>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get placement() {
    		throw new Error_1("<Popover>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set placement(value) {
    		throw new Error_1("<Popover>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get target() {
    		throw new Error_1("<Popover>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set target(value) {
    		throw new Error_1("<Popover>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get title() {
    		throw new Error_1("<Popover>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set title(value) {
    		throw new Error_1("<Popover>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get trigger() {
    		throw new Error_1("<Popover>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set trigger(value) {
    		throw new Error_1("<Popover>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    const storedQuiz = localStorage.getItem("quiz");
    const quiz = writable(storedQuiz || 'null');
    quiz.subscribe(value => {
        localStorage.setItem("quiz", value);
    });

    /* src\component\quiz\Leaderboard.svelte generated by Svelte v3.53.1 */
    const file$h = "src\\component\\quiz\\Leaderboard.svelte";

    function get_each_context$a(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[10] = list[i];
    	child_ctx[12] = i;
    	return child_ctx;
    }

    // (89:0) {#if isReady}
    function create_if_block$a(ctx) {
    	let div11;
    	let div10;
    	let div1;
    	let div0;
    	let t1;
    	let div9;
    	let div2;
    	let each_blocks = [];
    	let each_1_lookup = new Map();
    	let t2;
    	let div8;
    	let div3;
    	let t4;
    	let div4;
    	let t6;
    	let div5;
    	let t7;
    	let t8;
    	let div6;
    	let t10;
    	let t11;
    	let div7;
    	let button;
    	let t12;
    	let i;
    	let mounted;
    	let dispose;
    	let each_value = /*myRank*/ ctx[2];
    	validate_each_argument(each_value);
    	const get_key = ctx => /*index*/ ctx[12];
    	validate_each_keys(ctx, each_value, get_each_context$a, get_key);

    	for (let i = 0; i < each_value.length; i += 1) {
    		let child_ctx = get_each_context$a(ctx, each_value, i);
    		let key = get_key(child_ctx);
    		each_1_lookup.set(key, each_blocks[i] = create_each_block$a(key, child_ctx));
    	}

    	let if_block = /*local*/ ctx[5].islogged && create_if_block_1$7(ctx);

    	const block = {
    		c: function create() {
    			div11 = element("div");
    			div10 = element("div");
    			div1 = element("div");
    			div0 = element("div");
    			div0.textContent = "LEADERBOARD";
    			t1 = space();
    			div9 = element("div");
    			div2 = element("div");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t2 = space();
    			div8 = element("div");
    			div3 = element("div");
    			div3.textContent = "CONGRATS!!";
    			t4 = space();
    			div4 = element("div");
    			div4.textContent = "YOU MADE";
    			t6 = space();
    			div5 = element("div");
    			t7 = text(/*score*/ ctx[0]);
    			t8 = space();
    			div6 = element("div");
    			div6.textContent = "POINTS";
    			t10 = space();
    			if (if_block) if_block.c();
    			t11 = space();
    			div7 = element("div");
    			button = element("button");
    			t12 = text("RESTART");
    			i = element("i");
    			set_style(div0, "font-weight", "800");
    			set_style(div0, "color", "white");
    			set_style(div0, "font-size", "180%");
    			add_location(div0, file$h, 92, 16, 3200);
    			set_style(div1, "width", "100%");
    			set_style(div1, "background-color", "#1a2238");
    			set_style(div1, "text-align", "center");
    			set_style(div1, "height", "13%");
    			set_style(div1, "display", "flex");
    			set_style(div1, "justify-content", "center");
    			set_style(div1, "align-items", "center");
    			add_location(div1, file$h, 91, 12, 3042);
    			attr_dev(div2, "class", "ranking flex svelte-1xa5m5j");
    			toggle_class(div2, "width100", /*screenWidth*/ ctx[1] < 500);
    			toggle_class(div2, "rankmob", /*screenWidth*/ ctx[1] < 500);
    			add_location(div2, file$h, 95, 16, 3397);
    			set_style(div3, "width", "100%");
    			set_style(div3, "text-align", "center");
    			set_style(div3, "font-size", "180%");
    			set_style(div3, "font-weight", "600");
    			add_location(div3, file$h, 107, 20, 4183);
    			set_style(div4, "width", "100%");
    			set_style(div4, "text-align", "center");
    			set_style(div4, "font-size", "140%");
    			set_style(div4, "font-weight", "600");
    			add_location(div4, file$h, 108, 20, 4297);
    			set_style(div5, "width", "100%");
    			set_style(div5, "text-align", "center");
    			set_style(div5, "font-size", "280%");
    			set_style(div5, "font-weight", "800");
    			add_location(div5, file$h, 109, 20, 4409);
    			set_style(div6, "width", "100%");
    			set_style(div6, "text-align", "center");
    			set_style(div6, "font-size", "150%");
    			set_style(div6, "font-weight", "600");
    			add_location(div6, file$h, 110, 20, 4520);
    			attr_dev(i, "class", "bi-arrow-clockwise");
    			add_location(i, file$h, 116, 148, 5150);
    			set_style(button, "border-radius", "10px");
    			set_style(button, "margin-top", "20px");
    			set_style(button, "border", "3px solid black");
    			add_location(button, file$h, 116, 24, 5026);
    			set_style(div7, "width", "100%");
    			set_style(div7, "text-align", "center");
    			add_location(div7, file$h, 115, 20, 4956);
    			attr_dev(div8, "class", "score svelte-1xa5m5j");
    			toggle_class(div8, "width100", /*screenWidth*/ ctx[1] < 500);
    			toggle_class(div8, "scoremob", /*screenWidth*/ ctx[1] < 500);
    			add_location(div8, file$h, 106, 16, 4076);
    			attr_dev(div9, "class", "flex svelte-1xa5m5j");
    			set_style(div9, "height", "87%");
    			toggle_class(div9, "insmob", /*screenWidth*/ ctx[1] < 500);
    			add_location(div9, file$h, 94, 12, 3311);
    			attr_dev(div10, "class", "leaderboard svelte-1xa5m5j");
    			toggle_class(div10, "mobile", /*screenWidth*/ ctx[1] < 500);
    			add_location(div10, file$h, 90, 8, 2972);
    			set_style(div11, "width", "100%");
    			set_style(div11, "height", "100%");
    			set_style(div11, "display", "flex");
    			set_style(div11, "justify-content", "center");
    			set_style(div11, "align-items", "center");
    			add_location(div11, file$h, 89, 4, 2867);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div11, anchor);
    			append_dev(div11, div10);
    			append_dev(div10, div1);
    			append_dev(div1, div0);
    			append_dev(div10, t1);
    			append_dev(div10, div9);
    			append_dev(div9, div2);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(div2, null);
    			}

    			append_dev(div9, t2);
    			append_dev(div9, div8);
    			append_dev(div8, div3);
    			append_dev(div8, t4);
    			append_dev(div8, div4);
    			append_dev(div8, t6);
    			append_dev(div8, div5);
    			append_dev(div5, t7);
    			append_dev(div8, t8);
    			append_dev(div8, div6);
    			append_dev(div8, t10);
    			if (if_block) if_block.m(div8, null);
    			append_dev(div8, t11);
    			append_dev(div8, div7);
    			append_dev(div7, button);
    			append_dev(button, t12);
    			append_dev(button, i);

    			if (!mounted) {
    				dispose = listen_dev(button, "click", /*click_handler*/ ctx[7], false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*myRank*/ 4) {
    				each_value = /*myRank*/ ctx[2];
    				validate_each_argument(each_value);
    				validate_each_keys(ctx, each_value, get_each_context$a, get_key);
    				each_blocks = update_keyed_each(each_blocks, dirty, get_key, 1, ctx, each_value, each_1_lookup, div2, destroy_block, create_each_block$a, null, get_each_context$a);
    			}

    			if (dirty & /*screenWidth*/ 2) {
    				toggle_class(div2, "width100", /*screenWidth*/ ctx[1] < 500);
    			}

    			if (dirty & /*screenWidth*/ 2) {
    				toggle_class(div2, "rankmob", /*screenWidth*/ ctx[1] < 500);
    			}

    			if (dirty & /*score*/ 1) set_data_dev(t7, /*score*/ ctx[0]);
    			if (/*local*/ ctx[5].islogged) if_block.p(ctx, dirty);

    			if (dirty & /*screenWidth*/ 2) {
    				toggle_class(div8, "width100", /*screenWidth*/ ctx[1] < 500);
    			}

    			if (dirty & /*screenWidth*/ 2) {
    				toggle_class(div8, "scoremob", /*screenWidth*/ ctx[1] < 500);
    			}

    			if (dirty & /*screenWidth*/ 2) {
    				toggle_class(div9, "insmob", /*screenWidth*/ ctx[1] < 500);
    			}

    			if (dirty & /*screenWidth*/ 2) {
    				toggle_class(div10, "mobile", /*screenWidth*/ ctx[1] < 500);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div11);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].d();
    			}

    			if (if_block) if_block.d();
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$a.name,
    		type: "if",
    		source: "(89:0) {#if isReady}",
    		ctx
    	});

    	return block;
    }

    // (97:20) {#each myRank as rank, index (index)}
    function create_each_block$a(key_1, ctx) {
    	let div4;
    	let div0;
    	let t0_value = /*index*/ ctx[12] + 1 + "";
    	let t0;
    	let div0_id_value;
    	let t1;
    	let div3;
    	let div1;
    	let t2_value = /*rank*/ ctx[10].score + "";
    	let t2;
    	let t3;
    	let div2;
    	let t4_value = /*rank*/ ctx[10].username + "";
    	let t4;
    	let t5;

    	const block = {
    		key: key_1,
    		first: null,
    		c: function create() {
    			div4 = element("div");
    			div0 = element("div");
    			t0 = text(t0_value);
    			t1 = space();
    			div3 = element("div");
    			div1 = element("div");
    			t2 = text(t2_value);
    			t3 = space();
    			div2 = element("div");
    			t4 = text(t4_value);
    			t5 = space();
    			attr_dev(div0, "id", div0_id_value = "pos" + (/*index*/ ctx[12] + 1));
    			attr_dev(div0, "class", "position svelte-1xa5m5j");
    			add_location(div0, file$h, 98, 28, 3636);
    			set_style(div1, "font-weight", "800");
    			set_style(div1, "text-align", "center");
    			set_style(div1, "font-size", "140%");
    			add_location(div1, file$h, 100, 32, 3766);
    			set_style(div2, "text-align", "center");
    			add_location(div2, file$h, 101, 32, 3883);
    			add_location(div3, file$h, 99, 28, 3727);
    			attr_dev(div4, "class", "flex rank container svelte-1xa5m5j");
    			add_location(div4, file$h, 97, 24, 3573);
    			this.first = div4;
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div4, anchor);
    			append_dev(div4, div0);
    			append_dev(div0, t0);
    			append_dev(div4, t1);
    			append_dev(div4, div3);
    			append_dev(div3, div1);
    			append_dev(div1, t2);
    			append_dev(div3, t3);
    			append_dev(div3, div2);
    			append_dev(div2, t4);
    			append_dev(div4, t5);
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			if (dirty & /*myRank*/ 4 && t0_value !== (t0_value = /*index*/ ctx[12] + 1 + "")) set_data_dev(t0, t0_value);

    			if (dirty & /*myRank*/ 4 && div0_id_value !== (div0_id_value = "pos" + (/*index*/ ctx[12] + 1))) {
    				attr_dev(div0, "id", div0_id_value);
    			}

    			if (dirty & /*myRank*/ 4 && t2_value !== (t2_value = /*rank*/ ctx[10].score + "")) set_data_dev(t2, t2_value);
    			if (dirty & /*myRank*/ 4 && t4_value !== (t4_value = /*rank*/ ctx[10].username + "")) set_data_dev(t4, t4_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div4);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$a.name,
    		type: "each",
    		source: "(97:20) {#each myRank as rank, index (index)}",
    		ctx
    	});

    	return block;
    }

    // (112:20) {#if local.islogged}
    function create_if_block_1$7(ctx) {
    	let div0;
    	let t1;
    	let div1;
    	let t2_value = /*user*/ ctx[4].score + "";
    	let t2;
    	let t3;

    	const block = {
    		c: function create() {
    			div0 = element("div");
    			div0.textContent = "YOUR HIGHEST SCORE WAS";
    			t1 = space();
    			div1 = element("div");
    			t2 = text(t2_value);
    			t3 = text(" POINTS");
    			set_style(div0, "width", "100%");
    			set_style(div0, "text-align", "center");
    			set_style(div0, "font-size", "140%");
    			set_style(div0, "font-weight", "600");
    			add_location(div0, file$h, 112, 24, 4676);
    			set_style(div1, "width", "100%");
    			set_style(div1, "text-align", "center");
    			set_style(div1, "font-size", "140%");
    			set_style(div1, "font-weight", "600");
    			add_location(div1, file$h, 113, 24, 4806);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div0, anchor);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, div1, anchor);
    			append_dev(div1, t2);
    			append_dev(div1, t3);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*user*/ 16 && t2_value !== (t2_value = /*user*/ ctx[4].score + "")) set_data_dev(t2, t2_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div0);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(div1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$7.name,
    		type: "if",
    		source: "(112:20) {#if local.islogged}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$h(ctx) {
    	let if_block_anchor;
    	let if_block = /*isReady*/ ctx[3] && create_if_block$a(ctx);

    	const block = {
    		c: function create() {
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    		},
    		p: function update(ctx, [dirty]) {
    			if (/*isReady*/ ctx[3]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block$a(ctx);
    					if_block.c();
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$h.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$h($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Leaderboard', slots, []);
    	let { score } = $$props;
    	var screenWidth = window.innerWidth;

    	window.addEventListener("resize", function (event) {
    		$$invalidate(1, screenWidth = window.innerWidth);
    	});

    	var myRank;
    	var isReady = false;

    	fetch('/db/collection?collection=users', { method: 'GET' }).then(response => response.json()).then(data => {
    		$$invalidate(2, myRank = data.result);
    		$$invalidate(2, myRank = myRank.sort((r1, r2) => r1.score < r2.score ? 1 : r1.score > r2.score ? -1 : 0));
    	});

    	var user;
    	let local = JSON.parse(localStorage.getItem("login"));

    	if (local.islogged) {
    		fetch('/db/element?id=' + local.id + '&collection=users', { method: 'GET' }).then(response => response.json()).then(data => {
    			$$invalidate(4, user = data.result);
    		});
    	}

    	const setRankingsColor = () => {
    		tick().then(() => {
    			if (document.getElementById('pos1')) document.getElementById('pos1').style.backgroundColor = "gold";
    			if (document.getElementById('pos2')) document.getElementById('pos2').style.backgroundColor = "silver";
    			if (document.getElementById('pos3')) document.getElementById('pos3').style.backgroundColor = "#CD7F32";
    		});
    	};

    	const sendScore = () => {
    		if (local.islogged && user.score < score) {
    			let obj = {
    				collection: 'users',
    				elem: {
    					"_id": user._id,
    					"name": user.name,
    					"username": user.username,
    					"email": user.email,
    					"password": user.password,
    					"favorites": user.favorites,
    					"pets": user.pets,
    					score,
    					"admin": user.admin
    				}
    			};

    			fetch('/db/element', {
    				method: 'PUT',
    				headers: {
    					'Content-type': 'application/json',
    					'Accept': 'application/json'
    				},
    				body: JSON.stringify(obj)
    			}).then(() => {
    				fetch('/db/collection?collection=users', { method: 'GET' }).then(response => response.json()).then(data => {
    					$$invalidate(2, myRank = data.result);
    					$$invalidate(2, myRank = myRank.sort((r1, r2) => r1.score < r2.score ? 1 : r1.score > r2.score ? -1 : 0));
    				});
    			});
    		}
    	};

    	setTimeout(
    		function () {
    			sendScore();
    			$$invalidate(3, isReady = true);
    			setRankingsColor();
    		},
    		2000
    	);

    	const dispatch = createEventDispatcher();

    	$$self.$$.on_mount.push(function () {
    		if (score === undefined && !('score' in $$props || $$self.$$.bound[$$self.$$.props['score']])) {
    			console.warn("<Leaderboard> was created without expected prop 'score'");
    		}
    	});

    	const writable_props = ['score'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Leaderboard> was created with unknown prop '${key}'`);
    	});

    	const click_handler = () => dispatch("replay", {});

    	$$self.$$set = $$props => {
    		if ('score' in $$props) $$invalidate(0, score = $$props.score);
    	};

    	$$self.$capture_state = () => ({
    		tick,
    		score,
    		createEventDispatcher,
    		screenWidth,
    		myRank,
    		isReady,
    		user,
    		local,
    		setRankingsColor,
    		sendScore,
    		dispatch
    	});

    	$$self.$inject_state = $$props => {
    		if ('score' in $$props) $$invalidate(0, score = $$props.score);
    		if ('screenWidth' in $$props) $$invalidate(1, screenWidth = $$props.screenWidth);
    		if ('myRank' in $$props) $$invalidate(2, myRank = $$props.myRank);
    		if ('isReady' in $$props) $$invalidate(3, isReady = $$props.isReady);
    		if ('user' in $$props) $$invalidate(4, user = $$props.user);
    		if ('local' in $$props) $$invalidate(5, local = $$props.local);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [score, screenWidth, myRank, isReady, user, local, dispatch, click_handler];
    }

    class Leaderboard extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$h, create_fragment$h, safe_not_equal, { score: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Leaderboard",
    			options,
    			id: create_fragment$h.name
    		});
    	}

    	get score() {
    		throw new Error("<Leaderboard>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set score(value) {
    		throw new Error("<Leaderboard>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\component\quiz\Quiz.svelte generated by Svelte v3.53.1 */
    const file$g = "src\\component\\quiz\\Quiz.svelte";

    // (135:8) {:else}
    function create_else_block$3(ctx) {
    	let button;
    	let i;
    	let t0;
    	let popover;
    	let t1;
    	let question;
    	let updating_questionCategory;
    	let t2;
    	let answers_1;
    	let updating_pointsModifier;
    	let updating_wrongAnswers;
    	let updating_correctAnswerPosition;
    	let current;

    	popover = new Popover({
    			props: {
    				placement: "left",
    				target: "info",
    				$$slots: {
    					title: [create_title_slot$2],
    					default: [create_default_slot$2]
    				},
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	function question_questionCategory_binding(value) {
    		/*question_questionCategory_binding*/ ctx[14](value);
    	}

    	let question_props = { quizReady: /*quizReady*/ ctx[2] };

    	if (/*questionCategory*/ ctx[0] !== void 0) {
    		question_props.questionCategory = /*questionCategory*/ ctx[0];
    	}

    	question = new Question({ props: question_props, $$inline: true });
    	binding_callbacks.push(() => bind(question, 'questionCategory', question_questionCategory_binding));
    	/*question_binding*/ ctx[15](question);

    	function answers_1_pointsModifier_binding(value) {
    		/*answers_1_pointsModifier_binding*/ ctx[17](value);
    	}

    	function answers_1_wrongAnswers_binding(value) {
    		/*answers_1_wrongAnswers_binding*/ ctx[18](value);
    	}

    	function answers_1_correctAnswerPosition_binding(value) {
    		/*answers_1_correctAnswerPosition_binding*/ ctx[19](value);
    	}

    	let answers_1_props = {
    		questionCategory: /*questionCategory*/ ctx[0],
    		correctAnswer: /*correctAnswer*/ ctx[1],
    		quizReady: /*quizReady*/ ctx[2]
    	};

    	if (/*pointsModifier*/ ctx[6] !== void 0) {
    		answers_1_props.pointsModifier = /*pointsModifier*/ ctx[6];
    	}

    	if (/*answers*/ ctx[8] !== void 0) {
    		answers_1_props.wrongAnswers = /*answers*/ ctx[8];
    	}

    	if (/*correctAnswerPosition*/ ctx[7] !== void 0) {
    		answers_1_props.correctAnswerPosition = /*correctAnswerPosition*/ ctx[7];
    	}

    	answers_1 = new Answers({ props: answers_1_props, $$inline: true });
    	/*answers_1_binding*/ ctx[16](answers_1);
    	binding_callbacks.push(() => bind(answers_1, 'pointsModifier', answers_1_pointsModifier_binding));
    	binding_callbacks.push(() => bind(answers_1, 'wrongAnswers', answers_1_wrongAnswers_binding));
    	binding_callbacks.push(() => bind(answers_1, 'correctAnswerPosition', answers_1_correctAnswerPosition_binding));
    	answers_1.$on("answerChoosen", /*updateScore*/ ctx[13]);

    	const block = {
    		c: function create() {
    			button = element("button");
    			i = element("i");
    			t0 = space();
    			create_component(popover.$$.fragment);
    			t1 = space();
    			create_component(question.$$.fragment);
    			t2 = space();
    			create_component(answers_1.$$.fragment);
    			attr_dev(i, "class", "bi-info-circle svelte-l2fjba");
    			toggle_class(i, "imob", /*screenWidth*/ ctx[11] < 500);
    			add_location(i, file$g, 135, 30, 4443);
    			attr_dev(button, "id", "info");
    			attr_dev(button, "class", "svelte-l2fjba");
    			add_location(button, file$g, 135, 12, 4425);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, button, anchor);
    			append_dev(button, i);
    			insert_dev(target, t0, anchor);
    			mount_component(popover, target, anchor);
    			insert_dev(target, t1, anchor);
    			mount_component(question, target, anchor);
    			insert_dev(target, t2, anchor);
    			mount_component(answers_1, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (!current || dirty & /*screenWidth*/ 2048) {
    				toggle_class(i, "imob", /*screenWidth*/ ctx[11] < 500);
    			}

    			const popover_changes = {};

    			if (dirty & /*$$scope*/ 134217728) {
    				popover_changes.$$scope = { dirty, ctx };
    			}

    			popover.$set(popover_changes);
    			const question_changes = {};
    			if (dirty & /*quizReady*/ 4) question_changes.quizReady = /*quizReady*/ ctx[2];

    			if (!updating_questionCategory && dirty & /*questionCategory*/ 1) {
    				updating_questionCategory = true;
    				question_changes.questionCategory = /*questionCategory*/ ctx[0];
    				add_flush_callback(() => updating_questionCategory = false);
    			}

    			question.$set(question_changes);
    			const answers_1_changes = {};
    			if (dirty & /*questionCategory*/ 1) answers_1_changes.questionCategory = /*questionCategory*/ ctx[0];
    			if (dirty & /*correctAnswer*/ 2) answers_1_changes.correctAnswer = /*correctAnswer*/ ctx[1];
    			if (dirty & /*quizReady*/ 4) answers_1_changes.quizReady = /*quizReady*/ ctx[2];

    			if (!updating_pointsModifier && dirty & /*pointsModifier*/ 64) {
    				updating_pointsModifier = true;
    				answers_1_changes.pointsModifier = /*pointsModifier*/ ctx[6];
    				add_flush_callback(() => updating_pointsModifier = false);
    			}

    			if (!updating_wrongAnswers && dirty & /*answers*/ 256) {
    				updating_wrongAnswers = true;
    				answers_1_changes.wrongAnswers = /*answers*/ ctx[8];
    				add_flush_callback(() => updating_wrongAnswers = false);
    			}

    			if (!updating_correctAnswerPosition && dirty & /*correctAnswerPosition*/ 128) {
    				updating_correctAnswerPosition = true;
    				answers_1_changes.correctAnswerPosition = /*correctAnswerPosition*/ ctx[7];
    				add_flush_callback(() => updating_correctAnswerPosition = false);
    			}

    			answers_1.$set(answers_1_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(popover.$$.fragment, local);
    			transition_in(question.$$.fragment, local);
    			transition_in(answers_1.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(popover.$$.fragment, local);
    			transition_out(question.$$.fragment, local);
    			transition_out(answers_1.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(button);
    			if (detaching) detach_dev(t0);
    			destroy_component(popover, detaching);
    			if (detaching) detach_dev(t1);
    			/*question_binding*/ ctx[15](null);
    			destroy_component(question, detaching);
    			if (detaching) detach_dev(t2);
    			/*answers_1_binding*/ ctx[16](null);
    			destroy_component(answers_1, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$3.name,
    		type: "else",
    		source: "(135:8) {:else}",
    		ctx
    	});

    	return block;
    }

    // (133:8) {#if gameEnded}
    function create_if_block$9(ctx) {
    	let leaderboard;
    	let current;

    	leaderboard = new Leaderboard({
    			props: { score: /*score*/ ctx[5] },
    			$$inline: true
    		});

    	leaderboard.$on("replay", /*initQuiz*/ ctx[12]);

    	const block = {
    		c: function create() {
    			create_component(leaderboard.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(leaderboard, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const leaderboard_changes = {};
    			if (dirty & /*score*/ 32) leaderboard_changes.score = /*score*/ ctx[5];
    			leaderboard.$set(leaderboard_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(leaderboard.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(leaderboard.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(leaderboard, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$9.name,
    		type: "if",
    		source: "(133:8) {#if gameEnded}",
    		ctx
    	});

    	return block;
    }

    // (137:12) <Popover placement="left" target="info">
    function create_default_slot$2(ctx) {
    	let t0;
    	let b0;
    	let t2;
    	let b1;
    	let t4;
    	let span;
    	let t6;

    	const block = {
    		c: function create() {
    			t0 = text("Get the highest ");
    			b0 = element("b");
    			b0.textContent = "score";
    			t2 = text(" possible by guessing the right answer of each question. Pay attention: \r\n                if you guess more questions in a row your ");
    			b1 = element("b");
    			b1.textContent = "combo";
    			t4 = text(" will increase and you will earn more and more points for each correct answer. \r\n                But, if you give the wrong answer you will have to start over with the basic combo. You have only 3 ");
    			span = element("span");
    			span.textContent = "lives";
    			t6 = text("\r\n                available, with the third wrong answer the game will end.");
    			add_location(b0, file$g, 140, 32, 4700);
    			add_location(b1, file$g, 141, 58, 4844);
    			set_style(span, "color", "red");
    			add_location(span, file$g, 142, 116, 5053);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t0, anchor);
    			insert_dev(target, b0, anchor);
    			insert_dev(target, t2, anchor);
    			insert_dev(target, b1, anchor);
    			insert_dev(target, t4, anchor);
    			insert_dev(target, span, anchor);
    			insert_dev(target, t6, anchor);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(b0);
    			if (detaching) detach_dev(t2);
    			if (detaching) detach_dev(b1);
    			if (detaching) detach_dev(t4);
    			if (detaching) detach_dev(span);
    			if (detaching) detach_dev(t6);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$2.name,
    		type: "slot",
    		source: "(137:12) <Popover placement=\\\"left\\\" target=\\\"info\\\">",
    		ctx
    	});

    	return block;
    }

    // (138:16) 
    function create_title_slot$2(ctx) {
    	let div;
    	let t0;
    	let b;

    	const block = {
    		c: function create() {
    			div = element("div");
    			t0 = text("How to play ");
    			b = element("b");
    			b.textContent = "Quiz";
    			add_location(b, file$g, 138, 28, 4631);
    			attr_dev(div, "slot", "title");
    			add_location(div, file$g, 137, 16, 4583);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, t0);
    			append_dev(div, b);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_title_slot$2.name,
    		type: "slot",
    		source: "(138:16) ",
    		ctx
    	});

    	return block;
    }

    function create_fragment$g(ctx) {
    	let loadingscreen;
    	let t0;
    	let div2;
    	let div0;
    	let span;
    	let t2;
    	let t3;
    	let score_1;
    	let t4;
    	let div1;
    	let current_block_type_index;
    	let if_block;
    	let current;
    	loadingscreen = new LoadingScreen({ $$inline: true });

    	score_1 = new Score({
    			props: {
    				score: /*score*/ ctx[5],
    				attemptsLeft: /*attemptsLeft*/ ctx[4],
    				pointsModifier: /*pointsModifier*/ ctx[6]
    			},
    			$$inline: true
    		});

    	const if_block_creators = [create_if_block$9, create_else_block$3];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*gameEnded*/ ctx[3]) return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type(ctx);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	const block = {
    		c: function create() {
    			create_component(loadingscreen.$$.fragment);
    			t0 = space();
    			div2 = element("div");
    			div0 = element("div");
    			span = element("span");
    			span.textContent = "Q";
    			t2 = text("UIZ");
    			t3 = space();
    			create_component(score_1.$$.fragment);
    			t4 = space();
    			div1 = element("div");
    			if_block.c();
    			attr_dev(span, "class", "capital");
    			add_location(span, file$g, 129, 64, 4156);
    			attr_dev(div0, "class", "titlepage");
    			toggle_class(div0, "titlepagemob", /*screenWidth*/ ctx[11] < 500);
    			add_location(div0, file$g, 129, 4, 4096);
    			attr_dev(div1, "class", "quiz content svelte-l2fjba");
    			toggle_class(div1, "mobile", /*screenWidth*/ ctx[11] < 500);
    			add_location(div1, file$g, 131, 4, 4255);
    			attr_dev(div2, "class", "container");
    			add_location(div2, file$g, 128, 0, 4067);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			mount_component(loadingscreen, target, anchor);
    			insert_dev(target, t0, anchor);
    			insert_dev(target, div2, anchor);
    			append_dev(div2, div0);
    			append_dev(div0, span);
    			append_dev(div0, t2);
    			append_dev(div2, t3);
    			mount_component(score_1, div2, null);
    			append_dev(div2, t4);
    			append_dev(div2, div1);
    			if_blocks[current_block_type_index].m(div1, null);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (!current || dirty & /*screenWidth*/ 2048) {
    				toggle_class(div0, "titlepagemob", /*screenWidth*/ ctx[11] < 500);
    			}

    			const score_1_changes = {};
    			if (dirty & /*score*/ 32) score_1_changes.score = /*score*/ ctx[5];
    			if (dirty & /*attemptsLeft*/ 16) score_1_changes.attemptsLeft = /*attemptsLeft*/ ctx[4];
    			if (dirty & /*pointsModifier*/ 64) score_1_changes.pointsModifier = /*pointsModifier*/ ctx[6];
    			score_1.$set(score_1_changes);
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if_blocks[current_block_type_index].p(ctx, dirty);
    			} else {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block = if_blocks[current_block_type_index];

    				if (!if_block) {
    					if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block.c();
    				} else {
    					if_block.p(ctx, dirty);
    				}

    				transition_in(if_block, 1);
    				if_block.m(div1, null);
    			}

    			if (!current || dirty & /*screenWidth*/ 2048) {
    				toggle_class(div1, "mobile", /*screenWidth*/ ctx[11] < 500);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(loadingscreen.$$.fragment, local);
    			transition_in(score_1.$$.fragment, local);
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(loadingscreen.$$.fragment, local);
    			transition_out(score_1.$$.fragment, local);
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(loadingscreen, detaching);
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(div2);
    			destroy_component(score_1);
    			if_blocks[current_block_type_index].d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$g.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$g($$self, $$props, $$invalidate) {
    	let $quiz;
    	validate_store(quiz, 'quiz');
    	component_subscribe($$self, quiz, $$value => $$invalidate(22, $quiz = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Quiz', slots, []);
    	var questionCategory;
    	var animalName;
    	var correctAnswer;
    	var quizReady = false;
    	var gameEnded = false;
    	var attemptsLeft;
    	var score;
    	var pointsModifier = 5;
    	var myQuiz = JSON.parse($quiz);
    	var correctAnswerPosition;
    	var answers;
    	var questionObject;
    	var answersObject;
    	var screenWidth = window.innerWidth;

    	window.addEventListener("resize", function (event) {
    		$$invalidate(11, screenWidth = window.innerWidth);
    	});

    	const initQuiz = () => {
    		$$invalidate(3, gameEnded = false);

    		if (myQuiz) {
    			$$invalidate(4, attemptsLeft = myQuiz.attemptsLeft);
    			$$invalidate(5, score = myQuiz.score);
    			$$invalidate(6, pointsModifier = myQuiz.pointsModifier);
    			$$invalidate(0, questionCategory = myQuiz.questionCategory);
    			$$invalidate(7, correctAnswerPosition = myQuiz.correctAnswerPosition);
    			$$invalidate(8, answers = myQuiz.answers);
    			questionObject.setSavedQuestion(myQuiz.animalName);

    			tick().then(() => {
    				$$invalidate(2, quizReady = true);
    			});
    		} else {
    			$$invalidate(4, attemptsLeft = 3);
    			$$invalidate(5, score = 0);
    			chooseAnimal();
    			createQuiz();
    		}
    	};

    	const chooseAnimal = () => {
    		animalName = randomAnimal().trim().split(/\s+/);
    		animalName = animalName[animalName.length - 1];
    	};

    	const createQuiz = () => {
    		var xmlHttp = new XMLHttpRequest();

    		xmlHttp.onreadystatechange = function () {
    			if (xmlHttp.readyState == 4 && xmlHttp.status == 200) {
    				let response = JSON.parse(xmlHttp.responseText);

    				if (response.length > 0) {
    					let index = Math.floor(Math.random() * response.length);
    					animalName = response[index].name;
    					$$invalidate(1, correctAnswer = questionObject.setQuestion(response[index]));

    					tick().then(() => {
    						answersObject.defineAnswers();
    						saveQuiz();
    						$$invalidate(2, quizReady = true);
    					});
    				} else {
    					chooseAnimal();
    					createQuiz();
    				}
    			}
    		};

    		xmlHttp.open("GET", 'https://api.api-ninjas.com/v1/animals?name=' + animalName, true);
    		xmlHttp.setRequestHeader("X-Api-Key", "XeRLqZeWmuiW7/PMyztdHQ==HoJJOzopIX90X1xe");
    		xmlHttp.send(null);
    	};

    	const saveQuiz = () => {
    		myQuiz = {
    			animalName,
    			score,
    			pointsModifier,
    			attemptsLeft,
    			questionCategory,
    			correctAnswerPosition,
    			answers
    		};

    		quiz.set(JSON.stringify(myQuiz));
    	};

    	const dispatch = createEventDispatcher();

    	const updateScore = event => {
    		let value = event.detail.pointsModifier;
    		$$invalidate(5, score += value);

    		if (value <= 0) {
    			if ($$invalidate(4, --attemptsLeft) <= 0) {
    				//partita finita
    				$$invalidate(3, gameEnded = true);

    				myQuiz = null;
    				quiz.set(JSON.stringify(myQuiz));
    				dispatch('matchEnded');
    			}
    		}

    		if (attemptsLeft > 0) {
    			//prossima domanda
    			setTimeout(
    				function () {
    					$$invalidate(2, quizReady = false);
    				},
    				1000
    			);

    			setTimeout(chooseAnimal, 3000);
    			setTimeout(createQuiz, 3000);
    		}
    	};

    	setTimeout(
    		function () {
    			initQuiz();
    		},
    		7200
    	); //7200

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Quiz> was created with unknown prop '${key}'`);
    	});

    	function question_questionCategory_binding(value) {
    		questionCategory = value;
    		$$invalidate(0, questionCategory);
    	}

    	function question_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			questionObject = $$value;
    			$$invalidate(9, questionObject);
    		});
    	}

    	function answers_1_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			answersObject = $$value;
    			$$invalidate(10, answersObject);
    		});
    	}

    	function answers_1_pointsModifier_binding(value) {
    		pointsModifier = value;
    		$$invalidate(6, pointsModifier);
    	}

    	function answers_1_wrongAnswers_binding(value) {
    		answers = value;
    		$$invalidate(8, answers);
    	}

    	function answers_1_correctAnswerPosition_binding(value) {
    		correctAnswerPosition = value;
    		$$invalidate(7, correctAnswerPosition);
    	}

    	$$self.$capture_state = () => ({
    		Answers,
    		Question,
    		Score,
    		createEventDispatcher,
    		tick,
    		LoadingScreen,
    		Popover,
    		quiz,
    		Leaderboard,
    		questionCategory,
    		animalName,
    		correctAnswer,
    		quizReady,
    		gameEnded,
    		attemptsLeft,
    		score,
    		pointsModifier,
    		myQuiz,
    		correctAnswerPosition,
    		answers,
    		questionObject,
    		answersObject,
    		screenWidth,
    		initQuiz,
    		chooseAnimal,
    		createQuiz,
    		saveQuiz,
    		dispatch,
    		updateScore,
    		$quiz
    	});

    	$$self.$inject_state = $$props => {
    		if ('questionCategory' in $$props) $$invalidate(0, questionCategory = $$props.questionCategory);
    		if ('animalName' in $$props) animalName = $$props.animalName;
    		if ('correctAnswer' in $$props) $$invalidate(1, correctAnswer = $$props.correctAnswer);
    		if ('quizReady' in $$props) $$invalidate(2, quizReady = $$props.quizReady);
    		if ('gameEnded' in $$props) $$invalidate(3, gameEnded = $$props.gameEnded);
    		if ('attemptsLeft' in $$props) $$invalidate(4, attemptsLeft = $$props.attemptsLeft);
    		if ('score' in $$props) $$invalidate(5, score = $$props.score);
    		if ('pointsModifier' in $$props) $$invalidate(6, pointsModifier = $$props.pointsModifier);
    		if ('myQuiz' in $$props) myQuiz = $$props.myQuiz;
    		if ('correctAnswerPosition' in $$props) $$invalidate(7, correctAnswerPosition = $$props.correctAnswerPosition);
    		if ('answers' in $$props) $$invalidate(8, answers = $$props.answers);
    		if ('questionObject' in $$props) $$invalidate(9, questionObject = $$props.questionObject);
    		if ('answersObject' in $$props) $$invalidate(10, answersObject = $$props.answersObject);
    		if ('screenWidth' in $$props) $$invalidate(11, screenWidth = $$props.screenWidth);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		questionCategory,
    		correctAnswer,
    		quizReady,
    		gameEnded,
    		attemptsLeft,
    		score,
    		pointsModifier,
    		correctAnswerPosition,
    		answers,
    		questionObject,
    		answersObject,
    		screenWidth,
    		initQuiz,
    		updateScore,
    		question_questionCategory_binding,
    		question_binding,
    		answers_1_binding,
    		answers_1_pointsModifier_binding,
    		answers_1_wrongAnswers_binding,
    		answers_1_correctAnswerPosition_binding
    	];
    }

    class Quiz extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$g, create_fragment$g, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Quiz",
    			options,
    			id: create_fragment$g.name
    		});
    	}
    }

    const storedWordle = localStorage.getItem("wordle");
    const wordle = writable(storedWordle || 'null');
    wordle.subscribe(value => {
        localStorage.setItem("wordle", value);
    });

    /* src\component\wordle\Word.svelte generated by Svelte v3.53.1 */

    const { console: console_1$3 } = globals;
    const file$f = "src\\component\\wordle\\Word.svelte";

    function get_each_context$9(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[15] = list[i];
    	child_ctx[1] = i;
    	return child_ctx;
    }

    // (119:4) {#each Array(wordChosen.length) as _, index (index)}
    function create_each_block$9(key_1, ctx) {
    	let input_1;
    	let input_1_id_value;
    	let mounted;
    	let dispose;

    	function click_handler() {
    		return /*click_handler*/ ctx[7](/*index*/ ctx[1]);
    	}

    	const block = {
    		key: key_1,
    		first: null,
    		c: function create() {
    			input_1 = element("input");
    			attr_dev(input_1, "id", input_1_id_value = "letterBox" + (/*index*/ ctx[1] + 1));
    			attr_dev(input_1, "type", "text");
    			input_1.value = "";
    			set_style(input_1, "text-transform", "uppercase");
    			attr_dev(input_1, "maxlength", maxLenght);
    			attr_dev(input_1, "class", "svelte-x1mrai");
    			toggle_class(input_1, "mobile", /*screenWidth*/ ctx[2] < 500);
    			add_location(input_1, file$f, 119, 8, 3676);
    			this.first = input_1;
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, input_1, anchor);

    			if (!mounted) {
    				dispose = [
    					listen_dev(input_1, "keydown", /*letterEntered*/ ctx[3], false, false, false),
    					listen_dev(input_1, "click", click_handler, false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;

    			if (dirty & /*wordChosen*/ 1 && input_1_id_value !== (input_1_id_value = "letterBox" + (/*index*/ ctx[1] + 1))) {
    				attr_dev(input_1, "id", input_1_id_value);
    			}

    			if (dirty & /*screenWidth*/ 4) {
    				toggle_class(input_1, "mobile", /*screenWidth*/ ctx[2] < 500);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(input_1);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$9.name,
    		type: "each",
    		source: "(119:4) {#each Array(wordChosen.length) as _, index (index)}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$f(ctx) {
    	let div;
    	let each_blocks = [];
    	let each_1_lookup = new Map();
    	let each_value = Array(/*wordChosen*/ ctx[0].length);
    	validate_each_argument(each_value);
    	const get_key = ctx => /*index*/ ctx[1];
    	validate_each_keys(ctx, each_value, get_each_context$9, get_key);

    	for (let i = 0; i < each_value.length; i += 1) {
    		let child_ctx = get_each_context$9(ctx, each_value, i);
    		let key = get_key(child_ctx);
    		each_1_lookup.set(key, each_blocks[i] = create_each_block$9(key, child_ctx));
    	}

    	const block = {
    		c: function create() {
    			div = element("div");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr_dev(div, "class", "flex svelte-x1mrai");
    			add_location(div, file$f, 117, 0, 3590);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(div, null);
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*Array, wordChosen, maxLenght, screenWidth, letterEntered, changeFocus*/ 29) {
    				each_value = Array(/*wordChosen*/ ctx[0].length);
    				validate_each_argument(each_value);
    				validate_each_keys(ctx, each_value, get_each_context$9, get_key);
    				each_blocks = update_keyed_each(each_blocks, dirty, get_key, 1, ctx, each_value, each_1_lookup, div, destroy_block, create_each_block$9, null, get_each_context$9);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].d();
    			}
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$f.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    const maxLenght = 1;

    function instance$f($$self, $$props, $$invalidate) {
    	let $wordle;
    	validate_store(wordle, 'wordle');
    	component_subscribe($$self, wordle, $$value => $$invalidate(11, $wordle = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Word', slots, []);
    	let { wordsNumber } = $$props;
    	let { wordChosen } = $$props;
    	let { index } = $$props;
    	var myWord = JSON.parse($wordle);
    	var screenWidth = window.innerWidth;

    	window.addEventListener("resize", function (event) {
    		$$invalidate(2, screenWidth = window.innerWidth);
    	});

    	var letterTurn = 0;
    	var input;

    	const letterEntered = event => {
    		if (isLetter(event)) {
    			input = event.key;
    			letterTurn++;

    			setTimeout(
    				function () {
    					if (letterTurn >= 7) letterTurn = 6; else changeFocus(letterTurn);
    				},
    				100
    			);
    		} else if (event.key === "Backspace" || event.key === "Delete") {
    			letterTurn--;

    			setTimeout(
    				function () {
    					if (letterTurn > 0) changeFocus(letterTurn);
    				},
    				100
    			);
    		}
    	};

    	const isLetter = event => {
    		if (event.keyCode >= 65 && event.keyCode <= 90 || event.keyCode >= 97 && event.keyCode <= 122) {
    			return true;
    		} else {
    			return false;
    		}
    	};

    	const changeFocus = id => {
    		letterTurn = id;
    		document.getElementById("letterBox" + id).focus();
    	};

    	console.log(wordChosen);

    	const guessWord = toSave => {
    		var word = [];
    		var isWordEntered = true;

    		for (var i = 0; i <= 5; i++) {
    			word[i] = document.getElementById("letterBox" + (i + 1)).value.toLowerCase();
    			if (word[i] == null || word[i] == ' ' || word[i] == '') isWordEntered = false;
    		}

    		if (isWordEntered) {
    			if (toSave) {
    				let wordToAdd = [...myWord.words, word];

    				myWord = {
    					wordChosen,
    					wordsNumber: wordsNumber + 1,
    					words: wordToAdd
    				};

    				wordle.set(JSON.stringify(myWord));
    			}

    			var isWordCorrect = "CORRWORD";

    			for (var i = 0; i <= 5; i++) {
    				if (!checkLetter(word[i], i + 1)) isWordCorrect = "WRONGWORD";
    				document.getElementById("letterBox" + (i + 1)).removeAttribute('id');
    			}

    			return isWordCorrect;
    		}

    		return "NOWORD";
    	};

    	const checkLetter = (letter, index) => {
    		if (wordChosen.charAt(index - 1) == letter) {
    			document.getElementById("letterBox" + index).style.backgroundColor = "green";
    			return true;
    		} else if (searchLetter(letter)) {
    			document.getElementById("letterBox" + index).style.backgroundColor = "orange";
    		} else {
    			document.getElementById("letterBox" + index).style.backgroundColor = "red";
    		}

    		return false;
    	};

    	const searchLetter = letter => {
    		var found = false;
    		var i = 0;

    		while (!found && i < wordChosen.length) {
    			if (wordChosen.charAt(i) == letter) {
    				found = true;
    			}

    			i++;
    		}

    		return found;
    	};

    	if (myWord?.wordsNumber > index + 1) {
    		tick().then(() => {
    			let word = myWord.words[index];

    			for (let i = 0; i <= 5; i++) {
    				document.getElementById("letterBox" + (i + 1)).value = word[i];
    			}

    			guessWord(false);
    		});
    	}

    	$$self.$$.on_mount.push(function () {
    		if (wordsNumber === undefined && !('wordsNumber' in $$props || $$self.$$.bound[$$self.$$.props['wordsNumber']])) {
    			console_1$3.warn("<Word> was created without expected prop 'wordsNumber'");
    		}

    		if (wordChosen === undefined && !('wordChosen' in $$props || $$self.$$.bound[$$self.$$.props['wordChosen']])) {
    			console_1$3.warn("<Word> was created without expected prop 'wordChosen'");
    		}

    		if (index === undefined && !('index' in $$props || $$self.$$.bound[$$self.$$.props['index']])) {
    			console_1$3.warn("<Word> was created without expected prop 'index'");
    		}
    	});

    	const writable_props = ['wordsNumber', 'wordChosen', 'index'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1$3.warn(`<Word> was created with unknown prop '${key}'`);
    	});

    	const click_handler = index => changeFocus(index + 1);

    	$$self.$$set = $$props => {
    		if ('wordsNumber' in $$props) $$invalidate(5, wordsNumber = $$props.wordsNumber);
    		if ('wordChosen' in $$props) $$invalidate(0, wordChosen = $$props.wordChosen);
    		if ('index' in $$props) $$invalidate(1, index = $$props.index);
    	};

    	$$self.$capture_state = () => ({
    		tick,
    		wordsNumber,
    		wordChosen,
    		index,
    		wordle,
    		myWord,
    		screenWidth,
    		letterTurn,
    		input,
    		maxLenght,
    		letterEntered,
    		isLetter,
    		changeFocus,
    		guessWord,
    		checkLetter,
    		searchLetter,
    		$wordle
    	});

    	$$self.$inject_state = $$props => {
    		if ('wordsNumber' in $$props) $$invalidate(5, wordsNumber = $$props.wordsNumber);
    		if ('wordChosen' in $$props) $$invalidate(0, wordChosen = $$props.wordChosen);
    		if ('index' in $$props) $$invalidate(1, index = $$props.index);
    		if ('myWord' in $$props) myWord = $$props.myWord;
    		if ('screenWidth' in $$props) $$invalidate(2, screenWidth = $$props.screenWidth);
    		if ('letterTurn' in $$props) letterTurn = $$props.letterTurn;
    		if ('input' in $$props) input = $$props.input;
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		wordChosen,
    		index,
    		screenWidth,
    		letterEntered,
    		changeFocus,
    		wordsNumber,
    		guessWord,
    		click_handler
    	];
    }

    class Word extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$f, create_fragment$f, safe_not_equal, {
    			wordsNumber: 5,
    			wordChosen: 0,
    			index: 1,
    			guessWord: 6
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Word",
    			options,
    			id: create_fragment$f.name
    		});
    	}

    	get wordsNumber() {
    		throw new Error("<Word>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set wordsNumber(value) {
    		throw new Error("<Word>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get wordChosen() {
    		throw new Error("<Word>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set wordChosen(value) {
    		throw new Error("<Word>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get index() {
    		throw new Error("<Word>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set index(value) {
    		throw new Error("<Word>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get guessWord() {
    		return this.$$.ctx[6];
    	}

    	set guessWord(value) {
    		throw new Error("<Word>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    var fireworks_1 = createCommonjsModule(function (module, exports) {
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.fireworks = void 0;
    exports.default = fireworks;
    const defaultColors = ['#2d80ee', '#1b4e8f', '#112e55'];
    function fireworks(opts) {
        if (!opts) {
            throw new Error('Missing options for fireworks');
        }
        const { x, y, canvasWidth = 300, canvasHeight = 300, particleTimeout = 1000, colors = defaultColors, bubbleSizeMinimum = 10, bubbleSizeMaximum = 25, bubbleSpeedMinimum = 6, bubbleSpeedMaximum = 10, count: bubbleCount = 25, canvasLeftOffset = canvasWidth / 2, canvasTopOffset = canvasHeight / 2, parentNode = document.body } = opts;
        const ratio = window.devicePixelRatio;
        const cvs = document.createElement('canvas');
        const ctx = cvs.getContext('2d');
        if (!ctx) {
            console.log(`fireworks: unable to get 2d canvas context`);
            return;
        }
        cvs.style.zIndex = '100';
        cvs.style.position = 'absolute';
        cvs.style.pointerEvents = 'none';
        cvs.style.top = `${y - canvasTopOffset}px`;
        cvs.style.left = `${x - canvasLeftOffset}px`;
        cvs.style.height = `${canvasHeight}px`;
        cvs.style.width = `${canvasWidth}px`;
        cvs.height = canvasHeight * ratio;
        cvs.width = canvasWidth * ratio;
        parentNode.appendChild(cvs);
        let particles = [];
        for (let i = 0; i < bubbleCount; i++) {
            particles.push({
                x: cvs.width / 2,
                y: cvs.height / 2,
                color: colors[Math.floor(Math.random() * colors.length)],
                radius: randomRange(bubbleSizeMinimum, bubbleSizeMaximum),
                speed: randomRange(bubbleSpeedMinimum, bubbleSpeedMaximum),
                rotation: randomRange(0, 360, -1),
                opacity: randomRange(0, 0.5, -1),
                friction: 0.96,
                gravity: 0.05,
                yVel: 0,
            });
        }
        render(cvs.width, cvs.height, particles, ctx);
        setTimeout(function () {
            parentNode.removeChild(cvs);
        }, particleTimeout);
    }
    exports.fireworks = fireworks;
    function render(width, height, particles, ctx) {
        requestAnimationFrame(() => {
            render(width, height, particles, ctx);
        });
        ctx.clearRect(0, 0, width, height);
        particles.forEach(function (p, i) {
            p.x += p.speed * Math.cos((p.rotation * Math.PI) / 180);
            p.y += p.speed * Math.sin((p.rotation * Math.PI) / 180);
            p.opacity -= 0.005;
            p.speed *= p.friction;
            p.radius *= p.friction;
            p.yVel += p.gravity;
            p.y += p.yVel;
            if (p.opacity < 0 || p.radius < 0) {
                return;
            }
            ctx.beginPath();
            ctx.globalAlpha = p.opacity;
            ctx.fillStyle = p.color;
            ctx.arc(p.x, p.y, p.radius, 0, 2 * Math.PI, false);
            ctx.fill();
        });
        return ctx;
    }
    function randomRange(a, b, c = 0) {
        return parseFloat((Math.random() * ((a ? a : 1) - (b ? b : 0)) + (b ? b : 0)).toFixed(c > 0 ? c : 0));
    }
    });

    var fx = /*@__PURE__*/getDefaultExportFromCjs(fireworks_1);

    let range = n => [...new Array(n)];

    const firework = () => {
        range(6).map(() =>
            fx({
                x: Math.random(window.innerWidth / 2) + window.innerWidth / 4,
                y: Math.random(window.innerWidth / 2) + window.innerWidth / 4,
                colors: ['#cc3333', '#4CAF50', '#81C784']
            })
        );

        range(6).map(() =>
            fx({
                x: Math.random(window.innerWidth / 2) + 3*window.innerWidth /4,
                y: Math.random(window.innerHeight / 2) + window.innerHeight / 2,
                colors: ['#cc3333', '#4CAF50', '#81C784']
            })
        );

        range(6).map(() =>
            fx({
                x: Math.random(window.innerWidth / 2) + window.innerWidth / 2,
                y: Math.random(window.innerHeight / 2) + window.innerHeight / 4,
                colors: ['#cc3333', '#4CAF50', '#81C784']
            })
        );

        setTimeout(function(){
            range(6).map(() =>
            fx({
                x: Math.random(window.innerWidth / 2) + window.innerWidth / 4,
                y: Math.random(window.innerHeight / 2) + window.innerHeight / 4,
                colors: ['#cc3333', '#4CAF50', '#81C784']
                })
            );

            range(6).map(() =>
                fx({
                    x: Math.random(window.innerWidth / 2) + 3*window.innerWidth /4,
                    y: Math.random(window.innerHeight / 2) + window.innerHeight / 4,
                    colors: ['#cc3333', '#4CAF50', '#81C784']
                })
            );

            range(6).map(() =>
                fx({
                    x: Math.random(window.innerWidth / 2) + window.innerWidth / 2,
                    y: Math.random(window.innerHeight / 2) + window.innerHeight / 2,
                    colors: ['#cc3333', '#4CAF50', '#81C784']
                })
            );
        },1000);

        setTimeout(function(){
            range(6).map(() =>
            fx({
                x: Math.random(window.innerWidth / 2) + window.innerWidth / 4,
                y: Math.random(window.innerWidth / 2) + window.innerWidth / 4,
                colors: ['#cc3333', '#4CAF50', '#81C784']
                })
            );

            range(6).map(() =>
                fx({
                    x: Math.random(window.innerWidth / 2) + 3*window.innerWidth /4,
                    y: Math.random(window.innerHeight / 2) + window.innerHeight / 2,
                    colors: ['#cc3333', '#4CAF50', '#81C784']
                })
            );

            range(6).map(() =>
                fx({
                    x: Math.random(window.innerWidth / 2) + window.innerWidth / 2,
                    y: Math.random(window.innerHeight / 2) + window.innerHeight / 4,
                    colors: ['#cc3333', '#4CAF50', '#81C784']
                })
            );
        },2000);
    };

    /* src\component\wordle\Wordle.svelte generated by Svelte v3.53.1 */
    const file$e = "src\\component\\wordle\\Wordle.svelte";

    function get_each_context$8(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[13] = list[i];
    	child_ctx[15] = i;
    	return child_ctx;
    }

    // (84:4) <Popover placement="left" target="info">
    function create_default_slot$1(ctx) {
    	let t0;
    	let span0;
    	let t2;
    	let span1;
    	let t4;
    	let span2;
    	let t6;
    	let b;
    	let t8;

    	const block = {
    		c: function create() {
    			t0 = text("Try to guess the word. The word will always be an animal of 6 letters. Each box contains a letter. After you fill each one,\r\n        they will color. ");
    			span0 = element("span");
    			span0.textContent = "Green";
    			t2 = text(" means that the letter is correct and it is in the correct position.\r\n        ");
    			span1 = element("span");
    			span1.textContent = "Orange";
    			t4 = text(" means that the letter is correct and it is in the wrong position.\r\n        ");
    			span2 = element("span");
    			span2.textContent = "Red";
    			t6 = text(" means that the letter is wrong. You only have ");
    			b = element("b");
    			b.textContent = "6";
    			t8 = text(" tries to guess the word.");
    			set_style(span0, "color", "green");
    			add_location(span0, file$e, 88, 25, 2683);
    			set_style(span1, "color", "orange");
    			add_location(span1, file$e, 89, 8, 2800);
    			set_style(span2, "color", "red");
    			add_location(span2, file$e, 90, 8, 2917);
    			add_location(b, file$e, 90, 90, 2999);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t0, anchor);
    			insert_dev(target, span0, anchor);
    			insert_dev(target, t2, anchor);
    			insert_dev(target, span1, anchor);
    			insert_dev(target, t4, anchor);
    			insert_dev(target, span2, anchor);
    			insert_dev(target, t6, anchor);
    			insert_dev(target, b, anchor);
    			insert_dev(target, t8, anchor);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(span0);
    			if (detaching) detach_dev(t2);
    			if (detaching) detach_dev(span1);
    			if (detaching) detach_dev(t4);
    			if (detaching) detach_dev(span2);
    			if (detaching) detach_dev(t6);
    			if (detaching) detach_dev(b);
    			if (detaching) detach_dev(t8);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$1.name,
    		type: "slot",
    		source: "(84:4) <Popover placement=\\\"left\\\" target=\\\"info\\\">",
    		ctx
    	});

    	return block;
    }

    // (85:8) 
    function create_title_slot$1(ctx) {
    	let div;
    	let t0;
    	let b;

    	const block = {
    		c: function create() {
    			div = element("div");
    			t0 = text("How to play ");
    			b = element("b");
    			b.textContent = "Wordle";
    			add_location(b, file$e, 85, 22, 2494);
    			attr_dev(div, "slot", "title");
    			add_location(div, file$e, 84, 8, 2452);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, t0);
    			append_dev(div, b);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_title_slot$1.name,
    		type: "slot",
    		source: "(85:8) ",
    		ctx
    	});

    	return block;
    }

    // (93:4) {#if isWordGenerated}
    function create_if_block_1$6(ctx) {
    	let each_blocks = [];
    	let each_1_lookup = new Map();
    	let each_1_anchor;
    	let current;
    	let each_value = Array(/*wordsNumber*/ ctx[1]);
    	validate_each_argument(each_value);
    	const get_key = ctx => /*index*/ ctx[15];
    	validate_each_keys(ctx, each_value, get_each_context$8, get_key);

    	for (let i = 0; i < each_value.length; i += 1) {
    		let child_ctx = get_each_context$8(ctx, each_value, i);
    		let key = get_key(child_ctx);
    		each_1_lookup.set(key, each_blocks[i] = create_each_block$8(key, child_ctx));
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
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*wordChosen, Array, wordsNumber, guessedWord*/ 35) {
    				each_value = Array(/*wordsNumber*/ ctx[1]);
    				validate_each_argument(each_value);
    				group_outros();
    				validate_each_keys(ctx, each_value, get_each_context$8, get_key);
    				each_blocks = update_keyed_each(each_blocks, dirty, get_key, 1, ctx, each_value, each_1_lookup, each_1_anchor.parentNode, outro_and_destroy_block, create_each_block$8, each_1_anchor, get_each_context$8);
    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;

    			for (let i = 0; i < each_value.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			current = true;
    		},
    		o: function outro(local) {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].d(detaching);
    			}

    			if (detaching) detach_dev(each_1_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$6.name,
    		type: "if",
    		source: "(93:4) {#if isWordGenerated}",
    		ctx
    	});

    	return block;
    }

    // (94:8) {#each Array(wordsNumber) as _, index (index)}
    function create_each_block$8(key_1, ctx) {
    	let first;
    	let word;
    	let updating_guessWord;
    	let current;

    	function word_guessWord_binding(value) {
    		/*word_guessWord_binding*/ ctx[8](value);
    	}

    	let word_props = {
    		wordChosen: /*wordChosen*/ ctx[0],
    		index: /*index*/ ctx[15],
    		wordsNumber: /*wordsNumber*/ ctx[1]
    	};

    	if (/*guessedWord*/ ctx[5] !== void 0) {
    		word_props.guessWord = /*guessedWord*/ ctx[5];
    	}

    	word = new Word({ props: word_props, $$inline: true });
    	binding_callbacks.push(() => bind(word, 'guessWord', word_guessWord_binding));

    	const block = {
    		key: key_1,
    		first: null,
    		c: function create() {
    			first = empty();
    			create_component(word.$$.fragment);
    			this.first = first;
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, first, anchor);
    			mount_component(word, target, anchor);
    			current = true;
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			const word_changes = {};
    			if (dirty & /*wordChosen*/ 1) word_changes.wordChosen = /*wordChosen*/ ctx[0];
    			if (dirty & /*wordsNumber*/ 2) word_changes.index = /*index*/ ctx[15];
    			if (dirty & /*wordsNumber*/ 2) word_changes.wordsNumber = /*wordsNumber*/ ctx[1];

    			if (!updating_guessWord && dirty & /*guessedWord*/ 32) {
    				updating_guessWord = true;
    				word_changes.guessWord = /*guessedWord*/ ctx[5];
    				add_flush_callback(() => updating_guessWord = false);
    			}

    			word.$set(word_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(word.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(word.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(first);
    			destroy_component(word, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$8.name,
    		type: "each",
    		source: "(94:8) {#each Array(wordsNumber) as _, index (index)}",
    		ctx
    	});

    	return block;
    }

    // (98:4) {#if gameLost}
    function create_if_block$8(ctx) {
    	let div;

    	const block = {
    		c: function create() {
    			div = element("div");
    			div.textContent = "I'm sorry, you had only 6 tries to guess the word. Restart the game to try again!";
    			set_style(div, "color", "#ff6a3d");
    			set_style(div, "width", "100%");
    			set_style(div, "text-align", "center");
    			set_style(div, "font-weight", "bold");
    			set_style(div, "margin-top", "20px");
    			add_location(div, file$e, 98, 8, 3275);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$8.name,
    		type: "if",
    		source: "(98:4) {#if gameLost}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$e(ctx) {
    	let loadingscreen;
    	let t0;
    	let div1;
    	let div0;
    	let span;
    	let t2;
    	let t3;
    	let div3;
    	let button0;
    	let i0;
    	let t4;
    	let popover;
    	let t5;
    	let t6;
    	let t7;
    	let div2;
    	let button1;
    	let t9;
    	let button2;
    	let t10;
    	let i1;
    	let current;
    	let mounted;
    	let dispose;
    	loadingscreen = new LoadingScreen({ $$inline: true });

    	popover = new Popover({
    			props: {
    				placement: "left",
    				target: "info",
    				$$slots: {
    					title: [create_title_slot$1],
    					default: [create_default_slot$1]
    				},
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	let if_block0 = /*isWordGenerated*/ ctx[2] && create_if_block_1$6(ctx);
    	let if_block1 = /*gameLost*/ ctx[3] && create_if_block$8(ctx);

    	const block = {
    		c: function create() {
    			create_component(loadingscreen.$$.fragment);
    			t0 = space();
    			div1 = element("div");
    			div0 = element("div");
    			span = element("span");
    			span.textContent = "W";
    			t2 = text("ORDLE");
    			t3 = space();
    			div3 = element("div");
    			button0 = element("button");
    			i0 = element("i");
    			t4 = space();
    			create_component(popover.$$.fragment);
    			t5 = space();
    			if (if_block0) if_block0.c();
    			t6 = space();
    			if (if_block1) if_block1.c();
    			t7 = space();
    			div2 = element("div");
    			button1 = element("button");
    			button1.textContent = "Guess";
    			t9 = space();
    			button2 = element("button");
    			t10 = text("RESTART");
    			i1 = element("i");
    			attr_dev(span, "class", "capital");
    			add_location(span, file$e, 79, 65, 2206);
    			attr_dev(div0, "class", "titlepage");
    			toggle_class(div0, "titlepagemob", /*screenWidth*/ ctx[4] < 500);
    			add_location(div0, file$e, 79, 4, 2145);
    			attr_dev(div1, "class", "container");
    			add_location(div1, file$e, 78, 0, 2116);
    			attr_dev(i0, "class", "bi-info-circle svelte-9jm9t4");
    			toggle_class(i0, "imob", /*screenWidth*/ ctx[4] < 500);
    			add_location(i0, file$e, 82, 22, 2328);
    			attr_dev(button0, "id", "info");
    			attr_dev(button0, "class", "svelte-9jm9t4");
    			add_location(button0, file$e, 82, 4, 2310);
    			attr_dev(button1, "id", "guess");
    			attr_dev(button1, "class", "svelte-9jm9t4");
    			add_location(button1, file$e, 101, 8, 3560);
    			attr_dev(i1, "class", "bi-arrow-clockwise svelte-9jm9t4");
    			add_location(i1, file$e, 102, 95, 3713);
    			set_style(button2, "border-radius", "10px");
    			set_style(button2, "border", "3px solid black");
    			add_location(button2, file$e, 102, 8, 3626);
    			attr_dev(div2, "class", "flex");
    			set_style(div2, "justify-content", "center");
    			set_style(div2, "margin-top", "20px");
    			set_style(div2, "gap", "10px");
    			add_location(div2, file$e, 100, 4, 3473);
    			attr_dev(div3, "class", "container containerx flex content svelte-9jm9t4");
    			add_location(div3, file$e, 81, 0, 2257);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			mount_component(loadingscreen, target, anchor);
    			insert_dev(target, t0, anchor);
    			insert_dev(target, div1, anchor);
    			append_dev(div1, div0);
    			append_dev(div0, span);
    			append_dev(div0, t2);
    			insert_dev(target, t3, anchor);
    			insert_dev(target, div3, anchor);
    			append_dev(div3, button0);
    			append_dev(button0, i0);
    			append_dev(div3, t4);
    			mount_component(popover, div3, null);
    			append_dev(div3, t5);
    			if (if_block0) if_block0.m(div3, null);
    			append_dev(div3, t6);
    			if (if_block1) if_block1.m(div3, null);
    			append_dev(div3, t7);
    			append_dev(div3, div2);
    			append_dev(div2, button1);
    			append_dev(div2, t9);
    			append_dev(div2, button2);
    			append_dev(button2, t10);
    			append_dev(button2, i1);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(button1, "click", /*wordGuessed*/ ctx[6], false, false, false),
    					listen_dev(button2, "click", /*restart*/ ctx[7], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (!current || dirty & /*screenWidth*/ 16) {
    				toggle_class(div0, "titlepagemob", /*screenWidth*/ ctx[4] < 500);
    			}

    			if (!current || dirty & /*screenWidth*/ 16) {
    				toggle_class(i0, "imob", /*screenWidth*/ ctx[4] < 500);
    			}

    			const popover_changes = {};

    			if (dirty & /*$$scope*/ 65536) {
    				popover_changes.$$scope = { dirty, ctx };
    			}

    			popover.$set(popover_changes);

    			if (/*isWordGenerated*/ ctx[2]) {
    				if (if_block0) {
    					if_block0.p(ctx, dirty);

    					if (dirty & /*isWordGenerated*/ 4) {
    						transition_in(if_block0, 1);
    					}
    				} else {
    					if_block0 = create_if_block_1$6(ctx);
    					if_block0.c();
    					transition_in(if_block0, 1);
    					if_block0.m(div3, t6);
    				}
    			} else if (if_block0) {
    				group_outros();

    				transition_out(if_block0, 1, 1, () => {
    					if_block0 = null;
    				});

    				check_outros();
    			}

    			if (/*gameLost*/ ctx[3]) {
    				if (if_block1) ; else {
    					if_block1 = create_if_block$8(ctx);
    					if_block1.c();
    					if_block1.m(div3, t7);
    				}
    			} else if (if_block1) {
    				if_block1.d(1);
    				if_block1 = null;
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(loadingscreen.$$.fragment, local);
    			transition_in(popover.$$.fragment, local);
    			transition_in(if_block0);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(loadingscreen.$$.fragment, local);
    			transition_out(popover.$$.fragment, local);
    			transition_out(if_block0);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(loadingscreen, detaching);
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(div1);
    			if (detaching) detach_dev(t3);
    			if (detaching) detach_dev(div3);
    			destroy_component(popover);
    			if (if_block0) if_block0.d();
    			if (if_block1) if_block1.d();
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$e.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$e($$self, $$props, $$invalidate) {
    	let $wordle;
    	validate_store(wordle, 'wordle');
    	component_subscribe($$self, wordle, $$value => $$invalidate(11, $wordle = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Wordle', slots, []);
    	var wordChosen;
    	var attempts = 5;
    	var wordsNumber = 1;
    	var myWordle = JSON.parse($wordle);
    	var isWordGenerated = false;
    	var gameLost = false;
    	var screenWidth = window.innerWidth;

    	window.addEventListener("resize", function (event) {
    		$$invalidate(4, screenWidth = window.innerWidth);
    	});

    	const generateWord = () => {
    		$$invalidate(3, gameLost = false);
    		var res = randomAnimal().trim().split(/\s+/);

    		if (res[res.length - 1].length != 6) generateWord(); else {
    			$$invalidate(1, wordsNumber = 1);
    			$$invalidate(0, wordChosen = res[res.length - 1].toLowerCase());
    			myWordle = { wordChosen, wordsNumber, words: [] };
    			wordle.set(JSON.stringify(myWordle));
    			$$invalidate(2, isWordGenerated = true);
    		}
    	};

    	let guessedWord;

    	const wordGuessed = () => {
    		var res = guessedWord(true);

    		switch (res) {
    			case 'NOWORD':
    				// reminder inserita parola troppo corta 
    				break;
    			case 'CORRWORD':
    				// parola giusta
    				firework();
    				break;
    			case 'WRONGWORD':
    				// parola sbagliata
    				$$invalidate(1, wordsNumber = wordsNumber + 1);
    				if (--attempts <= 0) {
    					// finiti i tentativi
    					alert("finiti tentativi");
    				}
    				break;
    		}
    	};

    	const restart = () => {
    		generateWord();
    		location.reload();
    	};

    	if (myWordle) {
    		wordsNumber = myWordle.wordsNumber;
    		wordChosen = myWordle.wordChosen;
    		isWordGenerated = true;
    	} else generateWord();

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Wordle> was created with unknown prop '${key}'`);
    	});

    	function word_guessWord_binding(value) {
    		guessedWord = value;
    		$$invalidate(5, guessedWord);
    	}

    	$$self.$capture_state = () => ({
    		Word,
    		Popover,
    		wordle,
    		firework,
    		LoadingScreen,
    		wordChosen,
    		attempts,
    		wordsNumber,
    		myWordle,
    		isWordGenerated,
    		gameLost,
    		screenWidth,
    		generateWord,
    		guessedWord,
    		wordGuessed,
    		restart,
    		$wordle
    	});

    	$$self.$inject_state = $$props => {
    		if ('wordChosen' in $$props) $$invalidate(0, wordChosen = $$props.wordChosen);
    		if ('attempts' in $$props) attempts = $$props.attempts;
    		if ('wordsNumber' in $$props) $$invalidate(1, wordsNumber = $$props.wordsNumber);
    		if ('myWordle' in $$props) myWordle = $$props.myWordle;
    		if ('isWordGenerated' in $$props) $$invalidate(2, isWordGenerated = $$props.isWordGenerated);
    		if ('gameLost' in $$props) $$invalidate(3, gameLost = $$props.gameLost);
    		if ('screenWidth' in $$props) $$invalidate(4, screenWidth = $$props.screenWidth);
    		if ('guessedWord' in $$props) $$invalidate(5, guessedWord = $$props.guessedWord);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		wordChosen,
    		wordsNumber,
    		isWordGenerated,
    		gameLost,
    		screenWidth,
    		guessedWord,
    		wordGuessed,
    		restart,
    		word_guessWord_binding
    	];
    }

    class Wordle extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$e, create_fragment$e, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Wordle",
    			options,
    			id: create_fragment$e.name
    		});
    	}
    }

    /* src\component\memory\Card.svelte generated by Svelte v3.53.1 */
    const file$d = "src\\component\\memory\\Card.svelte";

    // (74:0) {:else}
    function create_else_block$2(ctx) {
    	let div;
    	let img;
    	let img_src_value;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			div = element("div");
    			img = element("img");
    			if (!src_url_equal(img.src, img_src_value = "images/logo-card.png")) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", "logo");
    			attr_dev(img, "class", "svelte-vdc78n");
    			add_location(img, file$d, 76, 8, 2839);
    			attr_dev(div, "class", "card back svelte-vdc78n");
    			toggle_class(div, "mobile", /*screenWidth*/ ctx[3] < 500);
    			add_location(div, file$d, 75, 4, 2747);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, img);

    			if (!mounted) {
    				dispose = listen_dev(div, "click", /*selectCard*/ ctx[4], false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*screenWidth*/ 8) {
    				toggle_class(div, "mobile", /*screenWidth*/ ctx[3] < 500);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$2.name,
    		type: "else",
    		source: "(74:0) {:else}",
    		ctx
    	});

    	return block;
    }

    // (67:25) 
    function create_if_block_1$5(ctx) {
    	let div1;
    	let div0;
    	let img;
    	let img_src_value;
    	let img_alt_value;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			div0 = element("div");
    			img = element("img");
    			if (!src_url_equal(img.src, img_src_value = /*cardInfo*/ ctx[1].src)) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", img_alt_value = /*cardInfo*/ ctx[1].name);
    			attr_dev(img, "class", "svelte-vdc78n");
    			add_location(img, file$d, 70, 12, 2594);
    			attr_dev(div0, "class", "imgContainer");
    			add_location(div0, file$d, 69, 8, 2553);
    			attr_dev(div1, "class", "card svelte-vdc78n");
    			toggle_class(div1, "mobile", /*screenWidth*/ ctx[3] < 500);
    			add_location(div1, file$d, 68, 4, 2466);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			append_dev(div1, div0);
    			append_dev(div0, img);

    			if (!mounted) {
    				dispose = listen_dev(div1, "click", /*selectCard*/ ctx[4], false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*cardInfo*/ 2 && !src_url_equal(img.src, img_src_value = /*cardInfo*/ ctx[1].src)) {
    				attr_dev(img, "src", img_src_value);
    			}

    			if (dirty & /*cardInfo*/ 2 && img_alt_value !== (img_alt_value = /*cardInfo*/ ctx[1].name)) {
    				attr_dev(img, "alt", img_alt_value);
    			}

    			if (dirty & /*screenWidth*/ 8) {
    				toggle_class(div1, "mobile", /*screenWidth*/ ctx[3] < 500);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$5.name,
    		type: "if",
    		source: "(67:25) ",
    		ctx
    	});

    	return block;
    }

    // (61:0) {#if couplesFound[cardInfo.index]}
    function create_if_block$7(ctx) {
    	let div1;
    	let div0;
    	let img;
    	let img_src_value;
    	let img_alt_value;

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			div0 = element("div");
    			img = element("img");
    			if (!src_url_equal(img.src, img_src_value = /*cardInfo*/ ctx[1].src)) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", img_alt_value = /*cardInfo*/ ctx[1].name);
    			attr_dev(img, "class", "svelte-vdc78n");
    			add_location(img, file$d, 63, 12, 2299);
    			attr_dev(div0, "class", "imgContainer");
    			add_location(div0, file$d, 62, 8, 2258);
    			attr_dev(div1, "class", "card found svelte-vdc78n");
    			toggle_class(div1, "mobile", /*screenWidth*/ ctx[3] < 500);
    			add_location(div1, file$d, 61, 4, 2187);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			append_dev(div1, div0);
    			append_dev(div0, img);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*cardInfo*/ 2 && !src_url_equal(img.src, img_src_value = /*cardInfo*/ ctx[1].src)) {
    				attr_dev(img, "src", img_src_value);
    			}

    			if (dirty & /*cardInfo*/ 2 && img_alt_value !== (img_alt_value = /*cardInfo*/ ctx[1].name)) {
    				attr_dev(img, "alt", img_alt_value);
    			}

    			if (dirty & /*screenWidth*/ 8) {
    				toggle_class(div1, "mobile", /*screenWidth*/ ctx[3] < 500);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$7.name,
    		type: "if",
    		source: "(61:0) {#if couplesFound[cardInfo.index]}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$d(ctx) {
    	let if_block_anchor;

    	function select_block_type(ctx, dirty) {
    		if (/*couplesFound*/ ctx[0][/*cardInfo*/ ctx[1].index]) return create_if_block$7;
    		if (/*thisCardChosen*/ ctx[2]) return create_if_block_1$5;
    		return create_else_block$2;
    	}

    	let current_block_type = select_block_type(ctx);
    	let if_block = current_block_type(ctx);

    	const block = {
    		c: function create() {
    			if_block.c();
    			if_block_anchor = empty();
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    		},
    		p: function update(ctx, [dirty]) {
    			if (current_block_type === (current_block_type = select_block_type(ctx)) && if_block) {
    				if_block.p(ctx, dirty);
    			} else {
    				if_block.d(1);
    				if_block = current_block_type(ctx);

    				if (if_block) {
    					if_block.c();
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$d.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$d($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Card', slots, []);
    	let { cardInfo } = $$props;
    	let { cardChosen } = $$props;
    	let { thisCardChosen = false } = $$props;
    	let { statusCardsChosen = [] } = $$props;
    	let { couplesFound = [] } = $$props;
    	var screenWidth = window.innerWidth;

    	window.addEventListener("resize", function (event) {
    		$$invalidate(3, screenWidth = window.innerWidth);
    	});

    	const dispatch = createEventDispatcher();

    	const selectCard = () => {
    		let trueCount = 0;

    		statusCardsChosen.forEach(status => {
    			if (status) trueCount++;
    		});

    		if (trueCount < 2) {
    			$$invalidate(6, statusCardsChosen[cardInfo.index] = true, statusCardsChosen);

    			if (cardChosen?.id == cardInfo.id) {
    				$$invalidate(6, statusCardsChosen[cardInfo.index] = false, statusCardsChosen);
    				$$invalidate(5, cardChosen = null);
    				dispatch('cardSelected');
    			} else {
    				if (cardChosen && cardChosen != cardInfo && trueCount == 1) {
    					setTimeout(
    						function () {
    							for (let index = 0; index < statusCardsChosen.length; index++) {
    								$$invalidate(6, statusCardsChosen[index] = false, statusCardsChosen);
    								dispatch('cardSelected');
    							}
    						},
    						2000
    					);

    					if (cardChosen?.coupleId == cardInfo.coupleId) {
    						$$invalidate(0, couplesFound[cardChosen.index] = true, couplesFound);
    						$$invalidate(0, couplesFound[cardInfo.index] = true, couplesFound);
    						let allTrue = true;

    						for (let i = 0; i < couplesFound.length; i++) {
    							if (!couplesFound[i]) allTrue = false;
    						}

    						if (allTrue) firework();
    					}

    					$$invalidate(5, cardChosen = null);
    					dispatch('cardSelected');
    				} else {
    					$$invalidate(5, cardChosen = cardInfo);
    					dispatch('cardSelected');
    				}
    			}
    		}
    	};

    	$$self.$$.on_mount.push(function () {
    		if (cardInfo === undefined && !('cardInfo' in $$props || $$self.$$.bound[$$self.$$.props['cardInfo']])) {
    			console.warn("<Card> was created without expected prop 'cardInfo'");
    		}

    		if (cardChosen === undefined && !('cardChosen' in $$props || $$self.$$.bound[$$self.$$.props['cardChosen']])) {
    			console.warn("<Card> was created without expected prop 'cardChosen'");
    		}
    	});

    	const writable_props = [
    		'cardInfo',
    		'cardChosen',
    		'thisCardChosen',
    		'statusCardsChosen',
    		'couplesFound'
    	];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Card> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('cardInfo' in $$props) $$invalidate(1, cardInfo = $$props.cardInfo);
    		if ('cardChosen' in $$props) $$invalidate(5, cardChosen = $$props.cardChosen);
    		if ('thisCardChosen' in $$props) $$invalidate(2, thisCardChosen = $$props.thisCardChosen);
    		if ('statusCardsChosen' in $$props) $$invalidate(6, statusCardsChosen = $$props.statusCardsChosen);
    		if ('couplesFound' in $$props) $$invalidate(0, couplesFound = $$props.couplesFound);
    	};

    	$$self.$capture_state = () => ({
    		createEventDispatcher,
    		firework,
    		cardInfo,
    		cardChosen,
    		thisCardChosen,
    		statusCardsChosen,
    		couplesFound,
    		screenWidth,
    		dispatch,
    		selectCard
    	});

    	$$self.$inject_state = $$props => {
    		if ('cardInfo' in $$props) $$invalidate(1, cardInfo = $$props.cardInfo);
    		if ('cardChosen' in $$props) $$invalidate(5, cardChosen = $$props.cardChosen);
    		if ('thisCardChosen' in $$props) $$invalidate(2, thisCardChosen = $$props.thisCardChosen);
    		if ('statusCardsChosen' in $$props) $$invalidate(6, statusCardsChosen = $$props.statusCardsChosen);
    		if ('couplesFound' in $$props) $$invalidate(0, couplesFound = $$props.couplesFound);
    		if ('screenWidth' in $$props) $$invalidate(3, screenWidth = $$props.screenWidth);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		couplesFound,
    		cardInfo,
    		thisCardChosen,
    		screenWidth,
    		selectCard,
    		cardChosen,
    		statusCardsChosen
    	];
    }

    class Card extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$d, create_fragment$d, safe_not_equal, {
    			cardInfo: 1,
    			cardChosen: 5,
    			thisCardChosen: 2,
    			statusCardsChosen: 6,
    			couplesFound: 0
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Card",
    			options,
    			id: create_fragment$d.name
    		});
    	}

    	get cardInfo() {
    		throw new Error("<Card>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set cardInfo(value) {
    		throw new Error("<Card>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get cardChosen() {
    		throw new Error("<Card>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set cardChosen(value) {
    		throw new Error("<Card>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get thisCardChosen() {
    		throw new Error("<Card>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set thisCardChosen(value) {
    		throw new Error("<Card>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get statusCardsChosen() {
    		throw new Error("<Card>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set statusCardsChosen(value) {
    		throw new Error("<Card>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get couplesFound() {
    		throw new Error("<Card>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set couplesFound(value) {
    		throw new Error("<Card>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    const storedMemory = localStorage.getItem("memory");
    const memory = writable(storedMemory || 'null');
    memory.subscribe(value => {
        localStorage.setItem("memory", value);
    });

    /* src\component\memory\Memory.svelte generated by Svelte v3.53.1 */
    const file$c = "src\\component\\memory\\Memory.svelte";

    function get_each_context$7(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[17] = list[i];
    	child_ctx[18] = list;
    	child_ctx[19] = i;
    	return child_ctx;
    }

    // (112:4) <Popover placement="left" target="info">
    function create_default_slot(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Find the duplicate of each image. That's simple, right?");
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
    		id: create_default_slot.name,
    		type: "slot",
    		source: "(112:4) <Popover placement=\\\"left\\\" target=\\\"info\\\">",
    		ctx
    	});

    	return block;
    }

    // (113:8) 
    function create_title_slot(ctx) {
    	let div;
    	let t0;
    	let b;

    	const block = {
    		c: function create() {
    			div = element("div");
    			t0 = text("How to play ");
    			b = element("b");
    			b.textContent = "Memory";
    			add_location(b, file$c, 113, 20, 4019);
    			attr_dev(div, "slot", "title");
    			add_location(div, file$c, 112, 8, 3979);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, t0);
    			append_dev(div, b);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_title_slot.name,
    		type: "slot",
    		source: "(113:8) ",
    		ctx
    	});

    	return block;
    }

    // (118:4) {#if isMemorySet}
    function create_if_block$6(ctx) {
    	let each_blocks = [];
    	let each_1_lookup = new Map();
    	let each_1_anchor;
    	let current;
    	let each_value = /*listCardInfo*/ ctx[0];
    	validate_each_argument(each_value);
    	const get_key = ctx => /*cardInfo*/ ctx[17].id;
    	validate_each_keys(ctx, each_value, get_each_context$7, get_key);

    	for (let i = 0; i < each_value.length; i += 1) {
    		let child_ctx = get_each_context$7(ctx, each_value, i);
    		let key = get_key(child_ctx);
    		each_1_lookup.set(key, each_blocks[i] = create_each_block$7(key, child_ctx));
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
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*listCardInfo, statusCardsChosen, cardChosen, couplesFound, saveMemory*/ 157) {
    				each_value = /*listCardInfo*/ ctx[0];
    				validate_each_argument(each_value);
    				group_outros();
    				validate_each_keys(ctx, each_value, get_each_context$7, get_key);
    				each_blocks = update_keyed_each(each_blocks, dirty, get_key, 1, ctx, each_value, each_1_lookup, each_1_anchor.parentNode, outro_and_destroy_block, create_each_block$7, each_1_anchor, get_each_context$7);
    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;

    			for (let i = 0; i < each_value.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			current = true;
    		},
    		o: function outro(local) {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].d(detaching);
    			}

    			if (detaching) detach_dev(each_1_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$6.name,
    		type: "if",
    		source: "(118:4) {#if isMemorySet}",
    		ctx
    	});

    	return block;
    }

    // (119:8) {#each listCardInfo as cardInfo (cardInfo.id)}
    function create_each_block$7(key_1, ctx) {
    	let first;
    	let card;
    	let updating_thisCardChosen;
    	let updating_cardChosen;
    	let updating_statusCardsChosen;
    	let updating_couplesFound;
    	let current;

    	function card_thisCardChosen_binding(value) {
    		/*card_thisCardChosen_binding*/ ctx[8](value, /*cardInfo*/ ctx[17]);
    	}

    	function card_cardChosen_binding(value) {
    		/*card_cardChosen_binding*/ ctx[9](value);
    	}

    	function card_statusCardsChosen_binding(value) {
    		/*card_statusCardsChosen_binding*/ ctx[10](value);
    	}

    	function card_couplesFound_binding(value) {
    		/*card_couplesFound_binding*/ ctx[11](value);
    	}

    	let card_props = { cardInfo: /*cardInfo*/ ctx[17] };

    	if (/*statusCardsChosen*/ ctx[3][/*cardInfo*/ ctx[17].index] !== void 0) {
    		card_props.thisCardChosen = /*statusCardsChosen*/ ctx[3][/*cardInfo*/ ctx[17].index];
    	}

    	if (/*cardChosen*/ ctx[2] !== void 0) {
    		card_props.cardChosen = /*cardChosen*/ ctx[2];
    	}

    	if (/*statusCardsChosen*/ ctx[3] !== void 0) {
    		card_props.statusCardsChosen = /*statusCardsChosen*/ ctx[3];
    	}

    	if (/*couplesFound*/ ctx[4] !== void 0) {
    		card_props.couplesFound = /*couplesFound*/ ctx[4];
    	}

    	card = new Card({ props: card_props, $$inline: true });
    	binding_callbacks.push(() => bind(card, 'thisCardChosen', card_thisCardChosen_binding));
    	binding_callbacks.push(() => bind(card, 'cardChosen', card_cardChosen_binding));
    	binding_callbacks.push(() => bind(card, 'statusCardsChosen', card_statusCardsChosen_binding));
    	binding_callbacks.push(() => bind(card, 'couplesFound', card_couplesFound_binding));
    	card.$on("cardSelected", /*saveMemory*/ ctx[7]);

    	const block = {
    		key: key_1,
    		first: null,
    		c: function create() {
    			first = empty();
    			create_component(card.$$.fragment);
    			this.first = first;
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, first, anchor);
    			mount_component(card, target, anchor);
    			current = true;
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			const card_changes = {};
    			if (dirty & /*listCardInfo*/ 1) card_changes.cardInfo = /*cardInfo*/ ctx[17];

    			if (!updating_thisCardChosen && dirty & /*statusCardsChosen, listCardInfo*/ 9) {
    				updating_thisCardChosen = true;
    				card_changes.thisCardChosen = /*statusCardsChosen*/ ctx[3][/*cardInfo*/ ctx[17].index];
    				add_flush_callback(() => updating_thisCardChosen = false);
    			}

    			if (!updating_cardChosen && dirty & /*cardChosen*/ 4) {
    				updating_cardChosen = true;
    				card_changes.cardChosen = /*cardChosen*/ ctx[2];
    				add_flush_callback(() => updating_cardChosen = false);
    			}

    			if (!updating_statusCardsChosen && dirty & /*statusCardsChosen*/ 8) {
    				updating_statusCardsChosen = true;
    				card_changes.statusCardsChosen = /*statusCardsChosen*/ ctx[3];
    				add_flush_callback(() => updating_statusCardsChosen = false);
    			}

    			if (!updating_couplesFound && dirty & /*couplesFound*/ 16) {
    				updating_couplesFound = true;
    				card_changes.couplesFound = /*couplesFound*/ ctx[4];
    				add_flush_callback(() => updating_couplesFound = false);
    			}

    			card.$set(card_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(card.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(card.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(first);
    			destroy_component(card, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$7.name,
    		type: "each",
    		source: "(119:8) {#each listCardInfo as cardInfo (cardInfo.id)}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$c(ctx) {
    	let loadingscreen;
    	let t0;
    	let div1;
    	let div0;
    	let span;
    	let t2;
    	let t3;
    	let div3;
    	let button0;
    	let i0;
    	let t4;
    	let popover;
    	let t5;
    	let t6;
    	let div2;
    	let button1;
    	let t7;
    	let i1;
    	let current;
    	let mounted;
    	let dispose;
    	loadingscreen = new LoadingScreen({ $$inline: true });

    	popover = new Popover({
    			props: {
    				placement: "left",
    				target: "info",
    				$$slots: {
    					title: [create_title_slot],
    					default: [create_default_slot]
    				},
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	let if_block = /*isMemorySet*/ ctx[1] && create_if_block$6(ctx);

    	const block = {
    		c: function create() {
    			create_component(loadingscreen.$$.fragment);
    			t0 = space();
    			div1 = element("div");
    			div0 = element("div");
    			span = element("span");
    			span.textContent = "M";
    			t2 = text("EMORY");
    			t3 = space();
    			div3 = element("div");
    			button0 = element("button");
    			i0 = element("i");
    			t4 = space();
    			create_component(popover.$$.fragment);
    			t5 = space();
    			if (if_block) if_block.c();
    			t6 = space();
    			div2 = element("div");
    			button1 = element("button");
    			t7 = text("RESTART");
    			i1 = element("i");
    			attr_dev(span, "class", "capital");
    			add_location(span, file$c, 107, 65, 3744);
    			attr_dev(div0, "class", "titlepage");
    			toggle_class(div0, "titlepagemob", /*screenWidth*/ ctx[5] < 500);
    			add_location(div0, file$c, 107, 4, 3683);
    			attr_dev(div1, "class", "container");
    			add_location(div1, file$c, 106, 0, 3654);
    			attr_dev(i0, "class", "bi-info-circle svelte-xs2a8t");
    			toggle_class(i0, "imob", /*screenWidth*/ ctx[5] < 500);
    			add_location(i0, file$c, 110, 22, 3855);
    			attr_dev(button0, "id", "info");
    			attr_dev(button0, "class", "svelte-xs2a8t");
    			add_location(button0, file$c, 110, 4, 3837);
    			attr_dev(i1, "class", "bi-arrow-clockwise svelte-xs2a8t");
    			add_location(i1, file$c, 124, 118, 4638);
    			set_style(button1, "border-radius", "10px");
    			set_style(button1, "margin-top", "20px");
    			set_style(button1, "border", "3px solid black");
    			add_location(button1, file$c, 124, 8, 4528);
    			set_style(div2, "width", "100%");
    			set_style(div2, "text-align", "center");
    			add_location(div2, file$c, 123, 4, 4474);
    			attr_dev(div3, "class", "container flex content svelte-xs2a8t");
    			add_location(div3, file$c, 109, 0, 3795);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			mount_component(loadingscreen, target, anchor);
    			insert_dev(target, t0, anchor);
    			insert_dev(target, div1, anchor);
    			append_dev(div1, div0);
    			append_dev(div0, span);
    			append_dev(div0, t2);
    			insert_dev(target, t3, anchor);
    			insert_dev(target, div3, anchor);
    			append_dev(div3, button0);
    			append_dev(button0, i0);
    			append_dev(div3, t4);
    			mount_component(popover, div3, null);
    			append_dev(div3, t5);
    			if (if_block) if_block.m(div3, null);
    			append_dev(div3, t6);
    			append_dev(div3, div2);
    			append_dev(div2, button1);
    			append_dev(button1, t7);
    			append_dev(button1, i1);
    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(button1, "click", /*setupMemory*/ ctx[6], false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (!current || dirty & /*screenWidth*/ 32) {
    				toggle_class(div0, "titlepagemob", /*screenWidth*/ ctx[5] < 500);
    			}

    			if (!current || dirty & /*screenWidth*/ 32) {
    				toggle_class(i0, "imob", /*screenWidth*/ ctx[5] < 500);
    			}

    			const popover_changes = {};

    			if (dirty & /*$$scope*/ 1048576) {
    				popover_changes.$$scope = { dirty, ctx };
    			}

    			popover.$set(popover_changes);

    			if (/*isMemorySet*/ ctx[1]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);

    					if (dirty & /*isMemorySet*/ 2) {
    						transition_in(if_block, 1);
    					}
    				} else {
    					if_block = create_if_block$6(ctx);
    					if_block.c();
    					transition_in(if_block, 1);
    					if_block.m(div3, t6);
    				}
    			} else if (if_block) {
    				group_outros();

    				transition_out(if_block, 1, 1, () => {
    					if_block = null;
    				});

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(loadingscreen.$$.fragment, local);
    			transition_in(popover.$$.fragment, local);
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(loadingscreen.$$.fragment, local);
    			transition_out(popover.$$.fragment, local);
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(loadingscreen, detaching);
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(div1);
    			if (detaching) detach_dev(t3);
    			if (detaching) detach_dev(div3);
    			destroy_component(popover);
    			if (if_block) if_block.d();
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$c.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    const YOUR_ACCESS_KEY$1 = "L7Fe59lSoILjBgpWKjno9hOoHdGvby60wCspY7MS0iA";

    function instance$c($$self, $$props, $$invalidate) {
    	let $memory;
    	validate_store(memory, 'memory');
    	component_subscribe($$self, memory, $$value => $$invalidate(13, $memory = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Memory', slots, []);
    	var listCardInfo = [];
    	var numberOfCouples = 9;
    	var isMemorySet = false;
    	var cardChosen;
    	var statusCardsChosen = [];
    	var couplesFound = [];
    	var myMemory = JSON.parse($memory);
    	var screenWidth = window.innerWidth;

    	window.addEventListener("resize", function (event) {
    		$$invalidate(5, screenWidth = window.innerWidth);
    	});

    	const setupMemory = () => {
    		memory.set(JSON.stringify(null));
    		$$invalidate(0, listCardInfo = []);
    		$$invalidate(3, statusCardsChosen = []);
    		$$invalidate(4, couplesFound = []);
    		$$invalidate(2, cardChosen = null);

    		for (var i = 0; i < numberOfCouples; i++) {
    			setTimeout(
    				function () {
    					setupCardInfo();
    					$$invalidate(3, statusCardsChosen = [...statusCardsChosen, false]);
    					$$invalidate(3, statusCardsChosen = [...statusCardsChosen, false]);
    					$$invalidate(4, couplesFound = [...couplesFound, false]);
    					$$invalidate(4, couplesFound = [...couplesFound, false]);
    				},
    				200 * i
    			);
    		}

    		$$invalidate(1, isMemorySet = true);
    	};

    	const setupCardInfo = () => {
    		var animal = randomAnimal().trim().split(/\s+/);
    		animal = animal[animal.length - 1];

    		fetch("https://api.unsplash.com/search/photos?client_id=" + YOUR_ACCESS_KEY$1 + "&query=" + animal + "&per_page=3").then(result => {
    			return result.json();
    		}).then(data => {
    			var index = Math.floor(Math.random() * data.results.length);
    			if (!data.results[index]) index = 0;

    			$$invalidate(0, listCardInfo = [
    				...listCardInfo,
    				{
    					src: data.results[index].urls.regular,
    					coupleId: statusCardsChosen.length,
    					id: listCardInfo.length,
    					index: listCardInfo.length,
    					name: animal
    				}
    			]);

    			$$invalidate(0, listCardInfo = [
    				...listCardInfo,
    				{
    					src: data.results[index].urls.regular,
    					coupleId: statusCardsChosen.length,
    					id: listCardInfo.length,
    					index: listCardInfo.length,
    					name: animal
    				}
    			]);

    			if (listCardInfo.length == numberOfCouples * 2) {
    				mixList();
    			}
    		});
    	};

    	const mixList = () => {
    		var index = Math.floor(Math.random() * listCardInfo.length);
    		var elementToAdd = listCardInfo.splice(index, 1);

    		for (var i = 0; i < 20; i++) {
    			index = Math.floor(Math.random() * listCardInfo.length);
    			elementToAdd = listCardInfo.splice(index, 1, elementToAdd[0]);
    			if (i == 19) $$invalidate(0, listCardInfo = [...listCardInfo, elementToAdd[0]]);
    		}
    	};

    	const saveMemory = () => {
    		myMemory = {
    			listCardInfo,
    			statusCardsChosen,
    			cardChosen,
    			couplesFound
    		};

    		memory.set(JSON.stringify(myMemory));
    	};

    	tick().then(() => {
    		if (myMemory) {
    			$$invalidate(0, listCardInfo = myMemory.listCardInfo);
    			$$invalidate(3, statusCardsChosen = myMemory.statusCardsChosen);
    			$$invalidate(2, cardChosen = myMemory.cardChosen);
    			$$invalidate(4, couplesFound = myMemory.couplesFound);
    			$$invalidate(1, isMemorySet = true);
    		} else {
    			setupMemory();
    		}
    	});

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Memory> was created with unknown prop '${key}'`);
    	});

    	function card_thisCardChosen_binding(value, cardInfo) {
    		if ($$self.$$.not_equal(statusCardsChosen[cardInfo.index], value)) {
    			statusCardsChosen[cardInfo.index] = value;
    			$$invalidate(3, statusCardsChosen);
    		}
    	}

    	function card_cardChosen_binding(value) {
    		cardChosen = value;
    		$$invalidate(2, cardChosen);
    	}

    	function card_statusCardsChosen_binding(value) {
    		statusCardsChosen = value;
    		$$invalidate(3, statusCardsChosen);
    	}

    	function card_couplesFound_binding(value) {
    		couplesFound = value;
    		$$invalidate(4, couplesFound);
    	}

    	$$self.$capture_state = () => ({
    		Card,
    		tick,
    		Popover,
    		memory,
    		LoadingScreen,
    		YOUR_ACCESS_KEY: YOUR_ACCESS_KEY$1,
    		listCardInfo,
    		numberOfCouples,
    		isMemorySet,
    		cardChosen,
    		statusCardsChosen,
    		couplesFound,
    		myMemory,
    		screenWidth,
    		setupMemory,
    		setupCardInfo,
    		mixList,
    		saveMemory,
    		$memory
    	});

    	$$self.$inject_state = $$props => {
    		if ('listCardInfo' in $$props) $$invalidate(0, listCardInfo = $$props.listCardInfo);
    		if ('numberOfCouples' in $$props) numberOfCouples = $$props.numberOfCouples;
    		if ('isMemorySet' in $$props) $$invalidate(1, isMemorySet = $$props.isMemorySet);
    		if ('cardChosen' in $$props) $$invalidate(2, cardChosen = $$props.cardChosen);
    		if ('statusCardsChosen' in $$props) $$invalidate(3, statusCardsChosen = $$props.statusCardsChosen);
    		if ('couplesFound' in $$props) $$invalidate(4, couplesFound = $$props.couplesFound);
    		if ('myMemory' in $$props) myMemory = $$props.myMemory;
    		if ('screenWidth' in $$props) $$invalidate(5, screenWidth = $$props.screenWidth);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		listCardInfo,
    		isMemorySet,
    		cardChosen,
    		statusCardsChosen,
    		couplesFound,
    		screenWidth,
    		setupMemory,
    		saveMemory,
    		card_thisCardChosen_binding,
    		card_cardChosen_binding,
    		card_statusCardsChosen_binding,
    		card_couplesFound_binding
    	];
    }

    class Memory extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$c, create_fragment$c, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Memory",
    			options,
    			id: create_fragment$c.name
    		});
    	}
    }

    /* src\component\animalInfo\AnimalModal.svelte generated by Svelte v3.53.1 */
    const file$b = "src\\component\\animalInfo\\AnimalModal.svelte";

    function get_each_context$6(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[4] = list[i];
    	return child_ctx;
    }

    // (9:0) {#if isModalOpen}
    function create_if_block$5(ctx) {
    	let div7;
    	let div6;
    	let div5;
    	let div1;
    	let div0;
    	let img;
    	let img_src_value;
    	let img_alt_value;
    	let t0;
    	let div4;
    	let div2;
    	let t1_value = /*info*/ ctx[1].name + "";
    	let t1;
    	let button;
    	let i;
    	let t2;
    	let div3;
    	let t4;
    	let ul;
    	let li0;
    	let t5;
    	let t6_value = /*info*/ ctx[1].taxonomy.kingdom + "";
    	let t6;
    	let t7;
    	let li1;
    	let t8;
    	let t9_value = /*info*/ ctx[1].taxonomy.phylum + "";
    	let t9;
    	let t10;
    	let li2;
    	let t11;
    	let t12_value = /*info*/ ctx[1].taxonomy.class + "";
    	let t12;
    	let t13;
    	let li3;
    	let t14;
    	let t15_value = /*info*/ ctx[1].taxonomy.order + "";
    	let t15;
    	let t16;
    	let li4;
    	let t17;
    	let t18_value = /*info*/ ctx[1].taxonomy.family + "";
    	let t18;
    	let t19;
    	let t20;
    	let li5;
    	let t21;
    	let t22_value = /*info*/ ctx[1].taxonomy.scientific_name + "";
    	let t22;
    	let t23;
    	let t24;
    	let div7_transition;
    	let current;
    	let mounted;
    	let dispose;
    	let if_block0 = /*info*/ ctx[1].taxonomy.genus && create_if_block_32$1(ctx);
    	let if_block1 = /*info*/ ctx[1].locations && create_if_block_31$1(ctx);
    	let if_block2 = /*info*/ ctx[1].characteristics && create_if_block_1$4(ctx);

    	const block = {
    		c: function create() {
    			div7 = element("div");
    			div6 = element("div");
    			div5 = element("div");
    			div1 = element("div");
    			div0 = element("div");
    			img = element("img");
    			t0 = space();
    			div4 = element("div");
    			div2 = element("div");
    			t1 = text(t1_value);
    			button = element("button");
    			i = element("i");
    			t2 = space();
    			div3 = element("div");
    			div3.textContent = "Taxonomy:";
    			t4 = space();
    			ul = element("ul");
    			li0 = element("li");
    			t5 = text("Kingdom: ");
    			t6 = text(t6_value);
    			t7 = space();
    			li1 = element("li");
    			t8 = text("Phylum: ");
    			t9 = text(t9_value);
    			t10 = space();
    			li2 = element("li");
    			t11 = text("Class: ");
    			t12 = text(t12_value);
    			t13 = space();
    			li3 = element("li");
    			t14 = text("Order: ");
    			t15 = text(t15_value);
    			t16 = space();
    			li4 = element("li");
    			t17 = text("Family: ");
    			t18 = text(t18_value);
    			t19 = space();
    			if (if_block0) if_block0.c();
    			t20 = space();
    			li5 = element("li");
    			t21 = text("Scientific Name: ");
    			t22 = text(t22_value);
    			t23 = space();
    			if (if_block1) if_block1.c();
    			t24 = space();
    			if (if_block2) if_block2.c();
    			attr_dev(img, "id", "animalInfoImg");
    			if (!src_url_equal(img.src, img_src_value = /*imgSrc*/ ctx[2])) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", img_alt_value = /*info*/ ctx[1].name);
    			attr_dev(img, "class", "svelte-rf5tr3");
    			add_location(img, file$b, 15, 24, 450);
    			attr_dev(div0, "class", "imgContainer svelte-rf5tr3");
    			add_location(div0, file$b, 14, 20, 397);
    			attr_dev(div1, "class", "col");
    			add_location(div1, file$b, 13, 16, 358);
    			attr_dev(i, "class", "bi-zoom-out");
    			add_location(i, file$b, 20, 97, 735);
    			attr_dev(button, "class", "openModalBtn svelte-rf5tr3");
    			add_location(button, file$b, 20, 35, 673);
    			attr_dev(div2, "class", "animalName svelte-rf5tr3");
    			add_location(div2, file$b, 19, 20, 612);
    			attr_dev(div3, "class", "animalInfo svelte-rf5tr3");
    			add_location(div3, file$b, 22, 20, 821);
    			add_location(li0, file$b, 24, 24, 929);
    			add_location(li1, file$b, 25, 24, 996);
    			add_location(li2, file$b, 26, 24, 1061);
    			add_location(li3, file$b, 27, 24, 1124);
    			add_location(li4, file$b, 28, 24, 1187);
    			add_location(li5, file$b, 32, 24, 1401);
    			attr_dev(ul, "class", "infoList svelte-rf5tr3");
    			add_location(ul, file$b, 23, 20, 882);
    			attr_dev(div4, "class", "col");
    			add_location(div4, file$b, 18, 16, 573);
    			attr_dev(div5, "class", "row align-items-start container-fluid");
    			add_location(div5, file$b, 11, 12, 270);
    			attr_dev(div6, "class", "animalModal content svelte-rf5tr3");
    			add_location(div6, file$b, 10, 8, 223);
    			attr_dev(div7, "class", "backdrop flex svelte-rf5tr3");
    			add_location(div7, file$b, 9, 4, 170);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div7, anchor);
    			append_dev(div7, div6);
    			append_dev(div6, div5);
    			append_dev(div5, div1);
    			append_dev(div1, div0);
    			append_dev(div0, img);
    			append_dev(div5, t0);
    			append_dev(div5, div4);
    			append_dev(div4, div2);
    			append_dev(div2, t1);
    			append_dev(div2, button);
    			append_dev(button, i);
    			append_dev(div4, t2);
    			append_dev(div4, div3);
    			append_dev(div4, t4);
    			append_dev(div4, ul);
    			append_dev(ul, li0);
    			append_dev(li0, t5);
    			append_dev(li0, t6);
    			append_dev(ul, t7);
    			append_dev(ul, li1);
    			append_dev(li1, t8);
    			append_dev(li1, t9);
    			append_dev(ul, t10);
    			append_dev(ul, li2);
    			append_dev(li2, t11);
    			append_dev(li2, t12);
    			append_dev(ul, t13);
    			append_dev(ul, li3);
    			append_dev(li3, t14);
    			append_dev(li3, t15);
    			append_dev(ul, t16);
    			append_dev(ul, li4);
    			append_dev(li4, t17);
    			append_dev(li4, t18);
    			append_dev(ul, t19);
    			if (if_block0) if_block0.m(ul, null);
    			append_dev(ul, t20);
    			append_dev(ul, li5);
    			append_dev(li5, t21);
    			append_dev(li5, t22);
    			append_dev(div4, t23);
    			if (if_block1) if_block1.m(div4, null);
    			append_dev(div4, t24);
    			if (if_block2) if_block2.m(div4, null);
    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(button, "click", /*click_handler*/ ctx[3], false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (!current || dirty & /*imgSrc*/ 4 && !src_url_equal(img.src, img_src_value = /*imgSrc*/ ctx[2])) {
    				attr_dev(img, "src", img_src_value);
    			}

    			if (!current || dirty & /*info*/ 2 && img_alt_value !== (img_alt_value = /*info*/ ctx[1].name)) {
    				attr_dev(img, "alt", img_alt_value);
    			}

    			if ((!current || dirty & /*info*/ 2) && t1_value !== (t1_value = /*info*/ ctx[1].name + "")) set_data_dev(t1, t1_value);
    			if ((!current || dirty & /*info*/ 2) && t6_value !== (t6_value = /*info*/ ctx[1].taxonomy.kingdom + "")) set_data_dev(t6, t6_value);
    			if ((!current || dirty & /*info*/ 2) && t9_value !== (t9_value = /*info*/ ctx[1].taxonomy.phylum + "")) set_data_dev(t9, t9_value);
    			if ((!current || dirty & /*info*/ 2) && t12_value !== (t12_value = /*info*/ ctx[1].taxonomy.class + "")) set_data_dev(t12, t12_value);
    			if ((!current || dirty & /*info*/ 2) && t15_value !== (t15_value = /*info*/ ctx[1].taxonomy.order + "")) set_data_dev(t15, t15_value);
    			if ((!current || dirty & /*info*/ 2) && t18_value !== (t18_value = /*info*/ ctx[1].taxonomy.family + "")) set_data_dev(t18, t18_value);

    			if (/*info*/ ctx[1].taxonomy.genus) {
    				if (if_block0) {
    					if_block0.p(ctx, dirty);
    				} else {
    					if_block0 = create_if_block_32$1(ctx);
    					if_block0.c();
    					if_block0.m(ul, t20);
    				}
    			} else if (if_block0) {
    				if_block0.d(1);
    				if_block0 = null;
    			}

    			if ((!current || dirty & /*info*/ 2) && t22_value !== (t22_value = /*info*/ ctx[1].taxonomy.scientific_name + "")) set_data_dev(t22, t22_value);

    			if (/*info*/ ctx[1].locations) {
    				if (if_block1) {
    					if_block1.p(ctx, dirty);
    				} else {
    					if_block1 = create_if_block_31$1(ctx);
    					if_block1.c();
    					if_block1.m(div4, t24);
    				}
    			} else if (if_block1) {
    				if_block1.d(1);
    				if_block1 = null;
    			}

    			if (/*info*/ ctx[1].characteristics) {
    				if (if_block2) {
    					if_block2.p(ctx, dirty);
    				} else {
    					if_block2 = create_if_block_1$4(ctx);
    					if_block2.c();
    					if_block2.m(div4, null);
    				}
    			} else if (if_block2) {
    				if_block2.d(1);
    				if_block2 = null;
    			}
    		},
    		i: function intro(local) {
    			if (current) return;

    			add_render_callback(() => {
    				if (!div7_transition) div7_transition = create_bidirectional_transition(div7, fade, {}, true);
    				div7_transition.run(1);
    			});

    			current = true;
    		},
    		o: function outro(local) {
    			if (!div7_transition) div7_transition = create_bidirectional_transition(div7, fade, {}, false);
    			div7_transition.run(0);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div7);
    			if (if_block0) if_block0.d();
    			if (if_block1) if_block1.d();
    			if (if_block2) if_block2.d();
    			if (detaching && div7_transition) div7_transition.end();
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$5.name,
    		type: "if",
    		source: "(9:0) {#if isModalOpen}",
    		ctx
    	});

    	return block;
    }

    // (30:24) {#if info.taxonomy.genus}
    function create_if_block_32$1(ctx) {
    	let li;
    	let t0;
    	let t1_value = /*info*/ ctx[1].taxonomy.genus + "";
    	let t1;

    	const block = {
    		c: function create() {
    			li = element("li");
    			t0 = text("Genus: ");
    			t1 = text(t1_value);
    			add_location(li, file$b, 30, 28, 1307);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, li, anchor);
    			append_dev(li, t0);
    			append_dev(li, t1);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*info*/ 2 && t1_value !== (t1_value = /*info*/ ctx[1].taxonomy.genus + "")) set_data_dev(t1, t1_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(li);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_32$1.name,
    		type: "if",
    		source: "(30:24) {#if info.taxonomy.genus}",
    		ctx
    	});

    	return block;
    }

    // (35:20) {#if info.locations}
    function create_if_block_31$1(ctx) {
    	let div;
    	let t1;
    	let ul;
    	let each_value = /*info*/ ctx[1].locations;
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$6(get_each_context$6(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			div = element("div");
    			div.textContent = "Locations:";
    			t1 = space();
    			ul = element("ul");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr_dev(div, "class", "animalInfo svelte-rf5tr3");
    			add_location(div, file$b, 35, 24, 1553);
    			attr_dev(ul, "class", "infoList svelte-rf5tr3");
    			add_location(ul, file$b, 36, 24, 1620);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, ul, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(ul, null);
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*info*/ 2) {
    				each_value = /*info*/ ctx[1].locations;
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$6(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block$6(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(ul, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(ul);
    			destroy_each(each_blocks, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_31$1.name,
    		type: "if",
    		source: "(35:20) {#if info.locations}",
    		ctx
    	});

    	return block;
    }

    // (38:28) {#each info.locations as location}
    function create_each_block$6(ctx) {
    	let li;
    	let t_value = /*location*/ ctx[4] + "";
    	let t;

    	const block = {
    		c: function create() {
    			li = element("li");
    			t = text(t_value);
    			add_location(li, file$b, 38, 32, 1739);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, li, anchor);
    			append_dev(li, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*info*/ 2 && t_value !== (t_value = /*location*/ ctx[4] + "")) set_data_dev(t, t_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(li);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$6.name,
    		type: "each",
    		source: "(38:28) {#each info.locations as location}",
    		ctx
    	});

    	return block;
    }

    // (43:20) {#if info.characteristics}
    function create_if_block_1$4(ctx) {
    	let div;
    	let t1;
    	let ul;
    	let t2;
    	let t3;
    	let t4;
    	let t5;
    	let t6;
    	let t7;
    	let t8;
    	let t9;
    	let t10;
    	let t11;
    	let t12;
    	let t13;
    	let t14;
    	let t15;
    	let t16;
    	let t17;
    	let t18;
    	let t19;
    	let t20;
    	let t21;
    	let t22;
    	let t23;
    	let t24;
    	let t25;
    	let t26;
    	let t27;
    	let if_block0 = /*info*/ ctx[1].characteristics.common_name && create_if_block_30$1(ctx);
    	let if_block1 = /*info*/ ctx[1].characteristics.name_of_young && create_if_block_29$1(ctx);
    	let if_block2 = /*info*/ ctx[1].characteristics.slogan && create_if_block_28$1(ctx);
    	let if_block3 = /*info*/ ctx[1].characteristics.most_distinctive_feature && create_if_block_27$1(ctx);
    	let if_block4 = /*info*/ ctx[1].characteristics.temperament && create_if_block_26$1(ctx);
    	let if_block5 = /*info*/ ctx[1].characteristics.diet && create_if_block_25$1(ctx);
    	let if_block6 = /*info*/ ctx[1].characteristics.favorite_food && create_if_block_24$1(ctx);

    	function select_block_type(ctx, dirty) {
    		if (/*info*/ ctx[1].characteristics.prey) return create_if_block_22$1;
    		if (/*info*/ ctx[1].characteristics.main_prey) return create_if_block_23$1;
    	}

    	let current_block_type = select_block_type(ctx);
    	let if_block7 = current_block_type && current_block_type(ctx);
    	let if_block8 = /*info*/ ctx[1].characteristics.predators && create_if_block_21$1(ctx);
    	let if_block9 = /*info*/ ctx[1].characteristics.habitat && create_if_block_20$1(ctx);
    	let if_block10 = /*info*/ ctx[1].characteristics.origin && create_if_block_19$1(ctx);
    	let if_block11 = /*info*/ ctx[1].characteristics.location && create_if_block_18$1(ctx);
    	let if_block12 = /*info*/ ctx[1].characteristics.water_type && create_if_block_17$1(ctx);

    	function select_block_type_1(ctx, dirty) {
    		if (/*info*/ ctx[1].characteristics.group) return create_if_block_15$1;
    		if (/*info*/ ctx[1].characteristics.type) return create_if_block_16$1;
    	}

    	let current_block_type_1 = select_block_type_1(ctx);
    	let if_block13 = current_block_type_1 && current_block_type_1(ctx);
    	let if_block14 = /*info*/ ctx[1].characteristics.group_behavior && create_if_block_14$1(ctx);
    	let if_block15 = /*info*/ ctx[1].characteristics.estimated_population_size && create_if_block_13$1(ctx);
    	let if_block16 = /*info*/ ctx[1].characteristics.number_of_species && create_if_block_12$1(ctx);
    	let if_block17 = /*info*/ ctx[1].characteristics.skin_type && create_if_block_11$1(ctx);
    	let if_block18 = /*info*/ ctx[1].characteristics.top_speed && create_if_block_10$1(ctx);
    	let if_block19 = /*info*/ ctx[1].characteristics.lifespan && create_if_block_9$1(ctx);
    	let if_block20 = /*info*/ ctx[1].characteristics.weight && create_if_block_8$1(ctx);
    	let if_block21 = /*info*/ ctx[1].characteristics.height && create_if_block_7$1(ctx);
    	let if_block22 = /*info*/ ctx[1].characteristics.length && create_if_block_6$1(ctx);
    	let if_block23 = /*info*/ ctx[1].characteristics.age_of_sexual_maturity && create_if_block_5$1(ctx);
    	let if_block24 = /*info*/ ctx[1].characteristics.age_of_weaning && create_if_block_4$1(ctx);
    	let if_block25 = /*info*/ ctx[1].characteristics.average_litter_size && create_if_block_3$1(ctx);
    	let if_block26 = /*info*/ ctx[1].characteristics.gestation_period && create_if_block_2$2(ctx);

    	const block = {
    		c: function create() {
    			div = element("div");
    			div.textContent = "Characteristics:";
    			t1 = space();
    			ul = element("ul");
    			if (if_block0) if_block0.c();
    			t2 = space();
    			if (if_block1) if_block1.c();
    			t3 = space();
    			if (if_block2) if_block2.c();
    			t4 = space();
    			if (if_block3) if_block3.c();
    			t5 = space();
    			if (if_block4) if_block4.c();
    			t6 = space();
    			if (if_block5) if_block5.c();
    			t7 = space();
    			if (if_block6) if_block6.c();
    			t8 = space();
    			if (if_block7) if_block7.c();
    			t9 = space();
    			if (if_block8) if_block8.c();
    			t10 = space();
    			if (if_block9) if_block9.c();
    			t11 = space();
    			if (if_block10) if_block10.c();
    			t12 = space();
    			if (if_block11) if_block11.c();
    			t13 = space();
    			if (if_block12) if_block12.c();
    			t14 = space();
    			if (if_block13) if_block13.c();
    			t15 = space();
    			if (if_block14) if_block14.c();
    			t16 = space();
    			if (if_block15) if_block15.c();
    			t17 = space();
    			if (if_block16) if_block16.c();
    			t18 = space();
    			if (if_block17) if_block17.c();
    			t19 = space();
    			if (if_block18) if_block18.c();
    			t20 = space();
    			if (if_block19) if_block19.c();
    			t21 = space();
    			if (if_block20) if_block20.c();
    			t22 = space();
    			if (if_block21) if_block21.c();
    			t23 = space();
    			if (if_block22) if_block22.c();
    			t24 = space();
    			if (if_block23) if_block23.c();
    			t25 = space();
    			if (if_block24) if_block24.c();
    			t26 = space();
    			if (if_block25) if_block25.c();
    			t27 = space();
    			if (if_block26) if_block26.c();
    			attr_dev(div, "class", "animalInfo svelte-rf5tr3");
    			add_location(div, file$b, 43, 24, 1927);
    			attr_dev(ul, "class", "infoList svelte-rf5tr3");
    			add_location(ul, file$b, 44, 24, 2000);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, ul, anchor);
    			if (if_block0) if_block0.m(ul, null);
    			append_dev(ul, t2);
    			if (if_block1) if_block1.m(ul, null);
    			append_dev(ul, t3);
    			if (if_block2) if_block2.m(ul, null);
    			append_dev(ul, t4);
    			if (if_block3) if_block3.m(ul, null);
    			append_dev(ul, t5);
    			if (if_block4) if_block4.m(ul, null);
    			append_dev(ul, t6);
    			if (if_block5) if_block5.m(ul, null);
    			append_dev(ul, t7);
    			if (if_block6) if_block6.m(ul, null);
    			append_dev(ul, t8);
    			if (if_block7) if_block7.m(ul, null);
    			append_dev(ul, t9);
    			if (if_block8) if_block8.m(ul, null);
    			append_dev(ul, t10);
    			if (if_block9) if_block9.m(ul, null);
    			append_dev(ul, t11);
    			if (if_block10) if_block10.m(ul, null);
    			append_dev(ul, t12);
    			if (if_block11) if_block11.m(ul, null);
    			append_dev(ul, t13);
    			if (if_block12) if_block12.m(ul, null);
    			append_dev(ul, t14);
    			if (if_block13) if_block13.m(ul, null);
    			append_dev(ul, t15);
    			if (if_block14) if_block14.m(ul, null);
    			append_dev(ul, t16);
    			if (if_block15) if_block15.m(ul, null);
    			append_dev(ul, t17);
    			if (if_block16) if_block16.m(ul, null);
    			append_dev(ul, t18);
    			if (if_block17) if_block17.m(ul, null);
    			append_dev(ul, t19);
    			if (if_block18) if_block18.m(ul, null);
    			append_dev(ul, t20);
    			if (if_block19) if_block19.m(ul, null);
    			append_dev(ul, t21);
    			if (if_block20) if_block20.m(ul, null);
    			append_dev(ul, t22);
    			if (if_block21) if_block21.m(ul, null);
    			append_dev(ul, t23);
    			if (if_block22) if_block22.m(ul, null);
    			append_dev(ul, t24);
    			if (if_block23) if_block23.m(ul, null);
    			append_dev(ul, t25);
    			if (if_block24) if_block24.m(ul, null);
    			append_dev(ul, t26);
    			if (if_block25) if_block25.m(ul, null);
    			append_dev(ul, t27);
    			if (if_block26) if_block26.m(ul, null);
    		},
    		p: function update(ctx, dirty) {
    			if (/*info*/ ctx[1].characteristics.common_name) {
    				if (if_block0) {
    					if_block0.p(ctx, dirty);
    				} else {
    					if_block0 = create_if_block_30$1(ctx);
    					if_block0.c();
    					if_block0.m(ul, t2);
    				}
    			} else if (if_block0) {
    				if_block0.d(1);
    				if_block0 = null;
    			}

    			if (/*info*/ ctx[1].characteristics.name_of_young) {
    				if (if_block1) {
    					if_block1.p(ctx, dirty);
    				} else {
    					if_block1 = create_if_block_29$1(ctx);
    					if_block1.c();
    					if_block1.m(ul, t3);
    				}
    			} else if (if_block1) {
    				if_block1.d(1);
    				if_block1 = null;
    			}

    			if (/*info*/ ctx[1].characteristics.slogan) {
    				if (if_block2) {
    					if_block2.p(ctx, dirty);
    				} else {
    					if_block2 = create_if_block_28$1(ctx);
    					if_block2.c();
    					if_block2.m(ul, t4);
    				}
    			} else if (if_block2) {
    				if_block2.d(1);
    				if_block2 = null;
    			}

    			if (/*info*/ ctx[1].characteristics.most_distinctive_feature) {
    				if (if_block3) {
    					if_block3.p(ctx, dirty);
    				} else {
    					if_block3 = create_if_block_27$1(ctx);
    					if_block3.c();
    					if_block3.m(ul, t5);
    				}
    			} else if (if_block3) {
    				if_block3.d(1);
    				if_block3 = null;
    			}

    			if (/*info*/ ctx[1].characteristics.temperament) {
    				if (if_block4) {
    					if_block4.p(ctx, dirty);
    				} else {
    					if_block4 = create_if_block_26$1(ctx);
    					if_block4.c();
    					if_block4.m(ul, t6);
    				}
    			} else if (if_block4) {
    				if_block4.d(1);
    				if_block4 = null;
    			}

    			if (/*info*/ ctx[1].characteristics.diet) {
    				if (if_block5) {
    					if_block5.p(ctx, dirty);
    				} else {
    					if_block5 = create_if_block_25$1(ctx);
    					if_block5.c();
    					if_block5.m(ul, t7);
    				}
    			} else if (if_block5) {
    				if_block5.d(1);
    				if_block5 = null;
    			}

    			if (/*info*/ ctx[1].characteristics.favorite_food) {
    				if (if_block6) {
    					if_block6.p(ctx, dirty);
    				} else {
    					if_block6 = create_if_block_24$1(ctx);
    					if_block6.c();
    					if_block6.m(ul, t8);
    				}
    			} else if (if_block6) {
    				if_block6.d(1);
    				if_block6 = null;
    			}

    			if (current_block_type === (current_block_type = select_block_type(ctx)) && if_block7) {
    				if_block7.p(ctx, dirty);
    			} else {
    				if (if_block7) if_block7.d(1);
    				if_block7 = current_block_type && current_block_type(ctx);

    				if (if_block7) {
    					if_block7.c();
    					if_block7.m(ul, t9);
    				}
    			}

    			if (/*info*/ ctx[1].characteristics.predators) {
    				if (if_block8) {
    					if_block8.p(ctx, dirty);
    				} else {
    					if_block8 = create_if_block_21$1(ctx);
    					if_block8.c();
    					if_block8.m(ul, t10);
    				}
    			} else if (if_block8) {
    				if_block8.d(1);
    				if_block8 = null;
    			}

    			if (/*info*/ ctx[1].characteristics.habitat) {
    				if (if_block9) {
    					if_block9.p(ctx, dirty);
    				} else {
    					if_block9 = create_if_block_20$1(ctx);
    					if_block9.c();
    					if_block9.m(ul, t11);
    				}
    			} else if (if_block9) {
    				if_block9.d(1);
    				if_block9 = null;
    			}

    			if (/*info*/ ctx[1].characteristics.origin) {
    				if (if_block10) {
    					if_block10.p(ctx, dirty);
    				} else {
    					if_block10 = create_if_block_19$1(ctx);
    					if_block10.c();
    					if_block10.m(ul, t12);
    				}
    			} else if (if_block10) {
    				if_block10.d(1);
    				if_block10 = null;
    			}

    			if (/*info*/ ctx[1].characteristics.location) {
    				if (if_block11) {
    					if_block11.p(ctx, dirty);
    				} else {
    					if_block11 = create_if_block_18$1(ctx);
    					if_block11.c();
    					if_block11.m(ul, t13);
    				}
    			} else if (if_block11) {
    				if_block11.d(1);
    				if_block11 = null;
    			}

    			if (/*info*/ ctx[1].characteristics.water_type) {
    				if (if_block12) {
    					if_block12.p(ctx, dirty);
    				} else {
    					if_block12 = create_if_block_17$1(ctx);
    					if_block12.c();
    					if_block12.m(ul, t14);
    				}
    			} else if (if_block12) {
    				if_block12.d(1);
    				if_block12 = null;
    			}

    			if (current_block_type_1 === (current_block_type_1 = select_block_type_1(ctx)) && if_block13) {
    				if_block13.p(ctx, dirty);
    			} else {
    				if (if_block13) if_block13.d(1);
    				if_block13 = current_block_type_1 && current_block_type_1(ctx);

    				if (if_block13) {
    					if_block13.c();
    					if_block13.m(ul, t15);
    				}
    			}

    			if (/*info*/ ctx[1].characteristics.group_behavior) {
    				if (if_block14) {
    					if_block14.p(ctx, dirty);
    				} else {
    					if_block14 = create_if_block_14$1(ctx);
    					if_block14.c();
    					if_block14.m(ul, t16);
    				}
    			} else if (if_block14) {
    				if_block14.d(1);
    				if_block14 = null;
    			}

    			if (/*info*/ ctx[1].characteristics.estimated_population_size) {
    				if (if_block15) {
    					if_block15.p(ctx, dirty);
    				} else {
    					if_block15 = create_if_block_13$1(ctx);
    					if_block15.c();
    					if_block15.m(ul, t17);
    				}
    			} else if (if_block15) {
    				if_block15.d(1);
    				if_block15 = null;
    			}

    			if (/*info*/ ctx[1].characteristics.number_of_species) {
    				if (if_block16) {
    					if_block16.p(ctx, dirty);
    				} else {
    					if_block16 = create_if_block_12$1(ctx);
    					if_block16.c();
    					if_block16.m(ul, t18);
    				}
    			} else if (if_block16) {
    				if_block16.d(1);
    				if_block16 = null;
    			}

    			if (/*info*/ ctx[1].characteristics.skin_type) {
    				if (if_block17) {
    					if_block17.p(ctx, dirty);
    				} else {
    					if_block17 = create_if_block_11$1(ctx);
    					if_block17.c();
    					if_block17.m(ul, t19);
    				}
    			} else if (if_block17) {
    				if_block17.d(1);
    				if_block17 = null;
    			}

    			if (/*info*/ ctx[1].characteristics.top_speed) {
    				if (if_block18) {
    					if_block18.p(ctx, dirty);
    				} else {
    					if_block18 = create_if_block_10$1(ctx);
    					if_block18.c();
    					if_block18.m(ul, t20);
    				}
    			} else if (if_block18) {
    				if_block18.d(1);
    				if_block18 = null;
    			}

    			if (/*info*/ ctx[1].characteristics.lifespan) {
    				if (if_block19) {
    					if_block19.p(ctx, dirty);
    				} else {
    					if_block19 = create_if_block_9$1(ctx);
    					if_block19.c();
    					if_block19.m(ul, t21);
    				}
    			} else if (if_block19) {
    				if_block19.d(1);
    				if_block19 = null;
    			}

    			if (/*info*/ ctx[1].characteristics.weight) {
    				if (if_block20) {
    					if_block20.p(ctx, dirty);
    				} else {
    					if_block20 = create_if_block_8$1(ctx);
    					if_block20.c();
    					if_block20.m(ul, t22);
    				}
    			} else if (if_block20) {
    				if_block20.d(1);
    				if_block20 = null;
    			}

    			if (/*info*/ ctx[1].characteristics.height) {
    				if (if_block21) {
    					if_block21.p(ctx, dirty);
    				} else {
    					if_block21 = create_if_block_7$1(ctx);
    					if_block21.c();
    					if_block21.m(ul, t23);
    				}
    			} else if (if_block21) {
    				if_block21.d(1);
    				if_block21 = null;
    			}

    			if (/*info*/ ctx[1].characteristics.length) {
    				if (if_block22) {
    					if_block22.p(ctx, dirty);
    				} else {
    					if_block22 = create_if_block_6$1(ctx);
    					if_block22.c();
    					if_block22.m(ul, t24);
    				}
    			} else if (if_block22) {
    				if_block22.d(1);
    				if_block22 = null;
    			}

    			if (/*info*/ ctx[1].characteristics.age_of_sexual_maturity) {
    				if (if_block23) {
    					if_block23.p(ctx, dirty);
    				} else {
    					if_block23 = create_if_block_5$1(ctx);
    					if_block23.c();
    					if_block23.m(ul, t25);
    				}
    			} else if (if_block23) {
    				if_block23.d(1);
    				if_block23 = null;
    			}

    			if (/*info*/ ctx[1].characteristics.age_of_weaning) {
    				if (if_block24) {
    					if_block24.p(ctx, dirty);
    				} else {
    					if_block24 = create_if_block_4$1(ctx);
    					if_block24.c();
    					if_block24.m(ul, t26);
    				}
    			} else if (if_block24) {
    				if_block24.d(1);
    				if_block24 = null;
    			}

    			if (/*info*/ ctx[1].characteristics.average_litter_size) {
    				if (if_block25) {
    					if_block25.p(ctx, dirty);
    				} else {
    					if_block25 = create_if_block_3$1(ctx);
    					if_block25.c();
    					if_block25.m(ul, t27);
    				}
    			} else if (if_block25) {
    				if_block25.d(1);
    				if_block25 = null;
    			}

    			if (/*info*/ ctx[1].characteristics.gestation_period) {
    				if (if_block26) {
    					if_block26.p(ctx, dirty);
    				} else {
    					if_block26 = create_if_block_2$2(ctx);
    					if_block26.c();
    					if_block26.m(ul, null);
    				}
    			} else if (if_block26) {
    				if_block26.d(1);
    				if_block26 = null;
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(ul);
    			if (if_block0) if_block0.d();
    			if (if_block1) if_block1.d();
    			if (if_block2) if_block2.d();
    			if (if_block3) if_block3.d();
    			if (if_block4) if_block4.d();
    			if (if_block5) if_block5.d();
    			if (if_block6) if_block6.d();

    			if (if_block7) {
    				if_block7.d();
    			}

    			if (if_block8) if_block8.d();
    			if (if_block9) if_block9.d();
    			if (if_block10) if_block10.d();
    			if (if_block11) if_block11.d();
    			if (if_block12) if_block12.d();

    			if (if_block13) {
    				if_block13.d();
    			}

    			if (if_block14) if_block14.d();
    			if (if_block15) if_block15.d();
    			if (if_block16) if_block16.d();
    			if (if_block17) if_block17.d();
    			if (if_block18) if_block18.d();
    			if (if_block19) if_block19.d();
    			if (if_block20) if_block20.d();
    			if (if_block21) if_block21.d();
    			if (if_block22) if_block22.d();
    			if (if_block23) if_block23.d();
    			if (if_block24) if_block24.d();
    			if (if_block25) if_block25.d();
    			if (if_block26) if_block26.d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$4.name,
    		type: "if",
    		source: "(43:20) {#if info.characteristics}",
    		ctx
    	});

    	return block;
    }

    // (46:28) {#if info.characteristics.common_name}
    function create_if_block_30$1(ctx) {
    	let li;
    	let t0;
    	let t1_value = /*info*/ ctx[1].characteristics.common_name + "";
    	let t1;

    	const block = {
    		c: function create() {
    			li = element("li");
    			t0 = text("Common name: ");
    			t1 = text(t1_value);
    			add_location(li, file$b, 46, 32, 2123);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, li, anchor);
    			append_dev(li, t0);
    			append_dev(li, t1);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*info*/ 2 && t1_value !== (t1_value = /*info*/ ctx[1].characteristics.common_name + "")) set_data_dev(t1, t1_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(li);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_30$1.name,
    		type: "if",
    		source: "(46:28) {#if info.characteristics.common_name}",
    		ctx
    	});

    	return block;
    }

    // (49:28) {#if info.characteristics.name_of_young}
    function create_if_block_29$1(ctx) {
    	let li;
    	let t0;
    	let t1_value = /*info*/ ctx[1].characteristics.name_of_young + "";
    	let t1;

    	const block = {
    		c: function create() {
    			li = element("li");
    			t0 = text("Name of young: ");
    			t1 = text(t1_value);
    			add_location(li, file$b, 49, 32, 2318);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, li, anchor);
    			append_dev(li, t0);
    			append_dev(li, t1);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*info*/ 2 && t1_value !== (t1_value = /*info*/ ctx[1].characteristics.name_of_young + "")) set_data_dev(t1, t1_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(li);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_29$1.name,
    		type: "if",
    		source: "(49:28) {#if info.characteristics.name_of_young}",
    		ctx
    	});

    	return block;
    }

    // (52:28) {#if info.characteristics.slogan}
    function create_if_block_28$1(ctx) {
    	let li;
    	let t0;
    	let t1_value = /*info*/ ctx[1].characteristics.slogan + "";
    	let t1;

    	const block = {
    		c: function create() {
    			li = element("li");
    			t0 = text("Slogan: ");
    			t1 = text(t1_value);
    			add_location(li, file$b, 52, 32, 2510);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, li, anchor);
    			append_dev(li, t0);
    			append_dev(li, t1);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*info*/ 2 && t1_value !== (t1_value = /*info*/ ctx[1].characteristics.slogan + "")) set_data_dev(t1, t1_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(li);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_28$1.name,
    		type: "if",
    		source: "(52:28) {#if info.characteristics.slogan}",
    		ctx
    	});

    	return block;
    }

    // (55:28) {#if info.characteristics.most_distinctive_feature}
    function create_if_block_27$1(ctx) {
    	let li;
    	let t0;
    	let t1_value = /*info*/ ctx[1].characteristics.most_distinctive_feature + "";
    	let t1;

    	const block = {
    		c: function create() {
    			li = element("li");
    			t0 = text("Most distinctive feature: ");
    			t1 = text(t1_value);
    			add_location(li, file$b, 55, 32, 2706);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, li, anchor);
    			append_dev(li, t0);
    			append_dev(li, t1);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*info*/ 2 && t1_value !== (t1_value = /*info*/ ctx[1].characteristics.most_distinctive_feature + "")) set_data_dev(t1, t1_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(li);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_27$1.name,
    		type: "if",
    		source: "(55:28) {#if info.characteristics.most_distinctive_feature}",
    		ctx
    	});

    	return block;
    }

    // (58:28) {#if info.characteristics.temperament}
    function create_if_block_26$1(ctx) {
    	let li;
    	let t0;
    	let t1_value = /*info*/ ctx[1].characteristics.temperament + "";
    	let t1;

    	const block = {
    		c: function create() {
    			li = element("li");
    			t0 = text("Temperament: ");
    			t1 = text(t1_value);
    			add_location(li, file$b, 58, 32, 2925);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, li, anchor);
    			append_dev(li, t0);
    			append_dev(li, t1);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*info*/ 2 && t1_value !== (t1_value = /*info*/ ctx[1].characteristics.temperament + "")) set_data_dev(t1, t1_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(li);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_26$1.name,
    		type: "if",
    		source: "(58:28) {#if info.characteristics.temperament}",
    		ctx
    	});

    	return block;
    }

    // (61:28) {#if info.characteristics.diet}
    function create_if_block_25$1(ctx) {
    	let li;
    	let t0;
    	let t1_value = /*info*/ ctx[1].characteristics.diet + "";
    	let t1;

    	const block = {
    		c: function create() {
    			li = element("li");
    			t0 = text("Diet: ");
    			t1 = text(t1_value);
    			add_location(li, file$b, 61, 32, 3111);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, li, anchor);
    			append_dev(li, t0);
    			append_dev(li, t1);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*info*/ 2 && t1_value !== (t1_value = /*info*/ ctx[1].characteristics.diet + "")) set_data_dev(t1, t1_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(li);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_25$1.name,
    		type: "if",
    		source: "(61:28) {#if info.characteristics.diet}",
    		ctx
    	});

    	return block;
    }

    // (64:28) {#if info.characteristics.favorite_food}
    function create_if_block_24$1(ctx) {
    	let li;
    	let t0;
    	let t1_value = /*info*/ ctx[1].characteristics.favorite_food + "";
    	let t1;

    	const block = {
    		c: function create() {
    			li = element("li");
    			t0 = text("Favorite food: ");
    			t1 = text(t1_value);
    			add_location(li, file$b, 64, 32, 3292);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, li, anchor);
    			append_dev(li, t0);
    			append_dev(li, t1);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*info*/ 2 && t1_value !== (t1_value = /*info*/ ctx[1].characteristics.favorite_food + "")) set_data_dev(t1, t1_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(li);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_24$1.name,
    		type: "if",
    		source: "(64:28) {#if info.characteristics.favorite_food}",
    		ctx
    	});

    	return block;
    }

    // (69:69) 
    function create_if_block_23$1(ctx) {
    	let li;
    	let t0;
    	let t1_value = /*info*/ ctx[1].characteristics.main_prey + "";
    	let t1;

    	const block = {
    		c: function create() {
    			li = element("li");
    			t0 = text("Prey: ");
    			t1 = text(t1_value);
    			add_location(li, file$b, 69, 32, 3629);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, li, anchor);
    			append_dev(li, t0);
    			append_dev(li, t1);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*info*/ 2 && t1_value !== (t1_value = /*info*/ ctx[1].characteristics.main_prey + "")) set_data_dev(t1, t1_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(li);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_23$1.name,
    		type: "if",
    		source: "(69:69) ",
    		ctx
    	});

    	return block;
    }

    // (67:28) {#if info.characteristics.prey}
    function create_if_block_22$1(ctx) {
    	let li;
    	let t0;
    	let t1_value = /*info*/ ctx[1].characteristics.prey + "";
    	let t1;

    	const block = {
    		c: function create() {
    			li = element("li");
    			t0 = text("Prey: ");
    			t1 = text(t1_value);
    			add_location(li, file$b, 67, 32, 3482);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, li, anchor);
    			append_dev(li, t0);
    			append_dev(li, t1);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*info*/ 2 && t1_value !== (t1_value = /*info*/ ctx[1].characteristics.prey + "")) set_data_dev(t1, t1_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(li);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_22$1.name,
    		type: "if",
    		source: "(67:28) {#if info.characteristics.prey}",
    		ctx
    	});

    	return block;
    }

    // (72:28) {#if info.characteristics.predators}
    function create_if_block_21$1(ctx) {
    	let li;
    	let t0;
    	let t1_value = /*info*/ ctx[1].characteristics.predators + "";
    	let t1;

    	const block = {
    		c: function create() {
    			li = element("li");
    			t0 = text("Predator: ");
    			t1 = text(t1_value);
    			add_location(li, file$b, 72, 32, 3811);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, li, anchor);
    			append_dev(li, t0);
    			append_dev(li, t1);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*info*/ 2 && t1_value !== (t1_value = /*info*/ ctx[1].characteristics.predators + "")) set_data_dev(t1, t1_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(li);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_21$1.name,
    		type: "if",
    		source: "(72:28) {#if info.characteristics.predators}",
    		ctx
    	});

    	return block;
    }

    // (75:28) {#if info.characteristics.habitat}
    function create_if_block_20$1(ctx) {
    	let li;
    	let t0;
    	let t1_value = /*info*/ ctx[1].characteristics.habitat + "";
    	let t1;

    	const block = {
    		c: function create() {
    			li = element("li");
    			t0 = text("Habitat: ");
    			t1 = text(t1_value);
    			add_location(li, file$b, 75, 32, 3995);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, li, anchor);
    			append_dev(li, t0);
    			append_dev(li, t1);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*info*/ 2 && t1_value !== (t1_value = /*info*/ ctx[1].characteristics.habitat + "")) set_data_dev(t1, t1_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(li);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_20$1.name,
    		type: "if",
    		source: "(75:28) {#if info.characteristics.habitat}",
    		ctx
    	});

    	return block;
    }

    // (78:28) {#if info.characteristics.origin}
    function create_if_block_19$1(ctx) {
    	let li;
    	let t0;
    	let t1_value = /*info*/ ctx[1].characteristics.origin + "";
    	let t1;

    	const block = {
    		c: function create() {
    			li = element("li");
    			t0 = text("Origin: ");
    			t1 = text(t1_value);
    			add_location(li, file$b, 78, 32, 4175);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, li, anchor);
    			append_dev(li, t0);
    			append_dev(li, t1);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*info*/ 2 && t1_value !== (t1_value = /*info*/ ctx[1].characteristics.origin + "")) set_data_dev(t1, t1_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(li);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_19$1.name,
    		type: "if",
    		source: "(78:28) {#if info.characteristics.origin}",
    		ctx
    	});

    	return block;
    }

    // (81:28) {#if info.characteristics.location}
    function create_if_block_18$1(ctx) {
    	let li;
    	let t0;
    	let t1_value = /*info*/ ctx[1].characteristics.location + "";
    	let t1;

    	const block = {
    		c: function create() {
    			li = element("li");
    			t0 = text("Location: ");
    			t1 = text(t1_value);
    			add_location(li, file$b, 81, 32, 4355);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, li, anchor);
    			append_dev(li, t0);
    			append_dev(li, t1);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*info*/ 2 && t1_value !== (t1_value = /*info*/ ctx[1].characteristics.location + "")) set_data_dev(t1, t1_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(li);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_18$1.name,
    		type: "if",
    		source: "(81:28) {#if info.characteristics.location}",
    		ctx
    	});

    	return block;
    }

    // (84:28) {#if info.characteristics.water_type}
    function create_if_block_17$1(ctx) {
    	let li;
    	let t0;
    	let t1_value = /*info*/ ctx[1].characteristics.water_type + "";
    	let t1;

    	const block = {
    		c: function create() {
    			li = element("li");
    			t0 = text("Water type: ");
    			t1 = text(t1_value);
    			add_location(li, file$b, 84, 32, 4541);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, li, anchor);
    			append_dev(li, t0);
    			append_dev(li, t1);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*info*/ 2 && t1_value !== (t1_value = /*info*/ ctx[1].characteristics.water_type + "")) set_data_dev(t1, t1_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(li);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_17$1.name,
    		type: "if",
    		source: "(84:28) {#if info.characteristics.water_type}",
    		ctx
    	});

    	return block;
    }

    // (89:64) 
    function create_if_block_16$1(ctx) {
    	let li;
    	let t0;
    	let t1_value = /*info*/ ctx[1].characteristics.type + "";
    	let t1;

    	const block = {
    		c: function create() {
    			li = element("li");
    			t0 = text("Type: ");
    			t1 = text(t1_value);
    			add_location(li, file$b, 89, 32, 4869);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, li, anchor);
    			append_dev(li, t0);
    			append_dev(li, t1);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*info*/ 2 && t1_value !== (t1_value = /*info*/ ctx[1].characteristics.type + "")) set_data_dev(t1, t1_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(li);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_16$1.name,
    		type: "if",
    		source: "(89:64) ",
    		ctx
    	});

    	return block;
    }

    // (87:28) {#if info.characteristics.group}
    function create_if_block_15$1(ctx) {
    	let li;
    	let t0;
    	let t1_value = /*info*/ ctx[1].characteristics.group + "";
    	let t1;

    	const block = {
    		c: function create() {
    			li = element("li");
    			t0 = text("Type: ");
    			t1 = text(t1_value);
    			add_location(li, file$b, 87, 32, 4726);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, li, anchor);
    			append_dev(li, t0);
    			append_dev(li, t1);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*info*/ 2 && t1_value !== (t1_value = /*info*/ ctx[1].characteristics.group + "")) set_data_dev(t1, t1_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(li);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_15$1.name,
    		type: "if",
    		source: "(87:28) {#if info.characteristics.group}",
    		ctx
    	});

    	return block;
    }

    // (92:28) {#if info.characteristics.group_behavior}
    function create_if_block_14$1(ctx) {
    	let li;
    	let t0;
    	let t1_value = /*info*/ ctx[1].characteristics.group_behavior + "";
    	let t1;

    	const block = {
    		c: function create() {
    			li = element("li");
    			t0 = text("Group behavior: ");
    			t1 = text(t1_value);
    			add_location(li, file$b, 92, 32, 5051);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, li, anchor);
    			append_dev(li, t0);
    			append_dev(li, t1);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*info*/ 2 && t1_value !== (t1_value = /*info*/ ctx[1].characteristics.group_behavior + "")) set_data_dev(t1, t1_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(li);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_14$1.name,
    		type: "if",
    		source: "(92:28) {#if info.characteristics.group_behavior}",
    		ctx
    	});

    	return block;
    }

    // (95:28) {#if info.characteristics.estimated_population_size}
    function create_if_block_13$1(ctx) {
    	let li;
    	let t0;
    	let t1_value = /*info*/ ctx[1].characteristics.estimated_population_size + "";
    	let t1;

    	const block = {
    		c: function create() {
    			li = element("li");
    			t0 = text("Estimated population size: ");
    			t1 = text(t1_value);
    			add_location(li, file$b, 95, 32, 5264);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, li, anchor);
    			append_dev(li, t0);
    			append_dev(li, t1);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*info*/ 2 && t1_value !== (t1_value = /*info*/ ctx[1].characteristics.estimated_population_size + "")) set_data_dev(t1, t1_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(li);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_13$1.name,
    		type: "if",
    		source: "(95:28) {#if info.characteristics.estimated_population_size}",
    		ctx
    	});

    	return block;
    }

    // (98:28) {#if info.characteristics.number_of_species}
    function create_if_block_12$1(ctx) {
    	let li;
    	let t0;
    	let t1_value = /*info*/ ctx[1].characteristics.number_of_species + "";
    	let t1;

    	const block = {
    		c: function create() {
    			li = element("li");
    			t0 = text("Number of species: ");
    			t1 = text(t1_value);
    			add_location(li, file$b, 98, 32, 5491);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, li, anchor);
    			append_dev(li, t0);
    			append_dev(li, t1);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*info*/ 2 && t1_value !== (t1_value = /*info*/ ctx[1].characteristics.number_of_species + "")) set_data_dev(t1, t1_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(li);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_12$1.name,
    		type: "if",
    		source: "(98:28) {#if info.characteristics.number_of_species}",
    		ctx
    	});

    	return block;
    }

    // (101:28) {#if info.characteristics.skin_type}
    function create_if_block_11$1(ctx) {
    	let li;
    	let t0;
    	let t1_value = /*info*/ ctx[1].characteristics.skin_type + "";
    	let t1;

    	const block = {
    		c: function create() {
    			li = element("li");
    			t0 = text("Skin type: ");
    			t1 = text(t1_value);
    			add_location(li, file$b, 101, 32, 5694);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, li, anchor);
    			append_dev(li, t0);
    			append_dev(li, t1);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*info*/ 2 && t1_value !== (t1_value = /*info*/ ctx[1].characteristics.skin_type + "")) set_data_dev(t1, t1_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(li);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_11$1.name,
    		type: "if",
    		source: "(101:28) {#if info.characteristics.skin_type}",
    		ctx
    	});

    	return block;
    }

    // (104:28) {#if info.characteristics.top_speed}
    function create_if_block_10$1(ctx) {
    	let li;
    	let t0;
    	let t1_value = /*info*/ ctx[1].characteristics.top_speed + "";
    	let t1;

    	const block = {
    		c: function create() {
    			li = element("li");
    			t0 = text("Top speed: ");
    			t1 = text(t1_value);
    			add_location(li, file$b, 104, 32, 5881);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, li, anchor);
    			append_dev(li, t0);
    			append_dev(li, t1);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*info*/ 2 && t1_value !== (t1_value = /*info*/ ctx[1].characteristics.top_speed + "")) set_data_dev(t1, t1_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(li);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_10$1.name,
    		type: "if",
    		source: "(104:28) {#if info.characteristics.top_speed}",
    		ctx
    	});

    	return block;
    }

    // (107:28) {#if info.characteristics.lifespan}
    function create_if_block_9$1(ctx) {
    	let li;
    	let t0;
    	let t1_value = /*info*/ ctx[1].characteristics.lifespan + "";
    	let t1;

    	const block = {
    		c: function create() {
    			li = element("li");
    			t0 = text("Lifespan: ");
    			t1 = text(t1_value);
    			add_location(li, file$b, 107, 32, 6067);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, li, anchor);
    			append_dev(li, t0);
    			append_dev(li, t1);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*info*/ 2 && t1_value !== (t1_value = /*info*/ ctx[1].characteristics.lifespan + "")) set_data_dev(t1, t1_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(li);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_9$1.name,
    		type: "if",
    		source: "(107:28) {#if info.characteristics.lifespan}",
    		ctx
    	});

    	return block;
    }

    // (110:28) {#if info.characteristics.weight}
    function create_if_block_8$1(ctx) {
    	let li;
    	let t0;
    	let t1_value = /*info*/ ctx[1].characteristics.weight + "";
    	let t1;

    	const block = {
    		c: function create() {
    			li = element("li");
    			t0 = text("Weight: ");
    			t1 = text(t1_value);
    			add_location(li, file$b, 110, 32, 6249);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, li, anchor);
    			append_dev(li, t0);
    			append_dev(li, t1);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*info*/ 2 && t1_value !== (t1_value = /*info*/ ctx[1].characteristics.weight + "")) set_data_dev(t1, t1_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(li);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_8$1.name,
    		type: "if",
    		source: "(110:28) {#if info.characteristics.weight}",
    		ctx
    	});

    	return block;
    }

    // (113:28) {#if info.characteristics.height}
    function create_if_block_7$1(ctx) {
    	let li;
    	let t0;
    	let t1_value = /*info*/ ctx[1].characteristics.height + "";
    	let t1;

    	const block = {
    		c: function create() {
    			li = element("li");
    			t0 = text("Height: ");
    			t1 = text(t1_value);
    			add_location(li, file$b, 113, 32, 6427);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, li, anchor);
    			append_dev(li, t0);
    			append_dev(li, t1);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*info*/ 2 && t1_value !== (t1_value = /*info*/ ctx[1].characteristics.height + "")) set_data_dev(t1, t1_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(li);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_7$1.name,
    		type: "if",
    		source: "(113:28) {#if info.characteristics.height}",
    		ctx
    	});

    	return block;
    }

    // (116:28) {#if info.characteristics.length}
    function create_if_block_6$1(ctx) {
    	let li;
    	let t0;
    	let t1_value = /*info*/ ctx[1].characteristics.length + "";
    	let t1;

    	const block = {
    		c: function create() {
    			li = element("li");
    			t0 = text("Length: ");
    			t1 = text(t1_value);
    			add_location(li, file$b, 116, 32, 6605);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, li, anchor);
    			append_dev(li, t0);
    			append_dev(li, t1);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*info*/ 2 && t1_value !== (t1_value = /*info*/ ctx[1].characteristics.length + "")) set_data_dev(t1, t1_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(li);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_6$1.name,
    		type: "if",
    		source: "(116:28) {#if info.characteristics.length}",
    		ctx
    	});

    	return block;
    }

    // (119:28) {#if info.characteristics.age_of_sexual_maturity}
    function create_if_block_5$1(ctx) {
    	let li;
    	let t0;
    	let t1_value = /*info*/ ctx[1].characteristics.age_of_sexual_maturity + "";
    	let t1;

    	const block = {
    		c: function create() {
    			li = element("li");
    			t0 = text("Age of sexual maturity: ");
    			t1 = text(t1_value);
    			add_location(li, file$b, 119, 32, 6799);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, li, anchor);
    			append_dev(li, t0);
    			append_dev(li, t1);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*info*/ 2 && t1_value !== (t1_value = /*info*/ ctx[1].characteristics.age_of_sexual_maturity + "")) set_data_dev(t1, t1_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(li);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_5$1.name,
    		type: "if",
    		source: "(119:28) {#if info.characteristics.age_of_sexual_maturity}",
    		ctx
    	});

    	return block;
    }

    // (122:28) {#if info.characteristics.age_of_weaning}
    function create_if_block_4$1(ctx) {
    	let li;
    	let t0;
    	let t1_value = /*info*/ ctx[1].characteristics.age_of_weaning + "";
    	let t1;

    	const block = {
    		c: function create() {
    			li = element("li");
    			t0 = text("Age of weaning: ");
    			t1 = text(t1_value);
    			add_location(li, file$b, 122, 32, 7017);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, li, anchor);
    			append_dev(li, t0);
    			append_dev(li, t1);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*info*/ 2 && t1_value !== (t1_value = /*info*/ ctx[1].characteristics.age_of_weaning + "")) set_data_dev(t1, t1_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(li);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_4$1.name,
    		type: "if",
    		source: "(122:28) {#if info.characteristics.age_of_weaning}",
    		ctx
    	});

    	return block;
    }

    // (125:28) {#if info.characteristics.average_litter_size}
    function create_if_block_3$1(ctx) {
    	let li;
    	let t0;
    	let t1_value = /*info*/ ctx[1].characteristics.average_litter_size + "";
    	let t1;

    	const block = {
    		c: function create() {
    			li = element("li");
    			t0 = text("Average litter size: ");
    			t1 = text(t1_value);
    			add_location(li, file$b, 125, 32, 7224);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, li, anchor);
    			append_dev(li, t0);
    			append_dev(li, t1);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*info*/ 2 && t1_value !== (t1_value = /*info*/ ctx[1].characteristics.average_litter_size + "")) set_data_dev(t1, t1_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(li);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_3$1.name,
    		type: "if",
    		source: "(125:28) {#if info.characteristics.average_litter_size}",
    		ctx
    	});

    	return block;
    }

    // (128:28) {#if info.characteristics.gestation_period}
    function create_if_block_2$2(ctx) {
    	let li;
    	let t0;
    	let t1_value = /*info*/ ctx[1].characteristics.gestation_period + "";
    	let t1;

    	const block = {
    		c: function create() {
    			li = element("li");
    			t0 = text("Gestation period: ");
    			t1 = text(t1_value);
    			add_location(li, file$b, 128, 32, 7438);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, li, anchor);
    			append_dev(li, t0);
    			append_dev(li, t1);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*info*/ 2 && t1_value !== (t1_value = /*info*/ ctx[1].characteristics.gestation_period + "")) set_data_dev(t1, t1_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(li);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_2$2.name,
    		type: "if",
    		source: "(128:28) {#if info.characteristics.gestation_period}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$b(ctx) {
    	let if_block_anchor;
    	let current;
    	let if_block = /*isModalOpen*/ ctx[0] && create_if_block$5(ctx);

    	const block = {
    		c: function create() {
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (/*isModalOpen*/ ctx[0]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);

    					if (dirty & /*isModalOpen*/ 1) {
    						transition_in(if_block, 1);
    					}
    				} else {
    					if_block = create_if_block$5(ctx);
    					if_block.c();
    					transition_in(if_block, 1);
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			} else if (if_block) {
    				group_outros();

    				transition_out(if_block, 1, 1, () => {
    					if_block = null;
    				});

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$b.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$b($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('AnimalModal', slots, []);
    	let { info } = $$props;
    	let { isModalOpen } = $$props;
    	let { imgSrc } = $$props;

    	$$self.$$.on_mount.push(function () {
    		if (info === undefined && !('info' in $$props || $$self.$$.bound[$$self.$$.props['info']])) {
    			console.warn("<AnimalModal> was created without expected prop 'info'");
    		}

    		if (isModalOpen === undefined && !('isModalOpen' in $$props || $$self.$$.bound[$$self.$$.props['isModalOpen']])) {
    			console.warn("<AnimalModal> was created without expected prop 'isModalOpen'");
    		}

    		if (imgSrc === undefined && !('imgSrc' in $$props || $$self.$$.bound[$$self.$$.props['imgSrc']])) {
    			console.warn("<AnimalModal> was created without expected prop 'imgSrc'");
    		}
    	});

    	const writable_props = ['info', 'isModalOpen', 'imgSrc'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<AnimalModal> was created with unknown prop '${key}'`);
    	});

    	const click_handler = () => $$invalidate(0, isModalOpen = false);

    	$$self.$$set = $$props => {
    		if ('info' in $$props) $$invalidate(1, info = $$props.info);
    		if ('isModalOpen' in $$props) $$invalidate(0, isModalOpen = $$props.isModalOpen);
    		if ('imgSrc' in $$props) $$invalidate(2, imgSrc = $$props.imgSrc);
    	};

    	$$self.$capture_state = () => ({ fade, info, isModalOpen, imgSrc });

    	$$self.$inject_state = $$props => {
    		if ('info' in $$props) $$invalidate(1, info = $$props.info);
    		if ('isModalOpen' in $$props) $$invalidate(0, isModalOpen = $$props.isModalOpen);
    		if ('imgSrc' in $$props) $$invalidate(2, imgSrc = $$props.imgSrc);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [isModalOpen, info, imgSrc, click_handler];
    }

    class AnimalModal extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$b, create_fragment$b, safe_not_equal, { info: 1, isModalOpen: 0, imgSrc: 2 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "AnimalModal",
    			options,
    			id: create_fragment$b.name
    		});
    	}

    	get info() {
    		throw new Error("<AnimalModal>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set info(value) {
    		throw new Error("<AnimalModal>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get isModalOpen() {
    		throw new Error("<AnimalModal>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set isModalOpen(value) {
    		throw new Error("<AnimalModal>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get imgSrc() {
    		throw new Error("<AnimalModal>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set imgSrc(value) {
    		throw new Error("<AnimalModal>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\component\animalInfo\AnimalCard.svelte generated by Svelte v3.53.1 */
    const file$a = "src\\component\\animalInfo\\AnimalCard.svelte";

    function get_each_context$5(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[7] = list[i];
    	return child_ctx;
    }

    // (43:12) {#if screenWidth > 500}
    function create_if_block_32(ctx) {
    	let i;

    	const block = {
    		c: function create() {
    			i = element("i");
    			attr_dev(i, "class", "bi-zoom-in");
    			add_location(i, file$a, 43, 16, 1647);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, i, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(i);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_32.name,
    		type: "if",
    		source: "(43:12) {#if screenWidth > 500}",
    		ctx
    	});

    	return block;
    }

    // (57:16) {#if info.taxonomy.genus}
    function create_if_block_31(ctx) {
    	let li;
    	let t0;
    	let t1_value = /*info*/ ctx[0].taxonomy.genus + "";
    	let t1;

    	const block = {
    		c: function create() {
    			li = element("li");
    			t0 = text("Genus: ");
    			t1 = text(t1_value);
    			attr_dev(li, "class", "svelte-1pk0bii");
    			add_location(li, file$a, 57, 20, 2231);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, li, anchor);
    			append_dev(li, t0);
    			append_dev(li, t1);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*info*/ 1 && t1_value !== (t1_value = /*info*/ ctx[0].taxonomy.genus + "")) set_data_dev(t1, t1_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(li);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_31.name,
    		type: "if",
    		source: "(57:16) {#if info.taxonomy.genus}",
    		ctx
    	});

    	return block;
    }

    // (62:12) {#if info.locations}
    function create_if_block_30(ctx) {
    	let div;
    	let t1;
    	let ul;
    	let each_value = /*info*/ ctx[0].locations;
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$5(get_each_context$5(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			div = element("div");
    			div.textContent = "Locations:";
    			t1 = space();
    			ul = element("ul");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr_dev(div, "class", "animalInfo svelte-1pk0bii");
    			add_location(div, file$a, 62, 16, 2437);
    			attr_dev(ul, "class", "infoList svelte-1pk0bii");
    			add_location(ul, file$a, 63, 16, 2496);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, ul, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(ul, null);
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*info*/ 1) {
    				each_value = /*info*/ ctx[0].locations;
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$5(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block$5(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(ul, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(ul);
    			destroy_each(each_blocks, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_30.name,
    		type: "if",
    		source: "(62:12) {#if info.locations}",
    		ctx
    	});

    	return block;
    }

    // (65:20) {#each info.locations as location}
    function create_each_block$5(ctx) {
    	let li;
    	let t_value = /*location*/ ctx[7] + "";
    	let t;

    	const block = {
    		c: function create() {
    			li = element("li");
    			t = text(t_value);
    			attr_dev(li, "class", "svelte-1pk0bii");
    			add_location(li, file$a, 65, 24, 2599);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, li, anchor);
    			append_dev(li, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*info*/ 1 && t_value !== (t_value = /*location*/ ctx[7] + "")) set_data_dev(t, t_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(li);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$5.name,
    		type: "each",
    		source: "(65:20) {#each info.locations as location}",
    		ctx
    	});

    	return block;
    }

    // (71:8) {#if info.characteristics}
    function create_if_block$4(ctx) {
    	let div1;
    	let div0;
    	let t1;
    	let ul;
    	let t2;
    	let t3;
    	let t4;
    	let t5;
    	let t6;
    	let t7;
    	let t8;
    	let t9;
    	let t10;
    	let t11;
    	let t12;
    	let t13;
    	let t14;
    	let t15;
    	let t16;
    	let t17;
    	let t18;
    	let t19;
    	let t20;
    	let t21;
    	let t22;
    	let t23;
    	let t24;
    	let t25;
    	let t26;
    	let t27;
    	let if_block0 = /*info*/ ctx[0].characteristics.common_name && create_if_block_29(ctx);
    	let if_block1 = /*info*/ ctx[0].characteristics.name_of_young && create_if_block_28(ctx);
    	let if_block2 = /*info*/ ctx[0].characteristics.slogan && create_if_block_27(ctx);
    	let if_block3 = /*info*/ ctx[0].characteristics.most_distinctive_feature && create_if_block_26(ctx);
    	let if_block4 = /*info*/ ctx[0].characteristics.temperament && create_if_block_25(ctx);
    	let if_block5 = /*info*/ ctx[0].characteristics.diet && create_if_block_24(ctx);
    	let if_block6 = /*info*/ ctx[0].characteristics.favorite_food && create_if_block_23(ctx);

    	function select_block_type(ctx, dirty) {
    		if (/*info*/ ctx[0].characteristics.prey) return create_if_block_21;
    		if (/*info*/ ctx[0].characteristics.main_prey) return create_if_block_22;
    	}

    	let current_block_type = select_block_type(ctx);
    	let if_block7 = current_block_type && current_block_type(ctx);
    	let if_block8 = /*info*/ ctx[0].characteristics.predators && create_if_block_20(ctx);
    	let if_block9 = /*info*/ ctx[0].characteristics.habitat && create_if_block_19(ctx);
    	let if_block10 = /*info*/ ctx[0].characteristics.origin && create_if_block_18(ctx);
    	let if_block11 = /*info*/ ctx[0].characteristics.location && create_if_block_17(ctx);
    	let if_block12 = /*info*/ ctx[0].characteristics.water_type && create_if_block_16(ctx);

    	function select_block_type_1(ctx, dirty) {
    		if (/*info*/ ctx[0].characteristics.group) return create_if_block_14;
    		if (/*info*/ ctx[0].characteristics.type) return create_if_block_15;
    	}

    	let current_block_type_1 = select_block_type_1(ctx);
    	let if_block13 = current_block_type_1 && current_block_type_1(ctx);
    	let if_block14 = /*info*/ ctx[0].characteristics.group_behavior && create_if_block_13(ctx);
    	let if_block15 = /*info*/ ctx[0].characteristics.estimated_population_size && create_if_block_12(ctx);
    	let if_block16 = /*info*/ ctx[0].characteristics.number_of_species && create_if_block_11(ctx);
    	let if_block17 = /*info*/ ctx[0].characteristics.skin_type && create_if_block_10(ctx);
    	let if_block18 = /*info*/ ctx[0].characteristics.top_speed && create_if_block_9(ctx);
    	let if_block19 = /*info*/ ctx[0].characteristics.lifespan && create_if_block_8(ctx);
    	let if_block20 = /*info*/ ctx[0].characteristics.weight && create_if_block_7(ctx);
    	let if_block21 = /*info*/ ctx[0].characteristics.height && create_if_block_6(ctx);
    	let if_block22 = /*info*/ ctx[0].characteristics.length && create_if_block_5(ctx);
    	let if_block23 = /*info*/ ctx[0].characteristics.age_of_sexual_maturity && create_if_block_4(ctx);
    	let if_block24 = /*info*/ ctx[0].characteristics.age_of_weaning && create_if_block_3(ctx);
    	let if_block25 = /*info*/ ctx[0].characteristics.average_litter_size && create_if_block_2$1(ctx);
    	let if_block26 = /*info*/ ctx[0].characteristics.gestation_period && create_if_block_1$3(ctx);

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			div0 = element("div");
    			div0.textContent = "Characteristics:";
    			t1 = space();
    			ul = element("ul");
    			if (if_block0) if_block0.c();
    			t2 = space();
    			if (if_block1) if_block1.c();
    			t3 = space();
    			if (if_block2) if_block2.c();
    			t4 = space();
    			if (if_block3) if_block3.c();
    			t5 = space();
    			if (if_block4) if_block4.c();
    			t6 = space();
    			if (if_block5) if_block5.c();
    			t7 = space();
    			if (if_block6) if_block6.c();
    			t8 = space();
    			if (if_block7) if_block7.c();
    			t9 = space();
    			if (if_block8) if_block8.c();
    			t10 = space();
    			if (if_block9) if_block9.c();
    			t11 = space();
    			if (if_block10) if_block10.c();
    			t12 = space();
    			if (if_block11) if_block11.c();
    			t13 = space();
    			if (if_block12) if_block12.c();
    			t14 = space();
    			if (if_block13) if_block13.c();
    			t15 = space();
    			if (if_block14) if_block14.c();
    			t16 = space();
    			if (if_block15) if_block15.c();
    			t17 = space();
    			if (if_block16) if_block16.c();
    			t18 = space();
    			if (if_block17) if_block17.c();
    			t19 = space();
    			if (if_block18) if_block18.c();
    			t20 = space();
    			if (if_block19) if_block19.c();
    			t21 = space();
    			if (if_block20) if_block20.c();
    			t22 = space();
    			if (if_block21) if_block21.c();
    			t23 = space();
    			if (if_block22) if_block22.c();
    			t24 = space();
    			if (if_block23) if_block23.c();
    			t25 = space();
    			if (if_block24) if_block24.c();
    			t26 = space();
    			if (if_block25) if_block25.c();
    			t27 = space();
    			if (if_block26) if_block26.c();
    			attr_dev(div0, "class", "animalInfo svelte-1pk0bii");
    			add_location(div0, file$a, 72, 16, 2790);
    			attr_dev(ul, "class", "infoList svelte-1pk0bii");
    			add_location(ul, file$a, 73, 16, 2855);
    			attr_dev(div1, "class", "col");
    			add_location(div1, file$a, 71, 12, 2755);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			append_dev(div1, div0);
    			append_dev(div1, t1);
    			append_dev(div1, ul);
    			if (if_block0) if_block0.m(ul, null);
    			append_dev(ul, t2);
    			if (if_block1) if_block1.m(ul, null);
    			append_dev(ul, t3);
    			if (if_block2) if_block2.m(ul, null);
    			append_dev(ul, t4);
    			if (if_block3) if_block3.m(ul, null);
    			append_dev(ul, t5);
    			if (if_block4) if_block4.m(ul, null);
    			append_dev(ul, t6);
    			if (if_block5) if_block5.m(ul, null);
    			append_dev(ul, t7);
    			if (if_block6) if_block6.m(ul, null);
    			append_dev(ul, t8);
    			if (if_block7) if_block7.m(ul, null);
    			append_dev(ul, t9);
    			if (if_block8) if_block8.m(ul, null);
    			append_dev(ul, t10);
    			if (if_block9) if_block9.m(ul, null);
    			append_dev(ul, t11);
    			if (if_block10) if_block10.m(ul, null);
    			append_dev(ul, t12);
    			if (if_block11) if_block11.m(ul, null);
    			append_dev(ul, t13);
    			if (if_block12) if_block12.m(ul, null);
    			append_dev(ul, t14);
    			if (if_block13) if_block13.m(ul, null);
    			append_dev(ul, t15);
    			if (if_block14) if_block14.m(ul, null);
    			append_dev(ul, t16);
    			if (if_block15) if_block15.m(ul, null);
    			append_dev(ul, t17);
    			if (if_block16) if_block16.m(ul, null);
    			append_dev(ul, t18);
    			if (if_block17) if_block17.m(ul, null);
    			append_dev(ul, t19);
    			if (if_block18) if_block18.m(ul, null);
    			append_dev(ul, t20);
    			if (if_block19) if_block19.m(ul, null);
    			append_dev(ul, t21);
    			if (if_block20) if_block20.m(ul, null);
    			append_dev(ul, t22);
    			if (if_block21) if_block21.m(ul, null);
    			append_dev(ul, t23);
    			if (if_block22) if_block22.m(ul, null);
    			append_dev(ul, t24);
    			if (if_block23) if_block23.m(ul, null);
    			append_dev(ul, t25);
    			if (if_block24) if_block24.m(ul, null);
    			append_dev(ul, t26);
    			if (if_block25) if_block25.m(ul, null);
    			append_dev(ul, t27);
    			if (if_block26) if_block26.m(ul, null);
    		},
    		p: function update(ctx, dirty) {
    			if (/*info*/ ctx[0].characteristics.common_name) {
    				if (if_block0) {
    					if_block0.p(ctx, dirty);
    				} else {
    					if_block0 = create_if_block_29(ctx);
    					if_block0.c();
    					if_block0.m(ul, t2);
    				}
    			} else if (if_block0) {
    				if_block0.d(1);
    				if_block0 = null;
    			}

    			if (/*info*/ ctx[0].characteristics.name_of_young) {
    				if (if_block1) {
    					if_block1.p(ctx, dirty);
    				} else {
    					if_block1 = create_if_block_28(ctx);
    					if_block1.c();
    					if_block1.m(ul, t3);
    				}
    			} else if (if_block1) {
    				if_block1.d(1);
    				if_block1 = null;
    			}

    			if (/*info*/ ctx[0].characteristics.slogan) {
    				if (if_block2) {
    					if_block2.p(ctx, dirty);
    				} else {
    					if_block2 = create_if_block_27(ctx);
    					if_block2.c();
    					if_block2.m(ul, t4);
    				}
    			} else if (if_block2) {
    				if_block2.d(1);
    				if_block2 = null;
    			}

    			if (/*info*/ ctx[0].characteristics.most_distinctive_feature) {
    				if (if_block3) {
    					if_block3.p(ctx, dirty);
    				} else {
    					if_block3 = create_if_block_26(ctx);
    					if_block3.c();
    					if_block3.m(ul, t5);
    				}
    			} else if (if_block3) {
    				if_block3.d(1);
    				if_block3 = null;
    			}

    			if (/*info*/ ctx[0].characteristics.temperament) {
    				if (if_block4) {
    					if_block4.p(ctx, dirty);
    				} else {
    					if_block4 = create_if_block_25(ctx);
    					if_block4.c();
    					if_block4.m(ul, t6);
    				}
    			} else if (if_block4) {
    				if_block4.d(1);
    				if_block4 = null;
    			}

    			if (/*info*/ ctx[0].characteristics.diet) {
    				if (if_block5) {
    					if_block5.p(ctx, dirty);
    				} else {
    					if_block5 = create_if_block_24(ctx);
    					if_block5.c();
    					if_block5.m(ul, t7);
    				}
    			} else if (if_block5) {
    				if_block5.d(1);
    				if_block5 = null;
    			}

    			if (/*info*/ ctx[0].characteristics.favorite_food) {
    				if (if_block6) {
    					if_block6.p(ctx, dirty);
    				} else {
    					if_block6 = create_if_block_23(ctx);
    					if_block6.c();
    					if_block6.m(ul, t8);
    				}
    			} else if (if_block6) {
    				if_block6.d(1);
    				if_block6 = null;
    			}

    			if (current_block_type === (current_block_type = select_block_type(ctx)) && if_block7) {
    				if_block7.p(ctx, dirty);
    			} else {
    				if (if_block7) if_block7.d(1);
    				if_block7 = current_block_type && current_block_type(ctx);

    				if (if_block7) {
    					if_block7.c();
    					if_block7.m(ul, t9);
    				}
    			}

    			if (/*info*/ ctx[0].characteristics.predators) {
    				if (if_block8) {
    					if_block8.p(ctx, dirty);
    				} else {
    					if_block8 = create_if_block_20(ctx);
    					if_block8.c();
    					if_block8.m(ul, t10);
    				}
    			} else if (if_block8) {
    				if_block8.d(1);
    				if_block8 = null;
    			}

    			if (/*info*/ ctx[0].characteristics.habitat) {
    				if (if_block9) {
    					if_block9.p(ctx, dirty);
    				} else {
    					if_block9 = create_if_block_19(ctx);
    					if_block9.c();
    					if_block9.m(ul, t11);
    				}
    			} else if (if_block9) {
    				if_block9.d(1);
    				if_block9 = null;
    			}

    			if (/*info*/ ctx[0].characteristics.origin) {
    				if (if_block10) {
    					if_block10.p(ctx, dirty);
    				} else {
    					if_block10 = create_if_block_18(ctx);
    					if_block10.c();
    					if_block10.m(ul, t12);
    				}
    			} else if (if_block10) {
    				if_block10.d(1);
    				if_block10 = null;
    			}

    			if (/*info*/ ctx[0].characteristics.location) {
    				if (if_block11) {
    					if_block11.p(ctx, dirty);
    				} else {
    					if_block11 = create_if_block_17(ctx);
    					if_block11.c();
    					if_block11.m(ul, t13);
    				}
    			} else if (if_block11) {
    				if_block11.d(1);
    				if_block11 = null;
    			}

    			if (/*info*/ ctx[0].characteristics.water_type) {
    				if (if_block12) {
    					if_block12.p(ctx, dirty);
    				} else {
    					if_block12 = create_if_block_16(ctx);
    					if_block12.c();
    					if_block12.m(ul, t14);
    				}
    			} else if (if_block12) {
    				if_block12.d(1);
    				if_block12 = null;
    			}

    			if (current_block_type_1 === (current_block_type_1 = select_block_type_1(ctx)) && if_block13) {
    				if_block13.p(ctx, dirty);
    			} else {
    				if (if_block13) if_block13.d(1);
    				if_block13 = current_block_type_1 && current_block_type_1(ctx);

    				if (if_block13) {
    					if_block13.c();
    					if_block13.m(ul, t15);
    				}
    			}

    			if (/*info*/ ctx[0].characteristics.group_behavior) {
    				if (if_block14) {
    					if_block14.p(ctx, dirty);
    				} else {
    					if_block14 = create_if_block_13(ctx);
    					if_block14.c();
    					if_block14.m(ul, t16);
    				}
    			} else if (if_block14) {
    				if_block14.d(1);
    				if_block14 = null;
    			}

    			if (/*info*/ ctx[0].characteristics.estimated_population_size) {
    				if (if_block15) {
    					if_block15.p(ctx, dirty);
    				} else {
    					if_block15 = create_if_block_12(ctx);
    					if_block15.c();
    					if_block15.m(ul, t17);
    				}
    			} else if (if_block15) {
    				if_block15.d(1);
    				if_block15 = null;
    			}

    			if (/*info*/ ctx[0].characteristics.number_of_species) {
    				if (if_block16) {
    					if_block16.p(ctx, dirty);
    				} else {
    					if_block16 = create_if_block_11(ctx);
    					if_block16.c();
    					if_block16.m(ul, t18);
    				}
    			} else if (if_block16) {
    				if_block16.d(1);
    				if_block16 = null;
    			}

    			if (/*info*/ ctx[0].characteristics.skin_type) {
    				if (if_block17) {
    					if_block17.p(ctx, dirty);
    				} else {
    					if_block17 = create_if_block_10(ctx);
    					if_block17.c();
    					if_block17.m(ul, t19);
    				}
    			} else if (if_block17) {
    				if_block17.d(1);
    				if_block17 = null;
    			}

    			if (/*info*/ ctx[0].characteristics.top_speed) {
    				if (if_block18) {
    					if_block18.p(ctx, dirty);
    				} else {
    					if_block18 = create_if_block_9(ctx);
    					if_block18.c();
    					if_block18.m(ul, t20);
    				}
    			} else if (if_block18) {
    				if_block18.d(1);
    				if_block18 = null;
    			}

    			if (/*info*/ ctx[0].characteristics.lifespan) {
    				if (if_block19) {
    					if_block19.p(ctx, dirty);
    				} else {
    					if_block19 = create_if_block_8(ctx);
    					if_block19.c();
    					if_block19.m(ul, t21);
    				}
    			} else if (if_block19) {
    				if_block19.d(1);
    				if_block19 = null;
    			}

    			if (/*info*/ ctx[0].characteristics.weight) {
    				if (if_block20) {
    					if_block20.p(ctx, dirty);
    				} else {
    					if_block20 = create_if_block_7(ctx);
    					if_block20.c();
    					if_block20.m(ul, t22);
    				}
    			} else if (if_block20) {
    				if_block20.d(1);
    				if_block20 = null;
    			}

    			if (/*info*/ ctx[0].characteristics.height) {
    				if (if_block21) {
    					if_block21.p(ctx, dirty);
    				} else {
    					if_block21 = create_if_block_6(ctx);
    					if_block21.c();
    					if_block21.m(ul, t23);
    				}
    			} else if (if_block21) {
    				if_block21.d(1);
    				if_block21 = null;
    			}

    			if (/*info*/ ctx[0].characteristics.length) {
    				if (if_block22) {
    					if_block22.p(ctx, dirty);
    				} else {
    					if_block22 = create_if_block_5(ctx);
    					if_block22.c();
    					if_block22.m(ul, t24);
    				}
    			} else if (if_block22) {
    				if_block22.d(1);
    				if_block22 = null;
    			}

    			if (/*info*/ ctx[0].characteristics.age_of_sexual_maturity) {
    				if (if_block23) {
    					if_block23.p(ctx, dirty);
    				} else {
    					if_block23 = create_if_block_4(ctx);
    					if_block23.c();
    					if_block23.m(ul, t25);
    				}
    			} else if (if_block23) {
    				if_block23.d(1);
    				if_block23 = null;
    			}

    			if (/*info*/ ctx[0].characteristics.age_of_weaning) {
    				if (if_block24) {
    					if_block24.p(ctx, dirty);
    				} else {
    					if_block24 = create_if_block_3(ctx);
    					if_block24.c();
    					if_block24.m(ul, t26);
    				}
    			} else if (if_block24) {
    				if_block24.d(1);
    				if_block24 = null;
    			}

    			if (/*info*/ ctx[0].characteristics.average_litter_size) {
    				if (if_block25) {
    					if_block25.p(ctx, dirty);
    				} else {
    					if_block25 = create_if_block_2$1(ctx);
    					if_block25.c();
    					if_block25.m(ul, t27);
    				}
    			} else if (if_block25) {
    				if_block25.d(1);
    				if_block25 = null;
    			}

    			if (/*info*/ ctx[0].characteristics.gestation_period) {
    				if (if_block26) {
    					if_block26.p(ctx, dirty);
    				} else {
    					if_block26 = create_if_block_1$3(ctx);
    					if_block26.c();
    					if_block26.m(ul, null);
    				}
    			} else if (if_block26) {
    				if_block26.d(1);
    				if_block26 = null;
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);
    			if (if_block0) if_block0.d();
    			if (if_block1) if_block1.d();
    			if (if_block2) if_block2.d();
    			if (if_block3) if_block3.d();
    			if (if_block4) if_block4.d();
    			if (if_block5) if_block5.d();
    			if (if_block6) if_block6.d();

    			if (if_block7) {
    				if_block7.d();
    			}

    			if (if_block8) if_block8.d();
    			if (if_block9) if_block9.d();
    			if (if_block10) if_block10.d();
    			if (if_block11) if_block11.d();
    			if (if_block12) if_block12.d();

    			if (if_block13) {
    				if_block13.d();
    			}

    			if (if_block14) if_block14.d();
    			if (if_block15) if_block15.d();
    			if (if_block16) if_block16.d();
    			if (if_block17) if_block17.d();
    			if (if_block18) if_block18.d();
    			if (if_block19) if_block19.d();
    			if (if_block20) if_block20.d();
    			if (if_block21) if_block21.d();
    			if (if_block22) if_block22.d();
    			if (if_block23) if_block23.d();
    			if (if_block24) if_block24.d();
    			if (if_block25) if_block25.d();
    			if (if_block26) if_block26.d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$4.name,
    		type: "if",
    		source: "(71:8) {#if info.characteristics}",
    		ctx
    	});

    	return block;
    }

    // (75:20) {#if info.characteristics.common_name}
    function create_if_block_29(ctx) {
    	let li;
    	let t0;
    	let t1_value = /*info*/ ctx[0].characteristics.common_name + "";
    	let t1;

    	const block = {
    		c: function create() {
    			li = element("li");
    			t0 = text("Common name: ");
    			t1 = text(t1_value);
    			attr_dev(li, "class", "svelte-1pk0bii");
    			add_location(li, file$a, 75, 24, 2962);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, li, anchor);
    			append_dev(li, t0);
    			append_dev(li, t1);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*info*/ 1 && t1_value !== (t1_value = /*info*/ ctx[0].characteristics.common_name + "")) set_data_dev(t1, t1_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(li);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_29.name,
    		type: "if",
    		source: "(75:20) {#if info.characteristics.common_name}",
    		ctx
    	});

    	return block;
    }

    // (78:20) {#if info.characteristics.name_of_young}
    function create_if_block_28(ctx) {
    	let li;
    	let t0;
    	let t1_value = /*info*/ ctx[0].characteristics.name_of_young + "";
    	let t1;

    	const block = {
    		c: function create() {
    			li = element("li");
    			t0 = text("Name of young: ");
    			t1 = text(t1_value);
    			attr_dev(li, "class", "svelte-1pk0bii");
    			add_location(li, file$a, 78, 24, 3133);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, li, anchor);
    			append_dev(li, t0);
    			append_dev(li, t1);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*info*/ 1 && t1_value !== (t1_value = /*info*/ ctx[0].characteristics.name_of_young + "")) set_data_dev(t1, t1_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(li);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_28.name,
    		type: "if",
    		source: "(78:20) {#if info.characteristics.name_of_young}",
    		ctx
    	});

    	return block;
    }

    // (81:20) {#if info.characteristics.slogan}
    function create_if_block_27(ctx) {
    	let li;
    	let t0;
    	let t1_value = /*info*/ ctx[0].characteristics.slogan + "";
    	let t1;

    	const block = {
    		c: function create() {
    			li = element("li");
    			t0 = text("Slogan: ");
    			t1 = text(t1_value);
    			attr_dev(li, "class", "svelte-1pk0bii");
    			add_location(li, file$a, 81, 24, 3301);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, li, anchor);
    			append_dev(li, t0);
    			append_dev(li, t1);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*info*/ 1 && t1_value !== (t1_value = /*info*/ ctx[0].characteristics.slogan + "")) set_data_dev(t1, t1_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(li);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_27.name,
    		type: "if",
    		source: "(81:20) {#if info.characteristics.slogan}",
    		ctx
    	});

    	return block;
    }

    // (84:20) {#if info.characteristics.most_distinctive_feature}
    function create_if_block_26(ctx) {
    	let li;
    	let t0;
    	let t1_value = /*info*/ ctx[0].characteristics.most_distinctive_feature + "";
    	let t1;

    	const block = {
    		c: function create() {
    			li = element("li");
    			t0 = text("Most distinctive feature: ");
    			t1 = text(t1_value);
    			attr_dev(li, "class", "svelte-1pk0bii");
    			add_location(li, file$a, 84, 24, 3473);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, li, anchor);
    			append_dev(li, t0);
    			append_dev(li, t1);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*info*/ 1 && t1_value !== (t1_value = /*info*/ ctx[0].characteristics.most_distinctive_feature + "")) set_data_dev(t1, t1_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(li);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_26.name,
    		type: "if",
    		source: "(84:20) {#if info.characteristics.most_distinctive_feature}",
    		ctx
    	});

    	return block;
    }

    // (87:20) {#if info.characteristics.temperament}
    function create_if_block_25(ctx) {
    	let li;
    	let t0;
    	let t1_value = /*info*/ ctx[0].characteristics.temperament + "";
    	let t1;

    	const block = {
    		c: function create() {
    			li = element("li");
    			t0 = text("Temperament: ");
    			t1 = text(t1_value);
    			attr_dev(li, "class", "svelte-1pk0bii");
    			add_location(li, file$a, 87, 24, 3668);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, li, anchor);
    			append_dev(li, t0);
    			append_dev(li, t1);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*info*/ 1 && t1_value !== (t1_value = /*info*/ ctx[0].characteristics.temperament + "")) set_data_dev(t1, t1_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(li);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_25.name,
    		type: "if",
    		source: "(87:20) {#if info.characteristics.temperament}",
    		ctx
    	});

    	return block;
    }

    // (90:20) {#if info.characteristics.diet}
    function create_if_block_24(ctx) {
    	let li;
    	let t0;
    	let t1_value = /*info*/ ctx[0].characteristics.diet + "";
    	let t1;

    	const block = {
    		c: function create() {
    			li = element("li");
    			t0 = text("Diet: ");
    			t1 = text(t1_value);
    			attr_dev(li, "class", "svelte-1pk0bii");
    			add_location(li, file$a, 90, 24, 3830);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, li, anchor);
    			append_dev(li, t0);
    			append_dev(li, t1);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*info*/ 1 && t1_value !== (t1_value = /*info*/ ctx[0].characteristics.diet + "")) set_data_dev(t1, t1_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(li);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_24.name,
    		type: "if",
    		source: "(90:20) {#if info.characteristics.diet}",
    		ctx
    	});

    	return block;
    }

    // (93:20) {#if info.characteristics.favorite_food}
    function create_if_block_23(ctx) {
    	let li;
    	let t0;
    	let t1_value = /*info*/ ctx[0].characteristics.favorite_food + "";
    	let t1;

    	const block = {
    		c: function create() {
    			li = element("li");
    			t0 = text("Favorite food: ");
    			t1 = text(t1_value);
    			attr_dev(li, "class", "svelte-1pk0bii");
    			add_location(li, file$a, 93, 24, 3987);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, li, anchor);
    			append_dev(li, t0);
    			append_dev(li, t1);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*info*/ 1 && t1_value !== (t1_value = /*info*/ ctx[0].characteristics.favorite_food + "")) set_data_dev(t1, t1_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(li);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_23.name,
    		type: "if",
    		source: "(93:20) {#if info.characteristics.favorite_food}",
    		ctx
    	});

    	return block;
    }

    // (98:61) 
    function create_if_block_22(ctx) {
    	let li;
    	let t0;
    	let t1_value = /*info*/ ctx[0].characteristics.main_prey + "";
    	let t1;

    	const block = {
    		c: function create() {
    			li = element("li");
    			t0 = text("Prey: ");
    			t1 = text(t1_value);
    			attr_dev(li, "class", "svelte-1pk0bii");
    			add_location(li, file$a, 98, 24, 4284);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, li, anchor);
    			append_dev(li, t0);
    			append_dev(li, t1);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*info*/ 1 && t1_value !== (t1_value = /*info*/ ctx[0].characteristics.main_prey + "")) set_data_dev(t1, t1_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(li);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_22.name,
    		type: "if",
    		source: "(98:61) ",
    		ctx
    	});

    	return block;
    }

    // (96:20) {#if info.characteristics.prey}
    function create_if_block_21(ctx) {
    	let li;
    	let t0;
    	let t1_value = /*info*/ ctx[0].characteristics.prey + "";
    	let t1;

    	const block = {
    		c: function create() {
    			li = element("li");
    			t0 = text("Prey: ");
    			t1 = text(t1_value);
    			attr_dev(li, "class", "svelte-1pk0bii");
    			add_location(li, file$a, 96, 24, 4153);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, li, anchor);
    			append_dev(li, t0);
    			append_dev(li, t1);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*info*/ 1 && t1_value !== (t1_value = /*info*/ ctx[0].characteristics.prey + "")) set_data_dev(t1, t1_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(li);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_21.name,
    		type: "if",
    		source: "(96:20) {#if info.characteristics.prey}",
    		ctx
    	});

    	return block;
    }

    // (101:20) {#if info.characteristics.predators}
    function create_if_block_20(ctx) {
    	let li;
    	let t0;
    	let t1_value = /*info*/ ctx[0].characteristics.predators + "";
    	let t1;

    	const block = {
    		c: function create() {
    			li = element("li");
    			t0 = text("Predator: ");
    			t1 = text(t1_value);
    			attr_dev(li, "class", "svelte-1pk0bii");
    			add_location(li, file$a, 101, 24, 4442);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, li, anchor);
    			append_dev(li, t0);
    			append_dev(li, t1);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*info*/ 1 && t1_value !== (t1_value = /*info*/ ctx[0].characteristics.predators + "")) set_data_dev(t1, t1_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(li);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_20.name,
    		type: "if",
    		source: "(101:20) {#if info.characteristics.predators}",
    		ctx
    	});

    	return block;
    }

    // (104:20) {#if info.characteristics.habitat}
    function create_if_block_19(ctx) {
    	let li;
    	let t0;
    	let t1_value = /*info*/ ctx[0].characteristics.habitat + "";
    	let t1;

    	const block = {
    		c: function create() {
    			li = element("li");
    			t0 = text("Habitat: ");
    			t1 = text(t1_value);
    			attr_dev(li, "class", "svelte-1pk0bii");
    			add_location(li, file$a, 104, 24, 4602);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, li, anchor);
    			append_dev(li, t0);
    			append_dev(li, t1);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*info*/ 1 && t1_value !== (t1_value = /*info*/ ctx[0].characteristics.habitat + "")) set_data_dev(t1, t1_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(li);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_19.name,
    		type: "if",
    		source: "(104:20) {#if info.characteristics.habitat}",
    		ctx
    	});

    	return block;
    }

    // (107:20) {#if info.characteristics.origin}
    function create_if_block_18(ctx) {
    	let li;
    	let t0;
    	let t1_value = /*info*/ ctx[0].characteristics.origin + "";
    	let t1;

    	const block = {
    		c: function create() {
    			li = element("li");
    			t0 = text("Origin: ");
    			t1 = text(t1_value);
    			attr_dev(li, "class", "svelte-1pk0bii");
    			add_location(li, file$a, 107, 24, 4758);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, li, anchor);
    			append_dev(li, t0);
    			append_dev(li, t1);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*info*/ 1 && t1_value !== (t1_value = /*info*/ ctx[0].characteristics.origin + "")) set_data_dev(t1, t1_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(li);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_18.name,
    		type: "if",
    		source: "(107:20) {#if info.characteristics.origin}",
    		ctx
    	});

    	return block;
    }

    // (110:20) {#if info.characteristics.location}
    function create_if_block_17(ctx) {
    	let li;
    	let t0;
    	let t1_value = /*info*/ ctx[0].characteristics.location + "";
    	let t1;

    	const block = {
    		c: function create() {
    			li = element("li");
    			t0 = text("Location: ");
    			t1 = text(t1_value);
    			attr_dev(li, "class", "svelte-1pk0bii");
    			add_location(li, file$a, 110, 24, 4914);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, li, anchor);
    			append_dev(li, t0);
    			append_dev(li, t1);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*info*/ 1 && t1_value !== (t1_value = /*info*/ ctx[0].characteristics.location + "")) set_data_dev(t1, t1_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(li);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_17.name,
    		type: "if",
    		source: "(110:20) {#if info.characteristics.location}",
    		ctx
    	});

    	return block;
    }

    // (113:20) {#if info.characteristics.water_type}
    function create_if_block_16(ctx) {
    	let li;
    	let t0;
    	let t1_value = /*info*/ ctx[0].characteristics.water_type + "";
    	let t1;

    	const block = {
    		c: function create() {
    			li = element("li");
    			t0 = text("Water type: ");
    			t1 = text(t1_value);
    			attr_dev(li, "class", "svelte-1pk0bii");
    			add_location(li, file$a, 113, 24, 5076);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, li, anchor);
    			append_dev(li, t0);
    			append_dev(li, t1);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*info*/ 1 && t1_value !== (t1_value = /*info*/ ctx[0].characteristics.water_type + "")) set_data_dev(t1, t1_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(li);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_16.name,
    		type: "if",
    		source: "(113:20) {#if info.characteristics.water_type}",
    		ctx
    	});

    	return block;
    }

    // (118:56) 
    function create_if_block_15(ctx) {
    	let li;
    	let t0;
    	let t1_value = /*info*/ ctx[0].characteristics.type + "";
    	let t1;

    	const block = {
    		c: function create() {
    			li = element("li");
    			t0 = text("Type: ");
    			t1 = text(t1_value);
    			attr_dev(li, "class", "svelte-1pk0bii");
    			add_location(li, file$a, 118, 24, 5364);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, li, anchor);
    			append_dev(li, t0);
    			append_dev(li, t1);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*info*/ 1 && t1_value !== (t1_value = /*info*/ ctx[0].characteristics.type + "")) set_data_dev(t1, t1_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(li);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_15.name,
    		type: "if",
    		source: "(118:56) ",
    		ctx
    	});

    	return block;
    }

    // (116:20) {#if info.characteristics.group}
    function create_if_block_14(ctx) {
    	let li;
    	let t0;
    	let t1_value = /*info*/ ctx[0].characteristics.group + "";
    	let t1;

    	const block = {
    		c: function create() {
    			li = element("li");
    			t0 = text("Type: ");
    			t1 = text(t1_value);
    			attr_dev(li, "class", "svelte-1pk0bii");
    			add_location(li, file$a, 116, 24, 5237);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, li, anchor);
    			append_dev(li, t0);
    			append_dev(li, t1);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*info*/ 1 && t1_value !== (t1_value = /*info*/ ctx[0].characteristics.group + "")) set_data_dev(t1, t1_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(li);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_14.name,
    		type: "if",
    		source: "(116:20) {#if info.characteristics.group}",
    		ctx
    	});

    	return block;
    }

    // (121:20) {#if info.characteristics.group_behavior}
    function create_if_block_13(ctx) {
    	let li;
    	let t0;
    	let t1_value = /*info*/ ctx[0].characteristics.group_behavior + "";
    	let t1;

    	const block = {
    		c: function create() {
    			li = element("li");
    			t0 = text("Group behavior: ");
    			t1 = text(t1_value);
    			attr_dev(li, "class", "svelte-1pk0bii");
    			add_location(li, file$a, 121, 24, 5522);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, li, anchor);
    			append_dev(li, t0);
    			append_dev(li, t1);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*info*/ 1 && t1_value !== (t1_value = /*info*/ ctx[0].characteristics.group_behavior + "")) set_data_dev(t1, t1_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(li);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_13.name,
    		type: "if",
    		source: "(121:20) {#if info.characteristics.group_behavior}",
    		ctx
    	});

    	return block;
    }

    // (124:20) {#if info.characteristics.estimated_population_size}
    function create_if_block_12(ctx) {
    	let li;
    	let t0;
    	let t1_value = /*info*/ ctx[0].characteristics.estimated_population_size + "";
    	let t1;

    	const block = {
    		c: function create() {
    			li = element("li");
    			t0 = text("Estimated population size: ");
    			t1 = text(t1_value);
    			attr_dev(li, "class", "svelte-1pk0bii");
    			add_location(li, file$a, 124, 24, 5711);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, li, anchor);
    			append_dev(li, t0);
    			append_dev(li, t1);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*info*/ 1 && t1_value !== (t1_value = /*info*/ ctx[0].characteristics.estimated_population_size + "")) set_data_dev(t1, t1_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(li);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_12.name,
    		type: "if",
    		source: "(124:20) {#if info.characteristics.estimated_population_size}",
    		ctx
    	});

    	return block;
    }

    // (127:20) {#if info.characteristics.number_of_species}
    function create_if_block_11(ctx) {
    	let li;
    	let t0;
    	let t1_value = /*info*/ ctx[0].characteristics.number_of_species + "";
    	let t1;

    	const block = {
    		c: function create() {
    			li = element("li");
    			t0 = text("Number of species: ");
    			t1 = text(t1_value);
    			attr_dev(li, "class", "svelte-1pk0bii");
    			add_location(li, file$a, 127, 24, 5914);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, li, anchor);
    			append_dev(li, t0);
    			append_dev(li, t1);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*info*/ 1 && t1_value !== (t1_value = /*info*/ ctx[0].characteristics.number_of_species + "")) set_data_dev(t1, t1_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(li);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_11.name,
    		type: "if",
    		source: "(127:20) {#if info.characteristics.number_of_species}",
    		ctx
    	});

    	return block;
    }

    // (130:20) {#if info.characteristics.skin_type}
    function create_if_block_10(ctx) {
    	let li;
    	let t0;
    	let t1_value = /*info*/ ctx[0].characteristics.skin_type + "";
    	let t1;

    	const block = {
    		c: function create() {
    			li = element("li");
    			t0 = text("Skin type: ");
    			t1 = text(t1_value);
    			attr_dev(li, "class", "svelte-1pk0bii");
    			add_location(li, file$a, 130, 24, 6093);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, li, anchor);
    			append_dev(li, t0);
    			append_dev(li, t1);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*info*/ 1 && t1_value !== (t1_value = /*info*/ ctx[0].characteristics.skin_type + "")) set_data_dev(t1, t1_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(li);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_10.name,
    		type: "if",
    		source: "(130:20) {#if info.characteristics.skin_type}",
    		ctx
    	});

    	return block;
    }

    // (133:20) {#if info.characteristics.top_speed}
    function create_if_block_9(ctx) {
    	let li;
    	let t0;
    	let t1_value = /*info*/ ctx[0].characteristics.top_speed + "";
    	let t1;

    	const block = {
    		c: function create() {
    			li = element("li");
    			t0 = text("Top speed: ");
    			t1 = text(t1_value);
    			attr_dev(li, "class", "svelte-1pk0bii");
    			add_location(li, file$a, 133, 24, 6256);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, li, anchor);
    			append_dev(li, t0);
    			append_dev(li, t1);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*info*/ 1 && t1_value !== (t1_value = /*info*/ ctx[0].characteristics.top_speed + "")) set_data_dev(t1, t1_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(li);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_9.name,
    		type: "if",
    		source: "(133:20) {#if info.characteristics.top_speed}",
    		ctx
    	});

    	return block;
    }

    // (136:20) {#if info.characteristics.lifespan}
    function create_if_block_8(ctx) {
    	let li;
    	let t0;
    	let t1_value = /*info*/ ctx[0].characteristics.lifespan + "";
    	let t1;

    	const block = {
    		c: function create() {
    			li = element("li");
    			t0 = text("Lifespan: ");
    			t1 = text(t1_value);
    			attr_dev(li, "class", "svelte-1pk0bii");
    			add_location(li, file$a, 136, 24, 6418);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, li, anchor);
    			append_dev(li, t0);
    			append_dev(li, t1);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*info*/ 1 && t1_value !== (t1_value = /*info*/ ctx[0].characteristics.lifespan + "")) set_data_dev(t1, t1_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(li);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_8.name,
    		type: "if",
    		source: "(136:20) {#if info.characteristics.lifespan}",
    		ctx
    	});

    	return block;
    }

    // (139:20) {#if info.characteristics.weight}
    function create_if_block_7(ctx) {
    	let li;
    	let t0;
    	let t1_value = /*info*/ ctx[0].characteristics.weight + "";
    	let t1;

    	const block = {
    		c: function create() {
    			li = element("li");
    			t0 = text("Weight: ");
    			t1 = text(t1_value);
    			attr_dev(li, "class", "svelte-1pk0bii");
    			add_location(li, file$a, 139, 24, 6576);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, li, anchor);
    			append_dev(li, t0);
    			append_dev(li, t1);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*info*/ 1 && t1_value !== (t1_value = /*info*/ ctx[0].characteristics.weight + "")) set_data_dev(t1, t1_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(li);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_7.name,
    		type: "if",
    		source: "(139:20) {#if info.characteristics.weight}",
    		ctx
    	});

    	return block;
    }

    // (142:20) {#if info.characteristics.height}
    function create_if_block_6(ctx) {
    	let li;
    	let t0;
    	let t1_value = /*info*/ ctx[0].characteristics.height + "";
    	let t1;

    	const block = {
    		c: function create() {
    			li = element("li");
    			t0 = text("Height: ");
    			t1 = text(t1_value);
    			attr_dev(li, "class", "svelte-1pk0bii");
    			add_location(li, file$a, 142, 24, 6730);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, li, anchor);
    			append_dev(li, t0);
    			append_dev(li, t1);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*info*/ 1 && t1_value !== (t1_value = /*info*/ ctx[0].characteristics.height + "")) set_data_dev(t1, t1_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(li);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_6.name,
    		type: "if",
    		source: "(142:20) {#if info.characteristics.height}",
    		ctx
    	});

    	return block;
    }

    // (145:20) {#if info.characteristics.length}
    function create_if_block_5(ctx) {
    	let li;
    	let t0;
    	let t1_value = /*info*/ ctx[0].characteristics.length + "";
    	let t1;

    	const block = {
    		c: function create() {
    			li = element("li");
    			t0 = text("Length: ");
    			t1 = text(t1_value);
    			attr_dev(li, "class", "svelte-1pk0bii");
    			add_location(li, file$a, 145, 24, 6884);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, li, anchor);
    			append_dev(li, t0);
    			append_dev(li, t1);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*info*/ 1 && t1_value !== (t1_value = /*info*/ ctx[0].characteristics.length + "")) set_data_dev(t1, t1_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(li);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_5.name,
    		type: "if",
    		source: "(145:20) {#if info.characteristics.length}",
    		ctx
    	});

    	return block;
    }

    // (148:20) {#if info.characteristics.age_of_sexual_maturity}
    function create_if_block_4(ctx) {
    	let li;
    	let t0;
    	let t1_value = /*info*/ ctx[0].characteristics.age_of_sexual_maturity + "";
    	let t1;

    	const block = {
    		c: function create() {
    			li = element("li");
    			t0 = text("Age of sexual maturity: ");
    			t1 = text(t1_value);
    			attr_dev(li, "class", "svelte-1pk0bii");
    			add_location(li, file$a, 148, 24, 7054);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, li, anchor);
    			append_dev(li, t0);
    			append_dev(li, t1);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*info*/ 1 && t1_value !== (t1_value = /*info*/ ctx[0].characteristics.age_of_sexual_maturity + "")) set_data_dev(t1, t1_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(li);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_4.name,
    		type: "if",
    		source: "(148:20) {#if info.characteristics.age_of_sexual_maturity}",
    		ctx
    	});

    	return block;
    }

    // (151:20) {#if info.characteristics.age_of_weaning}
    function create_if_block_3(ctx) {
    	let li;
    	let t0;
    	let t1_value = /*info*/ ctx[0].characteristics.age_of_weaning + "";
    	let t1;

    	const block = {
    		c: function create() {
    			li = element("li");
    			t0 = text("Age of weaning: ");
    			t1 = text(t1_value);
    			attr_dev(li, "class", "svelte-1pk0bii");
    			add_location(li, file$a, 151, 24, 7248);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, li, anchor);
    			append_dev(li, t0);
    			append_dev(li, t1);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*info*/ 1 && t1_value !== (t1_value = /*info*/ ctx[0].characteristics.age_of_weaning + "")) set_data_dev(t1, t1_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(li);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_3.name,
    		type: "if",
    		source: "(151:20) {#if info.characteristics.age_of_weaning}",
    		ctx
    	});

    	return block;
    }

    // (154:20) {#if info.characteristics.average_litter_size}
    function create_if_block_2$1(ctx) {
    	let li;
    	let t0;
    	let t1_value = /*info*/ ctx[0].characteristics.average_litter_size + "";
    	let t1;

    	const block = {
    		c: function create() {
    			li = element("li");
    			t0 = text("Average litter size: ");
    			t1 = text(t1_value);
    			attr_dev(li, "class", "svelte-1pk0bii");
    			add_location(li, file$a, 154, 24, 7431);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, li, anchor);
    			append_dev(li, t0);
    			append_dev(li, t1);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*info*/ 1 && t1_value !== (t1_value = /*info*/ ctx[0].characteristics.average_litter_size + "")) set_data_dev(t1, t1_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(li);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_2$1.name,
    		type: "if",
    		source: "(154:20) {#if info.characteristics.average_litter_size}",
    		ctx
    	});

    	return block;
    }

    // (157:20) {#if info.characteristics.gestation_period}
    function create_if_block_1$3(ctx) {
    	let li;
    	let t0;
    	let t1_value = /*info*/ ctx[0].characteristics.gestation_period + "";
    	let t1;

    	const block = {
    		c: function create() {
    			li = element("li");
    			t0 = text("Gestation period: ");
    			t1 = text(t1_value);
    			attr_dev(li, "class", "svelte-1pk0bii");
    			add_location(li, file$a, 157, 24, 7621);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, li, anchor);
    			append_dev(li, t0);
    			append_dev(li, t1);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*info*/ 1 && t1_value !== (t1_value = /*info*/ ctx[0].characteristics.gestation_period + "")) set_data_dev(t1, t1_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(li);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$3.name,
    		type: "if",
    		source: "(157:20) {#if info.characteristics.gestation_period}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$a(ctx) {
    	let animalmodal;
    	let updating_isModalOpen;
    	let t0;
    	let div5;
    	let div0;
    	let img;
    	let img_src_value;
    	let img_alt_value;
    	let t1;
    	let div1;
    	let t2_value = /*info*/ ctx[0].name + "";
    	let t2;
    	let button;
    	let t3;
    	let div4;
    	let div3;
    	let div2;
    	let t5;
    	let ul;
    	let li0;
    	let t6;
    	let t7_value = /*info*/ ctx[0].taxonomy.kingdom + "";
    	let t7;
    	let t8;
    	let li1;
    	let t9;
    	let t10_value = /*info*/ ctx[0].taxonomy.phylum + "";
    	let t10;
    	let t11;
    	let li2;
    	let t12;
    	let t13_value = /*info*/ ctx[0].taxonomy.class + "";
    	let t13;
    	let t14;
    	let li3;
    	let t15;
    	let t16_value = /*info*/ ctx[0].taxonomy.order + "";
    	let t16;
    	let t17;
    	let li4;
    	let t18;
    	let t19_value = /*info*/ ctx[0].taxonomy.family + "";
    	let t19;
    	let t20;
    	let t21;
    	let li5;
    	let t22;
    	let t23_value = /*info*/ ctx[0].taxonomy.scientific_name + "";
    	let t23;
    	let t24;
    	let t25;
    	let div5_transition;
    	let current;
    	let mounted;
    	let dispose;

    	function animalmodal_isModalOpen_binding(value) {
    		/*animalmodal_isModalOpen_binding*/ ctx[5](value);
    	}

    	let animalmodal_props = {
    		info: /*info*/ ctx[0],
    		imgSrc: /*imgSrc*/ ctx[3]
    	};

    	if (/*isModalOpen*/ ctx[4] !== void 0) {
    		animalmodal_props.isModalOpen = /*isModalOpen*/ ctx[4];
    	}

    	animalmodal = new AnimalModal({ props: animalmodal_props, $$inline: true });
    	binding_callbacks.push(() => bind(animalmodal, 'isModalOpen', animalmodal_isModalOpen_binding));
    	let if_block0 = /*screenWidth*/ ctx[2] > 500 && create_if_block_32(ctx);
    	let if_block1 = /*info*/ ctx[0].taxonomy.genus && create_if_block_31(ctx);
    	let if_block2 = /*info*/ ctx[0].locations && create_if_block_30(ctx);
    	let if_block3 = /*info*/ ctx[0].characteristics && create_if_block$4(ctx);

    	const block = {
    		c: function create() {
    			create_component(animalmodal.$$.fragment);
    			t0 = space();
    			div5 = element("div");
    			div0 = element("div");
    			img = element("img");
    			t1 = space();
    			div1 = element("div");
    			t2 = text(t2_value);
    			button = element("button");
    			if (if_block0) if_block0.c();
    			t3 = space();
    			div4 = element("div");
    			div3 = element("div");
    			div2 = element("div");
    			div2.textContent = "Taxonomy:";
    			t5 = space();
    			ul = element("ul");
    			li0 = element("li");
    			t6 = text("Kingdom: ");
    			t7 = text(t7_value);
    			t8 = space();
    			li1 = element("li");
    			t9 = text("Phylum: ");
    			t10 = text(t10_value);
    			t11 = space();
    			li2 = element("li");
    			t12 = text("Class: ");
    			t13 = text(t13_value);
    			t14 = space();
    			li3 = element("li");
    			t15 = text("Order: ");
    			t16 = text(t16_value);
    			t17 = space();
    			li4 = element("li");
    			t18 = text("Family: ");
    			t19 = text(t19_value);
    			t20 = space();
    			if (if_block1) if_block1.c();
    			t21 = space();
    			li5 = element("li");
    			t22 = text("Scientific Name: ");
    			t23 = text(t23_value);
    			t24 = space();
    			if (if_block2) if_block2.c();
    			t25 = space();
    			if (if_block3) if_block3.c();
    			attr_dev(img, "id", "animalInfoImg");
    			if (!src_url_equal(img.src, img_src_value = /*imgSrc*/ ctx[3])) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", img_alt_value = /*info*/ ctx[0].name);
    			attr_dev(img, "class", "svelte-1pk0bii");
    			add_location(img, file$a, 38, 8, 1415);
    			set_style(div0, "text-align", "center");
    			add_location(div0, file$a, 37, 4, 1373);
    			attr_dev(button, "class", "openModalBtn svelte-1pk0bii");
    			add_location(button, file$a, 41, 19, 1531);
    			attr_dev(div1, "class", "animalName svelte-1pk0bii");
    			add_location(div1, file$a, 40, 4, 1486);
    			attr_dev(div2, "class", "animalInfo svelte-1pk0bii");
    			add_location(div2, file$a, 49, 12, 1809);
    			attr_dev(li0, "class", "svelte-1pk0bii");
    			add_location(li0, file$a, 51, 16, 1901);
    			attr_dev(li1, "class", "svelte-1pk0bii");
    			add_location(li1, file$a, 52, 16, 1960);
    			attr_dev(li2, "class", "svelte-1pk0bii");
    			add_location(li2, file$a, 53, 16, 2017);
    			attr_dev(li3, "class", "svelte-1pk0bii");
    			add_location(li3, file$a, 54, 16, 2072);
    			attr_dev(li4, "class", "svelte-1pk0bii");
    			add_location(li4, file$a, 55, 16, 2127);
    			attr_dev(li5, "class", "svelte-1pk0bii");
    			add_location(li5, file$a, 59, 16, 2309);
    			attr_dev(ul, "class", "infoList svelte-1pk0bii");
    			add_location(ul, file$a, 50, 12, 1862);
    			attr_dev(div3, "class", "col");
    			add_location(div3, file$a, 48, 8, 1778);
    			attr_dev(div4, "class", "row align-items-start");
    			add_location(div4, file$a, 47, 4, 1733);
    			attr_dev(div5, "class", "infoContainer container-fluid svelte-1pk0bii");
    			toggle_class(div5, "mobile", /*screenWidth*/ ctx[2] < 500);
    			add_location(div5, file$a, 36, 0, 1252);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			mount_component(animalmodal, target, anchor);
    			insert_dev(target, t0, anchor);
    			insert_dev(target, div5, anchor);
    			append_dev(div5, div0);
    			append_dev(div0, img);
    			append_dev(div5, t1);
    			append_dev(div5, div1);
    			append_dev(div1, t2);
    			append_dev(div1, button);
    			if (if_block0) if_block0.m(button, null);
    			append_dev(div5, t3);
    			append_dev(div5, div4);
    			append_dev(div4, div3);
    			append_dev(div3, div2);
    			append_dev(div3, t5);
    			append_dev(div3, ul);
    			append_dev(ul, li0);
    			append_dev(li0, t6);
    			append_dev(li0, t7);
    			append_dev(ul, t8);
    			append_dev(ul, li1);
    			append_dev(li1, t9);
    			append_dev(li1, t10);
    			append_dev(ul, t11);
    			append_dev(ul, li2);
    			append_dev(li2, t12);
    			append_dev(li2, t13);
    			append_dev(ul, t14);
    			append_dev(ul, li3);
    			append_dev(li3, t15);
    			append_dev(li3, t16);
    			append_dev(ul, t17);
    			append_dev(ul, li4);
    			append_dev(li4, t18);
    			append_dev(li4, t19);
    			append_dev(ul, t20);
    			if (if_block1) if_block1.m(ul, null);
    			append_dev(ul, t21);
    			append_dev(ul, li5);
    			append_dev(li5, t22);
    			append_dev(li5, t23);
    			append_dev(div3, t24);
    			if (if_block2) if_block2.m(div3, null);
    			append_dev(div4, t25);
    			if (if_block3) if_block3.m(div4, null);
    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(button, "click", /*click_handler*/ ctx[6], false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, [dirty]) {
    			ctx = new_ctx;
    			const animalmodal_changes = {};
    			if (dirty & /*info*/ 1) animalmodal_changes.info = /*info*/ ctx[0];
    			if (dirty & /*imgSrc*/ 8) animalmodal_changes.imgSrc = /*imgSrc*/ ctx[3];

    			if (!updating_isModalOpen && dirty & /*isModalOpen*/ 16) {
    				updating_isModalOpen = true;
    				animalmodal_changes.isModalOpen = /*isModalOpen*/ ctx[4];
    				add_flush_callback(() => updating_isModalOpen = false);
    			}

    			animalmodal.$set(animalmodal_changes);

    			if (!current || dirty & /*imgSrc*/ 8 && !src_url_equal(img.src, img_src_value = /*imgSrc*/ ctx[3])) {
    				attr_dev(img, "src", img_src_value);
    			}

    			if (!current || dirty & /*info*/ 1 && img_alt_value !== (img_alt_value = /*info*/ ctx[0].name)) {
    				attr_dev(img, "alt", img_alt_value);
    			}

    			if ((!current || dirty & /*info*/ 1) && t2_value !== (t2_value = /*info*/ ctx[0].name + "")) set_data_dev(t2, t2_value);

    			if (/*screenWidth*/ ctx[2] > 500) {
    				if (if_block0) ; else {
    					if_block0 = create_if_block_32(ctx);
    					if_block0.c();
    					if_block0.m(button, null);
    				}
    			} else if (if_block0) {
    				if_block0.d(1);
    				if_block0 = null;
    			}

    			if ((!current || dirty & /*info*/ 1) && t7_value !== (t7_value = /*info*/ ctx[0].taxonomy.kingdom + "")) set_data_dev(t7, t7_value);
    			if ((!current || dirty & /*info*/ 1) && t10_value !== (t10_value = /*info*/ ctx[0].taxonomy.phylum + "")) set_data_dev(t10, t10_value);
    			if ((!current || dirty & /*info*/ 1) && t13_value !== (t13_value = /*info*/ ctx[0].taxonomy.class + "")) set_data_dev(t13, t13_value);
    			if ((!current || dirty & /*info*/ 1) && t16_value !== (t16_value = /*info*/ ctx[0].taxonomy.order + "")) set_data_dev(t16, t16_value);
    			if ((!current || dirty & /*info*/ 1) && t19_value !== (t19_value = /*info*/ ctx[0].taxonomy.family + "")) set_data_dev(t19, t19_value);

    			if (/*info*/ ctx[0].taxonomy.genus) {
    				if (if_block1) {
    					if_block1.p(ctx, dirty);
    				} else {
    					if_block1 = create_if_block_31(ctx);
    					if_block1.c();
    					if_block1.m(ul, t21);
    				}
    			} else if (if_block1) {
    				if_block1.d(1);
    				if_block1 = null;
    			}

    			if ((!current || dirty & /*info*/ 1) && t23_value !== (t23_value = /*info*/ ctx[0].taxonomy.scientific_name + "")) set_data_dev(t23, t23_value);

    			if (/*info*/ ctx[0].locations) {
    				if (if_block2) {
    					if_block2.p(ctx, dirty);
    				} else {
    					if_block2 = create_if_block_30(ctx);
    					if_block2.c();
    					if_block2.m(div3, null);
    				}
    			} else if (if_block2) {
    				if_block2.d(1);
    				if_block2 = null;
    			}

    			if (/*info*/ ctx[0].characteristics) {
    				if (if_block3) {
    					if_block3.p(ctx, dirty);
    				} else {
    					if_block3 = create_if_block$4(ctx);
    					if_block3.c();
    					if_block3.m(div4, null);
    				}
    			} else if (if_block3) {
    				if_block3.d(1);
    				if_block3 = null;
    			}

    			if (!current || dirty & /*screenWidth*/ 4) {
    				toggle_class(div5, "mobile", /*screenWidth*/ ctx[2] < 500);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(animalmodal.$$.fragment, local);

    			add_render_callback(() => {
    				if (!div5_transition) div5_transition = create_bidirectional_transition(div5, fade, { delay: /*fadeDelay*/ ctx[1] }, true);
    				div5_transition.run(1);
    			});

    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(animalmodal.$$.fragment, local);
    			if (!div5_transition) div5_transition = create_bidirectional_transition(div5, fade, { delay: /*fadeDelay*/ ctx[1] }, false);
    			div5_transition.run(0);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(animalmodal, detaching);
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(div5);
    			if (if_block0) if_block0.d();
    			if (if_block1) if_block1.d();
    			if (if_block2) if_block2.d();
    			if (if_block3) if_block3.d();
    			if (detaching && div5_transition) div5_transition.end();
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$a.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    const YOUR_ACCESS_KEY = "L7Fe59lSoILjBgpWKjno9hOoHdGvby60wCspY7MS0iA";

    function instance$a($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('AnimalCard', slots, []);
    	let { info } = $$props;
    	let { fadeDelay } = $$props;
    	var screenWidth = window.innerWidth;

    	window.addEventListener("resize", function (event) {
    		$$invalidate(2, screenWidth = window.innerWidth);
    	});

    	var imgSrc;
    	var isModalOpen = false;

    	fetch("https://api.unsplash.com/search/photos?client_id=" + YOUR_ACCESS_KEY + "&query=" + info.name.replace(" ", "") + "&per_page=3").then(result => {
    		return result.json();
    	}).then(data => {
    		if (data.results[0]) {
    			$$invalidate(3, imgSrc = data.results[Math.floor(Math.random() * data.results.length)].urls.regular);
    		} else {
    			fetch("https://api.unsplash.com/search/photos?client_id=" + YOUR_ACCESS_KEY + "&query=" + info.name + "&per_page=3").then(resul => {
    				return resul.json();
    			}).then(dat => {
    				$$invalidate(3, imgSrc = dat.results[Math.floor(Math.random() * dat.results.length)].urls.regular);
    			});
    		}
    	});

    	$$self.$$.on_mount.push(function () {
    		if (info === undefined && !('info' in $$props || $$self.$$.bound[$$self.$$.props['info']])) {
    			console.warn("<AnimalCard> was created without expected prop 'info'");
    		}

    		if (fadeDelay === undefined && !('fadeDelay' in $$props || $$self.$$.bound[$$self.$$.props['fadeDelay']])) {
    			console.warn("<AnimalCard> was created without expected prop 'fadeDelay'");
    		}
    	});

    	const writable_props = ['info', 'fadeDelay'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<AnimalCard> was created with unknown prop '${key}'`);
    	});

    	function animalmodal_isModalOpen_binding(value) {
    		isModalOpen = value;
    		$$invalidate(4, isModalOpen);
    	}

    	const click_handler = () => $$invalidate(4, isModalOpen = true);

    	$$self.$$set = $$props => {
    		if ('info' in $$props) $$invalidate(0, info = $$props.info);
    		if ('fadeDelay' in $$props) $$invalidate(1, fadeDelay = $$props.fadeDelay);
    	};

    	$$self.$capture_state = () => ({
    		fade,
    		AnimalModal,
    		YOUR_ACCESS_KEY,
    		info,
    		fadeDelay,
    		screenWidth,
    		imgSrc,
    		isModalOpen
    	});

    	$$self.$inject_state = $$props => {
    		if ('info' in $$props) $$invalidate(0, info = $$props.info);
    		if ('fadeDelay' in $$props) $$invalidate(1, fadeDelay = $$props.fadeDelay);
    		if ('screenWidth' in $$props) $$invalidate(2, screenWidth = $$props.screenWidth);
    		if ('imgSrc' in $$props) $$invalidate(3, imgSrc = $$props.imgSrc);
    		if ('isModalOpen' in $$props) $$invalidate(4, isModalOpen = $$props.isModalOpen);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		info,
    		fadeDelay,
    		screenWidth,
    		imgSrc,
    		isModalOpen,
    		animalmodal_isModalOpen_binding,
    		click_handler
    	];
    }

    class AnimalCard extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$a, create_fragment$a, safe_not_equal, { info: 0, fadeDelay: 1 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "AnimalCard",
    			options,
    			id: create_fragment$a.name
    		});
    	}

    	get info() {
    		throw new Error("<AnimalCard>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set info(value) {
    		throw new Error("<AnimalCard>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get fadeDelay() {
    		throw new Error("<AnimalCard>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set fadeDelay(value) {
    		throw new Error("<AnimalCard>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\component\animalInfo\AnimalInfo.svelte generated by Svelte v3.53.1 */
    const file$9 = "src\\component\\animalInfo\\AnimalInfo.svelte";

    function get_each_context_1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[19] = list[i];
    	child_ctx[21] = i;
    	return child_ctx;
    }

    function get_each_context$4(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[19] = list[i];
    	child_ctx[21] = i;
    	return child_ctx;
    }

    function get_each_context_2(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[23] = list[i];
    	child_ctx[21] = i;
    	return child_ctx;
    }

    function get_each_context_3(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[25] = list[i];
    	return child_ctx;
    }

    // (112:12) {#each storedPets as pet}
    function create_each_block_3(ctx) {
    	let button;
    	let t_value = /*pet*/ ctx[25].species + "";
    	let t;
    	let mounted;
    	let dispose;

    	function click_handler_1() {
    		return /*click_handler_1*/ ctx[13](/*pet*/ ctx[25]);
    	}

    	const block = {
    		c: function create() {
    			button = element("button");
    			t = text(t_value);
    			attr_dev(button, "class", "svelte-1x97rt7");
    			add_location(button, file$9, 112, 16, 4030);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, button, anchor);
    			append_dev(button, t);

    			if (!mounted) {
    				dispose = listen_dev(button, "click", click_handler_1, false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			if (dirty & /*storedPets*/ 2 && t_value !== (t_value = /*pet*/ ctx[25].species + "")) set_data_dev(t, t_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(button);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_3.name,
    		type: "each",
    		source: "(112:12) {#each storedPets as pet}",
    		ctx
    	});

    	return block;
    }

    // (117:4) {#if isSearchStarted}
    function create_if_block$3(ctx) {
    	let current_block_type_index;
    	let if_block;
    	let if_block_anchor;
    	let current;
    	const if_block_creators = [create_if_block_1$2, create_else_block$1];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*isResultsEmpty*/ ctx[5]) return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type(ctx);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	const block = {
    		c: function create() {
    			if_block.c();
    			if_block_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if_blocks[current_block_type_index].m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if_blocks[current_block_type_index].p(ctx, dirty);
    			} else {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block = if_blocks[current_block_type_index];

    				if (!if_block) {
    					if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block.c();
    				} else {
    					if_block.p(ctx, dirty);
    				}

    				transition_in(if_block, 1);
    				if_block.m(if_block_anchor.parentNode, if_block_anchor);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if_blocks[current_block_type_index].d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$3.name,
    		type: "if",
    		source: "(117:4) {#if isSearchStarted}",
    		ctx
    	});

    	return block;
    }

    // (123:8) {:else}
    function create_else_block$1(ctx) {
    	let div3;
    	let div0;
    	let each_blocks = [];
    	let each_1_lookup = new Map();
    	let t0;
    	let nav;
    	let ul;
    	let li0;
    	let div1;
    	let span0;
    	let t2;
    	let t3;
    	let li1;
    	let div2;
    	let span1;
    	let current;
    	let mounted;
    	let dispose;
    	let each_value_2 = /*cardsDisplayed*/ ctx[2];
    	validate_each_argument(each_value_2);
    	const get_key = ctx => /*index*/ ctx[21];
    	validate_each_keys(ctx, each_value_2, get_each_context_2, get_key);

    	for (let i = 0; i < each_value_2.length; i += 1) {
    		let child_ctx = get_each_context_2(ctx, each_value_2, i);
    		let key = get_key(child_ctx);
    		each_1_lookup.set(key, each_blocks[i] = create_each_block_2(key, child_ctx));
    	}

    	function select_block_type_1(ctx, dirty) {
    		if (/*isScreenMobile*/ ctx[0]) return create_if_block_2;
    		return create_else_block_1;
    	}

    	let current_block_type = select_block_type_1(ctx);
    	let if_block = current_block_type(ctx);

    	const block = {
    		c: function create() {
    			div3 = element("div");
    			div0 = element("div");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t0 = space();
    			nav = element("nav");
    			ul = element("ul");
    			li0 = element("li");
    			div1 = element("div");
    			span0 = element("span");
    			span0.textContent = "«";
    			t2 = space();
    			if_block.c();
    			t3 = space();
    			li1 = element("li");
    			div2 = element("div");
    			span1 = element("span");
    			span1.textContent = "»";
    			attr_dev(div0, "class", "flex svelte-1x97rt7");
    			set_style(div0, "width", "100%");
    			toggle_class(div0, "wrap", /*isScreenMobile*/ ctx[0]);
    			add_location(div0, file$9, 124, 16, 4618);
    			attr_dev(span0, "aria-hidden", "true");
    			add_location(span0, file$9, 132, 117, 5171);
    			attr_dev(div1, "class", "page-link svelte-1x97rt7");
    			add_location(div1, file$9, 132, 93, 5147);
    			attr_dev(li0, "class", "page-item svelte-1x97rt7");
    			attr_dev(li0, "aria-label", "Previous");
    			add_location(li0, file$9, 132, 24, 5078);
    			attr_dev(span1, "aria-hidden", "true");
    			add_location(span1, file$9, 150, 108, 6471);
    			attr_dev(div2, "class", "page-link svelte-1x97rt7");
    			add_location(div2, file$9, 150, 84, 6447);
    			attr_dev(li1, "class", "page-item svelte-1x97rt7");
    			attr_dev(li1, "aria-label", "Next");
    			add_location(li1, file$9, 150, 24, 6387);
    			attr_dev(ul, "class", "pagination svelte-1x97rt7");
    			add_location(ul, file$9, 130, 20, 4947);
    			attr_dev(nav, "aria-label", "Page navigation");
    			attr_dev(nav, "class", "svelte-1x97rt7");
    			add_location(nav, file$9, 129, 16, 4891);
    			attr_dev(div3, "class", "animalCardsContainer flex content svelte-1x97rt7");
    			add_location(div3, file$9, 123, 12, 4553);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div3, anchor);
    			append_dev(div3, div0);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(div0, null);
    			}

    			append_dev(div3, t0);
    			append_dev(div3, nav);
    			append_dev(nav, ul);
    			append_dev(ul, li0);
    			append_dev(li0, div1);
    			append_dev(div1, span0);
    			append_dev(ul, t2);
    			if_block.m(ul, null);
    			append_dev(ul, t3);
    			append_dev(ul, li1);
    			append_dev(li1, div2);
    			append_dev(div2, span1);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(li0, "click", /*previousPage*/ ctx[10], false, false, false),
    					listen_dev(li1, "click", /*nextPage*/ ctx[11], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*cardsDisplayed*/ 4) {
    				each_value_2 = /*cardsDisplayed*/ ctx[2];
    				validate_each_argument(each_value_2);
    				group_outros();
    				validate_each_keys(ctx, each_value_2, get_each_context_2, get_key);
    				each_blocks = update_keyed_each(each_blocks, dirty, get_key, 1, ctx, each_value_2, each_1_lookup, div0, outro_and_destroy_block, create_each_block_2, null, get_each_context_2);
    				check_outros();
    			}

    			if (!current || dirty & /*isScreenMobile*/ 1) {
    				toggle_class(div0, "wrap", /*isScreenMobile*/ ctx[0]);
    			}

    			if (current_block_type === (current_block_type = select_block_type_1(ctx)) && if_block) {
    				if_block.p(ctx, dirty);
    			} else {
    				if_block.d(1);
    				if_block = current_block_type(ctx);

    				if (if_block) {
    					if_block.c();
    					if_block.m(ul, t3);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;

    			for (let i = 0; i < each_value_2.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			current = true;
    		},
    		o: function outro(local) {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div3);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].d();
    			}

    			if_block.d();
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$1.name,
    		type: "else",
    		source: "(123:8) {:else}",
    		ctx
    	});

    	return block;
    }

    // (118:8) {#if isResultsEmpty}
    function create_if_block_1$2(ctx) {
    	let div1;
    	let div0;
    	let t1;
    	let img;
    	let img_src_value;

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			div0 = element("div");
    			div0.textContent = "Ooops, sorry... Animal Not Found";
    			t1 = space();
    			img = element("img");
    			set_style(div0, "width", "100%");
    			set_style(div0, "text-align", "center");
    			set_style(div0, "font-weight", "bold");
    			set_style(div0, "font-size", "200%");
    			add_location(div0, file$9, 119, 16, 4289);
    			if (!src_url_equal(img.src, img_src_value = "images/404.gif")) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", "");
    			attr_dev(img, "class", "notfound svelte-1x97rt7");
    			toggle_class(img, "nfmob", /*isScreenMobile*/ ctx[0]);
    			add_location(img, file$9, 120, 16, 4423);
    			attr_dev(div1, "class", "animalCardsContainer flex content svelte-1x97rt7");
    			add_location(div1, file$9, 118, 12, 4224);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			append_dev(div1, div0);
    			append_dev(div1, t1);
    			append_dev(div1, img);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*isScreenMobile*/ 1) {
    				toggle_class(img, "nfmob", /*isScreenMobile*/ ctx[0]);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$2.name,
    		type: "if",
    		source: "(118:8) {#if isResultsEmpty}",
    		ctx
    	});

    	return block;
    }

    // (126:20) {#each cardsDisplayed as info, index (index)}
    function create_each_block_2(key_1, ctx) {
    	let first;
    	let animalcard;
    	let current;

    	animalcard = new AnimalCard({
    			props: {
    				info: /*info*/ ctx[23],
    				fadeDelay: /*index*/ ctx[21] * 500
    			},
    			$$inline: true
    		});

    	const block = {
    		key: key_1,
    		first: null,
    		c: function create() {
    			first = empty();
    			create_component(animalcard.$$.fragment);
    			this.first = first;
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, first, anchor);
    			mount_component(animalcard, target, anchor);
    			current = true;
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			const animalcard_changes = {};
    			if (dirty & /*cardsDisplayed*/ 4) animalcard_changes.info = /*info*/ ctx[23];
    			if (dirty & /*cardsDisplayed*/ 4) animalcard_changes.fadeDelay = /*index*/ ctx[21] * 500;
    			animalcard.$set(animalcard_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(animalcard.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(animalcard.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(first);
    			destroy_component(animalcard, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_2.name,
    		type: "each",
    		source: "(126:20) {#each cardsDisplayed as info, index (index)}",
    		ctx
    	});

    	return block;
    }

    // (142:24) {:else}
    function create_else_block_1(ctx) {
    	let each_blocks = [];
    	let each_1_lookup = new Map();
    	let each_1_anchor;
    	let each_value_1 = Array(/*numberPages*/ ctx[3]);
    	validate_each_argument(each_value_1);
    	const get_key = ctx => /*index*/ ctx[21];
    	validate_each_keys(ctx, each_value_1, get_each_context_1, get_key);

    	for (let i = 0; i < each_value_1.length; i += 1) {
    		let child_ctx = get_each_context_1(ctx, each_value_1, i);
    		let key = get_key(child_ctx);
    		each_1_lookup.set(key, each_blocks[i] = create_each_block_1(key, child_ctx));
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
    			if (dirty & /*actualPage, Array, numberPages, changePage*/ 536) {
    				each_value_1 = Array(/*numberPages*/ ctx[3]);
    				validate_each_argument(each_value_1);
    				validate_each_keys(ctx, each_value_1, get_each_context_1, get_key);
    				each_blocks = update_keyed_each(each_blocks, dirty, get_key, 1, ctx, each_value_1, each_1_lookup, each_1_anchor.parentNode, destroy_block, create_each_block_1, each_1_anchor, get_each_context_1);
    			}
    		},
    		d: function destroy(detaching) {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].d(detaching);
    			}

    			if (detaching) detach_dev(each_1_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block_1.name,
    		type: "else",
    		source: "(142:24) {:else}",
    		ctx
    	});

    	return block;
    }

    // (134:24) {#if isScreenMobile}
    function create_if_block_2(ctx) {
    	let select;
    	let each_blocks = [];
    	let each_1_lookup = new Map();
    	let each_value = Array(/*numberPages*/ ctx[3]);
    	validate_each_argument(each_value);
    	const get_key = ctx => /*index*/ ctx[21];
    	validate_each_keys(ctx, each_value, get_each_context$4, get_key);

    	for (let i = 0; i < each_value.length; i += 1) {
    		let child_ctx = get_each_context$4(ctx, each_value, i);
    		let key = get_key(child_ctx);
    		each_1_lookup.set(key, each_blocks[i] = create_each_block$4(key, child_ctx));
    	}

    	const block = {
    		c: function create() {
    			select = element("select");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr_dev(select, "class", "form-select svelte-1x97rt7");
    			attr_dev(select, "aria-label", "Page number selection");
    			add_location(select, file$9, 134, 28, 5297);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, select, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(select, null);
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*Array, numberPages, actualPage, changePage*/ 536) {
    				each_value = Array(/*numberPages*/ ctx[3]);
    				validate_each_argument(each_value);
    				validate_each_keys(ctx, each_value, get_each_context$4, get_key);
    				each_blocks = update_keyed_each(each_blocks, dirty, get_key, 1, ctx, each_value, each_1_lookup, select, destroy_block, create_each_block$4, null, get_each_context$4);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(select);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].d();
    			}
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_2.name,
    		type: "if",
    		source: "(134:24) {#if isScreenMobile}",
    		ctx
    	});

    	return block;
    }

    // (143:28) {#each Array(numberPages) as _, index (index)}
    function create_each_block_1(key_1, ctx) {
    	let li;
    	let div;
    	let t0_value = /*index*/ ctx[21] + 1 + "";
    	let t0;
    	let t1;
    	let mounted;
    	let dispose;

    	function click_handler_3() {
    		return /*click_handler_3*/ ctx[15](/*index*/ ctx[21]);
    	}

    	const block = {
    		key: key_1,
    		first: null,
    		c: function create() {
    			li = element("li");
    			div = element("div");
    			t0 = text(t0_value);
    			t1 = space();
    			attr_dev(div, "class", "page-link svelte-1x97rt7");
    			add_location(div, file$9, 145, 36, 6132);
    			attr_dev(li, "class", "page-item svelte-1x97rt7");
    			toggle_class(li, "active", /*actualPage*/ ctx[4] == /*index*/ ctx[21] + 1);
    			add_location(li, file$9, 144, 32, 6002);
    			this.first = li;
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, li, anchor);
    			append_dev(li, div);
    			append_dev(div, t0);
    			append_dev(li, t1);

    			if (!mounted) {
    				dispose = listen_dev(li, "click", click_handler_3, false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			if (dirty & /*numberPages*/ 8 && t0_value !== (t0_value = /*index*/ ctx[21] + 1 + "")) set_data_dev(t0, t0_value);

    			if (dirty & /*actualPage, Array, numberPages*/ 24) {
    				toggle_class(li, "active", /*actualPage*/ ctx[4] == /*index*/ ctx[21] + 1);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(li);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_1.name,
    		type: "each",
    		source: "(143:28) {#each Array(numberPages) as _, index (index)}",
    		ctx
    	});

    	return block;
    }

    // (136:32) {#each  Array(numberPages) as _, index (index)}
    function create_each_block$4(key_1, ctx) {
    	let option;
    	let t0_value = /*index*/ ctx[21] + 1 + "";
    	let t0;
    	let t1;
    	let option_value_value;
    	let option_selected_value;
    	let mounted;
    	let dispose;

    	function click_handler_2() {
    		return /*click_handler_2*/ ctx[14](/*index*/ ctx[21]);
    	}

    	const block = {
    		key: key_1,
    		first: null,
    		c: function create() {
    			option = element("option");
    			t0 = text(t0_value);
    			t1 = space();
    			attr_dev(option, "class", "page-link svelte-1x97rt7");
    			option.__value = option_value_value = /*index*/ ctx[21] + 1;
    			option.value = option.__value;
    			option.selected = option_selected_value = /*actualPage*/ ctx[4] == /*index*/ ctx[21] + 1;
    			add_location(option, file$9, 136, 36, 5479);
    			this.first = option;
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, option, anchor);
    			append_dev(option, t0);
    			append_dev(option, t1);

    			if (!mounted) {
    				dispose = listen_dev(option, "click", click_handler_2, false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			if (dirty & /*numberPages*/ 8 && t0_value !== (t0_value = /*index*/ ctx[21] + 1 + "")) set_data_dev(t0, t0_value);

    			if (dirty & /*numberPages*/ 8 && option_value_value !== (option_value_value = /*index*/ ctx[21] + 1)) {
    				prop_dev(option, "__value", option_value_value);
    				option.value = option.__value;
    			}

    			if (dirty & /*actualPage, numberPages*/ 24 && option_selected_value !== (option_selected_value = /*actualPage*/ ctx[4] == /*index*/ ctx[21] + 1)) {
    				prop_dev(option, "selected", option_selected_value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(option);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$4.name,
    		type: "each",
    		source: "(136:32) {#each  Array(numberPages) as _, index (index)}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$9(ctx) {
    	let div1;
    	let div0;
    	let span0;
    	let t1;
    	let span1;
    	let t3;
    	let t4;
    	let div5;
    	let div4;
    	let div2;
    	let input;
    	let t5;
    	let button;
    	let i;
    	let t6;
    	let div3;
    	let t7;
    	let current;
    	let mounted;
    	let dispose;
    	let each_value_3 = /*storedPets*/ ctx[1];
    	validate_each_argument(each_value_3);
    	let each_blocks = [];

    	for (let i = 0; i < each_value_3.length; i += 1) {
    		each_blocks[i] = create_each_block_3(get_each_context_3(ctx, each_value_3, i));
    	}

    	let if_block = /*isSearchStarted*/ ctx[6] && create_if_block$3(ctx);

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			div0 = element("div");
    			span0 = element("span");
    			span0.textContent = "A";
    			t1 = text("NIMAL ");
    			span1 = element("span");
    			span1.textContent = "I";
    			t3 = text("NFO");
    			t4 = space();
    			div5 = element("div");
    			div4 = element("div");
    			div2 = element("div");
    			input = element("input");
    			t5 = space();
    			button = element("button");
    			i = element("i");
    			t6 = space();
    			div3 = element("div");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t7 = space();
    			if (if_block) if_block.c();
    			attr_dev(span0, "class", "capital");
    			add_location(span0, file$9, 102, 64, 3440);
    			attr_dev(span1, "class", "capital");
    			add_location(span1, file$9, 102, 100, 3476);
    			attr_dev(div0, "class", "titlepage");
    			toggle_class(div0, "titlepagemob", /*isScreenMobile*/ ctx[0]);
    			add_location(div0, file$9, 102, 4, 3380);
    			attr_dev(div1, "class", "container");
    			add_location(div1, file$9, 101, 0, 3351);
    			attr_dev(input, "type", "text");
    			attr_dev(input, "id", "animalInfoSearch");
    			input.value = "";
    			attr_dev(input, "placeholder", "Search for an Animal");
    			attr_dev(input, "class", "svelte-1x97rt7");
    			add_location(input, file$9, 107, 12, 3681);
    			attr_dev(i, "class", "bi-search");
    			add_location(i, file$9, 108, 78, 3883);
    			attr_dev(button, "id", "searchAnimalbtn");
    			attr_dev(button, "class", "svelte-1x97rt7");
    			add_location(button, file$9, 108, 12, 3817);
    			attr_dev(div2, "class", "flex");
    			set_style(div2, "justify-content", "center");
    			set_style(div2, "width", "100%");
    			add_location(div2, file$9, 106, 8, 3606);
    			attr_dev(div3, "class", "flex suggestions svelte-1x97rt7");
    			add_location(div3, file$9, 110, 8, 3943);
    			attr_dev(div4, "class", "flex searchContainer content svelte-1x97rt7");
    			add_location(div4, file$9, 105, 4, 3554);
    			attr_dev(div5, "class", "container");
    			add_location(div5, file$9, 104, 0, 3525);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			append_dev(div1, div0);
    			append_dev(div0, span0);
    			append_dev(div0, t1);
    			append_dev(div0, span1);
    			append_dev(div0, t3);
    			insert_dev(target, t4, anchor);
    			insert_dev(target, div5, anchor);
    			append_dev(div5, div4);
    			append_dev(div4, div2);
    			append_dev(div2, input);
    			append_dev(div2, t5);
    			append_dev(div2, button);
    			append_dev(button, i);
    			append_dev(div4, t6);
    			append_dev(div4, div3);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(div3, null);
    			}

    			append_dev(div5, t7);
    			if (if_block) if_block.m(div5, null);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(input, "keydown", /*searchAnimalsKeyPressed*/ ctx[8], false, false, false),
    					listen_dev(button, "click", /*click_handler*/ ctx[12], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (!current || dirty & /*isScreenMobile*/ 1) {
    				toggle_class(div0, "titlepagemob", /*isScreenMobile*/ ctx[0]);
    			}

    			if (dirty & /*searchAnimals, storedPets*/ 130) {
    				each_value_3 = /*storedPets*/ ctx[1];
    				validate_each_argument(each_value_3);
    				let i;

    				for (i = 0; i < each_value_3.length; i += 1) {
    					const child_ctx = get_each_context_3(ctx, each_value_3, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block_3(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(div3, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value_3.length;
    			}

    			if (/*isSearchStarted*/ ctx[6]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);

    					if (dirty & /*isSearchStarted*/ 64) {
    						transition_in(if_block, 1);
    					}
    				} else {
    					if_block = create_if_block$3(ctx);
    					if_block.c();
    					transition_in(if_block, 1);
    					if_block.m(div5, null);
    				}
    			} else if (if_block) {
    				group_outros();

    				transition_out(if_block, 1, 1, () => {
    					if_block = null;
    				});

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);
    			if (detaching) detach_dev(t4);
    			if (detaching) detach_dev(div5);
    			destroy_each(each_blocks, detaching);
    			if (if_block) if_block.d();
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$9.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$9($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('AnimalInfo', slots, []);
    	var isScreenMobile;
    	if (window.innerWidth < 500) isScreenMobile = true; else isScreenMobile = false;

    	window.addEventListener("resize", function (event) {
    		if (window.innerWidth < 500) $$invalidate(0, isScreenMobile = true); else $$invalidate(0, isScreenMobile = false);
    	});

    	var storedPets = JSON.parse(localStorage.getItem("mypets"));
    	var results = [];
    	var cardsDisplayed = [];
    	var numberPages = 0;
    	var actualPage;
    	var numberCardsPerPage = 3;
    	var isResultsEmpty = false;
    	var isSearchStarted = false;
    	let local = JSON.parse(localStorage.getItem("login"));

    	if (local.islogged) {
    		fetch('/db/element?id=' + local.id + '&collection=users', { method: 'GET' }).then(response => response.json()).then(data => {
    			$$invalidate(1, storedPets = data.result.pets);
    		});
    	}

    	const searchAnimals = animal => {
    		$$invalidate(6, isSearchStarted = false);
    		$$invalidate(5, isResultsEmpty = false);
    		results = [];
    		$$invalidate(2, cardsDisplayed = []);
    		var search;

    		setTimeout(
    			function () {
    				if (animal) search = animal; else search = document.getElementById("animalInfoSearch").value;

    				if (search && search.length >= 3) {
    					var xmlHttp = new XMLHttpRequest();

    					xmlHttp.onreadystatechange = function () {
    						if (xmlHttp.readyState == 4 && xmlHttp.status == 200) {
    							results = JSON.parse(xmlHttp.responseText);
    							$$invalidate(6, isSearchStarted = true);

    							if (results.length != 0) {
    								for (var i = 0; i < numberCardsPerPage && i < results.length; i++) {
    									$$invalidate(2, cardsDisplayed[i] = results[i], cardsDisplayed);
    								}

    								$$invalidate(3, numberPages = Math.trunc(results.length / numberCardsPerPage + 1));
    								$$invalidate(4, actualPage = 1);
    							} else {
    								$$invalidate(5, isResultsEmpty = true);
    							}
    						}
    					};

    					xmlHttp.open("GET", 'https://api.api-ninjas.com/v1/animals?name=' + search, true);
    					xmlHttp.setRequestHeader("X-Api-Key", "XeRLqZeWmuiW7/PMyztdHQ==HoJJOzopIX90X1xe");
    					xmlHttp.send(null);
    				}
    			},
    			500
    		);
    	};

    	const searchAnimalsKeyPressed = event => {
    		if (event.key == "Enter") {
    			searchAnimals();
    		}
    	};

    	const changePage = page => {
    		$$invalidate(4, actualPage = page);
    		$$invalidate(2, cardsDisplayed = []);

    		setTimeout(
    			function () {
    				for (var i = (actualPage - 1) * numberCardsPerPage; i < numberCardsPerPage * actualPage && i < results.length; i++) {
    					$$invalidate(2, cardsDisplayed = [...cardsDisplayed, results[i]]);
    				}

    				$$invalidate(2, cardsDisplayed);
    			},
    			500 * numberCardsPerPage + 200
    		);
    	};

    	const previousPage = () => {
    		if (actualPage != 1) {
    			changePage($$invalidate(4, --actualPage));
    		}
    	};

    	const nextPage = () => {
    		if (actualPage != numberPages) {
    			changePage($$invalidate(4, ++actualPage));
    		}
    	};

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<AnimalInfo> was created with unknown prop '${key}'`);
    	});

    	const click_handler = () => searchAnimals(null);
    	const click_handler_1 = pet => searchAnimals(pet.species);
    	const click_handler_2 = index => changePage(index + 1);
    	const click_handler_3 = index => changePage(index + 1);

    	$$self.$capture_state = () => ({
    		AnimalCard,
    		isScreenMobile,
    		storedPets,
    		results,
    		cardsDisplayed,
    		numberPages,
    		actualPage,
    		numberCardsPerPage,
    		isResultsEmpty,
    		isSearchStarted,
    		local,
    		searchAnimals,
    		searchAnimalsKeyPressed,
    		changePage,
    		previousPage,
    		nextPage
    	});

    	$$self.$inject_state = $$props => {
    		if ('isScreenMobile' in $$props) $$invalidate(0, isScreenMobile = $$props.isScreenMobile);
    		if ('storedPets' in $$props) $$invalidate(1, storedPets = $$props.storedPets);
    		if ('results' in $$props) results = $$props.results;
    		if ('cardsDisplayed' in $$props) $$invalidate(2, cardsDisplayed = $$props.cardsDisplayed);
    		if ('numberPages' in $$props) $$invalidate(3, numberPages = $$props.numberPages);
    		if ('actualPage' in $$props) $$invalidate(4, actualPage = $$props.actualPage);
    		if ('numberCardsPerPage' in $$props) numberCardsPerPage = $$props.numberCardsPerPage;
    		if ('isResultsEmpty' in $$props) $$invalidate(5, isResultsEmpty = $$props.isResultsEmpty);
    		if ('isSearchStarted' in $$props) $$invalidate(6, isSearchStarted = $$props.isSearchStarted);
    		if ('local' in $$props) local = $$props.local;
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		isScreenMobile,
    		storedPets,
    		cardsDisplayed,
    		numberPages,
    		actualPage,
    		isResultsEmpty,
    		isSearchStarted,
    		searchAnimals,
    		searchAnimalsKeyPressed,
    		changePage,
    		previousPage,
    		nextPage,
    		click_handler,
    		click_handler_1,
    		click_handler_2,
    		click_handler_3
    	];
    }

    class AnimalInfo extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$9, create_fragment$9, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "AnimalInfo",
    			options,
    			id: create_fragment$9.name
    		});
    	}
    }

    /* src\component\videos\MainVideo.svelte generated by Svelte v3.53.1 */

    const file$8 = "src\\component\\videos\\MainVideo.svelte";

    function create_fragment$8(ctx) {
    	let div2;
    	let iframe;
    	let iframe_src_value;
    	let iframe_title_value;
    	let t0;
    	let div1;
    	let div0;
    	let t1_value = /*currentVideo*/ ctx[0].snippet.channelTitle + "";
    	let t1;
    	let t2;
    	let p0;
    	let t3_value = /*currentVideo*/ ctx[0].snippet.title + "";
    	let t3;
    	let t4;
    	let p1;
    	let t5_value = /*currentVideo*/ ctx[0].snippet.description + "";
    	let t5;

    	const block = {
    		c: function create() {
    			div2 = element("div");
    			iframe = element("iframe");
    			t0 = space();
    			div1 = element("div");
    			div0 = element("div");
    			t1 = text(t1_value);
    			t2 = space();
    			p0 = element("p");
    			t3 = text(t3_value);
    			t4 = space();
    			p1 = element("p");
    			t5 = text(t5_value);
    			if (!src_url_equal(iframe.src, iframe_src_value = "https://www.youtube.com/embed/" + /*currentVideo*/ ctx[0].snippet.resourceId.videoId)) attr_dev(iframe, "src", iframe_src_value);
    			attr_dev(iframe, "title", iframe_title_value = /*currentVideo*/ ctx[0].snippet.title);
    			attr_dev(iframe, "class", "svelte-1exb6ot");
    			toggle_class(iframe, "mobvideo", /*screenWidth*/ ctx[1] < 500);
    			add_location(iframe, file$8, 11, 4, 279);
    			add_location(div0, file$8, 13, 8, 525);
    			set_style(p0, "font-weight", "800");
    			set_style(p0, "font-size", "130%");
    			add_location(p0, file$8, 14, 8, 581);
    			set_style(p1, "font-size", "80%");
    			add_location(p1, file$8, 15, 8, 666);
    			attr_dev(div1, "class", "container description svelte-1exb6ot");
    			toggle_class(div1, "mobdes", /*screenWidth*/ ctx[1] < 500);
    			add_location(div1, file$8, 12, 4, 449);
    			attr_dev(div2, "class", "flex container content svelte-1exb6ot");
    			toggle_class(div2, "mobile", /*screenWidth*/ ctx[1] < 500);
    			add_location(div2, file$8, 10, 0, 206);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div2, anchor);
    			append_dev(div2, iframe);
    			append_dev(div2, t0);
    			append_dev(div2, div1);
    			append_dev(div1, div0);
    			append_dev(div0, t1);
    			append_dev(div1, t2);
    			append_dev(div1, p0);
    			append_dev(p0, t3);
    			append_dev(div1, t4);
    			append_dev(div1, p1);
    			append_dev(p1, t5);
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*currentVideo*/ 1 && !src_url_equal(iframe.src, iframe_src_value = "https://www.youtube.com/embed/" + /*currentVideo*/ ctx[0].snippet.resourceId.videoId)) {
    				attr_dev(iframe, "src", iframe_src_value);
    			}

    			if (dirty & /*currentVideo*/ 1 && iframe_title_value !== (iframe_title_value = /*currentVideo*/ ctx[0].snippet.title)) {
    				attr_dev(iframe, "title", iframe_title_value);
    			}

    			if (dirty & /*screenWidth*/ 2) {
    				toggle_class(iframe, "mobvideo", /*screenWidth*/ ctx[1] < 500);
    			}

    			if (dirty & /*currentVideo*/ 1 && t1_value !== (t1_value = /*currentVideo*/ ctx[0].snippet.channelTitle + "")) set_data_dev(t1, t1_value);
    			if (dirty & /*currentVideo*/ 1 && t3_value !== (t3_value = /*currentVideo*/ ctx[0].snippet.title + "")) set_data_dev(t3, t3_value);
    			if (dirty & /*currentVideo*/ 1 && t5_value !== (t5_value = /*currentVideo*/ ctx[0].snippet.description + "")) set_data_dev(t5, t5_value);

    			if (dirty & /*screenWidth*/ 2) {
    				toggle_class(div1, "mobdes", /*screenWidth*/ ctx[1] < 500);
    			}

    			if (dirty & /*screenWidth*/ 2) {
    				toggle_class(div2, "mobile", /*screenWidth*/ ctx[1] < 500);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div2);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$8.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$8($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('MainVideo', slots, []);
    	let { currentVideo } = $$props;
    	var screenWidth = window.innerWidth;

    	window.addEventListener("resize", function (event) {
    		$$invalidate(1, screenWidth = window.innerWidth);
    	});

    	$$self.$$.on_mount.push(function () {
    		if (currentVideo === undefined && !('currentVideo' in $$props || $$self.$$.bound[$$self.$$.props['currentVideo']])) {
    			console.warn("<MainVideo> was created without expected prop 'currentVideo'");
    		}
    	});

    	const writable_props = ['currentVideo'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<MainVideo> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('currentVideo' in $$props) $$invalidate(0, currentVideo = $$props.currentVideo);
    	};

    	$$self.$capture_state = () => ({ currentVideo, screenWidth });

    	$$self.$inject_state = $$props => {
    		if ('currentVideo' in $$props) $$invalidate(0, currentVideo = $$props.currentVideo);
    		if ('screenWidth' in $$props) $$invalidate(1, screenWidth = $$props.screenWidth);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [currentVideo, screenWidth];
    }

    class MainVideo extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$8, create_fragment$8, safe_not_equal, { currentVideo: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "MainVideo",
    			options,
    			id: create_fragment$8.name
    		});
    	}

    	get currentVideo() {
    		throw new Error("<MainVideo>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set currentVideo(value) {
    		throw new Error("<MainVideo>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\component\videos\Playlist.svelte generated by Svelte v3.53.1 */
    const file$7 = "src\\component\\videos\\Playlist.svelte";

    function get_each_context$3(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[5] = list[i];
    	child_ctx[7] = i;
    	return child_ctx;
    }

    // (16:4) {#each playlist as video, index (index)}
    function create_each_block$3(key_1, ctx) {
    	let div1;
    	let img;
    	let img_src_value;
    	let t0;
    	let div0;
    	let t1_value = /*video*/ ctx[5].snippet.title + "";
    	let t1;
    	let t2;
    	let mounted;
    	let dispose;

    	function click_handler() {
    		return /*click_handler*/ ctx[4](/*index*/ ctx[7]);
    	}

    	const block = {
    		key: key_1,
    		first: null,
    		c: function create() {
    			div1 = element("div");
    			img = element("img");
    			t0 = space();
    			div0 = element("div");
    			t1 = text(t1_value);
    			t2 = space();
    			if (!src_url_equal(img.src, img_src_value = /*video*/ ctx[5].snippet.thumbnails.default.url)) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", "");
    			attr_dev(img, "class", "svelte-ixqqsz");
    			toggle_class(img, "mobile", /*screenWidth*/ ctx[2] < 500);
    			add_location(img, file$7, 18, 12, 570);
    			set_style(div0, "font-size", "80%");
    			set_style(div0, "font-weight", "bold");
    			set_style(div0, "margin-top", "5px");
    			add_location(div0, file$7, 19, 12, 670);
    			attr_dev(div1, "class", "flex video svelte-ixqqsz");
    			add_location(div1, file$7, 17, 8, 481);
    			this.first = div1;
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			append_dev(div1, img);
    			append_dev(div1, t0);
    			append_dev(div1, div0);
    			append_dev(div0, t1);
    			append_dev(div1, t2);

    			if (!mounted) {
    				dispose = listen_dev(div1, "click", click_handler, false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;

    			if (dirty & /*playlist*/ 1 && !src_url_equal(img.src, img_src_value = /*video*/ ctx[5].snippet.thumbnails.default.url)) {
    				attr_dev(img, "src", img_src_value);
    			}

    			if (dirty & /*screenWidth*/ 4) {
    				toggle_class(img, "mobile", /*screenWidth*/ ctx[2] < 500);
    			}

    			if (dirty & /*playlist*/ 1 && t1_value !== (t1_value = /*video*/ ctx[5].snippet.title + "")) set_data_dev(t1, t1_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$3.name,
    		type: "each",
    		source: "(16:4) {#each playlist as video, index (index)}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$7(ctx) {
    	let div;
    	let each_blocks = [];
    	let each_1_lookup = new Map();
    	let each_value = /*playlist*/ ctx[0];
    	validate_each_argument(each_value);
    	const get_key = ctx => /*index*/ ctx[7];
    	validate_each_keys(ctx, each_value, get_each_context$3, get_key);

    	for (let i = 0; i < each_value.length; i += 1) {
    		let child_ctx = get_each_context$3(ctx, each_value, i);
    		let key = get_key(child_ctx);
    		each_1_lookup.set(key, each_blocks[i] = create_each_block$3(key, child_ctx));
    	}

    	const block = {
    		c: function create() {
    			div = element("div");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr_dev(div, "class", "flex container content svelte-ixqqsz");
    			add_location(div, file$7, 14, 0, 323);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(div, null);
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*dispatch, playlist, pid, screenWidth*/ 15) {
    				each_value = /*playlist*/ ctx[0];
    				validate_each_argument(each_value);
    				validate_each_keys(ctx, each_value, get_each_context$3, get_key);
    				each_blocks = update_keyed_each(each_blocks, dirty, get_key, 1, ctx, each_value, each_1_lookup, div, destroy_block, create_each_block$3, null, get_each_context$3);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].d();
    			}
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
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Playlist', slots, []);
    	let { playlist } = $$props;
    	let { pid } = $$props;
    	var screenWidth = window.innerWidth;

    	window.addEventListener("resize", function (event) {
    		$$invalidate(2, screenWidth = window.innerWidth);
    	});

    	const dispatch = createEventDispatcher();

    	$$self.$$.on_mount.push(function () {
    		if (playlist === undefined && !('playlist' in $$props || $$self.$$.bound[$$self.$$.props['playlist']])) {
    			console.warn("<Playlist> was created without expected prop 'playlist'");
    		}

    		if (pid === undefined && !('pid' in $$props || $$self.$$.bound[$$self.$$.props['pid']])) {
    			console.warn("<Playlist> was created without expected prop 'pid'");
    		}
    	});

    	const writable_props = ['playlist', 'pid'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Playlist> was created with unknown prop '${key}'`);
    	});

    	const click_handler = index => dispatch("videoChosen", { index, pid });

    	$$self.$$set = $$props => {
    		if ('playlist' in $$props) $$invalidate(0, playlist = $$props.playlist);
    		if ('pid' in $$props) $$invalidate(1, pid = $$props.pid);
    	};

    	$$self.$capture_state = () => ({
    		createEventDispatcher,
    		playlist,
    		pid,
    		screenWidth,
    		dispatch
    	});

    	$$self.$inject_state = $$props => {
    		if ('playlist' in $$props) $$invalidate(0, playlist = $$props.playlist);
    		if ('pid' in $$props) $$invalidate(1, pid = $$props.pid);
    		if ('screenWidth' in $$props) $$invalidate(2, screenWidth = $$props.screenWidth);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [playlist, pid, screenWidth, dispatch, click_handler];
    }

    class Playlist extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$7, create_fragment$7, safe_not_equal, { playlist: 0, pid: 1 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Playlist",
    			options,
    			id: create_fragment$7.name
    		});
    	}

    	get playlist() {
    		throw new Error("<Playlist>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set playlist(value) {
    		throw new Error("<Playlist>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get pid() {
    		throw new Error("<Playlist>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set pid(value) {
    		throw new Error("<Playlist>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\component\videos\FunnyVideos.svelte generated by Svelte v3.53.1 */

    const { console: console_1$2 } = globals;
    const file$6 = "src\\component\\videos\\FunnyVideos.svelte";

    // (77:4) {#if mainReady}
    function create_if_block_1$1(ctx) {
    	let mainvideo;
    	let current;

    	mainvideo = new MainVideo({
    			props: { currentVideo: /*currentVideo*/ ctx[2] },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(mainvideo.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(mainvideo, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const mainvideo_changes = {};
    			if (dirty & /*currentVideo*/ 4) mainvideo_changes.currentVideo = /*currentVideo*/ ctx[2];
    			mainvideo.$set(mainvideo_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(mainvideo.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(mainvideo.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(mainvideo, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$1.name,
    		type: "if",
    		source: "(77:4) {#if mainReady}",
    		ctx
    	});

    	return block;
    }

    // (80:4) {#if playlistReady}
    function create_if_block$2(ctx) {
    	let div0;
    	let img0;
    	let img0_src_value;
    	let t0;
    	let playlist0;
    	let t1;
    	let div1;
    	let img1;
    	let img1_src_value;
    	let t2;
    	let playlist1;
    	let t3;
    	let div2;
    	let img2;
    	let img2_src_value;
    	let t4;
    	let playlist2;
    	let current;

    	playlist0 = new Playlist({
    			props: { playlist: /*playlist*/ ctx[1][0], pid: 0 },
    			$$inline: true
    		});

    	playlist0.$on("videoChosen", /*switchVideo*/ ctx[5]);

    	playlist1 = new Playlist({
    			props: { playlist: /*playlist*/ ctx[1][1], pid: 1 },
    			$$inline: true
    		});

    	playlist1.$on("videoChosen", /*switchVideo*/ ctx[5]);

    	playlist2 = new Playlist({
    			props: { playlist: /*playlist*/ ctx[1][2], pid: 2 },
    			$$inline: true
    		});

    	playlist2.$on("videoChosen", /*switchVideo*/ ctx[5]);

    	const block = {
    		c: function create() {
    			div0 = element("div");
    			img0 = element("img");
    			t0 = space();
    			create_component(playlist0.$$.fragment);
    			t1 = space();
    			div1 = element("div");
    			img1 = element("img");
    			t2 = space();
    			create_component(playlist1.$$.fragment);
    			t3 = space();
    			div2 = element("div");
    			img2 = element("img");
    			t4 = space();
    			create_component(playlist2.$$.fragment);
    			if (!src_url_equal(img0.src, img0_src_value = "images/otherfilter.png")) attr_dev(img0, "src", img0_src_value);
    			attr_dev(img0, "alt", "");
    			attr_dev(img0, "class", "svelte-1prxspj");
    			add_location(img0, file$6, 80, 28, 2831);
    			attr_dev(div0, "class", "filter svelte-1prxspj");
    			add_location(div0, file$6, 80, 8, 2811);
    			if (!src_url_equal(img1.src, img1_src_value = "images/catfilter.png")) attr_dev(img1, "src", img1_src_value);
    			attr_dev(img1, "alt", "");
    			attr_dev(img1, "class", "svelte-1prxspj");
    			add_location(img1, file$6, 82, 28, 2989);
    			attr_dev(div1, "class", "filter svelte-1prxspj");
    			add_location(div1, file$6, 82, 8, 2969);
    			if (!src_url_equal(img2.src, img2_src_value = "images/dogfilter.png")) attr_dev(img2, "src", img2_src_value);
    			attr_dev(img2, "alt", "");
    			attr_dev(img2, "class", "svelte-1prxspj");
    			add_location(img2, file$6, 84, 28, 3145);
    			attr_dev(div2, "class", "filter svelte-1prxspj");
    			add_location(div2, file$6, 84, 8, 3125);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div0, anchor);
    			append_dev(div0, img0);
    			insert_dev(target, t0, anchor);
    			mount_component(playlist0, target, anchor);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, div1, anchor);
    			append_dev(div1, img1);
    			insert_dev(target, t2, anchor);
    			mount_component(playlist1, target, anchor);
    			insert_dev(target, t3, anchor);
    			insert_dev(target, div2, anchor);
    			append_dev(div2, img2);
    			insert_dev(target, t4, anchor);
    			mount_component(playlist2, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const playlist0_changes = {};
    			if (dirty & /*playlist*/ 2) playlist0_changes.playlist = /*playlist*/ ctx[1][0];
    			playlist0.$set(playlist0_changes);
    			const playlist1_changes = {};
    			if (dirty & /*playlist*/ 2) playlist1_changes.playlist = /*playlist*/ ctx[1][1];
    			playlist1.$set(playlist1_changes);
    			const playlist2_changes = {};
    			if (dirty & /*playlist*/ 2) playlist2_changes.playlist = /*playlist*/ ctx[1][2];
    			playlist2.$set(playlist2_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(playlist0.$$.fragment, local);
    			transition_in(playlist1.$$.fragment, local);
    			transition_in(playlist2.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(playlist0.$$.fragment, local);
    			transition_out(playlist1.$$.fragment, local);
    			transition_out(playlist2.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div0);
    			if (detaching) detach_dev(t0);
    			destroy_component(playlist0, detaching);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(div1);
    			if (detaching) detach_dev(t2);
    			destroy_component(playlist1, detaching);
    			if (detaching) detach_dev(t3);
    			if (detaching) detach_dev(div2);
    			if (detaching) detach_dev(t4);
    			destroy_component(playlist2, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$2.name,
    		type: "if",
    		source: "(80:4) {#if playlistReady}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$6(ctx) {
    	let div1;
    	let div0;
    	let span0;
    	let t1;
    	let span1;
    	let t3;
    	let t4;
    	let div2;
    	let t5;
    	let current;
    	let if_block0 = /*mainReady*/ ctx[3] && create_if_block_1$1(ctx);
    	let if_block1 = /*playlistReady*/ ctx[4] && create_if_block$2(ctx);

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			div0 = element("div");
    			span0 = element("span");
    			span0.textContent = "F";
    			t1 = text("UNNY ");
    			span1 = element("span");
    			span1.textContent = "V";
    			t3 = text("IDEOS");
    			t4 = space();
    			div2 = element("div");
    			if (if_block0) if_block0.c();
    			t5 = space();
    			if (if_block1) if_block1.c();
    			attr_dev(span0, "class", "capital");
    			add_location(span0, file$6, 73, 65, 2597);
    			attr_dev(span1, "class", "capital");
    			add_location(span1, file$6, 73, 100, 2632);
    			attr_dev(div0, "class", "titlepage");
    			toggle_class(div0, "titlepagemob", /*screenWidth*/ ctx[0] < 500);
    			add_location(div0, file$6, 73, 4, 2536);
    			attr_dev(div1, "class", "container");
    			add_location(div1, file$6, 72, 0, 2507);
    			attr_dev(div2, "class", "container");
    			add_location(div2, file$6, 75, 0, 2683);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			append_dev(div1, div0);
    			append_dev(div0, span0);
    			append_dev(div0, t1);
    			append_dev(div0, span1);
    			append_dev(div0, t3);
    			insert_dev(target, t4, anchor);
    			insert_dev(target, div2, anchor);
    			if (if_block0) if_block0.m(div2, null);
    			append_dev(div2, t5);
    			if (if_block1) if_block1.m(div2, null);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (!current || dirty & /*screenWidth*/ 1) {
    				toggle_class(div0, "titlepagemob", /*screenWidth*/ ctx[0] < 500);
    			}

    			if (/*mainReady*/ ctx[3]) {
    				if (if_block0) {
    					if_block0.p(ctx, dirty);

    					if (dirty & /*mainReady*/ 8) {
    						transition_in(if_block0, 1);
    					}
    				} else {
    					if_block0 = create_if_block_1$1(ctx);
    					if_block0.c();
    					transition_in(if_block0, 1);
    					if_block0.m(div2, t5);
    				}
    			} else if (if_block0) {
    				group_outros();

    				transition_out(if_block0, 1, 1, () => {
    					if_block0 = null;
    				});

    				check_outros();
    			}

    			if (/*playlistReady*/ ctx[4]) {
    				if (if_block1) {
    					if_block1.p(ctx, dirty);

    					if (dirty & /*playlistReady*/ 16) {
    						transition_in(if_block1, 1);
    					}
    				} else {
    					if_block1 = create_if_block$2(ctx);
    					if_block1.c();
    					transition_in(if_block1, 1);
    					if_block1.m(div2, null);
    				}
    			} else if (if_block1) {
    				group_outros();

    				transition_out(if_block1, 1, 1, () => {
    					if_block1 = null;
    				});

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block0);
    			transition_in(if_block1);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block0);
    			transition_out(if_block1);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);
    			if (detaching) detach_dev(t4);
    			if (detaching) detach_dev(div2);
    			if (if_block0) if_block0.d();
    			if (if_block1) if_block1.d();
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
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('FunnyVideos', slots, []);
    	var screenWidth = window.innerWidth;

    	window.addEventListener("resize", function (event) {
    		$$invalidate(0, screenWidth = window.innerWidth);
    	});

    	var playlist = [[], [], []];
    	var currentVideo;

    	var playlistId = [
    		"PLtDp75hOzOlbD7m-Gb2t4dZqyYx7dq0iB",
    		"PLF7uln2NT38i-ZDHTwUf_2MnNp70BKD7s",
    		"PLf6Ove6NWsVcM75fCjLk3i-9IkpCmPyXw"
    	];

    	var mainReady = false;
    	var playlistReady = false;

    	for (let i = 0; i < playlistId.length; i++) {
    		let xmlHttp = new XMLHttpRequest();

    		xmlHttp.onreadystatechange = function () {
    			if (xmlHttp.readyState == 4 && xmlHttp.status == 200) {
    				let data = JSON.parse(xmlHttp.responseText);
    				let first = true;
    				var p = [];

    				for (let video of data.items) {
    					if (first && i == 0) {
    						first = false;
    						$$invalidate(2, currentVideo = video);
    					} else p = [...p, video];
    				}

    				$$invalidate(1, playlist[i] = p, playlist);

    				if (playlist[0].length > 0 && playlist[1].length > 0 && playlist[2].length > 0) {
    					$$invalidate(3, mainReady = true);
    					$$invalidate(4, playlistReady = true);
    				}
    			}
    		};

    		xmlHttp.open("GET", "https://youtube.googleapis.com/youtube/v3/playlistItems?part=snippet&playlistId=" + playlistId[i] + "&key=AIzaSyBwKTLoQHoNYRzU2f6laHTOrXILwMpbtnQ&maxResults=9", true);
    		xmlHttp.send(null);
    	}

    	const switchVideo = event => {
    		let pid;
    		console.log(currentVideo.snippet.channelTitle);

    		switch (currentVideo.snippet.channelTitle) {
    			case "Funny Pet Videos":
    				pid = 2;
    				break;
    			case "Funny Cats Life":
    				pid = 1;
    				break;
    			case "Tiger Productions":
    				pid = 0;
    				break;
    		}

    		console.log(pid);
    		$$invalidate(1, playlist[pid] = [...playlist[pid], currentVideo], playlist);
    		let temp = playlist[event.detail.pid];
    		let i = 0;
    		$$invalidate(1, playlist[event.detail.pid] = [], playlist);

    		for (let video of temp) {
    			if (i != event.detail.index) $$invalidate(1, playlist[event.detail.pid] = [...playlist[event.detail.pid], video], playlist);
    			i++;
    		}

    		$$invalidate(2, currentVideo = temp[event.detail.index]);
    	};

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1$2.warn(`<FunnyVideos> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		MainVideo,
    		Playlist,
    		screenWidth,
    		playlist,
    		currentVideo,
    		playlistId,
    		mainReady,
    		playlistReady,
    		switchVideo
    	});

    	$$self.$inject_state = $$props => {
    		if ('screenWidth' in $$props) $$invalidate(0, screenWidth = $$props.screenWidth);
    		if ('playlist' in $$props) $$invalidate(1, playlist = $$props.playlist);
    		if ('currentVideo' in $$props) $$invalidate(2, currentVideo = $$props.currentVideo);
    		if ('playlistId' in $$props) playlistId = $$props.playlistId;
    		if ('mainReady' in $$props) $$invalidate(3, mainReady = $$props.mainReady);
    		if ('playlistReady' in $$props) $$invalidate(4, playlistReady = $$props.playlistReady);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [screenWidth, playlist, currentVideo, mainReady, playlistReady, switchVideo];
    }

    class FunnyVideos extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$6, create_fragment$6, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "FunnyVideos",
    			options,
    			id: create_fragment$6.name
    		});
    	}
    }

    /* src\component\medinfo\ArticleModal.svelte generated by Svelte v3.53.1 */
    const file$5 = "src\\component\\medinfo\\ArticleModal.svelte";

    function get_each_context$2(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[4] = list[i];
    	child_ctx[6] = i;
    	return child_ctx;
    }

    // (14:0) {#if isModalOpen}
    function create_if_block$1(ctx) {
    	let div2;
    	let div1;
    	let button;
    	let t1;
    	let img;
    	let img_src_value;
    	let t2;
    	let div0;
    	let h1;
    	let t3_value = /*info*/ ctx[1].title + "";
    	let t3;
    	let t4;
    	let each_blocks = [];
    	let each_1_lookup = new Map();
    	let div2_transition;
    	let current;
    	let mounted;
    	let dispose;
    	let each_value = /*info*/ ctx[1].paragraph;
    	validate_each_argument(each_value);
    	const get_key = ctx => /*index*/ ctx[6];
    	validate_each_keys(ctx, each_value, get_each_context$2, get_key);

    	for (let i = 0; i < each_value.length; i += 1) {
    		let child_ctx = get_each_context$2(ctx, each_value, i);
    		let key = get_key(child_ctx);
    		each_1_lookup.set(key, each_blocks[i] = create_each_block$2(key, child_ctx));
    	}

    	const block = {
    		c: function create() {
    			div2 = element("div");
    			div1 = element("div");
    			button = element("button");
    			button.textContent = "CLOSE";
    			t1 = space();
    			img = element("img");
    			t2 = space();
    			div0 = element("div");
    			h1 = element("h1");
    			t3 = text(t3_value);
    			t4 = space();

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr_dev(button, "class", "svelte-ro05yt");
    			add_location(button, file$5, 16, 12, 430);
    			if (!src_url_equal(img.src, img_src_value = /*info*/ ctx[1].img)) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", "article img");
    			attr_dev(img, "align", "right");
    			attr_dev(img, "class", "svelte-ro05yt");
    			toggle_class(img, "mobileimg", /*screenWidth*/ ctx[2] < 500);
    			add_location(img, file$5, 17, 12, 499);
    			attr_dev(h1, "class", "svelte-ro05yt");
    			add_location(h1, file$5, 19, 16, 637);
    			attr_dev(div0, "class", "info");
    			add_location(div0, file$5, 18, 12, 601);
    			attr_dev(div1, "class", "content container svelte-ro05yt");
    			toggle_class(div1, "mobile", /*screenWidth*/ ctx[2] < 500);
    			add_location(div1, file$5, 15, 8, 352);
    			attr_dev(div2, "class", "backdrop flex svelte-ro05yt");
    			add_location(div2, file$5, 14, 4, 299);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div2, anchor);
    			append_dev(div2, div1);
    			append_dev(div1, button);
    			append_dev(div1, t1);
    			append_dev(div1, img);
    			append_dev(div1, t2);
    			append_dev(div1, div0);
    			append_dev(div0, h1);
    			append_dev(h1, t3);
    			append_dev(div0, t4);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(div0, null);
    			}

    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(button, "click", /*click_handler*/ ctx[3], false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (!current || dirty & /*info*/ 2 && !src_url_equal(img.src, img_src_value = /*info*/ ctx[1].img)) {
    				attr_dev(img, "src", img_src_value);
    			}

    			if (!current || dirty & /*screenWidth*/ 4) {
    				toggle_class(img, "mobileimg", /*screenWidth*/ ctx[2] < 500);
    			}

    			if ((!current || dirty & /*info*/ 2) && t3_value !== (t3_value = /*info*/ ctx[1].title + "")) set_data_dev(t3, t3_value);

    			if (dirty & /*info*/ 2) {
    				each_value = /*info*/ ctx[1].paragraph;
    				validate_each_argument(each_value);
    				validate_each_keys(ctx, each_value, get_each_context$2, get_key);
    				each_blocks = update_keyed_each(each_blocks, dirty, get_key, 1, ctx, each_value, each_1_lookup, div0, destroy_block, create_each_block$2, null, get_each_context$2);
    			}

    			if (!current || dirty & /*screenWidth*/ 4) {
    				toggle_class(div1, "mobile", /*screenWidth*/ ctx[2] < 500);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;

    			add_render_callback(() => {
    				if (!div2_transition) div2_transition = create_bidirectional_transition(div2, fade, {}, true);
    				div2_transition.run(1);
    			});

    			current = true;
    		},
    		o: function outro(local) {
    			if (!div2_transition) div2_transition = create_bidirectional_transition(div2, fade, {}, false);
    			div2_transition.run(0);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div2);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].d();
    			}

    			if (detaching && div2_transition) div2_transition.end();
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$1.name,
    		type: "if",
    		source: "(14:0) {#if isModalOpen}",
    		ctx
    	});

    	return block;
    }

    // (22:20) {#if index!=0}
    function create_if_block_1(ctx) {
    	let h2;
    	let t_value = /*info*/ ctx[1].ptitle[/*index*/ ctx[6] - 1] + "";
    	let t;

    	const block = {
    		c: function create() {
    			h2 = element("h2");
    			t = text(t_value);
    			add_location(h2, file$5, 22, 24, 788);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, h2, anchor);
    			append_dev(h2, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*info*/ 2 && t_value !== (t_value = /*info*/ ctx[1].ptitle[/*index*/ ctx[6] - 1] + "")) set_data_dev(t, t_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(h2);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1.name,
    		type: "if",
    		source: "(22:20) {#if index!=0}",
    		ctx
    	});

    	return block;
    }

    // (21:16) {#each info.paragraph as paragraph, index (index)}
    function create_each_block$2(key_1, ctx) {
    	let first;
    	let t0;
    	let p;
    	let t1_value = /*paragraph*/ ctx[4] + "";
    	let t1;
    	let if_block = /*index*/ ctx[6] != 0 && create_if_block_1(ctx);

    	const block = {
    		key: key_1,
    		first: null,
    		c: function create() {
    			first = empty();
    			if (if_block) if_block.c();
    			t0 = space();
    			p = element("p");
    			t1 = text(t1_value);
    			add_location(p, file$5, 24, 20, 868);
    			this.first = first;
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, first, anchor);
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, t0, anchor);
    			insert_dev(target, p, anchor);
    			append_dev(p, t1);
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;

    			if (/*index*/ ctx[6] != 0) {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block_1(ctx);
    					if_block.c();
    					if_block.m(t0.parentNode, t0);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}

    			if (dirty & /*info*/ 2 && t1_value !== (t1_value = /*paragraph*/ ctx[4] + "")) set_data_dev(t1, t1_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(first);
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(p);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$2.name,
    		type: "each",
    		source: "(21:16) {#each info.paragraph as paragraph, index (index)}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$5(ctx) {
    	let if_block_anchor;
    	let current;
    	let if_block = /*isModalOpen*/ ctx[0] && create_if_block$1(ctx);

    	const block = {
    		c: function create() {
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (/*isModalOpen*/ ctx[0]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);

    					if (dirty & /*isModalOpen*/ 1) {
    						transition_in(if_block, 1);
    					}
    				} else {
    					if_block = create_if_block$1(ctx);
    					if_block.c();
    					transition_in(if_block, 1);
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			} else if (if_block) {
    				group_outros();

    				transition_out(if_block, 1, 1, () => {
    					if_block = null;
    				});

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
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
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('ArticleModal', slots, []);
    	let { info } = $$props;
    	let { isModalOpen } = $$props;
    	var screenWidth = window.innerWidth;

    	window.addEventListener("resize", function (event) {
    		$$invalidate(2, screenWidth = window.innerWidth);
    	});

    	$$self.$$.on_mount.push(function () {
    		if (info === undefined && !('info' in $$props || $$self.$$.bound[$$self.$$.props['info']])) {
    			console.warn("<ArticleModal> was created without expected prop 'info'");
    		}

    		if (isModalOpen === undefined && !('isModalOpen' in $$props || $$self.$$.bound[$$self.$$.props['isModalOpen']])) {
    			console.warn("<ArticleModal> was created without expected prop 'isModalOpen'");
    		}
    	});

    	const writable_props = ['info', 'isModalOpen'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<ArticleModal> was created with unknown prop '${key}'`);
    	});

    	const click_handler = () => $$invalidate(0, isModalOpen = false);

    	$$self.$$set = $$props => {
    		if ('info' in $$props) $$invalidate(1, info = $$props.info);
    		if ('isModalOpen' in $$props) $$invalidate(0, isModalOpen = $$props.isModalOpen);
    	};

    	$$self.$capture_state = () => ({ fade, info, isModalOpen, screenWidth });

    	$$self.$inject_state = $$props => {
    		if ('info' in $$props) $$invalidate(1, info = $$props.info);
    		if ('isModalOpen' in $$props) $$invalidate(0, isModalOpen = $$props.isModalOpen);
    		if ('screenWidth' in $$props) $$invalidate(2, screenWidth = $$props.screenWidth);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [isModalOpen, info, screenWidth, click_handler];
    }

    class ArticleModal extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$5, create_fragment$5, safe_not_equal, { info: 1, isModalOpen: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "ArticleModal",
    			options,
    			id: create_fragment$5.name
    		});
    	}

    	get info() {
    		throw new Error("<ArticleModal>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set info(value) {
    		throw new Error("<ArticleModal>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get isModalOpen() {
    		throw new Error("<ArticleModal>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set isModalOpen(value) {
    		throw new Error("<ArticleModal>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\component\medinfo\Article.svelte generated by Svelte v3.53.1 */
    const file$4 = "src\\component\\medinfo\\Article.svelte";

    function create_fragment$4(ctx) {
    	let articlemodal;
    	let updating_isModalOpen;
    	let t0;
    	let div1;
    	let img0;
    	let img0_src_value;
    	let t1;
    	let img1;
    	let img1_src_value;
    	let img1_alt_value;
    	let t2;
    	let div0;
    	let t3_value = /*info*/ ctx[0].title + "";
    	let t3;
    	let current;
    	let mounted;
    	let dispose;

    	function articlemodal_isModalOpen_binding(value) {
    		/*articlemodal_isModalOpen_binding*/ ctx[3](value);
    	}

    	let articlemodal_props = { info: /*info*/ ctx[0] };

    	if (/*isModalOpen*/ ctx[2] !== void 0) {
    		articlemodal_props.isModalOpen = /*isModalOpen*/ ctx[2];
    	}

    	articlemodal = new ArticleModal({
    			props: articlemodal_props,
    			$$inline: true
    		});

    	binding_callbacks.push(() => bind(articlemodal, 'isModalOpen', articlemodal_isModalOpen_binding));

    	const block = {
    		c: function create() {
    			create_component(articlemodal.$$.fragment);
    			t0 = space();
    			div1 = element("div");
    			img0 = element("img");
    			t1 = space();
    			img1 = element("img");
    			t2 = space();
    			div0 = element("div");
    			t3 = text(t3_value);
    			if (!src_url_equal(img0.src, img0_src_value = /*info*/ ctx[0].img)) attr_dev(img0, "src", img0_src_value);
    			attr_dev(img0, "class", "img svelte-17frnxw");
    			attr_dev(img0, "alt", "article");
    			add_location(img0, file$4, 17, 4, 495);
    			attr_dev(img1, "class", "filter svelte-17frnxw");
    			if (!src_url_equal(img1.src, img1_src_value = "images/" + /*info*/ ctx[0].category + "filter.png")) attr_dev(img1, "src", img1_src_value);
    			attr_dev(img1, "alt", img1_alt_value = /*info*/ ctx[0].category + " category");
    			add_location(img1, file$4, 18, 4, 547);
    			add_location(div0, file$4, 19, 4, 650);
    			attr_dev(div1, "class", "articlecard  svelte-17frnxw");
    			toggle_class(div1, "mobile", /*screenWidth*/ ctx[1] < 500);
    			add_location(div1, file$4, 16, 0, 400);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			mount_component(articlemodal, target, anchor);
    			insert_dev(target, t0, anchor);
    			insert_dev(target, div1, anchor);
    			append_dev(div1, img0);
    			append_dev(div1, t1);
    			append_dev(div1, img1);
    			append_dev(div1, t2);
    			append_dev(div1, div0);
    			append_dev(div0, t3);
    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(div1, "click", /*click_handler*/ ctx[4], false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			const articlemodal_changes = {};
    			if (dirty & /*info*/ 1) articlemodal_changes.info = /*info*/ ctx[0];

    			if (!updating_isModalOpen && dirty & /*isModalOpen*/ 4) {
    				updating_isModalOpen = true;
    				articlemodal_changes.isModalOpen = /*isModalOpen*/ ctx[2];
    				add_flush_callback(() => updating_isModalOpen = false);
    			}

    			articlemodal.$set(articlemodal_changes);

    			if (!current || dirty & /*info*/ 1 && !src_url_equal(img0.src, img0_src_value = /*info*/ ctx[0].img)) {
    				attr_dev(img0, "src", img0_src_value);
    			}

    			if (!current || dirty & /*info*/ 1 && !src_url_equal(img1.src, img1_src_value = "images/" + /*info*/ ctx[0].category + "filter.png")) {
    				attr_dev(img1, "src", img1_src_value);
    			}

    			if (!current || dirty & /*info*/ 1 && img1_alt_value !== (img1_alt_value = /*info*/ ctx[0].category + " category")) {
    				attr_dev(img1, "alt", img1_alt_value);
    			}

    			if ((!current || dirty & /*info*/ 1) && t3_value !== (t3_value = /*info*/ ctx[0].title + "")) set_data_dev(t3, t3_value);

    			if (!current || dirty & /*screenWidth*/ 2) {
    				toggle_class(div1, "mobile", /*screenWidth*/ ctx[1] < 500);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(articlemodal.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(articlemodal.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(articlemodal, detaching);
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(div1);
    			mounted = false;
    			dispose();
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

    function instance$4($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Article', slots, []);
    	let { info } = $$props;
    	var screenWidth = window.innerWidth;

    	window.addEventListener("resize", function (event) {
    		$$invalidate(1, screenWidth = window.innerWidth);
    	});

    	var isModalOpen = false;

    	$$self.$$.on_mount.push(function () {
    		if (info === undefined && !('info' in $$props || $$self.$$.bound[$$self.$$.props['info']])) {
    			console.warn("<Article> was created without expected prop 'info'");
    		}
    	});

    	const writable_props = ['info'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Article> was created with unknown prop '${key}'`);
    	});

    	function articlemodal_isModalOpen_binding(value) {
    		isModalOpen = value;
    		$$invalidate(2, isModalOpen);
    	}

    	const click_handler = () => $$invalidate(2, isModalOpen = true);

    	$$self.$$set = $$props => {
    		if ('info' in $$props) $$invalidate(0, info = $$props.info);
    	};

    	$$self.$capture_state = () => ({
    		ArticleModal,
    		info,
    		screenWidth,
    		isModalOpen
    	});

    	$$self.$inject_state = $$props => {
    		if ('info' in $$props) $$invalidate(0, info = $$props.info);
    		if ('screenWidth' in $$props) $$invalidate(1, screenWidth = $$props.screenWidth);
    		if ('isModalOpen' in $$props) $$invalidate(2, isModalOpen = $$props.isModalOpen);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		info,
    		screenWidth,
    		isModalOpen,
    		articlemodal_isModalOpen_binding,
    		click_handler
    	];
    }

    class Article extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$4, create_fragment$4, safe_not_equal, { info: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Article",
    			options,
    			id: create_fragment$4.name
    		});
    	}

    	get info() {
    		throw new Error("<Article>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set info(value) {
    		throw new Error("<Article>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    var articles = [
    	{
    		title: "Controlling Cat Litter Box Odor",
    		category: "cat",
    		img: "https://img.webmd.com/vim/live/webmd/consumer_assets/site_images/article_thumbnails/other/cat_sleeping_on_sofa_other/1800x1200_cat_sleeping_on_sofa_other.jpg?resize=550px:*&output-quality=50",
    		ptitle: [
    			"Keep It Clean",
    			"Does the Type of Litter Matter?",
    			"Does the Type of Box Matter?",
    			"Location, Location, Location, and Numbers"
    		],
    		paragraph: [
    			"No one likes the smell of a dirty litter box. But can you imagine if you were the one that had to use that box? No wonder studies have found that at least 10% of cats stop using their litter boxes reliably at some point. Of course there can be medical or behavioral reasons for the problems. But not using the litter box often is traced to nothing more than a dirty litter box. Here’s how to avoid litter box odor and keep your house smelling fresh, which should make you and kitty happier.",
    			"The No. 1 rule, and the only thing that will keep litter box odor at bay, is constant cleaning. That means scooping the box out at least twice a day, removing the solids and liquid clumps if you use clumping litter. For those who don’t use clumping litter, use a large, solid metal spoon (such as a large kitchen spoon) to lift out the most urine-soaked areas each time you clean. Add litter as needed to replace what is removed. Also wash the box weekly, or every other week if you are using clumping litter. Use a mild, unscented dish detergent or a mild bleach spray (20 parts water to one part bleach) and rinse well. Clean your scooper also. When dry, add 2 to 3 inches of litter. Cats don’t like a deep tray of litter and this allows you to add litter as you scoop.",
    			"Some litters have perfumes or other additives that claim to help cover litter smell. But to a cat these can smell overwhelming and make the box unwelcoming. Most veterinarians advise against using these products. Many believe that clumping litters, which allow for the easy removal of solids and liquids, keep boxes smelling fresher. But cats can be very particular about which litters they will use. So experiment to find the litter your cat likes best, then stick with it.",
    			"Almost any easily cleaned plastic container can be used as a litter box, but buy the largest box your home can accommodate. A rule of thumb is to get a box that is at least twice as long as your adult cat and as wide as the cat is long. Cats are fastidious, and don’t want to step or dig in already soiled areas. Many people cut down one side of a large, plastic storage tub to get a larger box. And avoid covered boxes. Most cats don’t like them, and they can trap odors inside, making it unpleasant for your pet to enter. Many cats also don’t like plastic liners, which can snare cat’s claws when they dig. This also allows urine to seep under the liner, where it won’t be absorbed by the litter and can cause odors. As for self-cleaning litter boxes, it depends. Some cats, especially skittish and large cats, may dislike them. But if your cat doesn’t mind, it’s an option for people who are gone for long periods.",
    			"The rule is one litter box per cat, plus one. So if you have one cat, you need two boxes. If you have four cats, you need five boxes. Keep the boxes in different locations in your home. If a cat is on the third floor, and the box is in the basement, they may decide not to make the long trek. Also, choose the right spots for your litter boxes. Don’t put a box in a small, enclosed area, like a tiny bathroom or closet, which will concentrate litter box odors. A larger, well-ventilated area is best. But it needs to be in a quiet, low-traffic area, away from your cat’s food, other pets, and anything that can startle or scare your cat while they are using the box. Yes, it takes a daily effort on your part to keep litter box odors at bay. But the result will be a happier cat and a better-smelling home."
    		]
    	},
    	{
    		title: "Cats and Moving to a New Home: Making the Transition",
    		category: "cat",
    		img: "https://img.webmd.com/vim/live/consumer_assets/site_images/article_thumbnails/slideshows/pet_ownership_health_benefits_for_psoriasis_slideshow/1800x1200_getty_rf_pet_ownership_health_benefits_for_psoriasis_slideshow.jpg?resize=600px:*&output-quality=75",
    		ptitle: [
    			"Preparing Your Cat to Move",
    			"Moving Your Cat",
    			"Settling Your Cat Into the New Home",
    			"Things to Look Out For"
    		],
    		paragraph: [
    			"Moving may be one of the most disruptive life changes—for both humans and pets. Cats are averse to change, which can make moving day extra stressful for all. When it’s time to pack up the house and make your migration, you can take steps to make the transition easier for your kitty. The goal is to keep them calm and comfortable. This will help you avoid messes, meowing, aggression, and attempted escapes.",
    			"Update information. Make sure your cat’s ID collar is secure and up-to-date. It’s best to microchip your cat before the move, in case they get scared in the new space and run off. Reunions are much more likely when microchip info is kept current. Make a “new normal.” Leading up to the move, keep your cat’s routine as normal as possible. The sudden appearance of new people and moving materials, along with the disappearance of favorite furniture or objects, can cause stress for cats. To reduce this stress, introduce boxes to the home before you start packing. This helps create a new normal landscape for your cat. It also reduces the number of new stressors on moving day. Introduce the cat carrier. Introducing your cat to a good pet carrier a few weeks before the move can make it easier. Choose a carrier that is well-secured, designed for travel, and cozy. Set the carrier in a safe, quiet corner of your current home before you start packing. Place treats, a favorite blanket, and familiar toys in the carrier to build positive associations with the carrier. Allow your cat to freely enter and leave the carrier whenever they would like in the days and weeks leading up to the move. Placing the carrier in a quiet place will encourage the cat to seek refuge there as packing and moving activities become more hectic. ",
    			"On the big day, keep your cat in the carrier while people are moving in and out of your current home. If your move includes a major road trip, make sure your cat is used to car rides in the carrier. It might be tempting, but don’t open your carrier mid-travel to soothe your kitty. This increases the risk of your cat making a dash in unfamiliar territory. ",
    			"Once you’ve arrived, keep your kitty in their safe carrier as you cat-proof the new home. Close all windows and doors, and tuck away any electrical cords or plugs where your cat might get stuck. Introduce one room first. Choose one room with familiar objects and furniture. When the room is secure, let your cat out of the carrier to explore. It’s safest to keep your kitty in one designated room while there's a lot of activity in the new home. Make sure there’s a litter box, food, and water in this designated room. Set aside time to quietly spend time with your cat in their temporary room to help them feel comfortable in the new house. If your cat seems nervous, you may choose to keep your cat in one room for a few days to give them ample time to acclimate to the new space.",
    			"Runaway cats. When moving to a new area, it is common for cats to attempt to return to their old stomping grounds. It’s safest to keep your cat indoors all the time. Even if you plan to let the cat go outside eventually, keep them indoors until you are sure they have bonded with the new space. It is best to keep your cat indoors for a minimum of two weeks. You can encourage positive associations with your new home by feeding your cat more often with small meals and incorporating more treats and play into your cat’s day. When you do let your cat outside, make it short at first, and keep an eye on them. Call the cat in after 10 minutes to start, and work your way up to longer times outside. Neighborhood cats. If you do start letting your cat wander the neighborhood, stay vigilant and listen for the sounds of a catfight. Keep a close eye on your cat until both of you are familiar with any other cats in the area. Stressful events. Even after you and your cat have settled, stressors like thunderstorms or fireworks can unsettle your cat during the early days in your new home. Take extra precautions to keep your cat indoors, safe, and secure in their new home."
    		]
    	},
    	{
    		title: "Feeding Your Cat: Common Mistakes to Avoid",
    		category: "cat",
    		img: "https://img.webmd.com/vim/live/webmd/consumer_assets/site_images/article_thumbnails/other/generic_cat_other/1800x1200_generic_cat_other.jpg?resize=550px:*&output-quality=50",
    		ptitle: [
    			"Close the Kitty Buffet",
    			"Scraps Are Off the Table",
    			"Feeding a Fat Cat",
    			"Can a Cat Go Vegetarian?"
    		],
    		paragraph: [
    			"Whether your cat is a picky eater or gobbles up everything in sight, it helps to set a few basic rules when it comes to their food.  That can help you avoid some common cat food mistakes. ",
    			"Many cat owners make a point to leave a full food bowl out all day, especially if their cat is a picky eater. But it’s better to stop them from grazing. If food is only out at certain times, even the choosiest of cats should eventually eat.  Also, you may want to talk to your veterinarian about the best feeding schedule for your pet’s age -- kitten, adult, and senior. The healthiest way to feed a feline is to start with a little less than the daily amount suggested on the bag or can. Use the directions as a guideline.  Also, feeding your cat multiple meals (two or three) every day will help set a schedule and give you an idea how much or how little they are eating. You may want to consider using automatic and puzzle feeders to promote hunting instincts",
    			"Some of the foods on your plate aren’t healthy for your kitty. Even if they beg, don’t be tempted to feed them grapes, raisins, onions, nuts, chocolate, garlic, and uncooked bread dough. Raw meat or eggs and bones are also dangerous. Why? Sudden changes in your cat’s diet can lead to vomiting and diarrhea.  In some cases, those with sensitive digestive systems can get pancreatitis from eating table scraps, which can be fatal. Raw meat and eggs can have harmful bacteria, and your kitty could choke on bones or risk getting a piece of one stuck in their digestive tract. Other foods such as those listed above are considered toxic. And it’s best to skip the saucer of milk. If your cat’s body doesn’t have the right enzymes (which most cats' bodies don't) to break down lactose (the sugar in milk), they could get very sick.",
    			"A portly pussycat may look extra cuddly, but it’s unhealthy for cats to carry around too much weight. It makes them more likely to get all kinds of illnesses, including liver problems, joint pain, and diabetes. But how should you feed a cat who needs to slim down? Talk to your vet. They can help you figure out the best amount and schedule. If your cat bothers you for food between meals, pet or play with them instead. Cut down on their snacks and treats, and try giving them several small meals throughout the day. (Always feed them in their bowl, not anywhere else.) And make sure they have enough fresh water.",
    			"If you’re a vegetarian, you might think your cat should be one, too. Think again. Cats are natural carnivores and their tummies are designed to digest meat.  A vegetarian diet won’t give your kitty the nutrients they need. For example, if cats do not eat enough of the amino acid taurine, which only comes in meat, they can get heart failure. What about raw diets?  The jury is still out. No studies have shown that raw animal products are better than any other types of cat food (canned, dry, or home cooked) with one exception: Usually raw meats are slightly easier for them to digest than cooked meats. There are plenty of risks to raw diets, too. So before you start it for your cat, talk to your veterinarian to make sure your pet can handle it."
    		]
    	},
    	{
    		title: "Water and Your Dog's Health",
    		category: "dog",
    		img: "https://img.webmd.com/vim/live/webmd/consumer_assets/site_images/article_thumbnails/other/dog_drinking_water/1800x1200_dog_drinking_water.jpg?resize=550px:*&output-quality=50",
    		ptitle: [
    			"How Much Water Is Enough?",
    			"Keep Plenty of Water Available",
    			"Signs of Dehydration",
    			"Prevent Diarrhea in Your Dog"
    		],
    		paragraph: [
    			"When it comes to your dog's nutrition, water is even more important than protein, fat, carbohydrates, vitamins, and minerals. Your dog's body will naturally lose water all day. They lose water as they sweat through their paws and when they pant. And they lose water when they pee and poop. A dog that loses too much water -- just 10% to 15% of the water in their body -- can get very sick and even die. So that water they are losing need to be replaced.",
    			"A good rule of thumb: Make sure your dog gets at least 1 ounce of water daily for each pound they weigh. That means a 20-pound dog needs at least 20 ounces of water every day. That's more than 2 cups, or as much as in some bottles of water or soda. To help you keep track of how much water your dog drinks, make a note of how high you fill their water bowl and how far the level has dropped the next day.",
    			"Leave the water bowl where your dog can get to it easily. Since dogs can knock over the bowl while they're drinking, use one that's made to not tip and spill. Clean the bowl daily. Refill often so the water supply stays fresh. Whenever you and your dog are playing outdoors -- especially when it's hot -- bring cool water with you for them to drink. If your dog stays outside on hot days, add ice to the water bowl. Some dogs are happy to drink from the toilet. But that isn't a clean source of water! Keep the toilet lid closed so your dog stays out.",
    			"When dogs don't drink enough water or if they lose too much water, they become dehydrated. Older dogs and dogs that are sick, pregnant, or nursing can get dehydrated easily. Symptoms of dehydration include: Little energy, No interest in eating, Sunken eyes, Dry mouth. You can use these two ways to quickly check your dog for dehydration, too. If the response isn't normal, it's a sign of possible dehydration: Lift the skin on the back between your dog's shoulders. It should sink back to its normal place right away. Gently press on your dog's gums until the pressure creates a light spot. The normal color should come back right away when you remove your finger. Also the gums should feel slick and moist. If you think your dog might be dehydrated, take them to the vet right away.",
    			"Many health problems can cause diarrhea, including infections from bacteria, viruses, and worms. A disease called parvovirus triggers severe vomiting and diarrhea. And because your dog will lose more water with diarrhea, diarrhea can lead to dehydration. Keep your dog healthy. To help prevent these illnesses: Have your dog vaccinated regularly. Keep them away from old food and garbage. Talk to your vet about treatments to ward off parasite infections."
    		]
    	},
    	{
    		title: "Gear Ideas for Gung-Ho Dogs",
    		category: "dog",
    		img: "https://img.webmd.com/vim/live/webmd/consumer_assets/site_images/article_thumbnails/other/dog_gear_other/1800x1200_dog_gear_other.jpg?resize=550px:*&output-quality=50",
    		ptitle: [
    			"1. A harness.",
    			"2. Foldable water bowls and water.",
    			"3. Insect repellent.",
    			"4. A first-aid kit.",
    			"5. A snack pack.",
    			"6. A frozen bandana or cooling vest.",
    			"7. Paw protection.",
    			"8. Sunscreen.",
    			"9. Saddlebags or doggie “backpacks.”"
    		],
    		paragraph: [
    			"Do you have a furry friend who loves to join you for outdoor fun? Whether the two of you plan to run, hike, or explore the great wide open together, bring along a few choice items to make the trek safer and more enjoyable for your pooch. Here are nine expert-approved accessories:",
    			"This collar-like device goes around your dog’s body instead of their neck. “Harnesses are the best option for long walks and hikes,” says Victoria Stilwell, a canine behavior expert for DOGTV. “If your dog tugs on the leash or tries to pick up the pace when you’re not ready, a harness gives you good control without putting excess pressure on her neck.” Tip: Test out new products at home first.",
    			"“If you’re thirsty, chances are, your dog is, too,” says Christy Hoffman, PhD, an assistant professor of animal behavior at Canisius College in Buffalo, NY. Your pal can get dehydrated fast -- especially when they are active. So, stash a collapsible water bowl in your backpack or in your pooch’s pack. Bring extra water if you aren’t sure you’ll have access to a clean source. Travel bowls can pick up bacteria and other outdoor bugs, so wash yours with soap and water after every use.",
    			"Dogs’ thick fur often keeps bugs at bay. Even so, flies, mosquitoes, ticks, and other insects can prey on your pooch. Their bites don’t just irritate -- they can cause illness. “Using a spray repellent, salve, or ointment makes long walks or hikes a lot more comfortable for your dog, especially during buggy seasons like summer,” says Jeff Werber, DVM, a veterinarian in Los Angeles. Check with your vet to see what’s best for your pet.",
    			"Injuries happen, so you’ll want to carry one of these with you, especially if you’re headed more than a mile or so from your car, or if your hound is too heavy for you to carry. Pet supply stores often sell prepackaged emergency kits made for dogs. Or you can bring the one you’d carry for yourself -- most human medical supplies, like gauze pads, adhesive tape, antibiotic ointment, and tweezers, are the same ones you need for your dog. If you’re planning a long trip or your pooch has a health condition like diabetes, ask your vet about specific supplies to include. ",
    			"A bite to eat can tide your pal over during long treks. But there’s another reason to bring a bag of yummy-smelling goodies: “If your dog gets free of her leash or harness for some reason, you can use treats to lure her back, and to reward her for coming when you call,” Hoffman says.",
    			"Soak a bandana in water, then freeze it for at least an hour or so. Tie the fabric loosely around your dog’s neck before you head outdoors. “It’s one of the easiest ways to help your dog feel a little cooler if it’s going to be 80 degrees or higher,” Werber says. Try a cooling vest if your pup tends to overheat or if they’ll be active in warm weather for more than half an hour. Worn around the torso, it lowers body temperature with ice packs or by releasing moisture and air.",
    			"Dog boots or shoes can protect your pal’s sensitive paw pads from ice, snow, and below-freezing temperatures. A bonus: They can keep them from bringing winter weather back into the house, too! And they can be equally helpful in the summer. “Hot pavement or asphalt can cause paw pads to blister and tear, which is very painful,” Werber says. “If you can’t find grass or dirt for your dog to walk on when it’s hot out, consider protective footwear, especially if your dog has a history of pad injuries.”",
    			"Canine skin can burn just like humans’. Pets can get skin cancer, too. To protect your dog, keep them out of the sun between 11 a.m. and 3 p.m., when rays are most intense. When they are exposed -- especially during the late spring, summer, and early fall -- apply a sunscreen made for dogs that’s SPF 30 or higher. (Don’t use sunscreen for humans -- some ingredients can be toxic for your pooch.) Put sunscreen on their nose, ears, and other areas of exposed skin. If they have short hair, you’ll want to put sunscreen on their body, too.",
    			"A bag that hangs over your dog’s back can help them carry some of the load when you’re on the road. But don’t fill it up before you call your vet. “Age and health history make a big difference in how much weight a dog can carry,” Hoffman says. Ask your vet which product is best for your buddy -- don’t go by what the package suggests. Like people, pooches need to build up endurance over time. If your dog hasn’t been active lately, pack light and go slow."
    		]
    	},
    	{
    		title: "How to Choose the Right Bed For Your Dog",
    		category: "dog",
    		img: "https://img.webmd.com/vim/live/consumer_assets/site_images/articles/health_tools/pet_ownership_health_benefits_for_psoriasis_slideshow/1800ss_getty_rf_dog_sleeping_in_dog_bed.jpg?resize=600px:*&output-quality=75",
    		ptitle: [
    			"Types of Dog Beds",
    			"Factors to Consider"
    		],
    		paragraph: [
    			"Your dog’s bed is a place where they do more than just sleep. It’s a place of refuge, where they go to rest and feel comfort. But in order to get the right one for your pup’s needs, you need to do some research and pinpoint exactly what those needs are. Size, materials, cleaning, and your dog’s age are all factors to consider before buying Fido his newest cozy spot.",
    			"Dogs sleep for around 12-14 hours per day. That’s a lot of time for anyone to spend in one spot! The best way to find a durable, comfortable bed for your furry family member is simply to watch their behavior. Do they switch sleep positions frequently? Do they curl up in a cozy ball or love to luxuriously sprawl? Choosing a bed is much more than the obvious things like choosing a fabric and size. To get a bed your dog will be happy and comfortable with in the long term, think of your dog’s specific needs, age, and what you know they like and are comfortable in. The basic types of dog beds include: Mattress pad beds. These beds are a popular choice because the rectangular shape means your buddy can move around and change positions. They’re also easy to move and store. Orthopedic beds. Made from memory foam, these beds support the achy joints and bones of senior dogs, and sometimes have bolsters along the side to support the head and provide stability. Donut beds. These circular beds are soft and cozy for dogs who just love to cuddle. They also work for multiple small dogs or puppies who like to sleep in a pile. The covers are usually made with soft, furry material, so don’t forget to make sure it’s durable before you go all-in. Cave/tent beds. These beds can be great for nervous pups or dogs that get cold easily. They help retain warmth and give protection to a dog who values privacy. Elevated beds. Popular with extreme chewers, these beds are often made from the most durable materials. They usually have a metal frame with an elevated sleeping area made of canvas or other woven fabric. The elevated bed is also a good choice for dogs with heavy coats or who tend to overheat. The space between your pup and the floor will keep things nice and cool. ",
    			"There are more factors than just the type of bed to consider when buying your dog’s bed: Size. Dogs who stretch out when they sleep will need a longer, rectangular sized bed to stay comfortable, while dogs who sleep curled up might love a soft, round bed. The size of your dog isn’t always the best indicator of what size bed they need. Some larger dogs prefer to cozy up and cover their nose with their tail, and some smaller breeds could be king of belly rubs and sleep stretched out on their back. Materials. Is your pup prone to chewing everything he gets his hands on? Or maybe you have a senior dog who needs extra cushioning for their joints. For dogs who love to chew, an elevated bed with woven material and a metal frame is chew-proof and claw-proof. A senior dog can melt into a memory foam bed with bolsters to help support the head. Pooches prone to overheating or who have hot spots will benefit from a bed made with cooling fabric. Any bed you choose should have a durable, machine washable cover. Design. It can be tempting to go for a bargain bed, but you’ll end up spending more if it falls apart after the first wash. Some cheaper beds stuffed with loose polyester are hard to refill after cleaning the cover. Get a bed with a case that’s easy to remove and throw in the washer. You’ll be doing it more times than you think. Cost. Expect to spend $35-$150 on a quality dog bed, and it can be more depending on the design. They price can get steeper, but it is an investment into your pup’s long term comfort, sense of security, and sense of home. The right bed will have them eating out of your hand in no time."
    		]
    	},
    	{
    		title: "Types of Small Pets to Adopt",
    		category: "other",
    		img: "https://img.webmd.com/vim/live/consumer_assets/site_images/articles/health_tools/10_surprising_benefits_of_pet_ownership_for_breast_cancer_slideshow/1800ss_getty_rf_feeding_parakeet_from_hand.jpg?resize=600px:*&output-quality=75",
    		ptitle: [
    			"Types of Small Pets",
    			"Tips for Adopting a Small Pet"
    		],
    		paragraph: [
    			"It’s important to think about your lifestyle before selecting a pet to keep you company. You might not want to adopt a dog or cat if you live in a small space or if you spend a lot of time out of the house during the day. In that case, you might consider a small pet, instead. Small pets, such as rodents, reptiles or birds, are good companions who don’t require a lot of space. You don’t need to take them for walks and you can buy their food at your local pet store. Some of them are friendly and cute. All of them can be enjoyable companion animals to have around. Not all small pets have the same needs, though. Learn more about some of the most popular types of small pets before you decide which one to adopt. ",
    			"There are a lot of commonly available small animals that can be kept as pets. Some of them have many things in common. All of them have specific habitat and dietary needs. Rabbits.Rabbits are appealing pets because they are quiet and sweet. However, rabbits need attentive care for them to stay happy and healthy. They need a habitat with a sheltered area for sleeping. They also need room to move around and play while they’re awake. You can keep rabbits in outdoor habitats, but it’s best to have indoor space for them in inclement weather. Indoor rabbits can be litterbox trained so that they can be loose in the house. However, if you have dogs or cats, you need to prevent them from hurting or scaring your rabbit. Rabbits are also happiest when living with other rabbits. Consider adopting more than one bunny as a pet. Hamsters. Hamsters are very popular pets because they can be content in a small space and don’t require skilled care. They are fun to watch as they burrow in their bedding or run on an exercise wheel. The drawback to hamsters is that they are nocturnal. You will find that your hamster is ready to explore and play just as you’re ready to call it a night. If you want a companion for the daylight hours, a hamster might not be the ideal choice. Guinea pigs.Guinea pigs, with their expressive sounds and cheerful demeanor, make pleasant pets. You need to be careful to give them the right diet. Like humans, they can’t synthesize vitamin C, so you need to ensure that they get enough of it in their food. Without it, they can get very sick with a disease called scurvy. Guinea pigs need a fairly large cage space with plenty of covered places to hide away. They are happiest with other guinea pigs. Plan on adopting at least two of them. Ferrets. Ferrets are intelligent and energetic. Some people describe them as being more like cats than small rodents as pets. They sleep most of the day, but during their waking hours they are very active. They like to play with humans or other ferrets. Ferrets prefer cages with multiple levels and plenty of areas to climb and hide. You can allow them to play out of their cages if your house is safe for them. They can get into small spaces and they risk getting stuck so ferret-proofing is a must. They are carnivores so they require meat for their diet. Gerbils. Gerbils are a fairly low maintenance pet. They do well in a large aquarium-type cage. They enjoy having tunnels to crawl through and spaces to hide. They might also like an exercise wheel. Unlike hamsters, gerbils are awake during the day. They like having other gerbils around, so you may want to consider adopting more than one. Chinchillas. Chinchillas are known for their thick, soft fur. Like ferrets, they prefer a large living space with multiple levels for climbing. They are friendly and can bond with their owner, but they are nocturnal. You’ll need to plan time with your chinchilla in the evening when they are awake. Chinchillas live as long as 15 years so adopting one is a significant commitment. Reptiles. While not as cute and fuzzy as rodents, lizards and snakes are interesting animals. Reptiles need specialized habitats that help manage their body temperature. As cold-blooded animals, they can’t regulate their temperature on their own. Reptiles are hypoallergenic, which makes them a good choice for people sensitive to animal dander. Many reptiles need to eat live prey, such as crickets or mice, so that is a consideration as well. Birds. There are a wide variety of birds that can be kept as pets. They range from parakeets or lovebirds that live indoors to backyard chickens. Birds require a very clean cage. They also need a balanced diet. Not all veterinarians treat birds, so it is important to find a qualified vet nearby before bringing home a bird. You also might need to consider that your bird will outlive you. In rare cases, larger birds have lived as long as 100 years.",
    			"Choosing a pet is a serious commitment. You should think carefully about what kind of small pet is a good match for you. If you have questions about which little friend might fit best into your lifestyle, consult a vet or animal breeder for more information."
    		]
    	},
    	{
    		title: "20 Things You Can Learn from Your Pets",
    		category: "other",
    		img: "https://img.webmd.com/dtmcms/live/webmd/consumer_assets/site_images/article_thumbnails/reference_guide/insect_lawn_care_ref_guide/1800x1200_insect_lawn_care_ref_guide.jpg?resize=600px:*&output-quality=75",
    		ptitle: [
    			"Forget Multitasking",
    			"Take Naps",
    			"Walk Every Day ",
    			"Cultivate Friendships",
    			"Live in the Moment",
    			"Don't Hold a Grudge",
    			"Wag",
    			"Maintain Curiosity",
    			"Be Silly",
    			"Get a Back Rub",
    			"Drink Water When You're Thirsty",
    			"Eat Fish",
    			"If You Love Someone, Show It",
    			"Play",
    			"Enjoy the Great Outdoors",
    			"Make Time to Groom",
    			"Be Aware of Body Language",
    			"Stretch Often",
    			"Seek Out Shade",
    			"Stick to a Schedule"
    		],
    		paragraph: [
    			"",
    			"When dogs have a job to do, they give it their undivided attention. It turns out people should probably do the same. Stanford researchers found that attention and memory suffer in those who juggle work, email, and web-surfing, compared to those who focus on one task at a time. Other studies suggest employees actually lose time when multitasking.",
    			"You won't catch your pet going from dawn to dusk without any shut-eye. There's good evidence humans can benefit from catnaps, too. A study involving about 24,000 people indicates regular nappers are 37% less likely to die from heart disease than people who nap only occasionally. Short naps can also enhance alertness and job performance.",
    			"Whether you've got four legs or two, walking is one of the safest, easiest ways to burn calories and boost heart health. Taking regular walks can also help you: Fight depression, Lose weight, Lower your risk for type 2 diabetes, Lower the risk of breast and colon cancer, Keep your bones strong, Keep your mind sharp.",
    			"People are social animals, and friendships have measurable health benefits. Researchers in Australia followed 1,500 older people for 10 years. Those with the most friends were 22% likely to live longer than those with the fewest friends.",
    			"Living in the moment may be one of the most important lessons we can learn from our pets. In a study called 'A Wandering Mind Is an Unhappy Mind,' Harvard psychologists conclude that people are happiest when doing activities that keep the mind focused, such as sex or exercise. Planning, reminiscing, or thinking about anything other than the current activity can undermine happiness.",
    			"Part of living in the moment is letting bygones be bygones. Let go of old grudges, and you'll literally breathe easier. Chronic anger has been linked to a decline in lung function, while forgiveness contributes to lower blood pressure and reduced anxiety. People who forgive also tend to have higher self-esteem.",
    			"OK, so maybe you don't have a tail. But you can smile or put a spring in your step when you're feeling grateful. Researchers have found a strong connection between gratitude and general well-being. In one study, people who kept gratitude journals had better attitudes, exercised more, and had fewer physical complaints.",
    			"According to a popular saying, curiosity may be hazardous to a cat's health. But not so for humans. Researchers have found that people who are more curious tend to have a greater sense of meaning in life. Other studies have linked curiosity to psychological well-being and the expansion of knowledge and skills.",
    			"Indulging in a little silliness may have serious health benefits. Cardiologists at the University of Maryland Medical Center found a stronger sense of humor in people with healthy hearts than in those who had suffered a heart attack. They conclude that 'laughter is the best medicine' – especially when it comes to protecting your heart.",
    			"The power of touch is nothing to sniff at. The Touch Research Institute at the University of Miami Miller School of Medicine has found massage therapy can ease pain, give the immune system a boost, and help manage chronic conditions like asthma and diabetes. The touch of a loved one may be even more powerful. In one study, married women experienced less anxiety over the threat of an electric shock when they held their husbands' hands.",
    			"Dogs don't lap up sports drinks when they've been playing hard – and most people don't need to, either. During a typical workout, drinking water is the best way to stay hydrated. Water gives your muscles and tissues critical fluid without adding to your calorie count. Be sure to drink more than usual on hot days or when you're sweating a lot.",
    			"Most cats would trade kibble for a can of tuna any day. Luckily, you can choose to make fish a regular part of your diet. Salmon, tuna, trout, and other fatty fish are high in omega-3 fatty acids, which may reduce the risk of heart disease, high blood pressure, and arthritis. In addition, Rush University researchers found that people who eat fish at least once a week are 60% less likely to develop Alzheimer's disease.",
    			"Dogs don't play hard to get – when they love you, they show you. It's a good approach for people seeking to strengthen their relationships. A study published in the journal Personal Relationships suggests small, thoughtful gestures can have a big impact on how connected and satisfied couples feel.",
    			"Goofing off is not just for kids and kittens. In his book, Play, Stuart Brown, MD, writes that playing is a basic human need along with sleeping and eating. Play enhances intelligence, creativity, problem-solving, and social skills. So take a cue from your pet and devote yourself to an activity that has no purpose other than sheer fun.",
    			"A hike in the woods may be a dog's idea of bliss, but it has plenty of benefits for the human mind and body, as well. Spending time outdoors can enhance fitness, increase vitamin D levels, and reduce stress. In children, playing in natural settings has also been linked to better distance vision, fewer ADHD symptoms, and better performance in school.",
    			"Aside from the obvious health benefits of bathing and brushing your teeth, grooming can have a number of positive effects on your life. Good personal hygiene is vital to self-esteem. A tidy appearance can also help you get and maintain a job.",
    			"Dogs are excellent at reading each other's intent from body language. Humans, not so much. While most of us do reveal our emotions through posture, speech patterns, and eye contact, other people generally aren't very good at reading those cues. People get better at decoding body language as they get older.",
    			"Stretching will keep you limber, but the benefits don't stop there. In a 10-week study, volunteers who did no exercise other than stretching experienced surprising physical changes. Besides improving flexibility, they increased their muscle strength, power, and endurance. Although the study was a small one, the results suggest stretching may be a good alternative for people who have a condition that rules out traditional strength-training.",
    			"When you're at the park, and your pooch is ready for a break, they'll probably find a nice shady spot to relax. Dermatologists recommend you follow suit, especially between the hours of 10 a.m. and 4 p.m. That’s when you would soak up the most UV rays, particularly during late spring and early summer. But keep in mind that even before you're sheltered in the shade, it's a good idea to use a broad-spectrum sunscreen on exposed skin.",
    			"Pets like the consistency of a routine – they can’t tell a Saturday from a Monday. The same goes for the human body clock. People sleep better if they go to bed and get up at the same time every day, even on weekends. Sticking to a consistent schedule for bathing, dressing, and eating can also improve the quality of sleep."
    		]
    	}
    ];

    /* src\component\medinfo\MedInfo.svelte generated by Svelte v3.53.1 */
    const file$3 = "src\\component\\medinfo\\MedInfo.svelte";

    function get_each_context$1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[8] = list[i];
    	return child_ctx;
    }

    // (64:8) {#each visible as info}
    function create_each_block$1(ctx) {
    	let article;
    	let current;

    	article = new Article({
    			props: { info: /*info*/ ctx[8] },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(article.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(article, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const article_changes = {};
    			if (dirty & /*visible*/ 1) article_changes.info = /*info*/ ctx[8];
    			article.$set(article_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(article.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(article.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(article, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$1.name,
    		type: "each",
    		source: "(64:8) {#each visible as info}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$3(ctx) {
    	let div1;
    	let div0;
    	let span0;
    	let t1;
    	let span1;
    	let t3;
    	let t4;
    	let div4;
    	let div2;
    	let button0;
    	let t6;
    	let button1;
    	let img0;
    	let img0_src_value;
    	let t7;
    	let t8;
    	let button2;
    	let img1;
    	let img1_src_value;
    	let t9;
    	let t10;
    	let button3;
    	let img2;
    	let img2_src_value;
    	let t11;
    	let t12;
    	let div3;
    	let current;
    	let mounted;
    	let dispose;
    	let each_value = /*visible*/ ctx[0];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$1(get_each_context$1(ctx, each_value, i));
    	}

    	const out = i => transition_out(each_blocks[i], 1, 1, () => {
    		each_blocks[i] = null;
    	});

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			div0 = element("div");
    			span0 = element("span");
    			span0.textContent = "M";
    			t1 = text("EDICAL ");
    			span1 = element("span");
    			span1.textContent = "I";
    			t3 = text("NFO");
    			t4 = space();
    			div4 = element("div");
    			div2 = element("div");
    			button0 = element("button");
    			button0.textContent = "All";
    			t6 = space();
    			button1 = element("button");
    			img0 = element("img");
    			t7 = text(" Cat");
    			t8 = space();
    			button2 = element("button");
    			img1 = element("img");
    			t9 = text(" Dog");
    			t10 = space();
    			button3 = element("button");
    			img2 = element("img");
    			t11 = text(" Other");
    			t12 = space();
    			div3 = element("div");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr_dev(span0, "class", "capital");
    			add_location(span0, file$3, 53, 65, 2163);
    			attr_dev(span1, "class", "capital");
    			add_location(span1, file$3, 53, 102, 2200);
    			attr_dev(div0, "class", "titlepage");
    			toggle_class(div0, "titlepagemob", /*screenWidth*/ ctx[1] < 500);
    			add_location(div0, file$3, 53, 4, 2102);
    			attr_dev(div1, "class", "container");
    			add_location(div1, file$3, 52, 0, 2073);
    			attr_dev(button0, "id", "allf");
    			attr_dev(button0, "class", "filter svelte-1rza1f2");
    			add_location(button0, file$3, 57, 8, 2314);
    			if (!src_url_equal(img0.src, img0_src_value = "images/catfilter.png")) attr_dev(img0, "src", img0_src_value);
    			attr_dev(img0, "alt", "");
    			attr_dev(img0, "class", "svelte-1rza1f2");
    			add_location(img0, file$3, 58, 75, 2470);
    			attr_dev(button1, "id", "catf");
    			attr_dev(button1, "class", "filter svelte-1rza1f2");
    			add_location(button1, file$3, 58, 8, 2403);
    			if (!src_url_equal(img1.src, img1_src_value = "images/dogfilter.png")) attr_dev(img1, "src", img1_src_value);
    			attr_dev(img1, "alt", "");
    			attr_dev(img1, "class", "svelte-1rza1f2");
    			add_location(img1, file$3, 59, 75, 2599);
    			attr_dev(button2, "id", "dogf");
    			attr_dev(button2, "class", "filter svelte-1rza1f2");
    			add_location(button2, file$3, 59, 8, 2532);
    			if (!src_url_equal(img2.src, img2_src_value = "images/otherfilter.png")) attr_dev(img2, "src", img2_src_value);
    			attr_dev(img2, "alt", "");
    			attr_dev(img2, "class", "svelte-1rza1f2");
    			add_location(img2, file$3, 60, 79, 2732);
    			attr_dev(button3, "id", "otherf");
    			attr_dev(button3, "class", "filter svelte-1rza1f2");
    			add_location(button3, file$3, 60, 8, 2661);
    			attr_dev(div2, "class", "filters flex svelte-1rza1f2");
    			add_location(div2, file$3, 56, 4, 2278);
    			attr_dev(div3, "class", "content container flex svelte-1rza1f2");
    			add_location(div3, file$3, 62, 4, 2806);
    			attr_dev(div4, "class", "container");
    			add_location(div4, file$3, 55, 0, 2249);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			append_dev(div1, div0);
    			append_dev(div0, span0);
    			append_dev(div0, t1);
    			append_dev(div0, span1);
    			append_dev(div0, t3);
    			insert_dev(target, t4, anchor);
    			insert_dev(target, div4, anchor);
    			append_dev(div4, div2);
    			append_dev(div2, button0);
    			append_dev(div2, t6);
    			append_dev(div2, button1);
    			append_dev(button1, img0);
    			append_dev(button1, t7);
    			append_dev(div2, t8);
    			append_dev(div2, button2);
    			append_dev(button2, img1);
    			append_dev(button2, t9);
    			append_dev(div2, t10);
    			append_dev(div2, button3);
    			append_dev(button3, img2);
    			append_dev(button3, t11);
    			append_dev(div4, t12);
    			append_dev(div4, div3);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(div3, null);
    			}

    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(button0, "click", /*click_handler*/ ctx[3], false, false, false),
    					listen_dev(button1, "click", /*click_handler_1*/ ctx[4], false, false, false),
    					listen_dev(button2, "click", /*click_handler_2*/ ctx[5], false, false, false),
    					listen_dev(button3, "click", /*click_handler_3*/ ctx[6], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (!current || dirty & /*screenWidth*/ 2) {
    				toggle_class(div0, "titlepagemob", /*screenWidth*/ ctx[1] < 500);
    			}

    			if (dirty & /*visible*/ 1) {
    				each_value = /*visible*/ ctx[0];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$1(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    						transition_in(each_blocks[i], 1);
    					} else {
    						each_blocks[i] = create_each_block$1(child_ctx);
    						each_blocks[i].c();
    						transition_in(each_blocks[i], 1);
    						each_blocks[i].m(div3, null);
    					}
    				}

    				group_outros();

    				for (i = each_value.length; i < each_blocks.length; i += 1) {
    					out(i);
    				}

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;

    			for (let i = 0; i < each_value.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			current = true;
    		},
    		o: function outro(local) {
    			each_blocks = each_blocks.filter(Boolean);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);
    			if (detaching) detach_dev(t4);
    			if (detaching) detach_dev(div4);
    			destroy_each(each_blocks, detaching);
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
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('MedInfo', slots, []);
    	var visible = articles;
    	var filteractive = "all";
    	var screenWidth = window.innerWidth;

    	window.addEventListener("resize", function (event) {
    		$$invalidate(1, screenWidth = window.innerWidth);
    	});

    	//impostare il filtro iniziale
    	tick().then(() => {
    		document.getElementById("allf").style.backgroundColor = "rgb(178, 178, 178)";
    	});

    	const applyFilter = filter => {
    		if (filter != filteractive) {
    			$$invalidate(0, visible = []);
    			document.getElementById("allf").style.backgroundColor = "white";
    			document.getElementById("catf").style.backgroundColor = "white";
    			document.getElementById("dogf").style.backgroundColor = "white";
    			document.getElementById("otherf").style.backgroundColor = "white";

    			switch (filter) {
    				case "all":
    					filteractive = "all";
    					$$invalidate(0, visible = articles);
    					document.getElementById("allf").style.backgroundColor = "rgb(178, 178, 178)";
    					break;
    				case "cat":
    					filteractive = "cat";
    					$$invalidate(0, visible = articles.filter(article => article.category == "cat"));
    					document.getElementById("catf").style.backgroundColor = "rgb(178, 178, 178)";
    					break;
    				case "dog":
    					filteractive = "dog";
    					$$invalidate(0, visible = articles.filter(article => article.category == "dog"));
    					document.getElementById("dogf").style.backgroundColor = "rgb(178, 178, 178)";
    					break;
    				case "other":
    					filteractive = "other";
    					$$invalidate(0, visible = articles.filter(article => article.category == "other"));
    					document.getElementById("otherf").style.backgroundColor = "rgb(178, 178, 178)";
    					break;
    			}
    		}
    	};

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<MedInfo> was created with unknown prop '${key}'`);
    	});

    	const click_handler = () => applyFilter("all");
    	const click_handler_1 = () => applyFilter("cat");
    	const click_handler_2 = () => applyFilter("dog");
    	const click_handler_3 = () => applyFilter("other");

    	$$self.$capture_state = () => ({
    		tick,
    		Article,
    		articles,
    		visible,
    		filteractive,
    		screenWidth,
    		applyFilter
    	});

    	$$self.$inject_state = $$props => {
    		if ('visible' in $$props) $$invalidate(0, visible = $$props.visible);
    		if ('filteractive' in $$props) filteractive = $$props.filteractive;
    		if ('screenWidth' in $$props) $$invalidate(1, screenWidth = $$props.screenWidth);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		visible,
    		screenWidth,
    		applyFilter,
    		click_handler,
    		click_handler_1,
    		click_handler_2,
    		click_handler_3
    	];
    }

    class MedInfo extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$3, create_fragment$3, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "MedInfo",
    			options,
    			id: create_fragment$3.name
    		});
    	}
    }

    /* src\component\yourpets\Pet.svelte generated by Svelte v3.53.1 */

    const { console: console_1$1 } = globals;
    const file$2 = "src\\component\\yourpets\\Pet.svelte";

    // (183:4) {:else}
    function create_else_block(ctx) {
    	let div7;
    	let div0;
    	let input0;
    	let t0;
    	let label0;
    	let t2;
    	let div4;
    	let div1;
    	let input1;
    	let t3;
    	let label1;
    	let t5;
    	let div2;
    	let input2;
    	let t6;
    	let label2;
    	let t8;
    	let div3;
    	let input3;
    	let t9;
    	let label3;
    	let t11;
    	let div5;
    	let select;
    	let option0;
    	let option1;
    	let option2;
    	let option3;
    	let option4;
    	let option5;
    	let option6;
    	let option7;
    	let option8;
    	let option9;
    	let option10;
    	let option11;
    	let option12;
    	let option13;
    	let option14;
    	let option15;
    	let option16;
    	let option17;
    	let option18;
    	let option19;
    	let option20;
    	let t33;
    	let label4;
    	let t35;
    	let div6;
    	let input4;
    	let t36;
    	let label5;
    	let t38;
    	let div8;
    	let button0;
    	let t40;
    	let button1;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			div7 = element("div");
    			div0 = element("div");
    			input0 = element("input");
    			t0 = space();
    			label0 = element("label");
    			label0.textContent = "Name";
    			t2 = space();
    			div4 = element("div");
    			div1 = element("div");
    			input1 = element("input");
    			t3 = space();
    			label1 = element("label");
    			label1.textContent = "Male";
    			t5 = space();
    			div2 = element("div");
    			input2 = element("input");
    			t6 = space();
    			label2 = element("label");
    			label2.textContent = "Female";
    			t8 = space();
    			div3 = element("div");
    			input3 = element("input");
    			t9 = space();
    			label3 = element("label");
    			label3.textContent = "Others";
    			t11 = space();
    			div5 = element("div");
    			select = element("select");
    			option0 = element("option");
    			option0.textContent = "Dog";
    			option1 = element("option");
    			option1.textContent = "Cat";
    			option2 = element("option");
    			option2.textContent = "Hamster";
    			option3 = element("option");
    			option3.textContent = "Mouse";
    			option4 = element("option");
    			option4.textContent = "Horse";
    			option5 = element("option");
    			option5.textContent = "Cow";
    			option6 = element("option");
    			option6.textContent = "Pig";
    			option7 = element("option");
    			option7.textContent = "Sheep";
    			option8 = element("option");
    			option8.textContent = "Goat";
    			option9 = element("option");
    			option9.textContent = "Birdie";
    			option10 = element("option");
    			option10.textContent = "Parrot";
    			option11 = element("option");
    			option11.textContent = "Owl";
    			option12 = element("option");
    			option12.textContent = "Bat";
    			option13 = element("option");
    			option13.textContent = "Fish";
    			option14 = element("option");
    			option14.textContent = "Frog";
    			option15 = element("option");
    			option15.textContent = "Turtle";
    			option16 = element("option");
    			option16.textContent = "Lizard";
    			option17 = element("option");
    			option17.textContent = "Snake";
    			option18 = element("option");
    			option18.textContent = "Ant";
    			option19 = element("option");
    			option19.textContent = "Bee";
    			option20 = element("option");
    			option20.textContent = "Spider";
    			t33 = space();
    			label4 = element("label");
    			label4.textContent = "Choose the species";
    			t35 = space();
    			div6 = element("div");
    			input4 = element("input");
    			t36 = space();
    			label5 = element("label");
    			label5.textContent = "Race";
    			t38 = space();
    			div8 = element("div");
    			button0 = element("button");
    			button0.textContent = "Confirm";
    			t40 = space();
    			button1 = element("button");
    			button1.textContent = "Cancel";
    			attr_dev(input0, "type", "text");
    			attr_dev(input0, "class", "form-control form-control-sm");
    			attr_dev(input0, "id", "name");
    			attr_dev(input0, "placeholder", "Name");
    			add_location(input0, file$2, 185, 16, 6452);
    			attr_dev(label0, "for", "name");
    			add_location(label0, file$2, 186, 16, 6555);
    			attr_dev(div0, "class", "form-floating svelte-1pgo299");
    			attr_dev(div0, "id", "namec");
    			toggle_class(div0, "width100", /*screenWidth*/ ctx[0] < 500);
    			toggle_class(div0, "padtop", /*screenWidth*/ ctx[0] < 500);
    			add_location(div0, file$2, 184, 12, 6332);
    			attr_dev(input1, "class", "form-check-input");
    			attr_dev(input1, "type", "radio");
    			attr_dev(input1, "name", "gender");
    			attr_dev(input1, "id", "inlineRadio1");
    			input1.value = "male";
    			input1.checked = true;
    			add_location(input1, file$2, 190, 20, 6758);
    			attr_dev(label1, "class", "form-check-label");
    			attr_dev(label1, "for", "inlineRadio1");
    			add_location(label1, file$2, 191, 20, 6878);
    			attr_dev(div1, "class", "form-check form-check-inline");
    			add_location(div1, file$2, 189, 16, 6694);
    			attr_dev(input2, "class", "form-check-input");
    			attr_dev(input2, "type", "radio");
    			attr_dev(input2, "name", "gender");
    			attr_dev(input2, "id", "inlineRadio2");
    			input2.value = "female";
    			add_location(input2, file$2, 194, 20, 7047);
    			attr_dev(label2, "class", "form-check-label");
    			attr_dev(label2, "for", "inlineRadio2");
    			add_location(label2, file$2, 195, 20, 7161);
    			attr_dev(div2, "class", "form-check form-check-inline");
    			add_location(div2, file$2, 193, 16, 6983);
    			attr_dev(input3, "class", "form-check-input");
    			attr_dev(input3, "type", "radio");
    			attr_dev(input3, "name", "gender");
    			attr_dev(input3, "id", "inlineRadio3");
    			input3.value = "others";
    			add_location(input3, file$2, 198, 20, 7332);
    			attr_dev(label3, "class", "form-check-label");
    			attr_dev(label3, "for", "inlineRadio3");
    			add_location(label3, file$2, 199, 20, 7446);
    			attr_dev(div3, "class", "form-check form-check-inline");
    			add_location(div3, file$2, 197, 16, 7268);
    			set_style(div4, "width", "45%");
    			attr_dev(div4, "class", "svelte-1pgo299");
    			toggle_class(div4, "width100", /*screenWidth*/ ctx[0] < 500);
    			add_location(div4, file$2, 188, 12, 6619);
    			option0.__value = "dog";
    			option0.value = option0.__value;
    			add_location(option0, file$2, 204, 20, 7768);
    			option1.__value = "cat";
    			option1.value = option1.__value;
    			add_location(option1, file$2, 205, 20, 7822);
    			option2.__value = "hamster";
    			option2.value = option2.__value;
    			add_location(option2, file$2, 206, 20, 7876);
    			option3.__value = "mouse";
    			option3.value = option3.__value;
    			add_location(option3, file$2, 207, 20, 7938);
    			option4.__value = "horse";
    			option4.value = option4.__value;
    			add_location(option4, file$2, 208, 20, 7996);
    			option5.__value = "cow";
    			option5.value = option5.__value;
    			add_location(option5, file$2, 209, 20, 8054);
    			option6.__value = "pig";
    			option6.value = option6.__value;
    			add_location(option6, file$2, 210, 20, 8108);
    			option7.__value = "sheep";
    			option7.value = option7.__value;
    			add_location(option7, file$2, 211, 20, 8162);
    			option8.__value = "goat";
    			option8.value = option8.__value;
    			add_location(option8, file$2, 212, 20, 8220);
    			option9.__value = "birdie";
    			option9.value = option9.__value;
    			add_location(option9, file$2, 213, 20, 8276);
    			option10.__value = "parrot";
    			option10.value = option10.__value;
    			add_location(option10, file$2, 214, 20, 8336);
    			option11.__value = "owl";
    			option11.value = option11.__value;
    			add_location(option11, file$2, 215, 20, 8396);
    			option12.__value = "bat";
    			option12.value = option12.__value;
    			add_location(option12, file$2, 216, 20, 8450);
    			option13.__value = "fish";
    			option13.value = option13.__value;
    			add_location(option13, file$2, 217, 20, 8504);
    			option14.__value = "frog";
    			option14.value = option14.__value;
    			add_location(option14, file$2, 218, 20, 8560);
    			option15.__value = "turtle";
    			option15.value = option15.__value;
    			add_location(option15, file$2, 219, 20, 8616);
    			option16.__value = "lizard";
    			option16.value = option16.__value;
    			add_location(option16, file$2, 220, 20, 8676);
    			option17.__value = "snake";
    			option17.value = option17.__value;
    			add_location(option17, file$2, 221, 20, 8736);
    			option18.__value = "ant";
    			option18.value = option18.__value;
    			add_location(option18, file$2, 222, 20, 8794);
    			option19.__value = "bee";
    			option19.value = option19.__value;
    			add_location(option19, file$2, 223, 20, 8848);
    			option20.__value = "spider";
    			option20.value = option20.__value;
    			add_location(option20, file$2, 224, 20, 8902);
    			attr_dev(select, "class", "form-select form-select-sm");
    			attr_dev(select, "id", "species");
    			attr_dev(select, "aria-label", "Floating label select example");
    			add_location(select, file$2, 203, 16, 7647);
    			attr_dev(label4, "for", "species");
    			add_location(label4, file$2, 226, 16, 8985);
    			attr_dev(div5, "class", "form-floating svelte-1pgo299");
    			toggle_class(div5, "width100", /*screenWidth*/ ctx[0] < 500);
    			add_location(div5, file$2, 202, 12, 7569);
    			attr_dev(input4, "type", "text");
    			attr_dev(input4, "class", "form-control form-control-sm");
    			attr_dev(input4, "id", "race");
    			attr_dev(input4, "placeholder", "race");
    			add_location(input4, file$2, 229, 16, 9155);
    			attr_dev(label5, "for", "race");
    			add_location(label5, file$2, 230, 16, 9258);
    			attr_dev(div6, "class", "form-floating svelte-1pgo299");
    			attr_dev(div6, "id", "racec");
    			toggle_class(div6, "width100", /*screenWidth*/ ctx[0] < 500);
    			add_location(div6, file$2, 228, 12, 9066);
    			set_style(div7, "width", "80%");
    			set_style(div7, "display", "flex");
    			set_style(div7, "justify-content", "space-around");
    			set_style(div7, "flex-wrap", "wrap");
    			set_style(div7, "font-size", "35%");
    			set_style(div7, "align-items", "center");
    			attr_dev(div7, "class", "svelte-1pgo299");
    			toggle_class(div7, "width100", /*screenWidth*/ ctx[0] < 500);
    			add_location(div7, file$2, 183, 8, 6164);
    			attr_dev(button0, "type", "button");
    			attr_dev(button0, "class", "btn btn-success svelte-1pgo299");
    			toggle_class(button0, "butmob", /*screenWidth*/ ctx[0] < 500);
    			add_location(button0, file$2, 235, 12, 9405);
    			attr_dev(button1, "type", "button");
    			attr_dev(button1, "class", "btn btn-danger svelte-1pgo299");
    			toggle_class(button1, "butmob", /*screenWidth*/ ctx[0] < 500);
    			add_location(button1, file$2, 236, 12, 9533);
    			attr_dev(div8, "class", "buttons svelte-1pgo299");
    			toggle_class(div8, "width100", /*screenWidth*/ ctx[0] < 500);
    			add_location(div8, file$2, 234, 8, 9336);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div7, anchor);
    			append_dev(div7, div0);
    			append_dev(div0, input0);
    			append_dev(div0, t0);
    			append_dev(div0, label0);
    			append_dev(div7, t2);
    			append_dev(div7, div4);
    			append_dev(div4, div1);
    			append_dev(div1, input1);
    			append_dev(div1, t3);
    			append_dev(div1, label1);
    			append_dev(div4, t5);
    			append_dev(div4, div2);
    			append_dev(div2, input2);
    			append_dev(div2, t6);
    			append_dev(div2, label2);
    			append_dev(div4, t8);
    			append_dev(div4, div3);
    			append_dev(div3, input3);
    			append_dev(div3, t9);
    			append_dev(div3, label3);
    			append_dev(div7, t11);
    			append_dev(div7, div5);
    			append_dev(div5, select);
    			append_dev(select, option0);
    			append_dev(select, option1);
    			append_dev(select, option2);
    			append_dev(select, option3);
    			append_dev(select, option4);
    			append_dev(select, option5);
    			append_dev(select, option6);
    			append_dev(select, option7);
    			append_dev(select, option8);
    			append_dev(select, option9);
    			append_dev(select, option10);
    			append_dev(select, option11);
    			append_dev(select, option12);
    			append_dev(select, option13);
    			append_dev(select, option14);
    			append_dev(select, option15);
    			append_dev(select, option16);
    			append_dev(select, option17);
    			append_dev(select, option18);
    			append_dev(select, option19);
    			append_dev(select, option20);
    			append_dev(div5, t33);
    			append_dev(div5, label4);
    			append_dev(div7, t35);
    			append_dev(div7, div6);
    			append_dev(div6, input4);
    			append_dev(div6, t36);
    			append_dev(div6, label5);
    			insert_dev(target, t38, anchor);
    			insert_dev(target, div8, anchor);
    			append_dev(div8, button0);
    			append_dev(div8, t40);
    			append_dev(div8, button1);

    			if (!mounted) {
    				dispose = [
    					listen_dev(button0, "click", /*confirmed*/ ctx[7], false, false, false),
    					listen_dev(button1, "click", /*canceled*/ ctx[10], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*screenWidth*/ 1) {
    				toggle_class(div0, "width100", /*screenWidth*/ ctx[0] < 500);
    			}

    			if (dirty & /*screenWidth*/ 1) {
    				toggle_class(div0, "padtop", /*screenWidth*/ ctx[0] < 500);
    			}

    			if (dirty & /*screenWidth*/ 1) {
    				toggle_class(div4, "width100", /*screenWidth*/ ctx[0] < 500);
    			}

    			if (dirty & /*screenWidth*/ 1) {
    				toggle_class(div5, "width100", /*screenWidth*/ ctx[0] < 500);
    			}

    			if (dirty & /*screenWidth*/ 1) {
    				toggle_class(div6, "width100", /*screenWidth*/ ctx[0] < 500);
    			}

    			if (dirty & /*screenWidth*/ 1) {
    				toggle_class(div7, "width100", /*screenWidth*/ ctx[0] < 500);
    			}

    			if (dirty & /*screenWidth*/ 1) {
    				toggle_class(button0, "butmob", /*screenWidth*/ ctx[0] < 500);
    			}

    			if (dirty & /*screenWidth*/ 1) {
    				toggle_class(button1, "butmob", /*screenWidth*/ ctx[0] < 500);
    			}

    			if (dirty & /*screenWidth*/ 1) {
    				toggle_class(div8, "width100", /*screenWidth*/ ctx[0] < 500);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div7);
    			if (detaching) detach_dev(t38);
    			if (detaching) detach_dev(div8);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block.name,
    		type: "else",
    		source: "(183:4) {:else}",
    		ctx
    	});

    	return block;
    }

    // (160:4) {#if isPetConfirmed}
    function create_if_block(ctx) {
    	let div0;
    	let t0;
    	let t1;
    	let div5;
    	let div1;
    	let t2;
    	let span0;
    	let t3;
    	let t4;
    	let div2;
    	let t5;
    	let span1;
    	let t6;
    	let t7;
    	let div3;
    	let t8;
    	let span2;
    	let t9;
    	let t10;
    	let div4;
    	let t11;
    	let span3;
    	let t12;
    	let t13;
    	let div6;
    	let button0;
    	let t15;
    	let button1;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			div0 = element("div");
    			t0 = text(/*icon*/ ctx[2]);
    			t1 = space();
    			div5 = element("div");
    			div1 = element("div");
    			t2 = text("Name: ");
    			span0 = element("span");
    			t3 = text(/*name*/ ctx[3]);
    			t4 = space();
    			div2 = element("div");
    			t5 = text("Gender: ");
    			span1 = element("span");
    			t6 = text(/*gender*/ ctx[4]);
    			t7 = space();
    			div3 = element("div");
    			t8 = text("Species: ");
    			span2 = element("span");
    			t9 = text(/*species*/ ctx[5]);
    			t10 = space();
    			div4 = element("div");
    			t11 = text("Race: ");
    			span3 = element("span");
    			t12 = text(/*race*/ ctx[6]);
    			t13 = space();
    			div6 = element("div");
    			button0 = element("button");
    			button0.textContent = "Edit";
    			t15 = space();
    			button1 = element("button");
    			button1.textContent = "Delete";
    			attr_dev(div0, "class", "icon svelte-1pgo299");
    			toggle_class(div0, "iconmob", /*screenWidth*/ ctx[0] < 500);
    			add_location(div0, file$2, 160, 8, 4987);
    			set_style(span0, "font-weight", "normal");
    			add_location(span0, file$2, 165, 22, 5225);
    			attr_dev(div1, "class", "width40 svelte-1pgo299");
    			toggle_class(div1, "width100", /*screenWidth*/ ctx[0] < 500);
    			add_location(div1, file$2, 164, 12, 5147);
    			set_style(span1, "font-weight", "normal");
    			add_location(span1, file$2, 168, 24, 5387);
    			attr_dev(div2, "class", "width40 svelte-1pgo299");
    			toggle_class(div2, "width100", /*screenWidth*/ ctx[0] < 500);
    			add_location(div2, file$2, 167, 12, 5307);
    			set_style(span2, "font-weight", "normal");
    			add_location(span2, file$2, 171, 25, 5552);
    			attr_dev(div3, "class", "width40 svelte-1pgo299");
    			toggle_class(div3, "width100", /*screenWidth*/ ctx[0] < 500);
    			add_location(div3, file$2, 170, 12, 5471);
    			set_style(span3, "font-weight", "normal");
    			add_location(span3, file$2, 174, 22, 5715);
    			attr_dev(div4, "class", "width40 svelte-1pgo299");
    			toggle_class(div4, "width100", /*screenWidth*/ ctx[0] < 500);
    			add_location(div4, file$2, 173, 12, 5637);
    			attr_dev(div5, "class", "info svelte-1pgo299");
    			toggle_class(div5, "infomob", /*screenWidth*/ ctx[0] < 500);
    			add_location(div5, file$2, 163, 8, 5083);
    			attr_dev(button0, "type", "button");
    			attr_dev(button0, "class", "btn btn-primary svelte-1pgo299");
    			toggle_class(button0, "butmob", /*screenWidth*/ ctx[0] < 500);
    			add_location(button0, file$2, 179, 12, 5891);
    			attr_dev(button1, "type", "button");
    			attr_dev(button1, "class", "btn btn-danger svelte-1pgo299");
    			toggle_class(button1, "butmob", /*screenWidth*/ ctx[0] < 500);
    			add_location(button1, file$2, 180, 12, 6015);
    			attr_dev(div6, "class", "buttons svelte-1pgo299");
    			toggle_class(div6, "width100", /*screenWidth*/ ctx[0] < 500);
    			add_location(div6, file$2, 178, 8, 5823);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div0, anchor);
    			append_dev(div0, t0);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, div5, anchor);
    			append_dev(div5, div1);
    			append_dev(div1, t2);
    			append_dev(div1, span0);
    			append_dev(span0, t3);
    			append_dev(div5, t4);
    			append_dev(div5, div2);
    			append_dev(div2, t5);
    			append_dev(div2, span1);
    			append_dev(span1, t6);
    			append_dev(div5, t7);
    			append_dev(div5, div3);
    			append_dev(div3, t8);
    			append_dev(div3, span2);
    			append_dev(span2, t9);
    			append_dev(div5, t10);
    			append_dev(div5, div4);
    			append_dev(div4, t11);
    			append_dev(div4, span3);
    			append_dev(span3, t12);
    			insert_dev(target, t13, anchor);
    			insert_dev(target, div6, anchor);
    			append_dev(div6, button0);
    			append_dev(div6, t15);
    			append_dev(div6, button1);

    			if (!mounted) {
    				dispose = [
    					listen_dev(button0, "click", /*modified*/ ctx[8], false, false, false),
    					listen_dev(button1, "click", /*deleted*/ ctx[9], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*icon*/ 4) set_data_dev(t0, /*icon*/ ctx[2]);

    			if (dirty & /*screenWidth*/ 1) {
    				toggle_class(div0, "iconmob", /*screenWidth*/ ctx[0] < 500);
    			}

    			if (dirty & /*name*/ 8) set_data_dev(t3, /*name*/ ctx[3]);

    			if (dirty & /*screenWidth*/ 1) {
    				toggle_class(div1, "width100", /*screenWidth*/ ctx[0] < 500);
    			}

    			if (dirty & /*gender*/ 16) set_data_dev(t6, /*gender*/ ctx[4]);

    			if (dirty & /*screenWidth*/ 1) {
    				toggle_class(div2, "width100", /*screenWidth*/ ctx[0] < 500);
    			}

    			if (dirty & /*species*/ 32) set_data_dev(t9, /*species*/ ctx[5]);

    			if (dirty & /*screenWidth*/ 1) {
    				toggle_class(div3, "width100", /*screenWidth*/ ctx[0] < 500);
    			}

    			if (dirty & /*race*/ 64) set_data_dev(t12, /*race*/ ctx[6]);

    			if (dirty & /*screenWidth*/ 1) {
    				toggle_class(div4, "width100", /*screenWidth*/ ctx[0] < 500);
    			}

    			if (dirty & /*screenWidth*/ 1) {
    				toggle_class(div5, "infomob", /*screenWidth*/ ctx[0] < 500);
    			}

    			if (dirty & /*screenWidth*/ 1) {
    				toggle_class(button0, "butmob", /*screenWidth*/ ctx[0] < 500);
    			}

    			if (dirty & /*screenWidth*/ 1) {
    				toggle_class(button1, "butmob", /*screenWidth*/ ctx[0] < 500);
    			}

    			if (dirty & /*screenWidth*/ 1) {
    				toggle_class(div6, "width100", /*screenWidth*/ ctx[0] < 500);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div0);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(div5);
    			if (detaching) detach_dev(t13);
    			if (detaching) detach_dev(div6);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block.name,
    		type: "if",
    		source: "(160:4) {#if isPetConfirmed}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$2(ctx) {
    	let div;

    	function select_block_type(ctx, dirty) {
    		if (/*isPetConfirmed*/ ctx[1]) return create_if_block;
    		return create_else_block;
    	}

    	let current_block_type = select_block_type(ctx);
    	let if_block = current_block_type(ctx);

    	const block = {
    		c: function create() {
    			div = element("div");
    			if_block.c();
    			attr_dev(div, "class", "pet flex svelte-1pgo299");
    			toggle_class(div, "petmob", /*screenWidth*/ ctx[0] < 500);
    			add_location(div, file$2, 158, 0, 4898);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			if_block.m(div, null);
    		},
    		p: function update(ctx, [dirty]) {
    			if (current_block_type === (current_block_type = select_block_type(ctx)) && if_block) {
    				if_block.p(ctx, dirty);
    			} else {
    				if_block.d(1);
    				if_block = current_block_type(ctx);

    				if (if_block) {
    					if_block.c();
    					if_block.m(div, null);
    				}
    			}

    			if (dirty & /*screenWidth*/ 1) {
    				toggle_class(div, "petmob", /*screenWidth*/ ctx[0] < 500);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
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

    function instance$2($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Pet', slots, []);
    	let { screenWidth } = $$props;
    	let { info = false } = $$props;
    	let { index } = $$props;
    	var isPetConfirmed = false;
    	var icon;
    	var name;
    	var gender;
    	var species;
    	var race;
    	var toModify = false;

    	tick().then(() => {
    		
    	});

    	const dispatch = createEventDispatcher();

    	const confirmed = () => {
    		$$invalidate(3, name = document.getElementById("name").value);
    		$$invalidate(4, gender = document.querySelector('input[name="gender"]:checked').value);
    		$$invalidate(5, species = document.getElementById("species").value);
    		$$invalidate(6, race = document.getElementById("race").value);

    		if (!name) {
    			let tmp = window.getComputedStyle(document.getElementById("namec")).getPropertyValue('border');
    			document.getElementById("namec").style.border = "4px solid red";

    			setTimeout(
    				function () {
    					console.log(tmp);
    					document.getElementById("namec").style.border = tmp;
    				},
    				3000
    			);
    		}

    		if (!race) {
    			let tmp = window.getComputedStyle(document.getElementById("racec")).getPropertyValue('border');
    			document.getElementById("racec").style.border = "4px solid red";

    			setTimeout(
    				function () {
    					document.getElementById("racec").style.border = tmp;
    				},
    				3000
    			);
    		}

    		if (name && race) {
    			$$invalidate(1, isPetConfirmed = true);

    			switch (species) {
    				case 'dog':
    					$$invalidate(2, icon = '🐕');
    					break;
    				case 'cat':
    					$$invalidate(2, icon = '🐈');
    					break;
    				case 'hamster':
    					$$invalidate(2, icon = '🐹');
    					break;
    				case 'mouse':
    					$$invalidate(2, icon = '🐀');
    					break;
    				case 'horse':
    					$$invalidate(2, icon = '🐎');
    					break;
    				case 'cow':
    					$$invalidate(2, icon = '🐄');
    					break;
    				case 'pig':
    					$$invalidate(2, icon = '🐖');
    					break;
    				case 'sheep':
    					$$invalidate(2, icon = '🐑');
    					break;
    				case 'goat':
    					$$invalidate(2, icon = '🐐');
    					break;
    				case 'birdie':
    					$$invalidate(2, icon = '🐦');
    					break;
    				case 'parrot':
    					$$invalidate(2, icon = '🦜');
    					break;
    				case 'owl':
    					$$invalidate(2, icon = '🦉');
    					break;
    				case 'bat':
    					$$invalidate(2, icon = '🦇');
    					break;
    				case 'fish':
    					$$invalidate(2, icon = '🐟');
    					break;
    				case 'frog':
    					$$invalidate(2, icon = '🐸');
    					break;
    				case 'turtle':
    					$$invalidate(2, icon = '🐢');
    					break;
    				case 'lizard':
    					$$invalidate(2, icon = '🦎');
    					break;
    				case 'snake':
    					$$invalidate(2, icon = '🐍');
    					break;
    				case 'ant':
    					$$invalidate(2, icon = '🐜');
    					break;
    				case 'bee':
    					$$invalidate(2, icon = '🐝');
    					break;
    				case 'spider':
    					$$invalidate(2, icon = '🕷️');
    					break;
    			}

    			if (toModify) {
    				$$invalidate(11, info.name = name, info);
    				$$invalidate(11, info.icon = icon, info);
    				$$invalidate(11, info.gender = gender, info);
    				$$invalidate(11, info.species = species, info);
    				$$invalidate(11, info.race = race, info);
    				let yep = true;
    				dispatch("petModified", { yep, info, index });
    			} else {
    				dispatch('petConfirmed', { name, icon, gender, species, race });
    			}
    		}
    	};

    	const modified = () => {
    		let yep = false;
    		dispatch("petModified", { yep });
    		toModify = true;
    		$$invalidate(1, isPetConfirmed = false);

    		tick().then(() => {
    			document.getElementById("name").value = info.name;
    			document.querySelector('input[value=' + info.gender + ']').checked = true;
    			document.getElementById("species").value = info.species;
    			document.getElementById("race").value = info.race;
    		});
    	};

    	const deleted = () => {
    		dispatch("petDeleted", { index });
    	};

    	const canceled = () => {
    		if (toModify) dispatch("petDeleted", { index }); else dispatch("petCancelled", { index });
    	};

    	if (info) {
    		name = info.name;
    		icon = info.icon;
    		gender = info.gender;
    		species = info.species;
    		race = info.race;
    		isPetConfirmed = true;
    	}

    	$$self.$$.on_mount.push(function () {
    		if (screenWidth === undefined && !('screenWidth' in $$props || $$self.$$.bound[$$self.$$.props['screenWidth']])) {
    			console_1$1.warn("<Pet> was created without expected prop 'screenWidth'");
    		}

    		if (index === undefined && !('index' in $$props || $$self.$$.bound[$$self.$$.props['index']])) {
    			console_1$1.warn("<Pet> was created without expected prop 'index'");
    		}
    	});

    	const writable_props = ['screenWidth', 'info', 'index'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1$1.warn(`<Pet> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('screenWidth' in $$props) $$invalidate(0, screenWidth = $$props.screenWidth);
    		if ('info' in $$props) $$invalidate(11, info = $$props.info);
    		if ('index' in $$props) $$invalidate(12, index = $$props.index);
    	};

    	$$self.$capture_state = () => ({
    		createEventDispatcher,
    		tick,
    		screenWidth,
    		info,
    		index,
    		isPetConfirmed,
    		icon,
    		name,
    		gender,
    		species,
    		race,
    		toModify,
    		dispatch,
    		confirmed,
    		modified,
    		deleted,
    		canceled
    	});

    	$$self.$inject_state = $$props => {
    		if ('screenWidth' in $$props) $$invalidate(0, screenWidth = $$props.screenWidth);
    		if ('info' in $$props) $$invalidate(11, info = $$props.info);
    		if ('index' in $$props) $$invalidate(12, index = $$props.index);
    		if ('isPetConfirmed' in $$props) $$invalidate(1, isPetConfirmed = $$props.isPetConfirmed);
    		if ('icon' in $$props) $$invalidate(2, icon = $$props.icon);
    		if ('name' in $$props) $$invalidate(3, name = $$props.name);
    		if ('gender' in $$props) $$invalidate(4, gender = $$props.gender);
    		if ('species' in $$props) $$invalidate(5, species = $$props.species);
    		if ('race' in $$props) $$invalidate(6, race = $$props.race);
    		if ('toModify' in $$props) toModify = $$props.toModify;
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		screenWidth,
    		isPetConfirmed,
    		icon,
    		name,
    		gender,
    		species,
    		race,
    		confirmed,
    		modified,
    		deleted,
    		canceled,
    		info,
    		index
    	];
    }

    class Pet extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$2, create_fragment$2, safe_not_equal, { screenWidth: 0, info: 11, index: 12 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Pet",
    			options,
    			id: create_fragment$2.name
    		});
    	}

    	get screenWidth() {
    		throw new Error("<Pet>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set screenWidth(value) {
    		throw new Error("<Pet>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get info() {
    		throw new Error("<Pet>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set info(value) {
    		throw new Error("<Pet>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get index() {
    		throw new Error("<Pet>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set index(value) {
    		throw new Error("<Pet>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    const storedPets = localStorage.getItem("mypets");
    const myPets = writable(storedPets || '[]');
    myPets.subscribe(value => {
        localStorage.setItem("mypets", value);
    });

    /* src\component\yourpets\YourPets.svelte generated by Svelte v3.53.1 */

    const { console: console_1 } = globals;
    const file$1 = "src\\component\\yourpets\\YourPets.svelte";

    function get_each_context(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[13] = list[i];
    	child_ctx[15] = i;
    	return child_ctx;
    }

    // (115:4) {#each Array(petCounter) as _, index (index)}
    function create_each_block(key_1, ctx) {
    	let first;
    	let pet;
    	let current;

    	pet = new Pet({
    			props: {
    				screenWidth: /*screenWidth*/ ctx[0],
    				info: /*petsList*/ ctx[1][/*index*/ ctx[15]],
    				index: /*index*/ ctx[15]
    			},
    			$$inline: true
    		});

    	pet.$on("petConfirmed", /*addPet*/ ctx[4]);
    	pet.$on("petModified", /*modifyPet*/ ctx[5]);
    	pet.$on("petDeleted", /*deletePet*/ ctx[7]);
    	pet.$on("petCancelled", /*cancelPet*/ ctx[6]);

    	const block = {
    		key: key_1,
    		first: null,
    		c: function create() {
    			first = empty();
    			create_component(pet.$$.fragment);
    			this.first = first;
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, first, anchor);
    			mount_component(pet, target, anchor);
    			current = true;
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			const pet_changes = {};
    			if (dirty & /*screenWidth*/ 1) pet_changes.screenWidth = /*screenWidth*/ ctx[0];
    			if (dirty & /*petsList, petCounter*/ 6) pet_changes.info = /*petsList*/ ctx[1][/*index*/ ctx[15]];
    			if (dirty & /*petCounter*/ 4) pet_changes.index = /*index*/ ctx[15];
    			pet.$set(pet_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(pet.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(pet.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(first);
    			destroy_component(pet, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block.name,
    		type: "each",
    		source: "(115:4) {#each Array(petCounter) as _, index (index)}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$1(ctx) {
    	let div1;
    	let div0;
    	let span0;
    	let t1;
    	let span1;
    	let t3;
    	let t4;
    	let div3;
    	let each_blocks = [];
    	let each_1_lookup = new Map();
    	let t5;
    	let div2;
    	let current;
    	let mounted;
    	let dispose;
    	let each_value = Array(/*petCounter*/ ctx[2]);
    	validate_each_argument(each_value);
    	const get_key = ctx => /*index*/ ctx[15];
    	validate_each_keys(ctx, each_value, get_each_context, get_key);

    	for (let i = 0; i < each_value.length; i += 1) {
    		let child_ctx = get_each_context(ctx, each_value, i);
    		let key = get_key(child_ctx);
    		each_1_lookup.set(key, each_blocks[i] = create_each_block(key, child_ctx));
    	}

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			div0 = element("div");
    			span0 = element("span");
    			span0.textContent = "Y";
    			t1 = text("OUR ");
    			span1 = element("span");
    			span1.textContent = "P";
    			t3 = text("ETS");
    			t4 = space();
    			div3 = element("div");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t5 = space();
    			div2 = element("div");
    			div2.textContent = "+";
    			attr_dev(span0, "class", "capital");
    			add_location(span0, file$1, 111, 65, 3022);
    			attr_dev(span1, "class", "capital");
    			add_location(span1, file$1, 111, 99, 3056);
    			attr_dev(div0, "class", "titlepage");
    			toggle_class(div0, "titlepagemob", /*screenWidth*/ ctx[0] < 500);
    			add_location(div0, file$1, 111, 4, 2961);
    			attr_dev(div1, "class", "container");
    			add_location(div1, file$1, 110, 0, 2932);
    			attr_dev(div2, "class", "add flex svelte-llnnhg");
    			add_location(div2, file$1, 118, 4, 3446);
    			attr_dev(div3, "class", "content container flex svelte-llnnhg");
    			add_location(div3, file$1, 113, 0, 3105);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			append_dev(div1, div0);
    			append_dev(div0, span0);
    			append_dev(div0, t1);
    			append_dev(div0, span1);
    			append_dev(div0, t3);
    			insert_dev(target, t4, anchor);
    			insert_dev(target, div3, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(div3, null);
    			}

    			append_dev(div3, t5);
    			append_dev(div3, div2);
    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(div2, "click", /*addForm*/ ctx[3], false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (!current || dirty & /*screenWidth*/ 1) {
    				toggle_class(div0, "titlepagemob", /*screenWidth*/ ctx[0] < 500);
    			}

    			if (dirty & /*screenWidth, petsList, Array, petCounter, addPet, modifyPet, deletePet, cancelPet*/ 247) {
    				each_value = Array(/*petCounter*/ ctx[2]);
    				validate_each_argument(each_value);
    				group_outros();
    				validate_each_keys(ctx, each_value, get_each_context, get_key);
    				each_blocks = update_keyed_each(each_blocks, dirty, get_key, 1, ctx, each_value, each_1_lookup, div3, outro_and_destroy_block, create_each_block, t5, get_each_context);
    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;

    			for (let i = 0; i < each_value.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			current = true;
    		},
    		o: function outro(local) {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);
    			if (detaching) detach_dev(t4);
    			if (detaching) detach_dev(div3);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].d();
    			}

    			mounted = false;
    			dispose();
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
    	let $myPets;
    	validate_store(myPets, 'myPets');
    	component_subscribe($$self, myPets, $$value => $$invalidate(10, $myPets = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('YourPets', slots, []);
    	var screenWidth = window.innerWidth;

    	window.addEventListener("resize", function (event) {
    		$$invalidate(0, screenWidth = window.innerWidth);
    	});

    	var petsList;
    	var petCounter = 0;
    	var petAdded;
    	var user;
    	let local = JSON.parse(localStorage.getItem("login"));

    	if (local.islogged) {
    		fetch('/db/element?id=' + local.id + '&collection=users', { method: 'GET' }).then(response => response.json()).then(data => {
    			user = data.result;
    			$$invalidate(1, petsList = data.result.pets);
    			$$invalidate(2, petCounter = petsList.length);
    			console.log(data);
    			petAdded = true;
    		});
    	} else {
    		petsList = JSON.parse($myPets);
    		petCounter = petsList.length;
    		petAdded = true;
    	}

    	const addForm = () => {
    		if (petAdded) {
    			$$invalidate(2, petCounter++, petCounter);
    			petAdded = false;
    		}
    	};

    	const addPet = event => {
    		let pet = {
    			name: event.detail.name,
    			icon: event.detail.icon,
    			gender: event.detail.gender,
    			species: event.detail.species,
    			race: event.detail.race
    		};

    		petsList.push(pet);
    		if (local.islogged) editUserDB(); else myPets.set(JSON.stringify(petsList));
    		petAdded = true;
    	};

    	const modifyPet = event => {
    		if (event.detail.yep) {
    			petAdded = true;
    			$$invalidate(1, petsList[event.detail.index] = event.detail.info, petsList);
    			if (local.islogged) editUserDB(); else myPets.set(JSON.stringify(petsList));
    		} else petAdded = false;
    	};

    	const cancelPet = event => {
    		$$invalidate(2, petCounter--, petCounter);
    		petAdded = true;
    	};

    	const deletePet = event => {
    		petsList.splice(event.detail.index, 1);
    		$$invalidate(2, petCounter--, petCounter);
    		if (local.islogged) editUserDB(); else myPets.set(JSON.stringify(petsList));
    		petAdded = true;
    	};

    	const editUserDB = () => {
    		let obj = {
    			collection: 'users',
    			elem: {
    				"_id": user._id,
    				"name": user.name,
    				"username": user.username,
    				"email": user.email,
    				"password": user.password,
    				"favorites": user.favorites,
    				"pets": petsList,
    				"score": user.score,
    				"admin": user.admin
    			}
    		};

    		fetch('/db/element', {
    			method: 'PUT',
    			headers: {
    				'Content-type': 'application/json',
    				'Accept': 'application/json'
    			},
    			body: JSON.stringify(obj)
    		});
    	};

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1.warn(`<YourPets> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		Pet,
    		myPets,
    		screenWidth,
    		petsList,
    		petCounter,
    		petAdded,
    		user,
    		local,
    		addForm,
    		addPet,
    		modifyPet,
    		cancelPet,
    		deletePet,
    		editUserDB,
    		$myPets
    	});

    	$$self.$inject_state = $$props => {
    		if ('screenWidth' in $$props) $$invalidate(0, screenWidth = $$props.screenWidth);
    		if ('petsList' in $$props) $$invalidate(1, petsList = $$props.petsList);
    		if ('petCounter' in $$props) $$invalidate(2, petCounter = $$props.petCounter);
    		if ('petAdded' in $$props) petAdded = $$props.petAdded;
    		if ('user' in $$props) user = $$props.user;
    		if ('local' in $$props) local = $$props.local;
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		screenWidth,
    		petsList,
    		petCounter,
    		addForm,
    		addPet,
    		modifyPet,
    		cancelPet,
    		deletePet
    	];
    }

    class YourPets extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$1, create_fragment$1, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "YourPets",
    			options,
    			id: create_fragment$1.name
    		});
    	}
    }

    const loginDefault = {
        islogged: false,
        id:""
    };

    const storedLogin = localStorage.getItem("login");
    const login = writable(storedLogin || JSON.stringify(loginDefault));
    login.subscribe(value => {
        localStorage.setItem("login", value);
    });

    /* src\App.svelte generated by Svelte v3.53.1 */
    const file = "src\\App.svelte";

    function create_fragment(ctx) {
    	let navbar;
    	let t0;
    	let switch_instance;
    	let t1;
    	let footer1;
    	let footer0;
    	let current;
    	navbar = new Navbar({ $$inline: true });
    	var switch_value = /*thispage*/ ctx[0];

    	function switch_props(ctx) {
    		return {
    			props: { params: /*params*/ ctx[1] },
    			$$inline: true
    		};
    	}

    	if (switch_value) {
    		switch_instance = construct_svelte_component_dev(switch_value, switch_props(ctx));
    	}

    	footer0 = new Footer({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(navbar.$$.fragment);
    			t0 = space();
    			if (switch_instance) create_component(switch_instance.$$.fragment);
    			t1 = space();
    			footer1 = element("footer");
    			create_component(footer0.$$.fragment);
    			attr_dev(footer1, "class", "svelte-s6vp3m");
    			add_location(footer1, file, 54, 0, 1539);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			mount_component(navbar, target, anchor);
    			insert_dev(target, t0, anchor);
    			if (switch_instance) mount_component(switch_instance, target, anchor);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, footer1, anchor);
    			mount_component(footer0, footer1, null);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const switch_instance_changes = {};
    			if (dirty & /*params*/ 2) switch_instance_changes.params = /*params*/ ctx[1];

    			if (switch_value !== (switch_value = /*thispage*/ ctx[0])) {
    				if (switch_instance) {
    					group_outros();
    					const old_component = switch_instance;

    					transition_out(old_component.$$.fragment, 1, 0, () => {
    						destroy_component(old_component, 1);
    					});

    					check_outros();
    				}

    				if (switch_value) {
    					switch_instance = construct_svelte_component_dev(switch_value, switch_props(ctx));
    					create_component(switch_instance.$$.fragment);
    					transition_in(switch_instance.$$.fragment, 1);
    					mount_component(switch_instance, t1.parentNode, t1);
    				} else {
    					switch_instance = null;
    				}
    			} else if (switch_value) {
    				switch_instance.$set(switch_instance_changes);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(navbar.$$.fragment, local);
    			if (switch_instance) transition_in(switch_instance.$$.fragment, local);
    			transition_in(footer0.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(navbar.$$.fragment, local);
    			if (switch_instance) transition_out(switch_instance.$$.fragment, local);
    			transition_out(footer0.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(navbar, detaching);
    			if (detaching) detach_dev(t0);
    			if (switch_instance) destroy_component(switch_instance, detaching);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(footer1);
    			destroy_component(footer0);
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
    	let $login;
    	validate_store(login, 'login');
    	component_subscribe($$self, login, $$value => $$invalidate(2, $login = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('App', slots, []);
    	let thispage;
    	let params;
    	page('/game', () => $$invalidate(0, thispage = Home));

    	page(
    		'/game/quiz/',
    		(ctx, next) => {
    			$$invalidate(1, params = ctx.params);
    			next();
    		},
    		() => $$invalidate(0, thispage = Quiz)
    	);

    	page(
    		'/game/wordle/',
    		(ctx, next) => {
    			$$invalidate(1, params = ctx.params);
    			next();
    		},
    		() => $$invalidate(0, thispage = Wordle)
    	);

    	page(
    		'/game/memory/',
    		(ctx, next) => {
    			$$invalidate(1, params = ctx.params);
    			next();
    		},
    		() => $$invalidate(0, thispage = Memory)
    	);

    	page(
    		'/game/animalinfo/',
    		(ctx, next) => {
    			$$invalidate(1, params = ctx.params);
    			next();
    		},
    		() => $$invalidate(0, thispage = AnimalInfo)
    	);

    	page(
    		'/game/funnyvideos/',
    		(ctx, next) => {
    			$$invalidate(1, params = ctx.params);
    			next();
    		},
    		() => $$invalidate(0, thispage = FunnyVideos)
    	);

    	page(
    		'/game/medinfo/',
    		(ctx, next) => {
    			$$invalidate(1, params = ctx.params);
    			next();
    		},
    		() => $$invalidate(0, thispage = MedInfo)
    	);

    	page(
    		'/game/yourpets/',
    		(ctx, next) => {
    			$$invalidate(1, params = ctx.params);
    			next();
    		},
    		() => $$invalidate(0, thispage = YourPets)
    	);

    	page.start();
    	let myLogin = JSON.parse($login);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<App> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		page,
    		Navbar,
    		Home,
    		Footer,
    		Quiz,
    		Wordle,
    		Memory,
    		AnimalInfo,
    		FunnyVideos,
    		MedInfo,
    		YourPets,
    		login,
    		thispage,
    		params,
    		myLogin,
    		$login
    	});

    	$$self.$inject_state = $$props => {
    		if ('thispage' in $$props) $$invalidate(0, thispage = $$props.thispage);
    		if ('params' in $$props) $$invalidate(1, params = $$props.params);
    		if ('myLogin' in $$props) myLogin = $$props.myLogin;
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [thispage, params];
    }

    class App extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance, create_fragment, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "App",
    			options,
    			id: create_fragment.name
    		});
    	}
    }

    const app = new App({
    	target: document.body,
    	props: {
    	}
    });

    return app;

})();
//# sourceMappingURL=bundle.js.map

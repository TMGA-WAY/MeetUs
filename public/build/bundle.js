
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
    function split_css_unit(value) {
        const split = typeof value === 'string' && value.match(/^\s*(-?[\d.]+)([^\s]*)\s*$/);
        return split ? [parseFloat(split[1]), split[2] || 'px'] : [value, 'px'];
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

    const globals = (typeof window !== 'undefined'
        ? window
        : typeof globalThis !== 'undefined'
            ? globalThis
            : global);
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
    function set_input_value(input, value) {
        input.value = value == null ? '' : value;
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
    function hash(str) {
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
        const name = `__svelte_${hash(rule)}_${uid}`;
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

    function create_animation(node, from, fn, params) {
        if (!from)
            return noop;
        const to = node.getBoundingClientRect();
        if (from.left === to.left && from.right === to.right && from.top === to.top && from.bottom === to.bottom)
            return noop;
        const { delay = 0, duration = 300, easing = identity, 
        // @ts-ignore todo: should this be separated from destructuring? Or start/end added to public api and documentation?
        start: start_time = now() + delay, 
        // @ts-ignore todo:
        end = start_time + duration, tick = noop, css } = fn(node, { from, to }, params);
        let running = true;
        let started = false;
        let name;
        function start() {
            if (css) {
                name = create_rule(node, 0, 1, duration, delay, easing, css);
            }
            if (!delay) {
                started = true;
            }
        }
        function stop() {
            if (css)
                delete_rule(node, name);
            running = false;
        }
        loop(now => {
            if (!started && now >= start_time) {
                started = true;
            }
            if (started && now >= end) {
                tick(1, 0);
                stop();
            }
            if (!running) {
                return false;
            }
            if (started) {
                const p = now - start_time;
                const t = 0 + 1 * easing(p / duration);
                tick(t, 1 - t);
            }
            return true;
        });
        start();
        tick(0, 1);
        return stop;
    }
    function fix_position(node) {
        const style = getComputedStyle(node);
        if (style.position !== 'absolute' && style.position !== 'fixed') {
            const { width, height } = style;
            const a = node.getBoundingClientRect();
            node.style.position = 'absolute';
            node.style.width = width;
            node.style.height = height;
            add_transform(node, a);
        }
    }
    function add_transform(node, a) {
        const b = node.getBoundingClientRect();
        if (a.left !== b.left || a.top !== b.top) {
            const style = getComputedStyle(node);
            const transform = style.transform === 'none' ? '' : style.transform;
            node.style.transform = `${transform} translate(${a.left - b.left}px, ${a.top - b.top}px)`;
        }
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
    // TODO figure out if we still want to support
    // shorthand events, or if we want to implement
    // a real bubbling mechanism
    function bubble(component, event) {
        const callbacks = component.$$.callbacks[event.type];
        if (callbacks) {
            // @ts-ignore
            callbacks.slice().forEach(fn => fn.call(this, event));
        }
    }

    const dirty_components = [];
    const binding_callbacks = [];
    let render_callbacks = [];
    const flush_callbacks = [];
    const resolved_promise = /* @__PURE__ */ Promise.resolve();
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
        // Do not reenter flush while dirty components are updated, as this can
        // result in an infinite loop. Instead, let the inner flush handle it.
        // Reentrancy is ok afterwards for bindings etc.
        if (flushidx !== 0) {
            return;
        }
        const saved_component = current_component;
        do {
            // first, call beforeUpdate functions
            // and update components
            try {
                while (flushidx < dirty_components.length) {
                    const component = dirty_components[flushidx];
                    flushidx++;
                    set_current_component(component);
                    update(component.$$);
                }
            }
            catch (e) {
                // reset dirty state to not end up in a deadlocked state and then rethrow
                dirty_components.length = 0;
                flushidx = 0;
                throw e;
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
    /**
     * Useful for example to execute remaining `afterUpdate` callbacks before executing `destroy`.
     */
    function flush_render_callbacks(fns) {
        const filtered = [];
        const targets = [];
        render_callbacks.forEach((c) => fns.indexOf(c) === -1 ? filtered.push(c) : targets.push(c));
        targets.forEach((c) => c());
        render_callbacks = filtered;
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
    function create_bidirectional_transition(node, fn, params, intro) {
        const options = { direction: 'both' };
        let config = fn(node, params, options);
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
                        config = config(options);
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
    function outro_and_destroy_block(block, lookup) {
        transition_out(block, 1, 1, () => {
            lookup.delete(block.key);
        });
    }
    function fix_and_outro_and_destroy_block(block, lookup) {
        block.f();
        outro_and_destroy_block(block, lookup);
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
        const updates = [];
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
                // defer updates until all the DOM shuffling is done
                updates.push(() => block.p(child_ctx, dirty));
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
        run_all(updates);
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
            flush_render_callbacks($$.after_update);
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
        document.dispatchEvent(custom_event(type, Object.assign({ version: '3.59.2' }, detail), { bubbles: true }));
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
    function listen_dev(node, event, handler, options, has_prevent_default, has_stop_propagation, has_stop_immediate_propagation) {
        const modifiers = options === true ? ['capture'] : options ? Array.from(Object.keys(options)) : [];
        if (has_prevent_default)
            modifiers.push('preventDefault');
        if (has_stop_propagation)
            modifiers.push('stopPropagation');
        if (has_stop_immediate_propagation)
            modifiers.push('stopImmediatePropagation');
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
        if (text.data === data)
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

    /* src\UI\Header.svelte generated by Svelte v3.59.2 */

    const file$c = "src\\UI\\Header.svelte";

    function create_fragment$c(ctx) {
    	let header;
    	let h1;

    	const block = {
    		c: function create() {
    			header = element("header");
    			h1 = element("h1");
    			h1.textContent = "MeetUs";
    			attr_dev(h1, "class", "svelte-5d4vfq");
    			add_location(h1, file$c, 22, 4, 447);
    			attr_dev(header, "class", "svelte-5d4vfq");
    			add_location(header, file$c, 21, 0, 433);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, header, anchor);
    			append_dev(header, h1);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(header);
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

    function instance$c($$self, $$props) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Header', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Header> was created with unknown prop '${key}'`);
    	});

    	return [];
    }

    class Header extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$c, create_fragment$c, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Header",
    			options,
    			id: create_fragment$c.name
    		});
    	}
    }

    /* src\UI\Button.svelte generated by Svelte v3.59.2 */

    const file$b = "src\\UI\\Button.svelte";

    // (11:0) {:else}
    function create_else_block$3(ctx) {
    	let button;
    	let button_class_value;
    	let current;
    	let mounted;
    	let dispose;
    	const default_slot_template = /*#slots*/ ctx[6].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[5], null);

    	const block = {
    		c: function create() {
    			button = element("button");
    			if (default_slot) default_slot.c();
    			attr_dev(button, "class", button_class_value = "" + (/*mode*/ ctx[2] + " " + /*color*/ ctx[3] + " svelte-vzf0dw"));
    			attr_dev(button, "type", /*type*/ ctx[0]);
    			button.disabled = /*disabled*/ ctx[4];
    			add_location(button, file$b, 11, 2, 217);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, button, anchor);

    			if (default_slot) {
    				default_slot.m(button, null);
    			}

    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(button, "click", /*click_handler*/ ctx[7], false, false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 32)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[5],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[5])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[5], dirty, null),
    						null
    					);
    				}
    			}

    			if (!current || dirty & /*mode, color*/ 12 && button_class_value !== (button_class_value = "" + (/*mode*/ ctx[2] + " " + /*color*/ ctx[3] + " svelte-vzf0dw"))) {
    				attr_dev(button, "class", button_class_value);
    			}

    			if (!current || dirty & /*type*/ 1) {
    				attr_dev(button, "type", /*type*/ ctx[0]);
    			}

    			if (!current || dirty & /*disabled*/ 16) {
    				prop_dev(button, "disabled", /*disabled*/ ctx[4]);
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
    			if (detaching) detach_dev(button);
    			if (default_slot) default_slot.d(detaching);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$3.name,
    		type: "else",
    		source: "(11:0) {:else}",
    		ctx
    	});

    	return block;
    }

    // (9:0) {#if href}
    function create_if_block$5(ctx) {
    	let a;
    	let current;
    	const default_slot_template = /*#slots*/ ctx[6].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[5], null);

    	const block = {
    		c: function create() {
    			a = element("a");
    			if (default_slot) default_slot.c();
    			attr_dev(a, "href", /*href*/ ctx[1]);
    			attr_dev(a, "class", "svelte-vzf0dw");
    			add_location(a, file$b, 9, 2, 182);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, a, anchor);

    			if (default_slot) {
    				default_slot.m(a, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 32)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[5],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[5])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[5], dirty, null),
    						null
    					);
    				}
    			}

    			if (!current || dirty & /*href*/ 2) {
    				attr_dev(a, "href", /*href*/ ctx[1]);
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
    			if (detaching) detach_dev(a);
    			if (default_slot) default_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$5.name,
    		type: "if",
    		source: "(9:0) {#if href}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$b(ctx) {
    	let current_block_type_index;
    	let if_block;
    	let if_block_anchor;
    	let current;
    	const if_block_creators = [create_if_block$5, create_else_block$3];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*href*/ ctx[1]) return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type(ctx);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	const block = {
    		c: function create() {
    			if_block.c();
    			if_block_anchor = empty();
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if_blocks[current_block_type_index].m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
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
    		id: create_fragment$b.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$b($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Button', slots, ['default']);
    	let { type = "button" } = $$props;
    	let { href = null } = $$props;
    	let { mode = null } = $$props;
    	let { color = null } = $$props;
    	let { disabled = false } = $$props;
    	const writable_props = ['type', 'href', 'mode', 'color', 'disabled'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Button> was created with unknown prop '${key}'`);
    	});

    	function click_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	$$self.$$set = $$props => {
    		if ('type' in $$props) $$invalidate(0, type = $$props.type);
    		if ('href' in $$props) $$invalidate(1, href = $$props.href);
    		if ('mode' in $$props) $$invalidate(2, mode = $$props.mode);
    		if ('color' in $$props) $$invalidate(3, color = $$props.color);
    		if ('disabled' in $$props) $$invalidate(4, disabled = $$props.disabled);
    		if ('$$scope' in $$props) $$invalidate(5, $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => ({ type, href, mode, color, disabled });

    	$$self.$inject_state = $$props => {
    		if ('type' in $$props) $$invalidate(0, type = $$props.type);
    		if ('href' in $$props) $$invalidate(1, href = $$props.href);
    		if ('mode' in $$props) $$invalidate(2, mode = $$props.mode);
    		if ('color' in $$props) $$invalidate(3, color = $$props.color);
    		if ('disabled' in $$props) $$invalidate(4, disabled = $$props.disabled);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [type, href, mode, color, disabled, $$scope, slots, click_handler];
    }

    class Button extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$b, create_fragment$b, safe_not_equal, {
    			type: 0,
    			href: 1,
    			mode: 2,
    			color: 3,
    			disabled: 4
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Button",
    			options,
    			id: create_fragment$b.name
    		});
    	}

    	get type() {
    		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set type(value) {
    		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get href() {
    		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set href(value) {
    		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get mode() {
    		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set mode(value) {
    		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get color() {
    		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set color(value) {
    		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get disabled() {
    		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set disabled(value) {
    		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\Meetups\MeetupFilter.svelte generated by Svelte v3.59.2 */
    const file$a = "src\\Meetups\\MeetupFilter.svelte";

    function create_fragment$a(ctx) {
    	let div;
    	let button0;
    	let t1;
    	let button1;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			div = element("div");
    			button0 = element("button");
    			button0.textContent = "All";
    			t1 = space();
    			button1 = element("button");
    			button1.textContent = "Favorite";
    			attr_dev(button0, "type", "button");
    			attr_dev(button0, "class", "svelte-wewm0q");
    			toggle_class(button0, "active", /*selectedButton*/ ctx[0] === 0);
    			add_location(button0, file$a, 8, 2, 157);
    			attr_dev(button1, "type", "button");
    			attr_dev(button1, "class", "svelte-wewm0q");
    			toggle_class(button1, "active", /*selectedButton*/ ctx[0] === 1);
    			add_location(button1, file$a, 16, 2, 333);
    			attr_dev(div, "class", "svelte-wewm0q");
    			add_location(div, file$a, 7, 0, 148);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, button0);
    			append_dev(div, t1);
    			append_dev(div, button1);

    			if (!mounted) {
    				dispose = [
    					listen_dev(button0, "click", /*click_handler*/ ctx[2], false, false, false, false),
    					listen_dev(button1, "click", /*click_handler_1*/ ctx[3], false, false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*selectedButton*/ 1) {
    				toggle_class(button0, "active", /*selectedButton*/ ctx[0] === 0);
    			}

    			if (dirty & /*selectedButton*/ 1) {
    				toggle_class(button1, "active", /*selectedButton*/ ctx[0] === 1);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			mounted = false;
    			run_all(dispose);
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

    function instance$a($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('MeetupFilter', slots, []);
    	const dispatch = createEventDispatcher();
    	let selectedButton = 0;
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<MeetupFilter> was created with unknown prop '${key}'`);
    	});

    	const click_handler = () => {
    		$$invalidate(0, selectedButton = 0);
    		dispatch("select", 0);
    	};

    	const click_handler_1 = () => {
    		$$invalidate(0, selectedButton = 1);
    		dispatch("select", 1);
    	};

    	$$self.$capture_state = () => ({
    		createEventDispatcher,
    		dispatch,
    		selectedButton
    	});

    	$$self.$inject_state = $$props => {
    		if ('selectedButton' in $$props) $$invalidate(0, selectedButton = $$props.selectedButton);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [selectedButton, dispatch, click_handler, click_handler_1];
    }

    class MeetupFilter extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$a, create_fragment$a, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "MeetupFilter",
    			options,
    			id: create_fragment$a.name
    		});
    	}
    }

    const subscriber_queue = [];
    /**
     * Create a `Writable` store that allows both updating and reading by subscription.
     * @param {*=}value initial value
     * @param {StartStopNotifier=} start
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
                if (subscribers.size === 0 && stop) {
                    stop();
                    stop = null;
                }
            };
        }
        return { set, update, subscribe };
    }

    const meetups = writable([]);

    const customMeetupsStore = {
      subscribe: meetups.subscribe,

      // set meetups to store
      setMeetups: (meetupArray) => {
        meetups.set(meetupArray);
      },

      // Adding meetups
      addMeetup: (meetupData) => {
        const newMeetup = {
          ...meetupData,
        };
        meetups.update((items) => {
          return [newMeetup, ...items];
        });
      },

      updateMeetup: (id, meetupData) => {
        meetups.update((items) => {
          const meetupIndex = items.findIndex((i) => i.id === id);
          const updatedMeetup = { ...items[meetupIndex], ...meetupData }; // get the item with index and replaced with meetupDate
          const updatedMeetups = [...items];
          updatedMeetups[meetupIndex] = updatedMeetup;
          return updatedMeetups;
        });
      },

      toggleFavorite: (id) => {
        meetups.update((items) => {
          const updatedMeetup = { ...items.find((m) => m.id === id) };
          // Toggle isFavorite
          updatedMeetup.isFavorite = !updatedMeetup.isFavorite;
          const meetupIndex = items.findIndex((m) => m.id === id);
          const updatedMeetups = [...items];
          updatedMeetups[meetupIndex] = updatedMeetup;
          return updatedMeetups;
        });
      },
      deleteMeetup: (id) => {
        meetups.update((items) => {
          const updatedMeetup = items.filter((i) => i.id !== id);
          return updatedMeetup;
        });
      },
    };

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
        const [xValue, xUnit] = split_css_unit(x);
        const [yValue, yUnit] = split_css_unit(y);
        return {
            delay,
            duration,
            easing,
            css: (t, u) => `
			transform: ${transform} translate(${(1 - t) * xValue}${xUnit}, ${(1 - t) * yValue}${yUnit});
			opacity: ${target_opacity - (od * u)}`
        };
    }
    function slide(node, { delay = 0, duration = 400, easing = cubicOut, axis = 'y' } = {}) {
        const style = getComputedStyle(node);
        const opacity = +style.opacity;
        const primary_property = axis === 'y' ? 'height' : 'width';
        const primary_property_value = parseFloat(style[primary_property]);
        const secondary_properties = axis === 'y' ? ['top', 'bottom'] : ['left', 'right'];
        const capitalized_secondary_properties = secondary_properties.map((e) => `${e[0].toUpperCase()}${e.slice(1)}`);
        const padding_start_value = parseFloat(style[`padding${capitalized_secondary_properties[0]}`]);
        const padding_end_value = parseFloat(style[`padding${capitalized_secondary_properties[1]}`]);
        const margin_start_value = parseFloat(style[`margin${capitalized_secondary_properties[0]}`]);
        const margin_end_value = parseFloat(style[`margin${capitalized_secondary_properties[1]}`]);
        const border_width_start_value = parseFloat(style[`border${capitalized_secondary_properties[0]}Width`]);
        const border_width_end_value = parseFloat(style[`border${capitalized_secondary_properties[1]}Width`]);
        return {
            delay,
            duration,
            easing,
            css: t => 'overflow: hidden;' +
                `opacity: ${Math.min(t * 20, 1) * opacity};` +
                `${primary_property}: ${t * primary_property_value}px;` +
                `padding-${secondary_properties[0]}: ${t * padding_start_value}px;` +
                `padding-${secondary_properties[1]}: ${t * padding_end_value}px;` +
                `margin-${secondary_properties[0]}: ${t * margin_start_value}px;` +
                `margin-${secondary_properties[1]}: ${t * margin_end_value}px;` +
                `border-${secondary_properties[0]}-width: ${t * border_width_start_value}px;` +
                `border-${secondary_properties[1]}-width: ${t * border_width_end_value}px;`
        };
    }
    function scale(node, { delay = 0, duration = 400, easing = cubicOut, start = 0, opacity = 0 } = {}) {
        const style = getComputedStyle(node);
        const target_opacity = +style.opacity;
        const transform = style.transform === 'none' ? '' : style.transform;
        const sd = 1 - start;
        const od = target_opacity * (1 - opacity);
        return {
            delay,
            duration,
            easing,
            css: (_t, u) => `
			transform: ${transform} scale(${1 - (sd * u)});
			opacity: ${target_opacity - (od * u)}
		`
        };
    }

    /* src\UI\Badge.svelte generated by Svelte v3.59.2 */
    const file$9 = "src\\UI\\Badge.svelte";

    function create_fragment$9(ctx) {
    	let span;
    	let span_transition;
    	let current;
    	const default_slot_template = /*#slots*/ ctx[1].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[0], null);

    	const block = {
    		c: function create() {
    			span = element("span");
    			if (default_slot) default_slot.c();
    			attr_dev(span, "class", "svelte-18dcboe");
    			add_location(span, file$9, 4, 0, 69);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, span, anchor);

    			if (default_slot) {
    				default_slot.m(span, null);
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

    			add_render_callback(() => {
    				if (!current) return;
    				if (!span_transition) span_transition = create_bidirectional_transition(span, slide, {}, true);
    				span_transition.run(1);
    			});

    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			if (!span_transition) span_transition = create_bidirectional_transition(span, slide, {}, false);
    			span_transition.run(0);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(span);
    			if (default_slot) default_slot.d(detaching);
    			if (detaching && span_transition) span_transition.end();
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
    	validate_slots('Badge', slots, ['default']);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Badge> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('$$scope' in $$props) $$invalidate(0, $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => ({ slide });
    	return [$$scope, slots];
    }

    class Badge extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$9, create_fragment$9, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Badge",
    			options,
    			id: create_fragment$9.name
    		});
    	}
    }

    /* src\UI\LoadingSpinner.svelte generated by Svelte v3.59.2 */

    const file$8 = "src\\UI\\LoadingSpinner.svelte";

    function create_fragment$8(ctx) {
    	let div3;
    	let div2;
    	let div0;
    	let t;
    	let div1;

    	const block = {
    		c: function create() {
    			div3 = element("div");
    			div2 = element("div");
    			div0 = element("div");
    			t = space();
    			div1 = element("div");
    			attr_dev(div0, "class", "svelte-127gjzm");
    			add_location(div0, file$8, 6, 4, 119);
    			attr_dev(div1, "class", "svelte-127gjzm");
    			add_location(div1, file$8, 7, 4, 136);
    			attr_dev(div2, "class", "lds-ripple svelte-127gjzm");
    			add_location(div2, file$8, 5, 2, 89);
    			attr_dev(div3, "class", "loading svelte-127gjzm");
    			add_location(div3, file$8, 4, 0, 64);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div3, anchor);
    			append_dev(div3, div2);
    			append_dev(div2, div0);
    			append_dev(div2, t);
    			append_dev(div2, div1);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div3);
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

    function instance$8($$self, $$props) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('LoadingSpinner', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<LoadingSpinner> was created with unknown prop '${key}'`);
    	});

    	return [];
    }

    class LoadingSpinner extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$8, create_fragment$8, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "LoadingSpinner",
    			options,
    			id: create_fragment$8.name
    		});
    	}
    }

    /* src\Meetups\MeetupItem.svelte generated by Svelte v3.59.2 */

    const { Error: Error_1$3, console: console_1$3 } = globals;
    const file$7 = "src\\Meetups\\MeetupItem.svelte";

    // (49:6) {#if isFav}
    function create_if_block_1$2(ctx) {
    	let badge;
    	let current;

    	badge = new Badge({
    			props: {
    				$$slots: { default: [create_default_slot_3$1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(badge.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(badge, target, anchor);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(badge.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(badge.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(badge, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$2.name,
    		type: "if",
    		source: "(49:6) {#if isFav}",
    		ctx
    	});

    	return block;
    }

    // (50:8) <Badge>
    function create_default_slot_3$1(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Favorite");
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
    		id: create_default_slot_3$1.name,
    		type: "slot",
    		source: "(50:8) <Badge>",
    		ctx
    	});

    	return block;
    }

    // (67:4) <Button mode="outline" type="button" on:click={() => dispatch("edit", id)}        >
    function create_default_slot_2$1(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Edit");
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
    		id: create_default_slot_2$1.name,
    		type: "slot",
    		source: "(67:4) <Button mode=\\\"outline\\\" type=\\\"button\\\" on:click={() => dispatch(\\\"edit\\\", id)}        >",
    		ctx
    	});

    	return block;
    }

    // (74:4) {:else}
    function create_else_block$2(ctx) {
    	let button;
    	let current;

    	button = new Button({
    			props: {
    				mode: "outline",
    				color: /*isFav*/ ctx[6] ? null : "success",
    				type: "button",
    				$$slots: { default: [create_default_slot_1$2] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	button.$on("click", /*toogleFavorite*/ ctx[9]);

    	const block = {
    		c: function create() {
    			create_component(button.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(button, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const button_changes = {};
    			if (dirty & /*isFav*/ 64) button_changes.color = /*isFav*/ ctx[6] ? null : "success";

    			if (dirty & /*$$scope, isFav*/ 8256) {
    				button_changes.$$scope = { dirty, ctx };
    			}

    			button.$set(button_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(button.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(button.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(button, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$2.name,
    		type: "else",
    		source: "(74:4) {:else}",
    		ctx
    	});

    	return block;
    }

    // (71:4) {#if isLoading}
    function create_if_block$4(ctx) {
    	let span;

    	const block = {
    		c: function create() {
    			span = element("span");
    			span.textContent = "Changing ....";
    			add_location(span, file$7, 72, 6, 1697);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, span, anchor);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(span);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$4.name,
    		type: "if",
    		source: "(71:4) {#if isLoading}",
    		ctx
    	});

    	return block;
    }

    // (75:6) <Button          mode="outline"          color={isFav ? null : "success"}          type="button"          on:click={toogleFavorite}>
    function create_default_slot_1$2(ctx) {
    	let t_value = (/*isFav*/ ctx[6] ? "Unfavorite" : "Favorite") + "";
    	let t;

    	const block = {
    		c: function create() {
    			t = text(t_value);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*isFav*/ 64 && t_value !== (t_value = (/*isFav*/ ctx[6] ? "Unfavorite" : "Favorite") + "")) set_data_dev(t, t_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_1$2.name,
    		type: "slot",
    		source: "(75:6) <Button          mode=\\\"outline\\\"          color={isFav ? null : \\\"success\\\"}          type=\\\"button\\\"          on:click={toogleFavorite}>",
    		ctx
    	});

    	return block;
    }

    // (83:4) <Button type="button" on:click={() => dispatch("showdetails", id)}        >
    function create_default_slot$5(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Show Deatils");
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
    		id: create_default_slot$5.name,
    		type: "slot",
    		source: "(83:4) <Button type=\\\"button\\\" on:click={() => dispatch(\\\"showdetails\\\", id)}        >",
    		ctx
    	});

    	return block;
    }

    function create_fragment$7(ctx) {
    	let article;
    	let header;
    	let h1;
    	let t0;
    	let t1;
    	let t2;
    	let h2;
    	let t3;
    	let t4;
    	let p0;
    	let t5;
    	let t6;
    	let div0;
    	let img;
    	let img_src_value;
    	let t7;
    	let div1;
    	let p1;
    	let t8;
    	let t9;
    	let footer;
    	let button0;
    	let t10;
    	let current_block_type_index;
    	let if_block1;
    	let t11;
    	let button1;
    	let current;
    	let if_block0 = /*isFav*/ ctx[6] && create_if_block_1$2(ctx);

    	button0 = new Button({
    			props: {
    				mode: "outline",
    				type: "button",
    				$$slots: { default: [create_default_slot_2$1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	button0.$on("click", /*click_handler*/ ctx[11]);
    	const if_block_creators = [create_if_block$4, create_else_block$2];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*isLoading*/ ctx[7]) return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type(ctx);
    	if_block1 = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	button1 = new Button({
    			props: {
    				type: "button",
    				$$slots: { default: [create_default_slot$5] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	button1.$on("click", /*click_handler_1*/ ctx[12]);

    	const block = {
    		c: function create() {
    			article = element("article");
    			header = element("header");
    			h1 = element("h1");
    			t0 = text(/*title*/ ctx[1]);
    			t1 = space();
    			if (if_block0) if_block0.c();
    			t2 = space();
    			h2 = element("h2");
    			t3 = text(/*subtitle*/ ctx[2]);
    			t4 = space();
    			p0 = element("p");
    			t5 = text(/*address*/ ctx[5]);
    			t6 = space();
    			div0 = element("div");
    			img = element("img");
    			t7 = space();
    			div1 = element("div");
    			p1 = element("p");
    			t8 = text(/*description*/ ctx[4]);
    			t9 = space();
    			footer = element("footer");
    			create_component(button0.$$.fragment);
    			t10 = space();
    			if_block1.c();
    			t11 = space();
    			create_component(button1.$$.fragment);
    			attr_dev(h1, "class", "svelte-9nxog3");
    			add_location(h1, file$7, 46, 4, 1157);
    			attr_dev(h2, "class", "svelte-9nxog3");
    			add_location(h2, file$7, 52, 4, 1258);
    			attr_dev(p0, "class", "svelte-9nxog3");
    			add_location(p0, file$7, 53, 4, 1283);
    			attr_dev(header, "class", "svelte-9nxog3");
    			add_location(header, file$7, 45, 2, 1143);
    			if (!src_url_equal(img.src, img_src_value = /*imageUrl*/ ctx[3])) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", /*title*/ ctx[1]);
    			attr_dev(img, "class", "svelte-9nxog3");
    			add_location(img, file$7, 57, 4, 1343);
    			attr_dev(div0, "class", "image svelte-9nxog3");
    			add_location(div0, file$7, 56, 2, 1318);
    			attr_dev(p1, "class", "svelte-9nxog3");
    			add_location(p1, file$7, 61, 4, 1420);
    			attr_dev(div1, "class", "content svelte-9nxog3");
    			add_location(div1, file$7, 60, 2, 1393);
    			attr_dev(footer, "class", "svelte-9nxog3");
    			add_location(footer, file$7, 64, 2, 1456);
    			attr_dev(article, "class", "svelte-9nxog3");
    			add_location(article, file$7, 44, 0, 1130);
    		},
    		l: function claim(nodes) {
    			throw new Error_1$3("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, article, anchor);
    			append_dev(article, header);
    			append_dev(header, h1);
    			append_dev(h1, t0);
    			append_dev(h1, t1);
    			if (if_block0) if_block0.m(h1, null);
    			append_dev(header, t2);
    			append_dev(header, h2);
    			append_dev(h2, t3);
    			append_dev(header, t4);
    			append_dev(header, p0);
    			append_dev(p0, t5);
    			append_dev(article, t6);
    			append_dev(article, div0);
    			append_dev(div0, img);
    			append_dev(article, t7);
    			append_dev(article, div1);
    			append_dev(div1, p1);
    			append_dev(p1, t8);
    			append_dev(article, t9);
    			append_dev(article, footer);
    			mount_component(button0, footer, null);
    			append_dev(footer, t10);
    			if_blocks[current_block_type_index].m(footer, null);
    			append_dev(footer, t11);
    			mount_component(button1, footer, null);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (!current || dirty & /*title*/ 2) set_data_dev(t0, /*title*/ ctx[1]);

    			if (/*isFav*/ ctx[6]) {
    				if (if_block0) {
    					if (dirty & /*isFav*/ 64) {
    						transition_in(if_block0, 1);
    					}
    				} else {
    					if_block0 = create_if_block_1$2(ctx);
    					if_block0.c();
    					transition_in(if_block0, 1);
    					if_block0.m(h1, null);
    				}
    			} else if (if_block0) {
    				group_outros();

    				transition_out(if_block0, 1, 1, () => {
    					if_block0 = null;
    				});

    				check_outros();
    			}

    			if (!current || dirty & /*subtitle*/ 4) set_data_dev(t3, /*subtitle*/ ctx[2]);
    			if (!current || dirty & /*address*/ 32) set_data_dev(t5, /*address*/ ctx[5]);

    			if (!current || dirty & /*imageUrl*/ 8 && !src_url_equal(img.src, img_src_value = /*imageUrl*/ ctx[3])) {
    				attr_dev(img, "src", img_src_value);
    			}

    			if (!current || dirty & /*title*/ 2) {
    				attr_dev(img, "alt", /*title*/ ctx[1]);
    			}

    			if (!current || dirty & /*description*/ 16) set_data_dev(t8, /*description*/ ctx[4]);
    			const button0_changes = {};

    			if (dirty & /*$$scope*/ 8192) {
    				button0_changes.$$scope = { dirty, ctx };
    			}

    			button0.$set(button0_changes);
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
    				if_block1 = if_blocks[current_block_type_index];

    				if (!if_block1) {
    					if_block1 = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block1.c();
    				} else {
    					if_block1.p(ctx, dirty);
    				}

    				transition_in(if_block1, 1);
    				if_block1.m(footer, t11);
    			}

    			const button1_changes = {};

    			if (dirty & /*$$scope*/ 8192) {
    				button1_changes.$$scope = { dirty, ctx };
    			}

    			button1.$set(button1_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block0);
    			transition_in(button0.$$.fragment, local);
    			transition_in(if_block1);
    			transition_in(button1.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block0);
    			transition_out(button0.$$.fragment, local);
    			transition_out(if_block1);
    			transition_out(button1.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(article);
    			if (if_block0) if_block0.d();
    			destroy_component(button0);
    			if_blocks[current_block_type_index].d();
    			destroy_component(button1);
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
    	validate_slots('MeetupItem', slots, []);
    	let { id } = $$props;
    	let { title } = $$props;
    	let { subtitle } = $$props;
    	let { imageUrl } = $$props;
    	let { description } = $$props;
    	let { address } = $$props;
    	let { email } = $$props;
    	let { isFav } = $$props;
    	let isLoading = false;
    	const dispatch = createEventDispatcher();

    	function toogleFavorite() {
    		$$invalidate(7, isLoading = true);

    		fetch(`https://myapplicationproject-9ac7c.firebaseio.com/meetups/${id}.json`, {
    			method: "PATCH",
    			body: JSON.stringify({ isFavorite: !isFav }),
    			headers: { "Content-Type": "application/json" }
    		}).then(res => {
    			if (!res.ok) {
    				throw new Error("An error ocurred, please try again !");
    			}

    			$$invalidate(7, isLoading = false);
    			customMeetupsStore.toggleFavorite(id);
    		}).catch(err => {
    			$$invalidate(7, isLoading = false);
    			console.log(err);
    		});
    	}

    	$$self.$$.on_mount.push(function () {
    		if (id === undefined && !('id' in $$props || $$self.$$.bound[$$self.$$.props['id']])) {
    			console_1$3.warn("<MeetupItem> was created without expected prop 'id'");
    		}

    		if (title === undefined && !('title' in $$props || $$self.$$.bound[$$self.$$.props['title']])) {
    			console_1$3.warn("<MeetupItem> was created without expected prop 'title'");
    		}

    		if (subtitle === undefined && !('subtitle' in $$props || $$self.$$.bound[$$self.$$.props['subtitle']])) {
    			console_1$3.warn("<MeetupItem> was created without expected prop 'subtitle'");
    		}

    		if (imageUrl === undefined && !('imageUrl' in $$props || $$self.$$.bound[$$self.$$.props['imageUrl']])) {
    			console_1$3.warn("<MeetupItem> was created without expected prop 'imageUrl'");
    		}

    		if (description === undefined && !('description' in $$props || $$self.$$.bound[$$self.$$.props['description']])) {
    			console_1$3.warn("<MeetupItem> was created without expected prop 'description'");
    		}

    		if (address === undefined && !('address' in $$props || $$self.$$.bound[$$self.$$.props['address']])) {
    			console_1$3.warn("<MeetupItem> was created without expected prop 'address'");
    		}

    		if (email === undefined && !('email' in $$props || $$self.$$.bound[$$self.$$.props['email']])) {
    			console_1$3.warn("<MeetupItem> was created without expected prop 'email'");
    		}

    		if (isFav === undefined && !('isFav' in $$props || $$self.$$.bound[$$self.$$.props['isFav']])) {
    			console_1$3.warn("<MeetupItem> was created without expected prop 'isFav'");
    		}
    	});

    	const writable_props = [
    		'id',
    		'title',
    		'subtitle',
    		'imageUrl',
    		'description',
    		'address',
    		'email',
    		'isFav'
    	];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1$3.warn(`<MeetupItem> was created with unknown prop '${key}'`);
    	});

    	const click_handler = () => dispatch("edit", id);
    	const click_handler_1 = () => dispatch("showdetails", id);

    	$$self.$$set = $$props => {
    		if ('id' in $$props) $$invalidate(0, id = $$props.id);
    		if ('title' in $$props) $$invalidate(1, title = $$props.title);
    		if ('subtitle' in $$props) $$invalidate(2, subtitle = $$props.subtitle);
    		if ('imageUrl' in $$props) $$invalidate(3, imageUrl = $$props.imageUrl);
    		if ('description' in $$props) $$invalidate(4, description = $$props.description);
    		if ('address' in $$props) $$invalidate(5, address = $$props.address);
    		if ('email' in $$props) $$invalidate(10, email = $$props.email);
    		if ('isFav' in $$props) $$invalidate(6, isFav = $$props.isFav);
    	};

    	$$self.$capture_state = () => ({
    		meetups: customMeetupsStore,
    		Button,
    		Badge,
    		createEventDispatcher,
    		LoadingSpinner,
    		id,
    		title,
    		subtitle,
    		imageUrl,
    		description,
    		address,
    		email,
    		isFav,
    		isLoading,
    		dispatch,
    		toogleFavorite
    	});

    	$$self.$inject_state = $$props => {
    		if ('id' in $$props) $$invalidate(0, id = $$props.id);
    		if ('title' in $$props) $$invalidate(1, title = $$props.title);
    		if ('subtitle' in $$props) $$invalidate(2, subtitle = $$props.subtitle);
    		if ('imageUrl' in $$props) $$invalidate(3, imageUrl = $$props.imageUrl);
    		if ('description' in $$props) $$invalidate(4, description = $$props.description);
    		if ('address' in $$props) $$invalidate(5, address = $$props.address);
    		if ('email' in $$props) $$invalidate(10, email = $$props.email);
    		if ('isFav' in $$props) $$invalidate(6, isFav = $$props.isFav);
    		if ('isLoading' in $$props) $$invalidate(7, isLoading = $$props.isLoading);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		id,
    		title,
    		subtitle,
    		imageUrl,
    		description,
    		address,
    		isFav,
    		isLoading,
    		dispatch,
    		toogleFavorite,
    		email,
    		click_handler,
    		click_handler_1
    	];
    }

    class MeetupItem extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$7, create_fragment$7, safe_not_equal, {
    			id: 0,
    			title: 1,
    			subtitle: 2,
    			imageUrl: 3,
    			description: 4,
    			address: 5,
    			email: 10,
    			isFav: 6
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "MeetupItem",
    			options,
    			id: create_fragment$7.name
    		});
    	}

    	get id() {
    		throw new Error_1$3("<MeetupItem>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set id(value) {
    		throw new Error_1$3("<MeetupItem>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get title() {
    		throw new Error_1$3("<MeetupItem>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set title(value) {
    		throw new Error_1$3("<MeetupItem>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get subtitle() {
    		throw new Error_1$3("<MeetupItem>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set subtitle(value) {
    		throw new Error_1$3("<MeetupItem>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get imageUrl() {
    		throw new Error_1$3("<MeetupItem>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set imageUrl(value) {
    		throw new Error_1$3("<MeetupItem>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get description() {
    		throw new Error_1$3("<MeetupItem>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set description(value) {
    		throw new Error_1$3("<MeetupItem>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get address() {
    		throw new Error_1$3("<MeetupItem>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set address(value) {
    		throw new Error_1$3("<MeetupItem>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get email() {
    		throw new Error_1$3("<MeetupItem>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set email(value) {
    		throw new Error_1$3("<MeetupItem>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get isFav() {
    		throw new Error_1$3("<MeetupItem>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set isFav(value) {
    		throw new Error_1$3("<MeetupItem>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    function flip(node, { from, to }, params = {}) {
        const style = getComputedStyle(node);
        const transform = style.transform === 'none' ? '' : style.transform;
        const [ox, oy] = style.transformOrigin.split(' ').map(parseFloat);
        const dx = (from.left + from.width * ox / to.width) - (to.left + ox);
        const dy = (from.top + from.height * oy / to.height) - (to.top + oy);
        const { delay = 0, duration = (d) => Math.sqrt(d) * 120, easing = cubicOut } = params;
        return {
            delay,
            duration: is_function(duration) ? duration(Math.sqrt(dx * dx + dy * dy)) : duration,
            easing,
            css: (t, u) => {
                const x = u * dx;
                const y = u * dy;
                const sx = t + u * from.width / to.width;
                const sy = t + u * from.height / to.height;
                return `transform: ${transform} translate(${x}px, ${y}px) scale(${sx}, ${sy});`;
            }
        };
    }

    /* src\Meetups\MeetupGrid.svelte generated by Svelte v3.59.2 */
    const file$6 = "src\\Meetups\\MeetupGrid.svelte";

    function get_each_context(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[8] = list[i];
    	return child_ctx;
    }

    // (22:2) <Button on:click={() => dispatch("add")}>
    function create_default_slot$4(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("New Meetup");
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
    		id: create_default_slot$4.name,
    		type: "slot",
    		source: "(22:2) <Button on:click={() => dispatch(\\\"add\\\")}>",
    		ctx
    	});

    	return block;
    }

    // (25:0) {#if filteredMeetups.length === 0}
    function create_if_block$3(ctx) {
    	let p;

    	const block = {
    		c: function create() {
    			p = element("p");
    			p.textContent = "No meetups found, you can start adding some.";
    			attr_dev(p, "id", "no-meetups");
    			add_location(p, file$6, 25, 2, 752);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, p, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(p);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$3.name,
    		type: "if",
    		source: "(25:0) {#if filteredMeetups.length === 0}",
    		ctx
    	});

    	return block;
    }

    // (30:2) {#each filteredMeetups as meetup (meetup.id)}
    function create_each_block(key_1, ctx) {
    	let div;
    	let meetupitem;
    	let t;
    	let div_transition;
    	let rect;
    	let stop_animation = noop;
    	let current;

    	meetupitem = new MeetupItem({
    			props: {
    				id: /*meetup*/ ctx[8].id,
    				title: /*meetup*/ ctx[8].title,
    				subtitle: /*meetup*/ ctx[8].subtitle,
    				imageUrl: /*meetup*/ ctx[8].imageUrl,
    				address: /*meetup*/ ctx[8].address,
    				description: /*meetup*/ ctx[8].description,
    				email: /*meetup*/ ctx[8].contactEmail,
    				isFav: /*meetup*/ ctx[8].isFavorite
    			},
    			$$inline: true
    		});

    	meetupitem.$on("showdetails", /*showdetails_handler*/ ctx[6]);
    	meetupitem.$on("edit", /*edit_handler*/ ctx[7]);

    	const block = {
    		key: key_1,
    		first: null,
    		c: function create() {
    			div = element("div");
    			create_component(meetupitem.$$.fragment);
    			t = space();
    			add_location(div, file$6, 30, 4, 907);
    			this.first = div;
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			mount_component(meetupitem, div, null);
    			append_dev(div, t);
    			current = true;
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			const meetupitem_changes = {};
    			if (dirty & /*filteredMeetups*/ 1) meetupitem_changes.id = /*meetup*/ ctx[8].id;
    			if (dirty & /*filteredMeetups*/ 1) meetupitem_changes.title = /*meetup*/ ctx[8].title;
    			if (dirty & /*filteredMeetups*/ 1) meetupitem_changes.subtitle = /*meetup*/ ctx[8].subtitle;
    			if (dirty & /*filteredMeetups*/ 1) meetupitem_changes.imageUrl = /*meetup*/ ctx[8].imageUrl;
    			if (dirty & /*filteredMeetups*/ 1) meetupitem_changes.address = /*meetup*/ ctx[8].address;
    			if (dirty & /*filteredMeetups*/ 1) meetupitem_changes.description = /*meetup*/ ctx[8].description;
    			if (dirty & /*filteredMeetups*/ 1) meetupitem_changes.email = /*meetup*/ ctx[8].contactEmail;
    			if (dirty & /*filteredMeetups*/ 1) meetupitem_changes.isFav = /*meetup*/ ctx[8].isFavorite;
    			meetupitem.$set(meetupitem_changes);
    		},
    		r: function measure() {
    			rect = div.getBoundingClientRect();
    		},
    		f: function fix() {
    			fix_position(div);
    			stop_animation();
    			add_transform(div, rect);
    		},
    		a: function animate() {
    			stop_animation();
    			stop_animation = create_animation(div, rect, flip, { duration: 300 });
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(meetupitem.$$.fragment, local);

    			add_render_callback(() => {
    				if (!current) return;
    				if (!div_transition) div_transition = create_bidirectional_transition(div, scale, {}, true);
    				div_transition.run(1);
    			});

    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(meetupitem.$$.fragment, local);
    			if (!div_transition) div_transition = create_bidirectional_transition(div, scale, {}, false);
    			div_transition.run(0);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_component(meetupitem);
    			if (detaching && div_transition) div_transition.end();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block.name,
    		type: "each",
    		source: "(30:2) {#each filteredMeetups as meetup (meetup.id)}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$6(ctx) {
    	let section0;
    	let meetupfilter;
    	let t0;
    	let button;
    	let t1;
    	let t2;
    	let section1;
    	let each_blocks = [];
    	let each_1_lookup = new Map();
    	let current;
    	meetupfilter = new MeetupFilter({ $$inline: true });
    	meetupfilter.$on("select", /*setFilter*/ ctx[2]);

    	button = new Button({
    			props: {
    				$$slots: { default: [create_default_slot$4] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	button.$on("click", /*click_handler*/ ctx[5]);
    	let if_block = /*filteredMeetups*/ ctx[0].length === 0 && create_if_block$3(ctx);
    	let each_value = /*filteredMeetups*/ ctx[0];
    	validate_each_argument(each_value);
    	const get_key = ctx => /*meetup*/ ctx[8].id;
    	validate_each_keys(ctx, each_value, get_each_context, get_key);

    	for (let i = 0; i < each_value.length; i += 1) {
    		let child_ctx = get_each_context(ctx, each_value, i);
    		let key = get_key(child_ctx);
    		each_1_lookup.set(key, each_blocks[i] = create_each_block(key, child_ctx));
    	}

    	const block = {
    		c: function create() {
    			section0 = element("section");
    			create_component(meetupfilter.$$.fragment);
    			t0 = space();
    			create_component(button.$$.fragment);
    			t1 = space();
    			if (if_block) if_block.c();
    			t2 = space();
    			section1 = element("section");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr_dev(section0, "class", "meetup-controls svelte-1pe48zz");
    			add_location(section0, file$6, 19, 0, 559);
    			attr_dev(section1, "id", "meetups");
    			attr_dev(section1, "class", "svelte-1pe48zz");
    			add_location(section1, file$6, 28, 0, 830);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, section0, anchor);
    			mount_component(meetupfilter, section0, null);
    			append_dev(section0, t0);
    			mount_component(button, section0, null);
    			insert_dev(target, t1, anchor);
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, t2, anchor);
    			insert_dev(target, section1, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				if (each_blocks[i]) {
    					each_blocks[i].m(section1, null);
    				}
    			}

    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const button_changes = {};

    			if (dirty & /*$$scope*/ 2048) {
    				button_changes.$$scope = { dirty, ctx };
    			}

    			button.$set(button_changes);

    			if (/*filteredMeetups*/ ctx[0].length === 0) {
    				if (if_block) ; else {
    					if_block = create_if_block$3(ctx);
    					if_block.c();
    					if_block.m(t2.parentNode, t2);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}

    			if (dirty & /*filteredMeetups*/ 1) {
    				each_value = /*filteredMeetups*/ ctx[0];
    				validate_each_argument(each_value);
    				group_outros();
    				for (let i = 0; i < each_blocks.length; i += 1) each_blocks[i].r();
    				validate_each_keys(ctx, each_value, get_each_context, get_key);
    				each_blocks = update_keyed_each(each_blocks, dirty, get_key, 1, ctx, each_value, each_1_lookup, section1, fix_and_outro_and_destroy_block, create_each_block, null, get_each_context);
    				for (let i = 0; i < each_blocks.length; i += 1) each_blocks[i].a();
    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(meetupfilter.$$.fragment, local);
    			transition_in(button.$$.fragment, local);

    			for (let i = 0; i < each_value.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(meetupfilter.$$.fragment, local);
    			transition_out(button.$$.fragment, local);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(section0);
    			destroy_component(meetupfilter);
    			destroy_component(button);
    			if (detaching) detach_dev(t1);
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(t2);
    			if (detaching) detach_dev(section1);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].d();
    			}
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
    	let filteredMeetups;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('MeetupGrid', slots, []);
    	let { meetups } = $$props;
    	const dispatch = createEventDispatcher();
    	let favOnly = false;

    	function setFilter(event) {
    		$$invalidate(4, favOnly = event.detail === 1);
    	}

    	$$self.$$.on_mount.push(function () {
    		if (meetups === undefined && !('meetups' in $$props || $$self.$$.bound[$$self.$$.props['meetups']])) {
    			console.warn("<MeetupGrid> was created without expected prop 'meetups'");
    		}
    	});

    	const writable_props = ['meetups'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<MeetupGrid> was created with unknown prop '${key}'`);
    	});

    	const click_handler = () => dispatch("add");

    	function showdetails_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	function edit_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	$$self.$$set = $$props => {
    		if ('meetups' in $$props) $$invalidate(3, meetups = $$props.meetups);
    	};

    	$$self.$capture_state = () => ({
    		createEventDispatcher,
    		Button,
    		MeetupFilter,
    		MeetupItem,
    		scale,
    		flip,
    		meetups,
    		dispatch,
    		favOnly,
    		setFilter,
    		filteredMeetups
    	});

    	$$self.$inject_state = $$props => {
    		if ('meetups' in $$props) $$invalidate(3, meetups = $$props.meetups);
    		if ('favOnly' in $$props) $$invalidate(4, favOnly = $$props.favOnly);
    		if ('filteredMeetups' in $$props) $$invalidate(0, filteredMeetups = $$props.filteredMeetups);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*favOnly, meetups*/ 24) {
    			$$invalidate(0, filteredMeetups = favOnly ? meetups.filter(m => m.isFavorite) : meetups);
    		}
    	};

    	return [
    		filteredMeetups,
    		dispatch,
    		setFilter,
    		meetups,
    		favOnly,
    		click_handler,
    		showdetails_handler,
    		edit_handler
    	];
    }

    class MeetupGrid extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$6, create_fragment$6, safe_not_equal, { meetups: 3 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "MeetupGrid",
    			options,
    			id: create_fragment$6.name
    		});
    	}

    	get meetups() {
    		throw new Error("<MeetupGrid>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set meetups(value) {
    		throw new Error("<MeetupGrid>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\UI\TextInput.svelte generated by Svelte v3.59.2 */

    const file$5 = "src\\UI\\TextInput.svelte";

    // (25:2) {:else}
    function create_else_block$1(ctx) {
    	let input;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			input = element("input");
    			attr_dev(input, "type", /*type*/ ctx[5]);
    			attr_dev(input, "id", "title");
    			input.value = /*value*/ ctx[0];
    			attr_dev(input, "class", "svelte-1tmmj0c");
    			toggle_class(input, "invalid", !/*valid*/ ctx[6] && /*touched*/ ctx[8]);
    			add_location(input, file$5, 25, 4, 538);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, input, anchor);

    			if (!mounted) {
    				dispose = [
    					listen_dev(input, "input", /*input_handler*/ ctx[9], false, false, false, false),
    					listen_dev(input, "blur", /*blur_handler_1*/ ctx[12], false, false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*type*/ 32) {
    				attr_dev(input, "type", /*type*/ ctx[5]);
    			}

    			if (dirty & /*value*/ 1 && input.value !== /*value*/ ctx[0]) {
    				prop_dev(input, "value", /*value*/ ctx[0]);
    			}

    			if (dirty & /*valid, touched*/ 320) {
    				toggle_class(input, "invalid", !/*valid*/ ctx[6] && /*touched*/ ctx[8]);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(input);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$1.name,
    		type: "else",
    		source: "(25:2) {:else}",
    		ctx
    	});

    	return block;
    }

    // (17:2) {#if controlType == "textarea"}
    function create_if_block_1$1(ctx) {
    	let textarea;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			textarea = element("textarea");
    			attr_dev(textarea, "rows", /*row*/ ctx[4]);
    			attr_dev(textarea, "id", /*id*/ ctx[2]);
    			attr_dev(textarea, "class", "svelte-1tmmj0c");
    			toggle_class(textarea, "invalid", !/*valid*/ ctx[6] && /*touched*/ ctx[8]);
    			add_location(textarea, file$5, 17, 4, 375);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, textarea, anchor);
    			set_input_value(textarea, /*value*/ ctx[0]);

    			if (!mounted) {
    				dispose = [
    					listen_dev(textarea, "input", /*textarea_input_handler*/ ctx[10]),
    					listen_dev(textarea, "blur", /*blur_handler*/ ctx[11], false, false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*row*/ 16) {
    				attr_dev(textarea, "rows", /*row*/ ctx[4]);
    			}

    			if (dirty & /*id*/ 4) {
    				attr_dev(textarea, "id", /*id*/ ctx[2]);
    			}

    			if (dirty & /*value*/ 1) {
    				set_input_value(textarea, /*value*/ ctx[0]);
    			}

    			if (dirty & /*valid, touched*/ 320) {
    				toggle_class(textarea, "invalid", !/*valid*/ ctx[6] && /*touched*/ ctx[8]);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(textarea);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$1.name,
    		type: "if",
    		source: "(17:2) {#if controlType == \\\"textarea\\\"}",
    		ctx
    	});

    	return block;
    }

    // (36:2) {#if validityMessage && !valid && touched}
    function create_if_block$2(ctx) {
    	let p;
    	let t;

    	const block = {
    		c: function create() {
    			p = element("p");
    			t = text(/*validityMessage*/ ctx[7]);
    			attr_dev(p, "class", "error-message svelte-1tmmj0c");
    			add_location(p, file$5, 36, 4, 759);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, p, anchor);
    			append_dev(p, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*validityMessage*/ 128) set_data_dev(t, /*validityMessage*/ ctx[7]);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(p);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$2.name,
    		type: "if",
    		source: "(36:2) {#if validityMessage && !valid && touched}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$5(ctx) {
    	let div;
    	let label_1;
    	let t0;
    	let t1;
    	let t2;

    	function select_block_type(ctx, dirty) {
    		if (/*controlType*/ ctx[1] == "textarea") return create_if_block_1$1;
    		return create_else_block$1;
    	}

    	let current_block_type = select_block_type(ctx);
    	let if_block0 = current_block_type(ctx);
    	let if_block1 = /*validityMessage*/ ctx[7] && !/*valid*/ ctx[6] && /*touched*/ ctx[8] && create_if_block$2(ctx);

    	const block = {
    		c: function create() {
    			div = element("div");
    			label_1 = element("label");
    			t0 = text(/*label*/ ctx[3]);
    			t1 = space();
    			if_block0.c();
    			t2 = space();
    			if (if_block1) if_block1.c();
    			attr_dev(label_1, "for", "description");
    			attr_dev(label_1, "class", "svelte-1tmmj0c");
    			add_location(label_1, file$5, 14, 2, 292);
    			attr_dev(div, "class", "form-control svelte-1tmmj0c");
    			add_location(div, file$5, 13, 0, 262);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, label_1);
    			append_dev(label_1, t0);
    			append_dev(div, t1);
    			if_block0.m(div, null);
    			append_dev(div, t2);
    			if (if_block1) if_block1.m(div, null);
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*label*/ 8) set_data_dev(t0, /*label*/ ctx[3]);

    			if (current_block_type === (current_block_type = select_block_type(ctx)) && if_block0) {
    				if_block0.p(ctx, dirty);
    			} else {
    				if_block0.d(1);
    				if_block0 = current_block_type(ctx);

    				if (if_block0) {
    					if_block0.c();
    					if_block0.m(div, t2);
    				}
    			}

    			if (/*validityMessage*/ ctx[7] && !/*valid*/ ctx[6] && /*touched*/ ctx[8]) {
    				if (if_block1) {
    					if_block1.p(ctx, dirty);
    				} else {
    					if_block1 = create_if_block$2(ctx);
    					if_block1.c();
    					if_block1.m(div, null);
    				}
    			} else if (if_block1) {
    				if_block1.d(1);
    				if_block1 = null;
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if_block0.d();
    			if (if_block1) if_block1.d();
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
    	validate_slots('TextInput', slots, []);
    	let { controlType = null } = $$props;
    	let { id } = $$props;
    	let { label } = $$props;
    	let { row = null } = $$props;
    	let { value } = $$props;
    	let { type = "text" } = $$props;
    	let { valid = true } = $$props;
    	let { validityMessage = "" } = $$props;
    	let touched = false;

    	$$self.$$.on_mount.push(function () {
    		if (id === undefined && !('id' in $$props || $$self.$$.bound[$$self.$$.props['id']])) {
    			console.warn("<TextInput> was created without expected prop 'id'");
    		}

    		if (label === undefined && !('label' in $$props || $$self.$$.bound[$$self.$$.props['label']])) {
    			console.warn("<TextInput> was created without expected prop 'label'");
    		}

    		if (value === undefined && !('value' in $$props || $$self.$$.bound[$$self.$$.props['value']])) {
    			console.warn("<TextInput> was created without expected prop 'value'");
    		}
    	});

    	const writable_props = [
    		'controlType',
    		'id',
    		'label',
    		'row',
    		'value',
    		'type',
    		'valid',
    		'validityMessage'
    	];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<TextInput> was created with unknown prop '${key}'`);
    	});

    	function input_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	function textarea_input_handler() {
    		value = this.value;
    		$$invalidate(0, value);
    	}

    	const blur_handler = () => $$invalidate(8, touched = true);
    	const blur_handler_1 = () => $$invalidate(8, touched = true);

    	$$self.$$set = $$props => {
    		if ('controlType' in $$props) $$invalidate(1, controlType = $$props.controlType);
    		if ('id' in $$props) $$invalidate(2, id = $$props.id);
    		if ('label' in $$props) $$invalidate(3, label = $$props.label);
    		if ('row' in $$props) $$invalidate(4, row = $$props.row);
    		if ('value' in $$props) $$invalidate(0, value = $$props.value);
    		if ('type' in $$props) $$invalidate(5, type = $$props.type);
    		if ('valid' in $$props) $$invalidate(6, valid = $$props.valid);
    		if ('validityMessage' in $$props) $$invalidate(7, validityMessage = $$props.validityMessage);
    	};

    	$$self.$capture_state = () => ({
    		controlType,
    		id,
    		label,
    		row,
    		value,
    		type,
    		valid,
    		validityMessage,
    		touched
    	});

    	$$self.$inject_state = $$props => {
    		if ('controlType' in $$props) $$invalidate(1, controlType = $$props.controlType);
    		if ('id' in $$props) $$invalidate(2, id = $$props.id);
    		if ('label' in $$props) $$invalidate(3, label = $$props.label);
    		if ('row' in $$props) $$invalidate(4, row = $$props.row);
    		if ('value' in $$props) $$invalidate(0, value = $$props.value);
    		if ('type' in $$props) $$invalidate(5, type = $$props.type);
    		if ('valid' in $$props) $$invalidate(6, valid = $$props.valid);
    		if ('validityMessage' in $$props) $$invalidate(7, validityMessage = $$props.validityMessage);
    		if ('touched' in $$props) $$invalidate(8, touched = $$props.touched);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		value,
    		controlType,
    		id,
    		label,
    		row,
    		type,
    		valid,
    		validityMessage,
    		touched,
    		input_handler,
    		textarea_input_handler,
    		blur_handler,
    		blur_handler_1
    	];
    }

    class TextInput extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$5, create_fragment$5, safe_not_equal, {
    			controlType: 1,
    			id: 2,
    			label: 3,
    			row: 4,
    			value: 0,
    			type: 5,
    			valid: 6,
    			validityMessage: 7
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "TextInput",
    			options,
    			id: create_fragment$5.name
    		});
    	}

    	get controlType() {
    		throw new Error("<TextInput>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set controlType(value) {
    		throw new Error("<TextInput>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get id() {
    		throw new Error("<TextInput>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set id(value) {
    		throw new Error("<TextInput>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get label() {
    		throw new Error("<TextInput>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set label(value) {
    		throw new Error("<TextInput>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get row() {
    		throw new Error("<TextInput>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set row(value) {
    		throw new Error("<TextInput>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get value() {
    		throw new Error("<TextInput>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set value(value) {
    		throw new Error("<TextInput>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get type() {
    		throw new Error("<TextInput>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set type(value) {
    		throw new Error("<TextInput>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get valid() {
    		throw new Error("<TextInput>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set valid(value) {
    		throw new Error("<TextInput>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get validityMessage() {
    		throw new Error("<TextInput>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set validityMessage(value) {
    		throw new Error("<TextInput>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\UI\Modal.svelte generated by Svelte v3.59.2 */
    const file$4 = "src\\UI\\Modal.svelte";
    const get_footer_slot_changes = dirty => ({});
    const get_footer_slot_context = ctx => ({});

    // (20:6) <Button on:click={closeModal}>
    function create_default_slot$3(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Close");
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
    		id: create_default_slot$3.name,
    		type: "slot",
    		source: "(20:6) <Button on:click={closeModal}>",
    		ctx
    	});

    	return block;
    }

    // (19:24)         
    function fallback_block(ctx) {
    	let button;
    	let current;

    	button = new Button({
    			props: {
    				$$slots: { default: [create_default_slot$3] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	button.$on("click", /*closeModal*/ ctx[1]);

    	const block = {
    		c: function create() {
    			create_component(button.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(button, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const button_changes = {};

    			if (dirty & /*$$scope*/ 8) {
    				button_changes.$$scope = { dirty, ctx };
    			}

    			button.$set(button_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(button.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(button.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(button, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: fallback_block.name,
    		type: "fallback",
    		source: "(19:24)         ",
    		ctx
    	});

    	return block;
    }

    function create_fragment$4(ctx) {
    	let div0;
    	let div0_transition;
    	let t0;
    	let div2;
    	let h1;
    	let t1;
    	let t2;
    	let div1;
    	let t3;
    	let footer;
    	let div2_transition;
    	let current;
    	let mounted;
    	let dispose;
    	const default_slot_template = /*#slots*/ ctx[2].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[3], null);
    	const footer_slot_template = /*#slots*/ ctx[2].footer;
    	const footer_slot = create_slot(footer_slot_template, ctx, /*$$scope*/ ctx[3], get_footer_slot_context);
    	const footer_slot_or_fallback = footer_slot || fallback_block(ctx);

    	const block = {
    		c: function create() {
    			div0 = element("div");
    			t0 = space();
    			div2 = element("div");
    			h1 = element("h1");
    			t1 = text(/*title*/ ctx[0]);
    			t2 = space();
    			div1 = element("div");
    			if (default_slot) default_slot.c();
    			t3 = space();
    			footer = element("footer");
    			if (footer_slot_or_fallback) footer_slot_or_fallback.c();
    			attr_dev(div0, "class", "modal-backdrop svelte-1wfedfe");
    			add_location(div0, file$4, 13, 0, 292);
    			attr_dev(h1, "class", "svelte-1wfedfe");
    			add_location(h1, file$4, 15, 2, 413);
    			attr_dev(div1, "class", "content svelte-1wfedfe");
    			add_location(div1, file$4, 16, 2, 433);
    			attr_dev(footer, "class", "svelte-1wfedfe");
    			add_location(footer, file$4, 17, 2, 472);
    			attr_dev(div2, "class", "modal svelte-1wfedfe");
    			add_location(div2, file$4, 14, 0, 362);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div0, anchor);
    			insert_dev(target, t0, anchor);
    			insert_dev(target, div2, anchor);
    			append_dev(div2, h1);
    			append_dev(h1, t1);
    			append_dev(div2, t2);
    			append_dev(div2, div1);

    			if (default_slot) {
    				default_slot.m(div1, null);
    			}

    			append_dev(div2, t3);
    			append_dev(div2, footer);

    			if (footer_slot_or_fallback) {
    				footer_slot_or_fallback.m(footer, null);
    			}

    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(div0, "click", /*closeModal*/ ctx[1], false, false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (!current || dirty & /*title*/ 1) set_data_dev(t1, /*title*/ ctx[0]);

    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 8)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[3],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[3])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[3], dirty, null),
    						null
    					);
    				}
    			}

    			if (footer_slot) {
    				if (footer_slot.p && (!current || dirty & /*$$scope*/ 8)) {
    					update_slot_base(
    						footer_slot,
    						footer_slot_template,
    						ctx,
    						/*$$scope*/ ctx[3],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[3])
    						: get_slot_changes(footer_slot_template, /*$$scope*/ ctx[3], dirty, get_footer_slot_changes),
    						get_footer_slot_context
    					);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;

    			add_render_callback(() => {
    				if (!current) return;
    				if (!div0_transition) div0_transition = create_bidirectional_transition(div0, fade, {}, true);
    				div0_transition.run(1);
    			});

    			transition_in(default_slot, local);
    			transition_in(footer_slot_or_fallback, local);

    			add_render_callback(() => {
    				if (!current) return;
    				if (!div2_transition) div2_transition = create_bidirectional_transition(div2, fly, { y: 300 }, true);
    				div2_transition.run(1);
    			});

    			current = true;
    		},
    		o: function outro(local) {
    			if (!div0_transition) div0_transition = create_bidirectional_transition(div0, fade, {}, false);
    			div0_transition.run(0);
    			transition_out(default_slot, local);
    			transition_out(footer_slot_or_fallback, local);
    			if (!div2_transition) div2_transition = create_bidirectional_transition(div2, fly, { y: 300 }, false);
    			div2_transition.run(0);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div0);
    			if (detaching && div0_transition) div0_transition.end();
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(div2);
    			if (default_slot) default_slot.d(detaching);
    			if (footer_slot_or_fallback) footer_slot_or_fallback.d(detaching);
    			if (detaching && div2_transition) div2_transition.end();
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
    	validate_slots('Modal', slots, ['default','footer']);
    	let { title } = $$props;
    	const dispatch = createEventDispatcher();

    	function closeModal() {
    		dispatch("cancel");
    	}

    	$$self.$$.on_mount.push(function () {
    		if (title === undefined && !('title' in $$props || $$self.$$.bound[$$self.$$.props['title']])) {
    			console.warn("<Modal> was created without expected prop 'title'");
    		}
    	});

    	const writable_props = ['title'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Modal> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('title' in $$props) $$invalidate(0, title = $$props.title);
    		if ('$$scope' in $$props) $$invalidate(3, $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		Button,
    		createEventDispatcher,
    		fly,
    		fade,
    		title,
    		dispatch,
    		closeModal
    	});

    	$$self.$inject_state = $$props => {
    		if ('title' in $$props) $$invalidate(0, title = $$props.title);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [title, closeModal, slots, $$scope];
    }

    class Modal extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$4, create_fragment$4, safe_not_equal, { title: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Modal",
    			options,
    			id: create_fragment$4.name
    		});
    	}

    	get title() {
    		throw new Error("<Modal>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set title(value) {
    		throw new Error("<Modal>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    function isEmpty(val){
        return val.trim().length ===0;
    }

    function isValidEmail(val){
        return new RegExp("[A-Za-z0-9\._%+\-]+@[A-Za-z0-9\.\-]+\.[A-Za-z]{2,}").test(val);
    }

    /* src\Meetups\EditMeetup.svelte generated by Svelte v3.59.2 */

    const { Error: Error_1$2, console: console_1$2 } = globals;
    const file$3 = "src\\Meetups\\EditMeetup.svelte";

    // (132:0) <Modal title="Edit meetup Data" on:cancel>
    function create_default_slot_3(ctx) {
    	let form;
    	let textinput0;
    	let t0;
    	let textinput1;
    	let t1;
    	let textinput2;
    	let t2;
    	let textinput3;
    	let t3;
    	let textinput4;
    	let updating_value;
    	let t4;
    	let textinput5;
    	let current;
    	let mounted;
    	let dispose;

    	textinput0 = new TextInput({
    			props: {
    				id: "titile",
    				label: "Title",
    				type: "text",
    				valid: /*titleValid*/ ctx[2],
    				validityMessage: "Please enter a valid title",
    				value: /*title*/ ctx[1]
    			},
    			$$inline: true
    		});

    	textinput0.$on("input", /*input_handler*/ ctx[16]);

    	textinput1 = new TextInput({
    			props: {
    				id: "subtitile",
    				label: "Subtitle",
    				type: "text",
    				valid: /*subtitileValid*/ ctx[4],
    				validityMessage: "Please enter a valid subtitle",
    				value: /*subtitle*/ ctx[3]
    			},
    			$$inline: true
    		});

    	textinput1.$on("input", /*input_handler_1*/ ctx[17]);

    	textinput2 = new TextInput({
    			props: {
    				id: "address",
    				label: "Address",
    				type: "text",
    				valid: /*addressValid*/ ctx[6],
    				validityMessage: "Please enter a valid address",
    				value: /*address*/ ctx[5]
    			},
    			$$inline: true
    		});

    	textinput2.$on("input", /*input_handler_2*/ ctx[18]);

    	textinput3 = new TextInput({
    			props: {
    				id: "imageUrl",
    				label: "ImageUrl",
    				type: "text",
    				valid: /*imageUrl*/ ctx[7],
    				validityMessage: "Please enter a valid image Url",
    				value: /*imageUrl*/ ctx[7]
    			},
    			$$inline: true
    		});

    	textinput3.$on("input", /*input_handler_3*/ ctx[19]);

    	function textinput4_value_binding(value) {
    		/*textinput4_value_binding*/ ctx[20](value);
    	}

    	let textinput4_props = {
    		id: "description",
    		label: "Description",
    		controlType: "textarea",
    		valid: /*descriptionValid*/ ctx[9],
    		validityMessage: "Please enter a valid Description",
    		type: "text"
    	};

    	if (/*description*/ ctx[8] !== void 0) {
    		textinput4_props.value = /*description*/ ctx[8];
    	}

    	textinput4 = new TextInput({ props: textinput4_props, $$inline: true });
    	binding_callbacks.push(() => bind(textinput4, 'value', textinput4_value_binding));
    	textinput4.$on("input", /*input_handler_4*/ ctx[21]);

    	textinput5 = new TextInput({
    			props: {
    				id: "email",
    				label: "Email",
    				value: /*email*/ ctx[10],
    				type: "email",
    				valid: /*emailValid*/ ctx[11],
    				validityMessage: "Please enter a valid Email"
    			},
    			$$inline: true
    		});

    	textinput5.$on("input", /*input_handler_5*/ ctx[22]);

    	const block = {
    		c: function create() {
    			form = element("form");
    			create_component(textinput0.$$.fragment);
    			t0 = space();
    			create_component(textinput1.$$.fragment);
    			t1 = space();
    			create_component(textinput2.$$.fragment);
    			t2 = space();
    			create_component(textinput3.$$.fragment);
    			t3 = space();
    			create_component(textinput4.$$.fragment);
    			t4 = space();
    			create_component(textinput5.$$.fragment);
    			attr_dev(form, "class", "svelte-6x27t8");
    			add_location(form, file$3, 132, 2, 3614);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, form, anchor);
    			mount_component(textinput0, form, null);
    			append_dev(form, t0);
    			mount_component(textinput1, form, null);
    			append_dev(form, t1);
    			mount_component(textinput2, form, null);
    			append_dev(form, t2);
    			mount_component(textinput3, form, null);
    			append_dev(form, t3);
    			mount_component(textinput4, form, null);
    			append_dev(form, t4);
    			mount_component(textinput5, form, null);
    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(form, "submit", prevent_default(/*submitForm*/ ctx[13]), false, true, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			const textinput0_changes = {};
    			if (dirty & /*titleValid*/ 4) textinput0_changes.valid = /*titleValid*/ ctx[2];
    			if (dirty & /*title*/ 2) textinput0_changes.value = /*title*/ ctx[1];
    			textinput0.$set(textinput0_changes);
    			const textinput1_changes = {};
    			if (dirty & /*subtitileValid*/ 16) textinput1_changes.valid = /*subtitileValid*/ ctx[4];
    			if (dirty & /*subtitle*/ 8) textinput1_changes.value = /*subtitle*/ ctx[3];
    			textinput1.$set(textinput1_changes);
    			const textinput2_changes = {};
    			if (dirty & /*addressValid*/ 64) textinput2_changes.valid = /*addressValid*/ ctx[6];
    			if (dirty & /*address*/ 32) textinput2_changes.value = /*address*/ ctx[5];
    			textinput2.$set(textinput2_changes);
    			const textinput3_changes = {};
    			if (dirty & /*imageUrl*/ 128) textinput3_changes.valid = /*imageUrl*/ ctx[7];
    			if (dirty & /*imageUrl*/ 128) textinput3_changes.value = /*imageUrl*/ ctx[7];
    			textinput3.$set(textinput3_changes);
    			const textinput4_changes = {};
    			if (dirty & /*descriptionValid*/ 512) textinput4_changes.valid = /*descriptionValid*/ ctx[9];

    			if (!updating_value && dirty & /*description*/ 256) {
    				updating_value = true;
    				textinput4_changes.value = /*description*/ ctx[8];
    				add_flush_callback(() => updating_value = false);
    			}

    			textinput4.$set(textinput4_changes);
    			const textinput5_changes = {};
    			if (dirty & /*email*/ 1024) textinput5_changes.value = /*email*/ ctx[10];
    			if (dirty & /*emailValid*/ 2048) textinput5_changes.valid = /*emailValid*/ ctx[11];
    			textinput5.$set(textinput5_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(textinput0.$$.fragment, local);
    			transition_in(textinput1.$$.fragment, local);
    			transition_in(textinput2.$$.fragment, local);
    			transition_in(textinput3.$$.fragment, local);
    			transition_in(textinput4.$$.fragment, local);
    			transition_in(textinput5.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(textinput0.$$.fragment, local);
    			transition_out(textinput1.$$.fragment, local);
    			transition_out(textinput2.$$.fragment, local);
    			transition_out(textinput3.$$.fragment, local);
    			transition_out(textinput4.$$.fragment, local);
    			transition_out(textinput5.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(form);
    			destroy_component(textinput0);
    			destroy_component(textinput1);
    			destroy_component(textinput2);
    			destroy_component(textinput3);
    			destroy_component(textinput4);
    			destroy_component(textinput5);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_3.name,
    		type: "slot",
    		source: "(132:0) <Modal title=\\\"Edit meetup Data\\\" on:cancel>",
    		ctx
    	});

    	return block;
    }

    // (196:4) <Button type="button" on:click={submitForm} disabled={!formIsValid}        >
    function create_default_slot_2(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Save");
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
    		id: create_default_slot_2.name,
    		type: "slot",
    		source: "(196:4) <Button type=\\\"button\\\" on:click={submitForm} disabled={!formIsValid}        >",
    		ctx
    	});

    	return block;
    }

    // (199:4) <Button type="button" mode="outline" on:click={cancelForm}>
    function create_default_slot_1$1(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Cancel");
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
    		id: create_default_slot_1$1.name,
    		type: "slot",
    		source: "(199:4) <Button type=\\\"button\\\" mode=\\\"outline\\\" on:click={cancelForm}>",
    		ctx
    	});

    	return block;
    }

    // (200:4) {#if id}
    function create_if_block$1(ctx) {
    	let button;
    	let current;

    	button = new Button({
    			props: {
    				type: "button",
    				$$slots: { default: [create_default_slot$2] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	button.$on("click", /*deleteMeetup*/ ctx[15]);

    	const block = {
    		c: function create() {
    			create_component(button.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(button, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const button_changes = {};

    			if (dirty & /*$$scope*/ 67108864) {
    				button_changes.$$scope = { dirty, ctx };
    			}

    			button.$set(button_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(button.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(button.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(button, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$1.name,
    		type: "if",
    		source: "(200:4) {#if id}",
    		ctx
    	});

    	return block;
    }

    // (201:6) <Button type="button" on:click={deleteMeetup}>
    function create_default_slot$2(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Delete");
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
    		id: create_default_slot$2.name,
    		type: "slot",
    		source: "(201:6) <Button type=\\\"button\\\" on:click={deleteMeetup}>",
    		ctx
    	});

    	return block;
    }

    // (195:2) 
    function create_footer_slot(ctx) {
    	let div;
    	let button0;
    	let t0;
    	let button1;
    	let t1;
    	let current;

    	button0 = new Button({
    			props: {
    				type: "button",
    				disabled: !/*formIsValid*/ ctx[12],
    				$$slots: { default: [create_default_slot_2] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	button0.$on("click", /*submitForm*/ ctx[13]);

    	button1 = new Button({
    			props: {
    				type: "button",
    				mode: "outline",
    				$$slots: { default: [create_default_slot_1$1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	button1.$on("click", /*cancelForm*/ ctx[14]);
    	let if_block = /*id*/ ctx[0] && create_if_block$1(ctx);

    	const block = {
    		c: function create() {
    			div = element("div");
    			create_component(button0.$$.fragment);
    			t0 = space();
    			create_component(button1.$$.fragment);
    			t1 = space();
    			if (if_block) if_block.c();
    			attr_dev(div, "slot", "footer");
    			add_location(div, file$3, 194, 2, 5236);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			mount_component(button0, div, null);
    			append_dev(div, t0);
    			mount_component(button1, div, null);
    			append_dev(div, t1);
    			if (if_block) if_block.m(div, null);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const button0_changes = {};
    			if (dirty & /*formIsValid*/ 4096) button0_changes.disabled = !/*formIsValid*/ ctx[12];

    			if (dirty & /*$$scope*/ 67108864) {
    				button0_changes.$$scope = { dirty, ctx };
    			}

    			button0.$set(button0_changes);
    			const button1_changes = {};

    			if (dirty & /*$$scope*/ 67108864) {
    				button1_changes.$$scope = { dirty, ctx };
    			}

    			button1.$set(button1_changes);

    			if (/*id*/ ctx[0]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);

    					if (dirty & /*id*/ 1) {
    						transition_in(if_block, 1);
    					}
    				} else {
    					if_block = create_if_block$1(ctx);
    					if_block.c();
    					transition_in(if_block, 1);
    					if_block.m(div, null);
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
    			transition_in(button0.$$.fragment, local);
    			transition_in(button1.$$.fragment, local);
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(button0.$$.fragment, local);
    			transition_out(button1.$$.fragment, local);
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_component(button0);
    			destroy_component(button1);
    			if (if_block) if_block.d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_footer_slot.name,
    		type: "slot",
    		source: "(195:2) ",
    		ctx
    	});

    	return block;
    }

    function create_fragment$3(ctx) {
    	let modal;
    	let current;

    	modal = new Modal({
    			props: {
    				title: "Edit meetup Data",
    				$$slots: {
    					footer: [create_footer_slot],
    					default: [create_default_slot_3]
    				},
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	modal.$on("cancel", /*cancel_handler*/ ctx[23]);

    	const block = {
    		c: function create() {
    			create_component(modal.$$.fragment);
    		},
    		l: function claim(nodes) {
    			throw new Error_1$2("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			mount_component(modal, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const modal_changes = {};

    			if (dirty & /*$$scope, id, formIsValid, email, emailValid, descriptionValid, description, imageUrl, addressValid, address, subtitileValid, subtitle, titleValid, title*/ 67117055) {
    				modal_changes.$$scope = { dirty, ctx };
    			}

    			modal.$set(modal_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(modal.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(modal.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(modal, detaching);
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
    	validate_slots('EditMeetup', slots, []);
    	let { id = null } = $$props;
    	let title = "";
    	let titleValid = false;
    	let subtitle = "";
    	let subtitileValid = false;
    	let address = "";
    	let addressValid = false;
    	let imageUrl = "";
    	let imageUrlValid = false;
    	let description = "";
    	let descriptionValid = false;
    	let email = "";
    	let emailValid = false;
    	let formIsValid = false;

    	if (id) {
    		const unsubscribe = customMeetupsStore.subscribe(items => {
    			const selectedMeetup = items.find(i => i.id === id);
    			$$invalidate(1, title = selectedMeetup.title);
    			$$invalidate(3, subtitle = selectedMeetup.subtitle);
    			$$invalidate(5, address = selectedMeetup.address);
    			$$invalidate(10, email = selectedMeetup.contactEmail);
    			$$invalidate(8, description = selectedMeetup.description);
    			$$invalidate(7, imageUrl = selectedMeetup.imageUrl);
    		});

    		unsubscribe();
    	}

    	const dispatch = createEventDispatcher();

    	function submitForm() {
    		const meetupData = {
    			title,
    			subtitle,
    			description,
    			imageUrl,
    			contactEmail: email,
    			address
    		};

    		if (id) {
    			fetch(`https://myapplicationproject-9ac7c.firebaseio.com/meetups/${id}.json`, {
    				method: "PATCH",
    				body: JSON.stringify(meetupData),
    				headers: { "Content-Type": "application/json" }
    			}).then(res => {
    				if (!res.ok) {
    					throw new Error("An error orrcured, Please try again");
    				}

    				customMeetupsStore.updateMeetup(id, meetupData);
    			}).catch(err => {
    				console.log(err);
    			});
    		} else {
    			fetch("https://myapplicationproject-9ac7c.firebaseio.com/meetups.json", {
    				method: "POST",
    				body: JSON.stringify({ ...meetupData, isFavorite: false }),
    				headers: { "Content-Type": "application/json" }
    			}).then(res => {
    				if (!res.ok) {
    					throw new Error("An error occured, Please try again!");
    				}

    				return res.json();
    			}).then(data => {
    				customMeetupsStore.addMeetup({
    					...meetupData,
    					isFavorite: false,
    					id: data.name
    				});
    			}).catch(err => {
    				console.log(err);
    			});
    		} // meetups.addMeetup(meetupData);

    		dispatch("save"); // to close the modal
    	}

    	function cancelForm() {
    		dispatch("cancel"); // to close the modal
    	}

    	function deleteMeetup() {
    		fetch(`https://myapplicationproject-9ac7c.firebaseio.com/meetups/${id}.json`, { method: "DELETE" }).then(res => {
    			if (!res.ok) {
    				throw new Error("An error occured");
    			}

    			customMeetupsStore.deleteMeetup(id);
    		}).catch(err => console.log(err));

    		dispatch("cancel");
    	}

    	const writable_props = ['id'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1$2.warn(`<EditMeetup> was created with unknown prop '${key}'`);
    	});

    	const input_handler = event => $$invalidate(1, title = event.target.value);
    	const input_handler_1 = event => $$invalidate(3, subtitle = event.target.value);
    	const input_handler_2 = event => $$invalidate(5, address = event.target.value);
    	const input_handler_3 = event => $$invalidate(7, imageUrl = event.target.value);

    	function textinput4_value_binding(value) {
    		description = value;
    		$$invalidate(8, description);
    	}

    	const input_handler_4 = event => $$invalidate(8, description = event.target.value);
    	const input_handler_5 = event => $$invalidate(10, email = event.target.value);

    	function cancel_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	$$self.$$set = $$props => {
    		if ('id' in $$props) $$invalidate(0, id = $$props.id);
    	};

    	$$self.$capture_state = () => ({
    		createEventDispatcher,
    		meetups: customMeetupsStore,
    		TextInput,
    		Button,
    		Modal,
    		isEmpty,
    		isValidEmail,
    		id,
    		title,
    		titleValid,
    		subtitle,
    		subtitileValid,
    		address,
    		addressValid,
    		imageUrl,
    		imageUrlValid,
    		description,
    		descriptionValid,
    		email,
    		emailValid,
    		formIsValid,
    		dispatch,
    		submitForm,
    		cancelForm,
    		deleteMeetup
    	});

    	$$self.$inject_state = $$props => {
    		if ('id' in $$props) $$invalidate(0, id = $$props.id);
    		if ('title' in $$props) $$invalidate(1, title = $$props.title);
    		if ('titleValid' in $$props) $$invalidate(2, titleValid = $$props.titleValid);
    		if ('subtitle' in $$props) $$invalidate(3, subtitle = $$props.subtitle);
    		if ('subtitileValid' in $$props) $$invalidate(4, subtitileValid = $$props.subtitileValid);
    		if ('address' in $$props) $$invalidate(5, address = $$props.address);
    		if ('addressValid' in $$props) $$invalidate(6, addressValid = $$props.addressValid);
    		if ('imageUrl' in $$props) $$invalidate(7, imageUrl = $$props.imageUrl);
    		if ('imageUrlValid' in $$props) imageUrlValid = $$props.imageUrlValid;
    		if ('description' in $$props) $$invalidate(8, description = $$props.description);
    		if ('descriptionValid' in $$props) $$invalidate(9, descriptionValid = $$props.descriptionValid);
    		if ('email' in $$props) $$invalidate(10, email = $$props.email);
    		if ('emailValid' in $$props) $$invalidate(11, emailValid = $$props.emailValid);
    		if ('formIsValid' in $$props) $$invalidate(12, formIsValid = $$props.formIsValid);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*title*/ 2) {
    			$$invalidate(2, titleValid = !isEmpty(title));
    		}

    		if ($$self.$$.dirty & /*subtitle*/ 8) {
    			$$invalidate(4, subtitileValid = !isEmpty(subtitle));
    		}

    		if ($$self.$$.dirty & /*address*/ 32) {
    			$$invalidate(6, addressValid = !isEmpty(address));
    		}

    		if ($$self.$$.dirty & /*imageUrl*/ 128) {
    			imageUrlValid = !isEmpty(imageUrl);
    		}

    		if ($$self.$$.dirty & /*description*/ 256) {
    			$$invalidate(9, descriptionValid = !isEmpty(description));
    		}

    		if ($$self.$$.dirty & /*email*/ 1024) {
    			$$invalidate(11, emailValid = isValidEmail(email));
    		}

    		if ($$self.$$.dirty & /*titleValid, subtitileValid, addressValid, imageUrl, descriptionValid, emailValid*/ 2772) {
    			$$invalidate(12, formIsValid = titleValid && subtitileValid && addressValid && imageUrl && descriptionValid && emailValid);
    		}
    	};

    	return [
    		id,
    		title,
    		titleValid,
    		subtitle,
    		subtitileValid,
    		address,
    		addressValid,
    		imageUrl,
    		description,
    		descriptionValid,
    		email,
    		emailValid,
    		formIsValid,
    		submitForm,
    		cancelForm,
    		deleteMeetup,
    		input_handler,
    		input_handler_1,
    		input_handler_2,
    		input_handler_3,
    		textinput4_value_binding,
    		input_handler_4,
    		input_handler_5,
    		cancel_handler
    	];
    }

    class EditMeetup extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$3, create_fragment$3, safe_not_equal, { id: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "EditMeetup",
    			options,
    			id: create_fragment$3.name
    		});
    	}

    	get id() {
    		throw new Error_1$2("<EditMeetup>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set id(value) {
    		throw new Error_1$2("<EditMeetup>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\Meetups\MeetupDetail.svelte generated by Svelte v3.59.2 */

    const { console: console_1$1 } = globals;
    const file$2 = "src\\Meetups\\MeetupDetail.svelte";

    // (32:4) <Button href="mailto:{selectedMeetup.contactEmail}"        >
    function create_default_slot_1(ctx) {
    	let t_value = /*selectedMeetup*/ ctx[0].contactEmail + "";
    	let t;

    	const block = {
    		c: function create() {
    			t = text(t_value);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*selectedMeetup*/ 1 && t_value !== (t_value = /*selectedMeetup*/ ctx[0].contactEmail + "")) set_data_dev(t, t_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_1.name,
    		type: "slot",
    		source: "(32:4) <Button href=\\\"mailto:{selectedMeetup.contactEmail}\\\"        >",
    		ctx
    	});

    	return block;
    }

    // (35:4) <Button type="button" mode="outline" on:click={() => dispatch("close")}        >
    function create_default_slot$1(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Close");
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
    		id: create_default_slot$1.name,
    		type: "slot",
    		source: "(35:4) <Button type=\\\"button\\\" mode=\\\"outline\\\" on:click={() => dispatch(\\\"close\\\")}        >",
    		ctx
    	});

    	return block;
    }

    function create_fragment$2(ctx) {
    	let section;
    	let div0;
    	let img;
    	let img_src_value;
    	let img_alt_value;
    	let t0;
    	let div1;
    	let h1;
    	let t1_value = /*selectedMeetup*/ ctx[0].title + "";
    	let t1;
    	let t2;
    	let h2;
    	let t3_value = /*selectedMeetup*/ ctx[0].subtitle + "";
    	let t3;
    	let t4;
    	let t5_value = /*selectedMeetup*/ ctx[0].address + "";
    	let t5;
    	let t6;
    	let p;
    	let t7_value = /*selectedMeetup*/ ctx[0].description + "";
    	let t7;
    	let t8;
    	let button0;
    	let t9;
    	let button1;
    	let current;

    	button0 = new Button({
    			props: {
    				href: "mailto:" + /*selectedMeetup*/ ctx[0].contactEmail,
    				$$slots: { default: [create_default_slot_1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	button1 = new Button({
    			props: {
    				type: "button",
    				mode: "outline",
    				$$slots: { default: [create_default_slot$1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	button1.$on("click", /*click_handler*/ ctx[3]);

    	const block = {
    		c: function create() {
    			section = element("section");
    			div0 = element("div");
    			img = element("img");
    			t0 = space();
    			div1 = element("div");
    			h1 = element("h1");
    			t1 = text(t1_value);
    			t2 = space();
    			h2 = element("h2");
    			t3 = text(t3_value);
    			t4 = text(" - ");
    			t5 = text(t5_value);
    			t6 = space();
    			p = element("p");
    			t7 = text(t7_value);
    			t8 = space();
    			create_component(button0.$$.fragment);
    			t9 = space();
    			create_component(button1.$$.fragment);
    			if (!src_url_equal(img.src, img_src_value = /*selectedMeetup*/ ctx[0].imageUrl)) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", img_alt_value = /*selectedMeetup*/ ctx[0].title);
    			attr_dev(img, "class", "svelte-10utsu1");
    			add_location(img, file$2, 25, 4, 545);
    			attr_dev(div0, "class", "image svelte-10utsu1");
    			add_location(div0, file$2, 24, 2, 520);
    			attr_dev(h1, "class", "svelte-10utsu1");
    			add_location(h1, file$2, 28, 4, 650);
    			attr_dev(h2, "class", "svelte-10utsu1");
    			add_location(h2, file$2, 29, 4, 687);
    			attr_dev(p, "class", "svelte-10utsu1");
    			add_location(p, file$2, 30, 4, 754);
    			attr_dev(div1, "class", "content svelte-10utsu1");
    			add_location(div1, file$2, 27, 2, 623);
    			attr_dev(section, "class", "svelte-10utsu1");
    			add_location(section, file$2, 23, 0, 507);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, section, anchor);
    			append_dev(section, div0);
    			append_dev(div0, img);
    			append_dev(section, t0);
    			append_dev(section, div1);
    			append_dev(div1, h1);
    			append_dev(h1, t1);
    			append_dev(div1, t2);
    			append_dev(div1, h2);
    			append_dev(h2, t3);
    			append_dev(h2, t4);
    			append_dev(h2, t5);
    			append_dev(div1, t6);
    			append_dev(div1, p);
    			append_dev(p, t7);
    			append_dev(div1, t8);
    			mount_component(button0, div1, null);
    			append_dev(div1, t9);
    			mount_component(button1, div1, null);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (!current || dirty & /*selectedMeetup*/ 1 && !src_url_equal(img.src, img_src_value = /*selectedMeetup*/ ctx[0].imageUrl)) {
    				attr_dev(img, "src", img_src_value);
    			}

    			if (!current || dirty & /*selectedMeetup*/ 1 && img_alt_value !== (img_alt_value = /*selectedMeetup*/ ctx[0].title)) {
    				attr_dev(img, "alt", img_alt_value);
    			}

    			if ((!current || dirty & /*selectedMeetup*/ 1) && t1_value !== (t1_value = /*selectedMeetup*/ ctx[0].title + "")) set_data_dev(t1, t1_value);
    			if ((!current || dirty & /*selectedMeetup*/ 1) && t3_value !== (t3_value = /*selectedMeetup*/ ctx[0].subtitle + "")) set_data_dev(t3, t3_value);
    			if ((!current || dirty & /*selectedMeetup*/ 1) && t5_value !== (t5_value = /*selectedMeetup*/ ctx[0].address + "")) set_data_dev(t5, t5_value);
    			if ((!current || dirty & /*selectedMeetup*/ 1) && t7_value !== (t7_value = /*selectedMeetup*/ ctx[0].description + "")) set_data_dev(t7, t7_value);
    			const button0_changes = {};
    			if (dirty & /*selectedMeetup*/ 1) button0_changes.href = "mailto:" + /*selectedMeetup*/ ctx[0].contactEmail;

    			if (dirty & /*$$scope, selectedMeetup*/ 33) {
    				button0_changes.$$scope = { dirty, ctx };
    			}

    			button0.$set(button0_changes);
    			const button1_changes = {};

    			if (dirty & /*$$scope*/ 32) {
    				button1_changes.$$scope = { dirty, ctx };
    			}

    			button1.$set(button1_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(button0.$$.fragment, local);
    			transition_in(button1.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(button0.$$.fragment, local);
    			transition_out(button1.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(section);
    			destroy_component(button0);
    			destroy_component(button1);
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
    	validate_slots('MeetupDetail', slots, []);
    	let { id } = $$props;
    	let selectedMeetup;

    	const unsubscribe = customMeetupsStore.subscribe(items => {
    		$$invalidate(0, selectedMeetup = items.find(i => i.id === id));
    		console.log(selectedMeetup);
    	});

    	onDestroy(() => {
    		unsubscribe();
    	});

    	const dispatch = createEventDispatcher();

    	$$self.$$.on_mount.push(function () {
    		if (id === undefined && !('id' in $$props || $$self.$$.bound[$$self.$$.props['id']])) {
    			console_1$1.warn("<MeetupDetail> was created without expected prop 'id'");
    		}
    	});

    	const writable_props = ['id'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1$1.warn(`<MeetupDetail> was created with unknown prop '${key}'`);
    	});

    	const click_handler = () => dispatch("close");

    	$$self.$$set = $$props => {
    		if ('id' in $$props) $$invalidate(2, id = $$props.id);
    	};

    	$$self.$capture_state = () => ({
    		Button,
    		meetups: customMeetupsStore,
    		onDestroy,
    		createEventDispatcher,
    		id,
    		selectedMeetup,
    		unsubscribe,
    		dispatch
    	});

    	$$self.$inject_state = $$props => {
    		if ('id' in $$props) $$invalidate(2, id = $$props.id);
    		if ('selectedMeetup' in $$props) $$invalidate(0, selectedMeetup = $$props.selectedMeetup);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*selectedMeetup*/ 1) {
    			console.log(selectedMeetup);
    		}
    	};

    	return [selectedMeetup, dispatch, id, click_handler];
    }

    class MeetupDetail extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$2, create_fragment$2, safe_not_equal, { id: 2 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "MeetupDetail",
    			options,
    			id: create_fragment$2.name
    		});
    	}

    	get id() {
    		throw new Error("<MeetupDetail>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set id(value) {
    		throw new Error("<MeetupDetail>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\UI\Error.svelte generated by Svelte v3.59.2 */

    const { Error: Error_1$1 } = globals;
    const file$1 = "src\\UI\\Error.svelte";

    // (6:0) <Modal title="An error occurred!" on:cancel>
    function create_default_slot(ctx) {
    	let p;
    	let t;

    	const block = {
    		c: function create() {
    			p = element("p");
    			t = text(/*message*/ ctx[0]);
    			add_location(p, file$1, 6, 2, 133);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, p, anchor);
    			append_dev(p, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*message*/ 1) set_data_dev(t, /*message*/ ctx[0]);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(p);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot.name,
    		type: "slot",
    		source: "(6:0) <Modal title=\\\"An error occurred!\\\" on:cancel>",
    		ctx
    	});

    	return block;
    }

    function create_fragment$1(ctx) {
    	let modal;
    	let current;

    	modal = new Modal({
    			props: {
    				title: "An error occurred!",
    				$$slots: { default: [create_default_slot] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	modal.$on("cancel", /*cancel_handler*/ ctx[1]);

    	const block = {
    		c: function create() {
    			create_component(modal.$$.fragment);
    		},
    		l: function claim(nodes) {
    			throw new Error_1$1("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			mount_component(modal, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const modal_changes = {};

    			if (dirty & /*$$scope, message*/ 5) {
    				modal_changes.$$scope = { dirty, ctx };
    			}

    			modal.$set(modal_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(modal.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(modal.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(modal, detaching);
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
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Error', slots, []);
    	let { message } = $$props;

    	$$self.$$.on_mount.push(function () {
    		if (message === undefined && !('message' in $$props || $$self.$$.bound[$$self.$$.props['message']])) {
    			console.warn("<Error> was created without expected prop 'message'");
    		}
    	});

    	const writable_props = ['message'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Error> was created with unknown prop '${key}'`);
    	});

    	function cancel_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	$$self.$$set = $$props => {
    		if ('message' in $$props) $$invalidate(0, message = $$props.message);
    	};

    	$$self.$capture_state = () => ({ Modal, message });

    	$$self.$inject_state = $$props => {
    		if ('message' in $$props) $$invalidate(0, message = $$props.message);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [message, cancel_handler];
    }

    class Error$1 extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$1, create_fragment$1, safe_not_equal, { message: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Error",
    			options,
    			id: create_fragment$1.name
    		});
    	}

    	get message() {
    		throw new Error_1$1("<Error>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set message(value) {
    		throw new Error_1$1("<Error>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\App.svelte generated by Svelte v3.59.2 */

    const { Error: Error_1, console: console_1 } = globals;
    const file = "src\\App.svelte";

    // (72:0) {#if error}
    function create_if_block_3(ctx) {
    	let error_1;
    	let current;

    	error_1 = new Error$1({
    			props: { message: /*error*/ ctx[5] },
    			$$inline: true
    		});

    	error_1.$on("cancel", /*clearError*/ ctx[12]);

    	const block = {
    		c: function create() {
    			create_component(error_1.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(error_1, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const error_1_changes = {};
    			if (dirty & /*error*/ 32) error_1_changes.message = /*error*/ ctx[5];
    			error_1.$set(error_1_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(error_1.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(error_1.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(error_1, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_3.name,
    		type: "if",
    		source: "(72:0) {#if error}",
    		ctx
    	});

    	return block;
    }

    // (96:2) {:else}
    function create_else_block_1(ctx) {
    	let meetupdetail;
    	let current;

    	meetupdetail = new MeetupDetail({
    			props: { id: /*pageData*/ ctx[0].id },
    			$$inline: true
    		});

    	meetupdetail.$on("close", /*closeDeatil*/ ctx[10]);

    	const block = {
    		c: function create() {
    			create_component(meetupdetail.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(meetupdetail, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const meetupdetail_changes = {};
    			if (dirty & /*pageData*/ 1) meetupdetail_changes.id = /*pageData*/ ctx[0].id;
    			meetupdetail.$set(meetupdetail_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(meetupdetail.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(meetupdetail.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(meetupdetail, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block_1.name,
    		type: "else",
    		source: "(96:2) {:else}",
    		ctx
    	});

    	return block;
    }

    // (79:2) {#if page === "overview"}
    function create_if_block(ctx) {
    	let t;
    	let current_block_type_index;
    	let if_block1;
    	let if_block1_anchor;
    	let current;
    	let if_block0 = /*editMode*/ ctx[1] === "edit" && create_if_block_2(ctx);
    	const if_block_creators = [create_if_block_1, create_else_block];
    	const if_blocks = [];

    	function select_block_type_1(ctx, dirty) {
    		if (/*isLoading*/ ctx[4]) return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type_1(ctx);
    	if_block1 = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	const block = {
    		c: function create() {
    			if (if_block0) if_block0.c();
    			t = space();
    			if_block1.c();
    			if_block1_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if (if_block0) if_block0.m(target, anchor);
    			insert_dev(target, t, anchor);
    			if_blocks[current_block_type_index].m(target, anchor);
    			insert_dev(target, if_block1_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (/*editMode*/ ctx[1] === "edit") {
    				if (if_block0) {
    					if_block0.p(ctx, dirty);

    					if (dirty & /*editMode*/ 2) {
    						transition_in(if_block0, 1);
    					}
    				} else {
    					if_block0 = create_if_block_2(ctx);
    					if_block0.c();
    					transition_in(if_block0, 1);
    					if_block0.m(t.parentNode, t);
    				}
    			} else if (if_block0) {
    				group_outros();

    				transition_out(if_block0, 1, 1, () => {
    					if_block0 = null;
    				});

    				check_outros();
    			}

    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type_1(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if_blocks[current_block_type_index].p(ctx, dirty);
    			} else {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block1 = if_blocks[current_block_type_index];

    				if (!if_block1) {
    					if_block1 = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block1.c();
    				} else {
    					if_block1.p(ctx, dirty);
    				}

    				transition_in(if_block1, 1);
    				if_block1.m(if_block1_anchor.parentNode, if_block1_anchor);
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
    			if (if_block0) if_block0.d(detaching);
    			if (detaching) detach_dev(t);
    			if_blocks[current_block_type_index].d(detaching);
    			if (detaching) detach_dev(if_block1_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block.name,
    		type: "if",
    		source: "(79:2) {#if page === \\\"overview\\\"}",
    		ctx
    	});

    	return block;
    }

    // (80:4) {#if editMode === "edit"}
    function create_if_block_2(ctx) {
    	let editmeetup;
    	let current;

    	editmeetup = new EditMeetup({
    			props: { id: /*editedId*/ ctx[3] },
    			$$inline: true
    		});

    	editmeetup.$on("save", /*saveMeetup*/ ctx[8]);
    	editmeetup.$on("cancel", /*cancelEdit*/ ctx[7]);

    	const block = {
    		c: function create() {
    			create_component(editmeetup.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(editmeetup, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const editmeetup_changes = {};
    			if (dirty & /*editedId*/ 8) editmeetup_changes.id = /*editedId*/ ctx[3];
    			editmeetup.$set(editmeetup_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(editmeetup.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(editmeetup.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(editmeetup, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_2.name,
    		type: "if",
    		source: "(80:4) {#if editMode === \\\"edit\\\"}",
    		ctx
    	});

    	return block;
    }

    // (86:4) {:else}
    function create_else_block(ctx) {
    	let meetupgrid;
    	let current;

    	meetupgrid = new MeetupGrid({
    			props: { meetups: /*$meetups*/ ctx[6] },
    			$$inline: true
    		});

    	meetupgrid.$on("showdetails", /*showDetails*/ ctx[9]);
    	meetupgrid.$on("edit", /*startEdit*/ ctx[11]);
    	meetupgrid.$on("add", /*add_handler*/ ctx[13]);

    	const block = {
    		c: function create() {
    			create_component(meetupgrid.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(meetupgrid, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const meetupgrid_changes = {};
    			if (dirty & /*$meetups*/ 64) meetupgrid_changes.meetups = /*$meetups*/ ctx[6];
    			meetupgrid.$set(meetupgrid_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(meetupgrid.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(meetupgrid.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(meetupgrid, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block.name,
    		type: "else",
    		source: "(86:4) {:else}",
    		ctx
    	});

    	return block;
    }

    // (84:4) {#if isLoading}
    function create_if_block_1(ctx) {
    	let loadingspinner;
    	let current;
    	loadingspinner = new LoadingSpinner({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(loadingspinner.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(loadingspinner, target, anchor);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(loadingspinner.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(loadingspinner.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(loadingspinner, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1.name,
    		type: "if",
    		source: "(84:4) {#if isLoading}",
    		ctx
    	});

    	return block;
    }

    function create_fragment(ctx) {
    	let t0;
    	let header;
    	let t1;
    	let main;
    	let current_block_type_index;
    	let if_block1;
    	let current;
    	let if_block0 = /*error*/ ctx[5] && create_if_block_3(ctx);
    	header = new Header({ $$inline: true });
    	const if_block_creators = [create_if_block, create_else_block_1];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*page*/ ctx[2] === "overview") return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type(ctx);
    	if_block1 = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	const block = {
    		c: function create() {
    			if (if_block0) if_block0.c();
    			t0 = space();
    			create_component(header.$$.fragment);
    			t1 = space();
    			main = element("main");
    			if_block1.c();
    			attr_dev(main, "id", "main");
    			attr_dev(main, "class", "svelte-14a40pl");
    			add_location(main, file, 77, 0, 1772);
    		},
    		l: function claim(nodes) {
    			throw new Error_1("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if (if_block0) if_block0.m(target, anchor);
    			insert_dev(target, t0, anchor);
    			mount_component(header, target, anchor);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, main, anchor);
    			if_blocks[current_block_type_index].m(main, null);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (/*error*/ ctx[5]) {
    				if (if_block0) {
    					if_block0.p(ctx, dirty);

    					if (dirty & /*error*/ 32) {
    						transition_in(if_block0, 1);
    					}
    				} else {
    					if_block0 = create_if_block_3(ctx);
    					if_block0.c();
    					transition_in(if_block0, 1);
    					if_block0.m(t0.parentNode, t0);
    				}
    			} else if (if_block0) {
    				group_outros();

    				transition_out(if_block0, 1, 1, () => {
    					if_block0 = null;
    				});

    				check_outros();
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
    				if_block1 = if_blocks[current_block_type_index];

    				if (!if_block1) {
    					if_block1 = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block1.c();
    				} else {
    					if_block1.p(ctx, dirty);
    				}

    				transition_in(if_block1, 1);
    				if_block1.m(main, null);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block0);
    			transition_in(header.$$.fragment, local);
    			transition_in(if_block1);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block0);
    			transition_out(header.$$.fragment, local);
    			transition_out(if_block1);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (if_block0) if_block0.d(detaching);
    			if (detaching) detach_dev(t0);
    			destroy_component(header, detaching);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(main);
    			if_blocks[current_block_type_index].d();
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
    	let $meetups;
    	validate_store(customMeetupsStore, 'meetups');
    	component_subscribe($$self, customMeetupsStore, $$value => $$invalidate(6, $meetups = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('App', slots, []);
    	let editMode = null;
    	let page = "overview";
    	let pageData = {};
    	let editedId;
    	let isLoading = true;
    	let error;

    	fetch(`https://myapplicationproject-9ac7c.firebaseio.com/meetups.json`).then(res => {
    		if (!res.ok) {
    			throw new Error$1("Fetching meetups failed, please try again later!");
    		}

    		return res.json();
    	}).then(data => {
    		const loadedMeetups = [];

    		for (const key in data) {
    			loadedMeetups.push({ ...data[key], id: key });
    		}

    		setTimeout(
    			() => {
    				$$invalidate(4, isLoading = false);
    				customMeetupsStore.setMeetups(loadedMeetups.reverse());
    			},
    			1000
    		);
    	}).catch(err => {
    		$$invalidate(5, error = err);
    		console.log(err);
    	});

    	function cancelEdit() {
    		$$invalidate(1, editMode = null);
    		$$invalidate(3, editedId = null);
    	}

    	function saveMeetup(event) {
    		$$invalidate(1, editMode = null);
    		$$invalidate(3, editedId = null);
    	}

    	function showDetails(event) {
    		$$invalidate(2, page = "details");
    		$$invalidate(0, pageData.id = event.detail, pageData);
    	}

    	function closeDeatil() {
    		$$invalidate(2, page = "overview");
    		$$invalidate(0, pageData = {});
    	}

    	function startEdit(event) {
    		$$invalidate(1, editMode = "edit");
    		$$invalidate(3, editedId = event.detail);
    	}

    	function clearError() {
    		$$invalidate(5, error = null);
    	}

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1.warn(`<App> was created with unknown prop '${key}'`);
    	});

    	const add_handler = () => {
    		$$invalidate(1, editMode = "edit");
    	};

    	$$self.$capture_state = () => ({
    		Header,
    		MeetupGrid,
    		EditMeetup,
    		meetups: customMeetupsStore,
    		MeetupDetail,
    		LoadingSpinner,
    		Error: Error$1,
    		editMode,
    		page,
    		pageData,
    		editedId,
    		isLoading,
    		error,
    		cancelEdit,
    		saveMeetup,
    		showDetails,
    		closeDeatil,
    		startEdit,
    		clearError,
    		$meetups
    	});

    	$$self.$inject_state = $$props => {
    		if ('editMode' in $$props) $$invalidate(1, editMode = $$props.editMode);
    		if ('page' in $$props) $$invalidate(2, page = $$props.page);
    		if ('pageData' in $$props) $$invalidate(0, pageData = $$props.pageData);
    		if ('editedId' in $$props) $$invalidate(3, editedId = $$props.editedId);
    		if ('isLoading' in $$props) $$invalidate(4, isLoading = $$props.isLoading);
    		if ('error' in $$props) $$invalidate(5, error = $$props.error);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*pageData*/ 1) {
    			console.log(pageData);
    		}

    		if ($$self.$$.dirty & /*pageData*/ 1) {
    			console.log("pagedata" + pageData);
    		}
    	};

    	return [
    		pageData,
    		editMode,
    		page,
    		editedId,
    		isLoading,
    		error,
    		$meetups,
    		cancelEdit,
    		saveMeetup,
    		showDetails,
    		closeDeatil,
    		startEdit,
    		clearError,
    		add_handler
    	];
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
    	target: document.body
    });

    return app;

})();
//# sourceMappingURL=bundle.js.map

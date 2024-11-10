"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Screen = void 0;
const sys_1 = require("./sys");
const geometry_1 = require("./geometry");
const View_1 = require("./View");
const Viewport_1 = require("./Viewport");
const log_1 = require("./log");
const Buffer_1 = require("./Buffer");
const FocusManager_1 = require("./managers/FocusManager");
const ModalManager_1 = require("./managers/ModalManager");
const MouseManager_1 = require("./managers/MouseManager");
const TickManager_1 = require("./managers/TickManager");
const Window_1 = require("./components/Window");
const System_1 = require("./System");
class Screen {
    #program;
    #onExit;
    rootView;
    #buffer;
    #focusManager = new FocusManager_1.FocusManager();
    #modalManager = new ModalManager_1.ModalManager();
    #mouseManager = new MouseManager_1.MouseManager();
    #tickManager = new TickManager_1.TickManager(() => this.render());
    static reset() {
        const program = (0, sys_1.program)({
            useBuffer: true,
            tput: true,
        });
        program.alternateBuffer();
        program.enableMouse();
        program.setMouse({ sendFocus: true }, true);
        program.clear();
        program.disableMouse();
        program.showCursor();
        program.normalBuffer();
        (0, log_1.flushLogs)();
        process.exit(0);
    }
    static async start(viewConstructor = new Window_1.Window(), opts = { quitChar: 'c' }) {
        const program = (0, sys_1.program)({
            useBuffer: true,
            tput: true,
        });
        program.alternateBuffer();
        program.enableMouse();
        program.hideCursor();
        program.clear();
        program.setMouse({ sendFocus: true }, true);
        // weird quirk of blessed - bind anything to 'keypress' before
        // attaching the screen or else I-don't-remember-what will happen.
        const fn = function () { };
        program.on('keypress', fn);
        program.off('keypress', fn);
        const rootView = viewConstructor instanceof View_1.View
            ? viewConstructor
            : await viewConstructor(program);
        const screen = new Screen(program, rootView);
        screen.onExit(() => {
            program.clear();
            program.disableMouse();
            program.showCursor();
            program.normalBuffer();
        });
        program.on('focus', function () {
            screen.trigger({ type: 'focus' });
        });
        program.on('blur', function () {
            screen.trigger({ type: 'blur' });
        });
        program.on('resize', function () {
            screen.trigger({ type: 'resize' });
        });
        if (opts?.quitChar) {
            program.key(`C-${opts.quitChar}`, () => {
                screen.exit();
            });
        }
        program.on('keypress', (char, key) => {
            screen.trigger({ type: 'key', ...key });
        });
        program.on('mouse', function (data) {
            let action = data.action;
            if (action === 'focus' || action === 'blur') {
                return;
            }
            if (data.button === 'unknown') {
                return;
            }
            screen.trigger({
                ...data,
                name: translateMouseAction(action),
                type: 'mouse',
            });
        });
        screen.start();
        return [screen, program, rootView];
    }
    constructor(program, rootView) {
        this.#program = program;
        this.#buffer = new Buffer_1.Buffer();
        this.rootView = rootView;
        Object.defineProperty(this, 'program', {
            enumerable: false,
        });
    }
    onExit(callback) {
        if (this.#onExit) {
            const prev = this.#onExit;
            this.#onExit = () => {
                prev();
                callback();
            };
        }
        else {
            this.#onExit = callback;
        }
    }
    start() {
        this.rootView.moveToScreen(this);
        this.render();
    }
    exit() {
        this.#tickManager.stop();
        this.rootView.moveToScreen(undefined);
        this.#onExit?.();
        (0, log_1.flushLogs)();
        process.exit(0);
    }
    trigger(event) {
        switch (event.type) {
            case 'resize':
            case 'focus':
            case 'blur':
                break;
            case 'key':
                this.triggerKeyboard(event);
                break;
            case 'mouse': {
                this.triggerMouse(event);
                break;
            }
        }
        this.render();
    }
    /**
     * Requests a modal. A modal will be created if:
     * (a) no modal is already displayed
     * or
     * (b) a modal is requesting a nested modal
     */
    requestModal(parent, modal, onClose, rect) {
        return this.#modalManager.requestModal(parent, modal, onClose, rect);
    }
    /**
     * @return boolean Whether the current view has focus
     */
    registerFocus(view) {
        return this.#focusManager.registerFocus(view);
    }
    registerHotKey(view, key) {
        return this.#focusManager.registerHotKey(view, key);
    }
    requestFocus(view) {
        return this.#focusManager.requestFocus(view);
    }
    nextFocus() {
        this.#focusManager.nextFocus();
    }
    prevFocus() {
        this.#focusManager.prevFocus();
    }
    triggerKeyboard(event) {
        event = translateKeyEvent(event);
        this.#focusManager.trigger(event);
    }
    /**
     * @see MouseManager.registerMouse
     */
    registerMouse(view, offset, point, eventNames) {
        this.#mouseManager.registerMouse(view, offset, point, eventNames);
    }
    checkMouse(view, x, y) {
        this.#mouseManager.checkMouse(view, x, y);
    }
    triggerMouse(systemEvent) {
        const system = new System_1.UnboundSystem(this.#focusManager);
        this.#mouseManager.trigger(systemEvent, system);
    }
    registerTick(view) {
        this.#tickManager.registerTick(view);
    }
    triggerTick(dt) { }
    preRender(view) {
        this.#modalManager.reset();
        this.#tickManager.reset();
        this.#mouseManager.reset();
        this.#focusManager.reset(view === this.rootView);
    }
    /**
     * @return boolean Whether or not to rerender the view due to focus or mouse change
     */
    commit() {
        const system = new System_1.UnboundSystem(this.#focusManager);
        const focusNeedsRender = this.#focusManager.commit();
        const mouseNeedsRender = this.#mouseManager.commit(system);
        return focusNeedsRender || mouseNeedsRender;
    }
    needsRender() {
        this.#tickManager.needsRender();
    }
    render() {
        const screenSize = new geometry_1.Size(this.#program.cols, this.#program.rows);
        this.#buffer.resize(screenSize);
        // this may be called again by renderModals, before the last modal renders
        this.preRender(this.rootView);
        const size = this.rootView.naturalSize(screenSize).max(screenSize);
        const viewport = new Viewport_1.Viewport(this, this.#buffer, size);
        this.rootView.render(viewport);
        const rerenderView = this.#modalManager.renderModals(this, viewport);
        const needsRerender = this.commit();
        // one -and only one- re-render if a change is detected to focus or mouse-hover
        if (needsRerender) {
            rerenderView.render(viewport);
        }
        this.#tickManager.endRender();
        this.#buffer.flush(this.#program);
    }
}
exports.Screen = Screen;
function translateMouseAction(action) {
    switch (action) {
        case 'mousemove':
            return 'mouse.move.in';
        case 'mousedown':
            return `mouse.button.down`;
        case 'mouseup':
            return `mouse.button.up`;
        case 'wheeldown':
            return 'mouse.wheel.down';
        case 'wheelup':
            return 'mouse.wheel.up';
    }
}
/**
 * These are mostly due to my own terminal keybindings; would be better to have
 * these configured in some .rc file.
 */
function translateKeyEvent(event) {
    if (event.full === 'M-b') {
        return {
            type: 'key',
            full: 'M-left',
            name: 'left',
            ctrl: false,
            meta: true,
            shift: false,
            char: '1;9D',
        };
    }
    if (event.full === 'M-f') {
        return {
            type: 'key',
            full: 'M-right',
            name: 'right',
            ctrl: false,
            meta: true,
            shift: false,
            char: '1;9C',
        };
    }
    return event;
}
//# sourceMappingURL=Screen.js.map
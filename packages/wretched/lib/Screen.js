"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _Screen_program, _Screen_onExit, _Screen_buffer, _Screen_focusManager, _Screen_modalManager, _Screen_mouseManager, _Screen_tickManager;
Object.defineProperty(exports, "__esModule", { value: true });
exports.Screen = void 0;
var sys_1 = require("./sys");
var geometry_1 = require("./geometry");
var View_1 = require("./View");
var Viewport_1 = require("./Viewport");
var log_1 = require("./log");
var Buffer_1 = require("./Buffer");
var FocusManager_1 = require("./managers/FocusManager");
var ModalManager_1 = require("./managers/ModalManager");
var MouseManager_1 = require("./managers/MouseManager");
var TickManager_1 = require("./managers/TickManager");
var Window_1 = require("./components/Window");
var System_1 = require("./System");
var Screen = /** @class */ (function () {
    function Screen(program, rootView) {
        var _this = this;
        _Screen_program.set(this, void 0);
        _Screen_onExit.set(this, void 0);
        _Screen_buffer.set(this, void 0);
        _Screen_focusManager.set(this, new FocusManager_1.FocusManager());
        _Screen_modalManager.set(this, new ModalManager_1.ModalManager());
        _Screen_mouseManager.set(this, new MouseManager_1.MouseManager());
        _Screen_tickManager.set(this, new TickManager_1.TickManager(function () { return _this.render(); }));
        __classPrivateFieldSet(this, _Screen_program, program, "f");
        __classPrivateFieldSet(this, _Screen_buffer, new Buffer_1.Buffer(), "f");
        this.rootView = rootView;
        Object.defineProperty(this, 'program', {
            enumerable: false,
        });
    }
    Screen.reset = function () {
        var program = (0, sys_1.program)({
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
    };
    Screen.start = function () {
        return __awaiter(this, arguments, void 0, function (viewConstructor, opts) {
            var program, fn, rootView, _a, screen;
            if (viewConstructor === void 0) { viewConstructor = new Window_1.Window(); }
            if (opts === void 0) { opts = { quitChar: 'c' }; }
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        program = (0, sys_1.program)({
                            useBuffer: true,
                            tput: true,
                        });
                        program.alternateBuffer();
                        program.enableMouse();
                        program.hideCursor();
                        program.clear();
                        program.setMouse({ sendFocus: true }, true);
                        fn = function () { };
                        program.on('keypress', fn);
                        program.off('keypress', fn);
                        if (!(viewConstructor instanceof View_1.View)) return [3 /*break*/, 1];
                        _a = viewConstructor;
                        return [3 /*break*/, 3];
                    case 1: return [4 /*yield*/, viewConstructor(program)];
                    case 2:
                        _a = _b.sent();
                        _b.label = 3;
                    case 3:
                        rootView = _a;
                        screen = new Screen(program, rootView);
                        screen.onExit(function () {
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
                        if (opts === null || opts === void 0 ? void 0 : opts.quitChar) {
                            program.key("C-".concat(opts.quitChar), function () {
                                screen.exit();
                            });
                        }
                        program.on('keypress', function (char, key) {
                            screen.trigger(__assign({ type: 'key' }, key));
                        });
                        program.on('mouse', function (data) {
                            var action = data.action;
                            if (action === 'focus' || action === 'blur') {
                                return;
                            }
                            if (data.button === 'unknown') {
                                return;
                            }
                            screen.trigger(__assign(__assign({}, data), { name: translateMouseAction(action), type: 'mouse' }));
                        });
                        screen.start();
                        return [2 /*return*/, [screen, program, rootView]];
                }
            });
        });
    };
    Screen.prototype.onExit = function (callback) {
        if (__classPrivateFieldGet(this, _Screen_onExit, "f")) {
            var prev_1 = __classPrivateFieldGet(this, _Screen_onExit, "f");
            __classPrivateFieldSet(this, _Screen_onExit, function () {
                prev_1();
                callback();
            }, "f");
        }
        else {
            __classPrivateFieldSet(this, _Screen_onExit, callback, "f");
        }
    };
    Screen.prototype.start = function () {
        this.rootView.moveToScreen(this);
        this.render();
    };
    Screen.prototype.exit = function () {
        var _a;
        __classPrivateFieldGet(this, _Screen_tickManager, "f").stop();
        this.rootView.moveToScreen(undefined);
        (_a = __classPrivateFieldGet(this, _Screen_onExit, "f")) === null || _a === void 0 ? void 0 : _a.call(this);
        (0, log_1.flushLogs)();
        process.exit(0);
    };
    Screen.prototype.trigger = function (event) {
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
    };
    /**
     * Requests a modal. A modal will be created if:
     * (a) no modal is already displayed
     * or
     * (b) a modal is requesting a nested modal
     */
    Screen.prototype.requestModal = function (parent, modal, onClose, rect) {
        return __classPrivateFieldGet(this, _Screen_modalManager, "f").requestModal(parent, modal, onClose, rect);
    };
    /**
     * @return boolean Whether the current view has focus
     */
    Screen.prototype.registerFocus = function (view) {
        return __classPrivateFieldGet(this, _Screen_focusManager, "f").registerFocus(view);
    };
    Screen.prototype.registerHotKey = function (view, key) {
        return __classPrivateFieldGet(this, _Screen_focusManager, "f").registerHotKey(view, key);
    };
    Screen.prototype.requestFocus = function (view) {
        return __classPrivateFieldGet(this, _Screen_focusManager, "f").requestFocus(view);
    };
    Screen.prototype.nextFocus = function () {
        __classPrivateFieldGet(this, _Screen_focusManager, "f").nextFocus();
    };
    Screen.prototype.prevFocus = function () {
        __classPrivateFieldGet(this, _Screen_focusManager, "f").prevFocus();
    };
    Screen.prototype.triggerKeyboard = function (event) {
        event = translateKeyEvent(event);
        __classPrivateFieldGet(this, _Screen_focusManager, "f").trigger(event);
    };
    /**
     * @see MouseManager.registerMouse
     */
    Screen.prototype.registerMouse = function (view, offset, point, eventNames) {
        __classPrivateFieldGet(this, _Screen_mouseManager, "f").registerMouse(view, offset, point, eventNames);
    };
    Screen.prototype.checkMouse = function (view, x, y) {
        __classPrivateFieldGet(this, _Screen_mouseManager, "f").checkMouse(view, x, y);
    };
    Screen.prototype.triggerMouse = function (systemEvent) {
        var system = new System_1.UnboundSystem(__classPrivateFieldGet(this, _Screen_focusManager, "f"));
        __classPrivateFieldGet(this, _Screen_mouseManager, "f").trigger(systemEvent, system);
    };
    Screen.prototype.registerTick = function (view) {
        __classPrivateFieldGet(this, _Screen_tickManager, "f").registerTick(view);
    };
    Screen.prototype.triggerTick = function (dt) { };
    Screen.prototype.preRender = function (view) {
        __classPrivateFieldGet(this, _Screen_modalManager, "f").reset();
        __classPrivateFieldGet(this, _Screen_tickManager, "f").reset();
        __classPrivateFieldGet(this, _Screen_mouseManager, "f").reset();
        __classPrivateFieldGet(this, _Screen_focusManager, "f").reset(view === this.rootView);
    };
    /**
     * @return boolean Whether or not to rerender the view due to focus or mouse change
     */
    Screen.prototype.commit = function () {
        var system = new System_1.UnboundSystem(__classPrivateFieldGet(this, _Screen_focusManager, "f"));
        var focusNeedsRender = __classPrivateFieldGet(this, _Screen_focusManager, "f").commit();
        var mouseNeedsRender = __classPrivateFieldGet(this, _Screen_mouseManager, "f").commit(system);
        return focusNeedsRender || mouseNeedsRender;
    };
    Screen.prototype.needsRender = function () {
        __classPrivateFieldGet(this, _Screen_tickManager, "f").needsRender();
    };
    Screen.prototype.render = function () {
        var screenSize = new geometry_1.Size(__classPrivateFieldGet(this, _Screen_program, "f").cols, __classPrivateFieldGet(this, _Screen_program, "f").rows);
        __classPrivateFieldGet(this, _Screen_buffer, "f").resize(screenSize);
        // this may be called again by renderModals, before the last modal renders
        this.preRender(this.rootView);
        var size = this.rootView.naturalSize(screenSize).max(screenSize);
        var viewport = new Viewport_1.Viewport(this, __classPrivateFieldGet(this, _Screen_buffer, "f"), size);
        this.rootView.render(viewport);
        var rerenderView = __classPrivateFieldGet(this, _Screen_modalManager, "f").renderModals(this, viewport);
        var needsRerender = this.commit();
        // one -and only one- re-render if a change is detected to focus or mouse-hover
        if (needsRerender) {
            rerenderView.render(viewport);
        }
        __classPrivateFieldGet(this, _Screen_tickManager, "f").endRender();
        __classPrivateFieldGet(this, _Screen_buffer, "f").flush(__classPrivateFieldGet(this, _Screen_program, "f"));
    };
    return Screen;
}());
exports.Screen = Screen;
_Screen_program = new WeakMap(), _Screen_onExit = new WeakMap(), _Screen_buffer = new WeakMap(), _Screen_focusManager = new WeakMap(), _Screen_modalManager = new WeakMap(), _Screen_mouseManager = new WeakMap(), _Screen_tickManager = new WeakMap();
function translateMouseAction(action) {
    switch (action) {
        case 'mousemove':
            return 'mouse.move.in';
        case 'mousedown':
            return "mouse.button.down";
        case 'mouseup':
            return "mouse.button.up";
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

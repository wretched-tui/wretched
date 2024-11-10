"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
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
var _ModalManager_instances, _ModalManager_modalView, _ModalManager_modal, _ModalManager_canRequestModal, _Modal_view, _Modal_onClose;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ModalManager = void 0;
var Container_1 = require("../Container");
var events_1 = require("../events");
var ModalManager = /** @class */ (function () {
    function ModalManager() {
        _ModalManager_instances.add(this);
        _ModalManager_modalView.set(this, new Modal());
        _ModalManager_modal.set(this, void 0);
    }
    ModalManager.prototype.reset = function () {
        __classPrivateFieldSet(this, _ModalManager_modal, undefined, "f");
    };
    ModalManager.prototype.requestModal = function (parent, modal, onClose, rect) {
        if (!__classPrivateFieldGet(this, _ModalManager_instances, "m", _ModalManager_canRequestModal).call(this, parent)) {
            return false;
        }
        if (__classPrivateFieldGet(this, _ModalManager_modal, "f") && __classPrivateFieldGet(this, _ModalManager_modal, "f")[0] !== modal) {
            __classPrivateFieldGet(this, _ModalManager_modal, "f")[1]();
        }
        __classPrivateFieldSet(this, _ModalManager_modal, [modal, onClose, rect], "f");
        return true;
    };
    ModalManager.prototype.renderModals = function (screen, viewport) {
        __classPrivateFieldGet(this, _ModalManager_modalView, "f").moveToScreen(screen);
        var lastView = screen.rootView;
        // this.#modal can be assigned _another modal_
        while (__classPrivateFieldGet(this, _ModalManager_modal, "f")) {
            var _a = __classPrivateFieldGet(this, _ModalManager_modal, "f"), view = _a[0], onClose = _a[1], rect = _a[2];
            // preRender calls reset() which assigns this.#modal = undefined
            screen.preRender(view);
            lastView = view;
            __classPrivateFieldGet(this, _ModalManager_modalView, "f").updateView(view, onClose);
            __classPrivateFieldGet(this, _ModalManager_modalView, "f").naturalSize(viewport.contentSize);
            viewport.parentRect = rect;
            __classPrivateFieldGet(this, _ModalManager_modalView, "f").render(viewport);
        }
        return lastView;
    };
    return ModalManager;
}());
exports.ModalManager = ModalManager;
_ModalManager_modalView = new WeakMap(), _ModalManager_modal = new WeakMap(), _ModalManager_instances = new WeakSet(), _ModalManager_canRequestModal = function _ModalManager_canRequestModal(view) {
    return __classPrivateFieldGet(this, _ModalManager_modal, "f") === undefined;
};
var Modal = /** @class */ (function (_super) {
    __extends(Modal, _super);
    function Modal() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _Modal_view.set(_this, null);
        _Modal_onClose.set(_this, null);
        return _this;
    }
    Modal.prototype.updateView = function (view, onClose) {
        __classPrivateFieldSet(this, _Modal_onClose, onClose, "f");
        if (__classPrivateFieldGet(this, _Modal_view, "f") === view) {
            return;
        }
        if (__classPrivateFieldGet(this, _Modal_view, "f")) {
            this.removeChild(__classPrivateFieldGet(this, _Modal_view, "f"));
        }
        this.add(view);
        __classPrivateFieldSet(this, _Modal_view, view, "f");
    };
    Modal.prototype.receiveMouse = function (event) {
        var _a;
        if ((0, events_1.isMouseClicked)(event)) {
            (_a = __classPrivateFieldGet(this, _Modal_onClose, "f")) === null || _a === void 0 ? void 0 : _a.call(this);
        }
    };
    Modal.prototype.render = function (viewport) {
        viewport.registerMouse('mouse.button.left');
        _super.prototype.render.call(this, viewport);
    };
    return Modal;
}(Container_1.Container));
_Modal_view = new WeakMap(), _Modal_onClose = new WeakMap();

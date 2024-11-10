"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isMouseClicked = isMouseClicked;
exports.isMousePressStart = isMousePressStart;
exports.isMousePressExit = isMousePressExit;
exports.isMousePressEnd = isMousePressEnd;
exports.isMouseDragging = isMouseDragging;
exports.isMouseEnter = isMouseEnter;
exports.isMouseExit = isMouseExit;
exports.isMouseButton = isMouseButton;
exports.isMouseWheel = isMouseWheel;
exports.isMouseMove = isMouseMove;
const geometry_1 = require("../geometry");
function isMouseClicked(event, inside) {
    if (event.name !== 'mouse.button.up') {
        return false;
    }
    if (inside === undefined) {
        return true;
    }
    return inside.includes(new geometry_1.Point(event.position));
}
/**
 * A mouse press event is started with a 'down' event, but can also begin again
 * after the mouse is dragged outside the component ('exit' event), and then
 * dragged back inside ('enter').
 */
function isMousePressStart(event) {
    return (event.name.startsWith('mouse.button.') &&
        ['down', 'enter'].some(suffix => event.name.endsWith(suffix)));
}
/**
 * Press-exit is an uncomfortable name, it refers to either ending the press event
 * ('up', 'cancel') or dragging the mouse outside the component ('exit'). If the
 * component has has a 'pressed' highlight effect, `isMousePressExit` should turn
 * that effect off.
 */
function isMousePressExit(event) {
    return (event.name.startsWith('mouse.button.') &&
        ['up', 'exit', 'cancel'].some(suffix => event.name.endsWith(suffix)));
}
function isMousePressEnd(event) {
    return (event.name.startsWith('mouse.button.') &&
        ['up', 'cancel'].some(suffix => event.name.endsWith(suffix)));
}
/**
 * Dragging events (dragInside, dragOutside), but *also* mouse.button.down
 */
function isMouseDragging(event) {
    return (event.name.startsWith('mouse.button.') &&
        ['.up', '.cancel', '.enter', '.exit'].every(suffix => !event.name.endsWith(suffix)));
}
function isMouseEnter(event) {
    return event.name.endsWith('.enter');
}
function isMouseExit(event) {
    return event.name.endsWith('.exit');
}
function isMouseButton(event) {
    return event.name.startsWith('mouse.button.');
}
function isMouseWheel(event) {
    return event.name.startsWith('mouse.wheel.');
}
function isMouseMove(event) {
    return event.name.startsWith('mouse.move.');
}
//# sourceMappingURL=mouse.js.map
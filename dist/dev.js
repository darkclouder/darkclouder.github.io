var Piero;
/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/canvas/board/Board.ts":
/*!***********************************!*\
  !*** ./src/canvas/board/Board.ts ***!
  \***********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Board": () => (/* binding */ Board),
/* harmony export */   "BoardConfig": () => (/* binding */ BoardConfig),
/* harmony export */   "ChangeViewportEvent": () => (/* binding */ ChangeViewportEvent),
/* harmony export */   "DespawnEvent": () => (/* binding */ DespawnEvent),
/* harmony export */   "DirtyObjectEvent": () => (/* binding */ DirtyObjectEvent),
/* harmony export */   "SpawnEvent": () => (/* binding */ SpawnEvent)
/* harmony export */ });
/* harmony import */ var _canvas_board_controllers_BoardController__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @canvas/board/controllers/BoardController */ "./src/canvas/board/controllers/BoardController.ts");
/* harmony import */ var _canvas_primitives_events__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @canvas/primitives/events */ "./src/canvas/primitives/events.ts");
/* harmony import */ var _canvas_primitives_space__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @canvas/primitives/space */ "./src/canvas/primitives/space.ts");
/* harmony import */ var _canvas_render_LayeredRenderer__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @canvas/render/LayeredRenderer */ "./src/canvas/render/LayeredRenderer.ts");
/* harmony import */ var _canvas_render_Viewport__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @canvas/render/Viewport */ "./src/canvas/render/Viewport.ts");





class ChangeViewportEvent extends _canvas_primitives_events__WEBPACK_IMPORTED_MODULE_1__.EventBase {
    constructor(newViewport, oldViewport, eventStack) {
        super(eventStack);
        this.newViewport = newViewport;
        this.oldViewport = oldViewport;
    }
}
class SpawnEvent extends _canvas_primitives_events__WEBPACK_IMPORTED_MODULE_1__.EventBase {
}
class DespawnEvent extends SpawnEvent {
}
class DirtyObjectEvent extends _canvas_primitives_events__WEBPACK_IMPORTED_MODULE_1__.EventBase {
}
class BoardConfig {
    constructor(enableGuidelineSnap = true, viewportClipOffset = new _canvas_primitives_space__WEBPACK_IMPORTED_MODULE_2__.Vector2(-50, 0), viewOnlyMode = false) {
        this.enableGuidelineSnap = enableGuidelineSnap;
        this.viewportClipOffset = viewportClipOffset;
        this.viewOnlyMode = viewOnlyMode;
    }
    copy(overrides) {
        return new BoardConfig(overrides.enableGuidelineSnap || this.enableGuidelineSnap, overrides.viewportClipOffset || this.viewportClipOffset, overrides.viewOnlyMode || this.viewOnlyMode);
    }
}
class Board {
    constructor(window, boardElement, config = new BoardConfig()) {
        this.window = window;
        this.boardElement = boardElement;
        this.config = config;
        this.onChangeViewport = new _canvas_primitives_events__WEBPACK_IMPORTED_MODULE_1__.EventHandler();
        this.onSpawn = new _canvas_primitives_events__WEBPACK_IMPORTED_MODULE_1__.EventHandler();
        this.onDespawn = new _canvas_primitives_events__WEBPACK_IMPORTED_MODULE_1__.EventHandler();
        this.onDirty = new _canvas_primitives_events__WEBPACK_IMPORTED_MODULE_1__.EventHandler();
        this._viewport = new _canvas_render_Viewport__WEBPACK_IMPORTED_MODULE_4__.TopLeftClippedViewport(this.config.viewportClipOffset);
        this.renderer = new _canvas_render_LayeredRenderer__WEBPACK_IMPORTED_MODULE_3__.LayeredRenderer(window, boardElement, this);
        this.controller = new _canvas_board_controllers_BoardController__WEBPACK_IMPORTED_MODULE_0__.BoardController(this);
    }
    run() {
        this.controller.activate();
        this.onChangeViewport.listen(this, () => {
            this.renderer.requestFullRender();
        });
    }
    requestFullRender() {
        this.renderer.requestFullRender();
    }
    /**
     * Add an object at a certain position.
     * With `z == undefined`, object will be put on top of all existing objects.
     * Z indices are consecutive starting from 0, two objects must not have
     * the same z index.
     */
    addObjects(objects, zIndex) {
        this.renderer.addObjects(objects, zIndex);
        this.notifySpawn(objects);
    }
    addObjectsAbove(objects, lastBelow) {
        this.renderer.addObjectsAbove(objects, lastBelow);
        this.notifySpawn(objects);
    }
    addObjectsBelow(objects, firstOnTop) {
        this.renderer.addObjectsBelow(objects, firstOnTop);
        this.notifySpawn(objects);
    }
    removeObjects(objects) {
        this.renderer.removeObjects(objects);
        objects.forEach(object => {
            object.onDespawn(this);
            this.onDespawn.dispatch(new SpawnEvent([object]));
        });
    }
    reorderManyAbove(sortedObjects, lastBelow) {
        this.renderer.reorderManyAbove(sortedObjects, lastBelow);
        this.markDirtyObjects(sortedObjects);
    }
    get objects() {
        return this.renderer.objects;
    }
    get viewport() {
        return this._viewport;
    }
    set viewport(newViewport) {
        if (this._viewport == newViewport) {
            return;
        }
        const oldViewport = this._viewport;
        this._viewport = this._viewport.modified(newViewport.size, newViewport.zoomLevel, newViewport.origin);
        this.onChangeViewport.dispatch(new ChangeViewportEvent(newViewport, oldViewport, [this]));
    }
    markDirtyObject(object) {
        this.markDirtyObjects([object]);
    }
    markDirtyObjects(objects) {
        this.renderer.markDirtyObjects(objects);
        for (const object of objects) {
            this.onDirty.dispatch(new DirtyObjectEvent([object]));
        }
    }
    notifySpawn(objects) {
        objects.forEach(object => {
            object.onSpawn(this);
            this.onSpawn.dispatch(new SpawnEvent([object]));
        });
    }
}


/***/ }),

/***/ "./src/canvas/board/controllers/BoardController.ts":
/*!*********************************************************!*\
  !*** ./src/canvas/board/controllers/BoardController.ts ***!
  \*********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "BoardController": () => (/* binding */ BoardController)
/* harmony export */ });
/* harmony import */ var _canvas_board_controllers_board_FontController__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @canvas/board/controllers/board/FontController */ "./src/canvas/board/controllers/board/FontController.ts");
/* harmony import */ var _canvas_board_controllers_board_WorldBorderController__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @canvas/board/controllers/board/WorldBorderController */ "./src/canvas/board/controllers/board/WorldBorderController.ts");
/* harmony import */ var _canvas_board_controllers_BoardMode__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @canvas/board/controllers/BoardMode */ "./src/canvas/board/controllers/BoardMode.ts");
/* harmony import */ var _canvas_board_controllers_objects_GuidelineController__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @canvas/board/controllers/objects/GuidelineController */ "./src/canvas/board/controllers/objects/GuidelineController.ts");
/* harmony import */ var _canvas_board_controllers_objects_MoveObjectController__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @canvas/board/controllers/objects/MoveObjectController */ "./src/canvas/board/controllers/objects/MoveObjectController.ts");
/* harmony import */ var _canvas_board_controllers_objects_ResizeObjectController__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @canvas/board/controllers/objects/ResizeObjectController */ "./src/canvas/board/controllers/objects/ResizeObjectController.ts");
/* harmony import */ var _canvas_board_controllers_objects_RotateObjectController__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @canvas/board/controllers/objects/RotateObjectController */ "./src/canvas/board/controllers/objects/RotateObjectController.ts");
/* harmony import */ var _canvas_board_controllers_objects_SelectBoxController__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @canvas/board/controllers/objects/SelectBoxController */ "./src/canvas/board/controllers/objects/SelectBoxController.ts");
/* harmony import */ var _canvas_board_objects_foundation_LayerMarker__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! @canvas/board/objects/foundation/LayerMarker */ "./src/canvas/board/objects/foundation/LayerMarker.ts");
/* harmony import */ var _canvas_primitives_StateMachine__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! @canvas/primitives/StateMachine */ "./src/canvas/primitives/StateMachine.ts");
/* harmony import */ var _board_BoardResizeController__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./board/BoardResizeController */ "./src/canvas/board/controllers/board/BoardResizeController.ts");
/* harmony import */ var _board_PanController__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ./board/PanController */ "./src/canvas/board/controllers/board/PanController.ts");
/* harmony import */ var _board_ZoomController__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ./board/ZoomController */ "./src/canvas/board/controllers/board/ZoomController.ts");
/* harmony import */ var _objects_MouseInteractionController__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! ./objects/MouseInteractionController */ "./src/canvas/board/controllers/objects/MouseInteractionController.ts");
/* harmony import */ var _objects_SelectObjectController__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! ./objects/SelectObjectController */ "./src/canvas/board/controllers/objects/SelectObjectController.ts");















class BoardController {
    constructor(board) {
        this.board = board;
        // Markers
        this.minContentMarker = new _canvas_board_objects_foundation_LayerMarker__WEBPACK_IMPORTED_MODULE_8__.LayerMarker();
        this.maxContentMarker = new _canvas_board_objects_foundation_LayerMarker__WEBPACK_IMPORTED_MODULE_8__.LayerMarker();
        this.minOverlayMarker = this.maxContentMarker;
        this.maxOverlayMarker = new _canvas_board_objects_foundation_LayerMarker__WEBPACK_IMPORTED_MODULE_8__.LayerMarker();
        // Mode
        this.mode = new _canvas_primitives_StateMachine__WEBPACK_IMPORTED_MODULE_9__.StateMachine(_canvas_board_controllers_BoardMode__WEBPACK_IMPORTED_MODULE_2__.BoardMode.Select);
        this.boardResize = new _board_BoardResizeController__WEBPACK_IMPORTED_MODULE_10__.BoardResizeController(board);
        this.zoom = new _board_ZoomController__WEBPACK_IMPORTED_MODULE_12__.ZoomController(board);
        this.pan = new _board_PanController__WEBPACK_IMPORTED_MODULE_11__.PanController(board);
        this.font = new _canvas_board_controllers_board_FontController__WEBPACK_IMPORTED_MODULE_0__.FontController(board);
        this.worldBorder = new _canvas_board_controllers_board_WorldBorderController__WEBPACK_IMPORTED_MODULE_1__.WorldBorderController(board);
        this.select = new _objects_SelectObjectController__WEBPACK_IMPORTED_MODULE_14__.SelectObjectController(board);
        this.selectBox = new _canvas_board_controllers_objects_SelectBoxController__WEBPACK_IMPORTED_MODULE_7__.SelectBoxController(board);
        this.move = new _canvas_board_controllers_objects_MoveObjectController__WEBPACK_IMPORTED_MODULE_4__.MoveObjectController(board);
        this.resize = new _canvas_board_controllers_objects_ResizeObjectController__WEBPACK_IMPORTED_MODULE_5__.ResizeObjectController(board);
        this.rotate = new _canvas_board_controllers_objects_RotateObjectController__WEBPACK_IMPORTED_MODULE_6__.RotateObjectController(board);
        this.guideline = new _canvas_board_controllers_objects_GuidelineController__WEBPACK_IMPORTED_MODULE_3__.GuidelineController(board);
        this.mouse = new _objects_MouseInteractionController__WEBPACK_IMPORTED_MODULE_13__.MouseInteractionController(board);
        this.addMarkers();
    }
    activate() {
        this.boardResize.activate();
        this.zoom.activate();
        this.pan.activate();
        this.font.activate();
        this.worldBorder.activate();
        this.select.activate();
        this.selectBox.activate();
        if (!this.board.config.viewOnlyMode) {
            this.move.activate();
            this.resize.activate();
            this.rotate.activate();
            this.guideline.activate();
        }
        this.mouse.activate();
    }
    deactivate() {
        this.boardResize.deactivate();
        this.zoom.deactivate();
        this.pan.deactivate();
        this.font.deactivate();
        this.worldBorder.activate();
        this.select.deactivate();
        this.selectBox.deactivate();
        this.move.deactivate();
        this.resize.deactivate();
        this.rotate.deactivate();
        this.guideline.deactivate();
        this.mouse.deactivate();
    }
    addMarkers() {
        this.board.addObjects([
            this.minContentMarker,
            this.minOverlayMarker,
            this.maxOverlayMarker,
        ]);
    }
}


/***/ }),

/***/ "./src/canvas/board/controllers/BoardMode.ts":
/*!***************************************************!*\
  !*** ./src/canvas/board/controllers/BoardMode.ts ***!
  \***************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "BoardMode": () => (/* binding */ BoardMode),
/* harmony export */   "canManipulate": () => (/* binding */ canManipulate),
/* harmony export */   "canMove": () => (/* binding */ canMove),
/* harmony export */   "canPan": () => (/* binding */ canPan),
/* harmony export */   "canResize": () => (/* binding */ canResize),
/* harmony export */   "canRotate": () => (/* binding */ canRotate),
/* harmony export */   "canSelect": () => (/* binding */ canSelect),
/* harmony export */   "canZoom": () => (/* binding */ canZoom)
/* harmony export */ });
var BoardMode;
(function (BoardMode) {
    BoardMode[BoardMode["Select"] = 0] = "Select";
    BoardMode[BoardMode["Moving"] = 1] = "Moving";
    BoardMode[BoardMode["Resizing"] = 2] = "Resizing";
    BoardMode[BoardMode["Rotating"] = 3] = "Rotating";
    BoardMode[BoardMode["TextEditing"] = 4] = "TextEditing";
})(BoardMode || (BoardMode = {}));
function canSelect(mode) {
    return mode === BoardMode.Select;
}
function canMove(mode) {
    return mode === BoardMode.Select;
}
function canResize(mode) {
    return mode === BoardMode.Select;
}
function canRotate(mode) {
    return mode === BoardMode.Select;
}
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function canPan(mode) {
    return true;
}
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function canZoom(mode) {
    return true;
}
function canManipulate(mode) {
    return mode !== BoardMode.TextEditing;
}


/***/ }),

/***/ "./src/canvas/board/controllers/board/BoardResizeController.ts":
/*!*********************************************************************!*\
  !*** ./src/canvas/board/controllers/board/BoardResizeController.ts ***!
  \*********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "BoardResizeController": () => (/* binding */ BoardResizeController)
/* harmony export */ });
/* harmony import */ var _canvas_primitives_space__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @canvas/primitives/space */ "./src/canvas/primitives/space.ts");

class BoardResizeController {
    constructor(board) {
        this.board = board;
        this.eventListener = () => {
            this.onResize();
        };
    }
    activate() {
        this.board.window.addEventListener("resize", this.eventListener);
        this.onResize();
    }
    deactivate() {
        this.board.window.removeEventListener("resize", this.eventListener);
    }
    onResize() {
        this.board.viewport = this.board.viewport.modified(new _canvas_primitives_space__WEBPACK_IMPORTED_MODULE_0__.Vector2(this.board.boardElement.clientWidth, this.board.boardElement.clientHeight));
    }
}


/***/ }),

/***/ "./src/canvas/board/controllers/board/FontController.ts":
/*!**************************************************************!*\
  !*** ./src/canvas/board/controllers/board/FontController.ts ***!
  \**************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Font": () => (/* binding */ Font),
/* harmony export */   "FontController": () => (/* binding */ FontController),
/* harmony export */   "FontLoadEvent": () => (/* binding */ FontLoadEvent),
/* harmony export */   "getFontIdentifier": () => (/* binding */ getFontIdentifier)
/* harmony export */ });
/* harmony import */ var _canvas_primitives_events__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @canvas/primitives/events */ "./src/canvas/primitives/events.ts");

class Font {
    constructor(fontFamily, fontStyle = undefined, fontWeight = undefined) {
        this.fontFamily = fontFamily;
        this.fontStyle = fontStyle;
        this.fontWeight = fontWeight;
    }
    toCss(fontSize) {
        let css = `${fontSize}px ${this.fontFamily}`;
        if (this.fontWeight !== undefined)
            css = `${this.fontWeight} ${css}`;
        if (this.fontStyle !== undefined)
            css = `${this.fontStyle} ${css}`;
        return css;
    }
}
class FontLoadEvent extends _canvas_primitives_events__WEBPACK_IMPORTED_MODULE_0__.EventBase {
    constructor(font) {
        super([getFontIdentifier(font.family)]);
        this.font = font;
    }
}
class FontController {
    constructor(board) {
        this.board = board;
        this.onFontLoad = new _canvas_primitives_events__WEBPACK_IMPORTED_MODULE_0__.EventHandler();
        this.subscriptions = [];
    }
    activate() {
        this.subscriptions.push((0,_canvas_primitives_events__WEBPACK_IMPORTED_MODULE_0__.createDomEventListener)(document.fonts, "loadingdone", e => {
            this.onFontsLoaded(e);
        }));
    }
    deactivate() {
        (0,_canvas_primitives_events__WEBPACK_IMPORTED_MODULE_0__.unsubscribeAll)(this.subscriptions);
    }
    onFontsLoaded(e) {
        for (const font of e.fontfaces) {
            this.onFontLoad.dispatch(new FontLoadEvent(font));
        }
    }
}
function getFontIdentifier(family) {
    // Standardize font family name
    return family.replace("'", "").replace('"', "").toLowerCase();
}


/***/ }),

/***/ "./src/canvas/board/controllers/board/PanController.ts":
/*!*************************************************************!*\
  !*** ./src/canvas/board/controllers/board/PanController.ts ***!
  \*************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "PanController": () => (/* binding */ PanController)
/* harmony export */ });
/* harmony import */ var _canvas_board_controllers_BoardMode__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @canvas/board/controllers/BoardMode */ "./src/canvas/board/controllers/BoardMode.ts");
/* harmony import */ var _canvas_primitives_events__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @canvas/primitives/events */ "./src/canvas/primitives/events.ts");
/* harmony import */ var _canvas_primitives_space__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @canvas/primitives/space */ "./src/canvas/primitives/space.ts");
/* harmony import */ var _canvas_utils_input_ModifierState__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @canvas/utils/input/ModifierState */ "./src/canvas/utils/input/ModifierState.ts");
/* harmony import */ var _canvas_utils_input_Wheel__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @canvas/utils/input/Wheel */ "./src/canvas/utils/input/Wheel.ts");
/* harmony import */ var _config_bindings__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @config/bindings */ "./src/config/bindings.ts");






class PanController {
    constructor(board) {
        this.board = board;
        this.subscriptions = [];
    }
    activate() {
        this.subscriptions.push((0,_canvas_primitives_events__WEBPACK_IMPORTED_MODULE_1__.createDomEventListener)(this.board.boardElement, "wheel", e => {
            this.onWheel(e);
        }));
    }
    deactivate() {
        (0,_canvas_primitives_events__WEBPACK_IMPORTED_MODULE_1__.unsubscribeAll)(this.subscriptions);
    }
    onWheel(e) {
        if (!(0,_canvas_board_controllers_BoardMode__WEBPACK_IMPORTED_MODULE_0__.canPan)(this.board.controller.mode.state)) {
            return;
        }
        const modifiersHolder = { modifiers: _canvas_utils_input_ModifierState__WEBPACK_IMPORTED_MODULE_3__.ModifierState.fromDomEvent(e) };
        const inverse = _config_bindings__WEBPACK_IMPORTED_MODULE_5__.Binding.WheelPanInverse.modifiers(modifiersHolder);
        if (_config_bindings__WEBPACK_IMPORTED_MODULE_5__.Binding.WheelPan.modifiers(modifiersHolder) || inverse) {
            e.preventDefault();
            e.stopPropagation();
            let delta = new _canvas_primitives_space__WEBPACK_IMPORTED_MODULE_2__.Vector2(e.deltaX, e.deltaY);
            delta = delta.scale((0,_canvas_utils_input_Wheel__WEBPACK_IMPORTED_MODULE_4__.getWheelBoost)(e));
            if (inverse) {
                delta = delta.rotate(-0.5 * Math.PI);
            }
            const oldViewport = this.board.viewport;
            this.board.viewport = oldViewport.modified(undefined, undefined, oldViewport.origin.plus(delta.scale(1.0 / oldViewport.zoomLevel)));
        }
    }
}


/***/ }),

/***/ "./src/canvas/board/controllers/board/PinchZoomController.ts":
/*!*******************************************************************!*\
  !*** ./src/canvas/board/controllers/board/PinchZoomController.ts ***!
  \*******************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "PinchStartEvent": () => (/* binding */ PinchStartEvent),
/* harmony export */   "PinchZoomController": () => (/* binding */ PinchZoomController),
/* harmony export */   "PinchZoomEvent": () => (/* binding */ PinchZoomEvent)
/* harmony export */ });
/* harmony import */ var _canvas_primitives_dom__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @canvas/primitives/dom */ "./src/canvas/primitives/dom.ts");
/* harmony import */ var _canvas_primitives_events__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @canvas/primitives/events */ "./src/canvas/primitives/events.ts");


class PinchStartEvent extends _canvas_primitives_events__WEBPACK_IMPORTED_MODULE_1__.EventBase {
}
class PinchZoomEvent extends _canvas_primitives_events__WEBPACK_IMPORTED_MODULE_1__.EventBase {
    constructor(cursorPosition, scale, eventStack) {
        super(eventStack);
        this.cursorPosition = cursorPosition;
        this.scale = scale;
    }
}
class PinchZoomController {
    constructor(board) {
        this.board = board;
        this.onPinchStart = new _canvas_primitives_events__WEBPACK_IMPORTED_MODULE_1__.EventHandler();
        this.onPinchZoom = new _canvas_primitives_events__WEBPACK_IMPORTED_MODULE_1__.EventHandler();
        this.subscriptions = [];
    }
    activate() {
        // Safari
        this.subscriptions.push((0,_canvas_primitives_events__WEBPACK_IMPORTED_MODULE_1__.createDomEventListener)(this.board.boardElement, "gesturestart", (e) => {
            this.onGestureStart(e);
        }));
        this.subscriptions.push((0,_canvas_primitives_events__WEBPACK_IMPORTED_MODULE_1__.createDomEventListener)(this.board.boardElement, "gesturechange", (e) => {
            this.onGestureChange(e);
        }));
    }
    deactivate() {
        (0,_canvas_primitives_events__WEBPACK_IMPORTED_MODULE_1__.unsubscribeAll)(this.subscriptions);
    }
    onGestureStart(e) {
        e.preventDefault();
        this.onPinchStart.dispatch(new PinchStartEvent([this.board]));
    }
    onGestureChange(e) {
        e.stopPropagation();
        e.preventDefault();
        const event = new PinchZoomEvent((0,_canvas_primitives_dom__WEBPACK_IMPORTED_MODULE_0__.mousePositionToElement)(e, this.board.boardElement), e.scale, [this.board]);
        this.onPinchZoom.dispatch(event);
    }
}


/***/ }),

/***/ "./src/canvas/board/controllers/board/WheelZoomController.ts":
/*!*******************************************************************!*\
  !*** ./src/canvas/board/controllers/board/WheelZoomController.ts ***!
  \*******************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "WheelZoomController": () => (/* binding */ WheelZoomController),
/* harmony export */   "WheelZoomEvent": () => (/* binding */ WheelZoomEvent)
/* harmony export */ });
/* harmony import */ var _canvas_primitives_dom__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @canvas/primitives/dom */ "./src/canvas/primitives/dom.ts");
/* harmony import */ var _canvas_primitives_events__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @canvas/primitives/events */ "./src/canvas/primitives/events.ts");
/* harmony import */ var _canvas_utils_input_ModifierState__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @canvas/utils/input/ModifierState */ "./src/canvas/utils/input/ModifierState.ts");
/* harmony import */ var _canvas_utils_input_Wheel__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @canvas/utils/input/Wheel */ "./src/canvas/utils/input/Wheel.ts");
/* harmony import */ var _config_bindings__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @config/bindings */ "./src/config/bindings.ts");





class WheelZoomEvent extends _canvas_primitives_events__WEBPACK_IMPORTED_MODULE_1__.EventBase {
    constructor(cursorPosition, zoomDelta, eventStack) {
        super(eventStack);
        this.cursorPosition = cursorPosition;
        this.zoomDelta = zoomDelta;
    }
}
class WheelZoomController {
    constructor(board) {
        this.board = board;
        this.onWheelZoom = new _canvas_primitives_events__WEBPACK_IMPORTED_MODULE_1__.EventHandler();
        this.subscriptions = [];
    }
    activate() {
        // Firefox, Chrome, (Safari)
        this.subscriptions.push((0,_canvas_primitives_events__WEBPACK_IMPORTED_MODULE_1__.createDomEventListener)(this.board.boardElement, "wheel", (e) => {
            this.onWheel(e);
        }));
    }
    deactivate() {
        (0,_canvas_primitives_events__WEBPACK_IMPORTED_MODULE_1__.unsubscribeAll)(this.subscriptions);
    }
    onWheel(e) {
        const modifiersHolder = { modifiers: _canvas_utils_input_ModifierState__WEBPACK_IMPORTED_MODULE_2__.ModifierState.fromDomEvent(e) };
        if (_config_bindings__WEBPACK_IMPORTED_MODULE_4__.Binding.WheelZoom.modifiers(modifiersHolder)) {
            e.stopPropagation();
            e.preventDefault();
            const delta = e.deltaY * (0,_canvas_utils_input_Wheel__WEBPACK_IMPORTED_MODULE_3__.getWheelBoost)(e);
            // Logistic function between -1 and 1
            // and then 2^Logistic to map it between 0.5 and 2.0
            const relativeZoom = Math.pow(2.0, 2.0 / (1.0 + Math.pow(Math.E, 0.05 * delta)) - 1.0);
            const event = new WheelZoomEvent((0,_canvas_primitives_dom__WEBPACK_IMPORTED_MODULE_0__.mousePositionToElement)(e, this.board.boardElement), relativeZoom, [this.board]);
            this.onWheelZoom.dispatch(event);
        }
    }
}


/***/ }),

/***/ "./src/canvas/board/controllers/board/WorldBorderController.ts":
/*!*********************************************************************!*\
  !*** ./src/canvas/board/controllers/board/WorldBorderController.ts ***!
  \*********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "WorldBorderController": () => (/* binding */ WorldBorderController)
/* harmony export */ });
/* harmony import */ var _canvas_board_objects_ui_WorldBorder__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @canvas/board/objects/ui/WorldBorder */ "./src/canvas/board/objects/ui/WorldBorder.ts");

class WorldBorderController {
    constructor(board) {
        this.board = board;
        this.objects = [
            new _canvas_board_objects_ui_WorldBorder__WEBPACK_IMPORTED_MODULE_0__.WorldBorder(false),
            new _canvas_board_objects_ui_WorldBorder__WEBPACK_IMPORTED_MODULE_0__.WorldBorder(true),
        ];
    }
    activate() {
        this.board.addObjectsBelow(this.objects, this.board.controller.minContentMarker);
    }
    deactivate() {
        this.board.removeObjects(this.objects);
    }
}


/***/ }),

/***/ "./src/canvas/board/controllers/board/ZoomController.ts":
/*!**************************************************************!*\
  !*** ./src/canvas/board/controllers/board/ZoomController.ts ***!
  \**************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "ZoomController": () => (/* binding */ ZoomController)
/* harmony export */ });
/* harmony import */ var _canvas_board_controllers_BoardMode__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @canvas/board/controllers/BoardMode */ "./src/canvas/board/controllers/BoardMode.ts");
/* harmony import */ var _canvas_primitives_dom__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @canvas/primitives/dom */ "./src/canvas/primitives/dom.ts");
/* harmony import */ var _canvas_primitives_events__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @canvas/primitives/events */ "./src/canvas/primitives/events.ts");
/* harmony import */ var _config_bindings__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @config/bindings */ "./src/config/bindings.ts");
/* harmony import */ var _PinchZoomController__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./PinchZoomController */ "./src/canvas/board/controllers/board/PinchZoomController.ts");
/* harmony import */ var _WheelZoomController__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./WheelZoomController */ "./src/canvas/board/controllers/board/WheelZoomController.ts");






class ZoomController {
    constructor(board, minZoom = 0.1, maxZoom = 20.0) {
        this.board = board;
        this.minZoom = minZoom;
        this.maxZoom = maxZoom;
        this.subscriptions = [];
        this.initialZoom = 1.0;
        this.wheelZoomCtrl = new _WheelZoomController__WEBPACK_IMPORTED_MODULE_5__.WheelZoomController(this.board);
        this.pinchZoomCtrl = new _PinchZoomController__WEBPACK_IMPORTED_MODULE_4__.PinchZoomController(this.board);
    }
    activate() {
        this.wheelZoomCtrl.activate();
        this.pinchZoomCtrl.activate();
        this.subscriptions.push(this.wheelZoomCtrl.onWheelZoom.listen(this.board, e => {
            this.onWheelZoom(e);
        }));
        this.subscriptions.push(this.pinchZoomCtrl.onPinchStart.listen(this.board, () => {
            this.onPinchStart();
        }));
        this.subscriptions.push(this.pinchZoomCtrl.onPinchZoom.listen(this.board, e => {
            this.onPinchZoom(e);
        }));
        this.subscriptions.push((0,_canvas_primitives_events__WEBPACK_IMPORTED_MODULE_2__.createDomEventListener)(this.board.window, "keydown", e => {
            this.onKeyDown(e);
        }));
        this.subscriptions.push((0,_canvas_primitives_events__WEBPACK_IMPORTED_MODULE_2__.createDomEventListener)(this.board.boardElement, "mousemove", e => {
            this.onMouseMove(e);
        }));
    }
    deactivate() {
        (0,_canvas_primitives_events__WEBPACK_IMPORTED_MODULE_2__.unsubscribeAll)(this.subscriptions);
        this.wheelZoomCtrl.deactivate();
        this.pinchZoomCtrl.deactivate();
    }
    setZoom(zoomLevel, focus) {
        const oldViewport = this.board.viewport;
        if (focus === undefined) {
            // Focus in center
            focus = oldViewport.size.scale(0.5);
        }
        const newZoomLevel = minMax(zoomLevel, this.minZoom, this.maxZoom);
        if (newZoomLevel !== oldViewport.zoomLevel) {
            this.board.viewport = oldViewport.modified(undefined, newZoomLevel, this.computeViewportOrigin(focus, oldViewport, newZoomLevel));
        }
    }
    onMouseMove(e) {
        this.lastCursorPosition = (0,_canvas_primitives_dom__WEBPACK_IMPORTED_MODULE_1__.mousePositionToElement)(e, this.board.boardElement);
    }
    onKeyDown(e) {
        if (_config_bindings__WEBPACK_IMPORTED_MODULE_3__.Binding.ResetZoom.keyboard(e)) {
            e.preventDefault();
            this.setZoom(1.0, this.lastCursorPosition);
        }
        else if (_config_bindings__WEBPACK_IMPORTED_MODULE_3__.Binding.ZoomIn.keyboard(e)) {
            e.preventDefault();
            this.setZoom(this.board.viewport.zoomLevel * 1.2, this.lastCursorPosition);
        }
        else if (_config_bindings__WEBPACK_IMPORTED_MODULE_3__.Binding.ZoomOut.keyboard(e)) {
            e.preventDefault();
            this.setZoom(this.board.viewport.zoomLevel / 1.2, this.lastCursorPosition);
        }
    }
    onPinchStart() {
        this.initialZoom = this.board.viewport.zoomLevel;
    }
    onPinchZoom(e) {
        if (!(0,_canvas_board_controllers_BoardMode__WEBPACK_IMPORTED_MODULE_0__.canZoom)(this.board.controller.mode.state)) {
            return;
        }
        this.setZoom(this.initialZoom * e.scale * e.scale, e.cursorPosition);
    }
    onWheelZoom(e) {
        if (!(0,_canvas_board_controllers_BoardMode__WEBPACK_IMPORTED_MODULE_0__.canZoom)(this.board.controller.mode.state)) {
            return;
        }
        const oldViewport = this.board.viewport;
        this.setZoom(oldViewport.zoomLevel * e.zoomDelta, e.cursorPosition);
    }
    computeViewportOrigin(cursorPos, oldViewport, newZoomLevel) {
        const cursorPosWorldSpace = oldViewport.origin.plus(cursorPos.scale(1.0 / oldViewport.zoomLevel));
        const cursorOffsetNewZoomLevel = cursorPos.scale(1.0 / newZoomLevel);
        return cursorPosWorldSpace.minus(cursorOffsetNewZoomLevel);
    }
}
function minMax(value, min, max) {
    if (value < min)
        return min;
    if (value > max)
        return max;
    return value;
}


/***/ }),

/***/ "./src/canvas/board/controllers/objects/GuidelineController.ts":
/*!*********************************************************************!*\
  !*** ./src/canvas/board/controllers/objects/GuidelineController.ts ***!
  \*********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Guide": () => (/* binding */ Guide),
/* harmony export */   "GuidelineController": () => (/* binding */ GuidelineController)
/* harmony export */ });
/* harmony import */ var _canvas_board_controllers_objects_SelectBoxController__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @canvas/board/controllers/objects/SelectBoxController */ "./src/canvas/board/controllers/objects/SelectBoxController.ts");
/* harmony import */ var _canvas_board_objects_foundation_RotateContainer__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @canvas/board/objects/foundation/RotateContainer */ "./src/canvas/board/objects/foundation/RotateContainer.ts");
/* harmony import */ var _canvas_board_objects_ui_Guideline__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @canvas/board/objects/ui/Guideline */ "./src/canvas/board/objects/ui/Guideline.ts");
/* harmony import */ var _canvas_primitives_events__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @canvas/primitives/events */ "./src/canvas/primitives/events.ts");
/* harmony import */ var _canvas_render_Viewport__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @canvas/render/Viewport */ "./src/canvas/render/Viewport.ts");
/* harmony import */ var _canvas_utils_debounce__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @canvas/utils/debounce */ "./src/canvas/utils/debounce.ts");
/* harmony import */ var _config_debug__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @config/debug */ "./src/config/debug.ts");
/* harmony import */ var _config_interaction__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @config/interaction */ "./src/config/interaction.ts");








var GuideOrigin;
(function (GuideOrigin) {
    // Higher number = higher priority (TopLeft > BottomRight > Center)
    GuideOrigin[GuideOrigin["Center"] = 0] = "Center";
    GuideOrigin[GuideOrigin["BottomRight"] = 1] = "BottomRight";
    GuideOrigin[GuideOrigin["TopLeft"] = 2] = "TopLeft";
})(GuideOrigin || (GuideOrigin = {}));
class Guide {
    constructor(vertical, value, origin) {
        this.vertical = vertical;
        this.value = value;
        this.origin = origin;
    }
}
class GuidelineController {
    constructor(board) {
        this.board = board;
        this.guides = [];
        this.guidelines = [];
        this.subscriptions = [];
    }
    activate() {
        const debouncedOnChange = (0,_canvas_utils_debounce__WEBPACK_IMPORTED_MODULE_5__.debounce)(() => {
            this.onChange();
        }, 50);
        const onDeSpawn = (e) => {
            if (!("isGuideline" in e.target)) {
                debouncedOnChange();
            }
        };
        this.subscriptions.push(this.board.onSpawn.listen(undefined, onDeSpawn));
        this.subscriptions.push(this.board.onDespawn.listen(undefined, onDeSpawn));
        this.subscriptions.push(this.board.onChangeViewport.listen(undefined, e => {
            var _a;
            if (e.newViewport.zoomLevel !== ((_a = e.oldViewport) === null || _a === void 0 ? void 0 : _a.zoomLevel)) {
                debouncedOnChange();
            }
        }));
        this.subscriptions.push(this.board.controller.move.onMove.listen(undefined, debouncedOnChange));
        this.subscriptions.push(this.board.controller.resize.onResize.listen(undefined, debouncedOnChange));
        this.subscriptions.push(this.board.controller.rotate.onRotate.listen(undefined, debouncedOnChange));
    }
    deactivate() {
        (0,_canvas_primitives_events__WEBPACK_IMPORTED_MODULE_3__.unsubscribeAll)(this.subscriptions);
    }
    getSnapGuide(worldPosition, vertical) {
        var _a;
        const viewport = this.board.viewport;
        const posValue = vertical ? worldPosition.x : worldPosition.y;
        return (_a = this.guides
            .filter(guide => guide.vertical == vertical)
            .map(guide => ({
            guide: guide,
            distance: this.getViewDistance(viewport, posValue, guide.value),
        }))
            .filter(x => x.distance <= _config_interaction__WEBPACK_IMPORTED_MODULE_7__.showGuidelineDistance)
            .min((a, b) => a.distance - b.distance)) === null || _a === void 0 ? void 0 : _a.guide;
    }
    showGuides(guides) {
        const guidelines = guides.map(guide => new _canvas_board_objects_ui_Guideline__WEBPACK_IMPORTED_MODULE_2__.Guideline(guide));
        this.board.addObjects(guidelines);
        this.guidelines.push(...guidelines);
    }
    clear() {
        this.board.removeObjects(this.guidelines);
        this.guidelines = [];
    }
    getViewDistance(viewport, a, b) {
        return Math.abs(b - a) * viewport.zoomLevel;
    }
    onChange() {
        const guides = this.getAllGuides();
        const vertical = guides.filter(guide => guide.vertical);
        const horizontal = guides.filter(guide => !guide.vertical);
        const viewMinGuideDistance = _config_interaction__WEBPACK_IMPORTED_MODULE_7__.standardMinGuideDistance / this.board.viewport.zoomLevel;
        this.guides = [
            ...selectGuides(deduplicateGuides(vertical), viewMinGuideDistance),
            ...selectGuides(deduplicateGuides(horizontal), viewMinGuideDistance),
        ];
        if (_config_debug__WEBPACK_IMPORTED_MODULE_6__.DebugConfig.alwaysShowGuidelines) {
            this.showGuides(this.guides);
        }
    }
    getAllGuides() {
        const guides = [];
        const boardItems = this.getBoardItems();
        const selected = this.board.controller.select.selectedObjects;
        for (const boardItem of boardItems) {
            if (boardItem.isFixed || selected.has(boardItem)) {
                continue;
            }
            const defaultBoundingBox = boardItem.boundingBox(_canvas_render_Viewport__WEBPACK_IMPORTED_MODULE_4__.Viewport.world);
            const bb = (0,_canvas_board_objects_foundation_RotateContainer__WEBPACK_IMPORTED_MODULE_1__.rotateBoundingBox)(defaultBoundingBox, boardItem.radians);
            guides.push(new Guide(true, bb.position.x, GuideOrigin.TopLeft));
            if (_config_interaction__WEBPACK_IMPORTED_MODULE_7__.activateCenterGuides) {
                guides.push(new Guide(true, bb.position.x + bb.size.x / 2.0, GuideOrigin.Center));
            }
            guides.push(new Guide(true, bb.position.x + bb.size.x, GuideOrigin.BottomRight));
            guides.push(new Guide(false, bb.position.y, GuideOrigin.TopLeft));
            if (_config_interaction__WEBPACK_IMPORTED_MODULE_7__.activateCenterGuides) {
                guides.push(new Guide(false, bb.position.y + bb.size.y / 2.0, GuideOrigin.Center));
            }
            guides.push(new Guide(false, bb.position.y + bb.size.y, GuideOrigin.BottomRight));
        }
        return guides;
    }
    getBoardItems() {
        return this.board.objects
            .map(object => {
            if ("isBoardItem" in object) {
                return [object];
            }
            const selectables = (0,_canvas_board_controllers_objects_SelectBoxController__WEBPACK_IMPORTED_MODULE_0__.findSelectables)(object);
            return selectables.map(selectable => selectable.content);
        })
            .flat();
    }
}
function selectGuides(deduplicated, minGuideDistance) {
    const [unique, counts] = deduplicated;
    // Sort indices of all guides by importance
    const indices = unique.map((_, idx) => idx);
    indices.sort((aIdx, bIdx) => {
        const countDiff = counts[bIdx] - counts[aIdx];
        if (countDiff != 0) {
            return countDiff;
        }
        const a = unique[aIdx];
        const b = unique[bIdx];
        const originDiff = b.origin - a.origin;
        if (originDiff != 0) {
            return originDiff;
        }
        // TODO: distance of guide to selected objects, but not just as a third
        // layer if the other two have been equal, but rather as a weight for the count
        // Also: prioritise snap of middle boundary to a middle guide origin
        return 0;
    });
    const active = unique.map(() => true);
    // Go through indices from most to least important and deactivate
    // less important neighbors
    indices.forEach(idx => {
        if (!active[idx]) {
            // Object is already deactivated by a more important neighbor
            return;
        }
        deactivateNeighbors(unique, active, -1, minGuideDistance, idx);
        deactivateNeighbors(unique, active, 1, minGuideDistance, idx);
    });
    return unique.filter((_, idx) => active[idx]);
}
function deactivateNeighbors(guides, active, direction, minGuideDistance, currIdx) {
    const n = active.length;
    const curr = guides[currIdx];
    for (let i = currIdx + direction; i >= 0 && i < n; i += direction) {
        if (!active[i]) {
            return;
        }
        if (Math.abs(guides[i].value - curr.value) < minGuideDistance) {
            active[i] = false;
        }
        else {
            return;
        }
    }
}
function deduplicateGuides(guidelines) {
    const unique = new Map();
    const counts = new Map();
    for (const guideline of guidelines) {
        const value = guideline.value;
        const existing = unique.get(value);
        if (existing === undefined) {
            unique.set(value, guideline);
            counts.set(value, 1);
        }
        else {
            unique.set(value, selectGuideByPriority(existing, guideline));
            counts.set(value, counts.get(value) + 1);
        }
    }
    const sorted = [...unique.entries()]
        .sort((a, b) => a[1].value - b[1].value)
        .map(x => x[1]);
    const sortedCounts = sorted.map(guide => counts.get(guide.value));
    return [sorted, sortedCounts];
}
function selectGuideByPriority(one, other) {
    if (one.origin - other.origin < 0) {
        return other;
    }
    return one;
}


/***/ }),

/***/ "./src/canvas/board/controllers/objects/MouseInteractionController.ts":
/*!****************************************************************************!*\
  !*** ./src/canvas/board/controllers/objects/MouseInteractionController.ts ***!
  \****************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "MouseClickEvent": () => (/* binding */ MouseClickEvent),
/* harmony export */   "MouseDownEvent": () => (/* binding */ MouseDownEvent),
/* harmony export */   "MouseEventBase": () => (/* binding */ MouseEventBase),
/* harmony export */   "MouseInteractionController": () => (/* binding */ MouseInteractionController),
/* harmony export */   "MouseMoveEvent": () => (/* binding */ MouseMoveEvent),
/* harmony export */   "MouseOutEvent": () => (/* binding */ MouseOutEvent),
/* harmony export */   "MouseOverEvent": () => (/* binding */ MouseOverEvent),
/* harmony export */   "MousePressEventBase": () => (/* binding */ MousePressEventBase),
/* harmony export */   "MouseUpEvent": () => (/* binding */ MouseUpEvent)
/* harmony export */ });
/* harmony import */ var _canvas_primitives_dom__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @canvas/primitives/dom */ "./src/canvas/primitives/dom.ts");
/* harmony import */ var _canvas_primitives_events__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @canvas/primitives/events */ "./src/canvas/primitives/events.ts");
/* harmony import */ var _canvas_utils_input_ModifierState__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @canvas/utils/input/ModifierState */ "./src/canvas/utils/input/ModifierState.ts");
/* harmony import */ var _canvas_utils_input_MouseButton__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @canvas/utils/input/MouseButton */ "./src/canvas/utils/input/MouseButton.ts");




class MouseEventBase extends _canvas_primitives_events__WEBPACK_IMPORTED_MODULE_1__.EventBase {
    constructor(position, modifiers, eventStack) {
        super(eventStack);
        this.position = position;
        this.modifiers = modifiers;
        this.eventStack = eventStack;
    }
}
class MousePressEventBase extends MouseEventBase {
    constructor(position, modifiers, button, clicks, eventStack) {
        super(position, modifiers, eventStack);
        this.button = button;
        this.clicks = clicks;
        this.eventStack = eventStack;
    }
}
class MouseDownEvent extends MousePressEventBase {
}
class MouseUpEvent extends MousePressEventBase {
}
class MouseClickEvent extends MousePressEventBase {
}
class MouseMoveEvent extends MouseEventBase {
}
class MouseOverEvent extends MouseEventBase {
}
class MouseOutEvent extends MouseEventBase {
}
class MouseInteractionController {
    constructor(board) {
        this.board = board;
        this.onMouseClick = new _canvas_primitives_events__WEBPACK_IMPORTED_MODULE_1__.EventHandler();
        this.onMouseDown = new _canvas_primitives_events__WEBPACK_IMPORTED_MODULE_1__.EventHandler();
        this.onMouseUp = new _canvas_primitives_events__WEBPACK_IMPORTED_MODULE_1__.EventHandler();
        this.onMouseMove = new _canvas_primitives_events__WEBPACK_IMPORTED_MODULE_1__.EventHandler();
        this.onMouseOver = new _canvas_primitives_events__WEBPACK_IMPORTED_MODULE_1__.EventHandler();
        this.onMouseOut = new _canvas_primitives_events__WEBPACK_IMPORTED_MODULE_1__.EventHandler();
        this.subscriptions = [];
    }
    activate() {
        this.subscriptions.push((0,_canvas_primitives_events__WEBPACK_IMPORTED_MODULE_1__.createDomEventListener)(this.board.boardElement, "mousedown", e => {
            this.onBoardMouseDown(e);
        }));
        this.subscriptions.push((0,_canvas_primitives_events__WEBPACK_IMPORTED_MODULE_1__.createDomEventListener)(this.board.boardElement, "mouseup", e => {
            this.onBoardMouseUp(e);
        }));
        this.subscriptions.push((0,_canvas_primitives_events__WEBPACK_IMPORTED_MODULE_1__.createDomEventListener)(this.board.boardElement, "mousemove", e => {
            this.onBoardMouseMove(e);
        }));
    }
    deactivate() {
        (0,_canvas_primitives_events__WEBPACK_IMPORTED_MODULE_1__.unsubscribeAll)(this.subscriptions);
    }
    onBoardMouseDown(e) {
        e.preventDefault();
        e.stopPropagation();
        const modifierState = _canvas_utils_input_ModifierState__WEBPACK_IMPORTED_MODULE_2__.ModifierState.fromDomEvent(e);
        const mousePosition = (0,_canvas_primitives_dom__WEBPACK_IMPORTED_MODULE_0__.mousePositionToElement)(e, this.board.boardElement);
        const rayCastStack = this.getRayCastStack(mousePosition);
        this.pendingMouseClickEvent = new MouseClickEvent(mousePosition, modifierState, e.buttons, e.detail, rayCastStack);
        const event = new MouseDownEvent(mousePosition, modifierState, e.buttons, e.detail, rayCastStack);
        this.onMouseDown.dispatch(event);
        if (event.defaultPrevented) {
            this.pendingMouseClickEvent = undefined;
        }
    }
    onBoardMouseUp(e) {
        if (e.buttons == _canvas_utils_input_MouseButton__WEBPACK_IMPORTED_MODULE_3__.MouseButton.None) {
            e.preventDefault();
            const modifierState = _canvas_utils_input_ModifierState__WEBPACK_IMPORTED_MODULE_2__.ModifierState.fromDomEvent(e);
            const mousePosition = (0,_canvas_primitives_dom__WEBPACK_IMPORTED_MODULE_0__.mousePositionToElement)(e, this.board.boardElement);
            const rayCastStack = this.getRayCastStack(mousePosition);
            const event = new MouseUpEvent(mousePosition, modifierState, e.buttons, e.detail, rayCastStack);
            this.onMouseUp.dispatch(event);
            if (event.defaultPrevented) {
                this.pendingMouseClickEvent = undefined;
            }
            if (this.pendingMouseClickEvent !== undefined) {
                const pendingTarget = (0,_canvas_primitives_events__WEBPACK_IMPORTED_MODULE_1__.getTargetOfEventStack)(this.pendingMouseClickEvent.eventStack);
                if (pendingTarget === (0,_canvas_primitives_events__WEBPACK_IMPORTED_MODULE_1__.getTargetOfEventStack)(rayCastStack)) {
                    this.onMouseClick.dispatch(this.pendingMouseClickEvent);
                }
            }
        }
        this.pendingMouseClickEvent = undefined;
    }
    onBoardMouseMove(e) {
        const modifierState = _canvas_utils_input_ModifierState__WEBPACK_IMPORTED_MODULE_2__.ModifierState.fromDomEvent(e);
        const mousePosition = (0,_canvas_primitives_dom__WEBPACK_IMPORTED_MODULE_0__.mousePositionToElement)(e, this.board.boardElement);
        const rayCastStack = this.getRayCastStack(mousePosition);
        const target = (0,_canvas_primitives_events__WEBPACK_IMPORTED_MODULE_1__.getTargetOfEventStack)(rayCastStack);
        this.onMouseMove.dispatch(new MouseMoveEvent(mousePosition, modifierState, rayCastStack));
        const pendingTarget = this.pendingMouseOverStack === undefined
            ? undefined
            : (0,_canvas_primitives_events__WEBPACK_IMPORTED_MODULE_1__.getTargetOfEventStack)(this.pendingMouseOverStack);
        if (target !== pendingTarget) {
            if (pendingTarget !== undefined) {
                this.onMouseOut.dispatch(new MouseOutEvent(mousePosition, modifierState, this.pendingMouseOverStack));
            }
            if (target !== undefined) {
                this.onMouseOver.dispatch(new MouseOverEvent(mousePosition, modifierState, rayCastStack));
            }
        }
        this.pendingMouseOverStack = rayCastStack;
    }
    getRayCastStack(position) {
        const viewport = this.board.viewport;
        for (const object of this.board.objects.reversed()) {
            const stack = object.castRay(position, viewport);
            if (stack !== undefined) {
                return stack;
            }
        }
        return undefined;
    }
}


/***/ }),

/***/ "./src/canvas/board/controllers/objects/MoveObjectController.ts":
/*!**********************************************************************!*\
  !*** ./src/canvas/board/controllers/objects/MoveObjectController.ts ***!
  \**********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "MoveObjectController": () => (/* binding */ MoveObjectController),
/* harmony export */   "MoveObjectEvent": () => (/* binding */ MoveObjectEvent),
/* harmony export */   "showCanMoveCursor": () => (/* binding */ showCanMoveCursor),
/* harmony export */   "showMoveCursor": () => (/* binding */ showMoveCursor)
/* harmony export */ });
/* harmony import */ var _canvas_board_controllers_BoardMode__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @canvas/board/controllers/BoardMode */ "./src/canvas/board/controllers/BoardMode.ts");
/* harmony import */ var _canvas_board_objects_foundation_Group__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @canvas/board/objects/foundation/Group */ "./src/canvas/board/objects/foundation/Group.ts");
/* harmony import */ var _canvas_board_objects_foundation_RotateContainer__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @canvas/board/objects/foundation/RotateContainer */ "./src/canvas/board/objects/foundation/RotateContainer.ts");
/* harmony import */ var _canvas_board_objects_ui_selectable_Selectable__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @canvas/board/objects/ui/selectable/Selectable */ "./src/canvas/board/objects/ui/selectable/Selectable.ts");
/* harmony import */ var _canvas_primitives_dom__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @canvas/primitives/dom */ "./src/canvas/primitives/dom.ts");
/* harmony import */ var _canvas_primitives_events__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @canvas/primitives/events */ "./src/canvas/primitives/events.ts");
/* harmony import */ var _canvas_primitives_space__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @canvas/primitives/space */ "./src/canvas/primitives/space.ts");
/* harmony import */ var _canvas_render_Viewport__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @canvas/render/Viewport */ "./src/canvas/render/Viewport.ts");
/* harmony import */ var _config_bindings__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! @config/bindings */ "./src/config/bindings.ts");
/* harmony import */ var _config_draw__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! @config/draw */ "./src/config/draw.ts");
/* harmony import */ var _config_interaction__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! @config/interaction */ "./src/config/interaction.ts");











class MoveObjectEvent extends _canvas_primitives_events__WEBPACK_IMPORTED_MODULE_5__.EventBase {
    constructor(positionDelta, eventStack) {
        super(eventStack);
        this.positionDelta = positionDelta;
    }
}
class MoveObjectController {
    constructor(board) {
        this.board = board;
        this.onMove = new _canvas_primitives_events__WEBPACK_IMPORTED_MODULE_5__.EventHandler();
        this.subscriptions = [];
        // For moving state
        this.isMouseDown = false;
        this.moveSubscriptions = [];
    }
    activate() {
        const mouse = this.board.controller.mouse;
        this.subscriptions.push(mouse.onMouseDown.listen(undefined, e => {
            this.onMouseDown(e);
        }));
        this.subscriptions.push(mouse.onMouseUp.listen(undefined, e => {
            this.onMouseUp(e);
        }));
        const mode = this.board.controller.mode;
        this.subscriptions.push(mode.onEnter.listen(_canvas_board_controllers_BoardMode__WEBPACK_IMPORTED_MODULE_0__.BoardMode.Moving, () => {
            showMoveCursor();
        }));
        this.subscriptions.push(mode.onExit.listen(_canvas_board_controllers_BoardMode__WEBPACK_IMPORTED_MODULE_0__.BoardMode.Moving, () => {
            (0,_canvas_primitives_dom__WEBPACK_IMPORTED_MODULE_4__.resetCursor)();
        }));
    }
    deactivate() {
        (0,_canvas_primitives_events__WEBPACK_IMPORTED_MODULE_5__.unsubscribeAll)(this.subscriptions);
    }
    onMouseDown(e) {
        if (!(0,_canvas_board_controllers_BoardMode__WEBPACK_IMPORTED_MODULE_0__.canMove)(this.board.controller.mode.state)) {
            return;
        }
        if (!_config_bindings__WEBPACK_IMPORTED_MODULE_8__.Binding.Move.mousePress(e)) {
            return;
        }
        const selectable = (0,_canvas_board_objects_ui_selectable_Selectable__WEBPACK_IMPORTED_MODULE_3__.getTopSelectableOnEventStack)(e.eventStack);
        if (selectable === undefined) {
            return;
        }
        const select = this.board.controller.select;
        if (select.selectedObjects.has(selectable.content) &&
            selectable.options.canMove) {
            this.isMouseDown = true;
            this.moveTarget = e.target;
            this.lastPosition = e.position;
            this.moveSubscriptions.push(this.board.controller.mouse.onMouseMove.listen(undefined, e => {
                this.onMouseMove(e);
            }));
        }
    }
    onMouseUp(e) {
        if (!this.isMouseDown) {
            return;
        }
        this.isMouseDown = false;
        if (this.board.controller.mode.state === _canvas_board_controllers_BoardMode__WEBPACK_IMPORTED_MODULE_0__.BoardMode.Moving) {
            // Prevent click on release when multiple objects are moved
            // Otherwise, the object on cursor focus during movement
            // would be solely selected.
            e.stopPropagation();
            e.preventDefault();
            this.board.controller.mode.state = this.previousState;
            this.board.controller.guideline.clear();
        }
        if (e.eventStack && e.eventStack.indexOf(this.moveTarget) >= 0) {
            // Mouse up inside element
            showCanMoveCursor();
        }
        (0,_canvas_primitives_events__WEBPACK_IMPORTED_MODULE_5__.unsubscribeAll)(this.moveSubscriptions);
    }
    onMouseMove(e) {
        if (!this.isMouseDown) {
            return;
        }
        const rawPosition = e.position;
        const rawDelta = rawPosition.minus(this.lastPosition);
        const mode = this.board.controller.mode;
        if ((0,_canvas_board_controllers_BoardMode__WEBPACK_IMPORTED_MODULE_0__.canMove)(mode.state) && rawDelta.euclideanNorm >= _config_interaction__WEBPACK_IMPORTED_MODULE_10__.moveThreshold) {
            this.previousState = mode.state;
            mode.state = _canvas_board_controllers_BoardMode__WEBPACK_IMPORTED_MODULE_0__.BoardMode.Moving;
        }
        if (mode.state === _canvas_board_controllers_BoardMode__WEBPACK_IMPORTED_MODULE_0__.BoardMode.Moving) {
            const toggleSnap = _config_bindings__WEBPACK_IMPORTED_MODULE_8__.Binding.ToggleGuidelineSnap.modifiers(e);
            const snapGuideline = this.board.config.enableGuidelineSnap !== toggleSnap;
            let positionDelta;
            if (snapGuideline) {
                const snapDelta = this.updateGuidelines(rawDelta);
                positionDelta = snapDelta || rawDelta;
            }
            else {
                this.board.controller.guideline.clear();
                positionDelta = rawDelta;
            }
            this.lastPosition = this.lastPosition.plus(positionDelta);
            const select = this.board.controller.select;
            const movableObjects = [...select.selectedObjects].filter(object => select.getOptions(object).canMove);
            movableObjects.forEach(object => {
                this.onMove.dispatch(new MoveObjectEvent(positionDelta, [object]));
            });
        }
    }
    updateGuidelines(rawDelta) {
        const viewport = this.board.viewport;
        const selection = this.board.controller.select.selectedObjects;
        const guideline = this.board.controller.guideline;
        const worldDelta = viewport.toWorldSize(rawDelta);
        const bb = (0,_canvas_board_objects_foundation_Group__WEBPACK_IMPORTED_MODULE_1__.containingBoundingBox)([...selection].map(boardItem => (0,_canvas_board_objects_foundation_RotateContainer__WEBPACK_IMPORTED_MODULE_2__.rotateBoundingBox)(boardItem.boundingBox(_canvas_render_Viewport__WEBPACK_IMPORTED_MODULE_7__.Viewport.world), boardItem.radians)));
        const boundaries = [
            bb.position,
            bb.position.plus(bb.size),
            bb.position.plus(bb.size.scale(0.5)),
        ];
        guideline.clear();
        const delta = new _canvas_primitives_space__WEBPACK_IMPORTED_MODULE_6__.Vector2(this.getSnapDelta(boundaries, true, worldDelta), this.getSnapDelta(boundaries, false, worldDelta));
        return viewport.toViewportSize(delta);
    }
    getSnapDelta(boundaries, vertical, worldDelta) {
        const guidelineCtrl = this.board.controller.guideline;
        for (const position of boundaries) {
            const newPosition = position.plus(worldDelta);
            const guide = guidelineCtrl.getSnapGuide(newPosition, vertical);
            if (guide !== undefined) {
                guidelineCtrl.showGuides([guide]);
                const pos = vertical ? position.x : position.y;
                return guide.value - pos;
            }
        }
        return vertical ? worldDelta.x : worldDelta.y;
    }
}
function showMoveCursor() {
    (0,_canvas_primitives_dom__WEBPACK_IMPORTED_MODULE_4__.setCursor)(_config_draw__WEBPACK_IMPORTED_MODULE_9__.moveCursor);
}
function showCanMoveCursor() {
    (0,_canvas_primitives_dom__WEBPACK_IMPORTED_MODULE_4__.setCursor)(_config_draw__WEBPACK_IMPORTED_MODULE_9__.canMoveCursor);
}


/***/ }),

/***/ "./src/canvas/board/controllers/objects/ResizeObjectController.ts":
/*!************************************************************************!*\
  !*** ./src/canvas/board/controllers/objects/ResizeObjectController.ts ***!
  \************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "ResizeObjectController": () => (/* binding */ ResizeObjectController),
/* harmony export */   "ResizeObjectEvent": () => (/* binding */ ResizeObjectEvent),
/* harmony export */   "worldSpaceResize": () => (/* binding */ worldSpaceResize)
/* harmony export */ });
/* harmony import */ var _canvas_board_controllers_BoardMode__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @canvas/board/controllers/BoardMode */ "./src/canvas/board/controllers/BoardMode.ts");
/* harmony import */ var _canvas_board_objects_foundation_PositionAnchor__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @canvas/board/objects/foundation/PositionAnchor */ "./src/canvas/board/objects/foundation/PositionAnchor.ts");
/* harmony import */ var _canvas_board_objects_ui_selectable_ResizeHandle__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @canvas/board/objects/ui/selectable/ResizeHandle */ "./src/canvas/board/objects/ui/selectable/ResizeHandle.ts");
/* harmony import */ var _canvas_primitives_dom__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @canvas/primitives/dom */ "./src/canvas/primitives/dom.ts");
/* harmony import */ var _canvas_primitives_events__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @canvas/primitives/events */ "./src/canvas/primitives/events.ts");
/* harmony import */ var _canvas_primitives_space__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @canvas/primitives/space */ "./src/canvas/primitives/space.ts");






class ResizeObjectEvent extends _canvas_primitives_events__WEBPACK_IMPORTED_MODULE_4__.EventBase {
    constructor(size, fixture, modifiers, eventStack) {
        super(eventStack);
        this.size = size;
        this.fixture = fixture;
        this.modifiers = modifiers;
    }
}
class ResizeObjectController {
    constructor(board) {
        this.board = board;
        this.onResize = new _canvas_primitives_events__WEBPACK_IMPORTED_MODULE_4__.EventHandler();
        this.subscriptions = [];
        this.resizeSubscriptions = [];
        this.resizeHandle = undefined;
    }
    activate() {
        const mode = this.board.controller.mode;
        this.subscriptions.push(mode.onEnter.listen(_canvas_board_controllers_BoardMode__WEBPACK_IMPORTED_MODULE_0__.BoardMode.Resizing, () => {
            this.enterResizing();
        }));
        this.subscriptions.push(mode.onExit.listen(_canvas_board_controllers_BoardMode__WEBPACK_IMPORTED_MODULE_0__.BoardMode.Resizing, () => {
            this.exitResizing();
        }));
    }
    deactivate() {
        (0,_canvas_primitives_events__WEBPACK_IMPORTED_MODULE_4__.unsubscribeAll)(this.resizeSubscriptions);
    }
    startResizing(e) {
        const mode = this.board.controller.mode;
        if (!(0,_canvas_board_controllers_BoardMode__WEBPACK_IMPORTED_MODULE_0__.canResize)(mode.state)) {
            return;
        }
        this.resizeHandle = e.target;
        this.previousState = mode.state;
        this.board.controller.mode.state = _canvas_board_controllers_BoardMode__WEBPACK_IMPORTED_MODULE_0__.BoardMode.Resizing;
    }
    enterResizing() {
        this.resizeHandle.showResizingCursor();
        const mouse = this.board.controller.mouse;
        this.resizeSubscriptions.push(mouse.onMouseUp.listen(undefined, () => {
            this.board.controller.mode.state = this.previousState;
        }));
        this.resizeSubscriptions.push(mouse.onMouseMove.listen(undefined, e => {
            this.onResizeMove(e);
        }));
    }
    exitResizing() {
        this.resizeHandle = undefined;
        (0,_canvas_primitives_dom__WEBPACK_IMPORTED_MODULE_3__.resetCursor)();
        (0,_canvas_primitives_events__WEBPACK_IMPORTED_MODULE_4__.unsubscribeAll)(this.resizeSubscriptions);
    }
    onResizeMove(e) {
        var _a;
        if (this.board.controller.mode.state !== _canvas_board_controllers_BoardMode__WEBPACK_IMPORTED_MODULE_0__.BoardMode.Resizing) {
            return;
        }
        (_a = this.resizeHandle) === null || _a === void 0 ? void 0 : _a.showResizingCursor();
        const size = this.getResiseSize(e.position);
        const fixture = this.getResizeFixture();
        const content = this.resizeHandle.frame.overlay.selectable.content;
        this.onResize.dispatch(new ResizeObjectEvent(size, fixture, e.modifiers, [content]));
    }
    getResizeFixture() {
        switch (this.resizeHandle.positioning) {
            case _canvas_board_objects_ui_selectable_ResizeHandle__WEBPACK_IMPORTED_MODULE_2__.ResizeHandlePositioning.TopLeft:
            case _canvas_board_objects_ui_selectable_ResizeHandle__WEBPACK_IMPORTED_MODULE_2__.ResizeHandlePositioning.TopCenter:
            case _canvas_board_objects_ui_selectable_ResizeHandle__WEBPACK_IMPORTED_MODULE_2__.ResizeHandlePositioning.MiddleLeft:
                return _canvas_board_objects_foundation_PositionAnchor__WEBPACK_IMPORTED_MODULE_1__.AnchorPoint.BottomRight;
            case _canvas_board_objects_ui_selectable_ResizeHandle__WEBPACK_IMPORTED_MODULE_2__.ResizeHandlePositioning.MiddleRight:
            case _canvas_board_objects_ui_selectable_ResizeHandle__WEBPACK_IMPORTED_MODULE_2__.ResizeHandlePositioning.BottomRight:
            case _canvas_board_objects_ui_selectable_ResizeHandle__WEBPACK_IMPORTED_MODULE_2__.ResizeHandlePositioning.BottomCenter:
                return _canvas_board_objects_foundation_PositionAnchor__WEBPACK_IMPORTED_MODULE_1__.AnchorPoint.TopLeft;
            case _canvas_board_objects_ui_selectable_ResizeHandle__WEBPACK_IMPORTED_MODULE_2__.ResizeHandlePositioning.BottomLeft:
                return _canvas_board_objects_foundation_PositionAnchor__WEBPACK_IMPORTED_MODULE_1__.AnchorPoint.TopRight;
            case _canvas_board_objects_ui_selectable_ResizeHandle__WEBPACK_IMPORTED_MODULE_2__.ResizeHandlePositioning.TopRight:
                return _canvas_board_objects_foundation_PositionAnchor__WEBPACK_IMPORTED_MODULE_1__.AnchorPoint.BottomLeft;
        }
    }
    getResiseSize(mousePosition) {
        const viewport = this.board.viewport;
        const content = this.resizeHandle.frame.overlay.selectable.content;
        const contentBox = content.boundingBox(viewport);
        const topLeft = contentBox.position;
        const bottomRight = contentBox.position.plus(contentBox.size);
        mousePosition = mousePosition.rotate(-content.radians, viewport.toViewportPosition(content.rotationAround));
        let width = contentBox.size.x;
        let height = contentBox.size.y;
        // Width
        switch (this.resizeHandle.positioning) {
            case _canvas_board_objects_ui_selectable_ResizeHandle__WEBPACK_IMPORTED_MODULE_2__.ResizeHandlePositioning.TopLeft:
            case _canvas_board_objects_ui_selectable_ResizeHandle__WEBPACK_IMPORTED_MODULE_2__.ResizeHandlePositioning.BottomLeft:
            case _canvas_board_objects_ui_selectable_ResizeHandle__WEBPACK_IMPORTED_MODULE_2__.ResizeHandlePositioning.MiddleLeft:
                width += topLeft.x - mousePosition.x;
                break;
            case _canvas_board_objects_ui_selectable_ResizeHandle__WEBPACK_IMPORTED_MODULE_2__.ResizeHandlePositioning.TopRight:
            case _canvas_board_objects_ui_selectable_ResizeHandle__WEBPACK_IMPORTED_MODULE_2__.ResizeHandlePositioning.MiddleRight:
            case _canvas_board_objects_ui_selectable_ResizeHandle__WEBPACK_IMPORTED_MODULE_2__.ResizeHandlePositioning.BottomRight:
                width += -bottomRight.x + mousePosition.x;
                break;
        }
        // Height
        switch (this.resizeHandle.positioning) {
            case _canvas_board_objects_ui_selectable_ResizeHandle__WEBPACK_IMPORTED_MODULE_2__.ResizeHandlePositioning.TopLeft:
            case _canvas_board_objects_ui_selectable_ResizeHandle__WEBPACK_IMPORTED_MODULE_2__.ResizeHandlePositioning.TopCenter:
            case _canvas_board_objects_ui_selectable_ResizeHandle__WEBPACK_IMPORTED_MODULE_2__.ResizeHandlePositioning.TopRight:
                height += topLeft.y - mousePosition.y;
                break;
            case _canvas_board_objects_ui_selectable_ResizeHandle__WEBPACK_IMPORTED_MODULE_2__.ResizeHandlePositioning.BottomRight:
            case _canvas_board_objects_ui_selectable_ResizeHandle__WEBPACK_IMPORTED_MODULE_2__.ResizeHandlePositioning.BottomCenter:
            case _canvas_board_objects_ui_selectable_ResizeHandle__WEBPACK_IMPORTED_MODULE_2__.ResizeHandlePositioning.BottomLeft:
                height += -bottomRight.y + mousePosition.y;
                break;
        }
        return new _canvas_primitives_space__WEBPACK_IMPORTED_MODULE_5__.Vector2(width, height);
    }
}
function resizePosition(original, size, fixture) {
    switch (fixture) {
        case _canvas_board_objects_foundation_PositionAnchor__WEBPACK_IMPORTED_MODULE_1__.AnchorPoint.TopLeft:
            return original.position;
        case _canvas_board_objects_foundation_PositionAnchor__WEBPACK_IMPORTED_MODULE_1__.AnchorPoint.TopRight:
            return new _canvas_primitives_space__WEBPACK_IMPORTED_MODULE_5__.Vector2(original.position.x + original.size.x - size.x, original.position.y);
        case _canvas_board_objects_foundation_PositionAnchor__WEBPACK_IMPORTED_MODULE_1__.AnchorPoint.BottomRight:
            return new _canvas_primitives_space__WEBPACK_IMPORTED_MODULE_5__.Vector2(original.position.x + original.size.x - size.x, original.position.y + original.size.y - size.y);
        case _canvas_board_objects_foundation_PositionAnchor__WEBPACK_IMPORTED_MODULE_1__.AnchorPoint.BottomLeft:
            return new _canvas_primitives_space__WEBPACK_IMPORTED_MODULE_5__.Vector2(original.position.x, original.position.y + original.size.y - size.y);
    }
}
function worldSpaceResize(worldSize, fixture, worldOriginal, radians) {
    const worldPosition = resizePosition(worldOriginal, worldSize, fixture);
    if (radians != 0) {
        // Object is rotated.
        // When resizing, the center point of the object changes.
        // To keep all unchanged corners in their original position,
        // some adjustmends need to be done.
        // Old center point
        const center = worldOriginal.center();
        // Rotated new left top point with old center point
        const topLeft = worldPosition.rotate(radians, center);
        // Rotated new bottom right point with old center point
        const bottomRight = worldPosition
            .plus(worldSize)
            .rotate(radians, center);
        // New center point is center between these new points
        const newCenter = topLeft.plus(bottomRight).scale(0.5);
        // New top-left position is what you need to plug into the rotation
        // with newCenter to get to topLeft.
        // To get this position, reverse the rotation from earlier,
        // but not around center, but around newCenter
        const newPosition = topLeft.rotate(-radians, newCenter);
        return [newPosition, worldSize];
    }
    return [worldPosition, worldSize];
}


/***/ }),

/***/ "./src/canvas/board/controllers/objects/RotateObjectController.ts":
/*!************************************************************************!*\
  !*** ./src/canvas/board/controllers/objects/RotateObjectController.ts ***!
  \************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "RotateObjectController": () => (/* binding */ RotateObjectController),
/* harmony export */   "RotateObjectEvent": () => (/* binding */ RotateObjectEvent),
/* harmony export */   "showRotateCursor": () => (/* binding */ showRotateCursor)
/* harmony export */ });
/* harmony import */ var _canvas_board_controllers_BoardMode__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @canvas/board/controllers/BoardMode */ "./src/canvas/board/controllers/BoardMode.ts");
/* harmony import */ var _canvas_primitives_dom__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @canvas/primitives/dom */ "./src/canvas/primitives/dom.ts");
/* harmony import */ var _canvas_primitives_events__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @canvas/primitives/events */ "./src/canvas/primitives/events.ts");
/* harmony import */ var _config_bindings__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @config/bindings */ "./src/config/bindings.ts");
/* harmony import */ var _config_interaction__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @config/interaction */ "./src/config/interaction.ts");





class RotateObjectEvent extends _canvas_primitives_events__WEBPACK_IMPORTED_MODULE_2__.EventBase {
    constructor(radians, eventStack) {
        super(eventStack);
        this.radians = radians;
    }
}
class RotateObjectController {
    constructor(board) {
        this.board = board;
        this.onRotate = new _canvas_primitives_events__WEBPACK_IMPORTED_MODULE_2__.EventHandler();
        this.subscriptions = [];
        this.rotateSubscriptions = [];
    }
    activate() {
        const mode = this.board.controller.mode;
        this.subscriptions.push(mode.onEnter.listen(_canvas_board_controllers_BoardMode__WEBPACK_IMPORTED_MODULE_0__.BoardMode.Rotating, () => {
            this.enterRotating();
        }));
        this.subscriptions.push(mode.onExit.listen(_canvas_board_controllers_BoardMode__WEBPACK_IMPORTED_MODULE_0__.BoardMode.Rotating, () => {
            this.exitRotating();
        }));
    }
    deactivate() {
        (0,_canvas_primitives_events__WEBPACK_IMPORTED_MODULE_2__.unsubscribeAll)(this.rotateSubscriptions);
        (0,_canvas_primitives_events__WEBPACK_IMPORTED_MODULE_2__.unsubscribeAll)(this.subscriptions);
    }
    startRotating(e, target) {
        const mode = this.board.controller.mode;
        if (!(0,_canvas_board_controllers_BoardMode__WEBPACK_IMPORTED_MODULE_0__.canRotate)(mode.state)) {
            return;
        }
        this.rotationCenter = target.boundingBox(this.board.viewport).center();
        this.startCursorRadians = relativeRadians(e.position, this.rotationCenter);
        this.startObjectRadians = target.radians;
        this.previousState = mode.state;
        mode.state = _canvas_board_controllers_BoardMode__WEBPACK_IMPORTED_MODULE_0__.BoardMode.Rotating;
    }
    enterRotating() {
        const mode = this.board.controller.mode;
        const mouse = this.board.controller.mouse;
        this.rotateSubscriptions.push(mouse.onMouseUp.listen(undefined, () => {
            if (mode.state === _canvas_board_controllers_BoardMode__WEBPACK_IMPORTED_MODULE_0__.BoardMode.Rotating) {
                mode.state = this.previousState;
            }
        }));
        this.rotateSubscriptions.push(mouse.onMouseMove.listen(undefined, e => {
            this.onResizeMove(e);
        }));
        showRotateCursor();
    }
    exitRotating() {
        (0,_canvas_primitives_events__WEBPACK_IMPORTED_MODULE_2__.unsubscribeAll)(this.rotateSubscriptions);
        (0,_canvas_primitives_dom__WEBPACK_IMPORTED_MODULE_1__.resetCursor)();
    }
    onResizeMove(e) {
        const mode = this.board.controller.mode;
        if (mode.state !== _canvas_board_controllers_BoardMode__WEBPACK_IMPORTED_MODULE_0__.BoardMode.Rotating) {
            return;
        }
        const newCursorRadians = relativeRadians(e.position, this.rotationCenter);
        let newObjectRadians = newCursorRadians -
            this.startCursorRadians +
            this.startObjectRadians;
        if (_config_bindings__WEBPACK_IMPORTED_MODULE_3__.Binding.RotateStep.modifiers(e)) {
            newObjectRadians =
                Math.round(newObjectRadians / _config_interaction__WEBPACK_IMPORTED_MODULE_4__.rotateStepSize) * _config_interaction__WEBPACK_IMPORTED_MODULE_4__.rotateStepSize;
        }
        this.board.controller.select.selectedObjects.forEach(object => {
            this.onRotate.dispatch(new RotateObjectEvent(newObjectRadians, [object]));
        });
    }
}
function relativeRadians(cursorPosition, center) {
    const v = cursorPosition.minus(center);
    return Math.atan2(v.y, v.x);
}
function showRotateCursor() {
    // TODO: make this an image (disable cursor and render custom object)
    (0,_canvas_primitives_dom__WEBPACK_IMPORTED_MODULE_1__.setCursor)("alias");
}


/***/ }),

/***/ "./src/canvas/board/controllers/objects/SelectBoxController.ts":
/*!*********************************************************************!*\
  !*** ./src/canvas/board/controllers/objects/SelectBoxController.ts ***!
  \*********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "SelectBoxController": () => (/* binding */ SelectBoxController),
/* harmony export */   "findSelectables": () => (/* binding */ findSelectables)
/* harmony export */ });
/* harmony import */ var _ext_Set__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @ext/Set */ "./src/ext/Set.ts");
/* harmony import */ var _canvas_board_controllers_BoardMode__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @canvas/board/controllers/BoardMode */ "./src/canvas/board/controllers/BoardMode.ts");
/* harmony import */ var _canvas_board_objects_ui_SelectBoxFrame__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @canvas/board/objects/ui/SelectBoxFrame */ "./src/canvas/board/objects/ui/SelectBoxFrame.ts");
/* harmony import */ var _canvas_primitives_events__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @canvas/primitives/events */ "./src/canvas/primitives/events.ts");
/* harmony import */ var _canvas_primitives_space__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @canvas/primitives/space */ "./src/canvas/primitives/space.ts");
/* harmony import */ var _config_bindings__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @config/bindings */ "./src/config/bindings.ts");






class SelectBoxController {
    constructor(board) {
        this.board = board;
        this.onSelect = new _canvas_primitives_events__WEBPACK_IMPORTED_MODULE_3__.EventHandler();
        this.onDeselect = new _canvas_primitives_events__WEBPACK_IMPORTED_MODULE_3__.EventHandler();
        this.subscriptions = [];
        this.selectSubscriptions = [];
        this.activeSelectSubscriptions = [];
        this.isActive = false;
        this._selectedObjects = new Set();
        this._objectOptions = new Map();
        this.frame = new _canvas_board_objects_ui_SelectBoxFrame__WEBPACK_IMPORTED_MODULE_2__.SelectBoxFrame();
        this.startPosition = _canvas_primitives_space__WEBPACK_IMPORTED_MODULE_4__.Vector2.origin;
    }
    get selectedObjects() {
        return this._selectedObjects.immutable();
    }
    getOptions(boardItem) {
        return this._objectOptions.get(boardItem);
    }
    activate() {
        const mode = this.board.controller.mode;
        this.subscriptions.push(mode.onEnter.listen(_canvas_board_controllers_BoardMode__WEBPACK_IMPORTED_MODULE_1__.BoardMode.Select, () => {
            this.enterSelectMode();
        }));
        this.subscriptions.push(mode.onExit.listen(_canvas_board_controllers_BoardMode__WEBPACK_IMPORTED_MODULE_1__.BoardMode.Select, () => {
            this.exitSelectMode();
        }));
        this.subscriptions.push(this.board.onDespawn.listen(undefined, target => {
            if (this._selectedObjects.has(target)) {
                this._selectedObjects.delete(target);
            }
        }));
        if (mode.state === _canvas_board_controllers_BoardMode__WEBPACK_IMPORTED_MODULE_1__.BoardMode.Select) {
            this.enterSelectMode();
        }
    }
    deactivate() {
        this.exitSelectMode();
        (0,_canvas_primitives_events__WEBPACK_IMPORTED_MODULE_3__.unsubscribeAll)(this.subscriptions);
    }
    onMouseDown(e) {
        if (e.target !== undefined) {
            // Only activate a select box if dragging is started on the empty canvas
            return;
        }
        if (this.isActive) {
            return;
        }
        // Start select
        this.isActive = true;
        const mouse = this.board.controller.mouse;
        this.selectSubscriptions.push(mouse.onMouseMove.listen(undefined, e => {
            this.onSelectMove(e);
        }));
        const worldPosition = this.board.viewport.toWorldPosition(e.position);
        this.startPosition = worldPosition;
        this.frame.updateSize(worldPosition, _canvas_primitives_space__WEBPACK_IMPORTED_MODULE_4__.Vector2.origin);
        this.board.addObjectsAbove([this.frame], this.board.controller.minOverlayMarker);
    }
    onMouseUp(e) {
        if (this.isActive) {
            // End select
            this.isActive = false;
            (0,_canvas_primitives_events__WEBPACK_IMPORTED_MODULE_3__.unsubscribeAll)(this.activeSelectSubscriptions);
            this.board.removeObjects([this.frame]);
            const viewport = this.board.viewport;
            // Find objects in selection frame
            const worldPosition = viewport.toWorldPosition(e.position);
            const frameBox = _canvas_primitives_space__WEBPACK_IMPORTED_MODULE_4__.BoundingBox.normalized(viewport.toViewportPosition(this.startPosition), viewport.toViewportSize(worldPosition.minus(this.startPosition)));
            const selectCandidates = [];
            for (const object of this.board.objects) {
                for (const selectable of findSelectables(object)) {
                    const objectBox = selectable.boundingBox(this.board.viewport);
                    if ((0,_canvas_primitives_space__WEBPACK_IMPORTED_MODULE_4__.doBoundingBoxesOverlap)(frameBox, objectBox)) {
                        selectCandidates.push(selectable);
                    }
                }
            }
            const useMultiSelect = _config_bindings__WEBPACK_IMPORTED_MODULE_5__.Binding.MultiSelect.modifiers(e);
            if (useMultiSelect) {
                this.board.controller.select.toggleSelection(selectCandidates);
            }
            else {
                this.board.controller.select.selectMany(selectCandidates);
            }
        }
    }
    onSelectMove(e) {
        if (this.isActive) {
            const worldPosition = this.board.viewport.toWorldPosition(e.position);
            const size = worldPosition.minus(this.startPosition);
            this.frame.updateSize(this.startPosition, size);
        }
    }
    enterSelectMode() {
        const mouse = this.board.controller.mouse;
        this.selectSubscriptions.push(mouse.onMouseDown.listen(undefined, e => {
            this.onMouseDown(e);
        }));
        this.selectSubscriptions.push(mouse.onMouseUp.listen(undefined, e => {
            this.onMouseUp(e);
        }));
    }
    exitSelectMode() {
        (0,_canvas_primitives_events__WEBPACK_IMPORTED_MODULE_3__.unsubscribeAll)(this.selectSubscriptions);
    }
}
function findSelectables(object) {
    if ("isSelectable" in object) {
        const selectable = object;
        if (selectable.isSelectable) {
            return [selectable];
        }
    }
    if ("children" in object) {
        // TODO: Create abstract type to only contain children
        return object.children.map(findSelectables).flat();
    }
    return [];
}


/***/ }),

/***/ "./src/canvas/board/controllers/objects/SelectObjectController.ts":
/*!************************************************************************!*\
  !*** ./src/canvas/board/controllers/objects/SelectObjectController.ts ***!
  \************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "DeselectObjectEvent": () => (/* binding */ DeselectObjectEvent),
/* harmony export */   "SelectObjectController": () => (/* binding */ SelectObjectController),
/* harmony export */   "SelectObjectEvent": () => (/* binding */ SelectObjectEvent)
/* harmony export */ });
/* harmony import */ var _ext_Set__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @ext/Set */ "./src/ext/Set.ts");
/* harmony import */ var _canvas_board_controllers_BoardMode__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @canvas/board/controllers/BoardMode */ "./src/canvas/board/controllers/BoardMode.ts");
/* harmony import */ var _canvas_board_objects_ui_selectable_Selectable__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @canvas/board/objects/ui/selectable/Selectable */ "./src/canvas/board/objects/ui/selectable/Selectable.ts");
/* harmony import */ var _canvas_primitives_events__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @canvas/primitives/events */ "./src/canvas/primitives/events.ts");
/* harmony import */ var _config_bindings__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @config/bindings */ "./src/config/bindings.ts");





class SelectObjectEvent extends _canvas_primitives_events__WEBPACK_IMPORTED_MODULE_3__.EventBase {
    constructor(eventStack) {
        super(eventStack);
    }
}
class DeselectObjectEvent extends SelectObjectEvent {
}
class SelectObjectController {
    constructor(board) {
        this.board = board;
        this.onSelect = new _canvas_primitives_events__WEBPACK_IMPORTED_MODULE_3__.EventHandler();
        this.onDeselect = new _canvas_primitives_events__WEBPACK_IMPORTED_MODULE_3__.EventHandler();
        this.subscriptions = [];
        this.selectSubscriptions = [];
        this._selectedObjects = new Set();
        this._objectOptions = new Map();
    }
    get selectedObjects() {
        return this._selectedObjects.immutable();
    }
    getOptions(boardItem) {
        return this._objectOptions.get(boardItem);
    }
    activate() {
        const mode = this.board.controller.mode;
        this.subscriptions.push(mode.onEnter.listen(_canvas_board_controllers_BoardMode__WEBPACK_IMPORTED_MODULE_1__.BoardMode.Select, () => {
            this.enterSelect();
        }));
        this.subscriptions.push(mode.onExit.listen(_canvas_board_controllers_BoardMode__WEBPACK_IMPORTED_MODULE_1__.BoardMode.Select, () => {
            this.exitSelect();
        }));
        this.subscriptions.push(this.board.onDespawn.listen(undefined, target => {
            if (this._selectedObjects.has(target)) {
                this._selectedObjects.delete(target);
            }
        }));
        if (mode.state === _canvas_board_controllers_BoardMode__WEBPACK_IMPORTED_MODULE_1__.BoardMode.Select) {
            this.enterSelect();
        }
    }
    deactivate() {
        this.exitSelect();
        (0,_canvas_primitives_events__WEBPACK_IMPORTED_MODULE_3__.unsubscribeAll)(this.subscriptions);
    }
    selectOne(selectable) {
        this.selectMany([selectable]);
    }
    selectMany(selectables, exclusive = true) {
        if (exclusive) {
            const select = new Set(selectables.map(selectable => selectable.content));
            const deselect = [...this._selectedObjects].filter(item => !select.has(item));
            this.deselectMany(deselect);
        }
        selectables.forEach(selectable => {
            const item = selectable.content;
            const options = selectable.options;
            if (!this._selectedObjects.has(item)) {
                this._selectedObjects.add(item);
                this._objectOptions.set(item, options);
                this.onSelect.dispatch(new SelectObjectEvent([item]));
            }
        });
    }
    deselectMany(objects) {
        for (const object of objects) {
            this._selectedObjects.delete(object);
            this.onDeselect.dispatch(new DeselectObjectEvent([object]));
        }
    }
    deselectAll() {
        this.deselectMany([...this._selectedObjects]);
    }
    toggleSelection(selectables) {
        selectables.forEach(selectable => {
            const item = selectable.content;
            if (this._selectedObjects.has(item)) {
                this._selectedObjects.delete(item);
                this._objectOptions.delete(item);
                this.onDeselect.dispatch(new DeselectObjectEvent([item]));
            }
            else {
                this._selectedObjects.add(item);
                this._objectOptions.set(item, selectable.options);
                this.onSelect.dispatch(new SelectObjectEvent([item]));
            }
        });
    }
    onObjectMouseDown(e) {
        if (!(0,_canvas_board_controllers_BoardMode__WEBPACK_IMPORTED_MODULE_1__.canSelect)(this.board.controller.mode.state)) {
            return;
        }
        const selectable = (0,_canvas_board_objects_ui_selectable_Selectable__WEBPACK_IMPORTED_MODULE_2__.getTopSelectableOnEventStack)(e.eventStack);
        if (selectable === undefined) {
            return;
        }
        if (_config_bindings__WEBPACK_IMPORTED_MODULE_4__.Binding.SingleSelect.mousePress(e)) {
            // Only do single select on mousedown if there is only one selection
            if (this._selectedObjects.size <= 1) {
                this.selectOne(selectable);
            }
        }
        else if (_config_bindings__WEBPACK_IMPORTED_MODULE_4__.Binding.MultiSelect.mousePress(e)) {
            // Multi-select always works on mousedown because it's less distructive
            if (e.target !== undefined) {
                this.toggleSelection([selectable]);
            }
        }
    }
    onObjectClick(e) {
        if (!(0,_canvas_board_controllers_BoardMode__WEBPACK_IMPORTED_MODULE_1__.canSelect)(this.board.controller.mode.state)) {
            return;
        }
        const selectable = (0,_canvas_board_objects_ui_selectable_Selectable__WEBPACK_IMPORTED_MODULE_2__.getTopSelectableOnEventStack)(e.eventStack);
        if (selectable === undefined) {
            return;
        }
        if (_config_bindings__WEBPACK_IMPORTED_MODULE_4__.Binding.SingleSelect.mousePress(e)) {
            // Multiple selections: Perform single select that has not
            // been performed during mousedown
            if (this._selectedObjects.size > 1) {
                this.selectOne(selectable);
            }
        }
    }
    enterSelect() {
        const mouse = this.board.controller.mouse;
        this.selectSubscriptions.push(mouse.onMouseDown.listen(undefined, e => {
            this.onMouseDown(e);
        }));
    }
    exitSelect() {
        (0,_canvas_primitives_events__WEBPACK_IMPORTED_MODULE_3__.unsubscribeAll)(this.selectSubscriptions);
    }
    onMouseDown(e) {
        if (e.target === undefined &&
            (0,_canvas_board_controllers_BoardMode__WEBPACK_IMPORTED_MODULE_1__.canSelect)(this.board.controller.mode.state) &&
            _config_bindings__WEBPACK_IMPORTED_MODULE_4__.Binding.SingleSelect.mousePress(e) &&
            this._selectedObjects.size <= 1) {
            this.deselectAll();
        }
    }
}


/***/ }),

/***/ "./src/canvas/board/objects/GeometricObject.ts":
/*!*****************************************************!*\
  !*** ./src/canvas/board/objects/GeometricObject.ts ***!
  \*****************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "GeometricObject": () => (/* binding */ GeometricObject)
/* harmony export */ });
/* harmony import */ var _canvas_primitives_events__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @canvas/primitives/events */ "./src/canvas/primitives/events.ts");
/* harmony import */ var _canvas_primitives_space__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @canvas/primitives/space */ "./src/canvas/primitives/space.ts");


class GeometricObject {
    constructor() {
        this.subscriptions = [];
    }
    get needsRedraw() {
        return false;
    }
    onSpawn(board) {
        if (this.board !== undefined) {
            throw "Object already spawned";
        }
        this.board = board;
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    onDespawn(board) {
        if (this.board === undefined) {
            throw "Object not spawned";
        }
        (0,_canvas_primitives_events__WEBPACK_IMPORTED_MODULE_0__.unsubscribeAll)(this.subscriptions);
        this.board = undefined;
    }
    castRay(position, viewport) {
        if ((0,_canvas_primitives_space__WEBPACK_IMPORTED_MODULE_1__.rayInBoundingBox)(position, this.boundingBox(viewport))) {
            return [this];
        }
        return undefined;
    }
}


/***/ }),

/***/ "./src/canvas/board/objects/foundation/Group.ts":
/*!******************************************************!*\
  !*** ./src/canvas/board/objects/foundation/Group.ts ***!
  \******************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Group": () => (/* binding */ Group),
/* harmony export */   "containingBoundingBox": () => (/* binding */ containingBoundingBox)
/* harmony export */ });
/* harmony import */ var _canvas_board_Board__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @canvas/board/Board */ "./src/canvas/board/Board.ts");
/* harmony import */ var _canvas_board_objects_GeometricObject__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @canvas/board/objects/GeometricObject */ "./src/canvas/board/objects/GeometricObject.ts");
/* harmony import */ var _canvas_primitives_space__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @canvas/primitives/space */ "./src/canvas/primitives/space.ts");
/* harmony import */ var _canvas_render_CanvasLayer__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @canvas/render/CanvasLayer */ "./src/canvas/render/CanvasLayer.ts");
/* harmony import */ var _config_debug__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @config/debug */ "./src/config/debug.ts");





class Group extends _canvas_board_objects_GeometricObject__WEBPACK_IMPORTED_MODULE_1__.GeometricObject {
    constructor(_children = []) {
        super();
        this._children = _children;
    }
    get needsRedraw() {
        return this._children.some(child => child.needsRedraw);
    }
    boundingBox(viewport) {
        if (this._children.length > 0) {
            // Smallest bounding box containing all children
            const boundingBoxes = this._children.map(child => child.boundingBox(viewport));
            return containingBoundingBox(boundingBoxes);
        }
        return new _canvas_primitives_space__WEBPACK_IMPORTED_MODULE_2__.BoundingBox(new _canvas_primitives_space__WEBPACK_IMPORTED_MODULE_2__.Vector2(0, 0), new _canvas_primitives_space__WEBPACK_IMPORTED_MODULE_2__.Vector2(0, 0));
    }
    draw(renderCtx) {
        for (const child of this._children) {
            // Reset to default state
            renderCtx.ctx.save();
            child.draw(renderCtx);
            renderCtx.ctx.restore();
            if (_config_debug__WEBPACK_IMPORTED_MODULE_4__.DebugConfig.tintBoundingBoxes) {
                (0,_canvas_render_CanvasLayer__WEBPACK_IMPORTED_MODULE_3__.tintBoundingBox)(child, renderCtx);
            }
        }
    }
    castRay(position, viewport) {
        // Children are sorted highest to lowest
        // For raycast, top-to-bottom is needed, hence: reverse iteration
        for (const child of this._children.reversed()) {
            const stack = child.castRay(position, viewport);
            if (stack !== undefined) {
                stack.push(this);
                return stack;
            }
        }
        return undefined;
    }
    get children() {
        return this._children;
    }
    set children(children) {
        if (this.board !== undefined) {
            const oldSet = new Set(this._children);
            const newSet = new Set(children);
            // Despawn old ones not there any more
            const despawned = this._children.filter(child => !newSet.has(child));
            const spawned = children.filter(child => !oldSet.has(child));
            despawned.forEach(child => {
                child.onDespawn(this.board);
            });
            spawned.forEach(child => {
                child.onSpawn(this.board);
            });
        }
        this._children = children;
        this.markDirty();
    }
    onSpawn(board) {
        super.onSpawn(board);
        this._children.forEach(child => {
            child.onSpawn(board);
            board.onSpawn.dispatch(new _canvas_board_Board__WEBPACK_IMPORTED_MODULE_0__.SpawnEvent([child]));
        });
        this.board = board;
    }
    onDespawn(board) {
        this._children.forEach(child => {
            child.onDespawn(board);
            board.onDespawn.dispatch(new _canvas_board_Board__WEBPACK_IMPORTED_MODULE_0__.DespawnEvent([child]));
        });
        super.onDespawn(board);
        this.board = undefined;
    }
    markDirty() {
        if (this.board !== undefined) {
            this.board.markDirtyObject(this);
        }
    }
}
function containingBoundingBox(boundingBoxes) {
    const minX = Math.min(...boundingBoxes.map(b => b.position.x));
    const minY = Math.min(...boundingBoxes.map(b => b.position.y));
    const maxX = Math.max(...boundingBoxes.map(b => b.position.x + b.size.x));
    const maxY = Math.max(...boundingBoxes.map(b => b.position.y + b.size.y));
    return new _canvas_primitives_space__WEBPACK_IMPORTED_MODULE_2__.BoundingBox(new _canvas_primitives_space__WEBPACK_IMPORTED_MODULE_2__.Vector2(minX, minY), new _canvas_primitives_space__WEBPACK_IMPORTED_MODULE_2__.Vector2(maxX - minX, maxY - minY));
}


/***/ }),

/***/ "./src/canvas/board/objects/foundation/LayerMarker.ts":
/*!************************************************************!*\
  !*** ./src/canvas/board/objects/foundation/LayerMarker.ts ***!
  \************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "LayerMarker": () => (/* binding */ LayerMarker)
/* harmony export */ });
/* harmony import */ var _canvas_board_objects_GeometricObject__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @canvas/board/objects/GeometricObject */ "./src/canvas/board/objects/GeometricObject.ts");
/* harmony import */ var _canvas_primitives_space__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @canvas/primitives/space */ "./src/canvas/primitives/space.ts");


const boundingBox = new _canvas_primitives_space__WEBPACK_IMPORTED_MODULE_1__.BoundingBox(_canvas_primitives_space__WEBPACK_IMPORTED_MODULE_1__.Vector2.origin, _canvas_primitives_space__WEBPACK_IMPORTED_MODULE_1__.Vector2.origin);
class LayerMarker extends _canvas_board_objects_GeometricObject__WEBPACK_IMPORTED_MODULE_0__.GeometricObject {
    boundingBox() {
        return boundingBox;
    }
    draw() {
        // Do nothing
    }
    castRay() {
        return undefined;
    }
}


/***/ }),

/***/ "./src/canvas/board/objects/foundation/PositionAnchor.ts":
/*!***************************************************************!*\
  !*** ./src/canvas/board/objects/foundation/PositionAnchor.ts ***!
  \***************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "AnchorPoint": () => (/* binding */ AnchorPoint),
/* harmony export */   "PositionAnchor": () => (/* binding */ PositionAnchor)
/* harmony export */ });
/* harmony import */ var _canvas_primitives_space__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @canvas/primitives/space */ "./src/canvas/primitives/space.ts");

var AnchorPoint;
(function (AnchorPoint) {
    AnchorPoint[AnchorPoint["TopLeft"] = 0] = "TopLeft";
    AnchorPoint[AnchorPoint["TopRight"] = 1] = "TopRight";
    AnchorPoint[AnchorPoint["BottomRight"] = 2] = "BottomRight";
    AnchorPoint[AnchorPoint["BottomLeft"] = 3] = "BottomLeft";
})(AnchorPoint || (AnchorPoint = {}));
class PositionAnchor {
    constructor(anchorTo, anchorPoint = AnchorPoint.TopLeft, offset = _canvas_primitives_space__WEBPACK_IMPORTED_MODULE_0__.Vector2.origin) {
        this.anchorTo = anchorTo;
        this.anchorPoint = anchorPoint;
        this.offset = offset;
    }
    position(viewport) {
        const boundingBox = this.anchorTo.boundingBox(viewport);
        const position = boundingBox.position.plus(this.offset);
        switch (this.anchorPoint) {
            case AnchorPoint.TopLeft:
                return position;
            case AnchorPoint.TopRight:
                return position.plus(new _canvas_primitives_space__WEBPACK_IMPORTED_MODULE_0__.Vector2(boundingBox.size.x, 0));
            case AnchorPoint.BottomLeft:
                return position.plus(new _canvas_primitives_space__WEBPACK_IMPORTED_MODULE_0__.Vector2(0, boundingBox.size.y));
            case AnchorPoint.BottomRight:
                return position.plus(new _canvas_primitives_space__WEBPACK_IMPORTED_MODULE_0__.Vector2(boundingBox.size.x, boundingBox.size.y));
        }
    }
}


/***/ }),

/***/ "./src/canvas/board/objects/foundation/RotateContainer.ts":
/*!****************************************************************!*\
  !*** ./src/canvas/board/objects/foundation/RotateContainer.ts ***!
  \****************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "RotateContainer": () => (/* binding */ RotateContainer),
/* harmony export */   "rotateBoundingBox": () => (/* binding */ rotateBoundingBox)
/* harmony export */ });
/* harmony import */ var _canvas_board_objects_GeometricObject__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @canvas/board/objects/GeometricObject */ "./src/canvas/board/objects/GeometricObject.ts");
/* harmony import */ var _canvas_primitives_space__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @canvas/primitives/space */ "./src/canvas/primitives/space.ts");
/* harmony import */ var _canvas_render_CanvasLayer__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @canvas/render/CanvasLayer */ "./src/canvas/render/CanvasLayer.ts");
/* harmony import */ var _config_debug__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @config/debug */ "./src/config/debug.ts");




class RotateContainer extends _canvas_board_objects_GeometricObject__WEBPACK_IMPORTED_MODULE_0__.GeometricObject {
    constructor(content, positionable) {
        super();
        this.content = content;
        this.positionable = positionable;
    }
    boundingBox(viewport) {
        return rotateBoundingBox(this.content.boundingBox(viewport), this.positionable.radians, this.getRotationCenter(viewport));
    }
    draw(renderCtx) {
        const radians = this.positionable.radians;
        setRenderContextRotation(renderCtx, radians, this.getRotationCenter(renderCtx.viewport));
        if (_config_debug__WEBPACK_IMPORTED_MODULE_3__.DebugConfig.tintBoundingBoxes) {
            (0,_canvas_render_CanvasLayer__WEBPACK_IMPORTED_MODULE_2__.tintBoundingBox)(this.content, renderCtx);
        }
        this.content.draw(renderCtx);
    }
    castRay(position, viewport) {
        const radians = this.positionable.radians;
        // Counter-rotate ray position, not content bounding box
        position = position.rotate(-radians, this.getRotationCenter(viewport));
        const stack = this.content.castRay(position, viewport);
        if (stack !== undefined) {
            stack.push(this);
        }
        return stack;
    }
    onSpawn(board) {
        super.onSpawn(board);
        this.content.onSpawn(board);
    }
    onDespawn(board) {
        this.content.onDespawn(board);
        super.onDespawn(board);
    }
    getRotationCenter(viewport) {
        return viewport.toViewportPosition(this.positionable.rotationAround);
    }
}
function rotateBoundingBox(boundingBox, radians, around = boundingBox.center()) {
    if (radians == 0) {
        return boundingBox;
    }
    const corners = boundingBoxCorners(boundingBox).map(point => point.rotate(radians, around));
    return boundingBoxOfPoints(corners);
}
function setRenderContextRotation(renderCtx, radians, around) {
    if (radians != 0) {
        renderCtx.ctx.translate(around.x, around.y);
        // Canvas rotation is clock-wise, hence needs to me inverted
        renderCtx.ctx.rotate(radians);
        renderCtx.ctx.translate(-around.x, -around.y);
    }
}
function boundingBoxCorners(boundingBox) {
    return [
        // Top left
        boundingBox.position,
        // Top right
        new _canvas_primitives_space__WEBPACK_IMPORTED_MODULE_1__.Vector2(boundingBox.position.x + boundingBox.size.x, boundingBox.position.y),
        // Bottom right
        new _canvas_primitives_space__WEBPACK_IMPORTED_MODULE_1__.Vector2(boundingBox.position.x + boundingBox.size.x, boundingBox.position.y + boundingBox.size.y),
        // Bottom left
        new _canvas_primitives_space__WEBPACK_IMPORTED_MODULE_1__.Vector2(boundingBox.position.x, boundingBox.position.y + boundingBox.size.y),
    ];
}
function boundingBoxOfPoints(points) {
    let minX = Number.POSITIVE_INFINITY;
    let maxX = Number.NEGATIVE_INFINITY;
    let minY = Number.POSITIVE_INFINITY;
    let maxY = Number.NEGATIVE_INFINITY;
    for (const point of points) {
        minX = Math.min(minX, point.x);
        maxX = Math.max(maxX, point.x);
        minY = Math.min(minY, point.y);
        maxY = Math.max(maxY, point.y);
    }
    return new _canvas_primitives_space__WEBPACK_IMPORTED_MODULE_1__.BoundingBox(new _canvas_primitives_space__WEBPACK_IMPORTED_MODULE_1__.Vector2(minX, minY), new _canvas_primitives_space__WEBPACK_IMPORTED_MODULE_1__.Vector2(maxX - minX, maxY - minY));
}


/***/ }),

/***/ "./src/canvas/board/objects/items/BlockText.ts":
/*!*****************************************************!*\
  !*** ./src/canvas/board/objects/items/BlockText.ts ***!
  \*****************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "BlockText": () => (/* binding */ BlockText)
/* harmony export */ });
/* harmony import */ var _canvas_board_controllers_objects_ResizeObjectController__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @canvas/board/controllers/objects/ResizeObjectController */ "./src/canvas/board/controllers/objects/ResizeObjectController.ts");
/* harmony import */ var _canvas_board_objects_foundation_PositionAnchor__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @canvas/board/objects/foundation/PositionAnchor */ "./src/canvas/board/objects/foundation/PositionAnchor.ts");
/* harmony import */ var _canvas_board_objects_items_TextItem__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @canvas/board/objects/items/TextItem */ "./src/canvas/board/objects/items/TextItem.ts");
/* harmony import */ var _canvas_board_objects_ui_selectable_ResizeHandle__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @canvas/board/objects/ui/selectable/ResizeHandle */ "./src/canvas/board/objects/ui/selectable/ResizeHandle.ts");
/* harmony import */ var _canvas_board_objects_ui_selectable_Selectable__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @canvas/board/objects/ui/selectable/Selectable */ "./src/canvas/board/objects/ui/selectable/Selectable.ts");
/* harmony import */ var _canvas_primitives_space__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @canvas/primitives/space */ "./src/canvas/primitives/space.ts");






class BlockText extends _canvas_board_objects_items_TextItem__WEBPACK_IMPORTED_MODULE_2__.TextItem {
    constructor(text, textColor, fontSize, font, position, size, radians = 0, isFixed = false) {
        super(textColor, fontSize, font, position, size, radians, isFixed);
        this.isBlockText = true;
        this.selectionOptions = new _canvas_board_objects_ui_selectable_Selectable__WEBPACK_IMPORTED_MODULE_4__.SelectionOptions(true, true, true, [
            _canvas_board_objects_ui_selectable_ResizeHandle__WEBPACK_IMPORTED_MODULE_3__.ResizeHandlePositioning.MiddleLeft,
            _canvas_board_objects_ui_selectable_ResizeHandle__WEBPACK_IMPORTED_MODULE_3__.ResizeHandlePositioning.MiddleRight,
        ]);
        this.text = text;
    }
    get text() {
        return this._text;
    }
    set text(text) {
        this._text = text;
        this.markDirty();
    }
    draw(renderCtx) {
        this.updateForRender(renderCtx);
        super.draw(renderCtx);
    }
    updateForRender(renderCtx) {
        if (this.dirtyText || this.computeInitial) {
            this.updateWrapping(renderCtx);
            this.updateSize(renderCtx);
            this.dirtyText = false;
            this.computeInitial = false;
        }
    }
    onResize(e) {
        if (this.board === undefined) {
            return;
        }
        const worldSize = this.board.viewport.toWorldSize(e.size);
        const size = new _canvas_primitives_space__WEBPACK_IMPORTED_MODULE_5__.Vector2(Math.max(this._fontSize, worldSize.x), this.size.y);
        [this.position, this.size] = (0,_canvas_board_controllers_objects_ResizeObjectController__WEBPACK_IMPORTED_MODULE_0__.worldSpaceResize)(size, e.fixture, new _canvas_primitives_space__WEBPACK_IMPORTED_MODULE_5__.BoundingBox(this.position, this.size), this.radians);
        this.markDirty();
    }
    updateTextarea() {
        if (this.textarea === undefined) {
            return;
        }
        const viewport = this.board.viewport;
        const bb = this.boundingBox(viewport);
        const fontSize = viewport.zoomLevel * this._fontSize;
        this.textarea.style.left = `${bb.position.x}px`;
        this.textarea.style.top = `${bb.position.y}px`;
        this.textarea.style.width = `${bb.size.x}px`;
        this.textarea.style.height = `${bb.size.y}px`;
        if (this.radians != 0) {
            this.textarea.style.transform = `rotate(${this.radians}rad)`;
            this.textarea.style.transformOrigin = `${bb.size.x / 2}px ${bb.size.y / 2}px`;
        }
        this.textarea.style.font = this.font.toCss(fontSize);
        this.textarea.style.lineHeight = `${fontSize}px`;
        this.textarea.scrollTop = 0;
    }
    updateWrapping(renderCtx) {
        const lines = this._text.split("\n");
        const width = (_canvas_board_objects_items_TextItem__WEBPACK_IMPORTED_MODULE_2__.MEASURE_FONT_SIZE / this._fontSize) * this._size.x;
        renderCtx.ctx.save();
        renderCtx.ctx.font = this.font.toCss(_canvas_board_objects_items_TextItem__WEBPACK_IMPORTED_MODULE_2__.MEASURE_FONT_SIZE);
        const wrappedLines = lines.map(line => wrapLine(renderCtx, line, width));
        renderCtx.ctx.restore();
        this.lines = [].concat(...wrappedLines);
    }
    updateSize(renderCtx) {
        const height = this.lines.length * this._fontSize;
        const newSize = new _canvas_primitives_space__WEBPACK_IMPORTED_MODULE_5__.Vector2(this._size.x, height);
        if (this.computeInitial) {
            this.size = newSize;
        }
        else {
            [this.position, this.size] = (0,_canvas_board_controllers_objects_ResizeObjectController__WEBPACK_IMPORTED_MODULE_0__.worldSpaceResize)(newSize, _canvas_board_objects_foundation_PositionAnchor__WEBPACK_IMPORTED_MODULE_1__.AnchorPoint.TopLeft, new _canvas_primitives_space__WEBPACK_IMPORTED_MODULE_5__.BoundingBox(this.position, this._size), this.radians);
        }
        const measureFontSize = Math.min(_canvas_board_objects_items_TextItem__WEBPACK_IMPORTED_MODULE_2__.MEASURE_FONT_SIZE, this._fontSize);
        const ascent = measureAscent(this.lines, this.font.toCss(measureFontSize), renderCtx);
        this.ascent = (this._fontSize / measureFontSize) * ascent;
    }
}
function measureAscent(lines, font, renderCtx) {
    renderCtx.ctx.save();
    renderCtx.ctx.font = font;
    for (const line of lines) {
        const metrics = renderCtx.ctx.measureText(line);
        if (metrics.actualBoundingBoxAscent > 0) {
            return metrics.actualBoundingBoxAscent;
        }
    }
    renderCtx.ctx.restore();
    return 0;
}
function wrapLine(renderCtx, unwrapped, maxWidth) {
    const metrics = renderCtx.ctx.measureText(unwrapped);
    if (metrics.width <= maxWidth) {
        return [unwrapped];
    }
    const wrapped = [""];
    const words = unwrapped.split(" ");
    for (const word of words) {
        const i = wrapped.length - 1;
        const pending = wrapped[i];
        // First attempt: word-wrapping
        const testLine = pending + word;
        const metrics = renderCtx.ctx.measureText(testLine);
        if (metrics.width > maxWidth) {
            const wordMetrics = renderCtx.ctx.measureText(word);
            if (wordMetrics.width > maxWidth) {
                // Even one word does not fit:
                // Fall back to character wrapping
                if (pending.length == 0) {
                    wrapped.pop();
                }
                wrapped.push(...wrapWord(renderCtx, word, maxWidth));
            }
            else {
                wrapped.push(word + " ");
            }
        }
        else {
            // Word still fits, add it to current line
            wrapped[i] = testLine + " ";
        }
    }
    return wrapped;
}
function wrapWord(renderCtx, unwrapped, maxWidth) {
    const n = unwrapped.length;
    const wrapped = [];
    let pending = "";
    for (let i = 0; i < n; ++i) {
        const testLine = pending + unwrapped[i];
        const metrics = renderCtx.ctx.measureText(testLine);
        if (metrics.width > maxWidth) {
            wrapped.push(pending);
            pending = unwrapped[i];
        }
        else {
            pending = testLine;
        }
    }
    if (pending.length > 0) {
        wrapped.push(pending + " ");
    }
    return wrapped;
}


/***/ }),

/***/ "./src/canvas/board/objects/items/BoardItem.ts":
/*!*****************************************************!*\
  !*** ./src/canvas/board/objects/items/BoardItem.ts ***!
  \*****************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "BoardItem": () => (/* binding */ BoardItem)
/* harmony export */ });
/* harmony import */ var _canvas_board_controllers_objects_ResizeObjectController__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @canvas/board/controllers/objects/ResizeObjectController */ "./src/canvas/board/controllers/objects/ResizeObjectController.ts");
/* harmony import */ var _canvas_board_objects_GeometricObject__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @canvas/board/objects/GeometricObject */ "./src/canvas/board/objects/GeometricObject.ts");
/* harmony import */ var _canvas_board_objects_ui_selectable_Selectable__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @canvas/board/objects/ui/selectable/Selectable */ "./src/canvas/board/objects/ui/selectable/Selectable.ts");
/* harmony import */ var _canvas_primitives_space__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @canvas/primitives/space */ "./src/canvas/primitives/space.ts");




class BoardItem extends _canvas_board_objects_GeometricObject__WEBPACK_IMPORTED_MODULE_1__.GeometricObject {
    constructor(_position, _size, _radians = 0, isFixed = false) {
        super();
        this._position = _position;
        this._size = _size;
        this._radians = _radians;
        this.isFixed = isFixed;
        this.isBoardItem = true;
        this.selectionOptions = new _canvas_board_objects_ui_selectable_Selectable__WEBPACK_IMPORTED_MODULE_2__.SelectionOptions(true, true, true);
    }
    get position() {
        return this._position;
    }
    set position(position) {
        var _a;
        this._position = position;
        (_a = this.board) === null || _a === void 0 ? void 0 : _a.markDirtyObject(this);
    }
    get size() {
        return this._size;
    }
    set size(size) {
        var _a;
        this._size = size;
        (_a = this.board) === null || _a === void 0 ? void 0 : _a.markDirtyObject(this);
    }
    get radians() {
        return this._radians;
    }
    set radians(radians) {
        var _a;
        this._radians = radians;
        (_a = this.board) === null || _a === void 0 ? void 0 : _a.markDirtyObject(this);
    }
    get rotationAround() {
        return new _canvas_primitives_space__WEBPACK_IMPORTED_MODULE_3__.BoundingBox(this.position, this.size).center();
    }
    boundingBox(viewport) {
        const position = this.positionInViewport(viewport);
        const size = this.sizeInViewport(viewport);
        return new _canvas_primitives_space__WEBPACK_IMPORTED_MODULE_3__.BoundingBox(position, size);
    }
    onSpawn(board) {
        super.onSpawn(board);
        this.subscriptions.push(board.controller.move.onMove.listen(this, e => {
            this.onMove(e);
        }));
        this.subscriptions.push(board.controller.resize.onResize.listen(this, e => {
            this.onResize(e);
        }));
        this.subscriptions.push(board.controller.rotate.onRotate.listen(this, e => {
            this.onRotate(e);
        }));
    }
    positionInViewport(viewport) {
        return this.isFixed
            ? this._position
            : viewport.toViewportPosition(this._position);
    }
    sizeInViewport(viewport) {
        return this.isFixed ? this._size : viewport.toViewportSize(this._size);
    }
    onResize(e) {
        if (this.board === undefined) {
            return;
        }
        const worldSize = this.board.viewport.toWorldSize(e.size);
        const size = new _canvas_primitives_space__WEBPACK_IMPORTED_MODULE_3__.Vector2(Math.max(1, worldSize.x), Math.max(1, worldSize.y));
        [this.position, this.size] = (0,_canvas_board_controllers_objects_ResizeObjectController__WEBPACK_IMPORTED_MODULE_0__.worldSpaceResize)(size, e.fixture, new _canvas_primitives_space__WEBPACK_IMPORTED_MODULE_3__.BoundingBox(this.position, this.size), this.radians);
    }
    onMove(e) {
        const delta = this.isFixed
            ? e.positionDelta
            : this.board.viewport.toWorldSize(e.positionDelta);
        this.position = this.position.plus(delta);
    }
    onRotate(e) {
        if (this.board === undefined) {
            return;
        }
        this.radians = e.radians;
    }
}


/***/ }),

/***/ "./src/canvas/board/objects/items/ImageItem.ts":
/*!*****************************************************!*\
  !*** ./src/canvas/board/objects/items/ImageItem.ts ***!
  \*****************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "ImageItem": () => (/* binding */ ImageItem),
/* harmony export */   "ImageSet": () => (/* binding */ ImageSet),
/* harmony export */   "ImageVariant": () => (/* binding */ ImageVariant),
/* harmony export */   "cropSize": () => (/* binding */ cropSize)
/* harmony export */ });
/* harmony import */ var _canvas_board_controllers_objects_ResizeObjectController__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @canvas/board/controllers/objects/ResizeObjectController */ "./src/canvas/board/controllers/objects/ResizeObjectController.ts");
/* harmony import */ var _canvas_board_objects_foundation_PositionAnchor__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @canvas/board/objects/foundation/PositionAnchor */ "./src/canvas/board/objects/foundation/PositionAnchor.ts");
/* harmony import */ var _canvas_board_objects_items_BoardItem__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @canvas/board/objects/items/BoardItem */ "./src/canvas/board/objects/items/BoardItem.ts");
/* harmony import */ var _canvas_primitives_space__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @canvas/primitives/space */ "./src/canvas/primitives/space.ts");
/* harmony import */ var _config_bindings__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @config/bindings */ "./src/config/bindings.ts");
/* harmony import */ var _config_draw__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @config/draw */ "./src/config/draw.ts");






class ImageVariant {
    constructor(definition, original = definition) {
        this.url = definition.url;
        this.size = new _canvas_primitives_space__WEBPACK_IMPORTED_MODULE_3__.Vector2(definition.width, definition.height);
        this.scale = definition.width / original.width;
    }
    get image() {
        return this._image;
    }
    load() {
        if (this._pendingPromise === undefined) {
            this._pendingPromise = new Promise((resolve, reject) => {
                if (this._image !== undefined) {
                    return resolve();
                }
                const image = new Image();
                image.onload = () => {
                    this._image = image;
                    this._pendingPromise = undefined;
                    resolve();
                };
                image.onerror = e => {
                    this._pendingPromise = undefined;
                    reject(e);
                };
                image.src = this.url;
            });
        }
        return this._pendingPromise;
    }
    unload() {
        this._image = undefined;
    }
}
class ImageSet {
    constructor(original, thumbnails = []) {
        this.original = new ImageVariant(original);
        const variants = [original, ...thumbnails].map(def => new ImageVariant(def, original));
        this.variants = variants.sort((a, b) => a.scale - b.scale);
    }
    load(scale) {
        let promise = undefined;
        const variant = this.get(scale);
        if (this.bestLoaded === undefined ||
            variant.scale > this.bestLoaded.scale) {
            // TODO: debounce to not load intermediates during zooming
            promise = this.loadVariant(variant);
        }
        const current = variant.image === undefined ? this.bestLoaded : variant;
        return [current, promise];
    }
    loadVariant(variant) {
        return variant
            .load()
            .then(() => {
            var _a;
            if (this.bestLoaded === undefined ||
                variant.scale > this.bestLoaded.scale) {
                (_a = this.bestLoaded) === null || _a === void 0 ? void 0 : _a.unload();
                this.bestLoaded = variant;
            }
        })
            .catch(e => {
            console.error(e);
            if (this.bestLoaded === undefined) {
                // Error loading image
                // Still mark this as best loaded to
                // not trigger reload of missing image
                this.bestLoaded = variant;
            }
        });
    }
    get(scale) {
        for (const variant of this.variants) {
            if (variant.scale >= scale) {
                return variant;
            }
        }
        return this.original;
    }
}
class ImageItem extends _canvas_board_objects_items_BoardItem__WEBPACK_IMPORTED_MODULE_2__.BoardItem {
    constructor(imageSet, position, radians = 0, isFixed = false, 
    // Size of cropped and scaled image
    size = imageSet.original.size, 
    // Crop offset (top-left) of original image
    _crop = _canvas_primitives_space__WEBPACK_IMPORTED_MODULE_3__.Vector2.origin, 
    // Scale (of uncropped image) relative to original image
    _scale = 1) {
        super(position, size, radians, isFixed);
        this.imageSet = imageSet;
        this._crop = _crop;
        this._scale = _scale;
        this.isImageItem = true;
    }
    get crop() {
        return this._crop;
    }
    get scale() {
        return this._scale;
    }
    draw(renderCtx) {
        const viewport = renderCtx.viewport;
        const zoomLevel = viewport.zoomLevel;
        const [imageVariant, onLoad] = this.imageSet.load(zoomLevel * this._scale);
        if (onLoad !== undefined) {
            void onLoad.then(() => {
                var _a;
                (_a = this.board) === null || _a === void 0 ? void 0 : _a.markDirtyObject(this);
            });
        }
        const position = this.positionInViewport(viewport);
        const size = this.sizeInViewport(viewport);
        if ((imageVariant === null || imageVariant === void 0 ? void 0 : imageVariant.image) === undefined) {
            renderCtx.ctx.fillStyle = _config_draw__WEBPACK_IMPORTED_MODULE_5__.imageMissingColor;
            renderCtx.ctx.fillRect(position.x, position.y, size.x, size.y);
        }
        else {
            const sourcePos = this._crop.scale(imageVariant.scale);
            const sourceSize = this.size.scale(imageVariant.scale / this._scale);
            renderCtx.ctx.drawImage(imageVariant.image, sourcePos.x, sourcePos.y, sourceSize.x, sourceSize.y, position.x, position.y, size.x, size.y);
        }
    }
    onResize(e) {
        if (this.board === undefined) {
            return;
        }
        const worldSize = this.board.viewport.toWorldSize(e.size);
        const positiveSize = new _canvas_primitives_space__WEBPACK_IMPORTED_MODULE_3__.Vector2(Math.max(1, worldSize.x), Math.max(1, worldSize.y));
        if (_config_bindings__WEBPACK_IMPORTED_MODULE_4__.Binding.ResizeCrop.modifiers(e)) {
            const maxSize = this.imageSet.original.size.scale(this._scale);
            const scaledCropPosition = this._crop.scale(this._scale);
            const newSize = cropSize(positiveSize, scaledCropPosition, this.size, e.fixture, maxSize);
            const [newScaledCropPosition] = (0,_canvas_board_controllers_objects_ResizeObjectController__WEBPACK_IMPORTED_MODULE_0__.worldSpaceResize)(newSize, e.fixture, new _canvas_primitives_space__WEBPACK_IMPORTED_MODULE_3__.BoundingBox(scaledCropPosition, this.size), 0);
            this._crop = newScaledCropPosition.scale(1.0 / this._scale);
            [this.position, this.size] = (0,_canvas_board_controllers_objects_ResizeObjectController__WEBPACK_IMPORTED_MODULE_0__.worldSpaceResize)(newSize, e.fixture, new _canvas_primitives_space__WEBPACK_IMPORTED_MODULE_3__.BoundingBox(this.position, this.size), this.radians);
        }
        else {
            const cropScale = Math.max(positiveSize.euclideanNorm, 1) /
                this.size.euclideanNorm;
            const newSize = this.size.scale(cropScale);
            this._scale *= cropScale;
            [this.position, this.size] = (0,_canvas_board_controllers_objects_ResizeObjectController__WEBPACK_IMPORTED_MODULE_0__.worldSpaceResize)(newSize, e.fixture, new _canvas_primitives_space__WEBPACK_IMPORTED_MODULE_3__.BoundingBox(this.position, this.size), this.radians);
        }
    }
}
function cropSize(attemptedSize, cropPosition, size, fixture, maxSize) {
    let x, y;
    // X axis
    switch (fixture) {
        case _canvas_board_objects_foundation_PositionAnchor__WEBPACK_IMPORTED_MODULE_1__.AnchorPoint.TopLeft:
        case _canvas_board_objects_foundation_PositionAnchor__WEBPACK_IMPORTED_MODULE_1__.AnchorPoint.BottomLeft:
            x = Math.min(maxSize.x - cropPosition.x, attemptedSize.x);
            break;
        case _canvas_board_objects_foundation_PositionAnchor__WEBPACK_IMPORTED_MODULE_1__.AnchorPoint.TopRight:
        case _canvas_board_objects_foundation_PositionAnchor__WEBPACK_IMPORTED_MODULE_1__.AnchorPoint.BottomRight:
            x = Math.min(cropPosition.x + size.x, attemptedSize.x);
    }
    // Y axis
    switch (fixture) {
        case _canvas_board_objects_foundation_PositionAnchor__WEBPACK_IMPORTED_MODULE_1__.AnchorPoint.TopLeft:
        case _canvas_board_objects_foundation_PositionAnchor__WEBPACK_IMPORTED_MODULE_1__.AnchorPoint.TopRight:
            y = Math.min(maxSize.y - cropPosition.y, attemptedSize.y);
            break;
        case _canvas_board_objects_foundation_PositionAnchor__WEBPACK_IMPORTED_MODULE_1__.AnchorPoint.BottomRight:
        case _canvas_board_objects_foundation_PositionAnchor__WEBPACK_IMPORTED_MODULE_1__.AnchorPoint.BottomLeft:
            y = Math.min(cropPosition.y + size.y, attemptedSize.y);
    }
    return new _canvas_primitives_space__WEBPACK_IMPORTED_MODULE_3__.Vector2(x, y);
}


/***/ }),

/***/ "./src/canvas/board/objects/items/Rectangle.ts":
/*!*****************************************************!*\
  !*** ./src/canvas/board/objects/items/Rectangle.ts ***!
  \*****************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Rectangle": () => (/* binding */ Rectangle)
/* harmony export */ });
/* harmony import */ var _canvas_board_objects_items_BoardItem__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @canvas/board/objects/items/BoardItem */ "./src/canvas/board/objects/items/BoardItem.ts");
/* harmony import */ var _config_draw__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @config/draw */ "./src/config/draw.ts");


class Rectangle extends _canvas_board_objects_items_BoardItem__WEBPACK_IMPORTED_MODULE_0__.BoardItem {
    constructor(fillColor = _config_draw__WEBPACK_IMPORTED_MODULE_1__.defaultFillColor, position, size, radians = 0, isFixed = false) {
        super(position, size, radians, isFixed);
        this.fillColor = fillColor;
    }
    draw(renderCtx) {
        const viewport = renderCtx.viewport;
        const position = this.positionInViewport(viewport);
        const size = this.sizeInViewport(viewport);
        renderCtx.ctx.fillStyle = this.fillColor;
        renderCtx.ctx.fillRect(position.x, position.y, size.x, size.y);
    }
}


/***/ }),

/***/ "./src/canvas/board/objects/items/StickyNote.ts":
/*!******************************************************!*\
  !*** ./src/canvas/board/objects/items/StickyNote.ts ***!
  \******************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "StickyNote": () => (/* binding */ StickyNote)
/* harmony export */ });
/* harmony import */ var _canvas_primitives_space__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @canvas/primitives/space */ "./src/canvas/primitives/space.ts");
/* harmony import */ var _BlockText__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./BlockText */ "./src/canvas/board/objects/items/BlockText.ts");
/* harmony import */ var _BoardItem__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./BoardItem */ "./src/canvas/board/objects/items/BoardItem.ts");



class StickyNote extends _BoardItem__WEBPACK_IMPORTED_MODULE_2__.BoardItem {
    constructor(text, textColor, bgColor, fontSize, font, position, size, radians = 0, isFixed = false, padding = 10) {
        super(position, size, radians, isFixed);
        this.bgColor = bgColor;
        this.padding = padding;
        this.isStickyNote = true;
        this.blockText = new _BlockText__WEBPACK_IMPORTED_MODULE_1__.BlockText(text, textColor, fontSize, font, this.getBlockTextPosition(position), this.getBlockTextSize(size), radians, isFixed);
    }
    get position() {
        return super.position;
    }
    set position(position) {
        super.position = position;
        this.blockText.position = this.getBlockTextPosition(position);
        this.blockText.markDirty();
    }
    get size() {
        return super.size;
    }
    set size(size) {
        const bound = 2 * this.padding;
        const boundSize = new _canvas_primitives_space__WEBPACK_IMPORTED_MODULE_0__.Vector2(size.x <= bound ? bound : size.x, size.y <= bound ? bound : size.y);
        super.size = boundSize;
        this.blockText.size = this.getBlockTextSize(boundSize);
        this.blockText.markDirty();
    }
    draw(renderCtx) {
        // Make sure sticky note is not smaller than contained text
        this.blockText.updateForRender(renderCtx);
        const blockTextSize = this.blockText.size;
        this._size = new _canvas_primitives_space__WEBPACK_IMPORTED_MODULE_0__.Vector2(Math.max(this._size.x, blockTextSize.x + 2 * this.padding), Math.max(this._size.y, blockTextSize.y + 2 * this.padding));
        // Draw background
        const viewport = renderCtx.viewport;
        const position = this.positionInViewport(viewport);
        const size = this.sizeInViewport(viewport);
        renderCtx.ctx.fillStyle = this.bgColor;
        renderCtx.ctx.fillRect(position.x, position.y, size.x, size.y);
        // Draw text
        this.blockText.draw(renderCtx);
    }
    onSpawn(board) {
        super.onSpawn(board);
        this.blockText.onSpawn(board);
        this.subscriptions.push(this.board.onDirty.listen(this.blockText, () => {
            this.board.markDirtyObject(this);
        }));
    }
    onDespawn(board) {
        this.blockText.onDespawn(board);
        super.onDespawn(board);
    }
    castRay(position, viewport) {
        const stack = super.castRay(position, viewport);
        if (stack !== undefined) {
            stack.unshift(this.blockText);
        }
        return stack;
    }
    getBlockTextPosition(position) {
        return position.plus(new _canvas_primitives_space__WEBPACK_IMPORTED_MODULE_0__.Vector2(this.padding, this.padding));
    }
    getBlockTextSize(size) {
        return size.minus(new _canvas_primitives_space__WEBPACK_IMPORTED_MODULE_0__.Vector2(2 * this.padding, 2 * this.padding));
    }
}


/***/ }),

/***/ "./src/canvas/board/objects/items/StyledText.ts":
/*!******************************************************!*\
  !*** ./src/canvas/board/objects/items/StyledText.ts ***!
  \******************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "StyledText": () => (/* binding */ StyledText)
/* harmony export */ });
/* harmony import */ var _canvas_board_controllers_objects_ResizeObjectController__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @canvas/board/controllers/objects/ResizeObjectController */ "./src/canvas/board/controllers/objects/ResizeObjectController.ts");
/* harmony import */ var _canvas_board_objects_foundation_PositionAnchor__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @canvas/board/objects/foundation/PositionAnchor */ "./src/canvas/board/objects/foundation/PositionAnchor.ts");
/* harmony import */ var _canvas_board_objects_items_TextItem__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @canvas/board/objects/items/TextItem */ "./src/canvas/board/objects/items/TextItem.ts");
/* harmony import */ var _canvas_primitives_space__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @canvas/primitives/space */ "./src/canvas/primitives/space.ts");
/* harmony import */ var _config_draw__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @config/draw */ "./src/config/draw.ts");





class StyledText extends _canvas_board_objects_items_TextItem__WEBPACK_IMPORTED_MODULE_2__.TextItem {
    constructor(text, textColor, fontSize, font, position, radians = 0, isFixed = false) {
        super(textColor, fontSize, font, position, _canvas_primitives_space__WEBPACK_IMPORTED_MODULE_3__.Vector2.origin, radians, isFixed);
        this.isStyledText = true;
        this.text = text;
    }
    get text() {
        return this.lines.join("\n");
    }
    set text(text) {
        this.lines = text.split("\n");
        this.markDirty();
    }
    draw(renderCtx) {
        if (this.dirtyText || this.computeInitial) {
            this.updateSize(renderCtx);
            this.dirtyText = false;
            this.computeInitial = false;
        }
        super.draw(renderCtx);
    }
    onResize(e) {
        if (this.board === undefined) {
            return;
        }
        const worldSize = this.board.viewport.toWorldSize(e.size);
        const fontSize = this.fontSizeFromBoxSize(worldSize);
        const sizeRatio = fontSize / this._fontSize;
        const newSize = this.size.scale(sizeRatio);
        this._fontSize = fontSize;
        this.ascent *= sizeRatio;
        [this.position, this.size] = (0,_canvas_board_controllers_objects_ResizeObjectController__WEBPACK_IMPORTED_MODULE_0__.worldSpaceResize)(newSize, e.fixture, new _canvas_primitives_space__WEBPACK_IMPORTED_MODULE_3__.BoundingBox(this.position, this.size), this.radians);
    }
    updateTextarea() {
        if (this.textarea === undefined) {
            return;
        }
        const viewport = this.board.viewport;
        const bb = this.boundingBox(viewport);
        const fontSize = viewport.zoomLevel * this._fontSize;
        this.textarea.style.left = `${bb.position.x}px`;
        this.textarea.style.top = `${bb.position.y}px`;
        // Make textarea larger than current text to prevent new-lines
        // Before size is updated again
        this.textarea.style.width = `${bb.size.x + 5 * fontSize}px`;
        this.textarea.style.height = `${bb.size.y + 2 * fontSize}px`;
        if (this.radians != 0) {
            this.textarea.style.transform = `rotate(${this.radians}rad)`;
            this.textarea.style.transformOrigin = `${bb.size.x / 2}px ${bb.size.y / 2}px`;
        }
        this.textarea.style.font = this.font.toCss(fontSize);
        this.textarea.style.lineHeight = `${fontSize}px`;
        this.textarea.scrollTop = 0;
    }
    fontSizeFromBoxSize(size) {
        const widthRatio = Math.max(1, size.x) / Math.max(1, this._size.x);
        const heightRatio = Math.max(1, size.y) / Math.max(1, this._size.y);
        const ratio = (widthRatio + heightRatio) / 2;
        // Note: Max font size with min zoom does not work in Firefox
        return Math.min(_config_draw__WEBPACK_IMPORTED_MODULE_4__.maxFontSize, Math.max(_config_draw__WEBPACK_IMPORTED_MODULE_4__.minFontSize, this._fontSize * ratio));
    }
    updateSize(renderCtx) {
        const measureFontSize = Math.min(_canvas_board_objects_items_TextItem__WEBPACK_IMPORTED_MODULE_2__.MEASURE_FONT_SIZE, this._fontSize);
        const fontSizeRatio = this._fontSize / measureFontSize;
        const metrics = measureText(this.lines, this.font.toCss(measureFontSize), renderCtx);
        const maxWidth = Math.max(...metrics.map(m => m.width));
        const width = maxWidth * fontSizeRatio;
        const height = metrics.length * this._fontSize;
        const firstNonZeroAscent = metrics
            .map(m => m.actualBoundingBoxAscent)
            .reduce((a, b) => a || b, 0);
        this.ascent = firstNonZeroAscent * fontSizeRatio;
        const newSize = new _canvas_primitives_space__WEBPACK_IMPORTED_MODULE_3__.Vector2(width, height);
        if (this.computeInitial) {
            this.size = newSize;
        }
        else {
            [this.position, this.size] = (0,_canvas_board_controllers_objects_ResizeObjectController__WEBPACK_IMPORTED_MODULE_0__.worldSpaceResize)(newSize, _canvas_board_objects_foundation_PositionAnchor__WEBPACK_IMPORTED_MODULE_1__.AnchorPoint.TopLeft, new _canvas_primitives_space__WEBPACK_IMPORTED_MODULE_3__.BoundingBox(this.position, this._size), this.radians);
        }
    }
}
function measureText(lines, font, renderCtx) {
    renderCtx.ctx.save();
    renderCtx.ctx.font = font;
    const metrics = lines.map(line => renderCtx.ctx.measureText(line));
    renderCtx.ctx.restore();
    return metrics;
}


/***/ }),

/***/ "./src/canvas/board/objects/items/TextItem.ts":
/*!****************************************************!*\
  !*** ./src/canvas/board/objects/items/TextItem.ts ***!
  \****************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "MEASURE_FONT_SIZE": () => (/* binding */ MEASURE_FONT_SIZE),
/* harmony export */   "TextItem": () => (/* binding */ TextItem)
/* harmony export */ });
/* harmony import */ var _canvas_board_controllers_board_FontController__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @canvas/board/controllers/board/FontController */ "./src/canvas/board/controllers/board/FontController.ts");
/* harmony import */ var _canvas_board_controllers_BoardMode__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @canvas/board/controllers/BoardMode */ "./src/canvas/board/controllers/BoardMode.ts");
/* harmony import */ var _canvas_board_objects_items_BoardItem__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @canvas/board/objects/items/BoardItem */ "./src/canvas/board/objects/items/BoardItem.ts");
/* harmony import */ var _canvas_primitives_dom__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @canvas/primitives/dom */ "./src/canvas/primitives/dom.ts");
/* harmony import */ var _canvas_primitives_events__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @canvas/primitives/events */ "./src/canvas/primitives/events.ts");





const MEASURE_FONT_SIZE = 20;
class TextItem extends _canvas_board_objects_items_BoardItem__WEBPACK_IMPORTED_MODULE_2__.BoardItem {
    constructor(textColor, _fontSize, font, position, size, radians = 0, isFixed = false) {
        super(position, size, radians, isFixed);
        this.textColor = textColor;
        this._fontSize = _fontSize;
        this.font = font;
        this.computeInitial = true;
        this.dirtyText = false;
        this.ascent = 0;
        // Edit mode
        this.isEditing = false;
        this.editSubscriptions = [];
    }
    get fontSize() {
        return this._fontSize;
    }
    draw(renderCtx) {
        if (this.isEditing) {
            // Don't draw text during text edit to avoid offset artifacts
            return;
        }
        const viewport = renderCtx.viewport;
        const position = this.positionInViewport(viewport);
        renderCtx.ctx.fillStyle = this.textColor;
        renderCtx.ctx.font = this.font.toCss(viewport.zoomLevel * this._fontSize);
        const lines = this.lines;
        const lineOffset = this.ascent;
        for (let i = 0; i < lines.length; ++i) {
            const line = lines[i];
            renderCtx.ctx.fillText(line, position.x, position.y +
                viewport.zoomLevel * (lineOffset + i * this._fontSize));
        }
    }
    onSpawn(board) {
        super.onSpawn(board);
        if (!this.board.config.viewOnlyMode) {
            this.subscriptions.push(board.controller.mouse.onMouseClick.listen(this, e => {
                if (e.clicks == 2) {
                    e.stopPropagation();
                    this.startEdit();
                }
            }));
        }
        this.subscriptions.push(board.controller.font.onFontLoad.listen((0,_canvas_board_controllers_board_FontController__WEBPACK_IMPORTED_MODULE_0__.getFontIdentifier)(this.font.fontFamily), () => {
            this.markDirty();
        }));
    }
    markDirty() {
        var _a;
        this.dirtyText = true;
        (_a = this.board) === null || _a === void 0 ? void 0 : _a.markDirtyObject(this);
    }
    startEdit() {
        if (this.board === undefined) {
            return;
        }
        (0,_canvas_primitives_dom__WEBPACK_IMPORTED_MODULE_3__.resetCursor)();
        const mode = this.board.controller.mode;
        this.previousState = mode.state;
        mode.state = _canvas_board_controllers_BoardMode__WEBPACK_IMPORTED_MODULE_1__.BoardMode.TextEditing;
        this.isEditing = true;
        const parent = this.board.boardElement;
        const textarea = document.createElement("textarea");
        this.textarea = textarea;
        textarea.className = "styled-text-edit";
        textarea.innerHTML = this.text;
        textarea.style.color = this.textColor;
        parent.appendChild(textarea);
        // needs to be called after append, otherwise line-height does not work.
        this.updateTextarea();
        // Make sure clicks in textarea don't trigger board mouse interactions
        textarea.addEventListener("mousedown", e => {
            e.stopPropagation();
        });
        // Change events
        ["cut", "copy", "paste", "keyup", "mouseup"].forEach(eventType => {
            textarea.addEventListener(eventType, () => {
                this.text = this.textarea.value;
                this.updateTextarea();
            });
        });
        this.editSubscriptions.push(this.board.controller.mouse.onMouseDown.listen(undefined, () => {
            this.stopEdit();
        }));
        // Listen to viewport changes to move texarea
        this.board.onChangeViewport.listen(undefined, () => {
            this.updateTextarea();
        });
        this.board.markDirtyObject(this);
    }
    stopEdit() {
        const mode = this.board.controller.mode;
        if (mode.state === _canvas_board_controllers_BoardMode__WEBPACK_IMPORTED_MODULE_1__.BoardMode.TextEditing) {
            mode.state = this.previousState;
        }
        this.isEditing = false;
        if (this.textarea !== undefined) {
            const parent = this.board.boardElement;
            parent.removeChild(this.textarea);
            this.textarea = undefined;
        }
        (0,_canvas_primitives_events__WEBPACK_IMPORTED_MODULE_4__.unsubscribeAll)(this.editSubscriptions);
    }
}


/***/ }),

/***/ "./src/canvas/board/objects/ui/Guideline.ts":
/*!**************************************************!*\
  !*** ./src/canvas/board/objects/ui/Guideline.ts ***!
  \**************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Guideline": () => (/* binding */ Guideline)
/* harmony export */ });
/* harmony import */ var _canvas_board_objects_GeometricObject__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @canvas/board/objects/GeometricObject */ "./src/canvas/board/objects/GeometricObject.ts");
/* harmony import */ var _canvas_primitives_space__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @canvas/primitives/space */ "./src/canvas/primitives/space.ts");


class Guideline extends _canvas_board_objects_GeometricObject__WEBPACK_IMPORTED_MODULE_0__.GeometricObject {
    constructor(guide) {
        super();
        this.guide = guide;
        this.isGuideline = true;
    }
    boundingBox() {
        return new _canvas_primitives_space__WEBPACK_IMPORTED_MODULE_1__.BoundingBox(_canvas_primitives_space__WEBPACK_IMPORTED_MODULE_1__.Vector2.origin, _canvas_primitives_space__WEBPACK_IMPORTED_MODULE_1__.Vector2.origin);
    }
    draw(renderCtx) {
        const viewport = renderCtx.viewport;
        const ctx = renderCtx.ctx;
        const viewPosition = viewport.origin;
        const relativePos = this.guide.vertical
            ? viewPosition.x
            : viewPosition.y;
        const pos = viewport.zoomLevel * (this.guide.value - relativePos);
        ctx.beginPath();
        ctx.moveTo(this.guide.vertical ? pos : 0, this.guide.vertical ? 0 : pos);
        ctx.lineTo(this.guide.vertical ? pos : viewport.size.x, this.guide.vertical ? viewport.size.y : pos);
        ctx.stroke();
    }
}


/***/ }),

/***/ "./src/canvas/board/objects/ui/SelectBoxFrame.ts":
/*!*******************************************************!*\
  !*** ./src/canvas/board/objects/ui/SelectBoxFrame.ts ***!
  \*******************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "SelectBoxFrame": () => (/* binding */ SelectBoxFrame)
/* harmony export */ });
/* harmony import */ var _canvas_board_objects_GeometricObject__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @canvas/board/objects/GeometricObject */ "./src/canvas/board/objects/GeometricObject.ts");
/* harmony import */ var _canvas_primitives_space__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @canvas/primitives/space */ "./src/canvas/primitives/space.ts");
/* harmony import */ var _config_draw__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @config/draw */ "./src/config/draw.ts");



class SelectBoxFrame extends _canvas_board_objects_GeometricObject__WEBPACK_IMPORTED_MODULE_0__.GeometricObject {
    constructor(frameColor = _config_draw__WEBPACK_IMPORTED_MODULE_2__.defaultFrameColor, frameWidth = 1, fillColor = _config_draw__WEBPACK_IMPORTED_MODULE_2__.defaultFrameFill, position = _canvas_primitives_space__WEBPACK_IMPORTED_MODULE_1__.Vector2.origin, size = _canvas_primitives_space__WEBPACK_IMPORTED_MODULE_1__.Vector2.origin) {
        super();
        this.frameColor = frameColor;
        this.frameWidth = frameWidth;
        this.fillColor = fillColor;
        this.position = position;
        this.size = size;
    }
    boundingBox(viewport) {
        const position = viewport.toViewportPosition(this.position);
        const size = viewport.toViewportSize(this.size);
        return new _canvas_primitives_space__WEBPACK_IMPORTED_MODULE_1__.BoundingBox(position, size);
    }
    draw(renderCtx) {
        const viewport = renderCtx.viewport;
        const position = viewport.toViewportPosition(this.position);
        const size = viewport.toViewportSize(this.size);
        renderCtx.ctx.fillStyle = this.fillColor;
        renderCtx.ctx.fillRect(position.x, position.y, size.x, size.y);
        renderCtx.ctx.strokeStyle = this.frameColor;
        renderCtx.ctx.lineWidth = this.frameWidth;
        renderCtx.ctx.strokeRect(position.x, position.y, size.x, size.y);
    }
    updateSize(position, size) {
        this.position = position;
        this.size = size;
        if (this.board) {
            this.board.markDirtyObject(this);
        }
    }
}


/***/ }),

/***/ "./src/canvas/board/objects/ui/WorldBorder.ts":
/*!****************************************************!*\
  !*** ./src/canvas/board/objects/ui/WorldBorder.ts ***!
  \****************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "WorldBorder": () => (/* binding */ WorldBorder)
/* harmony export */ });
/* harmony import */ var _canvas_board_objects_GeometricObject__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @canvas/board/objects/GeometricObject */ "./src/canvas/board/objects/GeometricObject.ts");
/* harmony import */ var _canvas_primitives_space__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @canvas/primitives/space */ "./src/canvas/primitives/space.ts");


class WorldBorder extends _canvas_board_objects_GeometricObject__WEBPACK_IMPORTED_MODULE_0__.GeometricObject {
    constructor(horizontal, fillColor = "#555555", borderColor = "#000000", borderWidth = 1.0) {
        super();
        this.horizontal = horizontal;
        this.fillColor = fillColor;
        this.borderColor = borderColor;
        this.borderWidth = borderWidth;
    }
    boundingBox() {
        return new _canvas_primitives_space__WEBPACK_IMPORTED_MODULE_1__.BoundingBox(_canvas_primitives_space__WEBPACK_IMPORTED_MODULE_1__.Vector2.origin, _canvas_primitives_space__WEBPACK_IMPORTED_MODULE_1__.Vector2.origin);
    }
    draw(renderCtx) {
        const viewport = renderCtx.viewport;
        const ctx = renderCtx.ctx;
        const width = this.horizontal
            ? viewport.size.x
            : -viewport.origin.x * viewport.zoomLevel;
        const height = this.horizontal
            ? -viewport.origin.y * viewport.zoomLevel
            : viewport.size.y;
        if (width > 0 && height > 0) {
            // Invalid area background
            ctx.fillStyle = this.fillColor;
            ctx.fillRect(0, 0, width, height);
            // Border
            ctx.beginPath();
            ctx.lineWidth = this.borderWidth;
            ctx.strokeStyle = this.borderColor;
            ctx.moveTo(-viewport.origin.x * viewport.zoomLevel, -viewport.origin.y * viewport.zoomLevel);
            ctx.lineTo(width, height);
            ctx.stroke();
        }
    }
}


/***/ }),

/***/ "./src/canvas/board/objects/ui/selectable/ResizeFrame.ts":
/*!***************************************************************!*\
  !*** ./src/canvas/board/objects/ui/selectable/ResizeFrame.ts ***!
  \***************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "ResizeFrame": () => (/* binding */ ResizeFrame),
/* harmony export */   "allPositionings": () => (/* binding */ allPositionings)
/* harmony export */ });
/* harmony import */ var _canvas_board_objects_foundation_Group__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @canvas/board/objects/foundation/Group */ "./src/canvas/board/objects/foundation/Group.ts");
/* harmony import */ var _ResizeHandle__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./ResizeHandle */ "./src/canvas/board/objects/ui/selectable/ResizeHandle.ts");


const allPositionings = [
    _ResizeHandle__WEBPACK_IMPORTED_MODULE_1__.ResizeHandlePositioning.TopLeft,
    _ResizeHandle__WEBPACK_IMPORTED_MODULE_1__.ResizeHandlePositioning.TopCenter,
    _ResizeHandle__WEBPACK_IMPORTED_MODULE_1__.ResizeHandlePositioning.TopRight,
    _ResizeHandle__WEBPACK_IMPORTED_MODULE_1__.ResizeHandlePositioning.MiddleRight,
    _ResizeHandle__WEBPACK_IMPORTED_MODULE_1__.ResizeHandlePositioning.BottomRight,
    _ResizeHandle__WEBPACK_IMPORTED_MODULE_1__.ResizeHandlePositioning.BottomCenter,
    _ResizeHandle__WEBPACK_IMPORTED_MODULE_1__.ResizeHandlePositioning.BottomLeft,
    _ResizeHandle__WEBPACK_IMPORTED_MODULE_1__.ResizeHandlePositioning.MiddleLeft,
];
class ResizeFrame extends _canvas_board_objects_foundation_Group__WEBPACK_IMPORTED_MODULE_0__.Group {
    constructor(overlay, handlePositionings = allPositionings, handleStyle = new _ResizeHandle__WEBPACK_IMPORTED_MODULE_1__.ResizeHandleStyle()) {
        super();
        this.overlay = overlay;
        this.children = createHandles(this, handlePositionings, handleStyle);
    }
}
function createHandles(frame, positionings, handleStyle) {
    return positionings.map(positioning => new _ResizeHandle__WEBPACK_IMPORTED_MODULE_1__.ResizeHandle(frame, positioning, handleStyle));
}


/***/ }),

/***/ "./src/canvas/board/objects/ui/selectable/ResizeHandle.ts":
/*!****************************************************************!*\
  !*** ./src/canvas/board/objects/ui/selectable/ResizeHandle.ts ***!
  \****************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "ResizeHandle": () => (/* binding */ ResizeHandle),
/* harmony export */   "ResizeHandlePositioning": () => (/* binding */ ResizeHandlePositioning),
/* harmony export */   "ResizeHandleStyle": () => (/* binding */ ResizeHandleStyle)
/* harmony export */ });
/* harmony import */ var _canvas_board_controllers_BoardMode__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @canvas/board/controllers/BoardMode */ "./src/canvas/board/controllers/BoardMode.ts");
/* harmony import */ var _canvas_board_objects_GeometricObject__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @canvas/board/objects/GeometricObject */ "./src/canvas/board/objects/GeometricObject.ts");
/* harmony import */ var _canvas_primitives_dom__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @canvas/primitives/dom */ "./src/canvas/primitives/dom.ts");
/* harmony import */ var _canvas_primitives_events__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @canvas/primitives/events */ "./src/canvas/primitives/events.ts");
/* harmony import */ var _canvas_primitives_space__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @canvas/primitives/space */ "./src/canvas/primitives/space.ts");
/* harmony import */ var _config_draw__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @config/draw */ "./src/config/draw.ts");






var ResizeHandlePositioning;
(function (ResizeHandlePositioning) {
    ResizeHandlePositioning[ResizeHandlePositioning["TopLeft"] = 0] = "TopLeft";
    ResizeHandlePositioning[ResizeHandlePositioning["TopCenter"] = 1] = "TopCenter";
    ResizeHandlePositioning[ResizeHandlePositioning["TopRight"] = 2] = "TopRight";
    ResizeHandlePositioning[ResizeHandlePositioning["MiddleRight"] = 3] = "MiddleRight";
    ResizeHandlePositioning[ResizeHandlePositioning["BottomRight"] = 4] = "BottomRight";
    ResizeHandlePositioning[ResizeHandlePositioning["BottomCenter"] = 5] = "BottomCenter";
    ResizeHandlePositioning[ResizeHandlePositioning["BottomLeft"] = 6] = "BottomLeft";
    ResizeHandlePositioning[ResizeHandlePositioning["MiddleLeft"] = 7] = "MiddleLeft";
})(ResizeHandlePositioning || (ResizeHandlePositioning = {}));
class ResizeHandleStyle {
    constructor(size = 14, outlineColor = _config_draw__WEBPACK_IMPORTED_MODULE_5__.inverseStrokeColor, outlineWidth = 2, fillColor = "#1060B0", glowColor = "#75AAEE", changeCursor = true) {
        this.size = size;
        this.outlineColor = outlineColor;
        this.outlineWidth = outlineWidth;
        this.fillColor = fillColor;
        this.glowColor = glowColor;
        this.changeCursor = changeCursor;
    }
}
const positioningCursorStyle = {
    [ResizeHandlePositioning.TopLeft]: "nwse-resize",
    [ResizeHandlePositioning.TopCenter]: "ns-resize",
    [ResizeHandlePositioning.TopRight]: "nesw-resize",
    [ResizeHandlePositioning.MiddleRight]: "ew-resize",
    [ResizeHandlePositioning.BottomRight]: "nwse-resize",
    [ResizeHandlePositioning.BottomCenter]: "ns-resize",
    [ResizeHandlePositioning.BottomLeft]: "nesw-resize",
    [ResizeHandlePositioning.MiddleLeft]: "ew-resize",
};
class ResizeHandle extends _canvas_board_objects_GeometricObject__WEBPACK_IMPORTED_MODULE_1__.GeometricObject {
    constructor(frame, positioning, style = new ResizeHandleStyle()) {
        super();
        this.frame = frame;
        this.positioning = positioning;
        this.style = style;
        this.resizingSubscriptions = [];
    }
    boundingBox(viewport) {
        const size = new _canvas_primitives_space__WEBPACK_IMPORTED_MODULE_4__.Vector2(this.style.size, this.style.size);
        const centerOffset = this.style.size / 2;
        const position = this.relativePosition(viewport).minus(new _canvas_primitives_space__WEBPACK_IMPORTED_MODULE_4__.Vector2(centerOffset, centerOffset));
        return new _canvas_primitives_space__WEBPACK_IMPORTED_MODULE_4__.BoundingBox(position, size);
    }
    draw(renderCtx) {
        const size = this.style.size;
        const centerPosition = this.relativePosition(renderCtx.viewport);
        // Outline width is centered on circle outline, so only half or
        // the outline is an additional width, means an additional width of
        // 2 * 1/2 * outlineWidth = outlineWidth
        const innerSize = size - this.style.outlineWidth;
        // Shadow
        renderCtx.ctx.shadowColor = this.style.fillColor;
        renderCtx.ctx.shadowBlur = this.style.size / 8;
        // Circle
        renderCtx.ctx.beginPath();
        renderCtx.ctx.arc(centerPosition.x, centerPosition.y, innerSize / 2, 0, 2 * Math.PI);
        // Fill
        if (this.style.glowColor !== undefined) {
            const gradient = renderCtx.ctx.createRadialGradient(centerPosition.x - innerSize / 8, centerPosition.y - innerSize / 4, 0, centerPosition.x, centerPosition.y, size + 1);
            gradient.addColorStop(0, this.style.glowColor);
            gradient.addColorStop(1, this.style.fillColor);
            renderCtx.ctx.fillStyle = gradient;
        }
        else {
            renderCtx.ctx.fillStyle = this.style.fillColor;
        }
        renderCtx.ctx.fill();
        // Outline
        renderCtx.ctx.strokeStyle = this.style.outlineColor;
        renderCtx.ctx.lineWidth = this.style.outlineWidth;
        renderCtx.ctx.stroke();
    }
    onSpawn(board) {
        super.onSpawn(board);
        const mouse = board.controller.mouse;
        this.subscriptions.push(mouse.onMouseDown.listen(this, e => {
            this.board.controller.resize.startResizing(e);
        }));
        if (this.style.changeCursor) {
            this.subscriptions.push(mouse.onMouseOver.listen(this, () => {
                this.onMouseOver();
            }));
            this.subscriptions.push(mouse.onMouseOut.listen(this, () => {
                this.onMouseOut();
            }));
        }
    }
    onDespawn(board) {
        (0,_canvas_primitives_events__WEBPACK_IMPORTED_MODULE_3__.unsubscribeAll)(this.resizingSubscriptions);
        super.onDespawn(board);
    }
    showResizingCursor() {
        showResizingCursor(this.positioning);
    }
    onMouseOver() {
        if ((0,_canvas_board_controllers_BoardMode__WEBPACK_IMPORTED_MODULE_0__.canResize)(this.board.controller.mode.state)) {
            this.showResizingCursor();
        }
    }
    onMouseOut() {
        if ((0,_canvas_board_controllers_BoardMode__WEBPACK_IMPORTED_MODULE_0__.canResize)(this.board.controller.mode.state)) {
            (0,_canvas_primitives_dom__WEBPACK_IMPORTED_MODULE_2__.resetCursor)();
        }
    }
    relativePosition(viewport) {
        const contentBox = this.frame.overlay.selectionFrame.boundingBox(viewport);
        switch (this.positioning) {
            case ResizeHandlePositioning.TopLeft:
                return new _canvas_primitives_space__WEBPACK_IMPORTED_MODULE_4__.Vector2(contentBox.position.x, contentBox.position.y);
            case ResizeHandlePositioning.TopCenter:
                return new _canvas_primitives_space__WEBPACK_IMPORTED_MODULE_4__.Vector2(contentBox.position.x + contentBox.size.x / 2, contentBox.position.y);
            case ResizeHandlePositioning.TopRight:
                return new _canvas_primitives_space__WEBPACK_IMPORTED_MODULE_4__.Vector2(contentBox.position.x + contentBox.size.x, contentBox.position.y);
            case ResizeHandlePositioning.MiddleRight:
                return new _canvas_primitives_space__WEBPACK_IMPORTED_MODULE_4__.Vector2(contentBox.position.x + contentBox.size.x, contentBox.position.y + contentBox.size.y / 2);
            case ResizeHandlePositioning.BottomRight:
                return new _canvas_primitives_space__WEBPACK_IMPORTED_MODULE_4__.Vector2(contentBox.position.x + contentBox.size.x, contentBox.position.y + contentBox.size.y);
            case ResizeHandlePositioning.BottomCenter:
                return new _canvas_primitives_space__WEBPACK_IMPORTED_MODULE_4__.Vector2(contentBox.position.x + contentBox.size.x / 2, contentBox.position.y + contentBox.size.y);
            case ResizeHandlePositioning.BottomLeft:
                return new _canvas_primitives_space__WEBPACK_IMPORTED_MODULE_4__.Vector2(contentBox.position.x, contentBox.position.y + contentBox.size.y);
            case ResizeHandlePositioning.MiddleLeft:
                return new _canvas_primitives_space__WEBPACK_IMPORTED_MODULE_4__.Vector2(contentBox.position.x, contentBox.position.y + contentBox.size.y / 2);
        }
    }
}
function showResizingCursor(positioning) {
    (0,_canvas_primitives_dom__WEBPACK_IMPORTED_MODULE_2__.setCursor)(positioningCursorStyle[positioning]);
}


/***/ }),

/***/ "./src/canvas/board/objects/ui/selectable/RotateCollider.ts":
/*!******************************************************************!*\
  !*** ./src/canvas/board/objects/ui/selectable/RotateCollider.ts ***!
  \******************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "RotateCollider": () => (/* binding */ RotateCollider)
/* harmony export */ });
/* harmony import */ var _canvas_board_objects_GeometricObject__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @canvas/board/objects/GeometricObject */ "./src/canvas/board/objects/GeometricObject.ts");
/* harmony import */ var _canvas_board_objects_ui_selectable_ResizeHandle__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @canvas/board/objects/ui/selectable/ResizeHandle */ "./src/canvas/board/objects/ui/selectable/ResizeHandle.ts");
/* harmony import */ var _canvas_primitives_space__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @canvas/primitives/space */ "./src/canvas/primitives/space.ts");



class RotateCollider extends _canvas_board_objects_GeometricObject__WEBPACK_IMPORTED_MODULE_0__.GeometricObject {
    constructor(corner, content, size) {
        super();
        this.corner = corner;
        this.content = content;
        this.size = size;
    }
    boundingBox(viewport) {
        const bb = this.content.boundingBox(viewport);
        const position = bb.position.plus(this.getOffset(bb));
        return new _canvas_primitives_space__WEBPACK_IMPORTED_MODULE_2__.BoundingBox(position, this.size);
    }
    onSpawn(board) {
        super.onSpawn(board);
        const mouse = board.controller.mouse;
        this.subscriptions.push(mouse.onMouseDown.listen(this, e => {
            this.board.controller.rotate.startRotating(e, this.content);
        }));
    }
    draw() {
        // Nothing
    }
    getOffset(referenceBox) {
        switch (this.corner) {
            case _canvas_board_objects_ui_selectable_ResizeHandle__WEBPACK_IMPORTED_MODULE_1__.ResizeHandlePositioning.TopLeft:
                return new _canvas_primitives_space__WEBPACK_IMPORTED_MODULE_2__.Vector2(-this.size.x, -this.size.y);
            case _canvas_board_objects_ui_selectable_ResizeHandle__WEBPACK_IMPORTED_MODULE_1__.ResizeHandlePositioning.TopRight:
                return new _canvas_primitives_space__WEBPACK_IMPORTED_MODULE_2__.Vector2(referenceBox.size.x, -this.size.y);
            case _canvas_board_objects_ui_selectable_ResizeHandle__WEBPACK_IMPORTED_MODULE_1__.ResizeHandlePositioning.BottomRight:
                return referenceBox.size;
            case _canvas_board_objects_ui_selectable_ResizeHandle__WEBPACK_IMPORTED_MODULE_1__.ResizeHandlePositioning.BottomLeft:
                return new _canvas_primitives_space__WEBPACK_IMPORTED_MODULE_2__.Vector2(-this.size.x, referenceBox.size.y);
        }
    }
}


/***/ }),

/***/ "./src/canvas/board/objects/ui/selectable/RotateFrame.ts":
/*!***************************************************************!*\
  !*** ./src/canvas/board/objects/ui/selectable/RotateFrame.ts ***!
  \***************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "RotateFrame": () => (/* binding */ RotateFrame)
/* harmony export */ });
/* harmony import */ var _canvas_board_controllers_BoardMode__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @canvas/board/controllers/BoardMode */ "./src/canvas/board/controllers/BoardMode.ts");
/* harmony import */ var _canvas_board_controllers_objects_RotateObjectController__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @canvas/board/controllers/objects/RotateObjectController */ "./src/canvas/board/controllers/objects/RotateObjectController.ts");
/* harmony import */ var _canvas_board_objects_foundation_Group__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @canvas/board/objects/foundation/Group */ "./src/canvas/board/objects/foundation/Group.ts");
/* harmony import */ var _canvas_board_objects_ui_selectable_ResizeHandle__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @canvas/board/objects/ui/selectable/ResizeHandle */ "./src/canvas/board/objects/ui/selectable/ResizeHandle.ts");
/* harmony import */ var _canvas_board_objects_ui_selectable_RotateCollider__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @canvas/board/objects/ui/selectable/RotateCollider */ "./src/canvas/board/objects/ui/selectable/RotateCollider.ts");
/* harmony import */ var _canvas_primitives_dom__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @canvas/primitives/dom */ "./src/canvas/primitives/dom.ts");
/* harmony import */ var _canvas_primitives_space__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @canvas/primitives/space */ "./src/canvas/primitives/space.ts");







class RotateFrame extends _canvas_board_objects_foundation_Group__WEBPACK_IMPORTED_MODULE_2__.Group {
    constructor(overlay, rotationOffset = 25) {
        super();
        this.overlay = overlay;
        this.rotationOffset = rotationOffset;
        const content = this.overlay.selectable.content;
        const size = new _canvas_primitives_space__WEBPACK_IMPORTED_MODULE_6__.Vector2(rotationOffset, rotationOffset);
        this.children = [
            new _canvas_board_objects_ui_selectable_RotateCollider__WEBPACK_IMPORTED_MODULE_4__.RotateCollider(_canvas_board_objects_ui_selectable_ResizeHandle__WEBPACK_IMPORTED_MODULE_3__.ResizeHandlePositioning.TopLeft, content, size),
            new _canvas_board_objects_ui_selectable_RotateCollider__WEBPACK_IMPORTED_MODULE_4__.RotateCollider(_canvas_board_objects_ui_selectable_ResizeHandle__WEBPACK_IMPORTED_MODULE_3__.ResizeHandlePositioning.TopRight, content, size),
            new _canvas_board_objects_ui_selectable_RotateCollider__WEBPACK_IMPORTED_MODULE_4__.RotateCollider(_canvas_board_objects_ui_selectable_ResizeHandle__WEBPACK_IMPORTED_MODULE_3__.ResizeHandlePositioning.BottomRight, content, size),
            new _canvas_board_objects_ui_selectable_RotateCollider__WEBPACK_IMPORTED_MODULE_4__.RotateCollider(_canvas_board_objects_ui_selectable_ResizeHandle__WEBPACK_IMPORTED_MODULE_3__.ResizeHandlePositioning.BottomLeft, content, size),
        ];
    }
    onSpawn(board) {
        super.onSpawn(board);
        const mouse = board.controller.mouse;
        this.subscriptions.push(mouse.onMouseOver.listen(this, () => {
            this.onMouseOver();
        }));
        this.subscriptions.push(mouse.onMouseOut.listen(this, () => {
            this.onMouseOut();
        }));
    }
    onMouseOver() {
        if ((0,_canvas_board_controllers_BoardMode__WEBPACK_IMPORTED_MODULE_0__.canRotate)(this.board.controller.mode.state)) {
            (0,_canvas_board_controllers_objects_RotateObjectController__WEBPACK_IMPORTED_MODULE_1__.showRotateCursor)();
        }
    }
    onMouseOut() {
        if ((0,_canvas_board_controllers_BoardMode__WEBPACK_IMPORTED_MODULE_0__.canRotate)(this.board.controller.mode.state)) {
            (0,_canvas_primitives_dom__WEBPACK_IMPORTED_MODULE_5__.resetCursor)();
        }
    }
}


/***/ }),

/***/ "./src/canvas/board/objects/ui/selectable/Selectable.ts":
/*!**************************************************************!*\
  !*** ./src/canvas/board/objects/ui/selectable/Selectable.ts ***!
  \**************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Selectable": () => (/* binding */ Selectable),
/* harmony export */   "SelectionOptions": () => (/* binding */ SelectionOptions),
/* harmony export */   "getTopSelectableOnEventStack": () => (/* binding */ getTopSelectableOnEventStack)
/* harmony export */ });
/* harmony import */ var _canvas_board_objects_foundation_Group__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @canvas/board/objects/foundation/Group */ "./src/canvas/board/objects/foundation/Group.ts");
/* harmony import */ var _canvas_board_objects_foundation_RotateContainer__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @canvas/board/objects/foundation/RotateContainer */ "./src/canvas/board/objects/foundation/RotateContainer.ts");
/* harmony import */ var _canvas_board_objects_ui_selectable_ResizeFrame__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @canvas/board/objects/ui/selectable/ResizeFrame */ "./src/canvas/board/objects/ui/selectable/ResizeFrame.ts");
/* harmony import */ var _canvas_board_objects_ui_selectable_SelectionOverlay__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @canvas/board/objects/ui/selectable/SelectionOverlay */ "./src/canvas/board/objects/ui/selectable/SelectionOverlay.ts");




class SelectionOptions {
    constructor(canMove = false, canResize = false, canRotate = false, resizeHandles = _canvas_board_objects_ui_selectable_ResizeFrame__WEBPACK_IMPORTED_MODULE_2__.allPositionings) {
        this.canMove = canMove;
        this.canResize = canResize;
        this.canRotate = canRotate;
        this.resizeHandles = resizeHandles;
    }
}
class Selectable extends _canvas_board_objects_foundation_Group__WEBPACK_IMPORTED_MODULE_0__.Group {
    constructor(content, options = content.selectionOptions ||
        new SelectionOptions()) {
        super();
        this.content = content;
        this.options = options;
        this.isSelectable = true;
        this._isSelected = false;
        this.overlay = new _canvas_board_objects_ui_selectable_SelectionOverlay__WEBPACK_IMPORTED_MODULE_3__.SelectionOverlay(this, this.options);
        this.rotatedContent = new _canvas_board_objects_foundation_RotateContainer__WEBPACK_IMPORTED_MODULE_1__.RotateContainer(this.content, this.content);
        this.overlayWrapper = new _canvas_board_objects_foundation_RotateContainer__WEBPACK_IMPORTED_MODULE_1__.RotateContainer(this.overlay, this.content);
        this.children = [this.rotatedContent];
    }
    get isSelected() {
        return this._isSelected;
    }
    set isSelected(isSelected) {
        if (this._isSelected != isSelected) {
            this._isSelected = isSelected;
            if (this._isSelected) {
                this.board.addObjectsAbove([this.overlayWrapper], this.board.controller.minOverlayMarker);
            }
            else {
                this.board.removeObjects([this.overlayWrapper]);
            }
        }
        this.overlay.isSelected = isSelected;
    }
    onSpawn(board) {
        super.onSpawn(board);
        const select = board.controller.select;
        const mouse = this.board.controller.mouse;
        this.subscriptions.push(mouse.onMouseDown.listen(this, e => {
            select.onObjectMouseDown(e);
        }));
        this.subscriptions.push(mouse.onMouseClick.listen(this, e => {
            select.onObjectClick(e);
        }));
        this.subscriptions.push(select.onSelect.listen(undefined, e => {
            this.isSelected = this.isSelected || e.target == this.content;
        }));
        this.subscriptions.push(select.onDeselect.listen(undefined, e => {
            this.isSelected = this.isSelected && e.target != this.content;
        }));
    }
    onDespawn(board) {
        if (this._isSelected) {
            this.board.removeObjects([this.overlayWrapper]);
        }
        super.onDespawn(board);
    }
}
function getTopSelectableOnEventStack(eventStack) {
    if (eventStack === undefined) {
        return undefined;
    }
    for (const item of eventStack) {
        if ("isSelectable" in item) {
            return item;
        }
    }
    return undefined;
}


/***/ }),

/***/ "./src/canvas/board/objects/ui/selectable/SelectionFrame.ts":
/*!******************************************************************!*\
  !*** ./src/canvas/board/objects/ui/selectable/SelectionFrame.ts ***!
  \******************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "SelectioFrameStyle": () => (/* binding */ SelectioFrameStyle),
/* harmony export */   "SelectionFrame": () => (/* binding */ SelectionFrame)
/* harmony export */ });
/* harmony import */ var _canvas_board_objects_GeometricObject__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @canvas/board/objects/GeometricObject */ "./src/canvas/board/objects/GeometricObject.ts");
/* harmony import */ var _config_draw__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @config/draw */ "./src/config/draw.ts");


class SelectioFrameStyle {
    constructor(frameColor = _config_draw__WEBPACK_IMPORTED_MODULE_1__.defaultFrameColor, frameWidth = 1) {
        this.frameColor = frameColor;
        this.frameWidth = frameWidth;
    }
}
class SelectionFrame extends _canvas_board_objects_GeometricObject__WEBPACK_IMPORTED_MODULE_0__.GeometricObject {
    constructor(overlay, style = new SelectioFrameStyle()) {
        super();
        this.overlay = overlay;
        this.style = style;
    }
    boundingBox(viewport) {
        const stretch = this.style.frameWidth / 2;
        return this.overlay.selectable.content
            .boundingBox(viewport)
            .stretch(stretch, stretch, stretch, stretch);
    }
    draw(renderCtx) {
        const selectionFrame = this.boundingBox(renderCtx.viewport);
        renderCtx.ctx.lineWidth = this.style.frameWidth;
        renderCtx.ctx.globalCompositeOperation = "difference";
        renderCtx.ctx.strokeStyle = "white";
        renderCtx.ctx.strokeRect(selectionFrame.position.x, selectionFrame.position.y, selectionFrame.size.x, selectionFrame.size.y);
        renderCtx.ctx.globalCompositeOperation = "source-over";
        renderCtx.ctx.globalAlpha = 0.5;
        renderCtx.ctx.strokeStyle = this.style.frameColor;
        renderCtx.ctx.strokeRect(selectionFrame.position.x, selectionFrame.position.y, selectionFrame.size.x, selectionFrame.size.y);
    }
    castRay() {
        // Frame is not hittable
        return undefined;
    }
}


/***/ }),

/***/ "./src/canvas/board/objects/ui/selectable/SelectionOverlay.ts":
/*!********************************************************************!*\
  !*** ./src/canvas/board/objects/ui/selectable/SelectionOverlay.ts ***!
  \********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "SelectionOverlay": () => (/* binding */ SelectionOverlay)
/* harmony export */ });
/* harmony import */ var _canvas_board_controllers_BoardMode__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @canvas/board/controllers/BoardMode */ "./src/canvas/board/controllers/BoardMode.ts");
/* harmony import */ var _canvas_board_controllers_objects_MoveObjectController__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @canvas/board/controllers/objects/MoveObjectController */ "./src/canvas/board/controllers/objects/MoveObjectController.ts");
/* harmony import */ var _canvas_board_objects_foundation_Group__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @canvas/board/objects/foundation/Group */ "./src/canvas/board/objects/foundation/Group.ts");
/* harmony import */ var _canvas_board_objects_ui_selectable_ResizeFrame__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @canvas/board/objects/ui/selectable/ResizeFrame */ "./src/canvas/board/objects/ui/selectable/ResizeFrame.ts");
/* harmony import */ var _canvas_board_objects_ui_selectable_RotateFrame__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @canvas/board/objects/ui/selectable/RotateFrame */ "./src/canvas/board/objects/ui/selectable/RotateFrame.ts");
/* harmony import */ var _canvas_board_objects_ui_selectable_SelectionFrame__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @canvas/board/objects/ui/selectable/SelectionFrame */ "./src/canvas/board/objects/ui/selectable/SelectionFrame.ts");
/* harmony import */ var _canvas_primitives_dom__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @canvas/primitives/dom */ "./src/canvas/primitives/dom.ts");







class SelectionOverlay extends _canvas_board_objects_foundation_Group__WEBPACK_IMPORTED_MODULE_2__.Group {
    constructor(selectable, options) {
        super();
        this.selectable = selectable;
        this.options = options;
        this._isSelected = false;
        this.selectionFrame = new _canvas_board_objects_ui_selectable_SelectionFrame__WEBPACK_IMPORTED_MODULE_5__.SelectionFrame(this);
        if (this.options.canResize) {
            this.resizeFrame = new _canvas_board_objects_ui_selectable_ResizeFrame__WEBPACK_IMPORTED_MODULE_3__.ResizeFrame(this, this.options.resizeHandles);
        }
        if (this.options.canRotate) {
            this.rotateFrame = new _canvas_board_objects_ui_selectable_RotateFrame__WEBPACK_IMPORTED_MODULE_4__.RotateFrame(this);
        }
        this.updateChildren();
    }
    get isSelected() {
        return this._isSelected;
    }
    set isSelected(isSelected) {
        this._isSelected = isSelected;
        this.updateChildren();
    }
    onSpawn(board) {
        super.onSpawn(board);
        const ctrl = this.board.controller;
        const mouse = ctrl.mouse;
        this.subscriptions.push(mouse.onMouseMove.listen(this.selectable, () => {
            if (this.options.canMove &&
                (0,_canvas_board_controllers_BoardMode__WEBPACK_IMPORTED_MODULE_0__.canMove)(ctrl.mode.state) &&
                this.isSelected) {
                (0,_canvas_board_controllers_objects_MoveObjectController__WEBPACK_IMPORTED_MODULE_1__.showCanMoveCursor)();
            }
        }));
        this.subscriptions.push(mouse.onMouseOut.listen(this.selectable, () => {
            if ((0,_canvas_board_controllers_BoardMode__WEBPACK_IMPORTED_MODULE_0__.canSelect)(ctrl.mode.state)) {
                (0,_canvas_primitives_dom__WEBPACK_IMPORTED_MODULE_6__.resetCursor)();
            }
        }));
        // TODO: make this general for all canManipulate modes
        this.subscriptions.push(ctrl.mode.onEnter.listen(_canvas_board_controllers_BoardMode__WEBPACK_IMPORTED_MODULE_0__.BoardMode.TextEditing, () => {
            this.updateChildren();
        }));
        this.subscriptions.push(ctrl.mode.onExit.listen(_canvas_board_controllers_BoardMode__WEBPACK_IMPORTED_MODULE_0__.BoardMode.TextEditing, () => {
            this.updateChildren();
        }));
    }
    onDespawn(board) {
        (0,_canvas_primitives_dom__WEBPACK_IMPORTED_MODULE_6__.resetCursor)();
        super.onDespawn(board);
    }
    updateChildren() {
        if (this.board === undefined) {
            return;
        }
        const children = [];
        if (this._isSelected) {
            children.push(this.selectionFrame);
            const manipulatable = 
            // Only selected
            this.board.controller.select.selectedObjects.size == 1 &&
                (0,_canvas_board_controllers_BoardMode__WEBPACK_IMPORTED_MODULE_0__.canManipulate)(this.board.controller.mode.state);
            if (this.options.canRotate && manipulatable) {
                children.push(this.rotateFrame);
            }
            if (this.options.canResize && manipulatable) {
                children.push(this.resizeFrame);
            }
        }
        this.children = children;
    }
}


/***/ }),

/***/ "./src/canvas/index.ts":
/*!*****************************!*\
  !*** ./src/canvas/index.ts ***!
  \*****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "EventHandler": () => (/* binding */ EventHandler),
/* harmony export */   "create": () => (/* binding */ create)
/* harmony export */ });
/* harmony import */ var _canvas_board_Board__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @canvas/board/Board */ "./src/canvas/board/Board.ts");
/* harmony import */ var _canvas_primitives_events__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @canvas/primitives/events */ "./src/canvas/primitives/events.ts");


function create(boardId, configOverride = {}) {
    const boardElement = document.getElementById(boardId);
    const board = new _canvas_board_Board__WEBPACK_IMPORTED_MODULE_0__.Board(window, boardElement, new _canvas_board_Board__WEBPACK_IMPORTED_MODULE_0__.BoardConfig().copy(configOverride));
    board.run();
    return board;
}
const EventHandler = _canvas_primitives_events__WEBPACK_IMPORTED_MODULE_1__.EventHandler;


/***/ }),

/***/ "./src/canvas/primitives/StateMachine.ts":
/*!***********************************************!*\
  !*** ./src/canvas/primitives/StateMachine.ts ***!
  \***********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "StateMachine": () => (/* binding */ StateMachine),
/* harmony export */   "StateMachineTransitionEvent": () => (/* binding */ StateMachineTransitionEvent)
/* harmony export */ });
/* harmony import */ var _canvas_primitives_events__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @canvas/primitives/events */ "./src/canvas/primitives/events.ts");

class StateMachineTransitionEvent extends _canvas_primitives_events__WEBPACK_IMPORTED_MODULE_0__.EventBase {
    constructor(mode) {
        super([mode]);
    }
}
class StateMachine {
    constructor(_state) {
        this._state = _state;
        this.onEnter = new _canvas_primitives_events__WEBPACK_IMPORTED_MODULE_0__.EventHandler();
        this.onExit = new _canvas_primitives_events__WEBPACK_IMPORTED_MODULE_0__.EventHandler();
    }
    get state() {
        return this._state;
    }
    set state(state) {
        this.onExit.dispatch(new StateMachineTransitionEvent(this._state));
        this._state = state;
        this.onEnter.dispatch(new StateMachineTransitionEvent(this._state));
    }
}


/***/ }),

/***/ "./src/canvas/primitives/dom.ts":
/*!**************************************!*\
  !*** ./src/canvas/primitives/dom.ts ***!
  \**************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "mousePositionToElement": () => (/* binding */ mousePositionToElement),
/* harmony export */   "resetCursor": () => (/* binding */ resetCursor),
/* harmony export */   "setCursor": () => (/* binding */ setCursor)
/* harmony export */ });
/* harmony import */ var _canvas_primitives_space__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @canvas/primitives/space */ "./src/canvas/primitives/space.ts");

function mousePositionToElement(e, element) {
    const clientRect = element.getBoundingClientRect();
    return new _canvas_primitives_space__WEBPACK_IMPORTED_MODULE_0__.Vector2(e.clientX - clientRect.x, e.clientY - clientRect.y);
}
function setCursor(cursor) {
    document.body.style.cursor = cursor;
}
function resetCursor() {
    setCursor("auto");
}


/***/ }),

/***/ "./src/canvas/primitives/events.ts":
/*!*****************************************!*\
  !*** ./src/canvas/primitives/events.ts ***!
  \*****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "EventBase": () => (/* binding */ EventBase),
/* harmony export */   "EventHandler": () => (/* binding */ EventHandler),
/* harmony export */   "createDomEventListener": () => (/* binding */ createDomEventListener),
/* harmony export */   "getTargetOfEventStack": () => (/* binding */ getTargetOfEventStack),
/* harmony export */   "unsubscribeAll": () => (/* binding */ unsubscribeAll)
/* harmony export */ });
/* harmony import */ var _config_debug__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @config/debug */ "./src/config/debug.ts");

class EventBase {
    constructor(
    /**
     * Event stack sorted from inner to outer element
     */
    eventStack) {
        this.eventStack = eventStack;
        this._propagationStopped = false;
        this._defaultPrevented = false;
    }
    get type() {
        return this.constructor;
    }
    get target() {
        return getTargetOfEventStack(this.eventStack);
    }
    stopPropagation() {
        this._propagationStopped = true;
    }
    get propagationStopped() {
        return this._propagationStopped;
    }
    preventDefault() {
        this._defaultPrevented = true;
    }
    get defaultPrevented() {
        return this._defaultPrevented;
    }
}
class EventHandler {
    constructor() {
        this.eventListeners = new Map();
        this.eventListenersNextId = new Map();
    }
    listen(target, callback) {
        if (!this.eventListenersNextId.has(target)) {
            this.eventListenersNextId.set(target, 0);
            this.eventListeners.set(target, new Map());
        }
        const listenId = this.eventListenersNextId.get(target);
        this.eventListenersNextId.set(target, listenId + 1);
        this.eventListeners.get(target).set(listenId, callback);
        // Return function to unlisten
        return {
            unsubscribe: () => {
                this.eventListeners.get(target).delete(listenId);
            },
        };
    }
    dispatch(event) {
        if (_config_debug__WEBPACK_IMPORTED_MODULE_0__.DebugConfig.logAllEvents) {
            console.log(event);
        }
        if (event.eventStack !== undefined) {
            for (const element of event.eventStack) {
                // Last element in stack is the outer-most element
                // Bubble from inside out (first to last)
                const listeners = this.eventListeners.get(element);
                this.dispatchToListeners(event, listeners);
                if (event.propagationStopped) {
                    return;
                }
            }
        }
        // Global event
        const listeners = this.eventListeners.get(undefined);
        this.dispatchToListeners(event, listeners);
    }
    dispatchToListeners(event, listeners) {
        if (!listeners) {
            return;
        }
        listeners.forEach(listener => {
            try {
                listener(event);
            }
            catch (exception) {
                console.error(exception);
            }
        });
    }
}
function createDomEventListener(element, type, listener, options) {
    element.addEventListener(type, listener, options);
    return {
        unsubscribe: () => {
            element.removeEventListener(type, listener, options);
        },
    };
}
function unsubscribeAll(subscriptions) {
    subscriptions.forEach(sub => {
        sub.unsubscribe();
    });
    subscriptions.length = 0;
}
function getTargetOfEventStack(eventStack) {
    return eventStack === undefined || eventStack.length == 0
        ? undefined
        : eventStack[0];
}


/***/ }),

/***/ "./src/canvas/primitives/space.ts":
/*!****************************************!*\
  !*** ./src/canvas/primitives/space.ts ***!
  \****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "BoundingBox": () => (/* binding */ BoundingBox),
/* harmony export */   "Vector2": () => (/* binding */ Vector2),
/* harmony export */   "doBoundingBoxesOverlap": () => (/* binding */ doBoundingBoxesOverlap),
/* harmony export */   "rayInBoundingBox": () => (/* binding */ rayInBoundingBox)
/* harmony export */ });
class Vector2 {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
    plus(other) {
        return new Vector2(this.x + other.x, this.y + other.y);
    }
    minus(other) {
        return new Vector2(this.x - other.x, this.y - other.y);
    }
    scale(scalar) {
        return new Vector2(scalar * this.x, scalar * this.y);
    }
    /**
     * Rotates a 2D vector by `radians` clockwise around `around`.
     * @param radians Clockwise (in system where 0,0 is in top-left corner)
     *      radians for rotation.
     *      In normal coordinate system, this is considered counter-clockwise
     * @param around Origin of rotation
     */
    rotate(radians, around = Vector2.origin) {
        if (radians == 0) {
            return this;
        }
        // Move vector to the origin (relative to the rotation point)
        const x = this.x - around.x;
        const y = this.y - around.y;
        // Rotate
        const sin = Math.sin(radians);
        const cos = Math.cos(radians);
        let xNew = x * cos - y * sin;
        let yNew = x * sin + y * cos;
        // Move back where it was before
        xNew += around.x;
        yNew += around.y;
        return new Vector2(xNew, yNew);
    }
    round() {
        return new Vector2(Math.round(this.x), Math.round(this.y));
    }
    get euclideanNorm() {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    }
    replacePartial(x, y) {
        if (x instanceof Vector2) {
            y = x.y;
            x = x.x;
        }
        return new Vector2(x === undefined || isNaN(x) ? this.x : x, y === undefined || isNaN(y) ? this.y : y);
    }
    equals(other) {
        return this.x === other.x && this.y === other.y;
    }
    toString() {
        return `Vector2(${this.x},${this.y})`;
    }
}
Vector2.origin = new Vector2(0, 0);
class BoundingBox {
    constructor(position, size) {
        this.position = position;
        this.size = size;
    }
    /**
     *
     * @param position Returns a BoundingBox with non-negative size.
     * @param size
     */
    static normalized(position, size) {
        return new BoundingBox(new Vector2(position.x + (size.x < 0 ? size.x : 0), position.y + (size.y < 0 ? size.y : 0)), new Vector2(Math.abs(size.x), Math.abs(size.y)));
    }
    round() {
        return new BoundingBox(this.position.round(), this.size.round());
    }
    /**
     * Stretch (enlarge) a bounding box in all directions.
     * Negative values can be used to make it smaller
     * @param top
     * @param right
     * @param bottom
     * @param left
     */
    stretch(top, right, bottom, left) {
        return new BoundingBox(new Vector2(this.position.x - left, this.position.y - top), new Vector2(this.size.x + left + right, this.size.y + top + bottom));
    }
    center() {
        return this.position.plus(this.size.scale(0.5));
    }
    equals(other) {
        return (other !== undefined &&
            this.position.equals(other.position) &&
            this.size.equals(other.size));
    }
}
function rayInBoundingBox(rayPosition, boundingBox) {
    const bottomRight = boundingBox.position.plus(boundingBox.size);
    return (boundingBox.position.x <= rayPosition.x &&
        boundingBox.position.y <= rayPosition.y &&
        bottomRight.x >= rayPosition.x &&
        bottomRight.y >= rayPosition.y);
}
function doBoundingBoxesOverlap(a, b) {
    const aRightBottom = a.position.plus(a.size);
    const bRightBottom = b.position.plus(b.size);
    const leftMax = Math.max(a.position.x, b.position.x);
    const rightMin = Math.min(aRightBottom.x, bRightBottom.x);
    const topMax = Math.max(a.position.y, b.position.y);
    const bottomMin = Math.min(aRightBottom.y, bRightBottom.y);
    return rightMin > leftMax && bottomMin > topMax;
}


/***/ }),

/***/ "./src/canvas/render/CanvasLayer.ts":
/*!******************************************!*\
  !*** ./src/canvas/render/CanvasLayer.ts ***!
  \******************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "CanvasLayer": () => (/* binding */ CanvasLayer),
/* harmony export */   "tintBoundingBox": () => (/* binding */ tintBoundingBox)
/* harmony export */ });
/* harmony import */ var _config_debug__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @config/debug */ "./src/config/debug.ts");
/* harmony import */ var _RenderContext__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./RenderContext */ "./src/canvas/render/RenderContext.ts");


class CanvasLayer {
    constructor(ctx, dpr = 1) {
        this.ctx = ctx;
        this.dpr = dpr;
        this.objects = [];
    }
    render(timestamp, viewport) {
        var _a;
        // Check if canvas size changed
        if (viewport.size != ((_a = this.lastViewport) === null || _a === void 0 ? void 0 : _a.size)) {
            this.rescale(viewport);
        }
        this.lastViewport = viewport;
        // Clear before redraw
        this.clear(viewport);
        // Create render context for objects
        const renderCtx = new _RenderContext__WEBPACK_IMPORTED_MODULE_1__.RenderContext(viewport, this.ctx, timestamp, this.dpr);
        // Redraw all objects
        for (const object of this.objects) {
            this.ctx.save();
            object.draw(renderCtx);
            this.ctx.restore();
            if (_config_debug__WEBPACK_IMPORTED_MODULE_0__.DebugConfig.tintBoundingBoxes) {
                tintBoundingBox(object, renderCtx);
            }
        }
    }
    get needsRendering() {
        return this.objects.some(o => o.needsRedraw);
    }
    updateObjects(objects) {
        this.objects = objects;
    }
    clear(viewport) {
        // TODO: What happens with elements outside of viewport?
        // Clear viewport
        this.ctx.clearRect(0, 0, viewport.size.x, viewport.size.y);
    }
    rescale(viewport) {
        const scaledSize = viewport.size.scale(this.dpr);
        const canvas = this.ctx.canvas;
        canvas.width = scaledSize.x;
        canvas.height = scaledSize.y;
        canvas.style.width = `${viewport.size.x}px`;
        canvas.style.height = `${viewport.size.y}px`;
        this.ctx.scale(this.dpr, this.dpr);
    }
}
function tintBoundingBox(object, renderCtx, boundingBox) {
    if (boundingBox === undefined && "boundingBox" in object) {
        boundingBox = object.boundingBox(renderCtx.viewport);
    }
    if (boundingBox === undefined) {
        return;
    }
    const hash = object.constructor.name
        .split("")
        .map(c => c.charCodeAt(0))
        .reduce((acc, val) => (acc + acc) ^ val, 0) % 360;
    renderCtx.ctx.save();
    renderCtx.ctx.fillStyle = `hsl(${hash},100%,50%)`;
    renderCtx.ctx.lineWidth = 1;
    renderCtx.ctx.globalAlpha = 0.1;
    const bb = boundingBox.stretch(1, 1, 1, 1);
    renderCtx.ctx.fillRect(bb.position.x, bb.position.y, bb.size.x, bb.size.y);
    renderCtx.ctx.restore();
}


/***/ }),

/***/ "./src/canvas/render/LayeredRenderer.ts":
/*!**********************************************!*\
  !*** ./src/canvas/render/LayeredRenderer.ts ***!
  \**********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "LayeredRenderer": () => (/* binding */ LayeredRenderer)
/* harmony export */ });
/* harmony import */ var _canvas_render_ZBuffer__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @canvas/render/ZBuffer */ "./src/canvas/render/ZBuffer.ts");
/* harmony import */ var _CanvasLayer__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./CanvasLayer */ "./src/canvas/render/CanvasLayer.ts");


class LayeredRenderer {
    constructor(window, targetElement, contextHolder) {
        this.window = window;
        this.targetElement = targetElement;
        this.contextHolder = contextHolder;
        this.buffer = new _canvas_render_ZBuffer__WEBPACK_IMPORTED_MODULE_0__.ZBuffer();
        this.canvasLayers = [];
        this.isRendering = false;
        this.renderingRequested = false;
        this.forceFullRendering = false;
        this.dpr = window.devicePixelRatio || 1;
        this.addCanvasLayer();
    }
    requestFullRender() {
        this.forceFullRendering = true;
        if (!this.renderingRequested) {
            this.requestAnimationFrame();
        }
    }
    addObjects(objects, z) {
        this.buffer.addMany(objects, z);
        this.updateCanvasLayers();
        this.markDirtyObjects(objects);
    }
    addObjectsAbove(objects, lastBelow) {
        this.addObjects(objects, this.buffer.getIndex(lastBelow) + 1);
    }
    addObjectsBelow(objects, firstOnTop) {
        this.addObjects(objects, this.buffer.getIndex(firstOnTop));
    }
    removeObjects(objects) {
        this.buffer.removeMany(objects);
        this.updateCanvasLayers();
        this.markDirtyObjects(objects);
    }
    moveObjectsTo(objects, z) {
        this.buffer.moveManyTo(objects, z);
        this.updateCanvasLayers();
        this.markDirtyObjects(objects);
    }
    /**
     * Move objects (while maintaining their relative ordering to each other)
     * on top of another existing object.
     */
    moveObjectsAbove(objects, lastBelow) {
        this.moveObjectsTo(objects, this.buffer.getIndex(lastBelow) + 1);
    }
    moveObjectsBelow(objects, firstOnTop) {
        this.moveObjectsTo(objects, this.buffer.getIndex(firstOnTop));
    }
    reorderManyAbove(sortedObjects, lastBelow) {
        this.buffer.reorderManyTo(sortedObjects, this.buffer.getIndex(lastBelow) + 1);
        this.updateCanvasLayers();
        this.markDirtyObjects(sortedObjects);
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    markDirtyObjects(objects) {
        // Ignore objects for now, dirty objects cause a complete redraw.
        // TODO: In future implementations, only specific layers or regions
        // could be redrawn.
        this.requestFullRender();
    }
    get objects() {
        return this.buffer.sorted();
    }
    requestAnimationFrame() {
        if (!this.renderingRequested) {
            this.renderingRequested = true;
            this.window.requestAnimationFrame((timestamp) => {
                this.renderingRequested = false;
                this.render(timestamp);
            });
        }
    }
    render(timestamp) {
        if (this.isRendering) {
            console.error("Rendering invoked during rendering.");
        }
        /* *** Start of rendering *** */
        this.isRendering = true;
        for (const layer of this.canvasLayers) {
            if (this.forceFullRendering || layer.needsRendering) {
                layer.render(timestamp, this.contextHolder.viewport);
            }
        }
        // Reset force full rendering
        this.forceFullRendering = false;
        this.isRendering = false;
        /* *** End of rendering *** */
        // Request next animation frame if a layer needs re-rendering
        if (this.canvasLayers.some(l => l.needsRendering)) {
            this.requestAnimationFrame();
        }
    }
    addCanvasLayer() {
        const canvasElement = document.createElement("canvas");
        this.targetElement.appendChild(canvasElement);
        const ctx = canvasElement.getContext("2d");
        this.canvasLayers.push(new _CanvasLayer__WEBPACK_IMPORTED_MODULE_1__.CanvasLayer(ctx, this.dpr));
    }
    updateCanvasLayers() {
        this.canvasLayers[0].updateObjects(this.objects);
    }
}


/***/ }),

/***/ "./src/canvas/render/RenderContext.ts":
/*!********************************************!*\
  !*** ./src/canvas/render/RenderContext.ts ***!
  \********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "RenderContext": () => (/* binding */ RenderContext)
/* harmony export */ });
class RenderContext {
    constructor(viewport, ctx, timestamp, dpr) {
        this.viewport = viewport;
        this.ctx = ctx;
        this.timestamp = timestamp;
        this.dpr = dpr;
    }
}


/***/ }),

/***/ "./src/canvas/render/Viewport.ts":
/*!***************************************!*\
  !*** ./src/canvas/render/Viewport.ts ***!
  \***************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "TopLeftClippedViewport": () => (/* binding */ TopLeftClippedViewport),
/* harmony export */   "Viewport": () => (/* binding */ Viewport)
/* harmony export */ });
/* harmony import */ var _canvas_primitives_space__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @canvas/primitives/space */ "./src/canvas/primitives/space.ts");

class Viewport {
    constructor(size = _canvas_primitives_space__WEBPACK_IMPORTED_MODULE_0__.Vector2.origin, zoomLevel = 1.0, origin = _canvas_primitives_space__WEBPACK_IMPORTED_MODULE_0__.Vector2.origin) {
        this.size = size;
        this.zoomLevel = zoomLevel;
        this.origin = origin;
    }
    modified(size = this.size, zoomLevel = this.zoomLevel, origin = this.origin) {
        return new Viewport(size, zoomLevel, origin);
    }
    toViewportPosition(worldPosition) {
        return new _canvas_primitives_space__WEBPACK_IMPORTED_MODULE_0__.Vector2(this.zoomLevel * (worldPosition.x - this.origin.x), this.zoomLevel * (worldPosition.y - this.origin.y));
    }
    toViewportSize(worldSize) {
        return worldSize.scale(this.zoomLevel);
    }
    toWorldPosition(viewportPosition) {
        return new _canvas_primitives_space__WEBPACK_IMPORTED_MODULE_0__.Vector2(viewportPosition.x / this.zoomLevel + this.origin.x, viewportPosition.y / this.zoomLevel + this.origin.y);
    }
    toWorldSize(viewportSize) {
        return viewportSize.scale(1 / this.zoomLevel);
    }
}
Viewport.world = new Viewport(_canvas_primitives_space__WEBPACK_IMPORTED_MODULE_0__.Vector2.origin, 1.0, _canvas_primitives_space__WEBPACK_IMPORTED_MODULE_0__.Vector2.origin);
class TopLeftClippedViewport extends Viewport {
    constructor(viewportClipOffset, size, zoomLevel, origin) {
        super(size, zoomLevel, origin);
        this.viewportClipOffset = viewportClipOffset;
    }
    modified(size = this.size, zoomLevel = this.zoomLevel, origin = this.origin) {
        const clippedOrigin = new _canvas_primitives_space__WEBPACK_IMPORTED_MODULE_0__.Vector2(Math.max(Math.min(this.viewportClipOffset.x, -0.5 * this.size.x) /
            this.zoomLevel, origin.x), Math.max(Math.min(this.viewportClipOffset.y, -0.5 * this.size.y) /
            this.zoomLevel, origin.y));
        return new TopLeftClippedViewport(this.viewportClipOffset, size, zoomLevel, clippedOrigin);
    }
}


/***/ }),

/***/ "./src/canvas/render/ZBuffer.ts":
/*!**************************************!*\
  !*** ./src/canvas/render/ZBuffer.ts ***!
  \**************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "ZBuffer": () => (/* binding */ ZBuffer)
/* harmony export */ });
/* harmony import */ var _ext_Array__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @ext/Array */ "./src/ext/Array.ts");

class ZBuffer {
    constructor() {
        this.buffer = [];
        this.indices = new Map();
    }
    add(object, z) {
        this.addMany([object], z);
    }
    addMany(objects, z) {
        this.checkNotExist(objects);
        if (z === undefined) {
            // No index specified: Stack on top
            z = this.buffer.length;
        }
        if (z >= this.buffer.length) {
            // Stack on top
            this.buffer.push(...objects);
        }
        else {
            // Index already exists
            // Move all existing objects from this index upwards one slot up
            this.buffer.splice(z, 0, ...objects);
        }
        this.reindex(z);
    }
    remove(object) {
        this.removeMany([object]);
    }
    removeMany(objects) {
        if (objects.length == 0) {
            return;
        }
        this.checkExist(objects);
        const zs = this.sortedObjects(objects);
        const zMin = this.indices.get(zs[0]);
        // Rebuild array from minZ on with remaining objects
        const remaining = [];
        let i = zMin;
        let j = 0;
        for (; i < this.buffer.length && j < zs.length; ++i) {
            if (this.buffer[i] == zs[j]) {
                // Came across object to remove:
                // Advance and skip item in reamining
                ++j;
            }
            else {
                remaining.push(this.buffer[i]);
            }
        }
        objects.forEach(object => {
            this.indices.delete(object);
        });
        this.buffer.splice(zMin, i - zMin, ...remaining);
        this.reindex(zMin);
    }
    moveTo(object, z) {
        this.moveManyTo([object], z);
    }
    moveManyTo(objects, z) {
        this.checkExist(objects);
        // Store relative ordering of objects
        const sortedObjects = this.sortedObjects(objects);
        this.removeMany(objects);
        this.addMany(sortedObjects, z);
    }
    reorderManyTo(sortedObjects, z) {
        this.checkExist(sortedObjects);
        this.removeMany(sortedObjects);
        this.addMany(sortedObjects, z);
    }
    getIndex(object) {
        return this.indices.get(object);
    }
    sorted() {
        return [...this.buffer];
    }
    checkNotExist(objects) {
        const existing = objects.filter(object => this.indices.has(object));
        if (existing.length > 0) {
            throw ["Cannot use existing objects:", existing];
        }
    }
    checkExist(objects) {
        const nonExisting = objects.filter(object => !this.indices.has(object));
        if (nonExisting.length > 0) {
            throw ["Cannot use non-existing objects:", nonExisting];
        }
    }
    sortedObjects(objects) {
        return objects
            .map(object => [object, this.getIndex(object)])
            .sort((a, b) => a[1] - b[1])
            .map((x) => x[0]);
    }
    reindex(fromInclude = 0, toExclude = this.buffer.length) {
        for (let i = fromInclude; i < toExclude; ++i) {
            const object = this.buffer[i];
            this.indices.set(object, i);
        }
    }
}


/***/ }),

/***/ "./src/canvas/utils/debounce.ts":
/*!**************************************!*\
  !*** ./src/canvas/utils/debounce.ts ***!
  \**************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "debounce": () => (/* binding */ debounce)
/* harmony export */ });
function debounce(func, debounceMs, immediate = false) {
    let timeout;
    return function (...args) {
        // eslint-disable-next-line @typescript-eslint/no-this-alias
        const context = this;
        const deferred = () => {
            timeout = undefined;
            if (!immediate) {
                func.apply(context, args);
            }
        };
        const shouldCallNow = immediate && timeout === undefined;
        if (timeout !== undefined) {
            clearTimeout(timeout);
        }
        timeout = setTimeout(deferred, debounceMs);
        if (shouldCallNow) {
            func.apply(context, args);
        }
    };
}


/***/ }),

/***/ "./src/canvas/utils/input/Binds.ts":
/*!*****************************************!*\
  !*** ./src/canvas/utils/input/Binds.ts ***!
  \*****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Bind": () => (/* binding */ Bind),
/* harmony export */   "Binds": () => (/* binding */ Binds)
/* harmony export */ });
/* harmony import */ var _canvas_utils_input_ModifierState__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @canvas/utils/input/ModifierState */ "./src/canvas/utils/input/ModifierState.ts");

class Bind {
    constructor(config) {
        this.modifier = config.modifier || _canvas_utils_input_ModifierState__WEBPACK_IMPORTED_MODULE_0__.ModifierState.None;
        this.keyCode = config.keyCode || undefined;
        this.mouseButtons = config.mouseButtons || undefined;
    }
    equals(other) {
        return (this.modifier.equals(other.modifier) &&
            this.keyCode == other.keyCode &&
            this.mouseButtons == other.mouseButtons);
    }
}
class Binds {
    constructor(...bindings) {
        this.bindings = bindings;
    }
    keyboard(event) {
        return this.anyEquals(new Bind({
            modifier: _canvas_utils_input_ModifierState__WEBPACK_IMPORTED_MODULE_0__.ModifierState.fromDomEvent(event),
            keyCode: event.code,
        }));
    }
    mousePress(event) {
        return this.anyEquals(new Bind({
            modifier: event.modifiers,
            mouseButtons: event.button,
        }));
    }
    modifiers(event) {
        return this.anyModifiersEqual(event.modifiers);
    }
    anyEquals(other) {
        return this.bindings.some(b => b.equals(other));
    }
    anyModifiersEqual(other) {
        return this.bindings.some(b => b.modifier.equals(other));
    }
}


/***/ }),

/***/ "./src/canvas/utils/input/ModifierState.ts":
/*!*************************************************!*\
  !*** ./src/canvas/utils/input/ModifierState.ts ***!
  \*************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "ModifierState": () => (/* binding */ ModifierState)
/* harmony export */ });
class ModifierState {
    constructor(shift, alt, ctrl) {
        this.shift = shift;
        this.alt = alt;
        this.ctrl = ctrl;
    }
    static fromParams(params) {
        return new ModifierState(params.shift || false, params.alt || false, params.ctrl || false);
    }
    static fromDomEvent(event) {
        return new ModifierState(event.shiftKey, event.altKey, event.ctrlKey || event.metaKey);
    }
    equals(other) {
        return (this.shift === other.shift &&
            this.alt === other.alt &&
            this.ctrl === other.ctrl);
    }
}
ModifierState.None = ModifierState.fromParams({});
ModifierState.Shift = ModifierState.fromParams({ shift: true });
ModifierState.Alt = ModifierState.fromParams({ alt: true });
ModifierState.Ctrl = ModifierState.fromParams({ ctrl: true });


/***/ }),

/***/ "./src/canvas/utils/input/MouseButton.ts":
/*!***********************************************!*\
  !*** ./src/canvas/utils/input/MouseButton.ts ***!
  \***********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "MouseButton": () => (/* binding */ MouseButton)
/* harmony export */ });
var MouseButton;
(function (MouseButton) {
    MouseButton[MouseButton["None"] = 0] = "None";
    MouseButton[MouseButton["Left"] = 1] = "Left";
    MouseButton[MouseButton["Middle"] = 2] = "Middle";
    MouseButton[MouseButton["Right"] = 4] = "Right";
})(MouseButton || (MouseButton = {}));


/***/ }),

/***/ "./src/canvas/utils/input/Wheel.ts":
/*!*****************************************!*\
  !*** ./src/canvas/utils/input/Wheel.ts ***!
  \*****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "getWheelBoost": () => (/* binding */ getWheelBoost)
/* harmony export */ });
/* harmony import */ var _config_interaction__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @config/interaction */ "./src/config/interaction.ts");

function getWheelBoost(e) {
    switch (e.deltaMode) {
        case WheelEvent.DOM_DELTA_LINE:
            return _config_interaction__WEBPACK_IMPORTED_MODULE_0__.lineWheelBoost;
        case WheelEvent.DOM_DELTA_PAGE:
            return _config_interaction__WEBPACK_IMPORTED_MODULE_0__.pageWheelBoost;
        default:
            return 1;
    }
}


/***/ }),

/***/ "./src/config/bindings.ts":
/*!********************************!*\
  !*** ./src/config/bindings.ts ***!
  \********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Binding": () => (/* binding */ Binding)
/* harmony export */ });
/* harmony import */ var _canvas_utils_input_Binds__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @canvas/utils/input/Binds */ "./src/canvas/utils/input/Binds.ts");
/* harmony import */ var _canvas_utils_input_ModifierState__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @canvas/utils/input/ModifierState */ "./src/canvas/utils/input/ModifierState.ts");
/* harmony import */ var _canvas_utils_input_MouseButton__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @canvas/utils/input/MouseButton */ "./src/canvas/utils/input/MouseButton.ts");



class Binding {
}
Binding.WheelPan = new _canvas_utils_input_Binds__WEBPACK_IMPORTED_MODULE_0__.Binds(new _canvas_utils_input_Binds__WEBPACK_IMPORTED_MODULE_0__.Bind({ modifier: _canvas_utils_input_ModifierState__WEBPACK_IMPORTED_MODULE_1__.ModifierState.None }));
Binding.WheelPanInverse = new _canvas_utils_input_Binds__WEBPACK_IMPORTED_MODULE_0__.Binds(new _canvas_utils_input_Binds__WEBPACK_IMPORTED_MODULE_0__.Bind({ modifier: _canvas_utils_input_ModifierState__WEBPACK_IMPORTED_MODULE_1__.ModifierState.Shift }));
Binding.WheelZoom = new _canvas_utils_input_Binds__WEBPACK_IMPORTED_MODULE_0__.Binds(new _canvas_utils_input_Binds__WEBPACK_IMPORTED_MODULE_0__.Bind({ modifier: _canvas_utils_input_ModifierState__WEBPACK_IMPORTED_MODULE_1__.ModifierState.Ctrl }));
Binding.ResetZoom = new _canvas_utils_input_Binds__WEBPACK_IMPORTED_MODULE_0__.Binds(new _canvas_utils_input_Binds__WEBPACK_IMPORTED_MODULE_0__.Bind({ modifier: _canvas_utils_input_ModifierState__WEBPACK_IMPORTED_MODULE_1__.ModifierState.Ctrl, keyCode: "Digit0" }));
Binding.ZoomIn = new _canvas_utils_input_Binds__WEBPACK_IMPORTED_MODULE_0__.Binds(new _canvas_utils_input_Binds__WEBPACK_IMPORTED_MODULE_0__.Bind({ modifier: _canvas_utils_input_ModifierState__WEBPACK_IMPORTED_MODULE_1__.ModifierState.Ctrl, keyCode: "Equal" }));
Binding.ZoomOut = new _canvas_utils_input_Binds__WEBPACK_IMPORTED_MODULE_0__.Binds(new _canvas_utils_input_Binds__WEBPACK_IMPORTED_MODULE_0__.Bind({ modifier: _canvas_utils_input_ModifierState__WEBPACK_IMPORTED_MODULE_1__.ModifierState.Ctrl, keyCode: "Minus" }));
Binding.SingleSelect = new _canvas_utils_input_Binds__WEBPACK_IMPORTED_MODULE_0__.Binds(new _canvas_utils_input_Binds__WEBPACK_IMPORTED_MODULE_0__.Bind({ mouseButtons: _canvas_utils_input_MouseButton__WEBPACK_IMPORTED_MODULE_2__.MouseButton.Left }));
Binding.MultiSelect = new _canvas_utils_input_Binds__WEBPACK_IMPORTED_MODULE_0__.Binds(new _canvas_utils_input_Binds__WEBPACK_IMPORTED_MODULE_0__.Bind({
    modifier: _canvas_utils_input_ModifierState__WEBPACK_IMPORTED_MODULE_1__.ModifierState.Shift,
    mouseButtons: _canvas_utils_input_MouseButton__WEBPACK_IMPORTED_MODULE_2__.MouseButton.Left,
}));
Binding.Move = new _canvas_utils_input_Binds__WEBPACK_IMPORTED_MODULE_0__.Binds(new _canvas_utils_input_Binds__WEBPACK_IMPORTED_MODULE_0__.Bind({ mouseButtons: _canvas_utils_input_MouseButton__WEBPACK_IMPORTED_MODULE_2__.MouseButton.Left }));
Binding.RotateStep = new _canvas_utils_input_Binds__WEBPACK_IMPORTED_MODULE_0__.Binds(new _canvas_utils_input_Binds__WEBPACK_IMPORTED_MODULE_0__.Bind({ modifier: _canvas_utils_input_ModifierState__WEBPACK_IMPORTED_MODULE_1__.ModifierState.Shift }));
Binding.ResizeCrop = new _canvas_utils_input_Binds__WEBPACK_IMPORTED_MODULE_0__.Binds(new _canvas_utils_input_Binds__WEBPACK_IMPORTED_MODULE_0__.Bind({ modifier: _canvas_utils_input_ModifierState__WEBPACK_IMPORTED_MODULE_1__.ModifierState.Shift }));
Binding.ToggleGuidelineSnap = new _canvas_utils_input_Binds__WEBPACK_IMPORTED_MODULE_0__.Binds(new _canvas_utils_input_Binds__WEBPACK_IMPORTED_MODULE_0__.Bind({ modifier: _canvas_utils_input_ModifierState__WEBPACK_IMPORTED_MODULE_1__.ModifierState.Alt }));


/***/ }),

/***/ "./src/config/debug.ts":
/*!*****************************!*\
  !*** ./src/config/debug.ts ***!
  \*****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "DebugConfig": () => (/* binding */ DebugConfig)
/* harmony export */ });
class DebugConfig {
}
DebugConfig.tintBoundingBoxes = false;
DebugConfig.logAllEvents = false;
DebugConfig.alwaysShowGuidelines = false;


/***/ }),

/***/ "./src/config/draw.ts":
/*!****************************!*\
  !*** ./src/config/draw.ts ***!
  \****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "canMoveCursor": () => (/* binding */ canMoveCursor),
/* harmony export */   "defaultBackgroundColor": () => (/* binding */ defaultBackgroundColor),
/* harmony export */   "defaultCursor": () => (/* binding */ defaultCursor),
/* harmony export */   "defaultFillColor": () => (/* binding */ defaultFillColor),
/* harmony export */   "defaultFrameColor": () => (/* binding */ defaultFrameColor),
/* harmony export */   "defaultFrameFill": () => (/* binding */ defaultFrameFill),
/* harmony export */   "defaultStrokeColor": () => (/* binding */ defaultStrokeColor),
/* harmony export */   "imageMissingColor": () => (/* binding */ imageMissingColor),
/* harmony export */   "inverseStrokeColor": () => (/* binding */ inverseStrokeColor),
/* harmony export */   "maxFontSize": () => (/* binding */ maxFontSize),
/* harmony export */   "minFontSize": () => (/* binding */ minFontSize),
/* harmony export */   "moveCursor": () => (/* binding */ moveCursor)
/* harmony export */ });
// Colors
const defaultStrokeColor = "black";
const inverseStrokeColor = "white";
const defaultFillColor = "black";
const defaultBackgroundColor = "white";
const defaultFrameColor = "#1060B0";
const defaultFrameFill = "rgba(16, 96, 176, 0.3)";
const imageMissingColor = "#CCCCCC";
// Cursor styles
const defaultCursor = "auto";
const canMoveCursor = "grab";
const moveCursor = "grabbing";
// Font
const minFontSize = 1;
const maxFontSize = 500;


/***/ }),

/***/ "./src/config/interaction.ts":
/*!***********************************!*\
  !*** ./src/config/interaction.ts ***!
  \***********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "activateCenterGuides": () => (/* binding */ activateCenterGuides),
/* harmony export */   "lineWheelBoost": () => (/* binding */ lineWheelBoost),
/* harmony export */   "moveThreshold": () => (/* binding */ moveThreshold),
/* harmony export */   "pageWheelBoost": () => (/* binding */ pageWheelBoost),
/* harmony export */   "rotateStepSize": () => (/* binding */ rotateStepSize),
/* harmony export */   "showGuidelineDistance": () => (/* binding */ showGuidelineDistance),
/* harmony export */   "standardMinGuideDistance": () => (/* binding */ standardMinGuideDistance)
/* harmony export */ });
const moveThreshold = 3;
const rotateStepSize = Math.PI / 4;
const showGuidelineDistance = 5;
const standardMinGuideDistance = 10;
const activateCenterGuides = true;
const lineWheelBoost = 18;
const pageWheelBoost = 90;


/***/ }),

/***/ "./src/ext/Array.ts":
/*!**************************!*\
  !*** ./src/ext/Array.ts ***!
  \**************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
(() => {
    if (!Array.prototype.reversed) {
        Array.prototype.reversed = function* () {
            let i = this.length;
            while (i > 0) {
                yield this[--i];
            }
        };
    }
    if (!Array.prototype.min) {
        Array.prototype.min = function (compareFn) {
            const n = this.length;
            let min = undefined;
            for (let i = 0; i < n; ++i) {
                const curr = this[i];
                if (min === undefined) {
                    min = curr;
                }
                else if (compareFn(min, curr) > 0) {
                    min = curr;
                }
            }
            return min;
        };
    }
})();



/***/ }),

/***/ "./src/ext/Set.ts":
/*!************************!*\
  !*** ./src/ext/Set.ts ***!
  \************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "ImmutableSetView": () => (/* binding */ ImmutableSetView)
/* harmony export */ });
class ImmutableSetView {
    constructor(set) {
        this.set = set;
    }
    has(value) {
        return this.set.has(value);
    }
    forEach(callbackfn) {
        this.set.forEach(callbackfn);
    }
    get size() {
        return this.set.size;
    }
    *[Symbol.iterator]() {
        for (const curr of this.set) {
            yield curr;
        }
    }
}
(() => {
    if (!Set.prototype.immutable) {
        Set.prototype.immutable = function () {
            return new ImmutableSetView(this);
        };
    }
})();


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
/*!***************************!*\
  !*** ./src/canvas/dev.ts ***!
  \***************************/
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "EventHandler": () => (/* binding */ EventHandler),
/* harmony export */   "create": () => (/* binding */ create),
/* harmony export */   "fillSamples": () => (/* binding */ fillSamples)
/* harmony export */ });
/* harmony import */ var _canvas_board_controllers_board_FontController__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @canvas/board/controllers/board/FontController */ "./src/canvas/board/controllers/board/FontController.ts");
/* harmony import */ var _canvas_board_objects_items_BlockText__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @canvas/board/objects/items/BlockText */ "./src/canvas/board/objects/items/BlockText.ts");
/* harmony import */ var _canvas_board_objects_items_ImageItem__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @canvas/board/objects/items/ImageItem */ "./src/canvas/board/objects/items/ImageItem.ts");
/* harmony import */ var _canvas_board_objects_items_Rectangle__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @canvas/board/objects/items/Rectangle */ "./src/canvas/board/objects/items/Rectangle.ts");
/* harmony import */ var _canvas_board_objects_items_StyledText__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @canvas/board/objects/items/StyledText */ "./src/canvas/board/objects/items/StyledText.ts");
/* harmony import */ var _canvas_board_objects_ui_selectable_Selectable__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @canvas/board/objects/ui/selectable/Selectable */ "./src/canvas/board/objects/ui/selectable/Selectable.ts");
/* harmony import */ var _canvas_primitives_events__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @canvas/primitives/events */ "./src/canvas/primitives/events.ts");
/* harmony import */ var _canvas_primitives_space__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @canvas/primitives/space */ "./src/canvas/primitives/space.ts");
/* harmony import */ var _config_draw__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! @config/draw */ "./src/config/draw.ts");
/* harmony import */ var _board_objects_items_StickyNote__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./board/objects/items/StickyNote */ "./src/canvas/board/objects/items/StickyNote.ts");
/* harmony import */ var _index__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./index */ "./src/canvas/index.ts");











function fillSamples(board) {
    function addContentOnTop(content) {
        board.addObjectsBelow(content, board.controller.maxContentMarker);
    }
    addContentOnTop([
        new _canvas_board_objects_ui_selectable_Selectable__WEBPACK_IMPORTED_MODULE_5__.Selectable(new _canvas_board_objects_items_Rectangle__WEBPACK_IMPORTED_MODULE_3__.Rectangle("#000000", new _canvas_primitives_space__WEBPACK_IMPORTED_MODULE_7__.Vector2(0, 0), new _canvas_primitives_space__WEBPACK_IMPORTED_MODULE_7__.Vector2(100, 100)), new _canvas_board_objects_ui_selectable_Selectable__WEBPACK_IMPORTED_MODULE_5__.SelectionOptions(true, true, false)),
        new _canvas_board_objects_ui_selectable_Selectable__WEBPACK_IMPORTED_MODULE_5__.Selectable(new _canvas_board_objects_items_Rectangle__WEBPACK_IMPORTED_MODULE_3__.Rectangle(_config_draw__WEBPACK_IMPORTED_MODULE_8__.defaultFrameColor, new _canvas_primitives_space__WEBPACK_IMPORTED_MODULE_7__.Vector2(300, 100), new _canvas_primitives_space__WEBPACK_IMPORTED_MODULE_7__.Vector2(200, 100), Math.PI / 4), new _canvas_board_objects_ui_selectable_Selectable__WEBPACK_IMPORTED_MODULE_5__.SelectionOptions(true, true, false)),
        new _canvas_board_objects_ui_selectable_Selectable__WEBPACK_IMPORTED_MODULE_5__.Selectable(new _canvas_board_objects_items_Rectangle__WEBPACK_IMPORTED_MODULE_3__.Rectangle(_config_draw__WEBPACK_IMPORTED_MODULE_8__.defaultBackgroundColor, new _canvas_primitives_space__WEBPACK_IMPORTED_MODULE_7__.Vector2(520, 100), new _canvas_primitives_space__WEBPACK_IMPORTED_MODULE_7__.Vector2(200, 100), Math.PI / 2)),
    ]);
    const lorem = `
Majoruslonguslinoswoodchuckchuckinawood
Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
incididunt ut labore et dolore magna aliqua. Enim facilisis gravida neque
convallis a. Aliquam eleifend mi in nulla. Pulvinar etiam non quam lacus
suspendisse faucibus interdum posuere. Porta non pulvinar neque laoreet
suspendisse interdum consectetur. Donec ultrices tincidunt arcu non. Vitae purus
faucibus ornare suspendisse sed nisi. Justo donec enim diam vulputate ut
pharetra sit. Consequat nisl vel pretium lectus quam id leo in vitae.
Pulvinar pellentesque habitant morbi tristique senectus.
Superlonguswordusandsoondusblablablablubb andanotherreallylongwordblablablubbsadad         Hi
`;
    const loremBlockText = new _canvas_board_objects_ui_selectable_Selectable__WEBPACK_IMPORTED_MODULE_5__.Selectable(new _canvas_board_objects_items_BlockText__WEBPACK_IMPORTED_MODULE_1__.BlockText(lorem, "#333377", 18, new _canvas_board_controllers_board_FontController__WEBPACK_IMPORTED_MODULE_0__.Font("Helvetica"), new _canvas_primitives_space__WEBPACK_IMPORTED_MODULE_7__.Vector2(350, 500), new _canvas_primitives_space__WEBPACK_IMPORTED_MODULE_7__.Vector2(300, 200)));
    addContentOnTop([
        new _canvas_board_objects_ui_selectable_Selectable__WEBPACK_IMPORTED_MODULE_5__.Selectable(new _canvas_board_objects_items_StyledText__WEBPACK_IMPORTED_MODULE_4__.StyledText("Hello 世界", "#333377", 50, new _canvas_board_controllers_board_FontController__WEBPACK_IMPORTED_MODULE_0__.Font("Helvetica"), new _canvas_primitives_space__WEBPACK_IMPORTED_MODULE_7__.Vector2(700, 200), 0.7)),
        new _canvas_board_objects_ui_selectable_Selectable__WEBPACK_IMPORTED_MODULE_5__.Selectable(new _canvas_board_objects_items_StyledText__WEBPACK_IMPORTED_MODULE_4__.StyledText("Hello 世界", "#333377", 50, new _canvas_board_controllers_board_FontController__WEBPACK_IMPORTED_MODULE_0__.Font("Helvetica"), new _canvas_primitives_space__WEBPACK_IMPORTED_MODULE_7__.Vector2(700, 200))),
        new _canvas_board_objects_ui_selectable_Selectable__WEBPACK_IMPORTED_MODULE_5__.Selectable(new _canvas_board_objects_items_StyledText__WEBPACK_IMPORTED_MODULE_4__.StyledText("Multi-line\ntext\nنص\n한글로", "#333377", 50, new _canvas_board_controllers_board_FontController__WEBPACK_IMPORTED_MODULE_0__.Font("Helvetica"), new _canvas_primitives_space__WEBPACK_IMPORTED_MODULE_7__.Vector2(100, 500)), new _canvas_board_objects_ui_selectable_Selectable__WEBPACK_IMPORTED_MODULE_5__.SelectionOptions(false, false, true)),
        loremBlockText,
        new _canvas_board_objects_ui_selectable_Selectable__WEBPACK_IMPORTED_MODULE_5__.Selectable(new _canvas_board_objects_items_BlockText__WEBPACK_IMPORTED_MODULE_1__.BlockText(lorem, "#330000", 18, new _canvas_board_controllers_board_FontController__WEBPACK_IMPORTED_MODULE_0__.Font("Hanalei"), new _canvas_primitives_space__WEBPACK_IMPORTED_MODULE_7__.Vector2(800, 500), new _canvas_primitives_space__WEBPACK_IMPORTED_MODULE_7__.Vector2(300, 200), 0.7)),
        new _canvas_board_objects_ui_selectable_Selectable__WEBPACK_IMPORTED_MODULE_5__.Selectable(new _board_objects_items_StickyNote__WEBPACK_IMPORTED_MODULE_9__.StickyNote("The newly created note has a yellow background and a placeholder text “Edit here”", "#000", "#DECD00", 14, new _canvas_board_controllers_board_FontController__WEBPACK_IMPORTED_MODULE_0__.Font("Open Sans"), new _canvas_primitives_space__WEBPACK_IMPORTED_MODULE_7__.Vector2(350, 500), new _canvas_primitives_space__WEBPACK_IMPORTED_MODULE_7__.Vector2(300, 200), 0, false, 10)),
    ]);
    const selectionContainers = [];
    const n = 100;
    for (let i = 0; i < n; i++) {
        selectionContainers.push(new _canvas_board_objects_ui_selectable_Selectable__WEBPACK_IMPORTED_MODULE_5__.Selectable(new _canvas_board_objects_items_Rectangle__WEBPACK_IMPORTED_MODULE_3__.Rectangle("#" + (((1 << 24) * Math.random()) | 0).toString(16), new _canvas_primitives_space__WEBPACK_IMPORTED_MODULE_7__.Vector2(600 + i * 220, 300), new _canvas_primitives_space__WEBPACK_IMPORTED_MODULE_7__.Vector2(200, 100))));
    }
    addContentOnTop(selectionContainers);
    addContentOnTop([
        new _canvas_board_objects_ui_selectable_Selectable__WEBPACK_IMPORTED_MODULE_5__.Selectable(new _canvas_board_objects_items_ImageItem__WEBPACK_IMPORTED_MODULE_2__.ImageItem(new _canvas_board_objects_items_ImageItem__WEBPACK_IMPORTED_MODULE_2__.ImageSet({
            width: 1200,
            height: 1134,
            url: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a1/Panama_hat.jpg/1200px-Panama_hat.jpg",
        }, [
            {
                width: 474,
                height: 447,
                url: "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Ftse3.mm.bing.net%2Fth%3Fid%3DOIP.Aa6w6hSm8mbUt0QzBYhmbwHaG_%26pid%3DApi&f=1",
            },
        ]), new _canvas_primitives_space__WEBPACK_IMPORTED_MODULE_7__.Vector2(1100, 50), 0, false, new _canvas_primitives_space__WEBPACK_IMPORTED_MODULE_7__.Vector2(1200 / 6, 1134 / 6), _canvas_primitives_space__WEBPACK_IMPORTED_MODULE_7__.Vector2.origin, 1 / 6)),
    ]);
    addContentOnTop([
        new _canvas_board_objects_ui_selectable_Selectable__WEBPACK_IMPORTED_MODULE_5__.Selectable(new _canvas_board_objects_items_ImageItem__WEBPACK_IMPORTED_MODULE_2__.ImageItem(new _canvas_board_objects_items_ImageItem__WEBPACK_IMPORTED_MODULE_2__.ImageSet({
            width: 1200,
            height: 1134,
            url: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a1/this_does_not_exist.jpg",
        }), new _canvas_primitives_space__WEBPACK_IMPORTED_MODULE_7__.Vector2(1100, 300), 0, false, new _canvas_primitives_space__WEBPACK_IMPORTED_MODULE_7__.Vector2(1200 / 6, 1134 / 6), _canvas_primitives_space__WEBPACK_IMPORTED_MODULE_7__.Vector2.origin, 1 / 6)),
    ]);
}
const create = _index__WEBPACK_IMPORTED_MODULE_10__.create;
const EventHandler = _canvas_primitives_events__WEBPACK_IMPORTED_MODULE_6__.EventHandler;

})();

Piero = __webpack_exports__;
/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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Q0FBQyxDQUFDO1FBRW5ELElBQUksQ0FBQyxVQUFVLEVBQUUsQ0FBQztJQUN0QixDQUFDO0lBRU0sUUFBUTtRQUNYLElBQUksQ0FBQyxXQUFXLENBQUMsUUFBUSxFQUFFLENBQUM7UUFFNUIsSUFBSSxDQUFDLElBQUksQ0FBQyxRQUFRLEVBQUUsQ0FBQztRQUNyQixJQUFJLENBQUMsR0FBRyxDQUFDLFFBQVEsRUFBRSxDQUFDO1FBRXBCLElBQUksQ0FBQyxJQUFJLENBQUMsUUFBUSxFQUFFLENBQUM7UUFFckIsSUFBSSxDQUFDLFdBQVcsQ0FBQyxRQUFRLEVBQUUsQ0FBQztRQUU1QixJQUFJLENBQUMsTUFBTSxDQUFDLFFBQVEsRUFBRSxDQUFDO1FBQ3ZCLElBQUksQ0FBQyxTQUFTLENBQUMsUUFBUSxFQUFFLENBQUM7UUFFMUIsSUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLFlBQVksRUFBRTtZQUNqQyxJQUFJLENBQUMsSUFBSSxDQUFDLFFBQVEsRUFBRSxDQUFDO1lBQ3JCLElBQUksQ0FBQyxNQUFNLENBQUMsUUFBUSxFQUFFLENBQUM7WUFDdkIsSUFBSSxDQUFDLE1BQU0sQ0FBQyxRQUFRLEVBQUUsQ0FBQztZQUV2QixJQUFJLENBQUMsU0FBUyxDQUFDLFFBQVEsRUFBRSxDQUFDO1NBQzdCO1FBRUQsSUFBSSxDQUFDLEtBQUssQ0FBQyxRQUFRLEVBQUUsQ0FBQztJQUMxQixDQUFDO0lBRU0sVUFBVTtRQUNiLElBQUksQ0FBQyxXQUFXLENBQUMsVUFBVSxFQUFFLENBQUM7UUFFOUIsSUFBSSxDQUFDLElBQUksQ0FBQyxVQUFVLEVBQUUsQ0FBQztRQUN2QixJQUFJLENBQUMsR0FBRyxDQUFDLFVBQVUsRUFBRSxDQUFDO1FBRXRCLElBQUksQ0FBQyxJQUFJLENBQUMsVUFBVSxFQUFFLENBQUM7UUFFdkIsSUFBSSxDQUFDLFdBQVcsQ0FBQyxRQUFRLEVBQUUsQ0FBQztRQUU1QixJQUFJLENBQUMsTUFBTSxDQUFDLFVBQVUsRUFBRSxDQUFDO1FBQ3pCLElBQUksQ0FBQyxTQUFT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SSw2REFBTyxDQUFDLElBQUksRUFBRSxFQUFFLENBQUMsRUFDckIsQ0FBQyxFQUNELEtBQUssRUFDTCxJQUFJLDZEQUFPLENBQUMsSUFBSSxHQUFHLENBQUMsRUFBRSxJQUFJLEdBQUcsQ0FBQyxDQUFDLEVBQy9CLG9FQUFjLEVBQ2QsQ0FBQyxHQUFHLENBQUMsQ0FDUixDQUNKO0tBQ0osQ0FBQyxDQUFDO0lBRUgsZUFBZSxDQUFDO1FBQ1osSUFBSSxzRkFBVSxDQUNWLElBQUksNEVBQVMsQ0FDVCxJQUFJLDJFQUFRLENBQUM7WUFDVCxLQUFLLEVBQUUsSUFBSTtZQUNYLE1BQU0sRUFBRSxJQUFJO1lBQ1osR0FBRyxFQUNDLG1GQUFtRjtTQUMxRixDQUFDLEVBQ0YsSUFBSSw2REFBTyxDQUFDLElBQUksRUFBRSxHQUFHLENBQUMsRUFDdEIsQ0FBQyxFQUNELEtBQUssRUFDTCxJQUFJLDZEQUFPLENBQUMsSUFBSSxHQUFHLENBQUMsRUFBRSxJQUFJLEdBQUcsQ0FBQyxDQUFDLEVBQy9CLG9FQUFjLEVBQ2QsQ0FBQyxHQUFHLENBQUMsQ0FDUixDQUNKO0tBQ0osQ0FBQyxDQUFDO0FBQ1AsQ0FBQztBQUVNLE1BQU0sTUFBTSxHQUFHLDJDQUFVLENBQUM7QUFDMUIsTUFBTSxZQUFZLEdBQUcsbUVBQWdCLENBQUMiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9QaWVyby8uL3NyYy9jYW52YXMvYm9hcmQvQm9hcmQudHMiLCJ3ZWJwYWNrOi8vUGllcm8vLi9zcmMvY2FudmFzL2JvYXJkL2NvbnRyb2xsZXJzL0JvYXJkQ29udHJvbGxlci50cyIsIndlYnBhY2s6Ly9QaWVyby8uL3NyYy9jYW52YXMvYm9hcmQvY29udHJvbGxlcnMvQm9hcmRNb2RlLnRzIiwid2VicGFjazovL1BpZXJvLy4vc3JjL2NhbnZhcy9ib2FyZC9jb250cm9sbGVycy9ib2FyZC9Cb2FyZFJlc2l6ZUNvbnRyb2xsZXIudHMiLCJ3ZWJwYWNrOi8vUGllcm8vLi9zcmMvY2FudmFzL2JvYXJkL2NvbnRyb2xsZXJzL2JvYXJkL0ZvbnRDb250cm9sbGVyLnRzIiwid2VicGFjazovL1BpZXJvLy4vc3JjL2NhbnZhcy9ib2FyZC9jb250cm9sbGVycy9ib2FyZC9QYW5Db250cm9sbGVyLnRzIiwid2VicGFjazovL1BpZXJvLy4vc3JjL2NhbnZhcy9ib2FyZC9jb250cm9sbGVycy9ib2FyZC9QaW5jaFpvb21Db250cm9sbGVyLnRzIiwid2VicGFjazovL1BpZXJvLy4vc3JjL2NhbnZhcy9ib2FyZC9jb250cm9sbGVycy9ib2FyZC9XaGVlbFpvb21Db250cm9sbGVyLnRzIiwid2VicGFjazovL1BpZXJvLy4vc3JjL2NhbnZhcy9ib2FyZC9jb250cm9sbGVycy9ib2FyZC9Xb3JsZEJvcmRlckNvbnRyb2xsZXIudHMiLCJ3ZWJwYWNrOi8vUGllcm8vLi9zcmMvY2FudmFzL2JvYXJkL2NvbnRyb2xsZXJzL2JvYXJkL1pvb21Db250cm9sbGVyLnRzIiwid2VicGFjazovL1BpZXJvLy4vc3JjL2NhbnZhcy9ib2FyZC9jb250cm9sbGVycy9vYmplY3RzL0d1aWRlbGluZUNvbnRyb2xsZXIudHMiLCJ3ZWJwYWNrOi8vUGllcm8vLi9zcmMvY2FudmFzL2JvYXJkL2NvbnRyb2xsZXJzL29iamVjdHMvTW91c2VJbnRlcmFjdGlvbkNvbnRyb2xsZXIudHMiLCJ3ZWJwYWNrOi8vUGllcm8vLi9zcmMvY2FudmFzL2JvYXJkL2NvbnRyb2xsZXJzL29iamVjdHMvTW92ZU9iamVjdENvbnRyb2xsZXIudHMiLCJ3ZWJwYWNrOi8vUGllcm8vLi9zcmMvY2FudmFzL2JvYXJkL2NvbnRyb2xsZXJzL29iamVjdHMvUmVzaXplT2JqZWN0Q29udHJvbGxlci50cyIsIndlYnBhY2s6Ly9QaWVyby8uL3NyYy9jYW52YXMvYm9hcmQvY29udHJvbGxlcnMvb2JqZWN0cy9Sb3RhdGVPYmplY3RDb250cm9sbGVyLnRzIiwid2VicGFjazovL1BpZXJvLy4vc3JjL2NhbnZhcy9ib2FyZC9jb250cm9sbGVycy9vYmplY3RzL1NlbGVjdEJveENvbnRyb2xsZXIudHMiLCJ3ZWJwYWNrOi8vUGllcm8vLi9zcmMvY2FudmFzL2JvYXJkL2NvbnRyb2xsZXJzL29iamVjdHMvU2VsZWN0T2JqZWN0Q29udHJvbGxlci50cyIsIndlYnBhY2s6Ly9QaWVyby8uL3NyYy9jYW52YXMvYm9hcmQvb2JqZWN0cy9HZW9tZXRyaWNPYmplY3QudHMiLCJ3ZWJwYWNrOi8vUGllcm8vLi9zcmMvY2FudmFzL2JvYXJkL29iamVjdHMvZm91bmRhdGlvbi9Hcm91cC50cyIsIndlYnBhY2s6Ly9QaWVyby8uL3NyYy9jYW52YXMvYm9hcmQvb2JqZWN0cy9mb3VuZGF0aW9uL0xheWVyTWFya2VyLnRzIiwid2VicGFjazovL1BpZXJvLy4vc3JjL2NhbnZhcy9ib2FyZC9vYmplY3RzL2ZvdW5kYXRpb24vUG9zaXRpb25BbmNob3IudHMiLCJ3ZWJwYWNrOi8vUGllcm8vLi9zcmMvY2FudmFzL2JvYXJkL29iamVjdHMvZm91bmRhdGlvbi9Sb3RhdGVDb250YWluZXIudHMiLCJ3ZWJwYWNrOi8vUGllcm8vLi9zcmMvY2FudmFzL2JvYXJkL29iamVjdHMvaXRlbXMvQmxvY2tUZXh0LnRzIiwid2VicGFjazovL1BpZXJvLy4vc3JjL2NhbnZhcy9ib2FyZC9vYmplY3RzL2l0ZW1zL0JvYXJkSXRlbS50cyIsIndlYnBhY2s6Ly9QaWVyby8uL3NyYy9jYW52YXMvYm9hcmQvb2JqZWN0cy9pdGVtcy9JbWFnZUl0ZW0udHMiLCJ3ZWJwYWNrOi8vUGllcm8vLi9zcmMvY2FudmFzL2JvYXJkL29iamVjdHMvaXRlbXMvUmVjdGFuZ2xlLnRzIiwid2VicGFjazovL1BpZXJvLy4vc3JjL2NhbnZhcy9ib2FyZC9vYmplY3RzL2l0ZW1zL1N0aWNreU5vdGUudHMiLCJ3ZWJwYWNrOi8vUGllcm8vLi9zcmMvY2FudmFzL2JvYXJkL29iamVjdHMvaXRlbXMvU3R5bGVkVGV4dC50cyIsIndlYnBhY2s6Ly9QaWVyby8uL3NyYy9jYW52YXMvYm9hcmQvb2JqZWN0cy9pdGVtcy9UZXh0SXRlbS50cyIsIndlYnBhY2s6Ly9QaWVyby8uL3NyYy9jYW52YXMvYm9hcmQvb2JqZWN0cy91aS9HdWlkZWxpbmUudHMiLCJ3ZWJwYWNrOi8vUGllcm8vLi9zcmMvY2FudmFzL2JvYXJkL29iamVjdHMvdWkvU2VsZWN0Qm94RnJhbWUudHMiLCJ3ZWJwYWNrOi8vUGllcm8vLi9zcmMvY2FudmFzL2JvYXJkL29iamVjdHMvdWkvV29ybGRCb3JkZXIudHMiLCJ3ZWJwYWNrOi8vUGllcm8vLi9zcmMvY2FudmFzL2JvYXJkL29iamVjdHMvdWkvc2VsZWN0YWJsZS9SZXNpemVGcmFtZS50cyIsIndlYnBhY2s6Ly9QaWVyby8uL3NyYy9jYW52YXMvYm9hcmQvb2JqZWN0cy91aS9zZWxlY3RhYmxlL1Jlc2l6ZUhhbmRsZS50cyIsIndlYnBhY2s6Ly9QaWVyby8uL3NyYy9jYW52YXMvYm9hcmQvb2JqZWN0cy91aS9zZWxlY3RhYmxlL1JvdGF0ZUNvbGxpZGVyLnRzIiwid2VicGFjazovL1BpZXJvLy4vc3JjL2NhbnZhcy9ib2FyZC9vYmplY3RzL3VpL3NlbGVjdGFibGUvUm90YXRlRnJhbWUudHMiLCJ3ZWJwYWNrOi8vUGllcm8vLi9zcmMvY2FudmFzL2JvYXJkL29iamVjdHMvdWkvc2VsZWN0YWJsZS9TZWxlY3RhYmxlLnRzIiwid2VicGFjazovL1BpZXJvLy4vc3JjL2NhbnZhcy9ib2FyZC9vYmplY3RzL3VpL3NlbGVjdGFibGUvU2VsZWN0aW9uRnJhbWUudHMiLCJ3ZWJwYWNrOi8vUGllcm8vLi9zcmMvY2FudmFzL2JvYXJkL29iamVjdHMvdWkvc2VsZWN0YWJsZS9TZWxlY3Rpb25PdmVybGF5LnRzIiwid2VicGFjazovL1BpZXJvLy4vc3JjL2NhbnZhcy9pbmRleC50cyIsIndlYnBhY2s6Ly9QaWVyby8uL3NyYy9jYW52YXMvcHJpbWl0aXZlcy9TdGF0ZU1hY2hpbmUudHMiLCJ3ZWJwYWNrOi8vUGllcm8vLi9zcmMvY2FudmFzL3ByaW1pdGl2ZXMvZG9tLnRzIiwid2VicGFjazovL1BpZXJvLy4vc3JjL2NhbnZhcy9wcmltaXRpdmVzL2V2ZW50cy50cyIsIndlYnBhY2s6Ly9QaWVyby8uL3NyYy9jYW52YXMvcHJpbWl0aXZlcy9zcGFjZS50cyIsIndlYnBhY2s6Ly9QaWVyby8uL3NyYy9jYW52YXMvcmVuZGVyL0NhbnZhc0xheWVyLnRzIiwid2VicGFjazovL1BpZXJvLy4vc3JjL2NhbnZhcy9yZW5kZXIvTGF5ZXJlZFJlbmRlcmVyLnRzIiwid2VicGFjazovL1BpZXJvLy4vc3JjL2NhbnZhcy9yZW5kZXIvUmVuZGVyQ29udGV4dC50cyIsIndlYnBhY2s6Ly9QaWVyby8uL3NyYy9jYW52YXMvcmVuZGVyL1ZpZXdwb3J0LnRzIiwid2VicGFjazovL1BpZXJvLy4vc3JjL2NhbnZhcy9yZW5kZXIvWkJ1ZmZlci50cyIsIndlYnBhY2s6Ly9QaWVyby8uL3NyYy9jYW52YXMvdXRpbHMvZGVib3VuY2UudHMiLCJ3ZWJwYWNrOi8vUGllcm8vLi9zcmMvY2FudmFzL3V0aWxzL2lucHV0L0JpbmRzLnRzIiwid2VicGFjazovL1BpZXJvLy4vc3JjL2NhbnZhcy91dGlscy9pbnB1dC9Nb2RpZmllclN0YXRlLnRzIiwid2VicGFjazovL1BpZXJvLy4vc3JjL2NhbnZhcy91dGlscy9pbnB1dC9Nb3VzZUJ1dHRvbi50cyIsIndlYnBhY2s6Ly9QaWVyby8uL3NyYy9jYW52YXMvdXRpbHMvaW5wdXQvV2hlZWwudHMiLCJ3ZWJwYWNrOi8vUGllcm8vLi9zcmMvY29uZmlnL2JpbmRpbmdzLnRzIiwid2VicGFjazovL1BpZXJvLy4vc3JjL2NvbmZpZy9kZWJ1Zy50cyIsIndlYnBhY2s6Ly9QaWVyby8uL3NyYy9jb25maWcvZHJhdy50cyIsIndlYnBhY2s6Ly9QaWVyby8uL3NyYy9jb25maWcvaW50ZXJhY3Rpb24udHMiLCJ3ZWJwYWNrOi8vUGllcm8vLi9zcmMvZXh0L0FycmF5LnRzIiwid2VicGFjazovL1BpZXJvLy4vc3JjL2V4dC9TZXQudHMiLCJ3ZWJwYWNrOi8vUGllcm8vd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vUGllcm8vd2VicGFjay9ydW50aW1lL2RlZmluZSBwcm9wZXJ0eSBnZXR0ZXJzIiwid2VicGFjazovL1BpZXJvL3dlYnBhY2svcnVudGltZS9oYXNPd25Qcm9wZXJ0eSBzaG9ydGhhbmQiLCJ3ZWJwYWNrOi8vUGllcm8vd2VicGFjay9ydW50aW1lL21ha2UgbmFtZXNwYWNlIG9iamVjdCIsIndlYnBhY2s6Ly9QaWVyby8uL3NyYy9jYW52YXMvZGV2LnRzIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEJvYXJkQ29udHJvbGxlciB9IGZyb20gXCJAY2FudmFzL2JvYXJkL2NvbnRyb2xsZXJzL0JvYXJkQ29udHJvbGxlclwiO1xuaW1wb3J0IHR5cGUgeyBHZW9tZXRyaWNPYmplY3QgfSBmcm9tIFwiQGNhbnZhcy9ib2FyZC9vYmplY3RzL0dlb21ldHJpY09iamVjdFwiO1xuaW1wb3J0IHsgRXZlbnRCYXNlLCBFdmVudEhhbmRsZXIgfSBmcm9tIFwiQGNhbnZhcy9wcmltaXRpdmVzL2V2ZW50c1wiO1xuaW1wb3J0IHsgVmVjdG9yMiB9IGZyb20gXCJAY2FudmFzL3ByaW1pdGl2ZXMvc3BhY2VcIjtcbmltcG9ydCB7IExheWVyZWRSZW5kZXJlciB9IGZyb20gXCJAY2FudmFzL3JlbmRlci9MYXllcmVkUmVuZGVyZXJcIjtcbmltcG9ydCB0eXBlIHsgVmlld3BvcnQsIFZpZXdwb3J0SG9sZGVyIH0gZnJvbSBcIkBjYW52YXMvcmVuZGVyL1ZpZXdwb3J0XCI7XG5pbXBvcnQgeyBUb3BMZWZ0Q2xpcHBlZFZpZXdwb3J0IH0gZnJvbSBcIkBjYW52YXMvcmVuZGVyL1ZpZXdwb3J0XCI7XG5cbmV4cG9ydCBjbGFzcyBDaGFuZ2VWaWV3cG9ydEV2ZW50IGV4dGVuZHMgRXZlbnRCYXNlPEJvYXJkPiB7XG4gICAgY29uc3RydWN0b3IoXG4gICAgICAgIHJlYWRvbmx5IG5ld1ZpZXdwb3J0OiBWaWV3cG9ydCxcbiAgICAgICAgcmVhZG9ubHkgb2xkVmlld3BvcnQ/OiBWaWV3cG9ydCxcbiAgICAgICAgZXZlbnRTdGFjaz86IEJvYXJkW10sXG4gICAgKSB7XG4gICAgICAgIHN1cGVyKGV2ZW50U3RhY2spO1xuICAgIH1cbn1cblxuZXhwb3J0IGNsYXNzIFNwYXduRXZlbnQgZXh0ZW5kcyBFdmVudEJhc2U8R2VvbWV0cmljT2JqZWN0PiB7fVxuXG5leHBvcnQgY2xhc3MgRGVzcGF3bkV2ZW50IGV4dGVuZHMgU3Bhd25FdmVudCB7fVxuXG5leHBvcnQgY2xhc3MgRGlydHlPYmplY3RFdmVudCBleHRlbmRzIEV2ZW50QmFzZTxHZW9tZXRyaWNPYmplY3Q+IHt9XG5cbmV4cG9ydCBpbnRlcmZhY2UgQm9hcmRDb25maWdQYXJ0aWFsIHtcbiAgICBlbmFibGVHdWlkZWxpbmVTbmFwPzogYm9vbGVhbjtcbiAgICB2aWV3cG9ydENsaXBPZmZzZXQ/OiBWZWN0b3IyO1xuICAgIHZpZXdPbmx5TW9kZT86IGJvb2xlYW47XG59XG5cbmV4cG9ydCBjbGFzcyBCb2FyZENvbmZpZyB7XG4gICAgY29uc3RydWN0b3IoXG4gICAgICAgIHJlYWRvbmx5IGVuYWJsZUd1aWRlbGluZVNuYXAgPSB0cnVlLFxuICAgICAgICByZWFkb25seSB2aWV3cG9ydENsaXBPZmZzZXQgPSBuZXcgVmVjdG9yMigtNTAsIDApLFxuICAgICAgICByZWFkb25seSB2aWV3T25seU1vZGUgPSBmYWxzZSxcbiAgICApIHt9XG5cbiAgICBwdWJsaWMgY29weShvdmVycmlkZXM6IEJvYXJkQ29uZmlnUGFydGlhbCk6IEJvYXJkQ29uZmlnIHtcbiAgICAgICAgcmV0dXJuIG5ldyBCb2FyZENvbmZpZyhcbiAgICAgICAgICAgIG92ZXJyaWRlcy5lbmFibGVHdWlkZWxpbmVTbmFwIHx8IHRoaXMuZW5hYmxlR3VpZGVsaW5lU25hcCxcbiAgICAgICAgICAgIG92ZXJyaWRlcy52aWV3cG9ydENsaXBPZmZzZXQgfHwgdGhpcy52aWV3cG9ydENsaXBPZmZzZXQsXG4gICAgICAgICAgICBvdmVycmlkZXMudmlld09ubHlNb2RlIHx8IHRoaXMudmlld09ubHlNb2RlLFxuICAgICAgICApO1xuICAgIH1cbn1cblxuZXhwb3J0IGNsYXNzIEJvYXJkIGltcGxlbWVudHMgVmlld3BvcnRIb2xkZXIge1xuICAgIHJlYWRvbmx5IGNvbnRyb2xsZXI6IEJvYXJkQ29udHJvbGxlcjtcbiAgICByZWFkb25seSBvbkNoYW5nZVZpZXdwb3J0ID0gbmV3IEV2ZW50SGFuZGxlcjxDaGFuZ2VWaWV3cG9ydEV2ZW50PigpO1xuICAgIHJlYWRvbmx5IG9uU3Bhd24gPSBuZXcgRXZlbnRIYW5kbGVyPFNwYXduRXZlbnQ+KCk7XG4gICAgcmVhZG9ubHkgb25EZXNwYXduID0gbmV3IEV2ZW50SGFuZGxlcjxEZXNwYXduRXZlbnQ+KCk7XG4gICAgcmVhZG9ubHkgb25EaXJ0eSA9IG5ldyBFdmVudEhhbmRsZXI8RGlydHlPYmplY3RFdmVudD4oKTtcblxuICAgIHByaXZhdGUgcmVuZGVyZXI6IExheWVyZWRSZW5kZXJlcjtcbiAgICBwcml2YXRlIF92aWV3cG9ydDtcblxuICAgIGNvbnN0cnVjdG9yKFxuICAgICAgICByZWFkb25seSB3aW5kb3c6IFdpbmRvdyxcbiAgICAgICAgcmVhZG9ubHkgYm9hcmRFbGVtZW50OiBIVE1MRWxlbWVudCxcbiAgICAgICAgcmVhZG9ubHkgY29uZmlnOiBCb2FyZENvbmZpZyA9IG5ldyBCb2FyZENvbmZpZygpLFxuICAgICkge1xuICAgICAgICB0aGlzLl92aWV3cG9ydCA9IG5ldyBUb3BMZWZ0Q2xpcHBlZFZpZXdwb3J0KFxuICAgICAgICAgICAgdGhpcy5jb25maWcudmlld3BvcnRDbGlwT2Zmc2V0LFxuICAgICAgICApO1xuXG4gICAgICAgIHRoaXMucmVuZGVyZXIgPSBuZXcgTGF5ZXJlZFJlbmRlcmVyKHdpbmRvdywgYm9hcmRFbGVtZW50LCB0aGlzKTtcbiAgICAgICAgdGhpcy5jb250cm9sbGVyID0gbmV3IEJvYXJkQ29udHJvbGxlcih0aGlzKTtcbiAgICB9XG5cbiAgICBwdWJsaWMgcnVuKCk6IHZvaWQge1xuICAgICAgICB0aGlzLmNvbnRyb2xsZXIuYWN0aXZhdGUoKTtcblxuICAgICAgICB0aGlzLm9uQ2hhbmdlVmlld3BvcnQubGlzdGVuKHRoaXMsICgpID0+IHtcbiAgICAgICAgICAgIHRoaXMucmVuZGVyZXIucmVxdWVzdEZ1bGxSZW5kZXIoKTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgcHVibGljIHJlcXVlc3RGdWxsUmVuZGVyKCk6IHZvaWQge1xuICAgICAgICB0aGlzLnJlbmRlcmVyLnJlcXVlc3RGdWxsUmVuZGVyKCk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQWRkIGFuIG9iamVjdCBhdCBhIGNlcnRhaW4gcG9zaXRpb24uXG4gICAgICogV2l0aCBgeiA9PSB1bmRlZmluZWRgLCBvYmplY3Qgd2lsbCBiZSBwdXQgb24gdG9wIG9mIGFsbCBleGlzdGluZyBvYmplY3RzLlxuICAgICAqIFogaW5kaWNlcyBhcmUgY29uc2VjdXRpdmUgc3RhcnRpbmcgZnJvbSAwLCB0d28gb2JqZWN0cyBtdXN0IG5vdCBoYXZlXG4gICAgICogdGhlIHNhbWUgeiBpbmRleC5cbiAgICAgKi9cbiAgICBwdWJsaWMgYWRkT2JqZWN0cyhvYmplY3RzOiBHZW9tZXRyaWNPYmplY3RbXSwgekluZGV4PzogbnVtYmVyKTogdm9pZCB7XG4gICAgICAgIHRoaXMucmVuZGVyZXIuYWRkT2JqZWN0cyhvYmplY3RzLCB6SW5kZXgpO1xuICAgICAgICB0aGlzLm5vdGlmeVNwYXduKG9iamVjdHMpO1xuICAgIH1cblxuICAgIHB1YmxpYyBhZGRPYmplY3RzQWJvdmUoXG4gICAgICAgIG9iamVjdHM6IEdlb21ldHJpY09iamVjdFtdLFxuICAgICAgICBsYXN0QmVsb3c6IEdlb21ldHJpY09iamVjdCxcbiAgICApOiB2b2lkIHtcbiAgICAgICAgdGhpcy5yZW5kZXJlci5hZGRPYmplY3RzQWJvdmUob2JqZWN0cywgbGFzdEJlbG93KTtcbiAgICAgICAgdGhpcy5ub3RpZnlTcGF3bihvYmplY3RzKTtcbiAgICB9XG5cbiAgICBwdWJsaWMgYWRkT2JqZWN0c0JlbG93KFxuICAgICAgICBvYmplY3RzOiBHZW9tZXRyaWNPYmplY3RbXSxcbiAgICAgICAgZmlyc3RPblRvcDogR2VvbWV0cmljT2JqZWN0LFxuICAgICk6IHZvaWQge1xuICAgICAgICB0aGlzLnJlbmRlcmVyLmFkZE9iamVjdHNCZWxvdyhvYmplY3RzLCBmaXJzdE9uVG9wKTtcbiAgICAgICAgdGhpcy5ub3RpZnlTcGF3bihvYmplY3RzKTtcbiAgICB9XG5cbiAgICBwdWJsaWMgcmVtb3ZlT2JqZWN0cyhvYmplY3RzOiBHZW9tZXRyaWNPYmplY3RbXSk6IHZvaWQge1xuICAgICAgICB0aGlzLnJlbmRlcmVyLnJlbW92ZU9iamVjdHMob2JqZWN0cyk7XG4gICAgICAgIG9iamVjdHMuZm9yRWFjaChvYmplY3QgPT4ge1xuICAgICAgICAgICAgb2JqZWN0Lm9uRGVzcGF3bih0aGlzKTtcbiAgICAgICAgICAgIHRoaXMub25EZXNwYXduLmRpc3BhdGNoKG5ldyBTcGF3bkV2ZW50KFtvYmplY3RdKSk7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIHB1YmxpYyByZW9yZGVyTWFueUFib3ZlKFxuICAgICAgICBzb3J0ZWRPYmplY3RzOiBHZW9tZXRyaWNPYmplY3RbXSxcbiAgICAgICAgbGFzdEJlbG93OiBHZW9tZXRyaWNPYmplY3QsXG4gICAgKTogdm9pZCB7XG4gICAgICAgIHRoaXMucmVuZGVyZXIucmVvcmRlck1hbnlBYm92ZShzb3J0ZWRPYmplY3RzLCBsYXN0QmVsb3cpO1xuICAgICAgICB0aGlzLm1hcmtEaXJ0eU9iamVjdHMoc29ydGVkT2JqZWN0cyk7XG4gICAgfVxuXG4gICAgcHVibGljIGdldCBvYmplY3RzKCk6IEdlb21ldHJpY09iamVjdFtdIHtcbiAgICAgICAgcmV0dXJuIDxHZW9tZXRyaWNPYmplY3RbXT50aGlzLnJlbmRlcmVyLm9iamVjdHM7XG4gICAgfVxuXG4gICAgcHVibGljIGdldCB2aWV3cG9ydCgpOiBWaWV3cG9ydCB7XG4gICAgICAgIHJldHVybiB0aGlzLl92aWV3cG9ydDtcbiAgICB9XG5cbiAgICBwdWJsaWMgc2V0IHZpZXdwb3J0KG5ld1ZpZXdwb3J0OiBWaWV3cG9ydCkge1xuICAgICAgICBpZiAodGhpcy5fdmlld3BvcnQgPT0gbmV3Vmlld3BvcnQpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IG9sZFZpZXdwb3J0ID0gdGhpcy5fdmlld3BvcnQ7XG5cbiAgICAgICAgdGhpcy5fdmlld3BvcnQgPSB0aGlzLl92aWV3cG9ydC5tb2RpZmllZChcbiAgICAgICAgICAgIG5ld1ZpZXdwb3J0LnNpemUsXG4gICAgICAgICAgICBuZXdWaWV3cG9ydC56b29tTGV2ZWwsXG4gICAgICAgICAgICBuZXdWaWV3cG9ydC5vcmlnaW4sXG4gICAgICAgICk7XG4gICAgICAgIHRoaXMub25DaGFuZ2VWaWV3cG9ydC5kaXNwYXRjaChcbiAgICAgICAgICAgIG5ldyBDaGFuZ2VWaWV3cG9ydEV2ZW50KG5ld1ZpZXdwb3J0LCBvbGRWaWV3cG9ydCwgW3RoaXNdKSxcbiAgICAgICAgKTtcbiAgICB9XG5cbiAgICBwdWJsaWMgbWFya0RpcnR5T2JqZWN0KG9iamVjdDogR2VvbWV0cmljT2JqZWN0KTogdm9pZCB7XG4gICAgICAgIHRoaXMubWFya0RpcnR5T2JqZWN0cyhbb2JqZWN0XSk7XG4gICAgfVxuXG4gICAgcHVibGljIG1hcmtEaXJ0eU9iamVjdHMob2JqZWN0czogR2VvbWV0cmljT2JqZWN0W10pOiB2b2lkIHtcbiAgICAgICAgdGhpcy5yZW5kZXJlci5tYXJrRGlydHlPYmplY3RzKG9iamVjdHMpO1xuXG4gICAgICAgIGZvciAoY29uc3Qgb2JqZWN0IG9mIG9iamVjdHMpIHtcbiAgICAgICAgICAgIHRoaXMub25EaXJ0eS5kaXNwYXRjaChuZXcgRGlydHlPYmplY3RFdmVudChbb2JqZWN0XSkpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBub3RpZnlTcGF3bihvYmplY3RzOiBHZW9tZXRyaWNPYmplY3RbXSk6IHZvaWQge1xuICAgICAgICBvYmplY3RzLmZvckVhY2gob2JqZWN0ID0+IHtcbiAgICAgICAgICAgIG9iamVjdC5vblNwYXduKHRoaXMpO1xuICAgICAgICAgICAgdGhpcy5vblNwYXduLmRpc3BhdGNoKG5ldyBTcGF3bkV2ZW50KFtvYmplY3RdKSk7XG4gICAgICAgIH0pO1xuICAgIH1cbn1cbiIsImltcG9ydCB0eXBlIHsgQm9hcmQgfSBmcm9tIFwiQGNhbnZhcy9ib2FyZC9Cb2FyZFwiO1xuaW1wb3J0IHsgRm9udENvbnRyb2xsZXIgfSBmcm9tIFwiQGNhbnZhcy9ib2FyZC9jb250cm9sbGVycy9ib2FyZC9Gb250Q29udHJvbGxlclwiO1xuaW1wb3J0IHsgV29ybGRCb3JkZXJDb250cm9sbGVyIH0gZnJvbSBcIkBjYW52YXMvYm9hcmQvY29udHJvbGxlcnMvYm9hcmQvV29ybGRCb3JkZXJDb250cm9sbGVyXCI7XG5pbXBvcnQgeyBCb2FyZE1vZGUgfSBmcm9tIFwiQGNhbnZhcy9ib2FyZC9jb250cm9sbGVycy9Cb2FyZE1vZGVcIjtcbmltcG9ydCB7IEd1aWRlbGluZUNvbnRyb2xsZXIgfSBmcm9tIFwiQGNhbnZhcy9ib2FyZC9jb250cm9sbGVycy9vYmplY3RzL0d1aWRlbGluZUNvbnRyb2xsZXJcIjtcbmltcG9ydCB7IE1vdmVPYmplY3RDb250cm9sbGVyIH0gZnJvbSBcIkBjYW52YXMvYm9hcmQvY29udHJvbGxlcnMvb2JqZWN0cy9Nb3ZlT2JqZWN0Q29udHJvbGxlclwiO1xuaW1wb3J0IHsgUmVzaXplT2JqZWN0Q29udHJvbGxlciB9IGZyb20gXCJAY2FudmFzL2JvYXJkL2NvbnRyb2xsZXJzL29iamVjdHMvUmVzaXplT2JqZWN0Q29udHJvbGxlclwiO1xuaW1wb3J0IHsgUm90YXRlT2JqZWN0Q29udHJvbGxlciB9IGZyb20gXCJAY2FudmFzL2JvYXJkL2NvbnRyb2xsZXJzL29iamVjdHMvUm90YXRlT2JqZWN0Q29udHJvbGxlclwiO1xuaW1wb3J0IHsgU2VsZWN0Qm94Q29udHJvbGxlciB9IGZyb20gXCJAY2FudmFzL2JvYXJkL2NvbnRyb2xsZXJzL29iamVjdHMvU2VsZWN0Qm94Q29udHJvbGxlclwiO1xuaW1wb3J0IHsgTGF5ZXJNYXJrZXIgfSBmcm9tIFwiQGNhbnZhcy9ib2FyZC9vYmplY3RzL2ZvdW5kYXRpb24vTGF5ZXJNYXJrZXJcIjtcbmltcG9ydCB7IFN0YXRlTWFjaGluZSB9IGZyb20gXCJAY2FudmFzL3ByaW1pdGl2ZXMvU3RhdGVNYWNoaW5lXCI7XG5cbmltcG9ydCB7IEJvYXJkUmVzaXplQ29udHJvbGxlciB9IGZyb20gXCIuL2JvYXJkL0JvYXJkUmVzaXplQ29udHJvbGxlclwiO1xuaW1wb3J0IHsgUGFuQ29udHJvbGxlciB9IGZyb20gXCIuL2JvYXJkL1BhbkNvbnRyb2xsZXJcIjtcbmltcG9ydCB7IFpvb21Db250cm9sbGVyIH0gZnJvbSBcIi4vYm9hcmQvWm9vbUNvbnRyb2xsZXJcIjtcbmltcG9ydCB7IE1vdXNlSW50ZXJhY3Rpb25Db250cm9sbGVyIH0gZnJvbSBcIi4vb2JqZWN0cy9Nb3VzZUludGVyYWN0aW9uQ29udHJvbGxlclwiO1xuaW1wb3J0IHsgU2VsZWN0T2JqZWN0Q29udHJvbGxlciB9IGZyb20gXCIuL29iamVjdHMvU2VsZWN0T2JqZWN0Q29udHJvbGxlclwiO1xuXG5leHBvcnQgY2xhc3MgQm9hcmRDb250cm9sbGVyIHtcbiAgICAvLyBNYXJrZXJzXG4gICAgcmVhZG9ubHkgbWluQ29udGVudE1hcmtlciA9IG5ldyBMYXllck1hcmtlcigpO1xuICAgIHJlYWRvbmx5IG1heENvbnRlbnRNYXJrZXIgPSBuZXcgTGF5ZXJNYXJrZXIoKTtcbiAgICByZWFkb25seSBtaW5PdmVybGF5TWFya2VyID0gdGhpcy5tYXhDb250ZW50TWFya2VyO1xuICAgIHJlYWRvbmx5IG1heE92ZXJsYXlNYXJrZXIgPSBuZXcgTGF5ZXJNYXJrZXIoKTtcblxuICAgIC8vIE1vZGVcbiAgICByZWFkb25seSBtb2RlID0gbmV3IFN0YXRlTWFjaGluZTxCb2FyZE1vZGU+KEJvYXJkTW9kZS5TZWxlY3QpO1xuXG4gICAgLy8gQm9hcmQgbGV2ZWxcbiAgICByZWFkb25seSBib2FyZFJlc2l6ZTogQm9hcmRSZXNpemVDb250cm9sbGVyO1xuXG4gICAgcmVhZG9ubHkgem9vbTogWm9vbUNvbnRyb2xsZXI7XG4gICAgcmVhZG9ubHkgcGFuOiBQYW5Db250cm9sbGVyO1xuXG4gICAgcmVhZG9ubHkgZm9udDogRm9udENvbnRyb2xsZXI7XG5cbiAgICByZWFkb25seSB3b3JsZEJvcmRlcjogV29ybGRCb3JkZXJDb250cm9sbGVyO1xuXG4gICAgLy8gT2JqZWN0IGludGVyYWN0aW9uXG4gICAgcmVhZG9ubHkgc2VsZWN0OiBTZWxlY3RPYmplY3RDb250cm9sbGVyO1xuICAgIHJlYWRvbmx5IHNlbGVjdEJveDogU2VsZWN0Qm94Q29udHJvbGxlcjtcbiAgICByZWFkb25seSBtb3ZlOiBNb3ZlT2JqZWN0Q29udHJvbGxlcjtcbiAgICByZWFkb25seSByZXNpemU6IFJlc2l6ZU9iamVjdENvbnRyb2xsZXI7XG4gICAgcmVhZG9ubHkgcm90YXRlOiBSb3RhdGVPYmplY3RDb250cm9sbGVyO1xuXG4gICAgcmVhZG9ubHkgZ3VpZGVsaW5lOiBHdWlkZWxpbmVDb250cm9sbGVyO1xuXG4gICAgcmVhZG9ubHkgbW91c2U6IE1vdXNlSW50ZXJhY3Rpb25Db250cm9sbGVyO1xuXG4gICAgY29uc3RydWN0b3IocHJpdmF0ZSBib2FyZDogQm9hcmQpIHtcbiAgICAgICAgdGhpcy5ib2FyZFJlc2l6ZSA9IG5ldyBCb2FyZFJlc2l6ZUNvbnRyb2xsZXIoYm9hcmQpO1xuXG4gICAgICAgIHRoaXMuem9vbSA9IG5ldyBab29tQ29udHJvbGxlcihib2FyZCk7XG4gICAgICAgIHRoaXMucGFuID0gbmV3IFBhbkNvbnRyb2xsZXIoYm9hcmQpO1xuXG4gICAgICAgIHRoaXMuZm9udCA9IG5ldyBGb250Q29udHJvbGxlcihib2FyZCk7XG5cbiAgICAgICAgdGhpcy53b3JsZEJvcmRlciA9IG5ldyBXb3JsZEJvcmRlckNvbnRyb2xsZXIoYm9hcmQpO1xuXG4gICAgICAgIHRoaXMuc2VsZWN0ID0gbmV3IFNlbGVjdE9iamVjdENvbnRyb2xsZXIoYm9hcmQpO1xuICAgICAgICB0aGlzLnNlbGVjdEJveCA9IG5ldyBTZWxlY3RCb3hDb250cm9sbGVyKGJvYXJkKTtcbiAgICAgICAgdGhpcy5tb3ZlID0gbmV3IE1vdmVPYmplY3RDb250cm9sbGVyKGJvYXJkKTtcbiAgICAgICAgdGhpcy5yZXNpemUgPSBuZXcgUmVzaXplT2JqZWN0Q29udHJvbGxlcihib2FyZCk7XG4gICAgICAgIHRoaXMucm90YXRlID0gbmV3IFJvdGF0ZU9iamVjdENvbnRyb2xsZXIoYm9hcmQpO1xuXG4gICAgICAgIHRoaXMuZ3VpZGVsaW5lID0gbmV3IEd1aWRlbGluZUNvbnRyb2xsZXIoYm9hcmQpO1xuXG4gICAgICAgIHRoaXMubW91c2UgPSBuZXcgTW91c2VJbnRlcmFjdGlvbkNvbnRyb2xsZXIoYm9hcmQpO1xuXG4gICAgICAgIHRoaXMuYWRkTWFya2VycygpO1xuICAgIH1cblxuICAgIHB1YmxpYyBhY3RpdmF0ZSgpOiB2b2lkIHtcbiAgICAgICAgdGhpcy5ib2FyZFJlc2l6ZS5hY3RpdmF0ZSgpO1xuXG4gICAgICAgIHRoaXMuem9vbS5hY3RpdmF0ZSgpO1xuICAgICAgICB0aGlzLnBhbi5hY3RpdmF0ZSgpO1xuXG4gICAgICAgIHRoaXMuZm9udC5hY3RpdmF0ZSgpO1xuXG4gICAgICAgIHRoaXMud29ybGRCb3JkZXIuYWN0aXZhdGUoKTtcblxuICAgICAgICB0aGlzLnNlbGVjdC5hY3RpdmF0ZSgpO1xuICAgICAgICB0aGlzLnNlbGVjdEJveC5hY3RpdmF0ZSgpO1xuXG4gICAgICAgIGlmICghdGhpcy5ib2FyZC5jb25maWcudmlld09ubHlNb2RlKSB7XG4gICAgICAgICAgICB0aGlzLm1vdmUuYWN0aXZhdGUoKTtcbiAgICAgICAgICAgIHRoaXMucmVzaXplLmFjdGl2YXRlKCk7XG4gICAgICAgICAgICB0aGlzLnJvdGF0ZS5hY3RpdmF0ZSgpO1xuXG4gICAgICAgICAgICB0aGlzLmd1aWRlbGluZS5hY3RpdmF0ZSgpO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5tb3VzZS5hY3RpdmF0ZSgpO1xuICAgIH1cblxuICAgIHB1YmxpYyBkZWFjdGl2YXRlKCk6IHZvaWQge1xuICAgICAgICB0aGlzLmJvYXJkUmVzaXplLmRlYWN0aXZhdGUoKTtcblxuICAgICAgICB0aGlzLnpvb20uZGVhY3RpdmF0ZSgpO1xuICAgICAgICB0aGlzLnBhbi5kZWFjdGl2YXRlKCk7XG5cbiAgICAgICAgdGhpcy5mb250LmRlYWN0aXZhdGUoKTtcblxuICAgICAgICB0aGlzLndvcmxkQm9yZGVyLmFjdGl2YXRlKCk7XG5cbiAgICAgICAgdGhpcy5zZWxlY3QuZGVhY3RpdmF0ZSgpO1xuICAgICAgICB0aGlzLnNlbGVjdEJveC5kZWFjdGl2YXRlKCk7XG4gICAgICAgIHRoaXMubW92ZS5kZWFjdGl2YXRlKCk7XG4gICAgICAgIHRoaXMucmVzaXplLmRlYWN0aXZhdGUoKTtcbiAgICAgICAgdGhpcy5yb3RhdGUuZGVhY3RpdmF0ZSgpO1xuXG4gICAgICAgIHRoaXMuZ3VpZGVsaW5lLmRlYWN0aXZhdGUoKTtcblxuICAgICAgICB0aGlzLm1vdXNlLmRlYWN0aXZhdGUoKTtcbiAgICB9XG5cbiAgICBwcml2YXRlIGFkZE1hcmtlcnMoKTogdm9pZCB7XG4gICAgICAgIHRoaXMuYm9hcmQuYWRkT2JqZWN0cyhbXG4gICAgICAgICAgICB0aGlzLm1pbkNvbnRlbnRNYXJrZXIsXG4gICAgICAgICAgICB0aGlzLm1pbk92ZXJsYXlNYXJrZXIsXG4gICAgICAgICAgICB0aGlzLm1heE92ZXJsYXlNYXJrZXIsXG4gICAgICAgIF0pO1xuICAgIH1cbn1cbiIsImV4cG9ydCBlbnVtIEJvYXJkTW9kZSB7XG4gICAgU2VsZWN0LFxuICAgIE1vdmluZyxcbiAgICBSZXNpemluZyxcbiAgICBSb3RhdGluZyxcbiAgICBUZXh0RWRpdGluZyxcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGNhblNlbGVjdChtb2RlOiBCb2FyZE1vZGUpOiBib29sZWFuIHtcbiAgICByZXR1cm4gbW9kZSA9PT0gQm9hcmRNb2RlLlNlbGVjdDtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGNhbk1vdmUobW9kZTogQm9hcmRNb2RlKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIG1vZGUgPT09IEJvYXJkTW9kZS5TZWxlY3Q7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBjYW5SZXNpemUobW9kZTogQm9hcmRNb2RlKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIG1vZGUgPT09IEJvYXJkTW9kZS5TZWxlY3Q7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBjYW5Sb3RhdGUobW9kZTogQm9hcmRNb2RlKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIG1vZGUgPT09IEJvYXJkTW9kZS5TZWxlY3Q7XG59XG5cbi8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBAdHlwZXNjcmlwdC1lc2xpbnQvbm8tdW51c2VkLXZhcnNcbmV4cG9ydCBmdW5jdGlvbiBjYW5QYW4obW9kZTogQm9hcmRNb2RlKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIHRydWU7XG59XG5cbi8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBAdHlwZXNjcmlwdC1lc2xpbnQvbm8tdW51c2VkLXZhcnNcbmV4cG9ydCBmdW5jdGlvbiBjYW5ab29tKG1vZGU6IEJvYXJkTW9kZSk6IGJvb2xlYW4ge1xuICAgIHJldHVybiB0cnVlO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gY2FuTWFuaXB1bGF0ZShtb2RlOiBCb2FyZE1vZGUpOiBib29sZWFuIHtcbiAgICByZXR1cm4gbW9kZSAhPT0gQm9hcmRNb2RlLlRleHRFZGl0aW5nO1xufVxuIiwiaW1wb3J0IHR5cGUgeyBCb2FyZCB9IGZyb20gXCJAY2FudmFzL2JvYXJkL0JvYXJkXCI7XG5pbXBvcnQgeyBWZWN0b3IyIH0gZnJvbSBcIkBjYW52YXMvcHJpbWl0aXZlcy9zcGFjZVwiO1xuXG5leHBvcnQgY2xhc3MgQm9hcmRSZXNpemVDb250cm9sbGVyIHtcbiAgICBwcml2YXRlIGV2ZW50TGlzdGVuZXI6ICgpID0+IHZvaWQ7XG5cbiAgICBjb25zdHJ1Y3Rvcihwcml2YXRlIGJvYXJkOiBCb2FyZCkge1xuICAgICAgICB0aGlzLmV2ZW50TGlzdGVuZXIgPSAoKSA9PiB7XG4gICAgICAgICAgICB0aGlzLm9uUmVzaXplKCk7XG4gICAgICAgIH07XG4gICAgfVxuXG4gICAgcHVibGljIGFjdGl2YXRlKCk6IHZvaWQge1xuICAgICAgICB0aGlzLmJvYXJkLndpbmRvdy5hZGRFdmVudExpc3RlbmVyKFwicmVzaXplXCIsIHRoaXMuZXZlbnRMaXN0ZW5lcik7XG4gICAgICAgIHRoaXMub25SZXNpemUoKTtcbiAgICB9XG5cbiAgICBwdWJsaWMgZGVhY3RpdmF0ZSgpOiB2b2lkIHtcbiAgICAgICAgdGhpcy5ib2FyZC53aW5kb3cucmVtb3ZlRXZlbnRMaXN0ZW5lcihcInJlc2l6ZVwiLCB0aGlzLmV2ZW50TGlzdGVuZXIpO1xuICAgIH1cblxuICAgIHByaXZhdGUgb25SZXNpemUoKTogdm9pZCB7XG4gICAgICAgIHRoaXMuYm9hcmQudmlld3BvcnQgPSB0aGlzLmJvYXJkLnZpZXdwb3J0Lm1vZGlmaWVkKFxuICAgICAgICAgICAgbmV3IFZlY3RvcjIoXG4gICAgICAgICAgICAgICAgdGhpcy5ib2FyZC5ib2FyZEVsZW1lbnQuY2xpZW50V2lkdGgsXG4gICAgICAgICAgICAgICAgdGhpcy5ib2FyZC5ib2FyZEVsZW1lbnQuY2xpZW50SGVpZ2h0LFxuICAgICAgICAgICAgKSxcbiAgICAgICAgKTtcbiAgICB9XG59XG4iLCJpbXBvcnQgdHlwZSB7IEJvYXJkIH0gZnJvbSBcIkBjYW52YXMvYm9hcmQvQm9hcmRcIjtcbmltcG9ydCB0eXBlIHsgU3Vic2NyaXB0aW9uIH0gZnJvbSBcIkBjYW52YXMvcHJpbWl0aXZlcy9ldmVudHNcIjtcbmltcG9ydCB7XG4gICAgY3JlYXRlRG9tRXZlbnRMaXN0ZW5lcixcbiAgICBFdmVudEJhc2UsXG4gICAgRXZlbnRIYW5kbGVyLFxuICAgIHVuc3Vic2NyaWJlQWxsLFxufSBmcm9tIFwiQGNhbnZhcy9wcmltaXRpdmVzL2V2ZW50c1wiO1xuaW1wb3J0IHR5cGUgeyBPcHRpb25hbCB9IGZyb20gXCJAY2FudmFzL3ByaW1pdGl2ZXMvdHlwZXNcIjtcblxuZXhwb3J0IGNsYXNzIEZvbnQge1xuICAgIGNvbnN0cnVjdG9yKFxuICAgICAgICByZWFkb25seSBmb250RmFtaWx5OiBzdHJpbmcsXG4gICAgICAgIHJlYWRvbmx5IGZvbnRTdHlsZTogT3B0aW9uYWw8c3RyaW5nPiA9IHVuZGVmaW5lZCxcbiAgICAgICAgcmVhZG9ubHkgZm9udFdlaWdodDogT3B0aW9uYWw8c3RyaW5nPiA9IHVuZGVmaW5lZCxcbiAgICApIHt9XG5cbiAgICBwdWJsaWMgdG9Dc3MoZm9udFNpemU6IG51bWJlcik6IHN0cmluZyB7XG4gICAgICAgIGxldCBjc3MgPSBgJHtmb250U2l6ZX1weCAke3RoaXMuZm9udEZhbWlseX1gO1xuXG4gICAgICAgIGlmICh0aGlzLmZvbnRXZWlnaHQgIT09IHVuZGVmaW5lZCkgY3NzID0gYCR7dGhpcy5mb250V2VpZ2h0fSAke2Nzc31gO1xuICAgICAgICBpZiAodGhpcy5mb250U3R5bGUgIT09IHVuZGVmaW5lZCkgY3NzID0gYCR7dGhpcy5mb250U3R5bGV9ICR7Y3NzfWA7XG5cbiAgICAgICAgcmV0dXJuIGNzcztcbiAgICB9XG59XG5cbmV4cG9ydCBjbGFzcyBGb250TG9hZEV2ZW50IGV4dGVuZHMgRXZlbnRCYXNlPHN0cmluZz4ge1xuICAgIGNvbnN0cnVjdG9yKHJlYWRvbmx5IGZvbnQ6IEZvbnRGYWNlKSB7XG4gICAgICAgIHN1cGVyKFtnZXRGb250SWRlbnRpZmllcihmb250LmZhbWlseSldKTtcbiAgICB9XG59XG5cbmV4cG9ydCBjbGFzcyBGb250Q29udHJvbGxlciB7XG4gICAgcmVhZG9ubHkgb25Gb250TG9hZCA9IG5ldyBFdmVudEhhbmRsZXI8Rm9udExvYWRFdmVudD4oKTtcblxuICAgIHByaXZhdGUgc3Vic2NyaXB0aW9uczogU3Vic2NyaXB0aW9uW10gPSBbXTtcblxuICAgIGNvbnN0cnVjdG9yKHByaXZhdGUgYm9hcmQ6IEJvYXJkKSB7fVxuXG4gICAgcHVibGljIGFjdGl2YXRlKCk6IHZvaWQge1xuICAgICAgICB0aGlzLnN1YnNjcmlwdGlvbnMucHVzaChcbiAgICAgICAgICAgIGNyZWF0ZURvbUV2ZW50TGlzdGVuZXIoZG9jdW1lbnQuZm9udHMsIFwibG9hZGluZ2RvbmVcIiwgZSA9PiB7XG4gICAgICAgICAgICAgICAgdGhpcy5vbkZvbnRzTG9hZGVkKDxGb250RmFjZVNldExvYWRFdmVudD4oPHVua25vd24+ZSkpO1xuICAgICAgICAgICAgfSksXG4gICAgICAgICk7XG4gICAgfVxuXG4gICAgcHVibGljIGRlYWN0aXZhdGUoKTogdm9pZCB7XG4gICAgICAgIHVuc3Vic2NyaWJlQWxsKHRoaXMuc3Vic2NyaXB0aW9ucyk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBvbkZvbnRzTG9hZGVkKGU6IEZvbnRGYWNlU2V0TG9hZEV2ZW50KTogdm9pZCB7XG4gICAgICAgIGZvciAoY29uc3QgZm9udCBvZiBlLmZvbnRmYWNlcykge1xuICAgICAgICAgICAgdGhpcy5vbkZvbnRMb2FkLmRpc3BhdGNoKG5ldyBGb250TG9hZEV2ZW50KGZvbnQpKTtcbiAgICAgICAgfVxuICAgIH1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGdldEZvbnRJZGVudGlmaWVyKGZhbWlseTogc3RyaW5nKTogc3RyaW5nIHtcbiAgICAvLyBTdGFuZGFyZGl6ZSBmb250IGZhbWlseSBuYW1lXG4gICAgcmV0dXJuIGZhbWlseS5yZXBsYWNlKFwiJ1wiLCBcIlwiKS5yZXBsYWNlKCdcIicsIFwiXCIpLnRvTG93ZXJDYXNlKCk7XG59XG4iLCJpbXBvcnQgdHlwZSB7IEJvYXJkIH0gZnJvbSBcIkBjYW52YXMvYm9hcmQvQm9hcmRcIjtcbmltcG9ydCB7IGNhblBhbiB9IGZyb20gXCJAY2FudmFzL2JvYXJkL2NvbnRyb2xsZXJzL0JvYXJkTW9kZVwiO1xuaW1wb3J0IHR5cGUgeyBTdWJzY3JpcHRpb24gfSBmcm9tIFwiQGNhbnZhcy9wcmltaXRpdmVzL2V2ZW50c1wiO1xuaW1wb3J0IHtcbiAgICBjcmVhdGVEb21FdmVudExpc3RlbmVyLFxuICAgIHVuc3Vic2NyaWJlQWxsLFxufSBmcm9tIFwiQGNhbnZhcy9wcmltaXRpdmVzL2V2ZW50c1wiO1xuaW1wb3J0IHsgVmVjdG9yMiB9IGZyb20gXCJAY2FudmFzL3ByaW1pdGl2ZXMvc3BhY2VcIjtcbmltcG9ydCB7IE1vZGlmaWVyU3RhdGUgfSBmcm9tIFwiQGNhbnZhcy91dGlscy9pbnB1dC9Nb2RpZmllclN0YXRlXCI7XG5pbXBvcnQgeyBnZXRXaGVlbEJvb3N0IH0gZnJvbSBcIkBjYW52YXMvdXRpbHMvaW5wdXQvV2hlZWxcIjtcbmltcG9ydCB7IEJpbmRpbmcgfSBmcm9tIFwiQGNvbmZpZy9iaW5kaW5nc1wiO1xuXG5leHBvcnQgY2xhc3MgUGFuQ29udHJvbGxlciB7XG4gICAgcHJpdmF0ZSBzdWJzY3JpcHRpb25zOiBTdWJzY3JpcHRpb25bXSA9IFtdO1xuXG4gICAgY29uc3RydWN0b3IocHJpdmF0ZSBib2FyZDogQm9hcmQpIHt9XG5cbiAgICBwdWJsaWMgYWN0aXZhdGUoKTogdm9pZCB7XG4gICAgICAgIHRoaXMuc3Vic2NyaXB0aW9ucy5wdXNoKFxuICAgICAgICAgICAgY3JlYXRlRG9tRXZlbnRMaXN0ZW5lcih0aGlzLmJvYXJkLmJvYXJkRWxlbWVudCwgXCJ3aGVlbFwiLCBlID0+IHtcbiAgICAgICAgICAgICAgICB0aGlzLm9uV2hlZWwoZSk7XG4gICAgICAgICAgICB9KSxcbiAgICAgICAgKTtcbiAgICB9XG5cbiAgICBwdWJsaWMgZGVhY3RpdmF0ZSgpOiB2b2lkIHtcbiAgICAgICAgdW5zdWJzY3JpYmVBbGwodGhpcy5zdWJzY3JpcHRpb25zKTtcbiAgICB9XG5cbiAgICBwcml2YXRlIG9uV2hlZWwoZTogV2hlZWxFdmVudCk6IHZvaWQge1xuICAgICAgICBpZiAoIWNhblBhbih0aGlzLmJvYXJkLmNvbnRyb2xsZXIubW9kZS5zdGF0ZSkpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IG1vZGlmaWVyc0hvbGRlciA9IHsgbW9kaWZpZXJzOiBNb2RpZmllclN0YXRlLmZyb21Eb21FdmVudChlKSB9O1xuXG4gICAgICAgIGNvbnN0IGludmVyc2UgPSBCaW5kaW5nLldoZWVsUGFuSW52ZXJzZS5tb2RpZmllcnMobW9kaWZpZXJzSG9sZGVyKTtcblxuICAgICAgICBpZiAoQmluZGluZy5XaGVlbFBhbi5tb2RpZmllcnMobW9kaWZpZXJzSG9sZGVyKSB8fCBpbnZlcnNlKSB7XG4gICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICBlLnN0b3BQcm9wYWdhdGlvbigpO1xuXG4gICAgICAgICAgICBsZXQgZGVsdGEgPSBuZXcgVmVjdG9yMihlLmRlbHRhWCwgZS5kZWx0YVkpO1xuXG4gICAgICAgICAgICBkZWx0YSA9IGRlbHRhLnNjYWxlKGdldFdoZWVsQm9vc3QoZSkpO1xuXG4gICAgICAgICAgICBpZiAoaW52ZXJzZSkge1xuICAgICAgICAgICAgICAgIGRlbHRhID0gZGVsdGEucm90YXRlKC0wLjUgKiBNYXRoLlBJKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgY29uc3Qgb2xkVmlld3BvcnQgPSB0aGlzLmJvYXJkLnZpZXdwb3J0O1xuXG4gICAgICAgICAgICB0aGlzLmJvYXJkLnZpZXdwb3J0ID0gb2xkVmlld3BvcnQubW9kaWZpZWQoXG4gICAgICAgICAgICAgICAgdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBvbGRWaWV3cG9ydC5vcmlnaW4ucGx1cyhcbiAgICAgICAgICAgICAgICAgICAgZGVsdGEuc2NhbGUoMS4wIC8gb2xkVmlld3BvcnQuem9vbUxldmVsKSxcbiAgICAgICAgICAgICAgICApLFxuICAgICAgICAgICAgKTtcbiAgICAgICAgfVxuICAgIH1cbn1cbiIsImltcG9ydCB0eXBlIHsgQm9hcmQgfSBmcm9tIFwiQGNhbnZhcy9ib2FyZC9Cb2FyZFwiO1xuaW1wb3J0IHsgbW91c2VQb3NpdGlvblRvRWxlbWVudCB9IGZyb20gXCJAY2FudmFzL3ByaW1pdGl2ZXMvZG9tXCI7XG5pbXBvcnQgdHlwZSB7IFN1YnNjcmlwdGlvbiB9IGZyb20gXCJAY2FudmFzL3ByaW1pdGl2ZXMvZXZlbnRzXCI7XG5pbXBvcnQge1xuICAgIGNyZWF0ZURvbUV2ZW50TGlzdGVuZXIsXG4gICAgRXZlbnRCYXNlLFxuICAgIEV2ZW50SGFuZGxlcixcbiAgICB1bnN1YnNjcmliZUFsbCxcbn0gZnJvbSBcIkBjYW52YXMvcHJpbWl0aXZlcy9ldmVudHNcIjtcbmltcG9ydCB0eXBlIHsgVmVjdG9yMiB9IGZyb20gXCJAY2FudmFzL3ByaW1pdGl2ZXMvc3BhY2VcIjtcblxuaW50ZXJmYWNlIEdlc3R1cmVFdmVudCBleHRlbmRzIFVJRXZlbnQge1xuICAgIHNjYWxlOiBudW1iZXI7XG4gICAgY2xpZW50WDogbnVtYmVyO1xuICAgIGNsaWVudFk6IG51bWJlcjtcbn1cblxuZXhwb3J0IGNsYXNzIFBpbmNoU3RhcnRFdmVudCBleHRlbmRzIEV2ZW50QmFzZTxCb2FyZD4ge31cblxuZXhwb3J0IGNsYXNzIFBpbmNoWm9vbUV2ZW50IGV4dGVuZHMgRXZlbnRCYXNlPEJvYXJkPiB7XG4gICAgY29uc3RydWN0b3IoXG4gICAgICAgIHJlYWRvbmx5IGN1cnNvclBvc2l0aW9uOiBWZWN0b3IyLFxuICAgICAgICByZWFkb25seSBzY2FsZTogbnVtYmVyLFxuICAgICAgICBldmVudFN0YWNrPzogQm9hcmRbXSxcbiAgICApIHtcbiAgICAgICAgc3VwZXIoZXZlbnRTdGFjayk7XG4gICAgfVxufVxuXG5leHBvcnQgY2xhc3MgUGluY2hab29tQ29udHJvbGxlciB7XG4gICAgcmVhZG9ubHkgb25QaW5jaFN0YXJ0ID0gbmV3IEV2ZW50SGFuZGxlcjxQaW5jaFN0YXJ0RXZlbnQ+KCk7XG4gICAgcmVhZG9ubHkgb25QaW5jaFpvb20gPSBuZXcgRXZlbnRIYW5kbGVyPFBpbmNoWm9vbUV2ZW50PigpO1xuXG4gICAgcHJpdmF0ZSBzdWJzY3JpcHRpb25zOiBTdWJzY3JpcHRpb25bXSA9IFtdO1xuXG4gICAgY29uc3RydWN0b3IocHJpdmF0ZSBib2FyZDogQm9hcmQpIHt9XG5cbiAgICBwdWJsaWMgYWN0aXZhdGUoKTogdm9pZCB7XG4gICAgICAgIC8vIFNhZmFyaVxuICAgICAgICB0aGlzLnN1YnNjcmlwdGlvbnMucHVzaChcbiAgICAgICAgICAgIGNyZWF0ZURvbUV2ZW50TGlzdGVuZXIoXG4gICAgICAgICAgICAgICAgdGhpcy5ib2FyZC5ib2FyZEVsZW1lbnQsXG4gICAgICAgICAgICAgICAgXCJnZXN0dXJlc3RhcnRcIixcbiAgICAgICAgICAgICAgICAoZTogR2VzdHVyZUV2ZW50KSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMub25HZXN0dXJlU3RhcnQoZSk7XG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICksXG4gICAgICAgICk7XG4gICAgICAgIHRoaXMuc3Vic2NyaXB0aW9ucy5wdXNoKFxuICAgICAgICAgICAgY3JlYXRlRG9tRXZlbnRMaXN0ZW5lcihcbiAgICAgICAgICAgICAgICB0aGlzLmJvYXJkLmJvYXJkRWxlbWVudCxcbiAgICAgICAgICAgICAgICBcImdlc3R1cmVjaGFuZ2VcIixcbiAgICAgICAgICAgICAgICAoZTogR2VzdHVyZUV2ZW50KSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMub25HZXN0dXJlQ2hhbmdlKGUpO1xuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICApLFxuICAgICAgICApO1xuICAgIH1cblxuICAgIHB1YmxpYyBkZWFjdGl2YXRlKCk6IHZvaWQge1xuICAgICAgICB1bnN1YnNjcmliZUFsbCh0aGlzLnN1YnNjcmlwdGlvbnMpO1xuICAgIH1cblxuICAgIHByaXZhdGUgb25HZXN0dXJlU3RhcnQoZTogR2VzdHVyZUV2ZW50KTogdm9pZCB7XG4gICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcblxuICAgICAgICB0aGlzLm9uUGluY2hTdGFydC5kaXNwYXRjaChuZXcgUGluY2hTdGFydEV2ZW50KFt0aGlzLmJvYXJkXSkpO1xuICAgIH1cblxuICAgIHByaXZhdGUgb25HZXN0dXJlQ2hhbmdlKGU6IEdlc3R1cmVFdmVudCk6IHZvaWQge1xuICAgICAgICBlLnN0b3BQcm9wYWdhdGlvbigpO1xuICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG5cbiAgICAgICAgY29uc3QgZXZlbnQgPSBuZXcgUGluY2hab29tRXZlbnQoXG4gICAgICAgICAgICBtb3VzZVBvc2l0aW9uVG9FbGVtZW50KGUsIHRoaXMuYm9hcmQuYm9hcmRFbGVtZW50KSxcbiAgICAgICAgICAgIGUuc2NhbGUsXG4gICAgICAgICAgICBbdGhpcy5ib2FyZF0sXG4gICAgICAgICk7XG5cbiAgICAgICAgdGhpcy5vblBpbmNoWm9vbS5kaXNwYXRjaChldmVudCk7XG4gICAgfVxufVxuIiwiaW1wb3J0IHR5cGUgeyBCb2FyZCB9IGZyb20gXCJAY2FudmFzL2JvYXJkL0JvYXJkXCI7XG5pbXBvcnQgeyBtb3VzZVBvc2l0aW9uVG9FbGVtZW50IH0gZnJvbSBcIkBjYW52YXMvcHJpbWl0aXZlcy9kb21cIjtcbmltcG9ydCB0eXBlIHsgU3Vic2NyaXB0aW9uIH0gZnJvbSBcIkBjYW52YXMvcHJpbWl0aXZlcy9ldmVudHNcIjtcbmltcG9ydCB7XG4gICAgY3JlYXRlRG9tRXZlbnRMaXN0ZW5lcixcbiAgICBFdmVudEJhc2UsXG4gICAgRXZlbnRIYW5kbGVyLFxuICAgIHVuc3Vic2NyaWJlQWxsLFxufSBmcm9tIFwiQGNhbnZhcy9wcmltaXRpdmVzL2V2ZW50c1wiO1xuaW1wb3J0IHR5cGUgeyBWZWN0b3IyIH0gZnJvbSBcIkBjYW52YXMvcHJpbWl0aXZlcy9zcGFjZVwiO1xuaW1wb3J0IHsgTW9kaWZpZXJTdGF0ZSB9IGZyb20gXCJAY2FudmFzL3V0aWxzL2lucHV0L01vZGlmaWVyU3RhdGVcIjtcbmltcG9ydCB7IGdldFdoZWVsQm9vc3QgfSBmcm9tIFwiQGNhbnZhcy91dGlscy9pbnB1dC9XaGVlbFwiO1xuaW1wb3J0IHsgQmluZGluZyB9IGZyb20gXCJAY29uZmlnL2JpbmRpbmdzXCI7XG5cbmV4cG9ydCBjbGFzcyBXaGVlbFpvb21FdmVudCBleHRlbmRzIEV2ZW50QmFzZTxCb2FyZD4ge1xuICAgIGNvbnN0cnVjdG9yKFxuICAgICAgICByZWFkb25seSBjdXJzb3JQb3NpdGlvbjogVmVjdG9yMixcbiAgICAgICAgcmVhZG9ubHkgem9vbURlbHRhOiBudW1iZXIsXG4gICAgICAgIGV2ZW50U3RhY2s/OiBCb2FyZFtdLFxuICAgICkge1xuICAgICAgICBzdXBlcihldmVudFN0YWNrKTtcbiAgICB9XG59XG5cbmV4cG9ydCBjbGFzcyBXaGVlbFpvb21Db250cm9sbGVyIHtcbiAgICByZWFkb25seSBvbldoZWVsWm9vbSA9IG5ldyBFdmVudEhhbmRsZXI8V2hlZWxab29tRXZlbnQ+KCk7XG5cbiAgICBwcml2YXRlIHN1YnNjcmlwdGlvbnM6IFN1YnNjcmlwdGlvbltdID0gW107XG5cbiAgICBjb25zdHJ1Y3Rvcihwcml2YXRlIGJvYXJkOiBCb2FyZCkge31cblxuICAgIHB1YmxpYyBhY3RpdmF0ZSgpOiB2b2lkIHtcbiAgICAgICAgLy8gRmlyZWZveCwgQ2hyb21lLCAoU2FmYXJpKVxuICAgICAgICB0aGlzLnN1YnNjcmlwdGlvbnMucHVzaChcbiAgICAgICAgICAgIGNyZWF0ZURvbUV2ZW50TGlzdGVuZXIoXG4gICAgICAgICAgICAgICAgdGhpcy5ib2FyZC5ib2FyZEVsZW1lbnQsXG4gICAgICAgICAgICAgICAgXCJ3aGVlbFwiLFxuICAgICAgICAgICAgICAgIChlOiBXaGVlbEV2ZW50KSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMub25XaGVlbChlKTtcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgKSxcbiAgICAgICAgKTtcbiAgICB9XG5cbiAgICBwdWJsaWMgZGVhY3RpdmF0ZSgpOiB2b2lkIHtcbiAgICAgICAgdW5zdWJzY3JpYmVBbGwodGhpcy5zdWJzY3JpcHRpb25zKTtcbiAgICB9XG5cbiAgICBwcml2YXRlIG9uV2hlZWwoZTogV2hlZWxFdmVudCkge1xuICAgICAgICBjb25zdCBtb2RpZmllcnNIb2xkZXIgPSB7IG1vZGlmaWVyczogTW9kaWZpZXJTdGF0ZS5mcm9tRG9tRXZlbnQoZSkgfTtcblxuICAgICAgICBpZiAoQmluZGluZy5XaGVlbFpvb20ubW9kaWZpZXJzKG1vZGlmaWVyc0hvbGRlcikpIHtcbiAgICAgICAgICAgIGUuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG5cbiAgICAgICAgICAgIGNvbnN0IGRlbHRhID0gZS5kZWx0YVkgKiBnZXRXaGVlbEJvb3N0KGUpO1xuXG4gICAgICAgICAgICAvLyBMb2dpc3RpYyBmdW5jdGlvbiBiZXR3ZWVuIC0xIGFuZCAxXG4gICAgICAgICAgICAvLyBhbmQgdGhlbiAyXkxvZ2lzdGljIHRvIG1hcCBpdCBiZXR3ZWVuIDAuNSBhbmQgMi4wXG4gICAgICAgICAgICBjb25zdCByZWxhdGl2ZVpvb20gPSBNYXRoLnBvdyhcbiAgICAgICAgICAgICAgICAyLjAsXG4gICAgICAgICAgICAgICAgMi4wIC8gKDEuMCArIE1hdGgucG93KE1hdGguRSwgMC4wNSAqIGRlbHRhKSkgLSAxLjAsXG4gICAgICAgICAgICApO1xuXG4gICAgICAgICAgICBjb25zdCBldmVudCA9IG5ldyBXaGVlbFpvb21FdmVudChcbiAgICAgICAgICAgICAgICBtb3VzZVBvc2l0aW9uVG9FbGVtZW50KGUsIHRoaXMuYm9hcmQuYm9hcmRFbGVtZW50KSxcbiAgICAgICAgICAgICAgICByZWxhdGl2ZVpvb20sXG4gICAgICAgICAgICAgICAgW3RoaXMuYm9hcmRdLFxuICAgICAgICAgICAgKTtcblxuICAgICAgICAgICAgdGhpcy5vbldoZWVsWm9vbS5kaXNwYXRjaChldmVudCk7XG4gICAgICAgIH1cbiAgICB9XG59XG4iLCJpbXBvcnQgdHlwZSB7IEJvYXJkIH0gZnJvbSBcIkBjYW52YXMvYm9hcmQvQm9hcmRcIjtcbmltcG9ydCB7IFdvcmxkQm9yZGVyIH0gZnJvbSBcIkBjYW52YXMvYm9hcmQvb2JqZWN0cy91aS9Xb3JsZEJvcmRlclwiO1xuXG5leHBvcnQgY2xhc3MgV29ybGRCb3JkZXJDb250cm9sbGVyIHtcbiAgICBwcml2YXRlIG9iamVjdHM6IFdvcmxkQm9yZGVyW10gPSBbXG4gICAgICAgIG5ldyBXb3JsZEJvcmRlcihmYWxzZSksXG4gICAgICAgIG5ldyBXb3JsZEJvcmRlcih0cnVlKSxcbiAgICBdO1xuXG4gICAgY29uc3RydWN0b3IocHJpdmF0ZSBib2FyZDogQm9hcmQpIHt9XG5cbiAgICBwdWJsaWMgYWN0aXZhdGUoKTogdm9pZCB7XG4gICAgICAgIHRoaXMuYm9hcmQuYWRkT2JqZWN0c0JlbG93KFxuICAgICAgICAgICAgdGhpcy5vYmplY3RzLFxuICAgICAgICAgICAgdGhpcy5ib2FyZC5jb250cm9sbGVyLm1pbkNvbnRlbnRNYXJrZXIsXG4gICAgICAgICk7XG4gICAgfVxuXG4gICAgcHVibGljIGRlYWN0aXZhdGUoKTogdm9pZCB7XG4gICAgICAgIHRoaXMuYm9hcmQucmVtb3ZlT2JqZWN0cyh0aGlzLm9iamVjdHMpO1xuICAgIH1cbn1cbiIsImltcG9ydCB0eXBlIHsgQm9hcmQgfSBmcm9tIFwiQGNhbnZhcy9ib2FyZC9Cb2FyZFwiO1xuaW1wb3J0IHsgY2FuWm9vbSB9IGZyb20gXCJAY2FudmFzL2JvYXJkL2NvbnRyb2xsZXJzL0JvYXJkTW9kZVwiO1xuaW1wb3J0IHsgbW91c2VQb3NpdGlvblRvRWxlbWVudCB9IGZyb20gXCJAY2FudmFzL3ByaW1pdGl2ZXMvZG9tXCI7XG5pbXBvcnQgdHlwZSB7IFN1YnNjcmlwdGlvbiB9IGZyb20gXCJAY2FudmFzL3ByaW1pdGl2ZXMvZXZlbnRzXCI7XG5pbXBvcnQge1xuICAgIGNyZWF0ZURvbUV2ZW50TGlzdGVuZXIsXG4gICAgdW5zdWJzY3JpYmVBbGwsXG59IGZyb20gXCJAY2FudmFzL3ByaW1pdGl2ZXMvZXZlbnRzXCI7XG5pbXBvcnQgdHlwZSB7IFZlY3RvcjIgfSBmcm9tIFwiQGNhbnZhcy9wcmltaXRpdmVzL3NwYWNlXCI7XG5pbXBvcnQgdHlwZSB7IE9wdGlvbmFsIH0gZnJvbSBcIkBjYW52YXMvcHJpbWl0aXZlcy90eXBlc1wiO1xuaW1wb3J0IHR5cGUgeyBWaWV3cG9ydCB9IGZyb20gXCJAY2FudmFzL3JlbmRlci9WaWV3cG9ydFwiO1xuaW1wb3J0IHsgQmluZGluZyB9IGZyb20gXCJAY29uZmlnL2JpbmRpbmdzXCI7XG5cbmltcG9ydCB0eXBlIHsgUGluY2hab29tRXZlbnQgfSBmcm9tIFwiLi9QaW5jaFpvb21Db250cm9sbGVyXCI7XG5pbXBvcnQgeyBQaW5jaFpvb21Db250cm9sbGVyIH0gZnJvbSBcIi4vUGluY2hab29tQ29udHJvbGxlclwiO1xuaW1wb3J0IHR5cGUgeyBXaGVlbFpvb21FdmVudCB9IGZyb20gXCIuL1doZWVsWm9vbUNvbnRyb2xsZXJcIjtcbmltcG9ydCB7IFdoZWVsWm9vbUNvbnRyb2xsZXIgfSBmcm9tIFwiLi9XaGVlbFpvb21Db250cm9sbGVyXCI7XG5cbmV4cG9ydCBjbGFzcyBab29tQ29udHJvbGxlciB7XG4gICAgcHJpdmF0ZSBzdWJzY3JpcHRpb25zOiBTdWJzY3JpcHRpb25bXSA9IFtdO1xuXG4gICAgcHJpdmF0ZSB3aGVlbFpvb21DdHJsOiBXaGVlbFpvb21Db250cm9sbGVyO1xuICAgIHByaXZhdGUgcGluY2hab29tQ3RybDogUGluY2hab29tQ29udHJvbGxlcjtcblxuICAgIHByaXZhdGUgbGFzdEN1cnNvclBvc2l0aW9uOiBPcHRpb25hbDxWZWN0b3IyPjtcbiAgICBwcml2YXRlIGluaXRpYWxab29tID0gMS4wO1xuXG4gICAgY29uc3RydWN0b3IoXG4gICAgICAgIHByaXZhdGUgYm9hcmQ6IEJvYXJkLFxuICAgICAgICByZWFkb25seSBtaW5ab29tOiBudW1iZXIgPSAwLjEsXG4gICAgICAgIHJlYWRvbmx5IG1heFpvb206IG51bWJlciA9IDIwLjAsXG4gICAgKSB7XG4gICAgICAgIHRoaXMud2hlZWxab29tQ3RybCA9IG5ldyBXaGVlbFpvb21Db250cm9sbGVyKHRoaXMuYm9hcmQpO1xuICAgICAgICB0aGlzLnBpbmNoWm9vbUN0cmwgPSBuZXcgUGluY2hab29tQ29udHJvbGxlcih0aGlzLmJvYXJkKTtcbiAgICB9XG5cbiAgICBwdWJsaWMgYWN0aXZhdGUoKTogdm9pZCB7XG4gICAgICAgIHRoaXMud2hlZWxab29tQ3RybC5hY3RpdmF0ZSgpO1xuICAgICAgICB0aGlzLnBpbmNoWm9vbUN0cmwuYWN0aXZhdGUoKTtcblxuICAgICAgICB0aGlzLnN1YnNjcmlwdGlvbnMucHVzaChcbiAgICAgICAgICAgIHRoaXMud2hlZWxab29tQ3RybC5vbldoZWVsWm9vbS5saXN0ZW4odGhpcy5ib2FyZCwgZSA9PiB7XG4gICAgICAgICAgICAgICAgdGhpcy5vbldoZWVsWm9vbShlKTtcbiAgICAgICAgICAgIH0pLFxuICAgICAgICApO1xuICAgICAgICB0aGlzLnN1YnNjcmlwdGlvbnMucHVzaChcbiAgICAgICAgICAgIHRoaXMucGluY2hab29tQ3RybC5vblBpbmNoU3RhcnQubGlzdGVuKHRoaXMuYm9hcmQsICgpID0+IHtcbiAgICAgICAgICAgICAgICB0aGlzLm9uUGluY2hTdGFydCgpO1xuICAgICAgICAgICAgfSksXG4gICAgICAgICk7XG4gICAgICAgIHRoaXMuc3Vic2NyaXB0aW9ucy5wdXNoKFxuICAgICAgICAgICAgdGhpcy5waW5jaFpvb21DdHJsLm9uUGluY2hab29tLmxpc3Rlbih0aGlzLmJvYXJkLCBlID0+IHtcbiAgICAgICAgICAgICAgICB0aGlzLm9uUGluY2hab29tKGUpO1xuICAgICAgICAgICAgfSksXG4gICAgICAgICk7XG4gICAgICAgIHRoaXMuc3Vic2NyaXB0aW9ucy5wdXNoKFxuICAgICAgICAgICAgY3JlYXRlRG9tRXZlbnRMaXN0ZW5lcih0aGlzLmJvYXJkLndpbmRvdywgXCJrZXlkb3duXCIsIGUgPT4ge1xuICAgICAgICAgICAgICAgIHRoaXMub25LZXlEb3duKGUpO1xuICAgICAgICAgICAgfSksXG4gICAgICAgICk7XG4gICAgICAgIHRoaXMuc3Vic2NyaXB0aW9ucy5wdXNoKFxuICAgICAgICAgICAgY3JlYXRlRG9tRXZlbnRMaXN0ZW5lcih0aGlzLmJvYXJkLmJvYXJkRWxlbWVudCwgXCJtb3VzZW1vdmVcIiwgZSA9PiB7XG4gICAgICAgICAgICAgICAgdGhpcy5vbk1vdXNlTW92ZShlKTtcbiAgICAgICAgICAgIH0pLFxuICAgICAgICApO1xuICAgIH1cblxuICAgIHB1YmxpYyBkZWFjdGl2YXRlKCk6IHZvaWQge1xuICAgICAgICB1bnN1YnNjcmliZUFsbCh0aGlzLnN1YnNjcmlwdGlvbnMpO1xuXG4gICAgICAgIHRoaXMud2hlZWxab29tQ3RybC5kZWFjdGl2YXRlKCk7XG4gICAgICAgIHRoaXMucGluY2hab29tQ3RybC5kZWFjdGl2YXRlKCk7XG4gICAgfVxuXG4gICAgcHVibGljIHNldFpvb20oem9vbUxldmVsOiBudW1iZXIsIGZvY3VzPzogVmVjdG9yMik6IHZvaWQge1xuICAgICAgICBjb25zdCBvbGRWaWV3cG9ydCA9IHRoaXMuYm9hcmQudmlld3BvcnQ7XG5cbiAgICAgICAgaWYgKGZvY3VzID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIC8vIEZvY3VzIGluIGNlbnRlclxuICAgICAgICAgICAgZm9jdXMgPSBvbGRWaWV3cG9ydC5zaXplLnNjYWxlKDAuNSk7XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBuZXdab29tTGV2ZWwgPSBtaW5NYXgoem9vbUxldmVsLCB0aGlzLm1pblpvb20sIHRoaXMubWF4Wm9vbSk7XG5cbiAgICAgICAgaWYgKG5ld1pvb21MZXZlbCAhPT0gb2xkVmlld3BvcnQuem9vbUxldmVsKSB7XG4gICAgICAgICAgICB0aGlzLmJvYXJkLnZpZXdwb3J0ID0gb2xkVmlld3BvcnQubW9kaWZpZWQoXG4gICAgICAgICAgICAgICAgdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIG5ld1pvb21MZXZlbCxcbiAgICAgICAgICAgICAgICB0aGlzLmNvbXB1dGVWaWV3cG9ydE9yaWdpbihmb2N1cywgb2xkVmlld3BvcnQsIG5ld1pvb21MZXZlbCksXG4gICAgICAgICAgICApO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBvbk1vdXNlTW92ZShlOiBNb3VzZUV2ZW50KTogdm9pZCB7XG4gICAgICAgIHRoaXMubGFzdEN1cnNvclBvc2l0aW9uID0gbW91c2VQb3NpdGlvblRvRWxlbWVudChcbiAgICAgICAgICAgIGUsXG4gICAgICAgICAgICB0aGlzLmJvYXJkLmJvYXJkRWxlbWVudCxcbiAgICAgICAgKTtcbiAgICB9XG5cbiAgICBwcml2YXRlIG9uS2V5RG93bihlOiBLZXlib2FyZEV2ZW50KTogdm9pZCB7XG4gICAgICAgIGlmIChCaW5kaW5nLlJlc2V0Wm9vbS5rZXlib2FyZChlKSkge1xuICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgdGhpcy5zZXRab29tKDEuMCwgdGhpcy5sYXN0Q3Vyc29yUG9zaXRpb24pO1xuICAgICAgICB9IGVsc2UgaWYgKEJpbmRpbmcuWm9vbUluLmtleWJvYXJkKGUpKSB7XG4gICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICB0aGlzLnNldFpvb20oXG4gICAgICAgICAgICAgICAgdGhpcy5ib2FyZC52aWV3cG9ydC56b29tTGV2ZWwgKiAxLjIsXG4gICAgICAgICAgICAgICAgdGhpcy5sYXN0Q3Vyc29yUG9zaXRpb24sXG4gICAgICAgICAgICApO1xuICAgICAgICB9IGVsc2UgaWYgKEJpbmRpbmcuWm9vbU91dC5rZXlib2FyZChlKSkge1xuICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgdGhpcy5zZXRab29tKFxuICAgICAgICAgICAgICAgIHRoaXMuYm9hcmQudmlld3BvcnQuem9vbUxldmVsIC8gMS4yLFxuICAgICAgICAgICAgICAgIHRoaXMubGFzdEN1cnNvclBvc2l0aW9uLFxuICAgICAgICAgICAgKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHByaXZhdGUgb25QaW5jaFN0YXJ0KCk6IHZvaWQge1xuICAgICAgICB0aGlzLmluaXRpYWxab29tID0gdGhpcy5ib2FyZC52aWV3cG9ydC56b29tTGV2ZWw7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBvblBpbmNoWm9vbShlOiBQaW5jaFpvb21FdmVudCk6IHZvaWQge1xuICAgICAgICBpZiAoIWNhblpvb20odGhpcy5ib2FyZC5jb250cm9sbGVyLm1vZGUuc3RhdGUpKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLnNldFpvb20odGhpcy5pbml0aWFsWm9vbSAqIGUuc2NhbGUgKiBlLnNjYWxlLCBlLmN1cnNvclBvc2l0aW9uKTtcbiAgICB9XG5cbiAgICBwcml2YXRlIG9uV2hlZWxab29tKGU6IFdoZWVsWm9vbUV2ZW50KTogdm9pZCB7XG4gICAgICAgIGlmICghY2FuWm9vbSh0aGlzLmJvYXJkLmNvbnRyb2xsZXIubW9kZS5zdGF0ZSkpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IG9sZFZpZXdwb3J0ID0gdGhpcy5ib2FyZC52aWV3cG9ydDtcblxuICAgICAgICB0aGlzLnNldFpvb20ob2xkVmlld3BvcnQuem9vbUxldmVsICogZS56b29tRGVsdGEsIGUuY3Vyc29yUG9zaXRpb24pO1xuICAgIH1cblxuICAgIHByaXZhdGUgY29tcHV0ZVZpZXdwb3J0T3JpZ2luKFxuICAgICAgICBjdXJzb3JQb3M6IFZlY3RvcjIsXG4gICAgICAgIG9sZFZpZXdwb3J0OiBWaWV3cG9ydCxcbiAgICAgICAgbmV3Wm9vbUxldmVsOiBudW1iZXIsXG4gICAgKTogVmVjdG9yMiB7XG4gICAgICAgIGNvbnN0IGN1cnNvclBvc1dvcmxkU3BhY2UgPSBvbGRWaWV3cG9ydC5vcmlnaW4ucGx1cyhcbiAgICAgICAgICAgIGN1cnNvclBvcy5zY2FsZSgxLjAgLyBvbGRWaWV3cG9ydC56b29tTGV2ZWwpLFxuICAgICAgICApO1xuICAgICAgICBjb25zdCBjdXJzb3JPZmZzZXROZXdab29tTGV2ZWwgPSBjdXJzb3JQb3Muc2NhbGUoMS4wIC8gbmV3Wm9vbUxldmVsKTtcblxuICAgICAgICByZXR1cm4gY3Vyc29yUG9zV29ybGRTcGFjZS5taW51cyhjdXJzb3JPZmZzZXROZXdab29tTGV2ZWwpO1xuICAgIH1cbn1cblxuZnVuY3Rpb24gbWluTWF4KHZhbHVlOiBudW1iZXIsIG1pbjogbnVtYmVyLCBtYXg6IG51bWJlcik6IG51bWJlciB7XG4gICAgaWYgKHZhbHVlIDwgbWluKSByZXR1cm4gbWluO1xuICAgIGlmICh2YWx1ZSA+IG1heCkgcmV0dXJuIG1heDtcbiAgICByZXR1cm4gdmFsdWU7XG59XG4iLCJpbXBvcnQgdHlwZSB7IEJvYXJkLCBTcGF3bkV2ZW50IH0gZnJvbSBcIkBjYW52YXMvYm9hcmQvQm9hcmRcIjtcbmltcG9ydCB7IGZpbmRTZWxlY3RhYmxlcyB9IGZyb20gXCJAY2FudmFzL2JvYXJkL2NvbnRyb2xsZXJzL29iamVjdHMvU2VsZWN0Qm94Q29udHJvbGxlclwiO1xuaW1wb3J0IHsgcm90YXRlQm91bmRpbmdCb3ggfSBmcm9tIFwiQGNhbnZhcy9ib2FyZC9vYmplY3RzL2ZvdW5kYXRpb24vUm90YXRlQ29udGFpbmVyXCI7XG5pbXBvcnQgdHlwZSB7IEJvYXJkSXRlbSB9IGZyb20gXCJAY2FudmFzL2JvYXJkL29iamVjdHMvaXRlbXMvQm9hcmRJdGVtXCI7XG5pbXBvcnQgeyBHdWlkZWxpbmUgfSBmcm9tIFwiQGNhbnZhcy9ib2FyZC9vYmplY3RzL3VpL0d1aWRlbGluZVwiO1xuaW1wb3J0IHR5cGUgeyBTdWJzY3JpcHRpb24gfSBmcm9tIFwiQGNhbnZhcy9wcmltaXRpdmVzL2V2ZW50c1wiO1xuaW1wb3J0IHsgdW5zdWJzY3JpYmVBbGwgfSBmcm9tIFwiQGNhbnZhcy9wcmltaXRpdmVzL2V2ZW50c1wiO1xuaW1wb3J0IHR5cGUgeyBWZWN0b3IyIH0gZnJvbSBcIkBjYW52YXMvcHJpbWl0aXZlcy9zcGFjZVwiO1xuaW1wb3J0IHR5cGUgeyBPcHRpb25hbCB9IGZyb20gXCJAY2FudmFzL3ByaW1pdGl2ZXMvdHlwZXNcIjtcbmltcG9ydCB7IFZpZXdwb3J0IH0gZnJvbSBcIkBjYW52YXMvcmVuZGVyL1ZpZXdwb3J0XCI7XG5pbXBvcnQgeyBkZWJvdW5jZSB9IGZyb20gXCJAY2FudmFzL3V0aWxzL2RlYm91bmNlXCI7XG5pbXBvcnQgeyBEZWJ1Z0NvbmZpZyB9IGZyb20gXCJAY29uZmlnL2RlYnVnXCI7XG5pbXBvcnQge1xuICAgIGFjdGl2YXRlQ2VudGVyR3VpZGVzLFxuICAgIHNob3dHdWlkZWxpbmVEaXN0YW5jZSxcbiAgICBzdGFuZGFyZE1pbkd1aWRlRGlzdGFuY2UsXG59IGZyb20gXCJAY29uZmlnL2ludGVyYWN0aW9uXCI7XG5cbmVudW0gR3VpZGVPcmlnaW4ge1xuICAgIC8vIEhpZ2hlciBudW1iZXIgPSBoaWdoZXIgcHJpb3JpdHkgKFRvcExlZnQgPiBCb3R0b21SaWdodCA+IENlbnRlcilcbiAgICBDZW50ZXIgPSAwLFxuICAgIEJvdHRvbVJpZ2h0ID0gMSxcbiAgICBUb3BMZWZ0ID0gMixcbn1cblxuZXhwb3J0IGNsYXNzIEd1aWRlIHtcbiAgICBjb25zdHJ1Y3RvcihcbiAgICAgICAgcmVhZG9ubHkgdmVydGljYWw6IGJvb2xlYW4sXG4gICAgICAgIHJlYWRvbmx5IHZhbHVlOiBudW1iZXIsXG4gICAgICAgIHJlYWRvbmx5IG9yaWdpbjogR3VpZGVPcmlnaW4sXG4gICAgKSB7fVxufVxuXG5leHBvcnQgY2xhc3MgR3VpZGVsaW5lQ29udHJvbGxlciB7XG4gICAgcHJpdmF0ZSBndWlkZXM6IEd1aWRlW10gPSBbXTtcbiAgICBwcml2YXRlIGd1aWRlbGluZXM6IEd1aWRlbGluZVtdID0gW107XG5cbiAgICBwcml2YXRlIHN1YnNjcmlwdGlvbnM6IFN1YnNjcmlwdGlvbltdID0gW107XG5cbiAgICBjb25zdHJ1Y3Rvcihwcml2YXRlIGJvYXJkOiBCb2FyZCkge31cblxuICAgIHB1YmxpYyBhY3RpdmF0ZSgpOiB2b2lkIHtcbiAgICAgICAgY29uc3QgZGVib3VuY2VkT25DaGFuZ2UgPSBkZWJvdW5jZSgoKSA9PiB7XG4gICAgICAgICAgICB0aGlzLm9uQ2hhbmdlKCk7XG4gICAgICAgIH0sIDUwKTtcblxuICAgICAgICBjb25zdCBvbkRlU3Bhd24gPSAoZTogU3Bhd25FdmVudCkgPT4ge1xuICAgICAgICAgICAgaWYgKCEoXCJpc0d1aWRlbGluZVwiIGluIGUudGFyZ2V0KSkge1xuICAgICAgICAgICAgICAgIGRlYm91bmNlZE9uQ2hhbmdlKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG5cbiAgICAgICAgdGhpcy5zdWJzY3JpcHRpb25zLnB1c2goXG4gICAgICAgICAgICB0aGlzLmJvYXJkLm9uU3Bhd24ubGlzdGVuKHVuZGVmaW5lZCwgb25EZVNwYXduKSxcbiAgICAgICAgKTtcbiAgICAgICAgdGhpcy5zdWJzY3JpcHRpb25zLnB1c2goXG4gICAgICAgICAgICB0aGlzLmJvYXJkLm9uRGVzcGF3bi5saXN0ZW4odW5kZWZpbmVkLCBvbkRlU3Bhd24pLFxuICAgICAgICApO1xuICAgICAgICB0aGlzLnN1YnNjcmlwdGlvbnMucHVzaChcbiAgICAgICAgICAgIHRoaXMuYm9hcmQub25DaGFuZ2VWaWV3cG9ydC5saXN0ZW4odW5kZWZpbmVkLCBlID0+IHtcbiAgICAgICAgICAgICAgICBpZiAoZS5uZXdWaWV3cG9ydC56b29tTGV2ZWwgIT09IGUub2xkVmlld3BvcnQ/Lnpvb21MZXZlbCkge1xuICAgICAgICAgICAgICAgICAgICBkZWJvdW5jZWRPbkNoYW5nZSgpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pLFxuICAgICAgICApO1xuICAgICAgICB0aGlzLnN1YnNjcmlwdGlvbnMucHVzaChcbiAgICAgICAgICAgIHRoaXMuYm9hcmQuY29udHJvbGxlci5tb3ZlLm9uTW92ZS5saXN0ZW4oXG4gICAgICAgICAgICAgICAgdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIGRlYm91bmNlZE9uQ2hhbmdlLFxuICAgICAgICAgICAgKSxcbiAgICAgICAgKTtcbiAgICAgICAgdGhpcy5zdWJzY3JpcHRpb25zLnB1c2goXG4gICAgICAgICAgICB0aGlzLmJvYXJkLmNvbnRyb2xsZXIucmVzaXplLm9uUmVzaXplLmxpc3RlbihcbiAgICAgICAgICAgICAgICB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgZGVib3VuY2VkT25DaGFuZ2UsXG4gICAgICAgICAgICApLFxuICAgICAgICApO1xuICAgICAgICB0aGlzLnN1YnNjcmlwdGlvbnMucHVzaChcbiAgICAgICAgICAgIHRoaXMuYm9hcmQuY29udHJvbGxlci5yb3RhdGUub25Sb3RhdGUubGlzdGVuKFxuICAgICAgICAgICAgICAgIHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBkZWJvdW5jZWRPbkNoYW5nZSxcbiAgICAgICAgICAgICksXG4gICAgICAgICk7XG4gICAgfVxuXG4gICAgcHVibGljIGRlYWN0aXZhdGUoKTogdm9pZCB7XG4gICAgICAgIHVuc3Vic2NyaWJlQWxsKHRoaXMuc3Vic2NyaXB0aW9ucyk7XG4gICAgfVxuXG4gICAgcHVibGljIGdldFNuYXBHdWlkZShcbiAgICAgICAgd29ybGRQb3NpdGlvbjogVmVjdG9yMixcbiAgICAgICAgdmVydGljYWw6IGJvb2xlYW4sXG4gICAgKTogT3B0aW9uYWw8R3VpZGU+IHtcbiAgICAgICAgY29uc3Qgdmlld3BvcnQgPSB0aGlzLmJvYXJkLnZpZXdwb3J0O1xuICAgICAgICBjb25zdCBwb3NWYWx1ZSA9IHZlcnRpY2FsID8gd29ybGRQb3NpdGlvbi54IDogd29ybGRQb3NpdGlvbi55O1xuXG4gICAgICAgIHJldHVybiB0aGlzLmd1aWRlc1xuICAgICAgICAgICAgLmZpbHRlcihndWlkZSA9PiBndWlkZS52ZXJ0aWNhbCA9PSB2ZXJ0aWNhbClcbiAgICAgICAgICAgIC5tYXAoZ3VpZGUgPT4gKHtcbiAgICAgICAgICAgICAgICBndWlkZTogZ3VpZGUsXG4gICAgICAgICAgICAgICAgZGlzdGFuY2U6IHRoaXMuZ2V0Vmlld0Rpc3RhbmNlKHZpZXdwb3J0LCBwb3NWYWx1ZSwgZ3VpZGUudmFsdWUpLFxuICAgICAgICAgICAgfSkpXG4gICAgICAgICAgICAuZmlsdGVyKHggPT4geC5kaXN0YW5jZSA8PSBzaG93R3VpZGVsaW5lRGlzdGFuY2UpXG4gICAgICAgICAgICAubWluKChhLCBiKSA9PiBhLmRpc3RhbmNlIC0gYi5kaXN0YW5jZSk/Lmd1aWRlO1xuICAgIH1cblxuICAgIHB1YmxpYyBzaG93R3VpZGVzKGd1aWRlczogR3VpZGVbXSk6IHZvaWQge1xuICAgICAgICBjb25zdCBndWlkZWxpbmVzID0gZ3VpZGVzLm1hcChndWlkZSA9PiBuZXcgR3VpZGVsaW5lKGd1aWRlKSk7XG4gICAgICAgIHRoaXMuYm9hcmQuYWRkT2JqZWN0cyhndWlkZWxpbmVzKTtcbiAgICAgICAgdGhpcy5ndWlkZWxpbmVzLnB1c2goLi4uZ3VpZGVsaW5lcyk7XG4gICAgfVxuXG4gICAgcHVibGljIGNsZWFyKCk6IHZvaWQge1xuICAgICAgICB0aGlzLmJvYXJkLnJlbW92ZU9iamVjdHModGhpcy5ndWlkZWxpbmVzKTtcbiAgICAgICAgdGhpcy5ndWlkZWxpbmVzID0gW107XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBnZXRWaWV3RGlzdGFuY2Uodmlld3BvcnQ6IFZpZXdwb3J0LCBhOiBudW1iZXIsIGI6IG51bWJlcik6IG51bWJlciB7XG4gICAgICAgIHJldHVybiBNYXRoLmFicyhiIC0gYSkgKiB2aWV3cG9ydC56b29tTGV2ZWw7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBvbkNoYW5nZSgpOiB2b2lkIHtcbiAgICAgICAgY29uc3QgZ3VpZGVzID0gdGhpcy5nZXRBbGxHdWlkZXMoKTtcblxuICAgICAgICBjb25zdCB2ZXJ0aWNhbCA9IGd1aWRlcy5maWx0ZXIoZ3VpZGUgPT4gZ3VpZGUudmVydGljYWwpO1xuICAgICAgICBjb25zdCBob3Jpem9udGFsID0gZ3VpZGVzLmZpbHRlcihndWlkZSA9PiAhZ3VpZGUudmVydGljYWwpO1xuXG4gICAgICAgIGNvbnN0IHZpZXdNaW5HdWlkZURpc3RhbmNlID1cbiAgICAgICAgICAgIHN0YW5kYXJkTWluR3VpZGVEaXN0YW5jZSAvIHRoaXMuYm9hcmQudmlld3BvcnQuem9vbUxldmVsO1xuXG4gICAgICAgIHRoaXMuZ3VpZGVzID0gW1xuICAgICAgICAgICAgLi4uc2VsZWN0R3VpZGVzKGRlZHVwbGljYXRlR3VpZGVzKHZlcnRpY2FsKSwgdmlld01pbkd1aWRlRGlzdGFuY2UpLFxuICAgICAgICAgICAgLi4uc2VsZWN0R3VpZGVzKFxuICAgICAgICAgICAgICAgIGRlZHVwbGljYXRlR3VpZGVzKGhvcml6b250YWwpLFxuICAgICAgICAgICAgICAgIHZpZXdNaW5HdWlkZURpc3RhbmNlLFxuICAgICAgICAgICAgKSxcbiAgICAgICAgXTtcblxuICAgICAgICBpZiAoRGVidWdDb25maWcuYWx3YXlzU2hvd0d1aWRlbGluZXMpIHtcbiAgICAgICAgICAgIHRoaXMuc2hvd0d1aWRlcyh0aGlzLmd1aWRlcyk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwcml2YXRlIGdldEFsbEd1aWRlcygpOiBHdWlkZVtdIHtcbiAgICAgICAgY29uc3QgZ3VpZGVzOiBHdWlkZVtdID0gW107XG5cbiAgICAgICAgY29uc3QgYm9hcmRJdGVtcyA9IHRoaXMuZ2V0Qm9hcmRJdGVtcygpO1xuICAgICAgICBjb25zdCBzZWxlY3RlZCA9IHRoaXMuYm9hcmQuY29udHJvbGxlci5zZWxlY3Quc2VsZWN0ZWRPYmplY3RzO1xuXG4gICAgICAgIGZvciAoY29uc3QgYm9hcmRJdGVtIG9mIGJvYXJkSXRlbXMpIHtcbiAgICAgICAgICAgIGlmIChib2FyZEl0ZW0uaXNGaXhlZCB8fCBzZWxlY3RlZC5oYXMoYm9hcmRJdGVtKSkge1xuICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBjb25zdCBkZWZhdWx0Qm91bmRpbmdCb3ggPSBib2FyZEl0ZW0uYm91bmRpbmdCb3goVmlld3BvcnQud29ybGQpO1xuXG4gICAgICAgICAgICBjb25zdCBiYiA9IHJvdGF0ZUJvdW5kaW5nQm94KGRlZmF1bHRCb3VuZGluZ0JveCwgYm9hcmRJdGVtLnJhZGlhbnMpO1xuXG4gICAgICAgICAgICBndWlkZXMucHVzaChuZXcgR3VpZGUodHJ1ZSwgYmIucG9zaXRpb24ueCwgR3VpZGVPcmlnaW4uVG9wTGVmdCkpO1xuICAgICAgICAgICAgaWYgKGFjdGl2YXRlQ2VudGVyR3VpZGVzKSB7XG4gICAgICAgICAgICAgICAgZ3VpZGVzLnB1c2goXG4gICAgICAgICAgICAgICAgICAgIG5ldyBHdWlkZShcbiAgICAgICAgICAgICAgICAgICAgICAgIHRydWUsXG4gICAgICAgICAgICAgICAgICAgICAgICBiYi5wb3NpdGlvbi54ICsgYmIuc2l6ZS54IC8gMi4wLFxuICAgICAgICAgICAgICAgICAgICAgICAgR3VpZGVPcmlnaW4uQ2VudGVyLFxuICAgICAgICAgICAgICAgICAgICApLFxuICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBndWlkZXMucHVzaChcbiAgICAgICAgICAgICAgICBuZXcgR3VpZGUoXG4gICAgICAgICAgICAgICAgICAgIHRydWUsXG4gICAgICAgICAgICAgICAgICAgIGJiLnBvc2l0aW9uLnggKyBiYi5zaXplLngsXG4gICAgICAgICAgICAgICAgICAgIEd1aWRlT3JpZ2luLkJvdHRvbVJpZ2h0LFxuICAgICAgICAgICAgICAgICksXG4gICAgICAgICAgICApO1xuXG4gICAgICAgICAgICBndWlkZXMucHVzaChuZXcgR3VpZGUoZmFsc2UsIGJiLnBvc2l0aW9uLnksIEd1aWRlT3JpZ2luLlRvcExlZnQpKTtcbiAgICAgICAgICAgIGlmIChhY3RpdmF0ZUNlbnRlckd1aWRlcykge1xuICAgICAgICAgICAgICAgIGd1aWRlcy5wdXNoKFxuICAgICAgICAgICAgICAgICAgICBuZXcgR3VpZGUoXG4gICAgICAgICAgICAgICAgICAgICAgICBmYWxzZSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGJiLnBvc2l0aW9uLnkgKyBiYi5zaXplLnkgLyAyLjAsXG4gICAgICAgICAgICAgICAgICAgICAgICBHdWlkZU9yaWdpbi5DZW50ZXIsXG4gICAgICAgICAgICAgICAgICAgICksXG4gICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGd1aWRlcy5wdXNoKFxuICAgICAgICAgICAgICAgIG5ldyBHdWlkZShcbiAgICAgICAgICAgICAgICAgICAgZmFsc2UsXG4gICAgICAgICAgICAgICAgICAgIGJiLnBvc2l0aW9uLnkgKyBiYi5zaXplLnksXG4gICAgICAgICAgICAgICAgICAgIEd1aWRlT3JpZ2luLkJvdHRvbVJpZ2h0LFxuICAgICAgICAgICAgICAgICksXG4gICAgICAgICAgICApO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGd1aWRlcztcbiAgICB9XG5cbiAgICBwcml2YXRlIGdldEJvYXJkSXRlbXMoKTogQm9hcmRJdGVtW10ge1xuICAgICAgICByZXR1cm4gdGhpcy5ib2FyZC5vYmplY3RzXG4gICAgICAgICAgICAubWFwKG9iamVjdCA9PiB7XG4gICAgICAgICAgICAgICAgaWYgKFwiaXNCb2FyZEl0ZW1cIiBpbiBvYmplY3QpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFs8Qm9hcmRJdGVtPm9iamVjdF07XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgY29uc3Qgc2VsZWN0YWJsZXMgPSBmaW5kU2VsZWN0YWJsZXMob2JqZWN0KTtcbiAgICAgICAgICAgICAgICByZXR1cm4gc2VsZWN0YWJsZXMubWFwKHNlbGVjdGFibGUgPT4gc2VsZWN0YWJsZS5jb250ZW50KTtcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAuZmxhdCgpO1xuICAgIH1cbn1cblxuZnVuY3Rpb24gc2VsZWN0R3VpZGVzKFxuICAgIGRlZHVwbGljYXRlZDogW0d1aWRlW10sIG51bWJlcltdXSxcbiAgICBtaW5HdWlkZURpc3RhbmNlOiBudW1iZXIsXG4pOiBHdWlkZVtdIHtcbiAgICBjb25zdCBbdW5pcXVlLCBjb3VudHNdID0gZGVkdXBsaWNhdGVkO1xuXG4gICAgLy8gU29ydCBpbmRpY2VzIG9mIGFsbCBndWlkZXMgYnkgaW1wb3J0YW5jZVxuICAgIGNvbnN0IGluZGljZXMgPSB1bmlxdWUubWFwKChfLCBpZHgpID0+IGlkeCk7XG4gICAgaW5kaWNlcy5zb3J0KChhSWR4LCBiSWR4KSA9PiB7XG4gICAgICAgIGNvbnN0IGNvdW50RGlmZiA9IGNvdW50c1tiSWR4XSAtIGNvdW50c1thSWR4XTtcblxuICAgICAgICBpZiAoY291bnREaWZmICE9IDApIHtcbiAgICAgICAgICAgIHJldHVybiBjb3VudERpZmY7XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBhID0gdW5pcXVlW2FJZHhdO1xuICAgICAgICBjb25zdCBiID0gdW5pcXVlW2JJZHhdO1xuXG4gICAgICAgIGNvbnN0IG9yaWdpbkRpZmYgPSBiLm9yaWdpbiAtIGEub3JpZ2luO1xuXG4gICAgICAgIGlmIChvcmlnaW5EaWZmICE9IDApIHtcbiAgICAgICAgICAgIHJldHVybiBvcmlnaW5EaWZmO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gVE9ETzogZGlzdGFuY2Ugb2YgZ3VpZGUgdG8gc2VsZWN0ZWQgb2JqZWN0cywgYnV0IG5vdCBqdXN0IGFzIGEgdGhpcmRcbiAgICAgICAgLy8gbGF5ZXIgaWYgdGhlIG90aGVyIHR3byBoYXZlIGJlZW4gZXF1YWwsIGJ1dCByYXRoZXIgYXMgYSB3ZWlnaHQgZm9yIHRoZSBjb3VudFxuICAgICAgICAvLyBBbHNvOiBwcmlvcml0aXNlIHNuYXAgb2YgbWlkZGxlIGJvdW5kYXJ5IHRvIGEgbWlkZGxlIGd1aWRlIG9yaWdpblxuXG4gICAgICAgIHJldHVybiAwO1xuICAgIH0pO1xuXG4gICAgY29uc3QgYWN0aXZlID0gdW5pcXVlLm1hcCgoKSA9PiB0cnVlKTtcblxuICAgIC8vIEdvIHRocm91Z2ggaW5kaWNlcyBmcm9tIG1vc3QgdG8gbGVhc3QgaW1wb3J0YW50IGFuZCBkZWFjdGl2YXRlXG4gICAgLy8gbGVzcyBpbXBvcnRhbnQgbmVpZ2hib3JzXG4gICAgaW5kaWNlcy5mb3JFYWNoKGlkeCA9PiB7XG4gICAgICAgIGlmICghYWN0aXZlW2lkeF0pIHtcbiAgICAgICAgICAgIC8vIE9iamVjdCBpcyBhbHJlYWR5IGRlYWN0aXZhdGVkIGJ5IGEgbW9yZSBpbXBvcnRhbnQgbmVpZ2hib3JcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIGRlYWN0aXZhdGVOZWlnaGJvcnModW5pcXVlLCBhY3RpdmUsIC0xLCBtaW5HdWlkZURpc3RhbmNlLCBpZHgpO1xuICAgICAgICBkZWFjdGl2YXRlTmVpZ2hib3JzKHVuaXF1ZSwgYWN0aXZlLCAxLCBtaW5HdWlkZURpc3RhbmNlLCBpZHgpO1xuICAgIH0pO1xuXG4gICAgcmV0dXJuIHVuaXF1ZS5maWx0ZXIoKF8sIGlkeCkgPT4gYWN0aXZlW2lkeF0pO1xufVxuXG5mdW5jdGlvbiBkZWFjdGl2YXRlTmVpZ2hib3JzKFxuICAgIGd1aWRlczogR3VpZGVbXSxcbiAgICBhY3RpdmU6IGJvb2xlYW5bXSxcbiAgICBkaXJlY3Rpb246IDEgfCAtMSxcbiAgICBtaW5HdWlkZURpc3RhbmNlOiBudW1iZXIsXG4gICAgY3VycklkeDogbnVtYmVyLFxuKTogdm9pZCB7XG4gICAgY29uc3QgbiA9IGFjdGl2ZS5sZW5ndGg7XG4gICAgY29uc3QgY3VyciA9IGd1aWRlc1tjdXJySWR4XTtcblxuICAgIGZvciAobGV0IGkgPSBjdXJySWR4ICsgZGlyZWN0aW9uOyBpID49IDAgJiYgaSA8IG47IGkgKz0gZGlyZWN0aW9uKSB7XG4gICAgICAgIGlmICghYWN0aXZlW2ldKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoTWF0aC5hYnMoZ3VpZGVzW2ldLnZhbHVlIC0gY3Vyci52YWx1ZSkgPCBtaW5HdWlkZURpc3RhbmNlKSB7XG4gICAgICAgICAgICBhY3RpdmVbaV0gPSBmYWxzZTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgIH1cbn1cblxuZnVuY3Rpb24gZGVkdXBsaWNhdGVHdWlkZXMoZ3VpZGVsaW5lczogR3VpZGVbXSk6IFtHdWlkZVtdLCBudW1iZXJbXV0ge1xuICAgIGNvbnN0IHVuaXF1ZSA9IG5ldyBNYXA8bnVtYmVyLCBHdWlkZT4oKTtcbiAgICBjb25zdCBjb3VudHMgPSBuZXcgTWFwPG51bWJlciwgbnVtYmVyPigpO1xuXG4gICAgZm9yIChjb25zdCBndWlkZWxpbmUgb2YgZ3VpZGVsaW5lcykge1xuICAgICAgICBjb25zdCB2YWx1ZSA9IGd1aWRlbGluZS52YWx1ZTtcbiAgICAgICAgY29uc3QgZXhpc3RpbmcgPSB1bmlxdWUuZ2V0KHZhbHVlKTtcblxuICAgICAgICBpZiAoZXhpc3RpbmcgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgdW5pcXVlLnNldCh2YWx1ZSwgZ3VpZGVsaW5lKTtcbiAgICAgICAgICAgIGNvdW50cy5zZXQodmFsdWUsIDEpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdW5pcXVlLnNldCh2YWx1ZSwgc2VsZWN0R3VpZGVCeVByaW9yaXR5KGV4aXN0aW5nLCBndWlkZWxpbmUpKTtcbiAgICAgICAgICAgIGNvdW50cy5zZXQodmFsdWUsIGNvdW50cy5nZXQodmFsdWUpICsgMSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBjb25zdCBzb3J0ZWQgPSBbLi4udW5pcXVlLmVudHJpZXMoKV1cbiAgICAgICAgLnNvcnQoKGEsIGIpID0+IGFbMV0udmFsdWUgLSBiWzFdLnZhbHVlKVxuICAgICAgICAubWFwKHggPT4geFsxXSk7XG4gICAgY29uc3Qgc29ydGVkQ291bnRzID0gc29ydGVkLm1hcChndWlkZSA9PiBjb3VudHMuZ2V0KGd1aWRlLnZhbHVlKSk7XG5cbiAgICByZXR1cm4gW3NvcnRlZCwgc29ydGVkQ291bnRzXTtcbn1cblxuZnVuY3Rpb24gc2VsZWN0R3VpZGVCeVByaW9yaXR5KG9uZTogR3VpZGUsIG90aGVyOiBHdWlkZSk6IEd1aWRlIHtcbiAgICBpZiAob25lLm9yaWdpbiAtIG90aGVyLm9yaWdpbiA8IDApIHtcbiAgICAgICAgcmV0dXJuIG90aGVyO1xuICAgIH1cbiAgICByZXR1cm4gb25lO1xufVxuIiwiaW1wb3J0IHR5cGUgeyBCb2FyZCB9IGZyb20gXCJAY2FudmFzL2JvYXJkL0JvYXJkXCI7XG5pbXBvcnQgdHlwZSB7IEdlb21ldHJpY09iamVjdCB9IGZyb20gXCJAY2FudmFzL2JvYXJkL29iamVjdHMvR2VvbWV0cmljT2JqZWN0XCI7XG5pbXBvcnQgeyBtb3VzZVBvc2l0aW9uVG9FbGVtZW50IH0gZnJvbSBcIkBjYW52YXMvcHJpbWl0aXZlcy9kb21cIjtcbmltcG9ydCB0eXBlIHsgU3Vic2NyaXB0aW9uIH0gZnJvbSBcIkBjYW52YXMvcHJpbWl0aXZlcy9ldmVudHNcIjtcbmltcG9ydCB7XG4gICAgY3JlYXRlRG9tRXZlbnRMaXN0ZW5lcixcbiAgICBFdmVudEJhc2UsXG4gICAgRXZlbnRIYW5kbGVyLFxuICAgIGdldFRhcmdldE9mRXZlbnRTdGFjayxcbiAgICB1bnN1YnNjcmliZUFsbCxcbn0gZnJvbSBcIkBjYW52YXMvcHJpbWl0aXZlcy9ldmVudHNcIjtcbmltcG9ydCB0eXBlIHsgVmVjdG9yMiB9IGZyb20gXCJAY2FudmFzL3ByaW1pdGl2ZXMvc3BhY2VcIjtcbmltcG9ydCB0eXBlIHsgT3B0aW9uYWwgfSBmcm9tIFwiQGNhbnZhcy9wcmltaXRpdmVzL3R5cGVzXCI7XG5pbXBvcnQgeyBNb2RpZmllclN0YXRlIH0gZnJvbSBcIkBjYW52YXMvdXRpbHMvaW5wdXQvTW9kaWZpZXJTdGF0ZVwiO1xuaW1wb3J0IHsgTW91c2VCdXR0b24gfSBmcm9tIFwiQGNhbnZhcy91dGlscy9pbnB1dC9Nb3VzZUJ1dHRvblwiO1xuXG5leHBvcnQgY2xhc3MgTW91c2VFdmVudEJhc2UgZXh0ZW5kcyBFdmVudEJhc2U8R2VvbWV0cmljT2JqZWN0PiB7XG4gICAgY29uc3RydWN0b3IoXG4gICAgICAgIHJlYWRvbmx5IHBvc2l0aW9uOiBWZWN0b3IyLFxuICAgICAgICByZWFkb25seSBtb2RpZmllcnM6IE1vZGlmaWVyU3RhdGUsXG4gICAgICAgIHJlYWRvbmx5IGV2ZW50U3RhY2s/OiBHZW9tZXRyaWNPYmplY3RbXSxcbiAgICApIHtcbiAgICAgICAgc3VwZXIoZXZlbnRTdGFjayk7XG4gICAgfVxufVxuXG5leHBvcnQgY2xhc3MgTW91c2VQcmVzc0V2ZW50QmFzZSBleHRlbmRzIE1vdXNlRXZlbnRCYXNlIHtcbiAgICBjb25zdHJ1Y3RvcihcbiAgICAgICAgcG9zaXRpb246IFZlY3RvcjIsXG4gICAgICAgIG1vZGlmaWVyczogTW9kaWZpZXJTdGF0ZSxcbiAgICAgICAgcmVhZG9ubHkgYnV0dG9uOiBNb3VzZUJ1dHRvbixcbiAgICAgICAgcmVhZG9ubHkgY2xpY2tzOiBudW1iZXIsXG4gICAgICAgIHJlYWRvbmx5IGV2ZW50U3RhY2s/OiBHZW9tZXRyaWNPYmplY3RbXSxcbiAgICApIHtcbiAgICAgICAgc3VwZXIocG9zaXRpb24sIG1vZGlmaWVycywgZXZlbnRTdGFjayk7XG4gICAgfVxufVxuXG5leHBvcnQgY2xhc3MgTW91c2VEb3duRXZlbnQgZXh0ZW5kcyBNb3VzZVByZXNzRXZlbnRCYXNlIHt9XG5leHBvcnQgY2xhc3MgTW91c2VVcEV2ZW50IGV4dGVuZHMgTW91c2VQcmVzc0V2ZW50QmFzZSB7fVxuZXhwb3J0IGNsYXNzIE1vdXNlQ2xpY2tFdmVudCBleHRlbmRzIE1vdXNlUHJlc3NFdmVudEJhc2Uge31cbmV4cG9ydCBjbGFzcyBNb3VzZU1vdmVFdmVudCBleHRlbmRzIE1vdXNlRXZlbnRCYXNlIHt9XG5leHBvcnQgY2xhc3MgTW91c2VPdmVyRXZlbnQgZXh0ZW5kcyBNb3VzZUV2ZW50QmFzZSB7fVxuZXhwb3J0IGNsYXNzIE1vdXNlT3V0RXZlbnQgZXh0ZW5kcyBNb3VzZUV2ZW50QmFzZSB7fVxuXG5leHBvcnQgY2xhc3MgTW91c2VJbnRlcmFjdGlvbkNvbnRyb2xsZXIge1xuICAgIHJlYWRvbmx5IG9uTW91c2VDbGljayA9IG5ldyBFdmVudEhhbmRsZXI8TW91c2VDbGlja0V2ZW50PigpO1xuICAgIHJlYWRvbmx5IG9uTW91c2VEb3duID0gbmV3IEV2ZW50SGFuZGxlcjxNb3VzZURvd25FdmVudD4oKTtcbiAgICByZWFkb25seSBvbk1vdXNlVXAgPSBuZXcgRXZlbnRIYW5kbGVyPE1vdXNlVXBFdmVudD4oKTtcbiAgICByZWFkb25seSBvbk1vdXNlTW92ZSA9IG5ldyBFdmVudEhhbmRsZXI8TW91c2VNb3ZlRXZlbnQ+KCk7XG4gICAgcmVhZG9ubHkgb25Nb3VzZU92ZXIgPSBuZXcgRXZlbnRIYW5kbGVyPE1vdXNlT3ZlckV2ZW50PigpO1xuICAgIHJlYWRvbmx5IG9uTW91c2VPdXQgPSBuZXcgRXZlbnRIYW5kbGVyPE1vdXNlT3V0RXZlbnQ+KCk7XG5cbiAgICBwcml2YXRlIHN1YnNjcmlwdGlvbnM6IFN1YnNjcmlwdGlvbltdID0gW107XG4gICAgcHJpdmF0ZSBwZW5kaW5nTW91c2VDbGlja0V2ZW50OiBPcHRpb25hbDxNb3VzZUNsaWNrRXZlbnQ+O1xuICAgIHByaXZhdGUgcGVuZGluZ01vdXNlT3ZlclN0YWNrOiBPcHRpb25hbDxHZW9tZXRyaWNPYmplY3RbXT47XG5cbiAgICBjb25zdHJ1Y3Rvcihwcml2YXRlIGJvYXJkOiBCb2FyZCkge31cblxuICAgIHB1YmxpYyBhY3RpdmF0ZSgpOiB2b2lkIHtcbiAgICAgICAgdGhpcy5zdWJzY3JpcHRpb25zLnB1c2goXG4gICAgICAgICAgICBjcmVhdGVEb21FdmVudExpc3RlbmVyKHRoaXMuYm9hcmQuYm9hcmRFbGVtZW50LCBcIm1vdXNlZG93blwiLCBlID0+IHtcbiAgICAgICAgICAgICAgICB0aGlzLm9uQm9hcmRNb3VzZURvd24oZSk7XG4gICAgICAgICAgICB9KSxcbiAgICAgICAgKTtcbiAgICAgICAgdGhpcy5zdWJzY3JpcHRpb25zLnB1c2goXG4gICAgICAgICAgICBjcmVhdGVEb21FdmVudExpc3RlbmVyKHRoaXMuYm9hcmQuYm9hcmRFbGVtZW50LCBcIm1vdXNldXBcIiwgZSA9PiB7XG4gICAgICAgICAgICAgICAgdGhpcy5vbkJvYXJkTW91c2VVcChlKTtcbiAgICAgICAgICAgIH0pLFxuICAgICAgICApO1xuICAgICAgICB0aGlzLnN1YnNjcmlwdGlvbnMucHVzaChcbiAgICAgICAgICAgIGNyZWF0ZURvbUV2ZW50TGlzdGVuZXIodGhpcy5ib2FyZC5ib2FyZEVsZW1lbnQsIFwibW91c2Vtb3ZlXCIsIGUgPT4ge1xuICAgICAgICAgICAgICAgIHRoaXMub25Cb2FyZE1vdXNlTW92ZShlKTtcbiAgICAgICAgICAgIH0pLFxuICAgICAgICApO1xuICAgIH1cblxuICAgIHB1YmxpYyBkZWFjdGl2YXRlKCk6IHZvaWQge1xuICAgICAgICB1bnN1YnNjcmliZUFsbCh0aGlzLnN1YnNjcmlwdGlvbnMpO1xuICAgIH1cblxuICAgIHByaXZhdGUgb25Cb2FyZE1vdXNlRG93bihlOiBNb3VzZUV2ZW50KTogdm9pZCB7XG4gICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgZS5zdG9wUHJvcGFnYXRpb24oKTtcblxuICAgICAgICBjb25zdCBtb2RpZmllclN0YXRlID0gTW9kaWZpZXJTdGF0ZS5mcm9tRG9tRXZlbnQoZSk7XG4gICAgICAgIGNvbnN0IG1vdXNlUG9zaXRpb24gPSBtb3VzZVBvc2l0aW9uVG9FbGVtZW50KFxuICAgICAgICAgICAgZSxcbiAgICAgICAgICAgIHRoaXMuYm9hcmQuYm9hcmRFbGVtZW50LFxuICAgICAgICApO1xuICAgICAgICBjb25zdCByYXlDYXN0U3RhY2sgPSB0aGlzLmdldFJheUNhc3RTdGFjayhtb3VzZVBvc2l0aW9uKTtcblxuICAgICAgICB0aGlzLnBlbmRpbmdNb3VzZUNsaWNrRXZlbnQgPSBuZXcgTW91c2VDbGlja0V2ZW50KFxuICAgICAgICAgICAgbW91c2VQb3NpdGlvbixcbiAgICAgICAgICAgIG1vZGlmaWVyU3RhdGUsXG4gICAgICAgICAgICBlLmJ1dHRvbnMsXG4gICAgICAgICAgICBlLmRldGFpbCxcbiAgICAgICAgICAgIHJheUNhc3RTdGFjayxcbiAgICAgICAgKTtcblxuICAgICAgICBjb25zdCBldmVudCA9IG5ldyBNb3VzZURvd25FdmVudChcbiAgICAgICAgICAgIG1vdXNlUG9zaXRpb24sXG4gICAgICAgICAgICBtb2RpZmllclN0YXRlLFxuICAgICAgICAgICAgZS5idXR0b25zLFxuICAgICAgICAgICAgZS5kZXRhaWwsXG4gICAgICAgICAgICByYXlDYXN0U3RhY2ssXG4gICAgICAgICk7XG5cbiAgICAgICAgdGhpcy5vbk1vdXNlRG93bi5kaXNwYXRjaChldmVudCk7XG5cbiAgICAgICAgaWYgKGV2ZW50LmRlZmF1bHRQcmV2ZW50ZWQpIHtcbiAgICAgICAgICAgIHRoaXMucGVuZGluZ01vdXNlQ2xpY2tFdmVudCA9IHVuZGVmaW5lZDtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHByaXZhdGUgb25Cb2FyZE1vdXNlVXAoZTogTW91c2VFdmVudCk6IHZvaWQge1xuICAgICAgICBpZiAoZS5idXR0b25zID09IE1vdXNlQnV0dG9uLk5vbmUpIHtcbiAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcblxuICAgICAgICAgICAgY29uc3QgbW9kaWZpZXJTdGF0ZSA9IE1vZGlmaWVyU3RhdGUuZnJvbURvbUV2ZW50KGUpO1xuICAgICAgICAgICAgY29uc3QgbW91c2VQb3NpdGlvbiA9IG1vdXNlUG9zaXRpb25Ub0VsZW1lbnQoXG4gICAgICAgICAgICAgICAgZSxcbiAgICAgICAgICAgICAgICB0aGlzLmJvYXJkLmJvYXJkRWxlbWVudCxcbiAgICAgICAgICAgICk7XG4gICAgICAgICAgICBjb25zdCByYXlDYXN0U3RhY2sgPSB0aGlzLmdldFJheUNhc3RTdGFjayhtb3VzZVBvc2l0aW9uKTtcblxuICAgICAgICAgICAgY29uc3QgZXZlbnQgPSBuZXcgTW91c2VVcEV2ZW50KFxuICAgICAgICAgICAgICAgIG1vdXNlUG9zaXRpb24sXG4gICAgICAgICAgICAgICAgbW9kaWZpZXJTdGF0ZSxcbiAgICAgICAgICAgICAgICBlLmJ1dHRvbnMsXG4gICAgICAgICAgICAgICAgZS5kZXRhaWwsXG4gICAgICAgICAgICAgICAgcmF5Q2FzdFN0YWNrLFxuICAgICAgICAgICAgKTtcblxuICAgICAgICAgICAgdGhpcy5vbk1vdXNlVXAuZGlzcGF0Y2goZXZlbnQpO1xuXG4gICAgICAgICAgICBpZiAoZXZlbnQuZGVmYXVsdFByZXZlbnRlZCkge1xuICAgICAgICAgICAgICAgIHRoaXMucGVuZGluZ01vdXNlQ2xpY2tFdmVudCA9IHVuZGVmaW5lZDtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKHRoaXMucGVuZGluZ01vdXNlQ2xpY2tFdmVudCAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgcGVuZGluZ1RhcmdldCA9IGdldFRhcmdldE9mRXZlbnRTdGFjayhcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5wZW5kaW5nTW91c2VDbGlja0V2ZW50LmV2ZW50U3RhY2ssXG4gICAgICAgICAgICAgICAgKTtcblxuICAgICAgICAgICAgICAgIGlmIChwZW5kaW5nVGFyZ2V0ID09PSBnZXRUYXJnZXRPZkV2ZW50U3RhY2socmF5Q2FzdFN0YWNrKSkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLm9uTW91c2VDbGljay5kaXNwYXRjaCh0aGlzLnBlbmRpbmdNb3VzZUNsaWNrRXZlbnQpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMucGVuZGluZ01vdXNlQ2xpY2tFdmVudCA9IHVuZGVmaW5lZDtcbiAgICB9XG5cbiAgICBwcml2YXRlIG9uQm9hcmRNb3VzZU1vdmUoZTogTW91c2VFdmVudCk6IHZvaWQge1xuICAgICAgICBjb25zdCBtb2RpZmllclN0YXRlID0gTW9kaWZpZXJTdGF0ZS5mcm9tRG9tRXZlbnQoZSk7XG4gICAgICAgIGNvbnN0IG1vdXNlUG9zaXRpb24gPSBtb3VzZVBvc2l0aW9uVG9FbGVtZW50KFxuICAgICAgICAgICAgZSxcbiAgICAgICAgICAgIHRoaXMuYm9hcmQuYm9hcmRFbGVtZW50LFxuICAgICAgICApO1xuICAgICAgICBjb25zdCByYXlDYXN0U3RhY2sgPSB0aGlzLmdldFJheUNhc3RTdGFjayhtb3VzZVBvc2l0aW9uKTtcbiAgICAgICAgY29uc3QgdGFyZ2V0ID0gZ2V0VGFyZ2V0T2ZFdmVudFN0YWNrKHJheUNhc3RTdGFjayk7XG5cbiAgICAgICAgdGhpcy5vbk1vdXNlTW92ZS5kaXNwYXRjaChcbiAgICAgICAgICAgIG5ldyBNb3VzZU1vdmVFdmVudChtb3VzZVBvc2l0aW9uLCBtb2RpZmllclN0YXRlLCByYXlDYXN0U3RhY2spLFxuICAgICAgICApO1xuXG4gICAgICAgIGNvbnN0IHBlbmRpbmdUYXJnZXQgPVxuICAgICAgICAgICAgdGhpcy5wZW5kaW5nTW91c2VPdmVyU3RhY2sgPT09IHVuZGVmaW5lZFxuICAgICAgICAgICAgICAgID8gdW5kZWZpbmVkXG4gICAgICAgICAgICAgICAgOiBnZXRUYXJnZXRPZkV2ZW50U3RhY2sodGhpcy5wZW5kaW5nTW91c2VPdmVyU3RhY2spO1xuXG4gICAgICAgIGlmICh0YXJnZXQgIT09IHBlbmRpbmdUYXJnZXQpIHtcbiAgICAgICAgICAgIGlmIChwZW5kaW5nVGFyZ2V0ICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICB0aGlzLm9uTW91c2VPdXQuZGlzcGF0Y2goXG4gICAgICAgICAgICAgICAgICAgIG5ldyBNb3VzZU91dEV2ZW50KFxuICAgICAgICAgICAgICAgICAgICAgICAgbW91c2VQb3NpdGlvbixcbiAgICAgICAgICAgICAgICAgICAgICAgIG1vZGlmaWVyU3RhdGUsXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnBlbmRpbmdNb3VzZU92ZXJTdGFjayxcbiAgICAgICAgICAgICAgICAgICAgKSxcbiAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAodGFyZ2V0ICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICB0aGlzLm9uTW91c2VPdmVyLmRpc3BhdGNoKFxuICAgICAgICAgICAgICAgICAgICBuZXcgTW91c2VPdmVyRXZlbnQoXG4gICAgICAgICAgICAgICAgICAgICAgICBtb3VzZVBvc2l0aW9uLFxuICAgICAgICAgICAgICAgICAgICAgICAgbW9kaWZpZXJTdGF0ZSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHJheUNhc3RTdGFjayxcbiAgICAgICAgICAgICAgICAgICAgKSxcbiAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5wZW5kaW5nTW91c2VPdmVyU3RhY2sgPSByYXlDYXN0U3RhY2s7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBnZXRSYXlDYXN0U3RhY2socG9zaXRpb246IFZlY3RvcjIpOiBPcHRpb25hbDxHZW9tZXRyaWNPYmplY3RbXT4ge1xuICAgICAgICBjb25zdCB2aWV3cG9ydCA9IHRoaXMuYm9hcmQudmlld3BvcnQ7XG5cbiAgICAgICAgZm9yIChjb25zdCBvYmplY3Qgb2YgdGhpcy5ib2FyZC5vYmplY3RzLnJldmVyc2VkKCkpIHtcbiAgICAgICAgICAgIGNvbnN0IHN0YWNrID0gb2JqZWN0LmNhc3RSYXkocG9zaXRpb24sIHZpZXdwb3J0KTtcblxuICAgICAgICAgICAgaWYgKHN0YWNrICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gc3RhY2s7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgIH1cbn1cbiIsImltcG9ydCB0eXBlIHsgQm9hcmQgfSBmcm9tIFwiQGNhbnZhcy9ib2FyZC9Cb2FyZFwiO1xuaW1wb3J0IHsgQm9hcmRNb2RlLCBjYW5Nb3ZlIH0gZnJvbSBcIkBjYW52YXMvYm9hcmQvY29udHJvbGxlcnMvQm9hcmRNb2RlXCI7XG5pbXBvcnQgdHlwZSB7XG4gICAgTW91c2VEb3duRXZlbnQsXG4gICAgTW91c2VNb3ZlRXZlbnQsXG4gICAgTW91c2VVcEV2ZW50LFxufSBmcm9tIFwiQGNhbnZhcy9ib2FyZC9jb250cm9sbGVycy9vYmplY3RzL01vdXNlSW50ZXJhY3Rpb25Db250cm9sbGVyXCI7XG5pbXBvcnQgeyBjb250YWluaW5nQm91bmRpbmdCb3ggfSBmcm9tIFwiQGNhbnZhcy9ib2FyZC9vYmplY3RzL2ZvdW5kYXRpb24vR3JvdXBcIjtcbmltcG9ydCB7IHJvdGF0ZUJvdW5kaW5nQm94IH0gZnJvbSBcIkBjYW52YXMvYm9hcmQvb2JqZWN0cy9mb3VuZGF0aW9uL1JvdGF0ZUNvbnRhaW5lclwiO1xuaW1wb3J0IHR5cGUgeyBHZW9tZXRyaWNPYmplY3QgfSBmcm9tIFwiQGNhbnZhcy9ib2FyZC9vYmplY3RzL0dlb21ldHJpY09iamVjdFwiO1xuaW1wb3J0IHsgZ2V0VG9wU2VsZWN0YWJsZU9uRXZlbnRTdGFjayB9IGZyb20gXCJAY2FudmFzL2JvYXJkL29iamVjdHMvdWkvc2VsZWN0YWJsZS9TZWxlY3RhYmxlXCI7XG5pbXBvcnQgeyByZXNldEN1cnNvciwgc2V0Q3Vyc29yIH0gZnJvbSBcIkBjYW52YXMvcHJpbWl0aXZlcy9kb21cIjtcbmltcG9ydCB0eXBlIHsgU3Vic2NyaXB0aW9uIH0gZnJvbSBcIkBjYW52YXMvcHJpbWl0aXZlcy9ldmVudHNcIjtcbmltcG9ydCB7XG4gICAgRXZlbnRCYXNlLFxuICAgIEV2ZW50SGFuZGxlcixcbiAgICB1bnN1YnNjcmliZUFsbCxcbn0gZnJvbSBcIkBjYW52YXMvcHJpbWl0aXZlcy9ldmVudHNcIjtcbmltcG9ydCB0eXBlIHsgQm91bmRpbmdCb3ggfSBmcm9tIFwiQGNhbnZhcy9wcmltaXRpdmVzL3NwYWNlXCI7XG5pbXBvcnQgeyBWZWN0b3IyIH0gZnJvbSBcIkBjYW52YXMvcHJpbWl0aXZlcy9zcGFjZVwiO1xuaW1wb3J0IHR5cGUgeyBPcHRpb25hbCB9IGZyb20gXCJAY2FudmFzL3ByaW1pdGl2ZXMvdHlwZXNcIjtcbmltcG9ydCB7IFZpZXdwb3J0IH0gZnJvbSBcIkBjYW52YXMvcmVuZGVyL1ZpZXdwb3J0XCI7XG5pbXBvcnQgeyBCaW5kaW5nIH0gZnJvbSBcIkBjb25maWcvYmluZGluZ3NcIjtcbmltcG9ydCB7IGNhbk1vdmVDdXJzb3IsIG1vdmVDdXJzb3IgfSBmcm9tIFwiQGNvbmZpZy9kcmF3XCI7XG5pbXBvcnQgeyBtb3ZlVGhyZXNob2xkIH0gZnJvbSBcIkBjb25maWcvaW50ZXJhY3Rpb25cIjtcblxuZXhwb3J0IGNsYXNzIE1vdmVPYmplY3RFdmVudCBleHRlbmRzIEV2ZW50QmFzZTxHZW9tZXRyaWNPYmplY3Q+IHtcbiAgICBjb25zdHJ1Y3RvcihcbiAgICAgICAgcmVhZG9ubHkgcG9zaXRpb25EZWx0YTogVmVjdG9yMixcbiAgICAgICAgZXZlbnRTdGFjaz86IEdlb21ldHJpY09iamVjdFtdLFxuICAgICkge1xuICAgICAgICBzdXBlcihldmVudFN0YWNrKTtcbiAgICB9XG59XG5cbmV4cG9ydCBjbGFzcyBNb3ZlT2JqZWN0Q29udHJvbGxlciB7XG4gICAgcmVhZG9ubHkgb25Nb3ZlID0gbmV3IEV2ZW50SGFuZGxlcjxNb3ZlT2JqZWN0RXZlbnQ+KCk7XG5cbiAgICBwcml2YXRlIHN1YnNjcmlwdGlvbnM6IFN1YnNjcmlwdGlvbltdID0gW107XG5cbiAgICAvLyBGb3IgbW92aW5nIHN0YXRlXG4gICAgcHJpdmF0ZSBpc01vdXNlRG93biA9IGZhbHNlO1xuICAgIHByaXZhdGUgcHJldmlvdXNTdGF0ZTogQm9hcmRNb2RlO1xuICAgIHByaXZhdGUgbGFzdFBvc2l0aW9uOiBPcHRpb25hbDxWZWN0b3IyPjtcbiAgICBwcml2YXRlIG1vdmVUYXJnZXQ6IE9wdGlvbmFsPEdlb21ldHJpY09iamVjdD47XG4gICAgcHJpdmF0ZSBtb3ZlU3Vic2NyaXB0aW9uczogU3Vic2NyaXB0aW9uW10gPSBbXTtcblxuICAgIGNvbnN0cnVjdG9yKHByaXZhdGUgYm9hcmQ6IEJvYXJkKSB7fVxuXG4gICAgcHVibGljIGFjdGl2YXRlKCk6IHZvaWQge1xuICAgICAgICBjb25zdCBtb3VzZSA9IHRoaXMuYm9hcmQuY29udHJvbGxlci5tb3VzZTtcblxuICAgICAgICB0aGlzLnN1YnNjcmlwdGlvbnMucHVzaChcbiAgICAgICAgICAgIG1vdXNlLm9uTW91c2VEb3duLmxpc3Rlbih1bmRlZmluZWQsIGUgPT4ge1xuICAgICAgICAgICAgICAgIHRoaXMub25Nb3VzZURvd24oZSk7XG4gICAgICAgICAgICB9KSxcbiAgICAgICAgKTtcbiAgICAgICAgdGhpcy5zdWJzY3JpcHRpb25zLnB1c2goXG4gICAgICAgICAgICBtb3VzZS5vbk1vdXNlVXAubGlzdGVuKHVuZGVmaW5lZCwgZSA9PiB7XG4gICAgICAgICAgICAgICAgdGhpcy5vbk1vdXNlVXAoZSk7XG4gICAgICAgICAgICB9KSxcbiAgICAgICAgKTtcblxuICAgICAgICBjb25zdCBtb2RlID0gdGhpcy5ib2FyZC5jb250cm9sbGVyLm1vZGU7XG5cbiAgICAgICAgdGhpcy5zdWJzY3JpcHRpb25zLnB1c2goXG4gICAgICAgICAgICBtb2RlLm9uRW50ZXIubGlzdGVuKEJvYXJkTW9kZS5Nb3ZpbmcsICgpID0+IHtcbiAgICAgICAgICAgICAgICBzaG93TW92ZUN1cnNvcigpO1xuICAgICAgICAgICAgfSksXG4gICAgICAgICk7XG4gICAgICAgIHRoaXMuc3Vic2NyaXB0aW9ucy5wdXNoKFxuICAgICAgICAgICAgbW9kZS5vbkV4aXQubGlzdGVuKEJvYXJkTW9kZS5Nb3ZpbmcsICgpID0+IHtcbiAgICAgICAgICAgICAgICByZXNldEN1cnNvcigpO1xuICAgICAgICAgICAgfSksXG4gICAgICAgICk7XG4gICAgfVxuXG4gICAgcHVibGljIGRlYWN0aXZhdGUoKTogdm9pZCB7XG4gICAgICAgIHVuc3Vic2NyaWJlQWxsKHRoaXMuc3Vic2NyaXB0aW9ucyk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBvbk1vdXNlRG93bihlOiBNb3VzZURvd25FdmVudCk6IHZvaWQge1xuICAgICAgICBpZiAoIWNhbk1vdmUodGhpcy5ib2FyZC5jb250cm9sbGVyLm1vZGUuc3RhdGUpKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoIUJpbmRpbmcuTW92ZS5tb3VzZVByZXNzKGUpKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBzZWxlY3RhYmxlID0gZ2V0VG9wU2VsZWN0YWJsZU9uRXZlbnRTdGFjayhlLmV2ZW50U3RhY2spO1xuXG4gICAgICAgIGlmIChzZWxlY3RhYmxlID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IHNlbGVjdCA9IHRoaXMuYm9hcmQuY29udHJvbGxlci5zZWxlY3Q7XG5cbiAgICAgICAgaWYgKFxuICAgICAgICAgICAgc2VsZWN0LnNlbGVjdGVkT2JqZWN0cy5oYXMoc2VsZWN0YWJsZS5jb250ZW50KSAmJlxuICAgICAgICAgICAgc2VsZWN0YWJsZS5vcHRpb25zLmNhbk1vdmVcbiAgICAgICAgKSB7XG4gICAgICAgICAgICB0aGlzLmlzTW91c2VEb3duID0gdHJ1ZTtcbiAgICAgICAgICAgIHRoaXMubW92ZVRhcmdldCA9IGUudGFyZ2V0O1xuICAgICAgICAgICAgdGhpcy5sYXN0UG9zaXRpb24gPSBlLnBvc2l0aW9uO1xuXG4gICAgICAgICAgICB0aGlzLm1vdmVTdWJzY3JpcHRpb25zLnB1c2goXG4gICAgICAgICAgICAgICAgdGhpcy5ib2FyZC5jb250cm9sbGVyLm1vdXNlLm9uTW91c2VNb3ZlLmxpc3Rlbih1bmRlZmluZWQsIGUgPT4ge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLm9uTW91c2VNb3ZlKGUpO1xuICAgICAgICAgICAgICAgIH0pLFxuICAgICAgICAgICAgKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHByaXZhdGUgb25Nb3VzZVVwKGU6IE1vdXNlVXBFdmVudCk6IHZvaWQge1xuICAgICAgICBpZiAoIXRoaXMuaXNNb3VzZURvd24pIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuaXNNb3VzZURvd24gPSBmYWxzZTtcblxuICAgICAgICBpZiAodGhpcy5ib2FyZC5jb250cm9sbGVyLm1vZGUuc3RhdGUgPT09IEJvYXJkTW9kZS5Nb3ZpbmcpIHtcbiAgICAgICAgICAgIC8vIFByZXZlbnQgY2xpY2sgb24gcmVsZWFzZSB3aGVuIG11bHRpcGxlIG9iamVjdHMgYXJlIG1vdmVkXG4gICAgICAgICAgICAvLyBPdGhlcndpc2UsIHRoZSBvYmplY3Qgb24gY3Vyc29yIGZvY3VzIGR1cmluZyBtb3ZlbWVudFxuICAgICAgICAgICAgLy8gd291bGQgYmUgc29sZWx5IHNlbGVjdGVkLlxuICAgICAgICAgICAgZS5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcblxuICAgICAgICAgICAgdGhpcy5ib2FyZC5jb250cm9sbGVyLm1vZGUuc3RhdGUgPSB0aGlzLnByZXZpb3VzU3RhdGU7XG4gICAgICAgICAgICB0aGlzLmJvYXJkLmNvbnRyb2xsZXIuZ3VpZGVsaW5lLmNsZWFyKCk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoZS5ldmVudFN0YWNrICYmIGUuZXZlbnRTdGFjay5pbmRleE9mKHRoaXMubW92ZVRhcmdldCkgPj0gMCkge1xuICAgICAgICAgICAgLy8gTW91c2UgdXAgaW5zaWRlIGVsZW1lbnRcbiAgICAgICAgICAgIHNob3dDYW5Nb3ZlQ3Vyc29yKCk7XG4gICAgICAgIH1cblxuICAgICAgICB1bnN1YnNjcmliZUFsbCh0aGlzLm1vdmVTdWJzY3JpcHRpb25zKTtcbiAgICB9XG5cbiAgICBwcml2YXRlIG9uTW91c2VNb3ZlKGU6IE1vdXNlTW92ZUV2ZW50KTogdm9pZCB7XG4gICAgICAgIGlmICghdGhpcy5pc01vdXNlRG93bikge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgcmF3UG9zaXRpb24gPSBlLnBvc2l0aW9uO1xuICAgICAgICBjb25zdCByYXdEZWx0YSA9IHJhd1Bvc2l0aW9uLm1pbnVzKHRoaXMubGFzdFBvc2l0aW9uKTtcblxuICAgICAgICBjb25zdCBtb2RlID0gdGhpcy5ib2FyZC5jb250cm9sbGVyLm1vZGU7XG5cbiAgICAgICAgaWYgKGNhbk1vdmUobW9kZS5zdGF0ZSkgJiYgcmF3RGVsdGEuZXVjbGlkZWFuTm9ybSA+PSBtb3ZlVGhyZXNob2xkKSB7XG4gICAgICAgICAgICB0aGlzLnByZXZpb3VzU3RhdGUgPSBtb2RlLnN0YXRlO1xuICAgICAgICAgICAgbW9kZS5zdGF0ZSA9IEJvYXJkTW9kZS5Nb3Zpbmc7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAobW9kZS5zdGF0ZSA9PT0gQm9hcmRNb2RlLk1vdmluZykge1xuICAgICAgICAgICAgY29uc3QgdG9nZ2xlU25hcCA9IEJpbmRpbmcuVG9nZ2xlR3VpZGVsaW5lU25hcC5tb2RpZmllcnMoZSk7XG4gICAgICAgICAgICBjb25zdCBzbmFwR3VpZGVsaW5lID1cbiAgICAgICAgICAgICAgICB0aGlzLmJvYXJkLmNvbmZpZy5lbmFibGVHdWlkZWxpbmVTbmFwICE9PSB0b2dnbGVTbmFwO1xuXG4gICAgICAgICAgICBsZXQgcG9zaXRpb25EZWx0YTogVmVjdG9yMjtcblxuICAgICAgICAgICAgaWYgKHNuYXBHdWlkZWxpbmUpIHtcbiAgICAgICAgICAgICAgICBjb25zdCBzbmFwRGVsdGEgPSB0aGlzLnVwZGF0ZUd1aWRlbGluZXMocmF3RGVsdGEpO1xuICAgICAgICAgICAgICAgIHBvc2l0aW9uRGVsdGEgPSBzbmFwRGVsdGEgfHwgcmF3RGVsdGE7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHRoaXMuYm9hcmQuY29udHJvbGxlci5ndWlkZWxpbmUuY2xlYXIoKTtcbiAgICAgICAgICAgICAgICBwb3NpdGlvbkRlbHRhID0gcmF3RGVsdGE7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHRoaXMubGFzdFBvc2l0aW9uID0gdGhpcy5sYXN0UG9zaXRpb24ucGx1cyhwb3NpdGlvbkRlbHRhKTtcblxuICAgICAgICAgICAgY29uc3Qgc2VsZWN0ID0gdGhpcy5ib2FyZC5jb250cm9sbGVyLnNlbGVjdDtcbiAgICAgICAgICAgIGNvbnN0IG1vdmFibGVPYmplY3RzID0gWy4uLnNlbGVjdC5zZWxlY3RlZE9iamVjdHNdLmZpbHRlcihcbiAgICAgICAgICAgICAgICBvYmplY3QgPT4gc2VsZWN0LmdldE9wdGlvbnMob2JqZWN0KS5jYW5Nb3ZlLFxuICAgICAgICAgICAgKTtcblxuICAgICAgICAgICAgbW92YWJsZU9iamVjdHMuZm9yRWFjaChvYmplY3QgPT4ge1xuICAgICAgICAgICAgICAgIHRoaXMub25Nb3ZlLmRpc3BhdGNoKFxuICAgICAgICAgICAgICAgICAgICBuZXcgTW92ZU9iamVjdEV2ZW50KHBvc2l0aW9uRGVsdGEsIFtvYmplY3RdKSxcbiAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwcml2YXRlIHVwZGF0ZUd1aWRlbGluZXMocmF3RGVsdGE6IFZlY3RvcjIpOiBPcHRpb25hbDxWZWN0b3IyPiB7XG4gICAgICAgIGNvbnN0IHZpZXdwb3J0ID0gdGhpcy5ib2FyZC52aWV3cG9ydDtcblxuICAgICAgICBjb25zdCBzZWxlY3Rpb24gPSB0aGlzLmJvYXJkLmNvbnRyb2xsZXIuc2VsZWN0LnNlbGVjdGVkT2JqZWN0cztcbiAgICAgICAgY29uc3QgZ3VpZGVsaW5lID0gdGhpcy5ib2FyZC5jb250cm9sbGVyLmd1aWRlbGluZTtcblxuICAgICAgICBjb25zdCB3b3JsZERlbHRhID0gdmlld3BvcnQudG9Xb3JsZFNpemUocmF3RGVsdGEpO1xuXG4gICAgICAgIGNvbnN0IGJiOiBCb3VuZGluZ0JveCA9IGNvbnRhaW5pbmdCb3VuZGluZ0JveChcbiAgICAgICAgICAgIFsuLi5zZWxlY3Rpb25dLm1hcChib2FyZEl0ZW0gPT5cbiAgICAgICAgICAgICAgICByb3RhdGVCb3VuZGluZ0JveChcbiAgICAgICAgICAgICAgICAgICAgYm9hcmRJdGVtLmJvdW5kaW5nQm94KFZpZXdwb3J0LndvcmxkKSxcbiAgICAgICAgICAgICAgICAgICAgYm9hcmRJdGVtLnJhZGlhbnMsXG4gICAgICAgICAgICAgICAgKSxcbiAgICAgICAgICAgICksXG4gICAgICAgICk7XG5cbiAgICAgICAgY29uc3QgYm91bmRhcmllcyA9IFtcbiAgICAgICAgICAgIGJiLnBvc2l0aW9uLFxuICAgICAgICAgICAgYmIucG9zaXRpb24ucGx1cyhiYi5zaXplKSxcbiAgICAgICAgICAgIGJiLnBvc2l0aW9uLnBsdXMoYmIuc2l6ZS5zY2FsZSgwLjUpKSxcbiAgICAgICAgXTtcblxuICAgICAgICBndWlkZWxpbmUuY2xlYXIoKTtcblxuICAgICAgICBjb25zdCBkZWx0YSA9IG5ldyBWZWN0b3IyKFxuICAgICAgICAgICAgdGhpcy5nZXRTbmFwRGVsdGEoYm91bmRhcmllcywgdHJ1ZSwgd29ybGREZWx0YSksXG4gICAgICAgICAgICB0aGlzLmdldFNuYXBEZWx0YShib3VuZGFyaWVzLCBmYWxzZSwgd29ybGREZWx0YSksXG4gICAgICAgICk7XG5cbiAgICAgICAgcmV0dXJuIHZpZXdwb3J0LnRvVmlld3BvcnRTaXplKGRlbHRhKTtcbiAgICB9XG5cbiAgICBwcml2YXRlIGdldFNuYXBEZWx0YShcbiAgICAgICAgYm91bmRhcmllczogVmVjdG9yMltdLFxuICAgICAgICB2ZXJ0aWNhbDogYm9vbGVhbixcbiAgICAgICAgd29ybGREZWx0YTogVmVjdG9yMixcbiAgICApOiBudW1iZXIge1xuICAgICAgICBjb25zdCBndWlkZWxpbmVDdHJsID0gdGhpcy5ib2FyZC5jb250cm9sbGVyLmd1aWRlbGluZTtcblxuICAgICAgICBmb3IgKGNvbnN0IHBvc2l0aW9uIG9mIGJvdW5kYXJpZXMpIHtcbiAgICAgICAgICAgIGNvbnN0IG5ld1Bvc2l0aW9uID0gcG9zaXRpb24ucGx1cyh3b3JsZERlbHRhKTtcbiAgICAgICAgICAgIGNvbnN0IGd1aWRlID0gZ3VpZGVsaW5lQ3RybC5nZXRTbmFwR3VpZGUobmV3UG9zaXRpb24sIHZlcnRpY2FsKTtcblxuICAgICAgICAgICAgaWYgKGd1aWRlICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICBndWlkZWxpbmVDdHJsLnNob3dHdWlkZXMoW2d1aWRlXSk7XG5cbiAgICAgICAgICAgICAgICBjb25zdCBwb3MgPSB2ZXJ0aWNhbCA/IHBvc2l0aW9uLnggOiBwb3NpdGlvbi55O1xuXG4gICAgICAgICAgICAgICAgcmV0dXJuIGd1aWRlLnZhbHVlIC0gcG9zO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHZlcnRpY2FsID8gd29ybGREZWx0YS54IDogd29ybGREZWx0YS55O1xuICAgIH1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHNob3dNb3ZlQ3Vyc29yKCk6IHZvaWQge1xuICAgIHNldEN1cnNvcihtb3ZlQ3Vyc29yKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHNob3dDYW5Nb3ZlQ3Vyc29yKCk6IHZvaWQge1xuICAgIHNldEN1cnNvcihjYW5Nb3ZlQ3Vyc29yKTtcbn1cbiIsImltcG9ydCB0eXBlIHsgQm9hcmQgfSBmcm9tIFwiQGNhbnZhcy9ib2FyZC9Cb2FyZFwiO1xuaW1wb3J0IHsgQm9hcmRNb2RlLCBjYW5SZXNpemUgfSBmcm9tIFwiQGNhbnZhcy9ib2FyZC9jb250cm9sbGVycy9Cb2FyZE1vZGVcIjtcbmltcG9ydCB0eXBlIHtcbiAgICBNb3VzZURvd25FdmVudCxcbiAgICBNb3VzZU1vdmVFdmVudCxcbn0gZnJvbSBcIkBjYW52YXMvYm9hcmQvY29udHJvbGxlcnMvb2JqZWN0cy9Nb3VzZUludGVyYWN0aW9uQ29udHJvbGxlclwiO1xuaW1wb3J0IHsgQW5jaG9yUG9pbnQgfSBmcm9tIFwiQGNhbnZhcy9ib2FyZC9vYmplY3RzL2ZvdW5kYXRpb24vUG9zaXRpb25BbmNob3JcIjtcbmltcG9ydCB0eXBlIHsgR2VvbWV0cmljT2JqZWN0IH0gZnJvbSBcIkBjYW52YXMvYm9hcmQvb2JqZWN0cy9HZW9tZXRyaWNPYmplY3RcIjtcbmltcG9ydCB0eXBlIHsgUmVzaXplSGFuZGxlIH0gZnJvbSBcIkBjYW52YXMvYm9hcmQvb2JqZWN0cy91aS9zZWxlY3RhYmxlL1Jlc2l6ZUhhbmRsZVwiO1xuaW1wb3J0IHsgUmVzaXplSGFuZGxlUG9zaXRpb25pbmcgfSBmcm9tIFwiQGNhbnZhcy9ib2FyZC9vYmplY3RzL3VpL3NlbGVjdGFibGUvUmVzaXplSGFuZGxlXCI7XG5pbXBvcnQgeyByZXNldEN1cnNvciB9IGZyb20gXCJAY2FudmFzL3ByaW1pdGl2ZXMvZG9tXCI7XG5pbXBvcnQgdHlwZSB7IFN1YnNjcmlwdGlvbiB9IGZyb20gXCJAY2FudmFzL3ByaW1pdGl2ZXMvZXZlbnRzXCI7XG5pbXBvcnQge1xuICAgIEV2ZW50QmFzZSxcbiAgICBFdmVudEhhbmRsZXIsXG4gICAgdW5zdWJzY3JpYmVBbGwsXG59IGZyb20gXCJAY2FudmFzL3ByaW1pdGl2ZXMvZXZlbnRzXCI7XG5pbXBvcnQgdHlwZSB7IEJvdW5kaW5nQm94IH0gZnJvbSBcIkBjYW52YXMvcHJpbWl0aXZlcy9zcGFjZVwiO1xuaW1wb3J0IHsgVmVjdG9yMiB9IGZyb20gXCJAY2FudmFzL3ByaW1pdGl2ZXMvc3BhY2VcIjtcbmltcG9ydCB0eXBlIHsgT3B0aW9uYWwgfSBmcm9tIFwiQGNhbnZhcy9wcmltaXRpdmVzL3R5cGVzXCI7XG5pbXBvcnQgdHlwZSB7IE1vZGlmaWVyU3RhdGUgfSBmcm9tIFwiQGNhbnZhcy91dGlscy9pbnB1dC9Nb2RpZmllclN0YXRlXCI7XG5cbmV4cG9ydCBjbGFzcyBSZXNpemVPYmplY3RFdmVudCBleHRlbmRzIEV2ZW50QmFzZTxHZW9tZXRyaWNPYmplY3Q+IHtcbiAgICBjb25zdHJ1Y3RvcihcbiAgICAgICAgcmVhZG9ubHkgc2l6ZTogVmVjdG9yMixcbiAgICAgICAgcmVhZG9ubHkgZml4dHVyZTogQW5jaG9yUG9pbnQsXG4gICAgICAgIHJlYWRvbmx5IG1vZGlmaWVyczogTW9kaWZpZXJTdGF0ZSxcbiAgICAgICAgZXZlbnRTdGFjaz86IEdlb21ldHJpY09iamVjdFtdLFxuICAgICkge1xuICAgICAgICBzdXBlcihldmVudFN0YWNrKTtcbiAgICB9XG59XG5cbmV4cG9ydCBjbGFzcyBSZXNpemVPYmplY3RDb250cm9sbGVyIHtcbiAgICByZWFkb25seSBvblJlc2l6ZSA9IG5ldyBFdmVudEhhbmRsZXI8UmVzaXplT2JqZWN0RXZlbnQ+KCk7XG5cbiAgICBwcml2YXRlIHN1YnNjcmlwdGlvbnM6IFN1YnNjcmlwdGlvbltdID0gW107XG4gICAgcHJpdmF0ZSByZXNpemVTdWJzY3JpcHRpb25zOiBTdWJzY3JpcHRpb25bXSA9IFtdO1xuICAgIHByaXZhdGUgcHJldmlvdXNTdGF0ZTogQm9hcmRNb2RlO1xuICAgIHByaXZhdGUgcmVzaXplSGFuZGxlOiBPcHRpb25hbDxSZXNpemVIYW5kbGU+ID0gdW5kZWZpbmVkO1xuXG4gICAgY29uc3RydWN0b3IocmVhZG9ubHkgYm9hcmQ6IEJvYXJkKSB7fVxuXG4gICAgcHVibGljIGFjdGl2YXRlKCk6IHZvaWQge1xuICAgICAgICBjb25zdCBtb2RlID0gdGhpcy5ib2FyZC5jb250cm9sbGVyLm1vZGU7XG5cbiAgICAgICAgdGhpcy5zdWJzY3JpcHRpb25zLnB1c2goXG4gICAgICAgICAgICBtb2RlLm9uRW50ZXIubGlzdGVuKEJvYXJkTW9kZS5SZXNpemluZywgKCkgPT4ge1xuICAgICAgICAgICAgICAgIHRoaXMuZW50ZXJSZXNpemluZygpO1xuICAgICAgICAgICAgfSksXG4gICAgICAgICk7XG4gICAgICAgIHRoaXMuc3Vic2NyaXB0aW9ucy5wdXNoKFxuICAgICAgICAgICAgbW9kZS5vbkV4aXQubGlzdGVuKEJvYXJkTW9kZS5SZXNpemluZywgKCkgPT4ge1xuICAgICAgICAgICAgICAgIHRoaXMuZXhpdFJlc2l6aW5nKCk7XG4gICAgICAgICAgICB9KSxcbiAgICAgICAgKTtcbiAgICB9XG5cbiAgICBwdWJsaWMgZGVhY3RpdmF0ZSgpOiB2b2lkIHtcbiAgICAgICAgdW5zdWJzY3JpYmVBbGwodGhpcy5yZXNpemVTdWJzY3JpcHRpb25zKTtcbiAgICB9XG5cbiAgICBwdWJsaWMgc3RhcnRSZXNpemluZyhlOiBNb3VzZURvd25FdmVudCk6IHZvaWQge1xuICAgICAgICBjb25zdCBtb2RlID0gdGhpcy5ib2FyZC5jb250cm9sbGVyLm1vZGU7XG5cbiAgICAgICAgaWYgKCFjYW5SZXNpemUobW9kZS5zdGF0ZSkpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMucmVzaXplSGFuZGxlID0gPFJlc2l6ZUhhbmRsZT5lLnRhcmdldDtcblxuICAgICAgICB0aGlzLnByZXZpb3VzU3RhdGUgPSBtb2RlLnN0YXRlO1xuICAgICAgICB0aGlzLmJvYXJkLmNvbnRyb2xsZXIubW9kZS5zdGF0ZSA9IEJvYXJkTW9kZS5SZXNpemluZztcbiAgICB9XG5cbiAgICBwcml2YXRlIGVudGVyUmVzaXppbmcoKTogdm9pZCB7XG4gICAgICAgIHRoaXMucmVzaXplSGFuZGxlLnNob3dSZXNpemluZ0N1cnNvcigpO1xuXG4gICAgICAgIGNvbnN0IG1vdXNlID0gdGhpcy5ib2FyZC5jb250cm9sbGVyLm1vdXNlO1xuXG4gICAgICAgIHRoaXMucmVzaXplU3Vic2NyaXB0aW9ucy5wdXNoKFxuICAgICAgICAgICAgbW91c2Uub25Nb3VzZVVwLmxpc3Rlbih1bmRlZmluZWQsICgpID0+IHtcbiAgICAgICAgICAgICAgICB0aGlzLmJvYXJkLmNvbnRyb2xsZXIubW9kZS5zdGF0ZSA9IHRoaXMucHJldmlvdXNTdGF0ZTtcbiAgICAgICAgICAgIH0pLFxuICAgICAgICApO1xuICAgICAgICB0aGlzLnJlc2l6ZVN1YnNjcmlwdGlvbnMucHVzaChcbiAgICAgICAgICAgIG1vdXNlLm9uTW91c2VNb3ZlLmxpc3Rlbih1bmRlZmluZWQsIGUgPT4ge1xuICAgICAgICAgICAgICAgIHRoaXMub25SZXNpemVNb3ZlKGUpO1xuICAgICAgICAgICAgfSksXG4gICAgICAgICk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBleGl0UmVzaXppbmcoKTogdm9pZCB7XG4gICAgICAgIHRoaXMucmVzaXplSGFuZGxlID0gdW5kZWZpbmVkO1xuICAgICAgICByZXNldEN1cnNvcigpO1xuICAgICAgICB1bnN1YnNjcmliZUFsbCh0aGlzLnJlc2l6ZVN1YnNjcmlwdGlvbnMpO1xuICAgIH1cblxuICAgIHByaXZhdGUgb25SZXNpemVNb3ZlKGU6IE1vdXNlTW92ZUV2ZW50KTogdm9pZCB7XG4gICAgICAgIGlmICh0aGlzLmJvYXJkLmNvbnRyb2xsZXIubW9kZS5zdGF0ZSAhPT0gQm9hcmRNb2RlLlJlc2l6aW5nKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLnJlc2l6ZUhhbmRsZT8uc2hvd1Jlc2l6aW5nQ3Vyc29yKCk7XG5cbiAgICAgICAgY29uc3Qgc2l6ZSA9IHRoaXMuZ2V0UmVzaXNlU2l6ZShlLnBvc2l0aW9uKTtcbiAgICAgICAgY29uc3QgZml4dHVyZSA9IHRoaXMuZ2V0UmVzaXplRml4dHVyZSgpO1xuICAgICAgICBjb25zdCBjb250ZW50ID0gdGhpcy5yZXNpemVIYW5kbGUuZnJhbWUub3ZlcmxheS5zZWxlY3RhYmxlLmNvbnRlbnQ7XG5cbiAgICAgICAgdGhpcy5vblJlc2l6ZS5kaXNwYXRjaChcbiAgICAgICAgICAgIG5ldyBSZXNpemVPYmplY3RFdmVudChzaXplLCBmaXh0dXJlLCBlLm1vZGlmaWVycywgW2NvbnRlbnRdKSxcbiAgICAgICAgKTtcbiAgICB9XG5cbiAgICBwcml2YXRlIGdldFJlc2l6ZUZpeHR1cmUoKTogQW5jaG9yUG9pbnQge1xuICAgICAgICBzd2l0Y2ggKHRoaXMucmVzaXplSGFuZGxlLnBvc2l0aW9uaW5nKSB7XG4gICAgICAgICAgICBjYXNlIFJlc2l6ZUhhbmRsZVBvc2l0aW9uaW5nLlRvcExlZnQ6XG4gICAgICAgICAgICBjYXNlIFJlc2l6ZUhhbmRsZVBvc2l0aW9uaW5nLlRvcENlbnRlcjpcbiAgICAgICAgICAgIGNhc2UgUmVzaXplSGFuZGxlUG9zaXRpb25pbmcuTWlkZGxlTGVmdDpcbiAgICAgICAgICAgICAgICByZXR1cm4gQW5jaG9yUG9pbnQuQm90dG9tUmlnaHQ7XG4gICAgICAgICAgICBjYXNlIFJlc2l6ZUhhbmRsZVBvc2l0aW9uaW5nLk1pZGRsZVJpZ2h0OlxuICAgICAgICAgICAgY2FzZSBSZXNpemVIYW5kbGVQb3NpdGlvbmluZy5Cb3R0b21SaWdodDpcbiAgICAgICAgICAgIGNhc2UgUmVzaXplSGFuZGxlUG9zaXRpb25pbmcuQm90dG9tQ2VudGVyOlxuICAgICAgICAgICAgICAgIHJldHVybiBBbmNob3JQb2ludC5Ub3BMZWZ0O1xuICAgICAgICAgICAgY2FzZSBSZXNpemVIYW5kbGVQb3NpdGlvbmluZy5Cb3R0b21MZWZ0OlxuICAgICAgICAgICAgICAgIHJldHVybiBBbmNob3JQb2ludC5Ub3BSaWdodDtcbiAgICAgICAgICAgIGNhc2UgUmVzaXplSGFuZGxlUG9zaXRpb25pbmcuVG9wUmlnaHQ6XG4gICAgICAgICAgICAgICAgcmV0dXJuIEFuY2hvclBvaW50LkJvdHRvbUxlZnQ7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwcml2YXRlIGdldFJlc2lzZVNpemUobW91c2VQb3NpdGlvbjogVmVjdG9yMik6IFZlY3RvcjIge1xuICAgICAgICBjb25zdCB2aWV3cG9ydCA9IHRoaXMuYm9hcmQudmlld3BvcnQ7XG4gICAgICAgIGNvbnN0IGNvbnRlbnQgPSB0aGlzLnJlc2l6ZUhhbmRsZS5mcmFtZS5vdmVybGF5LnNlbGVjdGFibGUuY29udGVudDtcbiAgICAgICAgY29uc3QgY29udGVudEJveCA9IGNvbnRlbnQuYm91bmRpbmdCb3godmlld3BvcnQpO1xuICAgICAgICBjb25zdCB0b3BMZWZ0ID0gY29udGVudEJveC5wb3NpdGlvbjtcbiAgICAgICAgY29uc3QgYm90dG9tUmlnaHQgPSBjb250ZW50Qm94LnBvc2l0aW9uLnBsdXMoY29udGVudEJveC5zaXplKTtcblxuICAgICAgICBtb3VzZVBvc2l0aW9uID0gbW91c2VQb3NpdGlvbi5yb3RhdGUoXG4gICAgICAgICAgICAtY29udGVudC5yYWRpYW5zLFxuICAgICAgICAgICAgdmlld3BvcnQudG9WaWV3cG9ydFBvc2l0aW9uKGNvbnRlbnQucm90YXRpb25Bcm91bmQpLFxuICAgICAgICApO1xuXG4gICAgICAgIGxldCB3aWR0aCA9IGNvbnRlbnRCb3guc2l6ZS54O1xuICAgICAgICBsZXQgaGVpZ2h0ID0gY29udGVudEJveC5zaXplLnk7XG5cbiAgICAgICAgLy8gV2lkdGhcbiAgICAgICAgc3dpdGNoICh0aGlzLnJlc2l6ZUhhbmRsZS5wb3NpdGlvbmluZykge1xuICAgICAgICAgICAgY2FzZSBSZXNpemVIYW5kbGVQb3NpdGlvbmluZy5Ub3BMZWZ0OlxuICAgICAgICAgICAgY2FzZSBSZXNpemVIYW5kbGVQb3NpdGlvbmluZy5Cb3R0b21MZWZ0OlxuICAgICAgICAgICAgY2FzZSBSZXNpemVIYW5kbGVQb3NpdGlvbmluZy5NaWRkbGVMZWZ0OlxuICAgICAgICAgICAgICAgIHdpZHRoICs9IHRvcExlZnQueCAtIG1vdXNlUG9zaXRpb24ueDtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgUmVzaXplSGFuZGxlUG9zaXRpb25pbmcuVG9wUmlnaHQ6XG4gICAgICAgICAgICBjYXNlIFJlc2l6ZUhhbmRsZVBvc2l0aW9uaW5nLk1pZGRsZVJpZ2h0OlxuICAgICAgICAgICAgY2FzZSBSZXNpemVIYW5kbGVQb3NpdGlvbmluZy5Cb3R0b21SaWdodDpcbiAgICAgICAgICAgICAgICB3aWR0aCArPSAtYm90dG9tUmlnaHQueCArIG1vdXNlUG9zaXRpb24ueDtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIEhlaWdodFxuICAgICAgICBzd2l0Y2ggKHRoaXMucmVzaXplSGFuZGxlLnBvc2l0aW9uaW5nKSB7XG4gICAgICAgICAgICBjYXNlIFJlc2l6ZUhhbmRsZVBvc2l0aW9uaW5nLlRvcExlZnQ6XG4gICAgICAgICAgICBjYXNlIFJlc2l6ZUhhbmRsZVBvc2l0aW9uaW5nLlRvcENlbnRlcjpcbiAgICAgICAgICAgIGNhc2UgUmVzaXplSGFuZGxlUG9zaXRpb25pbmcuVG9wUmlnaHQ6XG4gICAgICAgICAgICAgICAgaGVpZ2h0ICs9IHRvcExlZnQueSAtIG1vdXNlUG9zaXRpb24ueTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgUmVzaXplSGFuZGxlUG9zaXRpb25pbmcuQm90dG9tUmlnaHQ6XG4gICAgICAgICAgICBjYXNlIFJlc2l6ZUhhbmRsZVBvc2l0aW9uaW5nLkJvdHRvbUNlbnRlcjpcbiAgICAgICAgICAgIGNhc2UgUmVzaXplSGFuZGxlUG9zaXRpb25pbmcuQm90dG9tTGVmdDpcbiAgICAgICAgICAgICAgICBoZWlnaHQgKz0gLWJvdHRvbVJpZ2h0LnkgKyBtb3VzZVBvc2l0aW9uLnk7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gbmV3IFZlY3RvcjIod2lkdGgsIGhlaWdodCk7XG4gICAgfVxufVxuXG5mdW5jdGlvbiByZXNpemVQb3NpdGlvbihcbiAgICBvcmlnaW5hbDogQm91bmRpbmdCb3gsXG4gICAgc2l6ZTogVmVjdG9yMixcbiAgICBmaXh0dXJlOiBBbmNob3JQb2ludCxcbik6IFZlY3RvcjIge1xuICAgIHN3aXRjaCAoZml4dHVyZSkge1xuICAgICAgICBjYXNlIEFuY2hvclBvaW50LlRvcExlZnQ6XG4gICAgICAgICAgICByZXR1cm4gb3JpZ2luYWwucG9zaXRpb247XG4gICAgICAgIGNhc2UgQW5jaG9yUG9pbnQuVG9wUmlnaHQ6XG4gICAgICAgICAgICByZXR1cm4gbmV3IFZlY3RvcjIoXG4gICAgICAgICAgICAgICAgb3JpZ2luYWwucG9zaXRpb24ueCArIG9yaWdpbmFsLnNpemUueCAtIHNpemUueCxcbiAgICAgICAgICAgICAgICBvcmlnaW5hbC5wb3NpdGlvbi55LFxuICAgICAgICAgICAgKTtcbiAgICAgICAgY2FzZSBBbmNob3JQb2ludC5Cb3R0b21SaWdodDpcbiAgICAgICAgICAgIHJldHVybiBuZXcgVmVjdG9yMihcbiAgICAgICAgICAgICAgICBvcmlnaW5hbC5wb3NpdGlvbi54ICsgb3JpZ2luYWwuc2l6ZS54IC0gc2l6ZS54LFxuICAgICAgICAgICAgICAgIG9yaWdpbmFsLnBvc2l0aW9uLnkgKyBvcmlnaW5hbC5zaXplLnkgLSBzaXplLnksXG4gICAgICAgICAgICApO1xuICAgICAgICBjYXNlIEFuY2hvclBvaW50LkJvdHRvbUxlZnQ6XG4gICAgICAgICAgICByZXR1cm4gbmV3IFZlY3RvcjIoXG4gICAgICAgICAgICAgICAgb3JpZ2luYWwucG9zaXRpb24ueCxcbiAgICAgICAgICAgICAgICBvcmlnaW5hbC5wb3NpdGlvbi55ICsgb3JpZ2luYWwuc2l6ZS55IC0gc2l6ZS55LFxuICAgICAgICAgICAgKTtcbiAgICB9XG59XG5cbmV4cG9ydCBmdW5jdGlvbiB3b3JsZFNwYWNlUmVzaXplKFxuICAgIHdvcmxkU2l6ZTogVmVjdG9yMixcbiAgICBmaXh0dXJlOiBBbmNob3JQb2ludCxcbiAgICB3b3JsZE9yaWdpbmFsOiBCb3VuZGluZ0JveCxcbiAgICByYWRpYW5zOiBudW1iZXIsXG4pOiBbVmVjdG9yMiwgVmVjdG9yMl0ge1xuICAgIGNvbnN0IHdvcmxkUG9zaXRpb24gPSByZXNpemVQb3NpdGlvbih3b3JsZE9yaWdpbmFsLCB3b3JsZFNpemUsIGZpeHR1cmUpO1xuXG4gICAgaWYgKHJhZGlhbnMgIT0gMCkge1xuICAgICAgICAvLyBPYmplY3QgaXMgcm90YXRlZC5cbiAgICAgICAgLy8gV2hlbiByZXNpemluZywgdGhlIGNlbnRlciBwb2ludCBvZiB0aGUgb2JqZWN0IGNoYW5nZXMuXG4gICAgICAgIC8vIFRvIGtlZXAgYWxsIHVuY2hhbmdlZCBjb3JuZXJzIGluIHRoZWlyIG9yaWdpbmFsIHBvc2l0aW9uLFxuICAgICAgICAvLyBzb21lIGFkanVzdG1lbmRzIG5lZWQgdG8gYmUgZG9uZS5cblxuICAgICAgICAvLyBPbGQgY2VudGVyIHBvaW50XG4gICAgICAgIGNvbnN0IGNlbnRlciA9IHdvcmxkT3JpZ2luYWwuY2VudGVyKCk7XG5cbiAgICAgICAgLy8gUm90YXRlZCBuZXcgbGVmdCB0b3AgcG9pbnQgd2l0aCBvbGQgY2VudGVyIHBvaW50XG4gICAgICAgIGNvbnN0IHRvcExlZnQgPSB3b3JsZFBvc2l0aW9uLnJvdGF0ZShyYWRpYW5zLCBjZW50ZXIpO1xuXG4gICAgICAgIC8vIFJvdGF0ZWQgbmV3IGJvdHRvbSByaWdodCBwb2ludCB3aXRoIG9sZCBjZW50ZXIgcG9pbnRcbiAgICAgICAgY29uc3QgYm90dG9tUmlnaHQgPSB3b3JsZFBvc2l0aW9uXG4gICAgICAgICAgICAucGx1cyh3b3JsZFNpemUpXG4gICAgICAgICAgICAucm90YXRlKHJhZGlhbnMsIGNlbnRlcik7XG5cbiAgICAgICAgLy8gTmV3IGNlbnRlciBwb2ludCBpcyBjZW50ZXIgYmV0d2VlbiB0aGVzZSBuZXcgcG9pbnRzXG4gICAgICAgIGNvbnN0IG5ld0NlbnRlciA9IHRvcExlZnQucGx1cyhib3R0b21SaWdodCkuc2NhbGUoMC41KTtcblxuICAgICAgICAvLyBOZXcgdG9wLWxlZnQgcG9zaXRpb24gaXMgd2hhdCB5b3UgbmVlZCB0byBwbHVnIGludG8gdGhlIHJvdGF0aW9uXG4gICAgICAgIC8vIHdpdGggbmV3Q2VudGVyIHRvIGdldCB0byB0b3BMZWZ0LlxuICAgICAgICAvLyBUbyBnZXQgdGhpcyBwb3NpdGlvbiwgcmV2ZXJzZSB0aGUgcm90YXRpb24gZnJvbSBlYXJsaWVyLFxuICAgICAgICAvLyBidXQgbm90IGFyb3VuZCBjZW50ZXIsIGJ1dCBhcm91bmQgbmV3Q2VudGVyXG4gICAgICAgIGNvbnN0IG5ld1Bvc2l0aW9uID0gdG9wTGVmdC5yb3RhdGUoLXJhZGlhbnMsIG5ld0NlbnRlcik7XG5cbiAgICAgICAgcmV0dXJuIFtuZXdQb3NpdGlvbiwgd29ybGRTaXplXTtcbiAgICB9XG5cbiAgICByZXR1cm4gW3dvcmxkUG9zaXRpb24sIHdvcmxkU2l6ZV07XG59XG4iLCJpbXBvcnQgdHlwZSB7IEJvYXJkIH0gZnJvbSBcIkBjYW52YXMvYm9hcmQvQm9hcmRcIjtcbmltcG9ydCB7IEJvYXJkTW9kZSwgY2FuUm90YXRlIH0gZnJvbSBcIkBjYW52YXMvYm9hcmQvY29udHJvbGxlcnMvQm9hcmRNb2RlXCI7XG5pbXBvcnQgdHlwZSB7XG4gICAgTW91c2VEb3duRXZlbnQsXG4gICAgTW91c2VNb3ZlRXZlbnQsXG59IGZyb20gXCJAY2FudmFzL2JvYXJkL2NvbnRyb2xsZXJzL29iamVjdHMvTW91c2VJbnRlcmFjdGlvbkNvbnRyb2xsZXJcIjtcbmltcG9ydCB0eXBlIHsgR2VvbWV0cmljT2JqZWN0IH0gZnJvbSBcIkBjYW52YXMvYm9hcmQvb2JqZWN0cy9HZW9tZXRyaWNPYmplY3RcIjtcbmltcG9ydCB0eXBlIHsgQm9hcmRJdGVtIH0gZnJvbSBcIkBjYW52YXMvYm9hcmQvb2JqZWN0cy9pdGVtcy9Cb2FyZEl0ZW1cIjtcbmltcG9ydCB7IHJlc2V0Q3Vyc29yLCBzZXRDdXJzb3IgfSBmcm9tIFwiQGNhbnZhcy9wcmltaXRpdmVzL2RvbVwiO1xuaW1wb3J0IHR5cGUgeyBTdWJzY3JpcHRpb24gfSBmcm9tIFwiQGNhbnZhcy9wcmltaXRpdmVzL2V2ZW50c1wiO1xuaW1wb3J0IHtcbiAgICBFdmVudEJhc2UsXG4gICAgRXZlbnRIYW5kbGVyLFxuICAgIHVuc3Vic2NyaWJlQWxsLFxufSBmcm9tIFwiQGNhbnZhcy9wcmltaXRpdmVzL2V2ZW50c1wiO1xuaW1wb3J0IHR5cGUgeyBWZWN0b3IyIH0gZnJvbSBcIkBjYW52YXMvcHJpbWl0aXZlcy9zcGFjZVwiO1xuaW1wb3J0IHsgQmluZGluZyB9IGZyb20gXCJAY29uZmlnL2JpbmRpbmdzXCI7XG5pbXBvcnQgeyByb3RhdGVTdGVwU2l6ZSB9IGZyb20gXCJAY29uZmlnL2ludGVyYWN0aW9uXCI7XG5cbmV4cG9ydCBjbGFzcyBSb3RhdGVPYmplY3RFdmVudCBleHRlbmRzIEV2ZW50QmFzZTxHZW9tZXRyaWNPYmplY3Q+IHtcbiAgICBjb25zdHJ1Y3RvcihyZWFkb25seSByYWRpYW5zOiBudW1iZXIsIGV2ZW50U3RhY2s/OiBHZW9tZXRyaWNPYmplY3RbXSkge1xuICAgICAgICBzdXBlcihldmVudFN0YWNrKTtcbiAgICB9XG59XG5cbmV4cG9ydCBjbGFzcyBSb3RhdGVPYmplY3RDb250cm9sbGVyIHtcbiAgICByZWFkb25seSBvblJvdGF0ZSA9IG5ldyBFdmVudEhhbmRsZXI8Um90YXRlT2JqZWN0RXZlbnQ+KCk7XG5cbiAgICBwcml2YXRlIHN1YnNjcmlwdGlvbnM6IFN1YnNjcmlwdGlvbltdID0gW107XG4gICAgcHJpdmF0ZSByb3RhdGVTdWJzY3JpcHRpb25zOiBTdWJzY3JpcHRpb25bXSA9IFtdO1xuICAgIHByaXZhdGUgcHJldmlvdXNTdGF0ZTogQm9hcmRNb2RlO1xuICAgIHByaXZhdGUgcm90YXRpb25DZW50ZXI6IFZlY3RvcjI7XG4gICAgcHJpdmF0ZSBzdGFydEN1cnNvclJhZGlhbnM6IG51bWJlcjtcbiAgICBwcml2YXRlIHN0YXJ0T2JqZWN0UmFkaWFuczogbnVtYmVyO1xuXG4gICAgY29uc3RydWN0b3IocmVhZG9ubHkgYm9hcmQ6IEJvYXJkKSB7fVxuXG4gICAgcHVibGljIGFjdGl2YXRlKCk6IHZvaWQge1xuICAgICAgICBjb25zdCBtb2RlID0gdGhpcy5ib2FyZC5jb250cm9sbGVyLm1vZGU7XG5cbiAgICAgICAgdGhpcy5zdWJzY3JpcHRpb25zLnB1c2goXG4gICAgICAgICAgICBtb2RlLm9uRW50ZXIubGlzdGVuKEJvYXJkTW9kZS5Sb3RhdGluZywgKCkgPT4ge1xuICAgICAgICAgICAgICAgIHRoaXMuZW50ZXJSb3RhdGluZygpO1xuICAgICAgICAgICAgfSksXG4gICAgICAgICk7XG4gICAgICAgIHRoaXMuc3Vic2NyaXB0aW9ucy5wdXNoKFxuICAgICAgICAgICAgbW9kZS5vbkV4aXQubGlzdGVuKEJvYXJkTW9kZS5Sb3RhdGluZywgKCkgPT4ge1xuICAgICAgICAgICAgICAgIHRoaXMuZXhpdFJvdGF0aW5nKCk7XG4gICAgICAgICAgICB9KSxcbiAgICAgICAgKTtcbiAgICB9XG5cbiAgICBwdWJsaWMgZGVhY3RpdmF0ZSgpOiB2b2lkIHtcbiAgICAgICAgdW5zdWJzY3JpYmVBbGwodGhpcy5yb3RhdGVTdWJzY3JpcHRpb25zKTtcbiAgICAgICAgdW5zdWJzY3JpYmVBbGwodGhpcy5zdWJzY3JpcHRpb25zKTtcbiAgICB9XG5cbiAgICBwdWJsaWMgc3RhcnRSb3RhdGluZyhlOiBNb3VzZURvd25FdmVudCwgdGFyZ2V0OiBCb2FyZEl0ZW0pOiB2b2lkIHtcbiAgICAgICAgY29uc3QgbW9kZSA9IHRoaXMuYm9hcmQuY29udHJvbGxlci5tb2RlO1xuXG4gICAgICAgIGlmICghY2FuUm90YXRlKG1vZGUuc3RhdGUpKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLnJvdGF0aW9uQ2VudGVyID0gdGFyZ2V0LmJvdW5kaW5nQm94KHRoaXMuYm9hcmQudmlld3BvcnQpLmNlbnRlcigpO1xuICAgICAgICB0aGlzLnN0YXJ0Q3Vyc29yUmFkaWFucyA9IHJlbGF0aXZlUmFkaWFucyhcbiAgICAgICAgICAgIGUucG9zaXRpb24sXG4gICAgICAgICAgICB0aGlzLnJvdGF0aW9uQ2VudGVyLFxuICAgICAgICApO1xuICAgICAgICB0aGlzLnN0YXJ0T2JqZWN0UmFkaWFucyA9IHRhcmdldC5yYWRpYW5zO1xuXG4gICAgICAgIHRoaXMucHJldmlvdXNTdGF0ZSA9IG1vZGUuc3RhdGU7XG4gICAgICAgIG1vZGUuc3RhdGUgPSBCb2FyZE1vZGUuUm90YXRpbmc7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBlbnRlclJvdGF0aW5nKCk6IHZvaWQge1xuICAgICAgICBjb25zdCBtb2RlID0gdGhpcy5ib2FyZC5jb250cm9sbGVyLm1vZGU7XG4gICAgICAgIGNvbnN0IG1vdXNlID0gdGhpcy5ib2FyZC5jb250cm9sbGVyLm1vdXNlO1xuXG4gICAgICAgIHRoaXMucm90YXRlU3Vic2NyaXB0aW9ucy5wdXNoKFxuICAgICAgICAgICAgbW91c2Uub25Nb3VzZVVwLmxpc3Rlbih1bmRlZmluZWQsICgpID0+IHtcbiAgICAgICAgICAgICAgICBpZiAobW9kZS5zdGF0ZSA9PT0gQm9hcmRNb2RlLlJvdGF0aW5nKSB7XG4gICAgICAgICAgICAgICAgICAgIG1vZGUuc3RhdGUgPSB0aGlzLnByZXZpb3VzU3RhdGU7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSksXG4gICAgICAgICk7XG4gICAgICAgIHRoaXMucm90YXRlU3Vic2NyaXB0aW9ucy5wdXNoKFxuICAgICAgICAgICAgbW91c2Uub25Nb3VzZU1vdmUubGlzdGVuKHVuZGVmaW5lZCwgZSA9PiB7XG4gICAgICAgICAgICAgICAgdGhpcy5vblJlc2l6ZU1vdmUoZSk7XG4gICAgICAgICAgICB9KSxcbiAgICAgICAgKTtcblxuICAgICAgICBzaG93Um90YXRlQ3Vyc29yKCk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBleGl0Um90YXRpbmcoKTogdm9pZCB7XG4gICAgICAgIHVuc3Vic2NyaWJlQWxsKHRoaXMucm90YXRlU3Vic2NyaXB0aW9ucyk7XG4gICAgICAgIHJlc2V0Q3Vyc29yKCk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBvblJlc2l6ZU1vdmUoZTogTW91c2VNb3ZlRXZlbnQpOiB2b2lkIHtcbiAgICAgICAgY29uc3QgbW9kZSA9IHRoaXMuYm9hcmQuY29udHJvbGxlci5tb2RlO1xuXG4gICAgICAgIGlmIChtb2RlLnN0YXRlICE9PSBCb2FyZE1vZGUuUm90YXRpbmcpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IG5ld0N1cnNvclJhZGlhbnMgPSByZWxhdGl2ZVJhZGlhbnMoXG4gICAgICAgICAgICBlLnBvc2l0aW9uLFxuICAgICAgICAgICAgdGhpcy5yb3RhdGlvbkNlbnRlcixcbiAgICAgICAgKTtcbiAgICAgICAgbGV0IG5ld09iamVjdFJhZGlhbnMgPVxuICAgICAgICAgICAgbmV3Q3Vyc29yUmFkaWFucyAtXG4gICAgICAgICAgICB0aGlzLnN0YXJ0Q3Vyc29yUmFkaWFucyArXG4gICAgICAgICAgICB0aGlzLnN0YXJ0T2JqZWN0UmFkaWFucztcblxuICAgICAgICBpZiAoQmluZGluZy5Sb3RhdGVTdGVwLm1vZGlmaWVycyhlKSkge1xuICAgICAgICAgICAgbmV3T2JqZWN0UmFkaWFucyA9XG4gICAgICAgICAgICAgICAgTWF0aC5yb3VuZChuZXdPYmplY3RSYWRpYW5zIC8gcm90YXRlU3RlcFNpemUpICogcm90YXRlU3RlcFNpemU7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLmJvYXJkLmNvbnRyb2xsZXIuc2VsZWN0LnNlbGVjdGVkT2JqZWN0cy5mb3JFYWNoKG9iamVjdCA9PiB7XG4gICAgICAgICAgICB0aGlzLm9uUm90YXRlLmRpc3BhdGNoKFxuICAgICAgICAgICAgICAgIG5ldyBSb3RhdGVPYmplY3RFdmVudChuZXdPYmplY3RSYWRpYW5zLCBbb2JqZWN0XSksXG4gICAgICAgICAgICApO1xuICAgICAgICB9KTtcbiAgICB9XG59XG5cbmZ1bmN0aW9uIHJlbGF0aXZlUmFkaWFucyhjdXJzb3JQb3NpdGlvbjogVmVjdG9yMiwgY2VudGVyOiBWZWN0b3IyKTogbnVtYmVyIHtcbiAgICBjb25zdCB2ID0gY3Vyc29yUG9zaXRpb24ubWludXMoY2VudGVyKTtcbiAgICByZXR1cm4gTWF0aC5hdGFuMih2LnksIHYueCk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBzaG93Um90YXRlQ3Vyc29yKCk6IHZvaWQge1xuICAgIC8vIFRPRE86IG1ha2UgdGhpcyBhbiBpbWFnZSAoZGlzYWJsZSBjdXJzb3IgYW5kIHJlbmRlciBjdXN0b20gb2JqZWN0KVxuICAgIHNldEN1cnNvcihcImFsaWFzXCIpO1xufVxuIiwiaW1wb3J0IFwiQGV4dC9TZXRcIjtcblxuaW1wb3J0IHR5cGUgeyBCb2FyZCB9IGZyb20gXCJAY2FudmFzL2JvYXJkL0JvYXJkXCI7XG5pbXBvcnQgeyBCb2FyZE1vZGUgfSBmcm9tIFwiQGNhbnZhcy9ib2FyZC9jb250cm9sbGVycy9Cb2FyZE1vZGVcIjtcbmltcG9ydCB0eXBlIHtcbiAgICBEZXNlbGVjdE9iamVjdEV2ZW50LFxuICAgIFNlbGVjdE9iamVjdEV2ZW50LFxufSBmcm9tIFwiQGNhbnZhcy9ib2FyZC9jb250cm9sbGVycy9vYmplY3RzL1NlbGVjdE9iamVjdENvbnRyb2xsZXJcIjtcbmltcG9ydCB0eXBlIHsgR3JvdXAgfSBmcm9tIFwiQGNhbnZhcy9ib2FyZC9vYmplY3RzL2ZvdW5kYXRpb24vR3JvdXBcIjtcbmltcG9ydCB0eXBlIHsgR2VvbWV0cmljT2JqZWN0IH0gZnJvbSBcIkBjYW52YXMvYm9hcmQvb2JqZWN0cy9HZW9tZXRyaWNPYmplY3RcIjtcbmltcG9ydCB0eXBlIHsgQm9hcmRJdGVtIH0gZnJvbSBcIkBjYW52YXMvYm9hcmQvb2JqZWN0cy9pdGVtcy9Cb2FyZEl0ZW1cIjtcbmltcG9ydCB0eXBlIHtcbiAgICBTZWxlY3RhYmxlLFxuICAgIFNlbGVjdGlvbk9wdGlvbnMsXG59IGZyb20gXCJAY2FudmFzL2JvYXJkL29iamVjdHMvdWkvc2VsZWN0YWJsZS9TZWxlY3RhYmxlXCI7XG5pbXBvcnQgeyBTZWxlY3RCb3hGcmFtZSB9IGZyb20gXCJAY2FudmFzL2JvYXJkL29iamVjdHMvdWkvU2VsZWN0Qm94RnJhbWVcIjtcbmltcG9ydCB0eXBlIHsgU3Vic2NyaXB0aW9uIH0gZnJvbSBcIkBjYW52YXMvcHJpbWl0aXZlcy9ldmVudHNcIjtcbmltcG9ydCB7IEV2ZW50SGFuZGxlciwgdW5zdWJzY3JpYmVBbGwgfSBmcm9tIFwiQGNhbnZhcy9wcmltaXRpdmVzL2V2ZW50c1wiO1xuaW1wb3J0IHtcbiAgICBCb3VuZGluZ0JveCxcbiAgICBkb0JvdW5kaW5nQm94ZXNPdmVybGFwLFxuICAgIFZlY3RvcjIsXG59IGZyb20gXCJAY2FudmFzL3ByaW1pdGl2ZXMvc3BhY2VcIjtcbmltcG9ydCB7IEJpbmRpbmcgfSBmcm9tIFwiQGNvbmZpZy9iaW5kaW5nc1wiO1xuaW1wb3J0IHR5cGUgeyBJbW11dGFibGVTZXRWaWV3IH0gZnJvbSBcIkBleHQvU2V0XCI7XG5cbmltcG9ydCB0eXBlIHtcbiAgICBNb3VzZURvd25FdmVudCxcbiAgICBNb3VzZU1vdmVFdmVudCxcbiAgICBNb3VzZVVwRXZlbnQsXG59IGZyb20gXCIuL01vdXNlSW50ZXJhY3Rpb25Db250cm9sbGVyXCI7XG5cbmV4cG9ydCBjbGFzcyBTZWxlY3RCb3hDb250cm9sbGVyIHtcbiAgICByZWFkb25seSBvblNlbGVjdCA9IG5ldyBFdmVudEhhbmRsZXI8U2VsZWN0T2JqZWN0RXZlbnQ+KCk7XG4gICAgcmVhZG9ubHkgb25EZXNlbGVjdCA9IG5ldyBFdmVudEhhbmRsZXI8RGVzZWxlY3RPYmplY3RFdmVudD4oKTtcblxuICAgIHByaXZhdGUgc3Vic2NyaXB0aW9uczogU3Vic2NyaXB0aW9uW10gPSBbXTtcbiAgICBwcml2YXRlIHNlbGVjdFN1YnNjcmlwdGlvbnM6IFN1YnNjcmlwdGlvbltdID0gW107XG4gICAgcHJpdmF0ZSBhY3RpdmVTZWxlY3RTdWJzY3JpcHRpb25zOiBTdWJzY3JpcHRpb25bXSA9IFtdO1xuICAgIHByaXZhdGUgaXNBY3RpdmUgPSBmYWxzZTtcbiAgICBwcml2YXRlIF9zZWxlY3RlZE9iamVjdHM6IFNldDxCb2FyZEl0ZW0+ID0gbmV3IFNldCgpO1xuICAgIHByaXZhdGUgX29iamVjdE9wdGlvbnMgPSBuZXcgTWFwPEJvYXJkSXRlbSwgU2VsZWN0aW9uT3B0aW9ucz4oKTtcbiAgICBwcml2YXRlIGZyYW1lID0gbmV3IFNlbGVjdEJveEZyYW1lKCk7XG4gICAgcHJpdmF0ZSBzdGFydFBvc2l0aW9uID0gVmVjdG9yMi5vcmlnaW47XG5cbiAgICBjb25zdHJ1Y3RvcihyZWFkb25seSBib2FyZDogQm9hcmQpIHt9XG5cbiAgICBwdWJsaWMgZ2V0IHNlbGVjdGVkT2JqZWN0cygpOiBJbW11dGFibGVTZXRWaWV3PEJvYXJkSXRlbT4ge1xuICAgICAgICByZXR1cm4gdGhpcy5fc2VsZWN0ZWRPYmplY3RzLmltbXV0YWJsZSgpO1xuICAgIH1cblxuICAgIHB1YmxpYyBnZXRPcHRpb25zKGJvYXJkSXRlbTogQm9hcmRJdGVtKTogU2VsZWN0aW9uT3B0aW9ucyB7XG4gICAgICAgIHJldHVybiB0aGlzLl9vYmplY3RPcHRpb25zLmdldChib2FyZEl0ZW0pO1xuICAgIH1cblxuICAgIHB1YmxpYyBhY3RpdmF0ZSgpOiB2b2lkIHtcbiAgICAgICAgY29uc3QgbW9kZSA9IHRoaXMuYm9hcmQuY29udHJvbGxlci5tb2RlO1xuXG4gICAgICAgIHRoaXMuc3Vic2NyaXB0aW9ucy5wdXNoKFxuICAgICAgICAgICAgbW9kZS5vbkVudGVyLmxpc3RlbihCb2FyZE1vZGUuU2VsZWN0LCAoKSA9PiB7XG4gICAgICAgICAgICAgICAgdGhpcy5lbnRlclNlbGVjdE1vZGUoKTtcbiAgICAgICAgICAgIH0pLFxuICAgICAgICApO1xuICAgICAgICB0aGlzLnN1YnNjcmlwdGlvbnMucHVzaChcbiAgICAgICAgICAgIG1vZGUub25FeGl0Lmxpc3RlbihCb2FyZE1vZGUuU2VsZWN0LCAoKSA9PiB7XG4gICAgICAgICAgICAgICAgdGhpcy5leGl0U2VsZWN0TW9kZSgpO1xuICAgICAgICAgICAgfSksXG4gICAgICAgICk7XG4gICAgICAgIHRoaXMuc3Vic2NyaXB0aW9ucy5wdXNoKFxuICAgICAgICAgICAgdGhpcy5ib2FyZC5vbkRlc3Bhd24ubGlzdGVuKHVuZGVmaW5lZCwgdGFyZ2V0ID0+IHtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5fc2VsZWN0ZWRPYmplY3RzLmhhcyg8Qm9hcmRJdGVtPig8dW5rbm93bj50YXJnZXQpKSkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl9zZWxlY3RlZE9iamVjdHMuZGVsZXRlKDxCb2FyZEl0ZW0+KDx1bmtub3duPnRhcmdldCkpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pLFxuICAgICAgICApO1xuXG4gICAgICAgIGlmIChtb2RlLnN0YXRlID09PSBCb2FyZE1vZGUuU2VsZWN0KSB7XG4gICAgICAgICAgICB0aGlzLmVudGVyU2VsZWN0TW9kZSgpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHVibGljIGRlYWN0aXZhdGUoKTogdm9pZCB7XG4gICAgICAgIHRoaXMuZXhpdFNlbGVjdE1vZGUoKTtcbiAgICAgICAgdW5zdWJzY3JpYmVBbGwodGhpcy5zdWJzY3JpcHRpb25zKTtcbiAgICB9XG5cbiAgICBwcml2YXRlIG9uTW91c2VEb3duKGU6IE1vdXNlRG93bkV2ZW50KTogdm9pZCB7XG4gICAgICAgIGlmIChlLnRhcmdldCAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAvLyBPbmx5IGFjdGl2YXRlIGEgc2VsZWN0IGJveCBpZiBkcmFnZ2luZyBpcyBzdGFydGVkIG9uIHRoZSBlbXB0eSBjYW52YXNcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh0aGlzLmlzQWN0aXZlKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICAvLyBTdGFydCBzZWxlY3RcbiAgICAgICAgdGhpcy5pc0FjdGl2ZSA9IHRydWU7XG5cbiAgICAgICAgY29uc3QgbW91c2UgPSB0aGlzLmJvYXJkLmNvbnRyb2xsZXIubW91c2U7XG5cbiAgICAgICAgdGhpcy5zZWxlY3RTdWJzY3JpcHRpb25zLnB1c2goXG4gICAgICAgICAgICBtb3VzZS5vbk1vdXNlTW92ZS5saXN0ZW4odW5kZWZpbmVkLCBlID0+IHtcbiAgICAgICAgICAgICAgICB0aGlzLm9uU2VsZWN0TW92ZShlKTtcbiAgICAgICAgICAgIH0pLFxuICAgICAgICApO1xuXG4gICAgICAgIGNvbnN0IHdvcmxkUG9zaXRpb24gPSB0aGlzLmJvYXJkLnZpZXdwb3J0LnRvV29ybGRQb3NpdGlvbihlLnBvc2l0aW9uKTtcbiAgICAgICAgdGhpcy5zdGFydFBvc2l0aW9uID0gd29ybGRQb3NpdGlvbjtcblxuICAgICAgICB0aGlzLmZyYW1lLnVwZGF0ZVNpemUod29ybGRQb3NpdGlvbiwgVmVjdG9yMi5vcmlnaW4pO1xuICAgICAgICB0aGlzLmJvYXJkLmFkZE9iamVjdHNBYm92ZShcbiAgICAgICAgICAgIFt0aGlzLmZyYW1lXSxcbiAgICAgICAgICAgIHRoaXMuYm9hcmQuY29udHJvbGxlci5taW5PdmVybGF5TWFya2VyLFxuICAgICAgICApO1xuICAgIH1cblxuICAgIHByaXZhdGUgb25Nb3VzZVVwKGU6IE1vdXNlVXBFdmVudCk6IHZvaWQge1xuICAgICAgICBpZiAodGhpcy5pc0FjdGl2ZSkge1xuICAgICAgICAgICAgLy8gRW5kIHNlbGVjdFxuICAgICAgICAgICAgdGhpcy5pc0FjdGl2ZSA9IGZhbHNlO1xuICAgICAgICAgICAgdW5zdWJzY3JpYmVBbGwodGhpcy5hY3RpdmVTZWxlY3RTdWJzY3JpcHRpb25zKTtcbiAgICAgICAgICAgIHRoaXMuYm9hcmQucmVtb3ZlT2JqZWN0cyhbdGhpcy5mcmFtZV0pO1xuXG4gICAgICAgICAgICBjb25zdCB2aWV3cG9ydCA9IHRoaXMuYm9hcmQudmlld3BvcnQ7XG5cbiAgICAgICAgICAgIC8vIEZpbmQgb2JqZWN0cyBpbiBzZWxlY3Rpb24gZnJhbWVcbiAgICAgICAgICAgIGNvbnN0IHdvcmxkUG9zaXRpb24gPSB2aWV3cG9ydC50b1dvcmxkUG9zaXRpb24oZS5wb3NpdGlvbik7XG5cbiAgICAgICAgICAgIGNvbnN0IGZyYW1lQm94ID0gQm91bmRpbmdCb3gubm9ybWFsaXplZChcbiAgICAgICAgICAgICAgICB2aWV3cG9ydC50b1ZpZXdwb3J0UG9zaXRpb24odGhpcy5zdGFydFBvc2l0aW9uKSxcbiAgICAgICAgICAgICAgICB2aWV3cG9ydC50b1ZpZXdwb3J0U2l6ZShcbiAgICAgICAgICAgICAgICAgICAgd29ybGRQb3NpdGlvbi5taW51cyh0aGlzLnN0YXJ0UG9zaXRpb24pLFxuICAgICAgICAgICAgICAgICksXG4gICAgICAgICAgICApO1xuXG4gICAgICAgICAgICBjb25zdCBzZWxlY3RDYW5kaWRhdGVzOiBTZWxlY3RhYmxlW10gPSBbXTtcblxuICAgICAgICAgICAgZm9yIChjb25zdCBvYmplY3Qgb2YgdGhpcy5ib2FyZC5vYmplY3RzKSB7XG4gICAgICAgICAgICAgICAgZm9yIChjb25zdCBzZWxlY3RhYmxlIG9mIGZpbmRTZWxlY3RhYmxlcyhvYmplY3QpKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IG9iamVjdEJveCA9IHNlbGVjdGFibGUuYm91bmRpbmdCb3goXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmJvYXJkLnZpZXdwb3J0LFxuICAgICAgICAgICAgICAgICAgICApO1xuXG4gICAgICAgICAgICAgICAgICAgIGlmIChkb0JvdW5kaW5nQm94ZXNPdmVybGFwKGZyYW1lQm94LCBvYmplY3RCb3gpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBzZWxlY3RDYW5kaWRhdGVzLnB1c2goc2VsZWN0YWJsZSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGNvbnN0IHVzZU11bHRpU2VsZWN0ID0gQmluZGluZy5NdWx0aVNlbGVjdC5tb2RpZmllcnMoZSk7XG5cbiAgICAgICAgICAgIGlmICh1c2VNdWx0aVNlbGVjdCkge1xuICAgICAgICAgICAgICAgIHRoaXMuYm9hcmQuY29udHJvbGxlci5zZWxlY3QudG9nZ2xlU2VsZWN0aW9uKHNlbGVjdENhbmRpZGF0ZXMpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB0aGlzLmJvYXJkLmNvbnRyb2xsZXIuc2VsZWN0LnNlbGVjdE1hbnkoc2VsZWN0Q2FuZGlkYXRlcyk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwcml2YXRlIG9uU2VsZWN0TW92ZShlOiBNb3VzZU1vdmVFdmVudCk6IHZvaWQge1xuICAgICAgICBpZiAodGhpcy5pc0FjdGl2ZSkge1xuICAgICAgICAgICAgY29uc3Qgd29ybGRQb3NpdGlvbiA9IHRoaXMuYm9hcmQudmlld3BvcnQudG9Xb3JsZFBvc2l0aW9uKFxuICAgICAgICAgICAgICAgIGUucG9zaXRpb24sXG4gICAgICAgICAgICApO1xuICAgICAgICAgICAgY29uc3Qgc2l6ZSA9IHdvcmxkUG9zaXRpb24ubWludXModGhpcy5zdGFydFBvc2l0aW9uKTtcbiAgICAgICAgICAgIHRoaXMuZnJhbWUudXBkYXRlU2l6ZSh0aGlzLnN0YXJ0UG9zaXRpb24sIHNpemUpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBlbnRlclNlbGVjdE1vZGUoKTogdm9pZCB7XG4gICAgICAgIGNvbnN0IG1vdXNlID0gdGhpcy5ib2FyZC5jb250cm9sbGVyLm1vdXNlO1xuXG4gICAgICAgIHRoaXMuc2VsZWN0U3Vic2NyaXB0aW9ucy5wdXNoKFxuICAgICAgICAgICAgbW91c2Uub25Nb3VzZURvd24ubGlzdGVuKHVuZGVmaW5lZCwgZSA9PiB7XG4gICAgICAgICAgICAgICAgdGhpcy5vbk1vdXNlRG93bihlKTtcbiAgICAgICAgICAgIH0pLFxuICAgICAgICApO1xuICAgICAgICB0aGlzLnNlbGVjdFN1YnNjcmlwdGlvbnMucHVzaChcbiAgICAgICAgICAgIG1vdXNlLm9uTW91c2VVcC5saXN0ZW4odW5kZWZpbmVkLCBlID0+IHtcbiAgICAgICAgICAgICAgICB0aGlzLm9uTW91c2VVcChlKTtcbiAgICAgICAgICAgIH0pLFxuICAgICAgICApO1xuICAgIH1cblxuICAgIHByaXZhdGUgZXhpdFNlbGVjdE1vZGUoKTogdm9pZCB7XG4gICAgICAgIHVuc3Vic2NyaWJlQWxsKHRoaXMuc2VsZWN0U3Vic2NyaXB0aW9ucyk7XG4gICAgfVxufVxuXG5leHBvcnQgZnVuY3Rpb24gZmluZFNlbGVjdGFibGVzKG9iamVjdDogR2VvbWV0cmljT2JqZWN0KTogU2VsZWN0YWJsZVtdIHtcbiAgICBpZiAoXCJpc1NlbGVjdGFibGVcIiBpbiBvYmplY3QpIHtcbiAgICAgICAgY29uc3Qgc2VsZWN0YWJsZSA9IDxTZWxlY3RhYmxlPm9iamVjdDtcblxuICAgICAgICBpZiAoc2VsZWN0YWJsZS5pc1NlbGVjdGFibGUpIHtcbiAgICAgICAgICAgIHJldHVybiBbc2VsZWN0YWJsZV07XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAoXCJjaGlsZHJlblwiIGluIG9iamVjdCkge1xuICAgICAgICAvLyBUT0RPOiBDcmVhdGUgYWJzdHJhY3QgdHlwZSB0byBvbmx5IGNvbnRhaW4gY2hpbGRyZW5cbiAgICAgICAgcmV0dXJuICg8R3JvdXA+b2JqZWN0KS5jaGlsZHJlbi5tYXAoZmluZFNlbGVjdGFibGVzKS5mbGF0KCk7XG4gICAgfVxuXG4gICAgcmV0dXJuIFtdO1xufVxuIiwiaW1wb3J0IFwiQGV4dC9TZXRcIjtcblxuaW1wb3J0IHR5cGUgeyBCb2FyZCB9IGZyb20gXCJAY2FudmFzL2JvYXJkL0JvYXJkXCI7XG5pbXBvcnQgeyBCb2FyZE1vZGUsIGNhblNlbGVjdCB9IGZyb20gXCJAY2FudmFzL2JvYXJkL2NvbnRyb2xsZXJzL0JvYXJkTW9kZVwiO1xuaW1wb3J0IHR5cGUgeyBHZW9tZXRyaWNPYmplY3QgfSBmcm9tIFwiQGNhbnZhcy9ib2FyZC9vYmplY3RzL0dlb21ldHJpY09iamVjdFwiO1xuaW1wb3J0IHR5cGUgeyBCb2FyZEl0ZW0gfSBmcm9tIFwiQGNhbnZhcy9ib2FyZC9vYmplY3RzL2l0ZW1zL0JvYXJkSXRlbVwiO1xuaW1wb3J0IHR5cGUge1xuICAgIFNlbGVjdGFibGUsXG4gICAgU2VsZWN0aW9uT3B0aW9ucyxcbn0gZnJvbSBcIkBjYW52YXMvYm9hcmQvb2JqZWN0cy91aS9zZWxlY3RhYmxlL1NlbGVjdGFibGVcIjtcbmltcG9ydCB7IGdldFRvcFNlbGVjdGFibGVPbkV2ZW50U3RhY2sgfSBmcm9tIFwiQGNhbnZhcy9ib2FyZC9vYmplY3RzL3VpL3NlbGVjdGFibGUvU2VsZWN0YWJsZVwiO1xuaW1wb3J0IHR5cGUgeyBTdWJzY3JpcHRpb24gfSBmcm9tIFwiQGNhbnZhcy9wcmltaXRpdmVzL2V2ZW50c1wiO1xuaW1wb3J0IHtcbiAgICBFdmVudEJhc2UsXG4gICAgRXZlbnRIYW5kbGVyLFxuICAgIHVuc3Vic2NyaWJlQWxsLFxufSBmcm9tIFwiQGNhbnZhcy9wcmltaXRpdmVzL2V2ZW50c1wiO1xuaW1wb3J0IHR5cGUgeyBPcHRpb25hbCB9IGZyb20gXCJAY2FudmFzL3ByaW1pdGl2ZXMvdHlwZXNcIjtcbmltcG9ydCB7IEJpbmRpbmcgfSBmcm9tIFwiQGNvbmZpZy9iaW5kaW5nc1wiO1xuaW1wb3J0IHR5cGUgeyBJbW11dGFibGVTZXRWaWV3IH0gZnJvbSBcIkBleHQvU2V0XCI7XG5cbmltcG9ydCB0eXBlIHtcbiAgICBNb3VzZUNsaWNrRXZlbnQsXG4gICAgTW91c2VEb3duRXZlbnQsXG59IGZyb20gXCIuL01vdXNlSW50ZXJhY3Rpb25Db250cm9sbGVyXCI7XG5cbmV4cG9ydCBjbGFzcyBTZWxlY3RPYmplY3RFdmVudCBleHRlbmRzIEV2ZW50QmFzZTxHZW9tZXRyaWNPYmplY3Q+IHtcbiAgICBwdWJsaWMgdGFyZ2V0U3Vic3RpdHV0aW9uOiBPcHRpb25hbDxHZW9tZXRyaWNPYmplY3Q+O1xuXG4gICAgY29uc3RydWN0b3IoZXZlbnRTdGFjaz86IEdlb21ldHJpY09iamVjdFtdKSB7XG4gICAgICAgIHN1cGVyKGV2ZW50U3RhY2spO1xuICAgIH1cbn1cbmV4cG9ydCBjbGFzcyBEZXNlbGVjdE9iamVjdEV2ZW50IGV4dGVuZHMgU2VsZWN0T2JqZWN0RXZlbnQge31cblxuZXhwb3J0IGNsYXNzIFNlbGVjdE9iamVjdENvbnRyb2xsZXIge1xuICAgIHJlYWRvbmx5IG9uU2VsZWN0ID0gbmV3IEV2ZW50SGFuZGxlcjxTZWxlY3RPYmplY3RFdmVudD4oKTtcbiAgICByZWFkb25seSBvbkRlc2VsZWN0ID0gbmV3IEV2ZW50SGFuZGxlcjxEZXNlbGVjdE9iamVjdEV2ZW50PigpO1xuXG4gICAgcHJpdmF0ZSBzdWJzY3JpcHRpb25zOiBTdWJzY3JpcHRpb25bXSA9IFtdO1xuICAgIHByaXZhdGUgc2VsZWN0U3Vic2NyaXB0aW9uczogU3Vic2NyaXB0aW9uW10gPSBbXTtcbiAgICBwcml2YXRlIF9zZWxlY3RlZE9iamVjdHM6IFNldDxCb2FyZEl0ZW0+ID0gbmV3IFNldCgpO1xuICAgIHByaXZhdGUgX29iamVjdE9wdGlvbnMgPSBuZXcgTWFwPEJvYXJkSXRlbSwgU2VsZWN0aW9uT3B0aW9ucz4oKTtcblxuICAgIGNvbnN0cnVjdG9yKHJlYWRvbmx5IGJvYXJkOiBCb2FyZCkge31cblxuICAgIHB1YmxpYyBnZXQgc2VsZWN0ZWRPYmplY3RzKCk6IEltbXV0YWJsZVNldFZpZXc8Qm9hcmRJdGVtPiB7XG4gICAgICAgIHJldHVybiB0aGlzLl9zZWxlY3RlZE9iamVjdHMuaW1tdXRhYmxlKCk7XG4gICAgfVxuXG4gICAgcHVibGljIGdldE9wdGlvbnMoYm9hcmRJdGVtOiBCb2FyZEl0ZW0pOiBTZWxlY3Rpb25PcHRpb25zIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX29iamVjdE9wdGlvbnMuZ2V0KGJvYXJkSXRlbSk7XG4gICAgfVxuXG4gICAgcHVibGljIGFjdGl2YXRlKCk6IHZvaWQge1xuICAgICAgICBjb25zdCBtb2RlID0gdGhpcy5ib2FyZC5jb250cm9sbGVyLm1vZGU7XG5cbiAgICAgICAgdGhpcy5zdWJzY3JpcHRpb25zLnB1c2goXG4gICAgICAgICAgICBtb2RlLm9uRW50ZXIubGlzdGVuKEJvYXJkTW9kZS5TZWxlY3QsICgpID0+IHtcbiAgICAgICAgICAgICAgICB0aGlzLmVudGVyU2VsZWN0KCk7XG4gICAgICAgICAgICB9KSxcbiAgICAgICAgKTtcbiAgICAgICAgdGhpcy5zdWJzY3JpcHRpb25zLnB1c2goXG4gICAgICAgICAgICBtb2RlLm9uRXhpdC5saXN0ZW4oQm9hcmRNb2RlLlNlbGVjdCwgKCkgPT4ge1xuICAgICAgICAgICAgICAgIHRoaXMuZXhpdFNlbGVjdCgpO1xuICAgICAgICAgICAgfSksXG4gICAgICAgICk7XG4gICAgICAgIHRoaXMuc3Vic2NyaXB0aW9ucy5wdXNoKFxuICAgICAgICAgICAgdGhpcy5ib2FyZC5vbkRlc3Bhd24ubGlzdGVuKHVuZGVmaW5lZCwgdGFyZ2V0ID0+IHtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5fc2VsZWN0ZWRPYmplY3RzLmhhcyg8Qm9hcmRJdGVtPig8dW5rbm93bj50YXJnZXQpKSkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl9zZWxlY3RlZE9iamVjdHMuZGVsZXRlKDxCb2FyZEl0ZW0+KDx1bmtub3duPnRhcmdldCkpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pLFxuICAgICAgICApO1xuXG4gICAgICAgIGlmIChtb2RlLnN0YXRlID09PSBCb2FyZE1vZGUuU2VsZWN0KSB7XG4gICAgICAgICAgICB0aGlzLmVudGVyU2VsZWN0KCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwdWJsaWMgZGVhY3RpdmF0ZSgpOiB2b2lkIHtcbiAgICAgICAgdGhpcy5leGl0U2VsZWN0KCk7XG4gICAgICAgIHVuc3Vic2NyaWJlQWxsKHRoaXMuc3Vic2NyaXB0aW9ucyk7XG4gICAgfVxuXG4gICAgcHVibGljIHNlbGVjdE9uZShzZWxlY3RhYmxlOiBTZWxlY3RhYmxlKTogdm9pZCB7XG4gICAgICAgIHRoaXMuc2VsZWN0TWFueShbc2VsZWN0YWJsZV0pO1xuICAgIH1cblxuICAgIHB1YmxpYyBzZWxlY3RNYW55KHNlbGVjdGFibGVzOiBTZWxlY3RhYmxlW10sIGV4Y2x1c2l2ZSA9IHRydWUpOiB2b2lkIHtcbiAgICAgICAgaWYgKGV4Y2x1c2l2ZSkge1xuICAgICAgICAgICAgY29uc3Qgc2VsZWN0ID0gbmV3IFNldChcbiAgICAgICAgICAgICAgICBzZWxlY3RhYmxlcy5tYXAoc2VsZWN0YWJsZSA9PiBzZWxlY3RhYmxlLmNvbnRlbnQpLFxuICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIGNvbnN0IGRlc2VsZWN0ID0gWy4uLnRoaXMuX3NlbGVjdGVkT2JqZWN0c10uZmlsdGVyKFxuICAgICAgICAgICAgICAgIGl0ZW0gPT4gIXNlbGVjdC5oYXMoaXRlbSksXG4gICAgICAgICAgICApO1xuXG4gICAgICAgICAgICB0aGlzLmRlc2VsZWN0TWFueShkZXNlbGVjdCk7XG4gICAgICAgIH1cblxuICAgICAgICBzZWxlY3RhYmxlcy5mb3JFYWNoKHNlbGVjdGFibGUgPT4ge1xuICAgICAgICAgICAgY29uc3QgaXRlbSA9IHNlbGVjdGFibGUuY29udGVudDtcbiAgICAgICAgICAgIGNvbnN0IG9wdGlvbnMgPSBzZWxlY3RhYmxlLm9wdGlvbnM7XG5cbiAgICAgICAgICAgIGlmICghdGhpcy5fc2VsZWN0ZWRPYmplY3RzLmhhcyhpdGVtKSkge1xuICAgICAgICAgICAgICAgIHRoaXMuX3NlbGVjdGVkT2JqZWN0cy5hZGQoaXRlbSk7XG4gICAgICAgICAgICAgICAgdGhpcy5fb2JqZWN0T3B0aW9ucy5zZXQoaXRlbSwgb3B0aW9ucyk7XG4gICAgICAgICAgICAgICAgdGhpcy5vblNlbGVjdC5kaXNwYXRjaChuZXcgU2VsZWN0T2JqZWN0RXZlbnQoW2l0ZW1dKSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIHB1YmxpYyBkZXNlbGVjdE1hbnkob2JqZWN0czogQm9hcmRJdGVtW10pOiB2b2lkIHtcbiAgICAgICAgZm9yIChjb25zdCBvYmplY3Qgb2Ygb2JqZWN0cykge1xuICAgICAgICAgICAgdGhpcy5fc2VsZWN0ZWRPYmplY3RzLmRlbGV0ZShvYmplY3QpO1xuICAgICAgICAgICAgdGhpcy5vbkRlc2VsZWN0LmRpc3BhdGNoKG5ldyBEZXNlbGVjdE9iamVjdEV2ZW50KFtvYmplY3RdKSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwdWJsaWMgZGVzZWxlY3RBbGwoKTogdm9pZCB7XG4gICAgICAgIHRoaXMuZGVzZWxlY3RNYW55KFsuLi50aGlzLl9zZWxlY3RlZE9iamVjdHNdKTtcbiAgICB9XG5cbiAgICBwdWJsaWMgdG9nZ2xlU2VsZWN0aW9uKHNlbGVjdGFibGVzOiBTZWxlY3RhYmxlW10pOiB2b2lkIHtcbiAgICAgICAgc2VsZWN0YWJsZXMuZm9yRWFjaChzZWxlY3RhYmxlID0+IHtcbiAgICAgICAgICAgIGNvbnN0IGl0ZW0gPSBzZWxlY3RhYmxlLmNvbnRlbnQ7XG5cbiAgICAgICAgICAgIGlmICh0aGlzLl9zZWxlY3RlZE9iamVjdHMuaGFzKGl0ZW0pKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5fc2VsZWN0ZWRPYmplY3RzLmRlbGV0ZShpdGVtKTtcbiAgICAgICAgICAgICAgICB0aGlzLl9vYmplY3RPcHRpb25zLmRlbGV0ZShpdGVtKTtcblxuICAgICAgICAgICAgICAgIHRoaXMub25EZXNlbGVjdC5kaXNwYXRjaChuZXcgRGVzZWxlY3RPYmplY3RFdmVudChbaXRlbV0pKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgdGhpcy5fc2VsZWN0ZWRPYmplY3RzLmFkZChpdGVtKTtcbiAgICAgICAgICAgICAgICB0aGlzLl9vYmplY3RPcHRpb25zLnNldChpdGVtLCBzZWxlY3RhYmxlLm9wdGlvbnMpO1xuXG4gICAgICAgICAgICAgICAgdGhpcy5vblNlbGVjdC5kaXNwYXRjaChuZXcgU2VsZWN0T2JqZWN0RXZlbnQoW2l0ZW1dKSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIHB1YmxpYyBvbk9iamVjdE1vdXNlRG93bihlOiBNb3VzZURvd25FdmVudCk6IHZvaWQge1xuICAgICAgICBpZiAoIWNhblNlbGVjdCh0aGlzLmJvYXJkLmNvbnRyb2xsZXIubW9kZS5zdGF0ZSkpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IHNlbGVjdGFibGUgPSBnZXRUb3BTZWxlY3RhYmxlT25FdmVudFN0YWNrKGUuZXZlbnRTdGFjayk7XG5cbiAgICAgICAgaWYgKHNlbGVjdGFibGUgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKEJpbmRpbmcuU2luZ2xlU2VsZWN0Lm1vdXNlUHJlc3MoZSkpIHtcbiAgICAgICAgICAgIC8vIE9ubHkgZG8gc2luZ2xlIHNlbGVjdCBvbiBtb3VzZWRvd24gaWYgdGhlcmUgaXMgb25seSBvbmUgc2VsZWN0aW9uXG4gICAgICAgICAgICBpZiAodGhpcy5fc2VsZWN0ZWRPYmplY3RzLnNpemUgPD0gMSkge1xuICAgICAgICAgICAgICAgIHRoaXMuc2VsZWN0T25lKHNlbGVjdGFibGUpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2UgaWYgKEJpbmRpbmcuTXVsdGlTZWxlY3QubW91c2VQcmVzcyhlKSkge1xuICAgICAgICAgICAgLy8gTXVsdGktc2VsZWN0IGFsd2F5cyB3b3JrcyBvbiBtb3VzZWRvd24gYmVjYXVzZSBpdCdzIGxlc3MgZGlzdHJ1Y3RpdmVcbiAgICAgICAgICAgIGlmIChlLnRhcmdldCAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgdGhpcy50b2dnbGVTZWxlY3Rpb24oW3NlbGVjdGFibGVdKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIHB1YmxpYyBvbk9iamVjdENsaWNrKGU6IE1vdXNlQ2xpY2tFdmVudCk6IHZvaWQge1xuICAgICAgICBpZiAoIWNhblNlbGVjdCh0aGlzLmJvYXJkLmNvbnRyb2xsZXIubW9kZS5zdGF0ZSkpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IHNlbGVjdGFibGUgPSBnZXRUb3BTZWxlY3RhYmxlT25FdmVudFN0YWNrKGUuZXZlbnRTdGFjayk7XG5cbiAgICAgICAgaWYgKHNlbGVjdGFibGUgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKEJpbmRpbmcuU2luZ2xlU2VsZWN0Lm1vdXNlUHJlc3MoZSkpIHtcbiAgICAgICAgICAgIC8vIE11bHRpcGxlIHNlbGVjdGlvbnM6IFBlcmZvcm0gc2luZ2xlIHNlbGVjdCB0aGF0IGhhcyBub3RcbiAgICAgICAgICAgIC8vIGJlZW4gcGVyZm9ybWVkIGR1cmluZyBtb3VzZWRvd25cbiAgICAgICAgICAgIGlmICh0aGlzLl9zZWxlY3RlZE9iamVjdHMuc2l6ZSA+IDEpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnNlbGVjdE9uZShzZWxlY3RhYmxlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIHByaXZhdGUgZW50ZXJTZWxlY3QoKTogdm9pZCB7XG4gICAgICAgIGNvbnN0IG1vdXNlID0gdGhpcy5ib2FyZC5jb250cm9sbGVyLm1vdXNlO1xuXG4gICAgICAgIHRoaXMuc2VsZWN0U3Vic2NyaXB0aW9ucy5wdXNoKFxuICAgICAgICAgICAgbW91c2Uub25Nb3VzZURvd24ubGlzdGVuKHVuZGVmaW5lZCwgZSA9PiB7XG4gICAgICAgICAgICAgICAgdGhpcy5vbk1vdXNlRG93bihlKTtcbiAgICAgICAgICAgIH0pLFxuICAgICAgICApO1xuICAgIH1cblxuICAgIHByaXZhdGUgZXhpdFNlbGVjdCgpOiB2b2lkIHtcbiAgICAgICAgdW5zdWJzY3JpYmVBbGwodGhpcy5zZWxlY3RTdWJzY3JpcHRpb25zKTtcbiAgICB9XG5cbiAgICBwcml2YXRlIG9uTW91c2VEb3duKGU6IE1vdXNlRG93bkV2ZW50KTogdm9pZCB7XG4gICAgICAgIGlmIChcbiAgICAgICAgICAgIGUudGFyZ2V0ID09PSB1bmRlZmluZWQgJiZcbiAgICAgICAgICAgIGNhblNlbGVjdCh0aGlzLmJvYXJkLmNvbnRyb2xsZXIubW9kZS5zdGF0ZSkgJiZcbiAgICAgICAgICAgIEJpbmRpbmcuU2luZ2xlU2VsZWN0Lm1vdXNlUHJlc3MoZSkgJiZcbiAgICAgICAgICAgIHRoaXMuX3NlbGVjdGVkT2JqZWN0cy5zaXplIDw9IDFcbiAgICAgICAgKSB7XG4gICAgICAgICAgICB0aGlzLmRlc2VsZWN0QWxsKCk7XG4gICAgICAgIH1cbiAgICB9XG59XG4iLCJpbXBvcnQgdHlwZSB7IEJvYXJkIH0gZnJvbSBcIkBjYW52YXMvYm9hcmQvQm9hcmRcIjtcbmltcG9ydCB0eXBlIHsgU3Vic2NyaXB0aW9uIH0gZnJvbSBcIkBjYW52YXMvcHJpbWl0aXZlcy9ldmVudHNcIjtcbmltcG9ydCB7IHVuc3Vic2NyaWJlQWxsIH0gZnJvbSBcIkBjYW52YXMvcHJpbWl0aXZlcy9ldmVudHNcIjtcbmltcG9ydCB0eXBlIHsgQm91bmRpbmdCb3gsIFZlY3RvcjIgfSBmcm9tIFwiQGNhbnZhcy9wcmltaXRpdmVzL3NwYWNlXCI7XG5pbXBvcnQgeyByYXlJbkJvdW5kaW5nQm94IH0gZnJvbSBcIkBjYW52YXMvcHJpbWl0aXZlcy9zcGFjZVwiO1xuaW1wb3J0IHR5cGUgeyBPcHRpb25hbCB9IGZyb20gXCJAY2FudmFzL3ByaW1pdGl2ZXMvdHlwZXNcIjtcbmltcG9ydCB0eXBlIHsgUmVuZGVyQ29udGV4dCB9IGZyb20gXCJAY2FudmFzL3JlbmRlci9SZW5kZXJDb250ZXh0XCI7XG5pbXBvcnQgdHlwZSB7IFJlbmRlck9iamVjdCB9IGZyb20gXCJAY2FudmFzL3JlbmRlci9SZW5kZXJPYmplY3RcIjtcbmltcG9ydCB0eXBlIHsgVmlld3BvcnQgfSBmcm9tIFwiQGNhbnZhcy9yZW5kZXIvVmlld3BvcnRcIjtcblxuZXhwb3J0IGludGVyZmFjZSBCb3VuZGluZ0JveEhvbGRlciB7XG4gICAgYm91bmRpbmdCb3godmlld3BvcnQ6IFZpZXdwb3J0KTogQm91bmRpbmdCb3g7XG59XG5cbmV4cG9ydCBhYnN0cmFjdCBjbGFzcyBHZW9tZXRyaWNPYmplY3RcbiAgICBpbXBsZW1lbnRzIFJlbmRlck9iamVjdCwgQm91bmRpbmdCb3hIb2xkZXIge1xuICAgIHByb3RlY3RlZCBib2FyZDogT3B0aW9uYWw8Qm9hcmQ+O1xuICAgIHByb3RlY3RlZCBzdWJzY3JpcHRpb25zOiBTdWJzY3JpcHRpb25bXSA9IFtdO1xuXG4gICAgcHVibGljIGdldCBuZWVkc1JlZHJhdygpOiBib29sZWFuIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIHB1YmxpYyBvblNwYXduKGJvYXJkOiBCb2FyZCk6IHZvaWQge1xuICAgICAgICBpZiAodGhpcy5ib2FyZCAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICB0aHJvdyBcIk9iamVjdCBhbHJlYWR5IHNwYXduZWRcIjtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuYm9hcmQgPSBib2FyZDtcbiAgICB9XG5cbiAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgQHR5cGVzY3JpcHQtZXNsaW50L25vLXVudXNlZC12YXJzXG4gICAgcHVibGljIG9uRGVzcGF3bihib2FyZDogQm9hcmQpOiB2b2lkIHtcbiAgICAgICAgaWYgKHRoaXMuYm9hcmQgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgdGhyb3cgXCJPYmplY3Qgbm90IHNwYXduZWRcIjtcbiAgICAgICAgfVxuXG4gICAgICAgIHVuc3Vic2NyaWJlQWxsKHRoaXMuc3Vic2NyaXB0aW9ucyk7XG4gICAgICAgIHRoaXMuYm9hcmQgPSB1bmRlZmluZWQ7XG4gICAgfVxuXG4gICAgcHVibGljIGNhc3RSYXkoXG4gICAgICAgIHBvc2l0aW9uOiBWZWN0b3IyLFxuICAgICAgICB2aWV3cG9ydDogVmlld3BvcnQsXG4gICAgKTogT3B0aW9uYWw8R2VvbWV0cmljT2JqZWN0W10+IHtcbiAgICAgICAgaWYgKHJheUluQm91bmRpbmdCb3gocG9zaXRpb24sIHRoaXMuYm91bmRpbmdCb3godmlld3BvcnQpKSkge1xuICAgICAgICAgICAgcmV0dXJuIFt0aGlzXTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiB1bmRlZmluZWQ7XG4gICAgfVxuXG4gICAgcHVibGljIGFic3RyYWN0IGJvdW5kaW5nQm94KHZpZXdwb3J0OiBWaWV3cG9ydCk6IEJvdW5kaW5nQm94O1xuICAgIHB1YmxpYyBhYnN0cmFjdCBkcmF3KHJlbmRlckN0eDogUmVuZGVyQ29udGV4dCk6IHZvaWQ7XG59XG4iLCJpbXBvcnQgdHlwZSB7IEJvYXJkIH0gZnJvbSBcIkBjYW52YXMvYm9hcmQvQm9hcmRcIjtcbmltcG9ydCB7IERlc3Bhd25FdmVudCwgU3Bhd25FdmVudCB9IGZyb20gXCJAY2FudmFzL2JvYXJkL0JvYXJkXCI7XG5pbXBvcnQgeyBHZW9tZXRyaWNPYmplY3QgfSBmcm9tIFwiQGNhbnZhcy9ib2FyZC9vYmplY3RzL0dlb21ldHJpY09iamVjdFwiO1xuaW1wb3J0IHsgQm91bmRpbmdCb3gsIFZlY3RvcjIgfSBmcm9tIFwiQGNhbnZhcy9wcmltaXRpdmVzL3NwYWNlXCI7XG5pbXBvcnQgdHlwZSB7IE9wdGlvbmFsIH0gZnJvbSBcIkBjYW52YXMvcHJpbWl0aXZlcy90eXBlc1wiO1xuaW1wb3J0IHsgdGludEJvdW5kaW5nQm94IH0gZnJvbSBcIkBjYW52YXMvcmVuZGVyL0NhbnZhc0xheWVyXCI7XG5pbXBvcnQgdHlwZSB7IFJlbmRlckNvbnRleHQgfSBmcm9tIFwiQGNhbnZhcy9yZW5kZXIvUmVuZGVyQ29udGV4dFwiO1xuaW1wb3J0IHR5cGUgeyBWaWV3cG9ydCB9IGZyb20gXCJAY2FudmFzL3JlbmRlci9WaWV3cG9ydFwiO1xuaW1wb3J0IHsgRGVidWdDb25maWcgfSBmcm9tIFwiQGNvbmZpZy9kZWJ1Z1wiO1xuXG5leHBvcnQgY2xhc3MgR3JvdXAgZXh0ZW5kcyBHZW9tZXRyaWNPYmplY3Qge1xuICAgIHByb3RlY3RlZCBib2FyZDogT3B0aW9uYWw8Qm9hcmQ+O1xuXG4gICAgY29uc3RydWN0b3IocHJpdmF0ZSBfY2hpbGRyZW46IEdlb21ldHJpY09iamVjdFtdID0gW10pIHtcbiAgICAgICAgc3VwZXIoKTtcbiAgICB9XG5cbiAgICBwdWJsaWMgZ2V0IG5lZWRzUmVkcmF3KCk6IGJvb2xlYW4ge1xuICAgICAgICByZXR1cm4gdGhpcy5fY2hpbGRyZW4uc29tZShjaGlsZCA9PiBjaGlsZC5uZWVkc1JlZHJhdyk7XG4gICAgfVxuXG4gICAgcHVibGljIGJvdW5kaW5nQm94KHZpZXdwb3J0OiBWaWV3cG9ydCk6IEJvdW5kaW5nQm94IHtcbiAgICAgICAgaWYgKHRoaXMuX2NoaWxkcmVuLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgIC8vIFNtYWxsZXN0IGJvdW5kaW5nIGJveCBjb250YWluaW5nIGFsbCBjaGlsZHJlblxuICAgICAgICAgICAgY29uc3QgYm91bmRpbmdCb3hlcyA9IHRoaXMuX2NoaWxkcmVuLm1hcChjaGlsZCA9PlxuICAgICAgICAgICAgICAgIGNoaWxkLmJvdW5kaW5nQm94KHZpZXdwb3J0KSxcbiAgICAgICAgICAgICk7XG4gICAgICAgICAgICByZXR1cm4gY29udGFpbmluZ0JvdW5kaW5nQm94KGJvdW5kaW5nQm94ZXMpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIG5ldyBCb3VuZGluZ0JveChuZXcgVmVjdG9yMigwLCAwKSwgbmV3IFZlY3RvcjIoMCwgMCkpO1xuICAgIH1cblxuICAgIHB1YmxpYyBkcmF3KHJlbmRlckN0eDogUmVuZGVyQ29udGV4dCk6IHZvaWQge1xuICAgICAgICBmb3IgKGNvbnN0IGNoaWxkIG9mIHRoaXMuX2NoaWxkcmVuKSB7XG4gICAgICAgICAgICAvLyBSZXNldCB0byBkZWZhdWx0IHN0YXRlXG4gICAgICAgICAgICByZW5kZXJDdHguY3R4LnNhdmUoKTtcbiAgICAgICAgICAgIGNoaWxkLmRyYXcocmVuZGVyQ3R4KTtcbiAgICAgICAgICAgIHJlbmRlckN0eC5jdHgucmVzdG9yZSgpO1xuXG4gICAgICAgICAgICBpZiAoRGVidWdDb25maWcudGludEJvdW5kaW5nQm94ZXMpIHtcbiAgICAgICAgICAgICAgICB0aW50Qm91bmRpbmdCb3goY2hpbGQsIHJlbmRlckN0eCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwdWJsaWMgY2FzdFJheShcbiAgICAgICAgcG9zaXRpb246IFZlY3RvcjIsXG4gICAgICAgIHZpZXdwb3J0OiBWaWV3cG9ydCxcbiAgICApOiBPcHRpb25hbDxHZW9tZXRyaWNPYmplY3RbXT4ge1xuICAgICAgICAvLyBDaGlsZHJlbiBhcmUgc29ydGVkIGhpZ2hlc3QgdG8gbG93ZXN0XG4gICAgICAgIC8vIEZvciByYXljYXN0LCB0b3AtdG8tYm90dG9tIGlzIG5lZWRlZCwgaGVuY2U6IHJldmVyc2UgaXRlcmF0aW9uXG5cbiAgICAgICAgZm9yIChjb25zdCBjaGlsZCBvZiB0aGlzLl9jaGlsZHJlbi5yZXZlcnNlZCgpKSB7XG4gICAgICAgICAgICBjb25zdCBzdGFjayA9IGNoaWxkLmNhc3RSYXkocG9zaXRpb24sIHZpZXdwb3J0KTtcblxuICAgICAgICAgICAgaWYgKHN0YWNrICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICBzdGFjay5wdXNoKHRoaXMpO1xuICAgICAgICAgICAgICAgIHJldHVybiBzdGFjaztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiB1bmRlZmluZWQ7XG4gICAgfVxuXG4gICAgcHVibGljIGdldCBjaGlsZHJlbigpOiBHZW9tZXRyaWNPYmplY3RbXSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9jaGlsZHJlbjtcbiAgICB9XG5cbiAgICBwdWJsaWMgc2V0IGNoaWxkcmVuKGNoaWxkcmVuOiBHZW9tZXRyaWNPYmplY3RbXSkge1xuICAgICAgICBpZiAodGhpcy5ib2FyZCAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICBjb25zdCBvbGRTZXQgPSBuZXcgU2V0KHRoaXMuX2NoaWxkcmVuKTtcbiAgICAgICAgICAgIGNvbnN0IG5ld1NldCA9IG5ldyBTZXQoY2hpbGRyZW4pO1xuXG4gICAgICAgICAgICAvLyBEZXNwYXduIG9sZCBvbmVzIG5vdCB0aGVyZSBhbnkgbW9yZVxuICAgICAgICAgICAgY29uc3QgZGVzcGF3bmVkID0gdGhpcy5fY2hpbGRyZW4uZmlsdGVyKFxuICAgICAgICAgICAgICAgIGNoaWxkID0+ICFuZXdTZXQuaGFzKGNoaWxkKSxcbiAgICAgICAgICAgICk7XG4gICAgICAgICAgICBjb25zdCBzcGF3bmVkID0gY2hpbGRyZW4uZmlsdGVyKGNoaWxkID0+ICFvbGRTZXQuaGFzKGNoaWxkKSk7XG5cbiAgICAgICAgICAgIGRlc3Bhd25lZC5mb3JFYWNoKGNoaWxkID0+IHtcbiAgICAgICAgICAgICAgICBjaGlsZC5vbkRlc3Bhd24odGhpcy5ib2FyZCk7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgc3Bhd25lZC5mb3JFYWNoKGNoaWxkID0+IHtcbiAgICAgICAgICAgICAgICBjaGlsZC5vblNwYXduKHRoaXMuYm9hcmQpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLl9jaGlsZHJlbiA9IGNoaWxkcmVuO1xuICAgICAgICB0aGlzLm1hcmtEaXJ0eSgpO1xuICAgIH1cblxuICAgIHB1YmxpYyBvblNwYXduKGJvYXJkOiBCb2FyZCk6IHZvaWQge1xuICAgICAgICBzdXBlci5vblNwYXduKGJvYXJkKTtcbiAgICAgICAgdGhpcy5fY2hpbGRyZW4uZm9yRWFjaChjaGlsZCA9PiB7XG4gICAgICAgICAgICBjaGlsZC5vblNwYXduKGJvYXJkKTtcbiAgICAgICAgICAgIGJvYXJkLm9uU3Bhd24uZGlzcGF0Y2gobmV3IFNwYXduRXZlbnQoW2NoaWxkXSkpO1xuICAgICAgICB9KTtcblxuICAgICAgICB0aGlzLmJvYXJkID0gYm9hcmQ7XG4gICAgfVxuXG4gICAgcHVibGljIG9uRGVzcGF3bihib2FyZDogQm9hcmQpOiB2b2lkIHtcbiAgICAgICAgdGhpcy5fY2hpbGRyZW4uZm9yRWFjaChjaGlsZCA9PiB7XG4gICAgICAgICAgICBjaGlsZC5vbkRlc3Bhd24oYm9hcmQpO1xuICAgICAgICAgICAgYm9hcmQub25EZXNwYXduLmRpc3BhdGNoKG5ldyBEZXNwYXduRXZlbnQoW2NoaWxkXSkpO1xuICAgICAgICB9KTtcbiAgICAgICAgc3VwZXIub25EZXNwYXduKGJvYXJkKTtcblxuICAgICAgICB0aGlzLmJvYXJkID0gdW5kZWZpbmVkO1xuICAgIH1cblxuICAgIHByaXZhdGUgbWFya0RpcnR5KCk6IHZvaWQge1xuICAgICAgICBpZiAodGhpcy5ib2FyZCAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICB0aGlzLmJvYXJkLm1hcmtEaXJ0eU9iamVjdCh0aGlzKTtcbiAgICAgICAgfVxuICAgIH1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGNvbnRhaW5pbmdCb3VuZGluZ0JveChcbiAgICBib3VuZGluZ0JveGVzOiBCb3VuZGluZ0JveFtdLFxuKTogQm91bmRpbmdCb3gge1xuICAgIGNvbnN0IG1pblggPSBNYXRoLm1pbiguLi5ib3VuZGluZ0JveGVzLm1hcChiID0+IGIucG9zaXRpb24ueCkpO1xuICAgIGNvbnN0IG1pblkgPSBNYXRoLm1pbiguLi5ib3VuZGluZ0JveGVzLm1hcChiID0+IGIucG9zaXRpb24ueSkpO1xuICAgIGNvbnN0IG1heFggPSBNYXRoLm1heCguLi5ib3VuZGluZ0JveGVzLm1hcChiID0+IGIucG9zaXRpb24ueCArIGIuc2l6ZS54KSk7XG4gICAgY29uc3QgbWF4WSA9IE1hdGgubWF4KC4uLmJvdW5kaW5nQm94ZXMubWFwKGIgPT4gYi5wb3NpdGlvbi55ICsgYi5zaXplLnkpKTtcblxuICAgIHJldHVybiBuZXcgQm91bmRpbmdCb3goXG4gICAgICAgIG5ldyBWZWN0b3IyKG1pblgsIG1pblkpLFxuICAgICAgICBuZXcgVmVjdG9yMihtYXhYIC0gbWluWCwgbWF4WSAtIG1pblkpLFxuICAgICk7XG59XG4iLCJpbXBvcnQgeyBHZW9tZXRyaWNPYmplY3QgfSBmcm9tIFwiQGNhbnZhcy9ib2FyZC9vYmplY3RzL0dlb21ldHJpY09iamVjdFwiO1xuaW1wb3J0IHsgQm91bmRpbmdCb3gsIFZlY3RvcjIgfSBmcm9tIFwiQGNhbnZhcy9wcmltaXRpdmVzL3NwYWNlXCI7XG5pbXBvcnQgdHlwZSB7IE9wdGlvbmFsIH0gZnJvbSBcIkBjYW52YXMvcHJpbWl0aXZlcy90eXBlc1wiO1xuXG5jb25zdCBib3VuZGluZ0JveCA9IG5ldyBCb3VuZGluZ0JveChWZWN0b3IyLm9yaWdpbiwgVmVjdG9yMi5vcmlnaW4pO1xuXG5leHBvcnQgY2xhc3MgTGF5ZXJNYXJrZXIgZXh0ZW5kcyBHZW9tZXRyaWNPYmplY3Qge1xuICAgIHB1YmxpYyBib3VuZGluZ0JveCgpOiBCb3VuZGluZ0JveCB7XG4gICAgICAgIHJldHVybiBib3VuZGluZ0JveDtcbiAgICB9XG5cbiAgICBwdWJsaWMgZHJhdygpOiB2b2lkIHtcbiAgICAgICAgLy8gRG8gbm90aGluZ1xuICAgIH1cblxuICAgIHB1YmxpYyBjYXN0UmF5KCk6IE9wdGlvbmFsPEdlb21ldHJpY09iamVjdFtdPiB7XG4gICAgICAgIHJldHVybiB1bmRlZmluZWQ7XG4gICAgfVxufVxuIiwiaW1wb3J0IHR5cGUgeyBCb3VuZGluZ0JveEhvbGRlciB9IGZyb20gXCJAY2FudmFzL2JvYXJkL29iamVjdHMvR2VvbWV0cmljT2JqZWN0XCI7XG5pbXBvcnQgeyBWZWN0b3IyIH0gZnJvbSBcIkBjYW52YXMvcHJpbWl0aXZlcy9zcGFjZVwiO1xuaW1wb3J0IHR5cGUgeyBWaWV3cG9ydCB9IGZyb20gXCJAY2FudmFzL3JlbmRlci9WaWV3cG9ydFwiO1xuXG5leHBvcnQgaW50ZXJmYWNlIFBvc2l0aW9uSG9sZGVyIHtcbiAgICBwb3NpdGlvbih2aWV3cG9ydDogVmlld3BvcnQpOiBWZWN0b3IyO1xufVxuXG5leHBvcnQgZW51bSBBbmNob3JQb2ludCB7XG4gICAgVG9wTGVmdCxcbiAgICBUb3BSaWdodCxcbiAgICBCb3R0b21SaWdodCxcbiAgICBCb3R0b21MZWZ0LFxufVxuXG5leHBvcnQgY2xhc3MgUG9zaXRpb25BbmNob3Ige1xuICAgIGNvbnN0cnVjdG9yKFxuICAgICAgICByZWFkb25seSBhbmNob3JUbzogQm91bmRpbmdCb3hIb2xkZXIsXG4gICAgICAgIHJlYWRvbmx5IGFuY2hvclBvaW50OiBBbmNob3JQb2ludCA9IEFuY2hvclBvaW50LlRvcExlZnQsXG4gICAgICAgIHJlYWRvbmx5IG9mZnNldDogVmVjdG9yMiA9IFZlY3RvcjIub3JpZ2luLFxuICAgICkge31cblxuICAgIHB1YmxpYyBwb3NpdGlvbih2aWV3cG9ydDogVmlld3BvcnQpOiBWZWN0b3IyIHtcbiAgICAgICAgY29uc3QgYm91bmRpbmdCb3ggPSB0aGlzLmFuY2hvclRvLmJvdW5kaW5nQm94KHZpZXdwb3J0KTtcblxuICAgICAgICBjb25zdCBwb3NpdGlvbiA9IGJvdW5kaW5nQm94LnBvc2l0aW9uLnBsdXModGhpcy5vZmZzZXQpO1xuXG4gICAgICAgIHN3aXRjaCAodGhpcy5hbmNob3JQb2ludCkge1xuICAgICAgICAgICAgY2FzZSBBbmNob3JQb2ludC5Ub3BMZWZ0OlxuICAgICAgICAgICAgICAgIHJldHVybiBwb3NpdGlvbjtcbiAgICAgICAgICAgIGNhc2UgQW5jaG9yUG9pbnQuVG9wUmlnaHQ6XG4gICAgICAgICAgICAgICAgcmV0dXJuIHBvc2l0aW9uLnBsdXMobmV3IFZlY3RvcjIoYm91bmRpbmdCb3guc2l6ZS54LCAwKSk7XG4gICAgICAgICAgICBjYXNlIEFuY2hvclBvaW50LkJvdHRvbUxlZnQ6XG4gICAgICAgICAgICAgICAgcmV0dXJuIHBvc2l0aW9uLnBsdXMobmV3IFZlY3RvcjIoMCwgYm91bmRpbmdCb3guc2l6ZS55KSk7XG4gICAgICAgICAgICBjYXNlIEFuY2hvclBvaW50LkJvdHRvbVJpZ2h0OlxuICAgICAgICAgICAgICAgIHJldHVybiBwb3NpdGlvbi5wbHVzKFxuICAgICAgICAgICAgICAgICAgICBuZXcgVmVjdG9yMihib3VuZGluZ0JveC5zaXplLngsIGJvdW5kaW5nQm94LnNpemUueSksXG4gICAgICAgICAgICAgICAgKTtcbiAgICAgICAgfVxuICAgIH1cbn1cbiIsImltcG9ydCB0eXBlIHsgQm9hcmQgfSBmcm9tIFwiQGNhbnZhcy9ib2FyZC9Cb2FyZFwiO1xuaW1wb3J0IHsgR2VvbWV0cmljT2JqZWN0IH0gZnJvbSBcIkBjYW52YXMvYm9hcmQvb2JqZWN0cy9HZW9tZXRyaWNPYmplY3RcIjtcbmltcG9ydCB0eXBlIHsgQm9hcmRQb3NpdGlvbmFibGUgfSBmcm9tIFwiQGNhbnZhcy9ib2FyZC9vYmplY3RzL2l0ZW1zL0JvYXJkSXRlbVwiO1xuaW1wb3J0IHsgQm91bmRpbmdCb3gsIFZlY3RvcjIgfSBmcm9tIFwiQGNhbnZhcy9wcmltaXRpdmVzL3NwYWNlXCI7XG5pbXBvcnQgdHlwZSB7IE9wdGlvbmFsIH0gZnJvbSBcIkBjYW52YXMvcHJpbWl0aXZlcy90eXBlc1wiO1xuaW1wb3J0IHsgdGludEJvdW5kaW5nQm94IH0gZnJvbSBcIkBjYW52YXMvcmVuZGVyL0NhbnZhc0xheWVyXCI7XG5pbXBvcnQgdHlwZSB7IFJlbmRlckNvbnRleHQgfSBmcm9tIFwiQGNhbnZhcy9yZW5kZXIvUmVuZGVyQ29udGV4dFwiO1xuaW1wb3J0IHR5cGUgeyBWaWV3cG9ydCB9IGZyb20gXCJAY2FudmFzL3JlbmRlci9WaWV3cG9ydFwiO1xuaW1wb3J0IHsgRGVidWdDb25maWcgfSBmcm9tIFwiQGNvbmZpZy9kZWJ1Z1wiO1xuXG5leHBvcnQgY2xhc3MgUm90YXRlQ29udGFpbmVyPFxuICAgIFQgZXh0ZW5kcyBHZW9tZXRyaWNPYmplY3Rcbj4gZXh0ZW5kcyBHZW9tZXRyaWNPYmplY3Qge1xuICAgIGNvbnN0cnVjdG9yKHJlYWRvbmx5IGNvbnRlbnQ6IFQsIHJlYWRvbmx5IHBvc2l0aW9uYWJsZTogQm9hcmRQb3NpdGlvbmFibGUpIHtcbiAgICAgICAgc3VwZXIoKTtcbiAgICB9XG5cbiAgICBwdWJsaWMgYm91bmRpbmdCb3godmlld3BvcnQ6IFZpZXdwb3J0KTogQm91bmRpbmdCb3gge1xuICAgICAgICByZXR1cm4gcm90YXRlQm91bmRpbmdCb3goXG4gICAgICAgICAgICB0aGlzLmNvbnRlbnQuYm91bmRpbmdCb3godmlld3BvcnQpLFxuICAgICAgICAgICAgdGhpcy5wb3NpdGlvbmFibGUucmFkaWFucyxcbiAgICAgICAgICAgIHRoaXMuZ2V0Um90YXRpb25DZW50ZXIodmlld3BvcnQpLFxuICAgICAgICApO1xuICAgIH1cblxuICAgIHB1YmxpYyBkcmF3KHJlbmRlckN0eDogUmVuZGVyQ29udGV4dCk6IHZvaWQge1xuICAgICAgICBjb25zdCByYWRpYW5zID0gdGhpcy5wb3NpdGlvbmFibGUucmFkaWFucztcblxuICAgICAgICBzZXRSZW5kZXJDb250ZXh0Um90YXRpb24oXG4gICAgICAgICAgICByZW5kZXJDdHgsXG4gICAgICAgICAgICByYWRpYW5zLFxuICAgICAgICAgICAgdGhpcy5nZXRSb3RhdGlvbkNlbnRlcihyZW5kZXJDdHgudmlld3BvcnQpLFxuICAgICAgICApO1xuXG4gICAgICAgIGlmIChEZWJ1Z0NvbmZpZy50aW50Qm91bmRpbmdCb3hlcykge1xuICAgICAgICAgICAgdGludEJvdW5kaW5nQm94KHRoaXMuY29udGVudCwgcmVuZGVyQ3R4KTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuY29udGVudC5kcmF3KHJlbmRlckN0eCk7XG4gICAgfVxuXG4gICAgcHVibGljIGNhc3RSYXkoXG4gICAgICAgIHBvc2l0aW9uOiBWZWN0b3IyLFxuICAgICAgICB2aWV3cG9ydDogVmlld3BvcnQsXG4gICAgKTogT3B0aW9uYWw8R2VvbWV0cmljT2JqZWN0W10+IHtcbiAgICAgICAgY29uc3QgcmFkaWFucyA9IHRoaXMucG9zaXRpb25hYmxlLnJhZGlhbnM7XG5cbiAgICAgICAgLy8gQ291bnRlci1yb3RhdGUgcmF5IHBvc2l0aW9uLCBub3QgY29udGVudCBib3VuZGluZyBib3hcbiAgICAgICAgcG9zaXRpb24gPSBwb3NpdGlvbi5yb3RhdGUoLXJhZGlhbnMsIHRoaXMuZ2V0Um90YXRpb25DZW50ZXIodmlld3BvcnQpKTtcblxuICAgICAgICBjb25zdCBzdGFjayA9IHRoaXMuY29udGVudC5jYXN0UmF5KHBvc2l0aW9uLCB2aWV3cG9ydCk7XG5cbiAgICAgICAgaWYgKHN0YWNrICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIHN0YWNrLnB1c2godGhpcyk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gc3RhY2s7XG4gICAgfVxuXG4gICAgcHVibGljIG9uU3Bhd24oYm9hcmQ6IEJvYXJkKTogdm9pZCB7XG4gICAgICAgIHN1cGVyLm9uU3Bhd24oYm9hcmQpO1xuICAgICAgICB0aGlzLmNvbnRlbnQub25TcGF3bihib2FyZCk7XG4gICAgfVxuXG4gICAgcHVibGljIG9uRGVzcGF3bihib2FyZDogQm9hcmQpOiB2b2lkIHtcbiAgICAgICAgdGhpcy5jb250ZW50Lm9uRGVzcGF3bihib2FyZCk7XG4gICAgICAgIHN1cGVyLm9uRGVzcGF3bihib2FyZCk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBnZXRSb3RhdGlvbkNlbnRlcih2aWV3cG9ydDogVmlld3BvcnQpOiBWZWN0b3IyIHtcbiAgICAgICAgcmV0dXJuIHZpZXdwb3J0LnRvVmlld3BvcnRQb3NpdGlvbih0aGlzLnBvc2l0aW9uYWJsZS5yb3RhdGlvbkFyb3VuZCk7XG4gICAgfVxufVxuXG5leHBvcnQgZnVuY3Rpb24gcm90YXRlQm91bmRpbmdCb3goXG4gICAgYm91bmRpbmdCb3g6IEJvdW5kaW5nQm94LFxuICAgIHJhZGlhbnM6IG51bWJlcixcbiAgICBhcm91bmQ6IFZlY3RvcjIgPSBib3VuZGluZ0JveC5jZW50ZXIoKSxcbik6IEJvdW5kaW5nQm94IHtcbiAgICBpZiAocmFkaWFucyA9PSAwKSB7XG4gICAgICAgIHJldHVybiBib3VuZGluZ0JveDtcbiAgICB9XG5cbiAgICBjb25zdCBjb3JuZXJzID0gYm91bmRpbmdCb3hDb3JuZXJzKGJvdW5kaW5nQm94KS5tYXAocG9pbnQgPT5cbiAgICAgICAgcG9pbnQucm90YXRlKHJhZGlhbnMsIGFyb3VuZCksXG4gICAgKTtcblxuICAgIHJldHVybiBib3VuZGluZ0JveE9mUG9pbnRzKGNvcm5lcnMpO1xufVxuXG5mdW5jdGlvbiBzZXRSZW5kZXJDb250ZXh0Um90YXRpb24oXG4gICAgcmVuZGVyQ3R4OiBSZW5kZXJDb250ZXh0LFxuICAgIHJhZGlhbnM6IG51bWJlcixcbiAgICBhcm91bmQ6IFZlY3RvcjIsXG4pOiB2b2lkIHtcbiAgICBpZiAocmFkaWFucyAhPSAwKSB7XG4gICAgICAgIHJlbmRlckN0eC5jdHgudHJhbnNsYXRlKGFyb3VuZC54LCBhcm91bmQueSk7XG4gICAgICAgIC8vIENhbnZhcyByb3RhdGlvbiBpcyBjbG9jay13aXNlLCBoZW5jZSBuZWVkcyB0byBtZSBpbnZlcnRlZFxuICAgICAgICByZW5kZXJDdHguY3R4LnJvdGF0ZShyYWRpYW5zKTtcbiAgICAgICAgcmVuZGVyQ3R4LmN0eC50cmFuc2xhdGUoLWFyb3VuZC54LCAtYXJvdW5kLnkpO1xuICAgIH1cbn1cblxuZnVuY3Rpb24gYm91bmRpbmdCb3hDb3JuZXJzKGJvdW5kaW5nQm94OiBCb3VuZGluZ0JveCk6IFZlY3RvcjJbXSB7XG4gICAgcmV0dXJuIFtcbiAgICAgICAgLy8gVG9wIGxlZnRcbiAgICAgICAgYm91bmRpbmdCb3gucG9zaXRpb24sXG4gICAgICAgIC8vIFRvcCByaWdodFxuICAgICAgICBuZXcgVmVjdG9yMihcbiAgICAgICAgICAgIGJvdW5kaW5nQm94LnBvc2l0aW9uLnggKyBib3VuZGluZ0JveC5zaXplLngsXG4gICAgICAgICAgICBib3VuZGluZ0JveC5wb3NpdGlvbi55LFxuICAgICAgICApLFxuICAgICAgICAvLyBCb3R0b20gcmlnaHRcbiAgICAgICAgbmV3IFZlY3RvcjIoXG4gICAgICAgICAgICBib3VuZGluZ0JveC5wb3NpdGlvbi54ICsgYm91bmRpbmdCb3guc2l6ZS54LFxuICAgICAgICAgICAgYm91bmRpbmdCb3gucG9zaXRpb24ueSArIGJvdW5kaW5nQm94LnNpemUueSxcbiAgICAgICAgKSxcbiAgICAgICAgLy8gQm90dG9tIGxlZnRcbiAgICAgICAgbmV3IFZlY3RvcjIoXG4gICAgICAgICAgICBib3VuZGluZ0JveC5wb3NpdGlvbi54LFxuICAgICAgICAgICAgYm91bmRpbmdCb3gucG9zaXRpb24ueSArIGJvdW5kaW5nQm94LnNpemUueSxcbiAgICAgICAgKSxcbiAgICBdO1xufVxuXG5mdW5jdGlvbiBib3VuZGluZ0JveE9mUG9pbnRzKHBvaW50czogVmVjdG9yMltdKTogQm91bmRpbmdCb3gge1xuICAgIGxldCBtaW5YID0gTnVtYmVyLlBPU0lUSVZFX0lORklOSVRZO1xuICAgIGxldCBtYXhYID0gTnVtYmVyLk5FR0FUSVZFX0lORklOSVRZO1xuICAgIGxldCBtaW5ZID0gTnVtYmVyLlBPU0lUSVZFX0lORklOSVRZO1xuICAgIGxldCBtYXhZID0gTnVtYmVyLk5FR0FUSVZFX0lORklOSVRZO1xuXG4gICAgZm9yIChjb25zdCBwb2ludCBvZiBwb2ludHMpIHtcbiAgICAgICAgbWluWCA9IE1hdGgubWluKG1pblgsIHBvaW50LngpO1xuICAgICAgICBtYXhYID0gTWF0aC5tYXgobWF4WCwgcG9pbnQueCk7XG4gICAgICAgIG1pblkgPSBNYXRoLm1pbihtaW5ZLCBwb2ludC55KTtcbiAgICAgICAgbWF4WSA9IE1hdGgubWF4KG1heFksIHBvaW50LnkpO1xuICAgIH1cblxuICAgIHJldHVybiBuZXcgQm91bmRpbmdCb3goXG4gICAgICAgIG5ldyBWZWN0b3IyKG1pblgsIG1pblkpLFxuICAgICAgICBuZXcgVmVjdG9yMihtYXhYIC0gbWluWCwgbWF4WSAtIG1pblkpLFxuICAgICk7XG59XG4iLCJpbXBvcnQgdHlwZSB7IEZvbnQgfSBmcm9tIFwiQGNhbnZhcy9ib2FyZC9jb250cm9sbGVycy9ib2FyZC9Gb250Q29udHJvbGxlclwiO1xuaW1wb3J0IHR5cGUgeyBSZXNpemVPYmplY3RFdmVudCB9IGZyb20gXCJAY2FudmFzL2JvYXJkL2NvbnRyb2xsZXJzL29iamVjdHMvUmVzaXplT2JqZWN0Q29udHJvbGxlclwiO1xuaW1wb3J0IHsgd29ybGRTcGFjZVJlc2l6ZSB9IGZyb20gXCJAY2FudmFzL2JvYXJkL2NvbnRyb2xsZXJzL29iamVjdHMvUmVzaXplT2JqZWN0Q29udHJvbGxlclwiO1xuaW1wb3J0IHsgQW5jaG9yUG9pbnQgfSBmcm9tIFwiQGNhbnZhcy9ib2FyZC9vYmplY3RzL2ZvdW5kYXRpb24vUG9zaXRpb25BbmNob3JcIjtcbmltcG9ydCB7XG4gICAgTUVBU1VSRV9GT05UX1NJWkUsXG4gICAgVGV4dEl0ZW0sXG59IGZyb20gXCJAY2FudmFzL2JvYXJkL29iamVjdHMvaXRlbXMvVGV4dEl0ZW1cIjtcbmltcG9ydCB7IFJlc2l6ZUhhbmRsZVBvc2l0aW9uaW5nIH0gZnJvbSBcIkBjYW52YXMvYm9hcmQvb2JqZWN0cy91aS9zZWxlY3RhYmxlL1Jlc2l6ZUhhbmRsZVwiO1xuaW1wb3J0IHsgU2VsZWN0aW9uT3B0aW9ucyB9IGZyb20gXCJAY2FudmFzL2JvYXJkL29iamVjdHMvdWkvc2VsZWN0YWJsZS9TZWxlY3RhYmxlXCI7XG5pbXBvcnQgeyBCb3VuZGluZ0JveCwgVmVjdG9yMiB9IGZyb20gXCJAY2FudmFzL3ByaW1pdGl2ZXMvc3BhY2VcIjtcbmltcG9ydCB0eXBlIHsgUmVuZGVyQ29udGV4dCB9IGZyb20gXCJAY2FudmFzL3JlbmRlci9SZW5kZXJDb250ZXh0XCI7XG5cbmV4cG9ydCBjbGFzcyBCbG9ja1RleHQgZXh0ZW5kcyBUZXh0SXRlbSB7XG4gICAgcmVhZG9ubHkgaXNCbG9ja1RleHQgPSB0cnVlO1xuXG4gICAgcmVhZG9ubHkgc2VsZWN0aW9uT3B0aW9ucyA9IG5ldyBTZWxlY3Rpb25PcHRpb25zKHRydWUsIHRydWUsIHRydWUsIFtcbiAgICAgICAgUmVzaXplSGFuZGxlUG9zaXRpb25pbmcuTWlkZGxlTGVmdCxcbiAgICAgICAgUmVzaXplSGFuZGxlUG9zaXRpb25pbmcuTWlkZGxlUmlnaHQsXG4gICAgXSk7XG5cbiAgICBwcml2YXRlIF90ZXh0OiBzdHJpbmc7XG5cbiAgICBjb25zdHJ1Y3RvcihcbiAgICAgICAgdGV4dDogc3RyaW5nLFxuICAgICAgICB0ZXh0Q29sb3I6IHN0cmluZyxcbiAgICAgICAgZm9udFNpemU6IG51bWJlcixcbiAgICAgICAgZm9udDogRm9udCxcbiAgICAgICAgcG9zaXRpb246IFZlY3RvcjIsXG4gICAgICAgIHNpemU6IFZlY3RvcjIsXG4gICAgICAgIHJhZGlhbnMgPSAwLFxuICAgICAgICBpc0ZpeGVkID0gZmFsc2UsXG4gICAgKSB7XG4gICAgICAgIHN1cGVyKHRleHRDb2xvciwgZm9udFNpemUsIGZvbnQsIHBvc2l0aW9uLCBzaXplLCByYWRpYW5zLCBpc0ZpeGVkKTtcbiAgICAgICAgdGhpcy50ZXh0ID0gdGV4dDtcbiAgICB9XG5cbiAgICBwdWJsaWMgZ2V0IHRleHQoKTogc3RyaW5nIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX3RleHQ7XG4gICAgfVxuXG4gICAgcHVibGljIHNldCB0ZXh0KHRleHQ6IHN0cmluZykge1xuICAgICAgICB0aGlzLl90ZXh0ID0gdGV4dDtcbiAgICAgICAgdGhpcy5tYXJrRGlydHkoKTtcbiAgICB9XG5cbiAgICBwdWJsaWMgZHJhdyhyZW5kZXJDdHg6IFJlbmRlckNvbnRleHQpOiB2b2lkIHtcbiAgICAgICAgdGhpcy51cGRhdGVGb3JSZW5kZXIocmVuZGVyQ3R4KTtcbiAgICAgICAgc3VwZXIuZHJhdyhyZW5kZXJDdHgpO1xuICAgIH1cblxuICAgIHB1YmxpYyB1cGRhdGVGb3JSZW5kZXIocmVuZGVyQ3R4OiBSZW5kZXJDb250ZXh0KTogdm9pZCB7XG4gICAgICAgIGlmICh0aGlzLmRpcnR5VGV4dCB8fCB0aGlzLmNvbXB1dGVJbml0aWFsKSB7XG4gICAgICAgICAgICB0aGlzLnVwZGF0ZVdyYXBwaW5nKHJlbmRlckN0eCk7XG4gICAgICAgICAgICB0aGlzLnVwZGF0ZVNpemUocmVuZGVyQ3R4KTtcbiAgICAgICAgICAgIHRoaXMuZGlydHlUZXh0ID0gZmFsc2U7XG4gICAgICAgICAgICB0aGlzLmNvbXB1dGVJbml0aWFsID0gZmFsc2U7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwcm90ZWN0ZWQgb25SZXNpemUoZTogUmVzaXplT2JqZWN0RXZlbnQpOiB2b2lkIHtcbiAgICAgICAgaWYgKHRoaXMuYm9hcmQgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3Qgd29ybGRTaXplID0gdGhpcy5ib2FyZC52aWV3cG9ydC50b1dvcmxkU2l6ZShlLnNpemUpO1xuICAgICAgICBjb25zdCBzaXplID0gbmV3IFZlY3RvcjIoXG4gICAgICAgICAgICBNYXRoLm1heCh0aGlzLl9mb250U2l6ZSwgd29ybGRTaXplLngpLFxuICAgICAgICAgICAgdGhpcy5zaXplLnksXG4gICAgICAgICk7XG5cbiAgICAgICAgW3RoaXMucG9zaXRpb24sIHRoaXMuc2l6ZV0gPSB3b3JsZFNwYWNlUmVzaXplKFxuICAgICAgICAgICAgc2l6ZSxcbiAgICAgICAgICAgIGUuZml4dHVyZSxcbiAgICAgICAgICAgIG5ldyBCb3VuZGluZ0JveCh0aGlzLnBvc2l0aW9uLCB0aGlzLnNpemUpLFxuICAgICAgICAgICAgdGhpcy5yYWRpYW5zLFxuICAgICAgICApO1xuXG4gICAgICAgIHRoaXMubWFya0RpcnR5KCk7XG4gICAgfVxuXG4gICAgcHJvdGVjdGVkIHVwZGF0ZVRleHRhcmVhKCk6IHZvaWQge1xuICAgICAgICBpZiAodGhpcy50ZXh0YXJlYSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCB2aWV3cG9ydCA9IHRoaXMuYm9hcmQudmlld3BvcnQ7XG4gICAgICAgIGNvbnN0IGJiID0gdGhpcy5ib3VuZGluZ0JveCh2aWV3cG9ydCk7XG4gICAgICAgIGNvbnN0IGZvbnRTaXplID0gdmlld3BvcnQuem9vbUxldmVsICogdGhpcy5fZm9udFNpemU7XG5cbiAgICAgICAgdGhpcy50ZXh0YXJlYS5zdHlsZS5sZWZ0ID0gYCR7YmIucG9zaXRpb24ueH1weGA7XG4gICAgICAgIHRoaXMudGV4dGFyZWEuc3R5bGUudG9wID0gYCR7YmIucG9zaXRpb24ueX1weGA7XG5cbiAgICAgICAgdGhpcy50ZXh0YXJlYS5zdHlsZS53aWR0aCA9IGAke2JiLnNpemUueH1weGA7XG4gICAgICAgIHRoaXMudGV4dGFyZWEuc3R5bGUuaGVpZ2h0ID0gYCR7YmIuc2l6ZS55fXB4YDtcblxuICAgICAgICBpZiAodGhpcy5yYWRpYW5zICE9IDApIHtcbiAgICAgICAgICAgIHRoaXMudGV4dGFyZWEuc3R5bGUudHJhbnNmb3JtID0gYHJvdGF0ZSgke3RoaXMucmFkaWFuc31yYWQpYDtcbiAgICAgICAgICAgIHRoaXMudGV4dGFyZWEuc3R5bGUudHJhbnNmb3JtT3JpZ2luID0gYCR7YmIuc2l6ZS54IC8gMn1weCAke1xuICAgICAgICAgICAgICAgIGJiLnNpemUueSAvIDJcbiAgICAgICAgICAgIH1weGA7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLnRleHRhcmVhLnN0eWxlLmZvbnQgPSB0aGlzLmZvbnQudG9Dc3MoZm9udFNpemUpO1xuICAgICAgICB0aGlzLnRleHRhcmVhLnN0eWxlLmxpbmVIZWlnaHQgPSBgJHtmb250U2l6ZX1weGA7XG5cbiAgICAgICAgdGhpcy50ZXh0YXJlYS5zY3JvbGxUb3AgPSAwO1xuICAgIH1cblxuICAgIHByaXZhdGUgdXBkYXRlV3JhcHBpbmcocmVuZGVyQ3R4OiBSZW5kZXJDb250ZXh0KTogdm9pZCB7XG4gICAgICAgIGNvbnN0IGxpbmVzID0gdGhpcy5fdGV4dC5zcGxpdChcIlxcblwiKTtcbiAgICAgICAgY29uc3Qgd2lkdGggPSAoTUVBU1VSRV9GT05UX1NJWkUgLyB0aGlzLl9mb250U2l6ZSkgKiB0aGlzLl9zaXplLng7XG5cbiAgICAgICAgcmVuZGVyQ3R4LmN0eC5zYXZlKCk7XG4gICAgICAgIHJlbmRlckN0eC5jdHguZm9udCA9IHRoaXMuZm9udC50b0NzcyhNRUFTVVJFX0ZPTlRfU0laRSk7XG5cbiAgICAgICAgY29uc3Qgd3JhcHBlZExpbmVzID0gbGluZXMubWFwKGxpbmUgPT5cbiAgICAgICAgICAgIHdyYXBMaW5lKHJlbmRlckN0eCwgbGluZSwgd2lkdGgpLFxuICAgICAgICApO1xuXG4gICAgICAgIHJlbmRlckN0eC5jdHgucmVzdG9yZSgpO1xuXG4gICAgICAgIHRoaXMubGluZXMgPSAoPHN0cmluZ1tdPltdKS5jb25jYXQoLi4ud3JhcHBlZExpbmVzKTtcbiAgICB9XG5cbiAgICBwcml2YXRlIHVwZGF0ZVNpemUocmVuZGVyQ3R4OiBSZW5kZXJDb250ZXh0KTogdm9pZCB7XG4gICAgICAgIGNvbnN0IGhlaWdodCA9IHRoaXMubGluZXMubGVuZ3RoICogdGhpcy5fZm9udFNpemU7XG4gICAgICAgIGNvbnN0IG5ld1NpemUgPSBuZXcgVmVjdG9yMih0aGlzLl9zaXplLngsIGhlaWdodCk7XG5cbiAgICAgICAgaWYgKHRoaXMuY29tcHV0ZUluaXRpYWwpIHtcbiAgICAgICAgICAgIHRoaXMuc2l6ZSA9IG5ld1NpemU7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBbdGhpcy5wb3NpdGlvbiwgdGhpcy5zaXplXSA9IHdvcmxkU3BhY2VSZXNpemUoXG4gICAgICAgICAgICAgICAgbmV3U2l6ZSxcbiAgICAgICAgICAgICAgICBBbmNob3JQb2ludC5Ub3BMZWZ0LFxuICAgICAgICAgICAgICAgIG5ldyBCb3VuZGluZ0JveCh0aGlzLnBvc2l0aW9uLCB0aGlzLl9zaXplKSxcbiAgICAgICAgICAgICAgICB0aGlzLnJhZGlhbnMsXG4gICAgICAgICAgICApO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgbWVhc3VyZUZvbnRTaXplID0gTWF0aC5taW4oTUVBU1VSRV9GT05UX1NJWkUsIHRoaXMuX2ZvbnRTaXplKTtcblxuICAgICAgICBjb25zdCBhc2NlbnQgPSBtZWFzdXJlQXNjZW50KFxuICAgICAgICAgICAgdGhpcy5saW5lcyxcbiAgICAgICAgICAgIHRoaXMuZm9udC50b0NzcyhtZWFzdXJlRm9udFNpemUpLFxuICAgICAgICAgICAgcmVuZGVyQ3R4LFxuICAgICAgICApO1xuICAgICAgICB0aGlzLmFzY2VudCA9ICh0aGlzLl9mb250U2l6ZSAvIG1lYXN1cmVGb250U2l6ZSkgKiBhc2NlbnQ7XG4gICAgfVxufVxuXG5mdW5jdGlvbiBtZWFzdXJlQXNjZW50KFxuICAgIGxpbmVzOiBzdHJpbmdbXSxcbiAgICBmb250OiBzdHJpbmcsXG4gICAgcmVuZGVyQ3R4OiBSZW5kZXJDb250ZXh0LFxuKTogbnVtYmVyIHtcbiAgICByZW5kZXJDdHguY3R4LnNhdmUoKTtcblxuICAgIHJlbmRlckN0eC5jdHguZm9udCA9IGZvbnQ7XG5cbiAgICBmb3IgKGNvbnN0IGxpbmUgb2YgbGluZXMpIHtcbiAgICAgICAgY29uc3QgbWV0cmljcyA9IHJlbmRlckN0eC5jdHgubWVhc3VyZVRleHQobGluZSk7XG5cbiAgICAgICAgaWYgKG1ldHJpY3MuYWN0dWFsQm91bmRpbmdCb3hBc2NlbnQgPiAwKSB7XG4gICAgICAgICAgICByZXR1cm4gbWV0cmljcy5hY3R1YWxCb3VuZGluZ0JveEFzY2VudDtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHJlbmRlckN0eC5jdHgucmVzdG9yZSgpO1xuXG4gICAgcmV0dXJuIDA7XG59XG5cbmZ1bmN0aW9uIHdyYXBMaW5lKFxuICAgIHJlbmRlckN0eDogUmVuZGVyQ29udGV4dCxcbiAgICB1bndyYXBwZWQ6IHN0cmluZyxcbiAgICBtYXhXaWR0aDogbnVtYmVyLFxuKTogc3RyaW5nW10ge1xuICAgIGNvbnN0IG1ldHJpY3MgPSByZW5kZXJDdHguY3R4Lm1lYXN1cmVUZXh0KHVud3JhcHBlZCk7XG5cbiAgICBpZiAobWV0cmljcy53aWR0aCA8PSBtYXhXaWR0aCkge1xuICAgICAgICByZXR1cm4gW3Vud3JhcHBlZF07XG4gICAgfVxuXG4gICAgY29uc3Qgd3JhcHBlZDogc3RyaW5nW10gPSBbXCJcIl07XG5cbiAgICBjb25zdCB3b3JkcyA9IHVud3JhcHBlZC5zcGxpdChcIiBcIik7XG5cbiAgICBmb3IgKGNvbnN0IHdvcmQgb2Ygd29yZHMpIHtcbiAgICAgICAgY29uc3QgaSA9IHdyYXBwZWQubGVuZ3RoIC0gMTtcbiAgICAgICAgY29uc3QgcGVuZGluZyA9IHdyYXBwZWRbaV07XG5cbiAgICAgICAgLy8gRmlyc3QgYXR0ZW1wdDogd29yZC13cmFwcGluZ1xuICAgICAgICBjb25zdCB0ZXN0TGluZSA9IHBlbmRpbmcgKyB3b3JkO1xuICAgICAgICBjb25zdCBtZXRyaWNzID0gcmVuZGVyQ3R4LmN0eC5tZWFzdXJlVGV4dCh0ZXN0TGluZSk7XG5cbiAgICAgICAgaWYgKG1ldHJpY3Mud2lkdGggPiBtYXhXaWR0aCkge1xuICAgICAgICAgICAgY29uc3Qgd29yZE1ldHJpY3MgPSByZW5kZXJDdHguY3R4Lm1lYXN1cmVUZXh0KHdvcmQpO1xuXG4gICAgICAgICAgICBpZiAod29yZE1ldHJpY3Mud2lkdGggPiBtYXhXaWR0aCkge1xuICAgICAgICAgICAgICAgIC8vIEV2ZW4gb25lIHdvcmQgZG9lcyBub3QgZml0OlxuICAgICAgICAgICAgICAgIC8vIEZhbGwgYmFjayB0byBjaGFyYWN0ZXIgd3JhcHBpbmdcblxuICAgICAgICAgICAgICAgIGlmIChwZW5kaW5nLmxlbmd0aCA9PSAwKSB7XG4gICAgICAgICAgICAgICAgICAgIHdyYXBwZWQucG9wKCk7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgd3JhcHBlZC5wdXNoKC4uLndyYXBXb3JkKHJlbmRlckN0eCwgd29yZCwgbWF4V2lkdGgpKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgd3JhcHBlZC5wdXNoKHdvcmQgKyBcIiBcIik7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAvLyBXb3JkIHN0aWxsIGZpdHMsIGFkZCBpdCB0byBjdXJyZW50IGxpbmVcbiAgICAgICAgICAgIHdyYXBwZWRbaV0gPSB0ZXN0TGluZSArIFwiIFwiO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIHdyYXBwZWQ7XG59XG5cbmZ1bmN0aW9uIHdyYXBXb3JkKFxuICAgIHJlbmRlckN0eDogUmVuZGVyQ29udGV4dCxcbiAgICB1bndyYXBwZWQ6IHN0cmluZyxcbiAgICBtYXhXaWR0aDogbnVtYmVyLFxuKTogc3RyaW5nW10ge1xuICAgIGNvbnN0IG4gPSB1bndyYXBwZWQubGVuZ3RoO1xuICAgIGNvbnN0IHdyYXBwZWQ6IHN0cmluZ1tdID0gW107XG4gICAgbGV0IHBlbmRpbmcgPSBcIlwiO1xuXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBuOyArK2kpIHtcbiAgICAgICAgY29uc3QgdGVzdExpbmUgPSBwZW5kaW5nICsgdW53cmFwcGVkW2ldO1xuICAgICAgICBjb25zdCBtZXRyaWNzID0gcmVuZGVyQ3R4LmN0eC5tZWFzdXJlVGV4dCh0ZXN0TGluZSk7XG5cbiAgICAgICAgaWYgKG1ldHJpY3Mud2lkdGggPiBtYXhXaWR0aCkge1xuICAgICAgICAgICAgd3JhcHBlZC5wdXNoKHBlbmRpbmcpO1xuICAgICAgICAgICAgcGVuZGluZyA9IHVud3JhcHBlZFtpXTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHBlbmRpbmcgPSB0ZXN0TGluZTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGlmIChwZW5kaW5nLmxlbmd0aCA+IDApIHtcbiAgICAgICAgd3JhcHBlZC5wdXNoKHBlbmRpbmcgKyBcIiBcIik7XG4gICAgfVxuXG4gICAgcmV0dXJuIHdyYXBwZWQ7XG59XG4iLCJpbXBvcnQgdHlwZSB7IEJvYXJkIH0gZnJvbSBcIkBjYW52YXMvYm9hcmQvQm9hcmRcIjtcbmltcG9ydCB0eXBlIHsgTW92ZU9iamVjdEV2ZW50IH0gZnJvbSBcIkBjYW52YXMvYm9hcmQvY29udHJvbGxlcnMvb2JqZWN0cy9Nb3ZlT2JqZWN0Q29udHJvbGxlclwiO1xuaW1wb3J0IHR5cGUgeyBSZXNpemVPYmplY3RFdmVudCB9IGZyb20gXCJAY2FudmFzL2JvYXJkL2NvbnRyb2xsZXJzL29iamVjdHMvUmVzaXplT2JqZWN0Q29udHJvbGxlclwiO1xuaW1wb3J0IHsgd29ybGRTcGFjZVJlc2l6ZSB9IGZyb20gXCJAY2FudmFzL2JvYXJkL2NvbnRyb2xsZXJzL29iamVjdHMvUmVzaXplT2JqZWN0Q29udHJvbGxlclwiO1xuaW1wb3J0IHR5cGUgeyBSb3RhdGVPYmplY3RFdmVudCB9IGZyb20gXCJAY2FudmFzL2JvYXJkL2NvbnRyb2xsZXJzL29iamVjdHMvUm90YXRlT2JqZWN0Q29udHJvbGxlclwiO1xuaW1wb3J0IHsgR2VvbWV0cmljT2JqZWN0IH0gZnJvbSBcIkBjYW52YXMvYm9hcmQvb2JqZWN0cy9HZW9tZXRyaWNPYmplY3RcIjtcbmltcG9ydCB7IFNlbGVjdGlvbk9wdGlvbnMgfSBmcm9tIFwiQGNhbnZhcy9ib2FyZC9vYmplY3RzL3VpL3NlbGVjdGFibGUvU2VsZWN0YWJsZVwiO1xuaW1wb3J0IHsgQm91bmRpbmdCb3gsIFZlY3RvcjIgfSBmcm9tIFwiQGNhbnZhcy9wcmltaXRpdmVzL3NwYWNlXCI7XG5pbXBvcnQgdHlwZSB7IE9wdGlvbmFsIH0gZnJvbSBcIkBjYW52YXMvcHJpbWl0aXZlcy90eXBlc1wiO1xuaW1wb3J0IHR5cGUgeyBWaWV3cG9ydCB9IGZyb20gXCJAY2FudmFzL3JlbmRlci9WaWV3cG9ydFwiO1xuXG5leHBvcnQgaW50ZXJmYWNlIEJvYXJkUG9zaXRpb25hYmxlIHtcbiAgICBwb3NpdGlvbjogVmVjdG9yMjtcbiAgICBzaXplOiBWZWN0b3IyO1xuXG4gICAgLyoqXG4gICAgICogQ2xvY2t3aXNlIHJvdGF0aW9uIGluIHJhZGlhbnNcbiAgICAgKi9cbiAgICByYWRpYW5zOiBudW1iZXI7XG4gICAgcm90YXRpb25Bcm91bmQ6IFZlY3RvcjI7XG59XG5cbmV4cG9ydCBhYnN0cmFjdCBjbGFzcyBCb2FyZEl0ZW1cbiAgICBleHRlbmRzIEdlb21ldHJpY09iamVjdFxuICAgIGltcGxlbWVudHMgQm9hcmRQb3NpdGlvbmFibGUge1xuICAgIHJlYWRvbmx5IGlzQm9hcmRJdGVtID0gdHJ1ZTtcblxuICAgIHJlYWRvbmx5IHNlbGVjdGlvbk9wdGlvbnM6IE9wdGlvbmFsPFxuICAgICAgICBTZWxlY3Rpb25PcHRpb25zXG4gICAgPiA9IG5ldyBTZWxlY3Rpb25PcHRpb25zKHRydWUsIHRydWUsIHRydWUpO1xuXG4gICAgY29uc3RydWN0b3IoXG4gICAgICAgIHByaXZhdGUgX3Bvc2l0aW9uOiBWZWN0b3IyLFxuICAgICAgICBwcm90ZWN0ZWQgX3NpemU6IFZlY3RvcjIsXG4gICAgICAgIHByaXZhdGUgX3JhZGlhbnM6IG51bWJlciA9IDAsXG4gICAgICAgIHJlYWRvbmx5IGlzRml4ZWQ6IGJvb2xlYW4gPSBmYWxzZSxcbiAgICApIHtcbiAgICAgICAgc3VwZXIoKTtcbiAgICB9XG5cbiAgICBwdWJsaWMgZ2V0IHBvc2l0aW9uKCk6IFZlY3RvcjIge1xuICAgICAgICByZXR1cm4gdGhpcy5fcG9zaXRpb247XG4gICAgfVxuXG4gICAgcHVibGljIHNldCBwb3NpdGlvbihwb3NpdGlvbjogVmVjdG9yMikge1xuICAgICAgICB0aGlzLl9wb3NpdGlvbiA9IHBvc2l0aW9uO1xuICAgICAgICB0aGlzLmJvYXJkPy5tYXJrRGlydHlPYmplY3QodGhpcyk7XG4gICAgfVxuXG4gICAgcHVibGljIGdldCBzaXplKCk6IFZlY3RvcjIge1xuICAgICAgICByZXR1cm4gdGhpcy5fc2l6ZTtcbiAgICB9XG5cbiAgICBwdWJsaWMgc2V0IHNpemUoc2l6ZTogVmVjdG9yMikge1xuICAgICAgICB0aGlzLl9zaXplID0gc2l6ZTtcbiAgICAgICAgdGhpcy5ib2FyZD8ubWFya0RpcnR5T2JqZWN0KHRoaXMpO1xuICAgIH1cblxuICAgIHB1YmxpYyBnZXQgcmFkaWFucygpOiBudW1iZXIge1xuICAgICAgICByZXR1cm4gdGhpcy5fcmFkaWFucztcbiAgICB9XG5cbiAgICBwdWJsaWMgc2V0IHJhZGlhbnMocmFkaWFuczogbnVtYmVyKSB7XG4gICAgICAgIHRoaXMuX3JhZGlhbnMgPSByYWRpYW5zO1xuICAgICAgICB0aGlzLmJvYXJkPy5tYXJrRGlydHlPYmplY3QodGhpcyk7XG4gICAgfVxuXG4gICAgcHVibGljIGdldCByb3RhdGlvbkFyb3VuZCgpOiBWZWN0b3IyIHtcbiAgICAgICAgcmV0dXJuIG5ldyBCb3VuZGluZ0JveCh0aGlzLnBvc2l0aW9uLCB0aGlzLnNpemUpLmNlbnRlcigpO1xuICAgIH1cblxuICAgIHB1YmxpYyBib3VuZGluZ0JveCh2aWV3cG9ydDogVmlld3BvcnQpOiBCb3VuZGluZ0JveCB7XG4gICAgICAgIGNvbnN0IHBvc2l0aW9uID0gdGhpcy5wb3NpdGlvbkluVmlld3BvcnQodmlld3BvcnQpO1xuICAgICAgICBjb25zdCBzaXplID0gdGhpcy5zaXplSW5WaWV3cG9ydCh2aWV3cG9ydCk7XG5cbiAgICAgICAgcmV0dXJuIG5ldyBCb3VuZGluZ0JveChwb3NpdGlvbiwgc2l6ZSk7XG4gICAgfVxuXG4gICAgcHVibGljIG9uU3Bhd24oYm9hcmQ6IEJvYXJkKTogdm9pZCB7XG4gICAgICAgIHN1cGVyLm9uU3Bhd24oYm9hcmQpO1xuXG4gICAgICAgIHRoaXMuc3Vic2NyaXB0aW9ucy5wdXNoKFxuICAgICAgICAgICAgYm9hcmQuY29udHJvbGxlci5tb3ZlLm9uTW92ZS5saXN0ZW4odGhpcywgZSA9PiB7XG4gICAgICAgICAgICAgICAgdGhpcy5vbk1vdmUoZSk7XG4gICAgICAgICAgICB9KSxcbiAgICAgICAgKTtcbiAgICAgICAgdGhpcy5zdWJzY3JpcHRpb25zLnB1c2goXG4gICAgICAgICAgICBib2FyZC5jb250cm9sbGVyLnJlc2l6ZS5vblJlc2l6ZS5saXN0ZW4odGhpcywgZSA9PiB7XG4gICAgICAgICAgICAgICAgdGhpcy5vblJlc2l6ZShlKTtcbiAgICAgICAgICAgIH0pLFxuICAgICAgICApO1xuICAgICAgICB0aGlzLnN1YnNjcmlwdGlvbnMucHVzaChcbiAgICAgICAgICAgIGJvYXJkLmNvbnRyb2xsZXIucm90YXRlLm9uUm90YXRlLmxpc3Rlbih0aGlzLCBlID0+IHtcbiAgICAgICAgICAgICAgICB0aGlzLm9uUm90YXRlKGUpO1xuICAgICAgICAgICAgfSksXG4gICAgICAgICk7XG4gICAgfVxuXG4gICAgcHJvdGVjdGVkIHBvc2l0aW9uSW5WaWV3cG9ydCh2aWV3cG9ydDogVmlld3BvcnQpOiBWZWN0b3IyIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuaXNGaXhlZFxuICAgICAgICAgICAgPyB0aGlzLl9wb3NpdGlvblxuICAgICAgICAgICAgOiB2aWV3cG9ydC50b1ZpZXdwb3J0UG9zaXRpb24odGhpcy5fcG9zaXRpb24pO1xuICAgIH1cblxuICAgIHByb3RlY3RlZCBzaXplSW5WaWV3cG9ydCh2aWV3cG9ydDogVmlld3BvcnQpOiBWZWN0b3IyIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuaXNGaXhlZCA/IHRoaXMuX3NpemUgOiB2aWV3cG9ydC50b1ZpZXdwb3J0U2l6ZSh0aGlzLl9zaXplKTtcbiAgICB9XG5cbiAgICBwcm90ZWN0ZWQgb25SZXNpemUoZTogUmVzaXplT2JqZWN0RXZlbnQpOiB2b2lkIHtcbiAgICAgICAgaWYgKHRoaXMuYm9hcmQgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3Qgd29ybGRTaXplID0gdGhpcy5ib2FyZC52aWV3cG9ydC50b1dvcmxkU2l6ZShlLnNpemUpO1xuICAgICAgICBjb25zdCBzaXplID0gbmV3IFZlY3RvcjIoXG4gICAgICAgICAgICBNYXRoLm1heCgxLCB3b3JsZFNpemUueCksXG4gICAgICAgICAgICBNYXRoLm1heCgxLCB3b3JsZFNpemUueSksXG4gICAgICAgICk7XG5cbiAgICAgICAgW3RoaXMucG9zaXRpb24sIHRoaXMuc2l6ZV0gPSB3b3JsZFNwYWNlUmVzaXplKFxuICAgICAgICAgICAgc2l6ZSxcbiAgICAgICAgICAgIGUuZml4dHVyZSxcbiAgICAgICAgICAgIG5ldyBCb3VuZGluZ0JveCh0aGlzLnBvc2l0aW9uLCB0aGlzLnNpemUpLFxuICAgICAgICAgICAgdGhpcy5yYWRpYW5zLFxuICAgICAgICApO1xuICAgIH1cblxuICAgIHByaXZhdGUgb25Nb3ZlKGU6IE1vdmVPYmplY3RFdmVudCk6IHZvaWQge1xuICAgICAgICBjb25zdCBkZWx0YSA9IHRoaXMuaXNGaXhlZFxuICAgICAgICAgICAgPyBlLnBvc2l0aW9uRGVsdGFcbiAgICAgICAgICAgIDogdGhpcy5ib2FyZC52aWV3cG9ydC50b1dvcmxkU2l6ZShlLnBvc2l0aW9uRGVsdGEpO1xuICAgICAgICB0aGlzLnBvc2l0aW9uID0gdGhpcy5wb3NpdGlvbi5wbHVzKGRlbHRhKTtcbiAgICB9XG5cbiAgICBwcml2YXRlIG9uUm90YXRlKGU6IFJvdGF0ZU9iamVjdEV2ZW50KTogdm9pZCB7XG4gICAgICAgIGlmICh0aGlzLmJvYXJkID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMucmFkaWFucyA9IGUucmFkaWFucztcbiAgICB9XG59XG4iLCJpbXBvcnQgdHlwZSB7IFJlc2l6ZU9iamVjdEV2ZW50IH0gZnJvbSBcIkBjYW52YXMvYm9hcmQvY29udHJvbGxlcnMvb2JqZWN0cy9SZXNpemVPYmplY3RDb250cm9sbGVyXCI7XG5pbXBvcnQgeyB3b3JsZFNwYWNlUmVzaXplIH0gZnJvbSBcIkBjYW52YXMvYm9hcmQvY29udHJvbGxlcnMvb2JqZWN0cy9SZXNpemVPYmplY3RDb250cm9sbGVyXCI7XG5pbXBvcnQgeyBBbmNob3JQb2ludCB9IGZyb20gXCJAY2FudmFzL2JvYXJkL29iamVjdHMvZm91bmRhdGlvbi9Qb3NpdGlvbkFuY2hvclwiO1xuaW1wb3J0IHsgQm9hcmRJdGVtIH0gZnJvbSBcIkBjYW52YXMvYm9hcmQvb2JqZWN0cy9pdGVtcy9Cb2FyZEl0ZW1cIjtcbmltcG9ydCB7IEJvdW5kaW5nQm94LCBWZWN0b3IyIH0gZnJvbSBcIkBjYW52YXMvcHJpbWl0aXZlcy9zcGFjZVwiO1xuaW1wb3J0IHR5cGUgeyBPcHRpb25hbCB9IGZyb20gXCJAY2FudmFzL3ByaW1pdGl2ZXMvdHlwZXNcIjtcbmltcG9ydCB0eXBlIHsgUmVuZGVyQ29udGV4dCB9IGZyb20gXCJAY2FudmFzL3JlbmRlci9SZW5kZXJDb250ZXh0XCI7XG5pbXBvcnQgeyBCaW5kaW5nIH0gZnJvbSBcIkBjb25maWcvYmluZGluZ3NcIjtcbmltcG9ydCB7IGltYWdlTWlzc2luZ0NvbG9yIH0gZnJvbSBcIkBjb25maWcvZHJhd1wiO1xuXG5pbnRlcmZhY2UgSW1hZ2VWYXJpYW50RGVmaW5pdGlvbiB7XG4gICAgd2lkdGg6IG51bWJlcjtcbiAgICBoZWlnaHQ6IG51bWJlcjtcbiAgICB1cmw6IHN0cmluZztcbn1cblxuZXhwb3J0IGNsYXNzIEltYWdlVmFyaWFudCB7XG4gICAgcmVhZG9ubHkgc2l6ZTogVmVjdG9yMjtcbiAgICByZWFkb25seSBzY2FsZTogbnVtYmVyO1xuXG4gICAgcmVhZG9ubHkgdXJsOiBzdHJpbmc7XG5cbiAgICBwcml2YXRlIF9pbWFnZTogT3B0aW9uYWw8SFRNTEltYWdlRWxlbWVudD47XG4gICAgcHJpdmF0ZSBfcGVuZGluZ1Byb21pc2U6IE9wdGlvbmFsPFByb21pc2U8dm9pZD4+O1xuXG4gICAgY29uc3RydWN0b3IoXG4gICAgICAgIGRlZmluaXRpb246IEltYWdlVmFyaWFudERlZmluaXRpb24sXG4gICAgICAgIG9yaWdpbmFsOiBJbWFnZVZhcmlhbnREZWZpbml0aW9uID0gZGVmaW5pdGlvbixcbiAgICApIHtcbiAgICAgICAgdGhpcy51cmwgPSBkZWZpbml0aW9uLnVybDtcbiAgICAgICAgdGhpcy5zaXplID0gbmV3IFZlY3RvcjIoZGVmaW5pdGlvbi53aWR0aCwgZGVmaW5pdGlvbi5oZWlnaHQpO1xuICAgICAgICB0aGlzLnNjYWxlID0gZGVmaW5pdGlvbi53aWR0aCAvIG9yaWdpbmFsLndpZHRoO1xuICAgIH1cblxuICAgIHB1YmxpYyBnZXQgaW1hZ2UoKTogT3B0aW9uYWw8SFRNTEltYWdlRWxlbWVudD4ge1xuICAgICAgICByZXR1cm4gdGhpcy5faW1hZ2U7XG4gICAgfVxuXG4gICAgcHVibGljIGxvYWQoKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgICAgIGlmICh0aGlzLl9wZW5kaW5nUHJvbWlzZSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICB0aGlzLl9wZW5kaW5nUHJvbWlzZSA9IG5ldyBQcm9taXNlPHZvaWQ+KChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5faW1hZ2UgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gcmVzb2x2ZSgpO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGNvbnN0IGltYWdlID0gbmV3IEltYWdlKCk7XG4gICAgICAgICAgICAgICAgaW1hZ2Uub25sb2FkID0gKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl9pbWFnZSA9IGltYWdlO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl9wZW5kaW5nUHJvbWlzZSA9IHVuZGVmaW5lZDtcbiAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZSgpO1xuICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgaW1hZ2Uub25lcnJvciA9IGUgPT4ge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl9wZW5kaW5nUHJvbWlzZSA9IHVuZGVmaW5lZDtcbiAgICAgICAgICAgICAgICAgICAgcmVqZWN0KGUpO1xuICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgaW1hZ2Uuc3JjID0gdGhpcy51cmw7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiB0aGlzLl9wZW5kaW5nUHJvbWlzZTtcbiAgICB9XG5cbiAgICBwdWJsaWMgdW5sb2FkKCk6IHZvaWQge1xuICAgICAgICB0aGlzLl9pbWFnZSA9IHVuZGVmaW5lZDtcbiAgICB9XG59XG5cbmV4cG9ydCBjbGFzcyBJbWFnZVNldCB7XG4gICAgcmVhZG9ubHkgb3JpZ2luYWw6IEltYWdlVmFyaWFudDtcbiAgICByZWFkb25seSB2YXJpYW50czogSW1hZ2VWYXJpYW50W107XG5cbiAgICBwcml2YXRlIGJlc3RMb2FkZWQ6IE9wdGlvbmFsPEltYWdlVmFyaWFudD47XG5cbiAgICBjb25zdHJ1Y3RvcihcbiAgICAgICAgb3JpZ2luYWw6IEltYWdlVmFyaWFudERlZmluaXRpb24sXG4gICAgICAgIHRodW1ibmFpbHM6IEltYWdlVmFyaWFudERlZmluaXRpb25bXSA9IFtdLFxuICAgICkge1xuICAgICAgICB0aGlzLm9yaWdpbmFsID0gbmV3IEltYWdlVmFyaWFudChvcmlnaW5hbCk7XG5cbiAgICAgICAgY29uc3QgdmFyaWFudHMgPSBbb3JpZ2luYWwsIC4uLnRodW1ibmFpbHNdLm1hcChcbiAgICAgICAgICAgIGRlZiA9PiBuZXcgSW1hZ2VWYXJpYW50KGRlZiwgb3JpZ2luYWwpLFxuICAgICAgICApO1xuICAgICAgICB0aGlzLnZhcmlhbnRzID0gdmFyaWFudHMuc29ydCgoYSwgYikgPT4gYS5zY2FsZSAtIGIuc2NhbGUpO1xuICAgIH1cblxuICAgIHB1YmxpYyBsb2FkKFxuICAgICAgICBzY2FsZTogbnVtYmVyLFxuICAgICk6IFtPcHRpb25hbDxJbWFnZVZhcmlhbnQ+LCBPcHRpb25hbDxQcm9taXNlPHZvaWQ+Pl0ge1xuICAgICAgICBsZXQgcHJvbWlzZTogT3B0aW9uYWw8UHJvbWlzZTx2b2lkPj4gPSB1bmRlZmluZWQ7XG5cbiAgICAgICAgY29uc3QgdmFyaWFudCA9IHRoaXMuZ2V0KHNjYWxlKTtcblxuICAgICAgICBpZiAoXG4gICAgICAgICAgICB0aGlzLmJlc3RMb2FkZWQgPT09IHVuZGVmaW5lZCB8fFxuICAgICAgICAgICAgdmFyaWFudC5zY2FsZSA+IHRoaXMuYmVzdExvYWRlZC5zY2FsZVxuICAgICAgICApIHtcbiAgICAgICAgICAgIC8vIFRPRE86IGRlYm91bmNlIHRvIG5vdCBsb2FkIGludGVybWVkaWF0ZXMgZHVyaW5nIHpvb21pbmdcbiAgICAgICAgICAgIHByb21pc2UgPSB0aGlzLmxvYWRWYXJpYW50KHZhcmlhbnQpO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgY3VycmVudCA9IHZhcmlhbnQuaW1hZ2UgPT09IHVuZGVmaW5lZCA/IHRoaXMuYmVzdExvYWRlZCA6IHZhcmlhbnQ7XG5cbiAgICAgICAgcmV0dXJuIFtjdXJyZW50LCBwcm9taXNlXTtcbiAgICB9XG5cbiAgICBwcml2YXRlIGxvYWRWYXJpYW50KHZhcmlhbnQ6IEltYWdlVmFyaWFudCk6IFByb21pc2U8dm9pZD4ge1xuICAgICAgICByZXR1cm4gdmFyaWFudFxuICAgICAgICAgICAgLmxvYWQoKVxuICAgICAgICAgICAgLnRoZW4oKCkgPT4ge1xuICAgICAgICAgICAgICAgIGlmIChcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5iZXN0TG9hZGVkID09PSB1bmRlZmluZWQgfHxcbiAgICAgICAgICAgICAgICAgICAgdmFyaWFudC5zY2FsZSA+IHRoaXMuYmVzdExvYWRlZC5zY2FsZVxuICAgICAgICAgICAgICAgICkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmJlc3RMb2FkZWQ/LnVubG9hZCgpO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmJlc3RMb2FkZWQgPSB2YXJpYW50O1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAuY2F0Y2goZSA9PiB7XG4gICAgICAgICAgICAgICAgY29uc29sZS5lcnJvcihlKTtcblxuICAgICAgICAgICAgICAgIGlmICh0aGlzLmJlc3RMb2FkZWQgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgICAgICAvLyBFcnJvciBsb2FkaW5nIGltYWdlXG4gICAgICAgICAgICAgICAgICAgIC8vIFN0aWxsIG1hcmsgdGhpcyBhcyBiZXN0IGxvYWRlZCB0b1xuICAgICAgICAgICAgICAgICAgICAvLyBub3QgdHJpZ2dlciByZWxvYWQgb2YgbWlzc2luZyBpbWFnZVxuXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuYmVzdExvYWRlZCA9IHZhcmlhbnQ7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBnZXQoc2NhbGU6IG51bWJlcik6IEltYWdlVmFyaWFudCB7XG4gICAgICAgIGZvciAoY29uc3QgdmFyaWFudCBvZiB0aGlzLnZhcmlhbnRzKSB7XG4gICAgICAgICAgICBpZiAodmFyaWFudC5zY2FsZSA+PSBzY2FsZSkge1xuICAgICAgICAgICAgICAgIHJldHVybiB2YXJpYW50O1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHRoaXMub3JpZ2luYWw7XG4gICAgfVxufVxuXG5leHBvcnQgY2xhc3MgSW1hZ2VJdGVtIGV4dGVuZHMgQm9hcmRJdGVtIHtcbiAgICByZWFkb25seSBpc0ltYWdlSXRlbSA9IHRydWU7XG5cbiAgICBjb25zdHJ1Y3RvcihcbiAgICAgICAgcmVhZG9ubHkgaW1hZ2VTZXQ6IEltYWdlU2V0LFxuICAgICAgICBwb3NpdGlvbjogVmVjdG9yMixcbiAgICAgICAgcmFkaWFucyA9IDAsXG4gICAgICAgIGlzRml4ZWQgPSBmYWxzZSxcbiAgICAgICAgLy8gU2l6ZSBvZiBjcm9wcGVkIGFuZCBzY2FsZWQgaW1hZ2VcbiAgICAgICAgc2l6ZTogVmVjdG9yMiA9IGltYWdlU2V0Lm9yaWdpbmFsLnNpemUsXG4gICAgICAgIC8vIENyb3Agb2Zmc2V0ICh0b3AtbGVmdCkgb2Ygb3JpZ2luYWwgaW1hZ2VcbiAgICAgICAgcHJpdmF0ZSBfY3JvcDogVmVjdG9yMiA9IFZlY3RvcjIub3JpZ2luLFxuICAgICAgICAvLyBTY2FsZSAob2YgdW5jcm9wcGVkIGltYWdlKSByZWxhdGl2ZSB0byBvcmlnaW5hbCBpbWFnZVxuICAgICAgICBwcml2YXRlIF9zY2FsZSA9IDEsXG4gICAgKSB7XG4gICAgICAgIHN1cGVyKHBvc2l0aW9uLCBzaXplLCByYWRpYW5zLCBpc0ZpeGVkKTtcbiAgICB9XG5cbiAgICBwdWJsaWMgZ2V0IGNyb3AoKTogVmVjdG9yMiB7XG4gICAgICAgIHJldHVybiB0aGlzLl9jcm9wO1xuICAgIH1cblxuICAgIHB1YmxpYyBnZXQgc2NhbGUoKTogbnVtYmVyIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX3NjYWxlO1xuICAgIH1cblxuICAgIHB1YmxpYyBkcmF3KHJlbmRlckN0eDogUmVuZGVyQ29udGV4dCk6IHZvaWQge1xuICAgICAgICBjb25zdCB2aWV3cG9ydCA9IHJlbmRlckN0eC52aWV3cG9ydDtcbiAgICAgICAgY29uc3Qgem9vbUxldmVsID0gdmlld3BvcnQuem9vbUxldmVsO1xuICAgICAgICBjb25zdCBbaW1hZ2VWYXJpYW50LCBvbkxvYWRdID0gdGhpcy5pbWFnZVNldC5sb2FkKFxuICAgICAgICAgICAgem9vbUxldmVsICogdGhpcy5fc2NhbGUsXG4gICAgICAgICk7XG5cbiAgICAgICAgaWYgKG9uTG9hZCAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICB2b2lkIG9uTG9hZC50aGVuKCgpID0+IHtcbiAgICAgICAgICAgICAgICB0aGlzLmJvYXJkPy5tYXJrRGlydHlPYmplY3QodGhpcyk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IHBvc2l0aW9uID0gdGhpcy5wb3NpdGlvbkluVmlld3BvcnQodmlld3BvcnQpO1xuICAgICAgICBjb25zdCBzaXplID0gdGhpcy5zaXplSW5WaWV3cG9ydCh2aWV3cG9ydCk7XG5cbiAgICAgICAgaWYgKGltYWdlVmFyaWFudD8uaW1hZ2UgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgcmVuZGVyQ3R4LmN0eC5maWxsU3R5bGUgPSBpbWFnZU1pc3NpbmdDb2xvcjtcbiAgICAgICAgICAgIHJlbmRlckN0eC5jdHguZmlsbFJlY3QocG9zaXRpb24ueCwgcG9zaXRpb24ueSwgc2l6ZS54LCBzaXplLnkpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgY29uc3Qgc291cmNlUG9zID0gdGhpcy5fY3JvcC5zY2FsZShpbWFnZVZhcmlhbnQuc2NhbGUpO1xuICAgICAgICAgICAgY29uc3Qgc291cmNlU2l6ZSA9IHRoaXMuc2l6ZS5zY2FsZShcbiAgICAgICAgICAgICAgICBpbWFnZVZhcmlhbnQuc2NhbGUgLyB0aGlzLl9zY2FsZSxcbiAgICAgICAgICAgICk7XG5cbiAgICAgICAgICAgIHJlbmRlckN0eC5jdHguZHJhd0ltYWdlKFxuICAgICAgICAgICAgICAgIGltYWdlVmFyaWFudC5pbWFnZSxcbiAgICAgICAgICAgICAgICBzb3VyY2VQb3MueCxcbiAgICAgICAgICAgICAgICBzb3VyY2VQb3MueSxcbiAgICAgICAgICAgICAgICBzb3VyY2VTaXplLngsXG4gICAgICAgICAgICAgICAgc291cmNlU2l6ZS55LFxuICAgICAgICAgICAgICAgIHBvc2l0aW9uLngsXG4gICAgICAgICAgICAgICAgcG9zaXRpb24ueSxcbiAgICAgICAgICAgICAgICBzaXplLngsXG4gICAgICAgICAgICAgICAgc2l6ZS55LFxuICAgICAgICAgICAgKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHByb3RlY3RlZCBvblJlc2l6ZShlOiBSZXNpemVPYmplY3RFdmVudCk6IHZvaWQge1xuICAgICAgICBpZiAodGhpcy5ib2FyZCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCB3b3JsZFNpemUgPSB0aGlzLmJvYXJkLnZpZXdwb3J0LnRvV29ybGRTaXplKGUuc2l6ZSk7XG4gICAgICAgIGNvbnN0IHBvc2l0aXZlU2l6ZSA9IG5ldyBWZWN0b3IyKFxuICAgICAgICAgICAgTWF0aC5tYXgoMSwgd29ybGRTaXplLngpLFxuICAgICAgICAgICAgTWF0aC5tYXgoMSwgd29ybGRTaXplLnkpLFxuICAgICAgICApO1xuXG4gICAgICAgIGlmIChCaW5kaW5nLlJlc2l6ZUNyb3AubW9kaWZpZXJzKGUpKSB7XG4gICAgICAgICAgICBjb25zdCBtYXhTaXplID0gdGhpcy5pbWFnZVNldC5vcmlnaW5hbC5zaXplLnNjYWxlKHRoaXMuX3NjYWxlKTtcbiAgICAgICAgICAgIGNvbnN0IHNjYWxlZENyb3BQb3NpdGlvbiA9IHRoaXMuX2Nyb3Auc2NhbGUodGhpcy5fc2NhbGUpO1xuXG4gICAgICAgICAgICBjb25zdCBuZXdTaXplID0gY3JvcFNpemUoXG4gICAgICAgICAgICAgICAgcG9zaXRpdmVTaXplLFxuICAgICAgICAgICAgICAgIHNjYWxlZENyb3BQb3NpdGlvbixcbiAgICAgICAgICAgICAgICB0aGlzLnNpemUsXG4gICAgICAgICAgICAgICAgZS5maXh0dXJlLFxuICAgICAgICAgICAgICAgIG1heFNpemUsXG4gICAgICAgICAgICApO1xuXG4gICAgICAgICAgICBjb25zdCBbbmV3U2NhbGVkQ3JvcFBvc2l0aW9uXSA9IHdvcmxkU3BhY2VSZXNpemUoXG4gICAgICAgICAgICAgICAgbmV3U2l6ZSxcbiAgICAgICAgICAgICAgICBlLmZpeHR1cmUsXG4gICAgICAgICAgICAgICAgbmV3IEJvdW5kaW5nQm94KHNjYWxlZENyb3BQb3NpdGlvbiwgdGhpcy5zaXplKSxcbiAgICAgICAgICAgICAgICAwLFxuICAgICAgICAgICAgKTtcblxuICAgICAgICAgICAgdGhpcy5fY3JvcCA9IG5ld1NjYWxlZENyb3BQb3NpdGlvbi5zY2FsZSgxLjAgLyB0aGlzLl9zY2FsZSk7XG5cbiAgICAgICAgICAgIFt0aGlzLnBvc2l0aW9uLCB0aGlzLnNpemVdID0gd29ybGRTcGFjZVJlc2l6ZShcbiAgICAgICAgICAgICAgICBuZXdTaXplLFxuICAgICAgICAgICAgICAgIGUuZml4dHVyZSxcbiAgICAgICAgICAgICAgICBuZXcgQm91bmRpbmdCb3godGhpcy5wb3NpdGlvbiwgdGhpcy5zaXplKSxcbiAgICAgICAgICAgICAgICB0aGlzLnJhZGlhbnMsXG4gICAgICAgICAgICApO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgY29uc3QgY3JvcFNjYWxlID1cbiAgICAgICAgICAgICAgICBNYXRoLm1heChwb3NpdGl2ZVNpemUuZXVjbGlkZWFuTm9ybSwgMSkgL1xuICAgICAgICAgICAgICAgIHRoaXMuc2l6ZS5ldWNsaWRlYW5Ob3JtO1xuICAgICAgICAgICAgY29uc3QgbmV3U2l6ZSA9IHRoaXMuc2l6ZS5zY2FsZShjcm9wU2NhbGUpO1xuXG4gICAgICAgICAgICB0aGlzLl9zY2FsZSAqPSBjcm9wU2NhbGU7XG5cbiAgICAgICAgICAgIFt0aGlzLnBvc2l0aW9uLCB0aGlzLnNpemVdID0gd29ybGRTcGFjZVJlc2l6ZShcbiAgICAgICAgICAgICAgICBuZXdTaXplLFxuICAgICAgICAgICAgICAgIGUuZml4dHVyZSxcbiAgICAgICAgICAgICAgICBuZXcgQm91bmRpbmdCb3godGhpcy5wb3NpdGlvbiwgdGhpcy5zaXplKSxcbiAgICAgICAgICAgICAgICB0aGlzLnJhZGlhbnMsXG4gICAgICAgICAgICApO1xuICAgICAgICB9XG4gICAgfVxufVxuXG5leHBvcnQgZnVuY3Rpb24gY3JvcFNpemUoXG4gICAgYXR0ZW1wdGVkU2l6ZTogVmVjdG9yMixcbiAgICBjcm9wUG9zaXRpb246IFZlY3RvcjIsXG4gICAgc2l6ZTogVmVjdG9yMixcbiAgICBmaXh0dXJlOiBBbmNob3JQb2ludCxcbiAgICBtYXhTaXplOiBWZWN0b3IyLFxuKTogVmVjdG9yMiB7XG4gICAgbGV0IHg6IG51bWJlciwgeTogbnVtYmVyO1xuXG4gICAgLy8gWCBheGlzXG4gICAgc3dpdGNoIChmaXh0dXJlKSB7XG4gICAgICAgIGNhc2UgQW5jaG9yUG9pbnQuVG9wTGVmdDpcbiAgICAgICAgY2FzZSBBbmNob3JQb2ludC5Cb3R0b21MZWZ0OlxuICAgICAgICAgICAgeCA9IE1hdGgubWluKG1heFNpemUueCAtIGNyb3BQb3NpdGlvbi54LCBhdHRlbXB0ZWRTaXplLngpO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgQW5jaG9yUG9pbnQuVG9wUmlnaHQ6XG4gICAgICAgIGNhc2UgQW5jaG9yUG9pbnQuQm90dG9tUmlnaHQ6XG4gICAgICAgICAgICB4ID0gTWF0aC5taW4oY3JvcFBvc2l0aW9uLnggKyBzaXplLngsIGF0dGVtcHRlZFNpemUueCk7XG4gICAgfVxuXG4gICAgLy8gWSBheGlzXG4gICAgc3dpdGNoIChmaXh0dXJlKSB7XG4gICAgICAgIGNhc2UgQW5jaG9yUG9pbnQuVG9wTGVmdDpcbiAgICAgICAgY2FzZSBBbmNob3JQb2ludC5Ub3BSaWdodDpcbiAgICAgICAgICAgIHkgPSBNYXRoLm1pbihtYXhTaXplLnkgLSBjcm9wUG9zaXRpb24ueSwgYXR0ZW1wdGVkU2l6ZS55KTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIEFuY2hvclBvaW50LkJvdHRvbVJpZ2h0OlxuICAgICAgICBjYXNlIEFuY2hvclBvaW50LkJvdHRvbUxlZnQ6XG4gICAgICAgICAgICB5ID0gTWF0aC5taW4oY3JvcFBvc2l0aW9uLnkgKyBzaXplLnksIGF0dGVtcHRlZFNpemUueSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIG5ldyBWZWN0b3IyKHgsIHkpO1xufVxuIiwiaW1wb3J0IHsgQm9hcmRJdGVtIH0gZnJvbSBcIkBjYW52YXMvYm9hcmQvb2JqZWN0cy9pdGVtcy9Cb2FyZEl0ZW1cIjtcbmltcG9ydCB0eXBlIHsgVmVjdG9yMiB9IGZyb20gXCJAY2FudmFzL3ByaW1pdGl2ZXMvc3BhY2VcIjtcbmltcG9ydCB0eXBlIHsgUmVuZGVyQ29udGV4dCB9IGZyb20gXCJAY2FudmFzL3JlbmRlci9SZW5kZXJDb250ZXh0XCI7XG5pbXBvcnQgeyBkZWZhdWx0RmlsbENvbG9yIH0gZnJvbSBcIkBjb25maWcvZHJhd1wiO1xuXG5leHBvcnQgY2xhc3MgUmVjdGFuZ2xlIGV4dGVuZHMgQm9hcmRJdGVtIHtcbiAgICBjb25zdHJ1Y3RvcihcbiAgICAgICAgcHVibGljIGZpbGxDb2xvcjogc3RyaW5nID0gZGVmYXVsdEZpbGxDb2xvcixcbiAgICAgICAgcG9zaXRpb246IFZlY3RvcjIsXG4gICAgICAgIHNpemU6IFZlY3RvcjIsXG4gICAgICAgIHJhZGlhbnMgPSAwLFxuICAgICAgICBpc0ZpeGVkID0gZmFsc2UsXG4gICAgKSB7XG4gICAgICAgIHN1cGVyKHBvc2l0aW9uLCBzaXplLCByYWRpYW5zLCBpc0ZpeGVkKTtcbiAgICB9XG5cbiAgICBwdWJsaWMgZHJhdyhyZW5kZXJDdHg6IFJlbmRlckNvbnRleHQpOiB2b2lkIHtcbiAgICAgICAgY29uc3Qgdmlld3BvcnQgPSByZW5kZXJDdHgudmlld3BvcnQ7XG4gICAgICAgIGNvbnN0IHBvc2l0aW9uID0gdGhpcy5wb3NpdGlvbkluVmlld3BvcnQodmlld3BvcnQpO1xuICAgICAgICBjb25zdCBzaXplID0gdGhpcy5zaXplSW5WaWV3cG9ydCh2aWV3cG9ydCk7XG5cbiAgICAgICAgcmVuZGVyQ3R4LmN0eC5maWxsU3R5bGUgPSB0aGlzLmZpbGxDb2xvcjtcbiAgICAgICAgcmVuZGVyQ3R4LmN0eC5maWxsUmVjdChwb3NpdGlvbi54LCBwb3NpdGlvbi55LCBzaXplLngsIHNpemUueSk7XG4gICAgfVxufVxuIiwiaW1wb3J0IHR5cGUgeyBCb2FyZCB9IGZyb20gXCJAY2FudmFzL2JvYXJkL0JvYXJkXCI7XG5pbXBvcnQgdHlwZSB7IEZvbnQgfSBmcm9tIFwiQGNhbnZhcy9ib2FyZC9jb250cm9sbGVycy9ib2FyZC9Gb250Q29udHJvbGxlclwiO1xuaW1wb3J0IHsgVmVjdG9yMiB9IGZyb20gXCJAY2FudmFzL3ByaW1pdGl2ZXMvc3BhY2VcIjtcbmltcG9ydCB0eXBlIHsgT3B0aW9uYWwgfSBmcm9tIFwiQGNhbnZhcy9wcmltaXRpdmVzL3R5cGVzXCI7XG5pbXBvcnQgdHlwZSB7IFJlbmRlckNvbnRleHQgfSBmcm9tIFwiQGNhbnZhcy9yZW5kZXIvUmVuZGVyQ29udGV4dFwiO1xuaW1wb3J0IHR5cGUgeyBWaWV3cG9ydCB9IGZyb20gXCJAY2FudmFzL3JlbmRlci9WaWV3cG9ydFwiO1xuXG5pbXBvcnQgdHlwZSB7IEdlb21ldHJpY09iamVjdCB9IGZyb20gXCIuLi9HZW9tZXRyaWNPYmplY3RcIjtcbmltcG9ydCB7IEJsb2NrVGV4dCB9IGZyb20gXCIuL0Jsb2NrVGV4dFwiO1xuaW1wb3J0IHsgQm9hcmRJdGVtIH0gZnJvbSBcIi4vQm9hcmRJdGVtXCI7XG5cbmV4cG9ydCBjbGFzcyBTdGlja3lOb3RlIGV4dGVuZHMgQm9hcmRJdGVtIHtcbiAgICByZWFkb25seSBpc1N0aWNreU5vdGUgPSB0cnVlO1xuICAgIHJlYWRvbmx5IGJsb2NrVGV4dDogQmxvY2tUZXh0O1xuXG4gICAgY29uc3RydWN0b3IoXG4gICAgICAgIHRleHQ6IHN0cmluZyxcbiAgICAgICAgdGV4dENvbG9yOiBzdHJpbmcsXG4gICAgICAgIHByaXZhdGUgYmdDb2xvcjogc3RyaW5nLFxuICAgICAgICBmb250U2l6ZTogbnVtYmVyLFxuICAgICAgICBmb250OiBGb250LFxuICAgICAgICBwb3NpdGlvbjogVmVjdG9yMixcbiAgICAgICAgc2l6ZTogVmVjdG9yMixcbiAgICAgICAgcmFkaWFucyA9IDAsXG4gICAgICAgIGlzRml4ZWQgPSBmYWxzZSxcbiAgICAgICAgcHJpdmF0ZSBwYWRkaW5nID0gMTAsXG4gICAgKSB7XG4gICAgICAgIHN1cGVyKHBvc2l0aW9uLCBzaXplLCByYWRpYW5zLCBpc0ZpeGVkKTtcblxuICAgICAgICB0aGlzLmJsb2NrVGV4dCA9IG5ldyBCbG9ja1RleHQoXG4gICAgICAgICAgICB0ZXh0LFxuICAgICAgICAgICAgdGV4dENvbG9yLFxuICAgICAgICAgICAgZm9udFNpemUsXG4gICAgICAgICAgICBmb250LFxuICAgICAgICAgICAgdGhpcy5nZXRCbG9ja1RleHRQb3NpdGlvbihwb3NpdGlvbiksXG4gICAgICAgICAgICB0aGlzLmdldEJsb2NrVGV4dFNpemUoc2l6ZSksXG4gICAgICAgICAgICByYWRpYW5zLFxuICAgICAgICAgICAgaXNGaXhlZCxcbiAgICAgICAgKTtcbiAgICB9XG5cbiAgICBwdWJsaWMgZ2V0IHBvc2l0aW9uKCk6IFZlY3RvcjIge1xuICAgICAgICByZXR1cm4gc3VwZXIucG9zaXRpb247XG4gICAgfVxuXG4gICAgcHVibGljIHNldCBwb3NpdGlvbihwb3NpdGlvbjogVmVjdG9yMikge1xuICAgICAgICBzdXBlci5wb3NpdGlvbiA9IHBvc2l0aW9uO1xuICAgICAgICB0aGlzLmJsb2NrVGV4dC5wb3NpdGlvbiA9IHRoaXMuZ2V0QmxvY2tUZXh0UG9zaXRpb24ocG9zaXRpb24pO1xuICAgICAgICB0aGlzLmJsb2NrVGV4dC5tYXJrRGlydHkoKTtcbiAgICB9XG5cbiAgICBwdWJsaWMgZ2V0IHNpemUoKTogVmVjdG9yMiB7XG4gICAgICAgIHJldHVybiBzdXBlci5zaXplO1xuICAgIH1cblxuICAgIHB1YmxpYyBzZXQgc2l6ZShzaXplOiBWZWN0b3IyKSB7XG4gICAgICAgIGNvbnN0IGJvdW5kID0gMiAqIHRoaXMucGFkZGluZztcbiAgICAgICAgY29uc3QgYm91bmRTaXplID0gbmV3IFZlY3RvcjIoXG4gICAgICAgICAgICBzaXplLnggPD0gYm91bmQgPyBib3VuZCA6IHNpemUueCxcbiAgICAgICAgICAgIHNpemUueSA8PSBib3VuZCA/IGJvdW5kIDogc2l6ZS55LFxuICAgICAgICApO1xuXG4gICAgICAgIHN1cGVyLnNpemUgPSBib3VuZFNpemU7XG4gICAgICAgIHRoaXMuYmxvY2tUZXh0LnNpemUgPSB0aGlzLmdldEJsb2NrVGV4dFNpemUoYm91bmRTaXplKTtcbiAgICAgICAgdGhpcy5ibG9ja1RleHQubWFya0RpcnR5KCk7XG4gICAgfVxuXG4gICAgcHVibGljIGRyYXcocmVuZGVyQ3R4OiBSZW5kZXJDb250ZXh0KTogdm9pZCB7XG4gICAgICAgIC8vIE1ha2Ugc3VyZSBzdGlja3kgbm90ZSBpcyBub3Qgc21hbGxlciB0aGFuIGNvbnRhaW5lZCB0ZXh0XG4gICAgICAgIHRoaXMuYmxvY2tUZXh0LnVwZGF0ZUZvclJlbmRlcihyZW5kZXJDdHgpO1xuXG4gICAgICAgIGNvbnN0IGJsb2NrVGV4dFNpemUgPSB0aGlzLmJsb2NrVGV4dC5zaXplO1xuICAgICAgICB0aGlzLl9zaXplID0gbmV3IFZlY3RvcjIoXG4gICAgICAgICAgICBNYXRoLm1heCh0aGlzLl9zaXplLngsIGJsb2NrVGV4dFNpemUueCArIDIgKiB0aGlzLnBhZGRpbmcpLFxuICAgICAgICAgICAgTWF0aC5tYXgodGhpcy5fc2l6ZS55LCBibG9ja1RleHRTaXplLnkgKyAyICogdGhpcy5wYWRkaW5nKSxcbiAgICAgICAgKTtcblxuICAgICAgICAvLyBEcmF3IGJhY2tncm91bmRcbiAgICAgICAgY29uc3Qgdmlld3BvcnQgPSByZW5kZXJDdHgudmlld3BvcnQ7XG4gICAgICAgIGNvbnN0IHBvc2l0aW9uID0gdGhpcy5wb3NpdGlvbkluVmlld3BvcnQodmlld3BvcnQpO1xuICAgICAgICBjb25zdCBzaXplID0gdGhpcy5zaXplSW5WaWV3cG9ydCh2aWV3cG9ydCk7XG5cbiAgICAgICAgcmVuZGVyQ3R4LmN0eC5maWxsU3R5bGUgPSB0aGlzLmJnQ29sb3I7XG4gICAgICAgIHJlbmRlckN0eC5jdHguZmlsbFJlY3QocG9zaXRpb24ueCwgcG9zaXRpb24ueSwgc2l6ZS54LCBzaXplLnkpO1xuXG4gICAgICAgIC8vIERyYXcgdGV4dFxuICAgICAgICB0aGlzLmJsb2NrVGV4dC5kcmF3KHJlbmRlckN0eCk7XG4gICAgfVxuXG4gICAgcHVibGljIG9uU3Bhd24oYm9hcmQ6IEJvYXJkKTogdm9pZCB7XG4gICAgICAgIHN1cGVyLm9uU3Bhd24oYm9hcmQpO1xuICAgICAgICB0aGlzLmJsb2NrVGV4dC5vblNwYXduKGJvYXJkKTtcbiAgICAgICAgdGhpcy5zdWJzY3JpcHRpb25zLnB1c2goXG4gICAgICAgICAgICB0aGlzLmJvYXJkLm9uRGlydHkubGlzdGVuKHRoaXMuYmxvY2tUZXh0LCAoKSA9PiB7XG4gICAgICAgICAgICAgICAgdGhpcy5ib2FyZC5tYXJrRGlydHlPYmplY3QodGhpcyk7XG4gICAgICAgICAgICB9KSxcbiAgICAgICAgKTtcbiAgICB9XG5cbiAgICBwdWJsaWMgb25EZXNwYXduKGJvYXJkOiBCb2FyZCk6IHZvaWQge1xuICAgICAgICB0aGlzLmJsb2NrVGV4dC5vbkRlc3Bhd24oYm9hcmQpO1xuICAgICAgICBzdXBlci5vbkRlc3Bhd24oYm9hcmQpO1xuICAgIH1cblxuICAgIHB1YmxpYyBjYXN0UmF5KFxuICAgICAgICBwb3NpdGlvbjogVmVjdG9yMixcbiAgICAgICAgdmlld3BvcnQ6IFZpZXdwb3J0LFxuICAgICk6IE9wdGlvbmFsPEdlb21ldHJpY09iamVjdFtdPiB7XG4gICAgICAgIGNvbnN0IHN0YWNrID0gc3VwZXIuY2FzdFJheShwb3NpdGlvbiwgdmlld3BvcnQpO1xuXG4gICAgICAgIGlmIChzdGFjayAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICBzdGFjay51bnNoaWZ0KHRoaXMuYmxvY2tUZXh0KTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBzdGFjaztcbiAgICB9XG5cbiAgICBwcml2YXRlIGdldEJsb2NrVGV4dFBvc2l0aW9uKHBvc2l0aW9uOiBWZWN0b3IyKTogVmVjdG9yMiB7XG4gICAgICAgIHJldHVybiBwb3NpdGlvbi5wbHVzKG5ldyBWZWN0b3IyKHRoaXMucGFkZGluZywgdGhpcy5wYWRkaW5nKSk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBnZXRCbG9ja1RleHRTaXplKHNpemU6IFZlY3RvcjIpOiBWZWN0b3IyIHtcbiAgICAgICAgcmV0dXJuIHNpemUubWludXMobmV3IFZlY3RvcjIoMiAqIHRoaXMucGFkZGluZywgMiAqIHRoaXMucGFkZGluZykpO1xuICAgIH1cbn1cbiIsImltcG9ydCB0eXBlIHsgRm9udCB9IGZyb20gXCJAY2FudmFzL2JvYXJkL2NvbnRyb2xsZXJzL2JvYXJkL0ZvbnRDb250cm9sbGVyXCI7XG5pbXBvcnQgdHlwZSB7IFJlc2l6ZU9iamVjdEV2ZW50IH0gZnJvbSBcIkBjYW52YXMvYm9hcmQvY29udHJvbGxlcnMvb2JqZWN0cy9SZXNpemVPYmplY3RDb250cm9sbGVyXCI7XG5pbXBvcnQgeyB3b3JsZFNwYWNlUmVzaXplIH0gZnJvbSBcIkBjYW52YXMvYm9hcmQvY29udHJvbGxlcnMvb2JqZWN0cy9SZXNpemVPYmplY3RDb250cm9sbGVyXCI7XG5pbXBvcnQgeyBBbmNob3JQb2ludCB9IGZyb20gXCJAY2FudmFzL2JvYXJkL29iamVjdHMvZm91bmRhdGlvbi9Qb3NpdGlvbkFuY2hvclwiO1xuaW1wb3J0IHtcbiAgICBNRUFTVVJFX0ZPTlRfU0laRSxcbiAgICBUZXh0SXRlbSxcbn0gZnJvbSBcIkBjYW52YXMvYm9hcmQvb2JqZWN0cy9pdGVtcy9UZXh0SXRlbVwiO1xuaW1wb3J0IHsgQm91bmRpbmdCb3gsIFZlY3RvcjIgfSBmcm9tIFwiQGNhbnZhcy9wcmltaXRpdmVzL3NwYWNlXCI7XG5pbXBvcnQgdHlwZSB7IE9wdGlvbmFsIH0gZnJvbSBcIkBjYW52YXMvcHJpbWl0aXZlcy90eXBlc1wiO1xuaW1wb3J0IHR5cGUgeyBSZW5kZXJDb250ZXh0IH0gZnJvbSBcIkBjYW52YXMvcmVuZGVyL1JlbmRlckNvbnRleHRcIjtcbmltcG9ydCB7IG1heEZvbnRTaXplLCBtaW5Gb250U2l6ZSB9IGZyb20gXCJAY29uZmlnL2RyYXdcIjtcblxuZXhwb3J0IGNsYXNzIFN0eWxlZFRleHQgZXh0ZW5kcyBUZXh0SXRlbSB7XG4gICAgcmVhZG9ubHkgaXNTdHlsZWRUZXh0ID0gdHJ1ZTtcblxuICAgIGNvbnN0cnVjdG9yKFxuICAgICAgICB0ZXh0OiBzdHJpbmcsXG4gICAgICAgIHRleHRDb2xvcjogc3RyaW5nLFxuICAgICAgICBmb250U2l6ZTogbnVtYmVyLFxuICAgICAgICBmb250OiBGb250LFxuICAgICAgICBwb3NpdGlvbjogVmVjdG9yMixcbiAgICAgICAgcmFkaWFucyA9IDAsXG4gICAgICAgIGlzRml4ZWQgPSBmYWxzZSxcbiAgICApIHtcbiAgICAgICAgc3VwZXIoXG4gICAgICAgICAgICB0ZXh0Q29sb3IsXG4gICAgICAgICAgICBmb250U2l6ZSxcbiAgICAgICAgICAgIGZvbnQsXG4gICAgICAgICAgICBwb3NpdGlvbixcbiAgICAgICAgICAgIFZlY3RvcjIub3JpZ2luLFxuICAgICAgICAgICAgcmFkaWFucyxcbiAgICAgICAgICAgIGlzRml4ZWQsXG4gICAgICAgICk7XG4gICAgICAgIHRoaXMudGV4dCA9IHRleHQ7XG4gICAgfVxuXG4gICAgcHVibGljIGdldCB0ZXh0KCk6IHN0cmluZyB7XG4gICAgICAgIHJldHVybiB0aGlzLmxpbmVzLmpvaW4oXCJcXG5cIik7XG4gICAgfVxuXG4gICAgcHVibGljIHNldCB0ZXh0KHRleHQ6IHN0cmluZykge1xuICAgICAgICB0aGlzLmxpbmVzID0gdGV4dC5zcGxpdChcIlxcblwiKTtcbiAgICAgICAgdGhpcy5tYXJrRGlydHkoKTtcbiAgICB9XG5cbiAgICBwdWJsaWMgZHJhdyhyZW5kZXJDdHg6IFJlbmRlckNvbnRleHQpOiB2b2lkIHtcbiAgICAgICAgaWYgKHRoaXMuZGlydHlUZXh0IHx8IHRoaXMuY29tcHV0ZUluaXRpYWwpIHtcbiAgICAgICAgICAgIHRoaXMudXBkYXRlU2l6ZShyZW5kZXJDdHgpO1xuICAgICAgICAgICAgdGhpcy5kaXJ0eVRleHQgPSBmYWxzZTtcbiAgICAgICAgICAgIHRoaXMuY29tcHV0ZUluaXRpYWwgPSBmYWxzZTtcbiAgICAgICAgfVxuXG4gICAgICAgIHN1cGVyLmRyYXcocmVuZGVyQ3R4KTtcbiAgICB9XG5cbiAgICBwcm90ZWN0ZWQgb25SZXNpemUoZTogUmVzaXplT2JqZWN0RXZlbnQpOiB2b2lkIHtcbiAgICAgICAgaWYgKHRoaXMuYm9hcmQgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3Qgd29ybGRTaXplID0gdGhpcy5ib2FyZC52aWV3cG9ydC50b1dvcmxkU2l6ZShlLnNpemUpO1xuXG4gICAgICAgIGNvbnN0IGZvbnRTaXplID0gdGhpcy5mb250U2l6ZUZyb21Cb3hTaXplKHdvcmxkU2l6ZSk7XG4gICAgICAgIGNvbnN0IHNpemVSYXRpbyA9IGZvbnRTaXplIC8gdGhpcy5fZm9udFNpemU7XG4gICAgICAgIGNvbnN0IG5ld1NpemUgPSB0aGlzLnNpemUuc2NhbGUoc2l6ZVJhdGlvKTtcblxuICAgICAgICB0aGlzLl9mb250U2l6ZSA9IGZvbnRTaXplO1xuICAgICAgICB0aGlzLmFzY2VudCAqPSBzaXplUmF0aW87XG5cbiAgICAgICAgW3RoaXMucG9zaXRpb24sIHRoaXMuc2l6ZV0gPSB3b3JsZFNwYWNlUmVzaXplKFxuICAgICAgICAgICAgbmV3U2l6ZSxcbiAgICAgICAgICAgIGUuZml4dHVyZSxcbiAgICAgICAgICAgIG5ldyBCb3VuZGluZ0JveCh0aGlzLnBvc2l0aW9uLCB0aGlzLnNpemUpLFxuICAgICAgICAgICAgdGhpcy5yYWRpYW5zLFxuICAgICAgICApO1xuICAgIH1cblxuICAgIHByb3RlY3RlZCB1cGRhdGVUZXh0YXJlYSgpOiB2b2lkIHtcbiAgICAgICAgaWYgKHRoaXMudGV4dGFyZWEgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3Qgdmlld3BvcnQgPSB0aGlzLmJvYXJkLnZpZXdwb3J0O1xuICAgICAgICBjb25zdCBiYiA9IHRoaXMuYm91bmRpbmdCb3godmlld3BvcnQpO1xuICAgICAgICBjb25zdCBmb250U2l6ZSA9IHZpZXdwb3J0Lnpvb21MZXZlbCAqIHRoaXMuX2ZvbnRTaXplO1xuXG4gICAgICAgIHRoaXMudGV4dGFyZWEuc3R5bGUubGVmdCA9IGAke2JiLnBvc2l0aW9uLnh9cHhgO1xuICAgICAgICB0aGlzLnRleHRhcmVhLnN0eWxlLnRvcCA9IGAke2JiLnBvc2l0aW9uLnl9cHhgO1xuXG4gICAgICAgIC8vIE1ha2UgdGV4dGFyZWEgbGFyZ2VyIHRoYW4gY3VycmVudCB0ZXh0IHRvIHByZXZlbnQgbmV3LWxpbmVzXG4gICAgICAgIC8vIEJlZm9yZSBzaXplIGlzIHVwZGF0ZWQgYWdhaW5cbiAgICAgICAgdGhpcy50ZXh0YXJlYS5zdHlsZS53aWR0aCA9IGAke2JiLnNpemUueCArIDUgKiBmb250U2l6ZX1weGA7XG4gICAgICAgIHRoaXMudGV4dGFyZWEuc3R5bGUuaGVpZ2h0ID0gYCR7YmIuc2l6ZS55ICsgMiAqIGZvbnRTaXplfXB4YDtcblxuICAgICAgICBpZiAodGhpcy5yYWRpYW5zICE9IDApIHtcbiAgICAgICAgICAgIHRoaXMudGV4dGFyZWEuc3R5bGUudHJhbnNmb3JtID0gYHJvdGF0ZSgke3RoaXMucmFkaWFuc31yYWQpYDtcbiAgICAgICAgICAgIHRoaXMudGV4dGFyZWEuc3R5bGUudHJhbnNmb3JtT3JpZ2luID0gYCR7YmIuc2l6ZS54IC8gMn1weCAke1xuICAgICAgICAgICAgICAgIGJiLnNpemUueSAvIDJcbiAgICAgICAgICAgIH1weGA7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLnRleHRhcmVhLnN0eWxlLmZvbnQgPSB0aGlzLmZvbnQudG9Dc3MoZm9udFNpemUpO1xuICAgICAgICB0aGlzLnRleHRhcmVhLnN0eWxlLmxpbmVIZWlnaHQgPSBgJHtmb250U2l6ZX1weGA7XG5cbiAgICAgICAgdGhpcy50ZXh0YXJlYS5zY3JvbGxUb3AgPSAwO1xuICAgIH1cblxuICAgIHByaXZhdGUgZm9udFNpemVGcm9tQm94U2l6ZShzaXplOiBWZWN0b3IyKTogT3B0aW9uYWw8bnVtYmVyPiB7XG4gICAgICAgIGNvbnN0IHdpZHRoUmF0aW8gPSBNYXRoLm1heCgxLCBzaXplLngpIC8gTWF0aC5tYXgoMSwgdGhpcy5fc2l6ZS54KTtcbiAgICAgICAgY29uc3QgaGVpZ2h0UmF0aW8gPSBNYXRoLm1heCgxLCBzaXplLnkpIC8gTWF0aC5tYXgoMSwgdGhpcy5fc2l6ZS55KTtcbiAgICAgICAgY29uc3QgcmF0aW8gPSAod2lkdGhSYXRpbyArIGhlaWdodFJhdGlvKSAvIDI7XG5cbiAgICAgICAgLy8gTm90ZTogTWF4IGZvbnQgc2l6ZSB3aXRoIG1pbiB6b29tIGRvZXMgbm90IHdvcmsgaW4gRmlyZWZveFxuICAgICAgICByZXR1cm4gTWF0aC5taW4oXG4gICAgICAgICAgICBtYXhGb250U2l6ZSxcbiAgICAgICAgICAgIE1hdGgubWF4KG1pbkZvbnRTaXplLCB0aGlzLl9mb250U2l6ZSAqIHJhdGlvKSxcbiAgICAgICAgKTtcbiAgICB9XG5cbiAgICBwcml2YXRlIHVwZGF0ZVNpemUocmVuZGVyQ3R4OiBSZW5kZXJDb250ZXh0KTogdm9pZCB7XG4gICAgICAgIGNvbnN0IG1lYXN1cmVGb250U2l6ZSA9IE1hdGgubWluKE1FQVNVUkVfRk9OVF9TSVpFLCB0aGlzLl9mb250U2l6ZSk7XG4gICAgICAgIGNvbnN0IGZvbnRTaXplUmF0aW8gPSB0aGlzLl9mb250U2l6ZSAvIG1lYXN1cmVGb250U2l6ZTtcblxuICAgICAgICBjb25zdCBtZXRyaWNzID0gbWVhc3VyZVRleHQoXG4gICAgICAgICAgICB0aGlzLmxpbmVzLFxuICAgICAgICAgICAgdGhpcy5mb250LnRvQ3NzKG1lYXN1cmVGb250U2l6ZSksXG4gICAgICAgICAgICByZW5kZXJDdHgsXG4gICAgICAgICk7XG5cbiAgICAgICAgY29uc3QgbWF4V2lkdGggPSBNYXRoLm1heCguLi5tZXRyaWNzLm1hcChtID0+IG0ud2lkdGgpKTtcblxuICAgICAgICBjb25zdCB3aWR0aCA9IG1heFdpZHRoICogZm9udFNpemVSYXRpbztcbiAgICAgICAgY29uc3QgaGVpZ2h0ID0gbWV0cmljcy5sZW5ndGggKiB0aGlzLl9mb250U2l6ZTtcblxuICAgICAgICBjb25zdCBmaXJzdE5vblplcm9Bc2NlbnQgPSBtZXRyaWNzXG4gICAgICAgICAgICAubWFwKG0gPT4gbS5hY3R1YWxCb3VuZGluZ0JveEFzY2VudClcbiAgICAgICAgICAgIC5yZWR1Y2UoKGEsIGIpID0+IGEgfHwgYiwgMCk7XG5cbiAgICAgICAgdGhpcy5hc2NlbnQgPSBmaXJzdE5vblplcm9Bc2NlbnQgKiBmb250U2l6ZVJhdGlvO1xuXG4gICAgICAgIGNvbnN0IG5ld1NpemUgPSBuZXcgVmVjdG9yMih3aWR0aCwgaGVpZ2h0KTtcblxuICAgICAgICBpZiAodGhpcy5jb21wdXRlSW5pdGlhbCkge1xuICAgICAgICAgICAgdGhpcy5zaXplID0gbmV3U2l6ZTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIFt0aGlzLnBvc2l0aW9uLCB0aGlzLnNpemVdID0gd29ybGRTcGFjZVJlc2l6ZShcbiAgICAgICAgICAgICAgICBuZXdTaXplLFxuICAgICAgICAgICAgICAgIEFuY2hvclBvaW50LlRvcExlZnQsXG4gICAgICAgICAgICAgICAgbmV3IEJvdW5kaW5nQm94KHRoaXMucG9zaXRpb24sIHRoaXMuX3NpemUpLFxuICAgICAgICAgICAgICAgIHRoaXMucmFkaWFucyxcbiAgICAgICAgICAgICk7XG4gICAgICAgIH1cbiAgICB9XG59XG5cbmZ1bmN0aW9uIG1lYXN1cmVUZXh0KFxuICAgIGxpbmVzOiBzdHJpbmdbXSxcbiAgICBmb250OiBzdHJpbmcsXG4gICAgcmVuZGVyQ3R4OiBSZW5kZXJDb250ZXh0LFxuKTogVGV4dE1ldHJpY3NbXSB7XG4gICAgcmVuZGVyQ3R4LmN0eC5zYXZlKCk7XG5cbiAgICByZW5kZXJDdHguY3R4LmZvbnQgPSBmb250O1xuICAgIGNvbnN0IG1ldHJpY3MgPSBsaW5lcy5tYXAobGluZSA9PiByZW5kZXJDdHguY3R4Lm1lYXN1cmVUZXh0KGxpbmUpKTtcblxuICAgIHJlbmRlckN0eC5jdHgucmVzdG9yZSgpO1xuXG4gICAgcmV0dXJuIG1ldHJpY3M7XG59XG4iLCJpbXBvcnQgdHlwZSB7IEJvYXJkIH0gZnJvbSBcIkBjYW52YXMvYm9hcmQvQm9hcmRcIjtcbmltcG9ydCB0eXBlIHsgRm9udCB9IGZyb20gXCJAY2FudmFzL2JvYXJkL2NvbnRyb2xsZXJzL2JvYXJkL0ZvbnRDb250cm9sbGVyXCI7XG5pbXBvcnQgeyBnZXRGb250SWRlbnRpZmllciB9IGZyb20gXCJAY2FudmFzL2JvYXJkL2NvbnRyb2xsZXJzL2JvYXJkL0ZvbnRDb250cm9sbGVyXCI7XG5pbXBvcnQgeyBCb2FyZE1vZGUgfSBmcm9tIFwiQGNhbnZhcy9ib2FyZC9jb250cm9sbGVycy9Cb2FyZE1vZGVcIjtcbmltcG9ydCB7IEJvYXJkSXRlbSB9IGZyb20gXCJAY2FudmFzL2JvYXJkL29iamVjdHMvaXRlbXMvQm9hcmRJdGVtXCI7XG5pbXBvcnQgeyByZXNldEN1cnNvciB9IGZyb20gXCJAY2FudmFzL3ByaW1pdGl2ZXMvZG9tXCI7XG5pbXBvcnQgdHlwZSB7IFN1YnNjcmlwdGlvbiB9IGZyb20gXCJAY2FudmFzL3ByaW1pdGl2ZXMvZXZlbnRzXCI7XG5pbXBvcnQgeyB1bnN1YnNjcmliZUFsbCB9IGZyb20gXCJAY2FudmFzL3ByaW1pdGl2ZXMvZXZlbnRzXCI7XG5pbXBvcnQgdHlwZSB7IFZlY3RvcjIgfSBmcm9tIFwiQGNhbnZhcy9wcmltaXRpdmVzL3NwYWNlXCI7XG5pbXBvcnQgdHlwZSB7IE9wdGlvbmFsIH0gZnJvbSBcIkBjYW52YXMvcHJpbWl0aXZlcy90eXBlc1wiO1xuaW1wb3J0IHR5cGUgeyBSZW5kZXJDb250ZXh0IH0gZnJvbSBcIkBjYW52YXMvcmVuZGVyL1JlbmRlckNvbnRleHRcIjtcblxuZXhwb3J0IGNvbnN0IE1FQVNVUkVfRk9OVF9TSVpFID0gMjA7XG5cbmV4cG9ydCBhYnN0cmFjdCBjbGFzcyBUZXh0SXRlbSBleHRlbmRzIEJvYXJkSXRlbSB7XG4gICAgcHJvdGVjdGVkIGxpbmVzOiBzdHJpbmdbXTtcblxuICAgIHByb3RlY3RlZCBjb21wdXRlSW5pdGlhbCA9IHRydWU7XG4gICAgcHJvdGVjdGVkIGRpcnR5VGV4dCA9IGZhbHNlO1xuICAgIHByb3RlY3RlZCBhc2NlbnQgPSAwO1xuXG4gICAgLy8gRWRpdCBtb2RlXG4gICAgcHJvdGVjdGVkIGlzRWRpdGluZyA9IGZhbHNlO1xuICAgIHByb3RlY3RlZCB0ZXh0YXJlYTogT3B0aW9uYWw8SFRNTFRleHRBcmVhRWxlbWVudD47XG4gICAgcHJvdGVjdGVkIGVkaXRTdWJzY3JpcHRpb25zOiBTdWJzY3JpcHRpb25bXSA9IFtdO1xuICAgIHByb3RlY3RlZCBwcmV2aW91c1N0YXRlOiBCb2FyZE1vZGU7XG5cbiAgICBwdWJsaWMgYWJzdHJhY3QgdGV4dDogc3RyaW5nO1xuXG4gICAgY29uc3RydWN0b3IoXG4gICAgICAgIHJlYWRvbmx5IHRleHRDb2xvcjogc3RyaW5nLFxuICAgICAgICBwcm90ZWN0ZWQgX2ZvbnRTaXplOiBudW1iZXIsXG4gICAgICAgIHJlYWRvbmx5IGZvbnQ6IEZvbnQsXG4gICAgICAgIHBvc2l0aW9uOiBWZWN0b3IyLFxuICAgICAgICBzaXplOiBWZWN0b3IyLFxuICAgICAgICByYWRpYW5zID0gMCxcbiAgICAgICAgaXNGaXhlZCA9IGZhbHNlLFxuICAgICkge1xuICAgICAgICBzdXBlcihwb3NpdGlvbiwgc2l6ZSwgcmFkaWFucywgaXNGaXhlZCk7XG4gICAgfVxuXG4gICAgcHVibGljIGdldCBmb250U2l6ZSgpOiBudW1iZXIge1xuICAgICAgICByZXR1cm4gdGhpcy5fZm9udFNpemU7XG4gICAgfVxuXG4gICAgcHVibGljIGRyYXcocmVuZGVyQ3R4OiBSZW5kZXJDb250ZXh0KTogdm9pZCB7XG4gICAgICAgIGlmICh0aGlzLmlzRWRpdGluZykge1xuICAgICAgICAgICAgLy8gRG9uJ3QgZHJhdyB0ZXh0IGR1cmluZyB0ZXh0IGVkaXQgdG8gYXZvaWQgb2Zmc2V0IGFydGlmYWN0c1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3Qgdmlld3BvcnQgPSByZW5kZXJDdHgudmlld3BvcnQ7XG4gICAgICAgIGNvbnN0IHBvc2l0aW9uID0gdGhpcy5wb3NpdGlvbkluVmlld3BvcnQodmlld3BvcnQpO1xuXG4gICAgICAgIHJlbmRlckN0eC5jdHguZmlsbFN0eWxlID0gdGhpcy50ZXh0Q29sb3I7XG4gICAgICAgIHJlbmRlckN0eC5jdHguZm9udCA9IHRoaXMuZm9udC50b0NzcyhcbiAgICAgICAgICAgIHZpZXdwb3J0Lnpvb21MZXZlbCAqIHRoaXMuX2ZvbnRTaXplLFxuICAgICAgICApO1xuXG4gICAgICAgIGNvbnN0IGxpbmVzID0gdGhpcy5saW5lcztcbiAgICAgICAgY29uc3QgbGluZU9mZnNldCA9IHRoaXMuYXNjZW50O1xuXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbGluZXMubGVuZ3RoOyArK2kpIHtcbiAgICAgICAgICAgIGNvbnN0IGxpbmUgPSBsaW5lc1tpXTtcblxuICAgICAgICAgICAgcmVuZGVyQ3R4LmN0eC5maWxsVGV4dChcbiAgICAgICAgICAgICAgICBsaW5lLFxuICAgICAgICAgICAgICAgIHBvc2l0aW9uLngsXG4gICAgICAgICAgICAgICAgcG9zaXRpb24ueSArXG4gICAgICAgICAgICAgICAgICAgIHZpZXdwb3J0Lnpvb21MZXZlbCAqIChsaW5lT2Zmc2V0ICsgaSAqIHRoaXMuX2ZvbnRTaXplKSxcbiAgICAgICAgICAgICk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwdWJsaWMgb25TcGF3bihib2FyZDogQm9hcmQpOiB2b2lkIHtcbiAgICAgICAgc3VwZXIub25TcGF3bihib2FyZCk7XG5cbiAgICAgICAgaWYgKCF0aGlzLmJvYXJkLmNvbmZpZy52aWV3T25seU1vZGUpIHtcbiAgICAgICAgICAgIHRoaXMuc3Vic2NyaXB0aW9ucy5wdXNoKFxuICAgICAgICAgICAgICAgIGJvYXJkLmNvbnRyb2xsZXIubW91c2Uub25Nb3VzZUNsaWNrLmxpc3Rlbih0aGlzLCBlID0+IHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGUuY2xpY2tzID09IDIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGUuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnN0YXJ0RWRpdCgpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSksXG4gICAgICAgICAgICApO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5zdWJzY3JpcHRpb25zLnB1c2goXG4gICAgICAgICAgICBib2FyZC5jb250cm9sbGVyLmZvbnQub25Gb250TG9hZC5saXN0ZW4oXG4gICAgICAgICAgICAgICAgZ2V0Rm9udElkZW50aWZpZXIodGhpcy5mb250LmZvbnRGYW1pbHkpLFxuICAgICAgICAgICAgICAgICgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5tYXJrRGlydHkoKTtcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgKSxcbiAgICAgICAgKTtcbiAgICB9XG5cbiAgICBwdWJsaWMgbWFya0RpcnR5KCk6IHZvaWQge1xuICAgICAgICB0aGlzLmRpcnR5VGV4dCA9IHRydWU7XG4gICAgICAgIHRoaXMuYm9hcmQ/Lm1hcmtEaXJ0eU9iamVjdCh0aGlzKTtcbiAgICB9XG5cbiAgICBwcml2YXRlIHN0YXJ0RWRpdCgpOiB2b2lkIHtcbiAgICAgICAgaWYgKHRoaXMuYm9hcmQgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgcmVzZXRDdXJzb3IoKTtcblxuICAgICAgICBjb25zdCBtb2RlID0gdGhpcy5ib2FyZC5jb250cm9sbGVyLm1vZGU7XG5cbiAgICAgICAgdGhpcy5wcmV2aW91c1N0YXRlID0gbW9kZS5zdGF0ZTtcbiAgICAgICAgbW9kZS5zdGF0ZSA9IEJvYXJkTW9kZS5UZXh0RWRpdGluZztcbiAgICAgICAgdGhpcy5pc0VkaXRpbmcgPSB0cnVlO1xuXG4gICAgICAgIGNvbnN0IHBhcmVudCA9IHRoaXMuYm9hcmQuYm9hcmRFbGVtZW50O1xuICAgICAgICBjb25zdCB0ZXh0YXJlYSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJ0ZXh0YXJlYVwiKTtcbiAgICAgICAgdGhpcy50ZXh0YXJlYSA9IHRleHRhcmVhO1xuXG4gICAgICAgIHRleHRhcmVhLmNsYXNzTmFtZSA9IFwic3R5bGVkLXRleHQtZWRpdFwiO1xuICAgICAgICB0ZXh0YXJlYS5pbm5lckhUTUwgPSB0aGlzLnRleHQ7XG4gICAgICAgIHRleHRhcmVhLnN0eWxlLmNvbG9yID0gdGhpcy50ZXh0Q29sb3I7XG5cbiAgICAgICAgcGFyZW50LmFwcGVuZENoaWxkKHRleHRhcmVhKTtcblxuICAgICAgICAvLyBuZWVkcyB0byBiZSBjYWxsZWQgYWZ0ZXIgYXBwZW5kLCBvdGhlcndpc2UgbGluZS1oZWlnaHQgZG9lcyBub3Qgd29yay5cbiAgICAgICAgdGhpcy51cGRhdGVUZXh0YXJlYSgpO1xuXG4gICAgICAgIC8vIE1ha2Ugc3VyZSBjbGlja3MgaW4gdGV4dGFyZWEgZG9uJ3QgdHJpZ2dlciBib2FyZCBtb3VzZSBpbnRlcmFjdGlvbnNcbiAgICAgICAgdGV4dGFyZWEuYWRkRXZlbnRMaXN0ZW5lcihcIm1vdXNlZG93blwiLCBlID0+IHtcbiAgICAgICAgICAgIGUuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIC8vIENoYW5nZSBldmVudHNcbiAgICAgICAgW1wiY3V0XCIsIFwiY29weVwiLCBcInBhc3RlXCIsIFwia2V5dXBcIiwgXCJtb3VzZXVwXCJdLmZvckVhY2goZXZlbnRUeXBlID0+IHtcbiAgICAgICAgICAgIHRleHRhcmVhLmFkZEV2ZW50TGlzdGVuZXIoZXZlbnRUeXBlLCAoKSA9PiB7XG4gICAgICAgICAgICAgICAgdGhpcy50ZXh0ID0gdGhpcy50ZXh0YXJlYS52YWx1ZTtcbiAgICAgICAgICAgICAgICB0aGlzLnVwZGF0ZVRleHRhcmVhKCk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgdGhpcy5lZGl0U3Vic2NyaXB0aW9ucy5wdXNoKFxuICAgICAgICAgICAgdGhpcy5ib2FyZC5jb250cm9sbGVyLm1vdXNlLm9uTW91c2VEb3duLmxpc3Rlbih1bmRlZmluZWQsICgpID0+IHtcbiAgICAgICAgICAgICAgICB0aGlzLnN0b3BFZGl0KCk7XG4gICAgICAgICAgICB9KSxcbiAgICAgICAgKTtcblxuICAgICAgICAvLyBMaXN0ZW4gdG8gdmlld3BvcnQgY2hhbmdlcyB0byBtb3ZlIHRleGFyZWFcbiAgICAgICAgdGhpcy5ib2FyZC5vbkNoYW5nZVZpZXdwb3J0Lmxpc3Rlbih1bmRlZmluZWQsICgpID0+IHtcbiAgICAgICAgICAgIHRoaXMudXBkYXRlVGV4dGFyZWEoKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgdGhpcy5ib2FyZC5tYXJrRGlydHlPYmplY3QodGhpcyk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBzdG9wRWRpdCgpOiB2b2lkIHtcbiAgICAgICAgY29uc3QgbW9kZSA9IHRoaXMuYm9hcmQuY29udHJvbGxlci5tb2RlO1xuXG4gICAgICAgIGlmIChtb2RlLnN0YXRlID09PSBCb2FyZE1vZGUuVGV4dEVkaXRpbmcpIHtcbiAgICAgICAgICAgIG1vZGUuc3RhdGUgPSB0aGlzLnByZXZpb3VzU3RhdGU7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLmlzRWRpdGluZyA9IGZhbHNlO1xuXG4gICAgICAgIGlmICh0aGlzLnRleHRhcmVhICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIGNvbnN0IHBhcmVudCA9IHRoaXMuYm9hcmQuYm9hcmRFbGVtZW50O1xuXG4gICAgICAgICAgICBwYXJlbnQucmVtb3ZlQ2hpbGQodGhpcy50ZXh0YXJlYSk7XG4gICAgICAgICAgICB0aGlzLnRleHRhcmVhID0gdW5kZWZpbmVkO1xuICAgICAgICB9XG5cbiAgICAgICAgdW5zdWJzY3JpYmVBbGwodGhpcy5lZGl0U3Vic2NyaXB0aW9ucyk7XG4gICAgfVxuXG4gICAgcHJvdGVjdGVkIGFic3RyYWN0IHVwZGF0ZVRleHRhcmVhKCk6IHZvaWQ7XG59XG4iLCJpbXBvcnQgdHlwZSB7IEd1aWRlIH0gZnJvbSBcIkBjYW52YXMvYm9hcmQvY29udHJvbGxlcnMvb2JqZWN0cy9HdWlkZWxpbmVDb250cm9sbGVyXCI7XG5pbXBvcnQgeyBHZW9tZXRyaWNPYmplY3QgfSBmcm9tIFwiQGNhbnZhcy9ib2FyZC9vYmplY3RzL0dlb21ldHJpY09iamVjdFwiO1xuaW1wb3J0IHsgQm91bmRpbmdCb3gsIFZlY3RvcjIgfSBmcm9tIFwiQGNhbnZhcy9wcmltaXRpdmVzL3NwYWNlXCI7XG5pbXBvcnQgdHlwZSB7IFJlbmRlckNvbnRleHQgfSBmcm9tIFwiQGNhbnZhcy9yZW5kZXIvUmVuZGVyQ29udGV4dFwiO1xuXG5leHBvcnQgY2xhc3MgR3VpZGVsaW5lIGV4dGVuZHMgR2VvbWV0cmljT2JqZWN0IHtcbiAgICByZWFkb25seSBpc0d1aWRlbGluZSA9IHRydWU7XG5cbiAgICBjb25zdHJ1Y3RvcihyZWFkb25seSBndWlkZTogR3VpZGUpIHtcbiAgICAgICAgc3VwZXIoKTtcbiAgICB9XG5cbiAgICBwdWJsaWMgYm91bmRpbmdCb3goKTogQm91bmRpbmdCb3gge1xuICAgICAgICByZXR1cm4gbmV3IEJvdW5kaW5nQm94KFZlY3RvcjIub3JpZ2luLCBWZWN0b3IyLm9yaWdpbik7XG4gICAgfVxuXG4gICAgcHVibGljIGRyYXcocmVuZGVyQ3R4OiBSZW5kZXJDb250ZXh0KTogdm9pZCB7XG4gICAgICAgIGNvbnN0IHZpZXdwb3J0ID0gcmVuZGVyQ3R4LnZpZXdwb3J0O1xuICAgICAgICBjb25zdCBjdHggPSByZW5kZXJDdHguY3R4O1xuXG4gICAgICAgIGNvbnN0IHZpZXdQb3NpdGlvbiA9IHZpZXdwb3J0Lm9yaWdpbjtcblxuICAgICAgICBjb25zdCByZWxhdGl2ZVBvcyA9IHRoaXMuZ3VpZGUudmVydGljYWxcbiAgICAgICAgICAgID8gdmlld1Bvc2l0aW9uLnhcbiAgICAgICAgICAgIDogdmlld1Bvc2l0aW9uLnk7XG4gICAgICAgIGNvbnN0IHBvcyA9IHZpZXdwb3J0Lnpvb21MZXZlbCAqICh0aGlzLmd1aWRlLnZhbHVlIC0gcmVsYXRpdmVQb3MpO1xuXG4gICAgICAgIGN0eC5iZWdpblBhdGgoKTtcbiAgICAgICAgY3R4Lm1vdmVUbyhcbiAgICAgICAgICAgIHRoaXMuZ3VpZGUudmVydGljYWwgPyBwb3MgOiAwLFxuICAgICAgICAgICAgdGhpcy5ndWlkZS52ZXJ0aWNhbCA/IDAgOiBwb3MsXG4gICAgICAgICk7XG4gICAgICAgIGN0eC5saW5lVG8oXG4gICAgICAgICAgICB0aGlzLmd1aWRlLnZlcnRpY2FsID8gcG9zIDogdmlld3BvcnQuc2l6ZS54LFxuICAgICAgICAgICAgdGhpcy5ndWlkZS52ZXJ0aWNhbCA/IHZpZXdwb3J0LnNpemUueSA6IHBvcyxcbiAgICAgICAgKTtcbiAgICAgICAgY3R4LnN0cm9rZSgpO1xuICAgIH1cbn1cbiIsImltcG9ydCB7IEdlb21ldHJpY09iamVjdCB9IGZyb20gXCJAY2FudmFzL2JvYXJkL29iamVjdHMvR2VvbWV0cmljT2JqZWN0XCI7XG5pbXBvcnQgeyBCb3VuZGluZ0JveCwgVmVjdG9yMiB9IGZyb20gXCJAY2FudmFzL3ByaW1pdGl2ZXMvc3BhY2VcIjtcbmltcG9ydCB0eXBlIHsgUmVuZGVyQ29udGV4dCB9IGZyb20gXCJAY2FudmFzL3JlbmRlci9SZW5kZXJDb250ZXh0XCI7XG5pbXBvcnQgdHlwZSB7IFZpZXdwb3J0IH0gZnJvbSBcIkBjYW52YXMvcmVuZGVyL1ZpZXdwb3J0XCI7XG5pbXBvcnQgeyBkZWZhdWx0RnJhbWVDb2xvciwgZGVmYXVsdEZyYW1lRmlsbCB9IGZyb20gXCJAY29uZmlnL2RyYXdcIjtcblxuZXhwb3J0IGNsYXNzIFNlbGVjdEJveEZyYW1lIGV4dGVuZHMgR2VvbWV0cmljT2JqZWN0IHtcbiAgICBjb25zdHJ1Y3RvcihcbiAgICAgICAgcmVhZG9ubHkgZnJhbWVDb2xvcjogc3RyaW5nID0gZGVmYXVsdEZyYW1lQ29sb3IsXG4gICAgICAgIHJlYWRvbmx5IGZyYW1lV2lkdGggPSAxLFxuICAgICAgICByZWFkb25seSBmaWxsQ29sb3I6IHN0cmluZyA9IGRlZmF1bHRGcmFtZUZpbGwsXG4gICAgICAgIHByaXZhdGUgcG9zaXRpb246IFZlY3RvcjIgPSBWZWN0b3IyLm9yaWdpbixcbiAgICAgICAgcHJpdmF0ZSBzaXplOiBWZWN0b3IyID0gVmVjdG9yMi5vcmlnaW4sXG4gICAgKSB7XG4gICAgICAgIHN1cGVyKCk7XG4gICAgfVxuXG4gICAgcHVibGljIGJvdW5kaW5nQm94KHZpZXdwb3J0OiBWaWV3cG9ydCk6IEJvdW5kaW5nQm94IHtcbiAgICAgICAgY29uc3QgcG9zaXRpb24gPSB2aWV3cG9ydC50b1ZpZXdwb3J0UG9zaXRpb24odGhpcy5wb3NpdGlvbik7XG4gICAgICAgIGNvbnN0IHNpemUgPSB2aWV3cG9ydC50b1ZpZXdwb3J0U2l6ZSh0aGlzLnNpemUpO1xuXG4gICAgICAgIHJldHVybiBuZXcgQm91bmRpbmdCb3gocG9zaXRpb24sIHNpemUpO1xuICAgIH1cblxuICAgIHB1YmxpYyBkcmF3KHJlbmRlckN0eDogUmVuZGVyQ29udGV4dCk6IHZvaWQge1xuICAgICAgICBjb25zdCB2aWV3cG9ydCA9IHJlbmRlckN0eC52aWV3cG9ydDtcbiAgICAgICAgY29uc3QgcG9zaXRpb24gPSB2aWV3cG9ydC50b1ZpZXdwb3J0UG9zaXRpb24odGhpcy5wb3NpdGlvbik7XG4gICAgICAgIGNvbnN0IHNpemUgPSB2aWV3cG9ydC50b1ZpZXdwb3J0U2l6ZSh0aGlzLnNpemUpO1xuXG4gICAgICAgIHJlbmRlckN0eC5jdHguZmlsbFN0eWxlID0gdGhpcy5maWxsQ29sb3I7XG4gICAgICAgIHJlbmRlckN0eC5jdHguZmlsbFJlY3QocG9zaXRpb24ueCwgcG9zaXRpb24ueSwgc2l6ZS54LCBzaXplLnkpO1xuICAgICAgICByZW5kZXJDdHguY3R4LnN0cm9rZVN0eWxlID0gdGhpcy5mcmFtZUNvbG9yO1xuICAgICAgICByZW5kZXJDdHguY3R4LmxpbmVXaWR0aCA9IHRoaXMuZnJhbWVXaWR0aDtcbiAgICAgICAgcmVuZGVyQ3R4LmN0eC5zdHJva2VSZWN0KHBvc2l0aW9uLngsIHBvc2l0aW9uLnksIHNpemUueCwgc2l6ZS55KTtcbiAgICB9XG5cbiAgICBwdWJsaWMgdXBkYXRlU2l6ZShwb3NpdGlvbjogVmVjdG9yMiwgc2l6ZTogVmVjdG9yMik6IHZvaWQge1xuICAgICAgICB0aGlzLnBvc2l0aW9uID0gcG9zaXRpb247XG4gICAgICAgIHRoaXMuc2l6ZSA9IHNpemU7XG5cbiAgICAgICAgaWYgKHRoaXMuYm9hcmQpIHtcbiAgICAgICAgICAgIHRoaXMuYm9hcmQubWFya0RpcnR5T2JqZWN0KHRoaXMpO1xuICAgICAgICB9XG4gICAgfVxufVxuIiwiaW1wb3J0IHsgR2VvbWV0cmljT2JqZWN0IH0gZnJvbSBcIkBjYW52YXMvYm9hcmQvb2JqZWN0cy9HZW9tZXRyaWNPYmplY3RcIjtcbmltcG9ydCB7IEJvdW5kaW5nQm94LCBWZWN0b3IyIH0gZnJvbSBcIkBjYW52YXMvcHJpbWl0aXZlcy9zcGFjZVwiO1xuaW1wb3J0IHR5cGUgeyBSZW5kZXJDb250ZXh0IH0gZnJvbSBcIkBjYW52YXMvcmVuZGVyL1JlbmRlckNvbnRleHRcIjtcblxuZXhwb3J0IGNsYXNzIFdvcmxkQm9yZGVyIGV4dGVuZHMgR2VvbWV0cmljT2JqZWN0IHtcbiAgICBjb25zdHJ1Y3RvcihcbiAgICAgICAgcmVhZG9ubHkgaG9yaXpvbnRhbDogYm9vbGVhbixcbiAgICAgICAgcmVhZG9ubHkgZmlsbENvbG9yOiBzdHJpbmcgPSBcIiM1NTU1NTVcIixcbiAgICAgICAgcmVhZG9ubHkgYm9yZGVyQ29sb3I6IHN0cmluZyA9IFwiIzAwMDAwMFwiLFxuICAgICAgICByZWFkb25seSBib3JkZXJXaWR0aDogbnVtYmVyID0gMS4wLFxuICAgICkge1xuICAgICAgICBzdXBlcigpO1xuICAgIH1cblxuICAgIHB1YmxpYyBib3VuZGluZ0JveCgpOiBCb3VuZGluZ0JveCB7XG4gICAgICAgIHJldHVybiBuZXcgQm91bmRpbmdCb3goVmVjdG9yMi5vcmlnaW4sIFZlY3RvcjIub3JpZ2luKTtcbiAgICB9XG5cbiAgICBwdWJsaWMgZHJhdyhyZW5kZXJDdHg6IFJlbmRlckNvbnRleHQpOiB2b2lkIHtcbiAgICAgICAgY29uc3Qgdmlld3BvcnQgPSByZW5kZXJDdHgudmlld3BvcnQ7XG4gICAgICAgIGNvbnN0IGN0eCA9IHJlbmRlckN0eC5jdHg7XG5cbiAgICAgICAgY29uc3Qgd2lkdGggPSB0aGlzLmhvcml6b250YWxcbiAgICAgICAgICAgID8gdmlld3BvcnQuc2l6ZS54XG4gICAgICAgICAgICA6IC12aWV3cG9ydC5vcmlnaW4ueCAqIHZpZXdwb3J0Lnpvb21MZXZlbDtcbiAgICAgICAgY29uc3QgaGVpZ2h0ID0gdGhpcy5ob3Jpem9udGFsXG4gICAgICAgICAgICA/IC12aWV3cG9ydC5vcmlnaW4ueSAqIHZpZXdwb3J0Lnpvb21MZXZlbFxuICAgICAgICAgICAgOiB2aWV3cG9ydC5zaXplLnk7XG5cbiAgICAgICAgaWYgKHdpZHRoID4gMCAmJiBoZWlnaHQgPiAwKSB7XG4gICAgICAgICAgICAvLyBJbnZhbGlkIGFyZWEgYmFja2dyb3VuZFxuICAgICAgICAgICAgY3R4LmZpbGxTdHlsZSA9IHRoaXMuZmlsbENvbG9yO1xuICAgICAgICAgICAgY3R4LmZpbGxSZWN0KDAsIDAsIHdpZHRoLCBoZWlnaHQpO1xuXG4gICAgICAgICAgICAvLyBCb3JkZXJcbiAgICAgICAgICAgIGN0eC5iZWdpblBhdGgoKTtcbiAgICAgICAgICAgIGN0eC5saW5lV2lkdGggPSB0aGlzLmJvcmRlcldpZHRoO1xuICAgICAgICAgICAgY3R4LnN0cm9rZVN0eWxlID0gdGhpcy5ib3JkZXJDb2xvcjtcbiAgICAgICAgICAgIGN0eC5tb3ZlVG8oXG4gICAgICAgICAgICAgICAgLXZpZXdwb3J0Lm9yaWdpbi54ICogdmlld3BvcnQuem9vbUxldmVsLFxuICAgICAgICAgICAgICAgIC12aWV3cG9ydC5vcmlnaW4ueSAqIHZpZXdwb3J0Lnpvb21MZXZlbCxcbiAgICAgICAgICAgICk7XG4gICAgICAgICAgICBjdHgubGluZVRvKHdpZHRoLCBoZWlnaHQpO1xuICAgICAgICAgICAgY3R4LnN0cm9rZSgpO1xuICAgICAgICB9XG4gICAgfVxufVxuIiwiaW1wb3J0IHsgR3JvdXAgfSBmcm9tIFwiQGNhbnZhcy9ib2FyZC9vYmplY3RzL2ZvdW5kYXRpb24vR3JvdXBcIjtcbmltcG9ydCB0eXBlIHsgU2VsZWN0aW9uT3ZlcmxheSB9IGZyb20gXCJAY2FudmFzL2JvYXJkL29iamVjdHMvdWkvc2VsZWN0YWJsZS9TZWxlY3Rpb25PdmVybGF5XCI7XG5cbmltcG9ydCB7XG4gICAgUmVzaXplSGFuZGxlLFxuICAgIFJlc2l6ZUhhbmRsZVBvc2l0aW9uaW5nLFxuICAgIFJlc2l6ZUhhbmRsZVN0eWxlLFxufSBmcm9tIFwiLi9SZXNpemVIYW5kbGVcIjtcblxuZXhwb3J0IGNvbnN0IGFsbFBvc2l0aW9uaW5ncyA9IFtcbiAgICBSZXNpemVIYW5kbGVQb3NpdGlvbmluZy5Ub3BMZWZ0LFxuICAgIFJlc2l6ZUhhbmRsZVBvc2l0aW9uaW5nLlRvcENlbnRlcixcbiAgICBSZXNpemVIYW5kbGVQb3NpdGlvbmluZy5Ub3BSaWdodCxcbiAgICBSZXNpemVIYW5kbGVQb3NpdGlvbmluZy5NaWRkbGVSaWdodCxcbiAgICBSZXNpemVIYW5kbGVQb3NpdGlvbmluZy5Cb3R0b21SaWdodCxcbiAgICBSZXNpemVIYW5kbGVQb3NpdGlvbmluZy5Cb3R0b21DZW50ZXIsXG4gICAgUmVzaXplSGFuZGxlUG9zaXRpb25pbmcuQm90dG9tTGVmdCxcbiAgICBSZXNpemVIYW5kbGVQb3NpdGlvbmluZy5NaWRkbGVMZWZ0LFxuXTtcblxuZXhwb3J0IGNsYXNzIFJlc2l6ZUZyYW1lIGV4dGVuZHMgR3JvdXAge1xuICAgIGNvbnN0cnVjdG9yKFxuICAgICAgICByZWFkb25seSBvdmVybGF5OiBTZWxlY3Rpb25PdmVybGF5LFxuICAgICAgICBoYW5kbGVQb3NpdGlvbmluZ3M6IFJlc2l6ZUhhbmRsZVBvc2l0aW9uaW5nW10gPSBhbGxQb3NpdGlvbmluZ3MsXG4gICAgICAgIGhhbmRsZVN0eWxlOiBSZXNpemVIYW5kbGVTdHlsZSA9IG5ldyBSZXNpemVIYW5kbGVTdHlsZSgpLFxuICAgICkge1xuICAgICAgICBzdXBlcigpO1xuICAgICAgICB0aGlzLmNoaWxkcmVuID0gY3JlYXRlSGFuZGxlcyh0aGlzLCBoYW5kbGVQb3NpdGlvbmluZ3MsIGhhbmRsZVN0eWxlKTtcbiAgICB9XG59XG5cbmZ1bmN0aW9uIGNyZWF0ZUhhbmRsZXMoXG4gICAgZnJhbWU6IFJlc2l6ZUZyYW1lLFxuICAgIHBvc2l0aW9uaW5nczogUmVzaXplSGFuZGxlUG9zaXRpb25pbmdbXSxcbiAgICBoYW5kbGVTdHlsZTogUmVzaXplSGFuZGxlU3R5bGUsXG4pOiBSZXNpemVIYW5kbGVbXSB7XG4gICAgcmV0dXJuIHBvc2l0aW9uaW5ncy5tYXAoXG4gICAgICAgIHBvc2l0aW9uaW5nID0+IG5ldyBSZXNpemVIYW5kbGUoZnJhbWUsIHBvc2l0aW9uaW5nLCBoYW5kbGVTdHlsZSksXG4gICAgKTtcbn1cbiIsImltcG9ydCB0eXBlIHsgQm9hcmQgfSBmcm9tIFwiQGNhbnZhcy9ib2FyZC9Cb2FyZFwiO1xuaW1wb3J0IHsgY2FuUmVzaXplIH0gZnJvbSBcIkBjYW52YXMvYm9hcmQvY29udHJvbGxlcnMvQm9hcmRNb2RlXCI7XG5pbXBvcnQgeyBHZW9tZXRyaWNPYmplY3QgfSBmcm9tIFwiQGNhbnZhcy9ib2FyZC9vYmplY3RzL0dlb21ldHJpY09iamVjdFwiO1xuaW1wb3J0IHR5cGUgeyBSZXNpemVGcmFtZSB9IGZyb20gXCJAY2FudmFzL2JvYXJkL29iamVjdHMvdWkvc2VsZWN0YWJsZS9SZXNpemVGcmFtZVwiO1xuaW1wb3J0IHsgcmVzZXRDdXJzb3IsIHNldEN1cnNvciB9IGZyb20gXCJAY2FudmFzL3ByaW1pdGl2ZXMvZG9tXCI7XG5pbXBvcnQgdHlwZSB7IFN1YnNjcmlwdGlvbiB9IGZyb20gXCJAY2FudmFzL3ByaW1pdGl2ZXMvZXZlbnRzXCI7XG5pbXBvcnQgeyB1bnN1YnNjcmliZUFsbCB9IGZyb20gXCJAY2FudmFzL3ByaW1pdGl2ZXMvZXZlbnRzXCI7XG5pbXBvcnQgeyBCb3VuZGluZ0JveCwgVmVjdG9yMiB9IGZyb20gXCJAY2FudmFzL3ByaW1pdGl2ZXMvc3BhY2VcIjtcbmltcG9ydCB0eXBlIHsgT3B0aW9uYWwgfSBmcm9tIFwiQGNhbnZhcy9wcmltaXRpdmVzL3R5cGVzXCI7XG5pbXBvcnQgdHlwZSB7IFJlbmRlckNvbnRleHQgfSBmcm9tIFwiQGNhbnZhcy9yZW5kZXIvUmVuZGVyQ29udGV4dFwiO1xuaW1wb3J0IHR5cGUgeyBWaWV3cG9ydCB9IGZyb20gXCJAY2FudmFzL3JlbmRlci9WaWV3cG9ydFwiO1xuaW1wb3J0IHsgaW52ZXJzZVN0cm9rZUNvbG9yIH0gZnJvbSBcIkBjb25maWcvZHJhd1wiO1xuXG5leHBvcnQgZW51bSBSZXNpemVIYW5kbGVQb3NpdGlvbmluZyB7XG4gICAgVG9wTGVmdCxcbiAgICBUb3BDZW50ZXIsXG4gICAgVG9wUmlnaHQsXG4gICAgTWlkZGxlUmlnaHQsXG4gICAgQm90dG9tUmlnaHQsXG4gICAgQm90dG9tQ2VudGVyLFxuICAgIEJvdHRvbUxlZnQsXG4gICAgTWlkZGxlTGVmdCxcbn1cblxuZXhwb3J0IGNsYXNzIFJlc2l6ZUhhbmRsZVN0eWxlIHtcbiAgICBjb25zdHJ1Y3RvcihcbiAgICAgICAgcmVhZG9ubHkgc2l6ZSA9IDE0LFxuICAgICAgICByZWFkb25seSBvdXRsaW5lQ29sb3IgPSBpbnZlcnNlU3Ryb2tlQ29sb3IsXG4gICAgICAgIHJlYWRvbmx5IG91dGxpbmVXaWR0aCA9IDIsXG4gICAgICAgIHJlYWRvbmx5IGZpbGxDb2xvciA9IFwiIzEwNjBCMFwiLFxuICAgICAgICByZWFkb25seSBnbG93Q29sb3I6IE9wdGlvbmFsPHN0cmluZz4gPSBcIiM3NUFBRUVcIixcbiAgICAgICAgcmVhZG9ubHkgY2hhbmdlQ3Vyc29yID0gdHJ1ZSxcbiAgICApIHt9XG59XG5cbmNvbnN0IHBvc2l0aW9uaW5nQ3Vyc29yU3R5bGUgPSB7XG4gICAgW1Jlc2l6ZUhhbmRsZVBvc2l0aW9uaW5nLlRvcExlZnRdOiBcIm53c2UtcmVzaXplXCIsXG4gICAgW1Jlc2l6ZUhhbmRsZVBvc2l0aW9uaW5nLlRvcENlbnRlcl06IFwibnMtcmVzaXplXCIsXG4gICAgW1Jlc2l6ZUhhbmRsZVBvc2l0aW9uaW5nLlRvcFJpZ2h0XTogXCJuZXN3LXJlc2l6ZVwiLFxuICAgIFtSZXNpemVIYW5kbGVQb3NpdGlvbmluZy5NaWRkbGVSaWdodF06IFwiZXctcmVzaXplXCIsXG4gICAgW1Jlc2l6ZUhhbmRsZVBvc2l0aW9uaW5nLkJvdHRvbVJpZ2h0XTogXCJud3NlLXJlc2l6ZVwiLFxuICAgIFtSZXNpemVIYW5kbGVQb3NpdGlvbmluZy5Cb3R0b21DZW50ZXJdOiBcIm5zLXJlc2l6ZVwiLFxuICAgIFtSZXNpemVIYW5kbGVQb3NpdGlvbmluZy5Cb3R0b21MZWZ0XTogXCJuZXN3LXJlc2l6ZVwiLFxuICAgIFtSZXNpemVIYW5kbGVQb3NpdGlvbmluZy5NaWRkbGVMZWZ0XTogXCJldy1yZXNpemVcIixcbn07XG5cbmV4cG9ydCBjbGFzcyBSZXNpemVIYW5kbGUgZXh0ZW5kcyBHZW9tZXRyaWNPYmplY3Qge1xuICAgIHByaXZhdGUgcmVzaXppbmdTdWJzY3JpcHRpb25zOiBTdWJzY3JpcHRpb25bXSA9IFtdO1xuXG4gICAgY29uc3RydWN0b3IoXG4gICAgICAgIHJlYWRvbmx5IGZyYW1lOiBSZXNpemVGcmFtZSxcbiAgICAgICAgcmVhZG9ubHkgcG9zaXRpb25pbmc6IFJlc2l6ZUhhbmRsZVBvc2l0aW9uaW5nLFxuICAgICAgICByZWFkb25seSBzdHlsZTogUmVzaXplSGFuZGxlU3R5bGUgPSBuZXcgUmVzaXplSGFuZGxlU3R5bGUoKSxcbiAgICApIHtcbiAgICAgICAgc3VwZXIoKTtcbiAgICB9XG5cbiAgICBwdWJsaWMgYm91bmRpbmdCb3godmlld3BvcnQ6IFZpZXdwb3J0KTogQm91bmRpbmdCb3gge1xuICAgICAgICBjb25zdCBzaXplID0gbmV3IFZlY3RvcjIodGhpcy5zdHlsZS5zaXplLCB0aGlzLnN0eWxlLnNpemUpO1xuICAgICAgICBjb25zdCBjZW50ZXJPZmZzZXQgPSB0aGlzLnN0eWxlLnNpemUgLyAyO1xuICAgICAgICBjb25zdCBwb3NpdGlvbiA9IHRoaXMucmVsYXRpdmVQb3NpdGlvbih2aWV3cG9ydCkubWludXMoXG4gICAgICAgICAgICBuZXcgVmVjdG9yMihjZW50ZXJPZmZzZXQsIGNlbnRlck9mZnNldCksXG4gICAgICAgICk7XG5cbiAgICAgICAgcmV0dXJuIG5ldyBCb3VuZGluZ0JveChwb3NpdGlvbiwgc2l6ZSk7XG4gICAgfVxuXG4gICAgcHVibGljIGRyYXcocmVuZGVyQ3R4OiBSZW5kZXJDb250ZXh0KTogdm9pZCB7XG4gICAgICAgIGNvbnN0IHNpemUgPSB0aGlzLnN0eWxlLnNpemU7XG4gICAgICAgIGNvbnN0IGNlbnRlclBvc2l0aW9uID0gdGhpcy5yZWxhdGl2ZVBvc2l0aW9uKHJlbmRlckN0eC52aWV3cG9ydCk7XG4gICAgICAgIC8vIE91dGxpbmUgd2lkdGggaXMgY2VudGVyZWQgb24gY2lyY2xlIG91dGxpbmUsIHNvIG9ubHkgaGFsZiBvclxuICAgICAgICAvLyB0aGUgb3V0bGluZSBpcyBhbiBhZGRpdGlvbmFsIHdpZHRoLCBtZWFucyBhbiBhZGRpdGlvbmFsIHdpZHRoIG9mXG4gICAgICAgIC8vIDIgKiAxLzIgKiBvdXRsaW5lV2lkdGggPSBvdXRsaW5lV2lkdGhcbiAgICAgICAgY29uc3QgaW5uZXJTaXplID0gc2l6ZSAtIHRoaXMuc3R5bGUub3V0bGluZVdpZHRoO1xuXG4gICAgICAgIC8vIFNoYWRvd1xuICAgICAgICByZW5kZXJDdHguY3R4LnNoYWRvd0NvbG9yID0gdGhpcy5zdHlsZS5maWxsQ29sb3I7XG4gICAgICAgIHJlbmRlckN0eC5jdHguc2hhZG93Qmx1ciA9IHRoaXMuc3R5bGUuc2l6ZSAvIDg7XG5cbiAgICAgICAgLy8gQ2lyY2xlXG4gICAgICAgIHJlbmRlckN0eC5jdHguYmVnaW5QYXRoKCk7XG4gICAgICAgIHJlbmRlckN0eC5jdHguYXJjKFxuICAgICAgICAgICAgY2VudGVyUG9zaXRpb24ueCxcbiAgICAgICAgICAgIGNlbnRlclBvc2l0aW9uLnksXG4gICAgICAgICAgICBpbm5lclNpemUgLyAyLFxuICAgICAgICAgICAgMCxcbiAgICAgICAgICAgIDIgKiBNYXRoLlBJLFxuICAgICAgICApO1xuXG4gICAgICAgIC8vIEZpbGxcbiAgICAgICAgaWYgKHRoaXMuc3R5bGUuZ2xvd0NvbG9yICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIGNvbnN0IGdyYWRpZW50ID0gcmVuZGVyQ3R4LmN0eC5jcmVhdGVSYWRpYWxHcmFkaWVudChcbiAgICAgICAgICAgICAgICBjZW50ZXJQb3NpdGlvbi54IC0gaW5uZXJTaXplIC8gOCxcbiAgICAgICAgICAgICAgICBjZW50ZXJQb3NpdGlvbi55IC0gaW5uZXJTaXplIC8gNCxcbiAgICAgICAgICAgICAgICAwLFxuICAgICAgICAgICAgICAgIGNlbnRlclBvc2l0aW9uLngsXG4gICAgICAgICAgICAgICAgY2VudGVyUG9zaXRpb24ueSxcbiAgICAgICAgICAgICAgICBzaXplICsgMSxcbiAgICAgICAgICAgICk7XG5cbiAgICAgICAgICAgIGdyYWRpZW50LmFkZENvbG9yU3RvcCgwLCB0aGlzLnN0eWxlLmdsb3dDb2xvcik7XG4gICAgICAgICAgICBncmFkaWVudC5hZGRDb2xvclN0b3AoMSwgdGhpcy5zdHlsZS5maWxsQ29sb3IpO1xuXG4gICAgICAgICAgICByZW5kZXJDdHguY3R4LmZpbGxTdHlsZSA9IGdyYWRpZW50O1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmVuZGVyQ3R4LmN0eC5maWxsU3R5bGUgPSB0aGlzLnN0eWxlLmZpbGxDb2xvcjtcbiAgICAgICAgfVxuICAgICAgICByZW5kZXJDdHguY3R4LmZpbGwoKTtcblxuICAgICAgICAvLyBPdXRsaW5lXG4gICAgICAgIHJlbmRlckN0eC5jdHguc3Ryb2tlU3R5bGUgPSB0aGlzLnN0eWxlLm91dGxpbmVDb2xvcjtcbiAgICAgICAgcmVuZGVyQ3R4LmN0eC5saW5lV2lkdGggPSB0aGlzLnN0eWxlLm91dGxpbmVXaWR0aDtcbiAgICAgICAgcmVuZGVyQ3R4LmN0eC5zdHJva2UoKTtcbiAgICB9XG5cbiAgICBwdWJsaWMgb25TcGF3bihib2FyZDogQm9hcmQpOiB2b2lkIHtcbiAgICAgICAgc3VwZXIub25TcGF3bihib2FyZCk7XG5cbiAgICAgICAgY29uc3QgbW91c2UgPSBib2FyZC5jb250cm9sbGVyLm1vdXNlO1xuXG4gICAgICAgIHRoaXMuc3Vic2NyaXB0aW9ucy5wdXNoKFxuICAgICAgICAgICAgbW91c2Uub25Nb3VzZURvd24ubGlzdGVuKHRoaXMsIGUgPT4ge1xuICAgICAgICAgICAgICAgIHRoaXMuYm9hcmQuY29udHJvbGxlci5yZXNpemUuc3RhcnRSZXNpemluZyhlKTtcbiAgICAgICAgICAgIH0pLFxuICAgICAgICApO1xuXG4gICAgICAgIGlmICh0aGlzLnN0eWxlLmNoYW5nZUN1cnNvcikge1xuICAgICAgICAgICAgdGhpcy5zdWJzY3JpcHRpb25zLnB1c2goXG4gICAgICAgICAgICAgICAgbW91c2Uub25Nb3VzZU92ZXIubGlzdGVuKHRoaXMsICgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5vbk1vdXNlT3ZlcigpO1xuICAgICAgICAgICAgICAgIH0pLFxuICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIHRoaXMuc3Vic2NyaXB0aW9ucy5wdXNoKFxuICAgICAgICAgICAgICAgIG1vdXNlLm9uTW91c2VPdXQubGlzdGVuKHRoaXMsICgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5vbk1vdXNlT3V0KCk7XG4gICAgICAgICAgICAgICAgfSksXG4gICAgICAgICAgICApO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHVibGljIG9uRGVzcGF3bihib2FyZDogQm9hcmQpOiB2b2lkIHtcbiAgICAgICAgdW5zdWJzY3JpYmVBbGwodGhpcy5yZXNpemluZ1N1YnNjcmlwdGlvbnMpO1xuICAgICAgICBzdXBlci5vbkRlc3Bhd24oYm9hcmQpO1xuICAgIH1cblxuICAgIHB1YmxpYyBzaG93UmVzaXppbmdDdXJzb3IoKTogdm9pZCB7XG4gICAgICAgIHNob3dSZXNpemluZ0N1cnNvcih0aGlzLnBvc2l0aW9uaW5nKTtcbiAgICB9XG5cbiAgICBwcml2YXRlIG9uTW91c2VPdmVyKCk6IHZvaWQge1xuICAgICAgICBpZiAoY2FuUmVzaXplKHRoaXMuYm9hcmQuY29udHJvbGxlci5tb2RlLnN0YXRlKSkge1xuICAgICAgICAgICAgdGhpcy5zaG93UmVzaXppbmdDdXJzb3IoKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHByaXZhdGUgb25Nb3VzZU91dCgpOiB2b2lkIHtcbiAgICAgICAgaWYgKGNhblJlc2l6ZSh0aGlzLmJvYXJkLmNvbnRyb2xsZXIubW9kZS5zdGF0ZSkpIHtcbiAgICAgICAgICAgIHJlc2V0Q3Vyc29yKCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwcml2YXRlIHJlbGF0aXZlUG9zaXRpb24odmlld3BvcnQ6IFZpZXdwb3J0KTogVmVjdG9yMiB7XG4gICAgICAgIGNvbnN0IGNvbnRlbnRCb3ggPSB0aGlzLmZyYW1lLm92ZXJsYXkuc2VsZWN0aW9uRnJhbWUuYm91bmRpbmdCb3goXG4gICAgICAgICAgICB2aWV3cG9ydCxcbiAgICAgICAgKTtcblxuICAgICAgICBzd2l0Y2ggKHRoaXMucG9zaXRpb25pbmcpIHtcbiAgICAgICAgICAgIGNhc2UgUmVzaXplSGFuZGxlUG9zaXRpb25pbmcuVG9wTGVmdDpcbiAgICAgICAgICAgICAgICByZXR1cm4gbmV3IFZlY3RvcjIoXG4gICAgICAgICAgICAgICAgICAgIGNvbnRlbnRCb3gucG9zaXRpb24ueCxcbiAgICAgICAgICAgICAgICAgICAgY29udGVudEJveC5wb3NpdGlvbi55LFxuICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICBjYXNlIFJlc2l6ZUhhbmRsZVBvc2l0aW9uaW5nLlRvcENlbnRlcjpcbiAgICAgICAgICAgICAgICByZXR1cm4gbmV3IFZlY3RvcjIoXG4gICAgICAgICAgICAgICAgICAgIGNvbnRlbnRCb3gucG9zaXRpb24ueCArIGNvbnRlbnRCb3guc2l6ZS54IC8gMixcbiAgICAgICAgICAgICAgICAgICAgY29udGVudEJveC5wb3NpdGlvbi55LFxuICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICBjYXNlIFJlc2l6ZUhhbmRsZVBvc2l0aW9uaW5nLlRvcFJpZ2h0OlxuICAgICAgICAgICAgICAgIHJldHVybiBuZXcgVmVjdG9yMihcbiAgICAgICAgICAgICAgICAgICAgY29udGVudEJveC5wb3NpdGlvbi54ICsgY29udGVudEJveC5zaXplLngsXG4gICAgICAgICAgICAgICAgICAgIGNvbnRlbnRCb3gucG9zaXRpb24ueSxcbiAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgY2FzZSBSZXNpemVIYW5kbGVQb3NpdGlvbmluZy5NaWRkbGVSaWdodDpcbiAgICAgICAgICAgICAgICByZXR1cm4gbmV3IFZlY3RvcjIoXG4gICAgICAgICAgICAgICAgICAgIGNvbnRlbnRCb3gucG9zaXRpb24ueCArIGNvbnRlbnRCb3guc2l6ZS54LFxuICAgICAgICAgICAgICAgICAgICBjb250ZW50Qm94LnBvc2l0aW9uLnkgKyBjb250ZW50Qm94LnNpemUueSAvIDIsXG4gICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIGNhc2UgUmVzaXplSGFuZGxlUG9zaXRpb25pbmcuQm90dG9tUmlnaHQ6XG4gICAgICAgICAgICAgICAgcmV0dXJuIG5ldyBWZWN0b3IyKFxuICAgICAgICAgICAgICAgICAgICBjb250ZW50Qm94LnBvc2l0aW9uLnggKyBjb250ZW50Qm94LnNpemUueCxcbiAgICAgICAgICAgICAgICAgICAgY29udGVudEJveC5wb3NpdGlvbi55ICsgY29udGVudEJveC5zaXplLnksXG4gICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIGNhc2UgUmVzaXplSGFuZGxlUG9zaXRpb25pbmcuQm90dG9tQ2VudGVyOlxuICAgICAgICAgICAgICAgIHJldHVybiBuZXcgVmVjdG9yMihcbiAgICAgICAgICAgICAgICAgICAgY29udGVudEJveC5wb3NpdGlvbi54ICsgY29udGVudEJveC5zaXplLnggLyAyLFxuICAgICAgICAgICAgICAgICAgICBjb250ZW50Qm94LnBvc2l0aW9uLnkgKyBjb250ZW50Qm94LnNpemUueSxcbiAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgY2FzZSBSZXNpemVIYW5kbGVQb3NpdGlvbmluZy5Cb3R0b21MZWZ0OlxuICAgICAgICAgICAgICAgIHJldHVybiBuZXcgVmVjdG9yMihcbiAgICAgICAgICAgICAgICAgICAgY29udGVudEJveC5wb3NpdGlvbi54LFxuICAgICAgICAgICAgICAgICAgICBjb250ZW50Qm94LnBvc2l0aW9uLnkgKyBjb250ZW50Qm94LnNpemUueSxcbiAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgY2FzZSBSZXNpemVIYW5kbGVQb3NpdGlvbmluZy5NaWRkbGVMZWZ0OlxuICAgICAgICAgICAgICAgIHJldHVybiBuZXcgVmVjdG9yMihcbiAgICAgICAgICAgICAgICAgICAgY29udGVudEJveC5wb3NpdGlvbi54LFxuICAgICAgICAgICAgICAgICAgICBjb250ZW50Qm94LnBvc2l0aW9uLnkgKyBjb250ZW50Qm94LnNpemUueSAvIDIsXG4gICAgICAgICAgICAgICAgKTtcbiAgICAgICAgfVxuICAgIH1cbn1cblxuZnVuY3Rpb24gc2hvd1Jlc2l6aW5nQ3Vyc29yKHBvc2l0aW9uaW5nOiBSZXNpemVIYW5kbGVQb3NpdGlvbmluZyk6IHZvaWQge1xuICAgIHNldEN1cnNvcihwb3NpdGlvbmluZ0N1cnNvclN0eWxlW3Bvc2l0aW9uaW5nXSk7XG59XG4iLCJpbXBvcnQgdHlwZSB7IEJvYXJkIH0gZnJvbSBcIkBjYW52YXMvYm9hcmQvQm9hcmRcIjtcbmltcG9ydCB7IEdlb21ldHJpY09iamVjdCB9IGZyb20gXCJAY2FudmFzL2JvYXJkL29iamVjdHMvR2VvbWV0cmljT2JqZWN0XCI7XG5pbXBvcnQgdHlwZSB7IEJvYXJkSXRlbSB9IGZyb20gXCJAY2FudmFzL2JvYXJkL29iamVjdHMvaXRlbXMvQm9hcmRJdGVtXCI7XG5pbXBvcnQgeyBSZXNpemVIYW5kbGVQb3NpdGlvbmluZyB9IGZyb20gXCJAY2FudmFzL2JvYXJkL29iamVjdHMvdWkvc2VsZWN0YWJsZS9SZXNpemVIYW5kbGVcIjtcbmltcG9ydCB7IEJvdW5kaW5nQm94LCBWZWN0b3IyIH0gZnJvbSBcIkBjYW52YXMvcHJpbWl0aXZlcy9zcGFjZVwiO1xuaW1wb3J0IHR5cGUgeyBWaWV3cG9ydCB9IGZyb20gXCJAY2FudmFzL3JlbmRlci9WaWV3cG9ydFwiO1xuXG5leHBvcnQgY2xhc3MgUm90YXRlQ29sbGlkZXIgZXh0ZW5kcyBHZW9tZXRyaWNPYmplY3Qge1xuICAgIGNvbnN0cnVjdG9yKFxuICAgICAgICBwcml2YXRlIGNvcm5lcjogUmVzaXplSGFuZGxlUG9zaXRpb25pbmcsXG4gICAgICAgIHByaXZhdGUgY29udGVudDogQm9hcmRJdGVtLFxuICAgICAgICBwcml2YXRlIHNpemU6IFZlY3RvcjIsXG4gICAgKSB7XG4gICAgICAgIHN1cGVyKCk7XG4gICAgfVxuXG4gICAgcHVibGljIGJvdW5kaW5nQm94KHZpZXdwb3J0OiBWaWV3cG9ydCk6IEJvdW5kaW5nQm94IHtcbiAgICAgICAgY29uc3QgYmIgPSB0aGlzLmNvbnRlbnQuYm91bmRpbmdCb3godmlld3BvcnQpO1xuICAgICAgICBjb25zdCBwb3NpdGlvbiA9IGJiLnBvc2l0aW9uLnBsdXModGhpcy5nZXRPZmZzZXQoYmIpKTtcblxuICAgICAgICByZXR1cm4gbmV3IEJvdW5kaW5nQm94KHBvc2l0aW9uLCB0aGlzLnNpemUpO1xuICAgIH1cblxuICAgIHB1YmxpYyBvblNwYXduKGJvYXJkOiBCb2FyZCk6IHZvaWQge1xuICAgICAgICBzdXBlci5vblNwYXduKGJvYXJkKTtcblxuICAgICAgICBjb25zdCBtb3VzZSA9IGJvYXJkLmNvbnRyb2xsZXIubW91c2U7XG5cbiAgICAgICAgdGhpcy5zdWJzY3JpcHRpb25zLnB1c2goXG4gICAgICAgICAgICBtb3VzZS5vbk1vdXNlRG93bi5saXN0ZW4odGhpcywgZSA9PiB7XG4gICAgICAgICAgICAgICAgdGhpcy5ib2FyZC5jb250cm9sbGVyLnJvdGF0ZS5zdGFydFJvdGF0aW5nKGUsIHRoaXMuY29udGVudCk7XG4gICAgICAgICAgICB9KSxcbiAgICAgICAgKTtcbiAgICB9XG5cbiAgICBwdWJsaWMgZHJhdygpOiB2b2lkIHtcbiAgICAgICAgLy8gTm90aGluZ1xuICAgIH1cblxuICAgIHByaXZhdGUgZ2V0T2Zmc2V0KHJlZmVyZW5jZUJveDogQm91bmRpbmdCb3gpOiBWZWN0b3IyIHtcbiAgICAgICAgc3dpdGNoICh0aGlzLmNvcm5lcikge1xuICAgICAgICAgICAgY2FzZSBSZXNpemVIYW5kbGVQb3NpdGlvbmluZy5Ub3BMZWZ0OlxuICAgICAgICAgICAgICAgIHJldHVybiBuZXcgVmVjdG9yMigtdGhpcy5zaXplLngsIC10aGlzLnNpemUueSk7XG4gICAgICAgICAgICBjYXNlIFJlc2l6ZUhhbmRsZVBvc2l0aW9uaW5nLlRvcFJpZ2h0OlxuICAgICAgICAgICAgICAgIHJldHVybiBuZXcgVmVjdG9yMihyZWZlcmVuY2VCb3guc2l6ZS54LCAtdGhpcy5zaXplLnkpO1xuICAgICAgICAgICAgY2FzZSBSZXNpemVIYW5kbGVQb3NpdGlvbmluZy5Cb3R0b21SaWdodDpcbiAgICAgICAgICAgICAgICByZXR1cm4gcmVmZXJlbmNlQm94LnNpemU7XG4gICAgICAgICAgICBjYXNlIFJlc2l6ZUhhbmRsZVBvc2l0aW9uaW5nLkJvdHRvbUxlZnQ6XG4gICAgICAgICAgICAgICAgcmV0dXJuIG5ldyBWZWN0b3IyKC10aGlzLnNpemUueCwgcmVmZXJlbmNlQm94LnNpemUueSk7XG4gICAgICAgIH1cbiAgICB9XG59XG4iLCJpbXBvcnQgdHlwZSB7IEJvYXJkIH0gZnJvbSBcIkBjYW52YXMvYm9hcmQvQm9hcmRcIjtcbmltcG9ydCB7IGNhblJvdGF0ZSB9IGZyb20gXCJAY2FudmFzL2JvYXJkL2NvbnRyb2xsZXJzL0JvYXJkTW9kZVwiO1xuaW1wb3J0IHsgc2hvd1JvdGF0ZUN1cnNvciB9IGZyb20gXCJAY2FudmFzL2JvYXJkL2NvbnRyb2xsZXJzL29iamVjdHMvUm90YXRlT2JqZWN0Q29udHJvbGxlclwiO1xuaW1wb3J0IHsgR3JvdXAgfSBmcm9tIFwiQGNhbnZhcy9ib2FyZC9vYmplY3RzL2ZvdW5kYXRpb24vR3JvdXBcIjtcbmltcG9ydCB7IFJlc2l6ZUhhbmRsZVBvc2l0aW9uaW5nIH0gZnJvbSBcIkBjYW52YXMvYm9hcmQvb2JqZWN0cy91aS9zZWxlY3RhYmxlL1Jlc2l6ZUhhbmRsZVwiO1xuaW1wb3J0IHsgUm90YXRlQ29sbGlkZXIgfSBmcm9tIFwiQGNhbnZhcy9ib2FyZC9vYmplY3RzL3VpL3NlbGVjdGFibGUvUm90YXRlQ29sbGlkZXJcIjtcbmltcG9ydCB0eXBlIHsgU2VsZWN0aW9uT3ZlcmxheSB9IGZyb20gXCJAY2FudmFzL2JvYXJkL29iamVjdHMvdWkvc2VsZWN0YWJsZS9TZWxlY3Rpb25PdmVybGF5XCI7XG5pbXBvcnQgeyByZXNldEN1cnNvciB9IGZyb20gXCJAY2FudmFzL3ByaW1pdGl2ZXMvZG9tXCI7XG5pbXBvcnQgeyBWZWN0b3IyIH0gZnJvbSBcIkBjYW52YXMvcHJpbWl0aXZlcy9zcGFjZVwiO1xuXG5leHBvcnQgY2xhc3MgUm90YXRlRnJhbWUgZXh0ZW5kcyBHcm91cCB7XG4gICAgY29uc3RydWN0b3IoXG4gICAgICAgIHJlYWRvbmx5IG92ZXJsYXk6IFNlbGVjdGlvbk92ZXJsYXksXG4gICAgICAgIHJlYWRvbmx5IHJvdGF0aW9uT2Zmc2V0OiBudW1iZXIgPSAyNSxcbiAgICApIHtcbiAgICAgICAgc3VwZXIoKTtcblxuICAgICAgICBjb25zdCBjb250ZW50ID0gdGhpcy5vdmVybGF5LnNlbGVjdGFibGUuY29udGVudDtcbiAgICAgICAgY29uc3Qgc2l6ZSA9IG5ldyBWZWN0b3IyKHJvdGF0aW9uT2Zmc2V0LCByb3RhdGlvbk9mZnNldCk7XG5cbiAgICAgICAgdGhpcy5jaGlsZHJlbiA9IFtcbiAgICAgICAgICAgIG5ldyBSb3RhdGVDb2xsaWRlcihSZXNpemVIYW5kbGVQb3NpdGlvbmluZy5Ub3BMZWZ0LCBjb250ZW50LCBzaXplKSxcbiAgICAgICAgICAgIG5ldyBSb3RhdGVDb2xsaWRlcihSZXNpemVIYW5kbGVQb3NpdGlvbmluZy5Ub3BSaWdodCwgY29udGVudCwgc2l6ZSksXG4gICAgICAgICAgICBuZXcgUm90YXRlQ29sbGlkZXIoXG4gICAgICAgICAgICAgICAgUmVzaXplSGFuZGxlUG9zaXRpb25pbmcuQm90dG9tUmlnaHQsXG4gICAgICAgICAgICAgICAgY29udGVudCxcbiAgICAgICAgICAgICAgICBzaXplLFxuICAgICAgICAgICAgKSxcbiAgICAgICAgICAgIG5ldyBSb3RhdGVDb2xsaWRlcihcbiAgICAgICAgICAgICAgICBSZXNpemVIYW5kbGVQb3NpdGlvbmluZy5Cb3R0b21MZWZ0LFxuICAgICAgICAgICAgICAgIGNvbnRlbnQsXG4gICAgICAgICAgICAgICAgc2l6ZSxcbiAgICAgICAgICAgICksXG4gICAgICAgIF07XG4gICAgfVxuXG4gICAgcHVibGljIG9uU3Bhd24oYm9hcmQ6IEJvYXJkKTogdm9pZCB7XG4gICAgICAgIHN1cGVyLm9uU3Bhd24oYm9hcmQpO1xuXG4gICAgICAgIGNvbnN0IG1vdXNlID0gYm9hcmQuY29udHJvbGxlci5tb3VzZTtcblxuICAgICAgICB0aGlzLnN1YnNjcmlwdGlvbnMucHVzaChcbiAgICAgICAgICAgIG1vdXNlLm9uTW91c2VPdmVyLmxpc3Rlbih0aGlzLCAoKSA9PiB7XG4gICAgICAgICAgICAgICAgdGhpcy5vbk1vdXNlT3ZlcigpO1xuICAgICAgICAgICAgfSksXG4gICAgICAgICk7XG4gICAgICAgIHRoaXMuc3Vic2NyaXB0aW9ucy5wdXNoKFxuICAgICAgICAgICAgbW91c2Uub25Nb3VzZU91dC5saXN0ZW4odGhpcywgKCkgPT4ge1xuICAgICAgICAgICAgICAgIHRoaXMub25Nb3VzZU91dCgpO1xuICAgICAgICAgICAgfSksXG4gICAgICAgICk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBvbk1vdXNlT3ZlcigpOiB2b2lkIHtcbiAgICAgICAgaWYgKGNhblJvdGF0ZSh0aGlzLmJvYXJkLmNvbnRyb2xsZXIubW9kZS5zdGF0ZSkpIHtcbiAgICAgICAgICAgIHNob3dSb3RhdGVDdXJzb3IoKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHByaXZhdGUgb25Nb3VzZU91dCgpOiB2b2lkIHtcbiAgICAgICAgaWYgKGNhblJvdGF0ZSh0aGlzLmJvYXJkLmNvbnRyb2xsZXIubW9kZS5zdGF0ZSkpIHtcbiAgICAgICAgICAgIHJlc2V0Q3Vyc29yKCk7XG4gICAgICAgIH1cbiAgICB9XG59XG4iLCJpbXBvcnQgdHlwZSB7IEJvYXJkIH0gZnJvbSBcIkBjYW52YXMvYm9hcmQvQm9hcmRcIjtcbmltcG9ydCB7IEdyb3VwIH0gZnJvbSBcIkBjYW52YXMvYm9hcmQvb2JqZWN0cy9mb3VuZGF0aW9uL0dyb3VwXCI7XG5pbXBvcnQgeyBSb3RhdGVDb250YWluZXIgfSBmcm9tIFwiQGNhbnZhcy9ib2FyZC9vYmplY3RzL2ZvdW5kYXRpb24vUm90YXRlQ29udGFpbmVyXCI7XG5pbXBvcnQgdHlwZSB7IEdlb21ldHJpY09iamVjdCB9IGZyb20gXCJAY2FudmFzL2JvYXJkL29iamVjdHMvR2VvbWV0cmljT2JqZWN0XCI7XG5pbXBvcnQgdHlwZSB7IEJvYXJkSXRlbSB9IGZyb20gXCJAY2FudmFzL2JvYXJkL29iamVjdHMvaXRlbXMvQm9hcmRJdGVtXCI7XG5pbXBvcnQgeyBhbGxQb3NpdGlvbmluZ3MgfSBmcm9tIFwiQGNhbnZhcy9ib2FyZC9vYmplY3RzL3VpL3NlbGVjdGFibGUvUmVzaXplRnJhbWVcIjtcbmltcG9ydCB0eXBlIHsgUmVzaXplSGFuZGxlUG9zaXRpb25pbmcgfSBmcm9tIFwiQGNhbnZhcy9ib2FyZC9vYmplY3RzL3VpL3NlbGVjdGFibGUvUmVzaXplSGFuZGxlXCI7XG5pbXBvcnQgeyBTZWxlY3Rpb25PdmVybGF5IH0gZnJvbSBcIkBjYW52YXMvYm9hcmQvb2JqZWN0cy91aS9zZWxlY3RhYmxlL1NlbGVjdGlvbk92ZXJsYXlcIjtcbmltcG9ydCB0eXBlIHsgT3B0aW9uYWwgfSBmcm9tIFwiQGNhbnZhcy9wcmltaXRpdmVzL3R5cGVzXCI7XG5cbmV4cG9ydCBjbGFzcyBTZWxlY3Rpb25PcHRpb25zIHtcbiAgICBjb25zdHJ1Y3RvcihcbiAgICAgICAgcmVhZG9ubHkgY2FuTW92ZTogYm9vbGVhbiA9IGZhbHNlLFxuICAgICAgICByZWFkb25seSBjYW5SZXNpemU6IGJvb2xlYW4gPSBmYWxzZSxcbiAgICAgICAgcmVhZG9ubHkgY2FuUm90YXRlOiBib29sZWFuID0gZmFsc2UsXG4gICAgICAgIHJlYWRvbmx5IHJlc2l6ZUhhbmRsZXM6IFJlc2l6ZUhhbmRsZVBvc2l0aW9uaW5nW10gPSBhbGxQb3NpdGlvbmluZ3MsXG4gICAgKSB7fVxufVxuXG5leHBvcnQgY2xhc3MgU2VsZWN0YWJsZSBleHRlbmRzIEdyb3VwIHtcbiAgICByZWFkb25seSBpc1NlbGVjdGFibGUgPSB0cnVlO1xuXG4gICAgcmVhZG9ubHkgcm90YXRlZENvbnRlbnQ6IE9wdGlvbmFsPFJvdGF0ZUNvbnRhaW5lcjxCb2FyZEl0ZW0+PjtcblxuICAgIHByaXZhdGUgb3ZlcmxheTogU2VsZWN0aW9uT3ZlcmxheTtcbiAgICBwcml2YXRlIG92ZXJsYXlXcmFwcGVyOiBHZW9tZXRyaWNPYmplY3Q7XG4gICAgcHJpdmF0ZSBfaXNTZWxlY3RlZCA9IGZhbHNlO1xuXG4gICAgY29uc3RydWN0b3IoXG4gICAgICAgIHJlYWRvbmx5IGNvbnRlbnQ6IEJvYXJkSXRlbSxcbiAgICAgICAgcmVhZG9ubHkgb3B0aW9uczogU2VsZWN0aW9uT3B0aW9ucyA9IGNvbnRlbnQuc2VsZWN0aW9uT3B0aW9ucyB8fFxuICAgICAgICAgICAgbmV3IFNlbGVjdGlvbk9wdGlvbnMoKSxcbiAgICApIHtcbiAgICAgICAgc3VwZXIoKTtcblxuICAgICAgICB0aGlzLm92ZXJsYXkgPSBuZXcgU2VsZWN0aW9uT3ZlcmxheSh0aGlzLCB0aGlzLm9wdGlvbnMpO1xuXG4gICAgICAgIHRoaXMucm90YXRlZENvbnRlbnQgPSBuZXcgUm90YXRlQ29udGFpbmVyKHRoaXMuY29udGVudCwgdGhpcy5jb250ZW50KTtcbiAgICAgICAgdGhpcy5vdmVybGF5V3JhcHBlciA9IG5ldyBSb3RhdGVDb250YWluZXIodGhpcy5vdmVybGF5LCB0aGlzLmNvbnRlbnQpO1xuICAgICAgICB0aGlzLmNoaWxkcmVuID0gW3RoaXMucm90YXRlZENvbnRlbnRdO1xuICAgIH1cblxuICAgIHB1YmxpYyBnZXQgaXNTZWxlY3RlZCgpOiBib29sZWFuIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2lzU2VsZWN0ZWQ7XG4gICAgfVxuXG4gICAgcHVibGljIHNldCBpc1NlbGVjdGVkKGlzU2VsZWN0ZWQ6IGJvb2xlYW4pIHtcbiAgICAgICAgaWYgKHRoaXMuX2lzU2VsZWN0ZWQgIT0gaXNTZWxlY3RlZCkge1xuICAgICAgICAgICAgdGhpcy5faXNTZWxlY3RlZCA9IGlzU2VsZWN0ZWQ7XG5cbiAgICAgICAgICAgIGlmICh0aGlzLl9pc1NlbGVjdGVkKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5ib2FyZC5hZGRPYmplY3RzQWJvdmUoXG4gICAgICAgICAgICAgICAgICAgIFt0aGlzLm92ZXJsYXlXcmFwcGVyXSxcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5ib2FyZC5jb250cm9sbGVyLm1pbk92ZXJsYXlNYXJrZXIsXG4gICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgdGhpcy5ib2FyZC5yZW1vdmVPYmplY3RzKFt0aGlzLm92ZXJsYXlXcmFwcGVyXSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLm92ZXJsYXkuaXNTZWxlY3RlZCA9IGlzU2VsZWN0ZWQ7XG4gICAgfVxuXG4gICAgcHVibGljIG9uU3Bhd24oYm9hcmQ6IEJvYXJkKTogdm9pZCB7XG4gICAgICAgIHN1cGVyLm9uU3Bhd24oYm9hcmQpO1xuXG4gICAgICAgIGNvbnN0IHNlbGVjdCA9IGJvYXJkLmNvbnRyb2xsZXIuc2VsZWN0O1xuICAgICAgICBjb25zdCBtb3VzZSA9IHRoaXMuYm9hcmQuY29udHJvbGxlci5tb3VzZTtcblxuICAgICAgICB0aGlzLnN1YnNjcmlwdGlvbnMucHVzaChcbiAgICAgICAgICAgIG1vdXNlLm9uTW91c2VEb3duLmxpc3Rlbih0aGlzLCBlID0+IHtcbiAgICAgICAgICAgICAgICBzZWxlY3Qub25PYmplY3RNb3VzZURvd24oZSk7XG4gICAgICAgICAgICB9KSxcbiAgICAgICAgKTtcbiAgICAgICAgdGhpcy5zdWJzY3JpcHRpb25zLnB1c2goXG4gICAgICAgICAgICBtb3VzZS5vbk1vdXNlQ2xpY2subGlzdGVuKHRoaXMsIGUgPT4ge1xuICAgICAgICAgICAgICAgIHNlbGVjdC5vbk9iamVjdENsaWNrKGUpO1xuICAgICAgICAgICAgfSksXG4gICAgICAgICk7XG5cbiAgICAgICAgdGhpcy5zdWJzY3JpcHRpb25zLnB1c2goXG4gICAgICAgICAgICBzZWxlY3Qub25TZWxlY3QubGlzdGVuKHVuZGVmaW5lZCwgZSA9PiB7XG4gICAgICAgICAgICAgICAgdGhpcy5pc1NlbGVjdGVkID0gdGhpcy5pc1NlbGVjdGVkIHx8IGUudGFyZ2V0ID09IHRoaXMuY29udGVudDtcbiAgICAgICAgICAgIH0pLFxuICAgICAgICApO1xuICAgICAgICB0aGlzLnN1YnNjcmlwdGlvbnMucHVzaChcbiAgICAgICAgICAgIHNlbGVjdC5vbkRlc2VsZWN0Lmxpc3Rlbih1bmRlZmluZWQsIGUgPT4ge1xuICAgICAgICAgICAgICAgIHRoaXMuaXNTZWxlY3RlZCA9IHRoaXMuaXNTZWxlY3RlZCAmJiBlLnRhcmdldCAhPSB0aGlzLmNvbnRlbnQ7XG4gICAgICAgICAgICB9KSxcbiAgICAgICAgKTtcbiAgICB9XG5cbiAgICBwdWJsaWMgb25EZXNwYXduKGJvYXJkOiBCb2FyZCk6IHZvaWQge1xuICAgICAgICBpZiAodGhpcy5faXNTZWxlY3RlZCkge1xuICAgICAgICAgICAgdGhpcy5ib2FyZC5yZW1vdmVPYmplY3RzKFt0aGlzLm92ZXJsYXlXcmFwcGVyXSk7XG4gICAgICAgIH1cbiAgICAgICAgc3VwZXIub25EZXNwYXduKGJvYXJkKTtcbiAgICB9XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRUb3BTZWxlY3RhYmxlT25FdmVudFN0YWNrPFQ+KFxuICAgIGV2ZW50U3RhY2s6IE9wdGlvbmFsPFRbXT4sXG4pOiBPcHRpb25hbDxTZWxlY3RhYmxlPiB7XG4gICAgaWYgKGV2ZW50U3RhY2sgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgIH1cblxuICAgIGZvciAoY29uc3QgaXRlbSBvZiBldmVudFN0YWNrKSB7XG4gICAgICAgIGlmIChcImlzU2VsZWN0YWJsZVwiIGluIGl0ZW0pIHtcbiAgICAgICAgICAgIHJldHVybiA8U2VsZWN0YWJsZT4oPHVua25vd24+aXRlbSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gdW5kZWZpbmVkO1xufVxuIiwiaW1wb3J0IHsgR2VvbWV0cmljT2JqZWN0IH0gZnJvbSBcIkBjYW52YXMvYm9hcmQvb2JqZWN0cy9HZW9tZXRyaWNPYmplY3RcIjtcbmltcG9ydCB0eXBlIHsgU2VsZWN0aW9uT3ZlcmxheSB9IGZyb20gXCJAY2FudmFzL2JvYXJkL29iamVjdHMvdWkvc2VsZWN0YWJsZS9TZWxlY3Rpb25PdmVybGF5XCI7XG5pbXBvcnQgdHlwZSB7IEJvdW5kaW5nQm94IH0gZnJvbSBcIkBjYW52YXMvcHJpbWl0aXZlcy9zcGFjZVwiO1xuaW1wb3J0IHR5cGUgeyBPcHRpb25hbCB9IGZyb20gXCJAY2FudmFzL3ByaW1pdGl2ZXMvdHlwZXNcIjtcbmltcG9ydCB0eXBlIHsgUmVuZGVyQ29udGV4dCB9IGZyb20gXCJAY2FudmFzL3JlbmRlci9SZW5kZXJDb250ZXh0XCI7XG5pbXBvcnQgdHlwZSB7IFZpZXdwb3J0IH0gZnJvbSBcIkBjYW52YXMvcmVuZGVyL1ZpZXdwb3J0XCI7XG5pbXBvcnQgeyBkZWZhdWx0RnJhbWVDb2xvciB9IGZyb20gXCJAY29uZmlnL2RyYXdcIjtcblxuZXhwb3J0IGNsYXNzIFNlbGVjdGlvRnJhbWVTdHlsZSB7XG4gICAgY29uc3RydWN0b3IoXG4gICAgICAgIHJlYWRvbmx5IGZyYW1lQ29sb3I6IHN0cmluZyA9IGRlZmF1bHRGcmFtZUNvbG9yLFxuICAgICAgICByZWFkb25seSBmcmFtZVdpZHRoID0gMSxcbiAgICApIHt9XG59XG5cbmV4cG9ydCBjbGFzcyBTZWxlY3Rpb25GcmFtZSBleHRlbmRzIEdlb21ldHJpY09iamVjdCB7XG4gICAgY29uc3RydWN0b3IoXG4gICAgICAgIHJlYWRvbmx5IG92ZXJsYXk6IFNlbGVjdGlvbk92ZXJsYXksXG4gICAgICAgIHJlYWRvbmx5IHN0eWxlOiBTZWxlY3Rpb0ZyYW1lU3R5bGUgPSBuZXcgU2VsZWN0aW9GcmFtZVN0eWxlKCksXG4gICAgKSB7XG4gICAgICAgIHN1cGVyKCk7XG4gICAgfVxuXG4gICAgcHVibGljIGJvdW5kaW5nQm94KHZpZXdwb3J0OiBWaWV3cG9ydCk6IEJvdW5kaW5nQm94IHtcbiAgICAgICAgY29uc3Qgc3RyZXRjaCA9IHRoaXMuc3R5bGUuZnJhbWVXaWR0aCAvIDI7XG5cbiAgICAgICAgcmV0dXJuIHRoaXMub3ZlcmxheS5zZWxlY3RhYmxlLmNvbnRlbnRcbiAgICAgICAgICAgIC5ib3VuZGluZ0JveCh2aWV3cG9ydClcbiAgICAgICAgICAgIC5zdHJldGNoKHN0cmV0Y2gsIHN0cmV0Y2gsIHN0cmV0Y2gsIHN0cmV0Y2gpO1xuICAgIH1cblxuICAgIHB1YmxpYyBkcmF3KHJlbmRlckN0eDogUmVuZGVyQ29udGV4dCk6IHZvaWQge1xuICAgICAgICBjb25zdCBzZWxlY3Rpb25GcmFtZSA9IHRoaXMuYm91bmRpbmdCb3gocmVuZGVyQ3R4LnZpZXdwb3J0KTtcblxuICAgICAgICByZW5kZXJDdHguY3R4LmxpbmVXaWR0aCA9IHRoaXMuc3R5bGUuZnJhbWVXaWR0aDtcblxuICAgICAgICByZW5kZXJDdHguY3R4Lmdsb2JhbENvbXBvc2l0ZU9wZXJhdGlvbiA9IFwiZGlmZmVyZW5jZVwiO1xuICAgICAgICByZW5kZXJDdHguY3R4LnN0cm9rZVN0eWxlID0gXCJ3aGl0ZVwiO1xuICAgICAgICByZW5kZXJDdHguY3R4LnN0cm9rZVJlY3QoXG4gICAgICAgICAgICBzZWxlY3Rpb25GcmFtZS5wb3NpdGlvbi54LFxuICAgICAgICAgICAgc2VsZWN0aW9uRnJhbWUucG9zaXRpb24ueSxcbiAgICAgICAgICAgIHNlbGVjdGlvbkZyYW1lLnNpemUueCxcbiAgICAgICAgICAgIHNlbGVjdGlvbkZyYW1lLnNpemUueSxcbiAgICAgICAgKTtcblxuICAgICAgICByZW5kZXJDdHguY3R4Lmdsb2JhbENvbXBvc2l0ZU9wZXJhdGlvbiA9IFwic291cmNlLW92ZXJcIjtcbiAgICAgICAgcmVuZGVyQ3R4LmN0eC5nbG9iYWxBbHBoYSA9IDAuNTtcbiAgICAgICAgcmVuZGVyQ3R4LmN0eC5zdHJva2VTdHlsZSA9IHRoaXMuc3R5bGUuZnJhbWVDb2xvcjtcbiAgICAgICAgcmVuZGVyQ3R4LmN0eC5zdHJva2VSZWN0KFxuICAgICAgICAgICAgc2VsZWN0aW9uRnJhbWUucG9zaXRpb24ueCxcbiAgICAgICAgICAgIHNlbGVjdGlvbkZyYW1lLnBvc2l0aW9uLnksXG4gICAgICAgICAgICBzZWxlY3Rpb25GcmFtZS5zaXplLngsXG4gICAgICAgICAgICBzZWxlY3Rpb25GcmFtZS5zaXplLnksXG4gICAgICAgICk7XG4gICAgfVxuXG4gICAgcHVibGljIGNhc3RSYXkoKTogT3B0aW9uYWw8R2VvbWV0cmljT2JqZWN0W10+IHtcbiAgICAgICAgLy8gRnJhbWUgaXMgbm90IGhpdHRhYmxlXG4gICAgICAgIHJldHVybiB1bmRlZmluZWQ7XG4gICAgfVxufVxuIiwiaW1wb3J0IHR5cGUgeyBCb2FyZCB9IGZyb20gXCJAY2FudmFzL2JvYXJkL0JvYXJkXCI7XG5pbXBvcnQge1xuICAgIEJvYXJkTW9kZSxcbiAgICBjYW5NYW5pcHVsYXRlLFxuICAgIGNhbk1vdmUsXG4gICAgY2FuU2VsZWN0LFxufSBmcm9tIFwiQGNhbnZhcy9ib2FyZC9jb250cm9sbGVycy9Cb2FyZE1vZGVcIjtcbmltcG9ydCB7IHNob3dDYW5Nb3ZlQ3Vyc29yIH0gZnJvbSBcIkBjYW52YXMvYm9hcmQvY29udHJvbGxlcnMvb2JqZWN0cy9Nb3ZlT2JqZWN0Q29udHJvbGxlclwiO1xuaW1wb3J0IHR5cGUgeyBHZW9tZXRyaWNPYmplY3QgfSBmcm9tIFwiQGNhbnZhcy9ib2FyZC9vYmplY3RzLy9HZW9tZXRyaWNPYmplY3RcIjtcbmltcG9ydCB7IEdyb3VwIH0gZnJvbSBcIkBjYW52YXMvYm9hcmQvb2JqZWN0cy9mb3VuZGF0aW9uL0dyb3VwXCI7XG5pbXBvcnQgeyBSZXNpemVGcmFtZSB9IGZyb20gXCJAY2FudmFzL2JvYXJkL29iamVjdHMvdWkvc2VsZWN0YWJsZS9SZXNpemVGcmFtZVwiO1xuaW1wb3J0IHsgUm90YXRlRnJhbWUgfSBmcm9tIFwiQGNhbnZhcy9ib2FyZC9vYmplY3RzL3VpL3NlbGVjdGFibGUvUm90YXRlRnJhbWVcIjtcbmltcG9ydCB0eXBlIHtcbiAgICBTZWxlY3RhYmxlLFxuICAgIFNlbGVjdGlvbk9wdGlvbnMsXG59IGZyb20gXCJAY2FudmFzL2JvYXJkL29iamVjdHMvdWkvc2VsZWN0YWJsZS9TZWxlY3RhYmxlXCI7XG5pbXBvcnQgeyBTZWxlY3Rpb25GcmFtZSB9IGZyb20gXCJAY2FudmFzL2JvYXJkL29iamVjdHMvdWkvc2VsZWN0YWJsZS9TZWxlY3Rpb25GcmFtZVwiO1xuaW1wb3J0IHsgcmVzZXRDdXJzb3IgfSBmcm9tIFwiQGNhbnZhcy9wcmltaXRpdmVzL2RvbVwiO1xuaW1wb3J0IHR5cGUgeyBPcHRpb25hbCB9IGZyb20gXCJAY2FudmFzL3ByaW1pdGl2ZXMvdHlwZXNcIjtcblxuZXhwb3J0IGNsYXNzIFNlbGVjdGlvbk92ZXJsYXkgZXh0ZW5kcyBHcm91cCB7XG4gICAgcmVhZG9ubHkgc2VsZWN0aW9uRnJhbWU6IFNlbGVjdGlvbkZyYW1lO1xuICAgIHJlYWRvbmx5IHJlc2l6ZUZyYW1lOiBPcHRpb25hbDxSZXNpemVGcmFtZT47XG4gICAgcmVhZG9ubHkgcm90YXRlRnJhbWU6IE9wdGlvbmFsPFJvdGF0ZUZyYW1lPjtcblxuICAgIHByaXZhdGUgX2lzU2VsZWN0ZWQgPSBmYWxzZTtcblxuICAgIGNvbnN0cnVjdG9yKFxuICAgICAgICByZWFkb25seSBzZWxlY3RhYmxlOiBTZWxlY3RhYmxlLFxuICAgICAgICByZWFkb25seSBvcHRpb25zOiBTZWxlY3Rpb25PcHRpb25zLFxuICAgICkge1xuICAgICAgICBzdXBlcigpO1xuXG4gICAgICAgIHRoaXMuc2VsZWN0aW9uRnJhbWUgPSBuZXcgU2VsZWN0aW9uRnJhbWUodGhpcyk7XG5cbiAgICAgICAgaWYgKHRoaXMub3B0aW9ucy5jYW5SZXNpemUpIHtcbiAgICAgICAgICAgIHRoaXMucmVzaXplRnJhbWUgPSBuZXcgUmVzaXplRnJhbWUoXG4gICAgICAgICAgICAgICAgdGhpcyxcbiAgICAgICAgICAgICAgICB0aGlzLm9wdGlvbnMucmVzaXplSGFuZGxlcyxcbiAgICAgICAgICAgICk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodGhpcy5vcHRpb25zLmNhblJvdGF0ZSkge1xuICAgICAgICAgICAgdGhpcy5yb3RhdGVGcmFtZSA9IG5ldyBSb3RhdGVGcmFtZSh0aGlzKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMudXBkYXRlQ2hpbGRyZW4oKTtcbiAgICB9XG5cbiAgICBwdWJsaWMgZ2V0IGlzU2VsZWN0ZWQoKTogYm9vbGVhbiB7XG4gICAgICAgIHJldHVybiB0aGlzLl9pc1NlbGVjdGVkO1xuICAgIH1cblxuICAgIHB1YmxpYyBzZXQgaXNTZWxlY3RlZChpc1NlbGVjdGVkOiBib29sZWFuKSB7XG4gICAgICAgIHRoaXMuX2lzU2VsZWN0ZWQgPSBpc1NlbGVjdGVkO1xuICAgICAgICB0aGlzLnVwZGF0ZUNoaWxkcmVuKCk7XG4gICAgfVxuXG4gICAgcHVibGljIG9uU3Bhd24oYm9hcmQ6IEJvYXJkKTogdm9pZCB7XG4gICAgICAgIHN1cGVyLm9uU3Bhd24oYm9hcmQpO1xuXG4gICAgICAgIGNvbnN0IGN0cmwgPSB0aGlzLmJvYXJkLmNvbnRyb2xsZXI7XG4gICAgICAgIGNvbnN0IG1vdXNlID0gY3RybC5tb3VzZTtcblxuICAgICAgICB0aGlzLnN1YnNjcmlwdGlvbnMucHVzaChcbiAgICAgICAgICAgIG1vdXNlLm9uTW91c2VNb3ZlLmxpc3Rlbih0aGlzLnNlbGVjdGFibGUsICgpID0+IHtcbiAgICAgICAgICAgICAgICBpZiAoXG4gICAgICAgICAgICAgICAgICAgIHRoaXMub3B0aW9ucy5jYW5Nb3ZlICYmXG4gICAgICAgICAgICAgICAgICAgIGNhbk1vdmUoY3RybC5tb2RlLnN0YXRlKSAmJlxuICAgICAgICAgICAgICAgICAgICB0aGlzLmlzU2VsZWN0ZWRcbiAgICAgICAgICAgICAgICApIHtcbiAgICAgICAgICAgICAgICAgICAgc2hvd0Nhbk1vdmVDdXJzb3IoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KSxcbiAgICAgICAgKTtcbiAgICAgICAgdGhpcy5zdWJzY3JpcHRpb25zLnB1c2goXG4gICAgICAgICAgICBtb3VzZS5vbk1vdXNlT3V0Lmxpc3Rlbih0aGlzLnNlbGVjdGFibGUsICgpID0+IHtcbiAgICAgICAgICAgICAgICBpZiAoY2FuU2VsZWN0KGN0cmwubW9kZS5zdGF0ZSkpIHtcbiAgICAgICAgICAgICAgICAgICAgcmVzZXRDdXJzb3IoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KSxcbiAgICAgICAgKTtcbiAgICAgICAgLy8gVE9ETzogbWFrZSB0aGlzIGdlbmVyYWwgZm9yIGFsbCBjYW5NYW5pcHVsYXRlIG1vZGVzXG4gICAgICAgIHRoaXMuc3Vic2NyaXB0aW9ucy5wdXNoKFxuICAgICAgICAgICAgY3RybC5tb2RlLm9uRW50ZXIubGlzdGVuKEJvYXJkTW9kZS5UZXh0RWRpdGluZywgKCkgPT4ge1xuICAgICAgICAgICAgICAgIHRoaXMudXBkYXRlQ2hpbGRyZW4oKTtcbiAgICAgICAgICAgIH0pLFxuICAgICAgICApO1xuICAgICAgICB0aGlzLnN1YnNjcmlwdGlvbnMucHVzaChcbiAgICAgICAgICAgIGN0cmwubW9kZS5vbkV4aXQubGlzdGVuKEJvYXJkTW9kZS5UZXh0RWRpdGluZywgKCkgPT4ge1xuICAgICAgICAgICAgICAgIHRoaXMudXBkYXRlQ2hpbGRyZW4oKTtcbiAgICAgICAgICAgIH0pLFxuICAgICAgICApO1xuICAgIH1cblxuICAgIHB1YmxpYyBvbkRlc3Bhd24oYm9hcmQ6IEJvYXJkKTogdm9pZCB7XG4gICAgICAgIHJlc2V0Q3Vyc29yKCk7XG4gICAgICAgIHN1cGVyLm9uRGVzcGF3bihib2FyZCk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSB1cGRhdGVDaGlsZHJlbigpOiB2b2lkIHtcbiAgICAgICAgaWYgKHRoaXMuYm9hcmQgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgY2hpbGRyZW46IEdlb21ldHJpY09iamVjdFtdID0gW107XG5cbiAgICAgICAgaWYgKHRoaXMuX2lzU2VsZWN0ZWQpIHtcbiAgICAgICAgICAgIGNoaWxkcmVuLnB1c2godGhpcy5zZWxlY3Rpb25GcmFtZSk7XG5cbiAgICAgICAgICAgIGNvbnN0IG1hbmlwdWxhdGFibGUgPVxuICAgICAgICAgICAgICAgIC8vIE9ubHkgc2VsZWN0ZWRcbiAgICAgICAgICAgICAgICB0aGlzLmJvYXJkLmNvbnRyb2xsZXIuc2VsZWN0LnNlbGVjdGVkT2JqZWN0cy5zaXplID09IDEgJiZcbiAgICAgICAgICAgICAgICBjYW5NYW5pcHVsYXRlKHRoaXMuYm9hcmQuY29udHJvbGxlci5tb2RlLnN0YXRlKTtcblxuICAgICAgICAgICAgaWYgKHRoaXMub3B0aW9ucy5jYW5Sb3RhdGUgJiYgbWFuaXB1bGF0YWJsZSkge1xuICAgICAgICAgICAgICAgIGNoaWxkcmVuLnB1c2godGhpcy5yb3RhdGVGcmFtZSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmICh0aGlzLm9wdGlvbnMuY2FuUmVzaXplICYmIG1hbmlwdWxhdGFibGUpIHtcbiAgICAgICAgICAgICAgICBjaGlsZHJlbi5wdXNoKHRoaXMucmVzaXplRnJhbWUpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5jaGlsZHJlbiA9IGNoaWxkcmVuO1xuICAgIH1cbn1cbiIsImltcG9ydCB0eXBlIHsgQm9hcmRDb25maWdQYXJ0aWFsIH0gZnJvbSBcIkBjYW52YXMvYm9hcmQvQm9hcmRcIjtcbmltcG9ydCB7IEJvYXJkLCBCb2FyZENvbmZpZyB9IGZyb20gXCJAY2FudmFzL2JvYXJkL0JvYXJkXCI7XG5pbXBvcnQgeyBFdmVudEhhbmRsZXIgYXMgUmVhbEV2ZW50SGFuZGxlciB9IGZyb20gXCJAY2FudmFzL3ByaW1pdGl2ZXMvZXZlbnRzXCI7XG5cbmV4cG9ydCBmdW5jdGlvbiBjcmVhdGUoXG4gICAgYm9hcmRJZDogc3RyaW5nLFxuICAgIGNvbmZpZ092ZXJyaWRlOiBCb2FyZENvbmZpZ1BhcnRpYWwgPSB7fSxcbik6IEJvYXJkIHtcbiAgICBjb25zdCBib2FyZEVsZW1lbnQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChib2FyZElkKTtcbiAgICBjb25zdCBib2FyZCA9IG5ldyBCb2FyZChcbiAgICAgICAgd2luZG93LFxuICAgICAgICBib2FyZEVsZW1lbnQsXG4gICAgICAgIG5ldyBCb2FyZENvbmZpZygpLmNvcHkoY29uZmlnT3ZlcnJpZGUpLFxuICAgICk7XG4gICAgYm9hcmQucnVuKCk7XG5cbiAgICByZXR1cm4gYm9hcmQ7XG59XG5cbmV4cG9ydCBjb25zdCBFdmVudEhhbmRsZXIgPSBSZWFsRXZlbnRIYW5kbGVyO1xuIiwiaW1wb3J0IHsgRXZlbnRCYXNlLCBFdmVudEhhbmRsZXIgfSBmcm9tIFwiQGNhbnZhcy9wcmltaXRpdmVzL2V2ZW50c1wiO1xuXG5leHBvcnQgY2xhc3MgU3RhdGVNYWNoaW5lVHJhbnNpdGlvbkV2ZW50PFQ+IGV4dGVuZHMgRXZlbnRCYXNlPFQ+IHtcbiAgICBjb25zdHJ1Y3Rvcihtb2RlOiBUKSB7XG4gICAgICAgIHN1cGVyKFttb2RlXSk7XG4gICAgfVxufVxuXG5leHBvcnQgY2xhc3MgU3RhdGVNYWNoaW5lPFQ+IHtcbiAgICByZWFkb25seSBvbkVudGVyID0gbmV3IEV2ZW50SGFuZGxlcjxTdGF0ZU1hY2hpbmVUcmFuc2l0aW9uRXZlbnQ8VD4+KCk7XG4gICAgcmVhZG9ubHkgb25FeGl0ID0gbmV3IEV2ZW50SGFuZGxlcjxTdGF0ZU1hY2hpbmVUcmFuc2l0aW9uRXZlbnQ8VD4+KCk7XG5cbiAgICBjb25zdHJ1Y3Rvcihwcml2YXRlIF9zdGF0ZTogVCkge31cblxuICAgIHB1YmxpYyBnZXQgc3RhdGUoKTogVCB7XG4gICAgICAgIHJldHVybiB0aGlzLl9zdGF0ZTtcbiAgICB9XG5cbiAgICBwdWJsaWMgc2V0IHN0YXRlKHN0YXRlOiBUKSB7XG4gICAgICAgIHRoaXMub25FeGl0LmRpc3BhdGNoKG5ldyBTdGF0ZU1hY2hpbmVUcmFuc2l0aW9uRXZlbnQ8VD4odGhpcy5fc3RhdGUpKTtcbiAgICAgICAgdGhpcy5fc3RhdGUgPSBzdGF0ZTtcbiAgICAgICAgdGhpcy5vbkVudGVyLmRpc3BhdGNoKG5ldyBTdGF0ZU1hY2hpbmVUcmFuc2l0aW9uRXZlbnQ8VD4odGhpcy5fc3RhdGUpKTtcbiAgICB9XG59XG4iLCJpbXBvcnQgeyBWZWN0b3IyIH0gZnJvbSBcIkBjYW52YXMvcHJpbWl0aXZlcy9zcGFjZVwiO1xuXG5leHBvcnQgZnVuY3Rpb24gbW91c2VQb3NpdGlvblRvRWxlbWVudChcbiAgICBlOiB7IGNsaWVudFg6IG51bWJlcjsgY2xpZW50WTogbnVtYmVyIH0sXG4gICAgZWxlbWVudDogSFRNTEVsZW1lbnQsXG4pOiBWZWN0b3IyIHtcbiAgICBjb25zdCBjbGllbnRSZWN0ID0gZWxlbWVudC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcblxuICAgIHJldHVybiBuZXcgVmVjdG9yMihlLmNsaWVudFggLSBjbGllbnRSZWN0LngsIGUuY2xpZW50WSAtIGNsaWVudFJlY3QueSk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBzZXRDdXJzb3IoY3Vyc29yOiBzdHJpbmcpOiB2b2lkIHtcbiAgICBkb2N1bWVudC5ib2R5LnN0eWxlLmN1cnNvciA9IGN1cnNvcjtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHJlc2V0Q3Vyc29yKCk6IHZvaWQge1xuICAgIHNldEN1cnNvcihcImF1dG9cIik7XG59XG4iLCJpbXBvcnQgeyBEZWJ1Z0NvbmZpZyB9IGZyb20gXCJAY29uZmlnL2RlYnVnXCI7XG5cbmltcG9ydCB0eXBlIHsgQ29uc3RydWN0b3IsIE9wdGlvbmFsIH0gZnJvbSBcIi4vdHlwZXNcIjtcblxuZXhwb3J0IGNsYXNzIEV2ZW50QmFzZTxUPiB7XG4gICAgcHJpdmF0ZSBfcHJvcGFnYXRpb25TdG9wcGVkID0gZmFsc2U7XG4gICAgcHJpdmF0ZSBfZGVmYXVsdFByZXZlbnRlZCA9IGZhbHNlO1xuXG4gICAgY29uc3RydWN0b3IoXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBFdmVudCBzdGFjayBzb3J0ZWQgZnJvbSBpbm5lciB0byBvdXRlciBlbGVtZW50XG4gICAgICAgICAqL1xuICAgICAgICByZWFkb25seSBldmVudFN0YWNrPzogVFtdLFxuICAgICkge31cblxuICAgIHB1YmxpYyBnZXQgdHlwZSgpOiBDb25zdHJ1Y3RvcjxFdmVudEJhc2U8VD4+IHtcbiAgICAgICAgcmV0dXJuIDxDb25zdHJ1Y3RvcjxFdmVudEJhc2U8VD4+PnRoaXMuY29uc3RydWN0b3I7XG4gICAgfVxuXG4gICAgcHVibGljIGdldCB0YXJnZXQoKTogT3B0aW9uYWw8VD4ge1xuICAgICAgICByZXR1cm4gZ2V0VGFyZ2V0T2ZFdmVudFN0YWNrKHRoaXMuZXZlbnRTdGFjayk7XG4gICAgfVxuXG4gICAgcHVibGljIHN0b3BQcm9wYWdhdGlvbigpOiB2b2lkIHtcbiAgICAgICAgdGhpcy5fcHJvcGFnYXRpb25TdG9wcGVkID0gdHJ1ZTtcbiAgICB9XG5cbiAgICBwdWJsaWMgZ2V0IHByb3BhZ2F0aW9uU3RvcHBlZCgpOiBib29sZWFuIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX3Byb3BhZ2F0aW9uU3RvcHBlZDtcbiAgICB9XG5cbiAgICBwdWJsaWMgcHJldmVudERlZmF1bHQoKTogdm9pZCB7XG4gICAgICAgIHRoaXMuX2RlZmF1bHRQcmV2ZW50ZWQgPSB0cnVlO1xuICAgIH1cblxuICAgIHB1YmxpYyBnZXQgZGVmYXVsdFByZXZlbnRlZCgpOiBib29sZWFuIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2RlZmF1bHRQcmV2ZW50ZWQ7XG4gICAgfVxufVxuXG5leHBvcnQgdHlwZSBFdmVudENhbGxiYWNrPFQsIEUgZXh0ZW5kcyBFdmVudEJhc2U8VD4+ID0gKGU6IEUpID0+IHZvaWQ7XG5cbmV4cG9ydCBpbnRlcmZhY2UgU3Vic2NyaXB0aW9uIHtcbiAgICB1bnN1YnNjcmliZTogKCkgPT4gdm9pZDtcbn1cblxudHlwZSBUYXJnZXRUeXBlPEUgZXh0ZW5kcyBFdmVudEJhc2U8dW5rbm93bj4+ID0gRSBleHRlbmRzIEV2ZW50QmFzZTxpbmZlciBUPlxuICAgID8gVFxuICAgIDogbmV2ZXI7XG5cbmV4cG9ydCBjbGFzcyBFdmVudEhhbmRsZXI8RSBleHRlbmRzIEV2ZW50QmFzZTxUPiwgVCA9IFRhcmdldFR5cGU8RT4+IHtcbiAgICBwcml2YXRlIGV2ZW50TGlzdGVuZXJzID0gbmV3IE1hcDxcbiAgICAgICAgT3B0aW9uYWw8VD4sXG4gICAgICAgIE1hcDxudW1iZXIsIEV2ZW50Q2FsbGJhY2s8VCwgRT4+XG4gICAgPigpO1xuICAgIHByaXZhdGUgZXZlbnRMaXN0ZW5lcnNOZXh0SWQgPSBuZXcgTWFwPE9wdGlvbmFsPFQ+LCBudW1iZXI+KCk7XG5cbiAgICBwdWJsaWMgbGlzdGVuKFxuICAgICAgICB0YXJnZXQ6IE9wdGlvbmFsPFQ+LFxuICAgICAgICBjYWxsYmFjazogRXZlbnRDYWxsYmFjazxULCBFPixcbiAgICApOiBTdWJzY3JpcHRpb24ge1xuICAgICAgICBpZiAoIXRoaXMuZXZlbnRMaXN0ZW5lcnNOZXh0SWQuaGFzKHRhcmdldCkpIHtcbiAgICAgICAgICAgIHRoaXMuZXZlbnRMaXN0ZW5lcnNOZXh0SWQuc2V0KHRhcmdldCwgMCk7XG4gICAgICAgICAgICB0aGlzLmV2ZW50TGlzdGVuZXJzLnNldChcbiAgICAgICAgICAgICAgICB0YXJnZXQsXG4gICAgICAgICAgICAgICAgbmV3IE1hcDxudW1iZXIsIEV2ZW50Q2FsbGJhY2s8VCwgRT4+KCksXG4gICAgICAgICAgICApO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgbGlzdGVuSWQgPSB0aGlzLmV2ZW50TGlzdGVuZXJzTmV4dElkLmdldCh0YXJnZXQpO1xuICAgICAgICB0aGlzLmV2ZW50TGlzdGVuZXJzTmV4dElkLnNldCh0YXJnZXQsIGxpc3RlbklkICsgMSk7XG5cbiAgICAgICAgdGhpcy5ldmVudExpc3RlbmVycy5nZXQodGFyZ2V0KS5zZXQobGlzdGVuSWQsIGNhbGxiYWNrKTtcblxuICAgICAgICAvLyBSZXR1cm4gZnVuY3Rpb24gdG8gdW5saXN0ZW5cbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIHVuc3Vic2NyaWJlOiAoKSA9PiB7XG4gICAgICAgICAgICAgICAgdGhpcy5ldmVudExpc3RlbmVycy5nZXQodGFyZ2V0KS5kZWxldGUobGlzdGVuSWQpO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgfTtcbiAgICB9XG5cbiAgICBwdWJsaWMgZGlzcGF0Y2goZXZlbnQ6IEUpOiB2b2lkIHtcbiAgICAgICAgaWYgKERlYnVnQ29uZmlnLmxvZ0FsbEV2ZW50cykge1xuICAgICAgICAgICAgY29uc29sZS5sb2coZXZlbnQpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGV2ZW50LmV2ZW50U3RhY2sgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgZm9yIChjb25zdCBlbGVtZW50IG9mIGV2ZW50LmV2ZW50U3RhY2spIHtcbiAgICAgICAgICAgICAgICAvLyBMYXN0IGVsZW1lbnQgaW4gc3RhY2sgaXMgdGhlIG91dGVyLW1vc3QgZWxlbWVudFxuICAgICAgICAgICAgICAgIC8vIEJ1YmJsZSBmcm9tIGluc2lkZSBvdXQgKGZpcnN0IHRvIGxhc3QpXG4gICAgICAgICAgICAgICAgY29uc3QgbGlzdGVuZXJzID0gdGhpcy5ldmVudExpc3RlbmVycy5nZXQoZWxlbWVudCk7XG4gICAgICAgICAgICAgICAgdGhpcy5kaXNwYXRjaFRvTGlzdGVuZXJzKGV2ZW50LCBsaXN0ZW5lcnMpO1xuXG4gICAgICAgICAgICAgICAgaWYgKGV2ZW50LnByb3BhZ2F0aW9uU3RvcHBlZCkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgLy8gR2xvYmFsIGV2ZW50XG4gICAgICAgIGNvbnN0IGxpc3RlbmVycyA9IHRoaXMuZXZlbnRMaXN0ZW5lcnMuZ2V0KHVuZGVmaW5lZCk7XG4gICAgICAgIHRoaXMuZGlzcGF0Y2hUb0xpc3RlbmVycyhldmVudCwgbGlzdGVuZXJzKTtcbiAgICB9XG5cbiAgICBwcml2YXRlIGRpc3BhdGNoVG9MaXN0ZW5lcnMoXG4gICAgICAgIGV2ZW50OiBPcHRpb25hbDxFPixcbiAgICAgICAgbGlzdGVuZXJzOiBNYXA8bnVtYmVyLCBFdmVudENhbGxiYWNrPFQsIEU+PixcbiAgICApOiB2b2lkIHtcbiAgICAgICAgaWYgKCFsaXN0ZW5lcnMpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIGxpc3RlbmVycy5mb3JFYWNoKGxpc3RlbmVyID0+IHtcbiAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgbGlzdGVuZXIoZXZlbnQpO1xuICAgICAgICAgICAgfSBjYXRjaCAoZXhjZXB0aW9uKSB7XG4gICAgICAgICAgICAgICAgY29uc29sZS5lcnJvcihleGNlcHRpb24pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBjcmVhdGVEb21FdmVudExpc3RlbmVyPEsgZXh0ZW5kcyBrZXlvZiBIVE1MRWxlbWVudEV2ZW50TWFwPihcbiAgICBlbGVtZW50OiBFdmVudFRhcmdldCxcbiAgICB0eXBlOiBLIHwgc3RyaW5nLFxuICAgIGxpc3RlbmVyOiAodGhpczogSFRNTEVsZW1lbnQsIGV2OiBIVE1MRWxlbWVudEV2ZW50TWFwW0tdKSA9PiB1bmtub3duLFxuICAgIG9wdGlvbnM/OiBib29sZWFuIHwgQWRkRXZlbnRMaXN0ZW5lck9wdGlvbnMsXG4pOiBTdWJzY3JpcHRpb24ge1xuICAgIGVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcih0eXBlLCBsaXN0ZW5lciwgb3B0aW9ucyk7XG5cbiAgICByZXR1cm4ge1xuICAgICAgICB1bnN1YnNjcmliZTogKCkgPT4ge1xuICAgICAgICAgICAgZWxlbWVudC5yZW1vdmVFdmVudExpc3RlbmVyKHR5cGUsIGxpc3RlbmVyLCBvcHRpb25zKTtcbiAgICAgICAgfSxcbiAgICB9O1xufVxuXG5leHBvcnQgZnVuY3Rpb24gdW5zdWJzY3JpYmVBbGwoc3Vic2NyaXB0aW9uczogU3Vic2NyaXB0aW9uW10pOiB2b2lkIHtcbiAgICBzdWJzY3JpcHRpb25zLmZvckVhY2goc3ViID0+IHtcbiAgICAgICAgc3ViLnVuc3Vic2NyaWJlKCk7XG4gICAgfSk7XG4gICAgc3Vic2NyaXB0aW9ucy5sZW5ndGggPSAwO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZ2V0VGFyZ2V0T2ZFdmVudFN0YWNrPFQ+KFxuICAgIGV2ZW50U3RhY2s6IE9wdGlvbmFsPFRbXT4sXG4pOiBPcHRpb25hbDxUPiB7XG4gICAgcmV0dXJuIGV2ZW50U3RhY2sgPT09IHVuZGVmaW5lZCB8fCBldmVudFN0YWNrLmxlbmd0aCA9PSAwXG4gICAgICAgID8gdW5kZWZpbmVkXG4gICAgICAgIDogZXZlbnRTdGFja1swXTtcbn1cbiIsImV4cG9ydCBjbGFzcyBWZWN0b3IyIHtcbiAgICBzdGF0aWMgcmVhZG9ubHkgb3JpZ2luID0gbmV3IFZlY3RvcjIoMCwgMCk7XG5cbiAgICBjb25zdHJ1Y3RvcihyZWFkb25seSB4PzogbnVtYmVyLCByZWFkb25seSB5PzogbnVtYmVyKSB7fVxuXG4gICAgcHVibGljIHBsdXMob3RoZXI6IFZlY3RvcjIpOiBWZWN0b3IyIHtcbiAgICAgICAgcmV0dXJuIG5ldyBWZWN0b3IyKHRoaXMueCArIG90aGVyLngsIHRoaXMueSArIG90aGVyLnkpO1xuICAgIH1cblxuICAgIHB1YmxpYyBtaW51cyhvdGhlcjogVmVjdG9yMik6IFZlY3RvcjIge1xuICAgICAgICByZXR1cm4gbmV3IFZlY3RvcjIodGhpcy54IC0gb3RoZXIueCwgdGhpcy55IC0gb3RoZXIueSk7XG4gICAgfVxuXG4gICAgcHVibGljIHNjYWxlKHNjYWxhcjogbnVtYmVyKTogVmVjdG9yMiB7XG4gICAgICAgIHJldHVybiBuZXcgVmVjdG9yMihzY2FsYXIgKiB0aGlzLngsIHNjYWxhciAqIHRoaXMueSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogUm90YXRlcyBhIDJEIHZlY3RvciBieSBgcmFkaWFuc2AgY2xvY2t3aXNlIGFyb3VuZCBgYXJvdW5kYC5cbiAgICAgKiBAcGFyYW0gcmFkaWFucyBDbG9ja3dpc2UgKGluIHN5c3RlbSB3aGVyZSAwLDAgaXMgaW4gdG9wLWxlZnQgY29ybmVyKVxuICAgICAqICAgICAgcmFkaWFucyBmb3Igcm90YXRpb24uXG4gICAgICogICAgICBJbiBub3JtYWwgY29vcmRpbmF0ZSBzeXN0ZW0sIHRoaXMgaXMgY29uc2lkZXJlZCBjb3VudGVyLWNsb2Nrd2lzZVxuICAgICAqIEBwYXJhbSBhcm91bmQgT3JpZ2luIG9mIHJvdGF0aW9uXG4gICAgICovXG4gICAgcHVibGljIHJvdGF0ZShyYWRpYW5zOiBudW1iZXIsIGFyb3VuZDogVmVjdG9yMiA9IFZlY3RvcjIub3JpZ2luKTogVmVjdG9yMiB7XG4gICAgICAgIGlmIChyYWRpYW5zID09IDApIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gTW92ZSB2ZWN0b3IgdG8gdGhlIG9yaWdpbiAocmVsYXRpdmUgdG8gdGhlIHJvdGF0aW9uIHBvaW50KVxuICAgICAgICBjb25zdCB4ID0gdGhpcy54IC0gYXJvdW5kLng7XG4gICAgICAgIGNvbnN0IHkgPSB0aGlzLnkgLSBhcm91bmQueTtcblxuICAgICAgICAvLyBSb3RhdGVcbiAgICAgICAgY29uc3Qgc2luID0gTWF0aC5zaW4ocmFkaWFucyk7XG4gICAgICAgIGNvbnN0IGNvcyA9IE1hdGguY29zKHJhZGlhbnMpO1xuXG4gICAgICAgIGxldCB4TmV3ID0geCAqIGNvcyAtIHkgKiBzaW47XG4gICAgICAgIGxldCB5TmV3ID0geCAqIHNpbiArIHkgKiBjb3M7XG5cbiAgICAgICAgLy8gTW92ZSBiYWNrIHdoZXJlIGl0IHdhcyBiZWZvcmVcbiAgICAgICAgeE5ldyArPSBhcm91bmQueDtcbiAgICAgICAgeU5ldyArPSBhcm91bmQueTtcblxuICAgICAgICByZXR1cm4gbmV3IFZlY3RvcjIoeE5ldywgeU5ldyk7XG4gICAgfVxuXG4gICAgcHVibGljIHJvdW5kKCk6IFZlY3RvcjIge1xuICAgICAgICByZXR1cm4gbmV3IFZlY3RvcjIoTWF0aC5yb3VuZCh0aGlzLngpLCBNYXRoLnJvdW5kKHRoaXMueSkpO1xuICAgIH1cblxuICAgIHB1YmxpYyBnZXQgZXVjbGlkZWFuTm9ybSgpOiBudW1iZXIge1xuICAgICAgICByZXR1cm4gTWF0aC5zcXJ0KHRoaXMueCAqIHRoaXMueCArIHRoaXMueSAqIHRoaXMueSk7XG4gICAgfVxuXG4gICAgcHVibGljIHJlcGxhY2VQYXJ0aWFsKHg/OiBudW1iZXIgfCBWZWN0b3IyLCB5PzogbnVtYmVyKTogVmVjdG9yMiB7XG4gICAgICAgIGlmICh4IGluc3RhbmNlb2YgVmVjdG9yMikge1xuICAgICAgICAgICAgeSA9IHgueTtcbiAgICAgICAgICAgIHggPSB4Lng7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gbmV3IFZlY3RvcjIoXG4gICAgICAgICAgICB4ID09PSB1bmRlZmluZWQgfHwgaXNOYU4oeCkgPyB0aGlzLnggOiB4LFxuICAgICAgICAgICAgeSA9PT0gdW5kZWZpbmVkIHx8IGlzTmFOKHkpID8gdGhpcy55IDogeSxcbiAgICAgICAgKTtcbiAgICB9XG5cbiAgICBwdWJsaWMgZXF1YWxzKG90aGVyOiBWZWN0b3IyKTogYm9vbGVhbiB7XG4gICAgICAgIHJldHVybiB0aGlzLnggPT09IG90aGVyLnggJiYgdGhpcy55ID09PSBvdGhlci55O1xuICAgIH1cblxuICAgIHB1YmxpYyB0b1N0cmluZygpOiBzdHJpbmcge1xuICAgICAgICByZXR1cm4gYFZlY3RvcjIoJHt0aGlzLnh9LCR7dGhpcy55fSlgO1xuICAgIH1cbn1cblxuZXhwb3J0IGNsYXNzIEJvdW5kaW5nQm94IHtcbiAgICBjb25zdHJ1Y3RvcihyZWFkb25seSBwb3NpdGlvbjogVmVjdG9yMiwgcmVhZG9ubHkgc2l6ZTogVmVjdG9yMikge31cblxuICAgIC8qKlxuICAgICAqXG4gICAgICogQHBhcmFtIHBvc2l0aW9uIFJldHVybnMgYSBCb3VuZGluZ0JveCB3aXRoIG5vbi1uZWdhdGl2ZSBzaXplLlxuICAgICAqIEBwYXJhbSBzaXplXG4gICAgICovXG4gICAgcHVibGljIHN0YXRpYyBub3JtYWxpemVkKHBvc2l0aW9uOiBWZWN0b3IyLCBzaXplOiBWZWN0b3IyKTogQm91bmRpbmdCb3gge1xuICAgICAgICByZXR1cm4gbmV3IEJvdW5kaW5nQm94KFxuICAgICAgICAgICAgbmV3IFZlY3RvcjIoXG4gICAgICAgICAgICAgICAgcG9zaXRpb24ueCArIChzaXplLnggPCAwID8gc2l6ZS54IDogMCksXG4gICAgICAgICAgICAgICAgcG9zaXRpb24ueSArIChzaXplLnkgPCAwID8gc2l6ZS55IDogMCksXG4gICAgICAgICAgICApLFxuICAgICAgICAgICAgbmV3IFZlY3RvcjIoTWF0aC5hYnMoc2l6ZS54KSwgTWF0aC5hYnMoc2l6ZS55KSksXG4gICAgICAgICk7XG4gICAgfVxuXG4gICAgcHVibGljIHJvdW5kKCk6IEJvdW5kaW5nQm94IHtcbiAgICAgICAgcmV0dXJuIG5ldyBCb3VuZGluZ0JveCh0aGlzLnBvc2l0aW9uLnJvdW5kKCksIHRoaXMuc2l6ZS5yb3VuZCgpKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBTdHJldGNoIChlbmxhcmdlKSBhIGJvdW5kaW5nIGJveCBpbiBhbGwgZGlyZWN0aW9ucy5cbiAgICAgKiBOZWdhdGl2ZSB2YWx1ZXMgY2FuIGJlIHVzZWQgdG8gbWFrZSBpdCBzbWFsbGVyXG4gICAgICogQHBhcmFtIHRvcFxuICAgICAqIEBwYXJhbSByaWdodFxuICAgICAqIEBwYXJhbSBib3R0b21cbiAgICAgKiBAcGFyYW0gbGVmdFxuICAgICAqL1xuICAgIHB1YmxpYyBzdHJldGNoKFxuICAgICAgICB0b3A6IG51bWJlcixcbiAgICAgICAgcmlnaHQ6IG51bWJlcixcbiAgICAgICAgYm90dG9tOiBudW1iZXIsXG4gICAgICAgIGxlZnQ6IG51bWJlcixcbiAgICApOiBCb3VuZGluZ0JveCB7XG4gICAgICAgIHJldHVybiBuZXcgQm91bmRpbmdCb3goXG4gICAgICAgICAgICBuZXcgVmVjdG9yMih0aGlzLnBvc2l0aW9uLnggLSBsZWZ0LCB0aGlzLnBvc2l0aW9uLnkgLSB0b3ApLFxuICAgICAgICAgICAgbmV3IFZlY3RvcjIodGhpcy5zaXplLnggKyBsZWZ0ICsgcmlnaHQsIHRoaXMuc2l6ZS55ICsgdG9wICsgYm90dG9tKSxcbiAgICAgICAgKTtcbiAgICB9XG5cbiAgICBwdWJsaWMgY2VudGVyKCk6IFZlY3RvcjIge1xuICAgICAgICByZXR1cm4gdGhpcy5wb3NpdGlvbi5wbHVzKHRoaXMuc2l6ZS5zY2FsZSgwLjUpKTtcbiAgICB9XG5cbiAgICBwdWJsaWMgZXF1YWxzKG90aGVyOiBCb3VuZGluZ0JveCk6IGJvb2xlYW4ge1xuICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgb3RoZXIgIT09IHVuZGVmaW5lZCAmJlxuICAgICAgICAgICAgdGhpcy5wb3NpdGlvbi5lcXVhbHMob3RoZXIucG9zaXRpb24pICYmXG4gICAgICAgICAgICB0aGlzLnNpemUuZXF1YWxzKG90aGVyLnNpemUpXG4gICAgICAgICk7XG4gICAgfVxufVxuXG5leHBvcnQgZnVuY3Rpb24gcmF5SW5Cb3VuZGluZ0JveChcbiAgICByYXlQb3NpdGlvbjogVmVjdG9yMixcbiAgICBib3VuZGluZ0JveDogQm91bmRpbmdCb3gsXG4pOiBib29sZWFuIHtcbiAgICBjb25zdCBib3R0b21SaWdodCA9IGJvdW5kaW5nQm94LnBvc2l0aW9uLnBsdXMoYm91bmRpbmdCb3guc2l6ZSk7XG5cbiAgICByZXR1cm4gKFxuICAgICAgICBib3VuZGluZ0JveC5wb3NpdGlvbi54IDw9IHJheVBvc2l0aW9uLnggJiZcbiAgICAgICAgYm91bmRpbmdCb3gucG9zaXRpb24ueSA8PSByYXlQb3NpdGlvbi55ICYmXG4gICAgICAgIGJvdHRvbVJpZ2h0LnggPj0gcmF5UG9zaXRpb24ueCAmJlxuICAgICAgICBib3R0b21SaWdodC55ID49IHJheVBvc2l0aW9uLnlcbiAgICApO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZG9Cb3VuZGluZ0JveGVzT3ZlcmxhcChcbiAgICBhOiBCb3VuZGluZ0JveCxcbiAgICBiOiBCb3VuZGluZ0JveCxcbik6IGJvb2xlYW4ge1xuICAgIGNvbnN0IGFSaWdodEJvdHRvbSA9IGEucG9zaXRpb24ucGx1cyhhLnNpemUpO1xuICAgIGNvbnN0IGJSaWdodEJvdHRvbSA9IGIucG9zaXRpb24ucGx1cyhiLnNpemUpO1xuXG4gICAgY29uc3QgbGVmdE1heCA9IE1hdGgubWF4KGEucG9zaXRpb24ueCwgYi5wb3NpdGlvbi54KTtcbiAgICBjb25zdCByaWdodE1pbiA9IE1hdGgubWluKGFSaWdodEJvdHRvbS54LCBiUmlnaHRCb3R0b20ueCk7XG5cbiAgICBjb25zdCB0b3BNYXggPSBNYXRoLm1heChhLnBvc2l0aW9uLnksIGIucG9zaXRpb24ueSk7XG4gICAgY29uc3QgYm90dG9tTWluID0gTWF0aC5taW4oYVJpZ2h0Qm90dG9tLnksIGJSaWdodEJvdHRvbS55KTtcblxuICAgIHJldHVybiByaWdodE1pbiA+IGxlZnRNYXggJiYgYm90dG9tTWluID4gdG9wTWF4O1xufVxuIiwiaW1wb3J0IHR5cGUgeyBCb3VuZGluZ0JveEhvbGRlciB9IGZyb20gXCJAY2FudmFzL2JvYXJkL29iamVjdHMvR2VvbWV0cmljT2JqZWN0XCI7XG5pbXBvcnQgdHlwZSB7IEJvdW5kaW5nQm94IH0gZnJvbSBcIkBjYW52YXMvcHJpbWl0aXZlcy9zcGFjZVwiO1xuaW1wb3J0IHR5cGUgeyBSZW5kZXJPYmplY3QgfSBmcm9tIFwiQGNhbnZhcy9yZW5kZXIvUmVuZGVyT2JqZWN0XCI7XG5pbXBvcnQgeyBEZWJ1Z0NvbmZpZyB9IGZyb20gXCJAY29uZmlnL2RlYnVnXCI7XG5cbmltcG9ydCB7IFJlbmRlckNvbnRleHQgfSBmcm9tIFwiLi9SZW5kZXJDb250ZXh0XCI7XG5pbXBvcnQgdHlwZSB7IFZpZXdwb3J0IH0gZnJvbSBcIi4vVmlld3BvcnRcIjtcblxuZXhwb3J0IGNsYXNzIENhbnZhc0xheWVyIHtcbiAgICBwcml2YXRlIG9iamVjdHM6IFJlbmRlck9iamVjdFtdID0gW107XG5cbiAgICBwcml2YXRlIGxhc3RWaWV3cG9ydDogVmlld3BvcnQ7XG5cbiAgICBjb25zdHJ1Y3RvcihcbiAgICAgICAgcHJpdmF0ZSBjdHg6IENhbnZhc1JlbmRlcmluZ0NvbnRleHQyRCxcbiAgICAgICAgcmVhZG9ubHkgZHByOiBudW1iZXIgPSAxLFxuICAgICkge31cblxuICAgIHB1YmxpYyByZW5kZXIodGltZXN0YW1wOiBudW1iZXIsIHZpZXdwb3J0OiBWaWV3cG9ydCk6IHZvaWQge1xuICAgICAgICAvLyBDaGVjayBpZiBjYW52YXMgc2l6ZSBjaGFuZ2VkXG4gICAgICAgIGlmICh2aWV3cG9ydC5zaXplICE9IHRoaXMubGFzdFZpZXdwb3J0Py5zaXplKSB7XG4gICAgICAgICAgICB0aGlzLnJlc2NhbGUodmlld3BvcnQpO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5sYXN0Vmlld3BvcnQgPSB2aWV3cG9ydDtcblxuICAgICAgICAvLyBDbGVhciBiZWZvcmUgcmVkcmF3XG4gICAgICAgIHRoaXMuY2xlYXIodmlld3BvcnQpO1xuXG4gICAgICAgIC8vIENyZWF0ZSByZW5kZXIgY29udGV4dCBmb3Igb2JqZWN0c1xuICAgICAgICBjb25zdCByZW5kZXJDdHggPSBuZXcgUmVuZGVyQ29udGV4dChcbiAgICAgICAgICAgIHZpZXdwb3J0LFxuICAgICAgICAgICAgdGhpcy5jdHgsXG4gICAgICAgICAgICB0aW1lc3RhbXAsXG4gICAgICAgICAgICB0aGlzLmRwcixcbiAgICAgICAgKTtcblxuICAgICAgICAvLyBSZWRyYXcgYWxsIG9iamVjdHNcbiAgICAgICAgZm9yIChjb25zdCBvYmplY3Qgb2YgdGhpcy5vYmplY3RzKSB7XG4gICAgICAgICAgICB0aGlzLmN0eC5zYXZlKCk7XG4gICAgICAgICAgICBvYmplY3QuZHJhdyhyZW5kZXJDdHgpO1xuICAgICAgICAgICAgdGhpcy5jdHgucmVzdG9yZSgpO1xuXG4gICAgICAgICAgICBpZiAoRGVidWdDb25maWcudGludEJvdW5kaW5nQm94ZXMpIHtcbiAgICAgICAgICAgICAgICB0aW50Qm91bmRpbmdCb3gob2JqZWN0LCByZW5kZXJDdHgpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHVibGljIGdldCBuZWVkc1JlbmRlcmluZygpOiBib29sZWFuIHtcbiAgICAgICAgcmV0dXJuIHRoaXMub2JqZWN0cy5zb21lKG8gPT4gby5uZWVkc1JlZHJhdyk7XG4gICAgfVxuXG4gICAgcHVibGljIHVwZGF0ZU9iamVjdHMob2JqZWN0czogUmVuZGVyT2JqZWN0W10pOiB2b2lkIHtcbiAgICAgICAgdGhpcy5vYmplY3RzID0gb2JqZWN0cztcbiAgICB9XG5cbiAgICBwcml2YXRlIGNsZWFyKHZpZXdwb3J0OiBWaWV3cG9ydCk6IHZvaWQge1xuICAgICAgICAvLyBUT0RPOiBXaGF0IGhhcHBlbnMgd2l0aCBlbGVtZW50cyBvdXRzaWRlIG9mIHZpZXdwb3J0P1xuICAgICAgICAvLyBDbGVhciB2aWV3cG9ydFxuICAgICAgICB0aGlzLmN0eC5jbGVhclJlY3QoMCwgMCwgdmlld3BvcnQuc2l6ZS54LCB2aWV3cG9ydC5zaXplLnkpO1xuICAgIH1cblxuICAgIHByaXZhdGUgcmVzY2FsZSh2aWV3cG9ydDogVmlld3BvcnQpOiB2b2lkIHtcbiAgICAgICAgY29uc3Qgc2NhbGVkU2l6ZSA9IHZpZXdwb3J0LnNpemUuc2NhbGUodGhpcy5kcHIpO1xuICAgICAgICBjb25zdCBjYW52YXMgPSB0aGlzLmN0eC5jYW52YXM7XG5cbiAgICAgICAgY2FudmFzLndpZHRoID0gc2NhbGVkU2l6ZS54O1xuICAgICAgICBjYW52YXMuaGVpZ2h0ID0gc2NhbGVkU2l6ZS55O1xuICAgICAgICBjYW52YXMuc3R5bGUud2lkdGggPSBgJHt2aWV3cG9ydC5zaXplLnh9cHhgO1xuICAgICAgICBjYW52YXMuc3R5bGUuaGVpZ2h0ID0gYCR7dmlld3BvcnQuc2l6ZS55fXB4YDtcbiAgICAgICAgdGhpcy5jdHguc2NhbGUodGhpcy5kcHIsIHRoaXMuZHByKTtcbiAgICB9XG59XG5cbmV4cG9ydCBmdW5jdGlvbiB0aW50Qm91bmRpbmdCb3goXG4gICAgb2JqZWN0OiBSZW5kZXJPYmplY3QsXG4gICAgcmVuZGVyQ3R4OiBSZW5kZXJDb250ZXh0LFxuICAgIGJvdW5kaW5nQm94PzogQm91bmRpbmdCb3gsXG4pOiB2b2lkIHtcbiAgICBpZiAoYm91bmRpbmdCb3ggPT09IHVuZGVmaW5lZCAmJiBcImJvdW5kaW5nQm94XCIgaW4gb2JqZWN0KSB7XG4gICAgICAgIGJvdW5kaW5nQm94ID0gKDxCb3VuZGluZ0JveEhvbGRlcj4oPHVua25vd24+b2JqZWN0KSkuYm91bmRpbmdCb3goXG4gICAgICAgICAgICByZW5kZXJDdHgudmlld3BvcnQsXG4gICAgICAgICk7XG4gICAgfVxuXG4gICAgaWYgKGJvdW5kaW5nQm94ID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGNvbnN0IGhhc2ggPVxuICAgICAgICBvYmplY3QuY29uc3RydWN0b3IubmFtZVxuICAgICAgICAgICAgLnNwbGl0KFwiXCIpXG4gICAgICAgICAgICAubWFwKGMgPT4gYy5jaGFyQ29kZUF0KDApKVxuICAgICAgICAgICAgLnJlZHVjZSgoYWNjLCB2YWwpID0+IChhY2MgKyBhY2MpIF4gdmFsLCAwKSAlIDM2MDtcblxuICAgIHJlbmRlckN0eC5jdHguc2F2ZSgpO1xuICAgIHJlbmRlckN0eC5jdHguZmlsbFN0eWxlID0gYGhzbCgke2hhc2h9LDEwMCUsNTAlKWA7XG4gICAgcmVuZGVyQ3R4LmN0eC5saW5lV2lkdGggPSAxO1xuICAgIHJlbmRlckN0eC5jdHguZ2xvYmFsQWxwaGEgPSAwLjE7XG5cbiAgICBjb25zdCBiYiA9IGJvdW5kaW5nQm94LnN0cmV0Y2goMSwgMSwgMSwgMSk7XG4gICAgcmVuZGVyQ3R4LmN0eC5maWxsUmVjdChiYi5wb3NpdGlvbi54LCBiYi5wb3NpdGlvbi55LCBiYi5zaXplLngsIGJiLnNpemUueSk7XG4gICAgcmVuZGVyQ3R4LmN0eC5yZXN0b3JlKCk7XG59XG4iLCJpbXBvcnQgdHlwZSB7IFJlbmRlck9iamVjdCB9IGZyb20gXCJAY2FudmFzL3JlbmRlci9SZW5kZXJPYmplY3RcIjtcbmltcG9ydCB7IFpCdWZmZXIgfSBmcm9tIFwiQGNhbnZhcy9yZW5kZXIvWkJ1ZmZlclwiO1xuXG5pbXBvcnQgeyBDYW52YXNMYXllciB9IGZyb20gXCIuL0NhbnZhc0xheWVyXCI7XG5pbXBvcnQgdHlwZSB7IFZpZXdwb3J0SG9sZGVyIH0gZnJvbSBcIi4vVmlld3BvcnRcIjtcblxuZXhwb3J0IGNsYXNzIExheWVyZWRSZW5kZXJlciB7XG4gICAgcmVhZG9ubHkgZHByOiBudW1iZXI7XG5cbiAgICBwcml2YXRlIGJ1ZmZlcjogWkJ1ZmZlcjxSZW5kZXJPYmplY3Q+ID0gbmV3IFpCdWZmZXIoKTtcblxuICAgIHByaXZhdGUgY2FudmFzTGF5ZXJzOiBDYW52YXNMYXllcltdID0gW107XG4gICAgcHJpdmF0ZSBpc1JlbmRlcmluZyA9IGZhbHNlO1xuICAgIHByaXZhdGUgcmVuZGVyaW5nUmVxdWVzdGVkID0gZmFsc2U7XG4gICAgcHJpdmF0ZSBmb3JjZUZ1bGxSZW5kZXJpbmcgPSBmYWxzZTtcblxuICAgIGNvbnN0cnVjdG9yKFxuICAgICAgICBwcml2YXRlIHdpbmRvdzogV2luZG93LFxuICAgICAgICBwcml2YXRlIHRhcmdldEVsZW1lbnQ6IEhUTUxFbGVtZW50LFxuICAgICAgICBwcml2YXRlIGNvbnRleHRIb2xkZXI6IFZpZXdwb3J0SG9sZGVyLFxuICAgICkge1xuICAgICAgICB0aGlzLmRwciA9IHdpbmRvdy5kZXZpY2VQaXhlbFJhdGlvIHx8IDE7XG4gICAgICAgIHRoaXMuYWRkQ2FudmFzTGF5ZXIoKTtcbiAgICB9XG5cbiAgICBwdWJsaWMgcmVxdWVzdEZ1bGxSZW5kZXIoKTogdm9pZCB7XG4gICAgICAgIHRoaXMuZm9yY2VGdWxsUmVuZGVyaW5nID0gdHJ1ZTtcblxuICAgICAgICBpZiAoIXRoaXMucmVuZGVyaW5nUmVxdWVzdGVkKSB7XG4gICAgICAgICAgICB0aGlzLnJlcXVlc3RBbmltYXRpb25GcmFtZSgpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHVibGljIGFkZE9iamVjdHMob2JqZWN0czogUmVuZGVyT2JqZWN0W10sIHo/OiBudW1iZXIpOiB2b2lkIHtcbiAgICAgICAgdGhpcy5idWZmZXIuYWRkTWFueShvYmplY3RzLCB6KTtcbiAgICAgICAgdGhpcy51cGRhdGVDYW52YXNMYXllcnMoKTtcbiAgICAgICAgdGhpcy5tYXJrRGlydHlPYmplY3RzKG9iamVjdHMpO1xuICAgIH1cblxuICAgIHB1YmxpYyBhZGRPYmplY3RzQWJvdmUoXG4gICAgICAgIG9iamVjdHM6IFJlbmRlck9iamVjdFtdLFxuICAgICAgICBsYXN0QmVsb3c6IFJlbmRlck9iamVjdCxcbiAgICApOiB2b2lkIHtcbiAgICAgICAgdGhpcy5hZGRPYmplY3RzKG9iamVjdHMsIHRoaXMuYnVmZmVyLmdldEluZGV4KGxhc3RCZWxvdykgKyAxKTtcbiAgICB9XG5cbiAgICBwdWJsaWMgYWRkT2JqZWN0c0JlbG93KFxuICAgICAgICBvYmplY3RzOiBSZW5kZXJPYmplY3RbXSxcbiAgICAgICAgZmlyc3RPblRvcDogUmVuZGVyT2JqZWN0LFxuICAgICk6IHZvaWQge1xuICAgICAgICB0aGlzLmFkZE9iamVjdHMob2JqZWN0cywgdGhpcy5idWZmZXIuZ2V0SW5kZXgoZmlyc3RPblRvcCkpO1xuICAgIH1cblxuICAgIHB1YmxpYyByZW1vdmVPYmplY3RzKG9iamVjdHM6IFJlbmRlck9iamVjdFtdKTogdm9pZCB7XG4gICAgICAgIHRoaXMuYnVmZmVyLnJlbW92ZU1hbnkob2JqZWN0cyk7XG4gICAgICAgIHRoaXMudXBkYXRlQ2FudmFzTGF5ZXJzKCk7XG4gICAgICAgIHRoaXMubWFya0RpcnR5T2JqZWN0cyhvYmplY3RzKTtcbiAgICB9XG5cbiAgICBwdWJsaWMgbW92ZU9iamVjdHNUbyhvYmplY3RzOiBSZW5kZXJPYmplY3RbXSwgej86IG51bWJlcik6IHZvaWQge1xuICAgICAgICB0aGlzLmJ1ZmZlci5tb3ZlTWFueVRvKG9iamVjdHMsIHopO1xuICAgICAgICB0aGlzLnVwZGF0ZUNhbnZhc0xheWVycygpO1xuICAgICAgICB0aGlzLm1hcmtEaXJ0eU9iamVjdHMob2JqZWN0cyk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogTW92ZSBvYmplY3RzICh3aGlsZSBtYWludGFpbmluZyB0aGVpciByZWxhdGl2ZSBvcmRlcmluZyB0byBlYWNoIG90aGVyKVxuICAgICAqIG9uIHRvcCBvZiBhbm90aGVyIGV4aXN0aW5nIG9iamVjdC5cbiAgICAgKi9cbiAgICBwdWJsaWMgbW92ZU9iamVjdHNBYm92ZShcbiAgICAgICAgb2JqZWN0czogUmVuZGVyT2JqZWN0W10sXG4gICAgICAgIGxhc3RCZWxvdzogUmVuZGVyT2JqZWN0LFxuICAgICk6IHZvaWQge1xuICAgICAgICB0aGlzLm1vdmVPYmplY3RzVG8ob2JqZWN0cywgdGhpcy5idWZmZXIuZ2V0SW5kZXgobGFzdEJlbG93KSArIDEpO1xuICAgIH1cblxuICAgIHB1YmxpYyBtb3ZlT2JqZWN0c0JlbG93KFxuICAgICAgICBvYmplY3RzOiBSZW5kZXJPYmplY3RbXSxcbiAgICAgICAgZmlyc3RPblRvcDogUmVuZGVyT2JqZWN0LFxuICAgICk6IHZvaWQge1xuICAgICAgICB0aGlzLm1vdmVPYmplY3RzVG8ob2JqZWN0cywgdGhpcy5idWZmZXIuZ2V0SW5kZXgoZmlyc3RPblRvcCkpO1xuICAgIH1cblxuICAgIHB1YmxpYyByZW9yZGVyTWFueUFib3ZlKFxuICAgICAgICBzb3J0ZWRPYmplY3RzOiBSZW5kZXJPYmplY3RbXSxcbiAgICAgICAgbGFzdEJlbG93OiBSZW5kZXJPYmplY3QsXG4gICAgKTogdm9pZCB7XG4gICAgICAgIHRoaXMuYnVmZmVyLnJlb3JkZXJNYW55VG8oXG4gICAgICAgICAgICBzb3J0ZWRPYmplY3RzLFxuICAgICAgICAgICAgdGhpcy5idWZmZXIuZ2V0SW5kZXgobGFzdEJlbG93KSArIDEsXG4gICAgICAgICk7XG4gICAgICAgIHRoaXMudXBkYXRlQ2FudmFzTGF5ZXJzKCk7XG4gICAgICAgIHRoaXMubWFya0RpcnR5T2JqZWN0cyhzb3J0ZWRPYmplY3RzKTtcbiAgICB9XG5cbiAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgQHR5cGVzY3JpcHQtZXNsaW50L25vLXVudXNlZC12YXJzXG4gICAgcHVibGljIG1hcmtEaXJ0eU9iamVjdHMob2JqZWN0czogUmVuZGVyT2JqZWN0W10pOiB2b2lkIHtcbiAgICAgICAgLy8gSWdub3JlIG9iamVjdHMgZm9yIG5vdywgZGlydHkgb2JqZWN0cyBjYXVzZSBhIGNvbXBsZXRlIHJlZHJhdy5cbiAgICAgICAgLy8gVE9ETzogSW4gZnV0dXJlIGltcGxlbWVudGF0aW9ucywgb25seSBzcGVjaWZpYyBsYXllcnMgb3IgcmVnaW9uc1xuICAgICAgICAvLyBjb3VsZCBiZSByZWRyYXduLlxuXG4gICAgICAgIHRoaXMucmVxdWVzdEZ1bGxSZW5kZXIoKTtcbiAgICB9XG5cbiAgICBwdWJsaWMgZ2V0IG9iamVjdHMoKTogUmVuZGVyT2JqZWN0W10ge1xuICAgICAgICByZXR1cm4gdGhpcy5idWZmZXIuc29ydGVkKCk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSByZXF1ZXN0QW5pbWF0aW9uRnJhbWUoKTogdm9pZCB7XG4gICAgICAgIGlmICghdGhpcy5yZW5kZXJpbmdSZXF1ZXN0ZWQpIHtcbiAgICAgICAgICAgIHRoaXMucmVuZGVyaW5nUmVxdWVzdGVkID0gdHJ1ZTtcblxuICAgICAgICAgICAgdGhpcy53aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lKCh0aW1lc3RhbXA6IG51bWJlcikgPT4ge1xuICAgICAgICAgICAgICAgIHRoaXMucmVuZGVyaW5nUmVxdWVzdGVkID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgdGhpcy5yZW5kZXIodGltZXN0YW1wKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHJpdmF0ZSByZW5kZXIodGltZXN0YW1wOiBudW1iZXIpOiB2b2lkIHtcbiAgICAgICAgaWYgKHRoaXMuaXNSZW5kZXJpbmcpIHtcbiAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoXCJSZW5kZXJpbmcgaW52b2tlZCBkdXJpbmcgcmVuZGVyaW5nLlwiKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8qICoqKiBTdGFydCBvZiByZW5kZXJpbmcgKioqICovXG4gICAgICAgIHRoaXMuaXNSZW5kZXJpbmcgPSB0cnVlO1xuXG4gICAgICAgIGZvciAoY29uc3QgbGF5ZXIgb2YgdGhpcy5jYW52YXNMYXllcnMpIHtcbiAgICAgICAgICAgIGlmICh0aGlzLmZvcmNlRnVsbFJlbmRlcmluZyB8fCBsYXllci5uZWVkc1JlbmRlcmluZykge1xuICAgICAgICAgICAgICAgIGxheWVyLnJlbmRlcih0aW1lc3RhbXAsIHRoaXMuY29udGV4dEhvbGRlci52aWV3cG9ydCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICAvLyBSZXNldCBmb3JjZSBmdWxsIHJlbmRlcmluZ1xuICAgICAgICB0aGlzLmZvcmNlRnVsbFJlbmRlcmluZyA9IGZhbHNlO1xuXG4gICAgICAgIHRoaXMuaXNSZW5kZXJpbmcgPSBmYWxzZTtcbiAgICAgICAgLyogKioqIEVuZCBvZiByZW5kZXJpbmcgKioqICovXG5cbiAgICAgICAgLy8gUmVxdWVzdCBuZXh0IGFuaW1hdGlvbiBmcmFtZSBpZiBhIGxheWVyIG5lZWRzIHJlLXJlbmRlcmluZ1xuICAgICAgICBpZiAodGhpcy5jYW52YXNMYXllcnMuc29tZShsID0+IGwubmVlZHNSZW5kZXJpbmcpKSB7XG4gICAgICAgICAgICB0aGlzLnJlcXVlc3RBbmltYXRpb25GcmFtZSgpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBhZGRDYW52YXNMYXllcigpIHtcbiAgICAgICAgY29uc3QgY2FudmFzRWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJjYW52YXNcIik7XG4gICAgICAgIHRoaXMudGFyZ2V0RWxlbWVudC5hcHBlbmRDaGlsZChjYW52YXNFbGVtZW50KTtcblxuICAgICAgICBjb25zdCBjdHggPSBjYW52YXNFbGVtZW50LmdldENvbnRleHQoXCIyZFwiKTtcbiAgICAgICAgdGhpcy5jYW52YXNMYXllcnMucHVzaChuZXcgQ2FudmFzTGF5ZXIoY3R4LCB0aGlzLmRwcikpO1xuICAgIH1cblxuICAgIHByaXZhdGUgdXBkYXRlQ2FudmFzTGF5ZXJzKCkge1xuICAgICAgICB0aGlzLmNhbnZhc0xheWVyc1swXS51cGRhdGVPYmplY3RzKHRoaXMub2JqZWN0cyk7XG4gICAgfVxufVxuIiwiaW1wb3J0IHR5cGUgeyBWaWV3cG9ydCB9IGZyb20gXCIuL1ZpZXdwb3J0XCI7XG5cbmV4cG9ydCBjbGFzcyBSZW5kZXJDb250ZXh0IHtcbiAgICBjb25zdHJ1Y3RvcihcbiAgICAgICAgcmVhZG9ubHkgdmlld3BvcnQ6IFZpZXdwb3J0LFxuICAgICAgICByZWFkb25seSBjdHg6IENhbnZhc1JlbmRlcmluZ0NvbnRleHQyRCxcbiAgICAgICAgcmVhZG9ubHkgdGltZXN0YW1wOiBudW1iZXIsXG4gICAgICAgIHJlYWRvbmx5IGRwcjogbnVtYmVyLFxuICAgICkge31cbn1cbiIsImltcG9ydCB7IFZlY3RvcjIgfSBmcm9tIFwiQGNhbnZhcy9wcmltaXRpdmVzL3NwYWNlXCI7XG5cbmV4cG9ydCBjbGFzcyBWaWV3cG9ydCB7XG4gICAgc3RhdGljIHJlYWRvbmx5IHdvcmxkID0gbmV3IFZpZXdwb3J0KFZlY3RvcjIub3JpZ2luLCAxLjAsIFZlY3RvcjIub3JpZ2luKTtcblxuICAgIGNvbnN0cnVjdG9yKFxuICAgICAgICByZWFkb25seSBzaXplOiBWZWN0b3IyID0gVmVjdG9yMi5vcmlnaW4sXG4gICAgICAgIHJlYWRvbmx5IHpvb21MZXZlbDogbnVtYmVyID0gMS4wLFxuICAgICAgICByZWFkb25seSBvcmlnaW46IFZlY3RvcjIgPSBWZWN0b3IyLm9yaWdpbixcbiAgICApIHt9XG5cbiAgICBwdWJsaWMgbW9kaWZpZWQoXG4gICAgICAgIHNpemU6IFZlY3RvcjIgPSB0aGlzLnNpemUsXG4gICAgICAgIHpvb21MZXZlbDogbnVtYmVyID0gdGhpcy56b29tTGV2ZWwsXG4gICAgICAgIG9yaWdpbjogVmVjdG9yMiA9IHRoaXMub3JpZ2luLFxuICAgICk6IFZpZXdwb3J0IHtcbiAgICAgICAgcmV0dXJuIG5ldyBWaWV3cG9ydChzaXplLCB6b29tTGV2ZWwsIG9yaWdpbik7XG4gICAgfVxuXG4gICAgcHVibGljIHRvVmlld3BvcnRQb3NpdGlvbih3b3JsZFBvc2l0aW9uOiBWZWN0b3IyKTogVmVjdG9yMiB7XG4gICAgICAgIHJldHVybiBuZXcgVmVjdG9yMihcbiAgICAgICAgICAgIHRoaXMuem9vbUxldmVsICogKHdvcmxkUG9zaXRpb24ueCAtIHRoaXMub3JpZ2luLngpLFxuICAgICAgICAgICAgdGhpcy56b29tTGV2ZWwgKiAod29ybGRQb3NpdGlvbi55IC0gdGhpcy5vcmlnaW4ueSksXG4gICAgICAgICk7XG4gICAgfVxuXG4gICAgcHVibGljIHRvVmlld3BvcnRTaXplKHdvcmxkU2l6ZTogVmVjdG9yMik6IFZlY3RvcjIge1xuICAgICAgICByZXR1cm4gd29ybGRTaXplLnNjYWxlKHRoaXMuem9vbUxldmVsKTtcbiAgICB9XG5cbiAgICBwdWJsaWMgdG9Xb3JsZFBvc2l0aW9uKHZpZXdwb3J0UG9zaXRpb246IFZlY3RvcjIpOiBWZWN0b3IyIHtcbiAgICAgICAgcmV0dXJuIG5ldyBWZWN0b3IyKFxuICAgICAgICAgICAgdmlld3BvcnRQb3NpdGlvbi54IC8gdGhpcy56b29tTGV2ZWwgKyB0aGlzLm9yaWdpbi54LFxuICAgICAgICAgICAgdmlld3BvcnRQb3NpdGlvbi55IC8gdGhpcy56b29tTGV2ZWwgKyB0aGlzLm9yaWdpbi55LFxuICAgICAgICApO1xuICAgIH1cblxuICAgIHB1YmxpYyB0b1dvcmxkU2l6ZSh2aWV3cG9ydFNpemU6IFZlY3RvcjIpOiBWZWN0b3IyIHtcbiAgICAgICAgcmV0dXJuIHZpZXdwb3J0U2l6ZS5zY2FsZSgxIC8gdGhpcy56b29tTGV2ZWwpO1xuICAgIH1cbn1cblxuZXhwb3J0IGNsYXNzIFRvcExlZnRDbGlwcGVkVmlld3BvcnQgZXh0ZW5kcyBWaWV3cG9ydCB7XG4gICAgY29uc3RydWN0b3IoXG4gICAgICAgIHByaXZhdGUgdmlld3BvcnRDbGlwT2Zmc2V0OiBWZWN0b3IyLFxuICAgICAgICBzaXplPzogVmVjdG9yMixcbiAgICAgICAgem9vbUxldmVsPzogbnVtYmVyLFxuICAgICAgICBvcmlnaW4/OiBWZWN0b3IyLFxuICAgICkge1xuICAgICAgICBzdXBlcihzaXplLCB6b29tTGV2ZWwsIG9yaWdpbik7XG4gICAgfVxuXG4gICAgcHVibGljIG1vZGlmaWVkKFxuICAgICAgICBzaXplOiBWZWN0b3IyID0gdGhpcy5zaXplLFxuICAgICAgICB6b29tTGV2ZWw6IG51bWJlciA9IHRoaXMuem9vbUxldmVsLFxuICAgICAgICBvcmlnaW46IFZlY3RvcjIgPSB0aGlzLm9yaWdpbixcbiAgICApOiBUb3BMZWZ0Q2xpcHBlZFZpZXdwb3J0IHtcbiAgICAgICAgY29uc3QgY2xpcHBlZE9yaWdpbiA9IG5ldyBWZWN0b3IyKFxuICAgICAgICAgICAgTWF0aC5tYXgoXG4gICAgICAgICAgICAgICAgTWF0aC5taW4odGhpcy52aWV3cG9ydENsaXBPZmZzZXQueCwgLTAuNSAqIHRoaXMuc2l6ZS54KSAvXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuem9vbUxldmVsLFxuICAgICAgICAgICAgICAgIG9yaWdpbi54LFxuICAgICAgICAgICAgKSxcbiAgICAgICAgICAgIE1hdGgubWF4KFxuICAgICAgICAgICAgICAgIE1hdGgubWluKHRoaXMudmlld3BvcnRDbGlwT2Zmc2V0LnksIC0wLjUgKiB0aGlzLnNpemUueSkgL1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnpvb21MZXZlbCxcbiAgICAgICAgICAgICAgICBvcmlnaW4ueSxcbiAgICAgICAgICAgICksXG4gICAgICAgICk7XG5cbiAgICAgICAgcmV0dXJuIG5ldyBUb3BMZWZ0Q2xpcHBlZFZpZXdwb3J0KFxuICAgICAgICAgICAgdGhpcy52aWV3cG9ydENsaXBPZmZzZXQsXG4gICAgICAgICAgICBzaXplLFxuICAgICAgICAgICAgem9vbUxldmVsLFxuICAgICAgICAgICAgY2xpcHBlZE9yaWdpbixcbiAgICAgICAgKTtcbiAgICB9XG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgVmlld3BvcnRIb2xkZXIge1xuICAgIHZpZXdwb3J0OiBWaWV3cG9ydDtcbn1cbiIsImltcG9ydCBcIkBleHQvQXJyYXlcIjtcblxuaW1wb3J0IHR5cGUgeyBPcHRpb25hbCB9IGZyb20gXCJAY2FudmFzL3ByaW1pdGl2ZXMvdHlwZXNcIjtcblxuZXhwb3J0IGNsYXNzIFpCdWZmZXI8VD4ge1xuICAgIHByaXZhdGUgYnVmZmVyOiBUW10gPSBbXTtcbiAgICBwcml2YXRlIGluZGljZXMgPSBuZXcgTWFwPFQsIG51bWJlcj4oKTtcblxuICAgIHB1YmxpYyBhZGQob2JqZWN0OiBULCB6PzogbnVtYmVyKTogdm9pZCB7XG4gICAgICAgIHRoaXMuYWRkTWFueShbb2JqZWN0XSwgeik7XG4gICAgfVxuXG4gICAgcHVibGljIGFkZE1hbnkob2JqZWN0czogVFtdLCB6PzogbnVtYmVyKTogdm9pZCB7XG4gICAgICAgIHRoaXMuY2hlY2tOb3RFeGlzdChvYmplY3RzKTtcblxuICAgICAgICBpZiAoeiA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAvLyBObyBpbmRleCBzcGVjaWZpZWQ6IFN0YWNrIG9uIHRvcFxuICAgICAgICAgICAgeiA9IHRoaXMuYnVmZmVyLmxlbmd0aDtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh6ID49IHRoaXMuYnVmZmVyLmxlbmd0aCkge1xuICAgICAgICAgICAgLy8gU3RhY2sgb24gdG9wXG4gICAgICAgICAgICB0aGlzLmJ1ZmZlci5wdXNoKC4uLm9iamVjdHMpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgLy8gSW5kZXggYWxyZWFkeSBleGlzdHNcbiAgICAgICAgICAgIC8vIE1vdmUgYWxsIGV4aXN0aW5nIG9iamVjdHMgZnJvbSB0aGlzIGluZGV4IHVwd2FyZHMgb25lIHNsb3QgdXBcbiAgICAgICAgICAgIHRoaXMuYnVmZmVyLnNwbGljZSh6LCAwLCAuLi5vYmplY3RzKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLnJlaW5kZXgoeik7XG4gICAgfVxuXG4gICAgcHVibGljIHJlbW92ZShvYmplY3Q6IFQpOiB2b2lkIHtcbiAgICAgICAgdGhpcy5yZW1vdmVNYW55KFtvYmplY3RdKTtcbiAgICB9XG5cbiAgICBwdWJsaWMgcmVtb3ZlTWFueShvYmplY3RzOiBUW10pOiB2b2lkIHtcbiAgICAgICAgaWYgKG9iamVjdHMubGVuZ3RoID09IDApIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuY2hlY2tFeGlzdChvYmplY3RzKTtcblxuICAgICAgICBjb25zdCB6cyA9IHRoaXMuc29ydGVkT2JqZWN0cyhvYmplY3RzKTtcbiAgICAgICAgY29uc3Qgek1pbiA9IHRoaXMuaW5kaWNlcy5nZXQoenNbMF0pO1xuXG4gICAgICAgIC8vIFJlYnVpbGQgYXJyYXkgZnJvbSBtaW5aIG9uIHdpdGggcmVtYWluaW5nIG9iamVjdHNcbiAgICAgICAgY29uc3QgcmVtYWluaW5nOiBUW10gPSBbXTtcbiAgICAgICAgbGV0IGkgPSB6TWluO1xuICAgICAgICBsZXQgaiA9IDA7XG5cbiAgICAgICAgZm9yICg7IGkgPCB0aGlzLmJ1ZmZlci5sZW5ndGggJiYgaiA8IHpzLmxlbmd0aDsgKytpKSB7XG4gICAgICAgICAgICBpZiAodGhpcy5idWZmZXJbaV0gPT0genNbal0pIHtcbiAgICAgICAgICAgICAgICAvLyBDYW1lIGFjcm9zcyBvYmplY3QgdG8gcmVtb3ZlOlxuICAgICAgICAgICAgICAgIC8vIEFkdmFuY2UgYW5kIHNraXAgaXRlbSBpbiByZWFtaW5pbmdcbiAgICAgICAgICAgICAgICArK2o7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHJlbWFpbmluZy5wdXNoKHRoaXMuYnVmZmVyW2ldKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIG9iamVjdHMuZm9yRWFjaChvYmplY3QgPT4ge1xuICAgICAgICAgICAgdGhpcy5pbmRpY2VzLmRlbGV0ZShvYmplY3QpO1xuICAgICAgICB9KTtcblxuICAgICAgICB0aGlzLmJ1ZmZlci5zcGxpY2Uoek1pbiwgaSAtIHpNaW4sIC4uLnJlbWFpbmluZyk7XG4gICAgICAgIHRoaXMucmVpbmRleCh6TWluKTtcbiAgICB9XG5cbiAgICBwdWJsaWMgbW92ZVRvKG9iamVjdDogVCwgejogbnVtYmVyKTogdm9pZCB7XG4gICAgICAgIHRoaXMubW92ZU1hbnlUbyhbb2JqZWN0XSwgeik7XG4gICAgfVxuXG4gICAgcHVibGljIG1vdmVNYW55VG8ob2JqZWN0czogVFtdLCB6OiBudW1iZXIpOiB2b2lkIHtcbiAgICAgICAgdGhpcy5jaGVja0V4aXN0KG9iamVjdHMpO1xuXG4gICAgICAgIC8vIFN0b3JlIHJlbGF0aXZlIG9yZGVyaW5nIG9mIG9iamVjdHNcbiAgICAgICAgY29uc3Qgc29ydGVkT2JqZWN0cyA9IHRoaXMuc29ydGVkT2JqZWN0cyhvYmplY3RzKTtcblxuICAgICAgICB0aGlzLnJlbW92ZU1hbnkob2JqZWN0cyk7XG4gICAgICAgIHRoaXMuYWRkTWFueShzb3J0ZWRPYmplY3RzLCB6KTtcbiAgICB9XG5cbiAgICBwdWJsaWMgcmVvcmRlck1hbnlUbyhzb3J0ZWRPYmplY3RzOiBUW10sIHo6IG51bWJlcik6IHZvaWQge1xuICAgICAgICB0aGlzLmNoZWNrRXhpc3Qoc29ydGVkT2JqZWN0cyk7XG4gICAgICAgIHRoaXMucmVtb3ZlTWFueShzb3J0ZWRPYmplY3RzKTtcbiAgICAgICAgdGhpcy5hZGRNYW55KHNvcnRlZE9iamVjdHMsIHopO1xuICAgIH1cblxuICAgIHB1YmxpYyBnZXRJbmRleChvYmplY3Q6IFQpOiBPcHRpb25hbDxudW1iZXI+IHtcbiAgICAgICAgcmV0dXJuIHRoaXMuaW5kaWNlcy5nZXQob2JqZWN0KTtcbiAgICB9XG5cbiAgICBwdWJsaWMgc29ydGVkKCk6IFRbXSB7XG4gICAgICAgIHJldHVybiBbLi4udGhpcy5idWZmZXJdO1xuICAgIH1cblxuICAgIHByaXZhdGUgY2hlY2tOb3RFeGlzdChvYmplY3RzOiBUW10pOiB2b2lkIHtcbiAgICAgICAgY29uc3QgZXhpc3RpbmcgPSBvYmplY3RzLmZpbHRlcihvYmplY3QgPT4gdGhpcy5pbmRpY2VzLmhhcyhvYmplY3QpKTtcblxuICAgICAgICBpZiAoZXhpc3RpbmcubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgdGhyb3cgW1wiQ2Fubm90IHVzZSBleGlzdGluZyBvYmplY3RzOlwiLCBleGlzdGluZ107XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwcml2YXRlIGNoZWNrRXhpc3Qob2JqZWN0czogVFtdKTogdm9pZCB7XG4gICAgICAgIGNvbnN0IG5vbkV4aXN0aW5nID0gb2JqZWN0cy5maWx0ZXIob2JqZWN0ID0+ICF0aGlzLmluZGljZXMuaGFzKG9iamVjdCkpO1xuXG4gICAgICAgIGlmIChub25FeGlzdGluZy5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICB0aHJvdyBbXCJDYW5ub3QgdXNlIG5vbi1leGlzdGluZyBvYmplY3RzOlwiLCBub25FeGlzdGluZ107XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwcml2YXRlIHNvcnRlZE9iamVjdHMob2JqZWN0czogVFtdKTogVFtdIHtcbiAgICAgICAgcmV0dXJuIG9iamVjdHNcbiAgICAgICAgICAgIC5tYXAob2JqZWN0ID0+IFtvYmplY3QsIHRoaXMuZ2V0SW5kZXgob2JqZWN0KV0pXG4gICAgICAgICAgICAuc29ydCgoYTogW1QsIG51bWJlcl0sIGI6IFtULCBudW1iZXJdKSA9PiBhWzFdIC0gYlsxXSlcbiAgICAgICAgICAgIC5tYXAoKHg6IFtULCBudW1iZXJdKSA9PiB4WzBdKTtcbiAgICB9XG5cbiAgICBwcml2YXRlIHJlaW5kZXgoZnJvbUluY2x1ZGUgPSAwLCB0b0V4Y2x1ZGUgPSB0aGlzLmJ1ZmZlci5sZW5ndGgpOiB2b2lkIHtcbiAgICAgICAgZm9yIChsZXQgaSA9IGZyb21JbmNsdWRlOyBpIDwgdG9FeGNsdWRlOyArK2kpIHtcbiAgICAgICAgICAgIGNvbnN0IG9iamVjdCA9IHRoaXMuYnVmZmVyW2ldO1xuICAgICAgICAgICAgdGhpcy5pbmRpY2VzLnNldChvYmplY3QsIGkpO1xuICAgICAgICB9XG4gICAgfVxufVxuIiwiaW1wb3J0IHR5cGUgeyBPcHRpb25hbCB9IGZyb20gXCJAY2FudmFzL3ByaW1pdGl2ZXMvdHlwZXNcIjtcblxudHlwZSBGdW5jID0gKC4uLmFyZ3M6IHVua25vd25bXSkgPT4gdW5rbm93bjtcbnR5cGUgVGltZW91dCA9IFJldHVyblR5cGU8dHlwZW9mIHNldFRpbWVvdXQ+O1xuXG5leHBvcnQgZnVuY3Rpb24gZGVib3VuY2U8RiBleHRlbmRzIEZ1bmM+KFxuICAgIGZ1bmM6IEYsXG4gICAgZGVib3VuY2VNczogbnVtYmVyLFxuICAgIGltbWVkaWF0ZSA9IGZhbHNlLFxuKTogKHRoaXM6IFRoaXNQYXJhbWV0ZXJUeXBlPEY+LCAuLi5hcmdzOiBQYXJhbWV0ZXJzPEY+KSA9PiB2b2lkIHtcbiAgICBsZXQgdGltZW91dDogT3B0aW9uYWw8VGltZW91dD47XG5cbiAgICByZXR1cm4gZnVuY3Rpb24gKHRoaXM6IFRoaXNQYXJhbWV0ZXJUeXBlPEY+LCAuLi5hcmdzOiBQYXJhbWV0ZXJzPEY+KSB7XG4gICAgICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBAdHlwZXNjcmlwdC1lc2xpbnQvbm8tdGhpcy1hbGlhc1xuICAgICAgICBjb25zdCBjb250ZXh0ID0gdGhpcztcblxuICAgICAgICBjb25zdCBkZWZlcnJlZCA9ICgpID0+IHtcbiAgICAgICAgICAgIHRpbWVvdXQgPSB1bmRlZmluZWQ7XG5cbiAgICAgICAgICAgIGlmICghaW1tZWRpYXRlKSB7XG4gICAgICAgICAgICAgICAgZnVuYy5hcHBseShjb250ZXh0LCBhcmdzKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcblxuICAgICAgICBjb25zdCBzaG91bGRDYWxsTm93ID0gaW1tZWRpYXRlICYmIHRpbWVvdXQgPT09IHVuZGVmaW5lZDtcblxuICAgICAgICBpZiAodGltZW91dCAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICBjbGVhclRpbWVvdXQodGltZW91dCk7XG4gICAgICAgIH1cblxuICAgICAgICB0aW1lb3V0ID0gc2V0VGltZW91dChkZWZlcnJlZCwgZGVib3VuY2VNcyk7XG5cbiAgICAgICAgaWYgKHNob3VsZENhbGxOb3cpIHtcbiAgICAgICAgICAgIGZ1bmMuYXBwbHkoY29udGV4dCwgYXJncyk7XG4gICAgICAgIH1cbiAgICB9O1xufVxuIiwiaW1wb3J0IHR5cGUgeyBNb3VzZVByZXNzRXZlbnRCYXNlIH0gZnJvbSBcIkBjYW52YXMvYm9hcmQvY29udHJvbGxlcnMvb2JqZWN0cy9Nb3VzZUludGVyYWN0aW9uQ29udHJvbGxlclwiO1xuaW1wb3J0IHR5cGUgeyBPcHRpb25hbCB9IGZyb20gXCJAY2FudmFzL3ByaW1pdGl2ZXMvdHlwZXNcIjtcbmltcG9ydCB7IE1vZGlmaWVyU3RhdGUgfSBmcm9tIFwiQGNhbnZhcy91dGlscy9pbnB1dC9Nb2RpZmllclN0YXRlXCI7XG5pbXBvcnQgdHlwZSB7IE1vdXNlQnV0dG9uIH0gZnJvbSBcIkBjYW52YXMvdXRpbHMvaW5wdXQvTW91c2VCdXR0b25cIjtcblxuZXhwb3J0IGNsYXNzIEJpbmQge1xuICAgIHJlYWRvbmx5IG1vZGlmaWVyOiBNb2RpZmllclN0YXRlO1xuICAgIHJlYWRvbmx5IGtleUNvZGU6IE9wdGlvbmFsPHN0cmluZz47XG4gICAgcmVhZG9ubHkgbW91c2VCdXR0b25zOiBPcHRpb25hbDxNb3VzZUJ1dHRvbj47XG5cbiAgICBjb25zdHJ1Y3Rvcihjb25maWc6IHtcbiAgICAgICAgbW9kaWZpZXI/OiBNb2RpZmllclN0YXRlO1xuICAgICAgICBrZXlDb2RlPzogc3RyaW5nO1xuICAgICAgICBtb3VzZUJ1dHRvbnM/OiBNb3VzZUJ1dHRvbjtcbiAgICB9KSB7XG4gICAgICAgIHRoaXMubW9kaWZpZXIgPSBjb25maWcubW9kaWZpZXIgfHwgTW9kaWZpZXJTdGF0ZS5Ob25lO1xuICAgICAgICB0aGlzLmtleUNvZGUgPSBjb25maWcua2V5Q29kZSB8fCB1bmRlZmluZWQ7XG4gICAgICAgIHRoaXMubW91c2VCdXR0b25zID0gY29uZmlnLm1vdXNlQnV0dG9ucyB8fCB1bmRlZmluZWQ7XG4gICAgfVxuXG4gICAgcHVibGljIGVxdWFscyhvdGhlcjogQmluZCk6IGJvb2xlYW4ge1xuICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgdGhpcy5tb2RpZmllci5lcXVhbHMob3RoZXIubW9kaWZpZXIpICYmXG4gICAgICAgICAgICB0aGlzLmtleUNvZGUgPT0gb3RoZXIua2V5Q29kZSAmJlxuICAgICAgICAgICAgdGhpcy5tb3VzZUJ1dHRvbnMgPT0gb3RoZXIubW91c2VCdXR0b25zXG4gICAgICAgICk7XG4gICAgfVxufVxuXG5leHBvcnQgY2xhc3MgQmluZHMge1xuICAgIHJlYWRvbmx5IGJpbmRpbmdzOiBCaW5kW107XG5cbiAgICBjb25zdHJ1Y3RvciguLi5iaW5kaW5nczogQmluZFtdKSB7XG4gICAgICAgIHRoaXMuYmluZGluZ3MgPSBiaW5kaW5ncztcbiAgICB9XG5cbiAgICBwdWJsaWMga2V5Ym9hcmQoZXZlbnQ6IEtleWJvYXJkRXZlbnQpOiBib29sZWFuIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuYW55RXF1YWxzKFxuICAgICAgICAgICAgbmV3IEJpbmQoe1xuICAgICAgICAgICAgICAgIG1vZGlmaWVyOiBNb2RpZmllclN0YXRlLmZyb21Eb21FdmVudChldmVudCksXG4gICAgICAgICAgICAgICAga2V5Q29kZTogZXZlbnQuY29kZSxcbiAgICAgICAgICAgIH0pLFxuICAgICAgICApO1xuICAgIH1cblxuICAgIHB1YmxpYyBtb3VzZVByZXNzKGV2ZW50OiBNb3VzZVByZXNzRXZlbnRCYXNlKTogYm9vbGVhbiB7XG4gICAgICAgIHJldHVybiB0aGlzLmFueUVxdWFscyhcbiAgICAgICAgICAgIG5ldyBCaW5kKHtcbiAgICAgICAgICAgICAgICBtb2RpZmllcjogZXZlbnQubW9kaWZpZXJzLFxuICAgICAgICAgICAgICAgIG1vdXNlQnV0dG9uczogZXZlbnQuYnV0dG9uLFxuICAgICAgICAgICAgfSksXG4gICAgICAgICk7XG4gICAgfVxuXG4gICAgcHVibGljIG1vZGlmaWVycyhldmVudDogeyBtb2RpZmllcnM6IE1vZGlmaWVyU3RhdGUgfSk6IGJvb2xlYW4ge1xuICAgICAgICByZXR1cm4gdGhpcy5hbnlNb2RpZmllcnNFcXVhbChldmVudC5tb2RpZmllcnMpO1xuICAgIH1cblxuICAgIHByaXZhdGUgYW55RXF1YWxzKG90aGVyOiBCaW5kKTogYm9vbGVhbiB7XG4gICAgICAgIHJldHVybiB0aGlzLmJpbmRpbmdzLnNvbWUoYiA9PiBiLmVxdWFscyhvdGhlcikpO1xuICAgIH1cblxuICAgIHByaXZhdGUgYW55TW9kaWZpZXJzRXF1YWwob3RoZXI6IE1vZGlmaWVyU3RhdGUpOiBib29sZWFuIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuYmluZGluZ3Muc29tZShiID0+IGIubW9kaWZpZXIuZXF1YWxzKG90aGVyKSk7XG4gICAgfVxufVxuIiwidHlwZSBNb2RpZmllck9iamVjdCA9IHsgc2hpZnQ/OiBib29sZWFuOyBhbHQ/OiBib29sZWFuOyBjdHJsPzogYm9vbGVhbiB9O1xuXG5leHBvcnQgY2xhc3MgTW9kaWZpZXJTdGF0ZSB7XG4gICAgcHVibGljIHN0YXRpYyBOb25lID0gTW9kaWZpZXJTdGF0ZS5mcm9tUGFyYW1zKHt9KTtcbiAgICBwdWJsaWMgc3RhdGljIFNoaWZ0ID0gTW9kaWZpZXJTdGF0ZS5mcm9tUGFyYW1zKHsgc2hpZnQ6IHRydWUgfSk7XG4gICAgcHVibGljIHN0YXRpYyBBbHQgPSBNb2RpZmllclN0YXRlLmZyb21QYXJhbXMoeyBhbHQ6IHRydWUgfSk7XG4gICAgcHVibGljIHN0YXRpYyBDdHJsID0gTW9kaWZpZXJTdGF0ZS5mcm9tUGFyYW1zKHsgY3RybDogdHJ1ZSB9KTtcblxuICAgIGNvbnN0cnVjdG9yKFxuICAgICAgICByZWFkb25seSBzaGlmdDogYm9vbGVhbixcbiAgICAgICAgcmVhZG9ubHkgYWx0OiBib29sZWFuLFxuICAgICAgICByZWFkb25seSBjdHJsOiBib29sZWFuLFxuICAgICkge31cblxuICAgIHB1YmxpYyBzdGF0aWMgZnJvbVBhcmFtcyhwYXJhbXM6IE1vZGlmaWVyT2JqZWN0KTogTW9kaWZpZXJTdGF0ZSB7XG4gICAgICAgIHJldHVybiBuZXcgTW9kaWZpZXJTdGF0ZShcbiAgICAgICAgICAgIHBhcmFtcy5zaGlmdCB8fCBmYWxzZSxcbiAgICAgICAgICAgIHBhcmFtcy5hbHQgfHwgZmFsc2UsXG4gICAgICAgICAgICBwYXJhbXMuY3RybCB8fCBmYWxzZSxcbiAgICAgICAgKTtcbiAgICB9XG5cbiAgICBwdWJsaWMgc3RhdGljIGZyb21Eb21FdmVudChcbiAgICAgICAgZXZlbnQ6IE1vdXNlRXZlbnQgfCBLZXlib2FyZEV2ZW50LFxuICAgICk6IE1vZGlmaWVyU3RhdGUge1xuICAgICAgICByZXR1cm4gbmV3IE1vZGlmaWVyU3RhdGUoXG4gICAgICAgICAgICBldmVudC5zaGlmdEtleSxcbiAgICAgICAgICAgIGV2ZW50LmFsdEtleSxcbiAgICAgICAgICAgIGV2ZW50LmN0cmxLZXkgfHwgZXZlbnQubWV0YUtleSxcbiAgICAgICAgKTtcbiAgICB9XG5cbiAgICBwdWJsaWMgZXF1YWxzKG90aGVyOiBNb2RpZmllclN0YXRlKTogYm9vbGVhbiB7XG4gICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICB0aGlzLnNoaWZ0ID09PSBvdGhlci5zaGlmdCAmJlxuICAgICAgICAgICAgdGhpcy5hbHQgPT09IG90aGVyLmFsdCAmJlxuICAgICAgICAgICAgdGhpcy5jdHJsID09PSBvdGhlci5jdHJsXG4gICAgICAgICk7XG4gICAgfVxufVxuIiwiZXhwb3J0IGVudW0gTW91c2VCdXR0b24ge1xuICAgIE5vbmUgPSAwLFxuICAgIExlZnQgPSAxLFxuICAgIE1pZGRsZSA9IDIsXG4gICAgUmlnaHQgPSA0LFxufVxuIiwiaW1wb3J0IHsgbGluZVdoZWVsQm9vc3QsIHBhZ2VXaGVlbEJvb3N0IH0gZnJvbSBcIkBjb25maWcvaW50ZXJhY3Rpb25cIjtcblxuZXhwb3J0IGZ1bmN0aW9uIGdldFdoZWVsQm9vc3QoZTogV2hlZWxFdmVudCk6IG51bWJlciB7XG4gICAgc3dpdGNoIChlLmRlbHRhTW9kZSkge1xuICAgICAgICBjYXNlIFdoZWVsRXZlbnQuRE9NX0RFTFRBX0xJTkU6XG4gICAgICAgICAgICByZXR1cm4gbGluZVdoZWVsQm9vc3Q7XG4gICAgICAgIGNhc2UgV2hlZWxFdmVudC5ET01fREVMVEFfUEFHRTpcbiAgICAgICAgICAgIHJldHVybiBwYWdlV2hlZWxCb29zdDtcbiAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgIHJldHVybiAxO1xuICAgIH1cbn1cbiIsImltcG9ydCB7IEJpbmQsIEJpbmRzIH0gZnJvbSBcIkBjYW52YXMvdXRpbHMvaW5wdXQvQmluZHNcIjtcbmltcG9ydCB7IE1vZGlmaWVyU3RhdGUgfSBmcm9tIFwiQGNhbnZhcy91dGlscy9pbnB1dC9Nb2RpZmllclN0YXRlXCI7XG5pbXBvcnQgeyBNb3VzZUJ1dHRvbiB9IGZyb20gXCJAY2FudmFzL3V0aWxzL2lucHV0L01vdXNlQnV0dG9uXCI7XG5cbmV4cG9ydCBjbGFzcyBCaW5kaW5nIHtcbiAgICBwdWJsaWMgc3RhdGljIHJlYWRvbmx5IFdoZWVsUGFuID0gbmV3IEJpbmRzKFxuICAgICAgICBuZXcgQmluZCh7IG1vZGlmaWVyOiBNb2RpZmllclN0YXRlLk5vbmUgfSksXG4gICAgKTtcbiAgICBwdWJsaWMgc3RhdGljIHJlYWRvbmx5IFdoZWVsUGFuSW52ZXJzZSA9IG5ldyBCaW5kcyhcbiAgICAgICAgbmV3IEJpbmQoeyBtb2RpZmllcjogTW9kaWZpZXJTdGF0ZS5TaGlmdCB9KSxcbiAgICApO1xuICAgIHB1YmxpYyBzdGF0aWMgcmVhZG9ubHkgV2hlZWxab29tID0gbmV3IEJpbmRzKFxuICAgICAgICBuZXcgQmluZCh7IG1vZGlmaWVyOiBNb2RpZmllclN0YXRlLkN0cmwgfSksXG4gICAgKTtcbiAgICBwdWJsaWMgc3RhdGljIHJlYWRvbmx5IFJlc2V0Wm9vbSA9IG5ldyBCaW5kcyhcbiAgICAgICAgbmV3IEJpbmQoeyBtb2RpZmllcjogTW9kaWZpZXJTdGF0ZS5DdHJsLCBrZXlDb2RlOiBcIkRpZ2l0MFwiIH0pLFxuICAgICk7XG4gICAgcHVibGljIHN0YXRpYyByZWFkb25seSBab29tSW4gPSBuZXcgQmluZHMoXG4gICAgICAgIG5ldyBCaW5kKHsgbW9kaWZpZXI6IE1vZGlmaWVyU3RhdGUuQ3RybCwga2V5Q29kZTogXCJFcXVhbFwiIH0pLFxuICAgICk7XG4gICAgcHVibGljIHN0YXRpYyByZWFkb25seSBab29tT3V0ID0gbmV3IEJpbmRzKFxuICAgICAgICBuZXcgQmluZCh7IG1vZGlmaWVyOiBNb2RpZmllclN0YXRlLkN0cmwsIGtleUNvZGU6IFwiTWludXNcIiB9KSxcbiAgICApO1xuICAgIHB1YmxpYyBzdGF0aWMgcmVhZG9ubHkgU2luZ2xlU2VsZWN0ID0gbmV3IEJpbmRzKFxuICAgICAgICBuZXcgQmluZCh7IG1vdXNlQnV0dG9uczogTW91c2VCdXR0b24uTGVmdCB9KSxcbiAgICApO1xuICAgIHB1YmxpYyBzdGF0aWMgcmVhZG9ubHkgTXVsdGlTZWxlY3QgPSBuZXcgQmluZHMoXG4gICAgICAgIG5ldyBCaW5kKHtcbiAgICAgICAgICAgIG1vZGlmaWVyOiBNb2RpZmllclN0YXRlLlNoaWZ0LFxuICAgICAgICAgICAgbW91c2VCdXR0b25zOiBNb3VzZUJ1dHRvbi5MZWZ0LFxuICAgICAgICB9KSxcbiAgICApO1xuICAgIHB1YmxpYyBzdGF0aWMgcmVhZG9ubHkgTW92ZSA9IG5ldyBCaW5kcyhcbiAgICAgICAgbmV3IEJpbmQoeyBtb3VzZUJ1dHRvbnM6IE1vdXNlQnV0dG9uLkxlZnQgfSksXG4gICAgKTtcbiAgICBwdWJsaWMgc3RhdGljIHJlYWRvbmx5IFJvdGF0ZVN0ZXAgPSBuZXcgQmluZHMoXG4gICAgICAgIG5ldyBCaW5kKHsgbW9kaWZpZXI6IE1vZGlmaWVyU3RhdGUuU2hpZnQgfSksXG4gICAgKTtcbiAgICBwdWJsaWMgc3RhdGljIHJlYWRvbmx5IFJlc2l6ZUNyb3AgPSBuZXcgQmluZHMoXG4gICAgICAgIG5ldyBCaW5kKHsgbW9kaWZpZXI6IE1vZGlmaWVyU3RhdGUuU2hpZnQgfSksXG4gICAgKTtcbiAgICBwdWJsaWMgc3RhdGljIHJlYWRvbmx5IFRvZ2dsZUd1aWRlbGluZVNuYXAgPSBuZXcgQmluZHMoXG4gICAgICAgIG5ldyBCaW5kKHsgbW9kaWZpZXI6IE1vZGlmaWVyU3RhdGUuQWx0IH0pLFxuICAgICk7XG59XG4iLCJleHBvcnQgY2xhc3MgRGVidWdDb25maWcge1xuICAgIHB1YmxpYyBzdGF0aWMgdGludEJvdW5kaW5nQm94ZXMgPSBmYWxzZTtcbiAgICBwdWJsaWMgc3RhdGljIGxvZ0FsbEV2ZW50cyA9IGZhbHNlO1xuICAgIHB1YmxpYyBzdGF0aWMgYWx3YXlzU2hvd0d1aWRlbGluZXMgPSBmYWxzZTtcbn1cbiIsIi8vIENvbG9yc1xuZXhwb3J0IGNvbnN0IGRlZmF1bHRTdHJva2VDb2xvciA9IFwiYmxhY2tcIjtcbmV4cG9ydCBjb25zdCBpbnZlcnNlU3Ryb2tlQ29sb3IgPSBcIndoaXRlXCI7XG5cbmV4cG9ydCBjb25zdCBkZWZhdWx0RmlsbENvbG9yID0gXCJibGFja1wiO1xuZXhwb3J0IGNvbnN0IGRlZmF1bHRCYWNrZ3JvdW5kQ29sb3IgPSBcIndoaXRlXCI7XG5cbmV4cG9ydCBjb25zdCBkZWZhdWx0RnJhbWVDb2xvciA9IFwiIzEwNjBCMFwiO1xuZXhwb3J0IGNvbnN0IGRlZmF1bHRGcmFtZUZpbGwgPSBcInJnYmEoMTYsIDk2LCAxNzYsIDAuMylcIjtcblxuZXhwb3J0IGNvbnN0IGltYWdlTWlzc2luZ0NvbG9yID0gXCIjQ0NDQ0NDXCI7XG5cbi8vIEN1cnNvciBzdHlsZXNcbmV4cG9ydCBjb25zdCBkZWZhdWx0Q3Vyc29yID0gXCJhdXRvXCI7XG5leHBvcnQgY29uc3QgY2FuTW92ZUN1cnNvciA9IFwiZ3JhYlwiO1xuZXhwb3J0IGNvbnN0IG1vdmVDdXJzb3IgPSBcImdyYWJiaW5nXCI7XG5cbi8vIEZvbnRcbmV4cG9ydCBjb25zdCBtaW5Gb250U2l6ZSA9IDE7XG5leHBvcnQgY29uc3QgbWF4Rm9udFNpemUgPSA1MDA7XG4iLCJleHBvcnQgY29uc3QgbW92ZVRocmVzaG9sZCA9IDM7XG5leHBvcnQgY29uc3Qgcm90YXRlU3RlcFNpemUgPSBNYXRoLlBJIC8gNDtcblxuZXhwb3J0IGNvbnN0IHNob3dHdWlkZWxpbmVEaXN0YW5jZSA9IDU7XG5leHBvcnQgY29uc3Qgc3RhbmRhcmRNaW5HdWlkZURpc3RhbmNlID0gMTA7XG5leHBvcnQgY29uc3QgYWN0aXZhdGVDZW50ZXJHdWlkZXMgPSB0cnVlO1xuXG5leHBvcnQgY29uc3QgbGluZVdoZWVsQm9vc3QgPSAxODtcbmV4cG9ydCBjb25zdCBwYWdlV2hlZWxCb29zdCA9IDkwO1xuIiwiZXhwb3J0IHt9O1xuXG5kZWNsYXJlIGdsb2JhbCB7XG4gICAgZXhwb3J0IGludGVyZmFjZSBBcnJheTxUPiB7XG4gICAgICAgIHJldmVyc2VkKCk6IEl0ZXJhYmxlPFQ+O1xuICAgICAgICBtaW4oY29tcGFyZUZuPzogKGE6IFQsIGI6IFQpID0+IG51bWJlcik6IFQgfCB1bmRlZmluZWQ7XG4gICAgfVxufVxuXG4oKCkgPT4ge1xuICAgIGlmICghQXJyYXkucHJvdG90eXBlLnJldmVyc2VkKSB7XG4gICAgICAgIEFycmF5LnByb3RvdHlwZS5yZXZlcnNlZCA9IGZ1bmN0aW9uKiA8VD4odGhpczogVFtdKSB7XG4gICAgICAgICAgICBsZXQgaSA9IHRoaXMubGVuZ3RoO1xuXG4gICAgICAgICAgICB3aGlsZSAoaSA+IDApIHtcbiAgICAgICAgICAgICAgICB5aWVsZCB0aGlzWy0taV07XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgfVxuXG4gICAgaWYgKCFBcnJheS5wcm90b3R5cGUubWluKSB7XG4gICAgICAgIEFycmF5LnByb3RvdHlwZS5taW4gPSBmdW5jdGlvbiA8VD4oXG4gICAgICAgICAgICB0aGlzOiBUW10sXG4gICAgICAgICAgICBjb21wYXJlRm4/OiAoYTogVCwgYjogVCkgPT4gbnVtYmVyLFxuICAgICAgICApIHtcbiAgICAgICAgICAgIGNvbnN0IG4gPSB0aGlzLmxlbmd0aDtcbiAgICAgICAgICAgIGxldCBtaW46IFQgfCB1bmRlZmluZWQgPSB1bmRlZmluZWQ7XG5cbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbjsgKytpKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgY3VyciA9IHRoaXNbaV07XG5cbiAgICAgICAgICAgICAgICBpZiAobWluID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgbWluID0gY3VycjtcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKGNvbXBhcmVGbihtaW4sIGN1cnIpID4gMCkge1xuICAgICAgICAgICAgICAgICAgICBtaW4gPSBjdXJyO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIG1pbjtcbiAgICAgICAgfTtcbiAgICB9XG59KSgpO1xuIiwiZXhwb3J0IGNsYXNzIEltbXV0YWJsZVNldFZpZXc8VD4ge1xuICAgIGNvbnN0cnVjdG9yKHByaXZhdGUgc2V0OiBTZXQ8VD4pIHt9XG5cbiAgICBwdWJsaWMgaGFzKHZhbHVlOiBUKTogYm9vbGVhbiB7XG4gICAgICAgIHJldHVybiB0aGlzLnNldC5oYXModmFsdWUpO1xuICAgIH1cblxuICAgIHB1YmxpYyBmb3JFYWNoKFxuICAgICAgICBjYWxsYmFja2ZuOiAodmFsdWU6IFQsIHZhbHVlMjogVCwgc2V0OiBTZXQ8VD4pID0+IHZvaWQsXG4gICAgKTogdm9pZCB7XG4gICAgICAgIHRoaXMuc2V0LmZvckVhY2goY2FsbGJhY2tmbik7XG4gICAgfVxuXG4gICAgcHVibGljIGdldCBzaXplKCk6IG51bWJlciB7XG4gICAgICAgIHJldHVybiB0aGlzLnNldC5zaXplO1xuICAgIH1cblxuICAgICpbU3ltYm9sLml0ZXJhdG9yXSgpOiBJdGVyYXRvcjxUPiB7XG4gICAgICAgIGZvciAoY29uc3QgY3VyciBvZiB0aGlzLnNldCkge1xuICAgICAgICAgICAgeWllbGQgY3VycjtcbiAgICAgICAgfVxuICAgIH1cbn1cblxuZGVjbGFyZSBnbG9iYWwge1xuICAgIGV4cG9ydCBpbnRlcmZhY2UgU2V0PFQ+IHtcbiAgICAgICAgaW1tdXRhYmxlKCk6IEltbXV0YWJsZVNldFZpZXc8VD47XG4gICAgfVxufVxuXG4oKCkgPT4ge1xuICAgIGlmICghU2V0LnByb3RvdHlwZS5pbW11dGFibGUpIHtcbiAgICAgICAgU2V0LnByb3RvdHlwZS5pbW11dGFibGUgPSBmdW5jdGlvbiA8VD4odGhpczogU2V0PFQ+KSB7XG4gICAgICAgICAgICByZXR1cm4gbmV3IEltbXV0YWJsZVNldFZpZXc8VD4odGhpcyk7XG4gICAgICAgIH07XG4gICAgfVxufSkoKTtcbiIsIi8vIFRoZSBtb2R1bGUgY2FjaGVcbnZhciBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX18gPSB7fTtcblxuLy8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbmZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG5cdHZhciBjYWNoZWRNb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdO1xuXHRpZiAoY2FjaGVkTW9kdWxlICE9PSB1bmRlZmluZWQpIHtcblx0XHRyZXR1cm4gY2FjaGVkTW9kdWxlLmV4cG9ydHM7XG5cdH1cblx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcblx0dmFyIG1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0gPSB7XG5cdFx0Ly8gbm8gbW9kdWxlLmlkIG5lZWRlZFxuXHRcdC8vIG5vIG1vZHVsZS5sb2FkZWQgbmVlZGVkXG5cdFx0ZXhwb3J0czoge31cblx0fTtcblxuXHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cblx0X193ZWJwYWNrX21vZHVsZXNfX1ttb2R1bGVJZF0obW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cblx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcblx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xufVxuXG4iLCIvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9ucyBmb3IgaGFybW9ueSBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSAoZXhwb3J0cywgZGVmaW5pdGlvbikgPT4ge1xuXHRmb3IodmFyIGtleSBpbiBkZWZpbml0aW9uKSB7XG5cdFx0aWYoX193ZWJwYWNrX3JlcXVpcmVfXy5vKGRlZmluaXRpb24sIGtleSkgJiYgIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBrZXkpKSB7XG5cdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywga2V5LCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZGVmaW5pdGlvbltrZXldIH0pO1xuXHRcdH1cblx0fVxufTsiLCJfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSAob2JqLCBwcm9wKSA9PiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwgcHJvcCkpIiwiLy8gZGVmaW5lIF9fZXNNb2R1bGUgb24gZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5yID0gKGV4cG9ydHMpID0+IHtcblx0aWYodHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcgJiYgU3ltYm9sLnRvU3RyaW5nVGFnKSB7XG5cdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFN5bWJvbC50b1N0cmluZ1RhZywgeyB2YWx1ZTogJ01vZHVsZScgfSk7XG5cdH1cblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcbn07IiwiaW1wb3J0IHsgRm9udCB9IGZyb20gXCJAY2FudmFzL2JvYXJkL2NvbnRyb2xsZXJzL2JvYXJkL0ZvbnRDb250cm9sbGVyXCI7XG5pbXBvcnQgdHlwZSB7IEdlb21ldHJpY09iamVjdCB9IGZyb20gXCJAY2FudmFzL2JvYXJkL29iamVjdHMvR2VvbWV0cmljT2JqZWN0XCI7XG5pbXBvcnQgeyBCbG9ja1RleHQgfSBmcm9tIFwiQGNhbnZhcy9ib2FyZC9vYmplY3RzL2l0ZW1zL0Jsb2NrVGV4dFwiO1xuaW1wb3J0IHsgSW1hZ2VJdGVtLCBJbWFnZVNldCB9IGZyb20gXCJAY2FudmFzL2JvYXJkL29iamVjdHMvaXRlbXMvSW1hZ2VJdGVtXCI7XG5pbXBvcnQgeyBSZWN0YW5nbGUgfSBmcm9tIFwiQGNhbnZhcy9ib2FyZC9vYmplY3RzL2l0ZW1zL1JlY3RhbmdsZVwiO1xuaW1wb3J0IHsgU3R5bGVkVGV4dCB9IGZyb20gXCJAY2FudmFzL2JvYXJkL29iamVjdHMvaXRlbXMvU3R5bGVkVGV4dFwiO1xuaW1wb3J0IHtcbiAgICBTZWxlY3RhYmxlLFxuICAgIFNlbGVjdGlvbk9wdGlvbnMsXG59IGZyb20gXCJAY2FudmFzL2JvYXJkL29iamVjdHMvdWkvc2VsZWN0YWJsZS9TZWxlY3RhYmxlXCI7XG5pbXBvcnQgeyBFdmVudEhhbmRsZXIgYXMgUmVhbEV2ZW50SGFuZGxlciB9IGZyb20gXCJAY2FudmFzL3ByaW1pdGl2ZXMvZXZlbnRzXCI7XG5pbXBvcnQgeyBWZWN0b3IyIH0gZnJvbSBcIkBjYW52YXMvcHJpbWl0aXZlcy9zcGFjZVwiO1xuaW1wb3J0IHsgZGVmYXVsdEJhY2tncm91bmRDb2xvciwgZGVmYXVsdEZyYW1lQ29sb3IgfSBmcm9tIFwiQGNvbmZpZy9kcmF3XCI7XG5cbmltcG9ydCB0eXBlIHsgQm9hcmQgfSBmcm9tIFwiLi9ib2FyZC9Cb2FyZFwiO1xuaW1wb3J0IHsgU3RpY2t5Tm90ZSB9IGZyb20gXCIuL2JvYXJkL29iamVjdHMvaXRlbXMvU3RpY2t5Tm90ZVwiO1xuaW1wb3J0IHsgY3JlYXRlIGFzIHJlYWxDcmVhdGUgfSBmcm9tIFwiLi9pbmRleFwiO1xuXG5leHBvcnQgZnVuY3Rpb24gZmlsbFNhbXBsZXMoYm9hcmQ6IEJvYXJkKTogdm9pZCB7XG4gICAgZnVuY3Rpb24gYWRkQ29udGVudE9uVG9wKGNvbnRlbnQ6IEdlb21ldHJpY09iamVjdFtdKSB7XG4gICAgICAgIGJvYXJkLmFkZE9iamVjdHNCZWxvdyhjb250ZW50LCBib2FyZC5jb250cm9sbGVyLm1heENvbnRlbnRNYXJrZXIpO1xuICAgIH1cblxuICAgIGFkZENvbnRlbnRPblRvcChbXG4gICAgICAgIG5ldyBTZWxlY3RhYmxlKFxuICAgICAgICAgICAgbmV3IFJlY3RhbmdsZShcIiMwMDAwMDBcIiwgbmV3IFZlY3RvcjIoMCwgMCksIG5ldyBWZWN0b3IyKDEwMCwgMTAwKSksXG4gICAgICAgICAgICBuZXcgU2VsZWN0aW9uT3B0aW9ucyh0cnVlLCB0cnVlLCBmYWxzZSksXG4gICAgICAgICksXG4gICAgICAgIG5ldyBTZWxlY3RhYmxlKFxuICAgICAgICAgICAgbmV3IFJlY3RhbmdsZShcbiAgICAgICAgICAgICAgICBkZWZhdWx0RnJhbWVDb2xvcixcbiAgICAgICAgICAgICAgICBuZXcgVmVjdG9yMigzMDAsIDEwMCksXG4gICAgICAgICAgICAgICAgbmV3IFZlY3RvcjIoMjAwLCAxMDApLFxuICAgICAgICAgICAgICAgIE1hdGguUEkgLyA0LFxuICAgICAgICAgICAgKSxcbiAgICAgICAgICAgIG5ldyBTZWxlY3Rpb25PcHRpb25zKHRydWUsIHRydWUsIGZhbHNlKSxcbiAgICAgICAgKSxcbiAgICAgICAgbmV3IFNlbGVjdGFibGUoXG4gICAgICAgICAgICBuZXcgUmVjdGFuZ2xlKFxuICAgICAgICAgICAgICAgIGRlZmF1bHRCYWNrZ3JvdW5kQ29sb3IsXG4gICAgICAgICAgICAgICAgbmV3IFZlY3RvcjIoNTIwLCAxMDApLFxuICAgICAgICAgICAgICAgIG5ldyBWZWN0b3IyKDIwMCwgMTAwKSxcbiAgICAgICAgICAgICAgICBNYXRoLlBJIC8gMixcbiAgICAgICAgICAgICksXG4gICAgICAgICksXG4gICAgXSk7XG5cbiAgICBjb25zdCBsb3JlbSA9IGBcbk1ham9ydXNsb25ndXNsaW5vc3dvb2RjaHVja2NodWNraW5hd29vZFxuTG9yZW0gaXBzdW0gZG9sb3Igc2l0IGFtZXQsIGNvbnNlY3RldHVyIGFkaXBpc2NpbmcgZWxpdCwgc2VkIGRvIGVpdXNtb2QgdGVtcG9yXG5pbmNpZGlkdW50IHV0IGxhYm9yZSBldCBkb2xvcmUgbWFnbmEgYWxpcXVhLiBFbmltIGZhY2lsaXNpcyBncmF2aWRhIG5lcXVlXG5jb252YWxsaXMgYS4gQWxpcXVhbSBlbGVpZmVuZCBtaSBpbiBudWxsYS4gUHVsdmluYXIgZXRpYW0gbm9uIHF1YW0gbGFjdXNcbnN1c3BlbmRpc3NlIGZhdWNpYnVzIGludGVyZHVtIHBvc3VlcmUuIFBvcnRhIG5vbiBwdWx2aW5hciBuZXF1ZSBsYW9yZWV0XG5zdXNwZW5kaXNzZSBpbnRlcmR1bSBjb25zZWN0ZXR1ci4gRG9uZWMgdWx0cmljZXMgdGluY2lkdW50IGFyY3Ugbm9uLiBWaXRhZSBwdXJ1c1xuZmF1Y2lidXMgb3JuYXJlIHN1c3BlbmRpc3NlIHNlZCBuaXNpLiBKdXN0byBkb25lYyBlbmltIGRpYW0gdnVscHV0YXRlIHV0XG5waGFyZXRyYSBzaXQuIENvbnNlcXVhdCBuaXNsIHZlbCBwcmV0aXVtIGxlY3R1cyBxdWFtIGlkIGxlbyBpbiB2aXRhZS5cblB1bHZpbmFyIHBlbGxlbnRlc3F1ZSBoYWJpdGFudCBtb3JiaSB0cmlzdGlxdWUgc2VuZWN0dXMuXG5TdXBlcmxvbmd1c3dvcmR1c2FuZHNvb25kdXNibGFibGFibGFibHViYiBhbmRhbm90aGVycmVhbGx5bG9uZ3dvcmRibGFibGFibHViYnNhZGFkICAgICAgICAgSGlcbmA7XG5cbiAgICBjb25zdCBsb3JlbUJsb2NrVGV4dCA9IG5ldyBTZWxlY3RhYmxlKFxuICAgICAgICBuZXcgQmxvY2tUZXh0KFxuICAgICAgICAgICAgbG9yZW0sXG4gICAgICAgICAgICBcIiMzMzMzNzdcIixcbiAgICAgICAgICAgIDE4LFxuICAgICAgICAgICAgbmV3IEZvbnQoXCJIZWx2ZXRpY2FcIiksXG4gICAgICAgICAgICBuZXcgVmVjdG9yMigzNTAsIDUwMCksXG4gICAgICAgICAgICBuZXcgVmVjdG9yMigzMDAsIDIwMCksXG4gICAgICAgICksXG4gICAgKTtcblxuICAgIGFkZENvbnRlbnRPblRvcChbXG4gICAgICAgIG5ldyBTZWxlY3RhYmxlKFxuICAgICAgICAgICAgbmV3IFN0eWxlZFRleHQoXG4gICAgICAgICAgICAgICAgXCJIZWxsbyDkuJbnlYxcIixcbiAgICAgICAgICAgICAgICBcIiMzMzMzNzdcIixcbiAgICAgICAgICAgICAgICA1MCxcbiAgICAgICAgICAgICAgICBuZXcgRm9udChcIkhlbHZldGljYVwiKSxcbiAgICAgICAgICAgICAgICBuZXcgVmVjdG9yMig3MDAsIDIwMCksXG4gICAgICAgICAgICAgICAgMC43LFxuICAgICAgICAgICAgKSxcbiAgICAgICAgKSxcbiAgICAgICAgbmV3IFNlbGVjdGFibGUoXG4gICAgICAgICAgICBuZXcgU3R5bGVkVGV4dChcbiAgICAgICAgICAgICAgICBcIkhlbGxvIOS4lueVjFwiLFxuICAgICAgICAgICAgICAgIFwiIzMzMzM3N1wiLFxuICAgICAgICAgICAgICAgIDUwLFxuICAgICAgICAgICAgICAgIG5ldyBGb250KFwiSGVsdmV0aWNhXCIpLFxuICAgICAgICAgICAgICAgIG5ldyBWZWN0b3IyKDcwMCwgMjAwKSxcbiAgICAgICAgICAgICksXG4gICAgICAgICksXG4gICAgICAgIG5ldyBTZWxlY3RhYmxlKFxuICAgICAgICAgICAgbmV3IFN0eWxlZFRleHQoXG4gICAgICAgICAgICAgICAgXCJNdWx0aS1saW5lXFxudGV4dFxcbtmG2LVcXG7tlZzquIDroZxcIixcbiAgICAgICAgICAgICAgICBcIiMzMzMzNzdcIixcbiAgICAgICAgICAgICAgICA1MCxcbiAgICAgICAgICAgICAgICBuZXcgRm9udChcIkhlbHZldGljYVwiKSxcbiAgICAgICAgICAgICAgICBuZXcgVmVjdG9yMigxMDAsIDUwMCksXG4gICAgICAgICAgICApLFxuICAgICAgICAgICAgbmV3IFNlbGVjdGlvbk9wdGlvbnMoZmFsc2UsIGZhbHNlLCB0cnVlKSxcbiAgICAgICAgKSxcbiAgICAgICAgbG9yZW1CbG9ja1RleHQsXG4gICAgICAgIG5ldyBTZWxlY3RhYmxlKFxuICAgICAgICAgICAgbmV3IEJsb2NrVGV4dChcbiAgICAgICAgICAgICAgICBsb3JlbSxcbiAgICAgICAgICAgICAgICBcIiMzMzAwMDBcIixcbiAgICAgICAgICAgICAgICAxOCxcbiAgICAgICAgICAgICAgICBuZXcgRm9udChcIkhhbmFsZWlcIiksXG4gICAgICAgICAgICAgICAgbmV3IFZlY3RvcjIoODAwLCA1MDApLFxuICAgICAgICAgICAgICAgIG5ldyBWZWN0b3IyKDMwMCwgMjAwKSxcbiAgICAgICAgICAgICAgICAwLjcsXG4gICAgICAgICAgICApLFxuICAgICAgICApLFxuICAgICAgICBuZXcgU2VsZWN0YWJsZShcbiAgICAgICAgICAgIG5ldyBTdGlja3lOb3RlKFxuICAgICAgICAgICAgICAgIFwiVGhlIG5ld2x5IGNyZWF0ZWQgbm90ZSBoYXMgYSB5ZWxsb3cgYmFja2dyb3VuZCBhbmQgYSBwbGFjZWhvbGRlciB0ZXh0IOKAnEVkaXQgaGVyZeKAnVwiLFxuICAgICAgICAgICAgICAgIFwiIzAwMFwiLFxuICAgICAgICAgICAgICAgIFwiI0RFQ0QwMFwiLFxuICAgICAgICAgICAgICAgIDE0LFxuICAgICAgICAgICAgICAgIG5ldyBGb250KFwiT3BlbiBTYW5zXCIpLFxuICAgICAgICAgICAgICAgIG5ldyBWZWN0b3IyKDM1MCwgNTAwKSxcbiAgICAgICAgICAgICAgICBuZXcgVmVjdG9yMigzMDAsIDIwMCksXG4gICAgICAgICAgICAgICAgMCxcbiAgICAgICAgICAgICAgICBmYWxzZSxcbiAgICAgICAgICAgICAgICAxMCxcbiAgICAgICAgICAgICksXG4gICAgICAgICksXG4gICAgXSk7XG5cbiAgICBjb25zdCBzZWxlY3Rpb25Db250YWluZXJzID0gW107XG4gICAgY29uc3QgbiA9IDEwMDtcblxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbjsgaSsrKSB7XG4gICAgICAgIHNlbGVjdGlvbkNvbnRhaW5lcnMucHVzaChcbiAgICAgICAgICAgIG5ldyBTZWxlY3RhYmxlKFxuICAgICAgICAgICAgICAgIG5ldyBSZWN0YW5nbGUoXG4gICAgICAgICAgICAgICAgICAgIFwiI1wiICsgKCgoMSA8PCAyNCkgKiBNYXRoLnJhbmRvbSgpKSB8IDApLnRvU3RyaW5nKDE2KSxcbiAgICAgICAgICAgICAgICAgICAgbmV3IFZlY3RvcjIoNjAwICsgaSAqIDIyMCwgMzAwKSxcbiAgICAgICAgICAgICAgICAgICAgbmV3IFZlY3RvcjIoMjAwLCAxMDApLFxuICAgICAgICAgICAgICAgICksXG4gICAgICAgICAgICApLFxuICAgICAgICApO1xuICAgIH1cblxuICAgIGFkZENvbnRlbnRPblRvcChzZWxlY3Rpb25Db250YWluZXJzKTtcblxuICAgIGFkZENvbnRlbnRPblRvcChbXG4gICAgICAgIG5ldyBTZWxlY3RhYmxlKFxuICAgICAgICAgICAgbmV3IEltYWdlSXRlbShcbiAgICAgICAgICAgICAgICBuZXcgSW1hZ2VTZXQoXG4gICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHdpZHRoOiAxMjAwLFxuICAgICAgICAgICAgICAgICAgICAgICAgaGVpZ2h0OiAxMTM0LFxuICAgICAgICAgICAgICAgICAgICAgICAgdXJsOlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiaHR0cHM6Ly91cGxvYWQud2lraW1lZGlhLm9yZy93aWtpcGVkaWEvY29tbW9ucy90aHVtYi9hL2ExL1BhbmFtYV9oYXQuanBnLzEyMDBweC1QYW5hbWFfaGF0LmpwZ1wiLFxuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICBbXG4gICAgICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgd2lkdGg6IDQ3NCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBoZWlnaHQ6IDQ0NyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB1cmw6XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiaHR0cHM6Ly9leHRlcm5hbC1jb250ZW50LmR1Y2tkdWNrZ28uY29tL2l1Lz91PWh0dHBzJTNBJTJGJTJGdHNlMy5tbS5iaW5nLm5ldCUyRnRoJTNGaWQlM0RPSVAuQWE2dzZoU204bWJVdDBRekJZaG1id0hhR18lMjZwaWQlM0RBcGkmZj0xXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICAgICksXG4gICAgICAgICAgICAgICAgbmV3IFZlY3RvcjIoMTEwMCwgNTApLFxuICAgICAgICAgICAgICAgIDAsXG4gICAgICAgICAgICAgICAgZmFsc2UsXG4gICAgICAgICAgICAgICAgbmV3IFZlY3RvcjIoMTIwMCAvIDYsIDExMzQgLyA2KSxcbiAgICAgICAgICAgICAgICBWZWN0b3IyLm9yaWdpbixcbiAgICAgICAgICAgICAgICAxIC8gNixcbiAgICAgICAgICAgICksXG4gICAgICAgICksXG4gICAgXSk7XG5cbiAgICBhZGRDb250ZW50T25Ub3AoW1xuICAgICAgICBuZXcgU2VsZWN0YWJsZShcbiAgICAgICAgICAgIG5ldyBJbWFnZUl0ZW0oXG4gICAgICAgICAgICAgICAgbmV3IEltYWdlU2V0KHtcbiAgICAgICAgICAgICAgICAgICAgd2lkdGg6IDEyMDAsXG4gICAgICAgICAgICAgICAgICAgIGhlaWdodDogMTEzNCxcbiAgICAgICAgICAgICAgICAgICAgdXJsOlxuICAgICAgICAgICAgICAgICAgICAgICAgXCJodHRwczovL3VwbG9hZC53aWtpbWVkaWEub3JnL3dpa2lwZWRpYS9jb21tb25zL3RodW1iL2EvYTEvdGhpc19kb2VzX25vdF9leGlzdC5qcGdcIixcbiAgICAgICAgICAgICAgICB9KSxcbiAgICAgICAgICAgICAgICBuZXcgVmVjdG9yMigxMTAwLCAzMDApLFxuICAgICAgICAgICAgICAgIDAsXG4gICAgICAgICAgICAgICAgZmFsc2UsXG4gICAgICAgICAgICAgICAgbmV3IFZlY3RvcjIoMTIwMCAvIDYsIDExMzQgLyA2KSxcbiAgICAgICAgICAgICAgICBWZWN0b3IyLm9yaWdpbixcbiAgICAgICAgICAgICAgICAxIC8gNixcbiAgICAgICAgICAgICksXG4gICAgICAgICksXG4gICAgXSk7XG59XG5cbmV4cG9ydCBjb25zdCBjcmVhdGUgPSByZWFsQ3JlYXRlO1xuZXhwb3J0IGNvbnN0IEV2ZW50SGFuZGxlciA9IFJlYWxFdmVudEhhbmRsZXI7XG4iXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=
"use strict";
var DataStructure;
(function (DataStructure) {
    class Node {
        constructor(data, prev = null, next = null) {
            this.data = data;
            this.prev = prev;
            this.next = next;
        }
    }
    class LinkedList {
        constructor() {
            this.head = null;
            this.tail = null;
            this._size = 0;
        }
        append(data) {
            this._size++;
            const node = new Node(data, this.tail, null);
            if (this.tail)
                this.tail.next = node;
            if (!this.head)
                this.head = node;
            this.tail = node;
        }
        prepend(data) {
            this._size++;
            const node = new Node(data, null, this.head);
            if (this.head)
                this.head.prev = node;
            this.head = node;
            if (!this.tail)
                this.tail = node;
        }
        find(data, equalFunc = null) {
            if (!this.head)
                return null;
            let current = this.head;
            while (current) {
                if (equalFunc) {
                    if (equalFunc(current.data, data))
                        return current;
                }
                else {
                    if (current.data === data)
                        return current;
                }
                current = current.next;
            }
            return null;
        }
        insertAfter(after, data) {
            this._size++;
            const found = this.find(after);
            if (!found)
                return false;
            found.next = new Node(data, found.next);
            return true;
        }
        remove(data) {
            this._size--;
            if (!this.head)
                return null;
            if (this.head && this.head.data === data) {
                this.head = this.head.next;
                this.head.prev = null;
            }
            let current = this.head;
            while (current.next) {
                if (current.next.data === data)
                    current.next = current.next.next;
                else
                    current = current.next;
            }
            if (this.tail.data === data)
                this.tail = current;
        }
        toArray() {
            const nodes = [];
            let current = this.head;
            while (current) {
                nodes.push(current);
                current = current.next;
            }
            return nodes;
        }
        forEach(callback) {
            if (!callback || !this.head)
                return;
            let current = this.head;
            while (current) {
                current.data = callback(current.data);
                current = current.next;
            }
        }
        size() { return this._size; }
    }
    DataStructure.LinkedList = LinkedList;
})(DataStructure || (DataStructure = {}));
var Components;
(function (Components) {
    class InputColorSkin {
        constructor(inputID, callback) {
            this.inputID = inputID;
            this.callback = callback;
            this.container = null;
            this.makeContainer();
            this.makeEvents();
        }
        static Create(inputID, callback = null) { return new InputColorSkin(inputID, callback); }
        getContainer() { return this.container; }
        makeContainer() {
            this.container = (Templates.createElement("a", { class: "input_color_skin" },
                Templates.createElement("input", { type: "color", id: this.inputID, value: "#0000ff", click: (e) => e.stopPropagation() })));
        }
        makeEvents() {
            const input = this.container.find('> input');
            this.container.css('background-color', input.val().toString());
            this.container.on('click', () => input.trigger('click'));
            input.on('input', (e) => {
                this.container.css('background-color', $(e.currentTarget).val().toString());
                if (this.callback)
                    this.callback($(e.currentTarget).val().toString());
            });
        }
    }
    Components.InputColorSkin = InputColorSkin;
})(Components || (Components = {}));
class Layer {
    constructor(zIndex, parent) {
        this.id = ++Layer.counter;
        this.parent = parent;
        this.zIndex = zIndex;
        this.pixels = new Map();
        this.isActive = false;
        this.isVisible = true;
        this.item = (Templates.createElement("div", { class: "act" },
            this.id,
            Templates.createElement("span", { class: "zIndex" },
                "(",
                this.zIndex,
                ")"),
            Templates.createElement("span", { class: "up" }, "\u2191"),
            Templates.createElement("span", { class: "down" }, "\u2193"))).appendTo(parent.getContainer());
    }
    getID() { return this.id; }
    getItem() { return this.item; }
    getZIndex() { return this.zIndex; }
    getPixels() { return this.pixels; }
    getIsActive() { return this.isActive; }
    activate() { this.isActive = true; this.item.addClass('act'); }
    deactivate() { this.isActive = false; this.item.removeClass('act'); }
    increaseZIndex() { if ((this.zIndex + 1) >= this.parent.getLayersStackSize())
        return this.zIndex; return ++this.zIndex; }
    decreaseZIndex() { if (this.zIndex == 0)
        return this.zIndex; return --this.zIndex; }
    fillPixel(x, y, color) {
        this.pixels.set(`${x}_${y}`, color);
    }
}
Layer.counter = 0;
class Layers {
    // protected layersStack 			: DataStructure.LinkedList<{id: number, item: JQuery, layer: Layer }>;
    // protected layersStack 			: Map<number, { item: JQuery, layer: Layer }>;
    constructor() {
        this.layersStack = [];
        this.activeLayer = null;
        this.container = $('body > div#layers > div.layers');
    }
    getContainer() { return this.container; }
    getActiveLayer() { return this.activeLayer; }
    getLayersStackSize() { return this.layersStack.length; }
    create() {
        const layer = new Layer(this.layersStack.length, this);
        this.layersStack.push(layer);
        const item = this.layersStack[layer.getZIndex()];
        item.getItem().on('click', () => {
            if (this.activeLayer == item)
                return;
            this.activateLayer(layer);
            console.log('activate');
        });
        item.getItem().find('span.up').on('click', (e) => {
            e.stopPropagation();
            // this.swapLayers(layer.getZIndex(), DIRECTION.UP);
            if (this.layersStack[layer.getZIndex() - 1]) {
                const l = this.layersStack[layer.getZIndex()];
                this.layersStack[layer.getZIndex()] = this.layersStack[layer.getZIndex() - 1];
                this.layersStack[layer.getZIndex() - 1] = l;
                this.layersStack[layer.getZIndex()].increaseZIndex();
                this.layersStack[layer.getZIndex() - 1].decreaseZIndex();
                this.layersStack[layer.getZIndex()].getItem().insertBefore(this.layersStack[layer.getZIndex() + 1].getItem());
                this.layersStack[layer.getZIndex()].getItem().find('span.zIndex').text(`(${this.layersStack[layer.getZIndex()].getZIndex()})`);
                this.layersStack[layer.getZIndex() + 1].getItem().find('span.zIndex').text(`(${this.layersStack[layer.getZIndex() + 1].getZIndex()})`);
                this.reDraw();
                // const target = this.layersStack[layer.getZIndex() - 1];
                //
                // this.layersStack[layer.getZIndex()] = target;
                // this.layersStack[target.getZIndex()] = layer;
                //
                // layer.decreaseZIndex();
                // target.increaseZIndex();
                //
                // target.getItem().insertAfter(layer.getItem());
                // target.getItem().find('span.zIndex').text(`(${target.getZIndex()})`);
                // layer.getItem().find('span.zIndex').text(`(${layer.getZIndex()})`);
            }
        });
        item.getItem().find('span.down').on('click', (e) => {
            e.stopPropagation();
            // this.swapLayers(layer.getZIndex(), DIRECTION.DOWN);
            if (this.layersStack[layer.getZIndex() + 1]) {
                const l = this.layersStack[layer.getZIndex()];
                this.layersStack[layer.getZIndex()] = this.layersStack[layer.getZIndex() + 1];
                this.layersStack[layer.getZIndex() + 1] = l;
                this.layersStack[layer.getZIndex()].decreaseZIndex();
                this.layersStack[layer.getZIndex() + 1].increaseZIndex();
                this.layersStack[layer.getZIndex()].getItem().insertAfter(this.layersStack[layer.getZIndex() - 1].getItem());
                this.layersStack[layer.getZIndex()].getItem().find('span.zIndex').text(`(${this.layersStack[layer.getZIndex()].getZIndex()})`);
                this.layersStack[layer.getZIndex() - 1].getItem().find('span.zIndex').text(`(${this.layersStack[layer.getZIndex() - 1].getZIndex()})`);
                this.reDraw();
            }
        });
        this.activateLayer(layer);
        return layer;
    }
    // protected swapLayers(callerZIndex: number, direction: DIRECTION)
    // {
    // 	switch (direction)
    // 	{
    // 		case DIRECTION.UP:
    // 		{
    // 			if (this.layersStack[callerZIndex - 1])
    // 			{
    // 				const l = this.layersStack[callerZIndex];
    // 				this.layersStack[callerZIndex] = this.layersStack[callerZIndex - 1];
    // 				this.layersStack[callerZIndex - 1] = l;
    //
    // 				this.layersStack[callerZIndex].increaseZIndex();
    // 				this.layersStack[callerZIndex - 1].decreaseZIndex();
    //
    // 				this.layersStack[callerZIndex].getItem().insertBefore(this.layersStack[callerZIndex + 1].getItem());
    // 				this.layersStack[callerZIndex].getItem().find('span.zIndex').text(`(${this.layersStack[callerZIndex].getZIndex()})`);
    // 				this.layersStack[callerZIndex + 1].getItem().find('span.zIndex').text(`(${this.layersStack[callerZIndex + 1].getZIndex()})`);
    // 			}
    // 		} break;
    // 		case DIRECTION.DOWN:
    // 		{
    // 			if (this.layersStack[callerZIndex + 1])
    // 			{
    // 				const l = this.layersStack[callerZIndex];
    // 				this.layersStack[callerZIndex] = this.layersStack[callerZIndex + 1];
    // 				this.layersStack[callerZIndex + 1] = l;
    //
    // 				this.layersStack[callerZIndex].decreaseZIndex();
    // 				this.layersStack[callerZIndex + 1].increaseZIndex();
    //
    // 				this.layersStack[callerZIndex].getItem().insertAfter(this.layersStack[callerZIndex - 1].getItem());
    // 				this.layersStack[callerZIndex].getItem().find('span.zIndex').text(`(${this.layersStack[callerZIndex].getZIndex()})`);
    // 				this.layersStack[callerZIndex - 1].getItem().find('span.zIndex').text(`(${this.layersStack[callerZIndex - 1].getZIndex()})`);
    // 			}
    // 		} break;
    // 	}
    // }
    reDraw() {
        Painter.ctx.clearRect(0, 0, Painter.ctx.canvas.width, Painter.ctx.canvas.height);
        for (const layer of this.layersStack) {
            for (const [coord, color] of layer.getPixels()) {
                const arrCoord = coord.split('_');
                Painter.ctx.beginPath();
                Painter.ctx.strokeStyle = color;
                // Painter.ctx.moveTo(Number(arrCoord[0]), Number(arrCoord[1]));
                Painter.ctx.lineTo(Number(arrCoord[0]), Number(arrCoord[1]));
                Painter.ctx.stroke();
                // Painter.ctx.closePath();
            }
        }
    }
    activateLayer(layer) {
        if (this.activeLayer)
            this.activeLayer.deactivate();
        this.activeLayer = layer;
        layer.activate();
    }
}
let L;
$(() => L = new Layers());
// function dec_to_bin(number: number) : string { return number.toString(2); }
// function bin_to_dec(number: string) : number { return parseInt(number,2); }
// function bin_to_hex(number: string) : string { return parseInt(number, 2).toString(16).toUpperCase(); }
// function hex_to_bin(number: string) : string
// {
// 	return parseInt(number, 2).toString(16).toUpperCase();
// }
/// <reference path="layers.tsx" />
const WIDTH = 50;
const HEIGHT = 50;
var figures;
(function (figures) {
    figures[figures["none"] = 0] = "none";
    figures[figures["square"] = 1] = "square";
    figures[figures["triangle"] = 2] = "triangle";
})(figures || (figures = {}));
class Painter {
    // protected activeLayer: Layer;
    constructor() {
        this.container = $('body');
        this.init();
        L.create();
        L.create();
        $('body > div#layers > a.add').on('click', () => L.create());
    }
    init() {
        this.initMenu();
        this.initCanvas();
        // this.initSizer();
    }
    initMenu() {
        this.container.append(Templates.createElement("div", { class: "menu" },
            Templates.createElement("div", { class: "color" },
                "\u0426\u0432\u0435\u0442 ",
                Components.InputColorSkin.Create('color', value => Painter.color = value).getContainer()),
            Templates.createElement("div", { class: "brush_size" },
                "\u0420\u0430\u0437\u043C\u0435\u0440 \u043A\u0438\u0441\u0442\u0438 ",
                Templates.createElement("input", { id: "radius", type: "range", min: "1", max: "100", step: "5" })),
            Templates.createElement("div", { class: "figure" },
                "\u0424\u0438\u0433\u0443\u0440\u0430",
                Templates.createElement("select", { id: "figures" },
                    Templates.createElement("option", { value: "0" }, "\u043D\u0435 \u0432\u044B\u0431\u0440\u0430\u043D\u043E"),
                    Templates.createElement("option", { value: "1" }, "\u043A\u0432\u0430\u0434\u0440\u0430\u0442"),
                    Templates.createElement("option", { value: "2" }, "\u043A\u0440\u0443\u0433")))));
    }
    initCanvas() {
        this.canvas = this.container.find('canvas');
        Painter.ctx = this.canvas[0].getContext('2d');
        Painter.figure = figures.none;
        Painter.color = $('input#color').val().toString();
        this.container.find('#radius').on('input', (e) => { Painter.size = Number($(e.currentTarget).val()); });
        this.container.find('#figures').on('input', (e) => { Painter.figure = Number($(e.currentTarget).val()); });
        this.canvas.on('mousewheel', (e) => this.scale(e));
        this.canvas.on('mousedown', (e) => this.startDrawing(e));
        this.canvas.on('mouseup', () => this.stopDrawing());
        this.canvas.on('mouseout', () => { this.stopDrawing(); });
        this.canvas.on('mousemove', (e) => this.draw(e));
    }
    initSizer() {
        this.sizer = this.container.find('#size');
        this.sizer.css('width', WIDTH);
        this.sizer.css('height', HEIGHT);
        this.sizer.css('top', this.canvas.height + 'px');
        this.sizer.css('left', this.canvas.width + 'px');
        this.sizer.on('mousedown', (e) => this.startResize(e));
        this.sizer.on('mouseup', () => this.stopResize());
        this.sizer.on('mouseout', () => this.stopResize());
        this.sizer.on('mousemove', (e) => this.resize(e));
    }
    // protected changeFigure(figure: number)	: void
    // {
    // 	switch (figure)
    // 	{
    // 		case figures.none: this.figure = 0; break;
    // 		case figures.square: this.figure = 1; break;
    // 		case figures.triangle: this.figure = 2; break;
    // 	}
    // }
    scale(event) {
        this.isResize = true;
        this.startPos = { x: event.clientX, y: event.clientY };
    }
    startResize(event) {
        this.isResize = true;
        this.startPos = { x: event.clientX, y: event.clientY };
    }
    resize(event) {
        if (!this.isResize)
            return;
        this.canvas[0].width = event.clientX - WIDTH / 2;
        this.canvas[0].height = event.clientY - HEIGHT / 2;
        this.sizer.css('top', this.canvas[0].height + 'px');
        this.sizer.css('left', this.canvas[0].width + 'px');
    }
    stopResize() { this.isResize = false; }
    draw(event) {
        if (L.getActiveLayer() && this.isDrawing) {
            const x = event.clientX;
            const y = event.clientY;
            L.getActiveLayer().fillPixel(x, y, Painter.color);
            Painter.ctx.lineTo(x, y);
            Painter.ctx.stroke();
        }
    }
    startDrawing(e) {
        if (!this.canvas)
            return;
        this.isDrawing = true;
        Painter.ctx.beginPath();
        Painter.ctx.lineCap = 'round';
        Painter.ctx.lineWidth = Painter.size;
        Painter.ctx.strokeStyle = Painter.color;
        const offset = this.canvas.offset();
        Painter.ctx.moveTo(e.pageX - offset.left, e.pageY - offset.top);
    }
    stopDrawing() {
        if (!this.isDrawing)
            return;
        this.isDrawing = false;
        Painter.ctx.closePath();
    }
}
var Templates;
(function (Templates) {
    function createElement(tagName, props, ...subNodes) { return $(`<${tagName}/>`, props).append(subNodes); }
    Templates.createElement = createElement;
})(Templates || (Templates = {}));
//# sourceMappingURL=painter.js.map
/// <reference types="jquery" />
declare namespace DataStructure {
    class Node<T = string> {
        data: T;
        prev: Node<T>;
        next: Node<T>;
        constructor(data: T, prev?: Node<T>, next?: Node<T>);
    }
    export class LinkedList<T = string> {
        protected head: Node<T>;
        protected tail: Node<T>;
        protected _size: number;
        constructor();
        append(data: T): void;
        prepend(data: T): void;
        find(data: T, equalFunc?: (a: T, b: T) => boolean): Node<T> | null;
        insertAfter(after: T, data: T): boolean;
        remove(data: T): boolean;
        toArray(): Node<T>[];
        forEach(callback: (data: T) => T): void;
        size(): number;
    }
    export {};
}
declare namespace Components {
    class InputColorSkin {
        static Create(inputID: string, callback?: (value: any) => void): InputColorSkin;
        protected container: JQuery;
        protected inputID: string;
        protected callback: (value: any) => void;
        constructor(inputID: string, callback: any);
        getContainer(): JQuery;
        protected makeContainer(): void;
        protected makeEvents(): void;
    }
}
declare class Layer {
    protected static counter: number;
    protected id: number;
    protected parent: Layers;
    protected zIndex: number;
    protected pixels: Map<string, string>;
    protected isActive: boolean;
    protected isVisible: boolean;
    protected item: JQuery;
    constructor(zIndex: number, parent: Layers);
    getID(): number;
    getItem(): JQuery;
    getZIndex(): number;
    getPixels(): Map<string, string>;
    getIsActive(): boolean;
    activate(): void;
    deactivate(): void;
    increaseZIndex(): number;
    decreaseZIndex(): number;
    fillPixel(x: number, y: number, color: string): void;
}
declare class Layers {
    protected container: JQuery;
    protected activeLayer: Layer;
    protected layersStack: Layer[];
    constructor();
    getContainer(): JQuery;
    getActiveLayer(): Layer;
    getLayersStackSize(): number;
    create(): Layer;
    reDraw(): void;
    activateLayer(layer: Layer): void;
}
declare let L: Layers;
declare const WIDTH = 50;
declare const HEIGHT = 50;
declare enum figures {
    none = 0,
    square = 1,
    triangle = 2
}
declare class Painter {
    protected sizer: JQuery;
    protected container: JQuery;
    static ctx: CanvasRenderingContext2D;
    protected canvas: JQuery<HTMLCanvasElement & HTMLElement>;
    static size: number;
    static color: string;
    static figure: number;
    protected startPos: {
        x: number;
        y: number;
    };
    protected isResize: boolean;
    protected isDrawing: boolean;
    constructor();
    protected init(): void;
    protected initMenu(): void;
    protected initCanvas(): void;
    protected initSizer(): void;
    protected scale(event: any): void;
    protected startResize(event: any): void;
    protected resize(event: any): void;
    protected stopResize(): void;
    protected draw(event: any): void;
    protected startDrawing(e: any): void;
    protected stopDrawing(): void;
}
declare namespace Templates {
    function createElement(tagName: string, props: {
        [key: string]: any;
    }, ...subNodes: any[]): JQuery;
}

class Layer
{
	protected static counter		: number = 0;

	protected id 					: number;
	protected parent 				: Layers;
	protected zIndex 				: number;
	protected pixels 				: Map<string, string>;
	protected isActive 				: boolean;
	protected isVisible				: boolean;
	protected item 					: JQuery;

	public constructor(zIndex: number, parent: Layers)
	{
		this.id 			= ++Layer.counter;
		this.parent 		= parent;
		this.zIndex 		= zIndex;
		this.pixels 		= new Map();
		this.isActive 		= false;
		this.isVisible 		= true;

		this.item = (<div class="act">
			{this.id}
			<span class="zIndex">({this.zIndex})</span>
			<span class="up">↑</span>
			<span class="down">↓</span>
		</div>).appendTo(parent.getContainer());
	}

	public getID() 			: number { return this.id; }
	public getItem() 		: JQuery { return this.item; }
	public getZIndex() 		: number { return this.zIndex; }
	public getPixels() 		: Map<string, string> { return this.pixels; }
	public getIsActive() 	: boolean { return this.isActive; }

	public activate() { this.isActive = true; this.item.addClass('act'); }
	public deactivate() { this.isActive = false; this.item.removeClass('act'); }

	public increaseZIndex() : number { if ((this.zIndex + 1) >= this.parent.getLayersStackSize()) return this.zIndex; return ++this.zIndex; }
	public decreaseZIndex() : number { if (this.zIndex == 0) return this.zIndex; return --this.zIndex; }


	public fillPixel(x: number, y: number, color: string) : void
	{
		this.pixels.set(`${x}_${y}`, color);
	}
}

const enum DIRECTION {UP, DOWN}

class Layers
{
	protected container 			: JQuery;
	protected activeLayer 			: Layer;
	protected layersStack 			: Layer[];
	// protected layersStack 			: DataStructure.LinkedList<{id: number, item: JQuery, layer: Layer }>;
	// protected layersStack 			: Map<number, { item: JQuery, layer: Layer }>;

	public constructor()
	{
		this.layersStack = [];
		this.activeLayer = null;
		this.container = $('body > div#layers > div.layers');
	}

	public getContainer() : JQuery { return this.container; }
	public getActiveLayer() : Layer { return this.activeLayer; }
	public getLayersStackSize() : number { return this.layersStack.length; }

	public create() : Layer
	{
		const layer	: Layer = new Layer(this.layersStack.length, this);
		this.layersStack.push(layer);

		const item = this.layersStack[layer.getZIndex()];

		item.getItem().on('click', () =>
		{
			if (this.activeLayer == item) return;
			this.activateLayer(layer);
			console.log('activate')
		})

		item.getItem().find('span.up').on('click' , (e) =>
		{
			e.stopPropagation();

			// this.swapLayers(layer.getZIndex(), DIRECTION.UP);

			if (this.layersStack[layer.getZIndex() - 1])
			{
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

		item.getItem().find('span.down').on('click' , (e) =>
		{
			e.stopPropagation();
			// this.swapLayers(layer.getZIndex(), DIRECTION.DOWN);

			if (this.layersStack[layer.getZIndex() + 1])
			{
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

	public reDraw()
	{
		Painter.ctx.clearRect(0, 0, Painter.ctx.canvas.width, Painter.ctx.canvas.height)
		for (const layer of this.layersStack)
		{
			for (const [coord, color] of layer.getPixels())
			{
				const arrCoord = coord.split('_');
				// Painter.ctx.lineTo(Number(arrCoord[0]), Number(arrCoord[1]));
				// Painter.ctx.stroke();

				Painter.ctx.beginPath();

				Painter.ctx.strokeStyle = color;
				Painter.ctx.moveTo(Number(arrCoord[0]), Number(arrCoord[1]));
				Painter.ctx.lineTo(Number(arrCoord[0]), Number(arrCoord[1]));
				Painter.ctx.stroke();

				Painter.ctx.closePath();
			}
		}
	}

	public activateLayer(layer: Layer)
	{
		if (this.activeLayer) this.activeLayer.deactivate();
		this.activeLayer = layer;
		layer.activate();
	}
}

let L: Layers;
$(() => L = new Layers());

// function dec_to_bin(number: number) : string { return number.toString(2); }
// function bin_to_dec(number: string) : number { return parseInt(number,2); }
// function bin_to_hex(number: string) : string { return parseInt(number, 2).toString(16).toUpperCase(); }
// function hex_to_bin(number: string) : string
// {
// 	return parseInt(number, 2).toString(16).toUpperCase();
// }

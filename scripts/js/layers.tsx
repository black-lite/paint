class Layer
{
	protected static counter		: number = 0;
	protected id 					: number;
	protected item 					: JQuery;
	protected zIndex 				: number;
	protected isActive 				: boolean;
	protected isVisible				: boolean;
	protected parent 				: Layers;
	protected pixels 				: Map<string, string>;

	constructor(zIndex: number, parent: Layers)
	{
		this.id = ++Layer.counter;
		this.parent = parent;
		this.zIndex = zIndex;
		this.pixels = new Map();

		this.isActive = false;
		this.isVisible = true;

		this.item = (<div class="act">
			{this.id}
			<span class="zIndex">({this.zIndex})</span>
			<span class="up">↑</span>
			<span class="down">↓</span>
		</div>).appendTo(parent.getContainer());
	}

	public getID() : number { return this.id; }
	public getItem() : JQuery { return this.item; }
	public activate() { this.isActive = true; }
	public deactivate() { this.isActive = false; }

	public increaseZIndex() : number { if ((this.zIndex + 1) >= this.parent.getLayersStackSize()) return this.zIndex; return ++this.zIndex; }
	public decreaseZIndex() : number { if (this.zIndex == 0) return this.zIndex; return --this.zIndex; }

	public getZIndex() : number { return this.zIndex; }
	public getIsActive() : boolean { return this.isActive; }

	public fillPixel(x: number, y: number, color: string) : void
	{
		this.pixels.set(`${x}_${y}`, color);
	}

	public getPixels() : Map<string, string> { return this.pixels; }
}

/*class Layers
{
	protected container 			: JQuery;
	protected layersStack 			: Map<number, { item: JQuery, layer: Layer }>;

	public constructor()
	{
		this.layersStack = new Map();
		this.container = $('body > div#layers > div.layers');
	}

	public getLayersStackSize() : number { return this.layersStack.size; }

	public create() : Layer
	{
		const layer	: Layer = new Layer(this.layersStack.size, this);
		const item	: JQuery<HTMLDivElement> = $(<div class="act" draggable="true">{layer.getID()}<span class="zIndex">({layer.getZIndex()})</span><span class="up">↑</span><span class="down">↓</span></div>).prependTo(this.container);
		this.layersStack.set(layer.getID(), { item: item, layer: layer });

		item.on('click', () =>
		{
			if (item.hasClass('act')) return;
			this.activateLayer(layer, item);
		})

		item.find('span.up').on('click' , (e) =>
		{
			e.stopPropagation();
			// if (container.children().length == 1) return;

			const prev = item.prev('div');
			if (prev.length)
			{
				item.find('span.zIndex').text(layer.increaseZIndex());
				prev.before(item);
			}
		});

		item.find('span.down').on('click' , (e) =>
		{
			e.stopPropagation();
			// if (container.children().length == 1) return;

			const next = item.next('div');
			if (next.length)
			{
				item.find('span.zIndex').text(layer.decreaseZIndex());
				next.after(item);
			}
		});

		this.activateLayer(layer, item);
		return layer;
	}

	public activateLayer(layer: Layer, item: JQuery)
	{
		for (const [key, value] of this.layersStack)
		{
			value.item.removeClass('act');
			value.layer.deactivate();
		}

		item.addClass('act');
		layer.activate();
	}
}*/

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

				console.log('up');
				console.log(this.layersStack);
			}


			// const data = {id: layer.getID(), item: item, layer};
			// const node = this.layersStack.find(data, (a, b) => JSON.stringify(a.id) === JSON.stringify(b.id));
			// if (node && node.next)
			// {
			// 	node.next.data.layer.decreaseZIndex();
			// 	node.next.data.item.find('span.zIndex').text(`(${layer.getZIndex()})`);
			// 	node.next.data.item.before(item);
			//
			// 	node.data.layer.increaseZIndex();
			// 	node.data.item.find('span.zIndex').text(`(${layer.getZIndex()})`);
			//
			// 	console.log(node.data.layer.getZIndex());
			// }
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

				console.log('down');
				console.log(this.layersStack);
			}

			// const data = {id: layer.getID(), item: item, layer};
			// const node = this.layersStack.find(data, (a, b) => JSON.stringify(a.id) === JSON.stringify(b.id));
			// if (node && node.prev)
			// {
			// 	node.prev.data.layer.increaseZIndex();
			// 	node.prev.data.item.find('span.zIndex').text(`(${layer.getZIndex()})`);
			// 	node.prev.data.item.after(item);
			//
			// 	node.data.layer.decreaseZIndex();
			// 	node.data.item.find('span.zIndex').text(`(${layer.getZIndex()})`);
			//
			// 	console.log(node.data.layer.getZIndex());
			// }
		});

		this.activateLayer(layer);
		return layer;
	}

	protected swapLayers(callerZIndex: number, direction: DIRECTION)
	{
		switch (direction)
		{
			case DIRECTION.UP:
			{
				if (this.layersStack[callerZIndex - 1])
				{
					const l = this.layersStack[callerZIndex];
					this.layersStack[callerZIndex] = this.layersStack[callerZIndex - 1];
					this.layersStack[callerZIndex - 1] = l;

					this.layersStack[callerZIndex].increaseZIndex();
					this.layersStack[callerZIndex - 1].decreaseZIndex();

					this.layersStack[callerZIndex].getItem().insertBefore(this.layersStack[callerZIndex + 1].getItem());
					this.layersStack[callerZIndex].getItem().find('span.zIndex').text(`(${this.layersStack[callerZIndex].getZIndex()})`);
					this.layersStack[callerZIndex + 1].getItem().find('span.zIndex').text(`(${this.layersStack[callerZIndex + 1].getZIndex()})`);
				}
			} break;
			case DIRECTION.DOWN:
			{
				if (this.layersStack[callerZIndex + 1])
				{
					const l = this.layersStack[callerZIndex];
					this.layersStack[callerZIndex] = this.layersStack[callerZIndex + 1];
					this.layersStack[callerZIndex + 1] = l;

					this.layersStack[callerZIndex].decreaseZIndex();
					this.layersStack[callerZIndex + 1].increaseZIndex();

					this.layersStack[callerZIndex].getItem().insertAfter(this.layersStack[callerZIndex - 1].getItem());
					this.layersStack[callerZIndex].getItem().find('span.zIndex').text(`(${this.layersStack[callerZIndex].getZIndex()})`);
					this.layersStack[callerZIndex - 1].getItem().find('span.zIndex').text(`(${this.layersStack[callerZIndex - 1].getZIndex()})`);
				}
			} break;
		}
	}

	public activateLayer(layer: Layer)
	{
		if (this.activeLayer)
		{
			this.activeLayer.deactivate();
			this.activeLayer.getItem().removeClass('act');
		}

		this.activeLayer = layer;
		layer.activate();
		layer.getItem().addClass('act');
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

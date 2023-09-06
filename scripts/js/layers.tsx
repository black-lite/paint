class Layer
{
	protected static counter		: number = 0;
	protected id 					: number;
	protected zIndex 	: number;
	protected isActive 	: boolean;
	protected parent 	: Layers;
	protected pixels 	: Map<string, string>;

	constructor(zIndex: number, parent: Layers)
	{
		this.id = ++Layer.counter;
		this.parent = parent;
		this.zIndex = zIndex;
		this.pixels = new Map();
	}

	public getID() : number { return this.id; }
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

class Layers
{
	protected container 			: JQuery;
	protected layersStack 			: DataStructure.LinkedList<{id: number, item: JQuery, layer: Layer }>;
	// protected layersStack 			: Map<number, { item: JQuery, layer: Layer }>;

	public constructor()
	{
		this.layersStack = new DataStructure.LinkedList();
		this.container = $('body > div#layers > div.layers');
	}

	public getLayersStackSize() : number { return this.layersStack.size(); }

	public create() : Layer
	{
		const layer	: Layer = new Layer(this.layersStack.size(), this);
		const item	: JQuery<HTMLDivElement> = $(<div class="act" draggable="true">{layer.getID()}<span class="zIndex">({layer.getZIndex()})</span><span class="up">↑</span><span class="down">↓</span></div>).prependTo(this.container);
		this.layersStack.append({id: layer.getID(), item: item, layer: layer });

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
		this.layersStack.forEach(data => { data.item.removeClass('act'); data.layer.deactivate(); });
		item.addClass('act');
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

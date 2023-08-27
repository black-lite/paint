class Layer
{
	protected zIndex 	: number;
	protected isActive 	: boolean;
	protected parent 	: Layers;
	protected pixels 	: Map<string, string>;

	constructor(zIndex: number, parent: Layers)
	{
		this.parent = parent;
		this.zIndex = zIndex;
		this.pixels = new Map();
	}

	public activate() { this.isActive = true; }
	public deactivate() { this.isActive = false; }

	public increaseZIndex() : void { if ((this.zIndex + 1) > this.parent.getLayersStackSize()) return; else this.zIndex++; }
	public decreaseZIndex() : number { if (this.zIndex == 0) return; else this.zIndex--; }

	public getZIndex() : number { return this.zIndex; }
	public getIsActive() : boolean { return this.isActive; }

	public fillPixel(x: number, y: number, color: string) : void
	{
		this.pixels.set(`${x}_${y}`, color);
	}

	public getPixels() : Map<string, string> { return this.pixels; }
}

class Layers
{
	protected id 			: number;
	protected container 	: JQuery;
	protected layersStack 	: Map<number, { item: JQuery, layer: Layer }>;

	public constructor()
	{
		this.id = 0;
		this.layersStack = new Map();
		this.container = $('body > div#layers > div.layers');
	}

	public getLayersStackSize() : number { return this.layersStack.size; }

	public create() : Layer
	{
		const layer	: Layer = new Layer(this.id, this);
		const item	: JQuery<HTMLDivElement> = $(<div class="act" draggable="true">{this.id}<span class="zIndex">({layer.getZIndex()})</span><span class="up">↑</span><span class="down">↓</span></div>).prependTo(this.container);
		this.layersStack.set(this.id, { item: item, layer: layer });

		item.on('click', () =>
		{
			if (item.hasClass('act')) return;

			const data = this.layersStack.get(this.id);
			if (data) { this.activateLayer(data.layer, item); }
		})

		item.find('span.up').on('click' , (e) =>
		{
			e.stopPropagation();
			// if (container.children().length == 1) return;

			const prev = item.prev('div');
			if (prev.length)
			{
				const data = this.layersStack.get(this.id)
				if (data)
				{
					data.layer.increaseZIndex();
					item.find('span.zIndex').text(data.layer.getZIndex());
					prev.before(item);
				}
			}
		});

		item.find('span.down').on('click' , (e) =>
		{
			e.stopPropagation();
			// if (container.children().length == 1) return;

			const next = item.next('div');
			if (next.length)
			{
				const data = this.layersStack.get(this.id);

				if (data)
				{
					data.layer.decreaseZIndex();
					item.find('span.zIndex').text(data.layer.getZIndex());
					next.after(item);
				}
			}
		});

		this.id++;
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

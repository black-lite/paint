class Layer
{
	protected zIndex 	: number;
	protected isActive 	: boolean;
	protected parent 	: Layers;
	protected pixels 	: Map<string, string>;

	constructor(zIndex: number)
	{
		this.zIndex = zIndex;
		this.pixels = new Map();
	}

	public on() { this.isActive = true; }
	public off() { this.isActive = false; }

	public increaseZIndex() : void { if (this.parent.getLayersStackSize() == this.zIndex) return; else this.zIndex++; }
	public decreaseZIndex() : number { if (this.zIndex == 0 ) return; else this.zIndex--; }

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
	}

	public getLayersStackSize() : number { return this.layersStack.size; }

	public create() : Layer
	{
		this.id++;
		const container = $('body > div#layers > div.layers');
		container.find('> div').removeClass('act');

		const layer: Layer = new Layer(this.id);

		// item.on('dragstart', (e) =>
		// {
		// 	if (!layer.getIsActive()) return;
		// 	console.log(layer.getIsActive());
		// })

		const item: JQuery<HTMLDivElement> = $(<div class="act" draggable="true">{this.id}<span class="zIndex">({layer.getZIndex()})</span><span class="up">↑</span><span class="down">↓</span></div>).prependTo(container);

		this.layersStack.set(this.id, {item: item, layer: layer});

		item.on('click', () =>
		{
			if (item.hasClass('act')) return;
			const layers = $('body > div#layers > div.layers > div').removeClass('act');

			const data = this.layersStack.get(this.id);
			if (data)
			{
				layers.removeClass('act');
				item.toggleClass('act');
				for (const [key, value] of this.layersStack) value.layer.off();
				data.layer.on();
			}
		})

		item.find('span.up').on('click' , (e) =>
		{
			e.stopPropagation();
			// if (container.children().length == 1) return;

			const prev = item.prev('div');
			if (!prev.length) return;

			const layer = this.layersStack.get(this.id).layer;
			layer.increaseZIndex();

			item.find('span.zIndex').text(layer.getZIndex());

			prev.before(item);
		});

		item.find('span.down').on('click' , (e) =>
		{
			e.stopPropagation();
			// if (container.children().length == 1) return;

			const next = item.next('div');
			if (!next.length) return;

			const layer = this.layersStack.get(this.id).layer;
			layer.decreaseZIndex();

			item.find('span.zIndex').text(layer.getZIndex());

			next.after(item);
		});

		layer.on();
		return layer;
	}
}

var L = new Layers();

// function dec_to_bin(number: number) : string { return number.toString(2); }
// function bin_to_dec(number: string) : number { return parseInt(number,2); }
// function bin_to_hex(number: string) : string { return parseInt(number, 2).toString(16).toUpperCase(); }
// function hex_to_bin(number: string) : string
// {
// 	return parseInt(number, 2).toString(16).toUpperCase();
// }

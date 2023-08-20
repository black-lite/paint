class Layer
{
	public isActive 	: boolean;
	protected pixels 	: Map<string, string>;

	constructor()
	{
		this.pixels = new Map();
	}

	on() { this.isActive = true; }
	off() { this.isActive = false; }

	fillPixel(x: number, y: number, color: string) : void
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

	public create() : Layer
	{
		this.id++;
		const container = $('body > div#layers > div.layers');
		container.find('> div').removeClass('act');

		let item = $(<div class="act" draggable="true">{this.id}</div>).prependTo(container);

		item.on('click', () =>
		{
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

		const layer = new Layer();

		item.on('dragstart', (e) =>
		{
			if (!layer.isActive) return;
			console.log(layer.isActive);
		})
		layer.on();

		this.layersStack.set(this.id, {item: item, layer: layer});
		return layer;
	}
}

var L = new Layers();

function dec_to_bin(number: number) : string { return number.toString(2); }
function bin_to_dec(number: string) : number { return parseInt(number,2); }
function bin_to_hex(number: string) : string { return parseInt(number, 2).toString(16).toUpperCase(); }
function hex_to_bin(number: string) : string
{
	return parseInt(number, 2).toString(16).toUpperCase();
}

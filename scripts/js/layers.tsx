class Layer
{
	protected isActive 	: boolean;
	protected pixels 	: Map<{ x: number, y: number }, string>;

	constructor()
	{
		this.pixels = new Map();
	}

	on() { this.isActive = true; }
	off() { this.isActive = false; }

	fillPixel(x: number, y: number, color: string) : void
	{
		if (this.pixels.has({ x: x, y: y })) this.pixels.set({ x: x, y: y }, color);
		else this.pixels.set({ x: x, y: y }, color);
	}

	public getPixels() : Map<{ x: number, y: number }, string> { return this.pixels; }
}

class Layers
{
	protected id 			: number = 0;
	protected layersStack 	: Map<number, { item: JQuery, layer: Layer }> = new Map();

	public constructor() { }

	public create() : Layer
	{
		this.id++;
		let layer = new Layer();

		$('body > div#layers > div.layers > div').removeClass();
		let item = (<div class="act" click={() =>
			{
				const layers = $('body > div#layers > div.layers > div').removeClass();

				const data = this.layersStack.get(this.id);
				if (data)
				{
					layers.removeClass();
					item.toggleClass('act');
					for (const [key, value] of this.layersStack) value.layer.off()
					data.layer.on();
					console.log(layer);
				}
			}
		}>{this.id}</div>).prependTo($('body > div#layers > div.layers'));

		this.layersStack.set(this.id, {item: item, layer: layer});

		layer.on();
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

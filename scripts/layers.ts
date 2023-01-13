class Layer {

	/** Массив, содержащий информацию о том, какие пиксели красить и как */
	protected pixels : number[];
	protected isActive : boolean;

	protected width : number;
	protected height : number;

	constructor(w: number, h: number)
	{
		this.width = w;
		this.height = h;

		this.pixels = new Array(this.width * this.height);
		console.log(this.pixels);
	}
}

class Layers
{
	protected layersStack : Layer[] = [];

	public constructor() { }

	protected create(w: number, h: number) : Layer
	{
		let layer = new Layer(w, h);
		this.layersStack.push(layer);
		return layer;
	}
}

var L = new Layers();
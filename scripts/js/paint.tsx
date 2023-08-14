/// <reference path="layers.tsx" />
const WIDTH = 50;
const HEIGHT = 50;

enum figures {none, square,triangle}

class Painter
{
	protected sizer: JQuery;
	protected container: JQuery;
	protected ctx: CanvasRenderingContext2D;
	protected canvas: JQuery<HTMLCanvasElement & HTMLElement>;

	protected size: number;
	protected color: string;
	protected figure: number;

	protected startPos : { x: number, y: number };

	protected isResize: boolean;
	protected isDrawing: boolean;
	protected activeLayer: Layer;

	public constructor()
	{
		this.container = $('body');
		this.figure = figures.none;
		this.color = $('input#color').val().toString();

		this.canvas = this.container.find('canvas');
		this.ctx = this.canvas[0].getContext('2d');
		this.sizer = this.container.find('#size');

		this.sizer.css('width', WIDTH);
		this.sizer.css('height', HEIGHT);
		this.sizer.css('top', this.canvas.attr('height') + 'px');
		this.sizer.css('left', this.canvas.attr('width') + 'px');

		this.container.find('#color').on('change', (e) => this.changeColor(String($(e.currentTarget).val())));
		this.container.find('#radius').on('change', (e) => this.changeSize(Number($(e.currentTarget).val())));
		this.container.find('#figures').on('change', (e) => this.changeFigure(Number($(e.currentTarget).val())));

		this.sizer.on('mousedown', (e) => this.startResize(e));
		this.sizer.on('mouseup', () => this.stopResize());
		this.sizer.on('mouseout', () => this.stopResize());
		this.sizer.on('mousemove', (e) => this.resize(e));

		this.canvas.on('mousewheel', (e) => this.scale(e));

		this.canvas.on('mousedown', (e) => this.startDrawing(e));
		this.canvas.on('mouseup', () => this.stopDrawing());
		this.canvas.on('mouseout', () => { if (!this.isDrawing) return; this.stopDrawing()});
		this.canvas.on('mousemove', (e) => this.draw(e));

		this.activeLayer = L.create();
		$('body > div#layers > a.add').on('click', () => this.newLayer())
	}

	protected changeSize(size: number) 		: void { this.size = size; }
	protected changeColor(color: string)	: void { this.color = color; }

	protected changeFigure(figure: number)	: void
	{
		switch (figure)
		{
			case figures.none: this.figure = 0; break;
			case figures.square: this.figure = 1; break;
			case figures.triangle: this.figure = 2; break;
		}
	}

	protected scale(event) : void
	{
		this.isResize = true;
		this.startPos = {x: event.clientX, y: event.clientY};
	}

	protected startResize(event) : void
	{
		this.isResize = true;
		this.startPos = { x: event.clientX, y: event.clientY };
	}

	protected stopResize() : void { this.isResize = false; }

	protected resize(event) : void
	{
		if (!this.isResize) return;

		$(this.canvas).attr('width', event.clientX - WIDTH/2);
		$(this.canvas).attr('height', event.clientY - HEIGHT/2);

		this.sizer.css('top', this.canvas.attr('height') + 'px');
		this.sizer.css('left', this.canvas.attr('width') + 'px');
	}

	protected draw(event) : void
	{
		if (!this.isDrawing) return;

		const x = event.clientX;
		const y = event.clientY;

		this.activeLayer.fillPixel(x, y, this.color);

		this.ctx.lineTo(x, y);
		this.ctx.stroke();
	}

	protected newLayer()
	{
		this.activeLayer = L.create();
	}

	protected startDrawing(e) : void
	{
	    if (!this.canvas) return;
		this.isDrawing = true;

        this.ctx.beginPath();
        // if (this.figure == figures.none) {
        //
		// }
		this.ctx.strokeStyle = this.color;
		this.ctx.lineWidth = this.size;
		this.ctx.lineCap = 'round';
		let offset = this.canvas.offset();
		this.ctx.moveTo(e.pageX - offset.left, e.pageY - offset.top);
	}

	protected stopDrawing() : void
	{
		this.isDrawing = false;
		console.log(this.activeLayer);
	}
}
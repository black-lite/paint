/// <reference path="layers.tsx" />
const WIDTH = 50;
const HEIGHT = 50;

enum figures {none, square,triangle}

class Painter
{
	protected sizer: JQuery;
	protected container: JQuery;
	public static ctx: CanvasRenderingContext2D;
	protected canvas: JQuery<HTMLCanvasElement & HTMLElement>;

	public static size: number;
	public static color: string;
	public static figure: number;

	protected startPos : { x: number, y: number };

	protected isResize: boolean;
	protected isDrawing: boolean;
	// protected activeLayer: Layer;

	public constructor()
	{
		this.container = $('body');

		this.init();

		Painter.figure = figures.none;
		Painter.color = $('input#color').val().toString();

		L.create();
		L.create();
		$('body > div#layers > a.add').on('click', () => L.create());
	}

	protected init()
	{
		this.canvas = this.container.find('canvas');
		Painter.ctx = this.canvas[0].getContext('2d');
		this.sizer = this.container.find('#size');

		this.initMenu();
		this.initCanvas();
		this.initSizer();
	}

	protected initMenu()
	{
		this.container.append(<div class="menu">
			<div class="color">Цвет { Components.InputColorSkin.Create('color', value => Painter.color = value).getContainer() }</div>
			<div class="brush_size">Размер кисти <input id="radius" type="range" min="1" max="100" step="5"/></div>
			<div class="figure">Фигура
				<select id="figures">
					<option value="0">не выбрано</option>
					<option value="1">квадрат</option>
					<option value="2">круг</option>
				</select>
			</div>
		</div>)
	}

	protected initCanvas()
	{
		// this.container.find('#color').on('input', (e) => { Painter.color = $(e.currentTarget).val().toString(); });
		this.container.find('#radius').on('input', (e) => { Painter.size = Number($(e.currentTarget).val()) });
		this.container.find('#figures').on('input', (e) => { Painter.figure = Number($(e.currentTarget).val()) });

		this.canvas.on('mousewheel', (e) => this.scale(e));

		this.canvas.on('mousedown', (e) => this.startDrawing(e));
		this.canvas.on('mouseup', () => this.stopDrawing());
		this.canvas.on('mouseout', () => { this.stopDrawing()});
		this.canvas.on('mousemove', (e) => this.draw(e));
	}

	protected initSizer()
	{
		this.sizer.css('width', WIDTH);
		this.sizer.css('height', HEIGHT);
		this.sizer.css('top', this.canvas.height + 'px');
		this.sizer.css('left', this.canvas.width + 'px');

		this.sizer.on('mousedown', (e) => this.startResize(e));
		this.sizer.on('mouseup', () => this.stopResize());
		this.sizer.on('mouseout', () => this.stopResize());
		this.sizer.on('mousemove', (e) => this.resize(e));
	}

	// protected changeFigure(figure: number)	: void
	// {
	// 	switch (figure)
	// 	{
	// 		case figures.none: this.figure = 0; break;
	// 		case figures.square: this.figure = 1; break;
	// 		case figures.triangle: this.figure = 2; break;
	// 	}
	// }

	protected scale(event) : void
	{
		this.isResize = true;
		this.startPos = { x: event.clientX, y: event.clientY };
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

		this.canvas[0].width = event.clientX - WIDTH / 2;
		this.canvas[0].height =  event.clientY - HEIGHT / 2;

		this.sizer.css('top', this.canvas[0].height + 'px');
		this.sizer.css('left', this.canvas[0].width + 'px');
	}

	protected draw(event) : void
	{
		if (L.getActiveLayer() && this.isDrawing)
		{
			const x = event.clientX;
			const y = event.clientY;

			L.getActiveLayer().fillPixel(x, y, Painter.color);

			Painter.ctx.lineTo(x, y);
			Painter.ctx.stroke();
		}
	}

	protected startDrawing(e) : void
	{
	    if (!this.canvas) return;
		this.isDrawing = true;

        Painter.ctx.beginPath();
		Painter.ctx.lineCap = 'round';
		Painter.ctx.lineWidth = Painter.size;
		Painter.ctx.strokeStyle = Painter.color;
		const offset = this.canvas.offset();
		Painter.ctx.moveTo(e.pageX - offset.left, e.pageY - offset.top);
	}

	protected stopDrawing() : void
	{
		if (!this.isDrawing) return;
		this.isDrawing = false;
		Painter.ctx.closePath();
	}
}
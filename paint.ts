import TriggeredEvent = JQuery.TriggeredEvent;

class Painter {

	protected container: JQuery;
	protected canvas: JQuery<HTMLCanvasElement> | HTMLElement;
	protected ctx: CanvasRenderingContext2D;
	protected isDrawing: boolean;

	public constructor() {
		this.container = $('body > div');
		this.canvas = this.container.find('canvas');
		this.ctx = this.canvas[0].getContext('2d');

		this.canvas.on('mousedown', (e) => this.startDrawing(e))
		this.canvas.on('mouseup', (e) => this.stopDrawing(e))
		this.canvas.on('mouseout', (e) => this.stopDrawing(e))
		this.canvas.on('mousemove', (e) => this.draw(e))
	}

	protected draw(event: TriggeredEvent) {
		if (!this.isDrawing) return;

		let x = event.clientX;
		let y = event.clientY;

		this.ctx.lineTo(x, y);
		this.ctx.stroke();
	}

	protected startDrawing(e: TriggeredEvent) {
	    if (!this.canvas) return;

		this.isDrawing = true;

        /** Создаем новый путь */
        this.ctx.beginPath();

		if ("offsetLeft" in this.canvas && "offsetTop" in this.canvas) {
			/** Нажатием левой кнопки мыши помещаем "кисть" на холст */
			this.ctx.moveTo(e.pageX - this.canvas.offsetLeft, e.pageY - this.canvas.offsetTop);
		}
	}

	protected stopDrawing(event: TriggeredEvent) {
		this.isDrawing = false;
	}
}
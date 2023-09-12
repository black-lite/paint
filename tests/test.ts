$(() => {
	const canvas: JQuery<HTMLCanvasElement> = $('canvas');
	const ctx: CanvasRenderingContext2D = canvas[0].getContext('2d');

	const SIZE_CELL = 25;

	let R		: number = 255;
	let G		: number = 0;
	let B		: number = 0;

	//0 128 255

	let count	: number = 0;
	let flag	: boolean = false;


	const AMOUNT_IN_COL: number = canvas[0].height / (SIZE_CELL * 2);
	const AMOUNT_IN_ROW: number = canvas[0].width / (SIZE_CELL * 2);
	const AMOUNT_IN_DIAGONAL: number = (canvas[0].width / (SIZE_CELL * 2)) * 2;

	console.log('AMOUNT_IN_COL', AMOUNT_IN_COL);
	console.log('AMOUNT_IN_ROW', AMOUNT_IN_ROW);
	console.log('AMOUNT_IN_DIAGONAL', AMOUNT_IN_DIAGONAL);

	for (let x = 0; x < canvas[0].width; x += SIZE_CELL)
	{
		// R++;


		G += 5;
		B += 5;

		for (let y = flag ? SIZE_CELL : 0; y < canvas[0].height; y += SIZE_CELL*2)
		{
			ctx.fillStyle = `rgb(${R},${G},${B})`;
			ctx.fillRect(x, y, SIZE_CELL, SIZE_CELL);
		}
		count++;
		flag = !flag;
	}

	console.log(G);
})
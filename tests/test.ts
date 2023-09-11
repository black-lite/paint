$(() => {
	const canvas: JQuery<HTMLCanvasElement> = $('canvas');
	const ctx: CanvasRenderingContext2D = canvas[0].getContext('2d');

	let color = 'rgb(255,0,0)';
	let offset = 10

	for (let x = 0; x < canvas[0].width; x += 10)
	{

		for (let y = 0; y < canvas[0].height; y += offset)
		{
			ctx.fillStyle = color;
			ctx.fillRect(x, y, 10, 10);
		}
		offset++;
	}

})
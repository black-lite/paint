$(() => {
	const canvas: JQuery<HTMLCanvasElement> = $('canvas');
	const ctx: CanvasRenderingContext2D = canvas[0].getContext('2d', { willReadFrequently: true }) as CanvasRenderingContext2D;
	const fileData: JQuery<HTMLInputElement> = $('input');

	const enum Channel { R, G, B }

	// const R = $('#R').on('input', (e) => $(e.currentTarget).parent().find('> span').text($(e.currentTarget).val().toString()))
	// const G = $('#G').on('input', (e) => $(e.currentTarget).parent().find('> span').text($(e.currentTarget).val().toString()))
	// const B = $('#B').on('input', (e) => $(e.currentTarget).parent().find('> span').text($(e.currentTarget).val().toString()))

	fileData.on('change', () =>
	{
		const file		: File = fileData[0].files[0];
		const reader	: FileReader = new FileReader();

		reader.onload = () =>
		{
			const image = new Image();
			image.src = reader.result.toString();

			image.onload = () =>
			{
				ctx.drawImage(image, 0,0, canvas.width(), canvas.height());



				// for (let i = 0; i < imageData.data.length; i += 4)
				// {
				// 	const greyVersion = imageData.data[i] + imageData.data[i+1] + imageData.data[i+2];
				// 	imageData.data[i] = greyVersion;
				// 	imageData.data[i+1] = greyVersion + 10;
				// 	imageData.data[i+2] = greyVersion - 100;
				// }
				//
				// ctx.putImageData(imageData, 0, 0);
			}

			// function changeChannel(channel: Channel, value: number)
			// {
			// 	const imageData: ImageData = ctx.getImageData(0, 0, canvas.width(), canvas.height());
			// 	switch (channel)
			// 	{
			// 		case Channel.R: for (let i = 0; i < imageData.data.length; i += 4) imageData.data[i] = value; break;
			// 		case Channel.G: for (let i = 0; i < imageData.data.length; i += 4) imageData.data[i+1] = value; break;
			// 		case Channel.B: for (let i = 0; i < imageData.data.length; i += 4) imageData.data[i+2] = value;	break;
			// 	}
			// 	ctx.putImageData(imageData, 0, 0);
			// }
			//
			// const R = $('#R').off('input').on('input', (e) => { changeChannel(Channel.R, Number($(e.currentTarget).val())); $(e.currentTarget).parent().find('> span').text($(e.currentTarget).val().toString()) })
			// const G = $('#G').off('input').on('input', (e) => { changeChannel(Channel.G, Number($(e.currentTarget).val())); $(e.currentTarget).parent().find('> span').text($(e.currentTarget).val().toString()) })
			// const B = $('#B').off('input').on('input', (e) => { changeChannel(Channel.B, Number($(e.currentTarget).val())); $(e.currentTarget).parent().find('> span').text($(e.currentTarget).val().toString()) })

		};

		if (file) reader.readAsDataURL(file);
	});
});
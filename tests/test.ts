$(() => {
	const canvas: JQuery<HTMLCanvasElement> = $('canvas');
	const ctx: CanvasRenderingContext2D = canvas[0].getContext('2d', { willReadFrequently: true }) as CanvasRenderingContext2D;



	const fileData: JQuery<HTMLInputElement> = $('input');

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

				const imageData: ImageData = ctx.getImageData(0, 0, canvas.width(), canvas.height());

				for (let i = 0; i < imageData.data.length; i += 4)
				{
					const greyVersion = imageData.data[i] + imageData.data[i+1] + imageData.data[i+2];
					imageData.data[i] = greyVersion;
					imageData.data[i+1] = greyVersion + 10;
					imageData.data[i+2] = greyVersion - 100;
				}

				ctx.putImageData(imageData, 0, 0);
			}

		};

		if (file) reader.readAsDataURL(file);
	});
});